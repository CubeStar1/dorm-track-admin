import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updateMaintenanceSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  resolution_notes: z.string().optional(),
  assigned_staff_id: z.string().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    // Fetch the maintenance request with all related data
    let query = supabase
      .from('maintenance_requests')
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
      `)
      .eq('id', params.id)
      .single();

    const { data: request, error } = await query;

    if (error) {
      console.error('Error fetching maintenance request:', error);
      return NextResponse.json(
        { error: 'Maintenance request not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this request
    if (user.role === 'student' && request.student_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to view this request' },
        { status: 403 }
      );
    }

    if (user.role !== 'student' && request.hostel.institution_id !== user.institution_id) {
      return NextResponse.json(
        { error: 'Not authorized to view this request' },
        { status: 403 }
      );
    }

    return NextResponse.json(request);
  } catch (error) {
    console.error('Maintenance request fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    // Validate request body
    const body = await req.json();
    const { status, resolution_notes, assigned_staff_id } = updateMaintenanceSchema.parse(body);

    // Check if request exists and user has access
    const { data: existingRequest } = await supabase
      .from('maintenance_requests')
      .select(`
        *,
        hostel:hostels(institution_id)
      `)
      .eq('id', params.id)
      .single();

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Maintenance request not found' },
        { status: 404 }
      );
    }

    // Check authorization
    if (user.role === 'student') {
      return NextResponse.json(
        { error: 'Students cannot update maintenance requests' },
        { status: 403 }
      );
    }

    if (existingRequest.hostel.institution_id !== user.institution_id) {
      return NextResponse.json(
        { error: 'Not authorized to update this request' },
        { status: 403 }
      );
    }

    // Update the request
    const { data: updatedRequest, error: updateError } = await supabase
      .from('maintenance_requests')
      .update({
        status,
        ...(resolution_notes && { resolution_notes }),
        ...(assigned_staff_id && { assigned_staff_id }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
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
      `)
      .single();

    if (updateError) {
      console.error('Error updating maintenance request:', updateError);
      return NextResponse.json(
        { error: 'Failed to update maintenance request' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 422 }
      );
    }

    console.error('Maintenance request update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 