"use client";

import { useEffect, useState, type ReactNode } from "react";
import AdminLogin from "./AdminLogin";
import { ADMIN_SESSION_KEY } from "@/lib/admin/store";

/**
 * Demo şifre kapısı. Oturum sessionStorage'da tutulur (sekme kapanınca düşer).
 * Gerçek güvenlik veritabanı/auth aşamasında httpOnly cookie + middleware
 * ile değiştirilecek.
 */
export default function AdminGuard({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setAuthed(window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "1");
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  // İlk render'da flaş önle
  if (!ready) {
    return <div className="min-h-screen bg-section-coffee" aria-hidden />;
  }

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return <>{children}</>;
}
