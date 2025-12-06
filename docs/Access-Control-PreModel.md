# SoZaVo Platform v1.0 – Access Control Pre-Model

> **Version:** 1.0  
> **Phase:** 6 – Engine Runtime Assembly (Preparation for Phase 7)  
> **Status:** Specification Document  
> **Cross-References:** Backend.md, Architecture.md, DAL-Specification.md

---

## 1. Overview

This document defines the access control matrix that will be converted into Row-Level Security (RLS) policies in Phase 7. It specifies actors, resources, actions, and the preliminary mappings between them.

**IMPORTANT:** This is a pre-model document. No RLS policies should be implemented until Phase 7.

---

## 2. Actor Matrix

### 2.1 Internal System Actors

| Actor ID | Role Name | Description | Scope |
|----------|-----------|-------------|-------|
| SYS_ADMIN | system_admin | Full system access, user management | Global |
| DIST_INTAKE | district_intake_officer | Receives new applications at district level | District |
| CASE_HANDLER | case_handler | Processes assigned cases | Assigned cases |
| CASE_REVIEWER | case_reviewer | Reviews and approves/rejects cases | Under review cases |
| DEPT_HEAD | department_head | Oversees department operations | Department |
| FINANCE | finance_officer | Manages payments and financial operations | All payments |
| FRAUD | fraud_officer | Investigates fraud alerts | Flagged cases |
| AUDIT | audit | Read-only access for compliance | Global (read) |

### 2.2 External Actors

| Actor ID | Role Name | Description | Scope |
|----------|-----------|-------------|-------|
| CITIZEN | citizen | Public portal user | Own data only |
| SYSTEM | system | Automated system processes | As configured |

### 2.3 Actor Hierarchy

```
                    ┌─────────────────┐
                    │   SYS_ADMIN     │
                    │ (Full Access)   │
                    └────────┬────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │  DEPT_HEAD   │  │   FINANCE    │  │    FRAUD     │
    │ (Department) │  │ (Payments)   │  │ (Flagged)    │
    └──────┬───────┘  └──────────────┘  └──────────────┘
           │
    ┌──────┴───────┐
    │              │
    ▼              ▼
┌──────────┐  ┌──────────────┐
│CASE_REVIEW│ │ DIST_INTAKE  │
│(Review)   │ │ (District)   │
└────┬─────┘  └──────┬───────┘
     │               │
     └───────┬───────┘
             │
             ▼
      ┌──────────────┐
      │ CASE_HANDLER │
      │ (Assigned)   │
      └──────────────┘

    ┌──────────────┐
    │    AUDIT     │ (Read-only overlay)
    └──────────────┘

    ┌──────────────┐
    │   CITIZEN    │ (External, own data only)
    └──────────────┘
```

---

## 3. Resource Matrix

### 3.1 Primary Resources

| Resource ID | Table Name | Description | Sensitivity |
|-------------|------------|-------------|-------------|
| RES_CASES | cases | Benefit application cases | HIGH |
| RES_CITIZENS | citizens | Citizen registry (CCR) | HIGH |
| RES_DOCUMENTS | documents | Uploaded documents | HIGH |
| RES_PAYMENTS | payments | Payment records | HIGH |
| RES_PAY_BATCHES | payment_batches | Payment batch records | MEDIUM |
| RES_EVALUATIONS | eligibility_evaluations | Eligibility results | MEDIUM |
| RES_EVENTS | case_events | Case event history | MEDIUM |
| RES_FRAUD_SIGNALS | fraud_signals | Fraud detection signals | HIGH |
| RES_FRAUD_SCORES | fraud_risk_scores | Risk score records | HIGH |

### 3.2 Configuration Resources

| Resource ID | Table Name | Description | Sensitivity |
|-------------|------------|-------------|-------------|
| RES_SERVICE_TYPES | service_types | Service definitions | LOW |
| RES_OFFICES | offices | Office registry | LOW |
| RES_WORKFLOW_DEFS | workflow_definitions | Workflow configurations | MEDIUM |
| RES_ELIG_RULES | eligibility_rules | Eligibility rule configs | MEDIUM |
| RES_DOC_REQS | document_requirements | Document requirements | LOW |
| RES_NOTIF_TEMPLATES | notification_templates | Notification templates | LOW |

### 3.3 User Resources

| Resource ID | Table Name | Description | Sensitivity |
|-------------|------------|-------------|-------------|
| RES_USERS | users | Internal user accounts | HIGH |
| RES_USER_ROLES | user_roles | Role assignments | HIGH |
| RES_NOTIFICATIONS | notifications | Internal notifications | MEDIUM |
| RES_PORTAL_NOTIFS | portal_notifications | Citizen notifications | MEDIUM |

### 3.4 Audit Resources

| Resource ID | Table Name | Description | Sensitivity |
|-------------|------------|-------------|-------------|
| RES_AUDIT_LOGS | audit_logs | System audit trail | HIGH |
| RES_EVENTS_LOG | events | Event history | MEDIUM |

---

## 4. Action Matrix

### 4.1 Standard CRUD Actions

| Action ID | Action Name | Description |
|-----------|-------------|-------------|
| ACT_CREATE | create | Insert new record |
| ACT_READ | read | Select/view record |
| ACT_UPDATE | update | Modify existing record |
| ACT_DELETE | delete | Remove record (soft or hard) |

### 4.2 Workflow Actions

| Action ID | Action Name | Description |
|-----------|-------------|-------------|
| ACT_TRANSITION | transition | Change case status |
| ACT_APPROVE | approve | Approve case/payment |
| ACT_REJECT | reject | Reject case/document |
| ACT_OVERRIDE | override | Override eligibility/fraud |
| ACT_FINALIZE | finalize | Complete/close case |
| ACT_REOPEN | reopen | Reopen closed case |

### 4.3 Special Actions

| Action ID | Action Name | Description |
|-----------|-------------|-------------|
| ACT_ASSIGN | assign | Assign case to handler |
| ACT_ESCALATE | escalate | Escalate to supervisor |
| ACT_HOLD | hold | Put case on hold |
| ACT_BATCH | batch | Include in payment batch |
| ACT_VERIFY | verify | Verify document/citizen |
| ACT_EXPORT | export | Export data/reports |

---

## 5. Role-to-Action Mapping (Preliminary)

### 5.1 Cases Resource (RES_CASES)

| Role | create | read | update | delete | transition | approve | reject |
|------|--------|------|--------|--------|------------|---------|--------|
| SYS_ADMIN | ✓ | ✓ (all) | ✓ | ✓ | ✓ | ✓ | ✓ |
| DEPT_HEAD | - | ✓ (dept) | - | - | - | ✓ | ✓ |
| DIST_INTAKE | ✓ | ✓ (district) | ✓ (intake) | - | ✓ (limited) | - | - |
| CASE_HANDLER | - | ✓ (assigned) | ✓ | - | ✓ | - | - |
| CASE_REVIEWER | - | ✓ (review) | - | - | ✓ | ✓ | ✓ |
| FINANCE | - | ✓ (payment) | - | - | - | - | - |
| FRAUD | - | ✓ (flagged) | ✓ (flag) | - | ✓ (hold) | - | - |
| AUDIT | - | ✓ (all) | - | - | - | - | - |
| CITIZEN | - | ✓ (own) | - | - | - | - | - |

### 5.2 Citizens Resource (RES_CITIZENS)

| Role | create | read | update | delete | verify |
|------|--------|------|--------|--------|--------|
| SYS_ADMIN | ✓ | ✓ (all) | ✓ | ✓ | ✓ |
| DEPT_HEAD | - | ✓ (dept) | - | - | - |
| DIST_INTAKE | ✓ | ✓ (district) | ✓ | - | - |
| CASE_HANDLER | - | ✓ (assigned) | ✓ (case-related) | - | - |
| CASE_REVIEWER | - | ✓ (review) | - | - | - |
| FINANCE | - | ✓ (payment) | - | - | - |
| FRAUD | - | ✓ (flagged) | - | - | - |
| AUDIT | - | ✓ (all) | - | - | - |
| CITIZEN | - | ✓ (own) | ✓ (own, limited) | - | - |

### 5.3 Documents Resource (RES_DOCUMENTS)

| Role | create | read | update | delete | verify | reject |
|------|--------|------|--------|--------|--------|--------|
| SYS_ADMIN | ✓ | ✓ (all) | ✓ | ✓ | ✓ | ✓ |
| DEPT_HEAD | - | ✓ (dept) | - | - | ✓ | ✓ |
| DIST_INTAKE | ✓ | ✓ (district) | ✓ | - | - | - |
| CASE_HANDLER | ✓ | ✓ (assigned) | ✓ | - | ✓ | ✓ |
| CASE_REVIEWER | - | ✓ (review) | - | - | ✓ | ✓ |
| FINANCE | - | ✓ (payment) | - | - | - | - |
| FRAUD | - | ✓ (flagged) | - | - | - | - |
| AUDIT | - | ✓ (all) | - | - | - | - |
| CITIZEN | ✓ (own) | ✓ (own) | - | - | - | - |

### 5.4 Payments Resource (RES_PAYMENTS)

| Role | create | read | update | delete | approve | batch |
|------|--------|------|--------|--------|---------|-------|
| SYS_ADMIN | ✓ | ✓ (all) | ✓ | ✓ | ✓ | ✓ |
| DEPT_HEAD | - | ✓ (dept) | - | - | ✓ | - |
| DIST_INTAKE | - | - | - | - | - | - |
| CASE_HANDLER | - | ✓ (assigned) | - | - | - | - |
| CASE_REVIEWER | - | ✓ (review) | - | - | - | - |
| FINANCE | ✓ | ✓ (all) | ✓ | - | ✓ | ✓ |
| FRAUD | - | ✓ (flagged) | ✓ (hold) | - | - | - |
| AUDIT | - | ✓ (all) | - | - | - | - |
| CITIZEN | - | ✓ (own) | - | - | - | - |

### 5.5 Fraud Resources (RES_FRAUD_SIGNALS, RES_FRAUD_SCORES)

| Role | create | read | update | delete | escalate |
|------|--------|------|--------|--------|----------|
| SYS_ADMIN | ✓ | ✓ (all) | ✓ | ✓ | ✓ |
| DEPT_HEAD | - | ✓ (dept) | - | - | ✓ |
| DIST_INTAKE | - | - | - | - | - |
| CASE_HANDLER | - | ✓ (assigned, limited) | - | - | ✓ |
| CASE_REVIEWER | - | ✓ (review) | - | - | ✓ |
| FINANCE | - | ✓ (payment-related) | - | - | - |
| FRAUD | ✓ | ✓ (all) | ✓ | - | ✓ |
| AUDIT | - | ✓ (all) | - | - | - |
| CITIZEN | - | - | - | - | - |

### 5.6 Users Resource (RES_USERS, RES_USER_ROLES)

| Role | create | read | update | delete | assign_role |
|------|--------|------|--------|--------|-------------|
| SYS_ADMIN | ✓ | ✓ (all) | ✓ | ✓ | ✓ |
| DEPT_HEAD | - | ✓ (dept) | ✓ (dept) | - | ✓ (dept) |
| DIST_INTAKE | - | ✓ (own) | ✓ (own) | - | - |
| CASE_HANDLER | - | ✓ (own) | ✓ (own) | - | - |
| CASE_REVIEWER | - | ✓ (own) | ✓ (own) | - | - |
| FINANCE | - | ✓ (own) | ✓ (own) | - | - |
| FRAUD | - | ✓ (own) | ✓ (own) | - | - |
| AUDIT | - | ✓ (all) | - | - | - |
| CITIZEN | - | - | - | - | - |

---

## 6. Scope Definitions

### 6.1 Scope Filters

| Scope | Definition | Applied To |
|-------|------------|------------|
| all | No filter, access all records | SYS_ADMIN, AUDIT |
| dept | Filter by department_id | DEPT_HEAD |
| district | Filter by district_id or intake_office district | DIST_INTAKE |
| assigned | Filter by case_handler_id = current_user | CASE_HANDLER |
| review | Filter by current_status = 'under_review' | CASE_REVIEWER |
| payment | Filter by cases with payment_pending status | FINANCE |
| flagged | Filter by fraud_risk_level >= 'HIGH' | FRAUD |
| own | Filter by citizen_id or user_id = current_user | CITIZEN, all roles for own data |

### 6.2 Scope SQL Patterns (Preliminary)

**District Scope:**
```sql
-- Cases visible to district intake officer
WHERE cases.intake_office_id IN (
  SELECT id FROM offices WHERE district_id = current_user_district()
)
```

**Assigned Scope:**
```sql
-- Cases visible to case handler
WHERE cases.case_handler_id = current_user_id()
```

**Review Scope:**
```sql
-- Cases visible to case reviewer
WHERE cases.current_status = 'under_review'
```

**Flagged Scope:**
```sql
-- Cases visible to fraud officer
WHERE cases.fraud_risk_level IN ('HIGH', 'CRITICAL')
```

**Own Scope (Citizen):**
```sql
-- Cases visible to citizen
WHERE cases.citizen_id = (
  SELECT id FROM citizens WHERE portal_user_id = auth.uid()
)
```

---

## 7. Special Access Rules

### 7.1 Cross-Resource Access

| Primary Resource | Linked Resource | Access Rule |
|------------------|-----------------|-------------|
| cases | documents | If can read case, can read its documents |
| cases | eligibility_evaluations | If can read case, can read its evaluations |
| cases | case_events | If can read case, can read its events |
| cases | payments | If can read case, can read its payments |
| citizens | cases | If can read citizen, can read their cases |

### 7.2 Temporal Access

| Scenario | Rule |
|----------|------|
| Case closed > 30 days | Only AUDIT and SYS_ADMIN can read |
| Document expired | Visible but marked, cannot be used for eligibility |
| Payment processed | Read-only, no modifications |

### 7.3 Override Requirements

| Override Type | Minimum Role | Additional Requirements |
|---------------|--------------|------------------------|
| Eligibility override | CASE_REVIEWER | Written justification required |
| Fraud risk override | FRAUD | Supervisor approval required |
| Payment hold release | DEPT_HEAD | Finance countersign required |
| Case reopen | DEPT_HEAD | Justification and audit log |

---

## 8. Security Constraints

### 8.1 Role Storage

**CRITICAL:** Roles MUST be stored in a separate `user_roles` table, NOT on the `users` or `profiles` table.

```sql
CREATE TYPE app_role AS ENUM (
  'system_admin',
  'department_head',
  'district_intake_officer',
  'case_handler',
  'case_reviewer',
  'finance_officer',
  'fraud_officer',
  'audit'
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  granted_by UUID REFERENCES users(id),
  granted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
```

### 8.2 Role Check Function

```sql
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
```

### 8.3 Multi-Role Support

Users MAY have multiple roles:
- Each role grants additional permissions
- Most restrictive policy does NOT apply (union of permissions)
- Role combinations must be explicitly tested

---

## 9. Citizen Portal Access

### 9.1 Citizen Data Access

| Resource | Access Level | Filter |
|----------|--------------|--------|
| Own citizen record | Read, limited update | citizen_id from portal_user |
| Own cases | Read only | citizen_id match |
| Own documents | Create, read | case.citizen_id match |
| Own payments | Read only | case.citizen_id match |
| Own notifications | Read, mark read | citizen_id match |

### 9.2 Citizen Update Restrictions

Citizens can update:
- Contact information (phone, email)
- Address (requires verification)
- Notification preferences

Citizens CANNOT update:
- National ID
- Date of birth
- Name (requires official request)
- Household composition (via case update only)

---

## 10. Audit Requirements

### 10.1 Audit Trail for Access

All access to sensitive resources MUST be logged:

| Field | Description |
|-------|-------------|
| timestamp | When access occurred |
| user_id | Who accessed |
| resource_type | What was accessed |
| resource_id | Specific record |
| action | What action was taken |
| ip_address | Hashed IP |
| success | Whether access was granted |

### 10.2 Access Denial Logging

Failed access attempts MUST be logged with:
- Attempted resource
- Attempted action
- Denial reason
- User context

---

## 11. Phase 7 RLS Implementation Notes

### 11.1 Policy Naming Convention

```
{table}_{role}_{action}_policy
```

Examples:
- `cases_handler_select_policy`
- `documents_citizen_insert_policy`
- `payments_finance_update_policy`

### 11.2 Policy Priority

1. AUDIT role policies (read-only overlay)
2. Role-specific policies
3. Scope filters
4. Cross-resource policies

### 11.3 Testing Requirements

Before deployment, Phase 7 MUST include:
- Unit tests for each policy
- Role combination tests
- Negative tests (access denial)
- Performance tests

---

## 12. Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Phase 6 | System | Initial pre-model specification |

---

## 13. Open Items

| Item | Type | Owner | Status |
|------|------|-------|--------|
| Multi-district access rules | Policy | Ministry | Requires Clarification |
| Supervisor override workflow | Policy | Department | Requires Clarification |
| Data retention impact on access | Legal | Legal Dept | Requires Clarification |
| Citizen data portability | Legal | Legal Dept | Requires Clarification |
