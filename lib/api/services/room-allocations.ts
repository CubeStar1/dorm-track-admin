import { User } from './users';
import { Room } from './rooms';
import { Hostel } from './hostels';

export interface RoomAllocation {
  id: string;
  hostel_id: string;
  room_id: string;
  student_id: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  student?: {
    user: User;
  };
  room?: Room;
  hostel?: Hostel;
}

export interface UnassignedStudent {
  user_id: string;
  student_id: string;
  department: string;
  year_of_study: number;
  user: User;
}

export interface AvailableRoom {
  id: string;
  room_number: string;
  block: string;
  floor: number;
  capacity: number;
  current_occupancy: number;
  room_type: string;
  hostel: {
    id: string;
    name: string;
    code: string;
  };
}

class RoomAllocationService {
  async getAllocations(): Promise<RoomAllocation[]> {
    const response = await fetch('/api/room-allocations');
    if (!response.ok) {
      throw new Error('Failed to fetch room allocations');
    }
    return response.json();
  }

  async getUnassignedStudents(): Promise<UnassignedStudent[]> {
    const response = await fetch('/api/room-allocations/unassigned-students');
    if (!response.ok) {
      throw new Error('Failed to fetch unassigned students');
    }
    return response.json();
  }

  async getAvailableRooms(): Promise<AvailableRoom[]> {
    const response = await fetch('/api/room-allocations/available-rooms');
    if (!response.ok) {
      throw new Error('Failed to fetch available rooms');
    }
    return response.json();
  }

  async assignRoom(data: {
    student_id: string;
    room_id: string;
    hostel_id: string;
    start_date: string;
  }): Promise<RoomAllocation> {
    const response = await fetch('/api/room-allocations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to assign room');
    }

    return response.json();
  }

  async autoAssignRooms(): Promise<{ success: boolean; message: string }> {
    const response = await fetch('/api/room-allocations/auto-assign', {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to auto-assign rooms');
    }

    return response.json();
  }

  async updateAllocation(
    id: string,
    data: {
      status: 'active' | 'completed' | 'cancelled';
      end_date?: string;
    }
  ): Promise<RoomAllocation> {
    const response = await fetch(`/api/room-allocations/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update room allocation');
    }

    return response.json();
  }
}

export const roomAllocationService = new RoomAllocationService(); 