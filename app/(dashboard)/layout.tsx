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
    DIRECTOR: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    PRODUCER: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    CREW: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  };

  const badgeClass = roleColors[session.role] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800/80 flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎬</span>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Smart Film App
            </span>
          </div>

          <SidebarNav />
        </div>

        {/* Footer info in sidebar */}
        <div className="pt-6 border-t border-slate-800/60 mt-6 hidden md:block">
          <p className="text-[10px] text-slate-500">
            © 2026 Smart Film Prod.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex justify-between items-center p-6 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Management System</span>
            <h2 className="text-xl font-bold text-slate-100">Overview</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-semibold text-slate-200">{session.name}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border mt-0.5 tracking-wider uppercase ${badgeClass}`}>
                {session.role}
              </span>
            </div>
            <LogoutButton />
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
