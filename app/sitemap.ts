import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/data/products";
import { CATEGORIES } from "@/lib/data/categories";
import { SITE_URL } from "@/lib/constants";

const BASE_URL = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    "",
    "/urunler",
    "/sepet",
    "/favoriler",
    "/hakkimizda",
    "/iletisim",
    "/sss",
    "/teslimat",
    "/kvkk",
    "/gizlilik",
    "/cerez-politikasi",
    "/mesafeli-satis",
  ];

  return [
    ...staticPages.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...CATEGORIES.map((c) => ({
      url: `${BASE_URL}/koleksiyon/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...PRODUCTS.map((p) => ({
      url: `${BASE_URL}/urun/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
