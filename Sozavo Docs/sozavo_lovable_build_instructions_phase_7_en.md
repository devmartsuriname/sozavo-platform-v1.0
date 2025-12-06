# SoZaVo Central Social Services Platform – Lovable Build Instructions (Phase 7: Security & Row-Level Security Policies)

> **Status:** Implementation Blueprint – Phase 7  
> **Prepared for:** Devmart Suriname – SoZaVo MVP Build  
> **Scope:** Authentication hardening, Role-Based Access Logic, Row-Level Security (RLS) policies, secure querying patterns  
> **Related Docs:** PRD v2, Workflow Blueprint v2, Technical Architecture v2, Eligibility Rules Framework v1, Wizard Step Definitions v1, Build Instructions Phases 1–6

---

# 1. Purpose of Phase 7
Phase 7 introduces **true data protection** inside the SoZaVo platform.

Lovable must implement:
- Secure authentication flows
- Authorization logic based on roles
- Full Row-Level Security (RLS) policies for all sensitive tables
- Safe query wrappers to prevent unauthorized data access

This is the **most critical phase** for government compliance.

Lovable must obey this document with zero deviation.

---

# 2. Global Rules for Lovable in Phase 7

Lovable MUST:
- Enable RLS on all tables listed
- Use policies exactly as described
- Move all authorization logic into policy + server-side Supabase rules
- Keep UI consistent with the design template

Lovable MUST NOT:
- Create new tables
- Add fields related to authorization unless approved
- Place sensitive logic in the frontend

---

# 3. Roles & Permissions Model

The following **roles** exist (already defined in the schema):
- `system_admin`
- `district_intake_officer`
- `case_handler`
- `case_reviewer`
- `department_head`
- `audit`

## 3.1 Role Principles
- **system_admin**: full read/write access
- **district_intake_officer**: create wizards + cases, view only their district cases
- **case_handler**: manage cases assigned to them
- **case_reviewer**: approve/reject cases
- **department_head**: read-only access across department
- **audit**: read-only access across all tables

---

# 4. RLS Requirements

Lovable must enable Row-Level Security for **ALL** of the following tables:
- `citizens`
- `households`
- `incomes`
- `cases`
- `case_events`
- `documents`
- `document_requirements`
- `eligibility_rules`
- `eligibility_evaluations`
- `wizard_sessions`
- `wizard_definitions`
- `workflow_definitions`

---

# 5. Authentication Context (Important)

Every RLS policy must use:
- `auth.uid()` for the logged-in user
- A join to the `users` table to determine:
  - role
  - office
  - district

Lovable must ensure that every query sent from frontend includes:
- Logged-in user's JWT
- No service role keys on frontend

---

# 6. RLS Policies (Exact Definitions)

Lovable must create these policies **verbatim**, without modification.

## 6.1 citizens

### SELECT:
District officers:
```sql
(auth.uid() = users.id AND users.role = 'district_intake_officer' AND citizens.district = users.district)
```
Handlers & reviewers:
```sql
citizens.id IN (SELECT citizen_id FROM cases WHERE case_handler_id = auth.uid() OR reviewer_id = auth.uid())
```
Audit + admin:
```sql
users.role IN ('system_admin', 'audit')
```

### INSERT:
Only system_admin may insert directly. Wizard creates citizens via backend edge function (future).

### UPDATE:
Only system_admin.

---

## 6.2 cases

### SELECT:
District officers:
```sql
cases.intake_office_id = users.office_id
```
Case handlers:
```sql
cases.case_handler_id = auth.uid()
```
Reviewers:
```sql
cases.current_status = 'under_review'
```
Admins & audit:
```sql
users.role IN ('system_admin', 'audit')
```

### INSERT:
District officers may insert:
```sql
users.role = 'district_intake_officer'
```

### UPDATE:
Handlers:
```sql
cases.case_handler_id = auth.uid()
```
Reviewers:
```sql
users.role = 'case_reviewer'
```
Admins:
```sql
users.role = 'system_admin'
```

---

## 6.3 documents

### SELECT:
User can only see documents:
```sql
documents.case_id IN (SELECT id FROM cases WHERE ...RLS case rules...)
```
Apply case visibility logic.

### INSERT:
District officers & case handlers:
```sql
users.role IN ('district_intake_officer', 'case_handler')
```

### UPDATE:
Handlers only for editing metadata:
```sql
documents.case_id IN (SELECT id FROM cases WHERE case_handler_id = auth.uid())
```

---

# 7. Secure Query Wrapper

Lovable must create:
```
src/integrations/supabase/secureQuery.ts
```

This wrapper must:
- Use `supabase.from(...).select()` safely
- Automatically attach `auth.uid()` context
- Handle RLS errors
- Provide helper functions:
  - `selectVisibleCases()`
  - `selectCitizenVisible()`
  - `insertCaseSecure()`

All pages must use these wrappers.

---

# 8. Security Testing Requirements

Lovable must build a secure internal testing page:
```
/dev/security-test
```

This page must:
- Simulate each role
- Test ability to:
  - View cases
  - View citizens
  - Upload documents
  - Access reports
- Confirm RLS is applied correctly

---

# 9. Forbidden Actions in Phase 7
Lovable must NOT:
- Add or modify columns
- Disable RLS once enabled
- Use service role keys in frontend
- Hardcode user roles in code
- Expose Supabase keys in browser

---

# 10. Completion Criteria for Phase 7

Phase 7 is complete when:
- [ ] RLS is enabled on all required tables
- [ ] All policies are implemented exactly as written
- [ ] Secure query wrapper is functional
- [ ] All pages use secure querying
- [ ] `/dev/security-test` validates RLS behavior for each role
- [ ] No schema or design changes were introduced

After completion, Lovable MUST await explicit approval before starting Phase 8.

---

**END OF LOVABLE BUILD INSTRUCTIONS – PHASE 7 (SECURITY & RLS POLICIES, ENGLISH)**

