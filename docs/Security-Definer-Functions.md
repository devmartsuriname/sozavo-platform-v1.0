# Security Definer Functions
## SoZaVo Platform v1.0 — Phase 10

> **Status**: Partially Implemented  
> **Version**: 1.1  
> **Source**: RLS-Policy-Specification.md, Access-Control-PreModel.md  
> **Last Updated**: 2025-01-XX

---

## 0. Implementation Status

### Phase 10A — Case Status Transition Functions (IMPLEMENTED ✅)

| Function | Purpose | Status |
|----------|---------|--------|
| `get_user_roles_array(UUID)` | Returns array of roles for a user | ✅ IMPLEMENTED |
| `validate_case_transition(UUID, case_status, UUID, TEXT)` | Validates transition rules, roles, business logic | ✅ IMPLEMENTED |
| `perform_case_transition(UUID, case_status, TEXT, JSONB)` | RPC to execute status transition with audit | ✅ IMPLEMENTED |

### Phase 10C — Document Verification Functions (IMPLEMENTED ✅)

| Function | Purpose | Status |
|----------|---------|--------|
| `validate_document_verification(UUID, document_status, TEXT, UUID)` | Validates document transition rules, roles, reason requirements | ✅ IMPLEMENTED |
| `verify_case_document(UUID, document_status, TEXT, JSONB)` | RPC to execute document status change with audit | ✅ IMPLEMENTED |

**Transition Rules:**
| From | To | Roles | Reason Required |
|------|-----|-------|-----------------|
| pending | verified | case_reviewer, department_head, system_admin | No |
| pending | rejected | case_reviewer, department_head, system_admin | Yes |
| rejected | verified | department_head, system_admin | No |
| verified | pending | department_head, system_admin | No |

---

## 1. Overview

This document defines all SECURITY DEFINER helper functions required for the SoZaVo RLS implementation. These functions:

- Execute with owner privileges (bypassing RLS)
- Prevent recursive policy evaluation
- Provide consistent, reusable authorization logic
- Must be created BEFORE enabling RLS policies

### 1.1 Function Categories

| Category | Purpose | Count |
|----------|---------|-------|
| Role Check | Verify user role membership | 7 |
| Scope | Retrieve user's organizational scope | 6 |
| Ownership | Verify resource ownership | 4 |
| Validation | Check workflow/field constraints | 4 |
| Mutation | Execute controlled data changes | 3 |
| **TOTAL** | | **24** |

### 1.2 Security Requirements

All functions must:
- Use `SECURITY DEFINER` execution mode
- Set `search_path = public` explicitly
- Be marked as `STABLE` (no side effects)
- Have minimal execution time
- Include proper null handling

---

## 2. Role Check Functions

### 2.1 has_role(user_id, role)

**Purpose**: Core function to check if a user has a specific role.

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Usage in RLS policies:
-- USING (public.has_role(auth.uid(), 'case_handler'))
```

**Parameters:**
- `_user_id`: UUID of the user to check
- `_role`: app_role enum value to verify

**Returns**: `BOOLEAN` — true if user has the specified role

**Critical Notes:**
- This is the foundation function for all role-based access
- Must be created before any RLS policies
- Uses SECURITY DEFINER to bypass RLS on user_roles table

---

### 2.2 is_admin()

**Purpose**: Check if current user has system_admin role.

```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'system_admin')
$$;

-- Usage in RLS policies:
-- USING (public.is_admin())
```

**Returns**: `BOOLEAN` — true if current user is admin

---

### 2.3 is_case_handler()

**Purpose**: Check if current user has case_handler role.

```sql
CREATE OR REPLACE FUNCTION public.is_case_handler()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'case_handler')
$$;
```

---

### 2.4 is_reviewer()

**Purpose**: Check if current user has case_reviewer or department_head role.

```sql
CREATE OR REPLACE FUNCTION public.is_reviewer()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'case_reviewer')
      OR public.has_role(auth.uid(), 'department_head')
$$;
```

---

### 2.5 is_fraud_officer()

**Purpose**: Check if current user has fraud_officer role.

```sql
CREATE OR REPLACE FUNCTION public.is_fraud_officer()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'fraud_officer')
$$;
```

---

### 2.6 is_finance_officer()

**Purpose**: Check if current user has finance_officer role.

```sql
CREATE OR REPLACE FUNCTION public.is_finance_officer()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'finance_officer')
$$;
```

---

### 2.7 is_audit_viewer()

**Purpose**: Check if current user has audit_viewer role (read-only compliance access).

```sql
CREATE OR REPLACE FUNCTION public.is_audit_viewer()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'audit_viewer')
$$;
```

---

## 3. Scope Functions

### 3.1 current_user_id()

**Purpose**: Get the internal user ID for the authenticated user.

```sql
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid()
$$;

-- Note: This is a thin wrapper for consistency and potential future enhancement
```

---

### 3.2 auth_office_id()

**Purpose**: Get the office ID assigned to the current user.

```sql
CREATE OR REPLACE FUNCTION public.auth_office_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT office_id
  FROM public.staff_assignments
  WHERE user_id = auth.uid()
    AND is_active = true
  LIMIT 1
$$;

-- Returns NULL if user has no office assignment
-- Staff may have multiple offices; returns primary assignment
```

**Requires Clarification:**
- Table structure for staff_assignments not yet confirmed
- Multi-office assignment handling TBD

---

### 3.3 auth_district_id()

**Purpose**: Get the district ID for the current user's office.

```sql
CREATE OR REPLACE FUNCTION public.auth_district_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.district_id
  FROM public.offices o
  JOIN public.staff_assignments sa ON sa.office_id = o.id
  WHERE sa.user_id = auth.uid()
    AND sa.is_active = true
  LIMIT 1
$$;
```

---

### 3.4 auth_portal_user_id()

**Purpose**: Get the portal user ID (for citizen access).

```sql
CREATE OR REPLACE FUNCTION public.auth_portal_user_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid()
$$;

-- For portal users, the auth.uid() directly maps to portal_user_id in citizens table
```

---

### 3.5 auth_user_roles()

**Purpose**: Get all roles assigned to the current user.

```sql
CREATE OR REPLACE FUNCTION public.auth_user_roles()
RETURNS SETOF app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = auth.uid()
$$;

-- Returns a set of roles for users with multiple assignments
```

---

### 3.6 user_department_scope(user_id)

**Purpose**: Get all office IDs within the user's department scope.

```sql
CREATE OR REPLACE FUNCTION public.user_department_scope(_user_id UUID)
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.id
  FROM public.offices o
  WHERE o.district_id IN (
    SELECT o2.district_id
    FROM public.offices o2
    JOIN public.staff_assignments sa ON sa.office_id = o2.id
    WHERE sa.user_id = _user_id
      AND sa.is_active = true
  )
$$;

-- Returns all offices in the same district(s) as the user
-- Used for department_head scope calculations
```

---

## 4. Ownership Functions

### 4.1 is_case_owner(case_id)

**Purpose**: Check if current user is the assigned handler for a case.

```sql
CREATE OR REPLACE FUNCTION public.is_case_owner(_case_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.cases
    WHERE id = _case_id
      AND case_handler_id = auth.uid()
  )
$$;
```

---

### 4.2 is_document_owner(doc_id)

**Purpose**: Check if current user owns a document (via case ownership or citizen portal).

```sql
CREATE OR REPLACE FUNCTION public.is_document_owner(_doc_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.documents d
    JOIN public.cases c ON d.case_id = c.id
    JOIN public.citizens cit ON c.citizen_id = cit.id
    WHERE d.id = _doc_id
      AND cit.portal_user_id = auth.uid()
  )
$$;
```

---

### 4.3 is_portal_owner(citizen_id)

**Purpose**: Check if current user owns a citizen record via portal.

```sql
CREATE OR REPLACE FUNCTION public.is_portal_owner(_citizen_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.citizens
    WHERE id = _citizen_id
      AND portal_user_id = auth.uid()
  )
$$;
```

---

### 4.4 has_case_access(case_id)

**Purpose**: Comprehensive check if current user can access a case.

```sql
CREATE OR REPLACE FUNCTION public.has_case_access(_case_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.cases c
    WHERE c.id = _case_id
      AND (
        -- Admin access
        public.is_admin()
        -- Audit viewer access
        OR public.is_audit_viewer()
        -- Assigned handler
        OR c.case_handler_id = auth.uid()
        -- Same office
        OR c.intake_office_id = public.auth_office_id()
        -- Portal owner (citizen)
        OR EXISTS (
          SELECT 1 
          FROM public.citizens cit 
          WHERE cit.id = c.citizen_id 
            AND cit.portal_user_id = auth.uid()
        )
        -- Reviewer for cases under review
        OR (
          public.is_reviewer() 
          AND c.current_status IN ('under_review', 'approved', 'rejected')
        )
        -- Finance for payment cases
        OR (
          public.is_finance_officer() 
          AND c.current_status IN ('approved', 'payment_pending', 'payment_processed')
        )
        -- Fraud officer for flagged cases
        OR (
          public.is_fraud_officer() 
          AND (c.fraud_flag = true OR c.fraud_risk_level IN ('medium', 'high', 'critical'))
        )
        -- Department head for department scope
        OR (
          public.has_role(auth.uid(), 'department_head')
          AND c.intake_office_id IN (SELECT public.user_department_scope(auth.uid()))
        )
      )
  )
$$;

-- This is the primary case access function used by most policies
-- Centralizes access logic for consistency
```

---

## 5. Validation Functions

### 5.1 can_transition(current_status, target_status)

**Purpose**: Validate if a status transition is allowed based on workflow definition.

```sql
CREATE OR REPLACE FUNCTION public.can_transition(
  _current_status TEXT, 
  _target_status TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workflow_transitions wt
    WHERE wt.from_status = _current_status
      AND wt.to_status = _target_status
      AND wt.is_active = true
  )
$$;

-- Transitions defined in case_workflow.json:
-- intake → validation
-- validation → eligibility_check
-- eligibility_check → under_review
-- under_review → approved | rejected
-- approved → payment_pending
-- payment_pending → payment_processed
-- * → closed | withdrawn (conditional)
```

**Alternative Implementation (if no workflow_transitions table):**

```sql
CREATE OR REPLACE FUNCTION public.can_transition(
  _current_status TEXT, 
  _target_status TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN CASE
    WHEN _current_status = 'intake' AND _target_status = 'validation' THEN true
    WHEN _current_status = 'validation' AND _target_status = 'eligibility_check' THEN true
    WHEN _current_status = 'eligibility_check' AND _target_status = 'under_review' THEN true
    WHEN _current_status = 'under_review' AND _target_status IN ('approved', 'rejected') THEN true
    WHEN _current_status = 'approved' AND _target_status = 'payment_pending' THEN true
    WHEN _current_status = 'payment_pending' AND _target_status = 'payment_processed' THEN true
    WHEN _target_status IN ('closed', 'withdrawn') THEN true  -- Always allowed
    ELSE false
  END;
END;
$$;
```

---

### 5.2 field_locked(field_name, case_status)

**Purpose**: Check if a specific field is locked based on case status.

```sql
CREATE OR REPLACE FUNCTION public.field_locked(
  _field_name TEXT, 
  _case_status TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN CASE
    -- wizard_data locked after intake
    WHEN _field_name = 'wizard_data' 
      AND _case_status NOT IN ('intake') 
    THEN true
    
    -- eligibility fields locked after under_review
    WHEN _field_name IN ('eligibility_result', 'eligibility_score', 'eligibility_details')
      AND _case_status IN ('under_review', 'approved', 'rejected', 
                           'payment_pending', 'payment_processed', 'closed')
    THEN true
    
    -- payment fields locked after payment_processed
    WHEN _field_name IN ('payment_amount', 'payment_method', 'bank_account')
      AND _case_status IN ('payment_processed', 'closed')
    THEN true
    
    -- fraud fields locked after investigation closed
    WHEN _field_name IN ('fraud_risk_score', 'fraud_signals')
      AND _case_status = 'closed'
    THEN true
    
    ELSE false
  END;
END;
$$;

-- Usage in UPDATE policies:
-- USING (NOT public.field_locked('wizard_data', current_status))
```

---

### 5.3 can_upload_document(case_id)

**Purpose**: Check if documents can still be uploaded to a case.

```sql
CREATE OR REPLACE FUNCTION public.can_upload_document(_case_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.cases
    WHERE id = _case_id
      AND current_status IN ('intake', 'validation', 'eligibility_check', 'under_review')
  )
$$;

-- Documents cannot be uploaded after case approval
-- Exception: admin override
```

---

### 5.4 can_update_eligibility(case_id)

**Purpose**: Check if eligibility evaluation can still be modified.

```sql
CREATE OR REPLACE FUNCTION public.can_update_eligibility(_case_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.cases
    WHERE id = _case_id
      AND current_status IN ('eligibility_check')
  )
$$;

-- Eligibility locked once case moves to under_review
```

---

## 6. Function Dependencies

The following diagram shows function dependencies:

```
                    ┌─────────────────┐
                    │   has_role()    │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
   ┌──────────┐       ┌──────────┐       ┌──────────────┐
   │is_admin()│       │is_reviewer│      │is_fraud_officer│
   └────┬─────┘       └─────┬────┘       └──────┬───────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │ has_case_access()│
                  └──────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
   ┌───────────┐    ┌──────────────┐   ┌────────────┐
   │is_case_   │    │is_document_  │   │is_portal_  │
   │owner()    │    │owner()       │   │owner()     │
   └───────────┘    └──────────────┘   └────────────┘
```

---

## 7. Creation Order

Functions must be created in dependency order:

| Order | Function | Dependencies |
|-------|----------|--------------|
| 1 | `has_role()` | None (base function) |
| 2 | `is_admin()` | has_role |
| 3 | `is_case_handler()` | has_role |
| 4 | `is_reviewer()` | has_role |
| 5 | `is_fraud_officer()` | has_role |
| 6 | `is_finance_officer()` | has_role |
| 7 | `is_audit_viewer()` | has_role |
| 8 | `current_user_id()` | None |
| 9 | `auth_office_id()` | None |
| 10 | `auth_district_id()` | None |
| 11 | `auth_portal_user_id()` | None |
| 12 | `auth_user_roles()` | None |
| 13 | `user_department_scope()` | None |
| 14 | `is_case_owner()` | None |
| 15 | `is_portal_owner()` | None |
| 16 | `is_document_owner()` | None |
| 17 | `has_case_access()` | All role + scope functions |
| 18 | `can_transition()` | None |
| 19 | `field_locked()` | None |
| 20 | `can_upload_document()` | None |
| 21 | `can_update_eligibility()` | None |

---

## 8. Testing Requirements

Each function must pass the following tests:

### 8.1 has_role() Tests

| Test | Input | Expected |
|------|-------|----------|
| Admin has admin role | (admin_uid, 'system_admin') | true |
| Admin without role | (admin_uid, 'fraud_officer') | false |
| Non-existent user | (random_uuid, 'system_admin') | false |
| Null user_id | (NULL, 'system_admin') | false |

### 8.2 has_case_access() Tests

| Test | User | Case | Expected |
|------|------|------|----------|
| Handler accesses assigned case | case_handler | assigned_case | true |
| Handler accesses unassigned case | case_handler | other_case | depends on office |
| Citizen accesses own case | citizen | own_case | true |
| Citizen accesses other case | citizen | other_case | false |
| Reviewer accesses case under review | reviewer | under_review_case | true |
| Reviewer accesses intake case | reviewer | intake_case | false |

---

## 9. Performance Considerations

- All functions use `STABLE` volatility for query optimizer benefits
- `has_role()` is called frequently; consider caching
- `has_case_access()` is complex; monitor query performance
- Index recommendations:
  - `user_roles(user_id, role)`
  - `cases(case_handler_id)`
  - `cases(intake_office_id)`
  - `citizens(portal_user_id)`

---

## 10. Requires Clarification

| Item | Context | Impact |
|------|---------|--------|
| staff_assignments table structure | auth_office_id() implementation | Scope functions |
| Multi-office user handling | Primary office selection | auth_office_id() |
| workflow_transitions table | can_transition() approach | Hardcoded vs table-driven |
| Function ownership | Execute permissions | Security |

---

## 11. References

- [RLS-Policy-Definitions.md](./RLS-Policy-Definitions.md)
- [RLS-Policy-Specification.md](./RLS-Policy-Specification.md)
- [Access-Control-PreModel.md](./Access-Control-PreModel.md)
- [case_workflow.json](../configs/workflows/case_workflow.json)

---

**Document Version**: 1.0  
**Phase**: 8  
**Status**: Documentation Only — Pending Phase 9 Execution
