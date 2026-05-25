"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
    >
      {loading ? 'Signing out...' : 'Sign Out'}
    </button>
  );
}
