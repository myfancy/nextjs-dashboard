import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';
 
export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-violet-800 to-blue-900 px-4 py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-fuchsia-400/30 blur-3xl" />
        <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-violet-400/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-sky-400/30 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-[400px] [perspective:1200px]">
        <div aria-hidden="true" className="absolute -bottom-6 left-8 right-8 h-12 rounded-full bg-black/40 blur-2xl" />
        <div className="relative flex flex-col overflow-hidden rounded-2xl bg-white/95 shadow-[0_28px_70px_-18px_rgba(5,8,40,0.7),0_12px_28px_-12px_rgba(0,0,0,0.45)] ring-1 ring-white/40 backdrop-blur transition-[transform,box-shadow] duration-500 [transform:rotateX(2deg)] hover:-translate-y-2 hover:[transform:rotateX(0deg)] hover:shadow-[0_38px_85px_-18px_rgba(5,8,40,0.78),0_18px_36px_-14px_rgba(0,0,0,0.5)]">
          <div className="flex h-20 w-full items-end bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-700 p-3 md:h-36">
            <div className="w-32 text-white md:w-36">
              <AcmeLogo />
            </div>
          </div>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}