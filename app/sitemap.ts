import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/data/products";
import { CATEGORIES } from "@/lib/data/categories";
import { SITE_URL } from "@/lib/constants";
import { getPublicCategories, getPublicProducts } from "@/lib/db/queries";
import { LANDING_PAGES } from "@/lib/seo/landingPages";

const BASE_URL = SITE_URL;

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  let products = PRODUCTS;
  let categories = CATEGORIES;

  try {
    const [dbProducts, dbCategories] = await Promise.all([
      getPublicProducts(),
      getPublicCategories(),
    ]);
    products = dbProducts;
    categories = dbCategories;
  } catch {
    // Build ve DB kesintilerinde sitemap üretimi bozulmasın.
  }

  const staticPages = [
    "",
    "/urunler",
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
    ...LANDING_PAGES.map((p) => ({
      url: `${BASE_URL}/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...categories.map((c) => ({
      url: `${BASE_URL}/koleksiyon/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${BASE_URL}/urun/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
