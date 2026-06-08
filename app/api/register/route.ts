import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createMember, memberExistsByEmail } from "@/lib/db/queries";
import { makeId } from "@/lib/admin/store";
import {
  hashPassword,
  createMemberSession,
  MEMBER_COOKIE,
  MEMBER_TTL,
} from "@/lib/member-auth";

/** Public üye kaydı — members tablosuna yazar, oturum açar. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const name = String(b?.name ?? "").trim();
    const phone = String(b?.phone ?? "").trim();
    const email = String(b?.email ?? "").trim().toLowerCase();
    const password = String(b?.password ?? "");
    const birthDate = b?.birthDate ? String(b.birthDate) : undefined;

    if (!name || !phone) {
      return NextResponse.json(
        { ok: false, error: "Ad ve telefon gereklidir." },
        { status: 400 },
      );
    }
    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Giriş yapabilmeniz için e-posta gereklidir." },
        { status: 400 },
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { ok: false, error: "Şifre en az 6 karakter olmalıdır." },
        { status: 400 },
      );
    }
    if (await memberExistsByEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Bu e-posta ile zaten kayıt var." },
        { status: 409 },
      );
    }

    const id = makeId("uye");
    await createMember({
      id,
      name,
      phone,
      email,
      birthDate,
      passwordHash: hashPassword(password),
    });

    // Kayıt sonrası otomatik giriş
    cookies().set(MEMBER_COOKIE, createMemberSession(id), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: MEMBER_TTL,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Kayıt sırasında bir hata oluştu." },
      { status: 500 },
    );
  }
}
