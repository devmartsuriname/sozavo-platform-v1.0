-- Phase 9D-2E: Seed comprehensive fraud test data for QA
-- This adds fraud signals and risk scores for multiple cases to test all scenarios

-- First, get the case IDs we need
-- CASE-2024-0001: HIGH risk with multiple signals
-- CASE-2024-0002: Already has some data - update to MEDIUM risk
-- CASE-2024-0003: LOW risk with dismissed signal  
-- CASE-2024-0004: No fraud data (empty state)

-- Insert fraud risk score for CASE-2024-0001 (HIGH risk)
INSERT INTO public.fraud_risk_scores (case_id, risk_score, risk_level, signal_count, last_evaluated_at)
SELECT c.id, 82.50, 'high', 2, NOW() - INTERVAL '2 hours'
FROM public.cases c WHERE c.case_reference = 'CASE-2024-0001'
ON CONFLICT (case_id) DO UPDATE SET 
  risk_score = EXCLUDED.risk_score,
  risk_level = EXCLUDED.risk_level,
  signal_count = EXCLUDED.signal_count,
  last_evaluated_at = EXCLUDED.last_evaluated_at;

-- Insert fraud signals for CASE-2024-0001
INSERT INTO public.fraud_signals (case_id, signal_type, severity, description, evidence, status, created_at)
SELECT c.id, 'income_discrepancy', 'high', 
  'Declared income of SRD 2,500 does not match Subema records showing SRD 8,200 monthly employment income.',
  '{"subema_income": 8200, "declared_income": 2500, "discrepancy_pct": 69.5}'::jsonb,
  'investigating', NOW() - INTERVAL '3 days'
FROM public.cases c WHERE c.case_reference = 'CASE-2024-0001';

INSERT INTO public.fraud_signals (case_id, signal_type, severity, description, evidence, status, created_at)
SELECT c.id, 'duplicate_application', 'medium',
  'Similar application found under spouse national ID with overlapping benefit period.',
  '{"related_case_ref": "CASE-2023-0892", "spouse_national_id": "SR-****-7823", "overlap_months": 4}'::jsonb,
  'pending', NOW() - INTERVAL '1 day'
FROM public.cases c WHERE c.case_reference = 'CASE-2024-0001';

-- Insert fraud risk score for CASE-2024-0003 (LOW risk)
INSERT INTO public.fraud_risk_scores (case_id, risk_score, risk_level, signal_count, last_evaluated_at)
SELECT c.id, 15.00, 'low', 1, NOW() - INTERVAL '5 days'
FROM public.cases c WHERE c.case_reference = 'CASE-2024-0003'
ON CONFLICT (case_id) DO UPDATE SET 
  risk_score = EXCLUDED.risk_score,
  risk_level = EXCLUDED.risk_level,
  signal_count = EXCLUDED.signal_count,
  last_evaluated_at = EXCLUDED.last_evaluated_at;

-- Insert dismissed signal for CASE-2024-0003
INSERT INTO public.fraud_signals (case_id, signal_type, severity, description, evidence, status, reviewed_by, reviewed_at, created_at)
SELECT c.id, 'address_mismatch', 'low',
  'Minor address format discrepancy between application and BIS records (unit number vs apartment).',
  '{"application_address": "Apt 4B, Grote Combéweg 22", "bis_address": "Unit 4B, Grote Combéweg 22"}'::jsonb,
  'dismissed', NULL, NOW() - INTERVAL '10 days', NOW() - INTERVAL '12 days'
FROM public.cases c WHERE c.case_reference = 'CASE-2024-0003';

-- Update existing CASE-2024-0002 fraud data to have confirmed + dismissed signals for variety
-- First update the risk score
UPDATE public.fraud_risk_scores 
SET risk_score = 45.00, risk_level = 'medium', signal_count = 2, last_evaluated_at = NOW() - INTERVAL '1 day'
WHERE case_id = (SELECT id FROM public.cases WHERE case_reference = 'CASE-2024-0002');

-- Add a confirmed signal to CASE-2024-0002
INSERT INTO public.fraud_signals (case_id, signal_type, severity, description, evidence, status, reviewed_by, reviewed_at, created_at)
SELECT c.id, 'benefit_overlap', 'medium',
  'Confirmed receiving child allowance while also claiming under spouse household.',
  '{"spouse_case_ref": "CASE-2023-1156", "overlap_amount": 450, "overlap_period": "2024-01 to 2024-03"}'::jsonb,
  'confirmed', NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '7 days'
FROM public.cases c WHERE c.case_reference = 'CASE-2024-0002'
ON CONFLICT DO NOTHING;
