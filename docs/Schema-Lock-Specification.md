# SoZaVo Platform v1.0 – Schema Lock Specification

> **Version:** 1.0  
> **Status:** Implementation Blueprint  
> **Source:** Data Dictionary v1.0, Backend Documentation v2.0  
> **Cross-References:** Data-Dictionary.md, Backend.md, Architecture.md

---

## 1. Purpose

This document defines the schema freeze table, validation requirements, integrity constraints, and migration policy for the SoZaVo Platform database. It serves as the authoritative reference for schema stability and change control.

---

## 2. Schema Freeze Table

### 2.1 Core Tables

| Table | Field | Type | Status | Notes |
|-------|-------|------|--------|-------|
| `service_types` | `id` | UUID | **Stable** | Auto-generated PK |
| `service_types` | `name` | VARCHAR(100) | **Stable** | Unique |
| `service_types` | `code` | VARCHAR(20) | **Stable** | Unique, AB/FB/KB |
| `service_types` | `description` | TEXT | **Stable** | |
| `service_types` | `is_active` | BOOLEAN | **Stable** | Default: true |
| `service_types` | `created_at` | TIMESTAMPTZ | **Stable** | |
| `service_types` | `updated_at` | TIMESTAMPTZ | **Stable** | |
| `offices` | `id` | UUID | **Stable** | |
| `offices` | `district_id` | VARCHAR(10) | **Stable** | |
| `offices` | `name` | VARCHAR(100) | **Stable** | |
| `offices` | `address` | TEXT | **Stable** | |
| `offices` | `phone` | VARCHAR(20) | **Stable** | |
| `offices` | `is_active` | BOOLEAN | **Stable** | |
| `offices` | `created_at` | TIMESTAMPTZ | **Stable** | |
| `citizens` | `id` | UUID | **Stable** | CCR ID |
| `citizens` | `national_id` | VARCHAR(20) | **Requires Validation** | BIS field name TBD |
| `citizens` | `bis_person_id` | VARCHAR(50) | **Blocked** | BIS mapping unknown |
| `citizens` | `first_name` | VARCHAR(100) | **Stable** | Maps from BIS voornamen |
| `citizens` | `last_name` | VARCHAR(100) | **Stable** | Maps from BIS achternaam |
| `citizens` | `date_of_birth` | DATE | **Stable** | Maps from BIS geboortedatum |
| `citizens` | `gender` | VARCHAR(10) | **Stable** | |
| `citizens` | `address` | TEXT | **Stable** | Maps from BIS adres |
| `citizens` | `district` | VARCHAR(50) | **Stable** | |
| `citizens` | `phone` | VARCHAR(20) | **Stable** | |
| `citizens` | `email` | VARCHAR(255) | **Stable** | |
| `citizens` | `household_members` | JSONB | **Stable** | Array structure |
| `citizens` | `bis_verified` | BOOLEAN | **Stable** | |
| `citizens` | `bis_verified_at` | TIMESTAMPTZ | **Stable** | |
| `citizens` | `portal_user_id` | UUID | **Requires Validation** | Linkage assumption |
| `citizens` | `country_of_residence` | VARCHAR(50) | **Requires Validation** | Assumed field |
| `citizens` | `created_at` | TIMESTAMPTZ | **Stable** | |
| `citizens` | `updated_at` | TIMESTAMPTZ | **Stable** | |
| `users` | `id` | UUID | **Stable** | |
| `users` | `auth_user_id` | UUID | **Stable** | FK to Supabase Auth |
| `users` | `email` | VARCHAR(255) | **Stable** | Unique |
| `users` | `full_name` | VARCHAR(200) | **Stable** | |
| `users` | `office_id` | UUID | **Stable** | FK to offices |
| `users` | `district_id` | VARCHAR(10) | **Stable** | RLS filter |
| `users` | `is_active` | BOOLEAN | **Stable** | |
| `users` | `created_at` | TIMESTAMPTZ | **Stable** | |
| `users` | `updated_at` | TIMESTAMPTZ | **Stable** | |
| `user_roles` | `id` | UUID | **Stable** | Security-critical |
| `user_roles` | `user_id` | UUID | **Stable** | FK to users |
| `user_roles` | `role` | app_role | **Stable** | Enum value |
| `user_roles` | `created_at` | TIMESTAMPTZ | **Stable** | |
| `cases` | `id` | UUID | **Stable** | |
| `cases` | `case_reference` | VARCHAR(20) | **Stable** | Generated, unique |
| `cases` | `citizen_id` | UUID | **Stable** | FK to citizens |
| `cases` | `service_type_id` | UUID | **Stable** | FK to service_types |
| `cases` | `current_status` | case_status | **Stable** | Enum |
| `cases` | `case_handler_id` | UUID | **Stable** | FK to users |
| `cases` | `reviewer_id` | UUID | **Stable** | FK to users |
| `cases` | `intake_office_id` | UUID | **Stable** | FK to offices |
| `cases` | `intake_officer_id` | UUID | **Stable** | FK to users |
| `cases` | `wizard_data` | JSONB | **Stable** | Step-by-step data |
| `cases` | `priority` | VARCHAR(10) | **Stable** | LOW/MEDIUM/HIGH |
| `cases` | `notes` | TEXT | **Stable** | |
| `cases` | `created_at` | TIMESTAMPTZ | **Stable** | |
| `cases` | `updated_at` | TIMESTAMPTZ | **Stable** | |
| `cases` | `closed_at` | TIMESTAMPTZ | **Stable** | |
| `case_events` | `id` | UUID | **Stable** | Audit trail |
| `case_events` | `case_id` | UUID | **Stable** | FK to cases |
| `case_events` | `event_type` | VARCHAR(50) | **Stable** | |
| `case_events` | `actor_id` | UUID | **Stable** | FK to users |
| `case_events` | `old_status` | case_status | **Stable** | |
| `case_events` | `new_status` | case_status | **Stable** | |
| `case_events` | `meta` | JSONB | **Stable** | |
| `case_events` | `created_at` | TIMESTAMPTZ | **Stable** | |
| `documents` | `id` | UUID | **Stable** | |
| `documents` | `case_id` | UUID | **Stable** | FK to cases |
| `documents` | `citizen_id` | UUID | **Stable** | FK to citizens |
| `documents` | `document_type` | document_type | **Stable** | Enum |
| `documents` | `file_name` | VARCHAR(255) | **Stable** | |
| `documents` | `file_path` | TEXT | **Stable** | Storage path |
| `documents` | `file_size` | INTEGER | **Stable** | Max 10MB |
| `documents` | `mime_type` | VARCHAR(100) | **Stable** | |
| `documents` | `status` | document_status | **Stable** | Enum |
| `documents` | `verified_by` | UUID | **Stable** | FK to users |
| `documents` | `verified_at` | TIMESTAMPTZ | **Stable** | |
| `documents` | `rejection_reason` | TEXT | **Stable** | |
| `documents` | `expires_at` | DATE | **Stable** | |
| `documents` | `created_at` | TIMESTAMPTZ | **Stable** | |
| `documents` | `updated_at` | TIMESTAMPTZ | **Stable** | |
| `payments` | `id` | UUID | **Stable** | |
| `payments` | `case_id` | UUID | **Stable** | FK to cases |
| `payments` | `citizen_id` | UUID | **Stable** | FK to citizens |
| `payments` | `amount` | DECIMAL(12,2) | **Stable** | SRD |
| `payments` | `payment_date` | DATE | **Stable** | |
| `payments` | `status` | payment_status | **Stable** | Enum |
| `payments` | `subema_reference` | VARCHAR(100) | **Blocked** | Subema field TBD |
| `payments` | `subema_synced_at` | TIMESTAMPTZ | **Stable** | |
| `payments` | `payment_method` | VARCHAR(50) | **Stable** | |
| `payments` | `bank_account` | VARCHAR(50) | **Stable** | |
| `payments` | `notes` | TEXT | **Stable** | |
| `payments` | `created_at` | TIMESTAMPTZ | **Stable** | |
| `payments` | `updated_at` | TIMESTAMPTZ | **Stable** | |

### 2.2 Configuration Tables

| Table | Status | Notes |
|-------|--------|-------|
| `eligibility_rules` | **Stable** | Rule definitions |
| `eligibility_evaluations` | **Stable** | Evaluation results |
| `document_requirements` | **Stable** | Required docs per service |
| `workflow_definitions` | **Stable** | Status transitions |
| `households` | **Stable** | BIS household data |
| `incomes` | **Stable** | Income records |
| `notifications` | **Stable** | Internal notifications |
| `portal_notifications` | **Stable** | Citizen notifications |
| `subema_sync_logs` | **Blocked** | Subema integration TBD |

---

## 3. Validation Rules

### 3.1 Citizen Identity Fields

| Field | Validation Rule | Source |
|-------|-----------------|--------|
| `national_id` | 9-digit numeric, unique | BIS |
| `first_name` | Non-empty, max 100 chars | BIS/Intake |
| `last_name` | Non-empty, max 100 chars | BIS/Intake |
| `date_of_birth` | Valid date, not future | BIS/Intake |
| `email` | Valid email format if provided | Intake |
| `phone` | Valid phone format if provided | Intake |

### 3.2 Income Fields

| Field | Validation Rule |
|-------|-----------------|
| `income_amount` | Positive decimal, SRD currency |
| `income_type` | Must match valid enum |
| `income_source` | Non-empty if amount > 0 |
| `total_monthly_income` | Calculated, must match sum |

### 3.3 Document Metadata

| Field | Validation Rule |
|-------|-----------------|
| `file_size` | Max 10MB (10,485,760 bytes) |
| `mime_type` | Must be: application/pdf, image/jpeg, image/png |
| `file_path` | Must match storage pattern |
| `expires_at` | If set, must be future date |

### 3.4 Case Lifecycle Attributes

| Field | Validation Rule |
|-------|-----------------|
| `current_status` | Must be valid case_status enum |
| `case_reference` | Generated, format: SZ-YYYYMM-NNNNN |
| `closed_at` | Only set when status = closed |

### 3.5 Workflow State Transitions

| From Status | Valid To Status | Required Role |
|-------------|-----------------|---------------|
| intake | validation | district_intake_officer |
| validation | eligibility_check | case_handler |
| eligibility_check | under_review, rejected | case_handler, system |
| under_review | approved, rejected | case_reviewer |
| approved | payment_pending | case_handler |
| payment_pending | payment_processed | system_admin |
| payment_processed | closed | case_handler |
| any (except closed/rejected) | on_hold | case_handler |
| on_hold | previous_status | case_handler |

---

## 4. Integrity Constraints

### 4.1 Foreign Key Rules

| Constraint | Parent Table | Child Table | On Delete |
|------------|--------------|-------------|-----------|
| FK_cases_citizen | citizens | cases | RESTRICT |
| FK_cases_service_type | service_types | cases | RESTRICT |
| FK_cases_handler | users | cases | SET NULL |
| FK_cases_reviewer | users | cases | SET NULL |
| FK_cases_office | offices | cases | RESTRICT |
| FK_case_events_case | cases | case_events | CASCADE |
| FK_case_events_actor | users | case_events | SET NULL |
| FK_documents_case | cases | documents | CASCADE |
| FK_documents_citizen | citizens | documents | RESTRICT |
| FK_payments_case | cases | payments | RESTRICT |
| FK_payments_citizen | citizens | payments | RESTRICT |
| FK_user_roles_user | users | user_roles | CASCADE |
| FK_users_office | offices | users | SET NULL |
| FK_eligibility_eval_case | cases | eligibility_evaluations | CASCADE |

### 4.2 Unique Constraints

| Table | Fields | Constraint Name |
|-------|--------|-----------------|
| citizens | national_id | UQ_citizens_national_id |
| users | email | UQ_users_email |
| users | auth_user_id | UQ_users_auth_user_id |
| cases | case_reference | UQ_cases_case_reference |
| service_types | code | UQ_service_types_code |
| user_roles | user_id, role | UQ_user_roles_user_role |

### 4.3 Not-Null Constraints

All fields marked as "Required" in Data Dictionary must have NOT NULL constraint.

### 4.4 Enumeration Allowed Values

| Enum | Allowed Values |
|------|----------------|
| app_role | system_admin, district_intake_officer, case_handler, case_reviewer, department_head, audit |
| case_status | intake, validation, eligibility_check, under_review, approved, rejected, payment_pending, payment_processed, closed, on_hold |
| document_type | id_card, income_proof, medical_certificate, birth_certificate, school_enrollment, residency_proof, bank_statement, marriage_certificate, death_certificate, household_composition |
| document_status | pending, verified, rejected, expired |
| payment_status | pending, processed, failed, cancelled |

### 4.5 Cross-Table Validation

| Rule | Description |
|------|-------------|
| Case Handler District | case_handler.district_id must match case.intake_office.district_id (unless system_admin) |
| Document Case Match | document.citizen_id must match case.citizen_id |
| Payment Case Status | Payment can only be created when case.current_status = 'approved' |

---

## 5. Migration Policy

### 5.1 When Schema Can Change

| Phase | Schema Changes Allowed |
|-------|------------------------|
| Phase 1-5 | Schema definition and refinement |
| Phase 6 | Minor adjustments only |
| Phase 7+ | **Frozen** - No schema changes without formal approval |

### 5.2 Versioning Requirements

- All schema changes must increment schema version
- Current schema version: **1.0**
- Migration scripts must be named: `YYYYMMDD_HHMM_description.sql`
- All migrations must be reversible

### 5.3 Migration Freeze Timeline

| Milestone | Date | Action |
|-----------|------|--------|
| Schema Lock | Phase 7 Start | No structural changes |
| RLS Deployment | Phase 7 Complete | Security policies frozen |
| UAT Start | TBD | Full schema freeze |
| Production | TBD | Change control required |

### 5.4 Change Control Process

After Phase 7:
1. Change request submitted with justification
2. Impact analysis completed
3. Approval from Technical Lead
4. Migration script created and tested
5. Rollback script verified
6. Deployment during maintenance window

---

## 6. Cross-References

| Document | Section |
|----------|---------|
| Data-Dictionary.md | Sections 3-8 |
| Backend.md | Section 2 (Database Schema) |
| Architecture.md | Section 3 (Data Architecture) |
| PRD.md | REQ-DAT-001 to REQ-DAT-007 |

---

**END OF SCHEMA LOCK SPECIFICATION v1.0**
