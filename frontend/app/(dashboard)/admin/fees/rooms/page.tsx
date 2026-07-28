'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import RoomList from '@/features/rooms/RoomList';
import RoomFormModal from '@/features/rooms/RoomFormModal';
import type { Room } from '@/types/room';

export default function AdminRoomsPage() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Rooms</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage all hostel rooms, capacity, and status.
          </p>
        </div>
        <button
          onClick={() => setIsAddRoomOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90"
        >
          <Plus size={16} />
          Add Room
        </button>
      </div>

      <RoomList key={refreshKey} onSelectRoom={setSelectedRoom} />

      {selectedRoom && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          onClick={() => setSelectedRoom(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-slate-800">
              Room {selectedRoom.roomNumber}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Block {selectedRoom.block} · Floor {selectedRoom.floor}
            </p>
            <p className="text-sm text-slate-600 mt-3">
              {selectedRoom.students.length} / {selectedRoom.capacity} students assigned
            </p>
            <button
              onClick={() => setSelectedRoom(null)}
              className="mt-5 w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <RoomFormModal
        isOpen={isAddRoomOpen}
        onClose={() => setIsAddRoomOpen(false)}
        onCreated={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}