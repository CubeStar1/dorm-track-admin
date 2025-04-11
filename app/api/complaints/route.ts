import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/complaints - Get all complaints
export async function GET(request: Request) {
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

    // Get user's role and institution
    const { data: user } = await supabase
      .from('users')
      .select('role, institution_id')
      .eq('id', session.user.id)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let query = supabase
      .from('complaints')
      .select(`
        *,
        student:students(
          student_id,
          user:users(
            full_name,
            email
          )
        ),
        hostel:hostels(
          id,
          name,
          code,
          institution_id
        ),
        room:rooms(
          id,
          room_number,
          block
        ),
        assigned_to:users(
          id,
          full_name,
          email
        )
      `);

    // Filter based on user role
    if (user.role === 'student') {
      // Students can only see their own complaints
      query = query.eq('student_id', session.user.id);
    } else {
      // Admin and wardens can see complaints from their institution
      // Join with hostels to filter by institution_id
      query = query.eq('hostel.institution_id', user.institution_id);
    }

    const { data: complaints, error } = await query;

    if (error) {
      console.error('Error fetching complaints:', error);
      return NextResponse.json(
        { error: 'Failed to fetch complaints' },
        { status: 500 }
      );
    }

    return NextResponse.json(complaints);
  } catch (error) {
    console.error('Complaints fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/complaints - Create a new complaint
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

    // Get the student's information
    const { data: student } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (!student) {
      return NextResponse.json(
        { error: 'Only students can create complaints' },
        { status: 403 }
      );
    }

    const data = await request.json();

    const { data: complaint, error } = await supabase
      .from('complaints')
      .insert({
        ...data,
        student_id: session.user.id,
        hostel_id: student.hostel_id,
        room_id: student.room_id,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating complaint:', error);
      return NextResponse.json(
        { error: 'Failed to create complaint' },
        { status: 500 }
      );
    }

    return NextResponse.json(complaint);
  } catch (error) {
    console.error('Complaint creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 