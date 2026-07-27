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
  Wrench,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';

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
  HOSTEL_MANAGER: [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Rooms', href: '/admin/rooms', icon: DoorOpen },
    { label: 'Students', href: '/admin/students', icon: Users },
    { label: 'Fees', href: '/admin/fees', icon: Wallet },
    { label: 'Complaints', href: '/admin/complaints', icon: MessageSquareWarning },
    { label: 'Visitors', href: '/admin/visitors', icon: UserPlus },
  ],
  STUDENT: [
    { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
    { label: 'My Room', href: '/student/room', icon: DoorOpen },
    { label: 'Fees', href: '/student/fees', icon: Wallet },
    { label: 'Complaints', href: '/student/complaints', icon: MessageSquareWarning },
    { label: 'Announcements', href: '/student/announcements', icon: Bell },
  ],
  WARDEN: [
    { label: 'Dashboard', href: '/warden', icon: LayoutDashboard },
    { label: 'Complaints', href: '/admin/complaints', icon: MessageSquareWarning },
    { label: 'Maintenance', href: '/maintenance', icon: Wrench },
    { label: 'Rooms', href: '/admin/rooms', icon: DoorOpen },
  ],
  RECEPTIONIST: [
    { label: 'Dashboard', href: '/receptionist', icon: LayoutDashboard },
    { label: 'Visitors', href: '/admin/visitors', icon: UserPlus },
    { label: 'Rooms', href: '/admin/rooms', icon: DoorOpen },
  ],
  SECURITY_GUARD: [
    { label: 'Dashboard', href: '/security', icon: LayoutDashboard },
    { label: 'Visitors', href: '/admin/visitors', icon: UserPlus },
  ],
  MAINTENANCE_STAFF: [
    { label: 'Dashboard', href: '/maintenance', icon: LayoutDashboard },
    { label: 'Requests', href: '/maintenance', icon: Wrench },
  ],
  ACCOUNTANT: [
    { label: 'Dashboard', href: '/accountant', icon: LayoutDashboard },
    { label: 'Fees', href: '/admin/fees', icon: Wallet },
  ],
};

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const role = useAuthStore((s) => s.user?.role) || 'ADMINISTRATOR';
  const items = NAV_ITEMS[role] || NAV_ITEMS.ADMINISTRATOR;

  return (
    <>
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
              onClick={onNavigate}
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
    </>
  );
}

export default function Sidebar() {
  const isMobileSidebarOpen = useUIStore((s) => s.isMobileSidebarOpen);
  const closeMobileSidebar = useUIStore((s) => s.closeMobileSidebar);

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 bg-white/70 backdrop-blur-xl border-r border-slate-100 p-5">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileSidebar}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-72 bg-white flex flex-col p-5 z-50 lg:hidden"
            >
              <button
                onClick={closeMobileSidebar}
                className="absolute top-5 right-5 p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X size={18} />
              </button>
              <SidebarContent onNavigate={closeMobileSidebar} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}