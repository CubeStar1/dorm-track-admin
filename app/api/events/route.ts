import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/events - Get all events
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

    // Get events with registration counts
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        organizer:users(
          id,
          full_name,
          email,
          phone
        )
      `)
      .eq('institution_id', user.institution_id);

    if (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: 500 }
      );
    }

    // Get registration counts for all events
    const { data: registrationCounts, error: countError } = await supabase
      .rpc('get_event_registration_counts', { institution_id: user.institution_id });

    if (countError) {
      console.error('Error fetching registration counts:', countError);
      return NextResponse.json(
        { error: 'Failed to fetch registration counts' },
        { status: 500 }
      );
    }

    // Combine events with their registration counts
    const eventsWithCounts = events.map(event => ({
      ...event,
      registration_count: registrationCounts?.find((rc: { event_id: string; count: number }) => rc.event_id === event.id)?.count || 0
    }));

    return NextResponse.json(eventsWithCounts);
  } catch (error) {
    console.error('Events fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event
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

    // Only admin and wardens can create events
    if (!['admin', 'warden'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized to create events' },
        { status: 403 }
      );
    }

    const data = await request.json();

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        ...data,
        organizer_id: session.user.id,
        institution_id: user.institution_id,
        status: 'upcoming'
      })
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
      console.error('Error creating event:', error);
      return NextResponse.json(
        { error: 'Failed to create event' },
        { status: 500 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Event creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 