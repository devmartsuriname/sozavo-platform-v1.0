# SoZaVo Platform v1.0 – System Architecture

> **Version:** 1.0 (Consolidated)  
> **Status:** Reference Document  
> **Source:** Synthesized from sozavo_technical_architecture_v_2_en.md, workflow_blueprint_v2, and Phase Documents

---

## 1. Architecture Overview

### 1.1 System Scope
SoZaVo Platform is a web-based social services management system consisting of:
- **Admin System:** Internal application for SoZaVo staff
- **Public Portal:** Citizen-facing application for self-service
- **Backend Services:** Database, authentication, storage, and edge functions
- **External Integrations:** BIS (Civil Registry) and Subema (Payments)

### 1.2 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              EXTERNAL SYSTEMS                                │
├──────────────────────────────┬──────────────────────────────────────────────┤
│         BIS (Civil Registry) │              Subema (Payments)               │
└──────────────────────────────┴──────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              EDGE FUNCTIONS                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ BIS Lookup   │ │ Subema Sync  │ │ Notification │ │ Report Gen   │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SUPABASE BACKEND                                │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ PostgreSQL   │ │ Auth         │ │ Storage      │ │ Realtime     │       │
│  │ Database     │ │ (JWT-based)  │ │ (Documents)  │ │ (Subscriptions)│     │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │                    ROW-LEVEL SECURITY (RLS)                       │       │
│  └──────────────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    ▼                                       ▼
┌─────────────────────────────────┐     ┌─────────────────────────────────────┐
│         ADMIN SYSTEM            │     │           PUBLIC PORTAL             │
│  ┌───────────────────────────┐  │     │  ┌───────────────────────────────┐  │
│  │ React SPA                 │  │     │  │ React SPA                     │  │
│  │ - Dashboard               │  │     │  │ - Registration/Login          │  │
│  │ - Case Management         │  │     │  │ - Application Wizard          │  │
│  │ - Citizen Registry        │  │     │  │ - Status Tracking             │  │
│  │ - Document Management     │  │     │  │ - Document Upload             │  │
│  │ - Reporting               │  │     │  │ - Notifications               │  │
│  │ - Review Workflows        │  │     │  └───────────────────────────────┘  │
│  └───────────────────────────┘  │     └─────────────────────────────────────┘
└─────────────────────────────────┘
         │                                              │
         └──────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   END USERS     │
                    │ - Staff         │
                    │ - Citizens      │
                    └─────────────────┘
```

---

## 2. Logical Components

### 2.1 Frontend Applications

#### Admin System
| Component | Purpose |
|-----------|---------|
| Dashboard | KPIs and operational overview |
| Case Management | Case list, detail, workflow actions |
| Citizen Registry | CCR search, view, edit |
| Intake Wizard | Multi-step application entry |
| Document Manager | Upload, validation, preview |
| Review Workspace | Approval/rejection workflows |
| Reporting | Analytics and exports |
| User Management | Staff accounts and roles |

#### Public Portal
| Component | Purpose |
|-----------|---------|
| Authentication | Registration, login, password recovery |
| Citizen Dashboard | Application overview and status |
| Application Wizard | Self-service intake form |
| Document Upload | Supporting document submission |
| Notifications | System messages and updates |

### 2.2 Backend Services

#### Database (PostgreSQL)
- Relational data storage
- Enforces data integrity via constraints
- Supports complex queries for reporting

#### Authentication (Supabase Auth)
- JWT-based authentication
- Separate user pools (internal vs citizens)
- Session management

#### Storage (Supabase Storage)
- Document file storage
- Access controlled by RLS
- Supports preview and download

#### Edge Functions
- Server-side logic execution
- External API integrations
- Scheduled tasks

---

## 3. Data Architecture

### 3.1 Core Data Model

```
┌───────────────────┐       ┌───────────────────┐
│   service_types   │       │      offices      │
│ - id              │       │ - id              │
│ - name            │       │ - district_id     │
│ - code            │       │ - name            │
└───────────────────┘       └───────────────────┘
         │                           │
         │                           │
         ▼                           ▼
┌───────────────────────────────────────────────────────────────┐
│                           cases                                │
│ - id                                                          │
│ - case_reference                                              │
│ - citizen_id (FK → citizens)                                  │
│ - service_type_id (FK → service_types)                        │
│ - current_status                                              │
│ - case_handler_id (FK → users)                                │
│ - intake_office_id (FK → offices)                             │
│ - created_at, updated_at                                      │
└───────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐
│  case_events    │  │   documents     │  │eligibility_evaluations│
│ - case_id       │  │ - case_id       │  │ - case_id            │
│ - event_type    │  │ - document_type │  │ - result             │
│ - actor_id      │  │ - file_path     │  │ - criteria_results   │
│ - meta (JSONB)  │  │ - status        │  │ - evaluated_at       │
└─────────────────┘  └─────────────────┘  └─────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                         citizens                               │
│ - id (CCR ID)                                                 │
│ - national_id                                                 │
│ - first_name, last_name                                       │
│ - date_of_birth                                               │
│ - address, district                                           │
│ - household_members (JSONB)                                   │
│ - bis_verified                                                │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                           users                                │
│ - id                                                          │
│ - auth_user_id (FK → auth.users)                              │
│ - role                                                        │
│ - office_id                                                   │
│ - district_id                                                 │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                        payments                                │
│ - id                                                          │
│ - case_id                                                     │
│ - amount                                                      │
│ - payment_date                                                │
│ - status                                                      │
│ - subema_reference                                            │
└───────────────────────────────────────────────────────────────┘
```

### 3.2 Supporting Tables

| Table | Purpose |
|-------|---------|
| workflow_definitions | Status transition rules per service |
| eligibility_rules | Eligibility criteria definitions |
| document_requirements | Required documents per service |
| notifications | Internal system notifications |
| portal_notifications | Citizen-facing notifications |

### 3.3 Enumerations

| Enum | Values |
|------|--------|
| case_status | intake, validation, eligibility_check, under_review, approved, rejected, payment_pending, payment_processed, closed, on_hold |
| document_type | id_card, income_proof, medical_certificate, birth_certificate, school_enrollment, etc. |
| document_status | pending, verified, rejected, expired |
| user_role | system_admin, district_intake_officer, case_handler, case_reviewer, department_head, audit |
| payment_status | pending, processed, failed |

---

## 4. Security Architecture

### 4.1 Authentication Flow

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  Client  │────▶│ Supabase Auth │────▶│ JWT Token    │
└──────────┘     └──────────────┘     └──────────────┘
                                              │
                                              ▼
                                      ┌──────────────┐
                                      │ API Requests │
                                      │ (with JWT)   │
                                      └──────────────┘
                                              │
                                              ▼
                                      ┌──────────────┐
                                      │ RLS Policies │
                                      │ (auth.uid()) │
                                      └──────────────┘
```

### 4.2 Row-Level Security (RLS)

RLS enforces data access at the database level:

| Table | Policy Summary |
|-------|----------------|
| citizens | Handlers see district citizens; reviewers see all; intake officers see own district |
| cases | Handlers see assigned cases; reviewers see cases under_review; district filter applied |
| documents | Access follows case access rules |
| eligibility_evaluations | Access follows case access rules |
| payments | Finance role required; district filter applied |

### 4.3 Role Permissions

| Role | Citizens | Cases | Documents | Payments | Reports | Users |
|------|----------|-------|-----------|----------|---------|-------|
| system_admin | CRUD | CRUD | CRUD | CRUD | Read | CRUD |
| district_intake_officer | Create/Read | Create | Create | - | - | - |
| case_handler | Read | Read/Update | CRUD | - | Read | - |
| case_reviewer | Read | Read/Update | Read | - | Read | - |
| department_head | Read | Read | Read | Read | Read | - |
| audit | Read | Read | Read | Read | Read | Read |

---

## 5. Integration Architecture

### 5.1 BIS Integration (Civil Registry)

**Purpose:** Validate citizen identity data against official records.

**Data Flow:**
```
┌────────────────┐     ┌──────────────┐     ┌─────────────┐
│ Admin/Portal   │────▶│ Edge Function │────▶│ BIS API     │
│ (Lookup Request)│    │ (bis-lookup)  │     │             │
└────────────────┘     └──────────────┘     └─────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │ CCR Update   │
                       │ (if verified)│
                       └──────────────┘
```

**Field Mapping (BIS → CCR):**
| BIS Field | CCR Field |
|-----------|-----------|
| persoonsnummer | national_id |
| voornamen | first_name |
| achternaam | last_name |
| geboortedatum | date_of_birth |
| adres | address |

### 5.2 Subema Integration (Payments)

**Purpose:** Process benefit payments to citizens.

**Data Flow:**
```
┌────────────────┐     ┌──────────────┐     ┌─────────────┐
│ Cases (approved)│───▶│ Edge Function │────▶│ Subema API  │
│                │     │ (subema-sync) │     │             │
└────────────────┘     └──────────────┘     └─────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │ Payment      │
                       │ Status Update│
                       └──────────────┘
```

**Sync Operations:**
- Submit payment batch
- Query payment status
- Handle payment failures

---

## 6. Workflow Architecture

### 6.1 Workflow Engine

The workflow engine manages case status transitions based on rules defined in `workflow_definitions`.

**Engine Responsibilities:**
- Validate transition is allowed for current status
- Verify actor has permission for transition
- Apply the transition (update case status)
- Log transition in case_events
- Trigger notifications if configured

### 6.2 Standard Workflow

```
     ┌─────────┐
     │ intake  │
     └────┬────┘
          │
          ▼
   ┌────────────┐
   │ validation │
   └──────┬─────┘
          │
          ▼
┌──────────────────┐
│ eligibility_check │
└─────────┬────────┘
          │
          ▼
   ┌─────────────┐
   │ under_review │
   └──────┬──────┘
          │
    ┌─────┴─────┐
    ▼           ▼
┌────────┐ ┌──────────┐
│approved│ │ rejected │
└───┬────┘ └──────────┘
    │
    ▼
┌─────────────────┐
│ payment_pending │
└────────┬────────┘
         │
         ▼
┌───────────────────┐
│ payment_processed │
└─────────┬─────────┘
          │
          ▼
     ┌────────┐
     │ closed │
     └────────┘
```

### 6.3 Eligibility Engine

Evaluates citizen eligibility against service-specific rules.

**Engine Responsibilities:**
- Load rules for service type from eligibility_rules
- Evaluate each criterion against citizen/case data
- Generate structured result with pass/fail per criterion
- Store evaluation in eligibility_evaluations
- Return overall eligibility verdict

**Rule Types:**
| Type | Description |
|------|-------------|
| income_threshold | Maximum income for eligibility |
| age_range | Minimum/maximum age requirements |
| household_size | Household composition rules |
| document_presence | Required document validation |
| residency | District residency requirements |

### 6.4 Document Validation Engine

Validates uploaded documents against service requirements.

**Engine Responsibilities:**
- Check required documents per service type
- Validate document expiration dates
- Track document verification status
- Generate missing document list

---

## 7. Data Flow Patterns

### 7.1 Intake Flow

```
Citizen Data Entry → CCR Lookup/Create → Case Creation → Document Upload → Initial Validation
```

### 7.2 Processing Flow

```
Case Assignment → Eligibility Evaluation → Document Verification → Status Updates → Review Submission
```

### 7.3 Review Flow

```
Review Queue → Case Review → Decision (Approve/Reject) → Case Lock → Notification
```

### 7.4 Payment Flow

```
Approved Cases → Payment Creation → Subema Submission → Status Sync → Case Update
```

---

## 8. Deployment Architecture

### 8.1 Environment Structure

| Environment | Purpose |
|-------------|---------|
| Development | Feature development and testing |
| Staging | Pre-production validation |
| Production | Live system |

### 8.2 Infrastructure Components

- **Frontend Hosting:** Static SPA deployment
- **Backend:** Supabase managed services
- **Edge Functions:** Supabase Edge Functions (Deno runtime)
- **Storage:** Supabase Storage buckets

---

## 9. Cross-Cutting Concerns

### 9.1 Logging & Audit
- All case modifications logged to case_events
- All CCR modifications logged with actor and timestamp
- Edge function execution logged for debugging

### 9.2 Error Handling
- Frontend: Toast notifications for user feedback
- Backend: Structured error responses
- Edge Functions: Comprehensive logging

### 9.3 Performance Considerations
- Pagination for large data sets
- Indexed queries for common operations
- Caching for static reference data

---

## 10. Constraints & Assumptions

### 10.1 Technical Constraints
- Single Supabase project for MVP
- PostgreSQL as sole database
- Deno runtime for edge functions

### 10.2 Assumptions
- BIS API available and documented
- Subema API specifications provided
- Stable network connectivity at district offices
- Modern browser support (Chrome, Firefox, Edge)

---

**END OF CONSOLIDATED ARCHITECTURE v1.0**
