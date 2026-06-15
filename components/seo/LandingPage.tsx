import Link from "next/link";
import { MessageCircle, ArrowRight, ChevronRight } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Button from "@/components/ui/Button";
import LocalBusinessJsonLd from "./LocalBusinessJsonLd";
import { whatsappLink } from "@/lib/constants";
import type { LandingPageData } from "@/lib/seo/landingPages";

/**
 * Yerel SEO landing page'leri için ortak şablon.
 * Mevcut tasarım sistemini (container, eyebrow, heading-display, glass-dark)
 * birebir kullanır; header/footer layout'tan otomatik gelir.
 */
export default function LandingPage({ data }: { data: LandingPageData }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <article className="pt-28 md:pt-32 pb-20 md:pb-28">
      <div className="container max-w-4xl">
        <Breadcrumb items={[{ label: data.eyebrow }]} className="mb-10" />

        <header className="flex flex-col items-start gap-4 mb-12">
          <span className="eyebrow">{data.eyebrow}</span>
          <h1 className="heading-display">
            {data.h1}
            <span className="text-rose-gold">.</span>
          </h1>
          <p className="text-coffee/75 leading-relaxed text-balance max-w-2xl">
            {data.intro}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <Button variant="gold" size="lg">
                <MessageCircle size={18} strokeWidth={1.7} />
                WhatsApp ile Sipariş
              </Button>
            </a>
            <Link href="/urunler">
              <Button variant="outline" size="lg">
                Ürünleri Keşfet
                <ArrowRight size={16} strokeWidth={1.7} />
              </Button>
            </Link>
          </div>
        </header>

        {/* İçerik */}
        <div className="flex flex-col gap-10">
          {data.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-2xl md:text-3xl text-coffee mb-3">
                {s.heading}
              </h2>
              <div className="flex flex-col gap-3 text-coffee/75 leading-relaxed text-[0.95rem]">
                {s.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* SSS */}
        <section className="mt-14">
          <h2 className="font-display text-2xl md:text-3xl text-coffee mb-5">
            Sıkça Sorulan Sorular
          </h2>
          <div className="flex flex-col gap-3">
            {data.faqs.map((f) => (
              <div
                key={f.q}
                className="rounded-2xl border border-rose-gold/20 bg-white p-5 shadow-soft"
              >
                <h3 className="font-display text-lg text-coffee">{f.q}</h3>
                <p className="mt-2 text-sm text-coffee/70 leading-relaxed">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* İlgili sayfalar (iç linkleme) */}
        <nav aria-label="İlgili sayfalar" className="mt-14">
          <h2 className="text-[0.7rem] uppercase tracking-wider2 text-rose-goldDark mb-3">
            İlgili Sayfalar
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.related.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex items-center gap-1 rounded-full border border-rose-gold/25 bg-white px-4 h-10 text-sm text-coffee/80 hover:border-rose-gold hover:text-coffee transition-colors"
              >
                {l.label}
                <ChevronRight size={14} strokeWidth={1.7} className="text-rose-gold" />
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Yapılandırılmış veri */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <LocalBusinessJsonLd />
    </article>
  );
}
