'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

interface RevenueChartProps {
  data: Array<{ semester: string; paid: number; pending: number }>;
}

export default function RevenueChart({ data }: RevenueChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
        No fee data yet — add fee records to see revenue trends.
      </div>
    );
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="semester" tick={{ fontSize: 12, fill: '#64748B' }} />
          <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
          <Tooltip
            formatter={(value: number) => `${value.toLocaleString()} ETB`}
            contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
          />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          <Bar dataKey="paid" name="Paid" fill="#10B981" radius={[6, 6, 0, 0]} />
          <Bar dataKey="pending" name="Pending" fill="#F97316" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}