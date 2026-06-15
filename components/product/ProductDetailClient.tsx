"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, MessageCircle, ShoppingBag, Truck, Sparkles, Leaf, Plus, Minus } from "lucide-react";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";
import ProductGallery from "./ProductGallery";
import QuantitySelector from "./QuantitySelector";
import CardNoteInput from "./CardNoteInput";
import DeliverySchedule from "./DeliverySchedule";
import GiftWrapSelector, { GIFT_WRAP_PRICES } from "./GiftWrapSelector";
import { useCart } from "@/components/cart/CartProvider";
import { useToast } from "@/components/toast/ToastProvider";
import { formatPrice } from "@/lib/utils/format";
import { whatsappLink } from "@/lib/constants";
import { getAverageRating } from "@/lib/data/reviews";
import type { Product } from "@/lib/data/products";

type Props = {
  product: Product;
};

export default function ProductDetailClient({ product }: Props) {
  const { addItem, openDrawer } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [cardNote, setCardNote] = useState("");
  const [region, setRegion] = useState<"gemlik" | "sehir-disi">("gemlik");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("12-15");
  const [giftWrap, setGiftWrap] = useState<"standart" | "premium" | "luks">(
    "standart",
  );
  const [added, setAdded] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const mainCtaRef = useRef<HTMLDivElement>(null);
  const isSoldOut = product.stock === "tukendi";

  // Ana sepete-ekle alanı görünmediğinde sticky bar göster
  useEffect(() => {
    const el = mainCtaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setStickyVisible(!entry.isIntersecting);
      },
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sticky bar görünürken yüzen WhatsApp butonunu gizle (çakışmasın)
  useEffect(() => {
    document.body.classList.toggle("has-sticky-cta", stickyVisible && !isSoldOut);
    return () => document.body.classList.remove("has-sticky-cta");
  }, [stickyVisible, isSoldOut]);

  const { average, count } = getAverageRating(product.id);
  const wrapExtra = GIFT_WRAP_PRICES[giftWrap];
  const lineTotal = (product.price + wrapExtra) * quantity;

  const handleAdd = () => {
    if (isSoldOut) return;

    // Tüm teslimat bilgileri girilmeden sepete eklenmez.
    if (!address.trim()) {
      toast({
        title: "Teslimat adresi gerekli",
        description: "Lütfen alıcı ve açık adres bilgisini yazın.",
        tone: "warning",
      });
      return;
    }
    if (!date) {
      toast({
        title: "Teslimat günü gerekli",
        description: "Lütfen bir teslim/gönderim günü seçin.",
        tone: "warning",
      });
      return;
    }
    if (region === "gemlik" && !slot) {
      toast({ title: "Saat aralığı seçin", tone: "warning" });
      return;
    }

    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price + wrapExtra,
        gradient: product.gradient,
        cardNote: cardNote.trim() || undefined,
        deliveryRegion: region,
        deliveryAddress: address.trim(),
        deliveryDate: date || undefined,
        deliverySlot: region === "sehir-disi" ? undefined : slot,
        giftWrap,
      },
      quantity,
    );
    setAdded(true);
    // Toast yok — drawer açılışı zaten geri bildirim (mobilde çakışmayı önler)
    setTimeout(() => {
      openDrawer();
      setAdded(false);
    }, 700);
  };

  const askMessage = `Merhaba Floria Garden, "${product.name}" hakkında bilgi almak istiyorum.`;

  return (
    <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
      {/* Galeri */}
      <div className="lg:col-span-6">
        <ProductGallery
          name={product.name}
          primaryGradient={product.gradient}
          galleryGradients={product.galleryGradients}
          image={product.image}
          images={product.images}
        />
      </div>

      {/* Bilgi & aksiyon */}
      <div className="lg:col-span-6 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          {product.badge && (
            <span className="self-start inline-flex items-center rounded-full bg-rose-gold/15 border border-rose-gold/35 px-3 py-1 text-[0.7rem] uppercase tracking-wider2 text-bordo">
              {product.badge}
            </span>
          )}
          <h1 className="font-display text-4xl md:text-5xl text-coffee leading-[1.05] tracking-tight">
            {product.name}
          </h1>

          {count > 0 && (
            <div className="flex items-center gap-3">
              <StarRating rating={average} size={16} />
              <span className="text-sm text-coffee/65">
                {average.toFixed(1)} · {count} değerlendirme
              </span>
            </div>
          )}

          <p className="text-coffee/75 leading-relaxed text-balance max-w-prose">
            {product.longDescription}
          </p>
        </div>

        {/* Fiyat */}
        <div className="flex items-end justify-between gap-4 border-y border-rose-gold/15 py-5">
          <div className="flex flex-col">
            <span className="text-[0.7rem] uppercase tracking-wider2 text-coffee/55">
              {quantity > 1 ? "Birim fiyat" : "Fiyat"}
            </span>
            <span className="font-display text-4xl text-bordo">
              {formatPrice(product.price + wrapExtra)}
            </span>
            {quantity > 1 && (
              <span className="text-sm text-coffee/55 mt-1">
                Toplam: {formatPrice(lineTotal)}
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[0.7rem] uppercase tracking-wider2 text-coffee/55">
              Adet
            </span>
            <QuantitySelector quantity={quantity} onChange={setQuantity} />
          </div>
        </div>

        {/* Konfigürasyon */}
        <div className="flex flex-col gap-7">
          <CardNoteInput value={cardNote} onChange={setCardNote} />
          <DeliverySchedule
            region={region}
            address={address}
            date={date}
            slot={slot}
            onRegionChange={setRegion}
            onAddressChange={setAddress}
            onDateChange={setDate}
            onSlotChange={setSlot}
          />
          <GiftWrapSelector value={giftWrap} onChange={setGiftWrap} />
        </div>

        {/* Aksiyon butonları */}
        <div ref={mainCtaRef} className="flex flex-col sm:flex-row gap-3">
          <motion.div className="flex-1" whileTap={{ scale: 0.98 }}>
            <Button
              variant="gold"
              size="lg"
              className="w-full"
              disabled={isSoldOut}
              onClick={handleAdd}
            >
              {added ? (
                <>
                  <Check size={18} strokeWidth={2} />
                  <span>Sepete Eklendi</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} strokeWidth={1.6} />
                  <span>{isSoldOut ? "Stokta Yok" : "Sepete Ekle"}</span>
                </>
              )}
            </Button>
          </motion.div>
          <a
            href={whatsappLink(askMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="outline" size="lg" className="w-full">
              <MessageCircle size={18} strokeWidth={1.6} />
              <span>WhatsApp ile Sor</span>
            </Button>
          </a>
        </div>

        {/* Detay listesi */}
        <div className="grid sm:grid-cols-2 gap-5 pt-2">
          {product.contents.length > 0 && (
            <div className="glass-dark rounded-2xl p-5">
              <span className="flex items-center gap-2 text-[0.7rem] uppercase tracking-wider2 text-rose-gold">
                <Sparkles size={13} strokeWidth={1.7} />
                İçindekiler
              </span>
              <ul className="mt-3 space-y-2 text-sm text-coffee/80">
                {product.contents.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-rose-gold mt-1.5">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {product.careTips.length > 0 && (
            <div className="glass-dark rounded-2xl p-5">
              <span className="flex items-center gap-2 text-[0.7rem] uppercase tracking-wider2 text-rose-gold">
                <Leaf size={13} strokeWidth={1.7} />
                Bakım Önerileri
              </span>
              <ul className="mt-3 space-y-2 text-sm text-coffee/80">
                {product.careTips.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-rose-gold mt-1.5">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Teslimat şeridi */}
        <div className="flex items-start gap-3 rounded-2xl bg-rose-gold/5 border border-rose-gold/20 p-4">
          <Truck size={20} strokeWidth={1.6} className="text-bordo flex-shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1 text-sm">
            <span className="text-coffee font-medium">
              Gemlik içi aynı gün · Şehir dışına kargo
            </span>
            <span className="text-coffee/65 text-xs leading-relaxed">
              Gemlik içi 17:00 öncesi siparişler aynı gün teslim edilir.
              Türkiye geneline anlaşmalı kargoyla 1–3 iş günü içinde, takip
              numaralı gönderim yapılır.
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Add-to-Cart Bar — ana CTA görünmediğinde belirir */}
      <AnimatePresence>
        {stickyVisible && !isSoldOut && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-0 right-0 z-40 bg-bordo-dark/95 backdrop-blur-lg border-t border-rose-gold/25 shadow-card bottom-16 lg:bottom-0"
            role="region"
            aria-label="Hızlı sepete ekle"
          >
            <div className="container py-3 flex items-center gap-3">
              {/* Ürün özeti */}
              <div className="hidden sm:flex flex-col leading-tight min-w-0">
                <span className="text-[0.7rem] uppercase tracking-wider2 text-rose-gold">
                  Toplam
                </span>
                <span className="font-display text-xl text-rose-goldLight">
                  {formatPrice(lineTotal)}
                </span>
              </div>

              <div className="sm:hidden flex-1 min-w-0">
                <p className="text-sm text-cream truncate">{product.name}</p>
                <p className="text-rose-goldLight font-display text-lg leading-tight">
                  {formatPrice(lineTotal)}
                </p>
              </div>

              {/* Adet (sadece sm+) */}
              <div className="hidden sm:inline-flex items-center gap-1 rounded-full border border-rose-gold/25 bg-cream/5">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Adet azalt"
                  className="inline-flex h-9 w-9 items-center justify-center text-cream/80 hover:text-rose-goldLight"
                >
                  <Minus size={13} strokeWidth={2} />
                </button>
                <span className="text-sm text-cream w-6 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Adet artır"
                  className="inline-flex h-9 w-9 items-center justify-center text-cream/80 hover:text-rose-goldLight"
                >
                  <Plus size={13} strokeWidth={2} />
                </button>
              </div>

              {/* Hızlı sepete ekle */}
              <Button
                variant="gold"
                size="md"
                onClick={handleAdd}
                className="!h-10 ml-auto sm:ml-0 flex-shrink-0"
              >
                {added ? (
                  <>
                    <Check size={15} strokeWidth={2} />
                    <span className="hidden sm:inline">Eklendi</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={15} strokeWidth={1.6} />
                    <span>Sepete Ekle</span>
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
