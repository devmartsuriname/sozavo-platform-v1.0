# SoZaVo Platform v1.0 – Product Requirements Document (PRD)

> **Version:** 2.0 (Consolidated & Traceable)  
> **Status:** Authoritative Reference Document  
> **Source:** Synthesized from sozavo_prd_v_2_en.md and Phase Documents 1–29  
> **Cross-References:** Architecture.md, Data-Dictionary.md, Tasks.md, Backend.md

---

## Document Index

| Section | Title | Requirement Category |
|---------|-------|---------------------|
| 1 | Executive Summary | Overview |
| 2 | Core Service Types | Business Context |
| 3 | Functional Requirements | REQ-FUN-### |
| 4 | Non-Functional Requirements | REQ-NFR-### |
| 5 | Integration Requirements | REQ-INT-### |
| 6 | Security & Governance Requirements | REQ-SEC-### |
| 7 | Data Requirements | REQ-DAT-### |
| 8 | Citizen Experience Requirements | REQ-CIT-### |
| 9 | Admin/Backoffice Requirements | REQ-ADM-### |
| 10 | Traceability Matrix | Cross-References |
| 11 | Workflow Definitions | Process |
| 12 | External Integrations | Dependencies |
| 13 | MVP vs Extended Scope | Phasing |
| 14 | Constraints & Assumptions | Boundaries |

---

## 1. Executive Summary

### 1.1 Product Vision
SoZaVo Platform v1.0 is a centralized digital system for the Ministry of Social Affairs and Housing (SoZaVo) of Suriname. It consolidates intake, eligibility evaluation, case management, document handling, payment processing, and reporting for social services across all 10 districts.

### 1.2 Business Goals
- Digitize and standardize social service delivery nationwide
- Reduce fraud through centralized citizen registry and eligibility rules
- Improve operational efficiency with automated workflows
- Enable real-time reporting and oversight for leadership
- Provide citizens transparent access to application status

### 1.3 Target Users

| Role | Description | Architecture Ref |
|------|-------------|------------------|
| Citizen | Applicants for social services via public portal | Section 2.1 |
| District Intake Officer | Receives and registers new applications | Section 4.3 |
| Case Handler | Processes cases, evaluates eligibility, manages documents | Section 4.3 |
| Case Reviewer | Reviews and approves/rejects cases | Section 4.3 |
| Department Head | Oversees department operations and reporting | Section 4.3 |
| System Admin | Manages system configuration, users, and permissions | Section 4.3 |
| Audit | Read-only access for compliance verification | Section 4.3 |

---

## 2. Core Service Types

SoZaVo Platform supports three primary social services in MVP:

### 2.1 Algemene Bijstand (General Assistance) – AB
- **Purpose:** Financial support for citizens in temporary hardship
- **Eligibility:** Income-based, asset evaluation, household composition
- **Payment:** One-time or short-term recurring
- **Data Dictionary:** `service_types` (code: 'AB')
- **Workflow:** Standard case workflow

### 2.2 Financiële Bijstand (Social Assistance) – FB
- **Purpose:** Ongoing financial support for citizens unable to work
- **Eligibility:** Medical certification, age requirements, income thresholds
- **Payment:** Monthly recurring payments
- **Data Dictionary:** `service_types` (code: 'FB')
- **Workflow:** Standard case workflow with medical verification

### 2.3 Kinderbijslag (Child Allowance) – KB
- **Purpose:** Financial support for families with children
- **Eligibility:** Child age limits, school enrollment verification, income thresholds
- **Payment:** Monthly per qualifying child
- **Data Dictionary:** `service_types` (code: 'KB')
- **Workflow:** Standard case workflow with child verification

---

## 3. Functional Requirements

### 3.1 Intake Management

| Req ID | Requirement | Priority | Data Dictionary | Architecture | Tasks.md | Status |
|--------|-------------|----------|-----------------|--------------|----------|--------|
| REQ-FUN-001 | Support walk-in intake at district offices | MUST | cases, citizens | Section 2.1 | P3-001 to P3-015 | Defined |
| REQ-FUN-002 | Support self-service intake via public portal | MUST | cases, portal_notifications | Section 2.1 | P8-001 to P8-010 | Defined |
| REQ-FUN-003 | Capture citizen identity via CCR lookup or manual entry | MUST | citizens | Section 3.1 | P3-003, P3-004 | Defined |
| REQ-FUN-004 | Validate required documents at intake | MUST | documents, document_requirements | Section 6.4 | P5-001 to P5-009 | Defined |
| REQ-FUN-005 | Generate unique case reference numbers | MUST | cases.case_reference | Section 3.1 | P3-012 | Defined |
| REQ-FUN-006 | Route cases to appropriate handlers based on service type | MUST | cases.case_handler_id | Section 6.1 | P4-006 | Defined |

### 3.2 Central Citizen Registry (CCR)

| Req ID | Requirement | Priority | Data Dictionary | Architecture | Tasks.md | Status |
|--------|-------------|----------|-----------------|--------------|----------|--------|
| REQ-FUN-007 | Store citizen demographic data (name, DOB, address, national ID) | MUST | citizens | Section 3.1 | P1-003 | Defined |
| REQ-FUN-008 | Track household composition and relationships | MUST | citizens.household_members, households | Section 3.1 | P3-007 | Defined |
| REQ-FUN-009 | Integrate with BIS (Civil Registry) for data validation | MUST | citizens.bis_verified | Section 5.1 | P11-001 to P11-006 | **Blocked** |
| REQ-FUN-010 | Prevent duplicate citizen records | MUST | citizens.national_id (UNIQUE) | Section 3.1 | P1-003 | Defined |
| REQ-FUN-011 | Maintain audit trail of all CCR modifications | MUST | case_events, audit_events | Section 9.1 | P1-006, P15-001 | Defined |
| REQ-FUN-012 | Support soft-delete for deceased citizens | SHOULD | citizens.deleted_at | Section 3.1 | TBD | **Requires Clarification** |

### 3.3 Eligibility Evaluation

| Req ID | Requirement | Priority | Data Dictionary | Architecture | Tasks.md | Status |
|--------|-------------|----------|-----------------|--------------|----------|--------|
| REQ-FUN-013 | Evaluate eligibility based on service-specific rules | MUST | eligibility_rules, eligibility_evaluations | Section 6.3 | P9-001 to P9-008 | Defined |
| REQ-FUN-014 | Support income threshold validation | MUST | incomes, eligibility_rules | Section 6.3 | P9-001 | **Requires Policy Decision** |
| REQ-FUN-015 | Support age-based eligibility criteria | MUST | citizens.date_of_birth (derived: age_years) | Section 6.3 | P9-002 | **Requires Policy Decision** |
| REQ-FUN-016 | Support household composition rules | MUST | households, citizens.household_members | Section 6.3 | P9-003 | **Requires Policy Decision** |
| REQ-FUN-017 | Generate structured eligibility results (pass/fail per criterion) | MUST | eligibility_evaluations.criteria_results | Section 6.3 | P9-006 | Defined |
| REQ-FUN-018 | Store evaluation history for audit purposes | MUST | eligibility_evaluations | Section 6.3 | P9-007 | Defined |
| REQ-FUN-019 | Allow manual override with justification | MUST | eligibility_evaluations.override_reason | Section 6.3 | P9-008 | **Requires Policy Decision** |

### 3.4 Case Handling

| Req ID | Requirement | Priority | Data Dictionary | Architecture | Tasks.md | Status |
|--------|-------------|----------|-----------------|--------------|----------|--------|
| REQ-FUN-020 | Support case creation from intake wizard | MUST | cases, cases.wizard_data | Section 6.2 | P3-012 | Defined |
| REQ-FUN-021 | Track case status through defined workflow stages | MUST | cases.current_status, workflow_definitions | Section 6.2 | P4-001 to P4-004 | Defined |
| REQ-FUN-022 | Support case assignment to handlers | MUST | cases.case_handler_id | Section 6.2 | P4-006 | Defined |
| REQ-FUN-023 | Enable case transfers between districts | SHOULD | cases.intake_office_id | Section 6.2 | TBD | Defined |
| REQ-FUN-024 | Log all case events in audit trail | MUST | case_events | Section 6.2 | P4-004 | Defined |
| REQ-FUN-025 | Support case comments and internal notes | SHOULD | cases.notes, case_events.meta | Section 6.2 | P4-006 | Defined |
| REQ-FUN-026 | Enforce status transition rules per workflow definition | MUST | workflow_definitions | Section 6.2 | P4-001, P4-002 | Defined |

### 3.5 Document Management

| Req ID | Requirement | Priority | Data Dictionary | Architecture | Tasks.md | Status |
|--------|-------------|----------|-----------------|--------------|----------|--------|
| REQ-FUN-027 | Support document upload during intake and case processing | MUST | documents | Section 2.2 | P5-005 | Defined |
| REQ-FUN-028 | Validate document types against service requirements | MUST | documents.document_type, document_requirements | Section 6.4 | P5-001, P5-002 | Defined |
| REQ-FUN-029 | Track document expiration dates | MUST | documents.expires_at | Section 6.4 | P5-003 | Defined |
| REQ-FUN-030 | Generate missing document notifications | MUST | documents, portal_notifications | Section 6.4 | P5-004 | Defined |
| REQ-FUN-031 | Support document preview and download | SHOULD | documents.file_path | Section 2.2 | P5-005 | Defined |
| REQ-FUN-032 | Maintain document version history | COULD | documents | Section 6.4 | TBD | Defined |

### 3.6 Review & Approval

| Req ID | Requirement | Priority | Data Dictionary | Architecture | Tasks.md | Status |
|--------|-------------|----------|-----------------|--------------|----------|--------|
| REQ-FUN-033 | Route eligible cases to reviewer queue | MUST | cases.current_status = 'under_review' | Section 6.2 | P4-007 | Defined |
| REQ-FUN-034 | Display case summary with eligibility results | MUST | eligibility_evaluations, cases | Section 6.3 | P6-001 | Defined |
| REQ-FUN-035 | Support approve/reject actions with required comments | MUST | case_events.meta.decision | Section 6.2 | P4-008, P4-009 | Defined |
| REQ-FUN-036 | Lock approved/rejected cases from further editing | MUST | cases.current_status | Section 6.2 | P4-010 | Defined |
| REQ-FUN-037 | Log review decisions in case history | MUST | case_events | Section 6.2 | P4-004 | Defined |

### 3.7 Payment Processing

| Req ID | Requirement | Priority | Data Dictionary | Architecture | Tasks.md | Status |
|--------|-------------|----------|-----------------|--------------|----------|--------|
| REQ-FUN-038 | Create payment records for approved cases | MUST | payments | Section 5.2 | P10-001 | Defined |
| REQ-FUN-039 | Support one-time and recurring payment schedules | MUST | payments.payment_type | Section 5.2 | P10-002 | Defined |
| REQ-FUN-040 | Integrate with Subema payment system | MUST | payments.subema_reference, subema_sync_logs | Section 5.2 | P12-001 to P12-006 | **Blocked** |
| REQ-FUN-041 | Track payment status (pending, processed, failed) | MUST | payments.status | Section 5.2 | P10-003 | Defined |
| REQ-FUN-042 | Generate payment reports by period and district | MUST | payments, payment_batches | Section 7 | P6-005 | Defined |
| REQ-FUN-043 | Support payment adjustments and corrections | SHOULD | payments, payment_audit_logs | Section 5.2 | P10-005 | Defined |

### 3.8 Analytics & Reporting

| Req ID | Requirement | Priority | Data Dictionary | Architecture | Tasks.md | Status |
|--------|-------------|----------|-----------------|--------------|----------|--------|
| REQ-FUN-044 | Dashboard showing KPIs (active cases, pending reviews, processing times) | MUST | Derived: avg_processing_time_days | Section 7 | P6-002 to P6-005 | Defined |
| REQ-FUN-045 | Cases by status breakdown | MUST | cases.current_status | Section 7 | P6-003 | Defined |
| REQ-FUN-046 | Cases by service type breakdown | MUST | cases.service_type_id | Section 7 | P6-004 | Defined |
| REQ-FUN-047 | District performance reports | MUST | cases.intake_office_id, offices | Section 7 | P6-007 | Defined |
| REQ-FUN-048 | Monthly service reports with totals | MUST | cases, payments | Section 7 | P6-006 | Defined |
| REQ-FUN-049 | Export reports to CSV format | MUST | N/A | Section 7 | P6-009 | Defined |
| REQ-FUN-050 | Filter reports by date range, service, district | MUST | N/A | Section 7 | P6-006 | Defined |

---

## 4. Non-Functional Requirements

### 4.1 Security

| Req ID | Requirement | Priority | Architecture | Tasks.md | Status |
|--------|-------------|----------|--------------|----------|--------|
| REQ-NFR-001 | All data access controlled by RLS policies | MUST | Section 4.2 | P7-001 to P7-014 | Defined |
| REQ-NFR-002 | Authentication required for all operations | MUST | Section 4.1 | P2-003 | Defined |
| REQ-NFR-003 | Sensitive data encrypted at rest | MUST | Section 4 | N/A (Supabase) | Defined |
| REQ-NFR-004 | Audit logging for all data modifications | MUST | Section 9.1 | P15-001, P15-002 | Defined |
| REQ-NFR-005 | Session timeout enforcement | MUST | Section 4.1 | P2-003 | Defined |

### 4.2 Performance

| Req ID | Requirement | Priority | Architecture | Tasks.md | Status |
|--------|-------------|----------|--------------|----------|--------|
| REQ-NFR-006 | Page load under 3 seconds | MUST | Section 9.3 | P16-003 | Defined |
| REQ-NFR-007 | Report generation under 10 seconds | SHOULD | Section 9.3 | P16-001 | Defined |
| REQ-NFR-008 | Support 100 concurrent users | MUST | Section 9.3 | P16-002 | Defined |
| REQ-NFR-009 | Pagination for large data sets | MUST | Section 9.3 | P6-011 | Defined |

### 4.3 Availability

| Req ID | Requirement | Priority | Architecture | Tasks.md | Status |
|--------|-------------|----------|--------------|----------|--------|
| REQ-NFR-010 | 99% uptime during business hours | MUST | Section 8 | P21-001 | Defined |
| REQ-NFR-011 | Graceful degradation for external system outages | MUST | Section 13 | P11-004, P12-004 | Defined |

### 4.4 Compliance

| Req ID | Requirement | Priority | Architecture | Tasks.md | Status |
|--------|-------------|----------|--------------|----------|--------|
| REQ-NFR-012 | Data retention per government regulations | MUST | Section 9.1 | P15-003 | **Requires Legal Confirmation** |
| REQ-NFR-013 | GDPR-equivalent privacy protections | MUST | Section 4 | P15-004 | **Requires Legal Confirmation** |
| REQ-NFR-014 | Complete audit trail maintenance | MUST | Section 9.1 | P15-001 | Defined |

### 4.5 Usability

| Req ID | Requirement | Priority | Architecture | Tasks.md | Status |
|--------|-------------|----------|--------------|----------|--------|
| REQ-NFR-015 | Responsive design for desktop and tablet | MUST | Section 2.1 | All UI phases | Defined |
| REQ-NFR-016 | Dutch and English language support | SHOULD | Section 2.1 | P18-001 | Defined |
| REQ-NFR-017 | Accessible form design | SHOULD | Section 2.1 | All UI phases | Defined |

---

## 5. Integration Requirements

| Req ID | Requirement | Priority | Data Dictionary | Architecture | Tasks.md | Status |
|--------|-------------|----------|-----------------|--------------|----------|--------|
| REQ-INT-001 | BIS API integration for citizen identity verification | MUST | citizens.bis_verified | Section 5.1 | P11-001 | **Blocked – BIS API specs unknown** |
| REQ-INT-002 | BIS field mapping for CCR synchronization | MUST | citizens (all BIS fields) | Section 5.1 | P11-002 | **Blocked – BIS field names assumed** |
| REQ-INT-003 | Subema API integration for payment submission | MUST | payments.subema_reference | Section 5.2 | P12-001 | **Blocked – Subema API specs unknown** |
| REQ-INT-004 | Subema payment status synchronization | MUST | payments.status, subema_sync_logs | Section 5.2 | P12-003 | **Blocked – Subema callback mechanism unknown** |
| REQ-INT-005 | Email notification service integration | SHOULD | notifications | Section 5 | P13-002 | **Requires Provider Confirmation** |
| REQ-INT-006 | SMS notification service integration | COULD | notifications | Section 5 | P13-003 | **Requires Policy Decision** |

---

## 6. Security & Governance Requirements

| Req ID | Requirement | Priority | Data Dictionary | Architecture | Tasks.md | Status |
|--------|-------------|----------|-----------------|--------------|----------|--------|
| REQ-SEC-001 | Role-based access control (RBAC) | MUST | users, user_roles | Section 4.3 | P7-007 | Defined |
| REQ-SEC-002 | District-based data isolation | MUST | users.district_id, offices | Section 4.2 | P7-008 to P7-011 | Defined |
| REQ-SEC-003 | Row-level security enforcement | MUST | All core tables | Section 4.2 | P7-001 to P7-006 | Defined |
| REQ-SEC-004 | Secrets management for API keys | MUST | N/A (Supabase secrets) | Section 4 | P11-005, P12-005, P13-005 | Defined |
| REQ-SEC-005 | Password recovery workflow | MUST | auth.users | Section 4.1 | P8-001 | Defined |
| REQ-SEC-006 | Fraud detection and alerting | SHOULD | fraud_signals, fraud_risk_scores | Section 6 | P14-001 to P14-005 | Defined |
| REQ-SEC-007 | Compliance reporting | MUST | audit_events | Section 9.1 | P15-002, P15-004 | **Requires Legal Confirmation** |

---

## 7. Data Requirements

| Req ID | Requirement | Priority | Data Dictionary | Architecture | Tasks.md | Status |
|--------|-------------|----------|-----------------|--------------|----------|--------|
| REQ-DAT-001 | Central Citizen Registry as single source of truth | MUST | citizens | Section 3.1 | P1-003 | Defined |
| REQ-DAT-002 | Case data with full wizard submission storage | MUST | cases.wizard_data | Section 3.1 | P3-011 | Defined |
| REQ-DAT-003 | Household composition tracking | MUST | households, citizens.household_members | Section 3.1 | P3-007 | Defined |
| REQ-DAT-004 | Income records for eligibility | MUST | incomes | Section 3.1 | P3-008 | Defined |
| REQ-DAT-005 | Document metadata and storage references | MUST | documents | Section 3.1 | P1-007 | Defined |
| REQ-DAT-006 | Payment records with external system references | MUST | payments, payment_batches, payment_items | Section 3.1 | P1-012 | Defined |
| REQ-DAT-007 | Audit event logging for compliance | MUST | audit_events, case_events | Section 3.1 | P1-006 | Defined |

---

## 8. Citizen Experience Requirements

| Req ID | Requirement | Priority | Data Dictionary | Architecture | Tasks.md | Status |
|--------|-------------|----------|-----------------|--------------|----------|--------|
| REQ-CIT-001 | Citizen registration with email/password | MUST | auth.users, citizens.portal_user_id | Section 2.1 | P8-002 | Defined |
| REQ-CIT-002 | Secure citizen login | MUST | auth.users | Section 2.1 | P8-003 | Defined |
| REQ-CIT-003 | Service application wizard | MUST | cases.wizard_data | Section 2.1 | P8-005 | Defined |
| REQ-CIT-004 | Document upload capability | MUST | documents | Section 2.1 | P8-006 | Defined |
| REQ-CIT-005 | Application status tracking | MUST | cases.current_status (mapped labels) | Section 2.1 | P8-010 | Defined |
| REQ-CIT-006 | Notification display for updates | MUST | portal_notifications | Section 2.1 | P8-008 | Defined |
| REQ-CIT-007 | Human-readable status labels (not internal codes) | MUST | Status mapping in portalQueries | Section 2.1 | P8-009 | Defined |
| REQ-CIT-008 | Citizen consent tracking | MUST | citizens | Section 2.1 | TBD | **Requires Legal Confirmation** |

---

## 9. Admin/Backoffice Requirements

| Req ID | Requirement | Priority | Data Dictionary | Architecture | Tasks.md | Status |
|--------|-------------|----------|-----------------|--------------|----------|--------|
| REQ-ADM-001 | Staff authentication via Supabase Auth | MUST | users.auth_user_id | Section 4.1 | P2-003 | Defined |
| REQ-ADM-002 | Case list with filtering and search | MUST | cases | Section 2.1 | P4-011, P4-012 | Defined |
| REQ-ADM-003 | Case detail view with all related data | MUST | cases (joined) | Section 2.1 | P4-005 | Defined |
| REQ-ADM-004 | Reviewer workspace with decision panel | MUST | cases, eligibility_evaluations | Section 2.1 | P6-001 | Defined |
| REQ-ADM-005 | User management interface | MUST | users, user_roles | Section 2.1 | P2-004 | Defined |
| REQ-ADM-006 | System configuration management | SHOULD | service_types, eligibility_rules, workflow_definitions | Section 2.1 | TBD | Defined |

---

## 10. Traceability Matrix

### 10.1 Requirements → Data Fields

| Requirement | Primary Table(s) | Key Fields |
|-------------|------------------|------------|
| REQ-FUN-001 to REQ-FUN-006 | cases, citizens | case_reference, citizen_id, wizard_data |
| REQ-FUN-007 to REQ-FUN-012 | citizens, households | national_id, bis_verified, household_members |
| REQ-FUN-013 to REQ-FUN-019 | eligibility_rules, eligibility_evaluations | result, criteria_results, override_reason |
| REQ-FUN-020 to REQ-FUN-026 | cases, case_events, workflow_definitions | current_status, event_type, from_status, to_status |
| REQ-FUN-027 to REQ-FUN-032 | documents, document_requirements | document_type, status, expires_at |
| REQ-FUN-033 to REQ-FUN-037 | cases, case_events | current_status, meta.decision |
| REQ-FUN-038 to REQ-FUN-043 | payments, payment_batches, payment_items | amount, status, subema_reference |
| REQ-FUN-044 to REQ-FUN-050 | Derived fields | avg_processing_time_days, eligibility_pass_rate |

### 10.2 Requirements → Workflows

| Requirement | Workflow Stage(s) | Engine |
|-------------|-------------------|--------|
| REQ-FUN-001 to REQ-FUN-006 | intake → validation | Wizard Engine |
| REQ-FUN-013 to REQ-FUN-019 | eligibility_check | Eligibility Engine |
| REQ-FUN-020 to REQ-FUN-026 | All stages | Workflow Engine |
| REQ-FUN-027 to REQ-FUN-032 | validation | Document Engine |
| REQ-FUN-033 to REQ-FUN-037 | under_review → approved/rejected | Workflow Engine |
| REQ-FUN-038 to REQ-FUN-043 | approved → payment_pending → payment_processed | Payment Engine |
| REQ-SEC-006 | All stages | Fraud Engine |

### 10.3 Requirements → Eligibility Rules

| Requirement | Rule Type | eligibility_rules.rule_type |
|-------------|-----------|---------------------------|
| REQ-FUN-014 | Income threshold | income_threshold |
| REQ-FUN-015 | Age-based | age_range |
| REQ-FUN-016 | Household composition | household_size |
| REQ-FUN-028 | Document presence | document_presence |
| REQ-FUN-016 | Residency | residency |

### 10.4 Requirements → Blocked Tasks (Tasks.md)

| Requirement | Blocker Category | Tasks.md Reference |
|-------------|------------------|-------------------|
| REQ-FUN-009, REQ-INT-001, REQ-INT-002 | BIS Validation | P11-001 to P11-006 |
| REQ-FUN-040, REQ-INT-003, REQ-INT-004 | Subema Validation | P12-001 to P12-006 |
| REQ-FUN-014, REQ-FUN-015, REQ-FUN-016, REQ-FUN-019 | Ministerial Decision | POL-ELG-001 to POL-ELG-008 |
| REQ-NFR-012, REQ-NFR-013, REQ-SEC-007, REQ-CIT-008 | Legal/Compliance | P15-001 to P15-004 |

---

## 11. Workflow Definitions

### 11.1 Standard Case Workflow

```
intake → validation → eligibility_check → under_review → approved/rejected → payment_pending → payment_processed → closed
```

**Architecture Reference:** Section 6.2 (Workflow Architecture)

### 11.2 Status Definitions

| Status | Description | Data Dictionary |
|--------|-------------|-----------------|
| intake | Case created, initial data entry | case_status ENUM |
| validation | Documents and data being verified | case_status ENUM |
| eligibility_check | Eligibility evaluation in progress | case_status ENUM |
| under_review | Pending supervisor approval | case_status ENUM |
| approved | Case approved for payment | case_status ENUM |
| rejected | Case denied with reason | case_status ENUM |
| payment_pending | Awaiting payment processing | case_status ENUM |
| payment_processed | Payment issued | case_status ENUM |
| closed | Case completed | case_status ENUM |
| on_hold | Temporarily suspended | case_status ENUM |

### 11.3 Transition Rules

- Only valid transitions per `workflow_definitions` are allowed
- Transitions require appropriate role permissions (Architecture Section 4.3)
- All transitions logged in `case_events`

---

## 12. External Integrations

### 12.1 BIS (Burgelijke Informatiesysteem)

| Attribute | Value | Status |
|-----------|-------|--------|
| **Purpose** | Civil registry data validation | Defined |
| **Integration Type** | API lookup | **Blocked – specs unknown** |
| **Architecture Ref** | Section 5.1 | Defined |
| **Data Dictionary** | citizens.bis_verified, bis_person_id | Defined |
| **Tasks.md** | P11-001 to P11-006 | **Blocked** |

**Required Clarifications:**
- API endpoint URL
- Authentication method
- Field name mappings
- Rate limits
- Sandbox environment

### 12.2 Subema

| Attribute | Value | Status |
|-----------|-------|--------|
| **Purpose** | Payment processing system | Defined |
| **Integration Type** | API batch submission + status sync | **Blocked – specs unknown** |
| **Architecture Ref** | Section 5.2 | Defined |
| **Data Dictionary** | payments.subema_reference, subema_sync_logs | Defined |
| **Tasks.md** | P12-001 to P12-006 | **Blocked** |

**Required Clarifications:**
- API documentation
- Authentication method
- Batch submission payload
- Callback mechanism (webhook vs polling)
- Test environment

---

## 13. MVP vs Extended Scope

### 13.1 MVP (Phases 1–9)

| Phase | Scope | Requirements Covered |
|-------|-------|---------------------|
| Phase 1 | Database foundation | REQ-DAT-001 to REQ-DAT-007 |
| Phase 2 | Admin UI shell | REQ-ADM-001 to REQ-ADM-003 |
| Phase 3 | Intake wizard | REQ-FUN-001 to REQ-FUN-006 |
| Phase 4 | Case handling workflows | REQ-FUN-020 to REQ-FUN-026 |
| Phase 5 | Document management | REQ-FUN-027 to REQ-FUN-032 |
| Phase 6 | Review, reporting, dashboards | REQ-FUN-033 to REQ-FUN-050 |
| Phase 7 | Security (RLS) | REQ-NFR-001 to REQ-NFR-005, REQ-SEC-001 to REQ-SEC-003 |
| Phase 8 | Public portal foundation | REQ-CIT-001 to REQ-CIT-007 |
| Phase 9 | Extended eligibility engine | REQ-FUN-013 to REQ-FUN-019 |

### 13.2 Extended (Phases 10–17)

| Phase | Scope | Requirements Covered |
|-------|-------|---------------------|
| Phase 10 | Payment processing | REQ-FUN-038 to REQ-FUN-043 |
| Phase 11 | BIS integration | REQ-FUN-009, REQ-INT-001, REQ-INT-002 |
| Phase 12 | Subema integration | REQ-FUN-040, REQ-INT-003, REQ-INT-004 |
| Phase 13 | Advanced notifications | REQ-INT-005, REQ-INT-006 |
| Phase 14 | Fraud detection | REQ-SEC-006 |
| Phase 15 | Audit module | REQ-NFR-012 to REQ-NFR-014, REQ-SEC-007 |
| Phase 16 | Performance optimization | REQ-NFR-006 to REQ-NFR-009 |
| Phase 17 | Extended workflow automation | REQ-FUN-022, REQ-FUN-023 |

### 13.3 Strategic (Phases 18–29)

| Phase | Scope | Requirements Covered |
|-------|-------|---------------------|
| Phase 18 | Multi-language support | REQ-NFR-016 |
| Phase 19-23 | Performance, monitoring, DR | REQ-NFR-010 |
| Phase 24 | Reserved – Frontend HTML Template | N/A |
| Phase 25-29 | Advanced features | Future requirements |

---

## 14. Constraints & Assumptions

### 14.1 Constraints

- Must use existing database schema (no modifications without approval)
- Must follow defined workflow transitions
- Must respect role-based access controls
- Must maintain complete audit trail
- Must not expose internal statuses to citizens

### 14.2 Assumptions

| Assumption | Impact | Status |
|------------|--------|--------|
| BIS API will be available for integration | Blocks Phase 11 if unavailable | **Unconfirmed** |
| Subema API specifications will be provided | Blocks Phase 12 if unavailable | **Unconfirmed** |
| District offices have reliable internet connectivity | Performance | Assumed |
| Users have basic computer literacy | Training | Assumed |
| Legal framework for digital social services is in place | Compliance | **Requires Confirmation** |

### 14.3 Dependencies

| Dependency | Type | Impact | PRD Requirement | Tasks.md Blocker |
|------------|------|--------|-----------------|------------------|
| BIS API availability | External | Blocks CCR validation | REQ-FUN-009 | P11-001 |
| Subema API specifications | External | Blocks payment integration | REQ-FUN-040 | P12-001 |
| RLS policy deployment | Technical | Blocks security phase | REQ-NFR-001 | P7-001 |
| Supabase project provisioning | Technical | Blocks all backend | All REQ-DAT | P1-001 |
| Legal data retention rules | External | Blocks compliance | REQ-NFR-012 | P15-003 |
| Eligibility thresholds | Policy | Blocks eligibility engine | REQ-FUN-014 | P9-001 |
| Benefit formulas | Policy | Blocks payment calculation | REQ-FUN-038 | P10-001 |

---

**END OF CONSOLIDATED PRD v2.0**
