"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useMaintenance } from "./useMaintenance";
import MaintenancePage from "./MaintenancePage";

/**
 * Bakım modu açıkken (ve /yonetim dışındaysak) public içeriği bakım sayfasıyla
 * değiştirir. Yönetim paneline her zaman erişilebilir.
 */
export default function MaintenanceGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const maintenance = useMaintenance();
  const isAdmin = pathname?.startsWith("/yonetim") ?? false;

  if (maintenance && !isAdmin) return <MaintenancePage />;
  return <>{children}</>;
}
