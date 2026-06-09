"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Tag, X, Check } from "lucide-react";
import { useCart } from "./CartProvider";
import { useToast } from "@/components/toast/ToastProvider";
import { formatPrice } from "@/lib/utils/format";

type Props = {
  /** Krem zemin üstünde mi (sepet sayfası) yoksa koyu drawer içinde mi */
  variant?: "dark" | "light";
};

export default function CouponInput({ variant = "dark" }: Props) {
  const { coupon, discount, applyCoupon, removeCoupon } = useCart();
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim() || checking) return;
    setChecking(true);
    const result = await applyCoupon(code);
    setChecking(false);
    if (result.ok) {
      toast({
        title: "Kupon uygulandı",
        description: result.coupon.description,
        tone: "success",
      });
      setCode("");
      setError(null);
    } else {
      setError(result.reason);
      toast({
        title: "Kupon kabul edilmedi",
        description: result.reason,
        tone: "warning",
      });
    }
  };

  const isDark = variant === "dark";
  const inputBase =
    "flex-1 rounded-full px-4 h-11 text-sm focus:outline-none transition-colors";
  const inputDark =
    "bg-cream/5 border border-rose-gold/25 text-cream placeholder:text-cream/35 focus:border-rose-gold";
  const inputLight =
    "bg-white border border-coffee/15 text-coffee placeholder:text-coffee/40 focus:border-bordo";

  if (coupon) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={
          isDark
            ? "flex items-center justify-between gap-3 rounded-2xl border border-rose-gold/40 bg-rose-gold/10 p-3"
            : "flex items-center justify-between gap-3 rounded-2xl border border-bordo/30 bg-bordo/5 p-3"
        }
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-rose-gold-gradient text-coffee">
            <Check size={15} strokeWidth={2} />
          </span>
          <div className="flex flex-col leading-tight min-w-0">
            <span
              className={
                isDark
                  ? "text-sm font-medium text-cream truncate"
                  : "text-sm font-medium text-coffee truncate"
              }
            >
              {coupon.code}
            </span>
            <span
              className={
                isDark
                  ? "text-[0.7rem] text-cream/65 truncate"
                  : "text-[0.7rem] text-coffee/60 truncate"
              }
            >
              −{formatPrice(discount)} · {coupon.description}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            removeCoupon();
            toast({ title: "Kupon kaldırıldı", tone: "info" });
          }}
          aria-label="Kuponu kaldır"
          className={
            isDark
              ? "inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-cream/55 hover:text-cream hover:bg-cream/10 transition-colors"
              : "inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-coffee/55 hover:text-coffee hover:bg-coffee/5 transition-colors"
          }
        >
          <X size={14} strokeWidth={1.8} />
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <label
        className={
          isDark
            ? "flex items-center gap-2 text-[0.7rem] uppercase tracking-wider2 text-rose-gold"
            : "flex items-center gap-2 text-[0.7rem] uppercase tracking-wider2 text-bordo"
        }
      >
        <Tag size={12} strokeWidth={1.8} />
        Kupon kodum var
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (error) setError(null);
          }}
          placeholder="KUPON KODU"
          className={`${inputBase} ${isDark ? inputDark : inputLight} uppercase tracking-wide`}
          aria-invalid={!!error}
        />
        <button
          type="submit"
          disabled={!code.trim() || checking}
          className={
            isDark
              ? "h-11 px-5 rounded-full bg-rose-gold-gradient text-coffee text-sm font-medium disabled:opacity-40 disabled:pointer-events-none transition-all hover:brightness-105"
              : "h-11 px-5 rounded-full bg-bordo-gradient text-cream text-sm font-medium disabled:opacity-40 disabled:pointer-events-none transition-all hover:brightness-110"
          }
        >
          {checking ? "Bakılıyor" : "Uygula"}
        </button>
      </div>
      {error && (
        <span
          className={
            isDark
              ? "text-xs text-bordo-300"
              : "text-xs text-bordo"
          }
          role="alert"
        >
          {error}
        </span>
      )}
    </form>
  );
}
