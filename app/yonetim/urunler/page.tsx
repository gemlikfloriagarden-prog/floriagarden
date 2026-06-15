"use client";

import { useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, Flower2 } from "lucide-react";
import { useAdminData } from "@/components/admin/AdminDataProvider";
import {
  AdminPageHeader,
  AdminCard,
  Modal,
  ConfirmDialog,
  adminInput,
  adminLabel,
} from "@/components/admin/AdminUI";
import ImageUpload from "@/components/admin/ImageUpload";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/toast/ToastProvider";
import { slugify, makeId } from "@/lib/admin/store";
import { DEFAULT_GRADIENT } from "@/lib/admin/gradients";
import { formatPrice } from "@/lib/utils/format";
import type { AdminProduct, StockState } from "@/lib/admin/types";

const STOCK_LABELS: Record<StockState, string> = {
  var: "Stokta",
  az: "Az kaldı",
  tukendi: "Tükendi",
};

const STOCK_STYLES: Record<StockState, string> = {
  var: "bg-sage/15 text-sage-deep border-sage/30",
  az: "bg-rose-gold/15 text-rose-goldDark border-rose-gold/35",
  tukendi: "bg-bordo/10 text-bordo border-bordo/25",
};

const MAX_PRODUCT_IMAGES = 4;

function productImages(product: Pick<AdminProduct, "image" | "images">): string[] {
  const images = product.images?.length
    ? product.images
    : product.image
      ? [product.image]
      : [];
  return images.filter(Boolean).slice(0, MAX_PRODUCT_IMAGES);
}

export default function UrunlerPage() {
  const { data, addProduct, updateProduct, removeProduct } = useAdminData();
  const { toast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);

  // Form alanları
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState<StockState>("var");
  const [badge, setBadge] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [contents, setContents] = useState(""); // satır satır → dizi
  const [gradient, setGradient] = useState(DEFAULT_GRADIENT);
  const [images, setImages] = useState<string[]>([]);

  const categoryName = (slug: string) =>
    data.categories.find((c) => c.slug === slug)?.name ?? "—";

  const openNew = () => {
    setEditTarget(null);
    setName("");
    setPrice("");
    setCategory(data.categories[0]?.slug ?? "");
    setStock("var");
    setBadge("");
    setShortDescription("");
    setLongDescription("");
    setContents("");
    setGradient(DEFAULT_GRADIENT);
    setImages([]);
    setFormOpen(true);
  };

  const openEdit = (p: AdminProduct) => {
    setEditTarget(p);
    setName(p.name);
    setPrice(String(p.price));
    setCategory(p.category);
    setStock(p.stock);
    setBadge(p.badge ?? "");
    setShortDescription(p.shortDescription);
    setLongDescription(p.longDescription ?? "");
    setContents((p.contents ?? []).join("\n"));
    setGradient(p.gradient);
    setImages(productImages(p));
    setFormOpen(true);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const priceNum = Math.max(0, Math.round(Number(price) || 0));

    const base = {
      name: name.trim(),
      price: priceNum,
      category,
      stock,
      badge: badge.trim() || undefined,
      shortDescription: shortDescription.trim(),
      longDescription: longDescription.trim(),
      contents: contents
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
      gradient,
      image: images[0],
      images: images.slice(0, MAX_PRODUCT_IMAGES),
    };

    if (editTarget) {
      updateProduct(editTarget.id, base);
      toast({ title: "Ürün güncellendi", tone: "success" });
    } else {
      const id = makeId("urun");
      let slug = slugify(name) || "urun";
      const taken = new Set(data.products.map((p) => p.slug));
      if (taken.has(slug)) slug = `${slug}-${id.slice(-4)}`;
      addProduct({ id, slug, ...base });
      toast({ title: "Ürün eklendi", tone: "success" });
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    removeProduct(deleteTarget.id);
    toast({ title: "Ürün silindi", tone: "info" });
  };

  return (
    <div>
      <AdminPageHeader
        title="Ürünler"
        description="Çiçek ve hediyelik ürünleri. Fiyat, kategori ve stok bilgilerini buradan yönetin."
        action={
          <Button variant="gold" size="sm" onClick={openNew}>
            <Plus size={16} strokeWidth={2} />
            Yeni Ürün
          </Button>
        }
      />

      {data.products.length === 0 ? (
        <AdminCard className="p-12 flex flex-col items-center text-center gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-rose-gold-gradient text-coffee">
            <Flower2 size={24} strokeWidth={1.5} />
          </span>
          <p className="text-coffee/60 text-sm">Henüz ürün yok.</p>
          <Button variant="gold" size="sm" onClick={openNew}>
            <Plus size={16} strokeWidth={2} />
            İlk ürünü ekle
          </Button>
        </AdminCard>
      ) : (
        <AdminCard className="divide-y divide-rose-gold/12 overflow-hidden">
          {data.products.map((p) => {
            const image = productImages(p)[0];
            return (
              <div
                key={p.id}
                className="flex items-center gap-4 p-4 sm:p-5 hover:bg-cream-soft/50 transition-colors"
              >
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={p.name}
                    className="h-14 w-14 flex-shrink-0 rounded-2xl object-cover object-center"
                  />
                ) : (
                  <div
                    className={`h-14 w-14 flex-shrink-0 rounded-2xl bg-gradient-to-br ${p.gradient}`}
                    aria-hidden
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display text-lg text-coffee leading-tight truncate">
                      {p.name}
                    </h3>
                    {p.badge && (
                      <span className="inline-flex items-center rounded-full bg-bordo/10 text-bordo px-2 py-0.5 text-[0.6rem] uppercase tracking-wider2">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-coffee/55 truncate">
                    {categoryName(p.category)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-display text-base text-bordo">
                      {formatPrice(p.price)}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.6rem] uppercase tracking-wider2 ${STOCK_STYLES[p.stock]}`}
                    >
                      {STOCK_LABELS[p.stock]}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    aria-label={`${p.name} düzenle`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-gold/25 text-coffee/70 hover:text-bordo hover:border-bordo transition-colors"
                  >
                    <Pencil size={15} strokeWidth={1.7} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(p)}
                    aria-label={`${p.name} sil`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-gold/25 text-coffee/70 hover:text-bordo hover:border-bordo transition-colors"
                  >
                    <Trash2 size={15} strokeWidth={1.7} />
                  </button>
                </div>
              </div>
            );
          })}
        </AdminCard>
      )}

      {/* Ekle / Düzenle */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editTarget ? "Ürünü Düzenle" : "Yeni Ürün"}
        size="lg"
      >
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="p-name" className={adminLabel}>
              Ürün adı
            </label>
            <input
              id="p-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn. Bordo Aşk Buketi"
              autoFocus
              className={adminInput}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="p-price" className={adminLabel}>
                Fiyat (₺)
              </label>
              <input
                id="p-price"
                type="number"
                min={0}
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1450"
                className={adminInput}
              />
            </div>
            <div>
              <label htmlFor="p-cat" className={adminLabel}>
                Kategori
              </label>
              <select
                id="p-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`${adminInput} cursor-pointer`}
                style={{ colorScheme: "light" }}
              >
                {data.categories.length === 0 && (
                  <option value="">Önce kategori ekleyin</option>
                )}
                {data.categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="p-stock" className={adminLabel}>
                Stok durumu
              </label>
              <select
                id="p-stock"
                value={stock}
                onChange={(e) => setStock(e.target.value as StockState)}
                className={`${adminInput} cursor-pointer`}
                style={{ colorScheme: "light" }}
              >
                <option value="var">Stokta</option>
                <option value="az">Az kaldı</option>
                <option value="tukendi">Tükendi</option>
              </select>
            </div>
            <div>
              <label htmlFor="p-badge" className={adminLabel}>
                Rozet (opsiyonel)
              </label>
              <input
                id="p-badge"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Yeni, Çok Satan…"
                className={adminInput}
              />
            </div>
          </div>

          <div>
            <label htmlFor="p-desc" className={adminLabel}>
              Kısa açıklama
            </label>
            <textarea
              id="p-desc"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Ürünü bir cümleyle tanımlayın"
              rows={2}
              className={`${adminInput} h-auto py-3 resize-none`}
            />
          </div>

          <div>
            <label htmlFor="p-long" className={adminLabel}>
              Uzun açıklama (detay sayfası)
            </label>
            <textarea
              id="p-long"
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              placeholder="Ürünün detaylı tanıtımı (opsiyonel)"
              rows={4}
              className={`${adminInput} h-auto py-3 resize-none`}
            />
          </div>

          <div>
            <label htmlFor="p-contents" className={adminLabel}>
              İçindekiler (her satıra bir madde)
            </label>
            <textarea
              id="p-contents"
              value={contents}
              onChange={(e) => setContents(e.target.value)}
              placeholder={"21 adet bordo gül\nKadife ambalaj\nEl yazısı kart"}
              rows={3}
              className={`${adminInput} h-auto py-3 resize-none`}
            />
          </div>

          <ImageUpload
            value={images[0]}
            onChange={(image) => setImages(image ? [image] : [])}
            values={images}
            onImagesChange={(nextImages) =>
              setImages(nextImages.slice(0, MAX_PRODUCT_IMAGES))
            }
            maxImages={MAX_PRODUCT_IMAGES}
            gradient={gradient}
            onGradientChange={setGradient}
            aspect={4 / 5}
          />

          <div className="flex items-center justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFormOpen(false)}
            >
              Vazgeç
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editTarget ? "Kaydet" : "Ekle"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Silme onayı */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Ürünü sil"
        message={`"${deleteTarget?.name}" ürünü silinecek. Devam edilsin mi?`}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
