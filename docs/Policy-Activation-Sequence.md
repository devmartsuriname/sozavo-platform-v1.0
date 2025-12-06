# Policy Activation Sequence
## SoZaVo Platform v1.0 — Phase 8

> **Status**: Documentation Only — NO SQL executed  
> **Version**: 1.0  
> **Source**: RLS-Policy-Definitions.md, Security-Definer-Functions.md

---

## 1. Overview

This document defines the safe, ordered sequence for activating Row-Level Security (RLS) on the SoZaVo Platform. Following this sequence prevents data exposure, recursive policy issues, and service disruption.

### 1.1 Activation Principles

1. **Functions First**: All SECURITY DEFINER functions must exist before policies
2. **Low to High**: Enable RLS on LOW sensitivity tables before HIGH
3. **Read Before Write**: Activate SELECT policies before INSERT/UPDATE/DELETE
4. **Test Each Step**: Validate access after each activation phase
5. **Rollback Ready**: Maintain ability to disable policies if issues arise

---

## 2. Pre-Activation Checklist

### 2.1 Database Prerequisites

| Requirement | Validation Query | Status |
|-------------|------------------|--------|
| All tables have PRIMARY KEYS | `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name NOT IN (SELECT table_name FROM information_schema.table_constraints WHERE constraint_type = 'PRIMARY KEY')` | ☐ |
| All foreign keys validated | `SELECT * FROM pg_constraint WHERE contype = 'f' AND convalidated = false` | ☐ |
| app_role ENUM type exists | `SELECT 1 FROM pg_type WHERE typname = 'app_role'` | ☐ |
| user_roles table exists | `SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles'` | ☐ |
| At least one admin user exists | `SELECT 1 FROM user_roles WHERE role = 'system_admin'` | ☐ |

### 2.2 Function Prerequisites

| Requirement | Validation | Status |
|-------------|------------|--------|
| has_role() function created | Check pg_proc | ☐ |
| is_admin() function created | Check pg_proc | ☐ |
| All 21 helper functions created | Count in pg_proc | ☐ |
| Functions have SECURITY DEFINER | Check prosecdef | ☐ |
| Functions have search_path set | Check proconfig | ☐ |

### 2.3 Administrative Prerequisites

| Requirement | Action | Status |
|-------------|--------|--------|
| Database backup taken | pg_dump or Supabase backup | ☐ |
| Admin credentials documented | Secure storage | ☐ |
| Test users created for each role | 9 test accounts | ☐ |
| Rollback procedure documented | This document Section 6 | ☐ |
| Maintenance window scheduled | Off-peak hours | ☐ |

---

## 3. Activation Phases

### Phase 0: Foundation Setup (Pre-RLS)

**Duration**: ~15 minutes  
**Risk Level**: LOW  
**Rollback**: DROP statements

```sql
-- Step 0.1: Create app_role ENUM type
CREATE TYPE public.app_role AS ENUM (
  'citizen',
  'district_intake_officer',
  'case_handler',
  'case_reviewer',
  'department_head',
  'finance_officer',
  'fraud_officer',
  'system_admin',
  'audit_viewer'
);

-- Step 0.2: Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  UNIQUE (user_id, role)
);

-- Step 0.3: Create indexes
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);

-- Step 0.4: Register admin user
INSERT INTO public.user_roles (user_id, role, assigned_by)
VALUES ('[ADMIN_USER_UUID]', 'system_admin', '[ADMIN_USER_UUID]');
```

**Validation**:
```sql
SELECT COUNT(*) FROM public.user_roles WHERE role = 'system_admin';
-- Expected: >= 1
```

---

### Phase 1: Create SECURITY DEFINER Functions

**Duration**: ~10 minutes  
**Risk Level**: LOW  
**Rollback**: DROP FUNCTION statements

Execute functions in dependency order (see Security-Definer-Functions.md):

```sql
-- Step 1.1: Base function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

-- Step 1.2: Role convenience functions (7 functions)
-- is_admin(), is_case_handler(), is_reviewer(), is_fraud_officer(), 
-- is_finance_officer(), is_audit_viewer()

-- Step 1.3: Scope functions (6 functions)
-- current_user_id(), auth_office_id(), auth_district_id(), 
-- auth_portal_user_id(), auth_user_roles(), user_department_scope()

-- Step 1.4: Ownership functions (4 functions)
-- is_case_owner(), is_document_owner(), is_portal_owner(), has_case_access()

-- Step 1.5: Validation functions (4 functions)
-- can_transition(), field_locked(), can_upload_document(), can_update_eligibility()
```

**Validation**:
```sql
SELECT COUNT(*) FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND p.prosecdef = true
  AND p.proname IN ('has_role', 'is_admin', 'has_case_access', ...);
-- Expected: 21
```

---

### Phase 2: Enable RLS on user_roles (CRITICAL)

**Duration**: ~5 minutes  
**Risk Level**: HIGH (must not break function execution)  
**Rollback**: ALTER TABLE ... DISABLE ROW LEVEL SECURITY

```sql
-- Step 2.1: Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 2.2: Create policies for user_roles
CREATE POLICY "user_roles_select_own"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "user_roles_insert_admin_only"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "user_roles_update_admin_only"
ON public.user_roles FOR UPDATE TO authenticated
USING (public.is_admin());

CREATE POLICY "user_roles_delete_admin_only"
ON public.user_roles FOR DELETE TO authenticated
USING (public.is_admin());
```

**Validation**:
```sql
-- Test as admin user
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub = '[ADMIN_USER_UUID]';
SELECT public.is_admin();
-- Expected: true

SELECT * FROM public.user_roles;
-- Expected: All rows visible (admin)
```

---

### Phase 3: Enable RLS on LOW Sensitivity Tables

**Duration**: ~10 minutes  
**Risk Level**: LOW  
**Rollback**: ALTER TABLE ... DISABLE ROW LEVEL SECURITY

Tables in this phase:
- service_types
- offices
- document_requirements
- eligibility_rules
- notification_templates

```sql
-- Step 3.1: Enable RLS
ALTER TABLE public.service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eligibility_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

-- Step 3.2: Apply SELECT policies (all authenticated users)
CREATE POLICY "service_types_select_all"
ON public.service_types FOR SELECT TO authenticated USING (true);

CREATE POLICY "offices_select_all"
ON public.offices FOR SELECT TO authenticated USING (true);

CREATE POLICY "document_requirements_select_all"
ON public.document_requirements FOR SELECT TO authenticated USING (true);

CREATE POLICY "eligibility_rules_select_all"
ON public.eligibility_rules FOR SELECT TO authenticated USING (true);

CREATE POLICY "notification_templates_select_all"
ON public.notification_templates FOR SELECT TO authenticated USING (true);

-- Step 3.3: Apply admin-only modification policies
-- (See RLS-Policy-Definitions.md for full specifications)
```

**Validation**:
```sql
-- Test as regular user
SET LOCAL request.jwt.claim.sub = '[REGULAR_USER_UUID]';
SELECT COUNT(*) FROM public.service_types;
-- Expected: > 0 (can read)

INSERT INTO public.service_types (name) VALUES ('test');
-- Expected: ERROR (denied)
```

---

### Phase 4: Enable RLS on MEDIUM Sensitivity Tables (SELECT Only)

**Duration**: ~15 minutes  
**Risk Level**: MEDIUM  
**Rollback**: DROP POLICY ... ; ALTER TABLE ... DISABLE ROW LEVEL SECURITY

Tables in this phase:
- documents
- households
- incomes
- notifications
- portal_notifications
- workflow_definitions
- wizard_definitions

```sql
-- Step 4.1: Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wizard_definitions ENABLE ROW LEVEL SECURITY;

-- Step 4.2: Apply SELECT policies only
-- (Full policies from RLS-Policy-Definitions.md)
```

**Validation**:
```sql
-- Test citizen access to own documents
SET LOCAL request.jwt.claim.sub = '[CITIZEN_UUID]';
SELECT * FROM public.documents;
-- Expected: Only documents for own cases

-- Test case handler access
SET LOCAL request.jwt.claim.sub = '[HANDLER_UUID]';
SELECT * FROM public.households;
-- Expected: Only households for accessible cases
```

---

### Phase 5: Add INSERT Policies to MEDIUM Tables

**Duration**: ~10 minutes  
**Risk Level**: MEDIUM  
**Rollback**: DROP POLICY statements

```sql
-- Step 5.1: Apply INSERT policies
CREATE POLICY "documents_insert_by_owner_or_staff"
ON public.documents FOR INSERT TO authenticated
WITH CHECK (...);

CREATE POLICY "households_insert_by_handler"
ON public.households FOR INSERT TO authenticated
WITH CHECK (...);

-- (Continue for all MEDIUM tables)
```

**Validation**:
```sql
-- Test case handler can insert household
SET LOCAL request.jwt.claim.sub = '[HANDLER_UUID]';
INSERT INTO public.households (case_id, ...) 
VALUES ('[ASSIGNED_CASE_ID]', ...);
-- Expected: Success

INSERT INTO public.households (case_id, ...) 
VALUES ('[UNASSIGNED_CASE_ID]', ...);
-- Expected: ERROR (denied)
```

---

### Phase 6: Add UPDATE/DELETE Policies to MEDIUM Tables

**Duration**: ~10 minutes  
**Risk Level**: MEDIUM  
**Rollback**: DROP POLICY statements

```sql
-- Step 6.1: Apply UPDATE policies
-- Step 6.2: Apply DELETE policies (admin only for most)
-- (Full policies from RLS-Policy-Definitions.md)
```

---

### Phase 7: Enable RLS on HIGH Sensitivity Tables (SELECT Only)

**Duration**: ~20 minutes  
**Risk Level**: HIGH  
**Rollback**: Immediate disable if issues

Tables in this phase:
- citizens
- cases
- case_events
- eligibility_evaluations
- payment_batches
- payment_items
- fraud_signals
- fraud_risk_scores

```sql
-- Step 7.1: Enable RLS (one table at a time with validation)
ALTER TABLE public.citizens ENABLE ROW LEVEL SECURITY;
-- Validate
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
-- Validate
-- Continue for each table

-- Step 7.2: Apply SELECT policies
-- (Full policies from RLS-Policy-Definitions.md)
```

**Validation**:
```sql
-- Test citizen cannot see other citizens
SET LOCAL request.jwt.claim.sub = '[CITIZEN_A_UUID]';
SELECT COUNT(*) FROM public.citizens WHERE portal_user_id != auth.uid();
-- Expected: 0

-- Test case handler sees assigned cases
SET LOCAL request.jwt.claim.sub = '[HANDLER_UUID]';
SELECT COUNT(*) FROM public.cases WHERE case_handler_id = auth.uid();
-- Expected: > 0
```

---

### Phase 8: Add INSERT/UPDATE/DELETE Policies to HIGH Tables

**Duration**: ~20 minutes  
**Risk Level**: HIGH  
**Rollback**: DROP POLICY statements

```sql
-- Step 8.1: Apply INSERT policies
-- Step 8.2: Apply UPDATE policies (with status-lock checks)
-- Step 8.3: Apply DELETE policies (admin only)
-- (Full policies from RLS-Policy-Definitions.md)
```

---

### Phase 9: Apply Column Masking (If Using Views)

**Duration**: ~15 minutes  
**Risk Level**: MEDIUM  
**Rollback**: DROP VIEW statements

```sql
-- Step 9.1: Create masked views for sensitive columns
CREATE OR REPLACE VIEW public.citizens_masked AS
SELECT 
  id,
  CASE 
    WHEN portal_user_id = auth.uid() OR public.is_admin() 
    THEN national_id
    ELSE CONCAT('XXX-XXX-', RIGHT(national_id, 3))
  END AS national_id,
  -- ... other columns
FROM public.citizens;

-- Step 9.2: Grant access to views instead of base tables
-- (Alternative: Use generated columns or application-level masking)
```

---

### Phase 10: Validate Workflow-Bound Locks

**Duration**: ~15 minutes  
**Risk Level**: MEDIUM  
**Rollback**: N/A (validation only)

```sql
-- Test wizard_data lock
UPDATE public.cases 
SET wizard_data = '{"test": true}'
WHERE current_status = 'validation';
-- Expected: ERROR (field locked)

-- Test eligibility lock
UPDATE public.eligibility_evaluations 
SET result = 'eligible'
WHERE case_id IN (SELECT id FROM cases WHERE current_status = 'approved');
-- Expected: ERROR (field locked)
```

---

## 4. Post-Activation Validation

### 4.1 Role-Based Access Tests

Execute all 20 test scenarios from Policy-Test-Suite.md:

| Test ID | Scenario | Expected | Status |
|---------|----------|----------|--------|
| T01 | Citizen accessing another citizen's data | DENIED | ☐ |
| T02 | Intake officer updating payment fields | DENIED | ☐ |
| T03 | Fraud officer reading low-risk case | DENIED | ☐ |
| T04 | Finance officer updating eligibility | DENIED | ☐ |
| T05 | Reviewer editing wizard_data | DENIED | ☐ |
| ... | ... | ... | ☐ |

### 4.2 Performance Validation

```sql
-- Check policy evaluation time
EXPLAIN ANALYZE SELECT * FROM public.cases;
-- Expected: < 100ms for typical queries

-- Check for sequential scans on large tables
SELECT schemaname, relname, seq_scan, seq_tup_read
FROM pg_stat_user_tables
WHERE seq_scan > 100;
-- Investigate any unexpected sequential scans
```

### 4.3 Application Integration Tests

| Test | Endpoint | Expected | Status |
|------|----------|----------|--------|
| Citizen login | /api/auth/login | Success | ☐ |
| Citizen view own case | /api/cases/me | Own cases only | ☐ |
| Handler case list | /api/cases | Assigned + office cases | ☐ |
| Admin access | /api/admin/* | Full access | ☐ |

---

## 5. Activation Timeline Summary

| Phase | Duration | Risk | Tables Affected |
|-------|----------|------|-----------------|
| 0. Foundation | 15 min | LOW | user_roles (create) |
| 1. Functions | 10 min | LOW | None |
| 2. user_roles RLS | 5 min | HIGH | user_roles |
| 3. LOW tables | 10 min | LOW | 5 tables |
| 4. MEDIUM SELECT | 15 min | MEDIUM | 7 tables |
| 5. MEDIUM INSERT | 10 min | MEDIUM | 7 tables |
| 6. MEDIUM UPDATE/DELETE | 10 min | MEDIUM | 7 tables |
| 7. HIGH SELECT | 20 min | HIGH | 8 tables |
| 8. HIGH INSERT/UPDATE/DELETE | 20 min | HIGH | 8 tables |
| 9. Column Masking | 15 min | MEDIUM | Views |
| 10. Workflow Validation | 15 min | MEDIUM | Validation |
| **TOTAL** | **~2.5 hours** | | **21 tables** |

---

## 6. Rollback Procedures

### 6.1 Emergency Full Rollback

```sql
-- EMERGENCY: Disable all RLS immediately
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT table_name FROM information_schema.tables 
             WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', tbl);
  END LOOP;
END $$;
```

### 6.2 Per-Table Rollback

```sql
-- Rollback specific table
ALTER TABLE public.cases DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "cases_select_by_role" ON public.cases;
DROP POLICY IF EXISTS "cases_insert_by_intake" ON public.cases;
DROP POLICY IF EXISTS "cases_update_by_handler" ON public.cases;
DROP POLICY IF EXISTS "cases_delete_admin_only" ON public.cases;
```

### 6.3 Function Rollback

```sql
-- Drop functions in reverse dependency order
DROP FUNCTION IF EXISTS public.has_case_access(UUID);
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.has_role(UUID, app_role);
-- Continue for all functions
```

---

## 7. Monitoring After Activation

### 7.1 Key Metrics to Watch

| Metric | Threshold | Action if Exceeded |
|--------|-----------|-------------------|
| Query latency increase | > 50% | Review policy complexity |
| Failed RLS checks/hour | > 100 | Check for misconfiguration |
| Sequential scans on RLS tables | Increasing | Add indexes |
| Error rate | > 1% | Investigate policies |

### 7.2 Logging Configuration

```sql
-- Enable logging for RLS violations
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_error_statement = 'error';
-- Monitor pg_stat_statements for slow queries
```

---

## 8. Requires Clarification

| Item | Context | Impact |
|------|---------|--------|
| Maintenance window timing | Production schedule | Activation scheduling |
| Backup/restore procedure | Supabase-specific | Rollback capability |
| Monitoring integration | Alerting system | Post-activation monitoring |
| Staff assignment table | auth_office_id() dependency | Phase 1 blocking |

---

## 9. References

- [RLS-Policy-Definitions.md](./RLS-Policy-Definitions.md)
- [Security-Definer-Functions.md](./Security-Definer-Functions.md)
- [Policy-Test-Suite.md](./Policy-Test-Suite.md)
- [Policy-Validation-Matrix.md](./Policy-Validation-Matrix.md)

---

**Document Version**: 1.0  
**Phase**: 8  
**Status**: Documentation Only — Pending Phase 9 Execution
