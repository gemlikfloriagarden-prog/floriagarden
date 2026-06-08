import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getMemberAuthByEmail } from "@/lib/db/queries";
import {
  verifyPassword,
  createMemberSession,
  MEMBER_COOKIE,
  MEMBER_TTL,
} from "@/lib/member-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const email = String(b?.email ?? "").trim().toLowerCase();
    const password = String(b?.password ?? "");
    if (!email || !password) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const m = await getMemberAuthByEmail(email);
    if (!m || !m.passwordHash || !verifyPassword(password, m.passwordHash)) {
      return NextResponse.json(
        { ok: false, error: "E-posta veya şifre hatalı." },
        { status: 401 },
      );
    }

    cookies().set(MEMBER_COOKIE, createMemberSession(m.id), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: MEMBER_TTL,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
