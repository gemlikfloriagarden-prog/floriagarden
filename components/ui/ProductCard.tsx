"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageCircle, Plus, Check } from "lucide-react";
import { useState } from "react";
import BotanicalArt from "./BotanicalArt";
import WishlistButton from "@/components/wishlist/WishlistButton";
import type { Product } from "@/lib/data/products";
import { whatsappLink } from "@/lib/constants";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/components/toast/ToastProvider";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

type Props = {
  product: Product;
  /** Lookbook sıra numarası (1 tabanlı). Verilmezse id'den türetilir. */
  index?: number;
};

function lookbookNo(product: Product, index?: number): string {
  const n =
    index ??
    (Array.from(product.id).reduce((a, c) => a + c.charCodeAt(0), 0) % 24) + 1;
  return String(n).padStart(2, "0");
}

export default function ProductCard({ product, index }: Props) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [added, setAdded] = useState(false);

  const askMessage = `Merhaba Floria Garden, "${product.name}" hakkında bilgi almak istiyorum.`;
  const isSoldOut = product.stock === "tukendi";
  const no = lookbookNo(product, index);

  const handleAdd = () => {
    if (isSoldOut) return;
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        gradient: product.gradient,
      },
      1,
    );
    setAdded(true);
    toast({ title: "Sepete eklendi", description: product.name, tone: "success" });
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group relative h-full flex flex-col overflow-hidden rounded-2xl bg-white group-hover:bg-bordo hover:bg-bordo border border-rose-gold/20 hover:border-bordo shadow-soft hover:shadow-card transition-[background-color,border-color,box-shadow] duration-500"
    >
      {/* Görsel — botanik lookbook */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <Link
          href={`/urun/${product.slug}`}
          className="block absolute inset-0"
          aria-label={`${product.name} detayları`}
        >
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <BotanicalArt seed={product.id} label={product.name} />
          </motion.div>
          {/* Hover'da bordo yıkaması */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-bordo-500 via-bordo-700 to-bordo-dark opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          />
        </Link>

        {/* Lookbook numarası */}
        <span className="absolute top-4 left-4 z-10 font-display text-sm tracking-wide text-bordo/70 group-hover:text-cream/90 transition-colors duration-500 pointer-events-none">
          No. {no}
        </span>

        {/* Favori */}
        <WishlistButton
          productId={product.id}
          productName={product.name}
          className="!left-auto !right-4"
        />

        {/* Rozet / stok — ince, tek satır */}
        {(product.badge || product.stock === "az" || isSoldOut) && (
          <span
            className={cn(
              "absolute bottom-4 left-4 z-10 inline-flex items-center rounded-full px-3 py-1 text-[0.62rem] uppercase tracking-wider2 pointer-events-none",
              isSoldOut
                ? "bg-coffee/90 text-cream"
                : product.stock === "az"
                  ? "bg-bordo/90 text-cream"
                  : "bg-white/90 text-bordo shadow-soft",
            )}
          >
            {isSoldOut
              ? "Tükendi"
              : product.stock === "az"
                ? "Son adetler"
                : product.badge}
          </span>
        )}
      </div>

      {/* İçerik — sade */}
      <div className="relative flex flex-1 flex-col p-5">
        <Link href={`/urun/${product.slug}`}>
          <h3 className="font-display text-xl text-coffee group-hover:text-cream leading-snug transition-colors duration-500">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 text-sm text-coffee/55 group-hover:text-cream/70 leading-relaxed line-clamp-1 transition-colors duration-500">
          {product.shortDescription}
        </p>

        {/* Alt satır: fiyat + aksiyonlar */}
        <div className="mt-5 pt-4 border-t border-rose-gold/15 group-hover:border-cream/20 flex items-center justify-between gap-3 transition-colors duration-500">
          <span className="font-display text-2xl text-bordo group-hover:text-rose-goldLight transition-colors duration-500">
            {formatPrice(product.price)}
          </span>

          <div className="flex items-center gap-2">
            <a
              href={whatsappLink(askMessage)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${product.name} için WhatsApp'tan sor`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-gold/30 text-bordo group-hover:border-cream/40 group-hover:text-cream hover:!bg-cream/15 transition-colors duration-300"
            >
              <MessageCircle size={16} strokeWidth={1.7} />
            </a>
            <button
              type="button"
              onClick={handleAdd}
              disabled={isSoldOut}
              aria-label={isSoldOut ? "Stokta yok" : `${product.name} sepete ekle`}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none",
                added
                  ? "bg-sage-deep text-cream"
                  : "bg-bordo-gradient text-cream group-hover:bg-rose-gold-gradient group-hover:text-coffee shadow-soft hover:shadow-glow hover:brightness-110",
              )}
            >
              {added ? (
                <Check size={16} strokeWidth={2.2} />
              ) : (
                <Plus size={17} strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
