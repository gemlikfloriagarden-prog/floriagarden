import { MapPin, Calendar, Clock, Gift, MessageSquareQuote } from "lucide-react";
import type { CartItem } from "@/lib/cart/types";

const SLOT_LABELS: Record<string, string> = {
  "09-12": "09:00 — 12:00",
  "12-15": "12:00 — 15:00",
  "15-18": "15:00 — 18:00",
  "18-22": "18:00 — 22:00",
};

function regionLabel(item: CartItem): string | null {
  if (!item.deliveryRegion) return null;
  if (item.deliveryRegion === "gemlik") return "Gemlik içi";
  return "Şehir dışı (kargo)";
}

function wrapLabel(item: CartItem): string | null {
  if (!item.giftWrap || item.giftWrap === "standart") return null;
  return item.giftWrap === "premium" ? "Premium paket" : "Lüks kutu";
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "long",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/**
 * Sepet kartında müşterinin seçtiği teslimat/not detaylarını
 * küçük etiketler (chip) olarak gösterir. Drawer + sepet sayfasında ortak.
 */
export default function CartItemDetails({ item }: { item: CartItem }) {
  const region = regionLabel(item);
  const wrap = wrapLabel(item);
  const isOutOfCity = item.deliveryRegion === "sehir-disi";

  const addressOneLine = item.deliveryAddress
    ? item.deliveryAddress.replace(/\s*\n\s*/g, " · ")
    : "";

  const hasAny =
    region || addressOneLine || item.deliveryDate || wrap || item.cardNote;
  if (!hasAny) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {region && (
        <Chip icon={<MapPin size={11} strokeWidth={1.8} />}>{region}</Chip>
      )}
      {addressOneLine && (
        <Chip icon={<MapPin size={11} strokeWidth={1.8} />}>
          {addressOneLine}
        </Chip>
      )}
      {item.deliveryDate && (
        <Chip icon={<Calendar size={11} strokeWidth={1.8} />}>
          {formatDate(item.deliveryDate)}
        </Chip>
      )}
      {!isOutOfCity && item.deliverySlot && SLOT_LABELS[item.deliverySlot] && (
        <Chip icon={<Clock size={11} strokeWidth={1.8} />}>
          {SLOT_LABELS[item.deliverySlot]}
        </Chip>
      )}
      {wrap && <Chip icon={<Gift size={11} strokeWidth={1.8} />}>{wrap}</Chip>}
      {item.cardNote && (
        <Chip icon={<MessageSquareQuote size={11} strokeWidth={1.8} />} italic>
          {item.cardNote}
        </Chip>
      )}
    </div>
  );
}

function Chip({
  icon,
  italic,
  children,
}: {
  icon: React.ReactNode;
  italic?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 max-w-full rounded-full bg-cream border border-rose-gold/25 pl-2 pr-2.5 py-1 text-[0.68rem] leading-none text-coffee/80 ${
        italic ? "italic" : ""
      }`}
    >
      <span className="text-rose-goldDark flex-shrink-0">{icon}</span>
      <span className="truncate">{children}</span>
    </span>
  );
}
