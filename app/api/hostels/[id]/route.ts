import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/hostels/[id] - Get a single hostel
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

    // Get the hostel
    const { data: hostel, error: hostelError } = await supabase
      .from('hostels')
      .select(`
        id,
        name,
        code,
        address,
        city,
        state,
        contact_email,
        contact_phone,
        total_blocks,
        total_rooms,
        institution_id,
        created_at,
        updated_at
      `)
      .eq('id', id)
      .single();

    if (hostelError || !hostel) {
      console.error('Error fetching hostel:', hostelError);
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

    return NextResponse.json(hostel);
  } catch (error) {
    console.error('Hostel fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/hostels/[id] - Update a hostel
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

    // Get the hostel to verify institution
    const { data: hostel } = await supabase
      .from('hostels')
      .select('institution_id')
      .eq('id', id)
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

    const data = await request.json();

    // Update hostel
    const { data: updatedHostel, error: updateError } = await supabase
      .from('hostels')
      .update({
        name: data.name,
        code: data.code,
        address: data.address,
        city: data.city,
        state: data.state,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        total_blocks: data.total_blocks,
        total_rooms: data.total_rooms
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating hostel:', updateError);
      return NextResponse.json(
        { error: 'Failed to update hostel' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedHostel);
  } catch (error) {
    console.error('Hostel update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/hostels/[id] - Delete a hostel
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

    // Get the hostel to verify institution
    const { data: hostel } = await supabase
      .from('hostels')
      .select('institution_id')
      .eq('id', id)
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

    // Delete hostel
    const { error: deleteError } = await supabase
      .from('hostels')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting hostel:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete hostel' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Hostel deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 