import { SupabaseClient } from '@supabase/supabase-js';

export type MealType = 'breakfast' | 'lunch' | 'dinner';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface MessMenu {
  id: string;
  hostel_id: string;
  day_of_week: DayOfWeek;
  meal_type: string;
  items: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateMessMenuInput {
  hostel_id: string;
  day_of_week: DayOfWeek;
  meal_type: MealType;
  items: string[];
}

export interface UpdateMessMenuInput extends Partial<CreateMessMenuInput> {
  id: string;
}

class MessMenuService {
  async getMessMenu(hostelId: string): Promise<MessMenu[]> {
    const response = await fetch(`/api/mess-menu?hostelId=${hostelId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch mess menu');
    }
    return response.json();
  }

  async getMessMenuByDay(hostelId: string, dayOfWeek: DayOfWeek): Promise<MessMenu[]> {
    const allMenu = await this.getMessMenu(hostelId);
    return allMenu.filter(item => item.day_of_week === dayOfWeek);
  }

  async createMessMenu(data: CreateMessMenuInput): Promise<MessMenu> {
    const payload = {
      ...data,
      meal_type: data.meal_type.charAt(0).toUpperCase() + data.meal_type.slice(1),
    };

    const response = await fetch('/api/mess-menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create mess menu item');
    }
    return response.json();
  }

  async updateMessMenu(data: UpdateMessMenuInput): Promise<MessMenu> {
    const payload = {
      ...data,
      meal_type: data.meal_type 
        ? data.meal_type.charAt(0).toUpperCase() + data.meal_type.slice(1)
        : undefined,
    };

    const response = await fetch('/api/mess-menu', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update mess menu item');
    }
    return response.json();
  }

  async deleteMessMenu(id: string, hostelId: string): Promise<void> {
    const response = await fetch(`/api/mess-menu?id=${id}&hostelId=${hostelId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete mess menu item');
    }
  }
}

export const messMenuService = new MessMenuService(); 