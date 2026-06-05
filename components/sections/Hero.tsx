"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, ArrowDown, Sparkles, Truck, MapPin } from "lucide-react";
import Button from "@/components/ui/Button";
import { whatsappLink } from "@/lib/constants";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 md:pt-32 lg:pt-36 pb-20 md:pb-28 lg:pb-32">
      {/* Açık zemin + yumuşak gold/bordo glow */}
      <div className="absolute inset-0 bg-cream-soft" aria-hidden />
      {/* Kenarlarda uzanan yaprak sarmaşıkları */}
      <div className="absolute inset-0 edge-vines" aria-hidden />
      <div className="absolute inset-0 bg-dots-gold opacity-50" aria-hidden />

      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(201,164,106,0.28), transparent 70%)",
        }}
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="absolute -bottom-40 -left-24 w-[560px] h-[560px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(142,31,63,0.14), transparent 70%)",
        }}
      />

      <div className="container relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Yazı kolonu */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col gap-8"
          >
            <motion.div variants={item} className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-rose-gold/30 shadow-soft px-4 py-1.5">
                <Sparkles size={14} strokeWidth={1.6} className="text-rose-gold" />
                <span className="eyebrow">Yeni Nesil Çiçekçi</span>
              </span>
            </motion.div>

            <motion.h1 variants={item} className="heading-display text-balance">
              Zarafet, çiçeklerin
              <br />
              <span className="italic font-light text-bordo">
                en ince diliyle
              </span>
              <span className="text-rose-gold">.</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="text-lg md:text-xl text-coffee/70 max-w-xl leading-relaxed text-balance"
            >
              <span className="font-display italic text-bordo">
                Flowers and Coffee.
              </span>{" "}
              Floria Garden, Gemlik&apos;in butik çiçekçisi olarak premium
              çiçekleri ve seçkin hediyelikleri tek bir özenli deneyimde
              buluşturur.
            </motion.p>

            <motion.div
              variants={item}
              className="flex flex-wrap items-center gap-3"
            >
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp üzerinden sipariş ver"
              >
                <Button variant="gold" size="lg">
                  <MessageCircle size={18} strokeWidth={1.7} />
                  <span>WhatsApp&apos;tan Sipariş Ver</span>
                </Button>
              </a>
              <Link href="/urunler" aria-label="Ürünleri incele">
                <Button variant="outline" size="lg">
                  <span>Ürünleri İncele</span>
                </Button>
              </Link>
            </motion.div>

            {/* Güven şeridi */}
            <motion.div
              variants={item}
              className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-6 border-t border-rose-gold/25"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white border border-rose-gold/30 shadow-soft text-bordo">
                  <Truck size={16} strokeWidth={1.6} />
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-[0.65rem] uppercase tracking-wider2 text-rose-goldDark">
                    Hızlı
                  </span>
                  <span className="text-sm text-coffee">
                    Aynı gün teslimat
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white border border-rose-gold/30 shadow-soft text-bordo">
                  <MapPin size={16} strokeWidth={1.6} />
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-[0.65rem] uppercase tracking-wider2 text-rose-goldDark">
                    Bölge
                  </span>
                  <span className="text-sm text-coffee">
                    Gemlik içi özenli teslimat
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white border border-rose-gold/30 shadow-soft text-bordo">
                  <Sparkles size={16} strokeWidth={1.6} />
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-[0.65rem] uppercase tracking-wider2 text-rose-goldDark">
                    Butik
                  </span>
                  <span className="text-sm text-coffee">
                    El yapımı zarif tasarımlar
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Görsel kolon — daha koyu, dramatik */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="hidden md:block lg:col-span-5 relative"
          >
            {/* Rose-gold halka */}
            <div
              aria-hidden
              className="absolute -inset-2 rounded-[2.4rem] bg-gradient-to-br from-rose-gold/40 via-transparent to-rose-gold/10 blur-md opacity-70"
            />

            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-card border border-rose-gold/20">
              {/* Koyu gradient zemin */}
              <div className="absolute inset-0 bg-gradient-to-br from-coffee-deep via-wine to-bordo-dark" />

              {/* Sıcak ışık katmanı */}
              <div
                className="absolute inset-0 mix-blend-overlay opacity-70"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 25%, rgba(201,164,106,0.45), transparent 45%), radial-gradient(circle at 75% 80%, rgba(142,31,63,0.55), transparent 50%)",
                }}
              />

              {/* Botanik çizim */}
              <svg
                viewBox="0 0 400 500"
                className="absolute inset-0 w-full h-full text-rose-gold opacity-45"
                aria-hidden
              >
                <g fill="none" stroke="currentColor" strokeWidth="1.1">
                  <ellipse cx="200" cy="180" rx="32" ry="52" />
                  <ellipse cx="160" cy="200" rx="28" ry="46" transform="rotate(-30 160 200)" />
                  <ellipse cx="240" cy="200" rx="28" ry="46" transform="rotate(30 240 200)" />
                  <ellipse cx="188" cy="138" rx="22" ry="38" transform="rotate(-15 188 138)" />
                  <ellipse cx="222" cy="138" rx="22" ry="38" transform="rotate(15 222 138)" />
                  <ellipse cx="138" cy="160" rx="20" ry="32" transform="rotate(-45 138 160)" />
                  <ellipse cx="262" cy="160" rx="20" ry="32" transform="rotate(45 262 160)" />
                  <circle cx="200" cy="200" r="14" />
                  <path d="M200 240 Q 180 360 200 480" />
                  <path d="M200 240 Q 220 360 200 480" />
                  <path d="M200 280 Q 150 380 130 460" />
                  <path d="M200 280 Q 250 380 270 460" />
                </g>
              </svg>

              {/* Monogram */}
              <div className="absolute inset-x-0 bottom-10 flex flex-col items-center text-cream/85">
                <span className="font-display text-5xl tracking-tight">FG</span>
                <span className="mt-2 h-px w-10 bg-rose-gold/60" />
                <span className="mt-2 text-[0.6rem] uppercase tracking-ultra-wide text-rose-gold/80">
                  Est. Gemlik
                </span>
              </div>

              {/* Görsel blok içi: imza koleksiyon etiketi — mobilde gizli */}
              <div className="absolute top-4 left-4 hidden md:inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 shadow-soft">
                <Sparkles size={13} strokeWidth={1.7} className="text-bordo" />
                <span className="text-[0.65rem] uppercase tracking-wider2 text-coffee">
                  Kahve & Çiçek Setleri
                </span>
              </div>

              {/* İnce alt çerçeve — tek detay */}
              <div className="absolute inset-x-6 bottom-6 h-px bg-gradient-to-r from-transparent via-rose-gold/50 to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* Aşağı kaydır ipucu */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="hidden md:flex justify-center mt-16"
        >
          <Link
            href="#koleksiyon"
            className="group inline-flex flex-col items-center gap-2 text-coffee/50 hover:text-bordo transition-colors duration-300"
            aria-label="Aşağı kaydır"
          >
            <span className="text-[0.65rem] uppercase tracking-wider2">Keşfet</span>
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-gold/40 group-hover:border-bordo"
            >
              <ArrowDown size={14} strokeWidth={1.6} />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
