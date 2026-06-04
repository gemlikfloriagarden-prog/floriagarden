/**
 * Bakım modu durumu.
 *
 * - Demo: durum localStorage'da tutulur; admin panelden açılıp kapatılır,
 *   admin'in tarayıcısında bakım sayfasını gösterir (önizleme/test).
 * - Üretim (global): NEXT_PUBLIC_MAINTENANCE=1 ortam değişkeni ile Vercel'den
 *   tüm ziyaretçilere açılır.
 *
 * Veritabanına geçince localStorage anahtarı sunucu tarafı bayrağa taşınacak
 * ve admin toggle'ı tüm ziyaretçiler için geçerli olacak.
 */

export const MAINTENANCE_KEY = "floria-maintenance";
export const MAINTENANCE_EVENT = "floria-maintenance-change";

/** Ortam değişkeni ile global bakım (derleme anında gömülür). */
export const ENV_MAINTENANCE = process.env.NEXT_PUBLIC_MAINTENANCE === "1";

export function getStoredMaintenance(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(MAINTENANCE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setStoredMaintenance(on: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MAINTENANCE_KEY, on ? "1" : "0");
    // Aynı sekmedeki dinleyicileri uyar (storage olayı yalnızca diğer sekmelerde tetiklenir).
    window.dispatchEvent(new Event(MAINTENANCE_EVENT));
  } catch {
    /* yok say */
  }
}
