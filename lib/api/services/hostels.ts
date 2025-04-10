import { AxiosResponse } from 'axios';
import { api } from '../axios';

export interface Hostel {
  id: string;
  institution_id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  contact_email: string;
  contact_phone: string;
  total_blocks: number;
  total_rooms: number;
  created_at: string;
  updated_at: string;
}

export interface HostelFilters {
  institutionId?: string;
  city?: string;
  state?: string;
}

export interface CreateHostelData {
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  contact_email: string;
  contact_phone: string;
  total_blocks: number;
  total_rooms: number;
  institution_id: string;
}

export interface UpdateHostelData extends Partial<CreateHostelData> {}

export const hostelService = {
  async getHostels(filters?: HostelFilters): Promise<Hostel[]> {
    const params = new URLSearchParams();
    
    if (filters?.institutionId) params.append('institutionId', filters.institutionId);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.state) params.append('state', filters.state);

    const response: AxiosResponse<Hostel[]> = await api.get(`/hostels?${params.toString()}`);
    return response.data;
  },

  async getHostel(id: string): Promise<Hostel> {
    const response: AxiosResponse<Hostel> = await api.get(`/hostels/${id}`);
    return response.data;
  },

  async createHostel(data: CreateHostelData): Promise<Hostel> {
    const response: AxiosResponse<Hostel> = await api.post('/hostels', data);
    return response.data;
  },

  async updateHostel(id: string, data: UpdateHostelData): Promise<Hostel> {
    const response: AxiosResponse<Hostel> = await api.patch(`/hostels/${id}`, data);
    return response.data;
  },

  async deleteHostel(id: string): Promise<void> {
    await api.delete(`/hostels/${id}`);
  }
}; 