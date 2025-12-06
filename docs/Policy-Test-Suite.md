# Policy Test Suite
## SoZaVo Platform v1.0 — Phase 8

> **Status**: Documentation Only — NO SQL executed  
> **Version**: 1.0  
> **Source**: RLS-Policy-Definitions.md, Workflow-Security-Bindings.md

---

## 1. Overview

This document defines 20 comprehensive test scenarios to validate the RLS policies and workflow security bindings. Each test specifies the preconditions, actions, and expected outcomes.

### 1.1 Test Categories

| Category | Tests | Focus |
|----------|-------|-------|
| Role Access | T01-T10 | Role-based SELECT/INSERT/UPDATE/DELETE |
| Workflow-Based | T11-T15 | Status-driven restrictions |
| Document Access | T16-T20 | Document-specific security |
| **TOTAL** | **20** | |

### 1.2 Test User Setup

| User ID | Role | Office | District | Description |
|---------|------|--------|----------|-------------|
| USER_CITIZEN_A | citizen | N/A | N/A | Portal user, owns Case A |
| USER_CITIZEN_B | citizen | N/A | N/A | Portal user, owns Case B |
| USER_INTAKE | district_intake_officer | Office 1 | District 1 | Intake staff |
| USER_HANDLER | case_handler | Office 1 | District 1 | Assigned to Case A |
| USER_HANDLER_2 | case_handler | Office 2 | District 1 | Not assigned to Case A |
| USER_REVIEWER | case_reviewer | Office 1 | District 1 | Reviewer |
| USER_DEPT_HEAD | department_head | Office 1 | District 1 | Department oversight |
| USER_FINANCE | finance_officer | Central | Central | Payment processing |
| USER_FRAUD | fraud_officer | Central | Central | Fraud investigation |
| USER_ADMIN | system_admin | Central | Central | Full access |
| USER_AUDIT | audit_viewer | Central | Central | Read-only audit |

---

## 2. Role Access Tests (T01-T10)

### T01: Citizen Accessing Another Citizen's Data

**Objective**: Verify citizens cannot access other citizens' records

**Preconditions**:
- USER_CITIZEN_A owns Case A
- USER_CITIZEN_B owns Case B
- Both citizens authenticated

**Test Steps**:
```sql
-- Login as CITIZEN_B
SET LOCAL request.jwt.claim.sub = 'USER_CITIZEN_B';

-- Attempt to access Citizen A's record
SELECT * FROM public.citizens WHERE id = 'CITIZEN_A_ID';

-- Attempt to access Case A
SELECT * FROM public.cases WHERE id = 'CASE_A_ID';

-- Attempt to access Case A's documents
SELECT * FROM public.documents WHERE case_id = 'CASE_A_ID';
```

**Expected Results**:
| Query | Expected Result |
|-------|-----------------|
| SELECT citizens | 0 rows (empty) |
| SELECT cases | 0 rows (empty) |
| SELECT documents | 0 rows (empty) |

**Pass Criteria**: All queries return 0 rows

---

### T02: Intake Officer Updating Payment Fields

**Objective**: Verify intake officers cannot modify payment-related fields

**Preconditions**:
- USER_INTAKE authenticated
- Case A exists in 'intake' status

**Test Steps**:
```sql
-- Login as intake officer
SET LOCAL request.jwt.claim.sub = 'USER_INTAKE';

-- Attempt to update payment amount
UPDATE public.cases 
SET payment_amount = 1000.00 
WHERE id = 'CASE_A_ID';

-- Attempt to insert payment item
INSERT INTO public.payment_items (case_id, amount, status)
VALUES ('CASE_A_ID', 1000.00, 'pending');

-- Attempt to access payment_batches
SELECT * FROM public.payment_batches;
```

**Expected Results**:
| Action | Expected Result |
|--------|-----------------|
| UPDATE payment_amount | ERROR: permission denied OR 0 rows affected |
| INSERT payment_item | ERROR: permission denied |
| SELECT payment_batches | 0 rows (empty) |

**Pass Criteria**: All payment operations fail

---

### T03: Fraud Officer Reading Low-Risk Case

**Objective**: Verify fraud officers can only access fraud-flagged cases

**Preconditions**:
- USER_FRAUD authenticated
- Case A: fraud_flag = false
- Case C: fraud_flag = true

**Test Steps**:
```sql
-- Login as fraud officer
SET LOCAL request.jwt.claim.sub = 'USER_FRAUD';

-- Attempt to access non-flagged case
SELECT * FROM public.cases WHERE id = 'CASE_A_ID' AND fraud_flag = false;

-- Access flagged case
SELECT * FROM public.cases WHERE id = 'CASE_C_ID' AND fraud_flag = true;

-- Access fraud signals for non-flagged case
SELECT * FROM public.fraud_signals WHERE case_id = 'CASE_A_ID';
```

**Expected Results**:
| Query | Expected Result |
|-------|-----------------|
| SELECT non-flagged case | 0 rows |
| SELECT flagged case | 1 row with full data |
| SELECT fraud signals | Rows only for flagged cases |

**Pass Criteria**: Non-flagged cases hidden from fraud officer

---

### T04: Finance Officer Updating Eligibility

**Objective**: Verify finance officers cannot modify eligibility evaluations

**Preconditions**:
- USER_FINANCE authenticated
- Case A in 'payment_pending' status
- Eligibility evaluation exists

**Test Steps**:
```sql
-- Login as finance officer
SET LOCAL request.jwt.claim.sub = 'USER_FINANCE';

-- Attempt to update eligibility result
UPDATE public.eligibility_evaluations 
SET result = 'ineligible' 
WHERE case_id = 'CASE_A_ID';

-- Attempt to insert new eligibility evaluation
INSERT INTO public.eligibility_evaluations (case_id, result, score)
VALUES ('CASE_A_ID', 'eligible', 85);

-- Can view eligibility (for payment validation)
SELECT * FROM public.eligibility_evaluations WHERE case_id = 'CASE_A_ID';
```

**Expected Results**:
| Action | Expected Result |
|--------|-----------------|
| UPDATE eligibility | ERROR: permission denied OR 0 rows |
| INSERT eligibility | ERROR: permission denied |
| SELECT eligibility | 1 row (view allowed) |

**Pass Criteria**: Finance cannot modify eligibility

---

### T05: Reviewer Editing Wizard Data

**Objective**: Verify reviewers cannot modify wizard/intake data

**Preconditions**:
- USER_REVIEWER authenticated
- Case A in 'under_review' status
- Wizard data exists

**Test Steps**:
```sql
-- Login as reviewer
SET LOCAL request.jwt.claim.sub = 'USER_REVIEWER';

-- Attempt to update wizard_data
UPDATE public.cases 
SET wizard_data = '{"modified": true}' 
WHERE id = 'CASE_A_ID';

-- Attempt to update household data
UPDATE public.households 
SET household_size = 10 
WHERE case_id = 'CASE_A_ID';

-- Can view wizard data
SELECT wizard_data FROM public.cases WHERE id = 'CASE_A_ID';
```

**Expected Results**:
| Action | Expected Result |
|--------|-----------------|
| UPDATE wizard_data | ERROR: field locked OR 0 rows |
| UPDATE household | ERROR: permission denied |
| SELECT wizard_data | 1 row with data |

**Pass Criteria**: Reviewer has read-only access to intake data

---

### T06: Case Handler Viewing Unassigned Case

**Objective**: Verify case handlers can only access their assigned cases (unless same office)

**Preconditions**:
- USER_HANDLER_2 authenticated (Office 2)
- Case A assigned to USER_HANDLER (Office 1)
- Same district, different office

**Test Steps**:
```sql
-- Login as handler from different office
SET LOCAL request.jwt.claim.sub = 'USER_HANDLER_2';

-- Attempt to access case from different office
SELECT * FROM public.cases WHERE id = 'CASE_A_ID';

-- Attempt to update case from different office
UPDATE public.cases 
SET priority_level = 'high' 
WHERE id = 'CASE_A_ID';

-- Access own office cases
SELECT * FROM public.cases WHERE intake_office_id = 'OFFICE_2_ID';
```

**Expected Results**:
| Action | Expected Result |
|--------|-----------------|
| SELECT other office case | 0 rows (depends on policy) |
| UPDATE other office case | 0 rows affected |
| SELECT own office cases | N rows |

**Pass Criteria**: Cross-office access controlled

**Note**: Result depends on whether office-scope or handler-only policy is active

---

### T07: Audit Viewer Attempting to Write

**Objective**: Verify audit viewers have read-only access

**Preconditions**:
- USER_AUDIT authenticated

**Test Steps**:
```sql
-- Login as audit viewer
SET LOCAL request.jwt.claim.sub = 'USER_AUDIT';

-- Read all tables (should succeed)
SELECT COUNT(*) FROM public.cases;
SELECT COUNT(*) FROM public.citizens;
SELECT COUNT(*) FROM public.eligibility_evaluations;
SELECT COUNT(*) FROM public.fraud_signals;

-- Attempt any write operation
INSERT INTO public.cases (citizen_id, service_type_id) 
VALUES ('CIT_ID', 'SVC_ID');

UPDATE public.cases SET priority_level = 'high' WHERE id = 'CASE_A_ID';

DELETE FROM public.case_events WHERE id = 'EVENT_ID';
```

**Expected Results**:
| Action | Expected Result |
|--------|-----------------|
| SELECT (all tables) | Success with row counts |
| INSERT | ERROR: permission denied |
| UPDATE | ERROR: permission denied |
| DELETE | ERROR: permission denied |

**Pass Criteria**: All reads succeed, all writes fail

---

### T08: Admin Accessing All Resources

**Objective**: Verify admin has unrestricted access

**Preconditions**:
- USER_ADMIN authenticated

**Test Steps**:
```sql
-- Login as admin
SET LOCAL request.jwt.claim.sub = 'USER_ADMIN';

-- Access all tables
SELECT COUNT(*) FROM public.citizens;
SELECT COUNT(*) FROM public.cases;
SELECT COUNT(*) FROM public.user_roles;
SELECT COUNT(*) FROM public.fraud_signals;
SELECT COUNT(*) FROM public.payment_batches;

-- Modify any table
UPDATE public.cases SET priority_level = 'critical' WHERE id = 'CASE_A_ID';

INSERT INTO public.user_roles (user_id, role) 
VALUES ('NEW_USER_ID', 'case_handler');

DELETE FROM public.case_events WHERE id = 'OLD_EVENT_ID';
```

**Expected Results**:
| Action | Expected Result |
|--------|-----------------|
| All SELECT queries | Success with row counts |
| UPDATE | Success (1 row) |
| INSERT into user_roles | Success |
| DELETE | Success (if record exists) |

**Pass Criteria**: All operations succeed for admin

---

### T09: Department Head Viewing Department Cases

**Objective**: Verify department head can access all cases in their department

**Preconditions**:
- USER_DEPT_HEAD authenticated (District 1)
- Case A in Office 1 (District 1)
- Case D in Office 3 (District 2)

**Test Steps**:
```sql
-- Login as department head
SET LOCAL request.jwt.claim.sub = 'USER_DEPT_HEAD';

-- Access cases in own district
SELECT * FROM public.cases 
WHERE intake_office_id IN (
  SELECT id FROM public.offices WHERE district_id = 'DISTRICT_1_ID'
);

-- Access case in different district
SELECT * FROM public.cases WHERE id = 'CASE_D_ID';

-- Override decision in own district
UPDATE public.cases 
SET review_decision = 'approved', override_by = auth.uid()
WHERE id = 'CASE_A_ID';
```

**Expected Results**:
| Action | Expected Result |
|--------|-----------------|
| SELECT own district | N rows (all district cases) |
| SELECT other district | 0 rows |
| UPDATE own district | Success |

**Pass Criteria**: Department scope properly enforced

---

### T10: Citizen Viewing Own Case

**Objective**: Verify citizens can access their own data

**Preconditions**:
- USER_CITIZEN_A authenticated
- Case A owned by Citizen A

**Test Steps**:
```sql
-- Login as citizen A
SET LOCAL request.jwt.claim.sub = 'USER_CITIZEN_A';

-- Access own citizen record
SELECT * FROM public.citizens WHERE portal_user_id = auth.uid();

-- Access own cases
SELECT * FROM public.cases 
WHERE citizen_id IN (SELECT id FROM public.citizens WHERE portal_user_id = auth.uid());

-- Access own documents
SELECT * FROM public.documents WHERE case_id = 'CASE_A_ID';

-- Access own payment items
SELECT * FROM public.payment_items WHERE case_id = 'CASE_A_ID';

-- Access own notifications
SELECT * FROM public.portal_notifications WHERE portal_user_id = auth.uid();
```

**Expected Results**:
| Query | Expected Result |
|-------|-----------------|
| SELECT own citizen | 1 row with full data |
| SELECT own cases | N rows (all own cases) |
| SELECT own documents | N rows |
| SELECT own payments | N rows |
| SELECT own notifications | N rows |

**Pass Criteria**: Citizen can access all own data

---

## 3. Workflow-Based Tests (T11-T15)

### T11: Cannot Finalize Eligibility Unless Reviewer

**Objective**: Verify only reviewers can finalize eligibility decisions

**Preconditions**:
- Case A in 'under_review' status
- USER_HANDLER is assigned handler
- USER_REVIEWER is reviewer

**Test Steps**:
```sql
-- As handler, attempt to approve
SET LOCAL request.jwt.claim.sub = 'USER_HANDLER';
UPDATE public.cases 
SET current_status = 'approved' 
WHERE id = 'CASE_A_ID';
-- Expected: Fail

-- As reviewer, approve
SET LOCAL request.jwt.claim.sub = 'USER_REVIEWER';
UPDATE public.cases 
SET current_status = 'approved', review_decision = 'approved'
WHERE id = 'CASE_A_ID';
-- Expected: Success
```

**Expected Results**:
| Actor | Action | Expected |
|-------|--------|----------|
| Handler | Approve case | DENIED |
| Reviewer | Approve case | SUCCESS |

---

### T12: Cannot Process Payment Unless Finance Officer

**Objective**: Verify only finance officers can process payments

**Preconditions**:
- Case A in 'payment_pending' status
- Payment item exists

**Test Steps**:
```sql
-- As handler, attempt to process payment
SET LOCAL request.jwt.claim.sub = 'USER_HANDLER';
UPDATE public.payment_items 
SET status = 'processed' 
WHERE case_id = 'CASE_A_ID';
-- Expected: Fail

UPDATE public.cases 
SET current_status = 'payment_processed' 
WHERE id = 'CASE_A_ID';
-- Expected: Fail

-- As finance officer
SET LOCAL request.jwt.claim.sub = 'USER_FINANCE';
UPDATE public.payment_items 
SET status = 'processed' 
WHERE case_id = 'CASE_A_ID';
-- Expected: Success

UPDATE public.cases 
SET current_status = 'payment_processed' 
WHERE id = 'CASE_A_ID';
-- Expected: Success
```

**Expected Results**:
| Actor | Action | Expected |
|-------|--------|----------|
| Handler | Process payment | DENIED |
| Handler | Update to payment_processed | DENIED |
| Finance | Process payment | SUCCESS |
| Finance | Update to payment_processed | SUCCESS |

---

### T13: Cannot Unmask Sensitive Fields Unless Role Permits

**Objective**: Verify column masking is enforced

**Preconditions**:
- Citizen A has national_id, bank_account populated
- Masking views/functions in place

**Test Steps**:
```sql
-- As reviewer (should see masked)
SET LOCAL request.jwt.claim.sub = 'USER_REVIEWER';
SELECT national_id, bank_account_number FROM public.citizens_view WHERE id = 'CITIZEN_A_ID';
-- Expected: XXX-XXX-123, ****-****-****-7890

-- As fraud officer with flagged case (should see unmasked national_id)
SET LOCAL request.jwt.claim.sub = 'USER_FRAUD';
SELECT national_id FROM public.citizens_view WHERE id = 'CITIZEN_A_ID';
-- Expected: 123-456-789 (if fraud_flag = true)

-- As finance officer (should see unmasked bank_account)
SET LOCAL request.jwt.claim.sub = 'USER_FINANCE';
SELECT bank_account_number FROM public.citizens_view WHERE id = 'CITIZEN_A_ID';
-- Expected: 1234-5678-9012-7890

-- As citizen (should see own unmasked)
SET LOCAL request.jwt.claim.sub = 'USER_CITIZEN_A';
SELECT national_id, bank_account_number FROM public.citizens_view WHERE id = 'CITIZEN_A_ID';
-- Expected: Full values
```

**Expected Results**:
| Role | national_id | bank_account |
|------|-------------|--------------|
| reviewer | Masked | Masked |
| fraud (flagged) | Unmasked | Masked |
| finance | Masked | Unmasked |
| citizen (own) | Unmasked | Unmasked |

---

### T14: Cannot Transition Status Without Guard Conditions

**Objective**: Verify guard conditions block invalid transitions

**Preconditions**:
- Case A in 'intake' status
- Missing required documents

**Test Steps**:
```sql
-- As intake officer, attempt transition without all docs
SET LOCAL request.jwt.claim.sub = 'USER_INTAKE';

-- Verify guard fails
SELECT public.check_guard_all_docs_present('CASE_A_ID');
-- Expected: false

-- Attempt transition
UPDATE public.cases 
SET current_status = 'validation' 
WHERE id = 'CASE_A_ID';
-- Expected: Fail (guard not met)

-- Upload required document
INSERT INTO public.documents (case_id, document_type, status)
VALUES ('CASE_A_ID', 'required_type', 'uploaded');

-- Verify guard passes
SELECT public.check_guard_all_docs_present('CASE_A_ID');
-- Expected: true

-- Retry transition
UPDATE public.cases 
SET current_status = 'validation' 
WHERE id = 'CASE_A_ID';
-- Expected: Success
```

**Expected Results**:
| Condition | Transition | Expected |
|-----------|------------|----------|
| Docs missing | intake → validation | DENIED |
| Docs present | intake → validation | SUCCESS |

---

### T15: Cannot Modify Locked Fields After Status Change

**Objective**: Verify status-based field locking

**Preconditions**:
- Case A in 'under_review' status
- wizard_data was set during intake

**Test Steps**:
```sql
-- As handler, attempt to modify wizard_data
SET LOCAL request.jwt.claim.sub = 'USER_HANDLER';

-- Check field lock
SELECT public.field_locked('wizard_data', 'under_review');
-- Expected: true

-- Attempt update
UPDATE public.cases 
SET wizard_data = '{"modified": "new data"}' 
WHERE id = 'CASE_A_ID';
-- Expected: Fail or 0 rows

-- As admin, can override
SET LOCAL request.jwt.claim.sub = 'USER_ADMIN';
UPDATE public.cases 
SET wizard_data = '{"admin_modified": true}' 
WHERE id = 'CASE_A_ID';
-- Expected: Success (admin bypass)
```

**Expected Results**:
| Actor | Action | Expected |
|-------|--------|----------|
| Handler | Modify wizard_data (under_review) | DENIED |
| Admin | Modify wizard_data | SUCCESS |

---

## 4. Document Access Tests (T16-T20)

### T16: Citizen Can View Their Own Documents

**Objective**: Verify citizens can access documents for their cases

**Preconditions**:
- USER_CITIZEN_A authenticated
- Documents exist for Case A

**Test Steps**:
```sql
-- As citizen A
SET LOCAL request.jwt.claim.sub = 'USER_CITIZEN_A';

-- View own documents
SELECT * FROM public.documents WHERE case_id = 'CASE_A_ID';
-- Expected: All Case A documents

-- Download document content
SELECT file_path, file_content FROM public.documents WHERE id = 'DOC_A_ID';
-- Expected: Access granted
```

**Expected Results**:
| Action | Expected |
|--------|----------|
| SELECT own documents | N rows |
| Access file content | Success |

---

### T17: Reviewer Cannot Delete Documents

**Objective**: Verify reviewers have no delete access to documents

**Preconditions**:
- USER_REVIEWER authenticated
- Document exists

**Test Steps**:
```sql
-- As reviewer
SET LOCAL request.jwt.claim.sub = 'USER_REVIEWER';

-- Attempt to delete document
DELETE FROM public.documents WHERE id = 'DOC_ID';
-- Expected: Fail

-- Can view document
SELECT * FROM public.documents WHERE case_id = 'CASE_A_ID';
-- Expected: Success
```

**Expected Results**:
| Action | Expected |
|--------|----------|
| DELETE document | DENIED |
| SELECT document | SUCCESS |

---

### T18: Fraud Officer Views Documents Only When Fraud Flag True

**Objective**: Verify fraud officer document access is conditional

**Preconditions**:
- USER_FRAUD authenticated
- Case A: fraud_flag = false
- Case C: fraud_flag = true

**Test Steps**:
```sql
-- As fraud officer
SET LOCAL request.jwt.claim.sub = 'USER_FRAUD';

-- Attempt to access docs for non-flagged case
SELECT * FROM public.documents WHERE case_id = 'CASE_A_ID';
-- Expected: 0 rows

-- Access docs for flagged case
SELECT * FROM public.documents WHERE case_id = 'CASE_C_ID';
-- Expected: N rows
```

**Expected Results**:
| Case Flag | Document Access |
|-----------|-----------------|
| false | DENIED (0 rows) |
| true | SUCCESS (N rows) |

---

### T19: Citizen Cannot Upload After Case Approval

**Objective**: Verify document upload restrictions by status

**Preconditions**:
- USER_CITIZEN_A authenticated
- Case A in 'approved' status

**Test Steps**:
```sql
-- As citizen A
SET LOCAL request.jwt.claim.sub = 'USER_CITIZEN_A';

-- Check upload permission
SELECT public.can_upload_document('CASE_A_ID');
-- Expected: false

-- Attempt upload
INSERT INTO public.documents (case_id, citizen_id, document_type, file_path)
VALUES ('CASE_A_ID', 'CITIZEN_A_ID', 'additional_doc', '/path/to/file');
-- Expected: Fail
```

**Expected Results**:
| Status | Upload Allowed |
|--------|----------------|
| intake | YES |
| validation | YES |
| eligibility_check | YES |
| under_review | LIMITED |
| approved | NO |
| payment_pending | NO |

---

### T20: Handler Can Verify Documents for Assigned Cases

**Objective**: Verify handlers can verify documents they have access to

**Preconditions**:
- USER_HANDLER authenticated
- Assigned to Case A
- Document exists with status = 'uploaded'

**Test Steps**:
```sql
-- As assigned handler
SET LOCAL request.jwt.claim.sub = 'USER_HANDLER';

-- Verify document
UPDATE public.documents 
SET status = 'verified', verified_by = auth.uid(), verified_at = now()
WHERE id = 'DOC_A_ID' AND case_id = 'CASE_A_ID';
-- Expected: Success

-- As unassigned handler
SET LOCAL request.jwt.claim.sub = 'USER_HANDLER_2';

-- Attempt to verify
UPDATE public.documents 
SET status = 'verified'
WHERE id = 'DOC_A_ID';
-- Expected: 0 rows (no access)
```

**Expected Results**:
| Handler | Case Access | Verify Result |
|---------|-------------|---------------|
| Assigned | Yes | SUCCESS |
| Unassigned | No | 0 rows |

---

## 5. Test Execution Checklist

### 5.1 Pre-Test Setup

| Task | Status |
|------|--------|
| Create test database | ☐ |
| Load test fixtures | ☐ |
| Create test users | ☐ |
| Enable RLS policies | ☐ |
| Verify function creation | ☐ |

### 5.2 Test Execution Order

| Phase | Tests | Dependencies |
|-------|-------|--------------|
| 1 | T01, T07, T08, T10 | Basic RLS active |
| 2 | T02-T06, T09 | All role policies active |
| 3 | T11-T15 | Workflow functions active |
| 4 | T16-T20 | Document policies active |

### 5.3 Results Summary Template

| Test ID | Status | Notes |
|---------|--------|-------|
| T01 | ☐ PASS / ☐ FAIL | |
| T02 | ☐ PASS / ☐ FAIL | |
| T03 | ☐ PASS / ☐ FAIL | |
| T04 | ☐ PASS / ☐ FAIL | |
| T05 | ☐ PASS / ☐ FAIL | |
| T06 | ☐ PASS / ☐ FAIL | |
| T07 | ☐ PASS / ☐ FAIL | |
| T08 | ☐ PASS / ☐ FAIL | |
| T09 | ☐ PASS / ☐ FAIL | |
| T10 | ☐ PASS / ☐ FAIL | |
| T11 | ☐ PASS / ☐ FAIL | |
| T12 | ☐ PASS / ☐ FAIL | |
| T13 | ☐ PASS / ☐ FAIL | |
| T14 | ☐ PASS / ☐ FAIL | |
| T15 | ☐ PASS / ☐ FAIL | |
| T16 | ☐ PASS / ☐ FAIL | |
| T17 | ☐ PASS / ☐ FAIL | |
| T18 | ☐ PASS / ☐ FAIL | |
| T19 | ☐ PASS / ☐ FAIL | |
| T20 | ☐ PASS / ☐ FAIL | |

---

## 6. References

- [RLS-Policy-Definitions.md](./RLS-Policy-Definitions.md)
- [Workflow-Security-Bindings.md](./Workflow-Security-Bindings.md)
- [Security-Definer-Functions.md](./Security-Definer-Functions.md)
- [Column-Masking-Specification.md](./Column-Masking-Specification.md)

---

**Document Version**: 1.0  
**Phase**: 8  
**Status**: Documentation Only — Pending Phase 9 Execution
