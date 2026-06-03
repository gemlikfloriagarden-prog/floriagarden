import Link from "next/link";
import { Instagram, MapPin, Phone, Mail, Clock } from "lucide-react";
import BrandMark from "./BrandMark";
import NewsletterSection from "@/components/forms/NewsletterSection";
import { SITE, whatsappLink } from "@/lib/constants";

const FOOTER_LINKS = [
  {
    title: "Koleksiyon",
    items: [
      { href: "/urunler", label: "Tüm Ürünler" },
      { href: "/koleksiyon/buketler", label: "Buketler" },
      { href: "/koleksiyon/kutuda-cicekler", label: "Kutuda Çiçekler" },
      { href: "/koleksiyon/saksi-cicekleri", label: "Saksı Çiçekleri" },
      { href: "/koleksiyon/kahve-ve-cicek-setleri", label: "Kahve & Çiçek Setleri" },
    ],
  },
  {
    title: "Kurumsal",
    items: [
      { href: "/hakkimizda", label: "Hakkımızda" },
      { href: "/iletisim", label: "İletişim" },
      { href: "/teslimat", label: "Teslimat Bilgileri" },
      { href: "/sss", label: "Sıkça Sorulan Sorular" },
    ],
  },
  {
    title: "Yasal",
    items: [
      { href: "/kvkk", label: "KVKK Aydınlatma" },
      { href: "/gizlilik", label: "Gizlilik Politikası" },
      { href: "/cerez-politikasi", label: "Çerez Politikası" },
      { href: "/mesafeli-satis", label: "Mesafeli Satış" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-20 bg-coffee-deep text-cream/80 pb-20 lg:pb-0">
      {/* Üst rose-gold şerit */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-gold/60 to-transparent" />

      {/* Newsletter şeridi — yalnızca üye olmayanlara gösterilir */}
      <NewsletterSection />

      <div className="container py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Marka */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <BrandMark variant="light" withTagline />
            <p className="max-w-sm text-sm leading-relaxed text-cream/65">
              Floria Garden, {SITE.city}&apos;in yeni nesil butik çiçekçisi.
              Premium çiçekler, özenli ambalaj ve aynı gün teslimat ile her ana
              zarafet katıyoruz.
            </p>

            <div className="flex items-center gap-3 mt-2">
              <a
                href={SITE.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/80 hover:border-rose-gold hover:text-rose-gold transition-all duration-300"
              >
                <Instagram size={16} strokeWidth={1.6} />
              </a>
              <a
                href="https://www.pinterest.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/80 hover:border-rose-gold hover:text-rose-gold transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
                  <path d="M12 0C5.4 0 0 5.4 0 12c0 5.1 3.1 9.4 7.6 11.2-.1-1-.2-2.4 0-3.5l1.5-6.3s-.4-.8-.4-1.9c0-1.8 1-3.1 2.3-3.1 1.1 0 1.6.8 1.6 1.8 0 1.1-.7 2.7-1 4.2-.3 1.3.6 2.3 1.9 2.3 2.3 0 4-2.4 4-5.9 0-3.1-2.2-5.2-5.4-5.2-3.7 0-5.8 2.7-5.8 5.6 0 1.1.4 2.3.9 2.9.1.1.1.2.1.3l-.4 1.4c-.1.2-.2.3-.5.2-1.7-.8-2.7-3.2-2.7-5.2 0-4.2 3.1-8.1 8.8-8.1 4.6 0 8.2 3.3 8.2 7.7 0 4.6-2.9 8.3-6.9 8.3-1.4 0-2.6-.7-3.1-1.6l-.8 3.2c-.3 1.2-1.1 2.6-1.7 3.5C9.7 23.8 10.8 24 12 24c6.6 0 12-5.4 12-12S18.6 0 12 0Z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/80 hover:border-rose-gold hover:text-rose-gold transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
                  <path d="M19.6 6.7c-1.5-.2-2.7-.9-3.6-2-.4-.5-.6-1.1-.7-1.7v-.3h-3.2v12.1c0 1.2-.8 2.2-1.9 2.5-1.5.4-2.9-.6-3.2-1.9-.2-1.3.7-2.6 2-2.9.4-.1.7-.1 1 0V9.3c-.5-.1-1-.1-1.5 0-2.8.3-5.1 2.7-5.2 5.5-.1 3 2.3 5.5 5.4 5.5 2.9 0 5.2-2.4 5.2-5.3V9.5c1.4 1 3.1 1.5 4.9 1.4V7.6c-.4.1-.8 0-1.2-.9Z" />
                </svg>
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/80 hover:border-rose-gold hover:text-rose-gold transition-all duration-300"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.947c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.582 0 11.940-5.359 11.943-11.948 0-3.193-1.243-6.19-3.503-8.45" />
                </svg>
              </a>
            </div>
          </div>

          {/* Linkler */}
          <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {FOOTER_LINKS.map((group) => (
              <div key={group.title} className="flex flex-col gap-4">
                <h4 className="text-xs uppercase tracking-wider2 text-rose-gold">
                  {group.title}
                </h4>
                <ul className="flex flex-col gap-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-cream/70 hover:text-cream transition-colors duration-300"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* İletişim */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="text-xs uppercase tracking-wider2 text-rose-gold">
              İletişim
            </h4>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex items-start gap-3 text-cream/75">
                <MapPin size={16} strokeWidth={1.6} className="mt-0.5 flex-shrink-0 text-rose-gold" />
                <span className="leading-relaxed">{SITE.address}</span>
              </li>
              <li className="flex items-start gap-3 text-cream/75">
                <Phone size={16} strokeWidth={1.6} className="mt-0.5 flex-shrink-0 text-rose-gold" />
                <a href={`tel:${SITE.phoneRaw}`} className="hover:text-cream">
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-3 text-cream/75">
                <Mail size={16} strokeWidth={1.6} className="mt-0.5 flex-shrink-0 text-rose-gold" />
                <a href={`mailto:${SITE.email}`} className="hover:text-cream">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-cream/75">
                <Clock size={16} strokeWidth={1.6} className="mt-0.5 flex-shrink-0 text-rose-gold" />
                <span>{SITE.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt bar */}
        <div className="mt-14 pt-8 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-cream/55">
          <span>
            © {new Date().getFullYear()} Floria Garden. Tüm hakları saklıdır.
          </span>
          <a
            href="https://www.bariscreativedesign.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Tasarım ve geliştirme: BarışCreativeDesign"
            className="group inline-flex items-center gap-1.5 text-cream/55 hover:text-rose-goldLight transition-colors"
          >
            <span aria-hidden className="text-rose-gold/70 group-hover:text-rose-goldLight transition-colors">
              ✦
            </span>
            <span>
              Tasarım:{" "}
              <strong className="font-medium text-rose-gold/90 group-hover:text-rose-goldLight">
                BarışCreativeDesign
              </strong>
            </span>
          </a>
        </div>
      </div>

      {/* Gizli imza — kaynak kodda görünür, kullanıcıya görünmez */}
      <div
        aria-hidden
        dangerouslySetInnerHTML={{
          __html:
            "<!-- Tasarım & Geliştirme: BarışCreativeDesign · Web: https://www.bariscreativedesign.com/ · Instagram: https://www.instagram.com/bariscreativedesign -->",
        }}
      />
    </footer>
  );
}
