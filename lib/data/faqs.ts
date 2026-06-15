export type FAQ = {
  question: string;
  answer: string;
  category: "siparis" | "teslimat" | "odeme" | "iade" | "bakim";
};

export const FAQS: FAQ[] = [
  {
    category: "siparis",
    question: "Sipariş nasıl veririm?",
    answer:
      "İki yöntemle sipariş verebilirsiniz: ürün sayfasından sepete ekleyip WhatsApp üzerinden onay vererek veya doğrudan WhatsApp hattımızdan istediğiniz ürünü iletip ekibimizden destek alarak.",
  },
  {
    category: "siparis",
    question: "Sipariş için minimum tutar var mı?",
    answer:
      "Hayır, minimum tutar uygulamıyoruz. Ancak teslimat ücreti Gemlik bölgesine göre değişebilir.",
  },
  {
    category: "teslimat",
    question: "Aynı gün teslimat saat kaça kadar geçerli?",
    answer:
      "Saat 17:00&apos;dan önce verilen siparişlerde aynı gün teslimat garantilidir. 17:00 sonrası siparişler ertesi sabah ilk teslimatla yola çıkar.",
  },
  {
    category: "teslimat",
    question: "Gemlik dışına teslimat yapıyor musunuz?",
    answer:
      "Gemlik içi özenli elden teslimat veriyoruz. Şehir dışı gönderimler için anlaşmalı kargo seçeneği bulunur; ayrıntı için WhatsApp&apos;tan bilgi alabilirsiniz.",
  },
  {
    category: "teslimat",
    question: "Sürpriz teslimat yapabilir misiniz?",
    answer:
      "Evet. Sipariş notuna &ldquo;sürpriz teslimat&rdquo; yazmanız yeterli. Gönderici bilgilerini alıcıya açıklamıyoruz, sadece kart notunuzu iletiyoruz.",
  },
  {
    category: "odeme",
    question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
    answer:
      "Havale/EFT, IBAN ile ödeme, kapıda nakit veya kartla ödeme ve link ile kredi kartı ödemesi seçeneklerimiz mevcut. Ödeme detayları WhatsApp onayından sonra paylaşılır.",
  },
  {
    category: "odeme",
    question: "Fatura kesiyor musunuz?",
    answer:
      "Evet, bireysel ve kurumsal fatura kesilebilir. Sipariş onayında fatura bilgilerinizi bizimle paylaşmanız yeterli.",
  },
  {
    category: "iade",
    question: "Çiçeği beğenmezsem ne olur?",
    answer:
      "Floria Garden memnuniyet sözü verir. Teslimat anında çiçeği beğenmezseniz aynı gün içinde yenisini hazırlar veya tutarını iade ederiz.",
  },
  {
    category: "bakim",
    question: "Çiçekleri uzun süre nasıl taze tutarım?",
    answer:
      "Buketlerin sap uçlarını eğik kesin, suyu 2 günde bir değiştirin ve direkt güneş ışığından uzak tutun. Kutuda çiçekler için ek bakım gerekmez; oda sıcaklığında 7-10 gün taze kalır.",
  },
  {
    category: "bakim",
    question: "Orkideler için özel bakım gerekir mi?",
    answer:
      "Orkideler haftada 1 defa, alt tepsiden su ile beslenmeli. Parlak ama direkt güneş almayan ortamda yer almalı. Detaylı rehber her orkidenin yanında verilir.",
  },
];
