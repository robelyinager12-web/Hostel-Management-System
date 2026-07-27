import { apiClient } from '@/lib/api-client';

export type MaintenanceStatus = 'REQUESTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';

export interface MaintenanceRequestItem {
  id: string;
  issue: string;
  status: MaintenanceStatus;
  createdAt: string;
  raisedBy: { fullName: string; role: string };
  room: { roomNumber: string; block: string };
}

export const maintenanceService = {
  getAll: (status?: string) =>
    apiClient.get<{ success: boolean; data: MaintenanceRequestItem[] }>('/maintenance', {
      params: status ? { status } : undefined,
    }),

  updateStatus: (id: string, status: MaintenanceStatus) =>
    apiClient.patch(`/maintenance/${id}/status`, { status }),
};