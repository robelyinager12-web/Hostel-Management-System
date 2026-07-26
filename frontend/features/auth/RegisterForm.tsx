'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { registerSchema, type RegisterInput } from './authSchema';
import { authService } from '@/services/authService';

const passwordStrength = (value: string) => {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return score; // 0-4
};

const strengthColor = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-emerald-500',
];

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const password = watch('password') || '';
  const strength = passwordStrength(password);

  const onSubmit = async (data: RegisterInput) => {
    try {
      await authService.register(data);
      toast.success('Account created — check your email for the OTP code');
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    }
  };

  const inputClass =
    'w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white/70 backdrop-blur-sm ' +
    'text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 ' +
    'focus:ring-indigo-500 focus:border-transparent transition-shadow';

  const labelClass = 'block text-xs font-medium text-slate-700 mb-1';

  const fields: Array<[string, keyof RegisterInput, string]> = [
    ['Full Name', 'fullName', 'text'],
    ['Username', 'username', 'text'],
    ['Student ID', 'studentId', 'text'],
    ['University Email', 'email', 'email'],
    ['Phone Number', 'phoneNumber', 'tel'],
    ['Department', 'department', 'text'],
    ['Academic Year', 'academicYear', 'text'],
  ];

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 w-full"
    >
      <h1 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Register
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map(([label, name, type]) => (
          <div key={name}>
            <label className={labelClass}>{label}</label>
            <input type={type} {...register(name)} className={inputClass} />
            {errors[name] && (
              <p className="text-red-500 text-[11px] mt-0.5">{errors[name]?.message as string}</p>
            )}
          </div>
        ))}

        <div>
          <label className={labelClass}>Gender</label>
          <select {...register('gender')} className={inputClass}>
            <option value="">Select</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-[11px] mt-0.5">{errors.gender.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {password && (
            <div className="mt-1 h-1 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-full flex-1 rounded-full transition-colors ${
                    i < strength ? strengthColor[strength] : 'bg-slate-100'
                  }`}
                />
              ))}
            </div>
          )}
          {errors.password && (
            <p className="text-red-500 text-[11px] mt-0.5">{errors.password.message}</p>
          )}
        </div>

        <div className="col-span-1 sm:col-span-2">
          <label className={labelClass}>Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              {...register('confirmPassword')}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-[11px] mt-0.5">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <label className="flex items-center gap-2 text-xs text-slate-600 pt-1">
        <input type="checkbox" {...register('agreeToTerms')} className="rounded border-slate-300" />
        I agree to the Terms & Conditions
      </label>
      {errors.agreeToTerms && (
        <p className="text-red-500 text-[11px]">{errors.agreeToTerms.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 rounded-lg text-white text-sm font-medium
          bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90
          disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 className="animate-spin" size={15} />}
        {isSubmitting ? 'Creating account...' : 'Register'}
      </button>
    </motion.form>
  );
}