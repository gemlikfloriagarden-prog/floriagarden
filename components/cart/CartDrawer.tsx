"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";
import CouponInput from "./CouponInput";
import CartItemDetails from "./CartItemDetails";
import FloralPlaceholder from "@/components/ui/FloralPlaceholder";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils/format";

export default function CartDrawer() {
  const {
    state,
    subtotal,
    discount,
    total,
    totalQuantity,
    closeDrawer,
    setQuantity,
    removeItem,
  } = useCart();

  return (
    <AnimatePresence>
      {state.drawerOpen && (
        <>
          {/* Overlay — blur yok (mobilde takılmayı önler) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[60] bg-coffee-deep/65"
            aria-hidden
          />

          {/* Drawer — GPU dostu transform animasyonu */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: "transform" }}
            className="fixed top-0 right-0 bottom-0 z-[61] w-full sm:w-[440px] max-w-full bg-white border-l border-rose-gold/20 shadow-card flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Alışveriş sepeti"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-rose-gold/15">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-gold-gradient text-coffee">
                  <ShoppingBag size={16} strokeWidth={1.7} />
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="font-display text-xl text-coffee">
                    Sepetiniz
                  </span>
                  <span className="text-xs text-coffee/55 tracking-wider2 uppercase">
                    {totalQuantity} ürün
                  </span>
                </div>
              </div>
              <button
                onClick={closeDrawer}
                aria-label="Sepeti kapat"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-coffee/15 text-coffee hover:bg-cream transition-colors"
              >
                <X size={18} strokeWidth={1.6} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {state.items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-12">
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full glass-dark text-rose-gold">
                    <ShoppingBag size={24} strokeWidth={1.4} />
                  </span>
                  <h3 className="font-display text-2xl text-coffee">
                    Sepetiniz boş
                  </h3>
                  <p className="text-sm text-coffee/65 max-w-xs">
                    Premium koleksiyonumuzdan dilediğiniz çiçeği seçerek
                    sepetinize ekleyebilirsiniz.
                  </p>
                  <Link href="/urunler" onClick={closeDrawer}>
                    <Button variant="gold" size="md">
                      Ürünleri Keşfet
                    </Button>
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {state.items.map((item) => (
                    <li
                      key={item.productId}
                      className="flex gap-4 p-3 rounded-2xl glass-dark"
                    >
                      <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden rounded-xl">
                        <FloralPlaceholder
                          gradient={item.gradient}
                          label={item.name}
                        />
                      </div>

                      <div className="flex-1 flex flex-col gap-2 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-display text-lg text-coffee leading-tight truncate">
                            {item.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            aria-label={`${item.name} ürününü sepetten çıkar`}
                            className="text-coffee/50 hover:text-bordo-300 transition-colors p-1"
                          >
                            <Trash2 size={15} strokeWidth={1.6} />
                          </button>
                        </div>

                        <CartItemDetails item={item} />

                        <div className="flex items-center justify-between mt-auto">
                          <div className="inline-flex items-center gap-1 rounded-full border border-rose-gold/25 bg-cream">
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(item.productId, item.quantity - 1)
                              }
                              aria-label="Adet azalt"
                              className="inline-flex h-8 w-8 items-center justify-center text-coffee/80 hover:text-bordo"
                            >
                              <Minus size={12} strokeWidth={2} />
                            </button>
                            <span className="text-sm text-coffee w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(item.productId, item.quantity + 1)
                              }
                              aria-label="Adet artır"
                              className="inline-flex h-8 w-8 items-center justify-center text-coffee/80 hover:text-bordo"
                            >
                              <Plus size={12} strokeWidth={2} />
                            </button>
                          </div>
                          <span className="font-display text-lg text-bordo">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer / Checkout */}
            {state.items.length > 0 && (
              <div className="border-t border-rose-gold/15 p-5 flex flex-col gap-4 bg-cream">
                <CouponInput variant="light" />

                {/* Toplam dökümü */}
                <div className="flex flex-col gap-1.5 text-sm">
                  <div className="flex items-center justify-between text-coffee/75">
                    <span>Ara toplam</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-bordo">
                      <span>Kupon indirimi</span>
                      <span>−{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex items-end justify-between mt-1 pt-2 border-t border-cream/10">
                    <span className="text-[0.7rem] uppercase tracking-wider2 text-coffee/55">
                      Toplam
                    </span>
                    <span className="font-display text-3xl text-coffee">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <p className="text-[0.7rem] text-coffee/45 text-right leading-tight mt-0.5">
                    Kargo, teslimat bölgesine göre WhatsApp&apos;ta belirlenir.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Link href="/sepet" onClick={closeDrawer}>
                    <Button variant="gold" size="lg" className="w-full">
                      Siparişi Tamamla
                    </Button>
                  </Link>
                </div>

                <p className="text-[0.7rem] text-coffee/45 text-center leading-relaxed">
                  Sipariş adımında ad, telefon ve teslimat adresi bilgilerinizi
                  girersiniz; ardından WhatsApp üzerinden onaylanır.
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
