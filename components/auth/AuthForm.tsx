"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/toast/ToastProvider";

type Mode = "login" | "register";

export default function AuthForm({ mode }: { mode: Mode }) {
  const isLogin = mode === "login";
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Backend (Auth) bağlanınca gerçek giriş/kayıt burada yapılacak.
    setDone(true);
    toast({
      title: isLogin ? "Giriş yakında" : "Kayıt yakında",
      description:
        "Üyelik sistemi hazırlanıyor. Şimdilik siparişlerinizi WhatsApp'tan verebilirsiniz.",
      tone: "info",
    });
    setTimeout(() => setDone(false), 2500);
  };

  const inputBase =
    "w-full rounded-2xl bg-cream-soft border border-rose-gold/25 pl-11 pr-4 h-12 text-sm text-coffee placeholder:text-coffee/40 focus:outline-none focus:border-bordo focus:bg-white transition-colors";

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl bg-white border border-rose-gold/25 shadow-card p-7 md:p-9"
      >
        <div className="flex flex-col items-center text-center gap-2 mb-7">
          <span className="eyebrow">Floria Garden</span>
          <h1 className="font-display text-3xl text-coffee">
            {isLogin ? "Üye Girişi" : "Üye Ol"}
          </h1>
          <p className="text-sm text-coffee/60">
            {isLogin
              ? "Hesabınıza giriş yapın, siparişlerinizi takip edin."
              : "Hızlı sipariş ve özel kampanyalar için üye olun."}
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <Field icon={<User size={16} strokeWidth={1.6} />}>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ad Soyad"
                className={inputBase}
              />
            </Field>
          )}

          <Field icon={<Mail size={16} strokeWidth={1.6} />}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta"
              className={inputBase}
            />
          </Field>

          <Field icon={<Lock size={16} strokeWidth={1.6} />}>
            <input
              type={showPass ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              className={inputBase}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? "Şifreyi gizle" : "Şifreyi göster"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee/45 hover:text-bordo transition-colors"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </Field>

          {isLogin && (
            <div className="flex justify-end -mt-1">
              <button
                type="button"
                onClick={() =>
                  toast({ title: "Şifre sıfırlama yakında", tone: "info" })
                }
                className="text-xs text-bordo hover:text-rose-goldDark transition-colors"
              >
                Şifremi unuttum
              </button>
            </div>
          )}

          <Button variant="gold" size="lg" type="submit" className="w-full mt-1">
            {done ? (
              <>
                <Check size={18} strokeWidth={2} />
                <span>Alındı</span>
              </>
            ) : (
              <span>{isLogin ? "Giriş Yap" : "Kayıt Ol"}</span>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-coffee/65">
          {isLogin ? (
            <>
              Hesabınız yok mu?{" "}
              <Link href="/uye-ol" className="text-bordo font-medium hover:underline">
                Üye olun
              </Link>
            </>
          ) : (
            <>
              Zaten üye misiniz?{" "}
              <Link href="/giris" className="text-bordo font-medium hover:underline">
                Giriş yapın
              </Link>
            </>
          )}
        </p>
      </motion.div>

      <p className="mt-4 text-center text-[0.7rem] text-coffee/45 leading-relaxed">
        Üyelik sistemi yakında aktifleşecek. Şimdilik siparişlerinizi WhatsApp
        üzerinden verebilirsiniz.
      </p>
    </div>
  );
}

function Field({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-goldDark">
        {icon}
      </span>
      {children}
    </div>
  );
}
