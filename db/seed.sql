-- ============================================================
--  Floria Garden — başlangıç verisi (kategoriler + teslimat)
--  phpMyAdmin → gemlikfl_floria → SQL → yapıştır → Git.
--  Bir kez çalıştır; tekrar çalıştırırsan günceller (çakışmaz).
--  Ürünler/üyeler/siparişler buraya konmaz — onları panelden ekleyeceksin.
-- ============================================================

SET NAMES utf8mb4;

INSERT INTO categories (slug,name,description,gradient,sort_order) VALUES
 ('buketler','Buketler','El yapımı, mevsim çiçekleriyle hazırlanan zarif buketler.','from-bordo-400 via-bordo-600 to-bordo-800',1),
 ('kutuda-cicekler','Kutuda Çiçekler','Premium kadife kutularda uzun ömürlü düzenlemeler.','from-rose-gold via-bordo-400 to-bordo-700',2),
 ('saksi-cicekleri','Saksı Çiçekleri','Eviniz ve ofisiniz için canlı, bakımlı saksı çiçekleri.','from-rose-goldLight via-rose-gold to-rose-goldDark',3),
 ('ozel-gun-cicekleri','Özel Gün Çiçekleri','Yıldönümü, doğum günü ve sevdikleriniz için kişisel dokunuş.','from-bordo-300 via-bordo-500 to-bordo-700',4),
 ('acilis-ve-organizasyon','Açılış ve Organizasyon','Açılış çelenkleri ve kurumsal etkinlikler için özel tasarımlar.','from-bordo-500 via-bordo-700 to-coffee',5),
 ('hediyelik-urunler','Hediyelik Ürünler','Çikolata, mum, parfüm ve seçkin hediyelikler.','from-rose-goldLight via-rose-gold to-bordo-400',6),
 ('kahve-ve-cicek-setleri','Kahve ve Çiçek Setleri','İmza koleksiyonumuz: özenle seçilmiş kahve ve çiçek ikilisi.','from-coffee-soft via-coffee to-bordo-700',7)
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), gradient=VALUES(gradient), sort_order=VALUES(sort_order);

INSERT INTO delivery_zones (id,name,eta,fee,note,sort_order) VALUES
 ('zone-gemlik-merkez','Gemlik Merkez','60 — 120 dk','Ücretsiz','100 ₺ üzeri siparişlerde',1),
 ('zone-gemlik-cevresi','Gemlik Çevresi','120 — 180 dk','75 ₺','Köy yerleşimleri dâhil',2),
 ('zone-cevre-ilceler','Çevre İlçeler','1 — 2 iş günü','Mesafeye göre','Anlaşmalı kurye',3)
ON DUPLICATE KEY UPDATE name=VALUES(name), eta=VALUES(eta), fee=VALUES(fee), note=VALUES(note), sort_order=VALUES(sort_order);

INSERT INTO delivery_steps (id,icon,title,text,sort_order) VALUES
 ('step-hazirlama','sparkles','Sipariş hazırlama','Atölyemizde çiçek şefimiz tarafından özenle hazırlanır.',1),
 ('step-ambalaj','gift','Lüks ambalaj','Kadife, ipek ve doğal dokularla butik ambalaj yapılır.',2),
 ('step-yolda','truck','Yolda','Isı kontrollü ekipmanlarla kuryemiz adrese yola çıkar.',3),
 ('step-teslim','shield','Elden teslim','Çiçeğin tazeliği korunarak alıcıya elden teslim edilir.',4)
ON DUPLICATE KEY UPDATE icon=VALUES(icon), title=VALUES(title), text=VALUES(text), sort_order=VALUES(sort_order);
