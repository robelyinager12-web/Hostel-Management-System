import { apiClient } from '@/lib/api-client';

export interface Visitor {
  id: string;
  visitorName: string;
  visitorPhone: string;
  purpose: string;
  checkInAt: string;
  checkOutAt: string | null;
  student: {
    studentId: string;
    user: { fullName: string };
  };
}

export const visitorService = {
  getAll: (activeOnly?: boolean) =>
    apiClient.get<{ success: boolean; data: Visitor[] }>('/visitors', {
      params: activeOnly ? { activeOnly: 'true' } : undefined,
    }),

  checkIn: (payload: {
    studentId: string;
    visitorName: string;
    visitorPhone: string;
    purpose: string;
  }) => apiClient.post<{ success: boolean; data: Visitor }>('/visitors', payload),

  checkOut: (id: string) => apiClient.patch(`/visitors/${id}/check-out`),
};