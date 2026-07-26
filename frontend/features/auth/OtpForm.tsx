'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, MailCheck } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/services/authService';

const RESEND_COOLDOWN_SECONDS = 60;

export default function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = pasted.split('');
    while (next.length < 6) next.push('');
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const otp = digits.join('');
    if (otp.length !== 6) {
      toast.error('Enter all 6 digits');
      return;
    }
    if (!email) {
      toast.error('Missing email — go back and register again');
      return;
    }

    setIsVerifying(true);
    try {
      await authService.verifyOtp(email, otp);
      toast.success('Email verified — you can now log in');
      router.push('/login');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0) return;

    setIsResending(true);
    try {
      const res = await authService.resendOtp(email);
      toast.success('A new code has been sent');
      // In development, the API returns the OTP directly since SMTP may not be configured.
      if (res.data.data?.otp) {
        toast.info(`Dev mode — your OTP is ${res.data.data.otp}`);
      }
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm mx-auto text-center"
    >
      <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-4">
        <MailCheck className="text-white" size={24} />
      </div>

      <h1 className="text-xl font-semibold text-slate-800">Verify your email</h1>
      <p className="text-sm text-slate-500 mt-1">
        Enter the 6-digit code sent to{' '}
        <span className="font-medium text-slate-700">{email || 'your email'}</span>
      </p>

      <div className="flex justify-center gap-2 mt-6">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className="w-11 h-13 sm:w-12 sm:h-14 text-center text-lg font-semibold rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        disabled={isVerifying}
        className="w-full mt-6 py-2.5 rounded-xl text-white text-sm font-medium
          bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90
          disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {isVerifying && <Loader2 className="animate-spin" size={16} />}
        {isVerifying ? 'Verifying...' : 'Verify Email'}
      </button>

      <button
        onClick={handleResend}
        disabled={isResending || cooldown > 0}
        className="w-full mt-3 py-2 text-sm text-indigo-600 hover:underline disabled:text-slate-400 disabled:no-underline"
      >
        {cooldown > 0 ? `Resend code in ${cooldown}s` : isResending ? 'Sending...' : 'Resend code'}
      </button>
    </motion.div>
  );
}