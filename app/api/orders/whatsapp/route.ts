import { NextResponse } from "next/server";
import { createOrder, getMemberById } from "@/lib/db/queries";
import { getMemberId } from "@/lib/member-auth";
import { makeId } from "@/lib/admin/store";
import { generateOrderNo, orderTotal } from "@/lib/admin/orders";
import type { Order, OrderItem } from "@/lib/admin/types";
import { formatPrice } from "@/lib/utils/format";
import { whatsappLink } from "@/lib/constants";
import { sendMail, notifyEmail } from "@/lib/mail";
import { buildBusinessEmail, buildCustomerEmail } from "@/lib/order-mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckoutItem = {
  productId?: unknown;
  name?: unknown;
  price?: unknown;
  quantity?: unknown;
  cardNote?: unknown;
  deliveryRegion?: unknown;
  deliveryDate?: unknown;
  deliverySlot?: unknown;
  deliveryAddress?: unknown;
  deliveryCity?: unknown;
  giftWrap?: unknown;
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function money(value: unknown): number {
  const n = Math.round(Number(value));
  return Number.isFinite(n) ? n : 0;
}

function quantity(value: unknown): number {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(99, n));
}

function deliveryRegionLabel(region: string): string {
  if (region === "gemlik") return "Gemlik içi";
  if (region === "sehir-disi") return "Şehir dışı / kargo";
  if (region === "bursa") return "Şehir dışı / kargo";
  return "WhatsApp üzerinden netleşecek";
}

function giftWrapLabel(wrap: string): string {
  if (wrap === "premium") return "Premium paket";
  if (wrap === "luks") return "Lüks kutu";
  return "Standart paket";
}

function normalizeItems(raw: unknown): {
  orderItems: OrderItem[];
  /** Yalnızca müşterinin yazdığı kart mesajları (KART NOTU alanına gider). */
  cardNotes: string[];
  /** Pakete dair ek bilgiler (ADMIN NOTU içinde kısa liste). */
  packageNotes: string[];
  first: CheckoutItem | null;
} {
  if (!Array.isArray(raw))
    return { orderItems: [], cardNotes: [], packageNotes: [], first: null };

  const orderItems: OrderItem[] = [];
  const cardNotes: string[] = [];
  const packageNotes: string[] = [];
  let first: CheckoutItem | null = null;
  const multiItem = (raw as unknown[]).length > 1;

  for (const item of raw.slice(0, 30) as CheckoutItem[]) {
    const name = text(item.name);
    const price = money(item.price);
    const qty = quantity(item.quantity);
    if (!name || price <= 0) continue;
    if (!first) first = item;

    orderItems.push({
      productId: text(item.productId) || undefined,
      name,
      price,
      quantity: qty,
    });

    // Kart notu: sadece müşterinin yazdığı mesaj (birden çok ürün varsa ürün adıyla)
    const cardNote = text(item.cardNote);
    if (cardNote) cardNotes.push(multiItem ? `${name}: ${cardNote}` : cardNote);

    // Paket bilgisi: standart dışıysa admin notuna kısa ekle
    const wrap = text(item.giftWrap);
    if (wrap && wrap !== "standart") {
      packageNotes.push(`${name}: ${giftWrapLabel(wrap)}`);
    }
  }

  return { orderItems, cardNotes, packageNotes, first };
}

function buildOrderMessage(order: Order, discount: number, couponCode: string) {
  const productItems = order.items.filter(
    (item) => !item.name.toLowerCase().startsWith("kupon indirimi"),
  );
  const lines = [
    "Merhaba Floria Garden, web sitesinden siparişimi oluşturdum.",
    `Sipariş no: ${order.orderNo}`,
    "",
    "Ürünler:",
    ...productItems.map(
      (item, idx) =>
        `${idx + 1}. ${item.name} × ${item.quantity} — ${formatPrice(
          item.price * item.quantity,
        )}`,
    ),
    "",
    `Toplam: ${formatPrice(orderTotal(order))}`,
  ];

  if (couponCode && discount > 0) {
    lines.push(`Kupon: ${couponCode} / ${formatPrice(discount)} indirim`);
  }

  lines.push(
    "",
    "Teslimat bölgesi, alıcı bilgileri ve ödeme yöntemini buradan netleştirmek istiyorum.",
  );

  return lines.join("\n");
}

async function notifyOrder(order: Order) {
  try {
    const notify = notifyEmail();
    if (notify) {
      const biz = buildBusinessEmail(order);
      await sendMail({
        to: notify,
        subject: biz.subject,
        html: biz.html,
        replyTo: order.customerEmail || undefined,
      });
    }

    if (order.customerEmail) {
      const customer = buildCustomerEmail(order);
      await sendMail({
        to: order.customerEmail,
        subject: customer.subject,
        html: customer.html,
      });
    }
  } catch {
    /* E-posta hatası sipariş kaydını bozmasın. */
  }
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const { orderItems, cardNotes, packageNotes, first } = normalizeItems(
    body?.items,
  );
  if (orderItems.length === 0) {
    return NextResponse.json(
      { error: "Sepette siparişe çevrilecek ürün yok." },
      { status: 400 },
    );
  }

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const couponCode = text(body?.coupon?.code);
  const requestedDiscount = money(body?.coupon?.discount);
  const discount = Math.max(0, Math.min(subtotal, requestedDiscount));
  const items =
    discount > 0
      ? [
          ...orderItems,
          {
            name: `Kupon indirimi${couponCode ? ` (${couponCode})` : ""}`,
            price: -discount,
            quantity: 1,
          },
        ]
      : orderItems;

  // Zorunlu müşteri bilgileri — eksik/geçersizse sipariş OLUŞTURULMAZ (panele düşmez).
  const cName = text(body?.customer?.name);
  const cPhone = text(body?.customer?.phone);
  const cAddress =
    text(body?.customer?.address) ||
    text(first?.deliveryAddress) ||
    text(first?.deliveryCity);
  const cPhoneDigits = cPhone.replace(/\D/g, "");
  if (!cName || cPhoneDigits.length !== 11 || !cAddress) {
    return NextResponse.json(
      { error: "Ad Soyad, telefon (0 5XX...) ve teslimat adresi zorunludur." },
      { status: 400 },
    );
  }

  const memberId = getMemberId();
  const member = memberId ? await getMemberById(memberId) : null;
  const firstRegion = text(first?.deliveryRegion);
  const deliveryZone = deliveryRegionLabel(firstRegion);
  const deliveryAddress = cAddress;
  const customerName = cName;
  const customerPhone = cPhone;
  const customerEmail = member?.email || undefined;
  const customerKnown = Boolean(member);

  // Admin notu: KISA ve tekrarsız. Adres/tarih/saat zaten kendi alanlarında
  // gösterildiği için burada tekrar edilmez; sadece kaynak + tutar + paket.
  const adminNoteLines = [
    customerKnown
      ? "Web sitesi siparişi — üye hesabıyla eşleşti."
      : "Web sitesi siparişi — üye girişi olmadan oluşturuldu.",
    `Sepet toplamı: ${formatPrice(subtotal)}`,
  ];
  if (discount > 0) {
    adminNoteLines.push(
      `Kupon: ${couponCode || "Kupon"} (−${formatPrice(discount)})`,
    );
    adminNoteLines.push(`Ödenecek toplam: ${formatPrice(subtotal - discount)}`);
  }
  if (packageNotes.length > 0) {
    adminNoteLines.push(`Paket: ${packageNotes.join(" · ")}`);
  }

  const order: Order = {
    id: makeId("order"),
    orderNo: generateOrderNo(),
    createdAt: new Date().toISOString(),
    customerName,
    customerPhone,
    customerEmail,
    recipientName: customerName,
    recipientPhone: customerPhone,
    address: deliveryAddress,
    surprise: false,
    items,
    deliveryZone,
    deliveryDate: text(first?.deliveryDate),
    deliverySlot: text(first?.deliverySlot) || "WhatsApp üzerinden netleşecek",
    payment: "havale",
    status: "yeni",
    // KART NOTU: yalnızca müşterinin yazdığı kart mesajı.
    cardNote: cardNotes.join("\n"),
    adminNote: adminNoteLines.join("\n"),
  };

  try {
    await createOrder(order);
    void notifyOrder(order);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Sipariş kaydı oluşturulamadı.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    orderId: order.id,
    orderNo: order.orderNo,
    whatsappUrl: whatsappLink(buildOrderMessage(order, discount, couponCode)),
    memberLinked: customerKnown,
  });
}
