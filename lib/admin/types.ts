/**
 * Admin paneli ile veritabanı/API katmanının ortak veri tipleri.
 */

export type AdminCategory = {
  slug: string;
  name: string;
  description: string;
  /** Görsel yer tutucu gradient (foto yokken kullanılır) */
  gradient: string;
  /** Yüklenen görsel (WebP data URL) — varsa gradient yerine kullanılır */
  image?: string;
};

export type StockState = "var" | "az" | "tukendi";

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  /** Detay sayfası uzun açıklaması */
  longDescription?: string;
  /** İçindekiler / bileşenler listesi */
  contents?: string[];
  price: number;
  /** Kategori slug'ı */
  category: string;
  stock: StockState;
  /** Opsiyonel rozet: "Yeni", "Çok Satan" vb. */
  badge?: string;
  /** Görsel yer tutucu gradient (foto yokken kullanılır) */
  gradient: string;
  /** Yüklenen görsel (WebP data URL) — varsa gradient yerine kullanılır */
  image?: string;
  /** Ürün galerisindeki görseller. İlk görsel ana görsel olarak kullanılır. */
  images?: string[];
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

/** Tüm üyelerin kullanabileceği genel (kampanya) kod */
export type GeneralCode = {
  /** Kupon kodu, örn. BAHAR15 */
  code: string;
  discountType: "percent" | "fixed";
  /** Yüzde için 0–100, sabit için ₺ tutarı */
  discountValue: number;
  /** Oluşturulma tarihi (ISO) */
  createdAt: string;
  /** Açıklama / kampanya notu (opsiyonel) */
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

export type MemberAddress = {
  id: string;
  memberId: string;
  label: string;
  recipientName: string;
  phone: string;
  cityDistrict: string;
  address: string;
  note?: string;
  isDefault: boolean;
  createdAt: string;
};

/** Teslimat bölgesi (süre + ücret) */
export type DeliveryZone = {
  id: string;
  name: string;
  /** Tahmini süre, örn. "60 — 120 dk" */
  eta: string;
  /** Ücret metni, örn. "Ücretsiz" veya "75 ₺" */
  fee: string;
  /** Alt açıklama, örn. "100 ₺ üzeri siparişlerde" */
  note: string;
};

/** Teslimat süreci adımı */
export type DeliveryStep = {
  id: string;
  /** İkon anahtarı (lib/admin/deliveryIcons) */
  icon: string;
  title: string;
  text: string;
};

export type OrderStatus =
  | "yeni"
  | "hazirlaniyor"
  | "yolda"
  | "teslim"
  | "iptal";

export type PaymentMethod = "nakit" | "havale" | "kapida";

export type OrderItem = {
  /** Bağlı ürün (opsiyonel) */
  productId?: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  /** Okunabilir sipariş no, örn. FG-260604-417 */
  orderNo: string;
  /** Oluşturma tarihi (ISO) */
  createdAt: string;
  // Müşteri (gönderen)
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  // Alıcı
  recipientName: string;
  recipientPhone: string;
  address: string;
  /** Sürpriz: gönderen alıcıya açıklanmaz */
  surprise: boolean;
  // Ürünler
  items: OrderItem[];
  // Teslimat
  deliveryZone: string;
  /** Teslim tarihi (yyyy-mm-dd) */
  deliveryDate: string;
  deliverySlot: string;
  // Ödeme + durum
  payment: PaymentMethod;
  status: OrderStatus;
  // Kart notu + admin notu
  cardNote: string;
  adminNote: string;
};

/** Yönetim panelinde tek ekrana taşınan tüm veriler */
export type AdminData = {
  categories: AdminCategory[];
  products: AdminProduct[];
  members: Member[];
  /** Tüm üyelerin kullanabileceği genel kodlar */
  generalCodes: GeneralCode[];
  /** Teslimat bölgeleri ve fiyatları */
  deliveryZones: DeliveryZone[];
  /** Teslimat süreci adımları */
  deliveryProcess: DeliveryStep[];
  /** Siparişler (şimdilik manuel girilir) */
  orders: Order[];
};
