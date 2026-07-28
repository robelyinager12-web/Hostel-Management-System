'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { attendanceService, type AttendanceRecord } from '@/services/attendanceService';

export default function StudentAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attendanceService
      .getMine()
      .then((res) => setRecords(res.data.data))
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load attendance'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">My Attendance</h1>
        <p className="text-slate-500 text-sm mt-1">Your recent hostel attendance record.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="animate-spin mr-2" size={20} />
          Loading attendance...
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-8 text-center">
          <CalendarCheck className="mx-auto text-slate-300 mb-3" size={32} />
          <p className="text-slate-500 text-sm">No attendance records yet.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl overflow-hidden shadow-sm"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3 text-slate-700">
                    {new Date(r.date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    {r.present ? (
                      <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                        <CheckCircle2 size={14} /> Present
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-500 text-xs font-medium">
                        <XCircle size={14} /> Absent
                      </span>
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