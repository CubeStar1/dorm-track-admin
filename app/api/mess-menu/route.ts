import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { MessMenu, CreateMessMenuInput, UpdateMessMenuInput } from '@/lib/api/services/mess-menu';

async function checkInstitutionAdmin(supabase: any, userId: string, hostelId: string) {
  // Get the hostel's institution
  const { data: hostel } = await supabase
    .from('hostels')
    .select('institution_id')
    .eq('id', hostelId)
    .single();

  if (!hostel) return false;

  // Check if user is an admin of that institution
  const { data: admin } = await supabase
    .from('institution_admins')
    .select('*')
    .eq('user_id', userId)
    .eq('institution_id', hostel.institution_id)
    .single();

  return !!admin;
}

// GET /api/mess-menu - Get mess menu for a hostel
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hostelId = searchParams.get('hostelId');

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

    // Fetch mess menu items
    const { data, error } = await supabase
      .from('mess_menu')
      .select('*')
      .eq('hostel_id', hostelId)
      .order('day_of_week')
      .order('meal_type');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch mess menu' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Mess menu fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/mess-menu - Create a new mess menu item
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

    const data = await request.json() as CreateMessMenuInput;

    if (!data.hostel_id) {
      return NextResponse.json(
        { error: 'Hostel ID is required' },
        { status: 400 }
      );
    }

    // Verify user is an institution admin
    const isAdmin = await checkInstitutionAdmin(supabase, session.user.id, data.hostel_id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    // Create mess menu item
    const { data: menuItem, error } = await supabase
      .from('mess_menu')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create mess menu item' },
        { status: 500 }
      );
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Mess menu creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/mess-menu - Update a mess menu item
export async function PUT(request: Request) {
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

    const data = await request.json() as UpdateMessMenuInput;

    if (!data.hostel_id) {
      return NextResponse.json(
        { error: 'Hostel ID is required' },
        { status: 400 }
      );
    }

    // Verify user is an institution admin
    const isAdmin = await checkInstitutionAdmin(supabase, session.user.id, data.hostel_id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    // Update mess menu item
    const { data: menuItem, error } = await supabase
      .from('mess_menu')
      .update({
        day_of_week: data.day_of_week,
        meal_type: data.meal_type,
        items: data.items,
      })
      .eq('id', data.id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update mess menu item' },
        { status: 500 }
      );
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Mess menu update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/mess-menu - Delete a mess menu item
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const hostelId = searchParams.get('hostelId');

    if (!id || !hostelId) {
      return NextResponse.json(
        { error: 'Menu item ID and hostel ID are required' },
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

    // Verify user is an institution admin
    const isAdmin = await checkInstitutionAdmin(supabase, session.user.id, hostelId);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    // Delete mess menu item
    const { error } = await supabase
      .from('mess_menu')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to delete mess menu item' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mess menu deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 