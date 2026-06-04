"use client";

import Link from "next/link";
import { Tags, Flower2, Users, ArrowRight, RotateCcw, Info } from "lucide-react";
import { useAdminData } from "@/components/admin/AdminDataProvider";
import { AdminCard, ConfirmDialog } from "@/components/admin/AdminUI";
import { useState } from "react";

export default function AdminDashboard() {
  const { data, reset } = useAdminData();
  const [confirmReset, setConfirmReset] = useState(false);

  const stats = [
    {
      label: "Kategori",
      value: data.categories.length,
      icon: Tags,
      href: "/yonetim/kategoriler",
    },
    {
      label: "Ürün",
      value: data.products.length,
      icon: Flower2,
      href: "/yonetim/urunler",
    },
    {
      label: "Üye",
      value: data.members.length,
      icon: Users,
      href: "/yonetim/uyeler",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl text-coffee">
          Hoş geldiniz 🌿
        </h1>
        <p className="mt-1.5 text-sm text-coffee/60">
          Floria Garden yönetim panelinden kategorileri, ürünleri ve üyeleri
          yönetebilirsiniz.
        </p>
      </div>

      {/* İstatistik kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <AdminCard className="p-6 h-full hover:border-rose-gold/45 hover:shadow-card transition-all duration-300 group">
              <div className="flex items-start justify-between">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-gold-gradient text-coffee">
                  <Icon size={22} strokeWidth={1.6} />
                </span>
                <ArrowRight
                  size={18}
                  strokeWidth={1.7}
                  className="text-coffee/30 group-hover:text-bordo group-hover:translate-x-1 transition-all duration-300"
                />
              </div>
              <p className="mt-5 font-display text-4xl text-coffee tabular-nums">
                {value}
              </p>
              <p className="text-sm text-coffee/55 mt-0.5">{label}</p>
            </AdminCard>
          </Link>
        ))}
      </div>

      {/* Demo bilgi notu */}
      <AdminCard className="p-6 bg-cream-soft/60">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-bordo/10 text-bordo">
            <Info size={17} strokeWidth={1.8} />
          </span>
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="font-display text-xl text-coffee">Demo modu</h2>
              <p className="mt-1 text-sm text-coffee/65 leading-relaxed max-w-2xl">
                Şu an veritabanı bağlı değil. Yaptığınız değişiklikler yalnızca
                bu tarayıcıda saklanır ve canlı siteyi henüz etkilemez.
                Veritabanına geçtiğimizde tüm demo veriler temizlenip gerçek
                kayıtlara bağlanacak.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex w-fit items-center gap-2 text-xs text-coffee/55 hover:text-bordo transition-colors"
            >
              <RotateCcw size={14} strokeWidth={1.7} />
              Demo verilerini başlangıca sıfırla
            </button>
          </div>
        </div>
      </AdminCard>

      <ConfirmDialog
        open={confirmReset}
        title="Demo verilerini sıfırla"
        message="Tüm kategori, ürün ve üye değişiklikleriniz silinip başlangıç demo verilerine dönülecek. Devam edilsin mi?"
        confirmLabel="Sıfırla"
        onConfirm={reset}
        onClose={() => setConfirmReset(false)}
      />
    </div>
  );
}
