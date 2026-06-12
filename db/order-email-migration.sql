-- Eski kurulumlarda sipariş e-posta eşleştirmesi için eksik olabilir.
ALTER TABLE orders
  ADD COLUMN customer_email VARCHAR(200) NULL AFTER customer_phone;
