import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Üye Ol",
  description: "Floria Garden'a üye olun — hızlı sipariş ve özel kampanyalar.",
};

export default function RegisterPage() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center pt-28 md:pt-32 pb-20 md:pb-28">
      <div className="container">
        <AuthForm mode="register" />
      </div>
    </section>
  );
}
