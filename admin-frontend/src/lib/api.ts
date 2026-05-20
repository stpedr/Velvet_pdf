const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('pv_admin_token');
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pv_admin_token');
      localStorage.removeItem('pv_admin_user');
      document.cookie = 'pv_admin_token=; path=/; max-age=0';
      window.location.href = '/login';
    }
    throw new Error('Sessão expirada.');
  }
  if (!res.ok) {
    let msg = `Erro ${res.status}`;
    try { const d = await res.json(); msg = d.message ?? d.error ?? msg; } catch { /* ignore */ }
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  return handleResponse<T>(res);
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path: string) => apiFetch<void>(path, { method: 'DELETE' }),
};
