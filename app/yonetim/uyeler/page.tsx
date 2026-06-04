"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  Users,
  Phone,
  Mail,
  Cake,
  CalendarDays,
  Ticket,
  Copy,
  Check,
  Trash2,
  Plus,
  Sparkles,
  Gift,
  ChevronRight,
} from "lucide-react";
import {
  daysUntilBirthday,
  formatDayMonth,
  birthdayCountdownLabel,
} from "@/lib/admin/birthday";
import { useAdminData } from "@/components/admin/AdminDataProvider";
import {
  AdminPageHeader,
  AdminCard,
  Modal,
  ConfirmDialog,
  adminInput,
  adminLabel,
} from "@/components/admin/AdminUI";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/toast/ToastProvider";
import { generateMemberCode } from "@/lib/admin/store";
import { formatPrice } from "@/lib/utils/format";
import type { MemberCode } from "@/lib/admin/types";

function formatDate(iso?: string) {
  if (!iso) return "—";
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

function discountLabel(c: MemberCode) {
  return c.discountType === "percent"
    ? `%${c.discountValue} indirim`
    : `${formatPrice(c.discountValue)} indirim`;
}

export default function UyelerPage() {
  const { data, addMemberCode, removeMemberCode } = useAdminData();
  const { toast } = useToast();

  const [detailId, setDetailId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [removeCode, setRemoveCode] = useState<MemberCode | null>(null);
  const [birthdayOpen, setBirthdayOpen] = useState(false);

  // Doğum günü yaklaşan üyeler (en yakına göre sıralı)
  const upcomingBirthdays = useMemo(() => {
    const today = new Date();
    return data.members
      .filter((m) => m.birthDate)
      .map((m) => ({ member: m, days: daysUntilBirthday(m.birthDate as string, today) }))
      .filter((x): x is { member: (typeof data.members)[number]; days: number } =>
        x.days !== null,
      )
      .sort((a, b) => a.days - b.days);
  }, [data.members]);

  // Doğum günü çok yakın olanlar (bugün veya yarın)
  const imminentCount = useMemo(
    () => upcomingBirthdays.filter((x) => x.days <= 1).length,
    [upcomingBirthdays],
  );

  const openMemberFromBirthday = (id: string) => {
    setBirthdayOpen(false);
    setDetailId(id);
  };

  // Kod üretim formu
  const [discountType, setDiscountType] = useState<"percent" | "fixed">(
    "percent",
  );
  const [discountValue, setDiscountValue] = useState("15");
  const [note, setNote] = useState("");

  const member = data.members.find((m) => m.id === detailId) ?? null;

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      toast({ title: "Kopyalanamadı", tone: "warning" });
    }
  };

  const onGenerate = (e: FormEvent) => {
    e.preventDefault();
    if (!member) return;
    const value = Math.max(0, Math.round(Number(discountValue) || 0));
    const code: MemberCode = {
      code: generateMemberCode(member.name),
      discountType,
      discountValue: value,
      createdAt: new Date().toISOString(),
      note: note.trim() || undefined,
    };
    addMemberCode(member.id, code);
    setNote("");
    toast({ title: "Kişiye özel kod üretildi", tone: "success" });
  };

  return (
    <div>
      <AdminPageHeader
        title="Üyeler"
        description="Üye bilgileri ve kişiye özel indirim/takip kodları."
      />

      {/* Doğum günü yaklaşanlar — girilebilir bölüm */}
      <button
        type="button"
        onClick={() => setBirthdayOpen(true)}
        className="w-full mb-6 flex items-center gap-4 rounded-3xl border border-rose-gold/25 bg-gradient-to-r from-cream-soft to-white shadow-soft px-5 py-4 text-left hover:border-rose-gold/45 hover:shadow-card transition-all duration-300 group"
      >
        <span className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-rose-gold-gradient text-coffee">
          <Cake size={22} strokeWidth={1.6} />
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-xl text-coffee leading-tight">
            Doğum Günü Yaklaşanlar
          </h2>
          <p className="text-sm text-coffee/55">
            {imminentCount > 0
              ? `${imminentCount} üyenin doğum günü bugün veya yarın`
              : "Yaklaşan doğum günlerini görüntüleyin"}
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Çok yakın (bugün/yarın) üye sayısı */}
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 h-8 text-sm font-semibold tabular-nums ${
              imminentCount > 0
                ? "bg-bordo text-cream"
                : "bg-cream-soft text-coffee/45 border border-rose-gold/20"
            }`}
            aria-label={`${imminentCount} üyenin doğum günü çok yakın`}
          >
            {imminentCount > 0 && <Gift size={13} strokeWidth={2} />}
            {imminentCount}
          </span>
          <span className="hidden sm:inline-flex items-center gap-0.5 text-sm font-medium text-rose-goldDark group-hover:text-bordo transition-colors">
            Gör
            <ChevronRight
              size={16}
              strokeWidth={1.8}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </span>
        </div>
      </button>

      {data.members.length === 0 ? (
        <AdminCard className="p-12 flex flex-col items-center text-center gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-rose-gold-gradient text-coffee">
            <Users size={24} strokeWidth={1.5} />
          </span>
          <p className="text-coffee/60 text-sm">Henüz üye yok.</p>
        </AdminCard>
      ) : (
        <AdminCard className="divide-y divide-rose-gold/12 overflow-hidden">
          {data.members.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setDetailId(m.id)}
              className="w-full flex items-center gap-4 p-4 sm:p-5 text-left hover:bg-cream-soft/50 transition-colors"
            >
              <span className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-bordo-gradient text-cream font-display text-lg">
                {m.name.charAt(0)}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg text-coffee leading-tight truncate">
                  {m.name}
                </h3>
                <p className="text-sm text-coffee/55 truncate">{m.phone}</p>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1">
                <span className="text-xs text-coffee/45">
                  Üyelik: {formatDate(m.joinedAt)}
                </span>
                {m.codes.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-[0.7rem] text-rose-goldDark">
                    <Ticket size={12} strokeWidth={1.8} />
                    {m.codes.length} kod
                  </span>
                )}
              </div>
            </button>
          ))}
        </AdminCard>
      )}

      {/* Üye detayı */}
      <Modal
        open={!!member}
        onClose={() => setDetailId(null)}
        title={member?.name ?? "Üye"}
        size="lg"
      >
        {member && (
          <div className="flex flex-col gap-6">
            {/* Bilgiler */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoRow icon={Phone} label="Telefon" value={member.phone} />
              <InfoRow icon={Mail} label="E-posta" value={member.email} />
              <InfoRow
                icon={Cake}
                label="Doğum tarihi"
                value={formatDate(member.birthDate)}
              />
              <InfoRow
                icon={CalendarDays}
                label="Üyelik tarihi"
                value={formatDate(member.joinedAt)}
              />
            </div>

            {/* Mevcut kodlar */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium text-coffee mb-3">
                <Ticket size={16} strokeWidth={1.8} className="text-rose-gold" />
                Kişiye özel kodlar
              </h3>
              {member.codes.length === 0 ? (
                <p className="text-sm text-coffee/50 bg-cream-soft rounded-2xl px-4 py-3">
                  Henüz kod üretilmedi.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {member.codes.map((c) => (
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
                        {c.note && (
                          <p className="text-xs text-coffee/50 mt-0.5 truncate">
                            {c.note}
                          </p>
                        )}
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
                        onClick={() => setRemoveCode(c)}
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

            {/* Yeni kod üret */}
            <form
              onSubmit={onGenerate}
              className="rounded-2xl border border-rose-gold/20 p-4 flex flex-col gap-4"
            >
              <h3 className="flex items-center gap-2 text-sm font-medium text-coffee">
                <Sparkles size={16} strokeWidth={1.8} className="text-rose-gold" />
                Yeni kişiye özel kod üret
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="d-type" className={adminLabel}>
                    İndirim türü
                  </label>
                  <select
                    id="d-type"
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
                  <label htmlFor="d-value" className={adminLabel}>
                    {discountType === "percent" ? "Yüzde" : "Tutar (₺)"}
                  </label>
                  <input
                    id="d-value"
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className={adminInput}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="d-note" className={adminLabel}>
                  Not (opsiyonel)
                </label>
                <input
                  id="d-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Örn. Doğum günü jesti"
                  className={adminInput}
                />
              </div>
              <Button
                type="submit"
                variant="gold"
                size="sm"
                className="self-start"
              >
                <Plus size={16} strokeWidth={2} />
                Kod üret
              </Button>
            </form>
          </div>
        )}
      </Modal>

      {/* Doğum günü yaklaşanlar — girilebilir liste */}
      <Modal
        open={birthdayOpen}
        onClose={() => setBirthdayOpen(false)}
        title="Doğum Günü Yaklaşanlar"
        size="lg"
      >
        {upcomingBirthdays.length === 0 ? (
          <p className="text-sm text-coffee/55 bg-cream-soft rounded-2xl px-4 py-4 text-center">
            Doğum tarihi kayıtlı üye bulunmuyor.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {upcomingBirthdays.map(({ member, days }) => {
              const imminent = days <= 1;
              const soon = days <= 30;
              return (
                <li key={member.id}>
                  <button
                    type="button"
                    onClick={() => openMemberFromBirthday(member.id)}
                    className="w-full flex items-center gap-3 rounded-2xl border border-rose-gold/15 px-4 py-3 text-left hover:bg-cream-soft hover:border-rose-gold/35 transition-colors group"
                  >
                    <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-bordo-gradient text-cream font-display text-base">
                      {member.name.charAt(0)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-coffee leading-tight truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-coffee/50">
                        🎂 {formatDayMonth(member.birthDate as string)}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.65rem] font-medium ${
                        imminent
                          ? "bg-bordo text-cream border-transparent"
                          : soon
                            ? "bg-rose-gold/15 text-rose-goldDark border-rose-gold/35"
                            : "bg-cream-soft text-coffee/55 border-rose-gold/15"
                      }`}
                    >
                      {imminent && <Gift size={11} strokeWidth={2} />}
                      {birthdayCountdownLabel(days)}
                    </span>
                    <ChevronRight
                      size={16}
                      strokeWidth={1.7}
                      className="text-coffee/30 group-hover:text-bordo group-hover:translate-x-0.5 transition-all flex-shrink-0"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Modal>

      {/* Kod silme onayı */}
      <ConfirmDialog
        open={!!removeCode}
        title="Kodu sil"
        message={`"${removeCode?.code}" kodu silinecek. Devam edilsin mi?`}
        onConfirm={() => {
          if (member && removeCode) removeMemberCode(member.id, removeCode.code);
          toast({ title: "Kod silindi", tone: "info" });
        }}
        onClose={() => setRemoveCode(null)}
      />
    </div>
  );
}

function InfoRow({
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
        <p className="text-sm text-coffee truncate">{value}</p>
      </div>
    </div>
  );
}
