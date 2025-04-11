export type ComplaintType = 'ragging' | 'harassment' | 'facilities' | 'mess' | 'other';
export type ComplaintSeverity = 'low' | 'medium' | 'high';
export type ComplaintStatus = 'pending' | 'investigating' | 'resolved' | 'dismissed';

export interface Student {
  student_id: string;
  user: {
    full_name: string;
    email: string;
    phone?: string;
  };
}

export interface Hostel {
  id: string;
  name: string;
  code: string;
  address: string;
}

export interface Room {
  id: string;
  room_number: string;
  block: string;
  floor: number;
  room_type: string;
}

export interface AssignedStaff {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
}

export interface Complaint {
  id: string;
  created_at: string;
  updated_at: string;
  complaint_type: ComplaintType;
  description: string;
  severity: ComplaintSeverity;
  status: ComplaintStatus;
  is_anonymous: boolean;
  student_id: string;
  hostel_id: string;
  room_id?: string;
  assigned_to?: string;
  resolution_notes?: string;
  institution_id: string;
  student?: Student;
  hostel?: Hostel;
  room?: Room;
  assigned_staff?: AssignedStaff;
}

export interface CreateComplaintPayload {
  complaint_type: ComplaintType;
  description: string;
  severity: ComplaintSeverity;
  is_anonymous: boolean;
}

export interface UpdateComplaintPayload {
  status: ComplaintStatus;
  resolution_notes?: string;
  assigned_to?: string;
}

class ComplaintsService {
  async getComplaints(): Promise<Complaint[]> {
    const response = await fetch('/api/complaints');
    if (!response.ok) {
      throw new Error('Failed to fetch complaints');
    }
    return response.json();
  }

  async getComplaint(id: string): Promise<Complaint> {
    const response = await fetch(`/api/complaints/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch complaint');
    }
    return response.json();
  }

  async createComplaint(data: CreateComplaintPayload): Promise<Complaint> {
    const response = await fetch('/api/complaints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create complaint');
    }
    return response.json();
  }

  async updateComplaint(id: string, data: UpdateComplaintPayload): Promise<Complaint> {
    const response = await fetch(`/api/complaints/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update complaint');
    }
    return response.json();
  }
}

export const complaintsService = new ComplaintsService(); 