"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/components/toast/ToastProvider";
import type { Product } from "@/lib/data/products";
import { cn } from "@/lib/utils/cn";

type Props = {
  product: Pick<Product, "id" | "name" | "price" | "gradient" | "stock">;
  className?: string;
};

export default function AddToCartIconButton({ product, className }: Props) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [added, setAdded] = useState(false);
  const isSoldOut = product.stock === "tukendi";

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
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={isSoldOut}
      aria-label={isSoldOut ? "Stokta yok" : `${product.name} sepete ekle`}
      className={cn(
        "inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none",
        added
          ? "bg-sage-deep text-cream"
          : "bg-bordo-gradient text-cream group-hover:bg-rose-gold-gradient group-hover:text-coffee shadow-soft hover:shadow-glow hover:brightness-110",
        className,
      )}
    >
      {added ? (
        <Check size={16} strokeWidth={2.2} />
      ) : (
        <Plus size={17} strokeWidth={2} />
      )}
    </button>
  );
}
