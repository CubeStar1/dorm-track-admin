import { AxiosResponse } from 'axios';
import { api } from '../axios';

export interface Hostel {
  id: string;
  name: string;
  code: string;
  institution_id: string;
  address: string;
  city: string;
  state: string;
  contact_email: string;
  contact_phone: string;
  total_blocks: number;
  total_rooms: number;
}

export interface Room {
  id: string;
  hostel_id: string;
  hostel: Hostel;
  room_number: string;
  block: string;
  floor: number;
  capacity: number;
  current_occupancy: number;
  room_type: string;
  amenities: string[];
  status: 'available' | 'occupied' | 'maintenance';
  price: number;
  description: string;
  images: string[];
  allocations?: RoomAllocation[];
  maintenance_requests?: MaintenanceRequest[];
  complaints?: Complaint[];
  created_at: string;
  updated_at: string;
}

export interface RoomAllocation {
  id: string;
  student: {
    user_id: string;
    student_id: string;
    user: {
      full_name: string;
      email: string;
      phone: string | null;
    };
  };
  start_date: string;
  end_date: string | null;
  status: 'active' | 'completed' | 'cancelled';
}

export interface RoomFilters {
  block?: string;
  floor?: number;
  roomType?: Room['room_type'];
  amenities?: string[];
  status?: Room['status'];
  hostelId?: string;
  institutionId?: string;
}

export interface MaintenanceRequest {
  id: string;
  issue_type: string;
  description: string;
  priority: string;
  status: string;
  created_at: string;
  student: {
    student_id: string;
    user: {
      full_name: string;
      email: string;
    };
  };
  assigned_to?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface Complaint {
  id: string;
  complaint_type: string;
  description: string;
  severity: string;
  status: string;
  is_anonymous: boolean;
  created_at: string;
  resolution_notes?: string;
  student: {
    student_id: string;
    user: {
      full_name: string;
      email: string;
    };
  };
  assigned_to?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export const roomService = {
  async getRooms(filters?: RoomFilters): Promise<Room[]> {
    const params = new URLSearchParams();
    
    if (filters?.block) params.append('block', filters.block);
    if (filters?.floor) params.append('floor', filters.floor.toString());
    if (filters?.roomType) params.append('roomType', filters.roomType);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.amenities?.length) params.append('amenities', filters.amenities.join(','));
    if (filters?.hostelId) params.append('hostelId', filters.hostelId);

    const response: AxiosResponse<Room[]> = await api.get(`/rooms?${params.toString()}`);
    return response.data;
  },

  async getRoom(roomId: string): Promise<Room> {
    const response: AxiosResponse<Room> = await api.get(`/rooms/${roomId}`);
    return response.data;
  },

  async bookRoom(roomId: string): Promise<void> {
    await api.post(`/rooms/${roomId}/book`);
  }
}; 