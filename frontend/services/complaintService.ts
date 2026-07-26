import { apiClient } from '@/lib/api-client';

export type ComplaintStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  createdAt: string;
}

export const complaintService = {
  create: (payload: { title: string; description: string; category: string }) =>
    apiClient.post<{ success: boolean; data: Complaint }>('/complaints', payload),

  getMine: () => apiClient.get<{ success: boolean; data: Complaint[] }>('/complaints/me'),

  getAll: (status?: string) =>
    apiClient.get<{ success: boolean; data: Complaint[] }>('/complaints', {
      params: status ? { status } : undefined,
    }),

  updateStatus: (id: string, status: ComplaintStatus) =>
    apiClient.patch(`/complaints/${id}/status`, { status }),
};