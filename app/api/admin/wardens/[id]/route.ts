import { createSupabaseServer } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Fetch the warden with all details
    const { data: warden, error } = await supabase
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
      .eq('user_id', id)
      .eq('institution_id', institutionData.institution_id)
      .single();

    if (error) {
      console.error('Error fetching warden:', error);
      return NextResponse.json({ error: 'Failed to fetch warden' }, { status: 500 });
    }

    if (!warden) {
      return NextResponse.json({ error: 'Warden not found' }, { status: 404 });
    }

    return NextResponse.json(warden);
  } catch (error) {
    console.error('Error in warden route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }

) {
  try {
    const {id} = await params;

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

    // Update user information if provided
    if (body.user) {
      const { error: userError } = await supabase
        .from('users')
        .update({
          full_name: body.user.full_name,
          email: body.user.email,
          phone: body.user.phone,
          gender: body.user.gender
        })
        .eq('id', id);

      if (userError) {
        console.error('Error updating user:', userError);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
      }
    }

    // Update warden information if provided
    if (body.employee_id || body.hostel_id || body.assigned_blocks) {
      const { error: wardenError } = await supabase
        .from('wardens')
        .update({
          employee_id: body.employee_id,
          hostel_id: body.hostel_id,
          assigned_blocks: body.assigned_blocks
        })
        .eq('user_id', id)
        .eq('institution_id', institutionData.institution_id);

      if (wardenError) {
        console.error('Error updating warden:', wardenError);
        return NextResponse.json({ error: 'Failed to update warden' }, { status: 500 });
      }
    }

    // Fetch the updated warden with all details
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
      .eq('user_id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching updated warden:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch updated warden' }, { status: 500 });
    }

    return NextResponse.json(warden);
  } catch (error) {
    console.error('Error in warden route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Delete the warden profile
    const { error: wardenError } = await supabase
      .from('wardens')
      .delete()
      .eq('user_id', id)
      .eq('institution_id', institutionData.institution_id);

    if (wardenError) {
      console.error('Error deleting warden:', wardenError);
      return NextResponse.json({ error: 'Failed to delete warden' }, { status: 500 });
    }

    // Delete the user profile
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (userError) {
      console.error('Error deleting user:', userError);
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }

    // Delete the auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    if (authError) {
      console.error('Error deleting auth user:', authError);
      return NextResponse.json({ error: 'Failed to delete auth user' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Warden deleted successfully' });
  } catch (error) {
    console.error('Error in warden route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 