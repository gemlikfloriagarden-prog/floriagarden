import { SITE, SITE_URL } from "@/lib/constants";

/**
 * Tüm sayfalarda yer alan kurumsal yapılandırılmış veri.
 * Google Knowledge Graph ve marka panelleri için temel kimlik.
 */
export default function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE_URL,
    logo: `${SITE_URL}/icon`,
    description: SITE.shortDescription,
    slogan: SITE.tagline,
    sameAs: [SITE.instagram.url],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phoneDisplay,
      contactType: "customer service",
      areaServed: "TR",
      availableLanguage: ["Turkish"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address,
      addressLocality: SITE.city,
      addressRegion: "Bursa",
      postalCode: "16600",
      addressCountry: "TR",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
