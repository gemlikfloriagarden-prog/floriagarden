import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/motion/FadeIn";
import ContactForm from "@/components/forms/ContactForm";
import { SITE, whatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Floria Garden ile iletişime geçin — WhatsApp, telefon, e-posta veya iletişim formu ile bize ulaşabilirsiniz.",
};

const CONTACT_ITEMS = [
  { icon: MapPin, label: "Adres", value: SITE.address },
  { icon: Phone, label: "Telefon", value: SITE.phoneDisplay, href: `tel:${SITE.phoneRaw}` },
  { icon: Mail, label: "E-posta", value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: Clock, label: "Çalışma Saatleri", value: SITE.hours },
];

export default function ContactPage() {
  return (
    <article className="pt-28 md:pt-32 pb-20 md:pb-28">
      <div className="container">
        <Breadcrumb items={[{ label: "İletişim" }]} className="mb-10" />

        <header className="flex flex-col items-start gap-4 mb-12 max-w-3xl">
          <FadeIn><span className="eyebrow">Bize Ulaşın</span></FadeIn>
          <FadeIn delay={0.05}>
            <h1 className="heading-display">
              Bir mesaj
              <br />
              <span className="italic text-bordo">uzaktayız</span>
              <span className="text-rose-gold">.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-coffee/75 leading-relaxed text-balance max-w-2xl">
              Sipariş, kişiselleştirme talepleri veya kurumsal projeler için
              ekibimiz size en kısa sürede yanıt verir.
            </p>
          </FadeIn>
        </header>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* İletişim formu */}
          <FadeIn className="lg:col-span-7">
            <div className="rounded-3xl glass-dark p-7 md:p-10">
              <h2 className="font-display text-2xl text-coffee mb-1">
                Bize yazın
              </h2>
              <p className="text-sm text-coffee/60 mb-7">
                24 saat içinde dönüş yapıyoruz.
              </p>
              <ContactForm />
            </div>
          </FadeIn>

          {/* İletişim bilgileri */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <FadeIn delay={0.1}>
              <div className="rounded-3xl glass-dark p-6 flex flex-col gap-5">
                {CONTACT_ITEMS.map((item) => {
                  const Inner = (
                    <div className="flex items-start gap-4">
                      <span className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-rose-gold-gradient text-coffee">
                        <item.icon size={17} strokeWidth={1.6} />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[0.7rem] uppercase tracking-wider2 text-rose-gold">
                          {item.label}
                        </span>
                        <span className="text-coffee mt-1 leading-relaxed">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  );
                  return item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      className="rounded-2xl -m-2 p-2 hover:bg-cream/5 transition-colors"
                    >
                      {Inner}
                    </a>
                  ) : (
                    <div key={item.label}>{Inner}</div>
                  );
                })}
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="rounded-3xl bg-rose-gold-gradient p-6 text-coffee">
                <h3 className="font-display text-2xl">Hızlı yanıt mı?</h3>
                <p className="mt-2 text-sm text-coffee/85">
                  WhatsApp üzerinden anında yanıt alabilirsiniz.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      size="md"
                      className="w-full !bg-coffee !text-cream hover:!bg-coffee-soft"
                    >
                      <MessageCircle size={16} strokeWidth={1.7} />
                      <span>WhatsApp</span>
                    </Button>
                  </a>
                  <a
                    href={SITE.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button size="md" className="w-full !text-cream">
                      <Instagram size={16} strokeWidth={1.8} />
                      <span>Instagram</span>
                    </Button>
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </article>
  );
}
