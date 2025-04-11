import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/events/[id] - Get a single event
export async function GET(
  request: Request,
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

    // Get user's institution
    const { data: user } = await supabase
      .from('users')
      .select('institution_id')
      .eq('id', session.user.id)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get event with organizer info and registration count
    const { data: event, error } = await supabase
      .from('events')
      .select(`
        *,
        organizer:users(
          id,
          full_name,
          email,
          phone
        ),
        registrations:event_registrations(
          id,
          status,
          created_at,
          updated_at,
          student:students(
            user:users(
              id,
              full_name,
              email,
              phone
            )
          )
        )
      `)
      .eq('id', params.id)
      .eq('institution_id', user.institution_id)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Get registration count using the RPC function
    const { data: registrationCounts, error: countError } = await supabase
      .rpc('get_event_registration_counts', { institution_id: user.institution_id });

    if (countError) {
      console.error('Error fetching registration count:', countError);
      return NextResponse.json(
        { error: 'Failed to fetch registration count' },
        { status: 500 }
      );
    }

    // Transform registrations data to match the expected format
    const transformedRegistrations = event.registrations?.map((reg: any) => ({
      ...reg,
      student: {
        ...reg.student.user,
      }
    })) || [];

    const eventWithCounts = {
      ...event,
      registrations: transformedRegistrations,
      registration_count: registrationCounts?.find((rc: { event_id: string; count: number }) => rc.event_id === event.id)?.count || 0
    };

    return NextResponse.json(eventWithCounts);
  } catch (error) {
    console.error('Event fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/events/[id] - Update an event
export async function PATCH(
  request: Request,
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

    // Get user's role and check if they're the organizer
    const { data: event } = await supabase
      .from('events')
      .select('organizer_id')
      .eq('id', params.id)
      .single();

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Only allow organizer or admin to update
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.role !== 'admin' && event.organizer_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to update this event' },
        { status: 403 }
      );
    }

    const data = await request.json();

    const { data: updatedEvent, error } = await supabase
      .from('events')
      .update(data)
      .eq('id', params.id)
      .select(`
        *,
        organizer:users(
          id,
          full_name,
          email,
          phone
        )
      `)
      .single();

    if (error) {
      console.error('Error updating event:', error);
      return NextResponse.json(
        { error: 'Failed to update event' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Event update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Delete an event
export async function DELETE(
  request: Request,
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

    // Get user's role and check if they're the organizer
    const { data: event } = await supabase
      .from('events')
      .select('organizer_id')
      .eq('id', params.id)
      .single();

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Only allow organizer or admin to delete
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.role !== 'admin' && event.organizer_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this event' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting event:', error);
      return NextResponse.json(
        { error: 'Failed to delete event' },
        { status: 500 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Event deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 