/** Doğum günü yardımcıları — Özet ve Üyeler sayfalarında ortak kullanılır. */

/** Bir sonraki doğum gününe kalan gün sayısı (geçersizse null). */
export function daysUntilBirthday(
  birthDate: string,
  today: Date = new Date(),
): number | null {
  const parts = birthDate.split("-").map(Number);
  if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [, month, day] = parts;
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let next = new Date(today.getFullYear(), month - 1, day);
  if (next < start) next = new Date(today.getFullYear() + 1, month - 1, day);
  return Math.round((next.getTime() - start.getTime()) / 86_400_000);
}

/** "18 Nisan" biçiminde gün + ay. */
export function formatDayMonth(birthDate: string): string {
  try {
    const [y, m, d] = birthDate.split("-").map(Number);
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
    }).format(new Date(y, m - 1, d));
  } catch {
    return "—";
  }
}

/** Kalan güne göre etiket: "Bugün!", "Yarın", "12 gün". */
export function birthdayCountdownLabel(days: number): string {
  if (days <= 0) return "Bugün!";
  if (days === 1) return "Yarın";
  return `${days} gün`;
}
