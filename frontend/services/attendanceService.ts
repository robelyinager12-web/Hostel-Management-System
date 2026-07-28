import { apiClient } from '@/lib/api-client';

export interface AttendanceRow {
  studentId: string;
  studentCode: string;
  fullName: string;
  room: string;
  present: boolean | null;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  present: boolean;
}

export const attendanceService = {
  getByDate: (date: string) =>
    apiClient.get<{ success: boolean; data: AttendanceRow[] }>('/attendance', { params: { date } }),

  mark: (date: string, records: Array<{ studentId: string; present: boolean }>) =>
    apiClient.post('/attendance', { date, records }),

  getMine: () =>
    apiClient.get<{ success: boolean; data: AttendanceRecord[] }>('/attendance/me'),
};