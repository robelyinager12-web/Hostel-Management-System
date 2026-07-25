'use client';

import { useRouter } from 'next/navigation';
import { Bell, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';

export default function Navbar() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // even if the request fails, clear local state so the user isn't stuck
    } finally {
      clearUser();
      toast.success('Logged out');
      router.push('/login');
    }
  };

  return (
    <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30">
      <div />

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 pl-2 pr-1 py-1.5 rounded-xl hover:bg-slate-100"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
              {user?.fullName?.charAt(0) || '?'}
            </div>
            <span className="text-sm text-slate-700 hidden sm:inline">
              {user?.fullName || 'Guest'}
            </span>
            <ChevronDown size={16} className="text-slate-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-100 rounded-xl shadow-lg py-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-slate-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}