'use client';

import { Bell, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/button';

export function DashboardHeader({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { session, logout } = useAuth();
  const initials = session?.user.name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="panel flex items-center justify-between gap-4 p-4 md:p-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded-xl border border-white/15 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10 lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu size={18} />
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Workspace</p>
          <h2 className="text-lg font-semibold text-white md:text-xl">Olá, {session?.user.name || 'usuário'}</h2>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button type="button" className="rounded-xl border border-white/15 bg-white/5 p-2.5 text-slate-300 transition hover:bg-white/10" aria-label="Notificações">
          <Bell size={16} />
        </button>
        <div className="hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 sm:block">Perfil: {session?.user.role || 'MEMBER'}</div>
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-xs font-semibold text-slate-950">{initials || 'U'}</div>
        <Button type="button" className="px-4 py-2.5" onClick={logout}>
          Sair
        </Button>
      </div>
    </header>
  );
}
