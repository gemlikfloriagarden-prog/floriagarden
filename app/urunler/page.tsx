import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductsBrowser from "@/components/product/ProductsBrowser";

export const metadata: Metadata = {
  title: "Tüm Ürünler",
  description:
    "Floria Garden'ın premium çiçek koleksiyonu — buketler, kutuda çiçekler, saksı çiçekleri, özel gün düzenlemeleri ve daha fazlası.",
};

export default function AllProductsPage() {
  return (
    <article className="pt-28 md:pt-32 pb-20 md:pb-28">
      <div className="container">
        <Breadcrumb items={[{ label: "Tüm Ürünler" }]} className="mb-8" />

        <header className="flex flex-col items-start gap-4 mb-12 max-w-3xl">
          <span className="eyebrow">Koleksiyon</span>
          <h1 className="heading-display">
            Tüm Çiçekler
            <span className="text-rose-gold">.</span>
          </h1>
          <p className="text-coffee/70 leading-relaxed">
            Floria Garden atölyesinden çıkan tüm imza tasarımlar. Bir ürünü
            seçmek için kategoriden başlayabilir veya doğrudan keşfedebilirsiniz.
          </p>
        </header>

        {/* Ürünler client tarafında (önbellekli) yüklenir, kategoriler anında filtreler */}
        <ProductsBrowser />
      </div>
    </article>
  );
}
