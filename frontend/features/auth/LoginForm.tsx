'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginSchema, type LoginInput } from './authSchema';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';

export default function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await authService.login(data);
      setUser(res.data.user);
      toast.success('Welcome back!');
      router.push(`/${res.data.user.role.toLowerCase()}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Invalid username or password');
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm ' +
    'text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 ' +
    'focus:ring-indigo-500 focus:border-transparent transition-shadow';

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-md"
    >
      <h1 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Welcome Back!
      </h1>
      <p className="text-slate-500 text-sm -mt-3">Sign in to continue</p>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
        <input type="text" {...register('username')} className={inputClass} />
        {errors.username && (
          <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-slate-600">
          <input type="checkbox" {...register('rememberMe')} className="rounded border-slate-300" />
          Remember Me
        </label>
        <Link href="/forgot-password" className="text-indigo-600 hover:underline">
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 rounded-xl text-white text-sm font-medium
          bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90
          disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 className="animate-spin" size={16} />}
        {isSubmitting ? 'Signing in...' : 'Login'}
      </button>
    </motion.form>
  );
}