"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'DASHBOARD', icon: '📊' },
    { href: '/', label: 'PROJECTS', icon: '🎥' },
    { href: '/crew', label: 'CAST & CREW', icon: '👥' },
    { href: '/schedule', label: 'SCHEDULE', icon: '📅' },
  ];

  return (
    <nav className="space-y-2 relative">
      {links.map((link, idx) => {
        const isDashboard = link.label === 'DASHBOARD';
        const isProjects = link.label === 'PROJECTS';
        
        let isActive = false;
        if (isDashboard) {
          isActive = pathname === '/';
        } else if (isProjects) {
          isActive = pathname === '/' || pathname.startsWith('/project/');
        } else {
          isActive = pathname === link.href;
        }

        return (
          <Link
            key={idx}
            href={link.href}
            className={`group relative flex items-center gap-3 px-5 py-3.5 text-[9px] font-mono font-bold tracking-[0.2em] rounded-full transition-all duration-300 ease-out border ${
              isActive
                ? 'bg-white/[0.08] text-white border-white/[0.1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_8px_24px_rgba(0,0,0,0.4)]'
                : 'text-zinc-400 border-transparent hover:text-white hover:bg-white/[0.06] hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {/* Subtle Active Pill Indicator Accent */}
            {isActive && (
              <span className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            )}
            
            <span className={`text-sm transition-transform duration-300 ${isActive ? 'pl-2 scale-110' : 'group-hover:scale-110'}`}>
              {link.icon}
            </span>
            <span className="relative z-10">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
