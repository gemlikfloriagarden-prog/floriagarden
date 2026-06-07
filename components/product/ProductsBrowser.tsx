"use client";

import { useState } from "react";
import ProductGrid from "./ProductGrid";
import type { Product } from "@/lib/data/products";
import type { Category } from "@/lib/data/categories";
import { cn } from "@/lib/utils/cn";

type Props = {
  products: Product[];
  categories: Category[];
};

/**
 * Tüm ürünler tek seferde yüklenir; kategori chip'leri sunucuya gitmeden
 * anında (client tarafında) filtreler — kategoriler arası geçiş ışık hızında.
 */
export default function ProductsBrowser({ products, categories }: Props) {
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
