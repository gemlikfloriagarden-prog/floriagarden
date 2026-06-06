import type { Product } from "@/lib/data/products";
import { getReviewsByProduct, getAverageRating } from "@/lib/data/reviews";
import { SITE_URL } from "@/lib/constants";

/**
 * Server bileşeni — Product detay sayfası için tam JSON-LD.
 * Product + Brand + Offer + AggregateRating + Review[] içerir.
 * Google rich result'larında yıldız, fiyat ve stok durumu görünür.
 */
export default function ProductJsonLd({ product }: { product: Product }) {
  const reviews = getReviewsByProduct(product.id);
  const { average, count } = getAverageRating(product.id);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDescription,
    sku: product.id,
    brand: { "@type": "Brand", name: "Floria Garden" },
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/urun/${product.slug}`,
      priceCurrency: "TRY",
      price: product.price,
      availability:
        product.stock === "tukendi"
          ? "https://schema.org/OutOfStock"
          : product.stock === "az"
            ? "https://schema.org/LimitedAvailability"
            : "https://schema.org/InStock",
      priceValidUntil: new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 60,
      ).toISOString(),
      seller: {
        "@type": "Organization",
        name: "Floria Garden",
      },
    },
  };

  if (count > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(average.toFixed(2)),
      reviewCount: count,
      bestRating: 5,
      worstRating: 1,
    };

    data.review = reviews.slice(0, 10).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.customerName },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: r.comment,
      // r.date "2 hafta önce" formatında, valid date değil; bu yüzden datePublished eklemiyoruz
    }));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
