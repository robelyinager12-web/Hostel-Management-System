'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { feeService } from '@/services/feeService';

interface FeeRow {
  id: string;
  amount: string;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIAL';
  semester: string;
  student: {
    studentId: string;
    user: { fullName: string; email: string };
  };
}

const statusStyles: Record<FeeRow['status'], string> = {
  PAID: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  PENDING: 'bg-amber-50 text-amber-600 border-amber-200',
  OVERDUE: 'bg-red-50 text-red-600 border-red-200',
  PARTIAL: 'bg-blue-50 text-blue-600 border-blue-200',
};

export default function AdminFeesPage() {
  const [fees, setFees] = useState<FeeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [markingId, setMarkingId] = useState<string | null>(null);

  const fetchFees = () => {
    setLoading(true);
    feeService
      .getAll(statusFilter !== 'ALL' ? statusFilter : undefined)
      .then((res) => setFees(res.data.data as FeeRow[]))
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load fees'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleMarkPaid = async (id: string) => {
    setMarkingId(id);
    try {
      await feeService.markPaid(id);
      toast.success('Fee marked as paid');
      fetchFees();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update fee');
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Fees</h1>
        <p className="text-slate-500 text-sm mt-1">Track and manage student fee payments.</p>
      </div>

      <div className="flex gap-2">
        {['ALL', 'PENDING', 'PAID', 'OVERDUE', 'PARTIAL'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
              statusFilter === s
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                : 'bg-white/70 text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="animate-spin mr-2" size={20} />
          Loading fees...
        </div>
      ) : fees.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-8 text-center">
          <Wallet className="mx-auto text-slate-300 mb-3" size={32} />
          <p className="text-slate-500 text-sm">No fee records match this filter.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl overflow-hidden shadow-sm overflow-x-auto"
        >
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="px-5 py-3 font-medium">Student</th>
                <th className="px-5 py-3 font-medium">Semester</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Due Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => (
                <tr key={fee.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3">
                    <p className="text-slate-700">{fee.student.user.fullName}</p>
                    <p className="text-xs text-slate-400">{fee.student.studentId}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{fee.semester}</td>
                  <td className="px-5 py-3 text-slate-600">
                    {Number(fee.amount).toLocaleString()} ETB
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    {new Date(fee.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyles[fee.status]}`}
                    >
                      {fee.status.charAt(0) + fee.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {fee.status !== 'PAID' && (
                      <button
                        onClick={() => handleMarkPaid(fee.id)}
                        disabled={markingId === fee.id}
                        className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
                      >
                        <CheckCircle2 size={14} />
                        {markingId === fee.id ? 'Updating...' : 'Mark Paid'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}