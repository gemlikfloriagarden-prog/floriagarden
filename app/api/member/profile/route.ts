import { NextResponse } from "next/server";
import { getMemberId } from "@/lib/member-auth";
import {
  getMemberWithCodes,
  memberEmailUsedByOther,
  updateMemberProfile,
} from "@/lib/db/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function PATCH(req: Request) {
  const memberId = getMemberId();
  if (!memberId) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    const phone = String(body?.phone ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const birthDate = String(body?.birthDate ?? "").trim();

    if (!name || !phone || !email) {
      return NextResponse.json(
        { ok: false, error: "Ad, telefon ve e-posta gerekli." },
        { status: 400 },
      );
    }
    if (!validEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Geçerli bir e-posta girin." },
        { status: 400 },
      );
    }
    if (await memberEmailUsedByOther(email, memberId)) {
      return NextResponse.json(
        { ok: false, error: "Bu e-posta başka bir üyede kullanılıyor." },
        { status: 409 },
      );
    }

    await updateMemberProfile(memberId, {
      name,
      phone,
      email,
      birthDate: birthDate || undefined,
    });
    const member = await getMemberWithCodes(memberId);
    return NextResponse.json({ ok: true, member });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Profil güncellenemedi." },
      { status: 500 },
    );
  }
}
