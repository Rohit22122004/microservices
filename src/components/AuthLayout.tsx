import React from 'react';

// Lightweight sci‑fi/starfield background and centered auth card layout,
// designed to wrap existing forms WITHOUT changing inputs/buttons/API calls.
// Usage:
// <AuthLayout title="Sign in" subtitle={<Link to="/register">Create account</Link>}>
//   ... your form ...
// </AuthLayout>

interface AuthLayoutProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className="auth-bg min-h-screen w-full relative overflow-hidden flex items-center justify-center py-8 px-4">
      {/* Decorative top bar */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full brand-grad shadow-lg flex items-center justify-center text-white font-bold">E</div>
            <span className="text-white/90 font-semibold tracking-wide">Ecommerce</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-white/70">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-sm">Secure Portal</div>
          </div>
        </div>
      </div>

      {/* Floating orbs */}
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full orb-left blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-24 h-72 w-72 rounded-full orb-right blur-3xl" />

      {/* Card */}
      <div className="relative z-20 w-full max-w-md">
        <div className="auth-card rounded-3xl p-6 sm:p-8">
          {/* Avatar / title area */}
          <div className="flex flex-col items-center mb-6">
            <div className="h-14 w-14 rounded-2xl brand-grad shadow-lg flex items-center justify-center text-white font-bold text-xl">
              <span>🔒</span>
            </div>
            <h2 className="mt-4 text-center text-2xl font-extrabold text-white">{title}</h2>
            {subtitle ? (
              <p className="mt-2 text-center text-sm text-white/70">{subtitle}</p>
            ) : null}
          </div>

          {/* Content (form passed by parent) */}
          {children}
        </div>

        {/* Card bottom glow */}
        <div className="absolute -inset-x-6 -bottom-6 h-24 blur-2xl" style={{ background: 'linear-gradient(90deg, rgba(24,154,180,0.35), rgba(117,230,218,0.35), rgba(24,154,180,0.35))' }} />
      </div>
    </div>
  );
};

export default AuthLayout;
