import type { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Şifre Sıfırla",
  description: "Floria Garden hesabınız için yeni şifre belirleyin.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: { token?: string };
}) {
  const token = String(searchParams?.token ?? "");
  return (
    <section className="min-h-[70vh] flex items-center justify-center pt-28 md:pt-32 pb-20 md:pb-28">
      <div className="container">
        <ResetPasswordForm token={token} />
      </div>
    </section>
  );
}
