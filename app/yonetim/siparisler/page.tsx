"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ClipboardList,
  Search,
  Copy,
  Check,
  MessageCircle,
  Truck,
  CalendarClock,
  Gift,
  MapPin,
  X,
  Printer,
  Flower2,
} from "lucide-react";
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
import { makeId } from "@/lib/admin/store";
import { formatPrice } from "@/lib/utils/format";
import {
  ORDER_STATUSES,
  STATUS_LABEL,
  STATUS_STYLE,
  PAYMENT_LABEL,
  orderTotal,
  generateOrderNo,
  todayDateStr,
  isCreatedToday,
  formatOrderDate,
  waCustomerLink,
  statusWaMessage,
} from "@/lib/admin/orders";
import { cn } from "@/lib/utils/cn";
import type {
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
} from "@/lib/admin/types";

const emptyItem = (): OrderItem => ({
  productId: "",
  name: "",
  price: 0,
  quantity: 1,
});

export default function SiparislerPage() {
  const { data, addOrder, updateOrder, removeOrder } = useAdminData();
  const { toast } = useToast();

  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [query, setQuery] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  // Form
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Order | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [address, setAddress] = useState("");
  const [surprise, setSurprise] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([emptyItem()]);
  const [deliveryZone, setDeliveryZone] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliverySlot, setDeliverySlot] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("nakit");
  const [status, setStatus] = useState<OrderStatus>("yeni");
  const [cardNote, setCardNote] = useState("");
  const [adminNote, setAdminNote] = useState("");

  const detail = data.orders.find((o) => o.id === detailId) ?? null;
  const today = todayDateStr();

  /* ── İstatistikler ── */
  const stats = useMemo(() => {
    const orders = data.orders;
    return {
      today: orders.filter((o) => isCreatedToday(o.createdAt)).length,
      pending: orders.filter(
        (o) => o.status === "yeni" || o.status === "hazirlaniyor",
      ).length,
      todayDelivery: orders.filter(
        (o) =>
          o.deliveryDate === today &&
          o.status !== "iptal" &&
          o.status !== "teslim",
      ).length,
      revenue: orders
        .filter((o) => o.status !== "iptal")
        .reduce((s, o) => s + orderTotal(o), 0),
    };
  }, [data.orders, today]);

  const todayDeliveries = useMemo(
    () =>
      data.orders.filter(
        (o) =>
          o.deliveryDate === today &&
          o.status !== "iptal" &&
          o.status !== "teslim",
      ),
    [data.orders, today],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return data.orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (!q) return true;
      return [o.orderNo, o.customerName, o.customerPhone, o.recipientName]
        .join(" ")
        .toLocaleLowerCase("tr")
        .includes(q);
    });
  }, [data.orders, statusFilter, query]);

  /* ── Form yardımcıları ── */
  const resetForm = () => {
    setCustomerName("");
    setCustomerPhone("+90 ");
    setCustomerEmail("");
    setRecipientName("");
    setRecipientPhone("+90 ");
    setAddress("");
    setSurprise(false);
    setItems([emptyItem()]);
    setDeliveryZone(data.deliveryZones[0]?.name ?? "");
    setDeliveryDate(today);
    setDeliverySlot("");
    setPayment("nakit");
    setStatus("yeni");
    setCardNote("");
    setAdminNote("");
  };

  const openNew = () => {
    setEditTarget(null);
    resetForm();
    setFormOpen(true);
  };

  const openEdit = (o: Order) => {
    setEditTarget(o);
    setCustomerName(o.customerName);
    setCustomerPhone(o.customerPhone);
    setCustomerEmail(o.customerEmail ?? "");
    setRecipientName(o.recipientName);
    setRecipientPhone(o.recipientPhone);
    setAddress(o.address);
    setSurprise(o.surprise);
    setItems(o.items.length ? o.items.map((i) => ({ ...i })) : [emptyItem()]);
    setDeliveryZone(o.deliveryZone);
    setDeliveryDate(o.deliveryDate);
    setDeliverySlot(o.deliverySlot);
    setPayment(o.payment);
    setStatus(o.status);
    setCardNote(o.cardNote);
    setAdminNote(o.adminNote);
    setDetailId(null);
    setFormOpen(true);
  };

  const setItemProduct = (index: number, productId: string) => {
    const product = data.products.find((p) => p.id === productId);
    setItems((arr) =>
      arr.map((it, i) =>
        i === index
          ? product
            ? { productId, name: product.name, price: product.price, quantity: it.quantity }
            : { ...it, productId: "" }
          : it,
      ),
    );
  };

  const setItemQty = (index: number, qty: number) =>
    setItems((arr) =>
      arr.map((it, i) =>
        i === index ? { ...it, quantity: Math.max(1, qty || 1) } : it,
      ),
    );

  const addItemRow = () => setItems((arr) => [...arr, emptyItem()]);
  const removeItemRow = (index: number) =>
    setItems((arr) => (arr.length > 1 ? arr.filter((_, i) => i !== index) : arr));

  const formItems = items.filter((i) => i.name && i.price >= 0);
  const formTotal = formItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      toast({ title: "Müşteri adı gerekli", tone: "warning" });
      return;
    }
    if (formItems.length === 0) {
      toast({ title: "En az bir ürün ekleyin", tone: "warning" });
      return;
    }
    const base = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || undefined,
      recipientName: recipientName.trim(),
      recipientPhone: recipientPhone.trim(),
      address: address.trim(),
      surprise,
      items: formItems,
      deliveryZone,
      deliveryDate,
      deliverySlot: deliverySlot.trim(),
      payment,
      status,
      cardNote: cardNote.trim(),
      adminNote: adminNote.trim(),
    };
    if (editTarget) {
      updateOrder(editTarget.id, base);
      toast({ title: "Sipariş güncellendi", tone: "success" });
    } else {
      addOrder({
        id: makeId("order"),
        orderNo: generateOrderNo(),
        createdAt: new Date().toISOString(),
        ...base,
      });
      toast({ title: "Sipariş eklendi", tone: "success" });
    }
    setFormOpen(false);
  };

  const changeStatus = (id: string, s: OrderStatus) => {
    updateOrder(id, { status: s });
    toast({ title: `Durum: ${STATUS_LABEL[s]}`, tone: "success" });
  };

  const copyCardNote = async (note: string) => {
    try {
      await navigator.clipboard.writeText(note);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast({ title: "Kopyalanamadı", tone: "warning" });
    }
  };

  const printOrder = (o: Order) => {
    const esc = (t: string) =>
      String(t ?? "").replace(/[&<>]/g, (c) =>
        c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;",
      );
    const rows = o.items
      .map(
        (it) =>
          `<tr><td>${esc(it.name)}</td><td style="text-align:center">${it.quantity}</td><td style="text-align:right">${esc(formatPrice(it.price * it.quantity))}</td></tr>`,
      )
      .join("");
    const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>${esc(o.orderNo)}</title>
<style>
  body{font-family:-apple-system,Segoe UI,Arial,sans-serif;color:#2a1a14;padding:28px;max-width:520px;margin:auto}
  h1{font-size:20px;margin:0 0 2px}.muted{color:#8a7;font-size:12px;color:#8a7a70}
  .box{border:1px solid #e7d8c8;border-radius:12px;padding:14px;margin-top:14px}
  .lbl{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#a3823f;margin-bottom:2px}
  table{width:100%;border-collapse:collapse;margin-top:6px;font-size:14px}
  td{padding:6px 0;border-bottom:1px solid #f0e6da}
  .total{font-weight:700;font-size:16px;color:#8e1f3f;text-align:right;margin-top:8px}
  .note{font-style:italic;background:#faf6f0;border-radius:10px;padding:10px;margin-top:6px}
  @media print{button{display:none}}
</style></head><body>
  <h1>Floria Garden</h1>
  <div class="muted">Sipariş ${esc(o.orderNo)} · ${esc(formatOrderDate(o.createdAt))}</div>
  <div class="box"><div class="lbl">Alıcı</div><b>${esc(o.recipientName || o.customerName)}</b><br>${esc(o.recipientPhone || o.customerPhone)}<br>${esc(o.address)}</div>
  <div class="box"><div class="lbl">Teslimat</div>${esc(o.deliveryZone)} · ${esc(formatOrderDate(o.deliveryDate))} ${esc(o.deliverySlot)}</div>
  ${o.cardNote ? `<div class="box"><div class="lbl">Kart Notu</div><div class="note">${esc(o.cardNote)}</div></div>` : ""}
  <div class="box"><div class="lbl">Ürünler</div><table>${rows}</table><div class="total">Toplam: ${esc(formatPrice(orderTotal(o)))}</div></div>
  ${o.surprise ? '<p class="muted">⚠ Sürpriz teslimat — gönderen açıklanmaz</p>' : ""}
  <button onclick="window.print()" style="margin-top:16px;padding:8px 16px">Yazdır</button>
</body></html>`;
    const w = window.open("", "_blank", "width=560,height=720");
    if (!w) {
      toast({ title: "Pencere açılamadı", description: "Pop-up'a izin verin", tone: "warning" });
      return;
    }
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  };

  return (
    <div>
      <AdminPageHeader
        title="Siparişler"
        description="Telefon/WhatsApp siparişlerini buradan kaydedin ve takip edin."
        action={
          <Button variant="gold" size="sm" onClick={openNew}>
            <Plus size={16} strokeWidth={2} />
            Yeni Sipariş
          </Button>
        }
      />

      {/* İstatistikler */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatBox label="Bugünkü sipariş" value={String(stats.today)} />
        <StatBox label="Bekleyen" value={String(stats.pending)} />
        <StatBox label="Bugün teslim" value={String(stats.todayDelivery)} />
        <StatBox label="Toplam ciro" value={formatPrice(stats.revenue)} accent />
      </div>

      {/* Bugün teslim edilecekler */}
      <AdminCard className="p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-bordo-gradient text-cream">
            <Truck size={18} strokeWidth={1.7} />
          </span>
          <div>
            <h2 className="font-display text-2xl text-coffee leading-tight">
              Bugün Teslim Edilecekler
            </h2>
            <p className="text-sm text-coffee/55">
              Teslim tarihi bugün olan, henüz teslim edilmemiş siparişler.
            </p>
          </div>
        </div>
        {todayDeliveries.length === 0 ? (
          <p className="text-sm text-coffee/50 bg-cream-soft rounded-2xl px-4 py-3">
            Bugün teslim edilecek sipariş yok.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {todayDeliveries.map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  onClick={() => setDetailId(o.id)}
                  className="w-full flex items-center gap-3 rounded-2xl border border-rose-gold/15 px-4 py-3 text-left hover:bg-cream-soft hover:border-rose-gold/35 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-coffee leading-tight truncate">
                      {o.recipientName || o.customerName}
                      <span className="text-coffee/40 font-mono text-xs ml-2">
                        {o.orderNo}
                      </span>
                    </p>
                    <p className="text-xs text-coffee/50 truncate flex items-center gap-1.5">
                      <MapPin size={11} strokeWidth={1.7} />
                      {o.deliveryZone || "—"}
                      {o.deliverySlot ? ` · ${o.deliverySlot}` : ""}
                    </p>
                  </div>
                  <StatusChip status={o.status} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>

      {/* Filtre + arama */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <FilterPill
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
            label="Tümü"
          />
          {ORDER_STATUSES.map((s) => (
            <FilterPill
              key={s}
              active={statusFilter === s}
              onClick={() => setStatusFilter(s)}
              label={STATUS_LABEL[s]}
            />
          ))}
        </div>
        <div className="relative ml-auto">
          <Search
            size={15}
            strokeWidth={1.7}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-coffee/40"
            aria-hidden
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="No, isim, telefon…"
            aria-label="Sipariş ara"
            className="rounded-full border border-rose-gold/25 bg-white pl-10 pr-4 h-10 text-sm text-coffee placeholder:text-coffee/40 focus:outline-none focus:border-bordo w-full sm:w-64 transition-colors"
          />
        </div>
      </div>

      {/* Liste */}
      {data.orders.length === 0 ? (
        <AdminCard className="p-12 flex flex-col items-center text-center gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-rose-gold-gradient text-coffee">
            <ClipboardList size={24} strokeWidth={1.5} />
          </span>
          <p className="text-coffee/60 text-sm max-w-xs">
            Henüz sipariş yok. WhatsApp/telefondan gelen siparişleri buraya
            ekleyerek takip edebilirsiniz.
          </p>
          <Button variant="gold" size="sm" onClick={openNew}>
            <Plus size={16} strokeWidth={2} />
            İlk siparişi ekle
          </Button>
        </AdminCard>
      ) : filtered.length === 0 ? (
        <AdminCard className="p-8 text-center text-sm text-coffee/55">
          Bu filtreye uygun sipariş yok.
        </AdminCard>
      ) : (
        <AdminCard className="divide-y divide-rose-gold/12 overflow-hidden">
          {filtered.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setDetailId(o.id)}
              className="w-full flex items-center gap-4 p-4 sm:p-5 text-left hover:bg-cream-soft/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display text-lg text-coffee leading-tight truncate">
                    {o.recipientName || o.customerName}
                  </h3>
                  {o.surprise && (
                    <span className="inline-flex items-center gap-1 text-[0.6rem] uppercase tracking-wider2 text-rose-goldDark">
                      <Gift size={11} strokeWidth={1.8} />
                      Sürpriz
                    </span>
                  )}
                </div>
                <p className="text-xs text-coffee/45 font-mono">{o.orderNo}</p>
                <p className="text-xs text-coffee/50 mt-0.5 flex items-center gap-1.5">
                  <CalendarClock size={11} strokeWidth={1.7} />
                  {formatOrderDate(o.deliveryDate)}
                  {o.deliveryZone ? ` · ${o.deliveryZone}` : ""}
                </p>
              </div>
              <div className="text-right flex flex-col items-end gap-1.5">
                <span className="font-display text-lg text-bordo">
                  {formatPrice(orderTotal(o))}
                </span>
                <StatusChip status={o.status} />
              </div>
            </button>
          ))}
        </AdminCard>
      )}

      {/* ── Sipariş formu ── */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editTarget ? "Siparişi Düzenle" : "Yeni Sipariş"}
        size="lg"
      >
        <form onSubmit={submit} className="flex flex-col gap-6">
          {/* Müşteri */}
          <div>
            <p className="text-xs uppercase tracking-wider2 text-rose-goldDark mb-3">
              Müşteri (gönderen)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ad Soyad"
                autoFocus
                className={adminInput}
              />
              <input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Telefon"
                inputMode="tel"
                className={adminInput}
              />
            </div>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="E-posta (girilirse müşteriye onay maili gider)"
              className={`${adminInput} mt-3`}
            />
          </div>

          {/* Alıcı */}
          <div>
            <p className="text-xs uppercase tracking-wider2 text-rose-goldDark mb-3">
              Alıcı
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Alıcı adı"
                className={adminInput}
              />
              <input
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="Alıcı telefon"
                inputMode="tel"
                className={adminInput}
              />
            </div>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Teslimat adresi"
              rows={2}
              className={`${adminInput} h-auto py-3 resize-none mt-3`}
            />
            <label className="inline-flex items-center gap-2 mt-3 cursor-pointer">
              <input
                type="checkbox"
                checked={surprise}
                onChange={(e) => setSurprise(e.target.checked)}
                className="h-4 w-4 accent-bordo"
              />
              <span className="text-sm text-coffee/70">
                Sürpriz teslimat (gönderen alıcıya açıklanmaz)
              </span>
            </label>
          </div>

          {/* Ürünler */}
          <div>
            <p className="text-xs uppercase tracking-wider2 text-rose-goldDark mb-3">
              Ürünler
            </p>
            {data.products.length === 0 ? (
              <p className="text-sm text-coffee/50 bg-cream-soft rounded-2xl px-4 py-3">
                Önce Ürünler sayfasından ürün ekleyin.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {items.map((it, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <select
                      value={it.productId || ""}
                      onChange={(e) => setItemProduct(i, e.target.value)}
                      className={`${adminInput} cursor-pointer flex-1 min-w-0`}
                      style={{ colorScheme: "light" }}
                    >
                      <option value="">Ürün seçin…</option>
                      {data.products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {formatPrice(p.price)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      value={it.quantity}
                      onChange={(e) => setItemQty(i, Number(e.target.value))}
                      aria-label="Adet"
                      className={`${adminInput} w-20 text-center`}
                    />
                    <button
                      type="button"
                      onClick={() => removeItemRow(i)}
                      aria-label="Satırı kaldır"
                      disabled={items.length === 1}
                      className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-rose-gold/25 text-coffee/60 hover:text-bordo hover:border-bordo disabled:opacity-40 transition-colors"
                    >
                      <X size={15} strokeWidth={1.8} />
                    </button>
                  </div>
                ))}
                <div className="flex items-center justify-between mt-1">
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="inline-flex items-center gap-1.5 text-sm text-rose-goldDark hover:text-bordo transition-colors"
                  >
                    <Plus size={15} strokeWidth={2} />
                    Ürün ekle
                  </button>
                  <span className="text-sm text-coffee/70">
                    Toplam:{" "}
                    <strong className="font-display text-lg text-bordo">
                      {formatPrice(formTotal)}
                    </strong>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Teslimat */}
          <div>
            <p className="text-xs uppercase tracking-wider2 text-rose-goldDark mb-3">
              Teslimat
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={deliveryZone}
                onChange={(e) => setDeliveryZone(e.target.value)}
                aria-label="Teslimat bölgesi"
                className={`${adminInput} cursor-pointer`}
                style={{ colorScheme: "light" }}
              >
                <option value="">Bölge seçin…</option>
                {data.deliveryZones.map((z) => (
                  <option key={z.id} value={z.name}>
                    {z.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                aria-label="Teslim tarihi"
                className={adminInput}
                style={{ colorScheme: "light" }}
              />
              <input
                value={deliverySlot}
                onChange={(e) => setDeliverySlot(e.target.value)}
                placeholder="Saat (örn. 14:00-16:00)"
                className={adminInput}
              />
            </div>
          </div>

          {/* Kart notu */}
          <div>
            <label htmlFor="o-card" className={adminLabel}>
              Kart notu 💌
            </label>
            <textarea
              id="o-card"
              value={cardNote}
              onChange={(e) => setCardNote(e.target.value)}
              placeholder="Çiçeğe iliştirilecek mesaj"
              rows={2}
              className={`${adminInput} h-auto py-3 resize-none`}
            />
          </div>

          {/* Ödeme + Durum */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="o-pay" className={adminLabel}>
                Ödeme
              </label>
              <select
                id="o-pay"
                value={payment}
                onChange={(e) => setPayment(e.target.value as PaymentMethod)}
                className={`${adminInput} cursor-pointer`}
                style={{ colorScheme: "light" }}
              >
                {(Object.keys(PAYMENT_LABEL) as PaymentMethod[]).map((p) => (
                  <option key={p} value={p}>
                    {PAYMENT_LABEL[p]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="o-status" className={adminLabel}>
                Durum
              </label>
              <select
                id="o-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className={`${adminInput} cursor-pointer`}
                style={{ colorScheme: "light" }}
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Admin notu */}
          <div>
            <label htmlFor="o-note" className={adminLabel}>
              Admin notu (opsiyonel)
            </label>
            <input
              id="o-note"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Sadece sizin göreceğiniz not"
              className={adminInput}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <Button type="button" variant="outline" size="sm" onClick={() => setFormOpen(false)}>
              Vazgeç
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editTarget ? "Kaydet" : "Siparişi Ekle"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Sipariş detayı ── */}
      <Modal
        open={!!detail}
        onClose={() => setDetailId(null)}
        title={detail ? detail.orderNo : "Sipariş"}
        size="lg"
      >
        {detail && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <StatusChip status={detail.status} />
              <span className="text-xs text-coffee/45">
                {formatOrderDate(detail.createdAt)}
              </span>
            </div>

            {/* Durum değiştir */}
            <div>
              <span className={adminLabel}>Durumu değiştir</span>
              <div className="flex flex-wrap gap-2">
                {ORDER_STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => changeStatus(detail.id, s)}
                    className={cn(
                      "inline-flex items-center rounded-full border px-3.5 h-8 text-xs font-medium transition-all",
                      detail.status === s
                        ? STATUS_STYLE[s] + " ring-1 ring-bordo/30"
                        : "border-rose-gold/25 bg-white text-coffee/60 hover:border-rose-gold hover:text-coffee",
                    )}
                  >
                    {STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>

            {/* Bilgiler */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoBox label="Müşteri" value={detail.customerName} sub={detail.customerPhone} />
              <InfoBox
                label="Alıcı"
                value={detail.recipientName || "—"}
                sub={detail.recipientPhone}
              />
            </div>
            {detail.address && (
              <InfoBox label="Adres" value={detail.address} />
            )}
            {detail.surprise && (
              <p className="inline-flex items-center gap-1.5 text-xs text-rose-goldDark">
                <Gift size={13} strokeWidth={1.8} />
                Sürpriz teslimat — gönderen açıklanmaz
              </p>
            )}

            {/* Ürünler */}
            <div className="rounded-2xl border border-rose-gold/15 overflow-hidden">
              {detail.items.map((it, i) => {
                const product = it.productId
                  ? data.products.find((p) => p.id === it.productId)
                  : undefined;
                const isDiscount = it.price < 0;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 sm:px-4 py-2.5 text-sm border-b border-rose-gold/10 last:border-0"
                  >
                    {!isDiscount && (
                      <span
                        className={`relative h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 overflow-hidden rounded-xl border border-rose-gold/20 ${
                          product?.image
                            ? ""
                            : `bg-gradient-to-br ${product?.gradient ?? "from-rose-gold/25 to-bordo/15"}`
                        }`}
                      >
                        {product?.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.image}
                            alt={it.name}
                            className="absolute inset-0 h-full w-full object-cover object-center"
                          />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center text-bordo/50">
                            <Flower2 size={20} strokeWidth={1.5} />
                          </span>
                        )}
                      </span>
                    )}
                    <span className="flex-1 min-w-0 text-coffee">
                      <span className="line-clamp-2 align-middle">{it.name}</span>{" "}
                      <span className="text-coffee/45">× {it.quantity}</span>
                    </span>
                    <span className="flex-shrink-0 text-coffee/70 whitespace-nowrap">
                      {formatPrice(it.price * it.quantity)}
                    </span>
                  </div>
                );
              })}
              <div className="flex items-center justify-between px-4 py-3 bg-cream-soft">
                <span className="text-xs uppercase tracking-wider2 text-coffee/55">
                  Toplam
                </span>
                <span className="font-display text-xl text-bordo">
                  {formatPrice(orderTotal(detail))}
                </span>
              </div>
            </div>

            {/* Teslimat */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <InfoBox label="Bölge" value={detail.deliveryZone || "—"} />
              <InfoBox label="Tarih" value={formatOrderDate(detail.deliveryDate)} />
              <InfoBox label="Saat" value={detail.deliverySlot || "—"} />
            </div>
            <InfoBox label="Ödeme" value={PAYMENT_LABEL[detail.payment]} />

            {/* Kart notu */}
            {detail.cardNote && (
              <div className="rounded-2xl border border-rose-gold/20 bg-cream-soft p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs uppercase tracking-wider2 text-rose-goldDark">
                    Kart notu 💌
                  </span>
                  <button
                    type="button"
                    onClick={() => copyCardNote(detail.cardNote)}
                    className="inline-flex items-center gap-1 text-xs text-coffee/55 hover:text-bordo transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={13} strokeWidth={2} className="text-sage-deep" />
                        Kopyalandı
                      </>
                    ) : (
                      <>
                        <Copy size={13} strokeWidth={1.8} />
                        Kopyala
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-coffee italic leading-relaxed">
                  “{detail.cardNote}”
                </p>
              </div>
            )}

            {detail.adminNote && (
              <InfoBox label="Admin notu" value={detail.adminNote} />
            )}

            {/* Aksiyonlar */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {detail.customerPhone && (
                <a
                  href={waCustomerLink(detail.customerPhone, statusWaMessage(detail))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-rose-gold-gradient text-coffee px-4 h-10 text-sm font-medium hover:brightness-105 transition-all"
                >
                  <MessageCircle size={15} strokeWidth={1.8} />
                  Müşteriye WhatsApp
                </a>
              )}
              <button
                type="button"
                onClick={() => printOrder(detail)}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-gold/30 text-coffee/75 hover:text-bordo hover:border-bordo px-4 h-10 text-sm transition-colors"
              >
                <Printer size={14} strokeWidth={1.8} />
                Yazdır
              </button>
              <button
                type="button"
                onClick={() => openEdit(detail)}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-gold/30 text-coffee/75 hover:text-bordo hover:border-bordo px-4 h-10 text-sm transition-colors"
              >
                <Pencil size={14} strokeWidth={1.8} />
                Düzenle
              </button>
              <button
                type="button"
                onClick={() => {
                  setDetailId(null);
                  setDeleteTarget(detail);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-gold/30 text-coffee/75 hover:text-bordo hover:border-bordo px-4 h-10 text-sm transition-colors ml-auto"
              >
                <Trash2 size={14} strokeWidth={1.8} />
                Sil
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Silme onayı */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Siparişi sil"
        message={`"${deleteTarget?.orderNo}" siparişi silinecek. Devam edilsin mi?`}
        onConfirm={() => {
          if (deleteTarget) removeOrder(deleteTarget.id);
          toast({ title: "Sipariş silindi", tone: "info" });
        }}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

/* ── Küçük yardımcı bileşenler ── */

function StatBox({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <AdminCard className="p-4 sm:p-5">
      <p
        className={cn(
          "font-display tabular-nums leading-none",
          accent ? "text-2xl sm:text-3xl text-bordo" : "text-3xl text-coffee",
        )}
      >
        {value}
      </p>
      <p className="text-xs text-coffee/55 mt-1.5">{label}</p>
    </AdminCard>
  );
}

function StatusChip({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[0.65rem] uppercase tracking-wider2 font-medium",
        STATUS_STYLE[status],
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function FilterPill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center rounded-full px-3.5 h-8 text-xs font-medium tracking-wide transition-all",
        active
          ? "bg-rose-gold-gradient text-coffee border border-transparent shadow-soft"
          : "border border-rose-gold/25 bg-white text-coffee/70 hover:border-rose-gold hover:text-coffee",
      )}
    >
      {label}
    </button>
  );
}

function InfoBox({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl bg-cream-soft px-4 py-3">
      <p className="text-[0.65rem] uppercase tracking-wider2 text-rose-goldDark">
        {label}
      </p>
      <p className="text-sm text-coffee">{value}</p>
      {sub && <p className="text-xs text-coffee/50 mt-0.5">{sub}</p>}
    </div>
  );
}
