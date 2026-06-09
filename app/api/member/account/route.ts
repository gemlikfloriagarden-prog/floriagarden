import { NextResponse } from "next/server";
import { getMemberId } from "@/lib/member-auth";
import {
  getMemberAddresses,
  getMemberOrders,
  getMemberWithCodes,
} from "@/lib/db/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const memberId = getMemberId();
  if (!memberId) {
    return NextResponse.json({ authed: false }, { status: 401 });
  }

  try {
    const member = await getMemberWithCodes(memberId);
    if (!member) return NextResponse.json({ authed: false }, { status: 401 });

    const [addresses, orders] = await Promise.all([
      getMemberAddresses(memberId),
      getMemberOrders(member),
    ]);

    return NextResponse.json({
      authed: true,
      member,
      addresses,
      orders,
    });
  } catch {
    return NextResponse.json(
      { authed: false, error: "Hesap bilgileri alınamadı." },
      { status: 500 },
    );
  }
}
