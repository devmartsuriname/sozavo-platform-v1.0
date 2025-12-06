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

## 8. Additional Tables (Phases 12–15)

### 8.1 `payment_batches`

**Purpose:** Groups payments for batch submission to Subema.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P12 |
| `batch_reference` | VARCHAR(50) | Batch identifier | Internal | Required | Generated, unique | P12 |
| `status` | batch_status | Batch processing status | Workflow | Required | Enum value | P12 |
| `total_amount` | DECIMAL(14,2) | Sum of all payments in batch | Calculated | Required | SRD currency | P12 |
| `payment_count` | INTEGER | Number of payments in batch | Calculated | Required | | P12 |
| `submitted_at` | TIMESTAMPTZ | Subema submission timestamp | Integration | Conditional | | P12 |
| `processed_at` | TIMESTAMPTZ | Subema completion timestamp | Integration | Conditional | | P12 |
| `created_by` | UUID | User who created batch | Internal | Required | FK to users | P12 |
| `created_at` | TIMESTAMPTZ | Record creation timestamp | Internal | Required | Auto-generated | |

---

### 8.2 `payment_items`

**Purpose:** Individual payment records within a batch.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P12 |
| `batch_id` | UUID | Parent batch | Internal | Required | FK to payment_batches | P12 |
| `payment_id` | UUID | Related payment record | Internal | Required | FK to payments | P10, P12 |
| `citizen_id` | UUID | Payment recipient | Internal | Required | FK to citizens | P12 |
| `amount` | DECIMAL(12,2) | Payment amount | Calculation | Required | SRD currency | P12 |
| `status` | payment_item_status | Item processing status | Workflow | Required | Enum value | P12 |
| `subema_item_reference` | VARCHAR(100) | Subema item transaction ID | Subema | Conditional | **Requires Validation – Subema field** | P12 |
| `bank_account` | VARCHAR(50) | Recipient account | Intake | Conditional | | P12 |
| `disbursement_method` | VARCHAR(20) | Payment method | Config | Required | bank, cash, mobile | P12 |
| `error_message` | TEXT | Processing error details | Integration | Conditional | If failed | P12 |
| `processed_at` | TIMESTAMPTZ | Individual processing timestamp | Integration | Conditional | | P12 |
| `created_at` | TIMESTAMPTZ | Record creation timestamp | Internal | Required | Auto-generated | |

---

### 8.3 `payment_audit_logs`

**Purpose:** Detailed audit trail for payment processing actions.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P12, P15 |
| `payment_id` | UUID | Related payment | Internal | Required | FK to payments | P12 |
| `action` | VARCHAR(50) | Audit action type | System | Required | created, submitted, processed, failed, cancelled | P12, P15 |
| `actor_id` | UUID | User who performed action | Internal | Conditional | FK to users (NULL for system) | P12, P15 |
| `old_status` | payment_status | Previous status | Workflow | Conditional | | P12 |
| `new_status` | payment_status | New status | Workflow | Conditional | | P12 |
| `meta` | JSONB | Additional action metadata | Various | Optional | | P12, P15 |
| `created_at` | TIMESTAMPTZ | Action timestamp | Internal | Required | Auto-generated | |

---

### 8.4 `fraud_signals`

**Purpose:** Stores detected fraud indicators for cases.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P14 |
| `case_id` | UUID | Related case | Internal | Required | FK to cases | P14 |
| `signal_type` | VARCHAR(50) | Type of fraud indicator | Engine | Required | duplicate_application, income_discrepancy, document_tampering, identity_mismatch | P14 |
| `severity` | fraud_severity | Severity level | Engine | Required | Enum value | P14 |
| `description` | TEXT | Signal description | Engine | Required | | P14 |
| `evidence` | JSONB | Supporting evidence data | Engine | Optional | Details for investigation | P14 |
| `status` | VARCHAR(20) | Investigation status | Workflow | Required | pending, investigating, confirmed, dismissed | P14 |
| `reviewed_by` | UUID | Reviewer reference | Workflow | Conditional | FK to users | P14 |
| `reviewed_at` | TIMESTAMPTZ | Review timestamp | Workflow | Conditional | | P14 |
| `created_at` | TIMESTAMPTZ | Detection timestamp | Internal | Required | Auto-generated | |

---

### 8.5 `fraud_risk_scores`

**Purpose:** Aggregated fraud risk assessment per case.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P14 |
| `case_id` | UUID | Related case | Internal | Required | FK to cases, UNIQUE | P14 |
| `risk_score` | DECIMAL(5,2) | Calculated risk score | Engine | Required | 0.00 to 100.00 | P14 |
| `risk_level` | risk_level | Categorical risk level | Engine | Required | Enum value | P14 |
| `signal_count` | INTEGER | Number of active signals | Engine | Required | | P14 |
| `last_evaluated_at` | TIMESTAMPTZ | Last evaluation timestamp | Engine | Required | | P14 |
| `created_at` | TIMESTAMPTZ | Record creation timestamp | Internal | Required | Auto-generated | |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | Internal | Required | Auto-updated | |

---

### 8.6 `fraud_review_logs`

**Purpose:** Audit trail for fraud investigation actions.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P14, P15 |
| `signal_id` | UUID | Related fraud signal | Internal | Required | FK to fraud_signals | P14 |
| `action` | VARCHAR(50) | Review action | Workflow | Required | assigned, investigated, escalated, resolved, dismissed | P14 |
| `actor_id` | UUID | User who performed action | Internal | Required | FK to users | P14, P15 |
| `notes` | TEXT | Investigation notes | Workflow | Optional | | P14 |
| `created_at` | TIMESTAMPTZ | Action timestamp | Internal | Required | Auto-generated | |

---

### 8.7 `audit_events`

**Purpose:** System-wide audit event log for compliance.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P15 |
| `event_type` | audit_event_type | Type of audit event | System | Required | Enum value | P15 |
| `entity_type` | VARCHAR(50) | Affected entity type | System | Required | case, citizen, payment, document, user | P15 |
| `entity_id` | UUID | Affected entity ID | System | Required | | P15 |
| `actor_id` | UUID | User who performed action | System | Conditional | FK to users (NULL for system) | P15 |
| `action` | VARCHAR(100) | Specific action performed | System | Required | | P15 |
| `old_value` | JSONB | Previous state | System | Optional | For update events | P15 |
| `new_value` | JSONB | New state | System | Optional | For update events | P15 |
| `ip_address` | VARCHAR(45) | Client IP address | System | Optional | IPv4 or IPv6 | P15 |
| `user_agent` | TEXT | Client user agent | System | Optional | | P15 |
| `created_at` | TIMESTAMPTZ | Event timestamp | Internal | Required | Auto-generated | |

---

### 8.8 `wizard_definitions`

**Purpose:** Configurable wizard step definitions per service type.

| Field | Type | Description | Source | Required | Validation Notes | Cross-References |
|-------|------|-------------|--------|----------|------------------|------------------|
| `id` | UUID | Primary key | Internal | Required | Auto-generated | P3 |
| `service_type_id` | UUID | Applicable service | Internal | Required | FK to service_types | P3 |
| `step_order` | INTEGER | Step sequence number | Internal | Required | 1-indexed | P3 |
| `step_key` | VARCHAR(50) | Step identifier | Internal | Required | identification, personal_info, etc. | P3 |
| `step_title` | VARCHAR(200) | Display title | Internal | Required | | P3 |
| `step_config` | JSONB | Step configuration | Internal | Required | Fields, validations, conditions | P3 |
| `is_required` | BOOLEAN | Mandatory step | Internal | Required | Default: true | P3 |
| `is_active` | BOOLEAN | Active status | Internal | Required | Default: true | P3 |
| `created_at` | TIMESTAMPTZ | Record creation timestamp | Internal | Required | Auto-generated | |

---

## 9. Additional Enumerations (Phases 12–15)

### 9.1 `batch_status`
```sql
CREATE TYPE public.batch_status AS ENUM (
  'draft',
  'pending_approval',
  'approved',
  'submitted',
  'processing',
  'completed',
  'failed',
  'cancelled'
);
```

### 9.2 `payment_item_status`
```sql
CREATE TYPE public.payment_item_status AS ENUM (
  'pending',
  'submitted',
  'processing',
  'completed',
  'failed',
  'returned'
);
```

### 9.3 `fraud_severity`
```sql
CREATE TYPE public.fraud_severity AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);
```

### 9.4 `risk_level`
```sql
CREATE TYPE public.risk_level AS ENUM (
  'minimal',
  'low',
  'medium',
  'high',
  'critical'
);
```

### 9.5 `audit_event_type`
```sql
CREATE TYPE public.audit_event_type AS ENUM (
  'create',
  'read',
  'update',
  'delete',
  'login',
  'logout',
  'export',
  'import',
  'approval',
  'rejection',
  'override',
  'escalation'
);
```

---

## 10. Implied Fields & Derived Data

This section documents fields that are referenced in business logic but are calculated/derived rather than stored directly in the database.

### 10.1 Derived Fields

| Derived Field | Source Table(s) | Derivation Logic | Used In | Storage |
|---------------|-----------------|------------------|---------|---------|
| `age_years` | citizens.date_of_birth | `EXTRACT(YEAR FROM AGE(date_of_birth))` | P9 (eligibility rules) | **Derived – not stored** |
| `age_at_application` | citizens.date_of_birth, cases.created_at | `EXTRACT(YEAR FROM AGE(cases.created_at, citizens.date_of_birth))` | P9 (age rules) | **Derived – not stored** |
| `total_household_members` | households.members | `JSONB_ARRAY_LENGTH(members) + 1` | P9 (household rules) | **Derived – not stored** |
| `number_of_children` | households.members | Count members where age < 18 | P9 (child allowance) | **Derived – not stored** |
| `number_of_dependents` | households.members | Count members where is_dependent = true | P9 (benefit calculation) | **Derived – not stored** |
| `total_verified_monthly_income` | incomes | `SUM(amount) WHERE is_verified = true` | P9 (income threshold) | **Derived – not stored** |
| `total_household_income` | incomes, households | Sum of all household member incomes | P9, P10 (eligibility, payments) | **Derived – not stored** |
| `days_since_intake` | cases.created_at | `CURRENT_DATE - DATE(created_at)` | P6 (SLA monitoring) | **Derived – not stored** |
| `avg_processing_time_days` | case_events | Avg time between intake and approval events | P6 (dashboard KPIs) | **Derived – not stored** |
| `missing_documents_count` | documents, document_requirements | Required docs minus submitted verified docs | P5 (validation engine) | **Derived – not stored** |
| `eligibility_pass_rate` | eligibility_evaluations | `COUNT(eligible) / COUNT(*)` per period | P6 (reporting) | **Derived – not stored** |
| `payment_completion_rate` | payments | `COUNT(processed) / COUNT(*)` per batch | P12 (batch monitoring) | **Derived – not stored** |
| `fraud_signal_density` | fraud_signals | Signal count per case or citizen | P14 (risk scoring) | **Derived – not stored** |

### 10.2 Implicit Fields in JSONB

The following fields are referenced in business logic within JSONB columns:

| Parent Field | JSONB Path | Expected Type | Used In | Notes |
|--------------|------------|---------------|---------|-------|
| `citizens.household_members` | `[*].first_name` | string | P3 wizard | Member identification |
| `citizens.household_members` | `[*].last_name` | string | P3 wizard | Member identification |
| `citizens.household_members` | `[*].date_of_birth` | date | P9 eligibility | Age calculation |
| `citizens.household_members` | `[*].relationship` | string | P9 eligibility | child, spouse, parent, other |
| `citizens.household_members` | `[*].is_dependent` | boolean | P9, P10 | Benefit calculation |
| `citizens.household_members` | `[*].income_amount` | decimal | P9 eligibility | Household income total |
| `cases.wizard_data` | `.identification` | object | P3 | Step 1 data |
| `cases.wizard_data` | `.personal_info` | object | P3 | Step 2 data |
| `cases.wizard_data` | `.address` | object | P3 | Step 3 data |
| `cases.wizard_data` | `.household` | object | P3 | Step 4 data |
| `cases.wizard_data` | `.financial` | object | P3 | Step 5 data |
| `cases.wizard_data` | `.documents` | array | P3, P5 | Step 6 data |
| `eligibility_rules.condition` | `.operator` | string | P9 | gt, lt, eq, gte, lte, in, between |
| `eligibility_rules.condition` | `.field` | string | P9 | Field reference path |
| `eligibility_rules.condition` | `.value` | any | P9 | Threshold value |
| `case_events.meta` | `.decision` | string | P6 | approved/rejected |
| `case_events.meta` | `.reviewer_id` | uuid | P6 | Decision maker |
| `case_events.meta` | `.notes` | string | P4, P6 | Comments |

---

## 11. Validation Dependencies

This section documents fields that cannot be validated locally and require external confirmation.

### 11.1 BIS Validation Dependencies

| Field | Table | Validation Type | External System | Status | Notes |
|-------|-------|-----------------|-----------------|--------|-------|
| `national_id` | citizens | Format validation | BIS | **Requires External Validation** | ID format pattern unknown |
| `bis_person_id` | citizens | Existence check | BIS | **Requires External Validation** | Field name assumed |
| `bis_household_id` | households | Existence check | BIS | **Requires External Validation** | Field name assumed |
| `first_name` | citizens | Cross-validation | BIS | **Requires External Validation** | Match against `voornamen` |
| `last_name` | citizens | Cross-validation | BIS | **Requires External Validation** | Match against `achternaam` |
| `date_of_birth` | citizens | Cross-validation | BIS | **Requires External Validation** | Match against `geboortedatum` |
| `address` | citizens | Cross-validation | BIS | **Requires External Validation** | Match against `adres` |

### 11.2 Subema Validation Dependencies

| Field | Table | Validation Type | External System | Status | Notes |
|-------|-------|-----------------|-----------------|--------|-------|
| `subema_reference` | payments | Response mapping | Subema | **Requires External Validation** | Transaction ID field name |
| `subema_reference` | subema_sync_logs | Response mapping | Subema | **Requires External Validation** | Same as payments |
| `subema_item_reference` | payment_items | Response mapping | Subema | **Requires External Validation** | Item-level ID |
| `subema_verified` | incomes | Data availability | Subema | **Requires External Validation** | Unknown if Subema provides income data |
| `bank_account` | payments | Format validation | Subema | **Requires External Validation** | Account number format |

### 11.3 Business Policy Dependencies

| Field/Rule | Table/Engine | Policy Type | Stakeholder | Status | Notes |
|------------|--------------|-------------|-------------|--------|-------|
| `income_threshold` | eligibility_rules | Amount threshold | Ministry of Social Affairs | **Requires Policy Clarification** | Per-service thresholds |
| `age_limits` | eligibility_rules | Age bounds | Ministry of Social Affairs | **Requires Policy Clarification** | Min/max per service |
| `benefit_formula` | payments | Calculation | Ministry of Social Affairs | **Requires Policy Clarification** | Amount determination logic |
| `override_authorization` | eligibility_evaluations | Permission | Ministry of Social Affairs | **Requires Policy Clarification** | Who can override |
| `data_retention_period` | audit_events | Duration | Legal Department | **Requires Policy Clarification** | Assumed 7 years |
| `consent_requirements` | citizens | Consent flow | Legal Department | **Requires Policy Clarification** | Portal registration |
| `deletion_policy` | all tables | Soft vs hard delete | Legal Department | **Requires Policy Clarification** | Affects schema design |

### 11.4 Legal/Compliance Dependencies

| Requirement | Affected Tables | Compliance Type | Stakeholder | Status | Notes |
|-------------|-----------------|-----------------|-------------|--------|-------|
| Audit trail retention | audit_events, case_events | Data retention | Legal Department | **Requires Legal Confirmation** | 7 years assumed |
| PII handling | citizens, households | Privacy | Legal Department | **Requires Legal Confirmation** | Encryption, access controls |
| Cross-border data | all tables | Data sovereignty | Legal Department | **Requires Legal Confirmation** | Supabase region |
| Right to erasure | citizens | Privacy | Legal Department | **Requires Legal Confirmation** | GDPR-like requirements |

---

**END OF DATA DICTIONARY v1.0**
