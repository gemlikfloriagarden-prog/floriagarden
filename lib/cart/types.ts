export type CartItem = {
  productId: string;
  name: string;
  price: number;
  gradient: string;
  quantity: number;
  /** Hediye kartı notu */
  cardNote?: string;
  /** Teslimat bölgesi */
  deliveryRegion?: "gemlik" | "sehir-disi";
  /** Teslimat günü (ISO tarih) */
  deliveryDate?: string;
  /** Teslimat saat aralığı */
  deliverySlot?: string;
  /** Açık teslimat adresi (her bölgede zorunlu) */
  deliveryAddress?: string;
  /** Alıcı adı (opsiyonel) */
  recipientName?: string;
  /** Alıcı telefonu (opsiyonel) */
  recipientPhone?: string;
  /** Paket seviyesi */
  giftWrap?: "standart" | "premium" | "luks";
};

export type CartState = {
  items: CartItem[];
  /** Sepet draw'er açık mı (UI durumu) */
  drawerOpen: boolean;
};

export type CartAction =
  | { type: "ADD"; item: Omit<CartItem, "quantity">; quantity?: number }
  | { type: "REMOVE"; productId: string }
  | { type: "SET_QUANTITY"; productId: string; quantity: number }
  | { type: "UPDATE"; productId: string; patch: Partial<CartItem> }
  | { type: "CLEAR" }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "TOGGLE_DRAWER" }
  | { type: "HYDRATE"; items: CartItem[] };
