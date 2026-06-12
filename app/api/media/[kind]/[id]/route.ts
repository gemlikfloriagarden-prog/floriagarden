import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/mysql";

type Row = { image?: unknown };
type Params = { params: { kind: string; id: string } };

function parseDataUrl(src: string): { mime: string; body: Buffer } | null {
  const match = /^data:([^;,]+)(;base64)?,(.*)$/s.exec(src);
  if (!match) return null;

  const [, mime, base64, data] = match;
  return {
    mime,
    body: base64
      ? Buffer.from(data, "base64")
      : Buffer.from(decodeURIComponent(data)),
  };
}

async function findImage(kind: string, id: string): Promise<string | null> {
  if (kind === "product") {
    const rows = await query<Row>(
      "SELECT image FROM products WHERE id = ? OR slug = ? LIMIT 1",
      [id, id],
    );
    return typeof rows[0]?.image === "string" ? rows[0].image : null;
  }

  if (kind === "category") {
    const rows = await query<Row>(
      "SELECT image FROM categories WHERE slug = ? LIMIT 1",
      [id],
    );
    return typeof rows[0]?.image === "string" ? rows[0].image : null;
  }

  return null;
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: Params) {
  const src = await findImage(params.kind, decodeURIComponent(params.id));
  if (!src) return new NextResponse(null, { status: 404 });

  if (/^https?:\/\//i.test(src) || src.startsWith("/")) {
    return NextResponse.redirect(new URL(src, request.url), 302);
  }

  const parsed = parseDataUrl(src);
  if (!parsed) return new NextResponse(null, { status: 404 });

  return new NextResponse(new Uint8Array(parsed.body), {
    headers: {
      "Content-Type": parsed.mime,
      "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
