import Hero from "@/components/sections/Hero";
import TrustStrip from "@/components/sections/TrustStrip";
import FeaturedCategories from "@/components/sections/FeaturedCategories";
import ProductShowcase from "@/components/sections/ProductShowcase";
import LocalBusinessJsonLd from "@/components/seo/LocalBusinessJsonLd";

// Ana sayfa verisi kısa süreli cache'lenir; yönetimden yapılan ürün/kategori
// değişiklikleri birkaç dakika içinde yayına yansırken ilk açılış hızlanır.
export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <FeaturedCategories />
      <ProductShowcase />
      <LocalBusinessJsonLd />
    </>
  );
}
