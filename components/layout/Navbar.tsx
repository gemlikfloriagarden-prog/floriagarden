"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, UserPlus, LogIn } from "lucide-react";
import BrandMark from "./BrandMark";
import Button from "@/components/ui/Button";
import CartButton from "@/components/cart/CartButton";
import WishlistIconLink from "@/components/wishlist/WishlistIconLink";
import SearchButton from "@/components/search/SearchButton";
import { cn } from "@/lib/utils/cn";

/**
 * "Anasayfa" linki için yumuşak kaydırma:
 * - Zaten anasayfadaysak → Link navigasyonunu engelle, en üste smooth scroll
 * - Başka sayfadaysak → normal Next.js navigasyonu çalışsın
 * Hash linkleri (#bolum) zaten CSS scroll-behavior:smooth ile yumuşak kayıyor.
 */
function handleHomeClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  pathname: string,
) {
  if (pathname === "/") {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

const NAV_LINKS = [
  { href: "/", label: "Anasayfa" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/teslimat", label: "Teslimat" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 z-50",
        // Banner görünürse banner-h kadar aşağıdan başlar
        "top-[var(--banner-h,0px)] transition-[top] duration-500 ease-silk",
        "bg-bordo-dark/95 backdrop-blur-md",
        "border-b",
        scrolled
          ? "border-rose-gold/20 shadow-card"
          : "border-rose-gold/10",
      )}
    >
      {/* Üst rose-gold ince çizgi: lüks marka detayı */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-gold/60 to-transparent"
      />

      <div className="container flex items-center justify-between h-[72px] md:h-20">
        <BrandMark variant="light" withTagline />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={
                link.href === "/"
                  ? (e) => handleHomeClick(e, pathname)
                  : undefined
              }
              className="relative text-sm tracking-wide text-cream/80 hover:text-rose-goldLight transition-colors duration-300 group"
            >
              {link.label}
              <span
                aria-hidden
                className="absolute -bottom-1.5 left-0 right-0 mx-auto h-px w-0 bg-rose-gold transition-all duration-500 group-hover:w-full"
              />
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-2">
          <SearchButton />
          <WishlistIconLink />
          <CartButton />
          <Link href="/giris" className="ml-1">
            <Button variant="outline-light" size="sm" className="!h-10 !px-4">
              <span>Üye Girişi</span>
            </Button>
          </Link>
          <Link href="/uye-ol">
            <Button variant="gold" size="sm" className="!h-10 !px-5">
              <span>Üye Ol</span>
            </Button>
          </Link>
        </div>

        {/* Mobile cart + toggle area */}
        <div className="lg:hidden flex items-center gap-2">
          <SearchButton />
          <CartButton />

        {/* Mobile toggle */}
        <button
          type="button"
          className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 bg-cream/5 text-cream hover:bg-rose-gold hover:text-coffee hover:border-rose-gold transition-colors duration-300"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={open}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <X size={20} strokeWidth={1.6} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Menu size={20} strokeWidth={1.6} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 top-[72px] bg-bordo-dark/98 backdrop-blur-xl"
          >
            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="container py-10 flex flex-col gap-2"
            >
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={(e) => {
                      setOpen(false);
                      if (link.href === "/") handleHomeClick(e, pathname);
                    }}
                    className="block py-4 font-display text-3xl text-cream hover:text-rose-goldLight transition-colors border-b border-cream/10"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.45 }}
                className="mt-8 flex flex-col gap-3"
              >
                <Link href="/uye-ol" onClick={() => setOpen(false)}>
                  <Button variant="gold" size="lg" className="w-full">
                    <UserPlus size={18} strokeWidth={1.7} />
                    <span>Üye Ol</span>
                  </Button>
                </Link>
                <Link href="/giris" onClick={() => setOpen(false)}>
                  <Button variant="outline-light" size="lg" className="w-full">
                    <LogIn size={18} strokeWidth={1.7} />
                    <span>Üye Girişi</span>
                  </Button>
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
