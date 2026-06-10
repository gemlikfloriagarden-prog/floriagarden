"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        const j = await res.json().catch(() => ({}));
        setError(j?.error || "Şifre hatalı. Lütfen tekrar deneyin.");
      }
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-section-coffee px-5">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm rounded-3xl bg-white border border-rose-gold/25 shadow-card p-8"
      >
        <div className="flex flex-col items-center text-center gap-3 mb-7">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-bordo-gradient text-cream shadow-glow">
            <ShieldCheck size={24} strokeWidth={1.6} />
          </span>
          <div className="flex flex-col gap-1">
            <span className="font-display text-2xl text-coffee">
              Floria Garden
            </span>
            <span className="text-xs uppercase tracking-ultra-wide text-rose-goldDark">
              Yönetim Paneli
            </span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="admin-pass" className="sr-only">
              Şifre
            </label>
            <div className="relative">
              <Lock
                size={16}
                strokeWidth={1.7}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee/40"
                aria-hidden
              />
              <input
                id="admin-pass"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                autoFocus
                placeholder="Şifre"
                aria-invalid={Boolean(error)}
                className={`w-full rounded-2xl bg-cream-soft border ${
                  error ? "border-bordo" : "border-rose-gold/25"
                } pl-11 pr-11 h-12 text-sm text-coffee placeholder:text-coffee/40 focus:outline-none focus:border-bordo focus:bg-white transition-colors`}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Şifreyi gizle" : "Şifreyi göster"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee/40 hover:text-bordo p-1"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-bordo">{error}</p>}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
          </Button>
        </form>

        <p className="mt-6 text-center text-[0.7rem] text-coffee/40 leading-relaxed">
          Bu alan yalnızca yöneticiye özeldir. Giriş sunucu oturumuyla korunur.
        </p>

        <div className="mt-5 pt-5 border-t border-rose-gold/15 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs tracking-wide text-coffee/55 hover:text-bordo transition-colors"
          >
            <ArrowLeft size={14} strokeWidth={1.8} />
            <span>Siteye geri dön</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
