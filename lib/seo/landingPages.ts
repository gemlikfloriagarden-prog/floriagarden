/**
 * Yerel SEO landing page içerikleri.
 * Her sayfa gerçek bir URL'dir, menüde görünmez ama Google'da indekslenir.
 * Tasarım mevcut sistemle birebir aynı (LandingPage bileşeni render eder).
 *
 * Bu dosyayı silmek/geri almak siteyi eski hâline döndürür (geri alınabilir).
 */

export type LandingFaq = { q: string; a: string };
export type LandingLink = { label: string; href: string };
export type LandingSection = { heading: string; paragraphs: string[] };

export type LandingPageData = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  sections: LandingSection[];
  faqs: LandingFaq[];
  related: LandingLink[];
};

export const LANDING_PAGES: LandingPageData[] = [
  /* ════════════ /gemlik-cicekci ════════════ */
  {
    slug: "gemlik-cicekci",
    title: "Gemlik Çiçekçi — Floria Garden | Aynı Gün Teslimat",
    description:
      "Gemlik çiçekçi Floria Garden: taze buket, kutuda çiçek ve özel tasarım aranjmanlar. Gemlik içi aynı gün özenli teslimat. Hemen sipariş verin.",
    eyebrow: "Gemlik Çiçekçi",
    h1: "Gemlik Çiçekçi — Floria Garden",
    intro:
      "Floria Garden, Gemlik'te taze çiçek ve butik aranjmanlar sunan, çiçeğin ve kahvenin bir araya geldiği yeni nesil bir çiçekçidir. Doğum gününden yıl dönümüne, kutlamadan taziyeye kadar her an için özenle hazırladığımız çiçekleri Gemlik içinde aynı gün adrese teslim ediyoruz.",
    sections: [
      {
        heading: "Gemlik'te taze çiçek ve butik aranjmanlar",
        paragraphs: [
          "Bir çiçeğin değeri tazeliğinde ve hazırlanış özeninde saklıdır. Floria Garden olarak buketlerimizi ve aranjmanlarımızı günlük gelen taze çiçeklerle, sipariş üzerine elde hazırlıyoruz. Gül, lilyum, şakayık, lale ve mevsim çiçeklerinden oluşan düzenlemelerimizi; kutuda çiçek, ayna kutu, saksı orkide ve özel hediye setleri gibi farklı tarzlarda sunuyoruz.",
          "Her sipariş, Gemlik'teki atölyemizde tek tek elden geçer. Çiçeklerin tazeliğini koruyacak şekilde, kadife ve doğal dokulu ambalajlarla hazırlanır. Amacımız yalnızca çiçek satmak değil; karşı tarafa bırakacağınız izlenimi en güzel hâliyle ulaştırmaktır.",
        ],
      },
      {
        heading: "Teslimat bölgelerimiz: Gemlik ve çevresi",
        paragraphs: [
          "Gemlik merkez başta olmak üzere Kumla (Küçük Kumla ve Büyük Kumla), Kurşunlu, Umurbey ve çevre mahallelere çiçek teslimatı yapıyoruz. Gemlik içi siparişlerinizi ısı kontrollü kuryeyle, çiçeğin yol boyunca tazeliğini koruyacak şekilde adrese ulaştırıyoruz.",
          "Bursa merkez ve çevre ilçeler için anlaşmalı kuryelerimizle çalışıyor; Türkiye'nin geri kalanına ise anlaşmalı kargoyla, takip numaralı gönderim yapıyoruz. Teslimat bölgenizden emin değilseniz WhatsApp hattımızdan kısa sürede bilgi alabilirsiniz.",
        ],
      },
      {
        heading: "Hangi günler için çiçek gönderebilirsiniz?",
        paragraphs: [
          "Çiçek her duyguyu anlatabilen ender hediyelerden biridir. Doğum günü ve yıl dönümleri, sevgililer günü, anneler günü, yeni iş ve mağaza açılışları, mezuniyet ve kutlamalar için özel düzenlemeler hazırlıyoruz.",
          "Bunun yanında taziye ve hastane ziyaretleri gibi hassas anlarda da yanınızdayız; bu tür durumlarda sade, saygılı ve uygun aranjmanlar öneriyoruz. Ne göndereceğinize karar veremiyorsanız, bütçenizi ve kimin için olduğunu söylemeniz yeterli — size en uygun seçeneği birlikte belirleriz.",
        ],
      },
      {
        heading: "Nasıl sipariş verilir?",
        paragraphs: [
          "Sipariş vermek çok kolay: web sitemizden beğendiğiniz ürünü seçip teslimat adresi, tarih ve saat aralığını girerek sepete ekleyebilir, ardından siparişinizi oluşturabilirsiniz. Sipariş kaydınız bize anında ulaşır ve teslimat detaylarını WhatsApp üzerinden netleştiririz.",
          "Dilerseniz hiç uğraşmadan, doğrudan WhatsApp hattımızdan da yazabilirsiniz. İstediğiniz çiçeği, bütçenizi ve teslimat bilgisini iletmeniz yeterli; gerisini ekibimiz hallediyor. Çiçeğe iliştirilecek kişisel kart notunuzu da sipariş sırasında ekleyebilirsiniz.",
        ],
      },
      {
        heading: "Neden Floria Garden?",
        paragraphs: [
          "Gemlik'te çiçekçi denince akla gelen güvenilir adres olmayı hedefliyoruz. Taze çiçek, el yapımı butik düzenleme, ısı kontrollü özenli teslimat ve samimi iletişim bizim için standarttır. Siparişinizin her aşamasından haberdar olur, çiçeğiniz teslim edilene kadar süreci takip edersiniz.",
          "Çiçek ve kahvenin buluştuğu marka anlayışımızla, hediyeyi sadece bir ürün değil küçük bir deneyim hâline getiriyoruz. Gemlik ve çevresinde sevdiklerinize zarif bir sürpriz yapmak istediğinizde Floria Garden hep yakınınızda.",
        ],
      },
    ],
    faqs: [
      {
        q: "Gemlik'te aynı gün çiçek teslimatı yapıyor musunuz?",
        a: "Evet. Gemlik içi siparişlerde, saat 17:00'dan önce verilen siparişleri aynı gün ısı kontrollü kuryeyle adrese teslim ediyoruz.",
      },
      {
        q: "Hangi bölgelere teslimat yapıyorsunuz?",
        a: "Gemlik merkez, Kumla, Kurşunlu, Umurbey ve çevre mahalleler için elden teslimat; Bursa ve şehir dışına anlaşmalı kurye/kargo ile gönderim yapıyoruz.",
      },
      {
        q: "Sipariş için minimum tutar var mı?",
        a: "Hayır, minimum tutar uygulamıyoruz. Teslimat ücreti yalnızca bölgeye göre değişebilir.",
      },
      {
        q: "Çiçeğe kart notu ekleyebilir miyim?",
        a: "Elbette. Sipariş sırasında çiçeğe iliştirilecek kişisel kart notunuzu yazabilirsiniz; biz de el yazısıyla kartınıza geçiririz.",
      },
      {
        q: "Sürpriz teslimat mümkün mü?",
        a: "Evet. Gönderen bilgisini gizli tutarak sürpriz teslimat yapabiliriz; detayları WhatsApp üzerinden planlıyoruz.",
      },
    ],
    related: [
      { label: "Tüm Ürünler", href: "/urunler" },
      { label: "Gemlik Aynı Gün Teslimat", href: "/gemlik-ayni-gun-cicek-teslimati" },
      { label: "Gemlik Çiçek Siparişi", href: "/gemlik-cicek-siparisi" },
      { label: "Teslimat Bilgileri", href: "/teslimat" },
      { label: "İletişim", href: "/iletisim" },
    ],
  },

  /* ════════════ /gemlik-cicek-siparisi ════════════ */
  {
    slug: "gemlik-cicek-siparisi",
    title: "Gemlik Çiçek Siparişi — Online & WhatsApp | Floria Garden",
    description:
      "Gemlik çiçek siparişi kolay: siteden seçin, WhatsApp ile onaylayın. Aynı gün teslimat, kart notu ve özel paket seçenekleriyle Floria Garden.",
    eyebrow: "Gemlik Çiçek Siparişi",
    h1: "Gemlik Çiçek Siparişi",
    intro:
      "Gemlik'te çiçek siparişi vermek Floria Garden ile sadece birkaç dakika sürer. İster web sitemizden seçip sepete ekleyin, ister WhatsApp hattımızdan yazın; taze çiçekleri ve butik aranjmanları aynı gün sevdiklerinize ulaştırıyoruz.",
    sections: [
      {
        heading: "Web sitesinden çiçek siparişi nasıl verilir?",
        paragraphs: [
          "Ürünler sayfamızdan beğendiğiniz buketi veya aranjmanı seçin. Ürün sayfasında teslimat bölgesini (Gemlik içi veya şehir dışı), teslimat gününü, saat aralığını ve açık adresi girin. Dilerseniz çiçeğe özel bir kart notu ve paket seçeneği ekleyin.",
          "Bilgileri girdikten sonra ürünü sepete ekleyip siparişinizi tamamlayın. Sipariş kaydınız anında sistemimize düşer ve 'Siparişiniz alındı' sayfasıyla onaylanır. Ardından teslimat ve ödeme detaylarını WhatsApp üzerinden birlikte netleştiririz.",
        ],
      },
      {
        heading: "WhatsApp ile pratik sipariş",
        paragraphs: [
          "Acele eden ya da seçimde destek isteyenler için en hızlı yol WhatsApp'tır. Hangi çiçeği, hangi gün, hangi adrese göndermek istediğinizi yazmanız yeterli; ekibimiz uygun seçenekleri ve fiyatı paylaşır, siparişinizi sizin adınıza oluşturur.",
          "Üye girişi yaptıysanız sipariş geçmişiniz ve kayıtlı adresleriniz hesabınızda saklanır; bir sonraki sipariş çok daha hızlı tamamlanır.",
        ],
      },
      {
        heading: "Ödeme seçenekleri",
        paragraphs: [
          "Ödeme; havale/EFT veya bölgeye göre kapıda ödeme şeklinde yapılabilir. Ödeme detayları, sipariş onayından sonra WhatsApp üzerinden güvenli biçimde paylaşılır. Kart bilgilerinizi asla site üzerinde istemiyoruz.",
        ],
      },
      {
        heading: "Kart notu ve özel paket",
        paragraphs: [
          "Bir çiçeği unutulmaz kılan çoğu zaman yanındaki birkaç kelimedir. Siparişinize ekleyeceğiniz kart notunu el yazısıyla hazırlıyoruz. Ayrıca standart, premium ve lüks paket seçenekleriyle çiçeğinizin sunumunu zenginleştirebilirsiniz.",
        ],
      },
      {
        heading: "Teslimat ve takip",
        paragraphs: [
          "Gemlik içi siparişlerde aynı gün, ısı kontrollü teslimat sunuyoruz. Siparişinizin hazırlanışından teslimine kadar süreçten haberdar olur, gerektiğinde WhatsApp üzerinden anlık bilgi alırsınız. Şehir dışı gönderimlerde takip numaralı kargo kullanıyoruz.",
        ],
      },
    ],
    faqs: [
      {
        q: "Online sipariş güvenli mi?",
        a: "Evet. Site üzerinde kart bilgisi istemiyoruz; ödeme, sipariş onayından sonra havale/EFT veya kapıda ödeme ile güvenli şekilde yapılır.",
      },
      {
        q: "Siparişimi WhatsApp'tan da verebilir miyim?",
        a: "Tabii. WhatsApp hattımızdan istediğiniz çiçeği, teslimat bilgisini ve bütçenizi iletmeniz yeterli; siparişi sizin için oluşturuyoruz.",
      },
      {
        q: "Aynı gün teslimat için son saat kaç?",
        a: "Gemlik içi siparişlerde saat 17:00'dan önce verilen siparişler aynı gün teslim edilir.",
      },
      {
        q: "Kayıtlı adresimi tekrar kullanabilir miyim?",
        a: "Üye girişi yaptıysanız kayıtlı adresleriniz hesabınızda saklanır ve sipariş sırasında tek tıkla seçebilirsiniz.",
      },
    ],
    related: [
      { label: "Tüm Ürünler", href: "/urunler" },
      { label: "Gemlik Çiçekçi", href: "/gemlik-cicekci" },
      { label: "Aynı Gün Teslimat", href: "/gemlik-ayni-gun-cicek-teslimati" },
      { label: "Sıkça Sorulan Sorular", href: "/sss" },
    ],
  },

  /* ════════════ /gemlik-ayni-gun-cicek-teslimati ════════════ */
  {
    slug: "gemlik-ayni-gun-cicek-teslimati",
    title: "Gemlik Aynı Gün Çiçek Teslimatı | Floria Garden",
    description:
      "Gemlik içi aynı gün çiçek teslimatı: 17:00 öncesi siparişler aynı gün, ısı kontrollü kuryeyle adrese. Floria Garden ile hızlı ve özenli teslimat.",
    eyebrow: "Aynı Gün Teslimat",
    h1: "Gemlik Aynı Gün Çiçek Teslimatı",
    intro:
      "Bazı anlar beklemez. Floria Garden, Gemlik içi siparişlerde aynı gün çiçek teslimatı sunar; saat 17:00'dan önce verdiğiniz siparişleri, çiçeğin tazeliğini koruyan ısı kontrollü kuryeyle aynı gün adrese ulaştırırız.",
    sections: [
      {
        heading: "Aynı gün teslimat nasıl işliyor?",
        paragraphs: [
          "Siparişinizi aldıktan sonra çiçeğiniz Gemlik'teki atölyemizde taze malzemelerle hazırlanır ve aynı gün teslimat rotamıza eklenir. Hazırlık ve yola çıkış süreçlerini kısa tutarak, çiçeğin en taze hâliyle alıcıya ulaşmasını sağlıyoruz.",
          "Teslimat sırasında alıcıya ulaşılamazsa, irtibat numarası üzerinden iletişime geçerek en uygun teslim zamanını planlıyoruz. Sürecin her aşamasından WhatsApp üzerinden haberdar olabilirsiniz.",
        ],
      },
      {
        heading: "Aynı gün teslimat için son sipariş saati",
        paragraphs: [
          "Aynı gün teslimat, Gemlik içi siparişlerde saat 17:00'a kadar geçerlidir. 17:00'dan sonra verilen siparişler, ertesi günün ilk teslimatıyla yola çıkar. Yoğun günlerde (sevgililer günü, anneler günü gibi) erken sipariş vermenizi öneririz.",
        ],
      },
      {
        heading: "Aynı gün teslimat yaptığımız bölgeler",
        paragraphs: [
          "Aynı gün elden teslimatı Gemlik merkez ve yakın mahallelerde sunuyoruz. Kumla, Kurşunlu ve Umurbey gibi çevre bölgelere teslimat süresi konuma göre değişebilir; bu bölgeler için uygun teslim saatini sipariş sırasında WhatsApp üzerinden teyit ediyoruz.",
          "Bursa merkez ve şehir dışı gönderimlerde aynı gün garantisi yerine, en hızlı teslim seçeneğini birlikte planlıyoruz.",
        ],
      },
      {
        heading: "Sürpriz ve özel zamanlı teslimat",
        paragraphs: [
          "Sevdiğinize sürpriz yapmak istiyorsanız, gönderen bilgisini gizli tutarak teslimat yapıyoruz. Belirli bir saatte (örneğin bir kutlama anında) teslim edilmesini istediğiniz siparişleri de mümkün olduğunca planlayıp not alıyoruz.",
        ],
      },
    ],
    faqs: [
      {
        q: "Aynı gün teslimat ücretli mi?",
        a: "Teslimat ücreti bölgeye göre belirlenir ve sipariş onayında netleştirilir. Gemlik içi teslimatlarımız hızlı ve özenlidir.",
      },
      {
        q: "Saat kaça kadar sipariş verirsem aynı gün teslim edilir?",
        a: "Gemlik içinde saat 17:00'dan önce verilen siparişler aynı gün teslim edilir.",
      },
      {
        q: "Belirli bir saatte teslim ettirebilir miyim?",
        a: "Tercih ettiğiniz saat aralığını sipariş sırasında seçebilirsiniz; yoğunluğa göre mümkün olduğunca bu aralığa uyuyoruz.",
      },
      {
        q: "Kumla ve Kurşunlu'ya aynı gün teslimat var mı?",
        a: "Konuma göre mümkündür; bu bölgeler için uygun teslim saatini WhatsApp üzerinden teyit ediyoruz.",
      },
    ],
    related: [
      { label: "Gemlik Çiçekçi", href: "/gemlik-cicekci" },
      { label: "Gemlik Çiçek Siparişi", href: "/gemlik-cicek-siparisi" },
      { label: "Kumla Çiçekçi", href: "/kumla-cicekci" },
      { label: "Tüm Ürünler", href: "/urunler" },
    ],
  },

  /* ════════════ /kumla-cicekci ════════════ */
  {
    slug: "kumla-cicekci",
    title: "Kumla Çiçekçi — Aynı Gün Çiçek Teslimatı | Floria Garden",
    description:
      "Kumla (Küçük Kumla) ve çevresine taze çiçek ve buket teslimatı. Gemlik merkezli Floria Garden ile hızlı, özenli çiçek siparişi.",
    eyebrow: "Kumla Çiçekçi",
    h1: "Kumla Çiçekçi — Floria Garden",
    intro:
      "Floria Garden, Gemlik merkezli butik çiçekçi olarak Kumla ve çevresine taze çiçek, buket ve özel tasarım aranjmanlar ulaştırır. Küçük Kumla ve Büyük Kumla'daki sevdiklerinize zarif bir sürpriz yapmak için yanınızdayız.",
    sections: [
      {
        heading: "Kumla'ya çiçek teslimatı",
        paragraphs: [
          "Kumla, özellikle yaz aylarında hareketlenen, sevdiklerimizle vakit geçirdiğimiz güzel bir sahil bölgesi. Floria Garden olarak Gemlik'teki atölyemizden hazırladığımız çiçekleri Kumla'ya özenle ulaştırıyoruz. Doğum günü, yıl dönümü, kutlama ya da sadece 'seni düşünüyorum' demek için taze bir buket göndermek artık çok kolay.",
          "Çiçeklerimiz sipariş üzerine, günlük taze malzemelerle hazırlanır ve ısı kontrollü şekilde taşınır. Böylece sıcak yaz günlerinde bile çiçeğiniz tazeliğini korur.",
        ],
      },
      {
        heading: "Kumla ve çevre bölgeler",
        paragraphs: [
          "Küçük Kumla ve Büyük Kumla başta olmak üzere; Gemlik merkez, Kurşunlu, Umurbey ve çevre mahallelere teslimat yapıyoruz. Yazlık siteler ve tatil bölgelerine teslimatta, adresi mümkün olduğunca ayrıntılı yazmanız (site adı, blok, daire) teslimatı hızlandırır.",
          "Teslimat bölgenizden veya adresinizden emin değilseniz, WhatsApp hattımızdan konum paylaşarak hızlıca teyit alabilirsiniz.",
        ],
      },
      {
        heading: "Yazlık ve tatil dönemi siparişleri",
        paragraphs: [
          "Tatil sezonunda Kumla'daki misafirlerinize ya da sevdiklerinize hoş geldin çiçeği, doğum günü sürprizi veya özel gün düzenlemesi gönderebilirsiniz. Otel, pansiyon ve yazlık adreslerine teslimat konusunda deneyimliyiz; teslim saatini birlikte planlıyoruz.",
        ],
      },
      {
        heading: "Nasıl sipariş verilir?",
        paragraphs: [
          "Web sitemizden ürünü seçip teslimat bölgesi olarak Gemlik içini işaretleyebilir, açık adres alanına Kumla adresinizi yazabilirsiniz. Alternatif olarak WhatsApp hattımızdan da kolayca sipariş verebilir, seçim ve teslimat konusunda destek alabilirsiniz.",
        ],
      },
    ],
    faqs: [
      {
        q: "Kumla'ya aynı gün çiçek teslimatı yapıyor musunuz?",
        a: "Konuma göre çoğu zaman mümkündür. Uygun teslim saatini sipariş sırasında WhatsApp üzerinden teyit ediyoruz.",
      },
      {
        q: "Küçük Kumla ve Büyük Kumla'nın ikisine de teslimat var mı?",
        a: "Evet, her iki bölgeye de teslimat yapıyoruz. Yazlık site adreslerinde site/blok/daire bilgisini eklemeniz teslimatı hızlandırır.",
      },
      {
        q: "Tatil adresine sürpriz gönderebilir miyim?",
        a: "Elbette. Gönderen bilgisini gizli tutarak sürpriz teslimat yapabilir, teslim saatini birlikte planlayabiliriz.",
      },
      {
        q: "Kumla siparişi nasıl veririm?",
        a: "Siteden ürünü seçip açık adrese Kumla adresinizi yazabilir ya da doğrudan WhatsApp hattımızdan sipariş verebilirsiniz.",
      },
    ],
    related: [
      { label: "Gemlik Çiçekçi", href: "/gemlik-cicekci" },
      { label: "Aynı Gün Teslimat", href: "/gemlik-ayni-gun-cicek-teslimati" },
      { label: "Tüm Ürünler", href: "/urunler" },
      { label: "İletişim", href: "/iletisim" },
    ],
  },

  /* ════════════ /kursunlu-cicekci ════════════ */
  {
    slug: "kursunlu-cicekci",
    title: "Kurşunlu Çiçekçi — Çiçek Teslimatı | Floria Garden",
    description:
      "Kurşunlu'ya çiçek mi göndereceksiniz? Gemlik merkezli Floria Garden ile taze buket ve aranjmanları özenle teslim ediyoruz. Hemen sipariş verin.",
    eyebrow: "Kurşunlu Çiçekçi",
    h1: "Kurşunlu Çiçekçi — Floria Garden",
    intro:
      "Floria Garden, Gemlik merkezli butik çiçekçi olarak Kurşunlu ve çevresine taze çiçek, buket ve özel tasarım aranjmanlar ulaştırır. Sahil kasabasındaki sevdiklerinize zarif bir sürpriz yapmak artık çok kolay.",
    sections: [
      {
        heading: "Kurşunlu'ya çiçek teslimatı",
        paragraphs: [
          "Kurşunlu, Gemlik'in sevilen sahil mahallelerinden biri ve özellikle yaz aylarında oldukça hareketli. Gemlik'teki atölyemizde günlük taze malzemelerle hazırladığımız çiçekleri Kurşunlu'daki adreslere özenle ulaştırıyoruz. Doğum günü, yıl dönümü, kutlama veya sadece bir 'iyi ki varsın' demek için taze bir buket göndermek mümkün.",
          "Tüm aranjmanlarımız sipariş üzerine hazırlanır ve ısı kontrollü şekilde taşınır; böylece sıcak yaz günlerinde bile çiçeğiniz tazeliğini korur.",
        ],
      },
      {
        heading: "Hizmet verdiğimiz bölgeler",
        paragraphs: [
          "Kurşunlu başta olmak üzere Gemlik merkez, Kumla (Küçük ve Büyük Kumla), Umurbey ve çevre mahallelere teslimat yapıyoruz. Yazlık siteler ve tatil bölgelerine teslimatta adresi olabildiğince ayrıntılı (site adı, blok, daire) yazmanız süreci hızlandırır.",
          "Teslimat bölgenizden emin değilseniz WhatsApp hattımızdan konum paylaşarak hızlıca teyit alabilirsiniz.",
        ],
      },
      {
        heading: "Yazlık ve tatil dönemi siparişleri",
        paragraphs: [
          "Tatil sezonunda Kurşunlu'daki misafirlerinize hoş geldin çiçeği, doğum günü sürprizi veya özel gün düzenlemesi gönderebilirsiniz. Otel, pansiyon ve yazlık adreslerine teslimatta deneyimliyiz; uygun teslim saatini birlikte planlıyoruz.",
        ],
      },
      {
        heading: "Nasıl sipariş verilir?",
        paragraphs: [
          "Web sitemizden ürünü seçip teslimat bölgesi olarak Gemlik içini işaretleyebilir, açık adres alanına Kurşunlu adresinizi yazabilirsiniz. Alternatif olarak WhatsApp hattımızdan da kolayca sipariş verebilir, ürün seçimi ve teslimat konusunda destek alabilirsiniz.",
        ],
      },
    ],
    faqs: [
      {
        q: "Kurşunlu'ya aynı gün teslimat yapıyor musunuz?",
        a: "Konuma göre çoğu zaman mümkündür. Uygun teslim saatini sipariş sırasında WhatsApp üzerinden teyit ediyoruz.",
      },
      {
        q: "Yazlık site adresine teslimat yapılır mı?",
        a: "Evet. Site adı, blok ve daire bilgisini eklerseniz teslimat çok daha hızlı tamamlanır.",
      },
      {
        q: "Sürpriz teslimat mümkün mü?",
        a: "Elbette. Gönderen bilgisini gizli tutarak sürpriz teslimat yapabiliriz.",
      },
      {
        q: "Kurşunlu siparişi nasıl veririm?",
        a: "Siteden ürünü seçip açık adrese Kurşunlu adresinizi yazabilir ya da doğrudan WhatsApp hattımızdan sipariş verebilirsiniz.",
      },
    ],
    related: [
      { label: "Gemlik Çiçekçi", href: "/gemlik-cicekci" },
      { label: "Kumla Çiçekçi", href: "/kumla-cicekci" },
      { label: "Aynı Gün Teslimat", href: "/gemlik-ayni-gun-cicek-teslimati" },
      { label: "Tüm Ürünler", href: "/urunler" },
    ],
  },

  /* ════════════ /gemlik-orkide-siparisi ════════════ */
  {
    slug: "gemlik-orkide-siparisi",
    title: "Gemlik Orkide Siparişi — Saksı Orkide | Floria Garden",
    description:
      "Gemlik'te orkide siparişi: tek ve çift dallı, saksıda orkideler özel ambalajla. Aynı gün teslimat ile Floria Garden'dan zarif bir hediye.",
    eyebrow: "Gemlik Orkide Siparişi",
    h1: "Gemlik Orkide Siparişi",
    intro:
      "Orkide, zarafeti ve uzun ömrüyle en sevilen hediye çiçeklerinden biridir. Floria Garden olarak Gemlik'te tek dallı, çift dallı ve çoklu saksı orkideleri özel ambalajla hazırlıyor, aynı gün adrese teslim ediyoruz.",
    sections: [
      {
        heading: "Orkide çeşitlerimiz",
        paragraphs: [
          "Beyaz, mor ve pembe tonlarda; tek dallı, çift dallı ve çoklu dal seçenekleriyle saksı orkideler sunuyoruz. Her orkideyi şık bir saksı ve doğal dokulu ambalajla hazırlıyor, hediye olarak gönderilmeye hazır hâle getiriyoruz.",
          "Ofis, ev açılışı, doğum günü veya teşekkür hediyesi olarak orkide hem uzun ömürlü hem de zarif bir tercihtir.",
        ],
      },
      {
        heading: "Hediye olarak orkide",
        paragraphs: [
          "Kesme çiçeklerin aksine orkide haftalarca, doğru bakımla aylarca canlı kalır. Bu yüzden 'kalıcı bir hediye' arayanların ilk tercihidir. Kart notunuzu ekleyerek orkideyi tamamen kişisel bir hediyeye dönüştürebilirsiniz.",
        ],
      },
      {
        heading: "Kısaca orkide bakımı",
        paragraphs: [
          "Orkideler doğrudan güneş yerine aydınlık bir ortamı sever. Çoğu orkide için haftada bir kez, kökleri boğmayacak şekilde sulama yeterlidir. Saksıda su biriktirmemeye özen gösterin. Teslimat sırasında bakım önerilerimizi de paylaşıyoruz.",
        ],
      },
      {
        heading: "Teslimat ve sipariş",
        paragraphs: [
          "Gemlik içi orkide siparişlerini aynı gün, ısı kontrollü kuryeyle teslim ediyoruz. Kumla, Kurşunlu ve Umurbey gibi çevre bölgelere teslimat süresi konuma göre değişebilir. Siparişinizi siteden verebilir veya WhatsApp hattımızdan iletebilirsiniz.",
        ],
      },
    ],
    faqs: [
      {
        q: "Orkide ne kadar dayanır?",
        a: "Doğru bakımla orkide çiçekleri haftalarca, bitki ise aylarca canlı kalır. Bu yüzden kalıcı bir hediye arayanların favorisidir.",
      },
      {
        q: "Orkideyi ne sıklıkla sulamalıyım?",
        a: "Çoğu orkide için haftada bir, kökleri boğmayacak ölçüde sulama yeterlidir. Saksıda su biriktirmemeye dikkat edin.",
      },
      {
        q: "Aynı gün orkide teslimatı var mı?",
        a: "Gemlik içinde saat 17:00 öncesi verilen orkide siparişlerini aynı gün teslim ediyoruz.",
      },
      {
        q: "Orkideye kart notu ekleyebilir miyim?",
        a: "Evet, sipariş sırasında ekleyeceğiniz kart notunu el yazısıyla hazırlıyoruz.",
      },
    ],
    related: [
      { label: "Gemlik Çiçekçi", href: "/gemlik-cicekci" },
      { label: "Tüm Ürünler", href: "/urunler" },
      { label: "Aynı Gün Teslimat", href: "/gemlik-ayni-gun-cicek-teslimati" },
      { label: "İletişim", href: "/iletisim" },
    ],
  },

  /* ════════════ /dogum-gunu-cicegi ════════════ */
  {
    slug: "dogum-gunu-cicegi",
    title: "Gemlik Doğum Günü Çiçeği — Aynı Gün | Floria Garden",
    description:
      "Gemlik'te doğum günü çiçeği: rengârenk buketler, kutuda çiçekler ve sürpriz teslimat. Aynı gün, ısı kontrollü teslimat ile Floria Garden.",
    eyebrow: "Doğum Günü Çiçeği",
    h1: "Gemlik'te Doğum Günü Çiçeği",
    intro:
      "Doğum günleri, sevdiklerimize değer verdiğimizi göstermenin en güzel fırsatlarından biri. Floria Garden olarak Gemlik'te doğum günü için neşeli, rengârenk buketler ve şık kutuda çiçekler hazırlıyor, aynı gün sürpriz teslimat sunuyoruz.",
    sections: [
      {
        heading: "Doğum günü için doğru çiçeği seçmek",
        paragraphs: [
          "Doğum günü çiçeğinde renk ve enerji önemlidir. Canlı renkli güller, gerbera, lilyum ve mevsim çiçeklerinden oluşan neşeli buketler hazırlıyoruz. Daha sade bir zevk için pastel tonlu aranjmanlar da öneriyoruz.",
          "Kimin için seçtiğinizi ve bütçenizi söylemeniz yeterli; size en uygun seçeneği birlikte belirliyoruz.",
        ],
      },
      {
        heading: "Buket mi, kutuda çiçek mi?",
        paragraphs: [
          "Klasik ve zarif bir görünüm için el buketleri; modern ve kalıcı bir sunum için kutuda çiçekler idealdir. Kutuda çiçekler taşıması kolay olduğu için iş yerine veya kalabalık ortamlara gönderilen sürprizlerde de pratiktir.",
        ],
      },
      {
        heading: "Kişisel kart notu ile fark yaratın",
        paragraphs: [
          "Bir doğum günü mesajını çiçeğin yanına iliştirmek, hediyeyi unutulmaz kılar. Sipariş sırasında yazacağınız kart notunu el yazısıyla hazırlıyoruz.",
        ],
      },
      {
        heading: "Aynı gün ve sürpriz teslimat",
        paragraphs: [
          "Gemlik içinde saat 17:00 öncesi verilen doğum günü siparişlerini aynı gün teslim ediyoruz. Gönderen bilgisini gizleyerek sürpriz teslimat yapabilir; mümkünse belirli bir saate denk getirebiliriz.",
        ],
      },
    ],
    faqs: [
      {
        q: "Doğum günü için aynı gün teslimat var mı?",
        a: "Evet, Gemlik içinde 17:00 öncesi verilen siparişleri aynı gün teslim ediyoruz.",
      },
      {
        q: "Sürpriz doğum günü teslimatı yapabilir misiniz?",
        a: "Tabii. Gönderen bilgisini gizli tutar, mümkünse istediğiniz saate denk getiririz.",
      },
      {
        q: "Hangi çiçek doğum gününe uygun?",
        a: "Canlı renkli güller, gerbera ve mevsim çiçekleri doğum günleri için idealdir. Sade bir zevk için pastel aranjmanlar öneriyoruz.",
      },
      {
        q: "İş yerine doğum günü çiçeği gönderebilir miyim?",
        a: "Evet, kutuda çiçekler iş yeri teslimatları için pratik ve şık bir tercihtir.",
      },
    ],
    related: [
      { label: "Gemlik Çiçekçi", href: "/gemlik-cicekci" },
      { label: "Tüm Ürünler", href: "/urunler" },
      { label: "Aynı Gün Teslimat", href: "/gemlik-ayni-gun-cicek-teslimati" },
      { label: "Gemlik Çiçek Siparişi", href: "/gemlik-cicek-siparisi" },
    ],
  },

  /* ════════════ /sevgililer-gunu-cicegi ════════════ */
  {
    slug: "sevgililer-gunu-cicegi",
    title: "Gemlik Sevgililer Günü Çiçeği — 14 Şubat | Floria Garden",
    description:
      "Gemlik sevgililer günü çiçeği: kırmızı gül buketleri, kutuda güller ve özel tasarımlar. Aynı gün teslimat için erken sipariş — Floria Garden.",
    eyebrow: "Sevgililer Günü",
    h1: "Gemlik Sevgililer Günü Çiçeği",
    intro:
      "14 Şubat yaklaşırken sevgilinize en güzel sürprizi Floria Garden ile hazırlayın. Gemlik'te sevgililer günü için kırmızı gül buketleri, kutuda güller ve romantik özel tasarımlar sunuyor, aynı gün teslimat sağlıyoruz.",
    sections: [
      {
        heading: "Sevgililer günü için özel tasarımlar",
        paragraphs: [
          "Klasik kırmızı güllerin yanında; bordo, beyaz ve pastel tonlarda romantik aranjmanlar, kutuda güller ve sonsuz gül seçenekleri hazırlıyoruz. Çikolata ve küçük hediyelerle tamamlanmış setler de oluşturabiliyoruz.",
          "Tarzına göre, sade ve zarif ya da gösterişli ve büyük bir düzenleme arasından seçim yapabilirsiniz.",
        ],
      },
      {
        heading: "Neden erken sipariş önemli?",
        paragraphs: [
          "Sevgililer günü, yılın en yoğun günlerinden biridir. Hem ürün çeşidinden rahat seçim yapabilmek hem de istediğiniz saatte teslimat alabilmek için siparişinizi birkaç gün önceden vermenizi öneririz.",
          "Erken sipariş verseniz bile teslimatı 14 Şubat'a planlayabiliriz; sadece sipariş sırasında teslim gününü belirtmeniz yeterli.",
        ],
      },
      {
        heading: "Aynı gün ve sürpriz teslimat",
        paragraphs: [
          "Gemlik içinde aynı gün, ısı kontrollü teslimat sunuyoruz. Sürpriz yapmak isterseniz gönderen bilgisini gizli tutuyor, mümkün olduğunca istediğiniz saate denk getiriyoruz.",
        ],
      },
      {
        heading: "Nasıl sipariş verilir?",
        paragraphs: [
          "Web sitemizden ürünü seçip teslimat gününü 14 Şubat olarak ayarlayabilir, kart notunuzu ekleyebilirsiniz. Seçimde destek isterseniz WhatsApp hattımız her zaman açık.",
        ],
      },
    ],
    faqs: [
      {
        q: "Sevgililer günü için ne zaman sipariş vermeliyim?",
        a: "Ürün çeşidi ve teslim saati için birkaç gün önceden sipariş vermenizi öneririz; teslimatı 14 Şubat'a planlarız.",
      },
      {
        q: "Kırmızı gül dışında seçenek var mı?",
        a: "Evet; bordo, beyaz ve pastel aranjmanlar, kutuda güller, sonsuz gül ve çikolatalı setler sunuyoruz.",
      },
      {
        q: "Aynı gün teslimat mümkün mü?",
        a: "Gemlik içinde 17:00 öncesi siparişlerde aynı gün teslimat yapıyoruz; yoğun gün olduğundan erken sipariş daha güvenlidir.",
      },
      {
        q: "Sürpriz teslimat yapabilir misiniz?",
        a: "Evet, gönderen bilgisini gizleyerek sürpriz teslimat yapıyoruz.",
      },
    ],
    related: [
      { label: "Gemlik Çiçekçi", href: "/gemlik-cicekci" },
      { label: "Tüm Ürünler", href: "/urunler" },
      { label: "Aynı Gün Teslimat", href: "/gemlik-ayni-gun-cicek-teslimati" },
      { label: "Doğum Günü Çiçeği", href: "/dogum-gunu-cicegi" },
    ],
  },

  /* ════════════ /anneler-gunu-cicegi ════════════ */
  {
    slug: "anneler-gunu-cicegi",
    title: "Gemlik Anneler Günü Çiçeği | Floria Garden",
    description:
      "Gemlik anneler günü çiçeği: zarif buketler, orkideler ve kutuda çiçekler. Aynı gün, ısı kontrollü teslimat ile annenize özel sürpriz — Floria Garden.",
    eyebrow: "Anneler Günü",
    h1: "Gemlik Anneler Günü Çiçeği",
    intro:
      "Anneler günü, anneye duyduğumuz sevgiyi göstermenin en özel günü. Floria Garden olarak Gemlik'te anneler günü için zarif buketler, uzun ömürlü orkideler ve şık kutuda çiçekler hazırlıyor, aynı gün teslimat sunuyoruz.",
    sections: [
      {
        heading: "Anneye en yakışan çiçekler",
        paragraphs: [
          "Anneler günü için pastel tonlu güller, lilyum ve mevsim çiçeklerinden oluşan zarif buketler; kalıcı bir hediye isteyenler için saksı orkideler öne çıkıyor. Annenizin sevdiği renkleri söylerseniz, ona özel bir düzenleme hazırlarız.",
        ],
      },
      {
        heading: "Kalıcı hediye: orkide",
        paragraphs: [
          "Uzun süre canlı kalan orkide, anneler gününde sıkça tercih edilen zarif bir seçenektir. Şık bir saksı ve özel ambalajla, bakım önerileriyle birlikte teslim ediyoruz.",
        ],
      },
      {
        heading: "Erken sipariş ve teslimat",
        paragraphs: [
          "Anneler günü yoğun bir dönemdir; rahat seçim ve istediğiniz teslim saati için birkaç gün önceden sipariş vermenizi öneririz. Gemlik içinde aynı gün, ısı kontrollü teslimat sağlıyoruz.",
          "Anneniz başka bir şehirdeyse, anlaşmalı kargoyla takip numaralı gönderim de yapabiliriz.",
        ],
      },
      {
        heading: "Kart notu ile dokunuş",
        paragraphs: [
          "Birkaç içten kelime, hediyeyi unutulmaz kılar. Sipariş sırasında yazacağınız kart notunu el yazısıyla hazırlayıp çiçeğe iliştiriyoruz.",
        ],
      },
    ],
    faqs: [
      {
        q: "Anneler günü için hangi çiçek uygun?",
        a: "Pastel buketler ve uzun ömürlü orkideler en sevilen tercihlerdir. Annenizin sevdiği renge göre özel düzenleme yapıyoruz.",
      },
      {
        q: "Başka şehirdeki anneme gönderebilir miyim?",
        a: "Evet, şehir dışına anlaşmalı kargoyla takip numaralı gönderim yapıyoruz.",
      },
      {
        q: "Aynı gün teslimat var mı?",
        a: "Gemlik içinde 17:00 öncesi siparişlerde aynı gün teslimat yapıyoruz; yoğun dönem olduğundan erken sipariş öneririz.",
      },
      {
        q: "Kart notu ekleyebilir miyim?",
        a: "Elbette, kart notunuzu el yazısıyla hazırlayıp çiçeğe iliştiriyoruz.",
      },
    ],
    related: [
      { label: "Gemlik Çiçekçi", href: "/gemlik-cicekci" },
      { label: "Gemlik Orkide Siparişi", href: "/gemlik-orkide-siparisi" },
      { label: "Tüm Ürünler", href: "/urunler" },
      { label: "Aynı Gün Teslimat", href: "/gemlik-ayni-gun-cicek-teslimati" },
    ],
  },

  /* ════════════ /acilis-cicegi ════════════ */
  {
    slug: "acilis-cicegi",
    title: "Gemlik Açılış Çiçeği & Ferforje | Floria Garden",
    description:
      "Gemlik açılış çiçeği: ferforje, ayaklı aranjman ve kutlama çiçekleri. İş yeri ve mağaza açılışlarına aynı gün, özenli teslimat — Floria Garden.",
    eyebrow: "Açılış Çiçeği",
    h1: "Gemlik Açılış Çiçeği & Ferforje",
    intro:
      "Yeni bir iş yeri, mağaza veya ofis açılışı için gönderilen çiçek, hem tebrik hem de zarif bir görünüm sunar. Floria Garden olarak Gemlik'te açılışlara özel ferforje, ayaklı aranjman ve kutlama çiçekleri hazırlıyoruz.",
    sections: [
      {
        heading: "Açılışlara özel düzenlemeler",
        paragraphs: [
          "Mekânın önünde göz alıcı duran ferforje (ayaklı) çiçekler, açılış kutlamalarının klasiğidir. Bunun yanında masa aranjmanları, orkide grupları ve kutuda çiçeklerle daha sade kutlamalar da hazırlıyoruz.",
          "Üzerine iliştirilecek kurdele/kart üzerine firma adı ve tebrik mesajınızı ekliyoruz.",
        ],
      },
      {
        heading: "Kurumsal siparişler",
        paragraphs: [
          "Birden fazla adrese gönderim, fatura ve toplu sipariş gibi kurumsal ihtiyaçlarınızda yanınızdayız. İhtiyacınızı WhatsApp üzerinden iletmeniz yeterli; size uygun teklif ve teslim planını hazırlarız.",
        ],
      },
      {
        heading: "Aynı gün teslimat",
        paragraphs: [
          "Gemlik içi açılış çiçeği siparişlerini aynı gün teslim ediyoruz. Açılış saatine yetişmesi için teslim gününü ve saat aralığını sipariş sırasında belirtmeniz önemlidir.",
        ],
      },
      {
        heading: "Nasıl sipariş verilir?",
        paragraphs: [
          "Açılış çiçekleri çoğunlukla mekâna özel hazırlandığı için, en sağlıklı yol WhatsApp hattımızdan yazmaktır. Bütçenizi, açılış adresini ve tarihini iletin; uygun ferforje ve aranjman seçeneklerini paylaşalım.",
        ],
      },
    ],
    faqs: [
      {
        q: "Açılış için ferforje çiçek yapıyor musunuz?",
        a: "Evet, ayaklı (ferforje) açılış çiçekleri en çok tercih edilen kutlama düzenlemelerimizdendir.",
      },
      {
        q: "Aynı gün açılış çiçeği teslim edebilir misiniz?",
        a: "Gemlik içinde aynı gün teslimat yapıyoruz; açılış saatine yetişmesi için teslim gününü ve saatini belirtmeniz yeterli.",
      },
      {
        q: "Kurumsal/toplu sipariş alıyor musunuz?",
        a: "Evet, birden fazla adrese gönderim, fatura ve toplu siparişlerde destek veriyoruz. WhatsApp'tan ihtiyacınızı iletebilirsiniz.",
      },
      {
        q: "Çiçeğe firma adı yazılır mı?",
        a: "Tabii, kurdele veya kart üzerine firma adınızı ve tebrik mesajınızı ekliyoruz.",
      },
    ],
    related: [
      { label: "Gemlik Çiçekçi", href: "/gemlik-cicekci" },
      { label: "Tüm Ürünler", href: "/urunler" },
      { label: "Aynı Gün Teslimat", href: "/gemlik-ayni-gun-cicek-teslimati" },
      { label: "İletişim", href: "/iletisim" },
    ],
  },
];

export function getLandingPage(slug: string): LandingPageData | undefined {
  return LANDING_PAGES.find((p) => p.slug === slug);
}
