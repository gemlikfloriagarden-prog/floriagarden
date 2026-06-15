import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import TrustStrip from "@/components/sections/TrustStrip";
import FeaturedCategories from "@/components/sections/FeaturedCategories";
import ProductShowcase from "@/components/sections/ProductShowcase";
import LocalSeoIntro from "@/components/sections/LocalSeoIntro";
import LocalBusinessJsonLd from "@/components/seo/LocalBusinessJsonLd";

// Ana sayfa verisi kısa süreli cache'lenir; yönetimden yapılan ürün/kategori
// değişiklikleri birkaç dakika içinde yayına yansırken ilk açılış hızlanır.
export const revalidate = 300;

export const metadata: Metadata = {
  title: {
    absolute: "Gemlik Çiçekçi — Floria Garden | Aynı Gün Çiçek Teslimatı",
  },
  description:
    "Gemlik çiçekçi Floria Garden; taze buketler, kutuda çiçekler ve özel tasarım aranjmanlar. Gemlik içi aynı gün teslimat, Bursa ve şehir dışına kargo.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Gemlik Çiçekçi — Floria Garden",
    description:
      "Gemlik'in butik çiçekçisi. Premium buketler ve aranjmanlar, Gemlik içi aynı gün özenli teslimat.",
    url: "/",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <FeaturedCategories />
      <ProductShowcase />
      <LocalSeoIntro />
      <LocalBusinessJsonLd />
    </>
  );
}
