"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, Truck, ShieldCheck, User, Phone, MapPin } from "lucide-react";
import Button from "@/components/ui/Button";
import FloralPlaceholder from "@/components/ui/FloralPlaceholder";
import CouponInput from "./CouponInput";
import CartItemDetails from "./CartItemDetails";
import WhatsAppCheckoutButton from "./WhatsAppCheckoutButton";
import { useCart } from "./CartProvider";
import { formatPrice, formatTrPhone } from "@/lib/utils/format";

export default function CartPageClient() {
  const {
    state,
    subtotal,
    discount,
    total,
    coupon,
    totalQuantity,
    setQuantity,
    removeItem,
    clear,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  // Adres: üründe girildiyse ön-doldur (yine düzenlenebilir + zorunlu)
  const [address, setAddress] = useState(
    () => state.items.find((i) => i.deliveryAddress)?.deliveryAddress ?? "",
  );

  if (state.items.length === 0) {
    return (
      <div className="rounded-3xl glass-dark p-12 flex flex-col items-center text-center gap-5">
        <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-rose-gold-gradient text-coffee">
          <ShoppingBag size={28} strokeWidth={1.4} />
        </span>
        <div className="flex flex-col gap-2 max-w-md">
          <h2 className="font-display text-3xl text-coffee">Sepetiniz boş</h2>
          <p className="text-coffee/65">
            Premium koleksiyonumuzdan dilediğiniz çiçeği seçerek sepetinize
            ekleyebilirsiniz.
          </p>
        </div>
        <Link href="/urunler">
          <Button variant="gold" size="lg">
            Ürünleri Keşfet
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* Ürün listesi */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        {state.items.map((item) => (
          <motion.article
            key={item.productId}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex gap-4 p-4 rounded-3xl glass-dark"
          >
            <div className="relative w-24 h-32 sm:w-28 sm:h-36 flex-shrink-0 overflow-hidden rounded-2xl">
              <Link href={`/urun/${item.productId}`}>
                <FloralPlaceholder gradient={item.gradient} label={item.name} />
              </Link>
            </div>

            <div className="flex-1 flex flex-col gap-3 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <Link href={`/urun/${item.productId}`}>
                    <h3 className="font-display text-xl md:text-2xl text-coffee leading-tight hover:text-bordo transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <span className="text-sm text-coffee/55">
                    Birim: {formatPrice(item.price)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  aria-label={`${item.name} ürününü sepetten çıkar`}
                  className="text-coffee/50 hover:text-bordo-300 transition-colors p-1"
                >
                  <Trash2 size={16} strokeWidth={1.6} />
                </button>
              </div>

              <CartItemDetails item={item} />

              <div className="flex items-center justify-between mt-auto">
                <div className="inline-flex items-center rounded-full border border-rose-gold/25 bg-cream/5">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    aria-label="Adet azalt"
                    className="inline-flex h-9 w-9 items-center justify-center text-coffee/80 hover:text-bordo"
                  >
                    <Minus size={13} strokeWidth={2} />
                  </button>
                  <span className="text-sm text-coffee w-8 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity + 1)}
                    aria-label="Adet artır"
                    className="inline-flex h-9 w-9 items-center justify-center text-coffee/80 hover:text-bordo"
                  >
                    <Plus size={13} strokeWidth={2} />
                  </button>
                </div>
                <span className="font-display text-xl text-bordo">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </motion.article>
        ))}

        <button
          type="button"
          onClick={clear}
          className="self-start text-xs text-coffee/45 hover:text-bordo-300 transition-colors mt-2 underline-offset-2 hover:underline"
        >
          Sepeti boşalt
        </button>
      </div>

      {/* Özet kart */}
      <aside className="lg:col-span-4">
        <div className="sticky top-28 flex flex-col gap-5 glass-dark rounded-3xl p-6">
          <h2 className="font-display text-2xl text-coffee">Sipariş Özeti</h2>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between text-coffee/75">
              <span>Ürün toplamı ({totalQuantity})</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-bordo">
                <span>Kupon ({coupon?.code})</span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-coffee/75">
              <span>Teslimat</span>
              <span className="text-bordo text-xs">WhatsApp&apos;ta belirlenir</span>
            </div>
            <div className="border-t border-rose-gold/15 pt-3 flex items-end justify-between">
              <span className="text-coffee/55 text-xs uppercase tracking-wider2">Toplam</span>
              <span className="font-display text-3xl text-coffee">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          <CouponInput variant="dark" />

          {/* Zorunlu teslimat bilgileri */}
          <div className="flex flex-col gap-3 pt-3 border-t border-rose-gold/15">
            <span className="text-xs uppercase tracking-wider2 text-rose-goldDark">
              Teslimat Bilgileri
            </span>

            <div className="relative">
              <User size={15} strokeWidth={1.7} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-goldDark" />
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ad Soyad"
                autoComplete="name"
                className="w-full rounded-2xl bg-white border border-rose-gold/25 pl-10 pr-4 h-12 text-sm text-coffee placeholder:text-coffee/40 focus:outline-none focus:border-bordo transition-colors"
              />
            </div>

            <div className="relative">
              <Phone size={15} strokeWidth={1.7} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-goldDark" />
              <input
                type="tel"
                inputMode="numeric"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(formatTrPhone(e.target.value))}
                placeholder="0 (5XX) XXX XX XX"
                autoComplete="tel"
                className="w-full rounded-2xl bg-white border border-rose-gold/25 pl-10 pr-4 h-12 text-sm text-coffee placeholder:text-coffee/40 focus:outline-none focus:border-bordo transition-colors"
              />
            </div>

            <div className="relative">
              <MapPin size={15} strokeWidth={1.7} className="absolute left-3.5 top-3.5 text-rose-goldDark" />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="Teslimat adresi (alıcı adı, mahalle, sokak, no)"
                className="w-full rounded-2xl bg-white border border-rose-gold/25 pl-10 pr-4 py-3 text-sm text-coffee placeholder:text-coffee/40 focus:outline-none focus:border-bordo transition-colors resize-none"
              />
            </div>
          </div>

          <WhatsAppCheckoutButton
            label="Siparişi Tamamla"
            className="w-full"
            customer={{ name: customerName, phone: customerPhone, address }}
          />

          <Link href="/urunler">
            <Button variant="outline" size="md" className="w-full">
              Alışverişe Devam
            </Button>
          </Link>

          <div className="flex flex-col gap-2 pt-3 border-t border-rose-gold/15 text-xs text-coffee/55">
            <span className="flex items-center gap-2">
              <Truck size={13} strokeWidth={1.6} className="text-bordo" />
              Gemlik içi aynı gün teslimat
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={13} strokeWidth={1.6} className="text-bordo" />
              Memnuniyet garantisi
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
