import { apiClient } from '@/lib/api-client';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  author: {
    fullName: string;
    role: string;
  };
}

export const announcementService = {
  getAll: () => apiClient.get<{ success: boolean; data: Announcement[] }>('/announcements'),

  create: (payload: { title: string; message: string }) =>
    apiClient.post<{ success: boolean; data: Announcement }>('/announcements', payload),

  delete: (id: string) => apiClient.delete(`/announcements/${id}`),
};