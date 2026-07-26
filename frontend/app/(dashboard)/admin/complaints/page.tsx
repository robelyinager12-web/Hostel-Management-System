'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareWarning, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { complaintService, type ComplaintStatus } from '@/services/complaintService';

interface ComplaintRow {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  createdAt: string;
  raisedBy: { fullName: string; email: string; role: string };
}

const statusOptions: ComplaintStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

const statusStyles: Record<ComplaintStatus, string> = {
  OPEN: 'bg-amber-50 text-amber-600 border-amber-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-600 border-blue-200',
  RESOLVED: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  REJECTED: 'bg-red-50 text-red-600 border-red-200',
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<ComplaintRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchComplaints = () => {
    setLoading(true);
    complaintService
      .getAll(filter !== 'ALL' ? filter : undefined)
      .then((res) => setComplaints(res.data.data as ComplaintRow[]))
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load complaints'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleStatusChange = async (id: string, status: ComplaintStatus) => {
    setUpdatingId(id);
    try {
      await complaintService.updateStatus(id, status);
      toast.success('Status updated');
      fetchComplaints();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Complaints</h1>
        <p className="text-slate-500 text-sm mt-1">Review and resolve student-submitted complaints.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['ALL', ...statusOptions].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
              filter === s
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                : 'bg-white/70 text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="animate-spin mr-2" size={20} />
          Loading complaints...
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-8 text-center">
          <MessageSquareWarning className="mx-auto text-slate-300 mb-3" size={32} />
          <p className="text-slate-500 text-sm">No complaints match this filter.</p>
        </div>
      ) : (
        <div className="space-y-3 max-w-3xl">
          {complaints.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{c.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {c.raisedBy.fullName} · {c.category} ·{' '}
                    {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${statusStyles[c.status]}`}
                >
                  {c.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-2">{c.description}</p>

              <div className="flex gap-2 mt-3">
                {statusOptions
                  .filter((s) => s !== c.status)
                  .map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(c.id, s)}
                      disabled={updatingId === c.id}
                      className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Mark {s.replace('_', ' ').toLowerCase()}
                    </button>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}