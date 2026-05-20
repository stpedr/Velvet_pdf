'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthUser } from '@/lib/types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

interface AuthCtx {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const Ctx = createContext<AuthCtx>({
  user: null, token: null, loading: true,
  login: async () => {}, register: async () => {}, logout: () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Restore session from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const t = localStorage.getItem('pv_token');
      const u = localStorage.getItem('pv_user');
      if (t && u) { setToken(t); setUser(JSON.parse(u)); }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  function persist(t: string, u: AuthUser) {
    localStorage.setItem('pv_token', t);
    localStorage.setItem('pv_user', JSON.stringify(u));
    setToken(t); setUser(u);
  }

  async function login(email: string, password: string) {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message ?? 'Email ou senha incorretos');
    }
    const data = await res.json();
    persist(data.token, data.customer ?? data);
  }

  async function register(data: RegisterData) {
    const res = await fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message ?? 'Erro ao criar conta');
    }
    const body = await res.json();
    persist(body.token, body.customer ?? body);
  }

  function logout() {
    localStorage.removeItem('pv_token');
    localStorage.removeItem('pv_user');
    setToken(null); setUser(null);
    router.push('/login');
  }

  return (
    <Ctx.Provider value={{ user, token, loading, login, register, logout, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
