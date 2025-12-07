-- Seed additional test documents for Phase 9D-2C verification
-- Using existing case and citizen IDs from database

-- Document for CASE-2024-0003 (Ravi Ramdin) - pending status
INSERT INTO public.documents (
  case_id,
  citizen_id,
  document_type,
  file_name,
  file_path,
  file_size,
  mime_type,
  status,
  created_at
) VALUES (
  '670d5171-4445-4b55-b266-b16b29be6b5c',
  'b6d19d9d-7830-495a-b9e7-be2aa1259f18',
  'income_proof',
  'salary_statement_dec2024.pdf',
  '/documents/citizens/b6d19d9d-7830-495a-b9e7-be2aa1259f18/salary_statement_dec2024.pdf',
  87500,
  'application/pdf',
  'pending',
  now() - interval '2 days'
);

-- Document for CASE-2024-0003 (Ravi Ramdin) - verified status
INSERT INTO public.documents (
  case_id,
  citizen_id,
  document_type,
  file_name,
  file_path,
  file_size,
  mime_type,
  status,
  verified_at,
  created_at
) VALUES (
  '670d5171-4445-4b55-b266-b16b29be6b5c',
  'b6d19d9d-7830-495a-b9e7-be2aa1259f18',
  'residency_proof',
  'utility_bill_nov2024.pdf',
  '/documents/citizens/b6d19d9d-7830-495a-b9e7-be2aa1259f18/utility_bill_nov2024.pdf',
  45000,
  'application/pdf',
  'verified',
  now() - interval '1 day',
  now() - interval '3 days'
);

-- Document for CASE-2024-0001 (Jan Jansen) - rejected status with rejection reason
INSERT INTO public.documents (
  case_id,
  citizen_id,
  document_type,
  file_name,
  file_path,
  file_size,
  mime_type,
  status,
  rejection_reason,
  created_at
) VALUES (
  '6cec7e97-5d93-4902-87ec-cd04b0ad6425',
  '3e4afedf-6894-4541-8b12-b1e3b8442b67',
  'medical_certificate',
  'medical_cert_expired.pdf',
  '/documents/citizens/3e4afedf-6894-4541-8b12-b1e3b8442b67/medical_cert_expired.pdf',
  125000,
  'application/pdf',
  'rejected',
  'Document is older than 6 months and no longer valid for this application.',
  now() - interval '5 days'
);

-- Document for CASE-2024-0001 (Jan Jansen) - expired status
INSERT INTO public.documents (
  case_id,
  citizen_id,
  document_type,
  file_name,
  file_path,
  file_size,
  mime_type,
  status,
  expires_at,
  created_at
) VALUES (
  '6cec7e97-5d93-4902-87ec-cd04b0ad6425',
  '3e4afedf-6894-4541-8b12-b1e3b8442b67',
  'bank_statement',
  'bank_statement_q3_2024.pdf',
  '/documents/citizens/3e4afedf-6894-4541-8b12-b1e3b8442b67/bank_statement_q3_2024.pdf',
  256000,
  'application/pdf',
  'expired',
  '2024-10-01',
  now() - interval '90 days'
);