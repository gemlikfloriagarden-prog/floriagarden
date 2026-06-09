-- ============================================================
--  Floria Garden — MySQL şeması (cPanel / phpMyAdmin)
--  phpMyAdmin → oluşturduğun veritabanını seç → SQL sekmesi →
--  bu dosyanın tamamını yapıştır → Git.
--  Karakter seti utf8mb4 (Türkçe + emoji güvenli).
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+03:00';

-- ---------- Kategoriler ----------
CREATE TABLE IF NOT EXISTS categories (
  slug         VARCHAR(120) PRIMARY KEY,
  name         VARCHAR(160) NOT NULL,
  description  TEXT,
  gradient     VARCHAR(160) NOT NULL DEFAULT '',
  image        MEDIUMTEXT,                 -- URL veya base64
  sort_order   INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Ürünler ----------
CREATE TABLE IF NOT EXISTS products (
  id                VARCHAR(80) PRIMARY KEY,
  slug              VARCHAR(160) NOT NULL UNIQUE,
  name              VARCHAR(200) NOT NULL,
  short_description TEXT,
  long_description  TEXT,
  contents          TEXT,               -- JSON dizi (string)
  care_tips         TEXT,               -- JSON dizi (string)
  price             INT NOT NULL DEFAULT 0,
  category          VARCHAR(120),
  badge             VARCHAR(80),
  gradient          VARCHAR(160) NOT NULL DEFAULT '',
  image             MEDIUMTEXT,         -- URL veya base64
  gallery           TEXT,               -- JSON dizi (string)
  pairings          TEXT,               -- JSON dizi ürün id (string)
  dimensions        VARCHAR(160),
  stock             ENUM('var','az','tukendi') NOT NULL DEFAULT 'var',
  sort_order        INT NOT NULL DEFAULT 0,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_products_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Üyeler ----------
CREATE TABLE IF NOT EXISTS members (
  id            VARCHAR(80) PRIMARY KEY,
  name          VARCHAR(200) NOT NULL,
  phone         VARCHAR(40),
  email         VARCHAR(200),
  birth_date    DATE NULL,
  password_hash VARCHAR(255),
  joined_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Üyeye özel kodlar ----------
CREATE TABLE IF NOT EXISTS member_codes (
  code           VARCHAR(60) PRIMARY KEY,
  member_id      VARCHAR(80) NOT NULL,
  discount_type  ENUM('percent','fixed') NOT NULL DEFAULT 'percent',
  discount_value INT NOT NULL DEFAULT 0,
  note           VARCHAR(255),
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_member_codes_member (member_id),
  CONSTRAINT fk_member_codes_member FOREIGN KEY (member_id)
    REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Şifre sıfırlama tokenları ----------
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  token_hash VARCHAR(64) PRIMARY KEY,
  member_id  VARCHAR(80) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at    DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_password_reset_member (member_id),
  INDEX idx_password_reset_expires (expires_at),
  CONSTRAINT fk_password_reset_member FOREIGN KEY (member_id)
    REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Üye adres defteri ----------
CREATE TABLE IF NOT EXISTS member_addresses (
  id             VARCHAR(80) PRIMARY KEY,
  member_id      VARCHAR(80) NOT NULL,
  label          VARCHAR(120) NOT NULL DEFAULT 'Adres',
  recipient_name VARCHAR(200),
  phone          VARCHAR(40),
  city_district  VARCHAR(160),
  address        TEXT NOT NULL,
  note           VARCHAR(255),
  is_default     TINYINT(1) NOT NULL DEFAULT 0,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_member_addresses_member (member_id),
  CONSTRAINT fk_member_addresses_member FOREIGN KEY (member_id)
    REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Genel (kampanya) kodlar ----------
CREATE TABLE IF NOT EXISTS general_codes (
  code           VARCHAR(60) PRIMARY KEY,
  discount_type  ENUM('percent','fixed') NOT NULL DEFAULT 'percent',
  discount_value INT NOT NULL DEFAULT 0,
  note           VARCHAR(255),
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- E-bülten aboneleri ----------
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  email      VARCHAR(200) PRIMARY KEY,
  source     VARCHAR(80) NOT NULL DEFAULT 'footer',
  status     ENUM('active','unsubscribed') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Teslimat bölgeleri ----------
CREATE TABLE IF NOT EXISTS delivery_zones (
  id         VARCHAR(80) PRIMARY KEY,
  name       VARCHAR(160) NOT NULL,
  eta        VARCHAR(120),
  fee        VARCHAR(120),
  note       VARCHAR(255),
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Teslimat süreci adımları ----------
CREATE TABLE IF NOT EXISTS delivery_steps (
  id         VARCHAR(80) PRIMARY KEY,
  icon       VARCHAR(60) NOT NULL DEFAULT 'sparkles',
  title      VARCHAR(160) NOT NULL,
  text       TEXT,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Siparişler ----------
CREATE TABLE IF NOT EXISTS orders (
  id              VARCHAR(80) PRIMARY KEY,
  order_no        VARCHAR(40) NOT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  customer_name   VARCHAR(200) NOT NULL,
  customer_phone  VARCHAR(40),
  customer_email  VARCHAR(200),
  recipient_name  VARCHAR(200),
  recipient_phone VARCHAR(40),
  address         TEXT,
  surprise        TINYINT(1) NOT NULL DEFAULT 0,
  delivery_zone   VARCHAR(160),
  delivery_date   DATE NULL,
  delivery_slot   VARCHAR(120),
  payment         ENUM('nakit','havale','kapida') NOT NULL DEFAULT 'nakit',
  status          ENUM('yeni','hazirlaniyor','yolda','teslim','iptal') NOT NULL DEFAULT 'yeni',
  card_note       TEXT,
  admin_note      TEXT,
  INDEX idx_orders_status (status),
  INDEX idx_orders_delivery_date (delivery_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Sipariş kalemleri ----------
CREATE TABLE IF NOT EXISTS order_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  order_id   VARCHAR(80) NOT NULL,
  product_id VARCHAR(80),
  name       VARCHAR(200) NOT NULL,
  price      INT NOT NULL DEFAULT 0,
  quantity   INT NOT NULL DEFAULT 1,
  INDEX idx_order_items_order (order_id),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id)
    REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Ayarlar (bakım modu, admin şifre hash'i vb.) ----------
CREATE TABLE IF NOT EXISTS settings (
  `key`   VARCHAR(80) PRIMARY KEY,
  `value` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Başlangıç ayarları
INSERT INTO settings (`key`, `value`) VALUES ('maintenance', '0')
  ON DUPLICATE KEY UPDATE `value` = `value`;
