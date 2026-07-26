'use client';

import { motion } from 'framer-motion';
import { Bell, Loader2 } from 'lucide-react';
import type { Announcement } from '@/services/announcementService';

interface AnnouncementFeedProps {
  announcements: Announcement[];
  loading: boolean;
}

export default function AnnouncementFeed({ announcements, loading }: AnnouncementFeedProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-slate-400">
        <Loader2 className="animate-spin mr-2" size={18} />
        Loading announcements...
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-8 text-center">
        <Bell className="mx-auto text-slate-300 mb-3" size={32} />
        <p className="text-slate-500 text-sm">No announcements posted yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {announcements.map((a) => (
        <motion.div
          key={a.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 shrink-0">
              <Bell className="text-white" size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">{a.title}</p>
              <p className="text-sm text-slate-600 mt-1">{a.message}</p>
              <p className="text-xs text-slate-400 mt-2">
                {a.author.fullName} · {new Date(a.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}