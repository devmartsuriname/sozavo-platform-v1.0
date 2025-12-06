# SoZaVo Platform v1.0 – Data Dictionary

> **Version:** 1.0  
> **Status:** Authoritative Reference Document  
> **Source:** Synthesized from all 34 SoZaVo documents (Phases 1–29)

---

## 1. Purpose

This document provides the complete, authoritative reference of all data fields, tables, and entities used across the SoZaVo Platform v1.0. It serves as the foundation for:
- Backend development
- Row-Level Security (RLS) policies
- Edge functions
- Data validation
- BIS and Subema integrations
- Reporting and analytics

---

## 2. Table Index

| # | Table Name | Category | Description |
|---|------------|----------|-------------|
| 1 | `service_types` | Core | Social service definitions |
| 2 | `offices` | Core | District office locations |
| 3 | `citizens` | Core | Central Citizen Record (CCR) |
| 4 | `users` | Core | Internal system users |
| 5 | `user_roles` | Security | Role assignments (separate from users) |
| 6 | `cases` | Core | Social service cases |
| 7 | `case_events` | Audit | Case audit trail |
| 8 | `documents` | Core | Uploaded documents |
| 9 | `eligibility_rules` | Config | Eligibility criteria definitions |
| 10 | `eligibility_evaluations` | Processing | Evaluation results |
| 11 | `document_requirements` | Config | Required documents per service |
| 12 | `workflow_definitions` | Config | Status transition rules |
| 13 | `payments` | Core | Payment records |
| 14 | `notifications` | System | Internal notifications |
| 15 | `portal_notifications` | Portal | Citizen-facing notifications |
| 16 | `households` | BIS | Household composition records |
| 17 | `incomes` | Processing | Income records |
| 18 | `subema_sync_logs` | Integration | Subema sync audit trail |

---

## 3. Enumerations

### 3.1 `app_role`
```sql
CREATE TYPE public.app_role AS ENUM (
  'system_admin',
  'district_intake_officer',
  'case_handler',
  'case_reviewer',
  'department_head',
  'audit'
);
```

### 3.2 `case_status`
```sql
CREATE TYPE public.case_status AS ENUM (
  'intake',
  'validation',
  'eligibility_check',
  'under_review',
  'approved',
  'rejected',
  'payment_pending',
  'payment_processed',
  'closed',
  'on_hold'
);
```

### 3.3 `document_type`
```sql
CREATE TYPE public.document_type AS ENUM (
  'id_card',
  'income_proof',
  'medical_certificate',
  'birth_certificate',
  'school_enrollment',
  'residency_proof',
  'bank_statement',
  'marriage_certificate',
  'death_certificate',
  'household_composition'
);
```

### 3.4 `document_status`
```sql
CREATE TYPE public.document_status AS ENUM (
  'pending',
  'verified',
  'rejected',
  'expired'
);
```

### 3.5 `payment_status`
```sql
CREATE TYPE public.payment_status AS ENUM (
  'pending',
  'processed',
  'failed',
  'cancelled'
);
```

---

## 4. Core Tables

### 4.1 `service_types`

**Purpose:** Defines the social service types available in the platform.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P1, P3, P4 |
| `name` | VARCHAR(100) | Service display name | Internal | Required | Unique | P3 (wizard) |
| `code` | VARCHAR(20) | Short code (e.g., AB, FB, KB) | Internal | Required | Unique, uppercase | P3, P9 |
| `description` | TEXT | Full service description | Internal | Optional | | P3 |
| `is_active` | BOOLEAN | Active status | Internal | Required | Default: true | P4 |
| `created_at` | TIMESTAMPTZ | Record creation timestamp | Internal | Required | Auto-generated | |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | Internal | Required | Auto-updated | |

---

### 4.2 `offices`

**Purpose:** Stores district office locations where services are provided.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P1, P4 |
| `district_id` | VARCHAR(10) | District code | Internal | Required | FK-like reference | P3, P7 |
| `name` | VARCHAR(100) | Office name | Internal | Required | | P3 |
| `address` | TEXT | Physical address | Internal | Optional | | |
| `phone` | VARCHAR(20) | Contact phone | Internal | Optional | | |
| `is_active` | BOOLEAN | Active status | Internal | Required | Default: true | |
| `created_at` | TIMESTAMPTZ | Record creation timestamp | Internal | Required | Auto-generated | |

---

### 4.3 `citizens`

**Purpose:** Central Citizen Record (CCR) - the authoritative citizen data repository.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key (CCR ID) | Internal | Required | Auto-generated | P1, P3, P4 |
| `national_id` | VARCHAR(20) | National ID number | BIS | Required | **Requires Validation – BIS field name** | P3, P11 |
| `bis_person_id` | VARCHAR(50) | BIS person identifier | BIS | Conditional | **Requires Validation – BIS field mapping** | P11 |
| `first_name` | VARCHAR(100) | First name(s) | BIS/Intake | Required | Maps from BIS `voornamen` | P3, P11 |
| `last_name` | VARCHAR(100) | Family name | BIS/Intake | Required | Maps from BIS `achternaam` | P3, P11 |
| `date_of_birth` | DATE | Date of birth | BIS/Intake | Required | Maps from BIS `geboortedatum` | P3, P9, P11 |
| `gender` | VARCHAR(10) | Gender | BIS/Intake | Optional | M/F/Other | P3 |
| `address` | TEXT | Current address | BIS/Intake | Required | Maps from BIS `adres` | P3, P11 |
| `district` | VARCHAR(50) | District of residence | Intake | Required | | P3, P7 |
| `phone` | VARCHAR(20) | Phone number | Intake | Optional | | P3, P8 |
| `email` | VARCHAR(255) | Email address | Intake | Optional | | P3, P8 |
| `household_members` | JSONB | Household composition | Intake | Optional | Array of member objects | P3, P9 |
| `bis_verified` | BOOLEAN | BIS verification status | Integration | Required | Default: false | P11 |
| `bis_verified_at` | TIMESTAMPTZ | BIS verification timestamp | Integration | Conditional | Set when verified | P11 |
| `portal_user_id` | UUID | Link to portal auth.users | Portal | Conditional | **Requires Validation – linkage assumption** | P8 |
| `country_of_residence` | VARCHAR(50) | Country of residence | BIS/Intake | Optional | **Requires Validation – assumed field** | P9 |
| `created_at` | TIMESTAMPTZ | Record creation timestamp | Internal | Required | Auto-generated | |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | Internal | Required | Auto-updated | |

---

### 4.4 `users`

**Purpose:** Internal system users (SoZaVo staff).

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P1, P4, P7 |
| `auth_user_id` | UUID | Link to auth.users | Internal | Required | FK to Supabase Auth | P2, P7 |
| `email` | VARCHAR(255) | User email | Internal | Required | Unique | P2 |
| `full_name` | VARCHAR(200) | Display name | Internal | Required | | P4, P6 |
| `office_id` | UUID | Assigned office | Internal | Conditional | FK to offices | P3, P7 |
| `district_id` | VARCHAR(10) | Assigned district | Internal | Conditional | Used for RLS | P7 |
| `is_active` | BOOLEAN | Active status | Internal | Required | Default: true | P7 |
| `created_at` | TIMESTAMPTZ | Record creation timestamp | Internal | Required | Auto-generated | |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | Internal | Required | Auto-updated | |

**Security Note:** Roles are stored separately in `user_roles` table to prevent privilege escalation.

---

### 4.5 `user_roles`

**Purpose:** Role assignments for internal users (security-critical, separate from users table).

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P7 |
| `user_id` | UUID | Reference to users | Internal | Required | FK to users.id | P7 |
| `role` | app_role | Assigned role | Internal | Required | Enum value | P7 |
| `created_at` | TIMESTAMPTZ | Assignment timestamp | Internal | Required | Auto-generated | |

**Constraints:** UNIQUE(user_id, role) - allows multiple roles per user.

---

### 4.6 `cases`

**Purpose:** Core entity for social service applications.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P1, P4, P5, P6 |
| `case_reference` | VARCHAR(20) | Human-readable reference | Internal | Required | Generated, unique | P3, P4 |
| `citizen_id` | UUID | Applicant reference | Internal | Required | FK to citizens | P3, P4 |
| `service_type_id` | UUID | Service type | Internal | Required | FK to service_types | P3, P4, P9 |
| `current_status` | case_status | Current workflow status | Workflow | Required | Enum value | P4, P6 |
| `case_handler_id` | UUID | Assigned handler | Workflow | Conditional | FK to users | P4, P7 |
| `reviewer_id` | UUID | Assigned reviewer | Workflow | Conditional | FK to users | P4, P6 |
| `intake_office_id` | UUID | Origin office | Intake | Required | FK to offices | P3, P7 |
| `intake_officer_id` | UUID | Intake officer | Intake | Required | FK to users | P3 |
| `wizard_data` | JSONB | Full wizard submission | Wizard | Required | Step-by-step data | P3 |
| `priority` | VARCHAR(10) | Case priority | Workflow | Optional | LOW/MEDIUM/HIGH | P4 |
| `notes` | TEXT | Internal notes | Case Handling | Optional | | P4 |
| `created_at` | TIMESTAMPTZ | Case creation timestamp | Internal | Required | Auto-generated | P6 |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | Internal | Required | Auto-updated | |
| `closed_at` | TIMESTAMPTZ | Case closure timestamp | Workflow | Conditional | Set on close | P6 |

---

### 4.7 `case_events`

**Purpose:** Audit trail for all case-related events.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P4, P6 |
| `case_id` | UUID | Related case | Internal | Required | FK to cases | P4, P6, P15 |
| `event_type` | VARCHAR(50) | Event type identifier | Workflow | Required | status_change, document_upload, etc. | P4, P6 |
| `actor_id` | UUID | User who performed action | Internal | Required | FK to users | P4, P15 |
| `old_status` | case_status | Previous status | Workflow | Conditional | For status_change events | P4 |
| `new_status` | case_status | New status | Workflow | Conditional | For status_change events | P4 |
| `meta` | JSONB | Event metadata | Various | Optional | Flexible event data | P4, P6 |
| `created_at` | TIMESTAMPTZ | Event timestamp | Internal | Required | Auto-generated | P6, P15 |

---

### 4.8 `documents`

**Purpose:** Document metadata and storage references.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P5 |
| `case_id` | UUID | Related case | Internal | Required | FK to cases | P5, P7 |
| `citizen_id` | UUID | Document owner | Internal | Required | FK to citizens | P5 |
| `document_type` | document_type | Type of document | Intake | Required | Enum value | P5 |
| `file_name` | VARCHAR(255) | Original file name | Upload | Required | | P5 |
| `file_path` | TEXT | Storage path | Internal | Required | Supabase Storage path | P5 |
| `file_size` | INTEGER | File size in bytes | Upload | Required | Max 10MB | P5 |
| `mime_type` | VARCHAR(100) | MIME type | Upload | Required | pdf, jpg, png, etc. | P5 |
| `status` | document_status | Verification status | Workflow | Required | Default: pending | P5 |
| `verified_by` | UUID | Verifier reference | Workflow | Conditional | FK to users | P5 |
| `verified_at` | TIMESTAMPTZ | Verification timestamp | Workflow | Conditional | | P5 |
| `rejection_reason` | TEXT | Reason for rejection | Workflow | Conditional | Required if rejected | P5 |
| `expires_at` | DATE | Document expiration | Intake | Optional | For time-sensitive docs | P5, P9 |
| `created_at` | TIMESTAMPTZ | Upload timestamp | Internal | Required | Auto-generated | |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | Internal | Required | Auto-updated | |

---

### 4.9 `eligibility_rules`

**Purpose:** Configurable eligibility criteria per service type.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P9 |
| `service_type_id` | UUID | Applicable service | Internal | Required | FK to service_types | P9 |
| `rule_name` | VARCHAR(100) | Rule identifier | Internal | Required | | P9 |
| `rule_type` | VARCHAR(50) | Rule category | Internal | Required | income, age, household, etc. | P9 |
| `condition` | JSONB | Rule condition definition | Internal | Required | Engine-readable format | P9 |
| `error_message` | TEXT | Failure message | Internal | Required | User-friendly text | P9 |
| `is_mandatory` | BOOLEAN | Block eligibility if failed | Internal | Required | Default: true | P9 |
| `priority` | INTEGER | Evaluation order | Internal | Required | Lower = first | P9 |
| `is_active` | BOOLEAN | Active status | Internal | Required | Default: true | P9 |
| `created_at` | TIMESTAMPTZ | Record creation timestamp | Internal | Required | Auto-generated | |

---

### 4.10 `eligibility_evaluations`

**Purpose:** Stores results of eligibility engine evaluations.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P9 |
| `case_id` | UUID | Evaluated case | Internal | Required | FK to cases | P9 |
| `result` | VARCHAR(20) | Overall result | Engine | Required | ELIGIBLE/INELIGIBLE/PENDING | P9 |
| `criteria_results` | JSONB | Per-rule results | Engine | Required | Array of rule evaluations | P9 |
| `override_by` | UUID | Manual override user | Workflow | Conditional | FK to users | P9 |
| `override_reason` | TEXT | Override justification | Workflow | Conditional | Required if overridden | P9 |
| `evaluated_at` | TIMESTAMPTZ | Evaluation timestamp | Internal | Required | Auto-generated | P9 |
| `evaluated_by` | UUID | System or user | Internal | Required | FK to users or NULL for system | P9 |

---

### 4.11 `document_requirements`

**Purpose:** Defines required documents per service type.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P5 |
| `service_type_id` | UUID | Applicable service | Internal | Required | FK to service_types | P5 |
| `document_type` | document_type | Required document type | Internal | Required | Enum value | P5 |
| `is_mandatory` | BOOLEAN | Blocking requirement | Internal | Required | Default: true | P5 |
| `description` | TEXT | Requirement description | Internal | Optional | User-facing guidance | P5 |
| `created_at` | TIMESTAMPTZ | Record creation timestamp | Internal | Required | Auto-generated | |

---

### 4.12 `workflow_definitions`

**Purpose:** Defines valid status transitions per service type.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P4 |
| `service_type_id` | UUID | Applicable service | Internal | Required | FK to service_types | P4 |
| `from_status` | case_status | Source status | Internal | Required | Enum value | P4 |
| `to_status` | case_status | Target status | Internal | Required | Enum value | P4 |
| `required_role` | app_role | Minimum role required | Internal | Required | Enum value | P4, P7 |
| `is_active` | BOOLEAN | Active transition | Internal | Required | Default: true | P4 |
| `created_at` | TIMESTAMPTZ | Record creation timestamp | Internal | Required | Auto-generated | |

---

### 4.13 `payments`

**Purpose:** Payment records for approved cases.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P10 |
| `case_id` | UUID | Related case | Internal | Required | FK to cases | P10 |
| `citizen_id` | UUID | Payment recipient | Internal | Required | FK to citizens | P10 |
| `amount` | DECIMAL(12,2) | Payment amount | Calculation | Required | SRD currency | P10 |
| `payment_date` | DATE | Scheduled/actual date | Workflow | Required | | P10 |
| `status` | payment_status | Payment status | Workflow | Required | Default: pending | P10, P12 |
| `subema_reference` | VARCHAR(100) | Subema transaction ID | Subema | Conditional | **Requires Validation – Subema field** | P12 |
| `subema_synced_at` | TIMESTAMPTZ | Last sync timestamp | Integration | Conditional | | P12 |
| `payment_method` | VARCHAR(50) | Disbursement method | Subema | Optional | bank, cash, etc. | P10 |
| `bank_account` | VARCHAR(50) | Recipient account | Intake | Conditional | | P10 |
| `notes` | TEXT | Payment notes | Workflow | Optional | | P10 |
| `created_at` | TIMESTAMPTZ | Record creation timestamp | Internal | Required | Auto-generated | |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | Internal | Required | Auto-updated | |

---

### 4.14 `notifications`

**Purpose:** Internal notifications for staff.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P13 |
| `user_id` | UUID | Recipient user | Internal | Required | FK to users | P13 |
| `title` | VARCHAR(200) | Notification title | System | Required | | P13 |
| `message` | TEXT | Notification body | System | Required | | P13 |
| `type` | VARCHAR(50) | Notification category | System | Required | info, warning, action, etc. | P13 |
| `is_read` | BOOLEAN | Read status | User | Required | Default: false | P13 |
| `related_case_id` | UUID | Related case | System | Optional | FK to cases | P13 |
| `created_at` | TIMESTAMPTZ | Notification timestamp | Internal | Required | Auto-generated | |

---

### 4.15 `portal_notifications`

**Purpose:** Citizen-facing notifications for the public portal.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P8 |
| `citizen_id` | UUID | Recipient citizen | Internal | Required | FK to citizens | P8 |
| `title` | VARCHAR(200) | Notification title | System | Required | | P8 |
| `message` | TEXT | Notification body | System | Required | Citizen-friendly text | P8 |
| `type` | VARCHAR(50) | Notification category | System | Required | status_update, document_request, etc. | P8 |
| `is_read` | BOOLEAN | Read status | User | Required | Default: false | P8 |
| `related_case_id` | UUID | Related case | System | Optional | FK to cases | P8 |
| `created_at` | TIMESTAMPTZ | Notification timestamp | Internal | Required | Auto-generated | |

---

### 4.16 `households`

**Purpose:** Household composition records (BIS integration).

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P11 |
| `citizen_id` | UUID | Head of household | Internal | Required | FK to citizens | P3, P11 |
| `bis_household_id` | VARCHAR(50) | BIS household reference | BIS | Conditional | **Requires Validation – BIS field** | P11 |
| `address` | TEXT | Household address | BIS/Intake | Required | | P11 |
| `district` | VARCHAR(50) | Household district | BIS/Intake | Required | | P11 |
| `member_count` | INTEGER | Number of members | BIS/Intake | Required | | P9 |
| `members` | JSONB | Member details | BIS/Intake | Optional | Array of member objects | P3, P9 |
| `verified_at` | TIMESTAMPTZ | BIS verification timestamp | Integration | Conditional | | P11 |
| `created_at` | TIMESTAMPTZ | Record creation timestamp | Internal | Required | Auto-generated | |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | Internal | Required | Auto-updated | |

---

### 4.17 `incomes`

**Purpose:** Income records for eligibility evaluation.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P9 |
| `citizen_id` | UUID | Income earner | Internal | Required | FK to citizens | P3, P9 |
| `case_id` | UUID | Related case | Internal | Required | FK to cases | P9 |
| `income_type` | VARCHAR(50) | Type of income | Intake | Required | salary, pension, benefits, etc. | P3, P9 |
| `amount` | DECIMAL(12,2) | Monthly amount | Intake | Required | SRD currency | P3, P9 |
| `employer_name` | VARCHAR(200) | Employer/source name | Intake | Optional | | P3 |
| `start_date` | DATE | Income start date | Intake | Optional | | P9 |
| `end_date` | DATE | Income end date | Intake | Optional | For temporary income | P9 |
| `is_verified` | BOOLEAN | Verification status | Workflow | Required | Default: false | P9 |
| `verified_by` | UUID | Verifier reference | Workflow | Conditional | FK to users | P9 |
| `subema_verified` | BOOLEAN | Cross-checked with Subema | Integration | Optional | **Requires Validation – if applicable** | P12 |
| `created_at` | TIMESTAMPTZ | Record creation timestamp | Internal | Required | Auto-generated | |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | Internal | Required | Auto-updated | |

---

### 4.18 `subema_sync_logs`

**Purpose:** Audit trail for Subema integration synchronization.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P12 |
| `payment_id` | UUID | Related payment | Internal | Required | FK to payments | P12 |
| `sync_type` | VARCHAR(50) | Type of sync operation | Integration | Required | submit, status_check, etc. | P12 |
| `request_payload` | JSONB | Request sent to Subema | Integration | Required | | P12 |
| `response_payload` | JSONB | Response from Subema | Integration | Conditional | | P12 |
| `status` | VARCHAR(20) | Sync result | Integration | Required | success, failed, pending | P12 |
| `error_message` | TEXT | Error details | Integration | Conditional | If failed | P12 |
| `subema_reference` | VARCHAR(100) | Subema transaction ID | Subema | Conditional | **Requires Validation – Subema field** | P12 |
| `retries` | INTEGER | Retry count | Integration | Required | Default: 0 | P12 |
| `created_at` | TIMESTAMPTZ | Sync timestamp | Internal | Required | Auto-generated | |

---

## 5. Fields Requiring External Validation

The following fields have been identified as requiring external validation before implementation:

| Field | Table | Validation Required | Stakeholder |
|-------|-------|---------------------|-------------|
| `national_id` | citizens | Confirm BIS field name | Ministry of Home Affairs |
| `bis_person_id` | citizens | Confirm BIS field mapping | Ministry of Home Affairs |
| `bis_household_id` | households | Confirm BIS field name | Ministry of Home Affairs |
| `subema_reference` | payments | Confirm Subema response field | Subema vendor |
| `subema_reference` | subema_sync_logs | Confirm Subema response field | Subema vendor |
| `portal_user_id` | citizens | Validate linkage approach | Internal architecture |
| `country_of_residence` | citizens | Confirm if required for eligibility | Policy team |
| `subema_verified` | incomes | Confirm if Subema provides income data | Subema vendor |

---

## 6. Table Normalization Notes

### Canonical Table Naming
The following tables were referenced with varying names across documents and have been normalized:

| Original References | Canonical Name | Notes |
|---------------------|----------------|-------|
| citizen_records, ccr, citizen_registry | `citizens` | Central Citizen Record |
| staff, internal_users, admin_users | `users` | Internal system users |
| case_history, case_audit, event_log | `case_events` | Case audit trail |
| payment_log, benefit_payments | `payments` | Payment records |
| household_composition, household_data | `households` | Separate table from JSONB |

---

## 7. Data Flow Sources

### 7.1 Source Legend

| Source | Description |
|--------|-------------|
| **Internal** | Generated or managed by the platform |
| **BIS** | Data from Civil Registry (Bevolkings Informatie Systeem) |
| **Subema** | Data from payment processing system |
| **Intake** | Data entered during intake wizard |
| **Wizard** | Data collected through multi-step wizard |
| **Workflow** | Data created/modified during case processing |
| **Integration** | Data from external system integrations |
| **Portal** | Data from citizen self-service portal |

### 7.2 Data Flow Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Intake     │────▶│   citizens   │◀────│     BIS      │
│   Wizard     │     │   cases      │     │  (External)  │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Case        │────▶│  documents   │     │  Subema      │
│  Handling    │     │  case_events │◀────│  (External)  │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   payments   │
                     │eligibility_  │
                     │evaluations   │
                     └──────────────┘
```

---

**END OF DATA DICTIONARY v1.0**
