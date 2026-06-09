"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

/* Ortak input/label stilleri */
export const adminInput =
  "w-full rounded-xl sm:rounded-2xl bg-cream-soft border border-rose-gold/25 px-3.5 sm:px-4 h-11 sm:h-12 text-sm text-coffee placeholder:text-coffee/40 focus:outline-none focus:border-bordo focus:bg-white transition-colors";

export const adminLabel =
  "text-xs uppercase tracking-wider2 text-rose-goldDark mb-1.5 block";

/* Sayfa başlığı + sağ aksiyon */
export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-coffee leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-coffee/60 max-w-xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

/* Beyaz kart kabı */
export function AdminCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl sm:rounded-3xl bg-white border border-rose-gold/20 shadow-soft",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* Modal / Dialog */
export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "md" | "lg";
}) {
  // Escape ile kapat + arka plan kaydırmayı kilitle
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-coffee-deep/55"
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative w-full bg-white shadow-card flex flex-col max-h-[92vh]",
              "rounded-t-3xl sm:rounded-3xl",
              size === "lg" ? "sm:max-w-2xl" : "sm:max-w-lg",
            )}
          >
            <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-rose-gold/15">
              <h2 className="font-display text-2xl text-coffee">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Kapat"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-coffee/15 text-coffee/70 hover:bg-cream hover:text-bordo transition-colors"
              >
                <X size={17} strokeWidth={1.7} />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* Silme onayı */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Sil",
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-bordo/10 text-bordo">
            <AlertTriangle size={18} strokeWidth={1.8} />
          </span>
          <p className="text-sm text-coffee/75 leading-relaxed pt-1.5">
            {message}
          </p>
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Vazgeç
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
