import { api } from '../axios';

export interface DashboardStats {
  totalStudents: number;
  totalHostels: number;
  totalRooms: number;
  occupancyRate: number;
  maintenanceStats: {
    pending: number;
    inProgress: number;
    completed: number;
  };
  complaintStats: {
    pending: number;
    investigating: number;
    resolved: number;
    dismissed: number;
  };
  eventStats: {
    upcoming: number;
    ongoing: number;
    completed: number;
  };
  roomTypeDistribution: {
    Single: number;
    Double: number;
    Triple: number;
  };
  messRatings: {
    averageRating: number;
    totalFeedback: number;
    ratingDistribution: Record<number, number>; // 1-5 stars
  };
  maintenanceByType: Record<string, number>;
  complaintsByType: Record<string, number>;
  occupancyTrend: Array<{
    date: string;
    occupancy: number;
  }>;
  eventParticipation: Array<{
    eventId: string;
    title: string;
    registrations: number;
    maxParticipants: number;
  }>;
  maintenanceRequests: Array<{
    id: string;
    issue_type: string;
    description: string;
    priority: string;
    status: string;
    created_at: string;
  }>;
  complaints: Array<{
    id: string;
    complaint_type: string;
    description: string;
    severity: string;
    status: string;
    created_at: string;
  }>;
  rooms: Array<{
    id: string;
    hostel_id: string;
    room_number: string;
    block: string;
    room_type: string;
    capacity: number;
    current_occupancy: number;
    status: string;
  }>;
  events: Array<{
    id: string;
    title: string;
    start_time: string;
    end_time: string;
    location: string;
    registration_count: number;
  }>;
}

export interface HostelStats {
  id: string;
  name: string;
  totalRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  totalStudents: number;
  occupancyRate: number;
  maintenanceRequests: number;
  complaints: number;
  averageMessRating: number;
}

export const analyticsService = {
  getDashboardStats: async (institutionId: string): Promise<DashboardStats> => {
    const response = await api.get(`/admin/analytics/dashboard?institutionId=${institutionId}`);
    return response.data;
  },

  getHostelStats: async (hostelId: string): Promise<HostelStats> => {
    const response = await api.get(`/admin/analytics/hostel/${hostelId}`);
    return response.data;
  },

  getOccupancyTrend: async (institutionId: string, period: 'week' | 'month' | 'year'): Promise<Array<{ date: string; occupancy: number }>> => {
    const response = await api.get(`/admin/analytics/occupancy-trend?institutionId=${institutionId}&period=${period}`);
    return response.data;
  },

  getEventParticipation: async (institutionId: string): Promise<Array<{ eventId: string; title: string; registrations: number; maxParticipants: number }>> => {
    const response = await api.get(`/admin/analytics/event-participation?institutionId=${institutionId}`);
    return response.data;
  },

  getMaintenanceStats: async (institutionId: string): Promise<{ byType: Record<string, number>; byStatus: Record<string, number> }> => {
    const response = await api.get(`/admin/analytics/maintenance?institutionId=${institutionId}`);
    return response.data;
  },

  getComplaintStats: async (institutionId: string): Promise<{ byType: Record<string, number>; byStatus: Record<string, number> }> => {
    const response = await api.get(`/admin/analytics/complaints?institutionId=${institutionId}`);
    return response.data;
  },

  getMessAnalytics: async (institutionId: string): Promise<{ ratings: Record<number, number>; averageByHostel: Array<{ hostelId: string; name: string; rating: number }> }> => {
    const response = await api.get(`/admin/analytics/mess?institutionId=${institutionId}`);
    return response.data;
  }
};

// Helper functions for data calculations
function calculateOccupancyRate(rooms: any[]): number {
  if (rooms.length === 0) return 0;
  const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
  const totalOccupancy = rooms.reduce((sum, room) => sum + room.current_occupancy, 0);
  return (totalOccupancy / totalCapacity) * 100;
}

function calculateOccupancyTrend(rooms: any[]): Array<{ date: string; occupancy: number }> {
  // Implement occupancy trend calculation logic
  return [];
}

function calculateRoomTypeDistribution(rooms: any[]): Record<string, number> {
  const distribution: Record<string, number> = {
    Single: 0,
    Double: 0,
    Triple: 0
  };

  rooms.forEach(room => {
    if (room.room_type in distribution) {
      distribution[room.room_type]++;
    }
  });

  return distribution;
}

function calculateMaintenanceStats(requests: any[]): { pending: number; inProgress: number; completed: number } {
  return {
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length
  };
}

function calculateMaintenanceByType(requests: any[]): Record<string, number> {
  return requests.reduce((acc, request) => {
    acc[request.issue_type] = (acc[request.issue_type] || 0) + 1;
    return acc;
  }, {});
}

function calculateComplaintStats(complaints: any[]): { pending: number; investigating: number; resolved: number; dismissed: number } {
  return {
    pending: complaints.filter(c => c.status === 'pending').length,
    investigating: complaints.filter(c => c.status === 'investigating').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    dismissed: complaints.filter(c => c.status === 'dismissed').length
  };
}

function calculateComplaintsByType(complaints: any[]): Record<string, number> {
  return complaints.reduce((acc, complaint) => {
    acc[complaint.complaint_type] = (acc[complaint.complaint_type] || 0) + 1;
    return acc;
  }, {});
}

function calculateMessRatings(ratings: any[]): { ratingDistribution: Record<string, number>; averageRating: number; totalFeedback: number } {
  const distribution = ratings.reduce((acc, rating) => {
    acc[rating.rating] = (acc[rating.rating] || 0) + 1;
    return acc;
  }, {});

  const totalFeedback = ratings.length;
  const averageRating = totalFeedback > 0
    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / totalFeedback
    : 0;

  return {
    ratingDistribution: distribution,
    averageRating,
    totalFeedback
  };
} 