"use client";

import { useState } from "react";
import ProductGrid from "./ProductGrid";
import { useCatalog } from "@/lib/catalog-client";
import { cn } from "@/lib/utils/cn";

/**
 * Tüm ürünleri tek seferde (client + önbellekli) yükler; kategori chip'leri
 * sunucuya gitmeden anında filtreler. Sayfa anında açılır, ürünler arka planda
 * gelir — kart-iskeleti flaşı yok.
 */
export default function ProductsBrowser() {
  const { products, categories, loading } = useCatalog();
  const [active, setActive] = useState<string>("all");

  const filtered =
    active === "all"
      ? products
      : products.filter((p) => p.category === active);

  const chip = (on: boolean) =>
    cn(
      "inline-flex items-center rounded-full px-4 h-9 text-xs tracking-wide transition-colors",
      on
        ? "bg-rose-gold-gradient text-coffee font-medium"
        : "border border-rose-gold/25 bg-white text-coffee/75 hover:text-coffee hover:border-rose-gold",
    );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-28 text-coffee/50">
        <span className="h-9 w-9 rounded-full border-2 border-rose-gold/30 border-t-bordo animate-spin" />
        <span className="text-sm">Ürünler yükleniyor…</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          type="button"
          onClick={() => setActive("all")}
          className={chip(active === "all")}
        >
          Tümü
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setActive(c.slug)}
            className={chip(active === c.slug)}
          >
            {c.name}
          </button>
        ))}
      </div>

      <ProductGrid products={filtered} />
    </>
  );
}
