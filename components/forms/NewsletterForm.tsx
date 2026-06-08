"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Check } from "lucide-react";
import { useToast } from "@/components/toast/ToastProvider";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.includes("@") || normalizedEmail.length < 5) {
      setError("Geçerli bir e-posta adresi girin.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, source: "footer" }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        setError(json?.error ?? "Bülten kaydı tamamlanamadı.");
        return;
      }
      setDone(true);
      setEmail("");
      toast({
        title: "Bültene abone oldunuz",
        description: "Yeni koleksiyonlardan ilk siz haberdar olun.",
        tone: "success",
      });
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-rose-gold/30 bg-cream/5 p-5 flex items-center gap-3"
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-gold-gradient text-coffee">
          <Check size={18} strokeWidth={2} />
        </span>
        <div className="flex flex-col leading-tight">
          <span className="font-display text-lg text-cream">Hoş geldiniz!</span>
          <span className="text-xs text-cream/65">
            E-bülten listemize başarıyla eklendiniz.
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ornek@eposta.com"
          aria-label="E-posta adresiniz"
          className="flex-1 h-12 rounded-full bg-cream/10 border border-rose-gold/35 px-5 text-base sm:text-sm text-cream placeholder:text-cream/45 focus:outline-none focus:border-rose-gold focus:bg-cream/15 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-rose-gold-gradient text-coffee text-base sm:text-sm font-semibold tracking-wide shadow-glow hover:brightness-105 transition-all flex-shrink-0"
        >
          <Send size={16} strokeWidth={1.7} />
          <span>{loading ? "Kaydediliyor…" : "Abone Ol"}</span>
        </button>
      </div>
      {error && (
        <span role="alert" className="text-xs text-bordo-300 px-2">
          {error}
        </span>
      )}
      <p className="text-[0.7rem] text-cream/45 px-2">
        Abone olarak gizlilik politikamızı kabul etmiş olursunuz.
      </p>
    </form>
  );
}
