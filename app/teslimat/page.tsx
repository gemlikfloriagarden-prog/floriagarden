import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import FadeIn from "@/components/motion/FadeIn";
import DeliverySections from "@/components/delivery/DeliverySections";
import { getDelivery } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Teslimat Bilgileri",
  description:
    "Floria Garden teslimat saatleri, bölgeler ve özenli teslimat süreci hakkında detaylı bilgi.",
};

export const revalidate = 300;

export default async function DeliveryPage() {
  const { deliveryZones, deliveryProcess } = await getDelivery();
  return (
    <article className="pt-28 md:pt-32 pb-20 md:pb-28">
      <div className="container">
        <Breadcrumb items={[{ label: "Teslimat" }]} className="mb-10" />

        <header className="flex flex-col items-start gap-4 mb-12 max-w-3xl">
          <FadeIn><span className="eyebrow">Teslimat</span></FadeIn>
          <FadeIn delay={0.05}>
            <h1 className="heading-display">
              Çiçeğiniz, en taze hâliyle
              <br />
              <span className="italic text-bordo">elden teslim</span>
              <span className="text-rose-gold">.</span>
            </h1>
          </FadeIn>
        </header>

        {/* Bölgeler + Süreç (admin panelden yönetilir, DB'den okunur) */}
        <DeliverySections
          deliveryZones={deliveryZones}
          deliveryProcess={deliveryProcess}
        />

        {/* Önemli bilgiler */}
        <FadeIn>
          <div className="rounded-3xl bg-rose-gold/10 border border-rose-gold/30 p-7 md:p-10">
            <h3 className="font-display text-2xl text-coffee mb-4">
              Önemli bilgiler
            </h3>
            <ul className="space-y-3 text-sm text-coffee/80 leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-rose-gold mt-1.5">·</span>
                <span>
                  Saat 17:00&apos;dan önce verilen siparişler aynı gün teslim edilir.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-gold mt-1.5">·</span>
                <span>
                  Sürpriz teslimatlarda gönderici bilgisi alıcıya açıklanmaz.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-gold mt-1.5">·</span>
                <span>
                  Alıcı adreste değilse iletişim numarası üzerinden iletişime
                  geçilir, gerekirse ertesi gün yeniden teslimat planlanır.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-gold mt-1.5">·</span>
                <span>
                  Çiçeğin tazeliği bizim için garantidir; memnun kalmazsanız
                  yenisini hazırlarız.
                </span>
              </li>
            </ul>
          </div>
        </FadeIn>
      </div>
    </article>
  );
}
