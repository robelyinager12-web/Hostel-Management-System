import { apiClient } from '@/lib/api-client';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const aiService = {
  chat: (message: string, history: ChatMessage[]) =>
    apiClient.post<{ success: boolean; data: { reply: string } }>('/ai/chat', {
      message,
      history,
    }),
};