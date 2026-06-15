"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import Cropper, { type Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { Upload, Pencil, Trash2, Check, X, RefreshCw, ImagePlus } from "lucide-react";
import GradientPicker from "./GradientPicker";
import { adminLabel } from "./AdminUI";

type Props = {
  /** Yüklenen görsel (WebP data URL) — yoksa gradient kullanılır */
  value?: string;
  onChange: (image: string | undefined) => void;
  /** Çoklu ürün görseli modu. İlk görsel ana görsel olarak kullanılır. */
  values?: string[];
  onImagesChange?: (images: string[]) => void;
  maxImages?: number;
  /** Görsel yokken kullanılacak yer tutucu gradient */
  gradient: string;
  onGradientChange: (gradient: string) => void;
  /** Kırpma oranı (genişlik/yükseklik) */
  aspect?: number;
};

const MAX_OUTPUT_WIDTH = 1000;
const WEBP_QUALITY = 0.82;
const DEFAULT_MAX_IMAGES = 4;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Seçilen alanı kırpıp WebP data URL döndürür. */
async function cropToWebp(src: string, area: Area): Promise<string> {
  const img = await loadImage(src);
  const scale = Math.min(1, MAX_OUTPUT_WIDTH / area.width);
  const w = Math.max(1, Math.round(area.width * scale));
  const h = Math.max(1, Math.round(area.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas yok");
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, w, h);

  // Tüm formatlar burada WebP'e çevrilir.
  return canvas.toDataURL("image/webp", WEBP_QUALITY);
}

export default function ImageUpload({
  value,
  onChange,
  values,
  onImagesChange,
  maxImages = DEFAULT_MAX_IMAGES,
  gradient,
  onGradientChange,
  aspect = 5 / 4,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pickIndexRef = useRef<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [source, setSource] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPixels, setAreaPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const multiMode = Boolean(values && onImagesChange);
  const imageLimit = Math.max(1, Math.min(DEFAULT_MAX_IMAGES, maxImages));
  const imageList = multiMode
    ? (values ?? []).filter(Boolean).slice(0, imageLimit)
    : value
      ? [value]
      : [];
  const activeImage = imageList[selectedIndex] ?? imageList[0];
  const canAdd = imageList.length < imageLimit;

  useEffect(() => {
    if (!multiMode) return;
    setSelectedIndex((current) =>
      imageList.length === 0 ? 0 : Math.min(current, imageList.length - 1),
    );
  }, [imageList.length, multiMode]);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setAreaPixels(pixels);
  }, []);

  const startEditing = (src: string, targetIndex: number | null = null) => {
    setSource(src);
    setEditIndex(targetIndex);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setAreaPixels(null);
    setFailed(false);
    setEditing(true);
  };

  const pickFile = (targetIndex: number | null = null) => {
    pickIndexRef.current = targetIndex;
    fileInputRef.current?.click();
  };

  const onPickFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // aynı dosya tekrar seçilebilsin
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const targetIndex = multiMode
      ? (pickIndexRef.current ?? Math.min(imageList.length, imageLimit - 1))
      : 0;
    pickIndexRef.current = null;
    const reader = new FileReader();
    reader.onload = () => startEditing(reader.result as string, targetIndex);
    reader.readAsDataURL(file);
  };

  const applyCrop = async () => {
    if (!source || !areaPixels) return;
    setBusy(true);
    setFailed(false);
    try {
      const webp = await cropToWebp(source, areaPixels);
      if (multiMode && onImagesChange) {
        const next = [...imageList];
        const targetIndex = editIndex ?? Math.min(next.length, imageLimit - 1);
        if (targetIndex < imageLimit) {
          next[targetIndex] = webp;
          const clean = next.filter(Boolean).slice(0, imageLimit);
          onImagesChange(clean);
          setSelectedIndex(Math.min(targetIndex, clean.length - 1));
        }
      } else {
        onChange(webp);
      }
      setEditing(false);
      setSource(null);
      setEditIndex(null);
    } catch {
      // Görsel işlenemedi — düzenleme açık kalır, kullanıcı tekrar deneyebilir
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setSource(null);
    setEditIndex(null);
  };

  const removeImage = (index: number) => {
    if (multiMode && onImagesChange) {
      const next = imageList.filter((_, imageIndex) => imageIndex !== index);
      onImagesChange(next);
      setSelectedIndex(next.length === 0 ? 0 : Math.min(index, next.length - 1));
      return;
    }
    onChange(undefined);
  };

  const makeMain = (index: number) => {
    if (!multiMode || !onImagesChange || index <= 0) return;
    const next = [
      imageList[index],
      ...imageList.filter((_, imageIndex) => imageIndex !== index),
    ].filter(Boolean);
    onImagesChange(next);
    setSelectedIndex(0);
  };

  return (
    <div>
      <span className={adminLabel}>{multiMode ? "Görseller" : "Görsel"}</span>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onPickFile}
        className="hidden"
      />

      {/* ── Düzenleme (kırpma) modu ── */}
      {editing && source ? (
        <div className="flex flex-col gap-3">
          <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-coffee-deep">
            <Cropper
              image={source}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              showGrid
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-coffee/55 whitespace-nowrap">
              Yakınlaştır
            </span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              aria-label="Yakınlaştırma"
              className="flex-1 accent-bordo cursor-pointer"
            />
          </div>

          <p className="text-xs text-coffee/45">
            Sürükleyerek konumlandırın, kaydırıcıyla yakınlaştırın. Kaydedince
            otomatik WebP&apos;e çevrilir.
          </p>

          {failed && (
            <p className="text-xs text-bordo">
              Görsel işlenemedi. Lütfen başka bir fotoğraf deneyin.
            </p>
          )}

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-gold/30 text-coffee/70 hover:text-bordo hover:border-bordo px-4 h-10 text-sm transition-colors"
            >
              <X size={15} strokeWidth={1.8} />
              İptal
            </button>
            <button
              type="button"
              onClick={applyCrop}
              disabled={busy || !areaPixels}
              className="inline-flex items-center gap-1.5 rounded-full bg-bordo text-cream hover:bg-bordo-dark px-5 h-10 text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Check size={15} strokeWidth={2} />
              {busy ? "İşleniyor…" : "Uygula"}
            </button>
          </div>
        </div>
      ) : multiMode ? (
        imageList.length > 0 && activeImage ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_14rem]">
              <div
                className="relative w-full overflow-hidden rounded-2xl border border-rose-gold/20"
                style={{ aspectRatio: String(aspect) }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeImage}
                  alt={`Ürün görseli ${selectedIndex + 1}`}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[0.65rem] uppercase tracking-wider2 text-bordo shadow-soft">
                  {selectedIndex === 0 ? "Ana görsel" : `Görsel ${selectedIndex + 1}`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                <div>
                  <p className="mb-1.5 text-[0.65rem] uppercase tracking-wider2 text-coffee/45">
                    Mobil kart
                  </p>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-rose-gold/15 bg-cream-soft">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeImage}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-1.5 text-[0.65rem] uppercase tracking-wider2 text-coffee/45">
                    Masaüstü kart
                  </p>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-rose-gold/15 bg-cream-soft">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeImage}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {imageList.map((image, index) => (
                <div key={`${image.slice(0, 32)}-${index}`} className="relative">
                  <button
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    aria-label={`Görsel ${index + 1}`}
                    aria-pressed={selectedIndex === index}
                    className={`relative aspect-[4/5] w-full overflow-hidden rounded-xl border-2 transition-colors ${
                      selectedIndex === index
                        ? "border-bordo"
                        : "border-rose-gold/20 hover:border-rose-gold/50"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                    <span className="absolute bottom-1 left-1 rounded-full bg-white/90 px-2 py-0.5 text-[0.55rem] uppercase tracking-wide text-bordo">
                      {index === 0 ? "Ana" : index + 1}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    aria-label={`Görsel ${index + 1} kaldır`}
                    className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/95 text-coffee/70 shadow-soft hover:text-bordo"
                  >
                    <Trash2 size={12} strokeWidth={1.9} />
                  </button>
                </div>
              ))}
              {canAdd && (
                <button
                  type="button"
                  onClick={() => pickFile(null)}
                  className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-rose-gold/30 bg-cream-soft/60 text-coffee/55 transition-colors hover:border-bordo hover:text-bordo"
                >
                  <Upload size={16} strokeWidth={1.8} />
                  <span className="text-[0.65rem]">Ekle</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => startEditing(activeImage, selectedIndex)}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-rose-gold/30 px-4 text-sm text-coffee/75 transition-colors hover:border-bordo hover:text-bordo"
              >
                <Pencil size={14} strokeWidth={1.8} />
                Düzenle
              </button>
              <button
                type="button"
                onClick={() => pickFile(selectedIndex)}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-rose-gold/30 px-4 text-sm text-coffee/75 transition-colors hover:border-bordo hover:text-bordo"
              >
                <RefreshCw size={14} strokeWidth={1.8} />
                Değiştir
              </button>
              {selectedIndex > 0 && (
                <button
                  type="button"
                  onClick={() => makeMain(selectedIndex)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full border border-rose-gold/30 px-4 text-sm text-coffee/75 transition-colors hover:border-bordo hover:text-bordo"
                >
                  Ana yap
                </button>
              )}
              {canAdd && (
                <button
                  type="button"
                  onClick={() => pickFile(null)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full border border-rose-gold/30 px-4 text-sm text-coffee/75 transition-colors hover:border-bordo hover:text-bordo"
                >
                  <Upload size={14} strokeWidth={1.8} />
                  Fotoğraf ekle
                </button>
              )}
            </div>

            <p className="text-xs text-coffee/45">
              En fazla {imageLimit} görsel yüklenir. İlk görsel ürün kartlarında
              ana görsel olarak kullanılır.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => pickFile(null)}
              className="group flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-rose-gold/30 bg-cream-soft/60 px-6 py-8 transition-colors hover:border-bordo hover:bg-cream-soft"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-gold-gradient text-coffee">
                <Upload size={20} strokeWidth={1.7} />
              </span>
              <span className="text-sm font-medium text-coffee">
                Fotoğraf Yükle
              </span>
              <span className="text-center text-xs text-coffee/50">
                En fazla {imageLimit} görsel — JPG, PNG, HEIC, WebP
              </span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1.5 text-[0.65rem] uppercase tracking-wider2 text-coffee/45">
                  Mobil kart
                </p>
                <div className={`aspect-[3/4] rounded-xl bg-gradient-to-br ${gradient}`} />
              </div>
              <div>
                <p className="mb-1.5 text-[0.65rem] uppercase tracking-wider2 text-coffee/45">
                  Masaüstü kart
                </p>
                <div className={`aspect-[4/5] rounded-xl bg-gradient-to-br ${gradient}`} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-rose-gold/15" />
              <span className="text-[0.65rem] uppercase tracking-wider2 text-coffee/40">
                veya hazır renk
              </span>
              <span className="h-px flex-1 bg-rose-gold/15" />
            </div>

            <div className="flex items-start gap-2 text-coffee/45">
              <ImagePlus size={14} strokeWidth={1.7} className="mt-0.5 flex-shrink-0" />
              <p className="text-xs leading-relaxed">
                Fotoğraf yüklemezseniz aşağıdaki renk yer tutucu kullanılır.
              </p>
            </div>

            <GradientPicker value={gradient} onChange={onGradientChange} hideLabel />
          </div>
        )
      ) : value ? (
        /* ── Yüklü görsel önizleme ── */
        <div className="flex flex-col gap-3">
          <div
            className="relative w-full overflow-hidden rounded-2xl border border-rose-gold/20"
            style={{ aspectRatio: String(aspect) }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Yüklenen görsel"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => startEditing(value)}
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-gold/30 text-coffee/75 hover:text-bordo hover:border-bordo px-4 h-10 text-sm transition-colors"
            >
              <Pencil size={14} strokeWidth={1.8} />
              Düzenle
            </button>
            <button
              type="button"
              onClick={() => pickFile(0)}
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-gold/30 text-coffee/75 hover:text-bordo hover:border-bordo px-4 h-10 text-sm transition-colors"
            >
              <RefreshCw size={14} strokeWidth={1.8} />
              Değiştir
            </button>
            <button
              type="button"
              onClick={() => removeImage(0)}
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-gold/30 text-coffee/75 hover:text-bordo hover:border-bordo px-4 h-10 text-sm transition-colors"
            >
              <Trash2 size={14} strokeWidth={1.8} />
              Kaldır
            </button>
          </div>
        </div>
      ) : (
        /* ── Boş: yükleme + gradient yer tutucu ── */
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => pickFile(null)}
            className="group flex flex-col items-center justify-center gap-2 w-full rounded-2xl border-2 border-dashed border-rose-gold/30 hover:border-bordo bg-cream-soft/60 hover:bg-cream-soft px-6 py-8 transition-colors"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-gold-gradient text-coffee">
              <Upload size={20} strokeWidth={1.7} />
            </span>
            <span className="text-sm font-medium text-coffee">
              Fotoğraf Yükle
            </span>
            <span className="text-xs text-coffee/50 text-center">
              JPG, PNG, HEIC, WebP… — otomatik WebP&apos;e çevrilir
            </span>
          </button>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-rose-gold/15" />
            <span className="text-[0.65rem] uppercase tracking-wider2 text-coffee/40">
              veya hazır renk
            </span>
            <span className="h-px flex-1 bg-rose-gold/15" />
          </div>

          <div className="flex items-start gap-2 text-coffee/45">
            <ImagePlus size={14} strokeWidth={1.7} className="mt-0.5 flex-shrink-0" />
            <p className="text-xs leading-relaxed">
              Fotoğraf yüklemezseniz aşağıdaki renk yer tutucu kullanılır.
            </p>
          </div>

          <GradientPicker value={gradient} onChange={onGradientChange} hideLabel />
        </div>
      )}
    </div>
  );
}
