"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, LayoutGrid, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/wishlist/WishlistProvider";

export default function MobileBottomBar() {
  const { totalQuantity, openDrawer } = useCart();
  const { count: favCount } = useWishlist();

  return (
    <motion.nav
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-bordo-dark border-t border-rose-gold/20 shadow-card"
      aria-label="Hızlı erişim çubuğu"
    >
      <div className="grid grid-cols-4 h-16">
        <Link
          href="/"
          className="flex flex-col items-center justify-center gap-1 text-cream/75 hover:text-rose-goldLight transition-colors"
          aria-label="Anasayfa"
        >
          <Home size={18} strokeWidth={1.6} />
          <span className="text-[0.65rem] uppercase tracking-wider2">Ana</span>
        </Link>

        <Link
          href="/urunler"
          className="flex flex-col items-center justify-center gap-1 text-cream/75 hover:text-rose-goldLight transition-colors"
          aria-label="Tüm ürünler"
        >
          <LayoutGrid size={18} strokeWidth={1.6} />
          <span className="text-[0.65rem] uppercase tracking-wider2">Ürün</span>
        </Link>

        <Link
          href="/favoriler"
          className="relative flex flex-col items-center justify-center gap-1 text-cream/75 hover:text-rose-goldLight transition-colors"
          aria-label={`Favoriler (${favCount} ürün)`}
        >
          <Heart size={18} strokeWidth={1.6} />
          <span className="text-[0.65rem] uppercase tracking-wider2">Favori</span>
          {favCount > 0 && (
            <span className="absolute top-1.5 right-[24%] min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center rounded-full bg-rose-gold text-coffee text-[0.6rem] font-semibold">
              {favCount > 9 ? "9+" : favCount}
            </span>
          )}
        </Link>

        <button
          type="button"
          onClick={openDrawer}
          className="relative flex flex-col items-center justify-center gap-1 text-cream/75 hover:text-rose-goldLight transition-colors"
          aria-label={`Sepet (${totalQuantity} ürün)`}
        >
          <ShoppingBag size={18} strokeWidth={1.6} />
          <span className="text-[0.65rem] uppercase tracking-wider2">Sepet</span>
          {totalQuantity > 0 && (
            <span className="absolute top-1.5 right-[28%] min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center rounded-full bg-rose-gold text-coffee text-[0.6rem] font-semibold">
              {totalQuantity > 9 ? "9+" : totalQuantity}
            </span>
          )}
        </button>
      </div>
    </motion.nav>
  );
}
