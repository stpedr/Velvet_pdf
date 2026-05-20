import { notFound } from 'next/navigation';
import CategoryView from '@/components/views/CategoryView';
import { serverFetch } from '@/lib/api';
import { normalizeProduct, normalizeCategory } from '@/lib/types';
import type { ApiCategory, ApiProduct, PagedResponse } from '@/lib/types';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

  const cats = await fetch(`${BASE}/categories`, { next: { revalidate: 3600 } })
    .then(r => r.json() as Promise<ApiCategory[]>)
    .catch(() => [] as ApiCategory[]);

  const cat = cats.find(c => c.slug === params.slug);
  if (!cat) notFound();

  const page = await fetch(`${BASE}/products?cat=${cat.id}&size=50`, { next: { revalidate: 60 } })
    .then(r => r.json() as Promise<PagedResponse<ApiProduct>>)
    .catch(() => ({ content: [] as ApiProduct[], totalPages: 0, totalElements: 0, number: 0, size: 0 }));

  return <CategoryView category={normalizeCategory(cat)} products={page.content.map(normalizeProduct)} />;
}
