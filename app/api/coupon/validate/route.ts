import { NextResponse } from "next/server";
import { getMemberId } from "@/lib/member-auth";
import { validateDiscountCode } from "@/lib/db/queries";
import { calculateCouponDiscount, type Coupon } from "@/lib/cart/coupons";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let code = "";
  let subtotal = 0;
  try {
    const body = await req.json();
    code = String(body?.code ?? "");
    subtotal = Math.max(0, Number(body?.subtotal) || 0);
  } catch {
    return NextResponse.json(
      { ok: false, reason: "Kupon kodu okunamadı." },
      { status: 400 },
    );
  }

  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return NextResponse.json(
      { ok: false, reason: "Kupon kodu girin." },
      { status: 400 },
    );
  }

  try {
    const found = await validateDiscountCode(normalized, getMemberId());
    if (!found) {
      return NextResponse.json({ ok: false, reason: "Kupon kodu geçersiz." });
    }
    if (found.type === "member_only") {
      return NextResponse.json({
        ok: false,
        reason: "Bu kod sadece tanımlandığı üye hesabında kullanılabilir.",
      });
    }

    const couponType: Coupon["type"] =
      found.type === "fixed" ? "fixed" : "percent";
    const coupon: Coupon = {
      code: found.code,
      type: couponType,
      value: found.value,
      description: found.description,
    };

    return NextResponse.json({
      ok: true,
      coupon,
      discount: calculateCouponDiscount(coupon, subtotal),
    });
  } catch {
    return NextResponse.json(
      { ok: false, reason: "Kupon şu anda kontrol edilemedi." },
      { status: 500 },
    );
  }
}
