'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, LogOut, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { visitorService, type Visitor } from '@/services/visitorService';
import { studentService } from '@/services/studentService';

interface StudentOption {
  id: string;
  studentId: string;
  user: { fullName: string };
}

export default function AdminVisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingOutId, setCheckingOutId] = useState<string | null>(null);

  const [studentId, setStudentId] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [purpose, setPurpose] = useState('');

  const fetchVisitors = () => {
    setLoading(true);
    visitorService
      .getAll(showActiveOnly)
      .then((res) => setVisitors(res.data.data))
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load visitors'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVisitors();
    studentService
      .getAll()
      .then((res) => setStudents(res.data.data as unknown as StudentOption[]))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showActiveOnly]);

  const resetForm = () => {
    setStudentId('');
    setVisitorName('');
    setVisitorPhone('');
    setPurpose('');
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !visitorName || !visitorPhone || !purpose) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await visitorService.checkIn({ studentId, visitorName, visitorPhone, purpose });
      toast.success('Visitor checked in');
      resetForm();
      setIsFormOpen(false);
      fetchVisitors();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to check in visitor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckOut = async (id: string) => {
    setCheckingOutId(id);
    try {
      await visitorService.checkOut(id);
      toast.success('Visitor checked out');
      fetchVisitors();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to check out visitor');
    } finally {
      setCheckingOutId(null);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Visitors</h1>
          <p className="text-slate-500 text-sm mt-1">Track visitor check-ins and check-outs.</p>
        </div>
        <button
          onClick={() => setIsFormOpen((o) => !o)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90"
        >
          <Plus size={16} />
          Check In Visitor
        </button>
      </div>

      {isFormOpen && (
        <motion.form
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCheckIn}
          className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3 max-w-xl"
        >
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Visiting Student</label>
            <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className={inputClass}>
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.user.fullName} ({s.studentId})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Visitor Name</label>
              <input value={visitorName} onChange={(e) => setVisitorName(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Visitor Phone</label>
              <input value={visitorPhone} onChange={(e) => setVisitorPhone(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Purpose of Visit</label>
            <input value={purpose} onChange={(e) => setPurpose(e.target.value)} className={inputClass} />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg text-white text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="animate-spin" size={15} />}
            {isSubmitting ? 'Checking in...' : 'Check In'}
          </button>
        </motion.form>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setShowActiveOnly(true)}
          className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
            showActiveOnly
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
              : 'bg-white/70 text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Currently Inside
        </button>
        <button
          onClick={() => setShowActiveOnly(false)}
          className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
            !showActiveOnly
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
              : 'bg-white/70 text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All History
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="animate-spin mr-2" size={20} />
          Loading visitors...
        </div>
      ) : visitors.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-8 text-center">
          <UserPlus className="mx-auto text-slate-300 mb-3" size={32} />
          <p className="text-slate-500 text-sm">No visitors to show.</p>
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
                <th className="px-5 py-3 font-medium">Visitor</th>
                <th className="px-5 py-3 font-medium">Visiting</th>
                <th className="px-5 py-3 font-medium">Purpose</th>
                <th className="px-5 py-3 font-medium">Check-in</th>
                <th className="px-5 py-3 font-medium">Check-out</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((v) => (
                <tr key={v.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3">
                    <p className="text-slate-700">{v.visitorName}</p>
                    <p className="text-xs text-slate-400">{v.visitorPhone}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {v.student.user.fullName}
                    <div className="text-xs text-slate-400">{v.student.studentId}</div>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{v.purpose}</td>
                  <td className="px-5 py-3 text-slate-500 text-xs">
                    {new Date(v.checkInAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-slate-500 text-xs">
                    {v.checkOutAt ? new Date(v.checkOutAt).toLocaleString() : (
                      <span className="text-emerald-600 font-medium">Inside</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {!v.checkOutAt && (
                      <button
                        onClick={() => handleCheckOut(v.id)}
                        disabled={checkingOutId === v.id}
                        className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
                      >
                        <LogOut size={14} />
                        {checkingOutId === v.id ? 'Checking out...' : 'Check Out'}
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