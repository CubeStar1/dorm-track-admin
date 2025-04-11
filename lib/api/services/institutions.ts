import { api } from '../axios';

export type User = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  gender: string | null;
};

export type Room = {
  id: string;
  room_number: string;
  floor: number;
  capacity: number;
  current_occupancy: number;
  room_type: 'Single' | 'Double' | 'Triple';
  block: string;
  amenities: string[];
  status: 'available' | 'occupied' | 'maintenance';
  price: number;
  description: string;
  hostel?: {
    id: string;
    name: string;
  };
};

export type Warden = {
  user_id: string;
  employee_id: string;
  assigned_blocks: string[];
  user: User;
};

export type Hostel = {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  contact_email: string;
  contact_phone: string;
  total_blocks: number;
  total_rooms: number;
  rooms: Room[];
  wardens: Warden[];
};

export type Student = {
  user_id: string;
  student_id: string;
  department: string;
  year_of_study: number;
  room?: Room;
  user: User;
};

export type Institution = {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  contact_email: string;
  contact_phone: string;
  website: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
  hostels: Hostel[];
  students: Student[];
};

export type CreateInstitutionData = {
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  contact_email: string;
  contact_phone: string;
  website?: string | null;
  logo_url?: string | null;
};

export type UpdateInstitutionData = Partial<CreateInstitutionData>;

export const institutionsService = {
  getInstitutions: async (): Promise<Institution[]> => {
    const response = await api.get('/admin/institutions');
    return response.data;
  },

  getInstitution: async (id: string): Promise<Institution> => {
    const response = await api.get(`/admin/institutions/${id}`);
    return response.data;
  },

  createInstitution: async (data: CreateInstitutionData): Promise<Institution> => {
    const response = await api.post('/admin/institutions', data);
    return response.data;
  },

  updateInstitution: async (id: string, data: UpdateInstitutionData): Promise<void> => {
    await api.patch(`/admin/institutions/${id}`, data);
  },

  deleteInstitution: async (id: string): Promise<void> => {
    await api.delete(`/admin/institutions/${id}`);
  },

  assignInstitution: async (institutionId: string): Promise<void> => {
    await api.post('/admin/institutions/assign', { institution_id: institutionId });
  },

  getMyInstitution: async (): Promise<Institution | null> => {
    try {
      const response = await api.get('/admin/institutions/my');
      return response.data;
    } catch (error) {
      return null;
    }
  },
};