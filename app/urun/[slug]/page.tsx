import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import RelatedProducts from "@/components/product/RelatedProducts";
import CustomerReviews from "@/components/product/CustomerReviews";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import RecentlyViewedTracker from "@/components/product/RecentlyViewedTracker";
import ProductJsonLd from "@/components/seo/ProductJsonLd";
import {
  getPublicProductBySlug,
  getPublicCategoryBySlug,
  getPublicProducts,
} from "@/lib/db/queries";

type Params = { params: { slug: string } };

export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getPublicProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = await getPublicProductBySlug(params.slug);
  if (!product) return { title: "Ürün bulunamadı" };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} · Floria Garden`,
      description: product.shortDescription,
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: Params) {
  const product = await getPublicProductBySlug(params.slug);
  if (!product) notFound();

  const category = await getPublicCategoryBySlug(product.category);

  return (
    <article className="pt-28 md:pt-32 pb-20 md:pb-24">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Ürünler", href: "/urunler" },
            ...(category
              ? [{ label: category.name, href: `/koleksiyon/${category.slug}` }]
              : []),
            { label: product.name },
          ]}
          className="mb-10"
        />

        <ProductDetailClient product={product} />
      </div>

      <RecentlyViewedTracker productId={product.id} />

      <CustomerReviews productId={product.id} />
      <RelatedProducts product={product} />

      <div className="container">
        <RecentlyViewed excludeId={product.id} />
      </div>

      {/* JSON-LD: Product + AggregateRating + Review */}
      <ProductJsonLd product={product} />
    </article>
  );
}
