import Hero from '@/components/home/Hero';
import MomentStrip from '@/components/home/MomentStrip';
import Featured from '@/components/home/Featured';
import FlashSale from '@/components/home/FlashSale';
import KitsSection from '@/components/home/KitsSection';
import QuizTeaser from '@/components/home/QuizTeaser';
import Reviews from '@/components/home/Reviews';
import WhyStrip from '@/components/home/WhyStrip';
import SocialBar from '@/components/home/SocialBar';
import { PV_DATA } from '@/lib/data';
import { normalizeProduct, normalizeCategory } from '@/lib/types';
import type { ApiCategory, ApiProduct, PagedResponse } from '@/lib/types';

export default async function HomePage() {
  const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

  const [catsRaw, featuredRaw, allRaw] = await Promise.all([
    fetch(`${BASE}/categories`, { next: { revalidate: 3600 } })
      .then(r => r.json() as Promise<ApiCategory[]>)
      .catch(() => [] as ApiCategory[]),
    fetch(`${BASE}/products?size=6`, { next: { revalidate: 60 } })
      .then(r => r.json() as Promise<PagedResponse<ApiProduct>>)
      .catch(() => ({ content: [] as ApiProduct[], totalPages: 0, totalElements: 0, number: 0, size: 0 })),
    fetch(`${BASE}/products?size=24`, { next: { revalidate: 60 } })
      .then(r => r.json() as Promise<PagedResponse<ApiProduct>>)
      .catch(() => ({ content: [] as ApiProduct[], totalPages: 0, totalElements: 0, number: 0, size: 0 })),
  ]);

  const categories = catsRaw.map(normalizeCategory);
  const featured = featuredRaw.content.map(normalizeProduct);
  const flashSale = allRaw.content.filter(p => p.originalPrice != null).slice(0, 4).map(normalizeProduct);

  return (
    <>
      <Hero />
      <MomentStrip categories={categories} />
      <Featured products={featured} />
      <FlashSale products={flashSale} />
      <KitsSection kits={PV_DATA.kits} />
      <QuizTeaser />
      <Reviews reviews={PV_DATA.reviews} />
      <WhyStrip />
      <SocialBar />
    </>
  );
}
