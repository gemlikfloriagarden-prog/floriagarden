export type Coupon = {
  code: string;
  /** İndirim türü */
  type: "percent" | "fixed";
  /** Yüzde için 0–100, sabit için TRY tutarı */
  value: number;
  /** Uygulanabilir minimum sepet tutarı */
  minSubtotal?: number;
  /** Kullanıcıya gösterilen kısa açıklama */
  description: string;
  /** Son kullanma tarihi (ISO, opsiyonel) */
  expiresAt?: string;
};

export type CouponValidation =
  | { ok: true; coupon: Coupon; discount: number }
  | { ok: false; reason: string };

export function calculateCouponDiscount(coupon: Coupon, subtotal: number) {
  const value = Math.max(0, Number(coupon.value) || 0);
  const discount =
    coupon.type === "percent"
      ? Math.round((subtotal * Math.min(value, 100)) / 100)
      : value;
  return Math.min(subtotal, discount);
}

export function validateCouponValue(
  coupon: Coupon,
  subtotal: number,
  now = new Date(),
): CouponValidation {
  if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
    return { ok: false, reason: "Kuponun süresi dolmuş." };
  }
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return {
      ok: false,
      reason: `Bu kupon ${new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
      }).format(coupon.minSubtotal)} üzeri sepetlerde geçerlidir.`,
    };
  }
  return { ok: true, coupon, discount: calculateCouponDiscount(coupon, subtotal) };
}
