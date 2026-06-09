"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import {
  cartReducer,
  initialCartState,
  loadFromStorage,
  saveToStorage,
} from "@/lib/cart/reducer";
import type { CartItem, CartState } from "@/lib/cart/types";
import {
  calculateCouponDiscount,
  validateCouponValue,
  type Coupon,
  type CouponValidation,
} from "@/lib/cart/coupons";

const COUPON_KEY = "floria-coupon-v1";

type CartContextValue = {
  state: CartState;
  /** Toplam ürün adedi (badge için) */
  totalQuantity: number;
  /** Sepetteki ürünlerin toplam tutarı (kupon öncesi) */
  subtotal: number;
  /** Aktif kuponun sağladığı indirim TRY */
  discount: number;
  /** Kupon indirimi düşülmüş final tutar */
  total: number;
  /** Aktif kupon (varsa) */
  coupon: Coupon | null;
  applyCoupon: (code: string) => Promise<CouponValidation>;
  removeCoupon: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  updateItem: (productId: string, patch: Partial<CartItem>) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const [coupon, setCoupon] = useState<Coupon | null>(null);

  // İlk render — localStorage'den hydrate et
  useEffect(() => {
    const items = loadFromStorage();
    if (items.length > 0) dispatch({ type: "HYDRATE", items });
    // Kupon hydrate
    try {
      const raw = window.localStorage.getItem(COUPON_KEY);
      if (raw) setCoupon(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  // Sepet değişince localStorage'e yaz
  useEffect(() => {
    saveToStorage(state.items);
  }, [state.items]);

  // Kupon değişince localStorage'e yaz
  useEffect(() => {
    try {
      if (coupon) {
        window.localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
      } else {
        window.localStorage.removeItem(COUPON_KEY);
      }
    } catch {
      /* ignore */
    }
  }, [coupon]);

  // Drawer açıkken body scroll kilidi
  useEffect(() => {
    if (state.drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [state.drawerOpen]);

  const subtotal = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [state.items],
  );
  const couponCode = coupon?.code;

  const validateCouponFromServer = useCallback(
    async (code: string, amount = subtotal): Promise<CouponValidation> => {
      try {
        const res = await fetch("/api/coupon/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, subtotal: amount }),
        });
        const json = (await res.json()) as CouponValidation;
        if (!res.ok || !json.ok) {
          return {
            ok: false,
            reason:
              !json.ok && json.reason
                ? json.reason
                : "Kupon şu anda kontrol edilemedi.",
          };
        }
        return json;
      } catch {
        return { ok: false, reason: "Kupon şu anda kontrol edilemedi." };
      }
    },
    [subtotal],
  );

  // Sepet tutarı veya veritabanındaki kod değişirse kuponu yeniden kontrol et.
  useEffect(() => {
    if (!couponCode) return;
    let active = true;
    void validateCouponFromServer(couponCode, subtotal).then((result) => {
      if (!active) return;
      if (result.ok) {
        setCoupon(result.coupon);
      } else {
        setCoupon(null);
      }
    });
    return () => {
      active = false;
    };
  }, [couponCode, subtotal, validateCouponFromServer]);

  const applyCoupon = useCallback(
    async (code: string): Promise<CouponValidation> => {
      const result = await validateCouponFromServer(code, subtotal);
      if (result.ok) setCoupon(result.coupon);
      return result;
    },
    [subtotal, validateCouponFromServer],
  );

  const removeCoupon = useCallback(() => setCoupon(null), []);

  const value = useMemo<CartContextValue>(() => {
    const totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);
    const validation = coupon ? validateCouponValue(coupon, subtotal) : null;
    const discount =
      validation && validation.ok
        ? validation.discount
        : coupon
          ? calculateCouponDiscount(coupon, subtotal)
          : 0;
    const total = Math.max(0, subtotal - discount);

    return {
      state,
      totalQuantity,
      subtotal,
      discount,
      total,
      coupon,
      applyCoupon,
      removeCoupon,
      addItem: (item, quantity) =>
        dispatch({ type: "ADD", item, quantity }),
      removeItem: (productId) => dispatch({ type: "REMOVE", productId }),
      setQuantity: (productId, quantity) =>
        dispatch({ type: "SET_QUANTITY", productId, quantity }),
      updateItem: (productId, patch) =>
        dispatch({ type: "UPDATE", productId, patch }),
      clear: () => {
        dispatch({ type: "CLEAR" });
        setCoupon(null);
      },
      openDrawer: () => dispatch({ type: "OPEN_DRAWER" }),
      closeDrawer: () => dispatch({ type: "CLOSE_DRAWER" }),
      toggleDrawer: () => dispatch({ type: "TOGGLE_DRAWER" }),
    };
  }, [state, subtotal, coupon, applyCoupon, removeCoupon]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
