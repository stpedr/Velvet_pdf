'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PillBtn } from '../shared';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import type { OrderResponse } from '@/lib/types';

type Step = 'address'|'payment'|'confirm'|'done';
type PayMethod = 'pix'|'card'|'boleto';

const STATES = ['SP','RJ','MG','PR','RS','SC','BA','GO','DF','CE','PE','AM','PA'];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

export default function CheckoutView() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('address');
  const [dir, setDir] = useState(1);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [payMethod, setPayMethod] = useState<PayMethod>('pix');
  const [addr, setAddr] = useState({ zipCode:'', street:'', number:'', complement:'', neighborhood:'', city:'', state:'SP' });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [orderId, setOrderId] = useState('');
  const [cepLoading, setCepLoading] = useState(false);

  const frete = total >= 149 ? 0 : 18;
  const totalFinal = total + frete - discount;
  const go = (next: Step, direction = 1) => { setDir(direction); setStep(next); };

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'VELUDO10') setDiscount(+(total * 0.1).toFixed(2));
  };

  const lookupCEP = async (cep: string) => {
    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) return;
    setCepLoading(true);
    try {
      const data = await fetch(`https://viacep.com.br/ws/${clean}/json/`).then(r => r.json());
      if (!data.erro) setAddr(a => ({ ...a, street: data.logradouro ?? a.street, neighborhood: data.bairro ?? a.neighborhood, city: data.localidade ?? a.city, state: data.uf ?? a.state }));
    } catch { /* ignore network error */ }
    setCepLoading(false);
  };

  const submitOrder = async () => {
    setSubmitError('');
    setSubmitting(true);
    try {
      const order = await api.post<OrderResponse>('/orders', {
        items: items.map(i => ({ productId: i.product.id, quantity: i.qty })),
        shippingAddress: {
          zipCode: addr.zipCode.replace(/\D/g, ''),
          street: addr.street, number: addr.number,
          complement: addr.complement || undefined,
          neighborhood: addr.neighborhood, city: addr.city,
          state: addr.state, country: 'BR',
        },
        paymentMethod: payMethod === 'pix' ? 'PIX' : payMethod === 'card' ? 'CREDIT_CARD' : 'BOLETO',
        paymentProvider: 'mercadopago',
        couponCode: coupon.trim().toUpperCase() || undefined,
      });
      setOrderId(order.id);
      clearCart();
      go('done');
    } catch (err: any) {
      setSubmitError(err.message ?? 'Erro ao criar pedido. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps: Step[] = ['address','payment','confirm','done'];
  const stepIdx = steps.indexOf(step);
  const stepLabels = { address:'Endereço', payment:'Pagamento', confirm:'Revisão', done:'✓ Pedido' };
  const inputCls = 'w-full px-4 py-3 rounded-[20px] border border-[#2a1612]/20 focus:border-[#ed6058] outline-none text-sm bg-white';

  // Auth guard
  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="font-['Bagel_Fat_One',cursive] text-2xl text-[#2a1612] mb-2">Faça login para continuar</h2>
          <p className="text-[#2a1612]/60 text-sm mb-6">Você precisa estar logado para finalizar a compra.</p>
          <Link href="/login?callbackUrl=/checkout"><PillBtn size="lg">Entrar →</PillBtn></Link>
          <p className="mt-3 text-sm text-[#2a1612]/50">Não tem conta? <Link href="/cadastro" className="text-[#ed6058] font-medium hover:underline">Cadastrar-se</Link></p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-10 max-w-5xl mx-auto">
      <h1 className="font-['Bagel_Fat_One',cursive] text-3xl text-[#2a1612] mb-8">Finalizar compra</h1>

      {/* Progress bar */}
      <div className="flex items-center gap-1 mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <motion.div animate={{ backgroundColor: i <= stepIdx ? '#ed6058' : '#e5e7eb' }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {i < stepIdx ? '✓' : i + 1}
            </motion.div>
            <span className={`hidden sm:block ml-1.5 text-xs font-medium transition-colors ${i <= stepIdx ? 'text-[#2a1612]' : 'text-[#2a1612]/30'}`}>{stepLabels[s]}</span>
            {i < steps.length - 1 && (
              <motion.div className="flex-1 h-0.5 mx-2 rounded-full" animate={{ backgroundColor: i < stepIdx ? '#ed6058' : '#e5e7eb' }} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={step} custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ type:'spring', stiffness:300, damping:30 }}>

              {step === 'address' && (
                <div className="space-y-4">
                  <h2 className="font-sans font-bold text-xl text-[#2a1612]">Endereço de entrega</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#2a1612]/60 uppercase tracking-wide block mb-1.5">CEP {cepLoading && <span className="text-[#ed6058]">buscando...</span>}</label>
                      <input value={addr.zipCode} onChange={e => setAddr(a => ({...a, zipCode: e.target.value}))}
                        onBlur={e => lookupCEP(e.target.value)}
                        className={inputCls} placeholder="00000-000" maxLength={9}/>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#2a1612]/60 uppercase tracking-wide block mb-1.5">Estado</label>
                      <select value={addr.state} onChange={e => setAddr(a => ({...a, state: e.target.value}))}
                        className={inputCls}>
                        {STATES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-semibold text-[#2a1612]/60 uppercase tracking-wide block mb-1.5">Rua / Logradouro</label>
                      <input value={addr.street} onChange={e => setAddr(a => ({...a, street: e.target.value}))}
                        className={inputCls} placeholder="Rua das Flores" required/>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#2a1612]/60 uppercase tracking-wide block mb-1.5">Número</label>
                      <input value={addr.number} onChange={e => setAddr(a => ({...a, number: e.target.value}))}
                        className={inputCls} placeholder="123"/>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#2a1612]/60 uppercase tracking-wide block mb-1.5">Complemento</label>
                      <input value={addr.complement} onChange={e => setAddr(a => ({...a, complement: e.target.value}))}
                        className={inputCls} placeholder="Apto 4B (opcional)"/>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#2a1612]/60 uppercase tracking-wide block mb-1.5">Bairro</label>
                      <input value={addr.neighborhood} onChange={e => setAddr(a => ({...a, neighborhood: e.target.value}))}
                        className={inputCls} placeholder="Vila Madalena"/>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#2a1612]/60 uppercase tracking-wide block mb-1.5">Cidade</label>
                      <input value={addr.city} onChange={e => setAddr(a => ({...a, city: e.target.value}))}
                        className={inputCls} placeholder="São Paulo"/>
                    </div>
                  </div>
                  <PillBtn size="lg" onClick={() => go('payment')} disabled={!addr.street || !addr.number || !addr.city || !addr.zipCode}>
                    Continuar para pagamento →
                  </PillBtn>
                </div>
              )}

              {step === 'payment' && (
                <div className="space-y-4">
                  <h2 className="font-sans font-bold text-xl text-[#2a1612]">Forma de pagamento</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {([['pix','⚡','Pix','5% OFF'],['card','💳','Cartão',''],['boleto','📄','Boleto','']] as const).map(([m, icon, label, tag]) => (
                      <button key={m} onClick={() => setPayMethod(m)}
                        className={`p-4 rounded-[20px] border-2 text-center transition ${payMethod===m ? 'border-[#ed6058] bg-[#ed6058]/5' : 'border-[#2a1612]/20 hover:border-[#2a1612]/40'}`}>
                        <div className="text-2xl mb-1">{icon}</div>
                        <div className="text-sm font-medium">{label}</div>
                        {tag && <div className="text-xs text-green-600 font-semibold">{tag}</div>}
                      </button>
                    ))}
                  </div>
                  {payMethod === 'pix' && (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="bg-[#fdfedf] rounded-[20px] p-4 text-sm text-[#2a1612]/70">
                      <p>⚡ O QR Code Pix será gerado após a confirmação do pedido. Válido por 30 minutos.</p>
                    </motion.div>
                  )}
                  {payMethod === 'card' && (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-3">
                      <input className={inputCls} placeholder="Número do cartão"/>
                      <div className="grid grid-cols-2 gap-3">
                        <input className={inputCls} placeholder="MM/AA"/>
                        <input className={inputCls} placeholder="CVV"/>
                      </div>
                      <input className={inputCls} placeholder="Nome no cartão"/>
                    </motion.div>
                  )}
                  {payMethod === 'boleto' && (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="bg-[#fdfedf] rounded-[20px] p-4 text-sm text-[#2a1612]/70">
                      <p>📄 Boleto bancário com vencimento em 3 dias úteis. Enviaremos por e-mail após a confirmação.</p>
                    </motion.div>
                  )}
                  <div className="flex gap-3">
                    <PillBtn variant="ghost" onClick={() => go('address', -1)}>← Voltar</PillBtn>
                    <PillBtn onClick={() => go('confirm')}>Revisar pedido →</PillBtn>
                  </div>
                </div>
              )}

              {step === 'confirm' && (
                <div className="space-y-4">
                  <h2 className="font-sans font-bold text-xl text-[#2a1612]">Revisar pedido</h2>
                  {items.map(({ product, qty }) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 bg-white rounded-[20px]">
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ background: product.colorways[0] }}>
                        {product.images?.[0] && <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover"/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate text-[#2a1612]">{product.name}</p>
                        <p className="text-[#2a1612]/50 text-xs">Qtd: {qty}</p>
                      </div>
                      <p className="font-bold text-[#ed6058] text-sm">R$ {(product.price*qty).toFixed(2).replace('.',',')}</p>
                    </div>
                  ))}
                  <AnimatePresence>
                    {submitError && (
                      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        className="bg-red-50 text-red-600 text-sm p-4 rounded-[20px]">
                        {submitError}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex gap-3">
                    <PillBtn variant="ghost" onClick={() => go('payment', -1)}>← Voltar</PillBtn>
                    <PillBtn size="lg" onClick={submitOrder} disabled={submitting}>
                      {submitting ? 'Processando...' : 'Confirmar e pagar'}
                    </PillBtn>
                  </div>
                </div>
              )}

              {step === 'done' && (
                <motion.div initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }} className="text-center py-10">
                  <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:200, damping:12, delay:0.15 }}
                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </motion.div>
                  <h2 className="font-['Bagel_Fat_One',cursive] text-3xl text-[#2a1612] mb-3">Pedido confirmado! 🐾</h2>
                  {orderId && <p className="text-[#2a1612]/50 text-xs mb-2">Pedido #{orderId.slice(0,8).toUpperCase()}</p>}
                  <p className="text-[#2a1612]/60 mb-2">Você receberá as instruções de pagamento em instantes.</p>
                  <p className="text-[#2a1612]/60 mb-8">Entrega em até 72h após a confirmação do pagamento.</p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/perfil"><PillBtn variant="ghost">Ver meus pedidos</PillBtn></Link>
                    <Link href="/"><PillBtn size="lg">Continuar comprando</PillBtn></Link>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Order summary */}
        {step !== 'done' && (
          <div className="bg-white rounded-[32px] p-6 h-fit sticky top-24">
            <h3 className="font-sans font-bold text-lg text-[#2a1612] mb-4">Resumo</h3>
            <div className="space-y-2 text-sm mb-4">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex justify-between text-[#2a1612]/70">
                  <span className="truncate mr-2">{product.name} ×{qty}</span>
                  <span className="flex-shrink-0">R$ {(product.price*qty).toFixed(2).replace('.',',')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#2a1612]/10 pt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#2a1612]/60">Subtotal</span><span>R$ {total.toFixed(2).replace('.',',')}</span></div>
              <div className="flex justify-between">
                <span className="text-[#2a1612]/60">Frete</span>
                {frete===0 ? <span className="text-green-600 font-semibold">Grátis</span> : <span>R$ {frete.toFixed(2).replace('.',',')}</span>}
              </div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Desconto (10%)</span><span>−R$ {discount.toFixed(2).replace('.',',')}</span></div>}
            </div>
            <div className="flex gap-2 my-4">
              <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Cupom de desconto"
                className="flex-1 px-3 py-2 rounded-[12px] border border-[#2a1612]/20 focus:border-[#ed6058] outline-none text-sm"/>
              <button onClick={applyCoupon} className="px-4 py-2 bg-[#2a1612] text-white rounded-[12px] text-sm font-medium hover:bg-[#ed6058] transition">Aplicar</button>
            </div>
            <div className="border-t border-[#2a1612]/10 pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-[#ed6058] text-lg">R$ {totalFinal.toFixed(2).replace('.',',')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
