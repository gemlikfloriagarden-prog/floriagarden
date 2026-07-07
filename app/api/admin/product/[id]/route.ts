import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin/auth-server";
import { getAdminProduct } from "@/lib/db/queries";

/** Admin: tek ürünün TAM hali (base64 görsellerle) — düzenleme formu için. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const product = await getAdminProduct(params.id);
    if (!product) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }
}
