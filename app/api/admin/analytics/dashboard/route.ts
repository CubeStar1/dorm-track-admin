import { createSupabaseServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const institutionId = searchParams.get('institutionId');

    if (!institutionId) {
      return NextResponse.json(
        { error: 'Institution ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServer();

    // Verify authentication and admin status
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if user is an admin of the institution
    const { data: admin } = await supabase
      .from('institution_admins')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('institution_id', institutionId)
      .single();

    if (!admin) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    // Get total students
    const { count: totalStudents } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('institution_id', institutionId);

    // Get total hostels
    const { count: totalHostels } = await supabase
      .from('hostels')
      .select('*', { count: 'exact', head: true })
      .eq('institution_id', institutionId);

    // Get room statistics
    const { data: rooms } = await supabase
      .from('rooms')
      .select('*, hostels!inner(*)')
      .eq('hostels.institution_id', institutionId);

    const totalRooms = rooms?.length || 0;
    const occupiedRooms = rooms?.filter(r => r.status === 'occupied').length || 0;
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

    // Get room type distribution
    const roomTypeDistribution = {
      Single: rooms?.filter(r => r.room_type === 'Single').length || 0,
      Double: rooms?.filter(r => r.room_type === 'Double').length || 0,
      Triple: rooms?.filter(r => r.room_type === 'Triple').length || 0,
    };

    // Get maintenance request statistics
    const { data: maintenanceRequests } = await supabase
      .from('maintenance_requests')
      .select('status, issue_type, hostels!inner(*)')
      .eq('hostels.institution_id', institutionId);

    const maintenanceStats = {
      pending: maintenanceRequests?.filter(r => r.status === 'pending').length || 0,
      inProgress: maintenanceRequests?.filter(r => r.status === 'in_progress').length || 0,
      completed: maintenanceRequests?.filter(r => r.status === 'completed').length || 0,
    };

    const maintenanceByType = maintenanceRequests?.reduce((acc, curr) => {
      acc[curr.issue_type] = (acc[curr.issue_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Get complaint statistics
    const { data: complaints } = await supabase
      .from('complaints')
      .select('status, complaint_type, hostels!inner(*)')
      .eq('hostels.institution_id', institutionId);

    const complaintStats = {
      pending: complaints?.filter(c => c.status === 'pending').length || 0,
      investigating: complaints?.filter(c => c.status === 'investigating').length || 0,
      resolved: complaints?.filter(c => c.status === 'resolved').length || 0,
      dismissed: complaints?.filter(c => c.status === 'dismissed').length || 0,
    };

    const complaintsByType = complaints?.reduce((acc, curr) => {
      acc[curr.complaint_type] = (acc[curr.complaint_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Get event statistics
    const { data: events } = await supabase
      .from('events')
      .select('status')
      .eq('institution_id', institutionId);

    const eventStats = {
      upcoming: events?.filter(e => e.status === 'upcoming').length || 0,
      ongoing: events?.filter(e => e.status === 'ongoing').length || 0,
      completed: events?.filter(e => e.status === 'completed').length || 0,
    };

    // Get mess ratings
    const { data: messRatings } = await supabase
      .from('mess_feedback')
      .select('rating, hostels!inner(*)')
      .eq('hostels.institution_id', institutionId);

    const ratingDistribution = messRatings?.reduce((acc, curr) => {
      acc[curr.rating] = (acc[curr.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>) || {};

    const totalRatings = messRatings?.length || 0;
    const averageRating = totalRatings > 0
      ? messRatings!.reduce((sum, curr) => sum + curr.rating, 0) / totalRatings
      : 0;

    // Get occupancy trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: allocations } = await supabase
      .from('room_allocations')
      .select('start_date, hostels!inner(*)')
      .eq('hostels.institution_id', institutionId)
      .gte('start_date', thirtyDaysAgo.toISOString())
      .order('start_date');

    const occupancyTrend = allocations?.reduce((acc, curr) => {
      const date = curr.start_date.split('T')[0];
      const existingEntry = acc.find(e => e.date === date);
      if (existingEntry) {
        existingEntry.occupancy++;
      } else {
        acc.push({ date, occupancy: 1 });
      }
      return acc;
    }, [] as Array<{ date: string; occupancy: number }>) || [];

    // Get event participation
    const { data: eventParticipation } = await supabase
      .from('events')
      .select('id, title, max_participants, event_registrations(count)')
      .eq('institution_id', institutionId)
      .eq('event_registrations.status', 'registered');

    const formattedEventParticipation = eventParticipation?.map(event => ({
      eventId: event.id,
      title: event.title,
      registrations: event.event_registrations[0].count,
      maxParticipants: event.max_participants,
    })) || [];

    return NextResponse.json({
      totalStudents,
      totalHostels,
      totalRooms,
      occupancyRate,
      maintenanceStats,
      complaintStats,
      eventStats,
      roomTypeDistribution,
      messRatings: {
        averageRating,
        totalFeedback: totalRatings,
        ratingDistribution,
      },
      maintenanceByType,
      complaintsByType,
      occupancyTrend,
      eventParticipation: formattedEventParticipation,
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard analytics' },
      { status: 500 }
    );
  }
} 