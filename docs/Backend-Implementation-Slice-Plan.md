# Backend Implementation Slice Plan
## SoZaVo Platform v1.0 — Phase 10

**Document Version**: 1.1  
**Phase**: 10 — Mutation Authorization Layer  
**Status**: In Progress  
**Last Updated**: 2025-01-XX

---

## 1. Overview

This document breaks backend implementation into **speed-friendly slices** that respect governance constraints. Each slice is independently testable and follows established RLS policies.

Implementation order is designed for **maximum parallelization** while respecting dependencies.

---

## 1.1 Phase 10 Implementation Status

| Slice | Name | Status |
|-------|------|--------|
| 10A | Case Status Transition (Backend Mutation) | ✅ COMPLETE |
| 10A.2 | Case Status Transition (UI Integration) | ✅ COMPLETE |
| 10A.3 | Payment & Hold Transitions | ✅ COMPLETE |
| 10A.4 | Document Verification Mutation | ✅ COMPLETE |
| 10B | Case Assignment Mutation | 📋 Planned |
| 10C | Eligibility Override Mutation | 📋 Planned |

### Slice 10A — Case Status Transition (COMPLETE ✅)

**Scope**: Backend-only mutation for changing case status with role-based access and business rules.

**Functions Created**:
- `get_user_roles_array(UUID)` — Helper to get user's roles as array
- `validate_case_transition(UUID, case_status, UUID, TEXT)` — Validation function
- `perform_case_transition(UUID, case_status, TEXT, JSONB)` — RPC function

**Phase 10 Step 1 Transitions (T001-T005)**:
| From | To | Roles | Business Rules |
|------|-----|-------|----------------|
| intake | under_review | case_handler, case_reviewer, department_head, system_admin | None |
| under_review | approved | case_reviewer, department_head, system_admin | Mandatory docs verified + eligible evaluation |
| under_review | rejected | case_reviewer, department_head, system_admin | Reason required |
| approved | under_review | department_head, system_admin | Reason required (reopen) |
| rejected | under_review | department_head, system_admin | Reason required (reopen) |

**Phase 10 Step 3 Transitions (T006-T011)**:
| From | To | Roles | Business Rules |
|------|-----|-------|----------------|
| approved | payment_pending | finance_officer, department_head, system_admin | None (T006) |
| payment_pending | payment_processed | finance_officer, department_head, system_admin | None (T007) |
| under_review | on_hold | case_reviewer, department_head, system_admin | Reason required (T008) |
| approved | on_hold | department_head, system_admin | Reason required (T009) |
| payment_pending | on_hold | department_head, system_admin | Reason required (T010) |
| on_hold | under_review | case_reviewer, department_head, system_admin | None - resume (T011) |

**Audit Metadata Flags**:
- `is_hold_transition: true` — Set for T008, T009, T010, T011
- `is_payment_transition: true` — Set for T006, T007

**TypeScript Wrapper**: `src/integrations/supabase/mutations/cases.ts`

**UI Component**: `src/components/admin/cases/CaseStatusActions.tsx`

**Policies Added**:
- `cases_update_status_via_rpc` — UPDATE policy for cases
- `case_events_insert_via_rpc` — INSERT policy for case_events

---

## 2. Slice Dependency Graph

```
┌─────────────────────────────────────────────────────────────┐
│                    SLICE DEPENDENCY GRAPH                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐                                           │
│  │   Slice 0    │  ← Foundation (must be first)             │
│  │  Auth & RLS  │                                           │
│  └──────┬───────┘                                           │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────┐     ┌──────────────┐                      │
│  │   Slice 1    │     │   Slice 7    │  ← Can run parallel  │
│  │ Case Queries │     │ Config Read  │                      │
│  └──────┬───────┘     └──────────────┘                      │
│         │                                                   │
│    ┌────┴────┬────────────┬────────────┐                    │
│    ▼         ▼            ▼            ▼                    │
│ ┌──────┐ ┌──────┐    ┌──────┐    ┌──────┐                   │
│ │ S2   │ │ S3   │    │ S4   │    │ S5   │  ← Parallel       │
│ │Events│ │Elig. │    │ Docs │    │ Pays │                   │
│ └──────┘ └──────┘    └──────┘    └──────┘                   │
│                                       │                     │
│                                       ▼                     │
│                                  ┌──────┐                   │
│                                  │ S6   │                   │
│                                  │Fraud │                   │
│                                  └──────┘                   │
│                                       │                     │
│                                       ▼                     │
│                                  ┌──────────┐               │
│                                  │ S10A ✅  │               │
│                                  │ Case     │               │
│                                  │ Status   │               │
│                                  └──────────┘               │
│                                       │                     │
│                                  ┌────┴────┐                │
│                                  ▼         ▼                │
│                              ┌──────┐  ┌──────┐             │
│                              │ S10B │  │ S10C │             │
│                              │Assign│  │ Docs │             │
│                              └──────┘  └──────┘             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Implementation Slices

### Slice 0 — Authentication & RLS Foundation

**Priority**: CRITICAL (blocks all other slices)  
**Estimated Effort**: 1-2 days

#### 3.0.1 Scope

- Configure Supabase Auth for email/password
- Create `user_roles` table with RLS
- Implement `has_role()` security definer function
- Implement `is_admin()` helper function
- Create `getCurrentUserRoles` edge function

#### 3.0.2 Required Tables

| Table | Action |
|-------|--------|
| `user_roles` | Create with RLS |

#### 3.0.3 Required Edge Functions

| Function | Method | Path | Auth |
|----------|--------|------|------|
| `getCurrentUserRoles` | GET | `/functions/v1/getCurrentUserRoles` | Required |

**Request**: None (uses auth context)  
**Response**:
```typescript
{
  user_id: string;
  roles: ('citizen' | 'district_intake_officer' | 'case_handler' | 'case_reviewer' | 'department_head' | 'finance_officer' | 'fraud_officer' | 'system_admin' | 'audit_viewer')[];
}
```

#### 3.0.4 RLS Policies Required

| Policy | Table | Rule |
|--------|-------|------|
| `user_roles_select_own` | `user_roles` | `auth.uid() = user_id` |

#### 3.0.5 Security Definer Functions

```sql
-- has_role: Check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- is_admin: Check if current user is system_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'system_admin')
$$;
```

#### 3.0.6 Success Criteria

- [ ] User can sign in with email/password
- [ ] `user_roles` table exists with correct schema
- [ ] RLS prevents users from seeing other users' roles
- [ ] `getCurrentUserRoles` returns correct roles for authenticated user
- [ ] `has_role()` function works correctly

---

### Slice 1 — Read-Only Case & Citizen Queries

**Priority**: HIGH (blocks UI modules 2, 3)  
**Estimated Effort**: 2-3 days  
**Dependencies**: Slice 0

#### 3.1.1 Scope

- Implement DAL queries for case listing with filters
- Implement case detail query with citizen join
- Apply role-based scoping via RLS

#### 3.1.2 Required Tables

| Table | Action |
|-------|--------|
| `cases` | Read with RLS |
| `citizens` | Read with RLS |
| `service_types` | Read (public) |
| `offices` | Read (public) |

#### 3.1.3 Required Edge Functions

| Function | Method | Path | Auth |
|----------|--------|------|------|
| `getCases` | GET | `/functions/v1/getCases` | Required |
| `getCaseById` | GET | `/functions/v1/getCaseById` | Required |
| `getCitizenById` | GET | `/functions/v1/getCitizenById` | Required |

**getCases Request**:
```typescript
{
  status?: string;
  service_type_id?: string;
  office_id?: string;
  date_from?: string;  // ISO date
  date_to?: string;    // ISO date
  search?: string;     // Case ID or citizen name
  page?: number;       // Default: 1
  limit?: number;      // Default: 20, max: 100
  sort_by?: 'created_at' | 'status' | 'service_type';
  sort_order?: 'asc' | 'desc';
}
```

**getCases Response**:
```typescript
{
  data: {
    id: string;
    case_number: string;
    status: string;
    service_type: { id: string; name: string };
    office: { id: string; name: string };
    citizen: { id: string; full_name: string };
    case_handler_id: string | null;
    created_at: string;
    updated_at: string;
  }[];
  total: number;
  page: number;
  limit: number;
}
```

**getCaseById Request**: `{ case_id: string }`  
**getCaseById Response**:
```typescript
{
  id: string;
  case_number: string;
  status: string;
  priority: string;
  service_type: { id: string; name: string; description: string };
  office: { id: string; name: string; code: string };
  citizen: {
    id: string;
    full_name: string;
    national_id: string;  // Masked per role
    date_of_birth: string;
    contact_email: string;
    contact_phone: string;
  };
  case_handler_id: string | null;
  case_reviewer_id: string | null;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
}
```

#### 3.1.4 RLS Policies Required

| Policy | Table | Rule |
|--------|-------|------|
| `case_select` | `cases` | Handler: own assigned; Reviewer: office; Admin: all |
| `citizen_select` | `citizens` | Via case ownership or admin |

#### 3.1.5 Dependencies on Engines

None (pure data queries)

#### 3.1.6 Success Criteria

- [ ] `getCases` returns paginated, filtered case list
- [ ] Case list respects role-based scoping
- [ ] `getCaseById` returns full case with citizen info
- [ ] National ID is masked based on role
- [ ] Search by case number and citizen name works

---

### Slice 2 — Case Events & Timeline Read

**Priority**: MEDIUM  
**Estimated Effort**: 1-2 days  
**Dependencies**: Slice 1

#### 3.2.1 Scope

- Implement case events query
- Support event type filtering
- Order by timestamp descending

#### 3.2.2 Required Tables

| Table | Action |
|-------|--------|
| `case_events` | Read with RLS |

#### 3.2.3 Required Edge Functions

| Function | Method | Path | Auth |
|----------|--------|------|------|
| `getCaseEvents` | GET | `/functions/v1/getCaseEvents` | Required |

**Request**: `{ case_id: string; event_type?: string; limit?: number }`  
**Response**:
```typescript
{
  events: {
    id: string;
    case_id: string;
    event_type: string;
    event_data: object;
    actor_id: string;
    actor_type: 'system' | 'user' | 'citizen';
    created_at: string;
  }[];
}
```

#### 3.2.4 RLS Policies Required

| Policy | Table | Rule |
|--------|-------|------|
| `case_event_select` | `case_events` | Inherits from case access |

#### 3.2.5 Success Criteria

- [ ] Events returned for authorized cases only
- [ ] Events ordered by timestamp (newest first)
- [ ] Event type filtering works

---

### Slice 3 — Eligibility Read

**Priority**: MEDIUM  
**Estimated Effort**: 2-3 days  
**Dependencies**: Slice 1

#### 3.3.1 Scope

- Implement eligibility evaluation query
- Return rule breakdown with pass/fail status
- Include rule metadata from JSON configs

#### 3.3.2 Required Tables

| Table | Action |
|-------|--------|
| `eligibility_evaluations` | Read with RLS |
| `eligibility_rules` | Read (reference) |

#### 3.3.3 Required Edge Functions

| Function | Method | Path | Auth |
|----------|--------|------|------|
| `getEligibilityEvaluation` | GET | `/functions/v1/getEligibilityEvaluation` | Required |

**Request**: `{ case_id: string }`  
**Response**:
```typescript
{
  evaluation: {
    id: string;
    case_id: string;
    outcome: 'eligible' | 'ineligible' | 'pending' | 'requires_review';
    score: number;
    evaluated_at: string;
    rule_version: string;
    rules_fired: {
      rule_id: string;
      rule_name: string;
      result: 'pass' | 'fail' | 'skip';
      score_impact: number;
      reason: string;
    }[];
  } | null;
  history: {
    id: string;
    outcome: string;
    evaluated_at: string;
  }[];
}
```

#### 3.3.4 RLS Policies Required

| Policy | Table | Rule |
|--------|-------|------|
| `eligibility_evaluation_select` | `eligibility_evaluations` | Inherits from case access |

#### 3.3.5 Dependencies on Engines

- Eligibility Engine (read config for rule names/descriptions)

#### 3.3.6 JSON Configs Referenced

- `/configs/eligibility/child_allowance.json`
- `/configs/eligibility/social_assistance.json`
- `/configs/eligibility/general_assistance.json`

#### 3.3.7 Success Criteria

- [ ] Evaluation returned for authorized cases
- [ ] Rule breakdown includes all fired rules
- [ ] Evaluation history available
- [ ] Rule names resolved from config

---

### Slice 4 — Documents Read

**Priority**: MEDIUM  
**Estimated Effort**: 1-2 days  
**Dependencies**: Slice 1

#### 3.4.1 Scope

- Implement document list query per case
- Generate download URLs (stub or pre-signed)
- Apply Document-Auth-Model restrictions

#### 3.4.2 Required Tables

| Table | Action |
|-------|--------|
| `documents` | Read with RLS |

#### 3.4.3 Required Edge Functions

| Function | Method | Path | Auth |
|----------|--------|------|------|
| `getDocumentsByCase` | GET | `/functions/v1/getDocumentsByCase` | Required |
| `getDocumentDownloadUrl` | GET | `/functions/v1/getDocumentDownloadUrl` | Required |

**getDocumentsByCase Request**: `{ case_id: string }`  
**getDocumentsByCase Response**:
```typescript
{
  documents: {
    id: string;
    case_id: string;
    filename: string;
    document_type: string;
    mime_type: string;
    file_size: number;
    verification_status: 'pending' | 'verified' | 'rejected';
    uploaded_by_type: 'citizen' | 'staff';
    uploaded_by_id: string;
    created_at: string;
  }[];
}
```

**getDocumentDownloadUrl Request**: `{ document_id: string }`  
**getDocumentDownloadUrl Response**: `{ url: string; expires_at: string }`

#### 3.4.4 RLS Policies Required

| Policy | Table | Rule |
|--------|-------|------|
| `document_select` | `documents` | Case-bound + role verification |

#### 3.4.5 Success Criteria

- [ ] Documents returned for authorized cases only
- [ ] Download URL generation works (or stub)
- [ ] Verification status displayed correctly

---

### Slice 5 — Payments Read

**Priority**: MEDIUM  
**Estimated Effort**: 2-3 days  
**Dependencies**: Slice 0

#### 3.5.1 Scope

- Implement payment batch list query
- Implement payment items within batch query
- Restrict to finance/fraud/admin roles

#### 3.5.2 Required Tables

| Table | Action |
|-------|--------|
| `payment_batches` | Read with RLS |
| `payment_items` | Read with RLS |

#### 3.5.3 Required Edge Functions

| Function | Method | Path | Auth |
|----------|--------|------|------|
| `getPaymentBatches` | GET | `/functions/v1/getPaymentBatches` | Required |
| `getPaymentItems` | GET | `/functions/v1/getPaymentItems` | Required |
| `getPaymentSummary` | GET | `/functions/v1/getPaymentSummary` | Required |

**getPaymentBatches Request**:
```typescript
{
  status?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}
```

**getPaymentBatches Response**:
```typescript
{
  batches: {
    id: string;
    batch_number: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    total_amount: number;
    item_count: number;
    created_at: string;
    processed_at: string | null;
  }[];
  total: number;
  page: number;
  limit: number;
}
```

**getPaymentItems Request**: `{ batch_id: string; page?: number; limit?: number }`  
**getPaymentItems Response**:
```typescript
{
  items: {
    id: string;
    batch_id: string;
    case_id: string;
    citizen_name: string;
    amount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'reversed';
    payment_method: string;
    processed_at: string | null;
    error_message: string | null;
  }[];
  total: number;
}
```

#### 3.5.4 RLS Policies Required

| Policy | Table | Rule |
|--------|-------|------|
| `payment_batch_select` | `payment_batches` | `has_role(finance_officer) OR has_role(fraud_officer) OR has_role(department_head) OR is_admin()` |
| `payment_item_select` | `payment_items` | Same as batch |

#### 3.5.5 Dependencies on Engines

- Payment Engine (read config for payment methods)

#### 3.5.6 JSON Configs Referenced

- `/configs/payments/payment_engine.json`

#### 3.5.7 Success Criteria

- [ ] Only authorized roles can access payment data
- [ ] Batch list with filters works
- [ ] Items within batch displayed correctly
- [ ] Summary statistics calculated

---

### Slice 6 — Fraud Read

**Priority**: MEDIUM  
**Estimated Effort**: 2-3 days  
**Dependencies**: Slice 5 (shares role patterns)

#### 3.6.1 Scope

- Implement fraud signals list query
- Implement risk scores query
- Restrict to fraud/admin roles

#### 3.6.2 Required Tables

| Table | Action |
|-------|--------|
| `fraud_signals` | Read with RLS |
| `fraud_risk_scores` | Read with RLS |

#### 3.6.3 Required Edge Functions

| Function | Method | Path | Auth |
|----------|--------|------|------|
| `getFraudSignals` | GET | `/functions/v1/getFraudSignals` | Required |
| `getFraudRiskScores` | GET | `/functions/v1/getFraudRiskScores` | Required |
| `getFraudSummary` | GET | `/functions/v1/getFraudSummary` | Required |

**getFraudSignals Request**:
```typescript
{
  severity?: 'low' | 'medium' | 'high' | 'critical';
  signal_type?: string;
  case_id?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}
```

**getFraudSignals Response**:
```typescript
{
  signals: {
    id: string;
    case_id: string;
    signal_type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    detected_at: string;
    resolved: boolean;
  }[];
  total: number;
}
```

**getFraudRiskScores Request**: `{ case_id?: string; risk_tier?: string; page?: number; limit?: number }`  
**getFraudRiskScores Response**:
```typescript
{
  risk_scores: {
    id: string;
    case_id: string;
    score: number;
    risk_tier: 'low' | 'medium' | 'high' | 'critical';
    factors: { factor: string; weight: number }[];
    calculated_at: string;
  }[];
}
```

#### 3.6.4 RLS Policies Required

| Policy | Table | Rule |
|--------|-------|------|
| `fraud_signal_select` | `fraud_signals` | `has_role(fraud_officer) OR has_role(department_head) OR is_admin()` |
| `fraud_risk_score_select` | `fraud_risk_scores` | Same |

#### 3.6.5 Dependencies on Engines

- Fraud Engine (read config for signal types)

#### 3.6.6 JSON Configs Referenced

- `/configs/fraud/fraud_engine.json`

#### 3.6.7 Success Criteria

- [ ] Only authorized roles can access fraud data
- [ ] Signal list with filters works
- [ ] Risk scores display correctly
- [ ] Summary dashboard data available

---

### Slice 7 — Read-Only Config Read

**Priority**: LOW (can run parallel with Slice 1)  
**Estimated Effort**: 1 day  
**Dependencies**: Slice 0

#### 3.7.1 Scope

- Implement queries for configuration data
- No RLS restrictions (public config data)
- Leadership visibility into system configuration

#### 3.7.2 Required Tables

| Table | Action |
|-------|--------|
| `service_types` | Read (public) |
| `offices` | Read (public) |
| `eligibility_rules` | Read (metadata only) |
| `workflow_definitions` | Read (metadata only) |

#### 3.7.3 Required Edge Functions

| Function | Method | Path | Auth |
|----------|--------|------|------|
| `getServiceTypes` | GET | `/functions/v1/getServiceTypes` | Required |
| `getOffices` | GET | `/functions/v1/getOffices` | Required |
| `getEligibilityRules` | GET | `/functions/v1/getEligibilityRules` | Required |
| `getWorkflowDefinitions` | GET | `/functions/v1/getWorkflowDefinitions` | Required |

**Response shapes**: Standard list responses with entity fields.

#### 3.7.4 RLS Policies Required

None (public data)

#### 3.7.5 Success Criteria

- [ ] Service types list returned
- [ ] Offices list with regions returned
- [ ] Eligibility rules summary by service type returned
- [ ] Workflow definitions overview returned

---

### Slice 8 — Minimal Mutations Planning (Documentation Only)

**Priority**: PLANNING ONLY (no implementation in Phase 9)  
**Estimated Effort**: Documentation only  
**Dependencies**: All read slices

#### 3.8.1 Scope

Document the mutations that will be implemented in Phase 10:

| Mutation | Target Table | Authorized Roles | Business Rules |
|----------|--------------|------------------|----------------|
| `transitionCaseStatus` | `cases` | case_handler, case_reviewer, dept_head | Workflow state machine, status lock rules |
| `verifyDocument` | `documents` | case_handler, case_reviewer | Can only verify pending documents |
| `addCaseNote` | `case_events` | case_handler, case_reviewer | Event type = 'note_added' |
| `assignCaseHandler` | `cases` | case_reviewer, dept_head | Only unassigned or reassignable cases |
| `escalateFraudSignal` | `fraud_signals` | fraud_officer | Creates escalation event |

#### 3.8.2 Status Transition Rules

From `/configs/workflows/case_workflow.json`:

| From Status | To Status | Authorized Roles |
|-------------|-----------|------------------|
| `draft` | `submitted` | citizen (portal) |
| `submitted` | `under_review` | case_handler |
| `under_review` | `pending_documents` | case_handler |
| `under_review` | `eligible` | case_reviewer |
| `under_review` | `ineligible` | case_reviewer |
| `eligible` | `approved` | dept_head |
| `approved` | `payment_pending` | system |
| `payment_pending` | `payment_complete` | system |
| Any | `closed` | dept_head |

#### 3.8.3 Field Lock Rules

| Status | Locked Fields |
|--------|---------------|
| `submitted` | wizard_data |
| `under_review` | wizard_data, eligibility_evaluation |
| `approved` | All except notes |
| `closed` | All |

---

## 4. Implementation Schedule

| Week | Slices | Focus |
|------|--------|-------|
| Week 1 | Slice 0 + 1 + 7 | Foundation + Core queries |
| Week 2 | Slice 2 + 3 + 4 | Case detail components |
| Week 3 | Slice 5 + 6 | Finance/Fraud views |
| Week 4 | Integration + Testing | End-to-end validation |

---

## 5. Testing Requirements

Each slice must include:

1. **Unit Tests**: Edge function logic
2. **RLS Tests**: Policy enforcement verification
3. **Integration Tests**: Full request/response cycle
4. **Role Tests**: Verify correct scoping per role

See `/docs/Policy-Test-Suite.md` for detailed test scenarios.

---

*End of Backend-Implementation-Slice-Plan.md*
