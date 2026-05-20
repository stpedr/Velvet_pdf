'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthCtx {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({ user: null, loading: true, login: async () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const u = localStorage.getItem('pv_admin_user');
      const t = localStorage.getItem('pv_admin_token');
      if (u && t) setUser(JSON.parse(u));
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message ?? 'Credenciais inválidas');
    }
    const data = await res.json();
    const u: AdminUser = data.customer ?? data;
    if (u.role !== 'ADMIN') throw new Error('Acesso negado. Apenas administradores.');
    const token = data.token;
    localStorage.setItem('pv_admin_token', token);
    localStorage.setItem('pv_admin_user', JSON.stringify(u));
    // Also set cookie for middleware route protection
    document.cookie = `pv_admin_token=${token}; path=/; SameSite=Strict`;
    setUser(u);
  }

  function logout() {
    localStorage.removeItem('pv_admin_token');
    localStorage.removeItem('pv_admin_user');
    document.cookie = 'pv_admin_token=; path=/; max-age=0';
    setUser(null);
    router.push('/login');
  }

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
