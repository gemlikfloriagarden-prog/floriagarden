"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Tag, PackageCheck, RotateCcw, ChevronDown } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import FadeIn from "@/components/motion/FadeIn";
import type { Product } from "@/lib/data/products";
import { cn } from "@/lib/utils/cn";

type SortKey = "default" | "price-asc" | "price-desc" | "name";
type PriceKey = "all" | "lt1000" | "mid" | "gt1500";

type Props = {
  products: Product[];
  /** Üstte ürün sayısı + filtre + sıralama */
  showToolbar?: boolean;
};

const PRICE_FILTERS: { key: PriceKey; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "lt1000", label: "1.000 ₺ altı" },
  { key: "mid", label: "1.000 – 1.500 ₺" },
  { key: "gt1500", label: "1.500 ₺ üzeri" },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "default", label: "Önerilen" },
  { key: "price-asc", label: "Fiyat (artan)" },
  { key: "price-desc", label: "Fiyat (azalan)" },
  { key: "name", label: "İsim (A-Z)" },
];

function matchesPrice(price: number, key: PriceKey) {
  switch (key) {
    case "lt1000":
      return price < 1000;
    case "mid":
      return price >= 1000 && price <= 1500;
    case "gt1500":
      return price > 1500;
    default:
      return true;
  }
}

export default function ProductGrid({ products, showToolbar = true }: Props) {
  const [sort, setSort] = useState<SortKey>("default");
  const [price, setPrice] = useState<PriceKey>("all");
  const [inStockOnly, setInStockOnly] = useState(false);

  const filtersActive = price !== "all" || inStockOnly;

  const visible = useMemo(() => {
    const list = products.filter((p) => {
      if (inStockOnly && p.stock === "tukendi") return false;
      if (!matchesPrice(p.price, price)) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "name":
        return list.sort((a, b) => a.name.localeCompare(b.name, "tr"));
      default:
        return list;
    }
  }, [products, sort, price, inStockOnly]);

  const resetFilters = () => {
    setPrice("all");
    setInStockOnly(false);
  };

  // Kategoride hiç ürün yoksa (gerçekten boş)
  if (products.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Bu koleksiyon hazırlanıyor"
        description="Bu kategorideki ürünleri özenle hazırlıyoruz. Bu arada diğer koleksiyonlarımıza göz atabilirsiniz."
        primaryCta={{ label: "Tüm Ürünler", href: "/urunler" }}
        secondaryCta={{ label: "İletişim", href: "/iletisim" }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {showToolbar && (
        <div className="rounded-3xl border border-rose-gold/20 bg-white shadow-soft px-4 sm:px-5 py-3.5 flex flex-wrap items-center gap-x-3 gap-y-3">
          {/* Sonuç sayısı */}
          <span className="text-sm text-coffee/65 whitespace-nowrap">
            <strong className="text-bordo font-semibold tabular-nums">
              {visible.length}
            </strong>{" "}
            ürün
          </span>

          {/* Dikey ayraç */}
          <span className="hidden sm:block h-5 w-px bg-rose-gold/20" aria-hidden />

          {/* Fiyat etiketi */}
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider2 text-rose-goldDark">
            <Tag size={13} strokeWidth={1.7} aria-hidden />
            Fiyat
          </span>

          {/* Fiyat pill'leri */}
          <div className="flex flex-wrap items-center gap-2">
            {PRICE_FILTERS.map((f) => {
              const active = price === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setPrice(f.key)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex items-center rounded-full px-3.5 h-8 text-xs font-medium tracking-wide transition-all duration-200",
                    active
                      ? "bg-rose-gold-gradient text-coffee border border-transparent shadow-soft"
                      : "border border-rose-gold/25 bg-white text-coffee/70 hover:border-rose-gold hover:text-coffee",
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Stok */}
          <button
            type="button"
            onClick={() => setInStockOnly((v) => !v)}
            aria-pressed={inStockOnly}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 h-8 text-xs font-medium tracking-wide transition-all duration-200",
              inStockOnly
                ? "bg-bordo text-cream border border-transparent shadow-soft"
                : "border border-rose-gold/25 bg-white text-coffee/70 hover:border-rose-gold hover:text-coffee",
            )}
          >
            <PackageCheck size={14} strokeWidth={1.7} aria-hidden />
            Sadece stoktakiler
          </button>

          {/* Sıfırla */}
          <AnimatePresence>
            {filtersActive && (
              <motion.button
                type="button"
                onClick={resetFilters}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center gap-1.5 text-xs text-coffee/50 hover:text-bordo transition-colors"
              >
                <RotateCcw size={13} strokeWidth={1.7} aria-hidden />
                Temizle
              </motion.button>
            )}
          </AnimatePresence>

          {/* Sıralama — sağa yaslı */}
          <div className="relative flex items-center gap-2 ml-auto">
            <label
              htmlFor="sort"
              className="text-coffee/55 text-sm hidden md:block whitespace-nowrap"
            >
              Sırala:
            </label>
            <div className="relative">
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Ürünleri sırala"
                className="appearance-none cursor-pointer rounded-full border border-rose-gold/30 bg-cream-soft pl-4 pr-9 h-9 text-sm text-coffee font-medium hover:border-rose-gold focus:outline-none focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 transition-colors"
                style={{ colorScheme: "light" }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                strokeWidth={1.8}
                aria-hidden
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-coffee/50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Sonuç yok (filtre kaynaklı) */}
      {visible.length === 0 ? (
        <div className="rounded-3xl border border-rose-gold/20 bg-white shadow-soft px-6 py-14 flex flex-col items-center text-center gap-4">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-gold-gradient text-coffee">
            <Tag size={24} strokeWidth={1.4} />
          </span>
          <div className="flex flex-col gap-1.5 max-w-sm">
            <h3 className="font-display text-2xl text-coffee">
              Eşleşen ürün bulunamadı
            </h3>
            <p className="text-sm text-coffee/60">
              Seçtiğiniz filtrelere uygun ürün yok. Filtreleri temizleyerek tüm
              koleksiyonu görebilirsiniz.
            </p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 rounded-full bg-bordo text-cream px-5 h-10 text-sm font-medium hover:bg-bordo-dark transition-colors"
          >
            <RotateCcw size={15} strokeWidth={1.7} />
            Filtreleri temizle
          </button>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${sort}-${price}-${inStockOnly}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "grid gap-3 sm:gap-5 md:gap-6",
              "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
            )}
          >
            {visible.map((product, i) => (
              <FadeIn key={product.id} delay={(i % 8) * 0.04} y={16}>
                <ProductCard product={product} index={i + 1} />
              </FadeIn>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
