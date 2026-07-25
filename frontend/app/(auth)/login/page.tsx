'use client';

import { motion } from 'framer-motion';
import { GraduationCap, ShieldCheck, BedDouble, BookOpen } from 'lucide-react';
import Link from 'next/link';
import LoginForm from '@/features/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-[#F8FAFC]">
      {/* Left: Premium hostel image */}
      <div className="hidden lg:flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-500 p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md aspect-square rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden"
        >
          {/* Placeholder mount point — swap for the premium hostel photo/asset
              at public/illustrations/hostel-login.jpg */}
          <img
            src="/illustrations/hostel-login.jpg"
            alt="Premium modern university hostel dormitory"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-16 right-16 bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20"
        >
          <ShieldCheck className="text-white" size={22} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-24 left-12 bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20"
        >
          <BedDouble className="text-white" size={22} />
        </motion.div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-10 bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20"
        >
          <BookOpen className="text-white" size={22} />
        </motion.div>

        <div className="relative z-10 mt-10 text-center">
          <h2 className="text-2xl font-semibold text-white">Hostel Management System</h2>
          <p className="text-indigo-100 text-sm mt-2 max-w-sm">
            Smart Digital Hostel Management Platform
          </p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-slate-100 shadow-xl rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600">
              <GraduationCap className="text-white" size={20} />
            </div>
            <span className="font-semibold text-slate-800">Heroy Hostel</span>
          </div>

          <LoginForm />

          <p className="text-sm text-slate-500 mt-6 text-center">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-indigo-600 font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}