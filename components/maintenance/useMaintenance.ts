"use client";

import { useEffect, useState } from "react";
import {
  ENV_MAINTENANCE,
  MAINTENANCE_EVENT,
  getStoredMaintenance,
} from "@/lib/maintenance";

/**
 * Bakım modu açık mı? Ortam değişkeni veya localStorage anahtarı.
 * Toggle değişince (aynı/diğer sekme) otomatik güncellenir.
 */
export function useMaintenance(): boolean {
  // İlk değer ENV (sunucu + istemci aynı) → hidrasyon uyumlu.
  const [on, setOn] = useState<boolean>(ENV_MAINTENANCE);

  useEffect(() => {
    const update = () => setOn(ENV_MAINTENANCE || getStoredMaintenance());
    update();
    window.addEventListener("storage", update);
    window.addEventListener(MAINTENANCE_EVENT, update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener(MAINTENANCE_EVENT, update);
    };
  }, []);

  return on;
}
