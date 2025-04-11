import { api } from '../axios';

export type Warden = {
  user_id: string;
  employee_id: string;
  hostel_id: string;
  assigned_blocks: string[];
  institution_id: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    gender: string | null;
    role: string;
  };
  hostel: {
    id: string;
    name: string;
    code: string;
    address: string;
    city: string;
    state: string;
    contact_phone: string;
    contact_email: string;
    total_blocks: number;
    total_rooms: number;
  };
};

export type CreateWardenData = {
  user: {
    full_name: string;
    email: string;
    phone?: string;
    gender?: string;
  };
  employee_id: string;
  hostel_id: string;
  assigned_blocks: string[];
};

export type UpdateWardenData = {
  user?: {
    full_name?: string;
    email?: string;
    phone?: string;
    gender?: string;
  };
  employee_id?: string;
  hostel_id?: string;
  assigned_blocks?: string[];
};

export const wardensService = {
  getWardens: async () => {
    const { data } = await api.get<Warden[]>('/admin/wardens');
    return data;
  },

  getWarden: async (id: string) => {
    const { data } = await api.get<Warden>(`/admin/wardens/${id}`);
    return data;
  },

  createWarden: async (data: CreateWardenData) => {
    const { data: response } = await api.post<Warden>('/admin/wardens', data);
    return response;
  },

  updateWarden: async (id: string, data: UpdateWardenData) => {
    const { data: response } = await api.patch<Warden>(`/admin/wardens/${id}`, data);
    return response;
  },

  deleteWarden: async (id: string) => {
    await api.delete(`/admin/wardens/${id}`);
  },
}; 