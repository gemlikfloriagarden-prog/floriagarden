import { NextResponse } from "next/server";
import { subscribeNewsletter } from "@/lib/db/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const source = String(body?.source ?? "footer").trim().slice(0, 80);

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Geçerli bir e-posta adresi girin." },
        { status: 400 },
      );
    }

    await subscribeNewsletter(email, source || "footer");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Bülten kaydı tamamlanamadı." },
      { status: 500 },
    );
  }
}
