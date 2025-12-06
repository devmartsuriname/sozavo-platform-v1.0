# SoZaVo Platform v1.0 – Policy Validation Matrix

> **Version:** 1.0  
> **Phase:** 7 – RLS Security & Authorization Layer  
> **Status:** Specification Document  
> **Cross-References:** All Phase 7 RLS Documents

---

## 1. Overview

This document defines cross-check validation requirements for Phase 8 RLS implementation. Every policy must be validated against these criteria before deployment.

---

## 2. Role Coverage Validation

### 2.1 Every Role Must Have Defined Access

| Role | Required Definitions | Validation Check |
|------|---------------------|------------------|
| citizen | SELECT on own data, INSERT documents | ☐ Verified |
| district_intake_officer | District-scoped CREATE/READ | ☐ Verified |
| case_handler | Assigned case CRUD | ☐ Verified |
| case_reviewer | Review queue access | ☐ Verified |
| department_head | Department scope + override | ☐ Verified |
| finance_officer | Payment tables access | ☐ Verified |
| fraud_officer | Fraud tables + flagged cases | ☐ Verified |
| system_admin | Full access all tables | ☐ Verified |
| audit_viewer | Read-only all tables | ☐ Verified |

### 2.2 Role-Resource Coverage Matrix

For each role, verify access defined for:

| Resource | citizen | intake | handler | reviewer | dept_head | finance | fraud | admin | audit |
|----------|---------|--------|---------|----------|-----------|---------|-------|-------|-------|
| citizens | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| cases | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| case_events | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| eligibility_evaluations | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| documents | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| payments | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| payment_batches | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| payment_items | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| fraud_signals | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| fraud_risk_scores | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| notifications | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| portal_notifications | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| user_roles | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| service_types | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| offices | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

---

## 3. Field Restriction Validation

### 3.1 Every Restricted Field Must Have Access Rule

| Table | Field | Restriction Type | Rule Defined | Validation |
|-------|-------|------------------|--------------|------------|
| citizens | national_id | Masked | Partial display | ☐ |
| citizens | phone | Masked | Partial display | ☐ |
| citizens | email | Masked | Domain only | ☐ |
| citizens | bank_account | Masked | Last 4 digits | ☐ |
| cases | internal_notes | Redacted | Hide from citizen | ☐ |
| cases | fraud_risk_level | Redacted | Hide from citizen | ☐ |
| cases | wizard_data | Status-locked | Immutable after intake | ☐ |
| case_events | actor_details | Redacted | Hide from citizen | ☐ |
| eligibility_evaluations | result | Status-locked | Locked after approval | ☐ |
| eligibility_evaluations | criteria_results | Status-locked | Locked after approval | ☐ |
| payments | amount | Status-locked | Locked after processed | ☐ |
| payments | recipient_account | Status-locked | Locked after processed | ☐ |
| fraud_signals | * | Role-restricted | Fraud team only | ☐ |
| fraud_risk_scores | signal_details | Role-restricted | Fraud team only | ☐ |

### 3.2 Write-Protected Fields Validation

| Field | Protection Rule | Enforcement | Validation |
|-------|-----------------|-------------|------------|
| *.id | Never updatable | Trigger/constraint | ☐ |
| *.created_at | Never updatable | Trigger/constraint | ☐ |
| cases.case_reference | Never updatable | Trigger/constraint | ☐ |
| cases.citizen_id | Never updatable | Trigger/constraint | ☐ |
| citizens.national_id | Never updatable | Trigger/constraint | ☐ |
| case_events.* | Append-only | No UPDATE policy | ☐ |

---

## 4. Workflow Transition Validation

### 4.1 Every Transition Must Have Authorization Rule

| From | To | Authorized Roles | Guard Conditions | Validation |
|------|----|--------------------|------------------|------------|
| intake | validation | intake_officer, handler | wizard_complete | ☐ |
| validation | eligibility_check | handler | docs_uploaded | ☐ |
| eligibility_check | under_review | handler | eligibility_exists | ☐ |
| under_review | approved | reviewer, dept_head | criteria_met | ☐ |
| under_review | rejected | reviewer, dept_head | reason_provided | ☐ |
| under_review | on_hold | reviewer | hold_reason | ☐ |
| on_hold | under_review | reviewer, handler | hold_resolved | ☐ |
| approved | payment_pending | finance, system | payment_created | ☐ |
| payment_pending | payment_processed | finance, system | subema_confirmed | ☐ |
| payment_pending | payment_failed | system | subema_failed | ☐ |
| * | fraud_investigation | fraud_officer | fraud_alert | ☐ |
| fraud_investigation | previous | fraud_officer | cleared | ☐ |
| closed | reopened | dept_head | justification | ☐ |

### 4.2 Transition Guard Validation

Each guard condition must be verified:

| Guard | Required Data | Validation Check |
|-------|---------------|------------------|
| wizard_complete | wizard_data not null, all steps complete | ☐ |
| docs_uploaded | required documents exist | ☐ |
| eligibility_exists | eligibility_evaluations record exists | ☐ |
| criteria_met | all mandatory rules passed | ☐ |
| reason_provided | rejection_reason not null | ☐ |
| hold_reason | hold_reason not null | ☐ |
| hold_resolved | resolution notes provided | ☐ |
| payment_created | payments record exists | ☐ |
| subema_confirmed | external_reference not null | ☐ |
| fraud_alert | fraud_risk_level HIGH/CRITICAL | ☐ |
| cleared | investigation_result = cleared | ☐ |
| justification | reopen_reason not null | ☐ |

---

## 5. DAL Operation Validation

### 5.1 Every DAL CREATE Must Map to Valid Role

| DAL Operation | Tables Affected | Required Role(s) | Validation |
|---------------|-----------------|------------------|------------|
| create_citizen | citizens | intake_officer, handler, admin | ☐ |
| create_case | cases | intake_officer, handler, admin | ☐ |
| create_case_event | case_events | staff roles | ☐ |
| create_eligibility_evaluation | eligibility_evaluations | handler, admin | ☐ |
| create_document | documents | citizen, intake, handler, admin | ☐ |
| create_payment | payments | finance, admin | ☐ |
| create_payment_batch | payment_batches | finance, admin | ☐ |
| create_fraud_signal | fraud_signals | fraud, admin | ☐ |
| create_fraud_score | fraud_risk_scores | fraud, admin | ☐ |
| create_notification | notifications | system | ☐ |

### 5.2 Every DAL UPDATE Must Map to Valid Role

| DAL Operation | Tables Affected | Required Role(s) | Conditions | Validation |
|---------------|-----------------|------------------|------------|------------|
| update_citizen_contact | citizens | citizen, handler | Own/assigned | ☐ |
| update_case_status | cases | handler, reviewer, fraud | Transition rules | ☐ |
| update_case_handler | cases | dept_head, admin | - | ☐ |
| update_eligibility_result | eligibility_evaluations | handler, dept_head | Before lock | ☐ |
| update_document_status | documents | handler, reviewer, dept_head | Case access | ☐ |
| update_payment_status | payments | finance | Before processed | ☐ |
| update_fraud_score | fraud_risk_scores | fraud | With justification | ☐ |
| mark_notification_read | notifications | owner | Own only | ☐ |

### 5.3 Every DAL DELETE Must Map to Valid Role

| DAL Operation | Tables Affected | Required Role(s) | Validation |
|---------------|-----------------|------------------|------------|
| delete_citizen | citizens | admin only | ☐ |
| delete_case | cases | admin only | ☐ |
| delete_document | documents | admin only | ☐ |
| delete_payment | payments | admin only | ☐ |

---

## 6. Engine Input Validation

### 6.1 All Engine Inputs Must Respect RLS

| Engine | Input Data | RLS Tables Accessed | Validation |
|--------|------------|---------------------|------------|
| Wizard Engine | citizen_data, wizard_steps | citizens, cases | ☐ |
| Eligibility Engine | case_data, citizen_data, rules | cases, citizens, eligibility_rules | ☐ |
| Workflow Engine | case_status, transition | cases, case_events | ☐ |
| Payment Engine | case_data, formula | cases, payments, payment_batches | ☐ |
| Fraud Engine | case_data, signals | cases, fraud_signals, fraud_risk_scores | ☐ |
| Notification Engine | recipient, template | notifications, notification_templates | ☐ |

### 6.2 Engine Output Validation

| Engine | Output Data | RLS Tables Written | Validation |
|--------|-------------|-------------------|------------|
| Wizard Engine | wizard_data | cases | ☐ |
| Eligibility Engine | evaluation_result | eligibility_evaluations | ☐ |
| Workflow Engine | status_change, event | cases, case_events | ☐ |
| Payment Engine | payment_record | payments, payment_items | ☐ |
| Fraud Engine | signals, scores | fraud_signals, fraud_risk_scores | ☐ |
| Notification Engine | notification_record | notifications, portal_notifications | ☐ |

---

## 7. Cross-Table Policy Validation

### 7.1 Cascading Access Validation

| Primary Table | Dependent Table | Inheritance Rule | Validation |
|---------------|-----------------|------------------|------------|
| cases | case_events | Case access → events access | ☐ |
| cases | eligibility_evaluations | Case access → evaluation access | ☐ |
| cases | documents | Case access → document access | ☐ |
| cases | payments | Case access → payment access | ☐ |
| citizens | cases | Citizen access → own cases | ☐ |
| payment_batches | payment_items | Batch access → items access | ☐ |

### 7.2 Join-Based Filter Validation

| Policy | Required Joins | Join Condition | Validation |
|--------|----------------|----------------|------------|
| documents_citizen_select | documents → cases → citizens | citizen.portal_user_id | ☐ |
| case_events_handler_select | case_events → cases | case.case_handler_id | ☐ |
| payments_citizen_select | payments → cases → citizens | citizen.portal_user_id | ☐ |
| eligibility_handler_select | eligibility_evaluations → cases | case.case_handler_id | ☐ |

---

## 8. Security Function Validation

### 8.1 SECURITY DEFINER Functions

| Function | Purpose | Bypass RLS | Validation |
|----------|---------|------------|------------|
| has_role(user_id, role) | Check user role | Yes | ☐ |
| current_user_id() | Get internal user ID | Yes | ☐ |
| current_user_district() | Get user's district | Yes | ☐ |
| has_case_access(case_id) | Check case access | Yes | ☐ |
| user_department_scope(user_id) | Get dept districts | Yes | ☐ |

### 8.2 Function Security Validation

Each SECURITY DEFINER function must:
- Set `search_path = public`
- Validate input parameters
- Not expose internal data in errors
- Be tested for privilege escalation

---

## 9. Negative Test Validation

### 9.1 Access Denial Tests

| Test Case | Actor | Action | Expected Result | Validation |
|-----------|-------|--------|-----------------|------------|
| Citizen reads other citizen | citizen | SELECT citizens | Denied | ☐ |
| Citizen reads other case | citizen | SELECT cases | Denied | ☐ |
| Handler reads unassigned case | case_handler | SELECT cases | Denied | ☐ |
| Reviewer modifies approved case | case_reviewer | UPDATE cases | Denied | ☐ |
| Finance accesses fraud data | finance_officer | SELECT fraud_signals | Denied | ☐ |
| Fraud accesses payment batch | fraud_officer | SELECT payment_batches | Denied | ☐ |
| Any role deletes case | any non-admin | DELETE cases | Denied | ☐ |
| Citizen updates case status | citizen | UPDATE cases | Denied | ☐ |
| Staff modifies closed case | staff | UPDATE cases | Denied | ☐ |

### 9.2 Privilege Escalation Tests

| Test Case | Attack Vector | Prevention | Validation |
|-----------|---------------|------------|------------|
| Role self-assignment | INSERT user_roles | RLS on user_roles | ☐ |
| Direct profile role edit | UPDATE profiles.role | No role on profiles | ☐ |
| JWT claim manipulation | Forged role claim | Server-side validation | ☐ |
| Cross-user data access | Modified user_id | auth.uid() enforcement | ☐ |

---

## 10. Performance Validation

### 10.1 Policy Performance Requirements

| Table | Max Query Time | Index Required | Validation |
|-------|----------------|----------------|------------|
| cases | 100ms | case_handler_id, intake_office_id | ☐ |
| citizens | 100ms | portal_user_id, district_id | ☐ |
| case_events | 200ms | case_id | ☐ |
| documents | 100ms | case_id | ☐ |
| payments | 100ms | case_id, batch_id | ☐ |
| user_roles | 50ms | user_id | ☐ |

### 10.2 Policy Complexity Limits

| Metric | Maximum | Validation |
|--------|---------|------------|
| Subqueries per policy | 3 | ☐ |
| Joins per policy | 2 | ☐ |
| Function calls per policy | 2 | ☐ |
| Policy evaluation time | 50ms | ☐ |

---

## 11. Deployment Validation Checklist

### 11.1 Pre-Deployment

| Check | Status |
|-------|--------|
| All policies created | ☐ |
| All helper functions created | ☐ |
| All indexes created | ☐ |
| Unit tests pass | ☐ |
| Integration tests pass | ☐ |
| Negative tests pass | ☐ |
| Performance tests pass | ☐ |

### 11.2 Post-Deployment

| Check | Status |
|-------|--------|
| No unexpected access denials | ☐ |
| No privilege escalation possible | ☐ |
| Query performance acceptable | ☐ |
| Audit logging working | ☐ |
| Error messages secure | ☐ |

---

## 12. Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Phase 7 | System | Initial specification |
