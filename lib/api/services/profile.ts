import { api } from '../axios';

export type AdminProfile = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  role: 'admin';
  institution_id: string;
  created_at: string;
  updated_at: string;
  institution_admins: {
    employee_id: string;
    department: string | null;
  };
  institutions: {
    name: string;
    code: string;
    contact_email: string;
    contact_phone: string;
    address: string;
    city: string;
    state: string;
    website: string | null;
    logo_url: string | null;
  };
};

export type UpdateProfileData = {
  full_name: string;
  phone?: string;
  gender?: string;
};

export const profileService = {
  getProfile: async (): Promise<AdminProfile> => {
    const response = await api.get('/admin/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<void> => {
    await api.patch('/admin/profile', data);
  },
}; 