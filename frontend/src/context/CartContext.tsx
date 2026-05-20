'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { CartItem, Product } from '@/lib/types';

interface CartCtx {
  items: CartItem[];
  cartCount: number;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  addItem: (p: Product) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  total: number;
}
const Ctx = createContext<CartCtx>(null!);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Restore cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pv_cart');
      if (saved) setItems(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  // Persist cart to localStorage on every change
  useEffect(() => {
    try { localStorage.setItem('pv_cart', JSON.stringify(items)); } catch { /* quota exceeded */ }
  }, [items]);

  const addItem = useCallback((p: Product) => {
    setItems(prev => {
      const ex = prev.find(i => i.product.id === p.id);
      if (ex) return prev.map(i => i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product: p, qty: 1 }];
    });
    setCartOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.product.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) { removeItem(id); return; }
    setItems(prev => prev.map(i => i.product.id === id ? { ...i, qty } : i));
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    try { localStorage.removeItem('pv_cart'); } catch { /* ignore */ }
  }, []);

  const cartCount = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  return (
    <Ctx.Provider value={{ items, cartCount, cartOpen, setCartOpen, addItem, removeItem, updateQty, clearCart, total }}>
      {children}
    </Ctx.Provider>
  );
}
export const useCart = () => useContext(Ctx);
