import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getMemberId } from "@/lib/member-auth";
import {
  createMemberAddress,
  deleteMemberAddress,
  getMemberAddresses,
  updateMemberAddress,
} from "@/lib/db/queries";
import type { MemberAddress } from "@/lib/admin/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AddressPayload = Omit<MemberAddress, "memberId" | "createdAt">;

function cleanAddressPayload(body: any): AddressPayload {
  return {
    id: String(body?.id ?? randomUUID()),
    label: String(body?.label ?? "Adres").trim() || "Adres",
    recipientName: String(body?.recipientName ?? "").trim(),
    phone: String(body?.phone ?? "").trim(),
    cityDistrict: String(body?.cityDistrict ?? "").trim(),
    address: String(body?.address ?? "").trim(),
    note: String(body?.note ?? "").trim() || undefined,
    isDefault: Boolean(body?.isDefault),
  };
}

export async function GET() {
  const memberId = getMemberId();
  if (!memberId) return NextResponse.json({ ok: false }, { status: 401 });
  const addresses = await getMemberAddresses(memberId);
  return NextResponse.json({ ok: true, addresses });
}

export async function POST(req: Request) {
  const memberId = getMemberId();
  if (!memberId) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    const address = cleanAddressPayload(await req.json());
    if (!address.recipientName || !address.phone || !address.address) {
      return NextResponse.json(
        { ok: false, error: "Alıcı, telefon ve açık adres gerekli." },
        { status: 400 },
      );
    }
    const existing = await getMemberAddresses(memberId);
    if (existing.length === 0) address.isDefault = true;
    await createMemberAddress(memberId, address);
    return NextResponse.json({
      ok: true,
      addresses: await getMemberAddresses(memberId),
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Adres kaydedilemedi. Canlı veritabanında adres tablosu hazır olmayabilir.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  const memberId = getMemberId();
  if (!memberId) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    const address = cleanAddressPayload(await req.json());
    if (!address.id || !address.recipientName || !address.phone || !address.address) {
      return NextResponse.json(
        { ok: false, error: "Alıcı, telefon ve açık adres gerekli." },
        { status: 400 },
      );
    }
    await updateMemberAddress(memberId, address);
    return NextResponse.json({
      ok: true,
      addresses: await getMemberAddresses(memberId),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Adres güncellenemedi." },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const memberId = getMemberId();
  if (!memberId) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    const body = await req.json();
    const id = String(body?.id ?? "");
    if (!id) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await deleteMemberAddress(memberId, id);
    return NextResponse.json({
      ok: true,
      addresses: await getMemberAddresses(memberId),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Adres silinemedi." },
      { status: 500 },
    );
  }
}
