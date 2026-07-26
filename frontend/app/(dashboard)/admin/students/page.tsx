'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { studentService } from '@/services/studentService';

interface StudentRow {
  id: string;
  studentId: string;
  department: string;
  academicYear: string;
  user: { fullName: string; email: string; phoneNumber: string | null };
  room: { roomNumber: string; block: string } | null;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    studentService
      .getAll()
      .then((res) => setStudents(res.data.data as StudentRow[]))
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load students'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter((s) =>
    `${s.user.fullName} ${s.studentId} ${s.department}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Students</h1>
        <p className="text-slate-500 text-sm mt-1">All registered students and their room assignments.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, ID, or department..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="animate-spin mr-2" size={20} />
          Loading students...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-8 text-center">
          <Users className="mx-auto text-slate-300 mb-3" size={32} />
          <p className="text-slate-500 text-sm">No students found.</p>
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
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Student ID</th>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Year</th>
                <th className="px-5 py-3 font-medium">Room</th>
                <th className="px-5 py-3 font-medium">Contact</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs shrink-0">
                        {s.user.fullName.charAt(0)}
                      </div>
                      <span className="text-slate-700">{s.user.fullName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{s.studentId}</td>
                  <td className="px-5 py-3 text-slate-600">{s.department}</td>
                  <td className="px-5 py-3 text-slate-600">{s.academicYear}</td>
                  <td className="px-5 py-3 text-slate-600">
                    {s.room ? `${s.room.roomNumber} (${s.room.block})` : (
                      <span className="text-slate-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-500 text-xs">
                    {s.user.email}
                    {s.user.phoneNumber && <div>{s.user.phoneNumber}</div>}
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