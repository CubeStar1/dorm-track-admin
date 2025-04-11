import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface DatabaseUser {
  full_name: string;
  email: string;
}

interface DatabaseStudent {
  user_id: string;
  student_id: string;
  department: string;
  year_of_study: number;
  users: DatabaseUser;
}

interface FormattedStudent {
  user_id: string;
  student_id: string;
  department: string;
  year_of_study: number;
  user: {
    full_name: string;
    email: string;
  };
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

    // First get the active allocations
    const { data: activeAllocations } = await supabase
      .from('room_allocations')
      .select('student_id')
      .eq('status', 'active');

    const activeStudentIds = activeAllocations?.map(allocation => allocation.student_id) || [];

    // Then get unassigned students from the same institution
    const { data, error: studentsError } = await supabase
      .from('students')
      .select(`
        user_id,
        student_id,
        department,
        year_of_study,
        users (
          full_name,
          email
        )
      `)
      .eq('institution_id', userData.institution_id)
      .is('hostel_id', null)
      .is('room_id', null)
      .order('student_id', { ascending: true });

    if (studentsError) {
      console.error('Error fetching unassigned students:', studentsError);
      return NextResponse.json(
        { error: 'Failed to fetch unassigned students' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json([]);
    }

    const unassignedStudents = data as unknown as DatabaseStudent[];

    const formattedStudents: FormattedStudent[] = unassignedStudents.map(student => ({
      user_id: student.user_id,
      student_id: student.student_id,
      department: student.department,
      year_of_study: student.year_of_study,
      user: {
        full_name: student.users?.full_name || '',
        email: student.users?.email || ''
      }
    }));

    return NextResponse.json(formattedStudents);
  } catch (error) {
    console.error('Error fetching unassigned students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unassigned students' },
      { status: 500 }
    );
  }
} 