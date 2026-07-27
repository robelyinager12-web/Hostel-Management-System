'use client';

import { useState, useCallback } from 'react';
import { aiService, type ChatMessage } from '@/services/aiService';

export function useAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your hostel assistant. Ask me about your room, fees, or complaints.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMessage: ChatMessage = { role: 'user', content: text };
      const historyForRequest = messages.filter((m, i) => i > 0); // exclude the initial greeting
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const res = await aiService.chat(text, historyForRequest);
        setMessages((prev) => [...prev, { role: 'assistant', content: res.data.data.reply }]);
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              err?.response?.data?.message ||
              "Sorry, I couldn't reach the assistant right now. Please try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages],
  );

  return { messages, sendMessage, isLoading };
}