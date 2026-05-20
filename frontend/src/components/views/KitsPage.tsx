'use client';
import { Badge, PillBtn } from '../shared';
import type { Kit } from '@/lib/types';

export default function KitsPage({ kits }: { kits: Kit[] }) {
  return (
    <div className="px-4 md:px-8 py-10 max-w-6xl mx-auto">
      <h1 className="font-['Bagel_Fat_One',cursive] text-4xl md:text-5xl text-[#2a1612] mb-3">kits pensados pra cada fase</h1>
      <p className="text-[#2a1612]/60 mb-10">Economize até 30% comprando em conjunto.</p>
      <div className="space-y-6">
        {kits.map(kit => {
          const saving = kit.old - kit.price;
          const pct = Math.round((saving / kit.old) * 100);
          return (
            <div key={kit.id} className="bg-white rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <Badge>{-pct}% OFF</Badge>
                <h2 className="font-['Bagel_Fat_One',cursive] text-2xl text-[#2a1612] mt-2 mb-2">{kit.name}</h2>
                <p className="text-[#2a1612]/60 text-sm mb-4">{kit.desc}</p>
                <ul className="space-y-1 mb-6">
                  {kit.items.map(item => <li key={item} className="text-sm flex items-center gap-2"><span className="text-[#ed6058] font-bold">✓</span>{item}</li>)}
                </ul>
                <div className="flex items-baseline gap-3">
                  <span className="font-['Bagel_Fat_One',cursive] text-3xl text-[#ed6058]">R$ {kit.price.toFixed(2).replace('.',',')}</span>
                  <span className="text-[#2a1612]/40 line-through">R$ {kit.old.toFixed(2).replace('.',',')}</span>
                  <span className="text-green-600 text-sm font-semibold">Economia de R$ {saving.toFixed(2).replace('.',',')}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 md:w-52 justify-center">
                <PillBtn size="lg">Levar o kit</PillBtn>
                <p className="text-xs text-[#2a1612]/50 text-center">Frete grátis neste kit</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
