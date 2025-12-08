# Workflow Security Bindings
## SoZaVo Platform v1.0 — Phase 10

> **Status**: Partially Implemented  
> **Version**: 1.1  
> **Source**: case_workflow.json, RLS-Policy-Specification.md, Case-Authorization-Model.md  
> **Last Updated**: 2025-01-XX

---

## 0. Implementation Status

### Phase 10A — Case Status Transition (IMPLEMENTED ✅)

The following transitions are now enforced via `perform_case_transition` RPC:

| ID | From → To | Roles | Business Rules | Status |
|----|-----------|-------|----------------|--------|
| T001 | intake → under_review | case_handler, case_reviewer, department_head, system_admin | None | ✅ IMPLEMENTED |
| T002 | under_review → approved | case_reviewer, department_head, system_admin | Mandatory docs verified + eligible evaluation | ✅ IMPLEMENTED |
| T003 | under_review → rejected | case_reviewer, department_head, system_admin | Reason required | ✅ IMPLEMENTED |
| T004 | approved → under_review | department_head, system_admin | Reason required (reopen) | ✅ IMPLEMENTED |
| T005 | rejected → under_review | department_head, system_admin | Reason required (reopen) | ✅ IMPLEMENTED |

**RPC Function**: `perform_case_transition(p_case_id, p_target_status, p_reason, p_metadata)`

**Validation Function**: `validate_case_transition(p_case_id, p_target_status, p_actor_id, p_reason)`

All transitions are audited to `case_events` with `event_type = 'status_changed'`.

---

## 1. Overview

This document defines the security bindings between workflow states/transitions and RLS constraints. Every field modification, status transition, and action is mapped to specific role requirements and status preconditions.

### 1.1 Workflow States (from case_workflow.json)

| State | Description | Primary Actor |
|-------|-------------|---------------|
| intake | Initial application entry | district_intake_officer |
| validation | Document and data verification | case_handler |
| eligibility_check | Eligibility engine evaluation | case_handler |
| under_review | Manual review required | case_reviewer |
| approved | Application approved | case_reviewer |
| rejected | Application rejected | case_reviewer |
| payment_pending | Awaiting payment processing | finance_officer |
| payment_processed | Payment completed | system |
| closed | Case closed | case_handler |
| withdrawn | Applicant withdrew | citizen / case_handler |

---

## 2. Input Field Restrictions by Status

### 2.1 Wizard Data Fields

| Field Group | Editable In | Locked After | Authorized Roles |
|-------------|-------------|--------------|------------------|
| personal_info | intake | validation | intake_officer, citizen (portal) |
| household_composition | intake, validation | eligibility_check | intake_officer, case_handler |
| income_declaration | intake, validation | eligibility_check | intake_officer, case_handler |
| document_references | intake, validation, eligibility_check | under_review | intake_officer, case_handler, citizen |
| service_selection | intake | validation | intake_officer, citizen |
| consent_flags | intake | validation | intake_officer, citizen |

### 2.2 Case Core Fields

| Field | Editable In | Locked After | Authorized Roles |
|-------|-------------|--------------|------------------|
| citizen_id | intake | validation | intake_officer |
| service_type_id | intake | validation | intake_officer |
| intake_office_id | intake | validation | intake_officer, admin |
| case_handler_id | intake, validation, eligibility_check | under_review | intake_officer, dept_head, admin |
| priority_level | Any (before closed) | closed | case_handler, dept_head |
| internal_notes | Any (before closed) | closed | All staff |
| current_status | Per transition rules | closed | Per transition |

### 2.3 Eligibility Fields

| Field | Editable In | Locked After | Authorized Roles |
|-------|-------------|--------------|------------------|
| eligibility_result | eligibility_check | under_review | case_handler, system |
| eligibility_score | eligibility_check | under_review | case_handler, system |
| eligibility_details | eligibility_check | under_review | case_handler, system |
| eligibility_override | under_review | approved/rejected | case_reviewer, dept_head |
| override_reason | under_review | approved/rejected | case_reviewer, dept_head |

### 2.4 Review Fields

| Field | Editable In | Locked After | Authorized Roles |
|-------|-------------|--------------|------------------|
| review_decision | under_review | approved/rejected | case_reviewer |
| review_notes | under_review | approved/rejected | case_reviewer |
| review_date | under_review | approved/rejected | system |
| reviewer_id | under_review | approved/rejected | system |

### 2.5 Payment Fields

| Field | Editable In | Locked After | Authorized Roles |
|-------|-------------|--------------|------------------|
| payment_amount | approved, payment_pending | payment_processed | finance_officer, system |
| payment_method | approved, payment_pending | payment_processed | finance_officer |
| bank_account_ref | approved, payment_pending | payment_processed | finance_officer |
| payment_batch_id | payment_pending | payment_processed | finance_officer, system |
| payment_date | payment_processed | closed | system |
| payment_reference | payment_processed | closed | system |

### 2.6 Fraud Fields

| Field | Editable In | Locked After | Authorized Roles |
|-------|-------------|--------------|------------------|
| fraud_flag | Any (before closed) | N/A | fraud_officer, system |
| fraud_risk_level | Any (before closed) | investigation closed | fraud_officer, system |
| fraud_signals | Any (before closed) | investigation closed | fraud_officer, system |
| fraud_investigation_status | Any (before closed) | closed | fraud_officer |
| fraud_notes | Any (before closed) | closed | fraud_officer |

---

## 3. Transition Authorization Rules

### 3.1 Transition Matrix

| ID | From State | To State | Authorized Roles | Guard Conditions |
|----|------------|----------|------------------|------------------|
| T001 | intake | validation | district_intake_officer, case_handler, admin | all_required_docs_present |
| T002 | validation | eligibility_check | case_handler, admin | documents_verified |
| T003 | eligibility_check | under_review | case_handler, admin | eligibility_evaluated |
| T004 | under_review | approved | case_reviewer, dept_head, admin | review_complete, no_fraud_flag OR fraud_cleared |
| T005 | under_review | rejected | case_reviewer, dept_head, admin | review_complete, rejection_reason_provided |
| T006 | approved | payment_pending | case_handler, finance_officer, admin | payment_details_complete |
| T007 | payment_pending | payment_processed | finance_officer, system, admin | payment_executed |
| T008 | payment_processed | closed | case_handler, admin | no_pending_actions |
| T009 | * | withdrawn | citizen, case_handler, admin | withdrawal_reason_provided |
| T010 | * | closed | dept_head, admin | closure_authorized |
| T011 | rejected | intake | dept_head, admin | reopen_authorized |

### 3.2 Transition Implementation

```sql
-- Validate transition in UPDATE policy
CREATE OR REPLACE FUNCTION public.validate_case_transition(
  _case_id UUID,
  _old_status TEXT,
  _new_status TEXT,
  _user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_roles app_role[];
  _transition_allowed BOOLEAN := false;
BEGIN
  -- Get user roles
  SELECT ARRAY_AGG(role) INTO _user_roles
  FROM public.user_roles
  WHERE user_id = _user_id;

  -- Check transition rules
  CASE
    -- T001: intake → validation
    WHEN _old_status = 'intake' AND _new_status = 'validation' THEN
      _transition_allowed := (
        'district_intake_officer' = ANY(_user_roles) OR
        'case_handler' = ANY(_user_roles) OR
        'system_admin' = ANY(_user_roles)
      ) AND public.check_guard_all_docs_present(_case_id);

    -- T002: validation → eligibility_check
    WHEN _old_status = 'validation' AND _new_status = 'eligibility_check' THEN
      _transition_allowed := (
        'case_handler' = ANY(_user_roles) OR
        'system_admin' = ANY(_user_roles)
      ) AND public.check_guard_docs_verified(_case_id);

    -- T003: eligibility_check → under_review
    WHEN _old_status = 'eligibility_check' AND _new_status = 'under_review' THEN
      _transition_allowed := (
        'case_handler' = ANY(_user_roles) OR
        'system_admin' = ANY(_user_roles)
      ) AND public.check_guard_eligibility_evaluated(_case_id);

    -- T004: under_review → approved
    WHEN _old_status = 'under_review' AND _new_status = 'approved' THEN
      _transition_allowed := (
        'case_reviewer' = ANY(_user_roles) OR
        'department_head' = ANY(_user_roles) OR
        'system_admin' = ANY(_user_roles)
      ) AND public.check_guard_review_complete(_case_id)
        AND public.check_guard_no_fraud_block(_case_id);

    -- T005: under_review → rejected
    WHEN _old_status = 'under_review' AND _new_status = 'rejected' THEN
      _transition_allowed := (
        'case_reviewer' = ANY(_user_roles) OR
        'department_head' = ANY(_user_roles) OR
        'system_admin' = ANY(_user_roles)
      ) AND public.check_guard_rejection_reason(_case_id);

    -- T006: approved → payment_pending
    WHEN _old_status = 'approved' AND _new_status = 'payment_pending' THEN
      _transition_allowed := (
        'case_handler' = ANY(_user_roles) OR
        'finance_officer' = ANY(_user_roles) OR
        'system_admin' = ANY(_user_roles)
      ) AND public.check_guard_payment_details(_case_id);

    -- T007: payment_pending → payment_processed
    WHEN _old_status = 'payment_pending' AND _new_status = 'payment_processed' THEN
      _transition_allowed := (
        'finance_officer' = ANY(_user_roles) OR
        'system_admin' = ANY(_user_roles)
      ) AND public.check_guard_payment_executed(_case_id);

    -- T008: payment_processed → closed
    WHEN _old_status = 'payment_processed' AND _new_status = 'closed' THEN
      _transition_allowed := (
        'case_handler' = ANY(_user_roles) OR
        'system_admin' = ANY(_user_roles)
      ) AND public.check_guard_no_pending_actions(_case_id);

    -- T009: * → withdrawn
    WHEN _new_status = 'withdrawn' THEN
      _transition_allowed := (
        public.is_portal_owner((SELECT citizen_id FROM public.cases WHERE id = _case_id)) OR
        'case_handler' = ANY(_user_roles) OR
        'system_admin' = ANY(_user_roles)
      );

    -- T010: * → closed (admin override)
    WHEN _new_status = 'closed' THEN
      _transition_allowed := (
        'department_head' = ANY(_user_roles) OR
        'system_admin' = ANY(_user_roles)
      );

    -- T011: rejected → intake (reopen)
    WHEN _old_status = 'rejected' AND _new_status = 'intake' THEN
      _transition_allowed := (
        'department_head' = ANY(_user_roles) OR
        'system_admin' = ANY(_user_roles)
      );

    ELSE
      _transition_allowed := false;
  END CASE;

  RETURN _transition_allowed;
END;
$$;
```

---

## 4. Guard Condition Functions

### 4.1 Document Guards

```sql
-- Check if all required documents are present
CREATE OR REPLACE FUNCTION public.check_guard_all_docs_present(_case_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 
    FROM public.document_requirements dr
    JOIN public.cases c ON c.service_type_id = dr.service_type_id
    WHERE c.id = _case_id
      AND dr.is_required = true
      AND NOT EXISTS (
        SELECT 1 FROM public.documents d
        WHERE d.case_id = _case_id
          AND d.document_type = dr.document_type
          AND d.status IN ('uploaded', 'verified')
      )
  )
$$;

-- Check if all documents are verified
CREATE OR REPLACE FUNCTION public.check_guard_docs_verified(_case_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 
    FROM public.documents
    WHERE case_id = _case_id
      AND status NOT IN ('verified', 'not_required')
  )
$$;
```

### 4.2 Eligibility Guards

```sql
-- Check if eligibility has been evaluated
CREATE OR REPLACE FUNCTION public.check_guard_eligibility_evaluated(_case_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.eligibility_evaluations
    WHERE case_id = _case_id
      AND status = 'completed'
  )
$$;
```

### 4.3 Review Guards

```sql
-- Check if review is complete
CREATE OR REPLACE FUNCTION public.check_guard_review_complete(_case_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.cases
    WHERE id = _case_id
      AND review_decision IS NOT NULL
      AND reviewer_id IS NOT NULL
  )
$$;

-- Check if rejection reason is provided
CREATE OR REPLACE FUNCTION public.check_guard_rejection_reason(_case_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.cases
    WHERE id = _case_id
      AND rejection_reason IS NOT NULL
      AND LENGTH(rejection_reason) > 10
  )
$$;
```

### 4.4 Fraud Guards

```sql
-- Check no fraud block (either no flag or fraud cleared)
CREATE OR REPLACE FUNCTION public.check_guard_no_fraud_block(_case_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.cases
    WHERE id = _case_id
      AND (
        fraud_flag = false
        OR fraud_flag IS NULL
        OR fraud_investigation_status = 'cleared'
      )
  )
$$;
```

### 4.5 Payment Guards

```sql
-- Check if payment details are complete
CREATE OR REPLACE FUNCTION public.check_guard_payment_details(_case_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.cases c
    JOIN public.citizens cit ON c.citizen_id = cit.id
    WHERE c.id = _case_id
      AND c.payment_amount IS NOT NULL
      AND c.payment_amount > 0
      AND cit.bank_account_number IS NOT NULL
  )
$$;

-- Check if payment was executed
CREATE OR REPLACE FUNCTION public.check_guard_payment_executed(_case_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.payment_items
    WHERE case_id = _case_id
      AND status = 'processed'
  )
$$;

-- Check no pending actions
CREATE OR REPLACE FUNCTION public.check_guard_no_pending_actions(_case_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.cases
    WHERE id = _case_id
      AND (
        -- Has pending payments
        EXISTS (
          SELECT 1 FROM public.payment_items
          WHERE case_id = _case_id AND status = 'pending'
        )
        -- Has open fraud investigation
        OR (fraud_flag = true AND fraud_investigation_status != 'closed')
        -- Has unresolved appeals
        OR EXISTS (
          SELECT 1 FROM public.case_appeals
          WHERE case_id = _case_id AND status = 'pending'
        )
      )
  )
$$;
```

---

## 5. Escalation Authorization Rules

### 5.1 Fraud Escalation

| Trigger | From Role | To Role | Automatic |
|---------|-----------|---------|-----------|
| fraud_risk_level = 'high' | case_handler | fraud_officer | Yes |
| fraud_risk_level = 'critical' | case_handler | fraud_officer + dept_head | Yes |
| manual_fraud_flag | case_handler | fraud_officer | No |
| fraud_pattern_detected | system | fraud_officer | Yes |

```sql
-- Trigger function for automatic fraud escalation
CREATE OR REPLACE FUNCTION public.trigger_fraud_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- High risk: escalate to fraud officer
  IF NEW.fraud_risk_level = 'high' AND OLD.fraud_risk_level != 'high' THEN
    INSERT INTO public.case_escalations (case_id, escalation_type, target_role, reason)
    VALUES (NEW.id, 'fraud', 'fraud_officer', 'Automatic escalation: high fraud risk');
    
    INSERT INTO public.notifications (recipient_role, case_id, message_type, content)
    VALUES ('fraud_officer', NEW.id, 'escalation', 'Case escalated: High fraud risk detected');
  END IF;

  -- Critical risk: escalate to fraud officer AND department head
  IF NEW.fraud_risk_level = 'critical' AND OLD.fraud_risk_level != 'critical' THEN
    INSERT INTO public.case_escalations (case_id, escalation_type, target_role, reason)
    VALUES 
      (NEW.id, 'fraud', 'fraud_officer', 'Automatic escalation: critical fraud risk'),
      (NEW.id, 'fraud', 'department_head', 'Automatic escalation: critical fraud risk');
  END IF;

  RETURN NEW;
END;
$$;
```

### 5.2 Payment Escalation

| Trigger | From Role | To Role | Automatic |
|---------|-----------|---------|-----------|
| payment_failed | system | finance_officer | Yes |
| payment_amount > threshold | case_handler | dept_head | Yes |
| payment_batch_error | system | finance_officer + admin | Yes |
| bank_account_change | citizen | case_handler | Yes |

### 5.3 Decision Override Escalation

| Trigger | From Role | To Role | Automatic |
|---------|-----------|---------|-----------|
| eligibility_override | case_reviewer | dept_head | No |
| rejection_appeal | citizen | case_reviewer | No |
| case_reopen | case_handler | dept_head | No |
| SLA_breach | system | dept_head | Yes |

---

## 6. Status-Based Action Restrictions

### 6.1 Allowed Actions by Status

| Status | Document Upload | Edit Wizard | Edit Eligibility | Approve/Reject | Process Payment |
|--------|-----------------|-------------|------------------|----------------|-----------------|
| intake | ✓ | ✓ | ✗ | ✗ | ✗ |
| validation | ✓ | ✗ | ✗ | ✗ | ✗ |
| eligibility_check | ✓ | ✗ | ✓ | ✗ | ✗ |
| under_review | Limited | ✗ | ✗ | ✓ | ✗ |
| approved | ✗ | ✗ | ✗ | ✗ | Setup |
| rejected | ✗ | ✗ | ✗ | ✗ | ✗ |
| payment_pending | ✗ | ✗ | ✗ | ✗ | ✓ |
| payment_processed | ✗ | ✗ | ✗ | ✗ | ✗ |
| closed | ✗ | ✗ | ✗ | ✗ | ✗ |
| withdrawn | ✗ | ✗ | ✗ | ✗ | ✗ |

### 6.2 RLS Implementation for Status-Based Restrictions

```sql
-- Document upload restriction by status
CREATE POLICY "documents_insert_status_check"
ON public.documents
FOR INSERT
TO authenticated
WITH CHECK (
  public.can_upload_document(case_id)
  AND (
    public.is_portal_owner(citizen_id) OR
    public.has_role(auth.uid(), 'district_intake_officer') OR
    public.has_role(auth.uid(), 'case_handler')
  )
);

-- Eligibility edit restriction by status
CREATE POLICY "eligibility_update_status_check"
ON public.eligibility_evaluations
FOR UPDATE
TO authenticated
USING (
  public.can_update_eligibility(case_id)
  AND public.has_case_access(case_id)
  AND public.has_role(auth.uid(), 'case_handler')
);
```

---

## 7. Audit Trail Requirements

### 7.1 Transition Logging

Every status transition must be logged:

```sql
CREATE TABLE public.workflow_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id),
  from_status TEXT NOT NULL,
  to_status TEXT NOT NULL,
  transition_id TEXT,
  performed_by UUID NOT NULL REFERENCES auth.users(id),
  performed_at TIMESTAMPTZ DEFAULT now(),
  role_at_time app_role NOT NULL,
  guard_conditions_met JSONB,
  notes TEXT,
  ip_address INET,
  user_agent TEXT
);

-- Automatic logging trigger
CREATE OR REPLACE FUNCTION public.log_status_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.current_status != NEW.current_status THEN
    INSERT INTO public.workflow_audit_log (
      case_id, from_status, to_status, performed_by, role_at_time
    )
    VALUES (
      NEW.id,
      OLD.current_status,
      NEW.current_status,
      auth.uid(),
      (SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1)
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER case_status_audit
AFTER UPDATE OF current_status ON public.cases
FOR EACH ROW EXECUTE FUNCTION public.log_status_transition();
```

### 7.2 Field Change Logging

```sql
CREATE TABLE public.field_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by UUID NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT now(),
  case_status_at_time TEXT
);
```

---

## 8. Summary Matrix

### 8.1 Role-Status-Action Summary

| Role | intake | validation | eligibility_check | under_review | approved | payment_pending | payment_processed | closed |
|------|--------|------------|-------------------|--------------|----------|-----------------|-------------------|--------|
| citizen | Upload docs | View only | View only | View only | View only | View only | View only | View only |
| intake_officer | Full access | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| case_handler | ✗ | Full access | Full access | View only | Setup payment | ✗ | ✗ | Close |
| case_reviewer | ✗ | ✗ | ✗ | Review/decide | ✗ | ✗ | ✗ | ✗ |
| dept_head | Override any | Override any | Override any | Override any | Override any | Override any | Override any | Override any |
| finance_officer | ✗ | ✗ | ✗ | ✗ | ✗ | Process | ✗ | ✗ |
| fraud_officer | Flag | Flag | Flag | Flag | Flag | Flag | Flag | ✗ |
| admin | Full | Full | Full | Full | Full | Full | Full | Full |

---

## 9. Requires Clarification

| Item | Context | Impact |
|------|---------|--------|
| SLA breach thresholds | Auto-escalation timing | T_SLA trigger |
| Payment amount thresholds | Department head approval | T006 guard |
| Appeal workflow | Separate state machine? | T011 extension |
| Batch processing transitions | Multiple cases | Transaction handling |
| Citizen self-withdrawal rules | Time limits? | T009 guards |

---

## 10. References

- [case_workflow.json](../configs/workflows/case_workflow.json)
- [RLS-Policy-Definitions.md](./RLS-Policy-Definitions.md)
- [Case-Authorization-Model.md](./Case-Authorization-Model.md)
- [Security-Definer-Functions.md](./Security-Definer-Functions.md)

---

**Document Version**: 1.0  
**Phase**: 8  
**Status**: Documentation Only — Pending Phase 9 Execution
