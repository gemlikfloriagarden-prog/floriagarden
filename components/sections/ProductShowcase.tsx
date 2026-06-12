import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductShowcaseCard from "@/components/ui/ProductShowcaseCard";
import FadeIn from "@/components/motion/FadeIn";
import { getPublicProducts } from "@/lib/db/queries";
import type { Product } from "@/lib/data/products";

export default async function ProductShowcase() {
  let products: Product[] = [];

  try {
    products = (await getPublicProducts())
      .filter((product) => product.stock !== "tukendi")
      .slice(0, 4);
  } catch {
    products = [];
  }

  return (
    <section
      id="urunler"
      className="relative py-20 md:py-28 lg:py-32 scroll-mt-24 bg-section-wine overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-gold/35 to-transparent"
      />

      <div className="container relative flex flex-col gap-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <SectionHeading
            align="left"
            eyebrow="Öne Çıkan Ürünler"
            title="Sevilerek seçilen tasarımlar"
            description="Floria Garden çiçek şefinin günün en taze çiçekleriyle hazırladığı imza ürünler."
            className="md:max-w-2xl"
          />
          <FadeIn delay={0.1}>
            <Link
              href="/urunler"
              className="group inline-flex items-center gap-2 text-sm tracking-wide text-rose-goldLight hover:text-cream transition-colors"
            >
              <span>Tümünü görüntüle</span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-gold/30 group-hover:border-rose-gold group-hover:bg-rose-gold group-hover:text-coffee transition-all duration-300">
                <ArrowRight size={14} strokeWidth={1.7} />
              </span>
            </Link>
          </FadeIn>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, i) => (
              <FadeIn key={product.id} delay={(i % 4) * 0.06} y={28}>
                <ProductShowcaseCard product={product} index={i + 1} />
              </FadeIn>
            ))}
          </div>
        ) : (
          <FadeIn y={24}>
            <div className="rounded-3xl border border-rose-gold/20 bg-white/95 p-8 md:p-10 text-coffee shadow-card">
              <h3 className="font-display text-2xl md:text-3xl">
                Ürün vitrini hazırlanıyor
              </h3>
              <p className="mt-2 max-w-2xl text-sm md:text-base leading-relaxed text-coffee/65">
                Yeni koleksiyon çok yakında yayında olacak. Acil sipariş ve
                özel tasarım talepleriniz için bizimle iletişime geçebilirsiniz.
              </p>
              <Link
                href="/iletisim"
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-bordo hover:text-rose-goldDark transition-colors"
              >
                <span>İletişime geç</span>
                <ArrowRight size={14} strokeWidth={1.7} />
              </Link>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
