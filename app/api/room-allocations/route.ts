import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
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

    // Get all room allocations with related data
    const { data: allocations, error: allocationsError } = await supabase
      .from('room_allocations')
      .select(`
        *,
        students (
          user_id,
          users (
            full_name
          )
        ),
        rooms (
          room_number,
          block
        ),
        hostels (
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (allocationsError) {
      return NextResponse.json(
        { error: 'Failed to fetch room allocations' },
        { status: 500 }
      );
    }

    const formattedAllocations = allocations.map(allocation => ({
      id: allocation.id,
      hostel_id: allocation.hostel_id,
      room_id: allocation.room_id,
      student_id: allocation.student_id,
      start_date: allocation.start_date,
      end_date: allocation.end_date,
      status: allocation.status,
      created_at: allocation.created_at,
      updated_at: allocation.updated_at,
      student: {
        user: {
          id: allocation.students?.user_id,
          full_name: allocation.students?.users?.full_name
        }
      },
      room: {
        room_number: allocation.rooms?.room_number,
        block: allocation.rooms?.block
      },
      hostel: {
        name: allocation.hostels?.name
      }
    }));

    return NextResponse.json(formattedAllocations);
  } catch (error) {
    console.error('Error fetching room allocations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch room allocations' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const body = await request.json();

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

    const { student_id, room_id, hostel_id, start_date } = body;

    // Validate required fields
    if (!student_id || !room_id || !hostel_id || !start_date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if student already has an active allocation
    const { data: existingAllocation, error: existingError } = await supabase
      .from('room_allocations')
      .select()
      .eq('student_id', student_id)
      .eq('status', 'active')
      .single();

    if (existingError && existingError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      return NextResponse.json(
        { error: 'Failed to check existing allocation' },
        { status: 500 }
      );
    }

    if (existingAllocation) {
      return NextResponse.json(
        { error: 'Student already has an active room allocation' },
        { status: 400 }
      );
    }

    // Check room capacity and current occupancy
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select(`
        *,
        room_allocations!inner (
          count
        )
      `)
      .eq('id', room_id)
      .eq('room_allocations.status', 'active')
      .single();

    if (roomError) {
      return NextResponse.json(
        { error: 'Failed to check room capacity' },
        { status: 500 }
      );
    }

    if (room.room_allocations.count >= room.capacity) {
      return NextResponse.json(
        { error: 'Room is at full capacity' },
        { status: 400 }
      );
    }

    // Create new allocation
    const { data: allocation, error: createError } = await supabase
      .from('room_allocations')
      .insert({
        student_id,
        room_id,
        hostel_id,
        start_date,
        status: 'active'
      })
      .select()
      .single();

    if (createError) {
      return NextResponse.json(
        { error: 'Failed to create room allocation' },
        { status: 500 }
      );
    }

    // Update student record with room and hostel information
    const { error: updateStudentError } = await supabase
      .from('students')
      .update({
        hostel_id,
        room_id,
        room_number: room.room_number
      })
      .eq('user_id', student_id);

    if (updateStudentError) {
      // If student update fails, rollback the allocation
      await supabase
        .from('room_allocations')
        .delete()
        .eq('id', allocation.id);

      return NextResponse.json(
        { error: 'Failed to update student record' },
        { status: 500 }
      );
    }

    // Update room's current occupancy
    const { error: updateRoomError } = await supabase
      .from('rooms')
      .update({
        current_occupancy: room.current_occupancy + 1,
        status: room.current_occupancy + 1 >= room.capacity ? 'occupied' : 'available'
      })
      .eq('id', room_id);

    if (updateRoomError) {
      // If room update fails, rollback both the allocation and student update
      await supabase
        .from('room_allocations')
        .delete()
        .eq('id', allocation.id);
      
      await supabase
        .from('students')
        .update({
          hostel_id: null,
          room_id: null,
          room_number: null
        })
        .eq('user_id', student_id);

      return NextResponse.json(
        { error: 'Failed to update room occupancy' },
        { status: 500 }
      );
    }

    return NextResponse.json(allocation);
  } catch (error) {
    console.error('Error creating room allocation:', error);
    return NextResponse.json(
      { error: 'Failed to create room allocation' },
      { status: 500 }
    );
  }
} 