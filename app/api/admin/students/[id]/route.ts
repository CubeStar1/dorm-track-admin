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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: admin } = await supabase
      .from('institution_admins')
      .select('institution_id')
      .eq('user_id', user.id)
      .single();

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch comprehensive student data
    const { data: student, error } = await supabase
      .from('students')
      .select(`
        *,
        user:users!inner (
          full_name,
          email,
          phone,
          gender,
          role,
          created_at
        ),
        hostel:hostels!left (
          id,
          name,
          code,
          address,
          city,
          state,
          contact_email,
          contact_phone,
          total_blocks,
          total_rooms
        ),
        room:rooms!left (
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
          images,
          description
        ),
        room_allocations (
          id,
          start_date,
          end_date,
          status,
          room:rooms (
            id,
            room_number,
            block,
            floor,
            room_type
          )
        ),
        maintenance_requests (
          id,
          issue_type,
          description,
          priority,
          status,
          created_at,
          updated_at,
          room:rooms (
            room_number,
            block
          )
        ),
        complaints (
          id,
          complaint_type,
          description,
          severity,
          status,
          is_anonymous,
          resolution_notes,
          created_at,
          updated_at,
          room:rooms (
            room_number,
            block
          )
        )
      `)
      .eq('user_id', id)
      .eq('institution_id', admin.institution_id)
      .single();

    if (error) {
      console.error('Error fetching student:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Transform the data to include id for frontend compatibility
    const transformedStudent = {
      ...student,
      id: student.user_id,
      user: {
        ...student.user,
        id: student.user_id
      }
    };

    return NextResponse.json(transformedStudent);
  } catch (error) {
    console.error('Error in GET /api/admin/students/[id]:', error);
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

    const { data: admin } = await supabase
      .from('institution_admins')
      .select('institution_id')
      .eq('user_id', user.id)
      .single();

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update student information
    const { error: updateError } = await supabase
      .from('students')
      .update({
        department: body.department,
        year_of_study: body.year_of_study,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', id)
      .eq('institution_id', admin.institution_id);

    if (updateError) {
      console.error('Error updating student:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Update user information
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({
        full_name: body.full_name,
        phone: body.phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (userUpdateError) {
      console.error('Error updating user:', userUpdateError);
      return NextResponse.json({ error: userUpdateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error in PATCH /api/admin/students/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 