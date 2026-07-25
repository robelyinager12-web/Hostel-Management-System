'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  DoorOpen,
  Users,
  Wallet,
  MessageSquareWarning,
  UserPlus,
  Bell,
  Settings,
  GraduationCap,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const NAV_ITEMS: Record<string, Array<{ label: string; href: string; icon: any }>> = {
  ADMINISTRATOR: [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Rooms', href: '/admin/rooms', icon: DoorOpen },
    { label: 'Students', href: '/admin/students', icon: Users },
    { label: 'Fees', href: '/admin/fees', icon: Wallet },
    { label: 'Complaints', href: '/admin/complaints', icon: MessageSquareWarning },
    { label: 'Visitors', href: '/admin/visitors', icon: UserPlus },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ],
  STUDENT: [
    { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
    { label: 'My Room', href: '/student/room', icon: DoorOpen },
    { label: 'Fees', href: '/student/fees', icon: Wallet },
    { label: 'Complaints', href: '/student/complaints', icon: MessageSquareWarning },
    { label: 'Announcements', href: '/student/announcements', icon: Bell },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();
  const role = useAuthStore((s) => s.user?.role) || 'ADMINISTRATOR';
  const items = NAV_ITEMS[role] || NAV_ITEMS.ADMINISTRATOR;

  return (
    <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 bg-white/70 backdrop-blur-xl border-r border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600">
          <GraduationCap className="text-white" size={20} />
        </div>
        <span className="font-semibold text-slate-800">Heroy Hostel</span>
      </div>

      <nav className="flex-1 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}