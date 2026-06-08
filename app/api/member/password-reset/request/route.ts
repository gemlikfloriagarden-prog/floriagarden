import crypto from "crypto";
import { NextResponse } from "next/server";
import { SITE, SITE_URL } from "@/lib/constants";
import { sendMail } from "@/lib/mail";
import {
  createPasswordResetToken,
  getMemberIdByEmail,
} from "@/lib/db/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function tokenHash(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function esc(text: string): string {
  return String(text ?? "").replace(/[&<>"]/g, (ch) => {
    if (ch === "&") return "&amp;";
    if (ch === "<") return "&lt;";
    if (ch === ">") return "&gt;";
    return "&quot;";
  });
}

function resetEmailHtml(resetUrl: string): string {
  return `<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;color:#2a1a14;max-width:560px;margin:auto;padding:24px">
    <div style="font-family:Georgia,serif;font-size:24px;color:#8e1f3f;font-weight:700">Floria Garden</div>
    <div style="font-size:12px;color:#a3823f;letter-spacing:1px;text-transform:uppercase;margin-bottom:18px">${esc(SITE.tagline)}</div>
    <h1 style="font-size:20px;margin:0 0 10px">Şifre sıfırlama</h1>
    <p style="font-size:14px;line-height:1.65;color:#4a3a32">Floria Garden hesabınız için şifre sıfırlama isteği aldık. Yeni şifrenizi belirlemek için aşağıdaki bağlantıyı kullanabilirsiniz.</p>
    <p style="margin:22px 0">
      <a href="${esc(resetUrl)}" style="display:inline-block;background:#8e1f3f;color:#fff;text-decoration:none;border-radius:999px;padding:12px 18px;font-size:14px;font-weight:600">Şifremi sıfırla</a>
    </p>
    <p style="font-size:13px;line-height:1.6;color:#8a7a70">Bu bağlantı 1 saat geçerlidir. Bu isteği siz yapmadıysanız e-postayı yok sayabilirsiniz.</p>
    <div style="margin-top:20px;font-size:12px;color:#8a7a70">${esc(SITE.address)} · ${esc(SITE.phoneDisplay)}</div>
  </div>`;
}

export async function POST(req: Request) {
  let email = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim().toLowerCase();
  } catch {
    /* boş */
  }

  if (!email) {
    return NextResponse.json({ ok: true });
  }

  try {
    const memberId = await getMemberIdByEmail(email);
    if (memberId) {
      const token = crypto.randomBytes(32).toString("hex");
      await createPasswordResetToken(memberId, tokenHash(token));
      const resetUrl = `${SITE_URL}/sifre-sifirla?token=${encodeURIComponent(token)}`;
      await sendMail({
        to: email,
        subject: "Floria Garden şifre sıfırlama",
        html: resetEmailHtml(resetUrl),
      });
    }
  } catch {
    // Güvenlik için hesap var/yok veya SMTP durumunu dışarı sızdırma.
  }

  return NextResponse.json({ ok: true });
}
