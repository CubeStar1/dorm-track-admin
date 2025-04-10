import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/rooms - Get all rooms for a hostel
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hostelId = searchParams.get('hostelId');
    const block = searchParams.get('block');
    const floor = searchParams.get('floor');
    const roomType = searchParams.get('roomType');
    const status = searchParams.get('status');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    if (!hostelId) {
      return NextResponse.json(
        { error: 'Hostel ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServer();

    // Verify authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get the hostel to verify institution
    const { data: hostel } = await supabase
      .from('hostels')
      .select('institution_id')
      .eq('id', hostelId)
      .single();

    if (!hostel) {
      return NextResponse.json(
        { error: 'Hostel not found' },
        { status: 404 }
      );
    }

    // Verify user is an admin of the institution
    const { data: admin } = await supabase
      .from('institution_admins')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('institution_id', hostel.institution_id)
      .single();

    if (!admin) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    // Build query
    let query = supabase
      .from('rooms')
      .select(`
        id,
        hostel_id,
        room_number,
        floor,
        capacity,
        current_occupancy,
        room_type,
        block,
        amenities,
        status,
        price,
        images,
        description,
        created_at,
        updated_at
      `)
      .eq('hostel_id', hostelId);

    // Apply filters
    if (block) query = query.eq('block', block);
    if (floor) query = query.eq('floor', parseInt(floor));
    if (roomType) query = query.eq('room_type', roomType);
    if (status) query = query.eq('status', status);
    if (minPrice) query = query.gte('price', parseInt(minPrice));
    if (maxPrice) query = query.lte('price', parseInt(maxPrice));

    // Execute query
    const { data: rooms, error: roomsError } = await query.order('room_number');

    if (roomsError) {
      console.error('Error fetching rooms:', roomsError);
      return NextResponse.json(
        { error: 'Failed to fetch rooms' },
        { status: 500 }
      );
    }

    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Rooms fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/rooms - Create a new room
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();

    // Verify authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Get the hostel to verify institution
    const { data: hostel } = await supabase
      .from('hostels')
      .select('institution_id')
      .eq('id', data.hostelId)
      .single();

    if (!hostel) {
      return NextResponse.json(
        { error: 'Hostel not found' },
        { status: 404 }
      );
    }

    // Verify user is an admin of the institution
    const { data: admin } = await supabase
      .from('institution_admins')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('institution_id', hostel.institution_id)
      .single();

    if (!admin) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    // Create room
    const { data: room, error: createError } = await supabase
      .from('rooms')
      .insert({
        hostel_id: data.hostelId,
        room_number: data.roomNumber,
        floor: data.floor,
        capacity: data.capacity,
        current_occupancy: 0,
        room_type: data.roomType,
        block: data.block,
        amenities: data.amenities || [],
        status: data.status || 'available',
        price: data.price,
        images: data.images || [],
        description: data.description || 'Spacious and well-ventilated room with modern amenities.'
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating room:', createError);
      return NextResponse.json(
        { error: 'Failed to create room' },
        { status: 500 }
      );
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error('Room creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 