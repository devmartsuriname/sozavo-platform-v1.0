# SoZaVo Platform v1.0 – Object Model Registry

> **Version:** 1.0  
> **Status:** Implementation Blueprint  
> **Source:** Data Dictionary v1.0, DAL Specification v1.0  
> **Cross-References:** Data-Dictionary.md, DAL-Specification.md

---

## 1. Purpose

This document provides the authoritative registry of all entities, their sources, ownership, derived field mappings, and traceability to the Data Dictionary.

---

## 2. Entity Registry

### 2.1 Core Entities

| Entity | Source Table | Ownership | Data Dictionary Reference |
|--------|--------------|-----------|---------------------------|
| Citizen | `citizens` | Internal (CCR) | Section 4.3 |
| Case | `cases` | Internal | Section 4.6 |
| CaseEvent | `case_events` | Internal (Audit) | Section 4.7 |
| Document | `documents` | Internal | Section 4.8 |
| Payment | `payments` | Internal | Section 4.13 |
| User | `users` | Internal | Section 4.4 |
| UserRole | `user_roles` | Internal (Security) | Section 4.5 |
| ServiceType | `service_types` | Internal (Config) | Section 4.1 |
| Office | `offices` | Internal | Section 4.2 |
| EligibilityRule | `eligibility_rules` | Internal (Config) | Section 4.9 |
| EligibilityEvaluation | `eligibility_evaluations` | Internal | Section 4.10 |
| DocumentRequirement | `document_requirements` | Internal (Config) | Section 4.11 |
| WorkflowDefinition | `workflow_definitions` | Internal (Config) | Section 4.12 |
| Notification | `notifications` | Internal | Section 4.14 |
| PortalNotification | `portal_notifications` | Portal | Section 4.15 |
| Household | `households` | BIS | Section 4.16 |
| Income | `incomes` | Internal | Section 4.17 |
| SubemaSyncLog | `subema_sync_logs` | Integration | Section 4.18 |

---

### 2.2 Entity Ownership Classification

| Ownership Type | Description | Entities |
|----------------|-------------|----------|
| **Internal** | Managed entirely within SoZaVo | Citizen, Case, CaseEvent, Document, Payment, User, Income |
| **Internal (CCR)** | Central Citizen Registry | Citizen |
| **Internal (Config)** | Configuration data | ServiceType, Office, EligibilityRule, DocumentRequirement, WorkflowDefinition |
| **Internal (Audit)** | Audit trail data | CaseEvent |
| **Internal (Security)** | Security-critical data | UserRole |
| **BIS** | Sourced from Civil Registry | Household |
| **Portal** | Citizen-facing data | PortalNotification |
| **Integration** | Integration logs | SubemaSyncLog |

---

## 3. Derived Fields Registry

### 3.1 Citizen Derived Fields

| Derived Field | Calculation | Source Fields | Data Dictionary Ref |
|---------------|-------------|---------------|---------------------|
| `fullName` | `first_name + ' ' + last_name` | citizens.first_name, citizens.last_name | Section 10.1 |
| `age` | `EXTRACT(YEAR FROM AGE(current_date, date_of_birth))` | citizens.date_of_birth | Section 10.1 |
| `householdSize` | `jsonb_array_length(household_members) + 1` | citizens.household_members | Section 10.1 |

### 3.2 Case Derived Fields

| Derived Field | Calculation | Source Fields | Data Dictionary Ref |
|---------------|-------------|---------------|---------------------|
| `daysOpen` | `current_date - created_at::date` | cases.created_at | Section 10.1 |
| `isOverdue` | `daysOpen > sla_days` | cases.created_at, service_types.sla_days | Section 10.1 |
| `processingTime` | `closed_at - created_at` | cases.created_at, cases.closed_at | Section 10.1 |

### 3.3 Document Derived Fields

| Derived Field | Calculation | Source Fields | Data Dictionary Ref |
|---------------|-------------|---------------|---------------------|
| `isExpired` | `expires_at < current_date` | documents.expires_at | Section 10.1 |
| `daysSinceUpload` | `current_date - created_at::date` | documents.created_at | Section 10.1 |

### 3.4 Eligibility Derived Fields

| Derived Field | Calculation | Source Fields | Data Dictionary Ref |
|---------------|-------------|---------------|---------------------|
| `passedRulesCount` | `COUNT(criteria_results WHERE passed = true)` | eligibility_evaluations.criteria_results | Section 10.1 |
| `failedRulesCount` | `COUNT(criteria_results WHERE passed = false)` | eligibility_evaluations.criteria_results | Section 10.1 |
| `pendingRulesCount` | `COUNT(criteria_results WHERE passed IS NULL)` | eligibility_evaluations.criteria_results | Section 10.1 |

### 3.5 Financial Derived Fields

| Derived Field | Calculation | Source Fields | Data Dictionary Ref |
|---------------|-------------|---------------|---------------------|
| `totalMonthlyIncome` | `SUM(income_amount) WHERE case_id = current_case` | incomes.income_amount | Section 10.1 |
| `dependentCount` | `COUNT(household_members WHERE is_dependent = true)` | citizens.household_members | Section 10.1 |
| `calculatedPaymentAmount` | Payment engine formula | Multiple sources | Section 10.1 |

### 3.6 Fraud Derived Fields

| Derived Field | Calculation | Source Fields | Data Dictionary Ref |
|---------------|-------------|---------------|---------------------|
| `duplicateCaseCount` | `COUNT(cases WHERE citizen.national_id = x AND status NOT IN closed/rejected)` | cases.citizen_id, citizens.national_id | Section 10.1 |
| `addressMatchCount` | `COUNT(cases WHERE citizen.address = x AND created_at > 90 days ago)` | cases, citizens.address | Section 10.1 |
| `daysSinceLastRejection` | `current_date - MAX(closed_at WHERE status = rejected)` | cases.closed_at, cases.current_status | Section 10.1 |

---

## 4. Entity Relationships

### 4.1 Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ENTITY RELATIONSHIPS                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                     │
│  │ ServiceType  │────<│    Case      │>────│   Citizen    │                     │
│  │              │     │              │     │              │                     │
│  │ - id         │     │ - id         │     │ - id         │                     │
│  │ - code       │     │ - citizen_id │     │ - national_id│                     │
│  └──────────────┘     │ - service_id │     └──────┬───────┘                     │
│                       │ - handler_id │            │                              │
│                       └──────┬───────┘            │                              │
│                              │                    │                              │
│           ┌──────────────────┼────────────────────┼─────────────────┐           │
│           │                  │                    │                 │           │
│           ▼                  ▼                    ▼                 ▼           │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐     │
│  │  CaseEvent   │   │  Document    │   │   Payment    │   │  Household   │     │
│  │              │   │              │   │              │   │   (BIS)      │     │
│  │ - case_id    │   │ - case_id    │   │ - case_id    │   │ - citizen_id │     │
│  │ - actor_id   │   │ - citizen_id │   │ - citizen_id │   └──────────────┘     │
│  └──────────────┘   └──────────────┘   └──────────────┘                         │
│                                                                                  │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                         │
│  │    User      │──<│  UserRole    │   │   Office     │                         │
│  │              │   │              │   │              │                         │
│  │ - id         │   │ - user_id    │   │ - district_id│                         │
│  │ - office_id  │───│ - role       │   │              │                         │
│  └──────────────┘   └──────────────┘   └──────────────┘                         │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Relationship Details

| Parent Entity | Child Entity | Relationship | Cardinality | FK Field |
|---------------|--------------|--------------|-------------|----------|
| Citizen | Case | One-to-Many | 1:N | cases.citizen_id |
| Citizen | Document | One-to-Many | 1:N | documents.citizen_id |
| Citizen | Payment | One-to-Many | 1:N | payments.citizen_id |
| Citizen | Household | One-to-Many | 1:N | households.citizen_id |
| Case | CaseEvent | One-to-Many | 1:N | case_events.case_id |
| Case | Document | One-to-Many | 1:N | documents.case_id |
| Case | Payment | One-to-Many | 1:N | payments.case_id |
| Case | EligibilityEvaluation | One-to-Many | 1:N | eligibility_evaluations.case_id |
| Case | Income | One-to-Many | 1:N | incomes.case_id |
| ServiceType | Case | One-to-Many | 1:N | cases.service_type_id |
| ServiceType | EligibilityRule | One-to-Many | 1:N | eligibility_rules.service_type_id |
| ServiceType | DocumentRequirement | One-to-Many | 1:N | document_requirements.service_type_id |
| ServiceType | WorkflowDefinition | One-to-Many | 1:N | workflow_definitions.service_type_id |
| User | Case (Handler) | One-to-Many | 1:N | cases.case_handler_id |
| User | Case (Reviewer) | One-to-Many | 1:N | cases.reviewer_id |
| User | CaseEvent | One-to-Many | 1:N | case_events.actor_id |
| User | UserRole | One-to-Many | 1:N | user_roles.user_id |
| User | Document (Verifier) | One-to-Many | 1:N | documents.verified_by |
| Office | Case | One-to-Many | 1:N | cases.intake_office_id |
| Office | User | One-to-Many | 1:N | users.office_id |

---

## 5. Data Dictionary Traceability

### 5.1 Entity → Data Dictionary Mapping

| Entity | Data Dictionary Section | Status |
|--------|-------------------------|--------|
| Citizen | Section 4.3 | **Complete** |
| Case | Section 4.6 | **Complete** |
| CaseEvent | Section 4.7 | **Complete** |
| Document | Section 4.8 | **Complete** |
| Payment | Section 4.13 | **Complete** |
| User | Section 4.4 | **Complete** |
| UserRole | Section 4.5 | **Complete** |
| ServiceType | Section 4.1 | **Complete** |
| Office | Section 4.2 | **Complete** |
| EligibilityRule | Section 4.9 | **Complete** |
| EligibilityEvaluation | Section 4.10 | **Complete** |
| DocumentRequirement | Section 4.11 | **Complete** |
| WorkflowDefinition | Section 4.12 | **Complete** |
| Notification | Section 4.14 | **Complete** |
| PortalNotification | Section 4.15 | **Complete** |
| Household | Section 4.16 | **Complete** |
| Income | Section 4.17 | **Complete** |
| SubemaSyncLog | Section 4.18 | **Complete** |

### 5.2 Derived Fields → Data Dictionary Mapping

| Derived Field | Data Dictionary Section | Status |
|---------------|-------------------------|--------|
| fullName | Section 10.1 | **Complete** |
| age | Section 10.1 | **Complete** |
| householdSize | Section 10.1 | **Complete** |
| daysOpen | Section 10.1 | **Complete** |
| isOverdue | Section 10.1 | **Complete** |
| processingTime | Section 10.1 | **Complete** |
| isExpired | Section 10.1 | **Complete** |
| totalMonthlyIncome | Section 10.1 | **Complete** |
| dependentCount | Section 10.1 | **Complete** |
| calculatedPaymentAmount | Section 10.1 | **Requires Clarification** |

---

## 6. Cross-References

| Document | Section |
|----------|---------|
| Data-Dictionary.md | Sections 4-10 |
| DAL-Specification.md | Section 2 (Object Models) |
| Backend.md | Section 2 (Database Schema) |
| Architecture.md | Section 3 (Data Architecture) |

---

**END OF OBJECT MODEL REGISTRY v1.0**
