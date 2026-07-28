'use client';

import { motion } from 'framer-motion';
import { DoorOpen, Wallet, MessageSquareWarning, Bell, CalendarClock } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function StudentDashboardPage() {
  const user = useAuthStore((s) => s.user);

  const quickLinks = [
    { label: 'My Room', href: '/student/room', icon: DoorOpen, color: 'from-indigo-500 to-indigo-600' },
    { label: 'Fees', href: '/student/fees', icon: Wallet, color: 'from-emerald-500 to-emerald-600' },
    {
      label: 'Complaints',
      href: '/student/complaints',
      icon: MessageSquareWarning,
      color: 'from-orange-500 to-orange-600',
    },
    {
      label: 'Announcements',
      href: '/student/announcements',
      icon: Bell,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Welcome back, {user?.fullName?.split(' ')[0] || 'Student'}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Here's a quick look at your hostel life today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link) => (
          <motion.a
            key={link.label}
            href={link.href}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${link.color} mb-3`}>
              <link.icon className="text-white" size={20} />
            </div>
            <p className="text-sm font-medium text-slate-700">{link.label}</p>
          </motion.a>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <CalendarClock size={18} className="text-indigo-500" />
            Upcoming
          </h2>
          <p className="text-sm text-slate-400">
            No upcoming fee deadlines or leave approvals right now.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Bell size={18} className="text-purple-500" />
            Recent Announcements
          </h2>
          <p className="text-sm text-slate-400">No announcements posted yet.</p>
        </div>
      </div>
    </div>
  );
}