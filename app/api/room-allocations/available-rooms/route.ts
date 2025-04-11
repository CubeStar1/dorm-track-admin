import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface Hostel {
  id: string;
  name: string;
  code: string;
}

interface Room {
  id: string;
  room_number: string;
  block: string;
  floor: number;
  capacity: number;
  room_type: string;
  current_occupancy: number;
  hostels?: Hostel;
}

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

    // First get user's role and institution
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, institution_id')
      .eq('id', user.id)
      .single();

    if (userError) {
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    // Get all rooms with their details and current occupancy from user's institution
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select(`
        *,
        hostels!inner (
          id,
          name,
          code,
          institution_id
        )
      `)
      .eq('hostels.institution_id', userData.institution_id)
      .order('block')
      .order('room_number');

    if (roomsError) {
      console.error('Error fetching rooms:', roomsError);
      return NextResponse.json(
        { error: 'Failed to fetch rooms' },
        { status: 500 }
      );
    }

    if (!rooms) {
      return NextResponse.json([]);
    }

    // Get current occupancy counts
    const { data: occupancyCounts, error: countError } = await supabase
      .from('room_allocations')
      .select('room_id')
      .eq('status', 'active');

    if (countError) {
      console.error('Error fetching occupancy counts:', countError);
      return NextResponse.json(
        { error: 'Failed to fetch room occupancy' },
        { status: 500 }
      );
    }

    // Create occupancy map
    const occupancyMap = new Map();
    occupancyCounts?.forEach(allocation => {
      const count = occupancyMap.get(allocation.room_id) || 0;
      occupancyMap.set(allocation.room_id, count + 1);
    });

    // Format and filter rooms
    const formattedRooms = rooms
      .map(room => ({
        id: room.id,
        room_number: room.room_number,
        block: room.block,
        floor: room.floor,
        capacity: room.capacity,
        current_occupancy: occupancyMap.get(room.id) || 0,
        room_type: room.room_type,
        hostel: room.hostels ? {
          id: room.hostels.id,
          name: room.hostels.name,
          code: room.hostels.code
        } : undefined
      }))
      .filter(room => room.current_occupancy < room.capacity);

    return NextResponse.json(formattedRooms);
  } catch (error) {
    console.error('Error fetching available rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available rooms' },
      { status: 500 }
    );
  }
} 