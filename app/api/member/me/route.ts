import { NextResponse } from "next/server";
import { getMemberId } from "@/lib/member-auth";
import { getMemberWithCodes } from "@/lib/db/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const id = getMemberId();
  if (!id) {
    return NextResponse.json({ authed: false }, { status: 401 });
  }
  try {
    const member = await getMemberWithCodes(id);
    if (!member) return NextResponse.json({ authed: false }, { status: 401 });
    return NextResponse.json({ authed: true, member });
  } catch {
    return NextResponse.json({ authed: false }, { status: 500 });
  }
}
