# SoZaVo Platform v1.0 – Backend Documentation

> **Version:** 1.0 (Consolidated)  
> **Status:** Reference Document  
> **Source:** Synthesized from Phase Documents 1–17 and Technical Architecture

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

**END OF CONSOLIDATED BACKEND DOCUMENTATION v6.0 (Phase 8 Updated)**
