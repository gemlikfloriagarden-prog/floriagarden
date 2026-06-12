"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { getActiveCampaign, type Campaign } from "@/lib/data/campaigns";

const STORAGE_KEY = "floria-campaign-dismissed";

function getRemaining(endsAt: string): {
  days: number;
  hours: number;
  minutes: number;
  expired: boolean;
} {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, expired: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return { days, hours, minutes, expired: false };
}

export default function SeasonalBanner() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [remaining, setRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    expired: boolean;
  } | null>(null);

  // İlk render — kampanyayı seç ve dismissed state'ini hidrate et
  useEffect(() => {
    const active = getActiveCampaign();
    if (!active) return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === active.id) {
        setDismissed(true);
      }
    } catch {
      /* ignore */
    }
    setCampaign(active);
    setRemaining(getRemaining(active.endsAt));
  }, []);

  // Geri sayım — 1 dakikada bir güncelle
  useEffect(() => {
    if (!campaign) return;
    const t = setInterval(() => {
      setRemaining(getRemaining(campaign.endsAt));
    }, 60 * 1000);
    return () => clearInterval(t);
  }, [campaign]);

  const isVisible = !!campaign && !dismissed && !remaining?.expired;

  // Banner görünürlüğüne göre --banner-h değişkenini güncelle
  // (navbar'ın yukarı/aşağı kayması ve body padding'i için)
  useEffect(() => {
    const root = document.documentElement;
    if (isVisible) {
      root.style.setProperty("--banner-h", "44px");
    } else {
      root.style.setProperty("--banner-h", "0px");
    }
    return () => {
      root.style.setProperty("--banner-h", "0px");
    };
  }, [isVisible]);

  if (!isVisible || !campaign) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, campaign.id);
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  return (
    <aside
      className="fixed top-0 inset-x-0 z-[55] bg-rose-gold-gradient text-coffee"
      role="region"
      aria-label="Kampanya bildirimi"
    >
      <div className="container py-2.5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-coffee/15">
            <Sparkles size={13} strokeWidth={1.8} />
          </span>
          <span className="font-medium text-sm">
            {campaign.title}
            {campaign.subtitle && (
              <span className="hidden md:inline text-coffee/65 font-normal ml-2">
                · {campaign.subtitle}
              </span>
            )}
          </span>
          {remaining && remaining.days < 30 && (
            <span className="hidden sm:inline text-xs bg-coffee/15 rounded-full px-3 py-0.5 tracking-wide">
              {remaining.days > 0
                ? `${remaining.days} gün kaldı`
                : `${remaining.hours} saat kaldı`}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={campaign.href}
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider2 hover:underline underline-offset-2"
          >
            <span>İncele</span>
            <ArrowRight size={12} strokeWidth={2} />
          </Link>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Kampanya bildirimini kapat"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-coffee/15 transition-colors"
          >
            <X size={13} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </aside>
  );
}
