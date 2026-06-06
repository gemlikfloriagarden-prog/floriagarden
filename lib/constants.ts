export const SITE = {
  name: "Floria Garden",
  tagline: "Flowers and Coffee",
  shortDescription: "Gemlik'in yeni nesil butik çiçekçisi",
  city: "Gemlik",
  // TODO: gerçek işletme e-postası gelince güncellenecek
  email: "merhaba@floriagarden.com",
  phoneDisplay: "+90 541 623 98 16",
  phoneRaw: "905416239816",
  address:
    "Demirsubaşı Mah. Şehit Gökhan Aydınlı Sk. No: 9 İç Kapı: A, Gemlik / Bursa",
  hours: "Pzt – Cmt: 08:30 – 23:00 · Pazar: 10:00 – 17:00",
  instagram: {
    handle: "@floriagarden_",
    url: "https://www.instagram.com/floriagarden_/",
  },
  // Yasal bilgiler (şahıs işletmesi). TC kimlik no gizli tutulur, siteye konmaz.
  legal: {
    owner: "Müge Eker",
    taxOffice: "Gemlik Vergi Dairesi",
    taxNo: "4180532808",
  },
} as const;

/**
 * Sitenin kök adresi. Vercel'de NEXT_PUBLIC_SITE_URL ortam değişkeniyle
 * gerçek domaine ayarlanır (örn. https://floriagarden.com.tr).
 * Tüm SEO/sitemap/JSON-LD adresleri buradan beslenir.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://floriagarden.com";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Merhaba Floria Garden, ürünleriniz hakkında bilgi almak istiyorum.";

export function whatsappLink(message: string = WHATSAPP_DEFAULT_MESSAGE) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${SITE.phoneRaw}?text=${encoded}`;
}
