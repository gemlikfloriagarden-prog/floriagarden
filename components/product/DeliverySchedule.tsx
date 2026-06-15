"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Truck, BookUser } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useMember } from "@/lib/auth/useMember";

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

type SavedAddress = {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  cityDistrict: string;
  address: string;
  note?: string;
};

type Props = {
  region: DeliveryRegion;
  date: string;
  slot: string;
  address: string;
  onRegionChange: (v: DeliveryRegion) => void;
  onDateChange: (v: string) => void;
  onSlotChange: (v: string) => void;
  onAddressChange: (v: string) => void;
};

function getMinDateIso() {
  return new Date().toISOString().split("T")[0];
}
function getMaxDateIso() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
}

/** Kayıtlı adresi tek bir metin bloğuna çevirir (adres kutusuna yazılır). */
function composeAddress(a: SavedAddress): string {
  const lines = [
    [a.recipientName, a.phone].filter(Boolean).join(" · "),
    [a.cityDistrict, a.address].filter(Boolean).join(" "),
    a.note ?? "",
  ].filter(Boolean);
  return lines.join("\n");
}

export default function DeliverySchedule({
  region,
  date,
  slot,
  address,
  onRegionChange,
  onDateChange,
  onSlotChange,
  onAddressChange,
}: Props) {
  const isOutOfCity = region === "sehir-disi";
  const activeRegion = REGIONS.find((r) => r.id === region) ?? REGIONS[0];

  const isMember = useMember();
  const [saved, setSaved] = useState<SavedAddress[]>([]);

  // Üye girişliyse kayıtlı adresleri getir (hızlı doldurma için).
  useEffect(() => {
    if (!isMember) {
      setSaved([]);
      return;
    }
    let active = true;
    fetch("/api/member/addresses", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { addresses: [] }))
      .then((j) => {
        if (active && Array.isArray(j?.addresses)) setSaved(j.addresses);
      })
      .catch(() => {
        if (active) setSaved([]);
      });
    return () => {
      active = false;
    };
  }, [isMember]);

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

      {/* Kayıtlı adresler — sadece üye girişliyse ve adresi varsa */}
      {isMember && saved.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 text-[0.7rem] uppercase tracking-wider2 text-rose-gold">
            <BookUser size={13} strokeWidth={1.7} />
            Kayıtlı Adreslerim
          </span>
          <div className="flex flex-wrap gap-2">
            {saved.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => onAddressChange(composeAddress(a))}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-gold/30 bg-cream/5 px-3 h-9 text-xs text-coffee/80 hover:border-rose-gold hover:text-coffee transition-colors"
              >
                <MapPin size={12} strokeWidth={1.7} className="text-rose-gold" />
                {a.label || "Adres"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Teslimat adresi — her bölgede zorunlu */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="delivery-address"
          className="flex items-center gap-2 text-[0.7rem] uppercase tracking-wider2 text-rose-gold"
        >
          <MapPin size={13} strokeWidth={1.7} />
          Teslimat Adresi
        </label>
        <textarea
          id="delivery-address"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          rows={3}
          placeholder={
            isOutOfCity
              ? "Alıcı adı, telefonu ve açık adres (il / ilçe dahil)"
              : "Alıcı adı, telefonu ve açık adres (mahalle, sokak, no, kapı)"
          }
          className="w-full rounded-2xl bg-cream/5 border border-rose-gold/20 px-4 py-3 text-sm text-coffee placeholder:text-coffee/35 focus:outline-none focus:border-rose-gold focus:bg-cream/10 transition-colors resize-none"
        />
      </div>

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
