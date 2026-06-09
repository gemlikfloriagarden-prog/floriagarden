import { NextResponse } from "next/server";
import { getMemberId, hashPassword, verifyPassword } from "@/lib/member-auth";
import { getMemberAuthById, updateMemberPassword } from "@/lib/db/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const memberId = getMemberId();
  if (!memberId) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const body = await req.json();
    const currentPassword = String(body?.currentPassword ?? "");
    const newPassword = String(body?.newPassword ?? "");

    if (!currentPassword || newPassword.length < 6) {
      return NextResponse.json(
        { ok: false, error: "Yeni şifre en az 6 karakter olmalı." },
        { status: 400 },
      );
    }

    const auth = await getMemberAuthById(memberId);
    if (
      !auth ||
      !auth.passwordHash ||
      !verifyPassword(currentPassword, auth.passwordHash)
    ) {
      return NextResponse.json(
        { ok: false, error: "Mevcut şifre hatalı." },
        { status: 401 },
      );
    }

    await updateMemberPassword(memberId, hashPassword(newPassword));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Şifre değiştirilemedi." },
      { status: 500 },
    );
  }
}
