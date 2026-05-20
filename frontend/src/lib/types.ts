// ─── UI types (used throughout components) ───────────────────────────────────

export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  old?: number;
  cat: string;
  categoryId: string;
  colorways: string[];
  tag?: string;
  story: string;
  specs: string[];
  images?: string[];
  stockQty?: number;
}

export interface Kit {
  id: string;
  name: string;
  items: string[];
  price: number;
  old: number;
  desc: string;
}

export interface Category {
  id: string;       // UUID from backend
  slug: string;
  label: string;
  emoji: string;
  desc?: string;
}

export interface Review {
  who: string;
  city: string;
  text: string;
  rating: number;
}

export interface CartItem {
  product: Product;
  qty: number;
}

// ─── Auth types ───────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN';
  tier: 'VELUDO' | 'OURO' | 'PANTERA';
  loyaltyPoints: number;
}

// ─── API response types (backend shapes) ─────────────────────────────────────

/** Backend ProductResponse — colorways/specs/images are raw JSON strings */
export interface ApiProduct {
  id: string;
  name: string;
  tagline: string;
  story: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  categoryName: string;
  colorways: string;   // JSON string: ["#ed6058",...]
  tag?: string;
  specs: string;       // JSON string: ["spec1","spec2",...]
  images: string;      // JSON string: ["/path/img.jpg",...]
  active: boolean;
  stockQty: number;
}

/** Backend Category entity */
export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemResponse {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  colorway?: string;
}

export interface OrderResponse {
  id: string;
  status: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentMethod: string;
  couponCode?: string;
  items: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

// ─── Normalizers ──────────────────────────────────────────────────────────────

function tryParse<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback;
  try { return JSON.parse(json); } catch { return fallback; }
}

const EMOJI_MAP: Record<string, string> = {
  brincar: 'play', descansar: 'sleep', hidratar: 'water',
  passear: 'travel', cuidar: 'groom',
};

export function normalizeProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    name: p.name,
    tagline: p.tagline,
    story: p.story,
    price: p.price,
    old: p.originalPrice,
    cat: (p.categoryName ?? '').toLowerCase(),
    categoryId: p.categoryId,
    colorways: tryParse<string[]>(p.colorways, []),
    tag: p.tag,
    specs: tryParse<string[]>(p.specs, []),
    images: tryParse<string[] | undefined>(p.images, undefined) ?? undefined,
    stockQty: p.stockQty,
  };
}

export function normalizeCategory(c: ApiCategory): Category {
  return {
    id: c.id,
    slug: c.slug,
    label: c.name,
    emoji: EMOJI_MAP[c.slug] ?? 'paw',
    desc: c.description,
  };
}
