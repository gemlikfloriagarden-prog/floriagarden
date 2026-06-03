import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Üye Girişi",
  description: "Floria Garden hesabınıza giriş yapın.",
};

export default function LoginPage() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center pt-28 md:pt-32 pb-20 md:pb-28">
      <div className="container">
        <AuthForm mode="login" />
      </div>
    </section>
  );
}
