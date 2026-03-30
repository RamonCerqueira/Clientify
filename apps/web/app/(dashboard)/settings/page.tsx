'use client';

import { useEffect, useState } from 'react';
import { getAuthSession } from '@/hooks/useAuth';

export default function SettingsPage() {
  const [tenantName, setTenantName] = useState('');

  useEffect(() => {
    const session = getAuthSession();
    setTenantName(session?.user.name || 'Minha empresa');
  }, []);

  return (
    <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-xl font-bold text-ink">Configurações</h1>
      <p className="text-sm text-slate-500">Área preparada para branding, cobrança e preferências do tenant.</p>
      <div className="rounded-2xl border border-slate-200 p-4">
        <p className="text-sm text-slate-500">Responsável atual</p>
        <p className="font-semibold text-ink">{tenantName}</p>
      </div>
    </section>
  );
}
