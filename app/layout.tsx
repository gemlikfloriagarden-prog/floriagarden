import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Footer from "@/components/layout/Footer";
import { PublicHeader, PublicFooter } from "@/components/layout/PublicChrome";
import { CartProvider } from "@/components/cart/CartProvider";
import { ToastProvider } from "@/components/toast/ToastProvider";
import { WishlistProvider } from "@/components/wishlist/WishlistProvider";
import { SearchProvider } from "@/components/search/SearchProvider";
import { Analytics } from "@vercel/analytics/react";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import "./globals.css";

// Performans: yalnızca kullandığımız ağırlıkları yükle (4 → 2)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600"],
  display: "swap",
});

// Inter: daha az ağırlık (400 + 500 + 600)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://floriagarden.com"),
  title: {
    default: "Floria Garden — Yeni Nesil Çiçekçi · Gemlik",
    template: "%s · Floria Garden",
  },
  description:
    "Floria Garden, Gemlik'in butik çiçekçisi. Premium buketler, kutuda çiçekler, hediyelik ürünler ve özenli aynı gün teslimat. Flowers and Coffee.",
  keywords: [
    "Floria Garden",
    "Gemlik çiçekçi",
    "butik çiçekçi",
    "premium çiçek",
    "online çiçek siparişi",
    "aynı gün teslimat",
  ],
  openGraph: {
    title: "Floria Garden — Yeni Nesil Çiçekçi",
    description:
      "Premium çiçek ve hediyelik koleksiyonu. Gemlik içi aynı gün özenli teslimat.",
    type: "website",
    locale: "tr_TR",
    siteName: "Floria Garden",
  },
  twitter: {
    card: "summary_large_image",
    title: "Floria Garden — Yeni Nesil Çiçekçi",
    description:
      "Premium çiçek ve hediyelik koleksiyonu. Gemlik içi aynı gün özenli teslimat.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#5F1228",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <ToastProvider>
          <WishlistProvider>
            <CartProvider>
              <SearchProvider>
              <PublicHeader />
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-full focus:bg-rose-gold focus:text-coffee focus:shadow-glow"
              >
                İçeriğe atla
              </a>
              <main id="main-content" className="flex-1">{children}</main>
              <PublicFooter>
                <Footer />
              </PublicFooter>
              </SearchProvider>
            </CartProvider>
          </WishlistProvider>
        </ToastProvider>
        <OrganizationJsonLd />
        <Analytics />
      </body>
    </html>
  );
}
