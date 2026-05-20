'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PillBtn, Badge } from '../shared';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import type { AuthUser, OrderResponse, PagedResponse } from '@/lib/types';

const STATUS_COLOR: Record<string, string> = {
  PENDING: '#f2c98a', PAYMENT_PENDING: '#f2c98a', PAID: '#6bcf7f',
  PROCESSING: '#60a5fa', SHIPPED: '#3b82f6', DELIVERED: '#16a34a',
  CANCELLED: '#ed6058', REFUNDED: '#a1a1aa',
};
const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Aguardando', PAYMENT_PENDING: 'Aguard. pagamento', PAID: 'Pago',
  PROCESSING: 'Em processamento', SHIPPED: 'Enviado', DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado', REFUNDED: 'Reembolsado',
};

export default function ProfileView() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'pedidos'|'conta'|'enderecos'>('pedidos');
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [fetching, setFetching] = useState(false);

  const tabs = { pedidos:'Meus pedidos', conta:'Minha conta', enderecos:'Endereços' };

  useEffect(() => {
    if (!loading && !user) router.push('/login?callbackUrl=/perfil');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    if (tab === 'conta' && !profile) {
      setFetching(true);
      api.get<AuthUser>('/customers/me').then(setProfile).catch(() => {}).finally(() => setFetching(false));
    }
    if (tab === 'pedidos') {
      setFetching(true);
      api.get<PagedResponse<OrderResponse>>('/orders?size=20').then(r => setOrders(r.content)).catch(() => {}).finally(() => setFetching(false));
    }
  }, [tab, user]);

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true); setSaveMsg('');
    try {
      const updated = await api.patch<AuthUser>('/customers/me', { firstName: profile.firstName, lastName: profile.lastName, phone: profile.phone });
      setProfile(updated);
      setSaveMsg('Dados salvos com sucesso!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch { setSaveMsg('Erro ao salvar.'); }
    setSaving(false);
  };

  if (loading || !user) return null;

  const inputCls = 'w-full px-4 py-3 rounded-[20px] border border-[#2a1612]/20 focus:border-[#ed6058] outline-none text-sm bg-white';

  return (
    <div className="px-4 md:px-8 py-10 max-w-4xl mx-auto">
      <h1 className="font-['Bagel_Fat_One',cursive] text-3xl text-[#2a1612] mb-2">Minha conta</h1>
      <p className="text-[#2a1612]/50 text-sm mb-8">Olá, {user.firstName}! Nível: <span className="font-semibold text-[#ed6058]">{user.tier}</span></p>

      <div className="flex gap-2 mb-8 overflow-x-auto" style={{ scrollbarWidth:'none' }}>
        {(Object.entries(tabs) as [typeof tab, string][]).map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-5 py-2.5 rounded-full font-medium text-sm transition flex-shrink-0 ${tab===k ? 'bg-[#ed6058] text-white' : 'bg-white text-[#2a1612] hover:bg-[#2a1612]/10'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'pedidos' && (
        fetching ? (
          <div className="text-center py-16 text-[#2a1612]/40">Carregando pedidos...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-[32px] p-8 text-center text-[#2a1612]/50">
            <div className="text-5xl mb-4">📦</div>
            <p className="font-semibold text-base text-[#2a1612]">Nenhum pedido ainda.</p>
            <p className="text-sm mt-1">Seu gato ainda está esperando o primeiro mimo!</p>
            <Link href="/"><PillBtn size="sm" className="mt-4">Ver brinquedos</PillBtn></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-[32px] p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-mono text-xs text-[#2a1612]/40 mb-1">#{order.id.slice(0,8).toUpperCase()}</p>
                    <p className="text-sm text-[#2a1612]/60">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <Badge color={STATUS_COLOR[order.status] ?? '#a1a1aa'}>{STATUS_LABEL[order.status] ?? order.status}</Badge>
                </div>
                <div className="text-sm text-[#2a1612]/70 mb-3">
                  {order.items.map(i => `${i.productName} ×${i.quantity}`).join(', ')}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#2a1612]/50 text-sm">{order.items.length} {order.items.length === 1 ? 'item' : 'itens'} · {order.paymentMethod}</span>
                  <span className="font-bold text-[#ed6058]">R$ {order.total.toFixed(2).replace('.',',')}</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'conta' && (
        <div className="bg-white rounded-[32px] p-6 space-y-4 max-w-lg">
          {fetching && !profile ? (
            <div className="text-center py-8 text-[#2a1612]/40">Carregando...</div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#2a1612]/60 uppercase tracking-wide block mb-1.5">Nome</label>
                  <input className={inputCls} value={profile?.firstName ?? user.firstName}
                    onChange={e => setProfile(p => p ? {...p, firstName: e.target.value} : null)}/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#2a1612]/60 uppercase tracking-wide block mb-1.5">Sobrenome</label>
                  <input className={inputCls} value={profile?.lastName ?? user.lastName}
                    onChange={e => setProfile(p => p ? {...p, lastName: e.target.value} : null)}/>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#2a1612]/60 uppercase tracking-wide block mb-1.5">Email</label>
                <input className={`${inputCls} opacity-60`} value={profile?.email ?? user.email} disabled/>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#2a1612]/60 uppercase tracking-wide block mb-1.5">Telefone</label>
                <input className={inputCls} value={profile?.phone ?? user.phone ?? ''}
                  onChange={e => setProfile(p => p ? {...p, phone: e.target.value} : null)}
                  placeholder="(11) 99999-9999"/>
              </div>
              {saveMsg && <p className={`text-sm ${saveMsg.includes('Erro') ? 'text-red-500' : 'text-green-600'}`}>{saveMsg}</p>}
              <PillBtn onClick={saveProfile} disabled={saving}>{saving ? 'Salvando...' : 'Salvar alterações'}</PillBtn>
            </>
          )}
        </div>
      )}

      {tab === 'enderecos' && (
        <div className="bg-white rounded-[32px] p-8 text-center text-[#2a1612]/50">
          <div className="text-5xl mb-4">📍</div>
          <p className="font-semibold text-base text-[#2a1612]">Nenhum endereço salvo.</p>
          <p className="text-sm mt-1">Seus endereços são salvos automaticamente ao finalizar um pedido.</p>
          <Link href="/checkout"><PillBtn size="sm" className="mt-4">Fazer um pedido</PillBtn></Link>
        </div>
      )}
    </div>
  );
}
