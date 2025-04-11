export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'admin' | 'warden' | 'student' | 'staff';
  created_at: string;
  updated_at: string;
} 