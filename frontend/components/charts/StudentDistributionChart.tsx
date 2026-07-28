'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface StudentDistributionChartProps {
  data: Array<{ department: string; count: number }>;
}

const COLORS = ['#4F46E5', '#7C3AED', '#F97316', '#10B981', '#38BDF8', '#F43F5E', '#FBBF24'];

export default function StudentDistributionChart({ data }: StudentDistributionChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
        No student data yet.
      </div>
    );
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="department"
            innerRadius={50}
            outerRadius={85}
            paddingAngle={3}
          >
            {data.map((entry, i) => (
              <Cell key={entry.department} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}