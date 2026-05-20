'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo, Marquee } from './shared';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, setCartOpen } = useCart();
  const { user, logout } = useAuth();

  const nav = [
    { href: '/cat/brincar', label: 'Brincar' },
    { href: '/cat/descansar', label: 'Descansar' },
    { href: '/cat/hidratar', label: 'Hidratar' },
    { href: '/cat/cuidar', label: 'Cuidar' },
    { href: '/kits', label: 'Kits' },
  ];

  const offers = ['10% OFF na 1ª compra: VELUDO10', 'Frete grátis acima de R$ 149', 'Parcele em 4× sem juros', '30 dias pra trocar, sem pergunta'];

  return (
    <header className="sticky top-0 z-50 bg-[#faf6ef]/95 backdrop-blur-sm border-b border-[#2a1612]/10">
      <div className="bg-[#2a1612] text-[#fdfedf] py-1.5 overflow-hidden">
        <Marquee items={offers} speed={35} />
      </div>
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        <button className="md:hidden p-2 -ml-2 rounded-full hover:bg-[#2a1612]/10 transition" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>}
          </svg>
        </button>
        <Link href="/" aria-label="Pata de Veludo — Início" className="mx-auto md:mx-0"><Logo size={72} /></Link>
        <nav className="hidden md:flex items-center gap-6 font-medium text-sm">
          {nav.map(l => <Link key={l.href} href={l.href} className="hover:text-[#ed6058] transition-colors">{l.label}</Link>)}
        </nav>
        <div className="flex items-center gap-1">
          <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-full hover:bg-[#2a1612]/10 transition" aria-label="Buscar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><line x1="20" y1="20" x2="15.5" y2="15.5"/></svg>
          </button>
          {user ? (
            <div className="hidden sm:flex items-center gap-1">
              <Link href="/perfil" className="px-3 py-1.5 rounded-full hover:bg-[#2a1612]/10 transition text-sm font-medium" aria-label="Conta">
                {user.firstName}
              </Link>
              <button onClick={logout} className="px-3 py-1.5 rounded-full hover:bg-[#2a1612]/10 transition text-sm text-[#2a1612]/60 hover:text-[#ed6058]">
                Sair
              </button>
            </div>
          ) : (
            <Link href="/login" className="p-2 rounded-full hover:bg-[#2a1612]/10 transition hidden sm:flex" aria-label="Conta">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20 Q 12 14 20 20"/></svg>
            </Link>
          )}
          <button onClick={() => setCartOpen(true)} className="relative p-2 rounded-full hover:bg-[#2a1612]/10 transition" aria-label="Carrinho">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 7 L 19 7 L 17 18 L 7 18 Z"/><path d="M8 7 Q 8 3 12 3 Q 16 3 16 7"/></svg>
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span key="badge" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 bg-[#ed6058] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-[#2a1612]/10 bg-[#faf6ef]">
            <nav className="flex flex-col py-4 px-4 gap-1">
              {nav.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                  className="py-3 px-4 rounded-[20px] font-medium hover:bg-[#ed6058] hover:text-white transition-colors">{l.label}</Link>
              ))}
              {user ? (
                <>
                  <Link href="/perfil" onClick={() => setMenuOpen(false)}
                    className="py-3 px-4 rounded-[20px] font-medium hover:bg-[#2a1612] hover:text-white transition-colors">
                    Minha conta ({user.firstName})
                  </Link>
                  <button onClick={() => { setMenuOpen(false); logout(); }}
                    className="py-3 px-4 rounded-[20px] font-medium text-left text-[#2a1612]/60 hover:bg-red-50 hover:text-red-500 transition-colors">
                    Sair
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="py-3 px-4 rounded-[20px] font-medium hover:bg-[#2a1612] hover:text-white transition-colors">Entrar</Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[#2a1612]/10 bg-[#fdfedf]">
            <div className="px-4 py-3">
              <input autoFocus placeholder="o que seu gato precisa hoje?"
                className="w-full bg-transparent text-[#2a1612] placeholder-[#2a1612]/50 text-base font-medium outline-none border-b-2 border-[#ed6058] pb-2" />
              <div className="flex flex-wrap gap-2 mt-3">
                {['ratinho elétrico','fonte silenciosa','ninho redondo','catnip','arranhador'].map(c => (
                  <button key={c} className="px-3 py-1.5 bg-[#faf6ef] rounded-full text-sm font-medium border border-[#2a1612]/20 hover:bg-[#ed6058] hover:text-white hover:border-[#ed6058] transition">{c}</button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
