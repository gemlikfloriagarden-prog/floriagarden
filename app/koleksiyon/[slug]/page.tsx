import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductGrid from "@/components/product/ProductGrid";
import {
  getPublicCategories,
  getPublicCategoryBySlug,
  getPublicProductsByCategory,
} from "@/lib/db/queries";

type Params = { params: { slug: string } };

export const revalidate = 300;

export async function generateStaticParams() {
  const categories = await getPublicCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const category = await getPublicCategoryBySlug(params.slug);
  if (!category) return { title: "Kategori bulunamadı" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: Params) {
  const category = await getPublicCategoryBySlug(params.slug);
  if (!category) notFound();

  const [products, categories] = await Promise.all([
    getPublicProductsByCategory(category.slug),
    getPublicCategories(),
  ]);

  return (
    <article className="pt-28 md:pt-32 pb-20 md:pb-28">
      <div className="container">
        {/* Açık başlık */}
        <header className="mb-10 max-w-3xl">
          <Breadcrumb
            items={[
              { label: "Koleksiyon", href: "/urunler" },
              { label: category.name },
            ]}
            className="mb-8"
          />
          <span className="eyebrow">Koleksiyon</span>
          <h1 className="heading-display mt-4">
            {category.name}
            <span className="text-rose-gold">.</span>
          </h1>
          <p className="mt-4 text-coffee/65 leading-relaxed">
            {category.description}
          </p>
          <p className="mt-3 text-sm text-coffee/55">
            <strong className="text-bordo font-medium">{products.length}</strong>{" "}
            ürün
          </p>
        </header>

        {/* Kategori chip'leri */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/urunler"
            className="inline-flex items-center rounded-full border border-rose-gold/25 bg-white text-coffee/75 hover:text-bordo shadow-soft hover:border-rose-gold px-4 h-9 text-xs tracking-wide transition-colors"
          >
            Tümü
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/koleksiyon/${c.slug}`}
              className={
                c.slug === category.slug
                  ? "inline-flex items-center rounded-full bg-rose-gold-gradient text-coffee px-4 h-9 text-xs font-medium tracking-wide"
                  : "inline-flex items-center rounded-full border border-rose-gold/25 bg-white text-coffee/75 hover:text-bordo shadow-soft hover:border-rose-gold px-4 h-9 text-xs tracking-wide transition-colors"
              }
            >
              {c.name}
            </Link>
          ))}
        </div>

        <ProductGrid products={products} />
      </div>
    </article>
  );
}
