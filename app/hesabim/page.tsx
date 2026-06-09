"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Check,
  Edit3,
  Gift,
  Heart,
  Home,
  KeyRound,
  LogOut,
  MapPin,
  PackageCheck,
  Plus,
  Save,
  ShieldCheck,
  Ticket,
  Trash2,
  User,
} from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/toast/ToastProvider";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import { useCatalog } from "@/lib/catalog-client";
import { notifyMemberAuthChanged } from "@/lib/auth/member-session-client";
import { orderTotal, STATUS_LABEL, STATUS_STYLE } from "@/lib/admin/orders";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Member, MemberAddress, Order } from "@/lib/admin/types";

type AccountData = {
  member: Member;
  addresses: MemberAddress[];
  orders: Order[];
};

type TabId =
  | "orders"
  | "addresses"
  | "favorites"
  | "coupons"
  | "profile"
  | "password";

type ProfileForm = {
  name: string;
  phone: string;
  email: string;
  birthDate: string;
};

type AddressForm = {
  id?: string;
  label: string;
  recipientName: string;
  phone: string;
  cityDistrict: string;
  address: string;
  note: string;
  isDefault: boolean;
};

const inputClass =
  "w-full rounded-2xl bg-cream-soft border border-rose-gold/25 px-4 h-12 text-sm text-coffee placeholder:text-coffee/40 focus:outline-none focus:border-bordo focus:bg-white transition-colors";
const textareaClass =
  "w-full rounded-2xl bg-cream-soft border border-rose-gold/25 px-4 py-3 min-h-24 text-sm text-coffee placeholder:text-coffee/40 focus:outline-none focus:border-bordo focus:bg-white transition-colors resize-none";
const labelClass =
  "block text-[0.65rem] uppercase tracking-wider2 text-rose-goldDark mb-1.5";

const tabs: { id: TabId; label: string; icon: typeof PackageCheck }[] = [
  { id: "orders", label: "Siparişlerim", icon: PackageCheck },
  { id: "addresses", label: "Adreslerim", icon: MapPin },
  { id: "favorites", label: "Favorilerim", icon: Heart },
  { id: "coupons", label: "Kuponlarım", icon: Ticket },
  { id: "profile", label: "Profil", icon: User },
  { id: "password", label: "Şifre", icon: KeyRound },
];

function emptyAddress(member?: Member | null): AddressForm {
  return {
    label: "Ev",
    recipientName: member?.name ?? "",
    phone: member?.phone ?? "",
    cityDistrict: "Gemlik / Bursa",
    address: "",
    note: "",
    isDefault: false,
  };
}

function formatDate(value?: string) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function AccountPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { ids: favoriteIds } = useWishlist();
  const { products } = useCatalog();

  const [data, setData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("orders");
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: "",
    phone: "",
    email: "",
    birthDate: "",
  });
  const [addressForm, setAddressForm] = useState<AddressForm>(emptyAddress());
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [busy, setBusy] = useState<string | null>(null);

  const favoriteProducts = useMemo(
    () => products.filter((product) => favoriteIds.includes(product.id)),
    [favoriteIds, products],
  );

  const loadAccount = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/member/account", { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.authed) {
        setData(null);
        return;
      }
      const next = {
        member: json.member as Member,
        addresses: (json.addresses ?? []) as MemberAddress[],
        orders: (json.orders ?? []) as Order[],
      };
      setData(next);
      setProfileForm({
        name: next.member.name,
        phone: next.member.phone,
        email: next.member.email,
        birthDate: next.member.birthDate ?? "",
      });
      setAddressForm((current) =>
        current.address ? current : emptyAddress(next.member),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/member/logout", { method: "POST" });
    } catch {
      /* yok say */
    }
    notifyMemberAuthChanged(false);
    router.push("/");
    router.refresh();
  };

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    setBusy("profile");
    try {
      const res = await fetch("/api/member/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        toast({
          title: "Profil kaydedilemedi",
          description: json?.error ?? "Bilgileri kontrol edin.",
          tone: "warning",
        });
        return;
      }
      setData((current) =>
        current ? { ...current, member: json.member as Member } : current,
      );
      toast({ title: "Profil güncellendi", tone: "success" });
    } finally {
      setBusy(null);
    }
  };

  const saveAddress = async (event: FormEvent) => {
    event.preventDefault();
    setBusy("address");
    try {
      const method = addressForm.id ? "PATCH" : "POST";
      const res = await fetch("/api/member/addresses", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        toast({
          title: "Adres kaydedilemedi",
          description: json?.error ?? "Bilgileri kontrol edin.",
          tone: "warning",
        });
        return;
      }
      setData((current) =>
        current
          ? { ...current, addresses: json.addresses as MemberAddress[] }
          : current,
      );
      setAddressForm(emptyAddress(data?.member));
      toast({ title: "Adres kaydedildi", tone: "success" });
    } finally {
      setBusy(null);
    }
  };

  const editAddress = (address: MemberAddress) => {
    setAddressForm({
      id: address.id,
      label: address.label,
      recipientName: address.recipientName,
      phone: address.phone,
      cityDistrict: address.cityDistrict,
      address: address.address,
      note: address.note ?? "",
      isDefault: address.isDefault,
    });
  };

  const removeAddress = async (id: string) => {
    setBusy(`address-${id}`);
    try {
      const res = await fetch("/api/member/addresses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json?.ok) {
        setData((current) =>
          current
            ? { ...current, addresses: json.addresses as MemberAddress[] }
            : current,
        );
        toast({ title: "Adres silindi", tone: "info" });
      }
    } finally {
      setBusy(null);
    }
  };

  const makeDefaultAddress = async (address: MemberAddress) => {
    setBusy(`default-${address.id}`);
    try {
      const res = await fetch("/api/member/addresses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...address, isDefault: true }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json?.ok) {
        setData((current) =>
          current
            ? { ...current, addresses: json.addresses as MemberAddress[] }
            : current,
        );
        toast({ title: "Varsayılan adres güncellendi", tone: "success" });
      }
    } finally {
      setBusy(null);
    }
  };

  const changePassword = async (event: FormEvent) => {
    event.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "Yeni şifreler eşleşmiyor", tone: "warning" });
      return;
    }
    setBusy("password");
    try {
      const res = await fetch("/api/member/password/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        toast({
          title: "Şifre değiştirilemedi",
          description: json?.error ?? "Mevcut şifreyi kontrol edin.",
          tone: "warning",
        });
        return;
      }
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast({ title: "Şifre güncellendi", tone: "success" });
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="h-9 w-9 rounded-full border-2 border-rose-gold/30 border-t-bordo animate-spin" />
      </div>
    );
  }

  if (!data) {
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

  const { member, addresses, orders } = data;

  return (
    <article className="pt-24 md:pt-28 pb-20 md:pb-28">
      <div className="container max-w-6xl">
        <Breadcrumb items={[{ label: "Hesabım" }]} className="mb-8" />

        <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
          <div className="flex items-center gap-4">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-bordo-gradient text-cream font-display text-3xl">
              {member.name.charAt(0)}
            </span>
            <div>
              <span className="eyebrow">Floria Garden hesabınız</span>
              <h1 className="font-display text-3xl md:text-4xl text-coffee leading-tight">
                {member.name}
              </h1>
              <p className="text-sm text-coffee/55">
                Siparişler, adresler, favoriler ve size özel kodlar tek yerde.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-rose-gold/30 text-coffee/70 hover:text-bordo hover:border-bordo px-4 h-10 text-sm transition-colors"
          >
            <LogOut size={15} strokeWidth={1.7} />
            Çıkış
          </button>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <SummaryCard icon={PackageCheck} label="Sipariş" value={orders.length} />
          <SummaryCard icon={MapPin} label="Adres" value={addresses.length} />
          <SummaryCard icon={Heart} label="Favori" value={favoriteProducts.length} />
          <SummaryCard icon={Ticket} label="Kupon" value={member.codes.length} />
        </div>

        <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-6 items-start">
          <nav className="rounded-3xl bg-white border border-rose-gold/20 shadow-soft p-2 lg:sticky lg:top-28">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-2xl px-4 h-12 text-sm transition-colors text-left",
                  activeTab === id
                    ? "bg-bordo text-cream"
                    : "text-coffee/70 hover:bg-cream-soft hover:text-bordo",
                )}
              >
                <Icon size={17} strokeWidth={1.7} />
                {label}
              </button>
            ))}
          </nav>

          <section className="min-w-0">
            {activeTab === "orders" && (
              <Panel
                icon={PackageCheck}
                title="Siparişlerim"
                description="E-posta veya telefonunuzla eşleşen siparişler burada görünür."
              >
                {orders.length === 0 ? (
                  <EmptyPanel
                    icon={BookOpen}
                    title="Henüz sipariş görünmüyor"
                    description="Sipariş modülü veya manuel sipariş kaydı kullanıldığında geçmişiniz burada listelenecek."
                    href="/urunler"
                    cta="Ürünleri keşfet"
                  />
                ) : (
                  <ul className="flex flex-col gap-3">
                    {orders.map((order) => (
                      <li
                        key={order.id}
                        className="rounded-2xl border border-rose-gold/20 bg-cream-soft/70 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-mono text-sm text-bordo">
                              {order.orderNo}
                            </p>
                            <p className="mt-1 text-sm text-coffee/60">
                              {formatDate(order.createdAt)} ·{" "}
                              {order.items.length} ürün
                            </p>
                          </div>
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
                              STATUS_STYLE[order.status],
                            )}
                          >
                            {STATUS_LABEL[order.status]}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-rose-gold/15 pt-3">
                          <p className="text-sm text-coffee/65 line-clamp-1">
                            {order.items.map((item) => item.name).join(", ")}
                          </p>
                          <span className="font-display text-xl text-coffee">
                            {formatPrice(orderTotal(order))}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            )}

            {activeTab === "addresses" && (
              <Panel
                icon={MapPin}
                title="Adreslerim"
                description="Sık kullandığınız teslimat adreslerini kaydedin."
              >
                <div className="grid xl:grid-cols-[1fr_360px] gap-5">
                  <div className="flex flex-col gap-3">
                    {addresses.length === 0 ? (
                      <EmptyPanel
                        icon={Home}
                        title="Henüz adres yok"
                        description="İlk adresinizi ekleyerek sipariş hazırlığını hızlandırabilirsiniz."
                      />
                    ) : (
                      addresses.map((address) => (
                        <div
                          key={address.id}
                          className="rounded-2xl border border-rose-gold/20 bg-cream-soft/70 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-display text-xl text-coffee">
                                  {address.label}
                                </h3>
                                {address.isDefault && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-gold/15 text-rose-goldDark px-2.5 py-1 text-[0.65rem] font-medium">
                                    <Check size={11} strokeWidth={2} />
                                    Varsayılan
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-sm text-coffee/70">
                                {address.recipientName} · {address.phone}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => editAddress(address)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-gold/25 text-coffee/65 hover:text-bordo hover:border-bordo transition-colors"
                                aria-label="Adresi düzenle"
                              >
                                <Edit3 size={14} strokeWidth={1.7} />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeAddress(address.id)}
                                disabled={busy === `address-${address.id}`}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-gold/25 text-coffee/65 hover:text-bordo hover:border-bordo transition-colors disabled:opacity-50"
                                aria-label="Adresi sil"
                              >
                                <Trash2 size={14} strokeWidth={1.7} />
                              </button>
                            </div>
                          </div>
                          <p className="mt-3 text-sm leading-relaxed text-coffee/60">
                            {address.cityDistrict && `${address.cityDistrict} · `}
                            {address.address}
                          </p>
                          {address.note && (
                            <p className="mt-2 text-xs text-coffee/45">
                              Not: {address.note}
                            </p>
                          )}
                          {!address.isDefault && (
                            <button
                              type="button"
                              onClick={() => makeDefaultAddress(address)}
                              disabled={busy === `default-${address.id}`}
                              className="mt-3 text-xs text-bordo hover:text-rose-goldDark transition-colors"
                            >
                              Varsayılan yap
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <form
                    onSubmit={saveAddress}
                    className="rounded-2xl border border-rose-gold/20 bg-white p-4 flex flex-col gap-3"
                  >
                    <h3 className="font-display text-xl text-coffee">
                      {addressForm.id ? "Adresi düzenle" : "Yeni adres"}
                    </h3>
                    <Field
                      label="Adres adı"
                      value={addressForm.label}
                      onChange={(value) =>
                        setAddressForm((current) => ({
                          ...current,
                          label: value,
                        }))
                      }
                    />
                    <Field
                      label="Alıcı adı"
                      value={addressForm.recipientName}
                      onChange={(value) =>
                        setAddressForm((current) => ({
                          ...current,
                          recipientName: value,
                        }))
                      }
                    />
                    <Field
                      label="Telefon"
                      value={addressForm.phone}
                      onChange={(value) =>
                        setAddressForm((current) => ({
                          ...current,
                          phone: value,
                        }))
                      }
                    />
                    <Field
                      label="İlçe / şehir"
                      value={addressForm.cityDistrict}
                      onChange={(value) =>
                        setAddressForm((current) => ({
                          ...current,
                          cityDistrict: value,
                        }))
                      }
                    />
                    <div>
                      <label className={labelClass}>Açık adres</label>
                      <textarea
                        value={addressForm.address}
                        onChange={(event) =>
                          setAddressForm((current) => ({
                            ...current,
                            address: event.target.value,
                          }))
                        }
                        className={textareaClass}
                      />
                    </div>
                    <Field
                      label="Not"
                      value={addressForm.note}
                      onChange={(value) =>
                        setAddressForm((current) => ({
                          ...current,
                          note: value,
                        }))
                      }
                      placeholder="Kapı kodu, teslimat notu"
                    />
                    <label className="flex items-center gap-2 text-sm text-coffee/65">
                      <input
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={(event) =>
                          setAddressForm((current) => ({
                            ...current,
                            isDefault: event.target.checked,
                          }))
                        }
                        className="h-4 w-4 accent-bordo"
                      />
                      Varsayılan adres yap
                    </label>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        variant="gold"
                        size="sm"
                        disabled={busy === "address"}
                      >
                        <Save size={15} strokeWidth={1.8} />
                        Kaydet
                      </Button>
                      {addressForm.id && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setAddressForm(emptyAddress(member))}
                        >
                          Vazgeç
                        </Button>
                      )}
                    </div>
                  </form>
                </div>
              </Panel>
            )}

            {activeTab === "favorites" && (
              <Panel
                icon={Heart}
                title="Favorilerim"
                description="Beğendiğiniz ürünlere hesabınızdan hızlıca dönün."
              >
                {favoriteProducts.length === 0 ? (
                  <EmptyPanel
                    icon={Heart}
                    title="Favori ürün yok"
                    description="Ürün kartlarındaki kalp ikonuyla beğendiklerinizi kaydedebilirsiniz."
                    href="/urunler"
                    cta="Ürünleri keşfet"
                  />
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {favoriteProducts.slice(0, 6).map((product) => (
                      <Link
                        key={product.id}
                        href={`/urun/${product.slug}`}
                        className="rounded-2xl border border-rose-gold/20 bg-cream-soft/70 p-4 hover:border-bordo transition-colors"
                      >
                        <p className="font-display text-xl text-coffee">
                          {product.name}
                        </p>
                        <p className="mt-1 text-sm text-coffee/55 line-clamp-1">
                          {product.shortDescription}
                        </p>
                        <p className="mt-3 font-display text-xl text-bordo">
                          {formatPrice(product.price)}
                        </p>
                      </Link>
                    ))}
                    <Link
                      href="/favoriler"
                      className="rounded-2xl border border-dashed border-rose-gold/35 bg-white p-4 flex items-center justify-center text-sm text-bordo hover:border-bordo transition-colors"
                    >
                      Tüm favorileri görüntüle
                    </Link>
                  </div>
                )}
              </Panel>
            )}

            {activeTab === "coupons" && (
              <Panel
                icon={Ticket}
                title="Kuponlarım"
                description="Size özel tanımlanan indirim kodları burada görünür."
              >
                {member.codes.length === 0 ? (
                  <EmptyPanel
                    icon={Gift}
                    title="Henüz size özel kod yok"
                    description="Kampanya ve doğum günü avantajları tanımlandığında burada listelenir."
                  />
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {member.codes.map((code) => (
                      <div
                        key={code.code}
                        className="rounded-2xl border border-rose-gold/25 bg-gradient-to-br from-white to-cream-soft p-5"
                      >
                        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider2 text-rose-goldDark">
                          <Ticket size={13} strokeWidth={1.8} />
                          Üye kuponu
                        </span>
                        <p className="mt-3 font-mono text-lg font-semibold tracking-wide text-bordo">
                          {code.code}
                        </p>
                        <p className="mt-2 font-display text-2xl text-coffee">
                          {code.discountType === "percent"
                            ? `%${code.discountValue} indirim`
                            : `${formatPrice(code.discountValue)} indirim`}
                        </p>
                        {code.note && (
                          <p className="mt-2 text-sm text-coffee/55">
                            {code.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            )}

            {activeTab === "profile" && (
              <Panel
                icon={User}
                title="Profil düzenleme"
                description="İletişim ve üyelik bilgilerinizi güncelleyin."
              >
                <form onSubmit={saveProfile} className="grid sm:grid-cols-2 gap-4">
                  <Field
                    label="Ad soyad"
                    value={profileForm.name}
                    onChange={(value) =>
                      setProfileForm((current) => ({ ...current, name: value }))
                    }
                  />
                  <Field
                    label="Telefon"
                    value={profileForm.phone}
                    onChange={(value) =>
                      setProfileForm((current) => ({ ...current, phone: value }))
                    }
                  />
                  <Field
                    label="E-posta"
                    type="email"
                    value={profileForm.email}
                    onChange={(value) =>
                      setProfileForm((current) => ({ ...current, email: value }))
                    }
                  />
                  <Field
                    label="Doğum tarihi"
                    type="date"
                    value={profileForm.birthDate}
                    onChange={(value) =>
                      setProfileForm((current) => ({
                        ...current,
                        birthDate: value,
                      }))
                    }
                  />
                  <div className="sm:col-span-2 flex justify-end">
                    <Button
                      type="submit"
                      variant="gold"
                      size="md"
                      disabled={busy === "profile"}
                    >
                      <Save size={16} strokeWidth={1.8} />
                      Profili kaydet
                    </Button>
                  </div>
                </form>
              </Panel>
            )}

            {activeTab === "password" && (
              <Panel
                icon={ShieldCheck}
                title="Şifre değiştir"
                description="Hesabınızın güvenliği için yeni şifrenizi belirleyin."
              >
                <form
                  onSubmit={changePassword}
                  className="max-w-xl flex flex-col gap-4"
                >
                  <Field
                    label="Mevcut şifre"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(value) =>
                      setPasswordForm((current) => ({
                        ...current,
                        currentPassword: value,
                      }))
                    }
                  />
                  <Field
                    label="Yeni şifre"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(value) =>
                      setPasswordForm((current) => ({
                        ...current,
                        newPassword: value,
                      }))
                    }
                  />
                  <Field
                    label="Yeni şifre tekrar"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(value) =>
                      setPasswordForm((current) => ({
                        ...current,
                        confirmPassword: value,
                      }))
                    }
                  />
                  <Button
                    type="submit"
                    variant="gold"
                    size="md"
                    disabled={busy === "password"}
                    className="self-start"
                  >
                    <KeyRound size={16} strokeWidth={1.8} />
                    Şifreyi güncelle
                  </Button>
                </form>
              </Panel>
            )}
          </section>
        </div>
      </div>
    </article>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof PackageCheck;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-white border border-rose-gold/20 shadow-soft p-4">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-gold-gradient text-coffee">
        <Icon size={15} strokeWidth={1.7} />
      </span>
      <p className="mt-3 font-display text-3xl text-coffee tabular-nums">
        {value}
      </p>
      <p className="text-xs uppercase tracking-wider2 text-coffee/45">
        {label}
      </p>
    </div>
  );
}

function Panel({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof PackageCheck;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white border border-rose-gold/20 shadow-soft p-5 md:p-6">
      <div className="flex items-start gap-3 mb-6">
        <span className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-rose-gold-gradient text-coffee">
          <Icon size={18} strokeWidth={1.7} />
        </span>
        <div>
          <h2 className="font-display text-2xl md:text-3xl text-coffee">
            {title}
          </h2>
          <p className="text-sm text-coffee/55 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

function EmptyPanel({
  icon: Icon,
  title,
  description,
  href,
  cta,
}: {
  icon: typeof BookOpen;
  title: string;
  description: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-rose-gold/30 bg-cream-soft/70 p-8 text-center flex flex-col items-center gap-3">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-bordo border border-rose-gold/20">
        <Icon size={20} strokeWidth={1.6} />
      </span>
      <div>
        <h3 className="font-display text-2xl text-coffee">{title}</h3>
        <p className="mt-1 text-sm text-coffee/55 max-w-md">{description}</p>
      </div>
      {href && cta && (
        <Link
          href={href}
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-bordo text-cream px-5 h-10 text-sm font-medium hover:bg-bordo-dark transition-colors"
        >
          <Plus size={14} strokeWidth={1.8} />
          {cta}
        </Link>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}
