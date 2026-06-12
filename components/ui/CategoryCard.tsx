import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import FloralPlaceholder from "./FloralPlaceholder";
import type { Category } from "@/lib/data/categories";

type Props = {
  category: Category;
  size?: "default" | "large";
};

export default function CategoryCard({ category }: Props) {
  return (
    <div className="group relative h-full flex flex-col overflow-hidden rounded-3xl bg-white hover:bg-bordo border border-rose-gold/20 hover:border-bordo shadow-soft hover:shadow-card transition-[transform,background-color,border-color] duration-300 hover:scale-[1.02]">
      <Link
        href={`/koleksiyon/${category.slug}`}
        className="flex flex-col h-full"
        aria-label={`${category.name} koleksiyonunu keşfet`}
      >
        {/* Görsel alanı */}
        <div className="relative aspect-[5/4] overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-700 ease-silk group-hover:scale-105">
            {category.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <FloralPlaceholder
                gradient={category.gradient}
                label={category.name}
              />
            )}
          </div>

          {/* Hover: bordo örtü — tüm kartlar üzerine gelince bordoya döner */}
          <div
            className="absolute inset-0 bg-bordo/0 group-hover:bg-bordo/55 transition-colors duration-500"
            aria-hidden
          />

          {/* Üst koleksiyon etiketi */}
          <span className="absolute top-4 left-4 inline-flex items-center rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[0.6rem] uppercase tracking-wider2 text-bordo shadow-soft">
            Koleksiyon
          </span>

          {/* Alt yumuşak gölge — görsel ile içerik geçişi */}
          <div
            className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/30 to-transparent group-hover:from-bordo/40 transition-colors duration-500"
            aria-hidden
          />
        </div>

        {/* İçerik alanı — hover'da bordo temaya döner */}
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <h3 className="font-display text-xl md:text-2xl text-coffee group-hover:text-cream leading-tight transition-colors duration-300">
            {category.name}
          </h3>
          <p className="mt-2 text-sm text-coffee/60 group-hover:text-cream/75 leading-relaxed line-clamp-2 transition-colors duration-300">
            {category.description}
          </p>

          <div className="mt-5 pt-4 border-t border-rose-gold/15 group-hover:border-cream/20 flex items-center justify-between transition-colors duration-300">
            <span className="text-xs uppercase tracking-wider2 text-rose-goldDark group-hover:text-cream transition-colors duration-300">
              Keşfet
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-rose-gold/30 text-rose-goldDark group-hover:bg-cream group-hover:text-bordo group-hover:border-cream group-hover:rotate-45 transition-all duration-300">
              <ArrowUpRight size={14} strokeWidth={1.7} />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
