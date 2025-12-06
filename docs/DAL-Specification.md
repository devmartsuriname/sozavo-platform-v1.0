# SoZaVo Platform v1.0 – Data Access Layer (DAL) Specification

> **Version:** 1.0  
> **Status:** Implementation Blueprint  
> **Source:** Data Dictionary v1.0, Backend Documentation v2.0, Architecture v3.0  
> **Cross-References:** Schema-Lock-Specification.md, Backend.md, API-Reference.md

---

## 1. Purpose

This document defines the Data Access Layer specification including object models, query requirements, and mutation requirements for the SoZaVo Platform. It serves as the authoritative reference for all data operations.

---

## 2. Object Models

### 2.1 Citizen Model

| Property | Type | Source Table | Derived | Security Classification |
|----------|------|--------------|---------|------------------------|
| id | UUID | citizens.id | No | Internal |
| nationalId | string | citizens.national_id | No | PII |
| bisPersonId | string | citizens.bis_person_id | No | PII |
| firstName | string | citizens.first_name | No | PII |
| lastName | string | citizens.last_name | No | PII |
| fullName | string | Derived | Yes | PII |
| dateOfBirth | Date | citizens.date_of_birth | No | PII |
| age | number | Derived | Yes | Public |
| gender | string | citizens.gender | No | PII |
| address | string | citizens.address | No | PII |
| district | string | citizens.district | No | Public |
| phone | string | citizens.phone | No | PII |
| email | string | citizens.email | No | PII |
| householdMembers | HouseholdMember[] | citizens.household_members | No | PII |
| householdSize | number | Derived | Yes | Public |
| bisVerified | boolean | citizens.bis_verified | No | Internal |
| bisVerifiedAt | Date | citizens.bis_verified_at | No | Internal |
| createdAt | Date | citizens.created_at | No | Internal |
| updatedAt | Date | citizens.updated_at | No | Internal |

**Relationships:**
- cases: One-to-Many (Citizen → Cases)
- documents: One-to-Many (Citizen → Documents)
- payments: One-to-Many (Citizen → Payments)

---

### 2.2 Case Model

| Property | Type | Source Table | Derived | Security Classification |
|----------|------|--------------|---------|------------------------|
| id | UUID | cases.id | No | Internal |
| caseReference | string | cases.case_reference | No | Public |
| citizenId | UUID | cases.citizen_id | No | Internal |
| citizen | Citizen | Joined | No | PII |
| serviceTypeId | UUID | cases.service_type_id | No | Internal |
| serviceType | ServiceType | Joined | No | Public |
| currentStatus | CaseStatus | cases.current_status | No | Public |
| caseHandlerId | UUID | cases.case_handler_id | No | Internal |
| caseHandler | User | Joined | No | Internal |
| reviewerId | UUID | cases.reviewer_id | No | Internal |
| reviewer | User | Joined | No | Internal |
| intakeOfficeId | UUID | cases.intake_office_id | No | Internal |
| intakeOffice | Office | Joined | No | Public |
| intakeOfficerId | UUID | cases.intake_officer_id | No | Internal |
| wizardData | object | cases.wizard_data | No | PII |
| priority | string | cases.priority | No | Internal |
| notes | string | cases.notes | No | Internal |
| daysOpen | number | Derived | Yes | Public |
| createdAt | Date | cases.created_at | No | Internal |
| updatedAt | Date | cases.updated_at | No | Internal |
| closedAt | Date | cases.closed_at | No | Internal |

**Relationships:**
- citizen: Many-to-One (Case → Citizen)
- serviceType: Many-to-One (Case → ServiceType)
- caseHandler: Many-to-One (Case → User)
- reviewer: Many-to-One (Case → User)
- intakeOffice: Many-to-One (Case → Office)
- caseEvents: One-to-Many (Case → CaseEvents)
- documents: One-to-Many (Case → Documents)
- eligibilityEvaluations: One-to-Many (Case → EligibilityEvaluations)
- payments: One-to-Many (Case → Payments)

---

### 2.3 Document Model

| Property | Type | Source Table | Derived | Security Classification |
|----------|------|--------------|---------|------------------------|
| id | UUID | documents.id | No | Internal |
| caseId | UUID | documents.case_id | No | Internal |
| citizenId | UUID | documents.citizen_id | No | Internal |
| documentType | DocumentType | documents.document_type | No | Public |
| fileName | string | documents.file_name | No | Internal |
| filePath | string | documents.file_path | No | Internal |
| fileSize | number | documents.file_size | No | Public |
| mimeType | string | documents.mime_type | No | Internal |
| status | DocumentStatus | documents.status | No | Public |
| verifiedBy | UUID | documents.verified_by | No | Internal |
| verifiedAt | Date | documents.verified_at | No | Internal |
| rejectionReason | string | documents.rejection_reason | No | Internal |
| expiresAt | Date | documents.expires_at | No | Public |
| isExpired | boolean | Derived | Yes | Public |
| createdAt | Date | documents.created_at | No | Internal |
| updatedAt | Date | documents.updated_at | No | Internal |

---

### 2.4 Payment Model

| Property | Type | Source Table | Derived | Security Classification |
|----------|------|--------------|---------|------------------------|
| id | UUID | payments.id | No | Internal |
| caseId | UUID | payments.case_id | No | Internal |
| citizenId | UUID | payments.citizen_id | No | Internal |
| amount | Decimal | payments.amount | No | Financial |
| paymentDate | Date | payments.payment_date | No | Financial |
| status | PaymentStatus | payments.status | No | Public |
| subemaReference | string | payments.subema_reference | No | Financial |
| subemaSyncedAt | Date | payments.subema_synced_at | No | Internal |
| paymentMethod | string | payments.payment_method | No | Financial |
| bankAccount | string | payments.bank_account | No | PII |
| notes | string | payments.notes | No | Internal |
| createdAt | Date | payments.created_at | No | Internal |
| updatedAt | Date | payments.updated_at | No | Internal |

---

### 2.5 User Model

| Property | Type | Source Table | Derived | Security Classification |
|----------|------|--------------|---------|------------------------|
| id | UUID | users.id | No | Internal |
| authUserId | UUID | users.auth_user_id | No | Internal |
| email | string | users.email | No | Internal |
| fullName | string | users.full_name | No | Internal |
| officeId | UUID | users.office_id | No | Internal |
| districtId | string | users.district_id | No | Internal |
| roles | AppRole[] | Joined from user_roles | No | Internal |
| isActive | boolean | users.is_active | No | Internal |
| createdAt | Date | users.created_at | No | Internal |
| updatedAt | Date | users.updated_at | No | Internal |

---

### 2.6 Eligibility Evaluation Model

| Property | Type | Source Table | Derived | Security Classification |
|----------|------|--------------|---------|------------------------|
| id | UUID | eligibility_evaluations.id | No | Internal |
| caseId | UUID | eligibility_evaluations.case_id | No | Internal |
| result | string | eligibility_evaluations.result | No | Public |
| criteriaResults | object[] | eligibility_evaluations.criteria_results | No | Internal |
| overrideBy | UUID | eligibility_evaluations.override_by | No | Internal |
| overrideReason | string | eligibility_evaluations.override_reason | No | Internal |
| evaluatedAt | Date | eligibility_evaluations.evaluated_at | No | Internal |
| evaluatedBy | UUID | eligibility_evaluations.evaluated_by | No | Internal |
| passedRulesCount | number | Derived | Yes | Public |
| failedRulesCount | number | Derived | Yes | Public |

---

## 3. Query Requirements

### 3.1 Citizen Lookup

**Query Function:** `getCitizenByNationalId(nationalId: string)`

```typescript
// Input
nationalId: string // 9-digit national ID

// Output
{
  citizen: Citizen | null,
  found: boolean,
  bisVerified: boolean
}

// RLS Impact
// - Handlers see district citizens
// - Reviewers see all citizens
// - Audit sees all (read-only)
```

**Query Function:** `getCitizenById(id: UUID)`

```typescript
// Input
id: UUID

// Output
Citizen | null

// RLS Impact
// Same as above
```

**Query Function:** `searchCitizens(filters: CitizenSearchFilters)`

```typescript
// Input
{
  searchTerm?: string,      // name or national_id
  district?: string,
  bisVerified?: boolean,
  page?: number,
  pageSize?: number
}

// Output
{
  citizens: Citizen[],
  totalCount: number,
  page: number,
  pageSize: number
}
```

---

### 3.2 Case Retrieval

**Query Function:** `getCaseById(id: UUID)`

```typescript
// Input
id: UUID

// Output
Case | null

// Includes
citizen, serviceType, caseHandler, intakeOffice
```

**Query Function:** `getCaseByReference(caseReference: string)`

```typescript
// Input
caseReference: string // e.g., "SZ-202401-00001"

// Output
Case | null
```

**Query Function:** `getCases(filters: CaseFilters)`

```typescript
// Input
{
  status?: CaseStatus | CaseStatus[],
  serviceTypeId?: UUID,
  handlerId?: UUID,
  officeId?: UUID,
  district?: string,
  dateFrom?: Date,
  dateTo?: Date,
  page?: number,
  pageSize?: number,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc'
}

// Output
{
  cases: Case[],
  totalCount: number,
  page: number,
  pageSize: number
}

// RLS Impact
// - Handlers see assigned cases + district cases
// - Reviewers see under_review cases
// - Department heads see all
// - Audit sees all (read-only)
```

**Query Function:** `getCasesForReview()`

```typescript
// Output
Case[] // Where current_status = 'under_review'
```

---

### 3.3 Payment Previews

**Query Function:** `getPaymentPreview(caseId: UUID)`

```typescript
// Input
caseId: UUID

// Output
{
  case: Case,
  citizen: Citizen,
  calculatedAmount: Decimal,
  paymentFormula: string,
  formulaInputs: object,
  eligibleForPayment: boolean,
  blockers: string[]
}
```

**Query Function:** `getPaymentsByCase(caseId: UUID)`

```typescript
// Input
caseId: UUID

// Output
Payment[]
```

**Query Function:** `getPendingPayments(filters?: PaymentFilters)`

```typescript
// Input
{
  serviceTypeId?: UUID,
  district?: string,
  dateFrom?: Date,
  dateTo?: Date
}

// Output
Payment[] // Where status = 'pending'
```

---

### 3.4 Fraud Scoring Input

**Query Function:** `getFraudScoringData(caseId: UUID)`

```typescript
// Output
{
  case: Case,
  citizen: Citizen,
  previousCases: Case[],
  addressMatches: number,
  incomeHistory: Income[],
  bisVerificationResult: object,
  daysSinceLastRejection: number | null
}
```

---

### 3.5 Wizard Step Loading

**Query Function:** `getWizardConfig(serviceTypeCode: string)`

```typescript
// Input
serviceTypeCode: 'AB' | 'FB' | 'KB'

// Output
{
  steps: WizardStep[],
  totalSteps: number,
  estimatedTimeMinutes: number
}

// Source
configs/wizard/{serviceTypeCode}.json
```

**Query Function:** `getWizardProgress(caseId: UUID)`

```typescript
// Output
{
  currentStep: number,
  completedSteps: number[],
  wizardData: object
}
```

---

### 3.6 Eligibility Evaluation Queries

**Query Function:** `getEligibilityRules(serviceTypeId: UUID)`

```typescript
// Output
EligibilityRule[] // Where is_active = true, ordered by priority
```

**Query Function:** `getEligibilityEvaluation(caseId: UUID)`

```typescript
// Output
EligibilityEvaluation | null // Latest evaluation for case
```

---

## 4. Mutation Requirements

### 4.1 Create Operations

| Operation | Required Fields | Audit Logging | RLS Impact | Engine Triggers |
|-----------|-----------------|---------------|------------|-----------------|
| createCitizen | national_id, first_name, last_name, date_of_birth | Yes | District filter | None |
| createCase | citizen_id, service_type_id, intake_office_id, wizard_data | Yes | District filter | Fraud scan |
| createDocument | case_id, citizen_id, document_type, file_name, file_path | Yes | Case access | Document validation |
| createCaseEvent | case_id, event_type, actor_id | Yes | Case access | None |
| createPayment | case_id, citizen_id, amount, payment_date | Yes | Finance role | Payment engine |
| createEligibilityEvaluation | case_id, result, criteria_results | Yes | Handler role | None |

### 4.2 Update Operations

| Operation | Allowed Fields | Audit Logging | RLS Impact | Engine Triggers |
|-----------|----------------|---------------|------------|-----------------|
| updateCitizen | address, phone, email, household_members | Yes | District filter | None |
| updateCaseStatus | current_status | Yes | Role-based | Workflow engine |
| updateCaseHandler | case_handler_id | Yes | Admin/reviewer | None |
| updateDocumentStatus | status, verified_by, verified_at, rejection_reason | Yes | Handler role | Document engine |
| updatePaymentStatus | status, subema_reference, subema_synced_at | Yes | Admin role | Subema sync |

### 4.3 Delete Operations

| Operation | Allowed By | Audit Logging | Cascades |
|-----------|------------|---------------|----------|
| deleteDocument | Admin only | Yes | None |
| deleteCaseEvent | Not allowed | N/A | N/A |
| deleteCase | Not allowed (use close) | N/A | N/A |

### 4.4 Audit Logging Requirements

All mutations must log to `case_events` table:

```typescript
{
  case_id: UUID,           // If applicable
  event_type: string,      // create_*, update_*, delete_*
  actor_id: UUID,          // Current user
  meta: {
    table: string,
    record_id: UUID,
    old_values: object,    // For updates
    new_values: object,
    timestamp: Date
  }
}
```

### 4.5 Engine-Triggered Mutations

| Engine | Trigger Event | Mutations Performed |
|--------|---------------|---------------------|
| Workflow Engine | Status transition | Update case.current_status, Create case_event |
| Eligibility Engine | Evaluation complete | Create eligibility_evaluation, Update case.current_status |
| Fraud Engine | Scan complete | Create fraud_risk_score, Create case_event |
| Payment Engine | Batch processed | Update payment.status, Create case_event |
| Document Engine | Validation complete | Update document.status, Create case_event |

---

## 5. Cross-References

| Document | Section |
|----------|---------|
| Data-Dictionary.md | Sections 3-8 |
| Backend.md | Section 8 (Data Operations) |
| API-Reference.md | All endpoints |
| Schema-Lock-Specification.md | Validation rules |

---

**END OF DAL SPECIFICATION v1.0**
