import type { Metadata } from "next";
import { Leaf, Sparkles, Heart, ShieldCheck, Coffee, Flower2 } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import FadeIn from "@/components/motion/FadeIn";
import FloralPlaceholder from "@/components/ui/FloralPlaceholder";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Floria Garden — Gemlik'in butik çiçekçisi. Çiçek ve kahvenin buluştuğu, modern ve premium bir marka deneyimi.",
};

const VALUES = [
  { icon: Leaf, title: "Taze Çiçekler", text: "Her gün özenle seçilen, mevsiminin en canlı çiçekleri." },
  { icon: Sparkles, title: "Lüks Ambalaj", text: "Kadife, ipek ve doğal dokuların kullanıldığı butik ambalaj." },
  { icon: Heart, title: "Kişisel Dokunuş", text: "Sizin hikâyenize özel, el yapımı düzenlemeler." },
  { icon: ShieldCheck, title: "Özenli Teslimat", text: "Çiçeğin tazeliğini koruyan, ısı kontrollü teslimat." },
];

export default function AboutPage() {
  return (
    <article className="pt-28 md:pt-32 pb-20 md:pb-28">
      <div className="container">
        <Breadcrumb items={[{ label: "Hakkımızda" }]} className="mb-10" />

        {/* Hero */}
        <header className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-20">
          <div className="lg:col-span-7 flex flex-col gap-5">
            <FadeIn><span className="eyebrow">Hakkımızda</span></FadeIn>
            <FadeIn delay={0.05}>
              <h1 className="heading-display text-balance">
                Çiçek, sadece bir hediye değil;{" "}
                <span className="italic text-bordo">bir histir</span>
                <span className="text-rose-gold">.</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-coffee/75 leading-relaxed text-balance max-w-prose">
                Floria Garden, Gemlik&apos;te butik çiçekçiliği yeniden tanımlamak
                için yola çıktı. Atölyemizde her buket, mevsiminin en taze
                çiçekleriyle, sevdiklerinize hissettirmek istediğiniz duyguyu
                merkeze alarak hazırlanır.
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="text-coffee/75 leading-relaxed text-balance max-w-prose">
                Çiçeği ve kahveyi tek bir özenli deneyimde buluşturarak, klasik
                çiçekçinin sınırlarını aşan modern bir marka yaratıyoruz. Her
                ürünümüz; zarafet, kalite ve sıcaklığın bir araya gelmesidir.
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={0.2} className="lg:col-span-5">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-card border border-rose-gold/20">
              <FloralPlaceholder gradient="from-bordo-500 via-bordo-700 to-coffee" label="Atölye" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="font-display text-6xl text-cream">FG</span>
                  <div className="mt-3 mx-auto h-px w-16 bg-rose-gold" />
                  <span className="mt-2 block text-[0.65rem] uppercase tracking-ultra-wide text-rose-gold/80">
                    Atölyemiz
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>
        </header>

        {/* Değerler */}
        <section className="mb-20">
          <FadeIn className="mb-10">
            <span className="eyebrow">Değerlerimiz</span>
            <h2 className="heading-section mt-3">Her detay önemlidir</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.06} y={20}>
                <div className="h-full rounded-3xl bg-gradient-to-br from-bordo-500 via-bordo-700 to-bordo-dark border border-rose-gold/25 shadow-card p-6">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-gold-gradient text-coffee">
                    <v.icon size={20} strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-4 font-display text-xl text-cream">{v.title}</h3>
                  <p className="mt-2 text-sm text-cream/70 leading-relaxed">{v.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Yolculuk */}
        <section className="mb-20">
          <FadeIn className="mb-10">
            <span className="eyebrow">Yolculuğumuz</span>
            <h2 className="heading-section mt-3">Floria Garden hikâyesi</h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { year: "Atölye", title: "Floria Garden atölyesi", text: "Gemlik'te butik bir çiçek atölyesi olarak yola çıktık." },
              { year: "Konsept", title: "Flowers and Coffee", text: "Çiçeği ve kahveyi tek bir özenli deneyimde buluşturduk." },
              { year: "Bugün", title: "Butik dokunuş", text: "Aynı gün teslimat ve premium ambalaj ile her ana zarafet katıyoruz." },
            ].map((m, i) => (
              <FadeIn key={m.title} delay={i * 0.08} y={20}>
                <div className="h-full rounded-3xl bg-gradient-to-br from-bordo-500 via-bordo-700 to-bordo-dark border border-rose-gold/25 shadow-card p-7">
                  <span className="font-display text-3xl text-rose-goldLight">
                    {m.year}
                  </span>
                  <h3 className="mt-3 font-display text-xl text-cream">{m.title}</h3>
                  <p className="mt-2 text-sm text-cream/70 leading-relaxed">{m.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Konsept */}
        <FadeIn>
          <div className="rounded-[2rem] glass-dark p-10 md:p-14 grid md:grid-cols-2 gap-10 items-center">
            <div className="flex flex-col gap-5">
              <span className="eyebrow">İmza Konseptimiz</span>
              <h2 className="heading-section">
                Flowers and{" "}
                <span className="italic text-bordo">Coffee</span>
              </h2>
              <p className="text-coffee/75 leading-relaxed">
                Floria Garden, bir çiçekçiden fazlasıdır. Özenle seçilmiş kahveler
                ile butik çiçek tasarımlarını aynı anda yaşayabileceğiniz, modern
                ve davetkâr bir deneyim sunar.
              </p>
            </div>
            <div className="flex items-center justify-center gap-8">
              <span className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-rose-gold-gradient text-coffee shadow-glow">
                <Flower2 size={40} strokeWidth={1.3} />
              </span>
              <span className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-rose-gold-gradient text-coffee shadow-glow">
                <Coffee size={40} strokeWidth={1.3} />
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </article>
  );
}
