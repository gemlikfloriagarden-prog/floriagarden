"use client";

import { motion } from "framer-motion";
import { MessageCircle, Instagram, Clock } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/constants";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-soft px-5 py-16 relative overflow-hidden">
      {/* Kenar sarmaşıkları */}
      <div className="absolute inset-0 edge-vines pointer-events-none" aria-hidden />
      {/* Yumuşak gold/bordo glow */}
      <div
        aria-hidden
        className="absolute -top-32 -right-24 w-[420px] h-[420px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(201,164,106,0.25), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-24 w-[440px] h-[440px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(142,31,63,0.12), transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg text-center flex flex-col items-center gap-6"
      >
        {/* Marka */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="font-display text-4xl text-coffee tracking-tight">
            Floria Garden
          </span>
          <span className="text-[0.65rem] uppercase tracking-ultra-wide text-rose-goldDark">
            {SITE.tagline}
          </span>
        </div>

        {/* Rozet */}
        <span className="inline-flex items-center gap-2 rounded-full bg-white border border-rose-gold/30 shadow-soft px-4 py-1.5">
          <Clock size={14} strokeWidth={1.7} className="text-rose-gold" />
          <span className="text-xs uppercase tracking-wider2 text-coffee/70">
            Kısa bir bakımdayız
          </span>
        </span>

        <h1 className="font-display text-3xl md:text-4xl text-coffee leading-tight text-balance">
          Çiçeklerimizi tazeliyoruz
          <span className="text-rose-gold">.</span>
        </h1>

        <p className="text-coffee/65 leading-relaxed max-w-md text-balance">
          Sitemiz kısa süreli bakımda. Çok yakında daha güzel bir deneyimle
          buradayız. Bu sırada siparişleriniz için bize WhatsApp veya
          Instagram&apos;dan ulaşabilirsiniz.
        </p>

        {/* İletişim */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-rose-gold-gradient text-coffee shadow-glow hover:brightness-105 px-6 h-12 text-sm font-medium tracking-wide transition-all"
          >
            <MessageCircle size={18} strokeWidth={1.7} />
            WhatsApp&apos;tan Yazın
          </a>
          <a
            href={SITE.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white text-bordo border border-bordo/25 hover:border-bordo hover:bg-bordo/5 px-6 h-12 text-sm font-medium tracking-wide transition-all"
          >
            <Instagram size={18} strokeWidth={1.7} />
            {SITE.instagram.handle}
          </a>
        </div>

        {/* İnce çizgi */}
        <div className="mt-2 h-px w-24 bg-gradient-to-r from-transparent via-rose-gold/50 to-transparent" />

        <p className="text-xs text-coffee/45">
          {SITE.city} · {SITE.hours}
        </p>
      </motion.div>
    </div>
  );
}
