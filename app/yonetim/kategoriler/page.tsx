"use client";

import { useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, Tags } from "lucide-react";
import { useAdminData } from "@/components/admin/AdminDataProvider";
import {
  AdminPageHeader,
  AdminCard,
  Modal,
  ConfirmDialog,
  adminInput,
  adminLabel,
} from "@/components/admin/AdminUI";
import GradientPicker from "@/components/admin/GradientPicker";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/toast/ToastProvider";
import { slugify } from "@/lib/admin/store";
import { DEFAULT_GRADIENT } from "@/lib/admin/gradients";
import type { AdminCategory } from "@/lib/admin/types";

export default function KategorilerPage() {
  const { data, addCategory, updateCategory, removeCategory } = useAdminData();
  const { toast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);

  // Form alanları
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [gradient, setGradient] = useState(DEFAULT_GRADIENT);

  const openNew = () => {
    setEditTarget(null);
    setName("");
    setDescription("");
    setGradient(DEFAULT_GRADIENT);
    setFormOpen(true);
  };

  const openEdit = (c: AdminCategory) => {
    setEditTarget(c);
    setName(c.name);
    setDescription(c.description);
    setGradient(c.gradient);
    setFormOpen(true);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editTarget) {
      updateCategory(editTarget.slug, {
        name: name.trim(),
        description: description.trim(),
        gradient,
      });
      toast({ title: "Kategori güncellendi", tone: "success" });
    } else {
      // Benzersiz slug üret
      let slug = slugify(name) || "kategori";
      const taken = new Set(data.categories.map((c) => c.slug));
      if (taken.has(slug)) {
        let i = 2;
        while (taken.has(`${slug}-${i}`)) i++;
        slug = `${slug}-${i}`;
      }
      addCategory({
        slug,
        name: name.trim(),
        description: description.trim(),
        gradient,
      });
      toast({ title: "Kategori eklendi", tone: "success" });
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    removeCategory(deleteTarget.slug);
    toast({ title: "Kategori silindi", tone: "info" });
  };

  return (
    <div>
      <AdminPageHeader
        title="Kategoriler"
        description="Ürünlerin gruplandığı koleksiyonlar. Ekleyin, düzenleyin veya kaldırın."
        action={
          <Button variant="gold" size="sm" onClick={openNew}>
            <Plus size={16} strokeWidth={2} />
            Yeni Kategori
          </Button>
        }
      />

      {data.categories.length === 0 ? (
        <AdminCard className="p-12 flex flex-col items-center text-center gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-rose-gold-gradient text-coffee">
            <Tags size={24} strokeWidth={1.5} />
          </span>
          <p className="text-coffee/60 text-sm">Henüz kategori yok.</p>
          <Button variant="gold" size="sm" onClick={openNew}>
            <Plus size={16} strokeWidth={2} />
            İlk kategoriyi ekle
          </Button>
        </AdminCard>
      ) : (
        <AdminCard className="divide-y divide-rose-gold/12 overflow-hidden">
          {data.categories.map((c) => (
            <div
              key={c.slug}
              className="flex items-center gap-4 p-4 sm:p-5 hover:bg-cream-soft/50 transition-colors"
            >
              <div
                className={`h-14 w-14 flex-shrink-0 rounded-2xl bg-gradient-to-br ${c.gradient}`}
                aria-hidden
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg text-coffee leading-tight truncate">
                  {c.name}
                </h3>
                <p className="text-sm text-coffee/55 truncate">
                  {c.description}
                </p>
                <span className="text-[0.7rem] text-rose-goldDark/70 font-mono">
                  /{c.slug}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEdit(c)}
                  aria-label={`${c.name} düzenle`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-gold/25 text-coffee/70 hover:text-bordo hover:border-bordo transition-colors"
                >
                  <Pencil size={15} strokeWidth={1.7} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(c)}
                  aria-label={`${c.name} sil`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-gold/25 text-coffee/70 hover:text-bordo hover:border-bordo transition-colors"
                >
                  <Trash2 size={15} strokeWidth={1.7} />
                </button>
              </div>
            </div>
          ))}
        </AdminCard>
      )}

      {/* Ekle / Düzenle */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editTarget ? "Kategoriyi Düzenle" : "Yeni Kategori"}
      >
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="cat-name" className={adminLabel}>
              Kategori adı
            </label>
            <input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn. Buketler"
              autoFocus
              className={adminInput}
            />
          </div>
          <div>
            <label htmlFor="cat-desc" className={adminLabel}>
              Açıklama
            </label>
            <textarea
              id="cat-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kısa bir tanım"
              rows={2}
              className={`${adminInput} h-auto py-3 resize-none`}
            />
          </div>
          <GradientPicker value={gradient} onChange={setGradient} />

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
        title="Kategoriyi sil"
        message={`"${deleteTarget?.name}" kategorisi silinecek. Bu kategorideki ürünler kategorisiz kalabilir. Devam edilsin mi?`}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
