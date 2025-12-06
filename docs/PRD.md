# SoZaVo Platform v1.0 – Product Requirements Document (PRD)

> **Version:** 1.0 (Consolidated)  
> **Status:** Reference Document  
> **Source:** Synthesized from sozavo_prd_v_2_en.md and Phase Documents 1–29

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
| Role | Description |
|------|-------------|
| Citizen | Applicants for social services via public portal |
| District Intake Officer | Receives and registers new applications |
| Case Handler | Processes cases, evaluates eligibility, manages documents |
| Case Reviewer | Reviews and approves/rejects cases |
| Department Head | Oversees department operations and reporting |
| System Admin | Manages system configuration, users, and permissions |
| Audit | Read-only access for compliance verification |

---

## 2. Core Service Types

SoZaVo Platform supports three primary social services in MVP:

### 2.1 Algemene Bijstand (General Assistance)
- **Purpose:** Financial support for citizens in temporary hardship
- **Eligibility:** Income-based, asset evaluation, household composition
- **Payment:** One-time or short-term recurring

### 2.2 Financiële Bijstand (Social Assistance)
- **Purpose:** Ongoing financial support for citizens unable to work
- **Eligibility:** Medical certification, age requirements, income thresholds
- **Payment:** Monthly recurring payments

### 2.3 Kinderbijslag (Child Allowance)
- **Purpose:** Financial support for families with children
- **Eligibility:** Child age limits, school enrollment verification, income thresholds
- **Payment:** Monthly per qualifying child

---

## 3. Functional Domains

### 3.1 Intake Management
**Description:** Entry point for all social service applications.

**Requirements:**
- REQ-INT-001: Support walk-in intake at district offices
- REQ-INT-002: Support self-service intake via public portal
- REQ-INT-003: Capture citizen identity via CCR lookup or manual entry
- REQ-INT-004: Validate required documents at intake
- REQ-INT-005: Generate unique case reference numbers
- REQ-INT-006: Route cases to appropriate handlers based on service type

### 3.2 Central Citizen Registry (CCR)
**Description:** Unified citizen database serving as single source of truth.

**Requirements:**
- REQ-CCR-001: Store citizen demographic data (name, DOB, address, national ID)
- REQ-CCR-002: Track household composition and relationships
- REQ-CCR-003: Integrate with BIS (Civil Registry) for data validation
- REQ-CCR-004: Prevent duplicate citizen records
- REQ-CCR-005: Maintain audit trail of all CCR modifications
- REQ-CCR-006: Support soft-delete for deceased citizens

### 3.3 Eligibility Evaluation
**Description:** Rule-based assessment of citizen eligibility for services.

**Requirements:**
- REQ-ELI-001: Evaluate eligibility based on service-specific rules
- REQ-ELI-002: Support income threshold validation
- REQ-ELI-003: Support age-based eligibility criteria
- REQ-ELI-004: Support household composition rules
- REQ-ELI-005: Generate structured eligibility results (pass/fail per criterion)
- REQ-ELI-006: Store evaluation history for audit purposes
- REQ-ELI-007: Allow manual override with justification

### 3.4 Case Handling
**Description:** Workflow management for processing applications.

**Requirements:**
- REQ-CAS-001: Support case creation from intake wizard
- REQ-CAS-002: Track case status through defined workflow stages
- REQ-CAS-003: Support case assignment to handlers
- REQ-CAS-004: Enable case transfers between districts
- REQ-CAS-005: Log all case events in audit trail
- REQ-CAS-006: Support case comments and internal notes
- REQ-CAS-007: Enforce status transition rules per workflow definition

### 3.5 Document Management
**Description:** Upload, validation, and storage of supporting documents.

**Requirements:**
- REQ-DOC-001: Support document upload during intake and case processing
- REQ-DOC-002: Validate document types against service requirements
- REQ-DOC-003: Track document expiration dates
- REQ-DOC-004: Generate missing document notifications
- REQ-DOC-005: Support document preview and download
- REQ-DOC-006: Maintain document version history

### 3.6 Review & Approval
**Description:** Supervisory review of processed cases.

**Requirements:**
- REQ-REV-001: Route eligible cases to reviewer queue
- REQ-REV-002: Display case summary with eligibility results
- REQ-REV-003: Support approve/reject actions with required comments
- REQ-REV-004: Lock approved/rejected cases from further editing
- REQ-REV-005: Log review decisions in case history

### 3.7 Payment Processing
**Description:** Management of benefit disbursements.

**Requirements:**
- REQ-PAY-001: Create payment records for approved cases
- REQ-PAY-002: Support one-time and recurring payment schedules
- REQ-PAY-003: Integrate with Subema payment system
- REQ-PAY-004: Track payment status (pending, processed, failed)
- REQ-PAY-005: Generate payment reports by period and district
- REQ-PAY-006: Support payment adjustments and corrections

### 3.8 Analytics & Reporting
**Description:** Operational visibility and compliance reporting.

**Requirements:**
- REQ-RPT-001: Dashboard showing KPIs (active cases, pending reviews, processing times)
- REQ-RPT-002: Cases by status breakdown
- REQ-RPT-003: Cases by service type breakdown
- REQ-RPT-004: District performance reports
- REQ-RPT-005: Monthly service reports with totals
- REQ-RPT-006: Export reports to CSV format
- REQ-RPT-007: Filter reports by date range, service, district

### 3.9 Public Portal
**Description:** Citizen-facing interface for self-service applications.

**Requirements:**
- REQ-PRT-001: Citizen registration with email/password
- REQ-PRT-002: Secure citizen login
- REQ-PRT-003: Service application wizard
- REQ-PRT-004: Document upload capability
- REQ-PRT-005: Application status tracking
- REQ-PRT-006: Notification display for updates
- REQ-PRT-007: Human-readable status labels (not internal codes)

### 3.10 Notifications
**Description:** System-generated alerts and communications.

**Requirements:**
- REQ-NOT-001: Internal notifications for case assignments
- REQ-NOT-002: Internal notifications for status changes
- REQ-NOT-003: Portal notifications for citizens
- REQ-NOT-004: Mark notifications as read/unread
- REQ-NOT-005: Future: Email and SMS integration

### 3.11 User & Access Management
**Description:** Authentication, authorization, and role management.

**Requirements:**
- REQ-USR-001: User authentication via Supabase Auth
- REQ-USR-002: Role-based access control (RBAC)
- REQ-USR-003: District-based data isolation
- REQ-USR-004: Row-level security enforcement
- REQ-USR-005: Session management and secure logout
- REQ-USR-006: Password recovery workflow

---

## 4. Workflow Definitions

### 4.1 Standard Case Workflow
```
intake → validation → eligibility_check → under_review → approved/rejected → payment_pending → payment_processed → closed
```

### 4.2 Status Definitions
| Status | Description |
|--------|-------------|
| intake | Case created, initial data entry |
| validation | Documents and data being verified |
| eligibility_check | Eligibility evaluation in progress |
| under_review | Pending supervisor approval |
| approved | Case approved for payment |
| rejected | Case denied with reason |
| payment_pending | Awaiting payment processing |
| payment_processed | Payment issued |
| closed | Case completed |
| on_hold | Temporarily suspended |

### 4.3 Transition Rules
- Only valid transitions per workflow_definitions are allowed
- Transitions require appropriate role permissions
- All transitions logged in case_events

---

## 5. Data Entities

### 5.1 Core Entities
| Entity | Description |
|--------|-------------|
| citizens | Central citizen registry |
| cases | Service applications/cases |
| case_events | Audit trail of case actions |
| documents | Uploaded supporting documents |
| eligibility_evaluations | Eligibility check results |
| payments | Payment records |
| users | Internal system users |
| offices | District office locations |
| service_types | Service definitions |
| workflow_definitions | Status transition rules |

### 5.2 Supporting Entities
| Entity | Description |
|--------|-------------|
| eligibility_rules | Rule definitions per service |
| document_requirements | Required documents per service |
| notifications | System notifications |
| portal_notifications | Citizen-facing notifications |

---

## 6. External Integrations

### 6.1 BIS (Burgelijke Informatiesysteem)
- **Purpose:** Civil registry data validation
- **Integration:** API lookup for citizen verification
- **Data:** Name, DOB, address, family relations

### 6.2 Subema
- **Purpose:** Payment processing system
- **Integration:** Payment batch submission and status sync
- **Data:** Payment amounts, beneficiary details, transaction status

---

## 7. Non-Functional Requirements

### 7.1 Security
- NFR-SEC-001: All data access controlled by RLS policies
- NFR-SEC-002: Authentication required for all operations
- NFR-SEC-003: Sensitive data encrypted at rest
- NFR-SEC-004: Audit logging for all data modifications
- NFR-SEC-005: Session timeout enforcement

### 7.2 Performance
- NFR-PRF-001: Page load under 3 seconds
- NFR-PRF-002: Report generation under 10 seconds
- NFR-PRF-003: Support 100 concurrent users
- NFR-PRF-004: Pagination for large data sets

### 7.3 Availability
- NFR-AVL-001: 99% uptime during business hours
- NFR-AVL-002: Graceful degradation for external system outages

### 7.4 Compliance
- NFR-CMP-001: Data retention per government regulations
- NFR-CMP-002: GDPR-equivalent privacy protections
- NFR-CMP-003: Complete audit trail maintenance

### 7.5 Usability
- NFR-USB-001: Responsive design for desktop and tablet
- NFR-USB-002: Dutch and English language support
- NFR-USB-003: Accessible form design

---

## 8. MVP vs Extended Scope

### 8.1 MVP (Phases 1–9)
- Database foundation
- Admin UI shell
- Intake wizard
- Case handling workflows
- Document management
- Review and approval
- Dashboard and reporting
- Security (RLS)
- Public portal foundation

### 8.2 Extended (Phases 10–17)
- Payment processing
- BIS integration
- Subema integration
- Fraud detection
- Audit module
- Advanced workflows

### 8.3 Strategic (Phases 18–29)
- Multi-channel notifications
- Predictive analytics
- Performance optimization
- Citizen identity verification
- System monitoring
- Disaster recovery

---

## 9. Constraints

- Must use existing database schema (no modifications without approval)
- Must follow defined workflow transitions
- Must respect role-based access controls
- Must maintain complete audit trail
- Must not expose internal statuses to citizens

---

## 10. Assumptions

- BIS API will be available for integration
- Subema API specifications will be provided
- District offices have reliable internet connectivity
- Users have basic computer literacy
- Legal framework for digital social services is in place

---

## 11. Dependencies

| Dependency | Type | Impact |
|------------|------|--------|
| BIS API availability | External | Blocks CCR validation features |
| Subema API specifications | External | Blocks payment integration |
| RLS policy deployment | Technical | Blocks security phase completion |
| Supabase project provisioning | Technical | Blocks all backend features |

---

**END OF CONSOLIDATED PRD v1.0**
