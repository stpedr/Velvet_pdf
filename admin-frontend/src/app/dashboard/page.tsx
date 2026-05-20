'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface DashboardStats {
  revenueTodayBrl: number;
  revenueThisMonthBrl: number;
  revenueAllTimeBrl: number;
  ordersPending: number;
  ordersPaid: number;
  ordersShipped: number;
  totalCustomers: number;
  activeProducts: number;
  lowStockProducts: number;
}

function fmt(n: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm">
      <p className="text-xs text-[#2a1612]/50 mb-1 font-medium uppercase tracking-wide">{label}</p>
      <p className="font-['Bagel_Fat_One',cursive] text-3xl text-[#2a1612]">{value}</p>
      {sub && <p className="text-xs text-[#2a1612]/40 mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<DashboardStats>('/admin/dashboard')
      .then(setStats)
      .catch((e: Error) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#ed6058]">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#2a1612]/40 text-sm">Carregando…</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-['Bagel_Fat_One',cursive] text-3xl text-[#2a1612] mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Receita Hoje" value={fmt(stats.revenueTodayBrl)} />
        <StatCard label="Receita Mês" value={fmt(stats.revenueThisMonthBrl)} />
        <StatCard label="Receita Total" value={fmt(stats.revenueAllTimeBrl)} />
        <StatCard label="Clientes" value={String(stats.totalCustomers)} />
        <StatCard label="Pedidos Pendentes" value={String(stats.ordersPending)} />
        <StatCard label="Pedidos Pagos" value={String(stats.ordersPaid)} />
        <StatCard label="Pedidos Enviados" value={String(stats.ordersShipped)} />
        <StatCard label="Produtos Ativos" value={String(stats.activeProducts)} sub={`${stats.lowStockProducts} com estoque baixo`} />
      </div>
    </div>
  );
}
