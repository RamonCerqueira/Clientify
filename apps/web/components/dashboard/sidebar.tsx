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
    <aside className="w-full max-w-xs rounded-3xl bg-ink p-5 text-white lg:min-h-[calc(100vh-2rem)]">
      <div className="mb-8">
        <p className="text-lg font-semibold">Clientify</p>
        <p className="text-sm text-slate-300">Seu SaaS de captação</p>
      </div>
      <nav className="space-y-2">
        {items.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm', pathname === href ? 'bg-white text-ink' : 'text-slate-200 hover:bg-slate-800')}>
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
