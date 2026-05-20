'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo, PillBtn } from '../shared';
import { useAuth } from '@/context/AuthContext';

export default function LoginView() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push(params.get('callbackUrl') ?? '/perfil');
    } catch (err: any) {
      setError(err.message ?? 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-4 py-3 rounded-[20px] border border-[#2a1612]/20 focus:border-[#ed6058] outline-none text-sm bg-white';

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/"><Logo size={80} /></Link>
        </div>
        <div className="bg-white rounded-[32px] p-8 shadow-sm">
          <h1 className="font-['Bagel_Fat_One',cursive] text-3xl text-[#2a1612] mb-2">Entrar</h1>
          <p className="text-[#2a1612]/60 text-sm mb-6">Bem-vindo de volta ao mundo do seu gato.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#2a1612]/60 uppercase tracking-wide block mb-1.5">E-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="seu@email.com" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#2a1612]/60 uppercase tracking-wide block mb-1.5">Senha</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••" className={inputCls} />
            </div>
            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-red-500 text-sm">{error}</motion.p>
              )}
            </AnimatePresence>
            <PillBtn type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar →'}
            </PillBtn>
          </form>
          <p className="text-center text-sm text-[#2a1612]/50 mt-6">
            Ainda não tem conta?{' '}
            <Link href="/cadastro" className="text-[#ed6058] font-semibold hover:underline">Cadastrar-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
