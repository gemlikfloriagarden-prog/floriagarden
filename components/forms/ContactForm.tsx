"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Check } from "lucide-react";
import Button from "@/components/ui/Button";

type FormState = {
  name: string;
  email: string;
  // Telefon: alan kodu ayrı kutuda tutulur ki numara yazarken "+90" silinmesin.
  phoneCode: string;
  phoneLocal: string;
  topic: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phoneCode: "+90",
  phoneLocal: "",
  topic: "Genel bilgi",
  message: "",
};

const TOPICS = [
  "Genel bilgi",
  "Sipariş hakkında",
  "Kurumsal teklif",
  "Açılış / Etkinlik",
  "Düğün / Nişan",
  "Diğer",
];

export default function ContactForm() {
  const [state, setState] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    const normalizedEmail = state.email.trim().toLowerCase();
    const phone = `${state.phoneCode.trim()} ${state.phoneLocal.trim()}`.trim();
    const phoneDigits = phone.replace(/\D/g, "");
    const hasUsefulPhone = phoneDigits.length > 4;
    if (!state.name.trim()) errs.name = "Adınız gerekli";
    if (!normalizedEmail && !hasUsefulPhone)
      errs.email = "E-posta veya telefon gerekli";
    if (normalizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail))
      errs.email = "Geçerli bir e-posta adresi girin";
    if (!state.message.trim()) errs.message = "Mesajınızı yazın";
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name,
          email: normalizedEmail,
          phone,
          topic: state.topic,
          message: state.message,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        setErrors({
          message: json?.error ?? "Mesaj gönderilemedi. Lütfen tekrar deneyin.",
        });
        return;
      }
      setSubmitted(true);
      setState(initialState);
    } catch {
      setErrors({
        message: "Bağlantı hatası. Lütfen WhatsApp veya telefonla ulaşın.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-rose-gold/30 bg-rose-gold/10 p-8 text-center"
      >
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-rose-gold-gradient text-coffee mb-4">
          <Check size={24} strokeWidth={2} />
        </span>
        <h3 className="font-display text-2xl text-coffee">Mesajınız bize ulaştı</h3>
      <p className="mt-2 text-sm text-coffee/70 max-w-sm mx-auto">
        Ekibimiz en kısa sürede sizinle iletişime geçecek. Teşekkür ederiz.
      </p>
      <button
        type="button"
        onClick={() => setSubmitted(false)}
        className="mt-5 text-sm text-bordo hover:text-rose-goldDark transition-colors"
      >
        Yeni mesaj gönder
      </button>
      </motion.div>
    );
  }

  const inputClass =
    "w-full rounded-2xl bg-cream border border-rose-gold/20 px-4 h-12 text-sm text-coffee placeholder:text-coffee/35 focus:outline-none focus:border-rose-gold focus:bg-white transition-colors";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="grid md:grid-cols-2 gap-4">
        <Field
          label="Adınız Soyadınız"
          required
          error={errors.name}
        >
          <input
            type="text"
            value={state.name}
            onChange={(e) => setState({ ...state, name: e.target.value })}
            placeholder="Örn: Ayşe Yılmaz"
            className={inputClass}
            required
          />
        </Field>

        <Field
          label="Konu"
        >
          <select
            value={state.topic}
            onChange={(e) => setState({ ...state, topic: e.target.value })}
            className={inputClass}
            style={{ colorScheme: "light" }}
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="E-posta" error={errors.email}>
          <input
            type="email"
            value={state.email}
            onChange={(e) => setState({ ...state, email: e.target.value })}
            placeholder="ornek@eposta.com"
            className={inputClass}
          />
        </Field>

        <Field label="Telefon">
          <div className="flex gap-2">
            <input
              type="tel"
              inputMode="tel"
              value={state.phoneCode}
              onChange={(e) => setState({ ...state, phoneCode: e.target.value })}
              aria-label="Alan kodu"
              className="w-16 shrink-0 text-center rounded-2xl bg-cream border border-rose-gold/20 h-12 text-sm text-coffee focus:outline-none focus:border-rose-gold focus:bg-white transition-colors"
            />
            <input
              type="tel"
              inputMode="numeric"
              value={state.phoneLocal}
              onChange={(e) =>
                setState({ ...state, phoneLocal: e.target.value })
              }
              placeholder="5xx xxx xx xx"
              className={`${inputClass} flex-1`}
            />
          </div>
        </Field>
      </div>

      <Field label="Mesajınız" required error={errors.message}>
        <textarea
          value={state.message}
          onChange={(e) => setState({ ...state, message: e.target.value })}
          rows={5}
          placeholder="Talebinizi veya sorunuzu birkaç cümleyle aktarın..."
          className="w-full rounded-2xl bg-cream border border-rose-gold/20 px-4 py-3 text-sm text-coffee placeholder:text-coffee/35 focus:outline-none focus:border-rose-gold focus:bg-white transition-colors resize-none"
          required
        />
      </Field>

      <p className="text-xs text-coffee/45 leading-relaxed">
        Formu gönderdiğinizde verileriniz yalnızca size dönüş yapmak için
        kullanılır.
      </p>

      <div>
        <Button variant="gold" size="lg" type="submit" disabled={loading}>
          <Send size={16} strokeWidth={1.7} />
          <span>{loading ? "Gönderiliyor…" : "Mesajı Gönder"}</span>
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[0.7rem] uppercase tracking-wider2 text-rose-gold">
        {label}
        {required && <span className="ml-0.5 text-bordo-300">*</span>}
      </span>
      {children}
      {error && (
        <span className="text-[0.7rem] text-bordo-300" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}
