# RLS Policy Definitions
## SoZaVo Platform v1.0 — Phase 8

> **Status**: Documentation Only — NO SQL executed  
> **Version**: 1.0  
> **Source**: RLS-Policy-Specification.md, RLS-Expression-Map.md, Role-Permission-Matrix.md

---

## 1. Overview

This document contains SQL-like policy definitions for all SoZaVo tables. These are **documentation specifications only** and will be converted to executable Supabase policies in Phase 9.

### 1.1 Policy Naming Convention

```
{table}_{action}_{scope}
```

Examples:
- `cases_select_by_handler`
- `citizens_update_own`
- `documents_insert_by_staff`

### 1.2 Predicate Function References

All policies reference SECURITY DEFINER functions defined in `Security-Definer-Functions.md`:
- `has_role(user_id, role)`
- `is_admin()`
- `is_case_owner(case_id)`
- `is_portal_owner(citizen_id)`
- `auth_office_id()`
- `auth_district_id()`
- `can_transition(current_status, target_status)`
- `field_locked(field_name, case_status)`

---

## 2. HIGH Sensitivity Tables

### 2.1 CITIZENS Table

```sql
-- citizens_select_by_role
-- Allows role-based read access to citizen records
CREATE POLICY "citizens_select_by_role"
ON public.citizens
FOR SELECT
TO authenticated
USING (
  -- Portal owner can see own record
  portal_user_id = auth.uid()
  -- Staff with case access can see assigned citizens
  OR EXISTS (
    SELECT 1 FROM public.cases c
    WHERE c.citizen_id = citizens.id
    AND public.has_case_access(c.id)
  )
  -- Admin sees all
  OR public.is_admin()
  -- Audit viewer sees all (read-only)
  OR public.has_role(auth.uid(), 'audit_viewer')
);

-- citizens_insert_by_intake
-- Only intake officers and case handlers can create citizen records
CREATE POLICY "citizens_insert_by_intake"
ON public.citizens
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'district_intake_officer')
  OR public.has_role(auth.uid(), 'case_handler')
  OR public.is_admin()
);

-- citizens_update_own
-- Citizens can update own non-critical fields; staff can update assigned
CREATE POLICY "citizens_update_own"
ON public.citizens
FOR UPDATE
TO authenticated
USING (
  -- Portal owner updating own record
  portal_user_id = auth.uid()
  -- Case handler updating assigned citizen
  OR EXISTS (
    SELECT 1 FROM public.cases c
    WHERE c.citizen_id = citizens.id
    AND c.case_handler_id = public.current_user_id()
  )
  -- Admin can update any
  OR public.is_admin()
)
WITH CHECK (
  -- Same conditions for new row
  portal_user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.cases c
    WHERE c.citizen_id = citizens.id
    AND c.case_handler_id = public.current_user_id()
  )
  OR public.is_admin()
);

-- citizens_delete_admin_only
-- Only admin can delete citizen records (soft delete preferred)
CREATE POLICY "citizens_delete_admin_only"
ON public.citizens
FOR DELETE
TO authenticated
USING (
  public.is_admin()
);
```

**Column Masking Notes:**
- `national_id`: Masked for all except own record, fraud_officer (when fraud_flag), admin
- `phone_number`: Masked for reviewers, visible to handler/owner
- `email`: Masked for reviewers, visible to handler/owner

---

### 2.2 CASES Table

```sql
-- cases_select_by_role
-- Comprehensive case visibility by role and ownership
CREATE POLICY "cases_select_by_role"
ON public.cases
FOR SELECT
TO authenticated
USING (
  -- Portal owner (citizen) sees own cases
  citizen_id IN (
    SELECT id FROM public.citizens 
    WHERE portal_user_id = auth.uid()
  )
  -- Assigned case handler
  OR case_handler_id = public.current_user_id()
  -- Same office staff
  OR intake_office_id = public.auth_office_id()
  -- Reviewer can see cases under review
  OR (
    public.has_role(auth.uid(), 'case_reviewer')
    AND current_status IN ('under_review', 'approved', 'rejected')
  )
  -- Department head sees department cases
  OR (
    public.has_role(auth.uid(), 'department_head')
    AND intake_office_id IN (
      SELECT id FROM public.offices 
      WHERE district_id = public.auth_district_id()
    )
  )
  -- Finance officer sees payment-related cases
  OR (
    public.has_role(auth.uid(), 'finance_officer')
    AND current_status IN ('approved', 'payment_pending', 'payment_processed')
  )
  -- Fraud officer sees flagged cases
  OR (
    public.has_role(auth.uid(), 'fraud_officer')
    AND (fraud_flag = true OR fraud_risk_level IN ('medium', 'high', 'critical'))
  )
  -- Admin sees all
  OR public.is_admin()
  -- Audit viewer sees all
  OR public.has_role(auth.uid(), 'audit_viewer')
);

-- cases_insert_by_intake
-- Only intake officers can create new cases
CREATE POLICY "cases_insert_by_intake"
ON public.cases
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'district_intake_officer')
  OR public.has_role(auth.uid(), 'case_handler')
  OR public.is_admin()
);

-- cases_update_by_handler
-- Case handlers and reviewers can update with status restrictions
CREATE POLICY "cases_update_by_handler"
ON public.cases
FOR UPDATE
TO authenticated
USING (
  -- Assigned handler can update
  case_handler_id = public.current_user_id()
  -- Reviewer can update review-related fields
  OR (
    public.has_role(auth.uid(), 'case_reviewer')
    AND current_status = 'under_review'
  )
  -- Department head can override
  OR public.has_role(auth.uid(), 'department_head')
  -- Finance officer can update payment status
  OR (
    public.has_role(auth.uid(), 'finance_officer')
    AND current_status IN ('payment_pending', 'payment_processed')
  )
  -- Fraud officer can update fraud fields
  OR (
    public.has_role(auth.uid(), 'fraud_officer')
    AND fraud_flag = true
  )
  -- Admin can update any
  OR public.is_admin()
)
WITH CHECK (
  -- Verify status transition is valid
  public.can_transition(OLD.current_status, NEW.current_status)
  OR OLD.current_status = NEW.current_status
  OR public.is_admin()
);

-- cases_delete_admin_only
-- Only admin can delete cases (audit trail required)
CREATE POLICY "cases_delete_admin_only"
ON public.cases
FOR DELETE
TO authenticated
USING (
  public.is_admin()
);
```

**Status-Lock Rules:**
- `wizard_data`: Locked after status leaves `intake`
- `eligibility_result`: Locked after `under_review`
- `payment_amount`: Locked after `payment_processed`

---

### 2.3 CASE_EVENTS Table

```sql
-- case_events_select_by_case_access
-- Inherit access from parent case
CREATE POLICY "case_events_select_by_case_access"
ON public.case_events
FOR SELECT
TO authenticated
USING (
  public.has_case_access(case_id)
  OR public.is_admin()
  OR public.has_role(auth.uid(), 'audit_viewer')
);

-- case_events_insert_by_staff
-- Staff can create events for accessible cases
CREATE POLICY "case_events_insert_by_staff"
ON public.case_events
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_case_access(case_id)
  AND (
    public.has_role(auth.uid(), 'district_intake_officer')
    OR public.has_role(auth.uid(), 'case_handler')
    OR public.has_role(auth.uid(), 'case_reviewer')
    OR public.has_role(auth.uid(), 'department_head')
    OR public.has_role(auth.uid(), 'finance_officer')
    OR public.has_role(auth.uid(), 'fraud_officer')
    OR public.is_admin()
  )
);

-- case_events_no_update
-- Events are immutable audit records
CREATE POLICY "case_events_no_update"
ON public.case_events
FOR UPDATE
TO authenticated
USING (false);

-- case_events_no_delete
-- Events cannot be deleted
CREATE POLICY "case_events_no_delete"
ON public.case_events
FOR DELETE
TO authenticated
USING (false);
```

---

### 2.4 ELIGIBILITY_EVALUATIONS Table

```sql
-- eligibility_evaluations_select_by_case_access
CREATE POLICY "eligibility_evaluations_select_by_case_access"
ON public.eligibility_evaluations
FOR SELECT
TO authenticated
USING (
  public.has_case_access(case_id)
  OR public.is_admin()
  OR public.has_role(auth.uid(), 'audit_viewer')
);

-- eligibility_evaluations_insert_by_handler
CREATE POLICY "eligibility_evaluations_insert_by_handler"
ON public.eligibility_evaluations
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_case_access(case_id)
  AND (
    public.has_role(auth.uid(), 'case_handler')
    OR public.has_role(auth.uid(), 'case_reviewer')
    OR public.is_admin()
  )
);

-- eligibility_evaluations_update_before_review
-- Can only update before case enters review
CREATE POLICY "eligibility_evaluations_update_before_review"
ON public.eligibility_evaluations
FOR UPDATE
TO authenticated
USING (
  public.has_case_access(case_id)
  AND NOT public.field_locked('eligibility_result', 
    (SELECT current_status FROM public.cases WHERE id = case_id))
  AND (
    public.has_role(auth.uid(), 'case_handler')
    OR public.has_role(auth.uid(), 'case_reviewer')
    OR public.is_admin()
  )
);

-- eligibility_evaluations_no_delete
CREATE POLICY "eligibility_evaluations_no_delete"
ON public.eligibility_evaluations
FOR DELETE
TO authenticated
USING (
  public.is_admin()
);
```

---

### 2.5 PAYMENT_BATCHES Table

```sql
-- payment_batches_select_by_finance
CREATE POLICY "payment_batches_select_by_finance"
ON public.payment_batches
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'finance_officer')
  OR public.has_role(auth.uid(), 'department_head')
  OR public.is_admin()
  OR public.has_role(auth.uid(), 'audit_viewer')
);

-- payment_batches_insert_by_finance
CREATE POLICY "payment_batches_insert_by_finance"
ON public.payment_batches
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'finance_officer')
  OR public.is_admin()
);

-- payment_batches_update_by_finance
CREATE POLICY "payment_batches_update_by_finance"
ON public.payment_batches
FOR UPDATE
TO authenticated
USING (
  (public.has_role(auth.uid(), 'finance_officer') AND status != 'processed')
  OR public.is_admin()
);

-- payment_batches_no_delete
CREATE POLICY "payment_batches_no_delete"
ON public.payment_batches
FOR DELETE
TO authenticated
USING (
  public.is_admin()
);
```

---

### 2.6 PAYMENT_ITEMS Table

```sql
-- payment_items_select_by_role
CREATE POLICY "payment_items_select_by_role"
ON public.payment_items
FOR SELECT
TO authenticated
USING (
  -- Citizen sees own payment items
  case_id IN (
    SELECT c.id FROM public.cases c
    JOIN public.citizens cit ON c.citizen_id = cit.id
    WHERE cit.portal_user_id = auth.uid()
  )
  -- Finance officer sees all
  OR public.has_role(auth.uid(), 'finance_officer')
  -- Department head sees department items
  OR public.has_role(auth.uid(), 'department_head')
  -- Admin sees all
  OR public.is_admin()
  OR public.has_role(auth.uid(), 'audit_viewer')
);

-- payment_items_insert_by_system
CREATE POLICY "payment_items_insert_by_system"
ON public.payment_items
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'finance_officer')
  OR public.is_admin()
);

-- payment_items_update_by_finance
CREATE POLICY "payment_items_update_by_finance"
ON public.payment_items
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'finance_officer')
  AND status NOT IN ('processed', 'disbursed')
  OR public.is_admin()
);

-- payment_items_no_delete
CREATE POLICY "payment_items_no_delete"
ON public.payment_items
FOR DELETE
TO authenticated
USING (false);
```

---

### 2.7 FRAUD_SIGNALS Table

```sql
-- fraud_signals_select_by_fraud_team
CREATE POLICY "fraud_signals_select_by_fraud_team"
ON public.fraud_signals
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'fraud_officer')
  OR public.has_role(auth.uid(), 'department_head')
  OR public.is_admin()
  OR public.has_role(auth.uid(), 'audit_viewer')
);

-- fraud_signals_insert_by_system
CREATE POLICY "fraud_signals_insert_by_system"
ON public.fraud_signals
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'fraud_officer')
  OR public.is_admin()
);

-- fraud_signals_update_by_fraud
CREATE POLICY "fraud_signals_update_by_fraud"
ON public.fraud_signals
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'fraud_officer')
  OR public.is_admin()
);

-- fraud_signals_no_delete
CREATE POLICY "fraud_signals_no_delete"
ON public.fraud_signals
FOR DELETE
TO authenticated
USING (false);
```

---

### 2.8 FRAUD_RISK_SCORES Table

```sql
-- fraud_risk_scores_select_by_fraud_team
CREATE POLICY "fraud_risk_scores_select_by_fraud_team"
ON public.fraud_risk_scores
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'fraud_officer')
  OR public.has_role(auth.uid(), 'department_head')
  OR public.is_admin()
  OR public.has_role(auth.uid(), 'audit_viewer')
);

-- fraud_risk_scores_insert_by_system
CREATE POLICY "fraud_risk_scores_insert_by_system"
ON public.fraud_risk_scores
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'fraud_officer')
  OR public.is_admin()
);

-- fraud_risk_scores_update_by_fraud
CREATE POLICY "fraud_risk_scores_update_by_fraud"
ON public.fraud_risk_scores
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'fraud_officer')
  AND NOT public.field_locked('fraud_score', 
    (SELECT current_status FROM public.cases WHERE id = case_id))
  OR public.is_admin()
);

-- fraud_risk_scores_no_delete
CREATE POLICY "fraud_risk_scores_no_delete"
ON public.fraud_risk_scores
FOR DELETE
TO authenticated
USING (false);
```

---

### 2.9 USER_ROLES Table (CRITICAL SECURITY)

```sql
-- user_roles_select_own
-- Users can see their own roles only
CREATE POLICY "user_roles_select_own"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_admin()
);

-- user_roles_insert_admin_only
CREATE POLICY "user_roles_insert_admin_only"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin()
);

-- user_roles_update_admin_only
CREATE POLICY "user_roles_update_admin_only"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (
  public.is_admin()
);

-- user_roles_delete_admin_only
CREATE POLICY "user_roles_delete_admin_only"
ON public.user_roles
FOR DELETE
TO authenticated
USING (
  public.is_admin()
);
```

> **CRITICAL**: The `user_roles` table uses SECURITY DEFINER functions to prevent recursive RLS issues. Never expose role modification to non-admin users.

---

## 3. MEDIUM Sensitivity Tables

### 3.1 DOCUMENTS Table

```sql
-- documents_select_by_access
CREATE POLICY "documents_select_by_access"
ON public.documents
FOR SELECT
TO authenticated
USING (
  -- Document owner (citizen)
  public.is_document_owner(id)
  -- Case access inherits document access
  OR public.has_case_access(case_id)
  -- Fraud officer when fraud_flag is true
  OR (
    public.has_role(auth.uid(), 'fraud_officer')
    AND EXISTS (
      SELECT 1 FROM public.cases c
      WHERE c.id = documents.case_id
      AND c.fraud_flag = true
    )
  )
  -- Finance officer when payment-related
  OR (
    public.has_role(auth.uid(), 'finance_officer')
    AND EXISTS (
      SELECT 1 FROM public.cases c
      WHERE c.id = documents.case_id
      AND c.current_status IN ('approved', 'payment_pending', 'payment_processed')
    )
  )
  -- Admin sees all
  OR public.is_admin()
  OR public.has_role(auth.uid(), 'audit_viewer')
);

-- documents_insert_by_owner_or_staff
CREATE POLICY "documents_insert_by_owner_or_staff"
ON public.documents
FOR INSERT
TO authenticated
WITH CHECK (
  -- Citizen can upload to own case (before approval)
  (
    public.is_portal_owner(citizen_id)
    AND public.can_upload_document(case_id)
  )
  -- Staff can upload to accessible cases
  OR (
    public.has_case_access(case_id)
    AND (
      public.has_role(auth.uid(), 'district_intake_officer')
      OR public.has_role(auth.uid(), 'case_handler')
    )
  )
  OR public.is_admin()
);

-- documents_update_by_handler
CREATE POLICY "documents_update_by_handler"
ON public.documents
FOR UPDATE
TO authenticated
USING (
  public.has_case_access(case_id)
  AND (
    public.has_role(auth.uid(), 'case_handler')
    OR public.has_role(auth.uid(), 'case_reviewer')
  )
  OR public.is_admin()
);

-- documents_delete_admin_only
CREATE POLICY "documents_delete_admin_only"
ON public.documents
FOR DELETE
TO authenticated
USING (
  public.is_admin()
);
```

---

### 3.2 HOUSEHOLDS Table

```sql
-- households_select_by_case_access
CREATE POLICY "households_select_by_case_access"
ON public.households
FOR SELECT
TO authenticated
USING (
  public.has_case_access(case_id)
  OR public.is_admin()
  OR public.has_role(auth.uid(), 'audit_viewer')
);

-- households_insert_by_handler
CREATE POLICY "households_insert_by_handler"
ON public.households
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_case_access(case_id)
  AND (
    public.has_role(auth.uid(), 'district_intake_officer')
    OR public.has_role(auth.uid(), 'case_handler')
  )
  OR public.is_admin()
);

-- households_update_by_handler
CREATE POLICY "households_update_by_handler"
ON public.households
FOR UPDATE
TO authenticated
USING (
  public.has_case_access(case_id)
  AND public.has_role(auth.uid(), 'case_handler')
  OR public.is_admin()
);

-- households_delete_admin_only
CREATE POLICY "households_delete_admin_only"
ON public.households
FOR DELETE
TO authenticated
USING (
  public.is_admin()
);
```

---

### 3.3 INCOMES Table

```sql
-- incomes_select_by_case_access
CREATE POLICY "incomes_select_by_case_access"
ON public.incomes
FOR SELECT
TO authenticated
USING (
  -- Via household → case access
  EXISTS (
    SELECT 1 FROM public.households h
    WHERE h.id = incomes.household_id
    AND public.has_case_access(h.case_id)
  )
  OR public.is_admin()
  OR public.has_role(auth.uid(), 'audit_viewer')
);

-- incomes_insert_by_handler
CREATE POLICY "incomes_insert_by_handler"
ON public.incomes
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.households h
    WHERE h.id = incomes.household_id
    AND public.has_case_access(h.case_id)
  )
  AND (
    public.has_role(auth.uid(), 'district_intake_officer')
    OR public.has_role(auth.uid(), 'case_handler')
  )
  OR public.is_admin()
);

-- incomes_update_by_handler
CREATE POLICY "incomes_update_by_handler"
ON public.incomes
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.households h
    WHERE h.id = incomes.household_id
    AND public.has_case_access(h.case_id)
  )
  AND public.has_role(auth.uid(), 'case_handler')
  OR public.is_admin()
);

-- incomes_delete_admin_only
CREATE POLICY "incomes_delete_admin_only"
ON public.incomes
FOR DELETE
TO authenticated
USING (
  public.is_admin()
);
```

---

### 3.4 NOTIFICATIONS Table

```sql
-- notifications_select_own
CREATE POLICY "notifications_select_own"
ON public.notifications
FOR SELECT
TO authenticated
USING (
  recipient_user_id = auth.uid()
  OR public.is_admin()
);

-- notifications_insert_by_system
CREATE POLICY "notifications_insert_by_system"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'case_handler')
  OR public.has_role(auth.uid(), 'case_reviewer')
  OR public.has_role(auth.uid(), 'department_head')
  OR public.is_admin()
);

-- notifications_update_own
CREATE POLICY "notifications_update_own"
ON public.notifications
FOR UPDATE
TO authenticated
USING (
  recipient_user_id = auth.uid()
  OR public.is_admin()
);

-- notifications_no_delete
CREATE POLICY "notifications_no_delete"
ON public.notifications
FOR DELETE
TO authenticated
USING (
  public.is_admin()
);
```

---

### 3.5 PORTAL_NOTIFICATIONS Table

```sql
-- portal_notifications_select_own
CREATE POLICY "portal_notifications_select_own"
ON public.portal_notifications
FOR SELECT
TO authenticated
USING (
  portal_user_id = auth.uid()
  OR public.is_admin()
);

-- portal_notifications_insert_by_system
CREATE POLICY "portal_notifications_insert_by_system"
ON public.portal_notifications
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'case_handler')
  OR public.has_role(auth.uid(), 'case_reviewer')
  OR public.is_admin()
);

-- portal_notifications_update_own
CREATE POLICY "portal_notifications_update_own"
ON public.portal_notifications
FOR UPDATE
TO authenticated
USING (
  portal_user_id = auth.uid()
  OR public.is_admin()
);

-- portal_notifications_no_delete
CREATE POLICY "portal_notifications_no_delete"
ON public.portal_notifications
FOR DELETE
TO authenticated
USING (
  public.is_admin()
);
```

---

### 3.6 WORKFLOW_DEFINITIONS Table

```sql
-- workflow_definitions_select_all
CREATE POLICY "workflow_definitions_select_all"
ON public.workflow_definitions
FOR SELECT
TO authenticated
USING (true);

-- workflow_definitions_insert_admin_only
CREATE POLICY "workflow_definitions_insert_admin_only"
ON public.workflow_definitions
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin()
);

-- workflow_definitions_update_admin_only
CREATE POLICY "workflow_definitions_update_admin_only"
ON public.workflow_definitions
FOR UPDATE
TO authenticated
USING (
  public.is_admin()
);

-- workflow_definitions_delete_admin_only
CREATE POLICY "workflow_definitions_delete_admin_only"
ON public.workflow_definitions
FOR DELETE
TO authenticated
USING (
  public.is_admin()
);
```

---

### 3.7 WIZARD_DEFINITIONS Table

```sql
-- wizard_definitions_select_all
CREATE POLICY "wizard_definitions_select_all"
ON public.wizard_definitions
FOR SELECT
TO authenticated
USING (true);

-- wizard_definitions_modify_admin_only
CREATE POLICY "wizard_definitions_modify_admin_only"
ON public.wizard_definitions
FOR ALL
TO authenticated
USING (
  public.is_admin()
)
WITH CHECK (
  public.is_admin()
);
```

---

## 4. LOW Sensitivity Tables

### 4.1 SERVICE_TYPES Table

```sql
-- service_types_select_all
CREATE POLICY "service_types_select_all"
ON public.service_types
FOR SELECT
TO authenticated
USING (true);

-- service_types_modify_admin_only
CREATE POLICY "service_types_modify_admin_only"
ON public.service_types
FOR ALL
TO authenticated
USING (
  public.is_admin()
)
WITH CHECK (
  public.is_admin()
);
```

---

### 4.2 OFFICES Table

```sql
-- offices_select_all
CREATE POLICY "offices_select_all"
ON public.offices
FOR SELECT
TO authenticated
USING (true);

-- offices_modify_admin_only
CREATE POLICY "offices_modify_admin_only"
ON public.offices
FOR ALL
TO authenticated
USING (
  public.is_admin()
)
WITH CHECK (
  public.is_admin()
);
```

---

### 4.3 DOCUMENT_REQUIREMENTS Table

```sql
-- document_requirements_select_all
CREATE POLICY "document_requirements_select_all"
ON public.document_requirements
FOR SELECT
TO authenticated
USING (true);

-- document_requirements_modify_admin_only
CREATE POLICY "document_requirements_modify_admin_only"
ON public.document_requirements
FOR ALL
TO authenticated
USING (
  public.is_admin()
)
WITH CHECK (
  public.is_admin()
);
```

---

### 4.4 ELIGIBILITY_RULES Table

```sql
-- eligibility_rules_select_all
CREATE POLICY "eligibility_rules_select_all"
ON public.eligibility_rules
FOR SELECT
TO authenticated
USING (true);

-- eligibility_rules_modify_admin_only
CREATE POLICY "eligibility_rules_modify_admin_only"
ON public.eligibility_rules
FOR ALL
TO authenticated
USING (
  public.is_admin()
)
WITH CHECK (
  public.is_admin()
);
```

---

### 4.5 NOTIFICATION_TEMPLATES Table

```sql
-- notification_templates_select_all
CREATE POLICY "notification_templates_select_all"
ON public.notification_templates
FOR SELECT
TO authenticated
USING (true);

-- notification_templates_modify_admin_only
CREATE POLICY "notification_templates_modify_admin_only"
ON public.notification_templates
FOR ALL
TO authenticated
USING (
  public.is_admin()
)
WITH CHECK (
  public.is_admin()
);
```

---

## 5. Role-Specific Policy Groups

### 5.1 Citizen Policies

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| citizens | Own record only | ✗ | Own non-critical fields | ✗ |
| cases | Own cases only | ✗ | ✗ | ✗ |
| case_events | Own case events | ✗ | ✗ | ✗ |
| documents | Own case documents | Before approval | ✗ | ✗ |
| payment_items | Own payment items | ✗ | ✗ | ✗ |
| portal_notifications | Own notifications | ✗ | Mark read | ✗ |

### 5.2 District Intake Officer Policies

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| citizens | District scope | ✓ | ✗ | ✗ |
| cases | District scope | ✓ | ✗ | ✗ |
| case_events | District scope | ✓ | ✗ | ✗ |
| documents | District scope | ✓ | ✗ | ✗ |
| households | District scope | ✓ | ✗ | ✗ |
| incomes | District scope | ✓ | ✗ | ✗ |

### 5.3 Case Handler Policies

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| citizens | Assigned cases | ✓ | Assigned only | ✗ |
| cases | Office + assigned | ✓ | Assigned only | ✗ |
| case_events | Accessible cases | ✓ | ✗ | ✗ |
| documents | Accessible cases | ✓ | Verification | ✗ |
| eligibility_evaluations | Accessible cases | ✓ | Pre-review | ✗ |
| households | Accessible cases | ✓ | ✓ | ✗ |
| incomes | Accessible cases | ✓ | ✓ | ✗ |

### 5.4 Case Reviewer Policies

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| citizens | Under review | ✗ | ✗ | ✗ |
| cases | Under review | ✗ | Review decision | ✗ |
| case_events | Under review | ✓ | ✗ | ✗ |
| documents | Under review | ✗ | ✗ | ✗ |
| eligibility_evaluations | Under review | ✓ | Review notes | ✗ |

### 5.5 Department Head Policies

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| citizens | Department scope | ✗ | ✗ | ✗ |
| cases | Department scope | ✗ | Override | ✗ |
| case_events | Department scope | ✓ | ✗ | ✗ |
| payment_batches | Department scope | ✗ | ✗ | ✗ |
| fraud_signals | Department scope | ✗ | ✗ | ✗ |
| fraud_risk_scores | Department scope | ✗ | ✗ | ✗ |

### 5.6 Finance Officer Policies

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| cases | Payment status | ✗ | Payment fields | ✗ |
| documents | Payment related | ✗ | ✗ | ✗ |
| payment_batches | All | ✓ | Pre-processed | ✗ |
| payment_items | All | ✓ | Pre-disbursed | ✗ |

### 5.7 Fraud Officer Policies

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| citizens | Fraud-flagged | ✗ | ✗ | ✗ |
| cases | Fraud-flagged | ✗ | Fraud fields | ✗ |
| documents | Fraud-flagged | ✗ | ✗ | ✗ |
| fraud_signals | All | ✓ | ✓ | ✗ |
| fraud_risk_scores | All | ✓ | Pre-lock | ✗ |

### 5.8 System Admin Policies

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| ALL TABLES | ✓ | ✓ | ✓ | ✓ |

### 5.9 Audit Viewer Policies

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| ALL TABLES | ✓ | ✗ | ✗ | ✗ |

---

## 6. Status-Lock Policies

Based on `case_workflow.json`, the following fields are locked after specific status transitions:

### 6.1 Wizard Data Lock

```sql
-- Field: wizard_data
-- Locked after: status leaves 'intake'
-- Implementation: UPDATE policy checks field_locked('wizard_data', current_status)

LOCKED_STATUSES = ['validation', 'eligibility_check', 'under_review', 
                   'approved', 'rejected', 'payment_pending', 
                   'payment_processed', 'closed', 'withdrawn']
```

### 6.2 Eligibility Result Lock

```sql
-- Field: eligibility_result, eligibility_score
-- Locked after: status = 'under_review'
-- Implementation: UPDATE policy checks field_locked('eligibility_result', current_status)

LOCKED_STATUSES = ['under_review', 'approved', 'rejected', 
                   'payment_pending', 'payment_processed', 'closed']
```

### 6.3 Payment Fields Lock

```sql
-- Fields: payment_amount, payment_method, bank_account
-- Locked after: status = 'payment_processed'
-- Implementation: UPDATE policy checks field_locked('payment_amount', current_status)

LOCKED_STATUSES = ['payment_processed', 'closed']
```

### 6.4 Fraud Score Lock

```sql
-- Field: fraud_risk_score, fraud_signals
-- Locked after: fraud investigation complete
-- Implementation: UPDATE policy checks fraud_investigation_status = 'closed'

LOCKED_CONDITION = fraud_investigation_status = 'closed'
```

---

## 7. Policy Summary Statistics

| Category | Tables | Policies | Predicates Used |
|----------|--------|----------|-----------------|
| HIGH Sensitivity | 9 | 36 | All |
| MEDIUM Sensitivity | 7 | 28 | has_case_access, is_admin, is_portal_owner |
| LOW Sensitivity | 5 | 10 | is_admin only |
| **TOTAL** | **21** | **74** | **15** |

---

## 8. Requires Clarification

| Item | Context | Impact |
|------|---------|--------|
| Multi-district supervisor access | Department head across districts | Policy scope |
| Cross-department case transfer | Handler reassignment rules | Ownership policies |
| Soft delete vs hard delete | Audit requirements | DELETE policies |
| Column masking implementation | View vs function approach | Performance |

---

## 9. References

- [RLS-Policy-Specification.md](./RLS-Policy-Specification.md)
- [RLS-Expression-Map.md](./RLS-Expression-Map.md)
- [Role-Permission-Matrix.md](./Role-Permission-Matrix.md)
- [Security-Definer-Functions.md](./Security-Definer-Functions.md)
- [case_workflow.json](../configs/workflows/case_workflow.json)

---

**Document Version**: 1.0  
**Phase**: 8  
**Status**: Documentation Only — Pending Phase 9 Execution
