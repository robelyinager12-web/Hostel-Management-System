'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  DoorOpen,
  Users,
  Clock,
  UserCheck,
  Plus,
  GraduationCap,
  Wallet,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Home,
} from 'lucide-react';
import { toast } from 'sonner';
import RoomList from '@/features/rooms/RoomList';
import RoomFormModal from '@/features/rooms/RoomFormModal';
import { roomService } from '@/services/roomService';
import { studentService } from '@/services/studentService';
import { feeService, type Fee } from '@/services/feeService';
import { attendanceService } from '@/services/attendanceService';
import OccupancyChart from '@/components/charts/OccupancyChart';
import type { Room } from '@/types/room';

interface RoomStats {
  total: number;
  available: number;
  occupied: number;
  maintenance: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<RoomStats | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [monthRevenue, setMonthRevenue] = useState<number | null>(null);
  const [presentToday, setPresentToday] = useState<number | null>(null);
  const [absentToday, setAbsentToday] = useState<number | null>(null);
  const [fullRooms, setFullRooms] = useState<number | null>(null);

  const fetchStats = () => {
    roomService
      .getStats()
      .then((res) => setStats(res.data.data))
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load room stats'));
  };

  useEffect(() => {
    fetchStats();

    studentService
      .getAll()
      .then((res) => setTotalStudents(res.data.data.length))
      .catch(() => {});

    roomService
      .getAll()
      .then((res) => {
        const full = res.data.data.filter(
          (r) => (r.occupancy ?? r.students.length) >= r.capacity,
        ).length;
        setFullRooms(full);
      })
      .catch(() => {});

    feeService
      .getAll()
      .then((res) => {
        const fees = res.data.data as Fee[];
        const now = new Date();
        let total = 0;
        let month = 0;

        fees.forEach((fee) => {
          if (fee.status === 'PAID') {
            const amount = Number(fee.amount);
            total += amount;
            if (fee.paidDate) {
              const paid = new Date(fee.paidDate);
              if (paid.getFullYear() === now.getFullYear() && paid.getMonth() === now.getMonth()) {
                month += amount;
              }
            }
          }
        });

        setTotalRevenue(total);
        setMonthRevenue(month);
      })
      .catch(() => {});

    const today = new Date().toISOString().split('T')[0];
    attendanceService
      .getByDate(today)
      .then((res) => {
        const rows = res.data.data;
        setPresentToday(rows.filter((r) => r.present === true).length);
        setAbsentToday(rows.filter((r) => r.present === false).length);
      })
      .catch(() => {});
  }, [refreshKey]);

  const handleRoomCreated = () => {
    setRefreshKey((k) => k + 1);
  };

  const roomCards = [
    {
      label: 'Total Rooms',
      value: stats?.total ?? '—',
      icon: DoorOpen,
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      label: 'Available',
      value: stats?.available ?? '—',
      icon: UserCheck,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      label: 'Occupied',
      value: stats?.occupied ?? '—',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Maintenance',
      value: stats?.maintenance ?? '—',
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const summaryCards = [
    {
      label: 'Total Students',
      value: totalStudents ?? '—',
      icon: GraduationCap,
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      label: 'Total Revenue',
      value: totalRevenue !== null ? `${totalRevenue.toLocaleString()} ETB` : '—',
      icon: Wallet,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      label: 'This Month Revenue',
      value: monthRevenue !== null ? `${monthRevenue.toLocaleString()} ETB` : '—',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Present Today',
      value: presentToday ?? '—',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      label: 'Absent Today',
      value: absentToday ?? '—',
      icon: XCircle,
      color: 'from-red-500 to-red-600',
    },
    {
      label: 'Full Rooms',
      value: fullRooms ?? '—',
      icon: Home,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Hostel Overview</h1>
          <p className="text-slate-500 text-sm mt-1">
            Live room occupancy and status across the hostel.
          </p>
        </div>
        <button
          onClick={() => setIsAddRoomOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90"
        >
          <Plus size={16} />
          Add Room
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaryCards.map((card) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className="text-2xl font-semibold text-slate-800 mt-1">{card.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color}`}>
                <card.icon className="text-white" size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Room Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roomCards.map((card) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="text-2xl font-semibold text-slate-800 mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color}`}>
                  <card.icon className="text-white" size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Occupancy Rate</h2>
        <OccupancyChart stats={stats} />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Rooms</h2>
        <RoomList key={refreshKey} onSelectRoom={setSelectedRoom} />
      </div>

      {selectedRoom && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          onClick={() => setSelectedRoom(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-slate-800">
              Room {selectedRoom.roomNumber}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Block {selectedRoom.block} · Floor {selectedRoom.floor}
            </p>
            <p className="text-sm text-slate-600 mt-3">
              {selectedRoom.students.length} / {selectedRoom.capacity} students assigned
            </p>
            <button
              onClick={() => setSelectedRoom(null)}
              className="mt-5 w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}

      <RoomFormModal
        isOpen={isAddRoomOpen}
        onClose={() => setIsAddRoomOpen(false)}
        onCreated={handleRoomCreated}
      />
    </div>
  );
}