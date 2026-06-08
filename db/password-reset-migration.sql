-- ============================================================
--  Floria Garden — şifre sıfırlama kurulumu
--  phpMyAdmin → veritabanını seç → SQL sekmesi →
--  bu dosyanın tamamını yapıştır → Git.
--  Bir kez çalıştırmak yeterlidir; tekrar çalıştırılırsa tabloyu bozmaz.
-- ============================================================

SET NAMES utf8mb4;

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
