import { ReactNode } from 'react';
import { getSession } from '../../lib/auth';
import { redirect } from 'next/navigation';
import LogoutButton from './LogoutButton';
import SidebarNav from './SidebarNav';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  // Enforce server-side authentication
  if (!session) {
    redirect('/login');
  }

  // Define role badge styling
  const roleColors: Record<string, string> = {
    DIRECTOR: 'bg-rose-500/10 text-rose-300 border-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.04)]',
    PRODUCER: 'bg-purple-500/10 text-purple-300 border-purple-500/20 shadow-[0_0_12px_rgba(168,85,247,0.04)]',
    CREW: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.04)]',
  };

  const badgeClass = roleColors[session.role] || 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20';

  return (
    <div className="relative flex min-h-screen flex-col md:flex-row bg-[#0c0c0e] text-zinc-100 font-sans overflow-hidden">
      {/* Neon Backlight Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[20%] w-[550px] h-[550px] bg-purple-600/5 rounded-full blur-[130px] animate-spatial-glow-1 -z-10" />
        <div className="absolute bottom-[15%] right-[10%] w-[650px] h-[650px] bg-violet-600/5 rounded-full blur-[140px] animate-spatial-glow-2 -z-10" />
      </div>

      {/* Sidebar Navigation */}
      <aside className="relative z-10 w-full md:w-64 bg-zinc-900/30 backdrop-blur-2xl border-b md:border-b-0 md:border-r border-white/[0.08] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] flex flex-col justify-between p-6 shrink-0 transition-all duration-500 ease-out">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <span className="text-xl drop-shadow-[0_2px_12px_rgba(168,85,247,0.55)]">🎬</span>
            <span className="text-sm font-black tracking-[0.25em] bg-gradient-to-r from-purple-400 via-zinc-100 to-indigo-400 bg-clip-text text-transparent uppercase font-mono">
              Smart Film App
            </span>
          </div>

          <SidebarNav />
        </div>

        {/* Footer info in sidebar */}
        <div className="pt-6 border-t border-white/[0.05] mt-6 hidden md:block">
          <p className="text-[8px] text-zinc-650 font-mono tracking-[0.25em] uppercase">
            © 2026 Smart Film Prod.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 bg-transparent">
        <header className="flex justify-between items-center p-6 border-b border-white/[0.08] bg-zinc-900/10 backdrop-blur-2xl">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.25em] font-mono">Management System</span>
            <h2 className="text-sm font-black tracking-[0.25em] text-zinc-100 uppercase mt-1">Overview</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-xs font-semibold text-zinc-200 tracking-wide">{session.name}</span>
              <span className={`text-[8px] font-bold px-2 py-0.5 rounded border border-white/[0.05] mt-1.5 tracking-[0.2em] uppercase font-mono ${badgeClass}`}>
                {session.role}
              </span>
            </div>
            <LogoutButton />
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto relative">
          {children}
        </main>
      </div>
    </div>
  );
}
