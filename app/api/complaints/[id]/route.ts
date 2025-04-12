import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/complaints/[id] - Get a single complaint
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

    // Get the complaint with related data
    const { data: complaint, error } = await supabase
      .from('complaints')
      .select(`
        *,
        student:students(
          student_id,
          user:users(
            full_name,
            email,
            phone
          )
        ),
        hostel:hostels(
          id,
          name,
          code,
          address,
          institution_id
        ),
        room:rooms(
          id,
          room_number,
          block,
          floor,
          room_type
        ),
        assigned_to:users(
          id,
          full_name,
          email,
          phone
        )
      `)
      .eq('id', id)
      .single();

    if (error || !complaint) {
      console.error('Error fetching complaint:', error);
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    // Verify access rights
    if (user.role === 'student' && complaint.student_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    // For non-students, check if they belong to the same institution as the complaint's hostel
    if (user.role !== 'student' && complaint.hostel.institution_id !== user.institution_id) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    return NextResponse.json(complaint);
  } catch (error) {
    console.error('Complaint fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/complaints/[id] - Update a complaint
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

    // Only wardens and admins can update complaints
    if (user.role === 'student') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Get the complaint to verify institution
    const { data: complaint } = await supabase
      .from('complaints')
      .select(`
        *,
        hostel:hostels(
          institution_id
        )
      `)
      .eq('id', id)
      .single();

    if (!complaint || complaint.hostel.institution_id !== user.institution_id) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    // Update the complaint
    const { data: updatedComplaint, error } = await supabase
      .from('complaints')
      .update({
        status: data.status,
        resolution_notes: data.resolution_notes,
        assigned_to: data.assigned_to || session.user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating complaint:', error);
      return NextResponse.json(
        { error: 'Failed to update complaint' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedComplaint);
  } catch (error) {
    console.error('Complaint update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 