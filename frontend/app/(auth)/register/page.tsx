'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Wifi, Lock, Camera } from 'lucide-react';
import Link from 'next/link';
import RegisterForm from '@/features/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-[#F8FAFC] overflow-hidden">
      {/* Left: Illustration */}
      <div className="hidden lg:flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full h-full max-h-[85vh] rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="flex-1 overflow-hidden">
            <img
              src="/illustrations/hostel-register.jpg"
              alt="Modern university hostel dormitory"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 text-center bg-gradient-to-t from-black/30 to-transparent absolute bottom-0 left-0 right-0">
            <h2 className="text-xl font-semibold text-white">Create Your Hostel Account</h2>
            <p className="text-indigo-100 text-xs mt-1.5 max-w-sm mx-auto">
              Join our intelligent hostel management platform for a smarter and safer campus
              living experience.
            </p>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 right-10 bg-white/15 backdrop-blur-md rounded-2xl p-2.5 border border-white/20 z-20"
        >
          <Wifi className="text-white" size={18} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-16 left-8 bg-white/15 backdrop-blur-md rounded-2xl p-2.5 border border-white/20 z-20"
        >
          <Lock className="text-white" size={18} />
        </motion.div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 left-6 bg-white/15 backdrop-blur-md rounded-2xl p-2.5 border border-white/20 z-20"
        >
          <Camera className="text-white" size={18} />
        </motion.div>
      </div>

      {/* Right: Registration Form */}
      <div className="flex items-center justify-center p-4 sm:p-6 h-full overflow-y-auto">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-slate-100 shadow-xl rounded-2xl p-6 my-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
              <GraduationCap className="text-white" size={16} />
            </div>
            <span className="font-semibold text-slate-800 text-sm">Heroy Hostel</span>
          </div>

          <RegisterForm />

          <p className="text-xs text-slate-500 mt-4 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}