import { NextResponse } from "next/server";
import { getPublicProducts, getPublicCategories } from "@/lib/db/queries";

/**
 * Public katalog — arama, ilgili ürünler, son görüntülenenler, favoriler
 * gibi istemci bileşenleri buradan ürün/kategori listesini çeker.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [products, categories] = await Promise.all([
      getPublicProducts(),
      getPublicCategories(),
    ]);
    return NextResponse.json(
      { products, categories },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { products: [], categories: [] },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  }
}
