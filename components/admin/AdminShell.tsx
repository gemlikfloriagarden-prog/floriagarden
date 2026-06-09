"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardList,
  Tags,
  Flower2,
  Users,
  Truck,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Wrench,
} from "lucide-react";
import { useMaintenance } from "@/components/maintenance/useMaintenance";
import { useAdminData } from "./AdminDataProvider";
import { cn } from "@/lib/utils/cn";

const NAV = [
  { href: "/yonetim", label: "Özet", icon: LayoutDashboard, exact: true },
  { href: "/yonetim/siparisler", label: "Siparişler", icon: ClipboardList },
  { href: "/yonetim/kategoriler", label: "Kategoriler", icon: Tags },
  { href: "/yonetim/urunler", label: "Ürünler", icon: Flower2 },
  { href: "/yonetim/uyeler", label: "Üyeler", icon: Users },
  { href: "/yonetim/teslimat", label: "Teslimat", icon: Truck },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname.startsWith(href);
}

async function logout() {
  try {
    await fetch("/api/admin/logout", { method: "POST" });
  } catch {
    /* ignore */
  }
  window.location.href = "/yonetim";
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() ?? "";
  return (
    <nav className="flex flex-col gap-1 md:gap-1.5">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = isActive(pathname, href, exact);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-2xl px-3 md:px-4 h-11 md:h-12 text-sm font-medium transition-all duration-200",
              active
                ? "bg-cream text-bordo shadow-soft"
                : "text-cream/75 hover:text-cream hover:bg-cream/10",
            )}
          >
            <Icon
              size={18}
              strokeWidth={1.7}
              className={active ? "text-bordo" : "text-rose-gold"}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex flex-col leading-tight">
      <span className="font-display text-[1.55rem] md:text-2xl text-cream">
        Floria Garden
      </span>
      <span className="text-[0.55rem] md:text-[0.6rem] uppercase tracking-[0.35em] md:tracking-ultra-wide text-rose-gold/80">
        Yönetim Paneli
      </span>
    </div>
  );
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const maintenance = useMaintenance();
  const { hydrated } = useAdminData();

  return (
    <div className="min-h-screen bg-section-coffee">
      {/* Masaüstü sidebar */}
      <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-64 md:flex-col bg-gradient-to-b from-bordo via-bordo-dark to-wine border-r border-rose-gold/15 p-5">
        <div className="px-2 pt-2 pb-6">
          <Brand />
        </div>
        <NavLinks />
        <div className="mt-auto flex flex-col gap-1.5 pt-5 border-t border-cream/15">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-2xl px-4 h-11 text-sm text-cream/70 hover:text-cream hover:bg-cream/10 transition-colors"
          >
            <ExternalLink size={17} strokeWidth={1.7} className="text-rose-gold" />
            Siteyi Görüntüle
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-3 rounded-2xl px-4 h-11 text-sm text-cream/70 hover:text-cream hover:bg-cream/10 transition-colors"
          >
            <LogOut size={17} strokeWidth={1.7} className="text-rose-gold" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Mobil üst bar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-gradient-to-r from-bordo to-bordo-dark px-4 h-14 border-b border-rose-gold/15 shadow-card">
        <Brand />
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Menüyü aç"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream"
        >
          <Menu size={18} strokeWidth={1.8} />
        </button>
      </header>

      {/* Mobil menü */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 z-50 bg-coffee-deep/55"
              aria-hidden
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-[82%] max-w-[18rem] flex flex-col bg-gradient-to-b from-bordo via-bordo-dark to-wine p-4"
            >
              <div className="flex items-center justify-between px-1 pt-1 pb-5">
                <Brand />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Menüyü kapat"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-cream/20 text-cream"
                >
                  <X size={17} strokeWidth={1.8} />
                </button>
              </div>
              <NavLinks onNavigate={() => setMobileOpen(false)} />
              <div className="mt-auto flex flex-col gap-1.5 pt-5 border-t border-cream/15">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-3 rounded-2xl px-4 h-11 text-sm text-cream/70 hover:text-cream hover:bg-cream/10 transition-colors"
                >
                  <ExternalLink size={17} strokeWidth={1.7} className="text-rose-gold" />
                  Siteyi Görüntüle
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-3 rounded-2xl px-4 h-11 text-sm text-cream/70 hover:text-cream hover:bg-cream/10 transition-colors"
                >
                  <LogOut size={17} strokeWidth={1.7} className="text-rose-gold" />
                  Çıkış Yap
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* İçerik */}
      <main className="md:pl-64">
        {maintenance && (
          <div className="bg-bordo text-cream text-center text-xs sm:text-sm px-4 py-2 flex items-center justify-center gap-2">
            <Wrench size={14} strokeWidth={1.8} className="text-rose-gold" />
            Bakım modu açık — ziyaretçiler bakım sayfasını görüyor.
          </div>
        )}
        <div className="px-4 sm:px-8 py-6 md:py-12 max-w-5xl mx-auto">
          {hydrated ? (
            children
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-32 text-coffee/50">
              <span className="h-9 w-9 rounded-full border-2 border-rose-gold/30 border-t-bordo animate-spin" />
              <span className="text-sm">Veriler yükleniyor…</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
