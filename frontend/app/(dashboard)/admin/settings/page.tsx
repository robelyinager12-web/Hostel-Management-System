'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';

export default function AdminSettingsPage() {
  const user = useAuthStore((s) => s.user);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClass =
    'w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account details and security.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm max-w-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <User className="text-indigo-500" size={18} />
          <h2 className="text-sm font-semibold text-slate-700">Account Info</h2>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Full Name</span>
            <span className="text-slate-700">{user?.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Username</span>
            <span className="text-slate-700">{user?.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Email</span>
            <span className="text-slate-700">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Role</span>
            <span className="text-slate-700">{user?.role}</span>
          </div>
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleChangePassword}
        className="bg-white/70 backdrop-blur-xl border border-slate-100 rounded-2xl p-5 shadow-sm max-w-lg space-y-3"
      >
        <div className="flex items-center gap-2 mb-1">
          <Lock className="text-indigo-500" size={18} />
          <h2 className="text-sm font-semibold text-slate-700">Change Password</h2>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-lg text-white text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
        >
          {isSubmitting && <Loader2 className="animate-spin" size={15} />}
          {isSubmitting ? 'Updating...' : 'Change Password'}
        </button>
      </motion.form>
    </div>
  );
}