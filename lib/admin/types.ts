/**
 * Admin panel veri tipleri.
 *
 * Bu tipler hem demo (localStorage) hem de ileride gerçek veritabanı
 * için ortak sözleşmedir. Veritabanına geçerken yalnızca lib/admin/store.ts
 * içindeki okuma/yazma fonksiyonları değişir — bu tipler ve sayfalar aynı kalır.
 */

export type AdminCategory = {
  slug: string;
  name: string;
  description: string;
  /** Görsel yer tutucu gradient (foto yükleme DB ile gelecek) */
  gradient: string;
};

export type StockState = "var" | "az" | "tukendi";

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  price: number;
  /** Kategori slug'ı */
  category: string;
  stock: StockState;
  /** Opsiyonel rozet: "Yeni", "Çok Satan" vb. */
  badge?: string;
  /** Görsel yer tutucu gradient */
  gradient: string;
};

/** Üyeye özel üretilen kod — hem indirim hem takip için */
export type MemberCode = {
  /** Benzersiz takip + kupon kodu, örn. FG-AY-3F9K */
  code: string;
  /** İndirim türü */
  discountType: "percent" | "fixed";
  /** Yüzde için 0–100, sabit için ₺ tutarı */
  discountValue: number;
  /** Oluşturulma tarihi (ISO) */
  createdAt: string;
  /** Admin notu (opsiyonel) */
  note?: string;
};

export type Member = {
  id: string;
  name: string;
  phone: string;
  email: string;
  /** Doğum tarihi (ISO yyyy-mm-dd, opsiyonel) */
  birthDate?: string;
  /** Üyelik tarihi (ISO) */
  joinedAt: string;
  /** Bu üyeye üretilmiş özel kodlar */
  codes: MemberCode[];
};

/** localStorage'da tutulan tüm admin verisi */
export type AdminData = {
  categories: AdminCategory[];
  products: AdminProduct[];
  members: Member[];
};
