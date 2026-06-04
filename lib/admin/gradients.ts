/**
 * Ürün ve kategori görseli için hazır gradient seçenekleri.
 * (Gerçek foto yükleme veritabanı aşamasında eklenecek; şimdilik yer tutucu.)
 *
 * Not: Buradaki sınıf adları lib/data dosyalarında da geçtiği için
 * Tailwind tarafından derlenir — güvenle kullanılabilir.
 */
export const GRADIENT_PRESETS: { label: string; value: string }[] = [
  { label: "Bordo", value: "from-bordo-400 via-bordo-600 to-bordo-700" },
  { label: "Açık Bordo", value: "from-bordo-300 via-bordo-500 to-bordo-700" },
  { label: "Koyu Bordo", value: "from-bordo-500 via-bordo-700 to-coffee" },
  { label: "Gül & Bordo", value: "from-rose-gold via-bordo-400 to-bordo-700" },
  { label: "Altın", value: "from-rose-goldLight via-rose-gold to-rose-goldDark" },
  { label: "Krem & Altın", value: "from-cream-deep via-rose-goldLight to-rose-gold" },
  { label: "Yeşil", value: "from-sage-soft via-sage to-sage-deep" },
  { label: "Kahve", value: "from-coffee-soft via-coffee to-bordo-700" },
];

export const DEFAULT_GRADIENT = GRADIENT_PRESETS[0].value;
