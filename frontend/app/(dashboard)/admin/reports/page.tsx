'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { roomService } from '@/services/roomService';
import { feeService, type Fee } from '@/services/feeService';
import { studentService } from '@/services/studentService';
import { complaintService, type Complaint } from '@/services/complaintService';
import OccupancyChart from '@/components/charts/OccupancyChart';
import RevenueChart from '@/components/charts/RevenueChart';
import StudentDistributionChart from '@/components/charts/StudentDistributionChart';

interface RoomStats {
  total: number;
  available: number;
  occupied: number;
  maintenance: number;
}

interface StudentRow {
  department: string;
}

export default function AdminReportsPage() {
  const [roomStats, setRoomStats] = useState<RoomStats | null>(null);
  const [revenueData, setRevenueData] = useState<Array<{ semester: string; paid: number; pending: number }>>([]);
  const [distributionData, setDistributionData] = useState<Array<{ department: string; count: number }>>([]);
  const [complaintCounts, setComplaintCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    roomService
      .getStats()
      .then((res) => setRoomStats(res.data.data))
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load room stats'));

    feeService
      .getAll()
      .then((res) => {
        const bySemester = new Map<string, { paid: number; pending: number }>();
        (res.data.data as Fee[]).forEach((fee) => {
          const entry = bySemester.get(fee.semester) || { paid: 0, pending: 0 };
          const amount = Number(fee.amount);
          if (fee.status === 'PAID') entry.paid += amount;
          else entry.pending += amount;
          bySemester.set(fee.semester, entry);
        });
        setRevenueData(
          Array.from(bySemester.entries()).map(([semester, v]) => ({ semester, ...v })),
        );
      })
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load fee data'));

    studentService
      .getAll()
      .then((res) => {
        const byDept = new Map<string, number>();
        (res.data.data as unknown as StudentRow[]).forEach((s) => {
          byDept.set(s.department, (byDept.get(s.department) || 0) + 1);
        });
        setDistributionData(
          Array.from(byDept.entries()).map(([department, count]) => ({ department, count })),
        );
      })
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load student data'));

    complaintService
      .getAll()
      .then((res) => {
        const counts: Record<string, number> = {};
        (res.data.data as Complaint[]).forEach((c) => {
          counts[c.status] = (counts[c.status] || 0) + 1;
        });
        setComplaintCounts(counts);
      })
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load complaints'));
  }, []);

  const complaintStatusLabels: Record<string, string> = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved',
    REJECTED: 'Rejected',
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Reports</h1>
        <p className="text-slate-500 text-sm mt-1">
          Occupancy, revenue, student distribution, and complaint trends at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Room Occupancy</h2>
          <OccupancyChart stats={roomStats} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Fee Collection by Semester</h2>
          <RevenueChart data={revenueData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Students by Department</h2>
          <StudentDistributionChart data={distributionData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Complaints by Status</h2>
          {Object.keys(complaintCounts).length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
              No complaints yet.
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(complaintCounts).map(([status, count]) => (
                <div key={status} className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-28 shrink-0">
                    {complaintStatusLabels[status] || status}
                  </span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      style={{
                        width: `${(count / Math.max(...Object.values(complaintCounts))) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-slate-500 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}