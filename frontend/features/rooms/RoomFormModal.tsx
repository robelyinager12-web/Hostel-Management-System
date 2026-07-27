'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { roomService } from '@/services/roomService';

interface RoomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const AMENITY_OPTIONS = ['WiFi', 'Study Desk', 'Locker', 'AC', 'Attached Bathroom', 'Balcony'];

export default function RoomFormModal({ isOpen, onClose, onCreated }: RoomFormModalProps) {
  const [roomNumber, setRoomNumber] = useState('');
  const [block, setBlock] = useState('');
  const [floor, setFloor] = useState('');
  const [capacity, setCapacity] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity],
    );
  };

  const resetForm = () => {
    setRoomNumber('');
    setBlock('');
    setFloor('');
    setCapacity('');
    setAmenities([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomNumber || !block || !floor || !capacity) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await roomService.create({
        roomNumber,
        block,
        floor: Number(floor),
        capacity: Number(capacity),
        amenities,
      });
      toast.success('Room created successfully');
      resetForm();
      onCreated();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create room');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Add Room</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Room Number</label>
                  <input
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="A-101"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Block</label>
                  <input
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    placeholder="A"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Floor</label>
                  <input
                    type="number"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    placeholder="1"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="4"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITY_OPTIONS.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                        amenities.includes(amenity)
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-lg text-white text-sm font-medium
                  bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90
                  disabled:opacity-60 flex items-center justify-center gap-2 mt-4"
              >
                {isSubmitting && <Loader2 className="animate-spin" size={15} />}
                {isSubmitting ? 'Creating...' : 'Create Room'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}