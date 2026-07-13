/**
 * Türkçe locale ile para birimi formatlama.
 */
const tryFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return tryFormatter.format(value);
}

export function formatDateTr(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    weekday: "long",
  }).format(date);
}

/**
 * Telefonu Türkiye cep formatına maskeler: 0 (5XX) XXX XX XX
 * 5 ile başlarsa başına 0 eklenir; en fazla 11 hane.
 */
export function formatTrPhone(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d && d[0] !== "0") d = "0" + d;
  d = d.slice(0, 11);
  const p1 = d.slice(0, 1);
  const p2 = d.slice(1, 4);
  const p3 = d.slice(4, 7);
  const p4 = d.slice(7, 9);
  const p5 = d.slice(9, 11);
  let out = p1;
  if (p2) out += ` (${p2}${p2.length === 3 ? ")" : ""}`;
  if (p3) out += ` ${p3}`;
  if (p4) out += ` ${p4}`;
  if (p5) out += ` ${p5}`;
  return out;
}
