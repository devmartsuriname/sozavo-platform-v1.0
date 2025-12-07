-- Phase 9D-2C QA: Seed empty-state test case (CASE-2024-0004)
-- This case has ZERO documents to test the empty state UI

-- First, create a new citizen (Marlene Wong) for this test case
INSERT INTO public.citizens (id, national_id, first_name, last_name, date_of_birth, gender, address, district, phone, email, bis_verified)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '111222333',
  'Marlene',
  'Wong',
  '1988-03-22',
  'female',
  'Keizerstraat 50',
  'Paramaribo',
  '+597-456789',
  'marlene.wong@email.sr',
  false
);

-- Create the test case with zero documents
INSERT INTO public.cases (id, case_reference, citizen_id, service_type_id, current_status, intake_office_id, priority, notes)
VALUES (
  'd4e5f6a7-b8c9-0123-4567-890abcdef123',
  'CASE-2024-0004',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'b2051de5-2aec-47c9-a94e-faeec6230eb2', -- General Assistance (AB)
  'intake',
  'bad18cd4-afd5-43ea-959b-ef9eb56b6f53', -- Paramaribo office
  'LOW',
  'QA test case for empty documents state verification'
);

-- Add a case event for this case
INSERT INTO public.case_events (case_id, event_type, new_status, meta)
VALUES (
  'd4e5f6a7-b8c9-0123-4567-890abcdef123',
  'case_created',
  'intake',
  '{"source": "QA test data", "purpose": "Empty documents state testing"}'::jsonb
);