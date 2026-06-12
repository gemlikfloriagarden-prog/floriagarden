"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "./WishlistProvider";
import { useToast } from "@/components/toast/ToastProvider";
import { cn } from "@/lib/utils/cn";

type Props = {
  productId: string;
  productName?: string;
  variant?: "card" | "inline";
  className?: string;
};

export default function WishlistButton({
  productId,
  productName,
  variant = "card",
  className,
}: Props) {
  const { has, toggle } = useWishlist();
  const { toast } = useToast();
  const isFav = has(productId);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggle(productId);
    toast({
      title: added ? "Favorilere eklendi" : "Favorilerden çıkarıldı",
      description: productName,
      tone: added ? "success" : "info",
    });
  };

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={isFav}
        aria-label={isFav ? "Favorilerden çıkar" : "Favorilere ekle"}
        className={cn(
          "inline-flex items-center justify-center h-11 w-11 rounded-full border transition-all duration-300",
          isFav
            ? "bg-rose-gold/20 border-rose-gold text-rose-gold"
            : "border-rose-gold/25 bg-cream/5 text-cream hover:border-rose-gold hover:text-rose-goldLight",
          className,
        )}
      >
        <AnimatedHeart filled={isFav} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isFav}
      aria-label={isFav ? "Favorilerden çıkar" : "Favorilere ekle"}
      className={cn(
        "absolute top-4 left-4 z-10 inline-flex items-center justify-center h-9 w-9 rounded-full backdrop-blur transition-all duration-300",
        isFav
          ? "bg-rose-gold text-coffee shadow-glow"
          : "bg-coffee/55 text-cream hover:bg-rose-gold hover:text-coffee",
        className,
      )}
    >
      <AnimatedHeart filled={isFav} size={15} />
    </button>
  );
}

function AnimatedHeart({ filled, size = 17 }: { filled: boolean; size?: number }) {
  return (
    <span className="inline-flex transition-transform duration-200 active:scale-90">
      <Heart
        size={size}
        strokeWidth={1.8}
        fill={filled ? "currentColor" : "transparent"}
      />
    </span>
  );
}
