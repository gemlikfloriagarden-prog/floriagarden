"use client";

import { Check } from "lucide-react";
import { GRADIENT_PRESETS } from "@/lib/admin/gradients";
import { adminLabel } from "./AdminUI";
import { cn } from "@/lib/utils/cn";

/**
 * Görsel yer tutucu için gradient seçici.
 * (Gerçek foto yükleme veritabanı aşamasında buraya eklenecek.)
 */
export default function GradientPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={adminLabel}>Görsel (gradient)</label>
      <div className="grid grid-cols-4 gap-2.5">
        {GRADIENT_PRESETS.map((g) => {
          const active = value === g.value;
          return (
            <button
              key={g.value}
              type="button"
              onClick={() => onChange(g.value)}
              aria-label={g.label}
              aria-pressed={active}
              title={g.label}
              className={cn(
                "relative aspect-[4/3] rounded-xl bg-gradient-to-br overflow-hidden transition-all duration-200",
                g.value,
                active
                  ? "ring-2 ring-bordo ring-offset-2 ring-offset-white"
                  : "ring-1 ring-rose-gold/20 hover:ring-rose-gold/50",
              )}
            >
              {active && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/15">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-bordo shadow-soft">
                    <Check size={14} strokeWidth={2.4} />
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[0.7rem] text-coffee/45">
        Şimdilik gradient yer tutucu. Gerçek fotoğraf yükleme veritabanı
        bağlandığında eklenecek.
      </p>
    </div>
  );
}
