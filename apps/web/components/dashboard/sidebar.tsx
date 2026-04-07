'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutTemplate, Settings, Users, X } from 'lucide-react';
import { cn } from '../ui/cn';

const items = [
  { href: '/pages', label: 'Minhas páginas', icon: LayoutTemplate },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/settings', label: 'Configurações', icon: Settings },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <button type="button" aria-label="Fechar menu" onClick={onClose} className={cn('fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm transition lg:hidden', open ? 'opacity-100' : 'pointer-events-none opacity-0')} />
      <aside
        className={cn(
          'panel fixed left-4 top-4 z-50 w-[calc(100%-2rem)] max-w-xs p-5 transition duration-300 lg:sticky lg:top-6 lg:w-full lg:max-w-none lg:translate-x-0 lg:opacity-100 lg:min-h-[calc(100vh-3rem)]',
          open ? 'translate-x-0 opacity-100' : '-translate-x-[115%] opacity-0 lg:translate-x-0',
        )}
      >
        <div className="mb-8 flex items-start justify-between rounded-2xl border border-indigo-300/20 bg-gradient-to-r from-indigo-500/20 to-cyan-400/15 p-4">
          <div>
            <p className="text-lg font-semibold text-white">Clientify</p>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-100/90">Revenue Workspace</p>
          </div>
          <button className="rounded-xl border border-white/15 p-2 text-slate-300 lg:hidden" onClick={onClose} type="button" aria-label="Fechar barra lateral">
            <X size={16} />
          </button>
        </div>

        <nav className="space-y-1.5">
          {items.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition',
                pathname === href ? 'bg-white/95 text-slate-900 shadow-[0_10px_25px_rgba(148,163,184,0.2)]' : 'text-slate-300 hover:bg-white/10 hover:text-white',
              )}
            >
              <Icon size={18} className={cn('transition', pathname === href ? 'text-indigo-600' : 'text-slate-400 group-hover:text-cyan-200')} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
