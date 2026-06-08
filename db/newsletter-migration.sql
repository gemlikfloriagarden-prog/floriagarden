-- ============================================================
--  Floria Garden — e-bülten aboneleri kurulumu
--  phpMyAdmin → veritabanını seç → SQL sekmesi →
--  bu dosyanın tamamını yapıştır → Git.
--  Bir kez çalıştırmak yeterlidir; tekrar çalıştırılırsa tabloyu bozmaz.
-- ============================================================

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  email      VARCHAR(200) PRIMARY KEY,
  source     VARCHAR(80) NOT NULL DEFAULT 'footer',
  status     ENUM('active','unsubscribed') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
