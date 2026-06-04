"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  AdminData,
  AdminCategory,
  AdminProduct,
  Member,
  MemberCode,
} from "@/lib/admin/types";
import { buildSeed } from "@/lib/admin/seed";
import { loadAdminData, saveAdminData, resetAdminData } from "@/lib/admin/store";

type AdminContextValue = {
  data: AdminData;
  hydrated: boolean;
  // Kategoriler
  addCategory: (c: AdminCategory) => void;
  updateCategory: (slug: string, patch: Partial<AdminCategory>) => void;
  removeCategory: (slug: string) => void;
  // Ürünler
  addProduct: (p: AdminProduct) => void;
  updateProduct: (id: string, patch: Partial<AdminProduct>) => void;
  removeProduct: (id: string) => void;
  // Üyeler
  addMemberCode: (memberId: string, code: MemberCode) => void;
  removeMemberCode: (memberId: string, code: string) => void;
  // Demo sıfırla
  reset: () => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AdminData>(() => buildSeed());
  const [hydrated, setHydrated] = useState(false);

  // İlk yüklemede localStorage'dan oku (yoksa seed'ler)
  useEffect(() => {
    setData(loadAdminData());
    setHydrated(true);
  }, []);

  // Her değişiklikte kalıcılaştır (hidrasyon sonrası)
  useEffect(() => {
    if (hydrated) saveAdminData(data);
  }, [data, hydrated]);

  const value: AdminContextValue = {
    data,
    hydrated,

    addCategory: (c) =>
      setData((d) => ({ ...d, categories: [...d.categories, c] })),
    updateCategory: (slug, patch) =>
      setData((d) => ({
        ...d,
        categories: d.categories.map((c) =>
          c.slug === slug ? { ...c, ...patch } : c,
        ),
      })),
    removeCategory: (slug) =>
      setData((d) => ({
        ...d,
        categories: d.categories.filter((c) => c.slug !== slug),
      })),

    addProduct: (p) =>
      setData((d) => ({ ...d, products: [p, ...d.products] })),
    updateProduct: (id, patch) =>
      setData((d) => ({
        ...d,
        products: d.products.map((p) =>
          p.id === id ? { ...p, ...patch } : p,
        ),
      })),
    removeProduct: (id) =>
      setData((d) => ({
        ...d,
        products: d.products.filter((p) => p.id !== id),
      })),

    addMemberCode: (memberId, code) =>
      setData((d) => ({
        ...d,
        members: d.members.map((m) =>
          m.id === memberId ? { ...m, codes: [code, ...m.codes] } : m,
        ),
      })),
    removeMemberCode: (memberId, code) =>
      setData((d) => ({
        ...d,
        members: d.members.map((m) =>
          m.id === memberId
            ? { ...m, codes: m.codes.filter((c) => c.code !== code) }
            : m,
        ),
      })),

    reset: () => setData(resetAdminData()),
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdminData() {
  const ctx = useContext(AdminContext);
  if (!ctx)
    throw new Error("useAdminData, AdminDataProvider içinde kullanılmalı.");
  return ctx;
}
