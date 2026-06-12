"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Check, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ToastTone = "success" | "info" | "warning";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  tone?: ToastTone;
  /** Otomatik kapanma süresi (ms). 0 verilirse manuel kapatılır. */
  duration?: number;
};

type ToastContextValue = {
  toast: (input: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS = {
  success: Check,
  info: Info,
  warning: AlertTriangle,
} as const;

const TONE_CLASSES: Record<ToastTone, string> = {
  success: "border-rose-gold/50",
  info: "border-coffee/15",
  warning: "border-bordo/40",
};

const ICON_BG: Record<ToastTone, string> = {
  success: "bg-rose-gold-gradient text-coffee",
  info: "bg-coffee/10 text-coffee",
  warning: "bg-bordo text-cream",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: string) => {
    setToasts((arr) => arr.filter((t) => t.id !== id));
    const timer = timersRef.current[id];
    if (timer) {
      clearTimeout(timer);
      delete timersRef.current[id];
    }
  }, []);

  const toast = useCallback(
    (input: Omit<Toast, "id">) => {
      const id = `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
      const item: Toast = { tone: "success", duration: 3500, ...input, id };
      setToasts((arr) => [...arr, item]);
      if ((item.duration ?? 0) > 0) {
        timersRef.current[id] = setTimeout(
          () => dismiss(id),
          item.duration,
        );
      }
      return id;
    },
    [dismiss],
  );

  // Cleanup
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed top-24 right-4 z-[70] flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)] sm:w-auto pointer-events-none"
    >
      {toasts.map((t) => {
        const Icon = ICONS[t.tone ?? "success"];
        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto rounded-2xl glass-dark p-4 shadow-card flex items-start gap-3 border",
              TONE_CLASSES[t.tone ?? "success"],
            )}
          >
            <span
              className={cn(
                "inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl",
                ICON_BG[t.tone ?? "success"],
              )}
            >
              <Icon size={16} strokeWidth={1.7} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-coffee text-sm">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-xs text-coffee/70 leading-relaxed">
                  {t.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              aria-label="Bildirimi kapat"
              className="text-coffee/50 hover:text-coffee transition-colors -m-1 p-1"
            >
              <X size={14} strokeWidth={1.6} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
