import { Suspense } from 'react';
import OtpForm from '@/features/auth/OtpForm';

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-slate-100 shadow-xl rounded-2xl p-6 sm:p-8">
        <Suspense fallback={null}>
          <OtpForm />
        </Suspense>
      </div>
    </div>
  );
}