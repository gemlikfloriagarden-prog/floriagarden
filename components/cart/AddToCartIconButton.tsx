"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  /** Ürün sayfasına yönlendirmek için slug */
  slug: string;
  soldOut?: boolean;
  className?: string;
};

/**
 * Karttaki hızlı "+" butonu. Doğrudan sepete EKLEMEZ; ürün sayfasına götürür.
 * Çünkü sepete eklemeden önce teslimat adresi/günü gibi bilgiler girilmeli.
 */
export default function AddToCartIconButton({ slug, soldOut, className }: Props) {
  if (soldOut) {
    return (
      <span
        aria-label="Stokta yok"
        className={cn(
          "inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-coffee/10 text-coffee/40 cursor-not-allowed",
          className,
        )}
      >
        <Plus size={17} strokeWidth={2} />
      </span>
    );
  }

  return (
    <Link
      href={`/urun/${slug}`}
      aria-label="Ürünü incele ve sepete ekle"
      className={cn(
        "inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full transition-all duration-300",
        "bg-bordo-gradient text-cream group-hover:bg-rose-gold-gradient group-hover:text-coffee shadow-soft hover:shadow-glow hover:brightness-110",
        className,
      )}
    >
      <Plus size={17} strokeWidth={2} />
    </Link>
  );
}
