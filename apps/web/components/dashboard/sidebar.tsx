'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutTemplate, Settings, Users } from 'lucide-react';
import { cn } from '../ui/cn';

const items = [
  { href: '/pages', label: 'Minhas páginas', icon: LayoutTemplate },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/settings', label: 'Configurações', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="panel w-full max-w-xs p-5 lg:min-h-[calc(100vh-2rem)]">
      <div className="mb-8 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4">
        <p className="text-lg font-bold text-white">Clientify</p>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-100">Revenue Workspace</p>
      </div>

      <nav className="space-y-2">
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm',
              pathname === href ? 'bg-white text-slate-900' : 'text-slate-300 hover:bg-white/10',
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
