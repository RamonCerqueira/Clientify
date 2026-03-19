import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clientify',
  description: 'SaaS para criação de páginas de captura de leads',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
