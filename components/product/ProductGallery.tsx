"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloralPlaceholder from "@/components/ui/FloralPlaceholder";
import { cn } from "@/lib/utils/cn";

type Props = {
  name: string;
  primaryGradient: string;
  galleryGradients?: string[];
  /** Yüklenen gerçek görsel (varsa gradient yerine gösterilir) */
  image?: string;
  /** Yüklenen gerçek görseller. İlk görsel ana görsel olarak gösterilir. */
  images?: string[];
};

export default function ProductGallery({
  name,
  primaryGradient,
  galleryGradients = [],
  image,
  images,
}: Props) {
  const all = [primaryGradient, ...galleryGradients];
  const uploadedImages = (images?.length ? images : image ? [image] : []).slice(0, 4);
  const [active, setActive] = useState(0);

  // Yüklenen foto varsa gradient yerine gerçek görsel galerisi gösterilir.
  if (uploadedImages.length > 0) {
    const activeImage = uploadedImages[active] ?? uploadedImages[0];
    return (
      <div className="flex flex-col gap-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-rose-gold/15 shadow-card">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage}
              src={activeImage}
              alt={name}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </AnimatePresence>
          <div aria-hidden className="absolute top-5 left-5 h-px w-12 bg-rose-gold/70" />
          <div aria-hidden className="absolute top-5 left-5 w-px h-12 bg-rose-gold/70" />
          <div aria-hidden className="absolute bottom-5 right-5 h-px w-12 bg-rose-gold/70" />
          <div aria-hidden className="absolute bottom-5 right-5 w-px h-12 bg-rose-gold/70" />
        </div>

        {uploadedImages.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {uploadedImages.map((item, i) => (
              <button
                key={`${item}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Görsel ${i + 1}`}
                aria-pressed={active === i}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-xl border-2 transition-all duration-300",
                  active === i
                    ? "border-rose-gold shadow-glow"
                    : "border-rose-gold/15 hover:border-rose-gold/40 opacity-70 hover:opacity-100",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Ana görsel */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-rose-gold/15 shadow-card">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <FloralPlaceholder gradient={all[active]} label={name} />
          </motion.div>
        </AnimatePresence>

        {/* Köşe rose-gold detayları */}
        <div aria-hidden className="absolute top-5 left-5 h-px w-12 bg-rose-gold/70" />
        <div aria-hidden className="absolute top-5 left-5 w-px h-12 bg-rose-gold/70" />
        <div aria-hidden className="absolute bottom-5 right-5 h-px w-12 bg-rose-gold/70" />
        <div aria-hidden className="absolute bottom-5 right-5 w-px h-12 bg-rose-gold/70" />
      </div>

      {/* Thumbnails */}
      {all.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {all.map((gradient, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Görsel ${i + 1}`}
              aria-pressed={active === i}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border-2 transition-all duration-300",
                active === i
                  ? "border-rose-gold shadow-glow"
                  : "border-rose-gold/15 hover:border-rose-gold/40 opacity-70 hover:opacity-100",
              )}
            >
              <FloralPlaceholder gradient={gradient} label={`Önizleme ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
