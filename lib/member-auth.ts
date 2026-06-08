import crypto from "crypto";
import { cookies } from "next/headers";

/**
 * Üye kimlik doğrulama (admin'den ayrı).
 * Şifreler scrypt ile hash'lenir; oturum httpOnly imzalı cookie.
 */

export const MEMBER_COOKIE = "floria_member";
const TTL_SECONDS = 30 * 24 * 60 * 60;

function secret(): string {
  return process.env.ADMIN_SECRET ?? "degistir-bu-gizli-anahtari";
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored || !stored.includes(":")) return false;
  const [salt, hash] = stored.split(":");
  try {
    const test = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(test, "hex"));
  } catch {
    return false;
  }
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createMemberSession(memberId: string): string {
  const exp = Date.now() + TTL_SECONDS * 1000;
  const payload = `${memberId}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

/** Geçerli oturumdaki üye id'si (yoksa null). */
export function getMemberId(): string | null {
  const token = cookies().get(MEMBER_COOKIE)?.value;
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [id, exp, sig] = parts;
  if (sign(`${id}.${exp}`) !== sig) return null;
  if (Number(exp) < Date.now()) return null;
  return id;
}

export const MEMBER_TTL = TTL_SECONDS;
