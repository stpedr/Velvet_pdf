'use client';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';

type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

interface OrderItem { id: string; productName: string; quantity: number; totalPrice: number; }
interface Order {
  id: string; status: OrderStatus; total: number; paymentMethod: string;
  customerEmail: string; createdAt: string; items: OrderItem[];
}
interface PagedResponse<T> { content: T[]; totalPages: number; }

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Pendente', PAID: 'Pago', PROCESSING: 'Processando',
  SHIPPED: 'Enviado', DELIVERED: 'Entregue', CANCELLED: 'Cancelado',
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-green-100 text-green-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const STATUSES: Array<OrderStatus | 'ALL'> = ['ALL', 'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = filter !== 'ALL' ? `&status=${filter}` : '';
      const res = await api.get<PagedResponse<Order>>(`/admin/orders?page=${page}&size=20${qs}`);
      setOrders(res.content);
      setTotalPages(res.totalPages);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => { load(); }, [load]);

  function changeFilter(f: OrderStatus | 'ALL') {
    setFilter(f);
    setPage(0);
  }

  async function updateStatus(id: string, status: OrderStatus) {
    setUpdatingId(id);
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      load();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUpdatingId(null);
    }
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function fmtCurrency(n: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
  }

  return (
    <div>
      <h1 className="font-['Bagel_Fat_One',cursive] text-3xl text-[#2a1612] mb-6">Pedidos</h1>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => changeFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filter === s ? 'bg-[#ed6058] text-white' : 'bg-white text-[#2a1612]/60 hover:bg-[#f0ebe7]'
            }`}
          >
            {s === 'ALL' ? 'Todos' : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[32px] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#2a1612]/40 text-sm">Carregando…</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-[#2a1612]/40 text-sm">Nenhum pedido encontrado.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[#2a1612]/50 uppercase tracking-wide border-b border-[#f0ebe7]">
                <th className="text-left px-6 py-4">Pedido</th>
                <th className="text-left px-6 py-4">Cliente</th>
                <th className="text-right px-6 py-4">Total</th>
                <th className="text-center px-6 py-4">Pagamento</th>
                <th className="text-center px-6 py-4">Status</th>
                <th className="text-center px-6 py-4">Data</th>
                <th className="text-right px-6 py-4">Ação</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b border-[#f0ebe7] last:border-0 hover:bg-[#faf8f6]">
                  <td className="px-6 py-4 font-mono text-xs text-[#2a1612]/60">{o.id.substring(0, 8)}…</td>
                  <td className="px-6 py-4 text-[#2a1612]">{o.customerEmail}</td>
                  <td className="px-6 py-4 text-right font-medium text-[#2a1612]">{fmtCurrency(o.total)}</td>
                  <td className="px-6 py-4 text-center text-[#2a1612]/60 text-xs uppercase">{o.paymentMethod}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLOR[o.status]}`}>
                      {STATUS_LABEL[o.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-[#2a1612]/60 text-xs">{fmtDate(o.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <select
                      value={o.status}
                      disabled={updatingId === o.id}
                      onChange={e => updateStatus(o.id, e.target.value as OrderStatus)}
                      className="border border-[#e0d6d0] rounded-xl px-2 py-1 text-xs outline-none focus:border-[#ed6058] disabled:opacity-50"
                    >
                      {(['PENDING','PAID','PROCESSING','SHIPPED','DELIVERED','CANCELLED'] as OrderStatus[]).map(s => (
                        <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-2xl bg-white text-sm disabled:opacity-40">‹ Anterior</button>
          <span className="px-4 py-2 text-sm text-[#2a1612]/60">{page + 1} / {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-2xl bg-white text-sm disabled:opacity-40">Próximo ›</button>
        </div>
      )}
    </div>
  );
}
