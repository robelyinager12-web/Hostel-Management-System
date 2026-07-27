'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquareWarning, Wrench, DoorOpen, Users } from 'lucide-react';
import { toast } from 'sonner';
import { complaintService } from '@/services/complaintService';
import { roomService } from '@/services/roomService';

export default function WardenDashboardPage() {
  const [openComplaints, setOpenComplaints] = useState<number | null>(null);
  const [roomStats, setRoomStats] = useState<{ total: number; occupied: number } | null>(null);

  useEffect(() => {
    complaintService
      .getAll('OPEN')
      .then((res) => setOpenComplaints(res.data.data.length))
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load complaints'));

    roomService
      .getStats()
      .then((res) => setRoomStats(res.data.data))
      .catch(() => {});
  }, []);

  const cards = [
    {
      label: 'Open Complaints',
      value: openComplaints ?? '—',
      icon: MessageSquareWarning,
      color: 'from-orange-500 to-orange-600',
      href: '/admin/complaints',
    },
    {
      label: 'Maintenance Requests',
      value: '—',
      icon: Wrench,
      color: 'from-purple-500 to-purple-600',
      href: '/maintenance',
    },
    {
      label: 'Occupied Rooms',
      value: roomStats?.occupied ?? '—',
      icon: DoorOpen,
      color: 'from-indigo-500 to-indigo-600',
      href: '/admin/rooms',
    },
    {
      label: 'Total Rooms',
      value: roomStats?.total ?? '—',
      icon: Users,
      color: 'from-emerald-500 to-emerald-600',
      href: '/admin/rooms',
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Warden Overview</h1>
        <p className="text-slate-500 text-sm mt-1">
          Student welfare, complaints, and room status at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow"
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
          </Link>
        ))}
      </div>
    </div>
  );
}