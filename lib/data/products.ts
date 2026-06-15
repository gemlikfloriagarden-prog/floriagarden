export type Product = {
  id: string;
  /** URL slug — id ile aynı olabilir */
  slug: string;
  name: string;
  shortDescription: string;
  /** Ürün detay sayfasında genişletilmiş açıklama */
  longDescription: string;
  /** İçerdiği çiçekler / bileşenler */
  contents: string[];
  /** Bakım notları */
  careTips: string[];
  price: number;
  category: string;
  /** Hex etiket (badge) örn: "Yeni", "Çok Satan" */
  badge?: string;
  /** Görsel yer tutucu için gradient (foto yoksa kullanılır) */
  gradient: string;
  /** Yüklenen gerçek görsel (WebP data URL veya URL) */
  image?: string;
  /** Ürün galerisindeki gerçek görseller. İlk görsel ana görsel olarak kullanılır. */
  images?: string[];
  /** Galeride birden fazla "görsel" simülasyonu için ek gradientler */
  galleryGradients?: string[];
  /** Bu ürünle iyi giden ürün ID'leri */
  pairings?: string[];
  /** Boyut / ölçüler */
  dimensions?: string;
  /** Stok durumu */
  stock?: "var" | "az" | "tukendi";
};

export const PRODUCTS: Product[] = [];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter((p) => p.category === categorySlug);
}

export function getRelatedProducts(productId: string, limit = 4): Product[] {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return [];
  // Önce pairings, sonra aynı kategoriden, sonra random doldur
  const paired = (product.pairings ?? [])
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
  const sameCategory = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== productId,
  );
  const merged = [...paired, ...sameCategory].filter(
    (p, idx, arr) => arr.findIndex((x) => x.id === p.id) === idx,
  );
  return merged.slice(0, limit);
}
