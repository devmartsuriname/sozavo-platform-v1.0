# SoZaVo Platform v1.0 – Backend Documentation

> **Version:** 2.2 (Phase 10 Step 2 Complete)  
> **Status:** Phase 10 In Progress  
> **Source:** Synthesized from Phase Documents 1–17 and Technical Architecture
---

## Phase Roadmap Reference

### Phase 9 Admin MVP – COMPLETE ✅

Phase 9 defines the Admin MVP with **8 case-centric modules**. All modules are implemented and verified:

| Module | Description | Status |
|--------|-------------|--------|
| 2.1 Authentication & Role Shell | Login, logout, role-based access control | ✅ Complete |
| 2.2 Case Search & Overview | Case list with filters, pagination, search | ✅ Complete |
| 2.3 Case Detail & Timeline View | Case header, info panels, timeline events | ✅ Complete |
| 2.4 Eligibility Panel (case-level) | Eligibility evaluation display within Case Detail | ✅ Complete |
| 2.5 Documents Panel (case-level) | Documents listing within Case Detail | ✅ Complete |
| 2.6 Payments Panel (case-level) | Payments listing within Case Detail | ✅ Complete |
| 2.7 Fraud & Risk Panel (case-level) | Fraud signals and risk score within Case Detail | ✅ Complete |
| 2.8 Configuration (read-only) | System configuration overview page | ✅ Complete |

### MVP Scope Clarifications

**Case-Centric Processing**: All required views exist as panels inside Case Detail (`/admin/cases/:id`). No standalone dashboards are required for MVP.

**Deferred to Post-MVP**:
- Dashboard Analytics (demo mode acceptable for Phase 9)
- Standalone Eligibility Dashboard (`/admin/eligibility`)
- Standalone Documents Manager (`/admin/documents`)
- Standalone Payments & Batches (`/admin/payments`)
- Standalone Fraud & Investigations (`/admin/fraud`)
- User Management (`/admin/users`)
- Reporting & Analytics (`/admin/reports`)

### Phase 10+ Roadmap

| Phase | Focus | Scope |
|-------|-------|-------|
| Phase 10 | Processing Modules | Standalone pages for intake processing, eligibility review workflows |
| Phase 11 | Payments & Batches | Payment execution, batch management, Subema integration |
| Phase 12 | Fraud & Investigations | Fraud investigation workflows, signal management |
| Phase 13 | Documents & Verification | Document verification actions, upload workflows |
| Phase 14 | Eligibility Review Dashboard | Standalone eligibility management with override capabilities |
| Phase 15 | Reporting & Analytics | Dashboard analytics, KPIs, report generation, CSV/PDF exports |
| Phase 16 | User Management | User CRUD, role assignment, office management |
| Phase 17+ | Governance, Audit, Scaling | Audit trails, compliance, performance optimization |

---

## Phase 9D-2F – Configuration Query Layer

### Overview

Phase 9D-2F implements the read-only Configuration module, providing access to system configuration tables for all authenticated staff roles.

### Query Layer Created

**File:** `src/integrations/supabase/queries/config.ts`

| Function | Signature | Description |
|----------|-----------|-------------|
| `getServiceTypes` | `(limit?: number) → Promise<{data, error}>` | Returns service types ordered by code ASC (limit 20) |
| `getServiceTypesCount` | `() → Promise<{count, error}>` | Returns count of active service types |
| `getOffices` | `(limit?: number) → Promise<{data, error}>` | Returns offices ordered by district_id, name ASC (limit 20) |
| `getOfficesCount` | `() → Promise<{count, error}>` | Returns count of active offices |
| `getWorkflowDefinitions` | `(limit?: number) → Promise<{data, error}>` | Returns workflow definitions with service joins (limit 20) |
| `getWorkflowDefinitionsCount` | `() → Promise<{count, error}>` | Returns total workflow definition count |
| `getEligibilityRules` | `(limit?: number) → Promise<{data, error}>` | Returns eligibility rules with service joins (limit 20) |
| `getEligibilityRulesCount` | `() → Promise<{count, error}>` | Returns total eligibility rule count |

### Types Exported

```typescript
interface ServiceTypeRow {
  id: string;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface OfficeRow {
  id: string;
  name: string;
  district_id: string;
  address: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
}

interface WorkflowDefinitionRow {
  id: string;
  service_type_id: string;
  from_status: string;
  to_status: string;
  required_role: string;
  is_active: boolean;
  created_at: string;
  service_types?: { code: string; name: string } | null;
}

interface EligibilityRuleRow {
  id: string;
  service_type_id: string;
  rule_name: string;
  rule_type: string;
  condition: any;
  error_message: string;
  priority: number;
  is_mandatory: boolean;
  is_active: boolean;
  created_at: string;
  service_types?: { code: string; name: string } | null;
}
```

### Components Created

| Component | File | Purpose |
|-----------|------|---------|
| ConfigurationIndex | `src/pages/admin/configuration/Index.tsx` | Read-only configuration overview with summary cards and tables |

### Data Flow

```
ConfigurationIndex (useEffect)
    │
    ├── Parallel fetch (Promise.all):
    │   ├── getServiceTypes() → service_types table
    │   ├── getServiceTypesCount() → active count
    │   ├── getOffices() → offices table
    │   ├── getOfficesCount() → active count
    │   ├── getWorkflowDefinitions() → workflow_definitions + service_types join
    │   ├── getWorkflowDefinitionsCount() → total count
    │   ├── getEligibilityRules() → eligibility_rules + service_types join
    │   └── getEligibilityRulesCount() → total count
    │
    └── ConfigurationIndex
        ├── Summary Cards Row (4 cards: service types, offices, workflows, rules)
        ├── Service Types Table (code, name, description, status)
        ├── Offices Table (name, district, address, phone, status)
        ├── Workflow Transitions Table (service, from, to, role, status)
        └── Eligibility Rules Table (service, name, type, priority, mandatory, status)
```

### Read-Only Constraints

- No create, update, or delete operations
- No inline editing capabilities
- Maximum 20 rows per table (pagination deferred to Phase 10)
- No filtering controls (deferred to Phase 10)

### Role Access

All authenticated staff roles can view configuration data:
- `system_admin`, `department_head`, `audit_viewer` (existing)
- `case_handler`, `case_reviewer`, `district_intake_officer`, `finance_officer`, `fraud_officer` (added in Phase 9D-2F)

### RLS Access

All four configuration tables use `*_select_authenticated` RLS policies with `USING (true)`, allowing read access to any authenticated user.

---

## Phase 9D-2E – Fraud & Risk UI Module

### Overview

Phase 9D-2E implements the read-only Fraud & Risk UI module, displaying fraud signals and risk scores on the Case Detail page.

**TESTING NOTE:** Full evidence and description are exposed for Phase 9 testing. This MUST be role-scoped and redacted before production (Phase 10+).

### Query Layer Created

**File:** `src/integrations/supabase/queries/fraud.ts`

| Function | Signature | Description |
|----------|-----------|-------------|
| `getFraudSignalsByCase` | `(caseId: string) → Promise<{data, error}>` | Returns all fraud signals for a case, ordered by created_at descending |
| `getFraudRiskScoreByCase` | `(caseId: string) → Promise<{data, error}>` | Returns the risk score for a case (single row) |

### Types Exported

```typescript
interface CaseFraudSignal {
  id: string;
  case_id: string;
  signal_type: string;
  severity: string;        // low | medium | high | critical
  description: string;
  evidence: any | null;    // JSONB - exposed for testing only
  status: string;          // pending | investigating | confirmed | dismissed
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

interface CaseFraudRiskScore {
  id: string;
  case_id: string;
  risk_score: number;      // 0.00 - 100.00
  risk_level: string;      // minimal | low | medium | high | critical
  signal_count: number;
  last_evaluated_at: string;
  created_at: string;
  updated_at: string;
}
```

### Components Created

| Component | File | Purpose |
|-----------|------|---------|
| CaseFraudPanel | `src/components/admin/cases/CaseFraudPanel.tsx` | Displays risk summary and signals table with badges |

### Badge Mappings

**Severity Badge:**
| Value | Badge Variant |
|-------|---------------|
| `low` | secondary |
| `medium` | warning |
| `high` | danger |
| `critical` | danger |

**Signal Status Badge:**
| Value | Badge Variant |
|-------|---------------|
| `pending` | warning |
| `investigating` | primary |
| `confirmed` | danger |
| `dismissed` | secondary |

**Risk Level Badge:**
| Value | Badge Variant |
|-------|---------------|
| `minimal` | success |
| `low` | success |
| `medium` | warning |
| `high` | danger |
| `critical` | danger |

### Helper Functions

| Function | Purpose |
|----------|---------|
| `formatSignalType(type)` | Converts `income_discrepancy` → "Income Discrepancy" |
| `formatDateTime(ts)` | Formats ISO timestamp to readable datetime |
| `formatRiskScore(score)` | Formats to 1 decimal place (e.g., "82.5") |
| `getSeverityBadgeVariant(severity)` | Maps severity to badge variant |
| `getStatusBadgeVariant(status)` | Maps status to badge variant |
| `getRiskLevelBadgeVariant(level)` | Maps risk level to badge variant |
| `truncateDescription(desc)` | Truncates to 50 chars with ellipsis |

### Data Flow

```
CaseDetailPage
    │
    ├── getCaseById(id) → caseData
    │
    ├── After caseData loads (parallel):
    │   ├── getFraudSignalsByCase(id) → fraud_signals table
    │   │       │
    │   │       └── Returns: [ { signal_type, severity, status, description, ... }, ... ]
    │   │
    │   └── getFraudRiskScoreByCase(id) → fraud_risk_scores table
    │           │
    │           └── Returns: { risk_score, risk_level, signal_count, last_evaluated_at }
    │
    └── CaseFraudPanel
        ├── Risk Summary Block (score, level, count, last evaluated)
        └── Signals Table (type, severity, status, description, detected at)
```

### Read-Only Constraints

- No investigation workflows or actions
- No signal dismissal or escalation
- No fraud rule editing
- No case locking based on fraud status
- Display only: risk summary + signals listing

### RLS Access

- `fraud_signals` and `fraud_risk_scores` tables are role-restricted
- Access limited to: `system_admin`, `fraud_officer`, `department_head`
- Full role-based scoping and data redaction deferred to Phase 10+

---

## Phase 9D-2D – Payments UI Module

### Overview

Phase 9D-2D implements the read-only Payments UI module, displaying case payments on the Case Detail page.

### Query Layer Created

**File:** `src/integrations/supabase/queries/payments.ts`

| Function | Signature | Description |
|----------|-----------|-------------|
| `getCasePayments` | `(caseId: string) → Promise<{data, error}>` | Returns all payments for a case, ordered by payment_date descending |

### Types Exported

```typescript
interface CasePayment {
  id: string;
  case_id: string;
  citizen_id: string;
  amount: number;
  payment_date: string;
  status: string;           // pending | processed | failed | cancelled
  payment_method: string | null;
  bank_account: string | null;
  subema_reference: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
```

### Components Created

| Component | File | Purpose |
|-----------|------|---------|
| CasePaymentsPanel | `src/components/admin/cases/CasePaymentsPanel.tsx` | Displays payments table with status badges and currency formatting |

### Status Badge Mapping

| Status Value | Badge Variant | Label |
|--------------|---------------|-------|
| `pending` | warning (soft) | Pending |
| `processed` | success (soft) | Processed |
| `failed` | danger (soft) | Failed |
| `cancelled` | secondary (soft) | Cancelled |

### Helper Functions

| Function | Purpose |
|----------|---------|
| `formatCurrency(amount)` | Converts 2500 → "SRD 2,500.00" |
| `formatPaymentMethod(method)` | Converts `bank` → "Bank Transfer" |
| `formatDate(dateString)` | Formats ISO date to readable format |
| `getStatusBadgeVariant(status)` | Maps status to badge variant |

### Data Flow

```
CaseDetailPage
    │
    ├── getCaseById(id) → caseData
    │
    ├── After caseData loads:
    │   └── getCasePayments(id) → payments table
    │           │
    │           └── Returns: [ { amount, payment_date, status, payment_method, ... }, ... ]
    │
    └── CasePaymentsPanel
        ├── Payment date column (formatted)
        ├── Amount column (SRD currency)
        ├── Method column (human-readable)
        ├── Status badge (variant by status)
        └── Reference column (Subema ref or "—")
```

### Read-Only Constraints

- No payment execution, approval, or cancellation actions
- No batch management or creation
- No Subema sync triggers
- Display only: payment history listing

---

## Phase 9D-2C – Documents UI Module

### Overview

Phase 9D-2C implements the read-only Documents UI module, displaying case documents on the Case Detail page.

### Query Layer Created

**File:** `src/integrations/supabase/queries/documents.ts`

| Function | Signature | Description |
|----------|-----------|-------------|
| `getCaseDocuments` | `(caseId: string) → Promise<{data, error}>` | Returns all documents for a case, ordered by created_at descending |

### Types Exported

```typescript
interface CaseDocument {
  id: string;
  case_id: string | null;
  citizen_id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  status: string;
  verified_by: string | null;
  verified_at: string | null;
  rejection_reason: string | null;
  expires_at: string | null;
  created_at: string;
}
```

### Components Created

| Component | File | Purpose |
|-----------|------|---------|
| CaseDocumentsPanel | `src/components/admin/cases/CaseDocumentsPanel.tsx` | Displays documents table with status badges and metadata |

### Status Badge Mapping

| Status Value | Badge Variant | Label |
|--------------|---------------|-------|
| `pending` | warning (soft) | Pending |
| `verified` | success (soft) | Verified |
| `rejected` | danger (soft) | Rejected |
| `expired` | secondary (soft) | Expired |

### Helper Functions

| Function | Purpose |
|----------|---------|
| `formatDocumentType(type)` | Converts `id_card` → "ID Card" |
| `formatFileSize(bytes)` | Converts 102400 → "100.00 KB" |
| `formatDate(dateString)` | Formats ISO date to readable format |

### Data Flow

```
CaseDetailPage
    │
    ├── getCaseById(id) → caseData
    │
    ├── After caseData loads:
    │   └── getCaseDocuments(id) → documents table
    │           │
    │           └── Returns: [ { file_name, document_type, status, created_at, ... }, ... ]
    │
    └── CaseDocumentsPanel
        ├── Document type column (formatted)
        ├── File name column
        ├── File size column (formatted)
        ├── Status badge (variant by status)
        └── Upload date column (formatted)
```

### Read-Only Constraints

- No upload, verify, reject, or delete operations
- No file download functionality (deferred to future phase)
- Display only: document metadata listing
- `file_path` stored but not exposed as download link

---

## Phase 9D-2B – Eligibility UI Module

### Overview

Phase 9D-2B implements the read-only Eligibility UI module, displaying eligibility evaluations and rules on the Case Detail page.

### Query Layer Created

**File:** `src/integrations/supabase/queries/eligibility.ts`

| Function | Signature | Description |
|----------|-----------|-------------|
| `getEligibilitySummary` | `(caseId: string) → Promise<{data, error}>` | Returns most recent eligibility evaluation for a case |
| `getEligibilityRulesForService` | `(serviceTypeId: string) → Promise<{data, error}>` | Returns active eligibility rules for a service type |

### Types Exported

```typescript
interface EligibilityEvaluation {
  id: string;
  case_id: string;
  result: string;
  criteria_results: Record<string, boolean>;
  evaluated_at: string;
  evaluated_by: string | null;
  override_by: string | null;
  override_reason: string | null;
}

interface EligibilityRule {
  id: string;
  rule_name: string;
  rule_type: string;
  is_mandatory: boolean;
  priority: number;
  is_active: boolean;
  error_message: string;
  service_type_id: string;
  condition: Record<string, unknown>;
}
```

### Components Created

| Component | File | Purpose |
|-----------|------|---------|
| EligibilityResultBadge | `src/components/admin/cases/EligibilityResultBadge.tsx` | Maps result to visual badge (Eligible/Ineligible/Pending) |
| CaseEligibilityPanel | `src/components/admin/cases/CaseEligibilityPanel.tsx` | Displays eligibility summary and criteria results table |

### Result Badge Mapping

| Result Value | Badge Variant | Label |
|--------------|---------------|-------|
| `ELIGIBLE` / `approved` | success (soft) | Eligible |
| `INELIGIBLE` / `rejected` | danger (soft) | Ineligible |
| `pending` / null / other | secondary (soft) | Pending |

### Data Flow

```
CaseDetailPage
    │
    ├── getCaseById(id) → caseData (includes service_type_id)
    │
    ├── After caseData loads:
    │   ├── getEligibilitySummary(id) → eligibility_evaluations table
    │   │       │
    │   │       └── Returns: { result, criteria_results, evaluated_at, override_reason, ... }
    │   │
    │   └── getEligibilityRulesForService(service_type_id) → eligibility_rules table
    │           │
    │           └── Returns: [ { rule_name, is_mandatory, ... }, ... ]
    │
    └── CaseEligibilityPanel
        ├── EligibilityResultBadge (result → visual badge)
        ├── Override info (if override_reason exists)
        └── Criteria Results Table (matched with rules for metadata)
```

### Read-Only Constraints

- No create, update, or delete operations
- No eligibility recalculation actions
- No rule editing capabilities
- Display only: evaluation summary + criteria breakdown

---

## Phase 9D-2A – Cases UI Scaffolding

### Overview

Phase 9D-2A implements the read-only Cases module UI using Darkone Admin styling, wired to the Phase 9D-1A Cases Query Layer.

### Components Created

| Component | File | Purpose |
|-----------|------|---------|
| CasesIndexPage | `src/pages/admin/cases/Index.tsx` | Cases list page with filters, table, pagination |
| CaseDetailPage | `src/pages/admin/cases/Detail.tsx` | Case detail view with info panels and timeline |
| CaseStatusBadge | `src/components/admin/cases/CaseStatusBadge.tsx` | Status enum to visual badge mapping |
| CaseFilters | `src/components/admin/cases/CaseFilters.tsx` | Search and filter controls |
| CaseListTable | `src/components/admin/cases/CaseListTable.tsx` | Tabular case list with actions |
| CaseDetailHeader | `src/components/admin/cases/CaseDetailHeader.tsx` | Detail page header with back navigation |
| CaseInfoPanel | `src/components/admin/cases/CaseInfoPanel.tsx` | Case metadata display |
| CitizenInfoPanel | `src/components/admin/cases/CitizenInfoPanel.tsx` | Citizen information display |
| ServiceInfoPanel | `src/components/admin/cases/ServiceInfoPanel.tsx` | Service type information display |
| CaseTimeline | `src/components/admin/cases/CaseTimeline.tsx` | Case events timeline |
| CaseEligibilityPlaceholder | `src/components/admin/cases/placeholders/...` | Future eligibility section |
| CaseDocumentsPlaceholder | `src/components/admin/cases/placeholders/...` | Future documents section |
| CasePaymentsPlaceholder | `src/components/admin/cases/placeholders/...` | Future payments section |
| CaseFraudPlaceholder | `src/components/admin/cases/placeholders/...` | Future fraud section |

### Query Layer Usage

| Page | Query Functions Used |
|------|---------------------|
| CasesIndexPage | `getCases(params)` |
| CaseDetailPage | `getCaseById(id)`, `getCaseTimeline(id)` |

### Routing

| Route | Component | RequireRole |
|-------|-----------|-------------|
| `/admin/cases` | CasesIndexPage | `["cases"]` |
| `/admin/cases/:id` | CaseDetailPage | `["cases"]` |

### Read-Only Constraints

- No create, update, or delete operations
- No status transitions or workflow controls
- No inline editing capabilities
- Navigation only: list ↔ detail, back to overview

### Data Flow

```
CasesIndexPage
    │
    ├── Filter State (page, search, status, serviceTypeId, officeId)
    │
    └── getCases({ page, pageSize, search, status, ... })
            │
            └── Supabase Client (RLS) → cases + citizens + service_types
                    │
                    └── CaseListTable (render list with CaseStatusBadge)

CaseDetailPage
    │
    ├── getCaseById(id) → CaseInfoPanel, CitizenInfoPanel, ServiceInfoPanel
    │
    └── getCaseTimeline(id) → CaseTimeline
```

---

## Phase 9D-1 Query Layer Implementation

### Cases Query Module

**File:** `src/integrations/supabase/queries/cases.ts`

The Cases Query Module provides RLS-protected data access for the Cases Admin MVP module.

#### Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `getCases` | `(params: GetCasesParams) → Promise<{data, count, error}>` | Paginated case list with citizen/service joins |
| `getCaseById` | `(caseId: string) → Promise<{data, error}>` | Full case details with all contextual joins |
| `getCaseTimeline` | `(caseId: string) → Promise<{data, error}>` | Case events sorted by created_at DESC |

#### GetCasesParams Interface
```typescript
interface GetCasesParams {
  page?: number;       // default: 1
  pageSize?: number;   // default: 10
  search?: string;     // matches case_reference (ilike)
  status?: CaseStatus; // filter by current_status
  serviceTypeId?: string;
  officeId?: string;
}
```

#### Return Types
```typescript
// getCases returns
interface CaseWithRelations {
  id, case_reference, citizen_id, service_type_id, current_status, created_at,
  citizens: { first_name, last_name } | null,
  service_types: { name } | null
}

// getCaseById returns
interface CaseDetailWithRelations {
  ...Case,  // all case fields
  citizens: Citizen | null,
  service_types: { id, name, description, code } | null,
  offices: { name, district_id } | null
}

// getCaseTimeline returns
interface TimelineEvent {
  id, event_type, old_status, new_status, meta, created_at, actor_id
}
```

#### Data Flow
```
Page Component → getCases() → Supabase Client (authenticated) → RLS Filter → cases table
                                                                              ↓
                                                              Joined: citizens, service_types
```

---

## Phase 9D-0 Implementation Status

### Database Schema Creation (Complete)

Phase 9D-0 created the complete database schema for the Admin MVP modules following Data Dictionary v1.0 specifications.

#### Enums Created (9 total)
| Enum | Values | Purpose |
|------|--------|---------|
| `case_status` | intake, validation, eligibility_check, under_review, approved, rejected, payment_pending, payment_processed, closed, on_hold | Case lifecycle states |
| `document_type` | id_card, income_proof, medical_certificate, birth_certificate, school_enrollment, residency_proof, bank_statement, marriage_certificate, death_certificate, household_composition | Document classification |
| `document_status` | pending, verified, rejected, expired | Document verification states |
| `payment_status` | pending, processed, failed, cancelled | Payment processing states |
| `batch_status` | draft, pending_approval, approved, submitted, processing, completed, failed, cancelled | Batch lifecycle states |
| `payment_item_status` | pending, submitted, processing, completed, failed, returned | Individual payment item states |
| `fraud_severity` | low, medium, high, critical | Fraud signal severity levels |
| `risk_level` | minimal, low, medium, high, critical | Risk score categories |
| `audit_event_type` | create, read, update, delete, login, logout, export, import, approval, rejection, override, escalation | Audit event classification |

#### Tables Created (22 total)
| # | Table | RLS | Purpose |
|---|-------|-----|---------|
| 1 | `service_types` | ✓ | Social service definitions (AB, FB, KB) |
| 2 | `offices` | ✓ | District office locations |
| 3 | `users` | ✓ | Internal staff profiles (separate from auth.users) |
| 4 | `citizens` | ✓ | Central Citizen Record (CCR) |
| 5 | `cases` | ✓ | Social service case records |
| 6 | `case_events` | ✓ | Case audit trail |
| 7 | `documents` | ✓ | Document metadata |
| 8 | `eligibility_rules` | ✓ | Eligibility criteria definitions |
| 9 | `eligibility_evaluations` | ✓ | Eligibility evaluation results |
| 10 | `document_requirements` | ✓ | Required documents per service |
| 11 | `workflow_definitions` | ✓ | Status transition rules |
| 12 | `payments` | ✓ | Payment records |
| 13 | `payment_batches` | ✓ | Payment batch groupings |
| 14 | `payment_items` | ✓ | Individual batch payment items |
| 15 | `fraud_signals` | ✓ | Detected fraud indicators |
| 16 | `fraud_risk_scores` | ✓ | Aggregated risk scores per case |
| 17 | `notifications` | ✓ | Internal staff notifications |
| 18 | `portal_notifications` | ✓ | Citizen-facing notifications |
| 19 | `households` | ✓ | Household composition records |
| 20 | `incomes` | ✓ | Income records for eligibility |
| 21 | `subema_sync_logs` | ✓ | Subema integration audit trail |
| 22 | `wizard_definitions` | ✓ | Wizard step configurations |

#### Security Definer Functions Created (10 total)
| Function | Purpose |
|----------|---------|
| `current_user_id()` | Returns `auth.uid()` |
| `get_user_internal_id()` | Returns internal `users.id` from auth user |
| `has_case_access(_case_id)` | MVP placeholder (returns TRUE for authenticated) |
| `is_case_handler()` | Checks if user has case_handler role |
| `is_case_reviewer()` | Checks if user has case_reviewer role |
| `is_finance_officer()` | Checks if user has finance_officer role |
| `is_fraud_officer()` | Checks if user has fraud_officer role |
| `is_department_head()` | Checks if user has department_head role |
| `is_audit_viewer()` | Checks if user has audit_viewer role |
| `is_district_intake_officer()` | Checks if user has district_intake_officer role |

#### RLS Policies Created (22 SELECT policies)
All tables have RLS enabled with read-only policies for MVP:
- **Open to authenticated**: service_types, offices, users, citizens, eligibility_rules, document_requirements, workflow_definitions, households, wizard_definitions
- **Case-access based**: cases, case_events, documents, eligibility_evaluations, payments, incomes
- **Role-restricted**: payment_batches, payment_items (finance), fraud_signals, fraud_risk_scores (fraud), subema_sync_logs (finance)
- **User-scoped**: notifications (own), portal_notifications (own citizen)

#### Seed Data Inserted
- 3 service types (AB, FB, KB)
- 3 offices (Paramaribo, Nickerie, Wanica)
- 3 sample citizens
- 3 sample cases (different statuses)
- 2 case events
- 2 documents
- 1 eligibility evaluation
- 1 payment batch
- 1 payment
- 1 fraud signal
- 1 fraud risk score

---

## Phase 9C Implementation Status

### Role-Based Access Control (RBAC) Layer

#### Module Permission System
The platform implements a centralized role-to-module mapping for sidebar visibility and route protection:

**File:** `src/integrations/supabase/permissions/rolePermissions.ts`

| Role | Allowed Modules |
|------|-----------------|
| `system_admin` | dashboard, cases, eligibility, documents, payments, fraud, config, users, ui_kit |
| `case_handler` | dashboard, cases, eligibility, documents |
| `case_reviewer` | dashboard, cases, eligibility, documents |
| `department_head` | dashboard, cases, eligibility, documents, payments, fraud, config |
| `finance_officer` | dashboard, payments |
| `fraud_officer` | dashboard, fraud, cases, documents |
| `audit_viewer` | dashboard, config |
| `district_intake_officer` | dashboard, cases, documents |
| `citizen` | *(no admin access)* |

#### Access Control Components
| Component | File | Purpose |
|-----------|------|---------|
| `RequireAuth` | `src/components/auth/RequireAuth.tsx` | Route protection (auth required) |
| `RequireRole` | `src/components/auth/RequireRole.tsx` | Module-level authorization |
| `rolePermissions` | `src/integrations/supabase/permissions/rolePermissions.ts` | Central permission mapping |
| `AccessDenied` | `src/pages/admin/AccessDenied.tsx` | Unauthorized access page |

#### Helper Functions
- `getAllowedModules(roles: string[]) → Set<ModuleKey>` – Computes allowed modules from roles
- `hasModuleAccess(roles: string[], requiredModules: ModuleKey[]) → boolean` – Checks access

---

## Phase 9B Implementation Status

### Supabase Connection
- **Project ID:** `egsaecmmdmbpalmqwjqt`
- **Client File:** `src/integrations/supabase/client.ts`
- **Config File:** `supabase/config.toml`
- **Environment Variables:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`

### Implemented Schema (Phase 9B)

#### app_role Enum (9 roles)
```sql
CREATE TYPE public.app_role AS ENUM (
  'citizen', 'district_intake_officer', 'case_handler', 'case_reviewer',
  'department_head', 'finance_officer', 'fraud_officer', 'system_admin', 'audit_viewer'
);
```

#### user_roles Table
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | References `auth.users(id)` ON DELETE CASCADE |
| `role` | app_role | The assigned role |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

#### Security Definer Functions
- `has_role(_user_id UUID, _role app_role) → BOOLEAN` – Checks if user has specific role
- `is_admin() → BOOLEAN` – Checks if current user is system_admin

#### RLS Policies on user_roles
- `user_roles_select_own` – Users can view only their own roles
- `user_roles_admin_manage` – Admins can manage all roles

### Frontend Auth Components
- `src/integrations/supabase/AuthContext.tsx` – Session, user, roles, signIn/signOut
- `src/components/auth/RequireAuth.tsx` – Route protection wrapper
- `src/integrations/supabase/queries/userRoles.ts` – Role query functions

---

## 1. Backend Overview

### 1.1 Technology Stack
| Component | Technology |
|-----------|------------|
| Database | PostgreSQL (Supabase) |
| Authentication | Supabase Auth |
| File Storage | Supabase Storage |
| Edge Functions | Supabase Edge Functions (Deno) |
| Real-time | Supabase Realtime (subscriptions) |

### 1.2 Backend Responsibilities
- Data persistence and integrity
- Authentication and authorization
- Row-level security enforcement
- External system integrations
- Scheduled tasks and background jobs
- File storage management

---

## 2. Database Schema

### 2.1 Table Creation Order
Tables must be created in dependency order:

1. `service_types`
2. `offices`
3. `citizens`
4. `users`
5. `cases`
6. `case_events`
7. `documents`
8. `eligibility_rules`
9. `eligibility_evaluations`
10. `document_requirements`
11. `workflow_definitions`
12. `payments`
13. `notifications`
14. `portal_notifications`

### 2.2 Core Tables

#### service_types
```sql
CREATE TABLE service_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### citizens
```sql
CREATE TABLE citizens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  national_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT,
  address TEXT,
  district TEXT,
  phone TEXT,
  email TEXT,
  household_members JSONB DEFAULT '[]',
  bis_verified BOOLEAN DEFAULT false,
  bis_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### cases
```sql
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_reference TEXT UNIQUE NOT NULL,
  citizen_id UUID REFERENCES citizens(id) NOT NULL,
  service_type_id UUID REFERENCES service_types(id) NOT NULL,
  current_status TEXT NOT NULL DEFAULT 'intake',
  case_handler_id UUID REFERENCES users(id),
  intake_office_id UUID REFERENCES offices(id),
  wizard_data JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### case_events
```sql
CREATE TABLE case_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id) NOT NULL,
  event_type TEXT NOT NULL,
  actor_id UUID REFERENCES users(id),
  previous_status TEXT,
  new_status TEXT,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### documents
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id) NOT NULL,
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  status TEXT DEFAULT 'pending',
  expires_at DATE,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### eligibility_evaluations
```sql
CREATE TABLE eligibility_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id) NOT NULL,
  result TEXT NOT NULL,
  criteria_results JSONB NOT NULL,
  override_reason TEXT,
  overridden_by UUID REFERENCES users(id),
  evaluated_at TIMESTAMPTZ DEFAULT now()
);
```

#### payments
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  payment_type TEXT NOT NULL,
  payment_date DATE,
  status TEXT DEFAULT 'pending',
  subema_reference TEXT,
  subema_synced_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.3 Enumerations
```sql
CREATE TYPE case_status AS ENUM (
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

CREATE TYPE document_type AS ENUM (
  'id_card',
  'income_proof',
  'medical_certificate',
  'birth_certificate',
  'school_enrollment',
  'address_proof',
  'marriage_certificate',
  'other'
);

CREATE TYPE document_status AS ENUM (
  'pending',
  'verified',
  'rejected',
  'expired'
);

CREATE TYPE user_role AS ENUM (
  'system_admin',
  'district_intake_officer',
  'case_handler',
  'case_reviewer',
  'department_head',
  'audit'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'processed',
  'failed'
);
```

### 2.4 Required Indexes
```sql
CREATE INDEX idx_cases_citizen ON cases(citizen_id);
CREATE INDEX idx_cases_status ON cases(current_status);
CREATE INDEX idx_cases_handler ON cases(case_handler_id);
CREATE INDEX idx_cases_service ON cases(service_type_id);
CREATE INDEX idx_case_events_case ON case_events(case_id);
CREATE INDEX idx_documents_case ON documents(case_id);
CREATE INDEX idx_citizens_national_id ON citizens(national_id);
CREATE INDEX idx_payments_case ON payments(case_id);
CREATE INDEX idx_payments_status ON payments(status);
```

---

## 3. Row-Level Security (RLS)

### 3.1 RLS-Enabled Tables
- citizens
- cases
- case_events
- documents
- eligibility_evaluations
- payments
- users
- offices

### 3.2 Policy Patterns

#### Helper Function
```sql
CREATE OR REPLACE FUNCTION get_user_context()
RETURNS TABLE (
  user_id UUID,
  user_role TEXT,
  user_office_id UUID,
  user_district_id UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id,
    role,
    office_id,
    district_id
  FROM users
  WHERE auth_user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### Citizens Table Policies
```sql
-- Handlers see citizens in their district
CREATE POLICY "handlers_read_district_citizens"
ON citizens FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.auth_user_id = auth.uid()
    AND u.role IN ('case_handler', 'district_intake_officer')
    AND u.district_id = citizens.district
  )
);

-- Reviewers and admins see all
CREATE POLICY "reviewers_admins_read_all"
ON citizens FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.auth_user_id = auth.uid()
    AND u.role IN ('case_reviewer', 'department_head', 'system_admin', 'audit')
  )
);
```

#### Cases Table Policies
```sql
-- Handlers see cases assigned to them or in their district
CREATE POLICY "handlers_read_cases"
ON cases FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.auth_user_id = auth.uid()
    AND (
      u.role = 'system_admin'
      OR cases.case_handler_id = u.id
      OR (u.role = 'district_intake_officer' AND cases.intake_office_id = u.office_id)
    )
  )
);

-- Reviewers see cases under_review
CREATE POLICY "reviewers_read_under_review"
ON cases FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.auth_user_id = auth.uid()
    AND u.role = 'case_reviewer'
    AND cases.current_status = 'under_review'
  )
);
```

### 3.3 Secure Query Pattern
All queries must use authenticated Supabase client:

```typescript
// Correct pattern
const { data, error } = await supabase
  .from('cases')
  .select('*')
  .eq('current_status', 'under_review');

// NEVER use service role key in frontend
```

---

## 4. Edge Functions

### 4.1 Function Overview

| Function | Purpose | Auth Required |
|----------|---------|---------------|
| bis-lookup | Query BIS for citizen data | Yes |
| subema-sync | Sync payments with Subema | Yes |
| eligibility-evaluate | Run eligibility check | Yes |
| send-notification | Send email/SMS notifications | Yes |
| generate-report | Generate CSV reports | Yes |

### 4.2 BIS Lookup Function

**Endpoint:** `/functions/v1/bis-lookup`

**Request:**
```json
{
  "national_id": "123456789"
}
```

**Response:**
```json
{
  "found": true,
  "data": {
    "national_id": "123456789",
    "first_name": "Jan",
    "last_name": "Jansen",
    "date_of_birth": "1985-03-15",
    "address": "Kernkampweg 42",
    "district": "Paramaribo"
  }
}
```

**Error Response:**
```json
{
  "found": false,
  "error": "Citizen not found in BIS"
}
```

### 4.3 Subema Sync Function

**Endpoint:** `/functions/v1/subema-sync`

**Request:**
```json
{
  "action": "submit_batch",
  "payment_ids": ["uuid1", "uuid2"]
}
```

**Response:**
```json
{
  "success": true,
  "processed": 2,
  "results": [
    { "payment_id": "uuid1", "subema_reference": "SUB-2024-001" },
    { "payment_id": "uuid2", "subema_reference": "SUB-2024-002" }
  ]
}
```

### 4.4 Standard Edge Function Template

```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { data: userData, error: userError } = await supabaseClient.auth.getUser();
    if (userError) throw new Error("Unauthorized");

    const body = await req.json();
    
    // Function logic here
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

---

## 4.5 Admin Theme Persistence

The Darkone admin theme uses browser localStorage for persisting user preferences:

| Key | Values | Purpose |
|-----|--------|---------|
| `darkone-theme` | `"light"` \| `"dark"` | Theme mode preference |
| `darkone-sidebar-size` | `"default"` \| `"condensed"` | Sidebar collapsed state |

**Implementation Notes:**
- Theme is initialized on `AdminLayout` mount
- Applied via HTML attributes: `data-bs-theme` and `data-sidebar-size`
- CSS variables in `darkone.css` respond to these attributes
- No database storage required for theme preferences

---

## 5. Authentication

### 5.1 Internal Users (Admin System)
- Email/password authentication
- User record in `users` table linked to `auth.users`
- Role stored in `users.role`
- Session management via Supabase Auth

### 5.2 Citizens (Public Portal)
- Email/password authentication
- Stored in `auth.users`
- Linked to `citizens` table via lookup
- Separate from internal user pool

### 5.3 Session Handling
```typescript
// Check authentication
const { data: { user }, error } = await supabase.auth.getUser();

// Get user role
const { data: userData } = await supabase
  .from('users')
  .select('role, office_id, district_id')
  .eq('auth_user_id', user.id)
  .single();
```

---

## 6. Storage

### 6.1 Bucket Structure
```
documents/
├── cases/
│   └── {case_id}/
│       └── {document_type}_{timestamp}.{ext}
└── temp/
    └── {upload_id}.{ext}
```

### 6.2 Storage Policies
- Documents bucket: authenticated access only
- Read access follows case access rules
- Upload requires authenticated user
- Delete restricted to admins

### 6.3 Upload Pattern
```typescript
const { data, error } = await supabase.storage
  .from('documents')
  .upload(`cases/${caseId}/${fileName}`, file);
```

---

## 7. Business Logic Engines

### 7.1 Workflow Engine
**Location:** `src/integrations/engines/workflowEngine.ts`

**Responsibilities:**
- Validate status transitions
- Apply transitions with actor context
- Log events to case_events
- Enforce role permissions

**Key Functions:**
- `transitionCase(caseId, newStatus, actorId)`
- `getValidTransitions(currentStatus, userRole)`
- `isTransitionAllowed(from, to, serviceType)`

### 7.2 Eligibility Engine
**Location:** `src/integrations/engines/eligibilityEngine.ts`

**Responsibilities:**
- Load rules for service type
- Evaluate criteria against case data
- Store evaluation results
- Support manual overrides

**Key Functions:**
- `evaluateEligibility(caseId)`
- `getEligibilityRules(serviceTypeId)`
- `overrideEligibility(evaluationId, reason, actorId)`

### 7.3 Document Validation Engine
**Location:** `src/integrations/engines/documentValidationEngine.ts`

**Responsibilities:**
- Check required documents
- Validate document status
- Track expiration
- Generate missing document list

**Key Functions:**
- `validateDocuments(caseId)`
- `getRequiredDocuments(serviceTypeId)`
- `getMissingDocuments(caseId)`

---

## 8. Data Operations

### 8.1 Query Functions Location
All query functions in: `src/integrations/supabase/queries/`

| File | Purpose |
|------|---------|
| cases.ts | Case CRUD operations |
| citizens.ts | Citizen CRUD operations |
| documents.ts | Document operations |
| reports.ts | Reporting queries |
| eligibility.ts | Eligibility operations |

### 8.2 Standard Query Pattern
```typescript
export async function getCaseById(caseId: string) {
  const { data, error } = await supabase
    .from('cases')
    .select(`
      *,
      citizen:citizens(*),
      service_type:service_types(*),
      handler:users(*)
    `)
    .eq('id', caseId)
    .single();
  
  if (error) throw error;
  return data;
}
```

### 8.3 Pagination Pattern
```typescript
export async function getCases(page: number, pageSize: number = 20) {
  const from = page * pageSize;
  const to = from + pageSize - 1;
  
  const { data, error, count } = await supabase
    .from('cases')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false });
  
  return { data, count, page, pageSize };
}
```

---

## 9. MVP vs Extended Backend

### 9.1 MVP Backend (Phases 1–9)
- Database schema creation
- Basic CRUD operations
- Authentication setup
- RLS policies
- Document storage
- Eligibility engine
- Workflow engine
- Portal notifications (internal)

### 9.2 Extended Backend (Phases 10–17)
- BIS integration edge function
- Subema integration edge function
- Payment processing logic
- Email notifications
- SMS notifications
- Audit logging enhancements
- Fraud detection rules
- Performance optimizations

---

## 10. Error Handling

### 10.1 Database Errors
```typescript
try {
  const { data, error } = await supabase.from('cases').insert(caseData);
  if (error) {
    if (error.code === '23505') {
      throw new Error('Duplicate case reference');
    }
    if (error.code === '42501') {
      throw new Error('Permission denied');
    }
    throw error;
  }
} catch (e) {
  console.error('Database error:', e);
  throw e;
}
```

### 10.2 Edge Function Errors
- Log all errors with context
- Return structured error responses
- Never expose internal details to client

---

## 11. Scheduled Tasks

### 11.1 Planned Tasks (Extended Phase)
| Task | Frequency | Purpose |
|------|-----------|---------|
| payment-sync | Daily | Sync payment status with Subema |
| document-expiry-check | Daily | Flag expired documents |
| notification-digest | Daily | Send notification summaries |
| audit-log-archive | Weekly | Archive old audit logs |

---

## 12. Secrets Management

### 12.1 Required Secrets
| Secret | Purpose |
|--------|---------|
| BIS_API_KEY | BIS integration authentication |
| BIS_API_URL | BIS API endpoint |
| SUBEMA_API_KEY | Subema payment integration |
| SUBEMA_API_URL | Subema API endpoint |
| RESEND_API_KEY | Email sending (future) |

### 12.2 Secret Usage
- Stored in Supabase project secrets
- Accessed via `Deno.env.get()` in edge functions
- Never exposed to frontend

---

## 13. PRD Requirement Cross-References

### 13.1 Backend Components → PRD Requirements

| Backend Component | PRD Requirements | Phase |
|-------------------|------------------|-------|
| Database Schema | REQ-DAT-001 to REQ-DAT-007 | P1 |
| Authentication | REQ-ADM-001, REQ-CIT-001, REQ-CIT-002 | P2, P8 |
| RLS Policies | REQ-NFR-001, REQ-SEC-001 to REQ-SEC-003 | P7 |
| Workflow Engine | REQ-FUN-020 to REQ-FUN-026 | P4 |
| Eligibility Engine | REQ-FUN-013 to REQ-FUN-019 | P9 |
| Document Engine | REQ-FUN-027 to REQ-FUN-032 | P5 |
| Payment Processing | REQ-FUN-038 to REQ-FUN-043 | P10, P12 |
| BIS Integration | REQ-FUN-009, REQ-INT-001, REQ-INT-002 | P11 |
| Subema Integration | REQ-FUN-040, REQ-INT-003, REQ-INT-004 | P12 |
| Notification Service | REQ-INT-005, REQ-INT-006 | P13 |
| Fraud Detection | REQ-SEC-006 | P14 |
| Audit Logging | REQ-NFR-004, REQ-SEC-007 | P15 |

### 13.2 Query Functions → Data Dictionary Tables

| Query File | Tables Used | Data Dictionary Reference |
|------------|-------------|---------------------------|
| cases.ts | cases, citizens, service_types, users | Section 4.6, 4.3, 4.1, 4.4 |
| citizens.ts | citizens, households | Section 4.3, 4.16 |
| documents.ts | documents, document_requirements | Section 4.8, 4.11 |
| eligibility.ts | eligibility_rules, eligibility_evaluations | Section 4.9, 4.10 |
| reports.ts | Derived fields | Section 10.1 |
| payments.ts | payments, payment_batches, payment_items | Section 4.13, 8.1, 8.2 |

---

## 14. Versioning Anchors

### 14.1 Backend Version

| Component | Version | Compatibility |
|-----------|---------|---------------|
| Backend Documentation | 3.0 | Current |
| Schema Version | 1.0 | Stable |
| Edge Function API | 1.0 | Stable |

### 14.2 Stability Notes

| Component | Stability | Notes |
|-----------|-----------|-------|
| Core Tables | **Stable** | No changes expected |
| RLS Policies | **Stable** | Pattern established |
| Edge Functions | **Stable** | API contracts defined |
| Query Functions | **Medium** | May evolve with UI needs |

---

## 15. Phase 5 Cross-References

### 15.1 Engine Specifications

| Engine | Config Location | Status |
|--------|-----------------|--------|
| Eligibility Engine | `/configs/eligibility/*.json` | Ready |
| Wizard Engine | `/configs/wizard/*.json` | Ready |
| Workflow Engine | `/configs/workflows/case_workflow.json` | Ready |
| Payment Engine | `/configs/payments/payment_engine.json` | Blocked (Subema) |
| Fraud Engine | `/configs/fraud/fraud_engine.json` | Ready |

### 15.2 Related Documentation

| Document | Purpose |
|----------|---------|
| Schema-Lock-Specification.md | Schema freeze and validation rules |
| DAL-Specification.md | Data Access Layer patterns |
| API-Reference.md | Edge function contracts |
| Object-Model-Registry.md | Entity definitions and relationships |
| Versioning-Framework.md | Version management policies |

---

## 16. Phase 6 – Engine Runtime & Integration Layer

### 16.1 Phase 6 Documentation Artifacts

| Document | Purpose | Status |
|----------|---------|--------|
| Engine-Runtime-Configuration.md | Runtime load order, context, state isolation, error propagation | Complete |
| Integration-Stubs.md | BIS, Subema, Notification service contracts | Complete |
| Service-Layer-Specification.md | Engine-to-DAL bindings, execution pipelines | Complete |
| Event-Routing-Framework.md | Event types, routing rules, retry logic | Complete |
| Access-Control-PreModel.md | Actor/resource/action matrices for Phase 7 RLS | Complete |
| Engine-Orchestration-Plan.md | Orchestration topology, failure paths, output contracts | Complete |
| Test-Scenario-Suite.md | 8 dry-run validation scenarios | Complete |

### 16.2 Key Phase 6 Additions

- **Runtime Context**: Standardized citizen, case, session, and version pointer structures
- **Engine State Isolation**: Rules ensuring no cross-case state sharing
- **Integration Stubs**: Non-executable contracts for BIS, Subema, Email, SMS
- **Service Layer Bindings**: Engine-to-DAL model mappings
- **Event Routing**: 25+ event types with subscriber routing matrix
- **Access Control Pre-Model**: Role-action-resource matrix for RLS preparation
- **Orchestration Patterns**: Saga and choreography patterns defined
- **Test Scenarios**: 8 scenarios covering happy paths and edge cases

---

## 17. Phase 7 – RLS Security & Authorization Layer

### 17.1 Phase 7 Documentation Artifacts

| Document | Purpose | Status |
|----------|---------|--------|
| RLS-Policy-Specification.md | Complete RLS policy definitions for all tables | Complete |
| RLS-Expression-Map.md | Technology-neutral predicate expressions | Complete |
| Role-Permission-Matrix.md | Full role-by-resource-by-action matrix | Complete |
| Case-Authorization-Model.md | Case-specific ownership and status rules | Complete |
| Document-Auth-Model.md | Document access and integrity rules | Complete |
| Policy-Validation-Matrix.md | Cross-check validation for Phase 8 | Complete |

### 17.2 Role Definitions (Final)

| Role | Privilege Level | Scope |
|------|-----------------|-------|
| citizen | 1 | Own data only |
| district_intake_officer | 2 | District |
| case_handler | 3 | Assigned cases |
| case_reviewer | 4 | Review queue |
| department_head | 5 | Department |
| finance_officer | 4 | Payments |
| fraud_officer | 4 | Flagged cases |
| system_admin | 10 | Global |
| audit_viewer | 3 | Global (read) |

### 17.3 Resource Sensitivity Classification

- **HIGH**: citizens, cases, payments, fraud_signals, user_roles
- **MEDIUM**: documents, notifications, workflow_definitions
- **LOW**: service_types, offices, lookup tables

### 17.4 SECURITY DEFINER Functions (Phase 8 Implementation)

```
has_role(user_id, role) - Check user role (bypasses RLS)
current_user_id() - Get internal user ID
current_user_district() - Get user's district
has_case_access(case_id) - Check case access
```

**CRITICAL:** Roles stored in separate `user_roles` table, NOT on profiles.

---

## 18. Phase 8 – RLS Implementation & Policy Activation Plan

### 18.1 Phase 8 Documentation Artifacts

| Document | Purpose | Status |
|----------|---------|--------|
| RLS-Policy-Definitions.md | SQL-like policy definitions for 21 tables | Complete |
| Security-Definer-Functions.md | 21 helper functions specification | Complete |
| Policy-Activation-Sequence.md | 12-step activation order | Complete |
| Column-Masking-Specification.md | Field-level masking rules | Complete |
| Workflow-Security-Bindings.md | Status-field-role constraints | Complete |
| Policy-Test-Suite.md | 20 validation test scenarios | Complete |

### 18.2 Security Definer Function Categories

| Category | Functions | Purpose |
|----------|-----------|---------|
| Role Check | has_role, is_admin, is_case_handler, is_reviewer, is_fraud_officer, is_finance_officer, is_audit_viewer | Role verification bypassing RLS |
| Scope | current_user_id, auth_office_id, auth_district_id, auth_portal_user_id, auth_user_roles, user_department_scope | Context retrieval |
| Ownership | is_case_owner, is_document_owner, is_portal_owner, has_case_access | Ownership validation |
| Workflow | can_transition, field_locked, can_upload_document, can_update_eligibility | Status-based constraints |
| Guards | check_guard_all_docs_present, check_guard_eligibility_complete, check_guard_payment_approved | Transition preconditions |

### 18.3 Column Masking Summary

| Field | Default Mask | Unmasked Access |
|-------|--------------|-----------------|
| national_id | `XXX-XXX-***` | Own data, fraud_officer (flagged), admin |
| phone_number | `***-****` | Own data, case_handler (assigned), admin |
| email | `***@domain.com` | Own data, case_handler, admin |
| bank_account | `****-****-XXXX` | Own data, finance_officer, admin |
| address_line_1 | Partial | Own data, case_handler, admin |
| income_amount | Hidden | Own data, eligibility roles, admin |

### 18.4 Policy Activation Sequence

**Pre-Activation Checklist:**
- [ ] All tables have PRIMARY KEYS
- [ ] All FKs validated
- [ ] All 21 helper functions created
- [ ] Policy-Validation-Matrix passed
- [ ] Admin account registered
- [ ] Database backup taken

**12-Step Activation Order:**
1. Create `app_role` ENUM type
2. Create `user_roles` table with RLS
3. Create SECURITY DEFINER helper functions
4. Enable RLS on LOW-sensitivity tables
5. Apply SELECT-only policies (read lockdown)
6. Test SELECT policies per role
7. Add INSERT policies
8. Add UPDATE policies
9. Add DELETE policies
10. Activate HIGH-sensitivity table RLS
11. Apply column-masking policies
12. Validate workflow-bound locks

### 18.5 Policy Test Requirements

**20 Test Scenarios Defined:**
- 10 Role Access Tests (cross-role denial verification)
- 5 Workflow-Based Tests (status-lock enforcement)
- 5 Document Access Tests (ownership and flag verification)

**Critical Test Assertions:**
- Citizen accessing another citizen's data → DENIED
- Intake officer updating payment fields → DENIED
- Fraud officer reading low-risk case → DENIED
- Finance officer updating eligibility → DENIED
- Reviewer editing wizard_data → DENIED

### 18.6 Workflow-Security Bindings

**Field Lock Rules by Status:**
| Field Group | Editable Status | Locked After |
|-------------|-----------------|--------------|
| wizard_data | intake | validation |
| eligibility fields | eligibility_check | under_review |
| reviewer_notes | under_review | approved/rejected |
| payment fields | payment_pending | payment_processed |
| fraud_score | fraud_investigation | fraud_cleared |

**Transition Authorization:**
| Transition | Required Role |
|------------|---------------|
| intake → validation | district_intake_officer, case_handler |
| validation → eligibility_check | case_handler |
| eligibility_check → under_review | case_handler |
| under_review → approved | case_reviewer, department_head |
| under_review → rejected | case_reviewer, department_head |
| approved → payment_pending | case_handler, finance_officer |
| payment_pending → payment_processed | finance_officer |
| Any → fraud_investigation | fraud_officer, system_admin |
| fraud_investigation → fraud_cleared | fraud_officer, system_admin |
| Any → on_hold | case_handler, case_reviewer, department_head |
| on_hold → Previous | department_head |

---

## Phase 10 Step 2 – Case Status Actions UI

### Overview

Phase 10 Step 2 implements the **UI-only** case status transition component on the Case Detail page. This component wires to the existing `perform_case_transition` RPC implemented in Phase 10 Step 1, without any database or RLS changes.

### Component Created

**File:** `src/components/admin/cases/CaseStatusActions.tsx`

| Prop | Type | Description |
|------|------|-------------|
| `caseId` | `string` | UUID of the case to transition |
| `currentStatus` | `CaseStatus` | Current status of the case (from enum) |
| `onStatusChanged` | `(newStatus: CaseStatus) => void` | Callback invoked after successful transition |
| `disabled` | `boolean` | Optional flag to disable actions during loading |

### Allowed Transitions (UI)

The component exposes exactly **5 transitions** matching the backend rules:

| From Status | To Status | Label | Reason Required |
|-------------|-----------|-------|-----------------|
| `intake` | `under_review` | Move to Under Review | No |
| `under_review` | `approved` | Approve Case | No |
| `under_review` | `rejected` | Reject Case | Yes |
| `approved` | `under_review` | Reopen Case | Yes |
| `rejected` | `under_review` | Reopen Case | Yes |

### Helper Functions Used

| Function | Source | Purpose |
|----------|--------|---------|
| `transitionCaseStatus()` | `mutations/cases.ts` | Calls `perform_case_transition` RPC |
| `isTransitionAllowed()` | `mutations/cases.ts` | Client-side filter for available actions |
| `isReasonRequired()` | `mutations/cases.ts` | Determines if reason modal should open |

### Modal Behavior

**Confirm Modal (no reason):**
- Used for: `intake → under_review`, `under_review → approved`
- Simple confirmation dialog with description
- Confirm/Cancel buttons

**Reason Modal (reason required):**
- Used for: `under_review → rejected`, `approved → under_review`, `rejected → under_review`
- Contains textarea with validation (non-empty required)
- Shows inline validation error if empty
- Confirm/Cancel buttons

### Error Handling

- Backend errors displayed in `.alert.alert-danger` below the dropdown
- Toast notification via sonner on both success and failure
- `isSubmitting` state disables all buttons and shows spinner
- Error clears on next action attempt

### Data Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     CASE STATUS ACTIONS DATA FLOW                             │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ┌───────────────────┐                                                       │
│   │  CaseDetailHeader │                                                       │
│   │   ├── CaseStatusBadge (displays current status)                          │
│   │   └── CaseStatusActions (transition controls)                            │
│   └─────────┬─────────┘                                                       │
│             │                                                                 │
│             ▼ User clicks "Change Status" dropdown                           │
│   ┌─────────────────────────────────────────────────────────────┐            │
│   │  CaseStatusActions Component                                 │            │
│   │   │                                                          │            │
│   │   ├── Filter TRANSITIONS by currentStatus                   │            │
│   │   │   └── Uses isTransitionAllowed() helper                 │            │
│   │   │                                                          │            │
│   │   ├── User selects transition action                        │            │
│   │   │   └── Uses isReasonRequired() to decide modal type      │            │
│   │   │                                                          │            │
│   │   ├── Opens Confirm Modal OR Reason Modal                   │            │
│   │   │                                                          │            │
│   │   ├── User confirms → transitionCaseStatus()                │            │
│   │   │       │                                                  │            │
│   │   │       ▼                                                  │            │
│   │   │   supabase.rpc('perform_case_transition', {...})        │            │
│   │   │       │                                                  │            │
│   │   │       ▼ Backend validates:                              │            │
│   │   │       - Role authorization                              │            │
│   │   │       - Transition rules                                │            │
│   │   │       - Business rules (docs, eligibility)              │            │
│   │   │       - Reason requirement                              │            │
│   │   │                                                          │            │
│   │   └── On Success:                                           │            │
│   │       ├── Toast: "Status updated"                           │            │
│   │       ├── Call onStatusChanged(newStatus)                   │            │
│   │       └── Detail.tsx refreshes case data + timeline         │            │
│   └─────────────────────────────────────────────────────────────┘            │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Integration Points

**CaseDetailHeader.tsx:**
- Added props: `caseId`, `onStatusChanged`
- Renders `CaseStatusActions` adjacent to `CaseStatusBadge`

**Detail.tsx (Case Detail Page):**
- Added `refreshKey` state to trigger data re-fetch
- `handleStatusChanged()` callback optimistically updates status and refreshes
- Passes `caseId` and `onStatusChanged` to `CaseDetailHeader`

### No Backend Changes

This step is **UI-only**. No modifications to:
- SQL functions (`validate_case_transition`, `perform_case_transition`)
- RLS policies
- Enum definitions
- Database schema

---

## 14. Admin UI Theme System (Phase X)

### 14.1 Data Attributes
The Darkone admin template uses HTML data attributes for theme control:

| Attribute | Values | Purpose |
|-----------|--------|---------|
| `data-bs-theme` | `light`, `dark` | Controls light/dark color scheme |
| `data-sidebar-size` | `default`, `condensed` | Controls sidebar width |

### 14.2 LocalStorage Keys
| Key | Values | Purpose |
|-----|--------|---------|
| `darkone-theme` | `light`, `dark` | Persists theme preference |
| `darkone-sidebar-size` | `default`, `condensed` | Persists sidebar state |

### 14.3 Implementation Notes
- Theme toggle implemented in `Topbar.tsx` - sets `data-bs-theme` on `document.documentElement`
- Sidebar toggle implemented in `Topbar.tsx` - sets `data-sidebar-size` on `document.documentElement` and toggles `sidebar-enable` class on `document.body`
- `AdminLayout.tsx` initializes sidebar size from localStorage on mount
- All CSS driven by `public/darkone/css/darkone.css` - no inline styles or Tailwind

### 14.4 Logo Visibility Rules
- Light Mode: `.logo-dark` visible, `.logo-light` hidden
- Dark Mode: `.logo-light` visible, `.logo-dark` hidden
- Condensed Sidebar: `.logo-sm` visible, `.logo-lg` hidden
- Condensed + Hover: `.logo-lg` visible, `.logo-sm` hidden

### 14.5 Related Documentation
- [PhaseX-Darkone-React.md](./PhaseX-Darkone-React.md) - Component inventory
- [AdminLayout-Stabilization-Plan.md](./AdminLayout-Stabilization-Plan.md) - Pre-MVP stabilization plan

---

**END OF CONSOLIDATED BACKEND DOCUMENTATION v6.1 (Phase X Updated)**
