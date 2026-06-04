import { CATEGORIES } from "@/lib/data/categories";
import { PRODUCTS } from "@/lib/data/products";
import type { AdminData, AdminCategory, AdminProduct, Member } from "./types";

/**
 * Demo başlangıç verisi.
 *
 * Public sitedeki statik kategori ve ürünleri admin tiplerine eşler, üstüne
 * birkaç demo üye ekler. Veritabanına geçince bu dosya tamamen silinecek;
 * yerine gerçek kayıtlar gelecek.
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
  }));
}

const seedMembers: Member[] = [
  {
    id: "uye-ayse-demir",
    name: "Ayşe Demir",
    phone: "+90 532 111 22 33",
    email: "ayse.demir@example.com",
    birthDate: "1992-04-18",
    joinedAt: "2026-02-12T10:30:00+03:00",
    codes: [
      {
        code: "FG-AD-7K2P",
        discountType: "percent",
        discountValue: 15,
        createdAt: "2026-03-01T09:00:00+03:00",
        note: "Sadık müşteri — yıldönümü jesti",
      },
    ],
  },
  {
    id: "uye-mehmet-yilmaz",
    name: "Mehmet Yılmaz",
    phone: "+90 505 444 55 66",
    email: "mehmet.yilmaz@example.com",
    birthDate: "1987-11-03",
    joinedAt: "2026-03-20T14:05:00+03:00",
    codes: [],
  },
  {
    id: "uye-zeynep-kaya",
    name: "Zeynep Kaya",
    phone: "+90 542 777 88 99",
    email: "zeynep.kaya@example.com",
    joinedAt: "2026-05-02T18:45:00+03:00",
    codes: [
      {
        code: "FG-ZK-9M4X",
        discountType: "fixed",
        discountValue: 100,
        createdAt: "2026-05-10T11:20:00+03:00",
      },
    ],
  },
];

export function buildSeed(): AdminData {
  return {
    categories: seedCategories(),
    products: seedProducts(),
    members: seedMembers.map((m) => ({ ...m, codes: [...m.codes] })),
  };
}
