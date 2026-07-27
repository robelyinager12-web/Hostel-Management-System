'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import Navbar from '@/components/shared/Navbar';
import AssistantWidget from '@/components/ai-assistant/AssistantWidget';
import { useAuthStore } from '@/store/authStore';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const role = useAuthStore((s) => s.user?.role);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:pl-64">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
      {role === 'STUDENT' && <AssistantWidget />}
    </div>
  );
}