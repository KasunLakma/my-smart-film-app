"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/', label: 'Projects', icon: '🎥' },
    { href: '/crew', label: 'Cast & Crew', icon: '👥' },
    { href: '/schedule', label: 'Schedule', icon: '📅' },
  ];

  return (
    <nav className="space-y-1.5">
      {links.map((link, idx) => {
        const isDashboard = link.label === 'Dashboard';
        const isProjects = link.label === 'Projects';
        
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
            className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg border-l-2 transition-all duration-200 ${
              isActive
                ? 'bg-slate-950 text-violet-400 border-violet-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/40 border-transparent'
            }`}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
