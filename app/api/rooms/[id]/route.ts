import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Room, RoomAllocation } from '@/lib/api/services/rooms';

// GET /api/rooms/[id] - Get a single room
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServer();

    // Verify authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get the room and its hostel
    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .select(`
        *,
        hostel:hostels!inner (*),
        allocations:room_allocations(
          id,
          start_date,
          end_date,
          status,
          student:students(
            user_id,
            student_id,
            user:users(
              full_name,
              email,
              phone
            )
          )
        )
      `)
      .eq('id', id)
      .single();

    if (roomError || !roomData) {
      console.error('Error fetching room:', roomError);
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Get maintenance requests for this room
    const { data: maintenanceRequests } = await supabase
      .from('maintenance_requests')
      .select(`
        id,
        issue_type,
        description,
        priority,
        status,
        created_at,
        student:students(
          student_id,
          user:users(
            full_name,
            email
          )
        ),
        assigned_to:users(
          id,
          full_name,
          email
        )
      `)
      .eq('room_id', id);

    // Get complaints for this room
    const { data: complaints } = await supabase
      .from('complaints')
      .select(`
        id,
        complaint_type,
        description,
        severity,
        status,
        is_anonymous,
        created_at,
        resolution_notes,
        student:students(
          student_id,
          user:users(
            full_name,
            email
          )
        ),
        assigned_to:users(
          id,
          full_name,
          email
        )
      `)
      .eq('room_id', id);

    // Verify user is an admin of the institution
    const { data: admin } = await supabase
      .from('institution_admins')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('institution_id', roomData.hostel.institution_id)
      .single();

    if (!admin) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    // Ensure allocations is always an array and filter active allocations
    const room: Room = {
      ...roomData,
      allocations: (roomData.allocations || [])
        .filter((allocation: RoomAllocation) => 
          allocation.status === 'active' && 
          (!allocation.end_date || new Date(allocation.end_date) > new Date())
        ),
      maintenance_requests: maintenanceRequests || [],
      complaints: complaints || []
    };

    return NextResponse.json(room);
  } catch (error) {
    console.error('Room fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

interface RoomWithHostel {
  hostel_id: string;
  hostel: {
    institution_id: string;
  };
}

// PATCH /api/rooms/[id] - Update a room
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServer();

    // Verify authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get the room and its hostel to verify institution
    const { data: room } = await supabase
      .from('rooms')
      .select(`
        *,
        hostel:hostels!inner (*)
      `)
      .eq('id', id)
      .single() as { data: Room | null, error: any };

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Verify user is an admin of the institution
    const { data: admin } = await supabase
      .from('institution_admins')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('institution_id', room.hostel.institution_id)
      .single();

    if (!admin) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Update room
    const { data: updatedRoom, error: updateError } = await supabase
      .from('rooms')
      .update({
        room_number: data.roomNumber,
        floor: data.floor,
        capacity: data.capacity,
        room_type: data.roomType,
        block: data.block,
        amenities: data.amenities,
        status: data.status,
        price: data.price,
        images: data.images,
        description: data.description
      })
      .eq('id', id)
      .select()
      .single() as { data: Room | null, error: any };

    if (updateError) {
      console.error('Error updating room:', updateError);
      return NextResponse.json(
        { error: 'Failed to update room' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error('Room update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/rooms/[id] - Delete a room
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServer();

    // Verify authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get the room and its hostel to verify institution
    const { data: room } = await supabase
      .from('rooms')
      .select(`
        *,
        hostel:hostels!inner (*)
      `)
      .eq('id', id)
      .single() as { data: Room | null, error: any };

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Verify user is an admin of the institution
    const { data: admin } = await supabase
      .from('institution_admins')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('institution_id', room.hostel.institution_id)
      .single();

    if (!admin) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    // Delete room
    const { error: deleteError } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting room:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete room' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Room deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 