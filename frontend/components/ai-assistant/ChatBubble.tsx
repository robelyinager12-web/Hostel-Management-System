'use client';

import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import type { ChatMessage } from '@/services/aiService';

export default function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shrink-0">
          <Bot className="text-white" size={14} />
        </div>
      )}
      <div
        className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm ${
          isUser
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-sm'
            : 'bg-slate-100 text-slate-700 rounded-bl-sm'
        }`}
      >
        {message.content}
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
          <User className="text-slate-500" size={14} />
        </div>
      )}
    </motion.div>
  );
}