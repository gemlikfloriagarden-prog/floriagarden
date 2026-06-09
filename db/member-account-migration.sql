-- ============================================================
-- Floria Garden — Hesabım geliştirmeleri
-- Üye adres defteri tablosu
-- phpMyAdmin → veritabanı → SQL sekmesi → çalıştır
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+03:00';

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
