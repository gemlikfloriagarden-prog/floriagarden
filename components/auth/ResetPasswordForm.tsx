"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/toast/ToastProvider";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const hasToken = token.length > 0;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!hasToken) {
      toast({ title: "Bağlantı geçersiz", tone: "warning" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Şifre en az 6 karakter olmalı", tone: "warning" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Şifreler eşleşmiyor", tone: "warning" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/member/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        toast({
          title: "Şifre güncellenemedi",
          description: json?.error ?? "Bağlantı geçersiz veya süresi dolmuş.",
          tone: "warning",
        });
        return;
      }
      toast({
        title: "Şifre güncellendi",
        description: "Yeni şifrenizle giriş yapabilirsiniz.",
        tone: "success",
      });
      router.push("/giris");
      router.refresh();
    } catch {
      toast({ title: "Bağlantı hatası", tone: "warning" });
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-2xl bg-cream-soft border border-rose-gold/25 pl-11 pr-11 h-12 text-sm text-coffee placeholder:text-coffee/40 focus:outline-none focus:border-bordo focus:bg-white transition-colors";

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-3xl bg-white border border-rose-gold/25 shadow-card p-7 md:p-9">
        <div className="flex flex-col items-center text-center gap-2 mb-7">
          <span className="eyebrow">Floria Garden</span>
          <h1 className="font-display text-3xl text-coffee">Şifre Sıfırla</h1>
          <p className="text-sm text-coffee/60">
            Hesabınız için yeni bir şifre belirleyin.
          </p>
        </div>

        {!hasToken ? (
          <div className="flex flex-col items-center text-center gap-4">
            <p className="text-sm leading-relaxed text-coffee/65">
              Sıfırlama bağlantısı eksik veya geçersiz. Yeni bağlantı almak
              için giriş sayfasındaki şifre sıfırlama akışını kullanın.
            </p>
            <Link href="/giris">
              <Button variant="gold" size="md">
                Girişe dön
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-goldDark">
                <Lock size={16} strokeWidth={1.6} />
              </span>
              <input
                type={show ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Yeni şifre"
                className={inputBase}
              />
              <button
                type="button"
                onClick={() => setShow((value) => !value)}
                aria-label={show ? "Şifreyi gizle" : "Şifreyi göster"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee/45 hover:text-bordo transition-colors"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-goldDark">
                <Lock size={16} strokeWidth={1.6} />
              </span>
              <input
                type={show ? "text" : "password"}
                required
                minLength={6}
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                placeholder="Yeni şifre tekrar"
                className={inputBase}
              />
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full mt-1"
              disabled={loading}
            >
              {loading ? "Güncelleniyor…" : "Şifreyi güncelle"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
