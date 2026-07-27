'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  maintenanceService,
  type MaintenanceRequestItem,
  type MaintenanceStatus,
} from '@/services/maintenanceService';

const statusOptions: MaintenanceStatus[] = ['REQUESTED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'];

const statusStyles: Record<MaintenanceStatus, string> = {
  REQUESTED: 'bg-amber-50 text-amber-600 border-amber-200',
  ASSIGNED: 'bg-blue-50 text-blue-600 border-blue-200',
  IN_PROGRESS: 'bg-purple-50 text-purple-600 border-purple-200',
  COMPLETED: 'bg-emerald-50 text-emerald-600 border-emerald-200',
};

export default function MaintenanceDashboardPage() {
  const [requests, setRequests] = useState<MaintenanceRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchRequests = () => {
    setLoading(true);
    maintenanceService
      .getAll(filter !== 'ALL' ? filter : undefined)
      .then((res) => setRequests(res.data.data))
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load requests'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleStatusChange = async (id: string, status: MaintenanceStatus) => {
    setUpdatingId(id);
    try {
      await maintenanceService.updateStatus(id, status);
      toast.success('Status updated');
      fetchRequests();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Maintenance Requests</h1>
        <p className="text-slate-500 text-sm mt-1">
          Track and resolve room maintenance issues across the hostel.
        </p>
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
          Loading requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-8 text-center">
          <Wrench className="mx-auto text-slate-300 mb-3" size={32} />
          <p className="text-slate-500 text-sm">No maintenance requests match this filter.</p>
        </div>
      ) : (
        <div className="space-y-3 max-w-3xl">
          {requests.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Room {r.room.roomNumber} ({r.room.block})
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Reported by {r.raisedBy.fullName} ·{' '}
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${statusStyles[r.status]}`}
                >
                  {r.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-2">{r.issue}</p>

              <div className="flex gap-2 mt-3 flex-wrap">
                {statusOptions
                  .filter((s) => s !== r.status)
                  .map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(r.id, s)}
                      disabled={updatingId === r.id}
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