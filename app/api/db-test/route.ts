import { NextResponse } from "next/server";
import { query } from "@/lib/db/mysql";

/**
 * Geçici bağlantı testi — Vercel'den cPanel MySQL'e erişim doğrulaması.
 * Çalıştığını teyit edince bu dosya silinecek.
 * /api/db-test
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const rows = await query<{ ok: number }>("SELECT 1 AS ok");
    const tables = await query<Record<string, string>>("SHOW TABLES");
    return NextResponse.json({
      connected: true,
      ping: rows,
      tableCount: tables.length,
    });
  } catch (e) {
    return NextResponse.json(
      { connected: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
