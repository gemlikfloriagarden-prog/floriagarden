import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { MEMBER_COOKIE } from "@/lib/member-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  cookies().delete(MEMBER_COOKIE);
  return NextResponse.json({ ok: true });
}
