'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  )},
  { href: '/products', label: 'Produtos', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  )},
  { href: '/orders', label: 'Pedidos', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
    </svg>
  )},
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-56 min-h-screen bg-[#2a1612] text-white flex flex-col flex-shrink-0">
      <div className="px-6 py-6 border-b border-white/10">
        <span className="font-['Bagel_Fat_One',cursive] text-xl text-[#ed6058]">pata</span>
        <span className="font-['Bagel_Fat_One',cursive] text-xl text-white"> admin</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-[16px] text-sm font-medium transition ${active ? 'bg-[#ed6058] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
              {icon}{label}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-6 border-t border-white/10">
        <p className="text-xs text-white/50 mb-1">Logado como</p>
        <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
        <button onClick={logout} className="mt-3 text-xs text-white/50 hover:text-[#ed6058] transition">Sair →</button>
      </div>
    </aside>
  );
}
