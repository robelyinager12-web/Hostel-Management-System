'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { useAssistant } from '@/features/ai-assistant/useAssistant';
import ChatBubble from './ChatBubble';
import VoiceInputButton from './VoiceInputButton';

export default function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, sendMessage, isLoading } = useAssistant();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen((o) => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg text-white"
      >
        {isOpen ? <X size={22} /> : <Bot size={22} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-40 w-[90vw] max-w-sm h-[70vh] max-h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600">
              <Bot className="text-white" size={18} />
              <span className="text-white text-sm font-medium">Hostel Assistant</span>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <ChatBubble key={i} message={m} />
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-slate-400 text-xs pl-9">
                  <Loader2 className="animate-spin" size={14} />
                  Thinking...
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 p-3 border-t border-slate-100">
              <VoiceInputButton onResult={(text) => setInput(text)} />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your room, fees..."
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="p-2 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}