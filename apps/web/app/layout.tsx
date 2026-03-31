import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clientify | SaaS de captura de leads',
  description: 'Plataforma moderna para criação de páginas, captura de leads e gestão comercial.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.15),transparent_55%)]" />
        {children}
      </body>
    </html>
  );
}
