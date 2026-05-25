"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CREW', // Default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const roles = [
    {
      value: 'DIRECTOR',
      label: 'Director',
      desc: 'Oversees creative direction & scenes',
      icon: '🎬',
    },
    {
      value: 'PRODUCER',
      label: 'Producer',
      desc: 'Manages budget, schedule & crew',
      icon: '💼',
    },
    {
      value: 'CREW',
      label: 'Crew',
      desc: 'Handles technical and on-set tasks',
      icon: '🛠️',
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role: string) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name.trim()) {
      setError('Name is required.');
      setLoading(false);
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required.');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-zinc-950 text-slate-100 px-4 py-12 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>

      <div className="w-full max-w-lg bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl space-y-6 transition-all duration-300">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
            Smart Film App
          </h1>
          <p className="text-slate-400 text-sm">
            Create an account to manage your film productions
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-shake">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <span>✅</span>
            <span>Registration successful! Redirecting to login...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              disabled={loading || success}
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none text-slate-100 placeholder-slate-600 transition-all duration-200"
              placeholder="e.g. Christopher Nolan"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={loading || success}
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none text-slate-100 placeholder-slate-600 transition-all duration-200"
              placeholder="name@production.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              disabled={loading || success}
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none text-slate-100 placeholder-slate-600 transition-all duration-200"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Production Role
            </span>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((role) => {
                const isSelected = formData.role === role.value;
                return (
                  <button
                    key={role.value}
                    type="button"
                    disabled={loading || success}
                    onClick={() => handleRoleSelect(role.value)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-violet-500 bg-violet-950/20 text-violet-200 shadow-md ring-2 ring-violet-500/10'
                        : 'border-slate-800/80 bg-slate-950/30 text-slate-400 hover:border-slate-700 hover:bg-slate-900/30'
                    }`}
                  >
                    <span className="text-2xl mb-1">{role.icon}</span>
                    <span className="text-xs font-bold">{role.label}</span>
                    <span className="text-[9px] text-slate-500 mt-1 leading-tight hidden sm:block">
                      {role.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-3.5 px-4 mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Register</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-violet-400 hover:text-violet-300 font-semibold underline decoration-violet-500/30 hover:decoration-violet-500 transition-all duration-200"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
