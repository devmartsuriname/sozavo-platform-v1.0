# SoZaVo Platform v1.0 – Role Permission Matrix

> **Version:** 1.0  
> **Phase:** 7 – RLS Security & Authorization Layer  
> **Status:** Specification Document  
> **Cross-References:** RLS-Policy-Specification.md, RLS-Expression-Map.md

---

## 1. Overview

This document provides the complete role-by-resource-by-action permission table for the SoZaVo Platform.

---

## 2. Permission Matrix Legend

| Symbol | Meaning |
|--------|---------|
| ✓ | Full access |
| ○ | Conditional access (see notes) |
| ◐ | Limited access (subset of data) |
| - | No access |

---

## 3. Citizens Table Permissions

| Role | SELECT | INSERT | UPDATE | DELETE | Conditional Predicates | Workflow State | Notes |
|------|--------|--------|--------|--------|------------------------|----------------|-------|
| citizen | ○ | - | ○ | - | portal_user_id = auth.uid() | Any | Own record only, contact fields only for update |
| district_intake_officer | ○ | ✓ | - | - | district_id = current_user_district() | Any | District scope |
| case_handler | ○ | ✓ | ○ | - | citizen_id in assigned cases | Any | Case-related citizens only |
| case_reviewer | ○ | - | - | - | citizen_id in review queue cases | under_review | Review scope only |
| department_head | ○ | - | - | - | district_id in dept scope | Any | Department oversight |
| finance_officer | ○ | - | - | - | citizen_id in payment cases | approved+ | Payment-related |
| fraud_officer | ○ | - | - | - | citizen_id in flagged cases | Any | Flagged cases only |
| system_admin | ✓ | ✓ | ✓ | ✓ | None | Any | Full access |
| audit_viewer | ✓ | - | - | - | None | Any | Read-only |

---

## 4. Cases Table Permissions

| Role | SELECT | INSERT | UPDATE | DELETE | Conditional Predicates | Workflow State | Notes |
|------|--------|--------|--------|--------|------------------------|----------------|-------|
| citizen | ○ | - | - | - | citizen_id → portal_user_id | Any | Own cases only |
| district_intake_officer | ○ | ✓ | ○ | - | intake_office district match | intake | District, intake status only |
| case_handler | ○ | ✓ | ○ | - | case_handler_id = current_user | Not closed | Assigned cases, status transitions |
| case_reviewer | ○ | - | ○ | - | current_status = under_review | under_review | Approve/reject actions |
| department_head | ○ | - | ○ | - | office district in dept scope | Any | Override capability |
| finance_officer | ○ | - | - | - | status in payment statuses | approved+ | View only |
| fraud_officer | ○ | - | ○ | - | fraud_risk_level HIGH/CRITICAL | Any | Flag and hold actions |
| system_admin | ✓ | ✓ | ✓ | ✓ | None | Any | Full access |
| audit_viewer | ✓ | - | - | - | None | Any | Read-only |

---

## 5. Case Events Table Permissions

| Role | SELECT | INSERT | UPDATE | DELETE | Conditional Predicates | Workflow State | Notes |
|------|--------|--------|--------|--------|------------------------|----------------|-------|
| citizen | ○ | - | - | - | case access inheritance | Any | Own case events |
| district_intake_officer | ○ | ○ | - | - | case access inheritance | Any | District cases |
| case_handler | ○ | ✓ | - | - | case access inheritance | Any | Assigned cases |
| case_reviewer | ○ | ✓ | - | - | case access inheritance | under_review | Review actions |
| department_head | ○ | ✓ | - | - | case access inheritance | Any | Department |
| finance_officer | ○ | ✓ | - | - | case access inheritance | approved+ | Payment events |
| fraud_officer | ○ | ✓ | - | - | case access inheritance | Any | Fraud events |
| system_admin | ✓ | ✓ | - | - | None | Any | Append-only |
| audit_viewer | ✓ | - | - | - | None | Any | Read-only |

---

## 6. Eligibility Evaluations Table Permissions

| Role | SELECT | INSERT | UPDATE | DELETE | Conditional Predicates | Workflow State | Notes |
|------|--------|--------|--------|--------|------------------------|----------------|-------|
| citizen | ○ | - | - | - | case access inheritance | Any | Own evaluations |
| district_intake_officer | - | - | - | - | - | - | No access |
| case_handler | ○ | ✓ | ○ | - | assigned case | Before under_review | Locked after review |
| case_reviewer | ○ | - | - | - | review queue | under_review | View only |
| department_head | ○ | - | ○ | - | dept scope | Any | Override capability |
| finance_officer | - | - | - | - | - | - | No access |
| fraud_officer | ○ | - | - | - | flagged cases | Any | Investigation view |
| system_admin | ✓ | ✓ | ✓ | ✓ | None | Any | Full access |
| audit_viewer | ✓ | - | - | - | None | Any | Read-only |

---

## 7. Documents Table Permissions

| Role | SELECT | INSERT | UPDATE | DELETE | Conditional Predicates | Workflow State | Notes |
|------|--------|--------|--------|--------|------------------------|----------------|-------|
| citizen | ○ | ○ | - | - | case access inheritance | intake-elig | Own case docs, early stages |
| district_intake_officer | ○ | ✓ | - | - | district cases | Any | District upload |
| case_handler | ○ | ✓ | ○ | - | assigned cases | Any | Verify status |
| case_reviewer | ○ | - | ○ | - | review queue | under_review | Verify status |
| department_head | ○ | - | ○ | - | dept scope | Any | Verify status |
| finance_officer | ○ | - | - | - | payment cases | approved+ | View for validation |
| fraud_officer | ○ | - | - | - | flagged cases | Any | Investigation view |
| system_admin | ✓ | ✓ | ✓ | ✓ | None | Any | Full access |
| audit_viewer | ✓ | - | - | - | None | Any | Read-only |

---

## 8. Payments Table Permissions

| Role | SELECT | INSERT | UPDATE | DELETE | Conditional Predicates | Workflow State | Notes |
|------|--------|--------|--------|--------|------------------------|----------------|-------|
| citizen | ○ | - | - | - | case access inheritance | Any | Own payments |
| district_intake_officer | - | - | - | - | - | - | No access |
| case_handler | ○ | - | - | - | assigned cases | Any | View only |
| case_reviewer | ○ | - | - | - | review queue | Any | View only |
| department_head | ○ | - | - | - | dept scope | Any | View only |
| finance_officer | ✓ | ✓ | ○ | - | None | Before processed | Locked after processing |
| fraud_officer | ○ | - | - | - | flagged cases | Any | Investigation view |
| system_admin | ✓ | ✓ | ✓ | ✓ | None | Any | Full access |
| audit_viewer | ✓ | - | - | - | None | Any | Read-only |

---

## 9. Payment Batches Table Permissions

| Role | SELECT | INSERT | UPDATE | DELETE | Conditional Predicates | Workflow State | Notes |
|------|--------|--------|--------|--------|------------------------|----------------|-------|
| citizen | - | - | - | - | - | - | No access |
| district_intake_officer | - | - | - | - | - | - | No access |
| case_handler | - | - | - | - | - | - | No access |
| case_reviewer | - | - | - | - | - | - | No access |
| department_head | ✓ | - | - | - | None | Any | View only |
| finance_officer | ✓ | ✓ | ✓ | - | None | Any | Full except delete |
| fraud_officer | - | - | - | - | - | - | No access |
| system_admin | ✓ | ✓ | ✓ | ✓ | None | Any | Full access |
| audit_viewer | ✓ | - | - | - | None | Any | Read-only |

---

## 10. Payment Items Table Permissions

| Role | SELECT | INSERT | UPDATE | DELETE | Conditional Predicates | Workflow State | Notes |
|------|--------|--------|--------|--------|------------------------|----------------|-------|
| citizen | - | - | - | - | - | - | No access |
| district_intake_officer | - | - | - | - | - | - | No access |
| case_handler | - | - | - | - | - | - | No access |
| case_reviewer | - | - | - | - | - | - | No access |
| department_head | ✓ | - | - | - | None | Any | View only |
| finance_officer | ✓ | ✓ | ✓ | - | None | Any | Full except delete |
| fraud_officer | - | - | - | - | - | - | No access |
| system_admin | ✓ | ✓ | ✓ | ✓ | None | Any | Full access |
| audit_viewer | ✓ | - | - | - | None | Any | Read-only |

---

## 11. Fraud Signals Table Permissions

| Role | SELECT | INSERT | UPDATE | DELETE | Conditional Predicates | Workflow State | Notes |
|------|--------|--------|--------|--------|------------------------|----------------|-------|
| citizen | - | - | - | - | - | - | No access |
| district_intake_officer | - | - | - | - | - | - | No access |
| case_handler | - | - | - | - | - | - | No access |
| case_reviewer | - | - | - | - | - | - | No access |
| department_head | ✓ | - | - | - | None | Any | View only |
| finance_officer | - | - | - | - | - | - | No access |
| fraud_officer | ✓ | ✓ | ✓ | - | None | Any | Full except delete |
| system_admin | ✓ | ✓ | ✓ | ✓ | None | Any | Full access |
| audit_viewer | ✓ | - | - | - | None | Any | Read-only |

---

## 12. Fraud Risk Scores Table Permissions

| Role | SELECT | INSERT | UPDATE | DELETE | Conditional Predicates | Workflow State | Notes |
|------|--------|--------|--------|--------|------------------------|----------------|-------|
| citizen | - | - | - | - | - | - | No access |
| district_intake_officer | - | - | - | - | - | - | No access |
| case_handler | ◐ | - | - | - | assigned cases | Any | Risk level only, no details |
| case_reviewer | - | - | - | - | - | - | No access |
| department_head | ✓ | - | - | - | None | Any | View only |
| finance_officer | - | - | - | - | - | - | No access |
| fraud_officer | ✓ | ✓ | ○ | - | None | Any | Override requires justification |
| system_admin | ✓ | ✓ | ✓ | ✓ | None | Any | Full access |
| audit_viewer | ✓ | - | - | - | None | Any | Read-only |

---

## 13. Notifications Table Permissions

| Role | SELECT | INSERT | UPDATE | DELETE | Conditional Predicates | Workflow State | Notes |
|------|--------|--------|--------|--------|------------------------|----------------|-------|
| citizen | ○ | - | ○ | - | user_id = auth.uid() | Any | Own only, read_at only |
| district_intake_officer | ○ | - | ○ | - | user_id = auth.uid() | Any | Own only |
| case_handler | ○ | - | ○ | - | user_id = auth.uid() | Any | Own only |
| case_reviewer | ○ | - | ○ | - | user_id = auth.uid() | Any | Own only |
| department_head | ○ | - | ○ | - | user_id = auth.uid() | Any | Own only |
| finance_officer | ○ | - | ○ | - | user_id = auth.uid() | Any | Own only |
| fraud_officer | ○ | - | ○ | - | user_id = auth.uid() | Any | Own only |
| system_admin | ✓ | ✓ | ✓ | ✓ | None | Any | Full access |
| audit_viewer | - | - | - | - | - | - | No access |

---

## 14. Portal Notifications Table Permissions

| Role | SELECT | INSERT | UPDATE | DELETE | Conditional Predicates | Workflow State | Notes |
|------|--------|--------|--------|--------|------------------------|----------------|-------|
| citizen | ○ | - | ○ | - | citizen_id → portal_user_id | Any | Own only, read_at only |
| district_intake_officer | - | - | - | - | - | - | No access |
| case_handler | - | - | - | - | - | - | No access |
| case_reviewer | - | - | - | - | - | - | No access |
| department_head | - | - | - | - | - | - | No access |
| finance_officer | - | - | - | - | - | - | No access |
| fraud_officer | - | - | - | - | - | - | No access |
| system_admin | ✓ | ✓ | ✓ | ✓ | None | Any | Full access |
| audit_viewer | ✓ | - | - | - | None | Any | Read-only |

---

## 15. User Roles Table Permissions

| Role | SELECT | INSERT | UPDATE | DELETE | Conditional Predicates | Workflow State | Notes |
|------|--------|--------|--------|--------|------------------------|----------------|-------|
| citizen | ○ | - | - | - | user_id = auth.uid() | Any | Own role only |
| district_intake_officer | ○ | - | - | - | user_id = auth.uid() | Any | Own role only |
| case_handler | ○ | - | - | - | user_id = auth.uid() | Any | Own role only |
| case_reviewer | ○ | - | - | - | user_id = auth.uid() | Any | Own role only |
| department_head | ○ | ○ | - | - | dept scope | Any | Dept users only |
| finance_officer | ○ | - | - | - | user_id = auth.uid() | Any | Own role only |
| fraud_officer | ○ | - | - | - | user_id = auth.uid() | Any | Own role only |
| system_admin | ✓ | ✓ | ✓ | ✓ | None | Any | Full access |
| audit_viewer | ✓ | - | - | - | None | Any | Read-only |

---

## 16. Service Types Table Permissions (Low Sensitivity)

| Role | SELECT | INSERT | UPDATE | DELETE | Notes |
|------|--------|--------|--------|--------|-------|
| All authenticated | ✓ | - | - | - | Lookup data |
| system_admin | ✓ | ✓ | ✓ | ✓ | Configuration |

---

## 17. Offices Table Permissions (Low Sensitivity)

| Role | SELECT | INSERT | UPDATE | DELETE | Notes |
|------|--------|--------|--------|--------|-------|
| All authenticated | ✓ | - | - | - | Lookup data |
| system_admin | ✓ | ✓ | ✓ | ✓ | Configuration |

---

## 18. Document Requirements Table Permissions (Low Sensitivity)

| Role | SELECT | INSERT | UPDATE | DELETE | Notes |
|------|--------|--------|--------|--------|-------|
| All authenticated | ✓ | - | - | - | Configuration |
| system_admin | ✓ | ✓ | ✓ | ✓ | Configuration |

---

## 19. Eligibility Rules Table Permissions (Low Sensitivity)

| Role | SELECT | INSERT | UPDATE | DELETE | Notes |
|------|--------|--------|--------|--------|-------|
| All authenticated | ✓ | - | - | - | Configuration |
| system_admin | ✓ | ✓ | ✓ | ✓ | Configuration |

---

## 20. Notification Templates Table Permissions (Low Sensitivity)

| Role | SELECT | INSERT | UPDATE | DELETE | Notes |
|------|--------|--------|--------|--------|-------|
| Staff roles | ✓ | - | - | - | Staff read |
| system_admin | ✓ | ✓ | ✓ | ✓ | Configuration |

---

## 21. Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Phase 7 | System | Initial specification |
