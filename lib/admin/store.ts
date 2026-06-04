import type { AdminData } from "./types";
import { buildSeed } from "./seed";

/**
 * ════════════════════════════════════════════════════════════════
 *  DEMO VERİ KATMANI
 *  Tüm admin paneli yalnızca bu dosya üzerinden veriye erişir.
 *  Veritabanına geçerken SADECE bu dosyanın içi değişir
 *  (load/save fonksiyonları API çağrısına döner) — sayfalar aynı kalır.
 * ════════════════════════════════════════════════════════════════
 */

export const ADMIN_STORAGE_KEY = "floria-admin-v1";
export const ADMIN_SESSION_KEY = "floria-admin-session";

/**
 * DEMO ŞİFRESİ — gerçek güvenlik (env değişkeni + sunucu doğrulaması)
 * veritabanı/auth aşamasında gelecek. Şifreyi buradan değiştirebilirsin.
 */
export const ADMIN_DEMO_PASSWORD = "floria2026";

export function loadAdminData(): AdminData {
  if (typeof window === "undefined") return buildSeed();
  try {
    const raw = window.localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) {
      const seed = buildSeed();
      window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as AdminData;
  } catch {
    return buildSeed();
  }
}

export function saveAdminData(data: AdminData) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* kota dolabilir — demo aşamasında yok sayılır */
  }
}

export function resetAdminData(): AdminData {
  const seed = buildSeed();
  saveAdminData(seed);
  return seed;
}

/* ── Yardımcılar ─────────────────────────────────────────── */

const TR_MAP: Record<string, string> = {
  ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
  Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
};

/** Türkçe karakterleri sadeleştirip URL slug üretir. */
export function slugify(input: string): string {
  return input
    .trim()
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (ch) => TR_MAP[ch] ?? ch)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Çakışmayan benzersiz id. */
export function makeId(prefix = "id"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

/** Üyeye özel kod: FG-<baş harfler>-<rastgele>. */
export function generateMemberCode(name: string): string {
  const initials =
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0] ?? "")
      .join("")
      .replace(/[çğıöşüÇĞİÖŞÜ]/g, (ch) => TR_MAP[ch] ?? ch)
      .slice(0, 2)
      .toUpperCase() || "FG";
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `FG-${initials}-${rand}`;
}
