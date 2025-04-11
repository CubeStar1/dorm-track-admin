import { User } from './users';
import { Room } from './rooms';
import { Hostel } from './hostels';

export type MaintenanceStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type MaintenancePriority = 'low' | 'medium' | 'high';
export type MaintenanceIssueType = 'plumbing' | 'electrical' | 'furniture' | 'cleaning' | 'other';

export interface Student {
  student_id: string;
  user: {
    full_name: string;
    email: string;
    phone?: string;
  };
}

export interface MaintenanceRequest {
  id: string;
  issue_type: MaintenanceIssueType;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  resolution_notes?: string;
  student_id: string;
  room_id: string;
  hostel_id: string;
  assigned_staff_id?: string;
  created_at: string;
  updated_at: string;
  student?: {
    user: User;
  };
  room?: Room;
  hostel?: Hostel;
  assigned_staff?: User;
}

export interface CreateMaintenancePayload {
  issue_type: MaintenanceIssueType;
  description: string;
  priority: MaintenancePriority;
}

export interface UpdateMaintenancePayload {
  status: MaintenanceStatus;
  resolution_notes?: string;
  assigned_staff_id?: string;
}

class MaintenanceService {
  async getRequests(): Promise<MaintenanceRequest[]> {
    const response = await fetch('/api/maintenance');
    if (!response.ok) {
      throw new Error('Failed to fetch maintenance requests');
    }
    return response.json();
  }

  async getRequest(id: string): Promise<MaintenanceRequest> {
    const response = await fetch(`/api/maintenance/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch maintenance request');
    }
    return response.json();
  }

  async createRequest(data: {
    issue_type: MaintenanceIssueType;
    description: string;
    priority: MaintenancePriority;
    student_id: string;
    room_id: string;
    hostel_id: string;
  }): Promise<MaintenanceRequest> {
    const response = await fetch('/api/maintenance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create maintenance request');
    }

    return response.json();
  }

  async updateRequest(
    id: string,
    data: {
      status: MaintenanceStatus;
      resolution_notes?: string;
      assigned_staff_id?: string;
    }
  ): Promise<MaintenanceRequest> {
    const response = await fetch(`/api/maintenance/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update maintenance request');
    }

    return response.json();
  }
}

export const maintenanceService = new MaintenanceService(); 