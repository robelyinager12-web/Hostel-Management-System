'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DoorOpen, Users, Wifi, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { studentService } from '@/services/studentService';
import type { Room } from '@/types/room';

export default function MyRoomPage() {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentService
      .getMyRoom()
      .then((res) => setRoom(res.data.data))
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to load room'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">My Room</h1>
        <p className="text-slate-500 text-sm mt-1">Your current hostel room assignment.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="animate-spin mr-2" size={20} />
          Loading room details...
        </div>
      ) : !room ? (
        <div className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-8 text-center">
          <DoorOpen className="mx-auto text-slate-300 mb-3" size={36} />
          <p className="text-slate-500 text-sm">
            You haven't been assigned a room yet. Check back soon, or contact the hostel office.
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-6 shadow-sm max-w-2xl"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Room {room.roomNumber}</h2>
              <p className="text-sm text-slate-500">
                Block {room.block} · Floor {room.floor}
              </p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full border bg-emerald-50 text-emerald-600 border-emerald-200">
              {room.status.charAt(0) + room.status.slice(1).toLowerCase()}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <Users size={16} className="text-indigo-500" />
            <span>
              {room.students?.length || 0}/{room.capacity} occupants
            </span>
          </div>

          {room.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {room.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg"
                >
                  <Wifi size={12} />
                  {amenity}
                </span>
              ))}
            </div>
          )}

          {room.students && room.students.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-medium text-slate-700 mb-2">Roommates</h3>
              <div className="space-y-2">
                {room.students.map((s) => (
                  <div key={s.id} className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs">
                      {s.user.fullName.charAt(0)}
                    </div>
                    {s.user.fullName}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}