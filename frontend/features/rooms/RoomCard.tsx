'use client';

import { motion } from 'framer-motion';
import { Users, Wifi, DoorOpen, Wrench } from 'lucide-react';
import type { Room } from '@/types/room';

const statusStyles: Record<Room['status'], string> = {
  AVAILABLE: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  OCCUPIED: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  MAINTENANCE: 'bg-orange-50 text-orange-600 border-orange-200',
  RESERVED: 'bg-slate-50 text-slate-600 border-slate-200',
};

interface RoomCardProps {
  room: Room;
  onClick?: (room: Room) => void;
}

export default function RoomCard({ room, onClick }: RoomCardProps) {
  const occupancy = room.occupancy ?? room.students.length;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => onClick?.(room)}
      className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Room {room.roomNumber}</h3>
          <p className="text-sm text-slate-500">
            Block {room.block} · Floor {room.floor}
          </p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyles[room.status]}`}
        >
          {room.status.charAt(0) + room.status.slice(1).toLowerCase()}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
        <Users size={16} className="text-indigo-500" />
        <span>
          {occupancy}/{room.capacity} occupied
        </span>
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden ml-2">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            style={{ width: `${Math.min((occupancy / room.capacity) * 100, 100)}%` }}
          />
        </div>
      </div>

      {room.amenities.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {room.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg"
            >
              <Wifi size={12} />
              {amenity}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <DoorOpen size={14} /> {room.status === 'AVAILABLE' ? 'Ready' : 'In use'}
        </span>
        {room.status === 'MAINTENANCE' && (
          <span className="flex items-center gap-1 text-orange-500">
            <Wrench size={14} /> Under maintenance
          </span>
        )}
      </div>
    </motion.div>
  );
}