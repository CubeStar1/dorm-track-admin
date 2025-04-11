import { api } from '../axios';
import { useMutation, useQuery } from '@tanstack/react-query';

export type Student = {
  id: string;
  user_id: string;
  student_id: string;
  department: string | null;
  year_of_study: number | null;
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
    created_at: string;
  };
  hostel: {
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
  } | null;
  room: {
    id: string;
    room_number: string;
    block: string;
    floor: number;
    capacity: number;
    current_occupancy: number;
    room_type: string;
    status: string;
    price: number;
    amenities: string[];
    images: string[];
    description: string;
  } | null;
  room_allocations: {
    id: string;
    start_date: string;
    end_date: string | null;
    status: string;
    room: {
      id: string;
      room_number: string;
      block: string;
      floor: number;
      room_type: string;
    };
  }[];
  maintenance_requests: {
    id: string;
    issue_type: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    created_at: string;
    updated_at: string;
    room: {
      room_number: string;
      block: string;
    };
  }[];
  complaints: {
    id: string;
    complaint_type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
    is_anonymous: boolean;
    resolution_notes: string | null;
    created_at: string;
    updated_at: string;
    room: {
      room_number: string;
      block: string;
    };
  }[];
};

export type StudentWithAllocations = Student & {
  room_allocations: {
    id: string;
    start_date: string;
    end_date: string | null;
    status: string;
    room: {
      id: string;
      room_number: string;
      block: string;
      floor: number;
      capacity: number;
      room_type: string;
    };
  }[];
};

export type UpdateStudentData = {
  full_name?: string;
  phone?: string;
  department?: string;
  year_of_study?: number;
};

export const studentsService = {
  getStudents: async () => {
    const { data } = await api.get<Student[]>('admin/students');
    return data;
  },

  getStudent: async (id: string) => {
    const { data } = await api.get<Student>(`/admin/students/${id}`);
    return data;
  },

  updateStudent: async (id: string, data: UpdateStudentData) => {
    const { data: response } = await api.patch<Student>(`/admin/students/${id}`, data);
    return response;
  },
};

export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: studentsService.getStudents,
  });
};

export const useStudent = (id: string) => {
  return useQuery({
    queryKey: ['students', id],
    queryFn: () => studentsService.getStudent(id),
  });
};

export const useUpdateStudent = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentData }) =>
      studentsService.updateStudent(id, data),
  });
}; 