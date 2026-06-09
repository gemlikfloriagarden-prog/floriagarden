"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Tags,
  Flower2,
  Users,
  ArrowRight,
  RotateCcw,
  Info,
  Ticket,
  Plus,
  Copy,
  Check,
  Trash2,
  Cake,
  PackageX,
  Gift,
  Wrench,
  ExternalLink,
  ClipboardList,
  Wallet,
} from "lucide-react";
import { useAdminData } from "@/components/admin/AdminDataProvider";
import { orderTotal } from "@/lib/admin/orders";

const ENV_MAINTENANCE = process.env.NEXT_PUBLIC_MAINTENANCE === "1";
import {
  AdminCard,
  ConfirmDialog,
  adminInput,
  adminLabel,
} from "@/components/admin/AdminUI";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/toast/ToastProvider";
import { generateGeneralCode } from "@/lib/admin/store";
import { daysUntilBirthday, formatDayMonth } from "@/lib/admin/birthday";
import { formatPrice } from "@/lib/utils/format";
import type { GeneralCode, Member, StockState } from "@/lib/admin/types";

const STOCK_INFO: Record<
  Exclude<StockState, "var">,
  { label: string; style: string }
> = {
  az: {
    label: "Az kaldı",
    style: "bg-rose-gold/15 text-rose-goldDark border-rose-gold/35",
  },
  tukendi: {
    label: "Tükendi",
    style: "bg-bordo/10 text-bordo border-bordo/25",
  },
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

function discountLabel(c: GeneralCode) {
  return c.discountType === "percent"
    ? `%${c.discountValue} indirim`
    : `${formatPrice(c.discountValue)} indirim`;
}

export default function AdminDashboard() {
  const { data, reset, addGeneralCode, removeGeneralCode } = useAdminData();
  const { toast } = useToast();

  // Bakım modu — veritabanından okunur/yazılır
  const [maintenance, setMaintenance] = useState(ENV_MAINTENANCE);
  useEffect(() => {
    if (ENV_MAINTENANCE) return;
    fetch("/api/maintenance", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setMaintenance(Boolean(j?.maintenance)))
      .catch(() => {});
  }, []);

  const toggleMaintenance = async () => {
    if (ENV_MAINTENANCE) return; // ortam değişkeni öncelikli
    const next = !maintenance;
    setMaintenance(next);
    toast({
      title: next ? "Bakım modu açıldı" : "Bakım modu kapatıldı",
      description: next
        ? "Ziyaretçiler artık bakım sayfasını görüyor."
        : "Site yeniden normal yayında.",
      tone: next ? "warning" : "success",
    });
    try {
      await fetch("/api/admin/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "maintenance", data: next }),
      });
    } catch {
      toast({ title: "Kaydedilemedi", tone: "warning" });
    }
  };

  // Genel kod formu
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "fixed">(
    "percent",
  );
  const [discountValue, setDiscountValue] = useState("10");
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<GeneralCode | null>(null);

  // Yaklaşan doğum günleri (en yakın 5)
  const upcomingBirthdays = useMemo(() => {
    const today = new Date();
    return data.members
      .filter((m) => m.birthDate)
      .map((m) => ({
        member: m,
        days: daysUntilBirthday(m.birthDate as string, today),
      }))
      .filter((x): x is { member: Member; days: number } => x.days !== null)
      .sort((a, b) => a.days - b.days)
      .slice(0, 5);
  }, [data.members]);

  // Stok uyarıları (tükenen + az kalan)
  const stockAlerts = useMemo(
    () => data.products.filter((p) => p.stock === "az" || p.stock === "tukendi"),
    [data.products],
  );

  const revenue = data.orders
    .filter((o) => o.status !== "iptal")
    .reduce((s, o) => s + orderTotal(o), 0);

  const stats: {
    label: string;
    value: string;
    icon: typeof Tags;
    href: string;
  }[] = [
    {
      label: "Sipariş",
      value: String(data.orders.length),
      icon: ClipboardList,
      href: "/yonetim/siparisler",
    },
    {
      label: "Ciro",
      value: formatPrice(revenue),
      icon: Wallet,
      href: "/yonetim/siparisler",
    },
    {
      label: "Kategori",
      value: String(data.categories.length),
      icon: Tags,
      href: "/yonetim/kategoriler",
    },
    {
      label: "Ürün",
      value: String(data.products.length),
      icon: Flower2,
      href: "/yonetim/urunler",
    },
    {
      label: "Üye",
      value: String(data.members.length),
      icon: Users,
      href: "/yonetim/uyeler",
    },
  ];

  const copyCode = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      toast({ title: "Kopyalanamadı", tone: "warning" });
    }
  };

  const onCreate = (e: FormEvent) => {
    e.preventDefault();
    const raw = code.trim().toUpperCase().replace(/\s+/g, "");
    const finalCode = raw || generateGeneralCode();

    // Aynı kod zaten varsa engelle
    if (data.generalCodes.some((c) => c.code === finalCode)) {
      toast({ title: "Bu kod zaten var", tone: "warning" });
      return;
    }

    addGeneralCode({
      code: finalCode,
      discountType,
      discountValue: Math.max(0, Math.round(Number(discountValue) || 0)),
      createdAt: new Date().toISOString(),
      note: note.trim() || undefined,
    });
    setCode("");
    setNote("");
    toast({ title: "Genel kod oluşturuldu", tone: "success" });
  };

  return (
    <div>
      <div className="mb-5 sm:mb-8">
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-coffee leading-tight">
          Hoş geldiniz 🌿
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-coffee/60 leading-relaxed max-w-2xl">
          Floria Garden yönetim panelinden kategorileri, ürünleri ve üyeleri
          yönetebilirsiniz.
        </p>
      </div>

      {/* İstatistik kartları */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <AdminCard className="p-3.5 sm:p-5 lg:p-6 min-h-[116px] sm:min-h-[150px] h-full hover:border-rose-gold/45 hover:shadow-card transition-all duration-300 group">
              <div className="flex items-start justify-between">
                <span className="inline-flex h-9 w-9 sm:h-11 sm:w-11 lg:h-12 lg:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-rose-gold-gradient text-coffee">
                  <Icon size={18} className="sm:hidden" strokeWidth={1.7} />
                  <Icon
                    size={21}
                    className="hidden sm:block"
                    strokeWidth={1.6}
                  />
                </span>
                <ArrowRight
                  size={16}
                  strokeWidth={1.7}
                  className="text-coffee/30 group-hover:text-bordo group-hover:translate-x-1 transition-all duration-300"
                />
              </div>
              <p className="mt-4 sm:mt-5 font-display text-2xl sm:text-3xl lg:text-4xl leading-none text-coffee tabular-nums truncate">
                {value}
              </p>
              <p className="text-xs sm:text-sm text-coffee/55 mt-1">{label}</p>
            </AdminCard>
          </Link>
        ))}
      </div>

      {/* Doğum günleri + Stok uyarıları */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Yaklaşan doğum günleri */}
        <AdminCard className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-rose-gold-gradient text-coffee">
              <Cake size={18} strokeWidth={1.7} />
            </span>
            <div>
              <h2 className="font-display text-xl sm:text-2xl text-coffee leading-tight">
                Yaklaşan Doğum Günleri
              </h2>
              <p className="text-sm text-coffee/55">
                Üyeye özel kod göndermek için fırsat.
              </p>
            </div>
          </div>

          {upcomingBirthdays.length === 0 ? (
            <p className="text-sm text-coffee/50 bg-cream-soft rounded-2xl px-4 py-3">
              Doğum tarihi kayıtlı üye yok.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {upcomingBirthdays.map(({ member, days }) => {
                const soon = days <= 30;
                return (
                  <li
                    key={member.id}
                    className="flex items-center gap-3 rounded-2xl border border-rose-gold/15 px-4 py-3"
                  >
                    <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-bordo-gradient text-cream font-display text-base">
                      {member.name.charAt(0)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-coffee leading-tight truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-coffee/50">
                        {formatDayMonth(member.birthDate as string)}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.65rem] font-medium ${
                        soon
                          ? "bg-rose-gold/15 text-rose-goldDark border-rose-gold/35"
                          : "bg-cream-soft text-coffee/55 border-rose-gold/15"
                      }`}
                    >
                      {soon && <Gift size={11} strokeWidth={2} />}
                      {days === 0
                        ? "Bugün!"
                        : days === 1
                          ? "Yarın"
                          : `${days} gün`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          <Link
            href="/yonetim/uyeler"
            className="inline-flex items-center gap-1.5 text-xs text-rose-goldDark hover:text-bordo transition-colors mt-4"
          >
            Üyelere git
            <ArrowRight size={13} strokeWidth={1.8} />
          </Link>
        </AdminCard>

        {/* Stok uyarıları */}
        <AdminCard className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-bordo-gradient text-cream">
              <PackageX size={18} strokeWidth={1.7} />
            </span>
            <div>
              <h2 className="font-display text-xl sm:text-2xl text-coffee leading-tight">
                Stok Uyarıları
              </h2>
              <p className="text-sm text-coffee/55">
                Tükenen ve az kalan ürünler.
              </p>
            </div>
          </div>

          {stockAlerts.length === 0 ? (
            <p className="text-sm text-coffee/50 bg-cream-soft rounded-2xl px-4 py-3">
              Tüm ürünler stokta 🌿
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {stockAlerts.map((p) => {
                const info = STOCK_INFO[p.stock as "az" | "tukendi"];
                const categoryName =
                  data.categories.find((c) => c.slug === p.category)?.name ?? "—";
                return (
                  <li
                    key={p.id}
                    className="flex items-center gap-3 rounded-2xl border border-rose-gold/15 px-4 py-3"
                  >
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-9 w-9 flex-shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div
                        className={`h-9 w-9 flex-shrink-0 rounded-xl bg-gradient-to-br ${p.gradient}`}
                        aria-hidden
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-coffee leading-tight truncate">
                        {p.name}
                      </p>
                      <p className="text-xs text-coffee/50 truncate">
                        {categoryName}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.65rem] font-medium ${info.style}`}
                    >
                      {info.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          <Link
            href="/yonetim/urunler"
            className="inline-flex items-center gap-1.5 text-xs text-rose-goldDark hover:text-bordo transition-colors mt-4"
          >
            Ürünlere git
            <ArrowRight size={13} strokeWidth={1.8} />
          </Link>
        </AdminCard>
      </div>

      {/* Genel kodlar */}
      <AdminCard className="p-4 sm:p-6 mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-bordo-gradient text-cream">
            <Ticket size={18} strokeWidth={1.7} />
          </span>
          <div>
            <h2 className="font-display text-xl sm:text-2xl text-coffee leading-tight">
              Genel Kodlar
            </h2>
            <p className="text-sm text-coffee/55">
              Tüm üyelerin kullanabileceği kampanya kodları.
            </p>
          </div>
        </div>

        {/* Oluşturma formu */}
        <form
          onSubmit={onCreate}
          className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end"
        >
          <div className="lg:col-span-1">
            <label htmlFor="g-code" className={adminLabel}>
              Kod
            </label>
            <input
              id="g-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="BAHAR15 (boş = otomatik)"
              className={`${adminInput} uppercase placeholder:normal-case`}
            />
          </div>
          <div>
            <label htmlFor="g-type" className={adminLabel}>
              İndirim türü
            </label>
            <select
              id="g-type"
              value={discountType}
              onChange={(e) =>
                setDiscountType(e.target.value as "percent" | "fixed")
              }
              className={`${adminInput} cursor-pointer`}
              style={{ colorScheme: "light" }}
            >
              <option value="percent">Yüzde (%)</option>
              <option value="fixed">Sabit tutar (₺)</option>
            </select>
          </div>
          <div>
            <label htmlFor="g-value" className={adminLabel}>
              {discountType === "percent" ? "Yüzde" : "Tutar (₺)"}
            </label>
            <input
              id="g-value"
              type="number"
              min={0}
              inputMode="numeric"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className={adminInput}
            />
          </div>
          <Button type="submit" variant="gold" size="md" className="w-full">
            <Plus size={16} strokeWidth={2} />
            Oluştur
          </Button>
          <div className="sm:col-span-2 lg:col-span-4">
            <label htmlFor="g-note" className={adminLabel}>
              Not (opsiyonel)
            </label>
            <input
              id="g-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Örn. Bahar kampanyası"
              className={adminInput}
            />
          </div>
        </form>

        {/* Mevcut genel kodlar */}
        <div className="mt-6">
          {data.generalCodes.length === 0 ? (
            <p className="text-sm text-coffee/50 bg-cream-soft rounded-2xl px-4 py-3">
              Henüz genel kod yok. Yukarıdan oluşturabilirsiniz.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {data.generalCodes.map((c) => (
                <li
                  key={c.code}
                  className="flex items-center gap-3 rounded-2xl border border-rose-gold/20 bg-cream-soft px-4 py-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-semibold text-bordo tracking-wide">
                        {c.code}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-rose-gold/15 text-rose-goldDark px-2 py-0.5 text-[0.6rem] uppercase tracking-wider2">
                        {discountLabel(c)}
                      </span>
                    </div>
                    <p className="text-xs text-coffee/50 mt-0.5 truncate">
                      {c.note ? `${c.note} · ` : ""}
                      {formatDate(c.createdAt)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCode(c.code)}
                    aria-label="Kodu kopyala"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-rose-gold/25 text-coffee/65 hover:text-bordo hover:border-bordo transition-colors"
                  >
                    {copied === c.code ? (
                      <Check size={14} strokeWidth={2} className="text-sage-deep" />
                    ) : (
                      <Copy size={14} strokeWidth={1.8} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRemoveTarget(c)}
                    aria-label="Kodu sil"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-rose-gold/25 text-coffee/65 hover:text-bordo hover:border-bordo transition-colors"
                  >
                    <Trash2 size={14} strokeWidth={1.8} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </AdminCard>

      {/* Bakım modu */}
      <AdminCard className="p-6 mb-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${
                maintenance
                  ? "bg-bordo-gradient text-cream"
                  : "bg-rose-gold-gradient text-coffee"
              }`}
            >
              <Wrench size={18} strokeWidth={1.7} />
            </span>
            <div>
              <h2 className="font-display text-2xl text-coffee leading-tight">
                Bakım Modu
              </h2>
              <p className="text-sm text-coffee/55">
                {maintenance
                  ? "Açık — ziyaretçiler bakım sayfasını görüyor."
                  : "Kapalı — site normal yayında."}
              </p>
            </div>
          </div>

          {/* Toggle */}
          <button
            type="button"
            role="switch"
            aria-checked={maintenance}
            aria-label="Bakım modunu aç/kapat"
            onClick={toggleMaintenance}
            disabled={ENV_MAINTENANCE}
            className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              maintenance ? "bg-bordo" : "bg-coffee/20"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-soft transition-all duration-200 ${
                maintenance ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        {maintenance && !ENV_MAINTENANCE && (
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-4 text-xs text-rose-goldDark hover:text-bordo transition-colors"
          >
            Bakım sayfasını önizle
            <ExternalLink size={13} strokeWidth={1.8} />
          </a>
        )}

        <p className="mt-4 text-xs text-coffee/45 leading-relaxed max-w-2xl">
          {ENV_MAINTENANCE
            ? "Şu an ortam değişkeni (NEXT_PUBLIC_MAINTENANCE) ile global olarak açık. Kapatmak için Vercel ayarlarından değişkeni kaldırın."
            : "Bu anahtar veritabanındaki bakım ayarını değiştirir ve tüm ziyaretçiler için geçerlidir. Ortam değişkeni yalnızca acil kilitleme gerektiğinde kullanılmalı."}
        </p>
      </AdminCard>

      {/* Bilgi notu */}
      <AdminCard className="p-6 bg-cream-soft/60">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-bordo/10 text-bordo">
            <Info size={17} strokeWidth={1.8} />
          </span>
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="font-display text-xl text-coffee">Veritabanı bağlı</h2>
              <p className="mt-1 text-sm text-coffee/65 leading-relaxed max-w-2xl">
                Veriler MySQL veritabanında saklanıyor — tüm cihazlardan
                erişilebilir ve kalıcıdır. Yaptığınız değişiklikler anında
                kaydedilir.
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="inline-flex w-fit items-center gap-2 text-xs text-coffee/55 hover:text-bordo transition-colors"
            >
              <RotateCcw size={14} strokeWidth={1.7} />
              Verileri yenile
            </button>
          </div>
        </div>
      </AdminCard>

      <ConfirmDialog
        open={!!removeTarget}
        title="Genel kodu sil"
        message={`"${removeTarget?.code}" kodu silinecek. Devam edilsin mi?`}
        onConfirm={() => {
          if (removeTarget) removeGeneralCode(removeTarget.code);
          toast({ title: "Kod silindi", tone: "info" });
        }}
        onClose={() => setRemoveTarget(null)}
      />
    </div>
  );
}
