"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import Button from "@/components/ui/Button";
import { useCart } from "./CartProvider";
import { useToast } from "@/components/toast/ToastProvider";

type Customer = { name: string; phone: string; address: string };

type Props = {
  label?: string;
  className?: string;
  onDone?: () => void;
  /** Zorunlu müşteri bilgileri (Ad Soyad, Telefon, Adres). */
  customer: Customer;
};

type CheckoutResponse = {
  ok?: boolean;
  orderNo?: string;
  whatsappUrl?: string;
  error?: string;
};

export default function WhatsAppCheckoutButton({
  label = "Siparişi Tamamla",
  className,
  onDone,
  customer,
}: Props) {
  const router = useRouter();
  const { state, subtotal, discount, total, coupon, clear } = useCart();
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  const submit = async () => {
    if (pending || state.items.length === 0) return;

    // Zorunlu bilgi kontrolü — eksikse sipariş oluşturulmaz.
    const name = customer.name.trim();
    const address = customer.address.trim();
    const phoneDigits = customer.phone.replace(/\D/g, "");
    if (!name) {
      toast({ title: "Ad Soyad gerekli", tone: "warning" });
      return;
    }
    if (phoneDigits.length !== 11 || !phoneDigits.startsWith("05")) {
      toast({
        title: "Geçerli telefon girin",
        description: "Örn. 0 (555) 555 55 55",
        tone: "warning",
      });
      return;
    }
    if (!address) {
      toast({ title: "Teslimat adresi gerekli", tone: "warning" });
      return;
    }

    setPending(true);

    try {
      const res = await fetch("/api/orders/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: state.items,
          customer: { name, phone: customer.phone.trim(), address },
          coupon: coupon
            ? {
                code: coupon.code,
                discount,
              }
            : null,
          totals: {
            subtotal,
            discount,
            total,
          },
        }),
      });
      const json = (await res.json()) as CheckoutResponse;
      if (!res.ok || !json.ok || !json.orderNo) {
        throw new Error(json.error || "Sipariş kaydı oluşturulamadı.");
      }

      // WhatsApp'ı BURADA açmıyoruz. Müşteri "Siparişiniz alındı" sayfasına
      // yönlenir; oradaki "WhatsApp'a Devam Et" butonuyla WhatsApp'a geçer.
      clear();
      onDone?.();
      router.push(
        `/siparisiniz-alindi?order=${encodeURIComponent(json.orderNo)}`,
      );
    } catch (error) {
      toast({
        title: "Sipariş oluşturulamadı",
        description:
          error instanceof Error
            ? error.message
            : "Lütfen tekrar deneyin veya WhatsApp'tan yazın.",
        tone: "warning",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      type="button"
      variant="gold"
      size="lg"
      className={className}
      onClick={submit}
      disabled={pending}
    >
      <ShoppingBag size={18} strokeWidth={1.7} />
      <span>{pending ? "Sipariş oluşturuluyor..." : label}</span>
    </Button>
  );
}
