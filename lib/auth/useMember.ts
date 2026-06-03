"use client";

import { useEffect, useState } from "react";

/**
 * Üyelik durumu (placeholder).
 * Şu an localStorage'daki "floria-member" anahtarını okur (varsayılan: üye değil).
 * Gerçek auth (Clerk / NextAuth / Supabase) bağlanınca burası onların
 * oturum durumuyla değiştirilecek — çağıran bileşenler aynı kalır.
 */
export function useMember(): boolean {
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    try {
      setIsMember(window.localStorage.getItem("floria-member") === "1");
    } catch {
      /* ignore */
    }
  }, []);

  return isMember;
}
