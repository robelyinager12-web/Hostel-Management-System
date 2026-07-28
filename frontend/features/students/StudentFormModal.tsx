'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { studentService } from '@/services/studentService';
import { roomService } from '@/services/roomService';
import type { Room } from '@/types/room';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function StudentFormModal({ isOpen, onClose, onCreated }: StudentFormModalProps) {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [password, setPassword] = useState('');
  const [roomId, setRoomId] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{ username: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      roomService
        .getAll()
        .then((res) => setRooms(res.data.data.filter((r) => !r.isFull)))
        .catch(() => {});
    }
  }, [isOpen]);

  const resetForm = () => {
    setFullName('');
    setUsername('');
    setEmail('');
    setPhoneNumber('');
    setGender('');
    setStudentId('');
    setDepartment('');
    setAcademicYear('');
    setPassword('');
    setRoomId('');
    setCreatedCredentials(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !username || !email || !studentId || !department || !academicYear || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await studentService.create({
        fullName,
        username,
        email,
        phoneNumber,
        gender,
        studentId,
        department,
        academicYear,
        password,
        roomId: roomId || undefined,
      });
      toast.success('Student created successfully');
      setCreatedCredentials(res.data.data.credentials);
      onCreated();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCredentials = () => {
    if (!createdCredentials) return;
    navigator.clipboard.writeText(
      `Username: ${createdCredentials.username}\nPassword: ${createdCredentials.password}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          onClick={handleClose}
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
              <h2 className="text-lg font-semibold text-slate-800">Add Student</h2>
              <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <X size={18} />
              </button>
            </div>

            {createdCredentials ? (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <p className="text-sm text-emerald-700 font-medium mb-2">
                    Student created — share these credentials with them:
                  </p>
                  <div className="bg-white rounded-lg p-3 text-sm font-mono text-slate-700 space-y-1">
                    <p>Username: {createdCredentials.username}</p>
                    <p>Password: {createdCredentials.password}</p>
                  </div>
                </div>
                <button
                  onClick={copyCredentials}
                  className="w-full py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                  {copied ? 'Copied' : 'Copy credentials'}
                </button>
                <button
                  onClick={handleClose}
                  className="w-full py-2.5 rounded-lg text-white text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Username</label>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Student ID</label>
                    <input value={studentId} onChange={(e) => setStudentId(e.target.value)} className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                    <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className={inputClass}>
                      <option value="">Select</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
                    <input value={department} onChange={(e) => setDepartment(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Academic Year</label>
                    <input value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Assign Room (optional)
                    </label>
                    <select value={roomId} onChange={(e) => setRoomId(e.target.value)} className={inputClass}>
                      <option value="">No room yet</option>
                      {rooms.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.roomNumber} ({r.block}) — {r.occupancy ?? r.students.length}/{r.capacity}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Initial Password
                    </label>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Set a password for this student"
                      className={inputClass}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-lg text-white text-sm font-medium
                    bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90
                    disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                >
                  {isSubmitting && <Loader2 className="animate-spin" size={15} />}
                  {isSubmitting ? 'Creating...' : 'Create Student'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}