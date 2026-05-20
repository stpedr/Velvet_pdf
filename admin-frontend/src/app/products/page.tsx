'use client';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';

interface ApiCategory { id: string; name: string; slug: string; }
interface ApiProduct {
  id: string; name: string; tagline: string; price: number; originalPrice?: number;
  categoryId: string; categoryName: string; tag?: string; stockQty: number;
  specs: string; images: string; colorways: string; active: boolean; sku?: string;
}
interface PagedResponse<T> { content: T[]; totalPages: number; totalElements: number; number: number; }

const EMPTY_FORM = {
  name: '', tagline: '', story: '', price: '', originalPrice: '', categoryId: '',
  tag: '', stockQty: '100', specs: '[]', images: '[]', colorways: '[]', active: true,
};

const BADGE: Record<string, string> = {
  true: 'bg-green-100 text-green-700',
  false: 'bg-red-100 text-red-700',
};

export default function ProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<PagedResponse<ApiProduct>>(`/admin/products?page=${page}&size=20`);
      setProducts(res.content);
      setTotalPages(res.totalPages);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { api.get<ApiCategory[]>('/categories').then(setCategories).catch(console.error); }, []);

  function openNew() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  }

  function openEdit(p: ApiProduct) {
    setEditId(p.id);
    setForm({
      name: p.name, tagline: p.tagline ?? '', story: '', price: String(p.price),
      originalPrice: p.originalPrice ? String(p.originalPrice) : '',
      categoryId: p.categoryId, tag: p.tag ?? '', stockQty: String(p.stockQty),
      specs: p.specs ?? '[]', images: p.images ?? '[]', colorways: p.colorways ?? '[]',
      active: p.active,
    });
    setFormError('');
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setFormError('');
    try {
      const body = {
        name: form.name, tagline: form.tagline, story: form.story || undefined,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        categoryId: form.categoryId, tag: form.tag || undefined,
        stockQty: parseInt(form.stockQty, 10),
        specs: form.specs, images: form.images, colorways: form.colorways,
        active: form.active,
      };
      if (editId) {
        await api.put(`/admin/products/${editId}`, body);
      } else {
        await api.post('/admin/products', body);
      }
      setModalOpen(false);
      load();
    } catch (e: any) {
      setFormError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.del(`/admin/products/${id}`);
      setDeleteId(null);
      load();
    } catch (e: any) {
      alert(e.message);
    }
  }

  function F(key: keyof typeof EMPTY_FORM) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));
    };
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Bagel_Fat_One',cursive] text-3xl text-[#2a1612]">Produtos</h1>
        <button onClick={openNew} className="bg-[#ed6058] text-white rounded-2xl px-5 py-2.5 text-sm font-semibold hover:bg-[#d94f47] transition">
          + Novo Produto
        </button>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#2a1612]/40 text-sm">Carregando…</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[#2a1612]/50 uppercase tracking-wide border-b border-[#f0ebe7]">
                <th className="text-left px-6 py-4">Nome</th>
                <th className="text-left px-6 py-4">Categoria</th>
                <th className="text-right px-6 py-4">Preço</th>
                <th className="text-right px-6 py-4">Estoque</th>
                <th className="text-center px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-[#f0ebe7] last:border-0 hover:bg-[#faf8f6]">
                  <td className="px-6 py-4 font-medium text-[#2a1612]">{p.name}</td>
                  <td className="px-6 py-4 text-[#2a1612]/60">{p.categoryName}</td>
                  <td className="px-6 py-4 text-right text-[#2a1612]">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                  </td>
                  <td className="px-6 py-4 text-right text-[#2a1612]">{p.stockQty}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${BADGE[String(p.active)]}`}>
                      {p.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEdit(p)} className="text-xs text-[#2a1612]/60 hover:text-[#ed6058] mr-4 transition">Editar</button>
                    <button onClick={() => setDeleteId(p.id)} className="text-xs text-[#ed6058]/70 hover:text-[#ed6058] transition">Excluir</button>
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-bold text-xl text-[#2a1612] mb-6">{editId ? 'Editar Produto' : 'Novo Produto'}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-[#2a1612]/60 mb-1">Nome *</label>
                <input value={form.name} onChange={F('name')} className="w-full border border-[#e0d6d0] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#ed6058]" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-[#2a1612]/60 mb-1">Tagline</label>
                <input value={form.tagline} onChange={F('tagline')} className="w-full border border-[#e0d6d0] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#ed6058]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2a1612]/60 mb-1">Preço (R$) *</label>
                <input type="number" step="0.01" value={form.price} onChange={F('price')} className="w-full border border-[#e0d6d0] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#ed6058]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2a1612]/60 mb-1">Preço Original (R$)</label>
                <input type="number" step="0.01" value={form.originalPrice} onChange={F('originalPrice')} className="w-full border border-[#e0d6d0] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#ed6058]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2a1612]/60 mb-1">Categoria *</label>
                <select value={form.categoryId} onChange={F('categoryId')} className="w-full border border-[#e0d6d0] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#ed6058]">
                  <option value="">Selecionar…</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2a1612]/60 mb-1">Estoque</label>
                <input type="number" value={form.stockQty} onChange={F('stockQty')} className="w-full border border-[#e0d6d0] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#ed6058]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2a1612]/60 mb-1">Tag</label>
                <input value={form.tag} onChange={F('tag')} placeholder="ex: NOVO, SALE" className="w-full border border-[#e0d6d0] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#ed6058]" />
              </div>
              <div className="flex items-center gap-2 pt-4">
                <input type="checkbox" id="active" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
                <label htmlFor="active" className="text-sm text-[#2a1612]">Produto ativo</label>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-[#2a1612]/60 mb-1">Colorways (JSON array)</label>
                <textarea value={form.colorways} onChange={F('colorways')} rows={2} className="w-full border border-[#e0d6d0] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#ed6058] font-mono" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-[#2a1612]/60 mb-1">Specs (JSON array)</label>
                <textarea value={form.specs} onChange={F('specs')} rows={2} className="w-full border border-[#e0d6d0] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#ed6058] font-mono" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-[#2a1612]/60 mb-1">Imagens (JSON array de URLs)</label>
                <textarea value={form.images} onChange={F('images')} rows={2} className="w-full border border-[#e0d6d0] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#ed6058] font-mono" />
              </div>
            </div>

            {formError && <p className="text-sm text-[#ed6058] mt-4 text-center">{formError}</p>}

            <div className="flex gap-3 mt-6">
              <button onClick={() => setModalOpen(false)} className="flex-1 border border-[#e0d6d0] rounded-2xl py-3 text-sm font-medium text-[#2a1612]/60 hover:bg-[#f8f5f3] transition">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-[#ed6058] text-white rounded-2xl py-3 text-sm font-semibold hover:bg-[#d94f47] transition disabled:opacity-60">
                {saving ? 'Salvando…' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-sm text-center">
            <p className="font-medium text-[#2a1612] mb-2">Excluir produto?</p>
            <p className="text-sm text-[#2a1612]/50 mb-6">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-[#e0d6d0] rounded-2xl py-3 text-sm font-medium">Cancelar</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-[#ed6058] text-white rounded-2xl py-3 text-sm font-semibold hover:bg-[#d94f47] transition">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
