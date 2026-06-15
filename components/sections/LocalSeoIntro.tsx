import { MapPin, Phone, Clock, MessageCircle, type LucideIcon } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/constants";

/**
 * Ana sayfa yerel SEO bölümü: "Gemlik çiçekçi" araması için doğal,
 * keyword-stuffing içermeyen tanıtım metni + tutarlı iletişim (NAP) bilgisi.
 * H2 başlığıyla Google'ın kolay tarayabileceği gerçek içerik sunar.
 */
export default function LocalSeoIntro() {
  return (
    <section
      className="py-16 md:py-24 bg-cream-soft"
      aria-labelledby="gemlik-cicekci-baslik"
    >
      <div className="container max-w-4xl">
        <span className="eyebrow">Gemlik&apos;te Çiçekçi</span>
        <h2
          id="gemlik-cicekci-baslik"
          className="heading-display mt-3 text-coffee"
        >
          Gemlik&apos;in butik çiçekçisi
          <span className="text-rose-gold">.</span>
        </h2>

        <div className="mt-6 flex flex-col gap-4 text-coffee/75 leading-relaxed">
          <p>
            Floria Garden, Gemlik&apos;te taze çiçek, el yapımı buket ve özel
            tasarım aranjmanlar sunan butik bir çiçekçidir. Doğum günü, yıl
            dönümü, kutlama ve açılış gibi özel günleriniz için hazırladığımız
            çiçekleri Gemlik içinde aynı gün, ısı kontrollü kuryeyle adresinize
            ulaştırıyoruz.
          </p>
          <p>
            Bursa ve şehir dışına anlaşmalı kargoyla takip numaralı gönderim
            yapıyoruz. Siparişinizi sitemizden oluşturabilir, ürün seçimi ve
            teslimat detayları için WhatsApp hattımızdan kolayca bize
            ulaşabilirsiniz.
          </p>
        </div>

        {/* İletişim & konum bilgileri (NAP — schema ile tutarlı) */}
        <div className="mt-9 grid gap-4 sm:grid-cols-3">
          <InfoCard icon={MapPin} title="Adres">
            {SITE.address}
          </InfoCard>
          <InfoCard icon={Phone} title="Telefon">
            <a
              href={`tel:+${SITE.phoneRaw}`}
              className="hover:text-bordo transition-colors"
            >
              {SITE.phoneDisplay}
            </a>
          </InfoCard>
          <InfoCard icon={Clock} title="Çalışma Saatleri">
            {SITE.hours}
          </InfoCard>
        </div>

        <div className="mt-8">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-bordo text-cream px-6 h-12 text-sm font-medium tracking-wide hover:bg-bordo-dark transition-colors"
          >
            <MessageCircle size={17} strokeWidth={1.7} />
            WhatsApp ile sipariş &amp; bilgi
          </a>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-rose-gold/20 bg-white p-5 shadow-soft">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-gold/10 text-bordo">
        <Icon size={16} strokeWidth={1.7} />
      </span>
      <p className="mt-3 text-[0.7rem] uppercase tracking-wider2 text-rose-goldDark">
        {title}
      </p>
      <p className="mt-1 text-sm text-coffee/80 leading-relaxed">{children}</p>
    </div>
  );
}
