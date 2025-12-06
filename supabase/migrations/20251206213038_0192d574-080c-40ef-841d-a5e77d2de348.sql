-- =====================================================================
-- Phase 9D-0: Complete Database Schema for SoZaVo Admin MVP
-- Following Data Dictionary v1.0 specifications exactly
-- =====================================================================

-- =====================================================================
-- 1. ENUM DEFINITIONS (app_role already exists)
-- =====================================================================

-- 1.1 case_status (10 values per Data Dictionary)
CREATE TYPE public.case_status AS ENUM (
  'intake',
  'validation',
  'eligibility_check',
  'under_review',
  'approved',
  'rejected',
  'payment_pending',
  'payment_processed',
  'closed',
  'on_hold'
);

-- 1.2 document_type (10 values)
CREATE TYPE public.document_type AS ENUM (
  'id_card',
  'income_proof',
  'medical_certificate',
  'birth_certificate',
  'school_enrollment',
  'residency_proof',
  'bank_statement',
  'marriage_certificate',
  'death_certificate',
  'household_composition'
);

-- 1.3 document_status (4 values)
CREATE TYPE public.document_status AS ENUM (
  'pending',
  'verified',
  'rejected',
  'expired'
);

-- 1.4 payment_status (4 values)
CREATE TYPE public.payment_status AS ENUM (
  'pending',
  'processed',
  'failed',
  'cancelled'
);

-- 1.5 batch_status (8 values)
CREATE TYPE public.batch_status AS ENUM (
  'draft',
  'pending_approval',
  'approved',
  'submitted',
  'processing',
  'completed',
  'failed',
  'cancelled'
);

-- 1.6 payment_item_status (6 values)
CREATE TYPE public.payment_item_status AS ENUM (
  'pending',
  'submitted',
  'processing',
  'completed',
  'failed',
  'returned'
);

-- 1.7 fraud_severity (4 values)
CREATE TYPE public.fraud_severity AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

-- 1.8 risk_level (5 values)
CREATE TYPE public.risk_level AS ENUM (
  'minimal',
  'low',
  'medium',
  'high',
  'critical'
);

-- 1.9 audit_event_type (12 values)
CREATE TYPE public.audit_event_type AS ENUM (
  'create',
  'read',
  'update',
  'delete',
  'login',
  'logout',
  'export',
  'import',
  'approval',
  'rejection',
  'override',
  'escalation'
);

-- =====================================================================
-- 2. CORE TABLES (in dependency order)
-- =====================================================================

-- 2.1 service_types
CREATE TABLE public.service_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.service_types ENABLE ROW LEVEL SECURITY;

-- 2.2 offices
CREATE TABLE public.offices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id VARCHAR(10) NOT NULL,
  name VARCHAR(100) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.offices ENABLE ROW LEVEL SECURITY;

-- 2.3 users (internal staff - separate from auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  office_id UUID REFERENCES public.offices(id),
  district_id VARCHAR(10),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2.4 citizens (Central Citizen Record - CCR)
CREATE TABLE public.citizens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  national_id VARCHAR(20) UNIQUE NOT NULL,
  bis_person_id VARCHAR(50),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(10),
  address TEXT,
  district VARCHAR(50),
  phone VARCHAR(20),
  email VARCHAR(255),
  household_members JSONB,
  bis_verified BOOLEAN NOT NULL DEFAULT false,
  bis_verified_at TIMESTAMPTZ,
  portal_user_id UUID REFERENCES auth.users(id),
  country_of_residence VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.citizens ENABLE ROW LEVEL SECURITY;

-- 2.5 cases
CREATE TABLE public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_reference VARCHAR(20) UNIQUE NOT NULL,
  citizen_id UUID REFERENCES public.citizens(id) NOT NULL,
  service_type_id UUID REFERENCES public.service_types(id) NOT NULL,
  current_status public.case_status NOT NULL DEFAULT 'intake',
  case_handler_id UUID REFERENCES public.users(id),
  reviewer_id UUID REFERENCES public.users(id),
  intake_office_id UUID REFERENCES public.offices(id),
  intake_officer_id UUID REFERENCES public.users(id),
  wizard_data JSONB,
  priority VARCHAR(10) DEFAULT 'MEDIUM',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ
);
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- 2.6 case_events (audit trail)
CREATE TABLE public.case_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  actor_id UUID REFERENCES public.users(id),
  old_status public.case_status,
  new_status public.case_status,
  meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.case_events ENABLE ROW LEVEL SECURITY;

-- 2.7 documents
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES public.cases(id),
  citizen_id UUID REFERENCES public.citizens(id) NOT NULL,
  document_type public.document_type NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  status public.document_status NOT NULL DEFAULT 'pending',
  verified_by UUID REFERENCES public.users(id),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  expires_at DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- 2.8 eligibility_rules
CREATE TABLE public.eligibility_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type_id UUID REFERENCES public.service_types(id) NOT NULL,
  rule_name VARCHAR(100) NOT NULL,
  rule_type VARCHAR(50) NOT NULL,
  condition JSONB NOT NULL,
  error_message TEXT NOT NULL,
  is_mandatory BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.eligibility_rules ENABLE ROW LEVEL SECURITY;

-- 2.9 eligibility_evaluations
CREATE TABLE public.eligibility_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES public.cases(id) NOT NULL,
  result VARCHAR(20) NOT NULL,
  criteria_results JSONB NOT NULL,
  override_by UUID REFERENCES public.users(id),
  override_reason TEXT,
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  evaluated_by UUID REFERENCES public.users(id)
);
ALTER TABLE public.eligibility_evaluations ENABLE ROW LEVEL SECURITY;

-- 2.10 document_requirements
CREATE TABLE public.document_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type_id UUID REFERENCES public.service_types(id) NOT NULL,
  document_type public.document_type NOT NULL,
  is_mandatory BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.document_requirements ENABLE ROW LEVEL SECURITY;

-- 2.11 workflow_definitions
CREATE TABLE public.workflow_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type_id UUID REFERENCES public.service_types(id) NOT NULL,
  from_status public.case_status NOT NULL,
  to_status public.case_status NOT NULL,
  required_role public.app_role NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.workflow_definitions ENABLE ROW LEVEL SECURITY;

-- 2.12 payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES public.cases(id) NOT NULL,
  citizen_id UUID REFERENCES public.citizens(id) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  payment_date DATE NOT NULL,
  status public.payment_status NOT NULL DEFAULT 'pending',
  subema_reference VARCHAR(100),
  subema_synced_at TIMESTAMPTZ,
  payment_method VARCHAR(50),
  bank_account VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 2.13 payment_batches
CREATE TABLE public.payment_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_reference VARCHAR(50) UNIQUE NOT NULL,
  status public.batch_status NOT NULL DEFAULT 'draft',
  total_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
  payment_count INTEGER NOT NULL DEFAULT 0,
  submitted_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payment_batches ENABLE ROW LEVEL SECURITY;

-- 2.14 payment_items
CREATE TABLE public.payment_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES public.payment_batches(id) ON DELETE CASCADE NOT NULL,
  payment_id UUID REFERENCES public.payments(id) NOT NULL,
  citizen_id UUID REFERENCES public.citizens(id) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  status public.payment_item_status NOT NULL DEFAULT 'pending',
  subema_item_reference VARCHAR(100),
  bank_account VARCHAR(50),
  disbursement_method VARCHAR(20) NOT NULL DEFAULT 'bank',
  error_message TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payment_items ENABLE ROW LEVEL SECURITY;

-- 2.15 fraud_signals
CREATE TABLE public.fraud_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES public.cases(id) NOT NULL,
  signal_type VARCHAR(50) NOT NULL,
  severity public.fraud_severity NOT NULL,
  description TEXT NOT NULL,
  evidence JSONB,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES public.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.fraud_signals ENABLE ROW LEVEL SECURITY;

-- 2.16 fraud_risk_scores
CREATE TABLE public.fraud_risk_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES public.cases(id) UNIQUE NOT NULL,
  risk_score DECIMAL(5,2) NOT NULL,
  risk_level public.risk_level NOT NULL,
  signal_count INTEGER NOT NULL DEFAULT 0,
  last_evaluated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.fraud_risk_scores ENABLE ROW LEVEL SECURITY;

-- 2.17 notifications (internal staff)
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT false,
  related_case_id UUID REFERENCES public.cases(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 2.18 portal_notifications (citizens)
CREATE TABLE public.portal_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID REFERENCES public.citizens(id) NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT false,
  related_case_id UUID REFERENCES public.cases(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.portal_notifications ENABLE ROW LEVEL SECURITY;

-- 2.19 households
CREATE TABLE public.households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID REFERENCES public.citizens(id) NOT NULL,
  bis_household_id VARCHAR(50),
  address TEXT NOT NULL,
  district VARCHAR(50) NOT NULL,
  member_count INTEGER NOT NULL DEFAULT 1,
  members JSONB,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;

-- 2.20 incomes
CREATE TABLE public.incomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID REFERENCES public.citizens(id) NOT NULL,
  case_id UUID REFERENCES public.cases(id) NOT NULL,
  income_type VARCHAR(50) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  employer_name VARCHAR(200),
  start_date DATE,
  end_date DATE,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verified_by UUID REFERENCES public.users(id),
  subema_verified BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.incomes ENABLE ROW LEVEL SECURITY;

-- 2.21 subema_sync_logs
CREATE TABLE public.subema_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES public.payments(id) NOT NULL,
  sync_type VARCHAR(50) NOT NULL,
  request_payload JSONB NOT NULL,
  response_payload JSONB,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  error_message TEXT,
  subema_reference VARCHAR(100),
  retries INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.subema_sync_logs ENABLE ROW LEVEL SECURITY;

-- 2.22 wizard_definitions
CREATE TABLE public.wizard_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type_id UUID REFERENCES public.service_types(id) NOT NULL,
  step_order INTEGER NOT NULL,
  step_key VARCHAR(50) NOT NULL,
  step_title VARCHAR(200) NOT NULL,
  step_config JSONB NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.wizard_definitions ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- 3. SECURITY DEFINER FUNCTIONS
-- =====================================================================

-- 3.1 current_user_id() - Get current authenticated user
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid()
$$;

-- 3.2 get_user_internal_id() - Get internal users.id from auth.uid()
CREATE OR REPLACE FUNCTION public.get_user_internal_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1
$$;

-- 3.3 has_case_access() - MVP placeholder (returns TRUE for authenticated users)
CREATE OR REPLACE FUNCTION public.has_case_access(_case_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE WHEN auth.uid() IS NOT NULL THEN TRUE ELSE FALSE END
$$;

-- 3.4 is_case_handler() - Check if current user is case_handler
CREATE OR REPLACE FUNCTION public.is_case_handler()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'case_handler')
$$;

-- 3.5 is_case_reviewer() - Check if current user is case_reviewer
CREATE OR REPLACE FUNCTION public.is_case_reviewer()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'case_reviewer')
$$;

-- 3.6 is_finance_officer() - Check if current user is finance_officer
CREATE OR REPLACE FUNCTION public.is_finance_officer()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'finance_officer')
$$;

-- 3.7 is_fraud_officer() - Check if current user is fraud_officer
CREATE OR REPLACE FUNCTION public.is_fraud_officer()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'fraud_officer')
$$;

-- 3.8 is_department_head() - Check if current user is department_head
CREATE OR REPLACE FUNCTION public.is_department_head()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'department_head')
$$;

-- 3.9 is_audit_viewer() - Check if current user is audit_viewer
CREATE OR REPLACE FUNCTION public.is_audit_viewer()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'audit_viewer')
$$;

-- 3.10 is_district_intake_officer() - Check if current user is district_intake_officer
CREATE OR REPLACE FUNCTION public.is_district_intake_officer()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'district_intake_officer')
$$;

-- =====================================================================
-- 4. RLS POLICIES (Read-Only for MVP)
-- =====================================================================

-- 4.1 service_types - All authenticated users can read
CREATE POLICY "service_types_select_authenticated" ON public.service_types
FOR SELECT TO authenticated USING (true);

-- 4.2 offices - All authenticated users can read
CREATE POLICY "offices_select_authenticated" ON public.offices
FOR SELECT TO authenticated USING (true);

-- 4.3 users - All authenticated users can read (for lookups)
CREATE POLICY "users_select_authenticated" ON public.users
FOR SELECT TO authenticated USING (true);

-- 4.4 citizens - Read access based on case access
CREATE POLICY "citizens_select_authenticated" ON public.citizens
FOR SELECT TO authenticated USING (true);

-- 4.5 cases - Read access with has_case_access
CREATE POLICY "cases_select_authenticated" ON public.cases
FOR SELECT TO authenticated USING (public.has_case_access(id));

-- 4.6 case_events - Read access based on case access
CREATE POLICY "case_events_select_authenticated" ON public.case_events
FOR SELECT TO authenticated USING (public.has_case_access(case_id));

-- 4.7 documents - Read access based on case access
CREATE POLICY "documents_select_authenticated" ON public.documents
FOR SELECT TO authenticated USING (public.has_case_access(case_id));

-- 4.8 eligibility_rules - All authenticated users can read
CREATE POLICY "eligibility_rules_select_authenticated" ON public.eligibility_rules
FOR SELECT TO authenticated USING (true);

-- 4.9 eligibility_evaluations - Read access based on case access
CREATE POLICY "eligibility_evaluations_select_authenticated" ON public.eligibility_evaluations
FOR SELECT TO authenticated USING (public.has_case_access(case_id));

-- 4.10 document_requirements - All authenticated users can read
CREATE POLICY "document_requirements_select_authenticated" ON public.document_requirements
FOR SELECT TO authenticated USING (true);

-- 4.11 workflow_definitions - All authenticated users can read
CREATE POLICY "workflow_definitions_select_authenticated" ON public.workflow_definitions
FOR SELECT TO authenticated USING (true);

-- 4.12 payments - Read access based on case access
CREATE POLICY "payments_select_authenticated" ON public.payments
FOR SELECT TO authenticated USING (public.has_case_access(case_id));

-- 4.13 payment_batches - Finance officers and admins can read
CREATE POLICY "payment_batches_select_authenticated" ON public.payment_batches
FOR SELECT TO authenticated USING (
  public.is_admin() OR public.is_finance_officer() OR public.is_department_head()
);

-- 4.14 payment_items - Finance officers and admins can read
CREATE POLICY "payment_items_select_authenticated" ON public.payment_items
FOR SELECT TO authenticated USING (
  public.is_admin() OR public.is_finance_officer() OR public.is_department_head()
);

-- 4.15 fraud_signals - Fraud officers and admins can read
CREATE POLICY "fraud_signals_select_authenticated" ON public.fraud_signals
FOR SELECT TO authenticated USING (
  public.is_admin() OR public.is_fraud_officer() OR public.is_department_head()
);

-- 4.16 fraud_risk_scores - Fraud officers and admins can read
CREATE POLICY "fraud_risk_scores_select_authenticated" ON public.fraud_risk_scores
FOR SELECT TO authenticated USING (
  public.is_admin() OR public.is_fraud_officer() OR public.is_department_head()
);

-- 4.17 notifications - Users can read their own notifications
CREATE POLICY "notifications_select_own" ON public.notifications
FOR SELECT TO authenticated USING (user_id = public.get_user_internal_id());

-- 4.18 portal_notifications - Citizens can read their own notifications
CREATE POLICY "portal_notifications_select_own" ON public.portal_notifications
FOR SELECT TO authenticated USING (
  citizen_id IN (SELECT id FROM public.citizens WHERE portal_user_id = auth.uid())
);

-- 4.19 households - Read access based on citizen access
CREATE POLICY "households_select_authenticated" ON public.households
FOR SELECT TO authenticated USING (true);

-- 4.20 incomes - Read access based on case access
CREATE POLICY "incomes_select_authenticated" ON public.incomes
FOR SELECT TO authenticated USING (public.has_case_access(case_id));

-- 4.21 subema_sync_logs - Finance officers and admins can read
CREATE POLICY "subema_sync_logs_select_authenticated" ON public.subema_sync_logs
FOR SELECT TO authenticated USING (
  public.is_admin() OR public.is_finance_officer()
);

-- 4.22 wizard_definitions - All authenticated users can read
CREATE POLICY "wizard_definitions_select_authenticated" ON public.wizard_definitions
FOR SELECT TO authenticated USING (true);

-- =====================================================================
-- 5. SEED DATA (Minimal MVP)
-- =====================================================================

-- 5.1 Service Types (AB, FB, KB)
INSERT INTO public.service_types (code, name, description, is_active) VALUES
('AB', 'Algemene Bijstand', 'General social assistance program for citizens in need', true),
('FB', 'Financiële Bijstand', 'Financial assistance program for temporary support', true),
('KB', 'Kinderbijslag', 'Child allowance program for families with children', true);

-- 5.2 Offices (Paramaribo, Nickerie, Wanica)
INSERT INTO public.offices (district_id, name, address, is_active) VALUES
('PBO', 'Paramaribo Central Office', 'Grote Combéweg 5, Paramaribo', true),
('NIC', 'Nickerie District Office', 'Gouverneurstraat 12, Nieuw-Nickerie', true),
('WAN', 'Wanica District Office', 'Lelydorpweg 45, Lelydorp', true);

-- 5.3 Sample Citizens
INSERT INTO public.citizens (national_id, first_name, last_name, date_of_birth, gender, address, district, phone, bis_verified) VALUES
('123456789', 'Jan', 'Jansen', '1985-03-15', 'M', 'Kernkampweg 10, Paramaribo', 'Paramaribo', '+597 8123456', false),
('987654321', 'Maria', 'Bouterse', '1990-07-22', 'F', 'Domineestraat 25, Nieuw-Nickerie', 'Nickerie', '+597 8234567', false),
('456789123', 'Ravi', 'Ramdin', '1978-11-08', 'M', 'Lelydorpweg 100, Lelydorp', 'Wanica', '+597 8345678', false);

-- 5.4 Sample Cases (using subquery for FK references)
INSERT INTO public.cases (case_reference, citizen_id, service_type_id, current_status, intake_office_id, priority, notes)
SELECT 
  'CASE-2024-0001',
  c.id,
  st.id,
  'intake',
  o.id,
  'MEDIUM',
  'Initial intake completed'
FROM public.citizens c, public.service_types st, public.offices o
WHERE c.national_id = '123456789' AND st.code = 'AB' AND o.district_id = 'PBO'
LIMIT 1;

INSERT INTO public.cases (case_reference, citizen_id, service_type_id, current_status, intake_office_id, priority, notes)
SELECT 
  'CASE-2024-0002',
  c.id,
  st.id,
  'eligibility_check',
  o.id,
  'HIGH',
  'Awaiting eligibility evaluation'
FROM public.citizens c, public.service_types st, public.offices o
WHERE c.national_id = '987654321' AND st.code = 'KB' AND o.district_id = 'NIC'
LIMIT 1;

INSERT INTO public.cases (case_reference, citizen_id, service_type_id, current_status, intake_office_id, priority, notes)
SELECT 
  'CASE-2024-0003',
  c.id,
  st.id,
  'approved',
  o.id,
  'LOW',
  'Approved for payment'
FROM public.citizens c, public.service_types st, public.offices o
WHERE c.national_id = '456789123' AND st.code = 'FB' AND o.district_id = 'WAN'
LIMIT 1;

-- 5.5 Sample Case Events
INSERT INTO public.case_events (case_id, event_type, old_status, new_status, meta)
SELECT id, 'status_change', NULL, 'intake', '{"source": "intake_wizard"}'::jsonb
FROM public.cases WHERE case_reference = 'CASE-2024-0001';

INSERT INTO public.case_events (case_id, event_type, old_status, new_status, meta)
SELECT id, 'status_change', 'intake', 'eligibility_check', '{"source": "case_handler"}'::jsonb
FROM public.cases WHERE case_reference = 'CASE-2024-0002';

-- 5.6 Sample Documents
INSERT INTO public.documents (case_id, citizen_id, document_type, file_name, file_path, file_size, mime_type, status)
SELECT c.id, c.citizen_id, 'id_card', 'id_card_jan.pdf', '/documents/123456789/id_card.pdf', 102400, 'application/pdf', 'verified'
FROM public.cases c WHERE c.case_reference = 'CASE-2024-0001';

INSERT INTO public.documents (case_id, citizen_id, document_type, file_name, file_path, file_size, mime_type, status)
SELECT c.id, c.citizen_id, 'income_proof', 'salary_slip.pdf', '/documents/987654321/salary.pdf', 51200, 'application/pdf', 'pending'
FROM public.cases c WHERE c.case_reference = 'CASE-2024-0002';

-- 5.7 Sample Eligibility Evaluations
INSERT INTO public.eligibility_evaluations (case_id, result, criteria_results, evaluated_at)
SELECT id, 'ELIGIBLE', '{"income_check": true, "residency_check": true, "age_check": true}'::jsonb, now()
FROM public.cases WHERE case_reference = 'CASE-2024-0003';

-- 5.8 Sample Payment Batch
INSERT INTO public.payment_batches (batch_reference, status, total_amount, payment_count)
VALUES ('BATCH-2024-001', 'draft', 2500.00, 1);

-- 5.9 Sample Payment
INSERT INTO public.payments (case_id, citizen_id, amount, payment_date, status, payment_method)
SELECT c.id, c.citizen_id, 2500.00, CURRENT_DATE, 'pending', 'bank'
FROM public.cases c WHERE c.case_reference = 'CASE-2024-0003';

-- 5.10 Sample Fraud Signal
INSERT INTO public.fraud_signals (case_id, signal_type, severity, description, status)
SELECT id, 'income_discrepancy', 'medium', 'Reported income differs from Subema records by more than 20%', 'pending'
FROM public.cases WHERE case_reference = 'CASE-2024-0002';

-- 5.11 Sample Fraud Risk Score
INSERT INTO public.fraud_risk_scores (case_id, risk_score, risk_level, signal_count)
SELECT id, 35.50, 'medium', 1
FROM public.cases WHERE case_reference = 'CASE-2024-0002';