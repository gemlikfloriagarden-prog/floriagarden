"use client";

import { Calendar, Clock, MapPin, Truck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const SLOTS = [
  { id: "09-12", label: "09:00 — 12:00" },
  { id: "12-15", label: "12:00 — 15:00" },
  { id: "15-18", label: "15:00 — 18:00" },
  { id: "18-22", label: "18:00 — 22:00" },
];

export type DeliveryRegion = "gemlik" | "sehir-disi";

const REGIONS: {
  id: DeliveryRegion;
  label: string;
  note: string;
}[] = [
  { id: "gemlik", label: "Gemlik içi", note: "Aynı gün, ısı kontrollü kuryeyle elden teslim." },
  { id: "sehir-disi", label: "Şehir dışı", note: "Anlaşmalı kargoyla 1–3 iş günü, takip numaralı gönderim." },
];

type Props = {
  region: DeliveryRegion;
  date: string;
  slot: string;
  city: string;
  onRegionChange: (v: DeliveryRegion) => void;
  onDateChange: (v: string) => void;
  onSlotChange: (v: string) => void;
  onCityChange: (v: string) => void;
};

function getMinDateIso() {
  return new Date().toISOString().split("T")[0];
}
function getMaxDateIso() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
}

export default function DeliverySchedule({
  region,
  date,
  slot,
  city,
  onRegionChange,
  onDateChange,
  onSlotChange,
  onCityChange,
}: Props) {
  const isOutOfCity = region === "sehir-disi";
  const activeRegion = REGIONS.find((r) => r.id === region) ?? REGIONS[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Teslimat bölgesi */}
      <div className="flex flex-col gap-2">
        <span className="flex items-center gap-2 text-[0.7rem] uppercase tracking-wider2 text-rose-gold">
          <MapPin size={13} strokeWidth={1.7} />
          Teslimat Bölgesi
        </span>
        <div className="grid grid-cols-2 gap-2">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onRegionChange(r.id)}
              aria-pressed={region === r.id}
              className={cn(
                "h-11 rounded-full text-xs tracking-wide transition-all duration-300 px-2",
                region === r.id
                  ? "bg-rose-gold-gradient text-coffee shadow-glow font-medium"
                  : "bg-cream/5 text-coffee/75 border border-rose-gold/20 hover:border-rose-gold/50",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-coffee/55 flex items-start gap-1.5 px-1">
          <Truck size={13} strokeWidth={1.6} className="text-rose-gold flex-shrink-0 mt-0.5" />
          <span>{activeRegion.note}</span>
        </p>
      </div>

      {/* Şehir dışı: il/ilçe alanı */}
      {isOutOfCity && (
        <div className="flex flex-col gap-2">
          <label
            htmlFor="delivery-city"
            className="flex items-center gap-2 text-[0.7rem] uppercase tracking-wider2 text-rose-gold"
          >
            <MapPin size={13} strokeWidth={1.7} />
            İl / İlçe
          </label>
          <input
            id="delivery-city"
            type="text"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="Örn: İstanbul / Kadıköy"
            className="w-full rounded-2xl bg-cream/5 border border-rose-gold/20 px-4 h-12 text-sm text-coffee placeholder:text-coffee/35 focus:outline-none focus:border-rose-gold focus:bg-cream/10 transition-colors"
          />
        </div>
      )}

      {/* Teslimat / gönderim günü */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="delivery-date"
          className="flex items-center gap-2 text-[0.7rem] uppercase tracking-wider2 text-rose-gold"
        >
          <Calendar size={13} strokeWidth={1.7} />
          {isOutOfCity ? "Tercih Edilen Gönderim Günü" : "Teslimat Günü"}
        </label>
        <input
          id="delivery-date"
          type="date"
          value={date}
          min={getMinDateIso()}
          max={getMaxDateIso()}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full rounded-2xl bg-cream/5 border border-rose-gold/20 px-4 h-12 text-sm text-coffee focus:outline-none focus:border-rose-gold focus:bg-cream/10 transition-colors"
          style={{ colorScheme: "light" }}
        />
      </div>

      {/* Saat aralığı — sadece şehir içi (kargo'da saat seçimi yok) */}
      {!isOutOfCity && (
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 text-[0.7rem] uppercase tracking-wider2 text-rose-gold">
            <Clock size={13} strokeWidth={1.7} />
            Saat Aralığı
          </span>
          <div className="grid grid-cols-2 gap-2">
            {SLOTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSlotChange(s.id)}
                aria-pressed={slot === s.id}
                className={cn(
                  "h-11 rounded-full text-xs tracking-wide transition-all duration-300",
                  slot === s.id
                    ? "bg-rose-gold-gradient text-coffee shadow-glow"
                    : "bg-cream/5 text-coffee/75 border border-rose-gold/20 hover:border-rose-gold/50",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
