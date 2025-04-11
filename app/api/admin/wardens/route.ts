import { createSupabaseServer } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createSupabaseServer();

    // Get the current user's institution ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: institutionData } = await supabase
      .from('users')
      .select('institution_id')
      .eq('id', user.id)
      .single();

    if (!institutionData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch wardens with their user details and hostel information
    const { data: wardens, error } = await supabase
      .from('wardens')
      .select(`
        *,
        user:users(
          id,
          full_name,
          email,
          phone,
          gender,
          role
        ),
        hostel:hostels(
          id,
          name,
          code,
          address,
          city,
          state,
          contact_phone,
          contact_email,
          total_blocks,
          total_rooms
        )
      `)
      .eq('institution_id', institutionData.institution_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching wardens:', error);
      return NextResponse.json({ error: 'Failed to fetch wardens' }, { status: 500 });
    }

    return NextResponse.json(wardens);
  } catch (error) {
    console.error('Error in wardens route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const body = await request.json();

    // Get the current user's institution ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: institutionData } = await supabase
      .from('users')
      .select('institution_id')
      .eq('id', user.id)
      .single();

    if (!institutionData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // First create the user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: body.user.email,
      email_confirm: true,
      user_metadata: {
        full_name: body.user.full_name,
        role: 'warden'
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    // Then create the user profile
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        full_name: body.user.full_name,
        email: body.user.email,
        phone: body.user.phone,
        gender: body.user.gender,
        role: 'warden',
        institution_id: institutionData.institution_id
      });

    if (userError) {
      console.error('Error creating user profile:', userError);
      return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 });
    }

    // Finally create the warden profile
    const { error: wardenError } = await supabase
      .from('wardens')
      .insert({
        user_id: authData.user.id,
        employee_id: body.employee_id,
        hostel_id: body.hostel_id,
        assigned_blocks: body.assigned_blocks,
        institution_id: institutionData.institution_id
      });

    if (wardenError) {
      console.error('Error creating warden profile:', wardenError);
      return NextResponse.json({ error: 'Failed to create warden profile' }, { status: 500 });
    }

    // Fetch the created warden with all details
    const { data: warden, error: fetchError } = await supabase
      .from('wardens')
      .select(`
        *,
        user:users(
          id,
          full_name,
          email,
          phone,
          gender,
          role
        ),
        hostel:hostels(
          id,
          name,
          code,
          address,
          city,
          state,
          contact_phone,
          contact_email,
          total_blocks,
          total_rooms
        )
      `)
      .eq('user_id', authData.user.id)
      .single();

    if (fetchError) {
      console.error('Error fetching created warden:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch created warden' }, { status: 500 });
    }

    return NextResponse.json(warden);
  } catch (error) {
    console.error('Error in wardens route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 