import { createSupabaseServer } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createSupabaseServer();

    // Get the current user's institution ID
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user's institution ID
    const { data: userData } = await supabase
      .from('users')
      .select('institution_id')
      .eq('id', user.id)
      .single();

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all students in the institution with their user and room details
    const { data: students, error } = await supabase
      .from('students')
      .select(`
        user_id,
        student_id,
        department,
        year_of_study,
        institution_id,
        created_at,
        updated_at,
        user:users!students_user_id_fkey (
          id,
          full_name,
          email,
          phone,
          gender
        ),
        hostel:hostels (
          id,
          name
        ),
        room:rooms (
          id,
          room_number,
          block,
          floor,
          capacity,
          room_type
        )
      `)
      .eq('institution_id', userData.institution_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching students:', error);
      return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
    }

    // Transform the data to match the expected format
    const transformedStudents = students.map(student => ({
      id: student.user_id,
      ...student
    }));

    return NextResponse.json(transformedStudents);
  } catch (error) {
    console.error('Error in GET /api/admin/students:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 