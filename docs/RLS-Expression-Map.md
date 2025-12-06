# SoZaVo Platform v1.0 – RLS Expression Map

> **Version:** 1.0  
> **Phase:** 7 – RLS Security & Authorization Layer  
> **Status:** Specification Document (Technology-Neutral)  
> **Cross-References:** RLS-Policy-Specification.md, Access-Control-PreModel.md

---

## 1. Overview

This document defines exact predicate expressions in a technology-neutral format. Phase 8 will convert these to Supabase RLS policies and SECURITY DEFINER functions.

---

## 2. Row Filter Expressions

### 2.1 citizens Table

```
portal_owner_expr:
  citizens.portal_user_id = auth.uid()

office_scope_expr:
  citizens.district_id = current_user_district()

case_related_expr:
  citizens.id IN (
    SELECT citizen_id FROM cases 
    WHERE case_handler_id = current_user_id()
  )

review_scope_expr:
  citizens.id IN (
    SELECT citizen_id FROM cases 
    WHERE current_status = 'under_review'
  )

payment_scope_expr:
  citizens.id IN (
    SELECT citizen_id FROM cases 
    WHERE current_status IN ('approved', 'payment_pending', 'payment_processed')
  )

fraud_scope_expr:
  citizens.id IN (
    SELECT citizen_id FROM cases 
    WHERE fraud_risk_level IN ('HIGH', 'CRITICAL')
  )

admin_scope_expr:
  TRUE
```

### 2.2 cases Table

```
portal_owner_expr:
  cases.citizen_id IN (
    SELECT id FROM citizens 
    WHERE portal_user_id = auth.uid()
  )

district_scope_expr:
  cases.intake_office_id IN (
    SELECT id FROM offices 
    WHERE district_id = current_user_district()
  )

handler_scope_expr:
  cases.case_handler_id = current_user_id()

reviewer_scope_expr:
  cases.current_status = 'under_review'
  AND has_role(auth.uid(), 'case_reviewer')

department_scope_expr:
  cases.intake_office_id IN (
    SELECT id FROM offices 
    WHERE district_id IN (
      SELECT district_id FROM user_department_scope(auth.uid())
    )
  )

finance_scope_expr:
  cases.current_status IN ('approved', 'payment_pending', 'payment_processed')
  AND has_role(auth.uid(), 'finance_officer')

fraud_scope_expr:
  cases.fraud_risk_level IN ('HIGH', 'CRITICAL')
  AND has_role(auth.uid(), 'fraud_officer')

admin_scope_expr:
  has_role(auth.uid(), 'system_admin')

audit_scope_expr:
  has_role(auth.uid(), 'audit_viewer')
```

### 2.3 case_events Table

```
case_access_expr:
  case_events.case_id IN (
    SELECT id FROM cases WHERE [user_has_case_access]
  )

-- Inherits from cases table access
```

### 2.4 eligibility_evaluations Table

```
case_access_expr:
  eligibility_evaluations.case_id IN (
    SELECT id FROM cases WHERE [user_has_case_access]
  )

update_allowed_expr:
  eligibility_evaluations.case_id IN (
    SELECT id FROM cases 
    WHERE current_status NOT IN ('under_review', 'approved', 'rejected', 'closed')
  )
  OR has_role(auth.uid(), 'department_head')
  OR has_role(auth.uid(), 'system_admin')
```

### 2.5 documents Table

```
citizen_owner_expr:
  documents.case_id IN (
    SELECT id FROM cases 
    WHERE citizen_id IN (
      SELECT id FROM citizens WHERE portal_user_id = auth.uid()
    )
  )

case_access_expr:
  documents.case_id IN (
    SELECT id FROM cases WHERE [user_has_case_access]
  )

fraud_conditional_expr:
  documents.case_id IN (
    SELECT id FROM cases WHERE fraud_risk_level IN ('HIGH', 'CRITICAL')
  )
  AND has_role(auth.uid(), 'fraud_officer')

finance_conditional_expr:
  documents.case_id IN (
    SELECT id FROM cases WHERE current_status IN ('approved', 'payment_pending')
  )
  AND has_role(auth.uid(), 'finance_officer')

upload_allowed_expr:
  documents.case_id IN (
    SELECT id FROM cases 
    WHERE current_status IN ('intake', 'validation', 'eligibility_check')
  )
```

### 2.6 payments Table

```
citizen_owner_expr:
  payments.case_id IN (
    SELECT id FROM cases 
    WHERE citizen_id IN (
      SELECT id FROM citizens WHERE portal_user_id = auth.uid()
    )
  )

case_access_expr:
  payments.case_id IN (
    SELECT id FROM cases WHERE [user_has_case_access]
  )

finance_scope_expr:
  has_role(auth.uid(), 'finance_officer')

update_allowed_expr:
  payments.status NOT IN ('processed', 'completed')
  AND has_role(auth.uid(), 'finance_officer')
```

### 2.7 payment_batches Table

```
finance_scope_expr:
  has_role(auth.uid(), 'finance_officer')
  OR has_role(auth.uid(), 'department_head')
  OR has_role(auth.uid(), 'system_admin')
  OR has_role(auth.uid(), 'audit_viewer')
```

### 2.8 fraud_signals Table

```
fraud_team_expr:
  has_role(auth.uid(), 'fraud_officer')
  OR has_role(auth.uid(), 'department_head')
  OR has_role(auth.uid(), 'system_admin')
  OR has_role(auth.uid(), 'audit_viewer')
```

### 2.9 fraud_risk_scores Table

```
fraud_team_expr:
  has_role(auth.uid(), 'fraud_officer')
  OR has_role(auth.uid(), 'department_head')
  OR has_role(auth.uid(), 'system_admin')
  OR has_role(auth.uid(), 'audit_viewer')

handler_limited_expr:
  -- case_handler can see risk_level only, not details
  fraud_risk_scores.case_id IN (
    SELECT id FROM cases WHERE case_handler_id = current_user_id()
  )
```

### 2.10 notifications Table

```
own_user_expr:
  notifications.user_id = auth.uid()
```

### 2.11 portal_notifications Table

```
citizen_owner_expr:
  portal_notifications.citizen_id IN (
    SELECT id FROM citizens WHERE portal_user_id = auth.uid()
  )
```

### 2.12 user_roles Table

```
own_user_expr:
  user_roles.user_id = auth.uid()

admin_expr:
  has_role(auth.uid(), 'system_admin')

department_scope_expr:
  has_role(auth.uid(), 'department_head')
  AND user_roles.user_id IN (
    SELECT user_id FROM users 
    WHERE office_id IN (
      SELECT id FROM offices 
      WHERE district_id IN (SELECT district_id FROM user_department_scope(auth.uid()))
    )
  )
```

---

## 3. Column Permission Map

### 3.1 Masked Fields

| Table | Field | Masking Rule | Visible To |
|-------|-------|--------------|------------|
| citizens | national_id | Show last 4 digits only | citizen (own), system_admin |
| citizens | phone | Show last 4 digits only | citizen (own), case_handler, system_admin |
| citizens | email | Show domain only | citizen (own), case_handler, system_admin |
| citizens | bank_account | Show last 4 digits only | citizen (own), finance_officer, system_admin |

### 3.2 Write-Protected Fields

| Table | Field | Protection Rule |
|-------|-------|-----------------|
| citizens | national_id | Never updatable after creation |
| citizens | id | System-generated, never updatable |
| cases | id | System-generated, never updatable |
| cases | case_reference | System-generated, never updatable |
| cases | created_at | System-generated, never updatable |
| cases | citizen_id | Never updatable after creation |
| case_events | * | Entire table is append-only |
| eligibility_evaluations | id | System-generated, never updatable |
| eligibility_evaluations | evaluated_at | System-generated, never updatable |
| payments | id | System-generated, never updatable |
| documents | id | System-generated, never updatable |
| documents | uploaded_at | System-generated, never updatable |

### 3.3 Redacted Fields for Non-Admin

| Table | Field | Redacted For |
|-------|-------|--------------|
| cases | internal_notes | citizen |
| cases | fraud_risk_level | citizen |
| case_events | actor_details | citizen |
| fraud_signals | * | citizen, most staff |
| fraud_risk_scores | signal_details | citizen, case_handler |

### 3.4 Status-Locked Fields

| Table | Field | Locked When |
|-------|-------|-------------|
| cases | wizard_data | status != 'intake' |
| eligibility_evaluations | result | case status = 'approved' OR 'rejected' |
| eligibility_evaluations | criteria_results | case status = 'approved' OR 'rejected' |
| payments | amount | status = 'processed' |
| payments | recipient_account | status = 'processed' |

---

## 4. Action Matrix Map

### 4.1 SELECT Permissions

| Resource | citizen | intake_officer | case_handler | case_reviewer | dept_head | finance | fraud | admin | audit |
|----------|---------|----------------|--------------|---------------|-----------|---------|-------|-------|-------|
| citizens | Own | District | Assigned | Review | Dept | Payment | Flagged | All | All |
| cases | Own | District | Assigned | Review | Dept | Payment | Flagged | All | All |
| case_events | Own | District | Assigned | Review | Dept | Payment | Flagged | All | All |
| eligibility_evaluations | Own | - | Assigned | Review | Dept | - | Flagged | All | All |
| documents | Own | District | Assigned | Review | Dept | Payment | Flagged | All | All |
| payments | Own | - | Assigned | Review | Dept | All | Flagged | All | All |
| payment_batches | - | - | - | - | All | All | - | All | All |
| payment_items | - | - | - | - | All | All | - | All | All |
| fraud_signals | - | - | - | - | All | - | All | All | All |
| fraud_risk_scores | - | - | Level only | - | All | - | All | All | All |
| notifications | Own | Own | Own | Own | Own | Own | Own | Own | - |
| portal_notifications | Own | - | - | - | - | - | - | All | All |
| user_roles | Own | Own | Own | Own | Dept | Own | Own | All | All |
| service_types | All | All | All | All | All | All | All | All | All |
| offices | All | All | All | All | All | All | All | All | All |

### 4.2 INSERT Permissions

| Resource | citizen | intake_officer | case_handler | case_reviewer | dept_head | finance | fraud | admin | audit |
|----------|---------|----------------|--------------|---------------|-----------|---------|-------|-------|-------|
| citizens | - | Yes | Yes | - | - | - | - | Yes | - |
| cases | - | Yes | Yes | - | - | - | - | Yes | - |
| case_events | - | - | Yes | Yes | Yes | Yes | Yes | Yes | - |
| eligibility_evaluations | - | - | Yes | - | - | - | - | Yes | - |
| documents | Own case | Yes | Yes | - | - | - | - | Yes | - |
| payments | - | - | - | - | - | Yes | - | Yes | - |
| payment_batches | - | - | - | - | - | Yes | - | Yes | - |
| payment_items | - | - | - | - | - | Yes | - | Yes | - |
| fraud_signals | - | - | - | - | - | - | Yes | Yes | - |
| fraud_risk_scores | - | - | - | - | - | - | Yes | Yes | - |
| notifications | - | - | - | - | - | - | - | System | - |
| portal_notifications | - | - | - | - | - | - | - | System | - |
| user_roles | - | - | - | - | Dept | - | - | Yes | - |

### 4.3 UPDATE Permissions

| Resource | citizen | intake_officer | case_handler | case_reviewer | dept_head | finance | fraud | admin | audit |
|----------|---------|----------------|--------------|---------------|-----------|---------|-------|-------|-------|
| citizens | Own (limited) | - | Assigned | - | - | - | - | Yes | - |
| cases | - | Intake only | Assigned | Review | Override | - | Flag | Yes | - |
| case_events | - | - | - | - | - | - | - | - | - |
| eligibility_evaluations | - | - | Before lock | Override | Override | - | - | Yes | - |
| documents | - | - | Yes | Verify | Verify | - | - | Yes | - |
| payments | - | - | - | - | - | Before proc | - | Yes | - |
| payment_batches | - | - | - | - | - | Yes | - | Yes | - |
| payment_items | - | - | - | - | - | Yes | - | Yes | - |
| fraud_signals | - | - | - | - | - | - | Yes | Yes | - |
| fraud_risk_scores | - | - | - | - | - | - | Yes | Yes | - |
| notifications | Own | Own | Own | Own | Own | Own | Own | Yes | - |
| portal_notifications | Own | - | - | - | - | - | - | Yes | - |
| user_roles | - | - | - | - | - | - | - | Yes | - |

### 4.4 DELETE Permissions

| Resource | citizen | intake_officer | case_handler | case_reviewer | dept_head | finance | fraud | admin | audit |
|----------|---------|----------------|--------------|---------------|-----------|---------|-------|-------|-------|
| citizens | - | - | - | - | - | - | - | Yes | - |
| cases | - | - | - | - | - | - | - | Yes | - |
| case_events | - | - | - | - | - | - | - | - | - |
| eligibility_evaluations | - | - | - | - | - | - | - | Yes | - |
| documents | - | - | - | - | - | - | - | Yes | - |
| payments | - | - | - | - | - | - | - | Yes | - |
| payment_batches | - | - | - | - | - | - | - | Yes | - |
| payment_items | - | - | - | - | - | - | - | Yes | - |
| fraud_signals | - | - | - | - | - | - | - | Yes | - |
| fraud_risk_scores | - | - | - | - | - | - | - | Yes | - |
| notifications | - | - | - | - | - | - | - | Yes | - |
| portal_notifications | - | - | - | - | - | - | - | Yes | - |
| user_roles | - | - | - | - | - | - | - | Yes | - |

---

## 5. Composite Expressions

### 5.1 has_case_access(case_id)

```
FUNCTION has_case_access(case_id UUID) RETURNS BOOLEAN:

  -- Admin always has access
  IF has_role(auth.uid(), 'system_admin') THEN RETURN TRUE
  
  -- Audit viewer has read access
  IF has_role(auth.uid(), 'audit_viewer') THEN RETURN TRUE
  
  -- Check citizen ownership
  IF EXISTS (
    SELECT 1 FROM cases c
    JOIN citizens ci ON c.citizen_id = ci.id
    WHERE c.id = case_id AND ci.portal_user_id = auth.uid()
  ) THEN RETURN TRUE
  
  -- Check case handler assignment
  IF EXISTS (
    SELECT 1 FROM cases 
    WHERE id = case_id AND case_handler_id = current_user_id()
  ) THEN RETURN TRUE
  
  -- Check reviewer access
  IF has_role(auth.uid(), 'case_reviewer') AND EXISTS (
    SELECT 1 FROM cases 
    WHERE id = case_id AND current_status = 'under_review'
  ) THEN RETURN TRUE
  
  -- Check department head access
  IF has_role(auth.uid(), 'department_head') AND EXISTS (
    SELECT 1 FROM cases c
    JOIN offices o ON c.intake_office_id = o.id
    WHERE c.id = case_id 
    AND o.district_id IN (SELECT district_id FROM user_department_scope(auth.uid()))
  ) THEN RETURN TRUE
  
  -- Check finance access
  IF has_role(auth.uid(), 'finance_officer') AND EXISTS (
    SELECT 1 FROM cases 
    WHERE id = case_id 
    AND current_status IN ('approved', 'payment_pending', 'payment_processed')
  ) THEN RETURN TRUE
  
  -- Check fraud access
  IF has_role(auth.uid(), 'fraud_officer') AND EXISTS (
    SELECT 1 FROM cases 
    WHERE id = case_id 
    AND fraud_risk_level IN ('HIGH', 'CRITICAL')
  ) THEN RETURN TRUE
  
  -- Check district intake access
  IF has_role(auth.uid(), 'district_intake_officer') AND EXISTS (
    SELECT 1 FROM cases c
    JOIN offices o ON c.intake_office_id = o.id
    WHERE c.id = case_id 
    AND o.district_id = current_user_district()
  ) THEN RETURN TRUE
  
  RETURN FALSE
```

### 5.2 current_user_id()

```
FUNCTION current_user_id() RETURNS UUID:
  SELECT id FROM users WHERE auth_user_id = auth.uid()
```

### 5.3 current_user_district()

```
FUNCTION current_user_district() RETURNS UUID:
  SELECT o.district_id 
  FROM users u
  JOIN offices o ON u.office_id = o.id
  WHERE u.auth_user_id = auth.uid()
```

### 5.4 user_department_scope(user_id)

```
FUNCTION user_department_scope(user_id UUID) RETURNS SETOF UUID:
  -- Returns district_ids the department_head can access
  SELECT district_id FROM user_district_assignments
  WHERE user_id = user_id
```

---

## 6. Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Phase 7 | System | Initial specification |
