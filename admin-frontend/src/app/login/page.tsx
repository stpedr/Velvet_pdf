'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

export default function AdminLogin() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message ?? 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6f8]">
      <div className="bg-white rounded-[32px] p-10 shadow-sm w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-3xl mb-3">🐾</div>
          <h1 className="font-bold text-2xl text-[#2a1612]">
            <span className="text-[#ed6058]">pata</span> admin
          </h1>
          <p className="text-sm text-[#2a1612]/50 mt-1">Painel administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2a1612] mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-[#e0d6d0] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#ed6058] transition"
              placeholder="admin@patadeveludo.com.br"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2a1612] mb-1">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-[#e0d6d0] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#ed6058] transition"
              placeholder="••••••••"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-[#ed6058] text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ed6058] text-white rounded-2xl py-3 font-semibold text-sm hover:bg-[#d94f47] transition disabled:opacity-60"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
