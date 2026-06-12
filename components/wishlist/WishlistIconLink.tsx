"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "./WishlistProvider";
import { cn } from "@/lib/utils/cn";

export default function WishlistIconLink({ className }: { className?: string }) {
  const { count } = useWishlist();

  return (
    <Link
      href="/favoriler"
      aria-label={`Favorilerim (${count} ürün)`}
      className={cn(
        "relative inline-flex items-center justify-center h-11 w-11 rounded-full border border-rose-gold/30 bg-cream/5 text-cream hover:bg-rose-gold hover:text-coffee hover:border-rose-gold transition-all duration-300",
        className,
      )}
    >
      <Heart size={17} strokeWidth={1.7} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 inline-flex items-center justify-center rounded-full bg-rose-gold text-coffee text-[0.65rem] font-semibold tracking-tight shadow-soft">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
