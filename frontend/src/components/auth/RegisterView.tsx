'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo, PillBtn } from '../shared';
import { useAuth } from '@/context/AuthContext';

export default function RegisterView() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) { setError('A senha deve ter pelo menos 8 caracteres'); return; }
    setLoading(true);
    try {
      await register({ ...form, phone: form.phone || undefined });
      router.push('/perfil');
    } catch (err: any) {
      setError(err.message ?? 'Erro ao criar conta');
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
          <h1 className="font-['Bagel_Fat_One',cursive] text-3xl text-[#2a1612] mb-2">Criar conta</h1>
          <p className="text-[#2a1612]/60 text-sm mb-6">Junte-se aos guardiões felinos.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#2a1612]/60 uppercase tracking-wide block mb-1.5">Nome</label>
                <input value={form.firstName} onChange={set('firstName')} required placeholder="Maria" className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#2a1612]/60 uppercase tracking-wide block mb-1.5">Sobrenome</label>
                <input value={form.lastName} onChange={set('lastName')} required placeholder="Souza" className={inputCls} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#2a1612]/60 uppercase tracking-wide block mb-1.5">E-mail</label>
              <input type="email" value={form.email} onChange={set('email')} required
                placeholder="seu@email.com" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#2a1612]/60 uppercase tracking-wide block mb-1.5">Senha</label>
              <input type="password" value={form.password} onChange={set('password')} required
                placeholder="Mínimo 8 caracteres" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#2a1612]/60 uppercase tracking-wide block mb-1.5">Telefone <span className="font-normal">(opcional)</span></label>
              <input type="tel" value={form.phone} onChange={set('phone')}
                placeholder="(11) 99999-9999" className={inputCls} />
            </div>
            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-red-500 text-sm">{error}</motion.p>
              )}
            </AnimatePresence>
            <PillBtn type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar minha conta →'}
            </PillBtn>
          </form>
          <p className="text-center text-sm text-[#2a1612]/50 mt-6">
            Já tem conta?{' '}
            <Link href="/login" className="text-[#ed6058] font-semibold hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
