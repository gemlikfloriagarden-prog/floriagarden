import { CATEGORIES } from "@/lib/data/categories";
import { PRODUCTS } from "@/lib/data/products";
import type {
  AdminData,
  AdminCategory,
  AdminProduct,
  Member,
  GeneralCode,
  DeliveryZone,
  DeliveryStep,
} from "./types";

/**
 * Başlangıç verisi.
 *
 * Public sitedeki statik kategori ve ürünleri admin tiplerine eşler.
 * Kurulum sırasında veritabanı boşsa güvenli varsayılanlar sağlar.
 */

function seedCategories(): AdminCategory[] {
  return CATEGORIES.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    gradient: c.gradient,
  }));
}

function seedProducts(): AdminProduct[] {
  return PRODUCTS.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    price: p.price,
    category: p.category,
    stock: p.stock ?? "var",
    badge: p.badge,
    gradient: p.gradient,
    image: p.image,
    images: p.images,
  }));
}

const seedMembers: Member[] = [];

const seedGeneralCodes: GeneralCode[] = [];

const seedDeliveryZones: DeliveryZone[] = [
  { id: "zone-gemlik-merkez", name: "Gemlik Merkez", eta: "60 — 120 dk", fee: "Ücretsiz", note: "100 ₺ üzeri siparişlerde" },
  { id: "zone-gemlik-cevresi", name: "Gemlik Çevresi", eta: "120 — 180 dk", fee: "75 ₺", note: "Köy yerleşimleri dâhil" },
  { id: "zone-cevre-ilceler", name: "Çevre İlçeler", eta: "1 — 2 iş günü", fee: "Mesafeye göre", note: "Anlaşmalı kurye" },
];

const seedDeliveryProcess: DeliveryStep[] = [
  { id: "step-hazirlama", icon: "sparkles", title: "Sipariş hazırlama", text: "Atölyemizde çiçek şefimiz tarafından özenle hazırlanır." },
  { id: "step-ambalaj", icon: "gift", title: "Lüks ambalaj", text: "Kadife, ipek ve doğal dokularla butik ambalaj yapılır." },
  { id: "step-yolda", icon: "truck", title: "Yolda", text: "Isı kontrollü ekipmanlarla kuryemiz adrese yola çıkar." },
  { id: "step-teslim", icon: "shield", title: "Elden teslim", text: "Çiçeğin tazeliği korunarak alıcıya elden teslim edilir." },
];

/** Yalnızca teslimat verisi (public sayfanın seed başlangıcı için). */
export function seedDelivery(): {
  deliveryZones: DeliveryZone[];
  deliveryProcess: DeliveryStep[];
} {
  return {
    deliveryZones: seedDeliveryZones.map((z) => ({ ...z })),
    deliveryProcess: seedDeliveryProcess.map((s) => ({ ...s })),
  };
}

export function buildSeed(): AdminData {
  return {
    categories: seedCategories(),
    products: seedProducts(),
    members: seedMembers.map((m) => ({ ...m, codes: [...m.codes] })),
    generalCodes: seedGeneralCodes.map((c) => ({ ...c })),
    ...seedDelivery(),
    // Siparişler manuel girilir — boş başlar.
    orders: [],
  };
}
