'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { attendanceService, type AttendanceRow } from '@/services/attendanceService';

export default function AttendanceTracker() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAttendance = () => {
    setLoading(true);
    attendanceService
      .getByDate(date)
      .then((res) => setRows(res.data.data))
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load attendance'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const toggle = (studentId: string, present: boolean) => {
    setRows((prev) => prev.map((r) => (r.studentId === studentId ? { ...r, present } : r)));
  };

  const handleSave = async () => {
    const records = rows
      .filter((r) => r.present !== null)
      .map((r) => ({ studentId: r.studentId, present: r.present as boolean }));

    if (records.length === 0) {
      toast.error('Mark at least one student before saving');
      return;
    }

    setIsSaving(true);
    try {
      await attendanceService.mark(date, records);
      toast.success('Attendance saved');
      fetchAttendance();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save attendance');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 disabled:opacity-60"
        >
          {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {isSaving ? 'Saving...' : 'Save Attendance'}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="animate-spin mr-2" size={20} />
          Loading students...
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl overflow-hidden shadow-sm overflow-x-auto"
        >
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="px-5 py-3 font-medium">Student</th>
                <th className="px-5 py-3 font-medium">Room</th>
                <th className="px-5 py-3 font-medium">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.studentId} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3">
                    <p className="text-slate-700">{row.fullName}</p>
                    <p className="text-xs text-slate-400">{row.studentCode}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{row.room}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggle(row.studentId, true)}
                        className={`p-1.5 rounded-lg border ${
                          row.present === true
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-200 text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button
                        onClick={() => toggle(row.studentId, false)}
                        className={`p-1.5 rounded-lg border ${
                          row.present === false
                            ? 'bg-red-500 border-red-500 text-white'
                            : 'border-slate-200 text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
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