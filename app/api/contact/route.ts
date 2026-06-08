import { NextResponse } from "next/server";
import { notifyEmail, sendMail } from "@/lib/mail";
import { SITE } from "@/lib/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function esc(text: string): string {
  return String(text ?? "").replace(/[&<>"]/g, (ch) => {
    if (ch === "&") return "&amp;";
    if (ch === "<") return "&lt;";
    if (ch === ">") return "&gt;";
    return "&quot;";
  });
}

function isValidEmail(email: string): boolean {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function contactHtml(input: {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
}) {
  return `<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;color:#2a1a14;max-width:580px;margin:auto;padding:24px">
    <div style="font-family:Georgia,serif;font-size:24px;color:#8e1f3f;font-weight:700">Floria Garden</div>
    <div style="font-size:12px;color:#a3823f;letter-spacing:1px;text-transform:uppercase;margin-bottom:18px">${esc(SITE.tagline)}</div>
    <h1 style="font-size:20px;margin:0 0 12px">Yeni iletişim formu mesajı</h1>
    <div style="background:#faf6f0;border-radius:12px;padding:14px;font-size:14px;line-height:1.7">
      <b>Ad Soyad:</b> ${esc(input.name)}<br>
      <b>Konu:</b> ${esc(input.topic)}<br>
      <b>E-posta:</b> ${input.email ? esc(input.email) : "-"}<br>
      <b>Telefon:</b> ${input.phone ? esc(input.phone) : "-"}
    </div>
    <div style="margin-top:14px">
      <b style="font-size:14px">Mesaj:</b>
      <div style="margin-top:6px;background:#fff;border:1px solid #f0e6da;border-radius:12px;padding:14px;white-space:pre-wrap;font-size:14px;line-height:1.7">${esc(input.message)}</div>
    </div>
    <div style="margin-top:18px;font-size:12px;color:#8a7a70">${esc(SITE.address)} · ${esc(SITE.phoneDisplay)}</div>
  </div>`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const phone = String(body?.phone ?? "").trim();
    const topic = String(body?.topic ?? "Genel bilgi").trim().slice(0, 120);
    const message = String(body?.message ?? "").trim();
    const phoneDigits = phone.replace(/\D/g, "");
    const hasUsefulPhone = phoneDigits.length > 4;

    if (!name || !message || (!email && !hasUsefulPhone)) {
      return NextResponse.json(
        { ok: false, error: "Ad, mesaj ve en az bir iletişim bilgisi gerekli." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Geçerli bir e-posta adresi girin." },
        { status: 400 },
      );
    }

    const to = notifyEmail();
    const sent = await sendMail({
      to,
      subject: `İletişim formu: ${topic || "Genel bilgi"} — ${name}`,
      html: contactHtml({ name, email, phone, topic, message }),
      replyTo: email || undefined,
    });

    if (!sent) {
      return NextResponse.json(
        { ok: false, error: "Mesaj gönderilemedi. Lütfen WhatsApp veya telefonla ulaşın." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Mesaj gönderilemedi. Lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
