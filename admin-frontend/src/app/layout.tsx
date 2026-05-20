import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import SidebarWrapper from '@/components/SidebarWrapper';

export const metadata: Metadata = {
  title: 'Pata de Veludo — Admin',
  description: 'Painel administrativo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-['DM_Sans',sans-serif]">
        <AuthProvider>
          <SidebarWrapper>{children}</SidebarWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
