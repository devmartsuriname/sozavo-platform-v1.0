-- Phase 9D-2D: Seed additional payment test data
-- CASE-2024-0001: 2 payments (processed, failed)
INSERT INTO payments (case_id, citizen_id, amount, payment_date, status, payment_method, bank_account, subema_reference)
VALUES 
  ('6cec7e97-5d93-4902-87ec-cd04b0ad6425', '3e4afedf-6894-4541-8b12-b1e3b8442b67', 3500.00, '2024-11-15', 'processed', 'bank', 'SR**1234', 'SUB-PAY-001'),
  ('6cec7e97-5d93-4902-87ec-cd04b0ad6425', '3e4afedf-6894-4541-8b12-b1e3b8442b67', 1200.00, '2024-10-20', 'failed', 'mobile_money', NULL, NULL);

-- CASE-2024-0002: 1 payment (cancelled)
INSERT INTO payments (case_id, citizen_id, amount, payment_date, status, payment_method)
VALUES 
  ('0fb9283c-9a49-4396-b660-eb41b9b13bcf', 'bf0ccaa8-5643-437a-8fd2-07631ca770c9', 2000.00, '2024-12-01', 'cancelled', 'bank');