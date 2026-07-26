import { apiClient } from '@/lib/api-client';
import type { Room } from '@/types/room';

interface StudentProfile {
  id: string;
  studentId: string;
  department: string;
  academicYear: string;
  guardianName: string | null;
  guardianPhone: string | null;
  user: {
    fullName: string;
    username: string;
    email: string;
    phoneNumber: string | null;
    gender: string | null;
  };
  room: Room | null;
}

export const studentService = {
  getMyProfile: () =>
    apiClient.get<{ success: boolean; data: StudentProfile }>('/students/me/profile'),

  getMyRoom: () => apiClient.get<{ success: boolean; data: Room | null }>('/students/me/room'),

  getAll: () => apiClient.get<{ success: boolean; data: StudentProfile[] }>('/students'),
};