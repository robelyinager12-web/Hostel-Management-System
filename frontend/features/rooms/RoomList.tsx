'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Loader2, DoorClosed } from 'lucide-react';
import { toast } from 'sonner';
import RoomCard from './RoomCard';
import { roomService } from '@/services/roomService';
import type { Room, RoomStatus } from '@/types/room';

const STATUS_FILTERS: Array<{ label: string; value: RoomStatus | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Available', value: 'AVAILABLE' },
  { label: 'Occupied', value: 'OCCUPIED' },
  { label: 'Maintenance', value: 'MAINTENANCE' },
  { label: 'Reserved', value: 'RESERVED' },
];

interface RoomListProps {
  onSelectRoom?: (room: Room) => void;
}

export default function RoomList({ onSelectRoom }: RoomListProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RoomStatus | 'ALL'>('ALL');

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = statusFilter !== 'ALL' ? { status: statusFilter } : undefined;
      const res = await roomService.getAll(params);
      setRooms(res.data.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const filteredRooms = rooms.filter((room) =>
    `${room.roomNumber} ${room.block}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by room number or block..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <SlidersHorizontal size={16} className="text-slate-400 shrink-0" />
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`text-sm px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                statusFilter === filter.value
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'bg-white/70 text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="animate-spin mr-2" size={20} />
          Loading rooms...
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <DoorClosed size={32} className="mb-2" />
          <p className="text-sm">No rooms match your search.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} onClick={onSelectRoom} />
          ))}
        </motion.div>
      )}
    </div>
  );
}