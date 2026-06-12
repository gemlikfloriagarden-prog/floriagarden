"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";
import Navbar from "./Navbar";
import { useMaintenance } from "@/components/maintenance/useMaintenance";

// Performans: ilk paint'i etkilemeyen bileşenler lazy + ssr kapalı.
const SeasonalBanner = dynamic(
  () => import("@/components/sections/SeasonalBanner"),
  { ssr: false },
);
const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer"), {
  ssr: false,
});
const FloatingWhatsApp = dynamic(
  () => import("@/components/layout/FloatingWhatsApp"),
  { ssr: false },
);
const MobileBottomBar = dynamic(
  () => import("@/components/layout/MobileBottomBar"),
  { ssr: false },
);
const CookieBanner = dynamic(() => import("@/components/layout/CookieBanner"), {
  ssr: false,
});

/** /yonetim altında public site arayüzü gizlenir (panelin kendi kabuğu var). */
function isAdmin(pathname: string | null) {
  return pathname?.startsWith("/yonetim") ?? false;
}

function DeferredPublicWidgets({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setReady(true), {
        timeout: 1600,
      });
      return () => window.cancelIdleCallback(id);
    }

    const id = globalThis.setTimeout(() => setReady(true), 1200);
    return () => globalThis.clearTimeout(id);
  }, []);

  return ready ? <>{children}</> : null;
}

export function PublicHeader() {
  const pathname = usePathname();
  const maintenance = useMaintenance();
  // Admin veya bakım modunda public başlık gizlenir.
  if (isAdmin(pathname) || maintenance) return null;
  return (
    <>
      <SeasonalBanner />
      <Navbar />
    </>
  );
}

export function PublicFooter({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const maintenance = useMaintenance();
  if (isAdmin(pathname) || maintenance) return null;
  return (
    <>
      {children}
      <DeferredPublicWidgets>
        <CartDrawer />
        <FloatingWhatsApp />
        <MobileBottomBar />
        <CookieBanner />
      </DeferredPublicWidgets>
    </>
  );
}
