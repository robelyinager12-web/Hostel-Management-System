'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { visitorService } from '@/services/visitorService';

export default function SecurityDashboardPage() {
  const [activeVisitors, setActiveVisitors] = useState<number | null>(null);

  useEffect(() => {
    visitorService
      .getAll(true)
      .then((res) => setActiveVisitors(res.data.data.length))
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load visitors'));
  }, []);

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Security Overview</h1>
        <p className="text-slate-500 text-sm mt-1">
          Monitor visitor activity and hostel access.
        </p>
      </div>

      <Link href="/admin/visitors">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4 }}
          className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow max-w-xs"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Visitors Currently Inside</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">{activeVisitors ?? '—'}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600">
              <UserPlus className="text-white" size={20} />
            </div>
          </div>
        </motion.div>
      </Link>

      <div className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm max-w-md">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="text-emerald-500" size={18} />
          <h2 className="text-sm font-semibold text-slate-700">Access Log</h2>
        </div>
        <p className="text-sm text-slate-400">
          Full visitor check-in and check-out history is available in the Visitors page.
        </p>
      </div>
    </div>
  );
}