# Admin MVP Scope
## SoZaVo Platform v1.0 — Phase 9

**Document Version**: 1.0  
**Phase**: 9 — Admin MVP Implementation Blueprint  
**Status**: Approved for Implementation  
**Last Updated**: 2025-01-XX

---

## 1. Overview

This document defines the **first shippable Admin MVP** for SoZaVo. It specifies which modules are in scope, their boundaries, and explicit non-goals to prevent scope creep during implementation.

The Admin MVP targets **internal ministry staff** (case handlers, reviewers, department heads, finance officers, fraud officers, system admins) and provides read-focused functionality with planned mutation support.

---

## 2. Core MVP Modules

### 2.1 Login & Role-Based Access Shell

**Description**: Authentication gate using Supabase Auth integrated with `user_roles` table. Renders role-aware navigation using Darkone Admin layout.

**Scope**:
- Sign-in form with email/password
- Role detection on login via `user_roles` table
- Role-based sidebar/navigation rendering
- Session management (logout, session persistence)
- Access denied handling for unauthorized routes

**Non-Goals**:
- No citizen portal login (separate system)
- No social auth providers (email/password only for MVP)
- No password reset flow in MVP (planned for Phase 10+)
- No multi-factor authentication
- No user registration (admin-created accounts only)

**PRD Requirements**: REQ-SEC-001, REQ-SEC-002, REQ-ADM-001  
**Architecture Sections**: 5.1 Authentication Layer, 22.2 Role-Based Access  
**RLS Roles Required**: All roles (authentication gate)

---

### 2.2 Case Search & Overview

**Description**: Paginated, filterable list of cases with role-aware scoping. Handlers see their assigned cases, reviewers see department cases, department heads see all department cases.

**Scope**:
- Case list with columns: Case ID, Citizen Name, Service Type, Status, District, Created Date, Handler
- Filters: status, service_type, district/office, date range
- Sorting: by date, status, priority
- Pagination: 20/50/100 per page
- Quick search by case ID or citizen name
- Role-aware data scoping (RLS enforced)

**Non-Goals**:
- No case creation in Admin MVP (intake via portal only)
- No bulk actions
- No case assignment/reassignment
- No export functionality
- No saved filters/views

**PRD Requirements**: REQ-FUN-010, REQ-FUN-011, REQ-ADM-005  
**Architecture Sections**: 6.2 Case Management, 15.1 Query Layer  
**RLS Roles Required**: case_handler, case_reviewer, department_head, fraud_officer, system_admin

---

### 2.3 Case Detail & Timeline View

**Description**: Comprehensive single-case view showing header information, citizen summary, case events timeline, and status indicators for eligibility, fraud, and payments.

**Scope**:
- Case header card: Case ID, status badge, service type, priority indicator
- Citizen summary: Name, national ID (masked per role), contact info
- Case events timeline (`case_events` table) with event type icons
- Eligibility evaluation summary (outcome, score, date)
- Fraud flags overview (risk score, signal count)
- Payment status summary (if applicable)
- Document count indicator

**Non-Goals**:
- No inline editing of case data
- No status transitions (planned, documented for Phase 10)
- No case notes/comments creation
- No direct citizen communication

**PRD Requirements**: REQ-FUN-012, REQ-FUN-013, REQ-FUN-020  
**Architecture Sections**: 6.2 Case Management, 8.1 Event Sourcing  
**RLS Roles Required**: case_handler, case_reviewer, department_head, fraud_officer, system_admin

---

### 2.4 Intake & Eligibility Review Panel

**Description**: Combined read-only view showing wizard intake data, document checklist, and eligibility evaluation results including rules fired.

**Scope**:
- Wizard data display: All intake answers organized by wizard step
- Document checklist: Required vs received documents with verification status
- Eligibility evaluation details:
  - Overall outcome (eligible/ineligible/pending)
  - Individual rules fired with pass/fail indicators
  - Score breakdown
  - Rule version used
- Evaluation history (if re-evaluated)

**Non-Goals**:
- No wizard data editing
- No document verification toggle (planned for Phase 10)
- No manual eligibility override
- No re-evaluation trigger
- No eligibility rule editing

**PRD Requirements**: REQ-FUN-030, REQ-FUN-031, REQ-FUN-032, REQ-FUN-040  
**Architecture Sections**: 7.1 Eligibility Engine, 7.2 Wizard Engine  
**RLS Roles Required**: case_handler, case_reviewer, department_head

---

### 2.5 Documents Viewer

**Description**: Per-case document listing with metadata display and download capability. Role-based access controls applied per Document-Auth-Model.

**Scope**:
- Document list per case: filename, type, upload date, verification status
- Document type categorization (ID, income proof, residence, etc.)
- Download link (pre-signed URL or stub)
- Verification status indicator (pending, verified, rejected)
- Uploaded by indicator (citizen vs staff)

**Non-Goals**:
- No document upload in Admin MVP (citizen portal only)
- No document preview/viewer
- No document deletion
- No verification status toggle (planned for Phase 10)
- No document version management

**PRD Requirements**: REQ-FUN-050, REQ-FUN-051, REQ-SEC-010  
**Architecture Sections**: 9.1 Document Management, 22.4 Document Auth Model  
**RLS Roles Required**: case_handler, case_reviewer, department_head, fraud_officer

---

### 2.6 Payments Overview (Backoffice)

**Description**: Read-only view of payment batches and individual payment items with status filtering. Accessible to finance officers, fraud officers, and department heads.

**Scope**:
- Payment batches list: batch ID, creation date, status, total amount, item count
- Payment items within batch: case ID, citizen, amount, status, payment method
- Filters: batch status, date range, payment method
- Status indicators: pending, processing, completed, failed, reversed
- Summary statistics: total disbursed, pending, failed

**Non-Goals**:
- No payment batch creation
- No payment execution/trigger
- No Subema sync actions
- No payment reversal actions
- No payment method configuration

**PRD Requirements**: REQ-FUN-060, REQ-FUN-061, REQ-FIN-001  
**Architecture Sections**: 7.4 Payment Engine, 10.1 Payment Processing  
**RLS Roles Required**: finance_officer, fraud_officer, department_head, system_admin

---

### 2.7 Fraud & Risk Overview Dashboard

**Description**: Dashboard showing fraud signals and risk scores across cases. Provides visibility into flagged cases and risk distribution.

**Scope**:
- Fraud signals list: signal type, severity, case ID, detection date
- Risk scores by case: score value, risk tier (low/medium/high/critical)
- Filters: severity level, signal type, date range, risk tier
- Summary cards: total signals, high-risk cases, escalation pending
- Case link from fraud signal to case detail

**Non-Goals**:
- No fraud signal creation/editing
- No escalation workflow actions
- No fraud rule configuration
- No investigation notes
- No case lock/unlock actions

**PRD Requirements**: REQ-FUN-070, REQ-FUN-071, REQ-SEC-020  
**Architecture Sections**: 7.5 Fraud Engine, 11.1 Fraud Detection  
**RLS Roles Required**: fraud_officer, department_head, system_admin

---

### 2.8 Configuration Read-Only Panel

**Description**: Read-only visibility into system configuration for ministry leadership. Shows how the system is configured without allowing edits.

**Scope**:
- Service types list: name, description, active status
- Offices/districts list: name, code, region
- Eligibility rules summary: rule name, service type, version, effective date
- Workflow definitions: workflow name, states, transitions
- System metadata: engine versions, last config update

**Non-Goals**:
- No configuration editing
- No rule version management
- No workflow definition changes
- No office/district management
- No user management

**PRD Requirements**: REQ-ADM-010, REQ-ADM-011, REQ-GOV-001  
**Architecture Sections**: 12.1 Configuration Management, 14.1 Governance  
**RLS Roles Required**: department_head, system_admin, audit_viewer

---

## 3. Out-of-Scope for MVP

The following are **explicitly excluded** from Phase 9 Admin MVP:

### 3.1 Citizen-Facing Features
- ❌ Citizen portal UI
- ❌ Citizen self-service case tracking
- ❌ Citizen document upload interface
- ❌ Citizen notification preferences

### 3.2 External Integrations
- ❌ BIS (citizen records) live connectivity
- ❌ Subema (payment verification) live connectivity
- ❌ Email/SMS notification sending
- ❌ Third-party identity verification

### 3.3 Write Operations
- ❌ Payment processing execution
- ❌ Case status transitions
- ❌ Document verification actions
- ❌ Fraud escalation workflows
- ❌ Case assignment/reassignment
- ❌ Eligibility override actions

### 3.4 Configuration Management
- ❌ Eligibility rule editing
- ❌ Workflow definition changes
- ❌ Fraud rule configuration
- ❌ User/role management
- ❌ Office/district management

### 3.5 Advanced Features
- ❌ Multi-language UI (Dutch/Papiamento/English)
- ❌ Notification template editing
- ❌ Audit log viewer
- ❌ Reporting/analytics dashboards
- ❌ Data export functionality
- ❌ Bulk operations

---

## 4. Module-to-Requirements Mapping

| Module | PRD Requirements | Architecture Sections | Primary Roles |
|--------|------------------|----------------------|---------------|
| Login & Role-Based Access Shell | REQ-SEC-001, REQ-SEC-002, REQ-ADM-001 | 5.1, 22.2 | All |
| Case Search & Overview | REQ-FUN-010, REQ-FUN-011, REQ-ADM-005 | 6.2, 15.1 | handler, reviewer, dept_head |
| Case Detail & Timeline View | REQ-FUN-012, REQ-FUN-013, REQ-FUN-020 | 6.2, 8.1 | handler, reviewer, dept_head, fraud |
| Intake & Eligibility Review Panel | REQ-FUN-030, REQ-FUN-031, REQ-FUN-032, REQ-FUN-040 | 7.1, 7.2 | handler, reviewer, dept_head |
| Documents Viewer | REQ-FUN-050, REQ-FUN-051, REQ-SEC-010 | 9.1, 22.4 | handler, reviewer, dept_head, fraud |
| Payments Overview | REQ-FUN-060, REQ-FUN-061, REQ-FIN-001 | 7.4, 10.1 | finance, fraud, dept_head, admin |
| Fraud & Risk Overview | REQ-FUN-070, REQ-FUN-071, REQ-SEC-020 | 7.5, 11.1 | fraud, dept_head, admin |
| Configuration Panel | REQ-ADM-010, REQ-ADM-011, REQ-GOV-001 | 12.1, 14.1 | dept_head, admin, audit_viewer |

---

## 5. Success Criteria

The Admin MVP is considered complete when:

1. **Authentication**: Staff can log in and see role-appropriate navigation
2. **Case Visibility**: Authorized users can search, filter, and view cases
3. **Case Detail**: Full case information displayed with timeline
4. **Eligibility Review**: Intake data and evaluation results visible
5. **Documents**: Document list displayed with metadata
6. **Payments**: Payment batches and items visible to finance roles
7. **Fraud**: Fraud signals and risk scores visible to fraud roles
8. **Configuration**: System configuration visible to leadership

All features must respect RLS policies as defined in `/docs/RLS-Policy-Definitions.md`.

---

## 6. Implementation Dependencies

| Dependency | Required For | Status |
|------------|--------------|--------|
| Supabase Auth configured | All modules | Ready |
| `user_roles` table with RLS | All modules | Schema defined |
| `cases` table with RLS | Modules 2, 3, 4, 5, 6, 7 | Schema defined |
| `case_events` table with RLS | Module 3 | Schema defined |
| `eligibility_evaluations` table | Module 4 | Schema defined |
| `documents` table with RLS | Module 5 | Schema defined |
| `payment_batches`, `payment_items` tables | Module 6 | Schema defined |
| `fraud_signals`, `fraud_risk_scores` tables | Module 7 | Schema defined |
| `service_types`, `offices` tables | Module 8 | Schema defined |
| Darkone Admin template integrated | All modules | Available |

---

## 7. Phase Progression

After Phase 9 MVP:

- **Phase 10**: Add write operations (status transitions, document verification)
- **Phase 11**: Add workflow actions (assignment, escalation)
- **Phase 12**: Add payment execution integration
- **Phase 13**: Add external system connectivity (BIS, Subema stubs)
- **Phase 14+**: Citizen portal, notifications, advanced features

---

*End of Admin-MVP-Scope.md*
