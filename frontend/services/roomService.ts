import { apiClient } from '@/lib/api-client';
import type { Room } from '@/types/room';

export const roomService = {
  getAll: (params?: { status?: string; block?: string }) =>
    apiClient.get<{ success: boolean; data: Room[] }>('/rooms', { params }),

  getById: (id: string) => apiClient.get<{ success: boolean; data: Room }>(`/rooms/${id}`),

  getStats: () =>
    apiClient.get<{
      success: boolean;
      data: { total: number; available: number; occupied: number; maintenance: number };
    }>('/rooms/stats'),

  create: (payload: Partial<Room>) => apiClient.post('/rooms', payload),

  update: (id: string, payload: Partial<Room>) => apiClient.patch(`/rooms/${id}`, payload),

  delete: (id: string) => apiClient.delete(`/rooms/${id}`),
};