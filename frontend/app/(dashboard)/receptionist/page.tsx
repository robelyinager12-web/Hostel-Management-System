'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserPlus, DoorOpen, Users } from 'lucide-react';
import { toast } from 'sonner';
import { visitorService } from '@/services/visitorService';
import { roomService } from '@/services/roomService';

export default function ReceptionistDashboardPage() {
  const [activeVisitors, setActiveVisitors] = useState<number | null>(null);
  const [roomStats, setRoomStats] = useState<{ available: number; total: number } | null>(null);

  useEffect(() => {
    visitorService
      .getAll(true)
      .then((res) => setActiveVisitors(res.data.data.length))
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load visitors'));

    roomService
      .getStats()
      .then((res) => setRoomStats(res.data.data))
      .catch(() => {});
  }, []);

  const cards = [
    {
      label: 'Visitors Currently Inside',
      value: activeVisitors ?? '—',
      icon: UserPlus,
      color: 'from-indigo-500 to-indigo-600',
      href: '/admin/visitors',
    },
    {
      label: 'Available Rooms',
      value: roomStats?.available ?? '—',
      icon: DoorOpen,
      color: 'from-emerald-500 to-emerald-600',
      href: '/admin/rooms',
    },
    {
      label: 'Total Rooms',
      value: roomStats?.total ?? '—',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      href: '/admin/rooms',
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Reception Overview</h1>
        <p className="text-slate-500 text-sm mt-1">Visitor check-ins and room availability.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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