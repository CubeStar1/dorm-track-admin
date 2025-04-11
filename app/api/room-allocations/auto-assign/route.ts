import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createSupabaseServer();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's institution
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('institution_id')
      .eq('id', user.id)
      .single();

    if (userError) {
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    // Get unassigned students from the same institution
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select(`
        user_id,
        student_id
      `)
      .eq('institution_id', userData.institution_id)
      .is('hostel_id', null)
      .is('room_id', null)
      .order('student_id');

    if (studentsError) {
      return NextResponse.json(
        { error: 'Failed to fetch unassigned students' },
        { status: 500 }
      );
    }

    if (!students?.length) {
      return NextResponse.json({
        message: 'No unassigned students found'
      }, { status: 200 });
    }

    // Get available rooms
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select(`
        id,
        hostel_id,
        room_number,
        capacity,
        current_occupancy,
        hostels!inner (
          id,
          institution_id
        )
      `)
      .eq('status', 'available')
      .eq('hostels.institution_id', userData.institution_id)
      .order('current_occupancy');

    if (roomsError) {
      return NextResponse.json(
        { error: 'Failed to fetch available rooms', roomsError },
        { status: 500 }
      );
    }

    // Filter rooms with available capacity
    const availableRooms = rooms?.filter(room => room.current_occupancy < room.capacity) || [];

    if (!availableRooms.length) {
      return NextResponse.json({
        message: 'No available rooms found'
      }, { status: 200 });
    }

    let assignmentCount = 0;

    // Assign rooms to students
    for (const student of students) {
      // Find first available room
      const room = availableRooms.find(r => r.current_occupancy < r.capacity);
      if (!room) break;

      try {
        // Create room allocation
        const { error: allocationError } = await supabase
          .from('room_allocations')
          .insert({
            student_id: student.user_id,
            room_id: room.id,
            hostel_id: room.hostel_id,
            start_date: new Date().toISOString(),
            status: 'active'
          });

        if (allocationError) {
          console.error('Error creating allocation:', allocationError);
          continue;
        }

        // Update student record
        const { error: studentError } = await supabase
          .from('students')
          .update({
            hostel_id: room.hostel_id,
            room_id: room.id,
            room_number: room.room_number
          })
          .eq('user_id', student.user_id);

        if (studentError) {
          console.error('Error updating student:', studentError);
          // Rollback allocation
          await supabase
            .from('room_allocations')
            .delete()
            .eq('student_id', student.user_id)
            .eq('room_id', room.id);
          continue;
        }

        // Update room occupancy
        const { error: roomError } = await supabase
          .from('rooms')
          .update({
            current_occupancy: room.current_occupancy + 1,
            status: room.current_occupancy + 1 >= room.capacity ? 'occupied' : 'available'
          })
          .eq('id', room.id);

        if (roomError) {
          console.error('Error updating room:', roomError);
          // Rollback allocation and student update
          await supabase
            .from('room_allocations')
            .delete()
            .eq('student_id', student.user_id)
            .eq('room_id', room.id);

          await supabase
            .from('students')
            .update({
              hostel_id: null,
              room_id: null,
              room_number: null
            })
            .eq('user_id', student.user_id);
          continue;
        }

        // Update our local room data
        room.current_occupancy += 1;
        assignmentCount++;

      } catch (error) {
        console.error('Error in assignment process:', error);
        continue;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully assigned ${assignmentCount} students to rooms`
    });

  } catch (error) {
    console.error('Error in auto-assigning rooms:', error);
    return NextResponse.json(
      { error: 'Failed to auto-assign rooms' },
      { status: 500 }
    );
  }
} 