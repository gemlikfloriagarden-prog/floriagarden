"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Ticket, LogOut, Phone, Mail, Cake } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils/format";
import type { Member } from "@/lib/admin/types";

export default function AccountPage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/member/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { authed: false }))
      .then((j) => {
        if (j?.authed) setMember(j.member);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/member/logout", { method: "POST" });
    } catch {
      /* yok say */
    }
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="h-9 w-9 rounded-full border-2 border-rose-gold/30 border-t-bordo animate-spin" />
      </div>
    );
  }

  if (!member) {
    return (
      <article className="pt-28 md:pt-32 pb-24">
        <div className="container max-w-md text-center flex flex-col items-center gap-5">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-gold-gradient text-coffee">
            <User size={26} strokeWidth={1.5} />
          </span>
          <h1 className="font-display text-3xl text-coffee">Giriş yapmadınız</h1>
          <p className="text-coffee/65">
            Hesabınızı görmek için giriş yapın veya üye olun.
          </p>
          <div className="flex gap-3">
            <Link href="/giris">
              <Button variant="gold" size="md">
                Üye Girişi
              </Button>
            </Link>
            <Link href="/uye-ol">
              <Button variant="outline" size="md">
                Üye Ol
              </Button>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="pt-24 md:pt-28 pb-20 md:pb-28">
      <div className="container max-w-2xl">
        <Breadcrumb items={[{ label: "Hesabım" }]} className="mb-8" />

        <header className="flex items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-bordo-gradient text-cream font-display text-xl">
              {member.name.charAt(0)}
            </span>
            <div>
              <h1 className="font-display text-2xl text-coffee leading-tight">
                {member.name}
              </h1>
              <p className="text-sm text-coffee/55">Hoş geldiniz 🌿</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-gold/30 text-coffee/70 hover:text-bordo hover:border-bordo px-4 h-10 text-sm transition-colors"
          >
            <LogOut size={15} strokeWidth={1.7} />
            Çıkış
          </button>
        </header>

        {/* Bilgiler */}
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          <Info icon={Phone} label="Telefon" value={member.phone} />
          <Info icon={Mail} label="E-posta" value={member.email} />
          {member.birthDate && (
            <Info icon={Cake} label="Doğum tarihi" value={member.birthDate} />
          )}
        </div>

        {/* Kişiye özel kodlar */}
        <h2 className="flex items-center gap-2 font-display text-xl text-coffee mb-3">
          <Ticket size={18} strokeWidth={1.8} className="text-rose-gold" />
          Size özel kodlar
        </h2>
        {member.codes.length === 0 ? (
          <p className="text-sm text-coffee/55 bg-cream-soft rounded-2xl px-4 py-4">
            Henüz size özel bir kod tanımlanmadı. Kampanyalarımız için takipte
            kalın 🌸
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {member.codes.map((c) => (
              <li
                key={c.code}
                className="flex items-center justify-between gap-3 rounded-2xl border border-rose-gold/20 bg-white shadow-soft px-4 py-3"
              >
                <div>
                  <span className="font-mono text-sm font-semibold text-bordo tracking-wide">
                    {c.code}
                  </span>
                  {c.note && (
                    <p className="text-xs text-coffee/50 mt-0.5">{c.note}</p>
                  )}
                </div>
                <span className="inline-flex items-center rounded-full bg-rose-gold/15 text-rose-goldDark px-3 py-1 text-xs font-medium">
                  {c.discountType === "percent"
                    ? `%${c.discountValue} indirim`
                    : `${formatPrice(c.discountValue)} indirim`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-cream-soft px-4 py-3">
      <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-bordo border border-rose-gold/20">
        <Icon size={15} strokeWidth={1.7} />
      </span>
      <div className="min-w-0">
        <p className="text-[0.65rem] uppercase tracking-wider2 text-rose-goldDark">
          {label}
        </p>
        <p className="text-sm text-coffee truncate">{value || "—"}</p>
      </div>
    </div>
  );
}
