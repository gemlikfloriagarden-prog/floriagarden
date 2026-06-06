import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { SITE_URL } from "@/lib/constants";

export type Crumb = {
  label: string;
  href?: string;
};

type Props = {
  items: Crumb[];
  className?: string;
};

export default function Breadcrumb({ items, className }: Props) {
  // BreadcrumbList JSON-LD — Google rich results için
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Anasayfa",
        item: `${SITE_URL}/`,
      },
      ...items.map((c, idx) => ({
        "@type": "ListItem",
        position: idx + 2,
        name: c.label,
        ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}),
      })),
    ],
  };

  return (
    <nav
      aria-label="Sayfa konumu"
      className={cn("flex items-center flex-wrap gap-1.5 text-xs", className)}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-coffee/55 hover:text-bordo transition-colors"
      >
        <Home size={12} strokeWidth={1.7} />
        <span className="sr-only">Anasayfa</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={`${item.label}-${idx}`} className="inline-flex items-center gap-1.5">
            <ChevronRight
              size={12}
              strokeWidth={1.6}
              className="text-coffee/30 flex-shrink-0"
              aria-hidden
            />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-coffee/55 hover:text-bordo transition-colors tracking-wide"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="text-bordo tracking-wide"
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
