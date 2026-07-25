'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface RoomStats {
  total: number;
  available: number;
  occupied: number;
  maintenance: number;
}

interface OccupancyChartProps {
  stats: RoomStats | null;
}

const COLORS = {
  Available: '#10B981',
  Occupied: '#4F46E5',
  Maintenance: '#F97316',
};

export default function OccupancyChart({ stats }: OccupancyChartProps) {
  if (!stats) {
    return <div className="h-64 flex items-center justify-center text-slate-400 text-sm">Loading chart...</div>;
  }

  const data = [
    { name: 'Available', value: stats.available },
    { name: 'Occupied', value: stats.occupied },
    { name: 'Maintenance', value: stats.maintenance },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
        No room data yet — add rooms to see occupancy.
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name as keyof typeof COLORS]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}