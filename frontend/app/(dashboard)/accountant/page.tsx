'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wallet, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { feeService } from '@/services/feeService';

export default function AccountantDashboardPage() {
  const [pending, setPending] = useState<number | null>(null);
  const [paid, setPaid] = useState<number | null>(null);

  useEffect(() => {
    feeService
      .getAll('PENDING')
      .then((res) => setPending(res.data.data.length))
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load fees'));

    feeService
      .getAll('PAID')
      .then((res) => setPaid(res.data.data.length))
      .catch(() => {});
  }, []);

  const cards = [
    {
      label: 'Pending Payments',
      value: pending ?? '—',
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
    },
    {
      label: 'Paid This Term',
      value: paid ?? '—',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-emerald-600',
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Accounts Overview</h1>
        <p className="text-slate-500 text-sm mt-1">Student fee status and payment tracking.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        {cards.map((card) => (
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

      <Link
        href="/admin/fees"
        className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
      >
        <Wallet size={16} />
        View full fee records and mark payments
      </Link>
    </div>
  );
}