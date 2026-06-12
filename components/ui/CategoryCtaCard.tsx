import { MessageCircle, Sparkles } from "lucide-react";
import FloralPlaceholder from "./FloralPlaceholder";
import { whatsappLink } from "@/lib/constants";

/**
 * Koleksiyon ızgarasındaki son boş hücreyi dolduran özel tasarım CTA kartı.
 * Diğer kategori kartlarıyla aynı açık tema; hover'da bordoya döner.
 */
export default function CategoryCtaCard() {
  return (
    <a
      href={whatsappLink(
        "Merhaba Floria Garden, aklımda özel bir tasarım var. Yardımcı olur musunuz?",
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Size özel tasarım için WhatsApp'tan yazın"
      className="group relative h-full flex flex-col overflow-hidden rounded-3xl bg-white hover:bg-bordo border border-rose-gold/20 hover:border-bordo shadow-soft hover:shadow-card transition-[transform,background-color,border-color] duration-300 hover:scale-[1.02]"
    >
      {/* Görsel alanı */}
      <div className="relative aspect-[5/4] overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-700 ease-silk group-hover:scale-105">
          <FloralPlaceholder
            gradient="from-rose-goldLight via-rose-gold to-bordo-500"
            label="Floria Garden"
          />
        </div>

        {/* Hover: bordo örtü */}
        <div
          className="absolute inset-0 bg-bordo/0 group-hover:bg-bordo/55 transition-colors duration-500"
          aria-hidden
        />

        {/* Üst etiket */}
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[0.6rem] uppercase tracking-wider2 text-bordo shadow-soft">
          <Sparkles size={11} strokeWidth={1.8} className="text-rose-gold" />
          Size Özel
        </span>

        {/* Alt yumuşak gölge */}
        <div
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/30 to-transparent group-hover:from-bordo/40 transition-colors duration-500"
          aria-hidden
        />
      </div>

      {/* İçerik alanı — hover'da bordo temaya döner */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="font-display text-xl md:text-2xl text-coffee group-hover:text-cream leading-tight transition-colors duration-300">
          Size özel tasarlayalım
        </h3>
        <p className="mt-2 text-sm text-coffee/60 group-hover:text-cream/75 leading-relaxed line-clamp-2 transition-colors duration-300">
          Özel buket, kutu veya etkinlik düzenlemesi mi istiyorsunuz? WhatsApp&apos;tan
          yazın, birlikte hazırlayalım.
        </p>

        <div className="mt-5 pt-4 border-t border-rose-gold/15 group-hover:border-cream/20 flex items-center justify-between transition-colors duration-300">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider2 text-rose-goldDark group-hover:text-cream transition-colors duration-300">
            <MessageCircle size={13} strokeWidth={1.8} />
            WhatsApp&apos;tan Yazın
          </span>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-rose-gold/30 text-rose-goldDark group-hover:bg-cream group-hover:text-bordo group-hover:border-cream group-hover:rotate-45 transition-all duration-300">
            <MessageCircle size={14} strokeWidth={1.7} />
          </span>
        </div>
      </div>
    </a>
  );
}
