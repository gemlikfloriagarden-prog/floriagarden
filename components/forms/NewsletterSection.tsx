"use client";

import NewsletterForm from "./NewsletterForm";
import { useMember } from "@/lib/auth/useMember";

/**
 * Bülten şeridi — yalnızca ÜYE OLMAYANLARA gösterilir.
 * Üyelere zaten e-posta gönderileceği için onlara bu kayıt formu görünmez.
 */
export default function NewsletterSection() {
  const isMember = useMember();
  if (isMember) return null;

  return (
    <div className="container pt-16 md:pt-20">
      <div className="rounded-3xl bg-gradient-to-br from-bordo-700 to-wine p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center border border-rose-gold/20">
        <div>
          <span className="eyebrow">Bülten</span>
          <h3 className="mt-2 font-display text-3xl md:text-4xl text-cream">
            Yeni koleksiyonlardan ilk siz haberdar olun
          </h3>
          <p className="mt-2 text-sm text-cream/70 leading-relaxed">
            Sezonsal koleksiyonlar, özel kampanyalar ve atölye haberleri için
            ayda bir e-postamızı alın.
          </p>
        </div>
        <NewsletterForm />
      </div>
    </div>
  );
}
