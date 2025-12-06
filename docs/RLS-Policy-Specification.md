# SoZaVo Platform v1.0 – RLS Policy Specification

> **Version:** 1.0  
> **Phase:** 7 – RLS Security & Authorization Layer  
> **Status:** Specification Document (No Implementation)  
> **Cross-References:** Access-Control-PreModel.md, DAL-Specification.md, case_workflow.json

---

## 1. Overview

This document defines the complete Row-Level Security (RLS) policy specifications for the SoZaVo Platform. These are **documentation-only specifications** that Phase 8 will convert into executable Supabase RLS policies.

**CRITICAL:** Roles MUST be stored in a separate `user_roles` table, NOT on the users or profiles table.

---

## 2. Role Definitions (Final)

### 2.1 Role Enumeration

```
app_role ENUM:
  - citizen
  - district_intake_officer
  - case_handler
  - case_reviewer
  - department_head
  - finance_officer
  - fraud_officer
  - system_admin
  - audit_viewer
```

### 2.2 Role Hierarchy & Privilege Levels

| Role | Privilege Level | Scope | Description |
|------|-----------------|-------|-------------|
| citizen | 1 | Own data | Portal user, access own records only |
| district_intake_officer | 2 | District | Receives applications, creates cases |
| case_handler | 3 | Assigned cases | Processes assigned cases |
| case_reviewer | 4 | Review queue | Reviews and approves/rejects cases |
| department_head | 5 | Department | Oversees department, approves overrides |
| finance_officer | 4 | Payments | Manages payment processing |
| fraud_officer | 4 | Flagged cases | Investigates fraud alerts |
| system_admin | 10 | Global | Full system access |
| audit_viewer | 3 | Global (read) | Read-only compliance access |

### 2.3 Role-Specific Permissions Summary

#### citizen
- **Permitted Actions:** View own citizen record, view own cases, upload documents, view own notifications
- **Restricted Resources:** Other citizens, other cases, staff data, fraud data, payment batches

#### district_intake_officer
- **Permitted Actions:** Create citizens, create cases, view district cases, upload documents
- **Restricted Resources:** Cases outside district, payment processing, fraud investigation

#### case_handler
- **Permitted Actions:** Update assigned cases, verify documents, update eligibility, transition workflow
- **Restricted Resources:** Unassigned cases, approval actions, payment processing

#### case_reviewer
- **Permitted Actions:** View review queue, approve/reject cases, verify documents
- **Restricted Resources:** Case creation, payment processing, fraud investigation

#### department_head
- **Permitted Actions:** View all department cases, approve overrides, manage escalations
- **Restricted Resources:** Other department data, system configuration

#### finance_officer
- **Permitted Actions:** Create payments, manage batches, process Subema sync
- **Restricted Resources:** Case decisions, fraud investigation, eligibility changes

#### fraud_officer
- **Permitted Actions:** View flagged cases, update fraud signals, escalate investigations
- **Restricted Resources:** Payment processing, case approvals, unflagged cases

#### system_admin
- **Permitted Actions:** All operations on all resources
- **Restricted Resources:** None

#### audit_viewer
- **Permitted Actions:** Read all data for compliance
- **Restricted Resources:** All write operations

---

## 3. Resource Classification

### 3.1 High Sensitivity Resources

| Resource | Table Name | Contains | RLS Required |
|----------|------------|----------|--------------|
| Citizens | citizens | PII, national_id | Yes |
| Cases | cases | Application data, decisions | Yes |
| Case Events | case_events | Audit trail | Yes |
| Eligibility Evaluations | eligibility_evaluations | Decision data | Yes |
| Payment Batches | payment_batches | Financial data | Yes |
| Payment Items | payment_items | Financial data | Yes |
| Fraud Signals | fraud_signals | Investigation data | Yes |
| Fraud Risk Scores | fraud_risk_scores | Risk assessments | Yes |
| User Roles | user_roles | Authorization data | Yes |

### 3.2 Medium Sensitivity Resources

| Resource | Table Name | Contains | RLS Required |
|----------|------------|----------|--------------|
| Documents | documents | Uploaded files | Yes |
| Notifications | notifications | Internal messages | Yes |
| Portal Notifications | portal_notifications | Citizen messages | Yes |
| Workflow Definitions | workflow_definitions | Configuration | Yes (read-heavy) |
| Wizard Definitions | wizard_definitions | Configuration | Yes (read-heavy) |

### 3.3 Low Sensitivity Resources

| Resource | Table Name | Contains | RLS Required |
|----------|------------|----------|--------------|
| Service Types | service_types | Lookup data | Yes (permissive read) |
| Offices | offices | Lookup data | Yes (permissive read) |
| Document Requirements | document_requirements | Configuration | Yes (permissive read) |
| Eligibility Rules | eligibility_rules | Configuration | Yes (permissive read) |
| Notification Templates | notification_templates | Configuration | Yes (staff read) |

---

## 4. Policy Specifications by Resource

### 4.1 citizens Table

| Operation | Allowed Roles | Row Filter | Column Restrictions |
|-----------|---------------|------------|---------------------|
| SELECT | citizen, district_intake_officer, case_handler, case_reviewer, department_head, finance_officer, fraud_officer, system_admin, audit_viewer | See 4.1.1 | national_id masked for citizen |
| INSERT | district_intake_officer, case_handler, system_admin | office scope | - |
| UPDATE | citizen (own, limited), case_handler (case-related), system_admin | ownership/assignment | citizen: contact only |
| DELETE | system_admin | - | - |

**4.1.1 SELECT Row Filters:**
- citizen: `portal_user_id = auth.uid()`
- district_intake_officer: `district_id = current_user_district()`
- case_handler: `id IN (SELECT citizen_id FROM cases WHERE case_handler_id = current_user_id())`
- case_reviewer: `id IN (SELECT citizen_id FROM cases WHERE current_status = 'under_review')`
- department_head: `district_id IN (SELECT district_id FROM user_department_scope())`
- finance_officer: `id IN (SELECT citizen_id FROM cases WHERE current_status IN ('approved', 'payment_pending', 'payment_processed'))`
- fraud_officer: `id IN (SELECT citizen_id FROM cases WHERE fraud_risk_level IN ('HIGH', 'CRITICAL'))`
- system_admin: `TRUE`
- audit_viewer: `TRUE`

### 4.2 cases Table

| Operation | Allowed Roles | Row Filter | Column Restrictions |
|-----------|---------------|------------|---------------------|
| SELECT | citizen, district_intake_officer, case_handler, case_reviewer, department_head, finance_officer, fraud_officer, system_admin, audit_viewer | See 4.2.1 | - |
| INSERT | district_intake_officer, case_handler, system_admin | office scope | - |
| UPDATE | case_handler, case_reviewer, department_head, fraud_officer, system_admin | assignment/role | status transitions restricted |
| DELETE | system_admin | - | - |

**4.2.1 SELECT Row Filters:**
- citizen: `citizen_id IN (SELECT id FROM citizens WHERE portal_user_id = auth.uid())`
- district_intake_officer: `intake_office_id IN (SELECT id FROM offices WHERE district_id = current_user_district())`
- case_handler: `case_handler_id = current_user_id()`
- case_reviewer: `current_status = 'under_review'`
- department_head: `intake_office_id IN (SELECT id FROM offices WHERE district_id IN (SELECT district_id FROM user_department_scope()))`
- finance_officer: `current_status IN ('approved', 'payment_pending', 'payment_processed')`
- fraud_officer: `fraud_risk_level IN ('HIGH', 'CRITICAL')`
- system_admin: `TRUE`
- audit_viewer: `TRUE`

### 4.3 case_events Table

| Operation | Allowed Roles | Row Filter | Column Restrictions |
|-----------|---------------|------------|---------------------|
| SELECT | All authenticated | Case access inheritance | - |
| INSERT | case_handler, case_reviewer, department_head, fraud_officer, finance_officer, system_admin | Case access inheritance | - |
| UPDATE | None (immutable) | - | - |
| DELETE | None (immutable) | - | - |

**Row Filter:** User must have SELECT access to the parent case.

### 4.4 eligibility_evaluations Table

| Operation | Allowed Roles | Row Filter | Column Restrictions |
|-----------|---------------|------------|---------------------|
| SELECT | citizen (own), case_handler, case_reviewer, department_head, fraud_officer, system_admin, audit_viewer | Case access inheritance | - |
| INSERT | case_handler, system_admin | Case assignment | - |
| UPDATE | case_handler (before lock), department_head (override), system_admin | Status-dependent | locked after review |
| DELETE | system_admin | - | - |

**Status Lock Rule:** Evaluations are locked (no UPDATE) after case reaches `under_review` status.

### 4.5 documents Table

| Operation | Allowed Roles | Row Filter | Column Restrictions |
|-----------|---------------|------------|---------------------|
| SELECT | citizen (own), district_intake_officer, case_handler, case_reviewer, department_head, fraud_officer (flagged), finance_officer (payment), system_admin, audit_viewer | Case access inheritance | - |
| INSERT | citizen (own case), district_intake_officer, case_handler, system_admin | Case access inheritance | - |
| UPDATE | case_handler, case_reviewer, system_admin | Case access inheritance | verification_status only |
| DELETE | system_admin | - | - |

### 4.6 payments Table

| Operation | Allowed Roles | Row Filter | Column Restrictions |
|-----------|---------------|------------|---------------------|
| SELECT | citizen (own), case_handler, case_reviewer, department_head, finance_officer, fraud_officer (flagged), system_admin, audit_viewer | Case access inheritance | - |
| INSERT | finance_officer, system_admin | - | - |
| UPDATE | finance_officer, system_admin | - | locked after processed |
| DELETE | system_admin | - | - |

### 4.7 payment_batches Table

| Operation | Allowed Roles | Row Filter | Column Restrictions |
|-----------|---------------|------------|---------------------|
| SELECT | finance_officer, department_head, system_admin, audit_viewer | - | - |
| INSERT | finance_officer, system_admin | - | - |
| UPDATE | finance_officer, system_admin | - | - |
| DELETE | system_admin | - | - |

### 4.8 payment_items Table

| Operation | Allowed Roles | Row Filter | Column Restrictions |
|-----------|---------------|------------|---------------------|
| SELECT | finance_officer, department_head, system_admin, audit_viewer | - | - |
| INSERT | finance_officer, system_admin | - | - |
| UPDATE | finance_officer, system_admin | - | - |
| DELETE | system_admin | - | - |

### 4.9 fraud_signals Table

| Operation | Allowed Roles | Row Filter | Column Restrictions |
|-----------|---------------|------------|---------------------|
| SELECT | fraud_officer, department_head, system_admin, audit_viewer | - | - |
| INSERT | fraud_officer, system_admin | - | - |
| UPDATE | fraud_officer, system_admin | - | - |
| DELETE | system_admin | - | - |

### 4.10 fraud_risk_scores Table

| Operation | Allowed Roles | Row Filter | Column Restrictions |
|-----------|---------------|------------|---------------------|
| SELECT | case_handler (limited), fraud_officer, department_head, system_admin, audit_viewer | Case access | case_handler sees level only |
| INSERT | fraud_officer, system_admin | - | - |
| UPDATE | fraud_officer (override), system_admin | - | requires justification |
| DELETE | system_admin | - | - |

### 4.11 notifications Table

| Operation | Allowed Roles | Row Filter | Column Restrictions |
|-----------|---------------|------------|---------------------|
| SELECT | Own user | `user_id = auth.uid()` | - |
| INSERT | System only | - | - |
| UPDATE | Own user | `user_id = auth.uid()` | read_at only |
| DELETE | system_admin | - | - |

### 4.12 portal_notifications Table

| Operation | Allowed Roles | Row Filter | Column Restrictions |
|-----------|---------------|------------|---------------------|
| SELECT | citizen (own) | `citizen_id IN (SELECT id FROM citizens WHERE portal_user_id = auth.uid())` | - |
| INSERT | System only | - | - |
| UPDATE | citizen (own) | ownership | read_at only |
| DELETE | system_admin | - | - |

### 4.13 user_roles Table

| Operation | Allowed Roles | Row Filter | Column Restrictions |
|-----------|---------------|------------|---------------------|
| SELECT | system_admin, department_head (dept scope), own user | See filter | - |
| INSERT | system_admin, department_head (dept scope) | - | - |
| UPDATE | system_admin | - | - |
| DELETE | system_admin | - | - |

**CRITICAL:** This table enables privilege escalation if not properly secured. RLS policies must use SECURITY DEFINER functions.

---

## 5. Standardized Predicates

### 5.1 Predicate Definitions

| Predicate | Logic | Required Fields |
|-----------|-------|-----------------|
| `is_admin()` | User has system_admin role | user_roles.role |
| `is_audit_viewer()` | User has audit_viewer role | user_roles.role |
| `is_same_office(office_id)` | User's office matches parameter | users.office_id |
| `is_same_district(district_id)` | User's district matches parameter | Derived from office |
| `is_case_owner(case_id)` | User is assigned handler | cases.case_handler_id |
| `is_portal_owner(citizen_id)` | Citizen owns via portal | citizens.portal_user_id |
| `is_reviewer()` | Has case_reviewer or department_head role | user_roles.role |
| `is_fraud_team()` | Has fraud_officer role | user_roles.role |
| `is_finance_team()` | Has finance_officer role | user_roles.role |
| `is_document_owner(document_id)` | Document belongs to accessible case | documents.case_id |
| `has_case_access(case_id)` | User can SELECT the case | Multiple |

### 5.2 Predicate Dependencies

```
is_portal_owner
    └── requires: citizens.portal_user_id

is_case_owner
    └── requires: cases.case_handler_id

is_same_office
    └── requires: users.office_id, offices.id

is_same_district
    └── requires: users.office_id → offices.district_id

has_case_access
    └── requires: is_portal_owner OR is_case_owner OR is_reviewer OR is_admin
```

---

## 6. Workflow-Bound Security Rules

Based on `configs/workflows/case_workflow.json`:

### 6.1 Status Transition Authorization

| From Status | To Status | Authorized Roles | Guard Conditions |
|-------------|-----------|------------------|------------------|
| intake | validation | district_intake_officer, case_handler | wizard_completed |
| validation | eligibility_check | case_handler | documents_uploaded |
| eligibility_check | under_review | case_handler | eligibility_evaluated |
| under_review | approved | case_reviewer, department_head | all_criteria_met |
| under_review | rejected | case_reviewer, department_head | rejection_reason_provided |
| under_review | on_hold | case_reviewer | hold_reason_provided |
| on_hold | under_review | case_reviewer, case_handler | hold_resolved |
| approved | payment_pending | system, finance_officer | - |
| payment_pending | payment_processed | system, finance_officer | subema_confirmed |
| payment_pending | payment_failed | system | subema_failure |
| * | fraud_investigation | fraud_officer | fraud_alert_triggered |
| fraud_investigation | * | fraud_officer, department_head | investigation_complete |

### 6.2 Status-Based Data Locks

| Status Reached | Locked Fields |
|----------------|---------------|
| under_review | wizard_data (immutable) |
| approved | eligibility_evaluations (immutable) |
| payment_processed | payment amount, recipient |
| closed | All fields except notes |

### 6.3 Citizen Portal Access Rules

Citizens can ONLY access cases where:
- `cases.citizen_id` references a citizen record where `citizens.portal_user_id = auth.uid()`
- They CANNOT see:
  - Internal notes
  - Handler assignments
  - Fraud signals
  - Other citizens' data

---

## 7. Document Access Rules

Based on Service-Layer-Specification.md:

### 7.1 Citizen Document Access

| Action | Condition |
|--------|-----------|
| View | Document belongs to own case |
| Upload | Case in intake, validation, or eligibility_check status |
| Replace | Only before eligibility evaluation |
| Delete | Never (flag for deletion only) |

### 7.2 Staff Document Access

| Role | View | Upload | Verify | Delete |
|------|------|--------|--------|--------|
| district_intake_officer | District cases | Yes | No | No |
| case_handler | Assigned cases | Yes | Yes | No |
| case_reviewer | Review queue | No | Yes | No |
| department_head | Department cases | No | Yes | No |
| fraud_officer | Flagged cases only | No | No | No |
| finance_officer | Payment cases only | No | No | No |
| system_admin | All | Yes | Yes | Yes |
| audit_viewer | All | No | No | No |

---

## 8. Cross-Table Dependencies

### 8.1 Cascading Access Rules

| Primary Table | Dependent Table | Access Rule |
|---------------|-----------------|-------------|
| cases | case_events | Inherit case access |
| cases | eligibility_evaluations | Inherit case access |
| cases | documents | Inherit case access |
| cases | payments | Inherit case access |
| citizens | cases | Citizen owns cases |
| payment_batches | payment_items | Inherit batch access |

### 8.2 Join-Based Filters

Some policies require join conditions:
- `documents` access requires join to `cases`
- `case_events` access requires join to `cases`
- `payments` access requires join to `cases`

---

## 9. Policy Naming Convention

```
{table}_{role}_{operation}_policy

Examples:
- cases_handler_select_policy
- documents_citizen_insert_policy
- payments_finance_update_policy
- user_roles_admin_all_policy
```

---

## 10. Open Items

| Item | Type | Status |
|------|------|--------|
| Multi-district supervisor access | Policy | Requires Clarification |
| Cross-department case transfer | Policy | Requires Clarification |
| Temporary role delegation | Feature | Requires Clarification |
| Data retention impact on access | Legal | Requires Clarification |

---

## 11. Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Phase 7 | System | Initial specification |
