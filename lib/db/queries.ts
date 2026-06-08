import { query, execute } from "./mysql";
import { seedDelivery } from "@/lib/admin/seed";
import { CATEGORIES } from "@/lib/data/categories";
import { PRODUCTS } from "@/lib/data/products";
import type {
  AdminData,
  AdminCategory,
  AdminProduct,
  Member,
  MemberCode,
  GeneralCode,
  DeliveryZone,
  DeliveryStep,
  Order,
  OrderItem,
} from "@/lib/admin/types";
import type { Product } from "@/lib/data/products";
import type { Category } from "@/lib/data/categories";

/* ════════════════════════════════════════════════
   Satır → uygulama tipi eşlemeleri
   ════════════════════════════════════════════════ */

type Row = Record<string, unknown>;

const s = (v: unknown): string => (v == null ? "" : String(v));
const n = (v: unknown): number => (v == null ? 0 : Number(v));
const opt = (v: unknown): string | undefined =>
  v == null || v === "" ? undefined : String(v);

function toCategory(r: Row): AdminCategory {
  return {
    slug: s(r.slug),
    name: s(r.name),
    description: s(r.description),
    gradient: s(r.gradient),
    image: opt(r.image),
  };
}

function toProduct(r: Row): AdminProduct {
  return {
    id: s(r.id),
    slug: s(r.slug),
    name: s(r.name),
    shortDescription: s(r.short_description),
    longDescription: s(r.long_description),
    contents: arr(r.contents),
    price: n(r.price),
    category: s(r.category),
    stock: (s(r.stock) || "var") as AdminProduct["stock"],
    badge: opt(r.badge),
    gradient: s(r.gradient),
    image: opt(r.image),
  };
}

function toGeneralCode(r: Row): GeneralCode {
  return {
    code: s(r.code),
    discountType: s(r.discount_type) === "fixed" ? "fixed" : "percent",
    discountValue: n(r.discount_value),
    note: opt(r.note),
    createdAt: s(r.created_at),
  };
}

function toDeliveryZone(r: Row): DeliveryZone {
  return {
    id: s(r.id),
    name: s(r.name),
    eta: s(r.eta),
    fee: s(r.fee),
    note: s(r.note),
  };
}

function toDeliveryStep(r: Row): DeliveryStep {
  return {
    id: s(r.id),
    icon: s(r.icon) || "sparkles",
    title: s(r.title),
    text: s(r.text),
  };
}

/* ════════════════════════════════════════════════
   OKUMA — tüm admin verisi
   ════════════════════════════════════════════════ */

export async function getAdminData(): Promise<AdminData> {
  const [
    categories,
    products,
    memberRows,
    memberCodeRows,
    generalCodes,
    zones,
    steps,
    orderRows,
    orderItemRows,
  ] = await Promise.all([
    query<Row>("SELECT * FROM categories ORDER BY sort_order, name"),
    query<Row>("SELECT * FROM products ORDER BY sort_order, created_at DESC"),
    query<Row>("SELECT * FROM members ORDER BY joined_at DESC"),
    query<Row>("SELECT * FROM member_codes ORDER BY created_at DESC"),
    query<Row>("SELECT * FROM general_codes ORDER BY created_at DESC"),
    query<Row>("SELECT * FROM delivery_zones ORDER BY sort_order, name"),
    query<Row>("SELECT * FROM delivery_steps ORDER BY sort_order"),
    query<Row>("SELECT * FROM orders ORDER BY created_at DESC"),
    query<Row>("SELECT * FROM order_items"),
  ]);

  const codesByMember = new Map<string, MemberCode[]>();
  for (const r of memberCodeRows) {
    const mid = s(r.member_id);
    const code: MemberCode = {
      code: s(r.code),
      discountType: s(r.discount_type) === "fixed" ? "fixed" : "percent",
      discountValue: n(r.discount_value),
      note: opt(r.note),
      createdAt: s(r.created_at),
    };
    (codesByMember.get(mid) ?? codesByMember.set(mid, []).get(mid)!).push(code);
  }

  const members: Member[] = memberRows.map((r) => ({
    id: s(r.id),
    name: s(r.name),
    phone: s(r.phone),
    email: s(r.email),
    birthDate: opt(r.birth_date),
    joinedAt: s(r.joined_at),
    codes: codesByMember.get(s(r.id)) ?? [],
  }));

  const itemsByOrder = new Map<string, OrderItem[]>();
  for (const r of orderItemRows) {
    const oid = s(r.order_id);
    const item: OrderItem = {
      productId: opt(r.product_id),
      name: s(r.name),
      price: n(r.price),
      quantity: n(r.quantity),
    };
    (itemsByOrder.get(oid) ?? itemsByOrder.set(oid, []).get(oid)!).push(item);
  }

  const orders: Order[] = orderRows.map((r) => ({
    id: s(r.id),
    orderNo: s(r.order_no),
    createdAt: s(r.created_at),
    customerName: s(r.customer_name),
    customerPhone: s(r.customer_phone),
    customerEmail: opt(r.customer_email),
    recipientName: s(r.recipient_name),
    recipientPhone: s(r.recipient_phone),
    address: s(r.address),
    surprise: n(r.surprise) === 1,
    items: itemsByOrder.get(s(r.id)) ?? [],
    deliveryZone: s(r.delivery_zone),
    deliveryDate: s(r.delivery_date),
    deliverySlot: s(r.delivery_slot),
    payment: (s(r.payment) || "nakit") as Order["payment"],
    status: (s(r.status) || "yeni") as Order["status"],
    cardNote: s(r.card_note),
    adminNote: s(r.admin_note),
  }));

  return {
    categories: categories.map(toCategory),
    products: products.map(toProduct),
    members,
    generalCodes: generalCodes.map(toGeneralCode),
    deliveryZones: zones.map(toDeliveryZone),
    deliveryProcess: steps.map(toDeliveryStep),
    orders,
  };
}

/* ════════════════════════════════════════════════
   OKUMA — public (DB'den)
   ════════════════════════════════════════════════ */

export async function getCategories(): Promise<AdminCategory[]> {
  const rows = await query<Row>(
    "SELECT * FROM categories ORDER BY sort_order, name",
  );
  return rows.map(toCategory);
}

export async function getProducts(): Promise<AdminProduct[]> {
  const rows = await query<Row>(
    "SELECT * FROM products ORDER BY sort_order, created_at DESC",
  );
  return rows.map(toProduct);
}

export async function getProductBySlug(
  slug: string,
): Promise<AdminProduct | null> {
  const rows = await query<Row>("SELECT * FROM products WHERE slug = ? LIMIT 1", [
    slug,
  ]);
  return rows[0] ? toProduct(rows[0]) : null;
}

export async function getDelivery(): Promise<{
  deliveryZones: DeliveryZone[];
  deliveryProcess: DeliveryStep[];
}> {
  try {
    const [zones, steps] = await Promise.all([
      query<Row>("SELECT * FROM delivery_zones ORDER BY sort_order, name"),
      query<Row>("SELECT * FROM delivery_steps ORDER BY sort_order"),
    ]);
    return {
      deliveryZones: zones.map(toDeliveryZone),
      deliveryProcess: steps.map(toDeliveryStep),
    };
  } catch {
    return seedDelivery();
  }
}

/* ── Public: tam Product / Category (sitenin gösterdiği) ── */

function arr(v: unknown): string[] {
  if (v == null) return [];
  try {
    const p = JSON.parse(String(v));
    return Array.isArray(p) ? p.map(String) : [];
  } catch {
    return [];
  }
}

function toFullProduct(r: Row): Product {
  return {
    id: s(r.id),
    slug: s(r.slug),
    name: s(r.name),
    shortDescription: s(r.short_description),
    longDescription: s(r.long_description),
    contents: arr(r.contents),
    careTips: arr(r.care_tips),
    price: n(r.price),
    category: s(r.category),
    badge: opt(r.badge),
    gradient: s(r.gradient),
    image: opt(r.image),
    galleryGradients: undefined,
    pairings: arr(r.pairings),
    dimensions: opt(r.dimensions),
    stock: (s(r.stock) || "var") as Product["stock"],
  };
}

function toFullCategory(r: Row): Category {
  return {
    slug: s(r.slug),
    name: s(r.name),
    description: s(r.description),
    gradient: s(r.gradient),
    accent: "bordo",
    image: opt(r.image),
  };
}

export async function getPublicCategories(): Promise<Category[]> {
  try {
    const rows = await query<Row>(
      "SELECT * FROM categories ORDER BY sort_order, name",
    );
    return rows.map(toFullCategory);
  } catch {
    return CATEGORIES;
  }
}

export async function getPublicProducts(): Promise<Product[]> {
  try {
    const rows = await query<Row>(
      "SELECT * FROM products ORDER BY sort_order, created_at DESC",
    );
    return rows.map(toFullProduct);
  } catch {
    return PRODUCTS;
  }
}

export async function getPublicProductsByCategory(
  category: string,
): Promise<Product[]> {
  try {
    const rows = await query<Row>(
      "SELECT * FROM products WHERE category = ? ORDER BY sort_order, created_at DESC",
      [category],
    );
    return rows.map(toFullProduct);
  } catch {
    return PRODUCTS.filter((product) => product.category === category);
  }
}

export async function getPublicProductBySlug(
  slug: string,
): Promise<Product | null> {
  try {
    const rows = await query<Row>(
      "SELECT * FROM products WHERE slug = ? LIMIT 1",
      [slug],
    );
    return rows[0] ? toFullProduct(rows[0]) : null;
  } catch {
    return PRODUCTS.find((product) => product.slug === slug) ?? null;
  }
}

export async function getPublicCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  try {
    const rows = await query<Row>(
      "SELECT * FROM categories WHERE slug = ? LIMIT 1",
      [slug],
    );
    return rows[0] ? toFullCategory(rows[0]) : null;
  } catch {
    return CATEGORIES.find((category) => category.slug === slug) ?? null;
  }
}

/* ════════════════════════════════════════════════
   AYARLAR (bakım modu vb.)
   ════════════════════════════════════════════════ */

export async function getSetting(key: string): Promise<string | null> {
  const rows = await query<Row>(
    "SELECT `value` FROM settings WHERE `key` = ? LIMIT 1",
    [key],
  );
  return rows[0] ? s(rows[0].value) : null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await execute(
    "INSERT INTO settings (`key`,`value`) VALUES (?,?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)",
    [key, value],
  );
}

/* ════════════════════════════════════════════════
   YAZMA — kategoriler
   ════════════════════════════════════════════════ */

export async function createCategory(c: AdminCategory) {
  await execute(
    "INSERT INTO categories (slug,name,description,gradient,image) VALUES (?,?,?,?,?)",
    [c.slug, c.name, c.description, c.gradient, c.image ?? null],
  );
}

export async function updateCategory(slug: string, c: AdminCategory) {
  await execute(
    "UPDATE categories SET name=?, description=?, gradient=?, image=? WHERE slug=?",
    [c.name, c.description, c.gradient, c.image ?? null, slug],
  );
}

export async function deleteCategory(slug: string) {
  await execute("DELETE FROM categories WHERE slug=?", [slug]);
}

/* ════════════════════════════════════════════════
   YAZMA — ürünler
   ════════════════════════════════════════════════ */

export async function createProduct(p: AdminProduct) {
  await execute(
    "INSERT INTO products (id,slug,name,short_description,long_description,contents,price,category,badge,gradient,image,stock) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      p.id,
      p.slug,
      p.name,
      p.shortDescription,
      p.longDescription ?? "",
      JSON.stringify(p.contents ?? []),
      p.price,
      p.category,
      p.badge ?? null,
      p.gradient,
      p.image ?? null,
      p.stock,
    ],
  );
}

export async function updateProduct(id: string, p: AdminProduct) {
  await execute(
    "UPDATE products SET slug=?, name=?, short_description=?, long_description=?, contents=?, price=?, category=?, badge=?, gradient=?, image=?, stock=? WHERE id=?",
    [
      p.slug,
      p.name,
      p.shortDescription,
      p.longDescription ?? "",
      JSON.stringify(p.contents ?? []),
      p.price,
      p.category,
      p.badge ?? null,
      p.gradient,
      p.image ?? null,
      p.stock,
      id,
    ],
  );
}

export async function deleteProduct(id: string) {
  await execute("DELETE FROM products WHERE id=?", [id]);
}

/* ════════════════════════════════════════════════
   YAZMA — üye kodları
   ════════════════════════════════════════════════ */

export async function createMember(m: {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthDate?: string;
  passwordHash?: string;
}) {
  await execute(
    "INSERT INTO members (id,name,phone,email,birth_date,password_hash) VALUES (?,?,?,?,?,?)",
    [m.id, m.name, m.phone, m.email, m.birthDate || null, m.passwordHash || null],
  );
}

export async function memberExistsByEmail(email: string): Promise<boolean> {
  if (!email) return false;
  const rows = await query<Row>(
    "SELECT id FROM members WHERE LOWER(TRIM(email)) = LOWER(TRIM(?)) LIMIT 1",
    [email],
  );
  return rows.length > 0;
}

/** Giriş için: e-postaya göre id + şifre hash'i. */
export async function getMemberAuthByEmail(
  email: string,
): Promise<{ id: string; passwordHash: string } | null> {
  const rows = await query<Row>(
    "SELECT id, password_hash FROM members WHERE LOWER(TRIM(email)) = LOWER(TRIM(?)) AND password_hash IS NOT NULL AND password_hash <> '' ORDER BY joined_at DESC LIMIT 1",
    [email],
  );
  if (!rows[0]) return null;
  return { id: s(rows[0].id), passwordHash: s(rows[0].password_hash) };
}

/** Hesabım sayfası için: üye + kodları. */
export async function getMemberWithCodes(id: string): Promise<Member | null> {
  const rows = await query<Row>("SELECT * FROM members WHERE id = ? LIMIT 1", [
    id,
  ]);
  const r = rows[0];
  if (!r) return null;
  const codeRows = await query<Row>(
    "SELECT * FROM member_codes WHERE member_id = ? ORDER BY created_at DESC",
    [id],
  );
  return {
    id: s(r.id),
    name: s(r.name),
    phone: s(r.phone),
    email: s(r.email),
    birthDate: opt(r.birth_date),
    joinedAt: s(r.joined_at),
    codes: codeRows.map((c) => ({
      code: s(c.code),
      discountType: s(c.discount_type) === "fixed" ? "fixed" : "percent",
      discountValue: n(c.discount_value),
      note: opt(c.note),
      createdAt: s(c.created_at),
    })),
  };
}

export async function addMemberCode(memberId: string, c: MemberCode) {
  await execute(
    "INSERT INTO member_codes (code,member_id,discount_type,discount_value,note) VALUES (?,?,?,?,?)",
    [c.code, memberId, c.discountType, c.discountValue, c.note ?? null],
  );
}

export async function removeMemberCode(code: string) {
  await execute("DELETE FROM member_codes WHERE code=?", [code]);
}

export async function deleteMember(id: string) {
  await execute("DELETE FROM members WHERE id=?", [id]);
}

/* ════════════════════════════════════════════════
   YAZMA — genel kodlar
   ════════════════════════════════════════════════ */

export async function addGeneralCode(c: GeneralCode) {
  await execute(
    "INSERT INTO general_codes (code,discount_type,discount_value,note) VALUES (?,?,?,?)",
    [c.code, c.discountType, c.discountValue, c.note ?? null],
  );
}

export async function removeGeneralCode(code: string) {
  await execute("DELETE FROM general_codes WHERE code=?", [code]);
}

/* ════════════════════════════════════════════════
   YAZMA — teslimat
   ════════════════════════════════════════════════ */

export async function createDeliveryZone(z: DeliveryZone) {
  await execute(
    "INSERT INTO delivery_zones (id,name,eta,fee,note) VALUES (?,?,?,?,?)",
    [z.id, z.name, z.eta, z.fee, z.note],
  );
}

export async function updateDeliveryZone(id: string, z: DeliveryZone) {
  await execute(
    "UPDATE delivery_zones SET name=?, eta=?, fee=?, note=? WHERE id=?",
    [z.name, z.eta, z.fee, z.note, id],
  );
}

export async function deleteDeliveryZone(id: string) {
  await execute("DELETE FROM delivery_zones WHERE id=?", [id]);
}

export async function createDeliveryStep(st: DeliveryStep) {
  await execute(
    "INSERT INTO delivery_steps (id,icon,title,text) VALUES (?,?,?,?)",
    [st.id, st.icon, st.title, st.text],
  );
}

export async function updateDeliveryStep(id: string, st: DeliveryStep) {
  await execute("UPDATE delivery_steps SET icon=?, title=?, text=? WHERE id=?", [
    st.icon,
    st.title,
    st.text,
    id,
  ]);
}

export async function deleteDeliveryStep(id: string) {
  await execute("DELETE FROM delivery_steps WHERE id=?", [id]);
}

/* ════════════════════════════════════════════════
   YAZMA — siparişler
   ════════════════════════════════════════════════ */

export async function createOrder(o: Order) {
  await execute(
    `INSERT INTO orders
     (id,order_no,customer_name,customer_phone,customer_email,recipient_name,recipient_phone,address,surprise,delivery_zone,delivery_date,delivery_slot,payment,status,card_note,admin_note)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      o.id,
      o.orderNo,
      o.customerName,
      o.customerPhone,
      o.customerEmail ?? null,
      o.recipientName,
      o.recipientPhone,
      o.address,
      o.surprise ? 1 : 0,
      o.deliveryZone,
      o.deliveryDate || null,
      o.deliverySlot,
      o.payment,
      o.status,
      o.cardNote,
      o.adminNote,
    ],
  );
  for (const it of o.items) {
    await execute(
      "INSERT INTO order_items (order_id,product_id,name,price,quantity) VALUES (?,?,?,?,?)",
      [o.id, it.productId ?? null, it.name, it.price, it.quantity],
    );
  }
}

export async function updateOrder(id: string, o: Order) {
  await execute(
    `UPDATE orders SET
      order_no=?, customer_name=?, customer_phone=?, customer_email=?, recipient_name=?, recipient_phone=?,
      address=?, surprise=?, delivery_zone=?, delivery_date=?, delivery_slot=?,
      payment=?, status=?, card_note=?, admin_note=?
     WHERE id=?`,
    [
      o.orderNo,
      o.customerName,
      o.customerPhone,
      o.customerEmail ?? null,
      o.recipientName,
      o.recipientPhone,
      o.address,
      o.surprise ? 1 : 0,
      o.deliveryZone,
      o.deliveryDate || null,
      o.deliverySlot,
      o.payment,
      o.status,
      o.cardNote,
      o.adminNote,
      id,
    ],
  );
  // Kalemleri sil-yeniden ekle (basit ve güvenli)
  await execute("DELETE FROM order_items WHERE order_id=?", [id]);
  for (const it of o.items) {
    await execute(
      "INSERT INTO order_items (order_id,product_id,name,price,quantity) VALUES (?,?,?,?,?)",
      [id, it.productId ?? null, it.name, it.price, it.quantity],
    );
  }
}

export async function deleteOrder(id: string) {
  await execute("DELETE FROM orders WHERE id=?", [id]);
}
