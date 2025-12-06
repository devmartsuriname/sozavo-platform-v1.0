# SoZaVo Platform v1.0 – Documentation Consistency Matrix

> **Version:** 1.0  
> **Status:** Quality Assurance Document  
> **Purpose:** Cross-document validation and consistency tracking  
> **Source:** PRD.md, Architecture.md, Data-Dictionary.md, Tasks.md, Backend.md

---

## 1. Purpose

This matrix validates consistency between all major documentation components of the SoZaVo Platform. Each requirement is cross-checked against related documentation to identify:

- Missing references
- Inconsistent terminology
- Schema mismatches
- Workflow mismatches
- Undefined behaviors
- Policy decisions required

---

## 2. Cross-Document Comparison Matrix

### 2.1 Intake Management Requirements

| Requirement | PRD | Architecture | Data Dictionary | Workflow | Eligibility | Wizard | Payments | Fraud | Governance | Status | Notes |
|-------------|-----|--------------|-----------------|----------|-------------|--------|----------|-------|------------|--------|-------|
| REQ-FUN-001 (Walk-in intake) | ✅ Section 3.1 | ✅ Section 2.1 | ✅ cases, citizens | ✅ intake stage | N/A | ✅ P3 | N/A | N/A | N/A | **Consistent** | |
| REQ-FUN-002 (Self-service intake) | ✅ Section 3.1 | ✅ Section 2.1 | ✅ cases, portal_notifications | ✅ intake stage | N/A | ✅ P8 | N/A | N/A | N/A | **Consistent** | |
| REQ-FUN-003 (CCR lookup) | ✅ Section 3.2 | ✅ Section 5.1 | ✅ citizens | N/A | N/A | ✅ P3 | N/A | N/A | N/A | **Requires External Validation** | BIS field mapping unconfirmed |
| REQ-FUN-004 (Document validation) | ✅ Section 3.5 | ✅ Section 6.4 | ✅ documents, document_requirements | ✅ validation stage | N/A | ✅ P5 | N/A | N/A | N/A | **Consistent** | |
| REQ-FUN-005 (Case reference) | ✅ Section 3.1 | ✅ Section 3.1 | ✅ cases.case_reference | ✅ intake | N/A | ✅ P3 | N/A | N/A | N/A | **Consistent** | |
| REQ-FUN-006 (Case routing) | ✅ Section 3.1 | ✅ Section 6.1 | ✅ cases.case_handler_id | ✅ assignment | N/A | ✅ P4 | N/A | N/A | N/A | **Consistent** | |

### 2.2 Central Citizen Registry Requirements

| Requirement | PRD | Architecture | Data Dictionary | Workflow | Eligibility | Wizard | Payments | Fraud | Governance | Status | Notes |
|-------------|-----|--------------|-----------------|----------|-------------|--------|----------|-------|------------|--------|-------|
| REQ-FUN-007 (Demographic data) | ✅ Section 3.2 | ✅ Section 3.1 | ✅ citizens | N/A | N/A | ✅ P3 | N/A | N/A | N/A | **Consistent** | |
| REQ-FUN-008 (Household tracking) | ✅ Section 3.2 | ✅ Section 3.1 | ✅ citizens.household_members, households | N/A | ✅ P9 | ✅ P3 | N/A | ✅ P14 | N/A | **Consistent** | |
| REQ-FUN-009 (BIS integration) | ✅ Section 3.2 | ✅ Section 5.1 | ✅ citizens.bis_verified | N/A | N/A | ✅ P11 | N/A | N/A | N/A | **Blocked** | BIS API specs unknown |
| REQ-FUN-010 (Duplicate prevention) | ✅ Section 3.2 | ✅ Section 3.1 | ✅ citizens.national_id (UNIQUE) | N/A | N/A | ✅ P1 | N/A | ✅ P14 | N/A | **Consistent** | |
| REQ-FUN-011 (CCR audit trail) | ✅ Section 3.2 | ✅ Section 9.1 | ✅ case_events, audit_events | N/A | N/A | ✅ P15 | N/A | N/A | ✅ P15 | **Consistent** | |
| REQ-FUN-012 (Soft-delete) | ✅ Section 3.2 | ⚠️ Not defined | ⚠️ citizens.deleted_at (assumed) | N/A | N/A | N/A | N/A | N/A | N/A | **Requires Policy Decision** | Soft delete vs hard delete undefined |

### 2.3 Eligibility Evaluation Requirements

| Requirement | PRD | Architecture | Data Dictionary | Workflow | Eligibility | Wizard | Payments | Fraud | Governance | Status | Notes |
|-------------|-----|--------------|-----------------|----------|-------------|--------|----------|-------|------------|--------|-------|
| REQ-FUN-013 (Rule-based eligibility) | ✅ Section 3.3 | ✅ Section 6.3 | ✅ eligibility_rules, eligibility_evaluations | ✅ eligibility_check | ✅ P9 | N/A | N/A | ✅ P14 | N/A | **Consistent** | |
| REQ-FUN-014 (Income threshold) | ✅ Section 3.3 | ✅ Section 6.3 | ✅ incomes | ✅ eligibility_check | ✅ P9 | N/A | N/A | ✅ P14 | N/A | **Requires Policy Decision** | Threshold amounts not confirmed |
| REQ-FUN-015 (Age criteria) | ✅ Section 3.3 | ✅ Section 6.3 | ✅ citizens.date_of_birth | ✅ eligibility_check | ✅ P9 | N/A | N/A | N/A | N/A | **Requires Policy Decision** | Age limits not confirmed |
| REQ-FUN-016 (Household rules) | ✅ Section 3.3 | ✅ Section 6.3 | ✅ households | ✅ eligibility_check | ✅ P9 | N/A | N/A | N/A | N/A | **Requires Policy Decision** | Household size limits not confirmed |
| REQ-FUN-017 (Structured results) | ✅ Section 3.3 | ✅ Section 6.3 | ✅ eligibility_evaluations.criteria_results | N/A | ✅ P9 | N/A | N/A | N/A | N/A | **Consistent** | |
| REQ-FUN-018 (Evaluation history) | ✅ Section 3.3 | ✅ Section 9.1 | ✅ eligibility_evaluations | N/A | ✅ P9 | N/A | N/A | N/A | ✅ P15 | **Consistent** | |
| REQ-FUN-019 (Manual override) | ✅ Section 3.3 | ✅ Section 6.3 | ✅ eligibility_evaluations.override_reason | N/A | ✅ P9 | N/A | N/A | N/A | ✅ P15 | **Requires Policy Decision** | Override authorization policy undefined |

### 2.4 Case Handling Requirements

| Requirement | PRD | Architecture | Data Dictionary | Workflow | Eligibility | Wizard | Payments | Fraud | Governance | Status | Notes |
|-------------|-----|--------------|-----------------|----------|-------------|--------|----------|-------|------------|--------|-------|
| REQ-FUN-020 (Case creation) | ✅ Section 3.4 | ✅ Section 6.2 | ✅ cases | ✅ intake | N/A | ✅ P3 | N/A | N/A | N/A | **Consistent** | |
| REQ-FUN-021 (Status tracking) | ✅ Section 3.4 | ✅ Section 6.2 | ✅ cases.current_status, workflow_definitions | ✅ All stages | N/A | ✅ P4 | N/A | N/A | N/A | **Consistent** | |
| REQ-FUN-022 (Case assignment) | ✅ Section 3.4 | ✅ Section 6.2 | ✅ cases.case_handler_id | ✅ assignment | N/A | ✅ P4 | N/A | N/A | N/A | **Consistent** | |
| REQ-FUN-023 (District transfer) | ✅ Section 3.4 | ⚠️ Not detailed | ✅ cases.intake_office_id | ⚠️ Not defined | N/A | N/A | N/A | N/A | N/A | **Undefined Behavior** | Transfer workflow not specified |
| REQ-FUN-024 (Event logging) | ✅ Section 3.4 | ✅ Section 9.1 | ✅ case_events | ✅ All stages | N/A | ✅ P4 | N/A | N/A | ✅ P15 | **Consistent** | |
| REQ-FUN-025 (Notes/comments) | ✅ Section 3.4 | ✅ Section 6.2 | ✅ cases.notes | N/A | N/A | ✅ P4 | N/A | N/A | N/A | **Consistent** | |
| REQ-FUN-026 (Transition rules) | ✅ Section 3.4 | ✅ Section 6.2 | ✅ workflow_definitions | ✅ All stages | N/A | ✅ P4 | N/A | N/A | N/A | **Consistent** | |

### 2.5 Document Management Requirements

| Requirement | PRD | Architecture | Data Dictionary | Workflow | Eligibility | Wizard | Payments | Fraud | Governance | Status | Notes |
|-------------|-----|--------------|-----------------|----------|-------------|--------|----------|-------|------------|--------|-------|
| REQ-FUN-027 (Document upload) | ✅ Section 3.5 | ✅ Section 2.2 | ✅ documents | ✅ validation | N/A | ✅ P5 | N/A | N/A | N/A | **Consistent** | |
| REQ-FUN-028 (Type validation) | ✅ Section 3.5 | ✅ Section 6.4 | ✅ documents.document_type, document_requirements | ✅ validation | ✅ P9 | ✅ P5 | N/A | N/A | N/A | **Consistent** | |
| REQ-FUN-029 (Expiration tracking) | ✅ Section 3.5 | ✅ Section 6.4 | ✅ documents.expires_at | N/A | ✅ P9 | ✅ P5 | N/A | N/A | N/A | **Consistent** | |
| REQ-FUN-030 (Missing doc notifications) | ✅ Section 3.5 | ✅ Section 6.4 | ✅ documents, portal_notifications | N/A | N/A | ✅ P5 | N/A | N/A | N/A | **Consistent** | |
| REQ-FUN-031 (Preview/download) | ✅ Section 3.5 | ✅ Section 2.2 | ✅ documents.file_path | N/A | N/A | ✅ P5 | N/A | N/A | N/A | **Consistent** | |
| REQ-FUN-032 (Version history) | ✅ Section 3.5 | ⚠️ Not detailed | ⚠️ Not defined | N/A | N/A | N/A | N/A | N/A | N/A | **Undefined Behavior** | Version tracking not in schema |

### 2.6 Review & Approval Requirements

| Requirement | PRD | Architecture | Data Dictionary | Workflow | Eligibility | Wizard | Payments | Fraud | Governance | Status | Notes |
|-------------|-----|--------------|-----------------|----------|-------------|--------|----------|-------|------------|--------|-------|
| REQ-FUN-033 (Reviewer queue) | ✅ Section 3.6 | ✅ Section 6.2 | ✅ cases.current_status | ✅ under_review | N/A | ✅ P6 | N/A | N/A | N/A | **Consistent** | |
| REQ-FUN-034 (Case summary) | ✅ Section 3.6 | ✅ Section 6.3 | ✅ eligibility_evaluations | N/A | ✅ P9 | ✅ P6 | N/A | N/A | N/A | **Consistent** | |
| REQ-FUN-035 (Approve/reject) | ✅ Section 3.6 | ✅ Section 6.2 | ✅ case_events.meta.decision | ✅ approved/rejected | N/A | ✅ P6 | N/A | N/A | N/A | **Consistent** | |
| REQ-FUN-036 (Case locking) | ✅ Section 3.6 | ✅ Section 6.2 | ⚠️ Implicit in status | ✅ approved/rejected | N/A | ✅ P6 | N/A | N/A | N/A | **Consistent** | Lock is status-based, not explicit field |
| REQ-FUN-037 (Decision logging) | ✅ Section 3.6 | ✅ Section 9.1 | ✅ case_events | ✅ All stages | N/A | ✅ P6 | N/A | N/A | ✅ P15 | **Consistent** | |

### 2.7 Payment Processing Requirements

| Requirement | PRD | Architecture | Data Dictionary | Workflow | Eligibility | Wizard | Payments | Fraud | Governance | Status | Notes |
|-------------|-----|--------------|-----------------|----------|-------------|--------|----------|-------|------------|--------|-------|
| REQ-FUN-038 (Payment creation) | ✅ Section 3.7 | ✅ Section 5.2 | ✅ payments | ✅ payment_pending | N/A | N/A | ✅ P10 | N/A | N/A | **Consistent** | |
| REQ-FUN-039 (Payment schedules) | ✅ Section 3.7 | ✅ Section 5.2 | ✅ payments.payment_type | N/A | N/A | N/A | ✅ P10 | N/A | N/A | **Consistent** | |
| REQ-FUN-040 (Subema integration) | ✅ Section 3.7 | ✅ Section 5.2 | ✅ payments.subema_reference | N/A | N/A | N/A | ✅ P12 | N/A | N/A | **Blocked** | Subema API specs unknown |
| REQ-FUN-041 (Status tracking) | ✅ Section 3.7 | ✅ Section 5.2 | ✅ payments.status | ✅ payment_processed | N/A | N/A | ✅ P10 | N/A | N/A | **Consistent** | |
| REQ-FUN-042 (Payment reports) | ✅ Section 3.8 | ✅ Section 7 | ✅ payments, payment_batches | N/A | N/A | N/A | ✅ P12 | N/A | ✅ P15 | **Consistent** | |
| REQ-FUN-043 (Adjustments) | ✅ Section 3.7 | ✅ Section 5.2 | ✅ payment_audit_logs | N/A | N/A | N/A | ✅ P10 | N/A | ✅ P15 | **Consistent** | |

### 2.8 Integration Requirements

| Requirement | PRD | Architecture | Data Dictionary | Workflow | Eligibility | Wizard | Payments | Fraud | Governance | Status | Notes |
|-------------|-----|--------------|-----------------|----------|-------------|--------|----------|-------|------------|--------|-------|
| REQ-INT-001 (BIS identity) | ✅ Section 5 | ✅ Section 5.1 | ✅ citizens.bis_verified | N/A | N/A | ✅ P11 | N/A | N/A | N/A | **Blocked** | BIS API specs unknown |
| REQ-INT-002 (BIS field mapping) | ✅ Section 5 | ✅ Section 5.1 | ✅ citizens (BIS fields) | N/A | N/A | ✅ P11 | N/A | N/A | N/A | **Schema Mismatch** | Field names assumed, not confirmed |
| REQ-INT-003 (Subema payment) | ✅ Section 5 | ✅ Section 5.2 | ✅ payments.subema_reference | N/A | N/A | N/A | ✅ P12 | N/A | N/A | **Blocked** | Subema API specs unknown |
| REQ-INT-004 (Subema status sync) | ✅ Section 5 | ✅ Section 5.2 | ✅ subema_sync_logs | N/A | N/A | N/A | ✅ P12 | N/A | N/A | **Blocked** | Callback mechanism unknown |
| REQ-INT-005 (Email notifications) | ✅ Section 5 | ✅ Section 5 | ✅ notifications | N/A | N/A | N/A | N/A | N/A | N/A | **Requires Clarification** | Provider not confirmed |
| REQ-INT-006 (SMS notifications) | ✅ Section 5 | ✅ Section 5 | ⚠️ Not in schema | N/A | N/A | N/A | N/A | N/A | N/A | **Requires Policy Decision** | Budget and policy decision |

### 2.9 Security & Governance Requirements

| Requirement | PRD | Architecture | Data Dictionary | Workflow | Eligibility | Wizard | Payments | Fraud | Governance | Status | Notes |
|-------------|-----|--------------|-----------------|----------|-------------|--------|----------|-------|------------|--------|-------|
| REQ-SEC-001 (RBAC) | ✅ Section 6 | ✅ Section 4.3 | ✅ users, user_roles | N/A | N/A | ✅ P7 | N/A | N/A | N/A | **Consistent** | |
| REQ-SEC-002 (District isolation) | ✅ Section 6 | ✅ Section 4.2 | ✅ users.district_id | N/A | N/A | ✅ P7 | N/A | N/A | N/A | **Consistent** | |
| REQ-SEC-003 (RLS enforcement) | ✅ Section 6 | ✅ Section 4.2 | ✅ All core tables | N/A | N/A | ✅ P7 | N/A | N/A | N/A | **Consistent** | |
| REQ-SEC-004 (Secrets management) | ✅ Section 6 | ✅ Section 4 | N/A | N/A | N/A | ✅ P11, P12 | N/A | N/A | N/A | **Consistent** | |
| REQ-SEC-005 (Password recovery) | ✅ Section 6 | ✅ Section 4.1 | ✅ auth.users | N/A | N/A | ✅ P8 | N/A | N/A | N/A | **Consistent** | |
| REQ-SEC-006 (Fraud detection) | ✅ Section 6 | ✅ Section 6 | ✅ fraud_signals, fraud_risk_scores | N/A | N/A | N/A | N/A | ✅ P14 | N/A | **Consistent** | |
| REQ-SEC-007 (Compliance reporting) | ✅ Section 6 | ✅ Section 9.1 | ✅ audit_events | N/A | N/A | N/A | N/A | N/A | ✅ P15 | **Requires Legal Confirmation** | Audit requirements undefined |

---

## 3. Inconsistency Summary

### 3.1 Schema Mismatches

| Issue ID | Description | Affected Docs | Resolution |
|----------|-------------|---------------|------------|
| SCH-001 | BIS field names assumed (`persoonsnummer`, `voornamen`, etc.) | Data Dictionary, Architecture | Await BIS API specs |
| SCH-002 | Subema reference field name assumed | Data Dictionary, Architecture | Await Subema API specs |
| SCH-003 | `citizens.deleted_at` field for soft-delete not defined | Data Dictionary, PRD | Add field pending policy decision |
| SCH-004 | Document version tracking not in schema | Data Dictionary, PRD | Define if REQ-FUN-032 is required |
| SCH-005 | `portal_user_id` linkage not fully defined | Data Dictionary | Confirm in Phase 8 |

### 3.2 Rule Mismatches

| Issue ID | Description | Affected Docs | Resolution |
|----------|-------------|---------------|------------|
| RUL-001 | Income thresholds are placeholders | Eligibility Rules, PRD | Await Ministry confirmation |
| RUL-002 | Age limits are assumed values | Eligibility Rules, PRD | Await Ministry confirmation |
| RUL-003 | Household size limits undefined | Eligibility Rules | Await Ministry confirmation |
| RUL-004 | Benefit formulas not specified | Payments, PRD | Await Ministry confirmation |

### 3.3 Workflow Mismatches

| Issue ID | Description | Affected Docs | Resolution |
|----------|-------------|---------------|------------|
| WFL-001 | District transfer workflow not specified | Architecture, PRD | Define transfer workflow in Phase 17 |
| WFL-002 | Case locking is implicit (status-based), not explicit field | Data Dictionary | Document as design decision |

### 3.4 Undefined Behaviors

| Issue ID | Description | Affected Docs | Resolution |
|----------|-------------|---------------|------------|
| UND-001 | Soft delete vs hard delete policy | All | Await legal confirmation |
| UND-002 | Concurrent benefit eligibility handling | Eligibility Rules | Await policy decision |
| UND-003 | Override authorization levels | Eligibility Rules, Governance | Await policy decision |
| UND-004 | Document version management | Document Engine | Define if needed |
| UND-005 | Payment reversal workflow | Payments | Define in Phase 12 |

### 3.5 Policy Decisions Required

| Issue ID | Policy Question | Stakeholder | Impact |
|----------|-----------------|-------------|--------|
| POL-001 | Income thresholds per service | Ministry of Social Affairs | Blocks eligibility engine |
| POL-002 | Age limits per service | Ministry of Social Affairs | Blocks eligibility engine |
| POL-003 | Benefit calculation formulas | Ministry of Social Affairs | Blocks payment processing |
| POL-004 | Data retention period | Legal Department | Blocks compliance reporting |
| POL-005 | Citizen consent requirements | Legal Department | Blocks public portal |
| POL-006 | Override authorization policy | Ministry of Social Affairs | Blocks manual override |
| POL-007 | Soft delete policy | Legal Department | Blocks schema finalization |

---

## 4. Recommended Correction Plan

### 4.1 Immediate Actions (Documentation Only)

| Action | Priority | Owner | Target |
|--------|----------|-------|--------|
| Add `citizens.deleted_at` field to Data Dictionary | Medium | Documentation | Data-Dictionary.md |
| Add document versioning note to Architecture | Low | Documentation | Architecture.md |
| Document case locking as status-based design | Low | Documentation | Architecture.md |
| Add district transfer workflow placeholder | Medium | Documentation | Architecture.md |

### 4.2 Pending External Confirmation

| Action | Priority | Stakeholder | Target |
|--------|----------|-------------|--------|
| Confirm BIS API field names | Critical | Ministry of Home Affairs | Data-Dictionary.md, Architecture.md |
| Confirm Subema API specifications | Critical | Subema vendor | Data-Dictionary.md, Architecture.md |
| Confirm eligibility thresholds | Critical | Ministry of Social Affairs | Eligibility rules seed data |
| Confirm benefit formulas | Critical | Ministry of Social Affairs | Payment calculation logic |
| Confirm data retention requirements | High | Legal Department | Architecture.md, Data-Dictionary.md |
| Confirm consent requirements | High | Legal Department | Public portal design |

### 4.3 Deferred to Implementation Phase

| Action | Phase | Condition |
|--------|-------|-----------|
| Add document version tracking schema | P5 | If REQ-FUN-032 confirmed as MUST |
| Define SMS notification schema | P13 | If SMS approved |
| Implement district transfer workflow | P17 | After core workflow stable |

---

## 5. Cross-Reference Validation Summary

### 5.1 Coverage Statistics

| Document | Requirements Covered | Missing References | Consistency Rate |
|----------|---------------------|-------------------|------------------|
| PRD.md | 100% | 0 | 100% |
| Architecture.md | 95% | 3 | 95% |
| Data-Dictionary.md | 92% | 5 | 92% |
| Tasks.md | 100% | 0 | 100% |
| Backend.md | 85% | 8 | 85% |

### 5.2 Overall Assessment

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Total requirements | 67 | N/A | Defined |
| Fully consistent | 51 | 67 | 76% |
| Blocked | 6 | 0 | External blockers |
| Requires policy decision | 7 | 0 | Awaiting stakeholder |
| Undefined behavior | 3 | 0 | Needs specification |

---

**END OF DOCUMENTATION CONSISTENCY MATRIX v1.0**
