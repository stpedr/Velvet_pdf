import { notFound } from 'next/navigation';
import ProductView from '@/components/views/ProductView';
import { normalizeProduct } from '@/lib/types';
import type { ApiProduct, PagedResponse } from '@/lib/types';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

  const raw = await fetch(`${BASE}/products/${params.id}`, { next: { revalidate: 60 } });
  if (!raw.ok) notFound();
  const product: ApiProduct = await raw.json();

  const relPage = await fetch(`${BASE}/products?cat=${product.categoryId}&size=8`, { next: { revalidate: 60 } })
    .then(r => r.json() as Promise<PagedResponse<ApiProduct>>)
    .catch(() => ({ content: [] as ApiProduct[], totalPages: 0, totalElements: 0, number: 0, size: 0 }));

  const related = relPage.content
    .filter(p => p.id !== product.id)
    .slice(0, 4)
    .map(normalizeProduct);

  return <ProductView product={normalizeProduct(product)} related={related} />;
}
