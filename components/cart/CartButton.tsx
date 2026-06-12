"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";
import { cn } from "@/lib/utils/cn";

type Props = {
  className?: string;
  /** Mobil bottom bar varyantı için */
  variant?: "icon" | "pill";
};

export default function CartButton({ className, variant = "icon" }: Props) {
  const { totalQuantity, openDrawer } = useCart();

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={`Sepeti aç (${totalQuantity} ürün)`}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 transition-all duration-300",
        variant === "icon"
          ? "h-11 w-11 rounded-full border border-rose-gold/30 bg-cream/5 text-cream hover:bg-rose-gold hover:text-coffee hover:border-rose-gold"
          : "h-11 px-5 rounded-full bg-rose-gold-gradient text-coffee shadow-glow text-sm font-medium",
        className,
      )}
    >
      <ShoppingBag size={18} strokeWidth={1.7} />
      {variant === "pill" && <span>Sepet</span>}

      {totalQuantity > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 inline-flex items-center justify-center rounded-full bg-rose-gold text-coffee text-[0.65rem] font-semibold tracking-tight shadow-soft">
          {totalQuantity > 9 ? "9+" : totalQuantity}
        </span>
      )}
    </button>
  );
}
