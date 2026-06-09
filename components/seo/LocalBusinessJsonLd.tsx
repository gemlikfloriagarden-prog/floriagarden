import { SITE, SITE_URL } from "@/lib/constants";

/**
 * Anasayfaya yerleştirilen LocalBusiness/Florist JSON-LD.
 * Google'da harita, telefon, çalışma saatleri gibi zengin sonuçlar için.
 */
export default function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Florist",
    name: SITE.name,
    description: SITE.shortDescription,
    image: `${SITE_URL}/opengraph-image`,
    url: SITE_URL,
    telephone: `+${SITE.phoneRaw}`,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address,
      addressLocality: SITE.city,
      addressRegion: "Bursa",
      postalCode: "16600",
      addressCountry: "TR",
    },
    areaServed: { "@type": "City", name: "Gemlik" },
    openingHours: ["Mo-Sa 08:30-23:00", "Su 10:00-17:00"],
    priceRange: "₺₺-₺₺₺",
    sameAs: [SITE.instagram.url],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
