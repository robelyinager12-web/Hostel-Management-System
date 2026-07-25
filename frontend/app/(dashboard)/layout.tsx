'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import Navbar from '@/components/shared/Navbar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:pl-64">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}