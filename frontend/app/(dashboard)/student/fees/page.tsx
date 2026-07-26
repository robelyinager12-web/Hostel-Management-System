'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { feeService, type Fee } from '@/services/feeService';

const statusStyles: Record<Fee['status'], string> = {
  PAID: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  PENDING: 'bg-amber-50 text-amber-600 border-amber-200',
  OVERDUE: 'bg-red-50 text-red-600 border-red-200',
  PARTIAL: 'bg-blue-50 text-blue-600 border-blue-200',
};

export default function StudentFeesPage() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [summary, setSummary] = useState<{ totalDue: number; totalPaid: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    feeService
      .getMyFees()
      .then((res) => {
        setFees(res.data.data.fees);
        setSummary(res.data.data.summary);
      })
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load fees'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Fees</h1>
        <p className="text-slate-500 text-sm mt-1">Your hostel fee history and current dues.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="animate-spin mr-2" size={20} />
          Loading fees...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <div className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Due</p>
                  <p className="text-2xl font-semibold text-slate-800 mt-1">
                    {summary?.totalDue.toLocaleString() ?? 0} ETB
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600">
                  <Clock className="text-white" size={20} />
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Paid</p>
                  <p className="text-2xl font-semibold text-slate-800 mt-1">
                    {summary?.totalPaid.toLocaleString() ?? 0} ETB
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600">
                  <CheckCircle2 className="text-white" size={20} />
                </div>
              </div>
            </div>
          </div>

          {fees.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-8 text-center max-w-2xl">
              <Wallet className="mx-auto text-slate-300 mb-3" size={36} />
              <p className="text-slate-500 text-sm">No fee records yet.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl overflow-hidden shadow-sm max-w-2xl"
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-slate-500">
                    <th className="px-5 py-3 font-medium">Semester</th>
                    <th className="px-5 py-3 font-medium">Amount</th>
                    <th className="px-5 py-3 font-medium">Due Date</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((fee) => (
                    <tr key={fee.id} className="border-b border-slate-50 last:border-0">
                      <td className="px-5 py-3 text-slate-700">{fee.semester}</td>
                      <td className="px-5 py-3 text-slate-700">
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}