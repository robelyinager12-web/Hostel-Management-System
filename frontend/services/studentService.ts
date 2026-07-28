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

interface CreateStudentPayload {
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  gender: string;
  studentId: string;
  department: string;
  academicYear: string;
  password: string;
  roomId?: string;
}

export const studentService = {
  getMyProfile: () =>
    apiClient.get<{ success: boolean; data: StudentProfile }>('/students/me/profile'),

  getMyRoom: () => apiClient.get<{ success: boolean; data: Room | null }>('/students/me/room'),

  getAll: () => apiClient.get<{ success: boolean; data: StudentProfile[] }>('/students'),

  create: (payload: CreateStudentPayload) =>
    apiClient.post<{
      success: boolean;
      data: { student: unknown; credentials: { username: string; password: string } };
    }>('/students', payload),
};