import { apiClient } from '@/lib/api-client';

export type FeeStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIAL';

export interface Fee {
  id: string;
  amount: string;
  dueDate: string;
  paidDate: string | null;
  status: FeeStatus;
  semester: string;
}

interface FeeSummary {
  totalDue: number;
  totalPaid: number;
}

export const feeService = {
  getMyFees: () =>
    apiClient.get<{ success: boolean; data: { fees: Fee[]; summary: FeeSummary } }>('/fees/me'),

  getAll: (status?: string) =>
    apiClient.get<{ success: boolean; data: Fee[] }>('/fees', { params: status ? { status } : undefined }),

  create: (payload: { studentId: string; amount: number; dueDate: string; semester: string }) =>
    apiClient.post('/fees', payload),

  markPaid: (id: string) => apiClient.patch(`/fees/${id}/mark-paid`),
};