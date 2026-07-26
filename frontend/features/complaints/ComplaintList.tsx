'use client';

import { motion } from 'framer-motion';
import { MessageSquareWarning, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import type { Complaint } from '@/services/complaintService';

const statusStyles: Record<Complaint['status'], { style: string; icon: any }> = {
  OPEN: { style: 'bg-amber-50 text-amber-600 border-amber-200', icon: Clock },
  IN_PROGRESS: { style: 'bg-blue-50 text-blue-600 border-blue-200', icon: Loader2 },
  RESOLVED: { style: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: CheckCircle2 },
  REJECTED: { style: 'bg-red-50 text-red-600 border-red-200', icon: XCircle },
};

interface ComplaintListProps {
  complaints: Complaint[];
  loading: boolean;
}

export default function ComplaintList({ complaints, loading }: ComplaintListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-slate-400">
        <Loader2 className="animate-spin mr-2" size={18} />
        Loading complaints...
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-8 text-center">
        <MessageSquareWarning className="mx-auto text-slate-300 mb-3" size={32} />
        <p className="text-slate-500 text-sm">You haven't submitted any complaints yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {complaints.map((complaint) => {
        const { style, icon: StatusIcon } = statusStyles[complaint.status];
        return (
          <motion.div
            key={complaint.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-800">{complaint.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{complaint.category}</p>
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${style}`}
              >
                <StatusIcon size={12} />
                {complaint.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-2">{complaint.description}</p>
            <p className="text-xs text-slate-400 mt-2">
              {new Date(complaint.createdAt).toLocaleDateString()}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}