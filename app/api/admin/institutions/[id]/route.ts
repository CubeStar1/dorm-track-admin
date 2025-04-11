import { createSupabaseServer } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServer();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user's role and institution
    const { data: userData } = await supabase
      .from('users')
      .select('role, institution_id')
      .eq('id', user.id)
      .single();

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If user is an institution admin, they can only view their own institution
    if (userData.role === 'institution_admin' && userData.institution_id !== params.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get the institution
    const { data: institution, error } = await supabase
      .from('institutions')
      .select(`
        *,
        hostels:hostels(
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
          rooms:rooms(
            id,
            room_number,
            floor,
            capacity,
            current_occupancy,
            room_type,
            block,
            amenities,
            status,
            price,
            description
          ),
          wardens:wardens(
            user_id,
            employee_id,
            assigned_blocks,
            user:users(
              id,
              full_name,
              email,
              phone,
              gender
            )
          )
        ),
        students:students(
          user_id,
          student_id,
          department,
          year_of_study,
          room:rooms(
            id,
            room_number,
            hostel:hostels(
              id,
              name
            )
          ),
          user:users(
            id,
            full_name,
            email,
            phone,
            gender
          )
        )
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Institution not found' , detail: error},
        { status: 404 }
      );
    }

    return NextResponse.json(institution);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServer();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user's role and institution
    const { data: userData } = await supabase
      .from('users')
      .select('role, institution_id')
      .eq('id', user.id)
      .single();

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If user is an institution admin, they can only update their own institution
    if (userData.role === 'institution_admin' && userData.institution_id !== params.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Update the institution
    const { error } = await supabase
      .from('institutions')
      .update(body)
      .eq('id', params.id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update institution' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}