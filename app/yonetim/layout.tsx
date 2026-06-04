import type { Metadata } from "next";
import AdminGuard from "@/components/admin/AdminGuard";
import { AdminDataProvider } from "@/components/admin/AdminDataProvider";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Yönetim",
  robots: { index: false, follow: false },
};

export default function YonetimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminDataProvider>
        <AdminShell>{children}</AdminShell>
      </AdminDataProvider>
    </AdminGuard>
  );
}
