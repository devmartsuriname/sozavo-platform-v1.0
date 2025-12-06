# SoZaVo Platform v1.0 – Case Authorization Model

> **Version:** 1.0  
> **Phase:** 7 – RLS Security & Authorization Layer  
> **Status:** Specification Document  
> **Cross-References:** RLS-Policy-Specification.md, case_workflow.json, Workflow-Blueprint.md

---

## 1. Overview

This document defines case-specific authorization rules, including ownership, status-driven access, and escalation procedures.

---

## 2. Case Ownership Rules

### 2.1 Portal Ownership (Citizen Access)

**Definition:** A citizen owns a case if the case's citizen record is linked to their portal account.

**Ownership Chain:**
```
auth.uid() 
  → citizens.portal_user_id 
    → citizens.id 
      → cases.citizen_id
```

**Access Expression:**
```
cases.citizen_id IN (
  SELECT id FROM citizens 
  WHERE portal_user_id = auth.uid()
)
```

**Permissions Granted:**
- SELECT on own case record
- SELECT on case_events for own case
- SELECT on eligibility_evaluations for own case
- SELECT on documents for own case
- INSERT documents (limited workflow states)
- SELECT on payments for own case
- SELECT on portal_notifications

**Restrictions:**
- Cannot see internal_notes
- Cannot see fraud_risk_level details
- Cannot see handler assignments
- Cannot modify case status

### 2.2 Handler Assignment

**Definition:** A case handler is assigned to process a specific case.

**Assignment Field:** `cases.case_handler_id`

**Access Expression:**
```
cases.case_handler_id = current_user_id()
```

**Permissions Granted:**
- SELECT on assigned case
- UPDATE case fields (excluding locked fields)
- Workflow transitions (allowed by role)
- INSERT case_events
- INSERT/UPDATE eligibility_evaluations (before lock)
- UPDATE documents (verification status)

**Assignment Rules:**
- Handler assigned during `validation` status
- Assignment can be changed by department_head
- Assignment cleared on case close

### 2.3 Supervisor Override

**Definition:** Department heads can access all cases within their department scope.

**Scope Expression:**
```
cases.intake_office_id IN (
  SELECT id FROM offices 
  WHERE district_id IN (
    SELECT district_id FROM user_department_scope(auth.uid())
  )
)
```

**Override Capabilities:**
- View all department cases regardless of assignment
- Override eligibility decisions (with justification)
- Reassign cases to different handlers
- Approve escalated decisions
- Reopen closed cases (with justification)

---

## 3. Status-Driven Authorization

### 3.1 Status-Action Matrix

Based on `configs/workflows/case_workflow.json`:

| Status | Allowed Actions | Authorized Roles |
|--------|-----------------|------------------|
| intake | Submit for validation | district_intake_officer, case_handler |
| intake | Upload documents | citizen, district_intake_officer |
| intake | Put on hold | case_handler |
| validation | Move to eligibility | case_handler |
| validation | Request more docs | case_handler |
| eligibility_check | Run eligibility | case_handler |
| eligibility_check | Move to review | case_handler |
| under_review | Approve | case_reviewer, department_head |
| under_review | Reject | case_reviewer, department_head |
| under_review | Request revision | case_reviewer |
| under_review | Put on hold | case_reviewer |
| approved | Create payment | finance_officer, system |
| on_hold | Resume processing | case_handler, case_reviewer |
| on_hold | Close case | department_head |
| payment_pending | Process payment | finance_officer, system |
| payment_pending | Mark failed | finance_officer, system |
| payment_processed | Close case | case_handler, system |
| rejected | Close case | case_handler |
| rejected | Appeal (reopen) | department_head |
| fraud_investigation | Clear case | fraud_officer |
| fraud_investigation | Escalate | fraud_officer, department_head |
| closed | Reopen | department_head |

### 3.2 Status Transition Guards

| Transition | Guard Conditions |
|------------|------------------|
| intake → validation | wizard_data complete, citizen verified |
| validation → eligibility_check | required documents uploaded |
| eligibility_check → under_review | eligibility_evaluations exists |
| under_review → approved | all criteria passed OR override exists |
| under_review → rejected | rejection_reason provided |
| approved → payment_pending | payment record created |
| payment_pending → payment_processed | subema_confirmed = true |
| * → fraud_investigation | fraud_alert_triggered |
| fraud_investigation → * | investigation_cleared |

### 3.3 Data Lock Rules

| Data Element | Locked When | Unlocked By |
|--------------|-------------|-------------|
| wizard_data | status != 'intake' | Never (immutable) |
| eligibility_evaluations.result | status IN ('approved', 'rejected', 'closed') | department_head override |
| eligibility_evaluations.criteria_results | status IN ('approved', 'rejected', 'closed') | Never |
| payments.amount | status = 'processed' | Never |
| payments.recipient_account | status = 'processed' | Never |
| case.current_status | status = 'closed' | department_head (reopen) |

---

## 4. Field-Level Authorization

### 4.1 Case Fields by Role Access

| Field | citizen | intake | handler | reviewer | dept_head | finance | fraud | admin |
|-------|---------|--------|---------|----------|-----------|---------|-------|-------|
| id | R | R | R | R | R | R | R | RW |
| case_reference | R | R | R | R | R | R | R | R |
| citizen_id | R | R | R | R | R | R | R | R |
| service_type_id | R | R | R | R | R | R | R | RW |
| current_status | R | R | R | R | R | R | R | RW |
| wizard_data | R | RW | R | R | R | R | R | RW |
| case_handler_id | - | R | R | R | RW | R | R | RW |
| intake_office_id | R | R | R | R | R | R | R | RW |
| fraud_risk_level | - | - | R | R | R | - | RW | RW |
| internal_notes | - | - | RW | RW | RW | - | RW | RW |
| created_at | R | R | R | R | R | R | R | R |
| updated_at | R | R | R | R | R | R | R | R |

**Legend:** R = Read, W = Write, RW = Read/Write, - = No access

### 4.2 Update Restrictions by Status

| Status | Updatable Fields |
|--------|------------------|
| intake | wizard_data, documents, internal_notes |
| validation | documents, internal_notes, case_handler_id |
| eligibility_check | eligibility_evaluations, internal_notes |
| under_review | internal_notes, decision fields |
| approved | payment_fields, internal_notes |
| on_hold | hold_reason, internal_notes |
| payment_pending | payment_status only |
| payment_processed | None (except notes) |
| rejected | None (except notes) |
| fraud_investigation | fraud fields, internal_notes |
| closed | None |

---

## 5. Escalation Rules

### 5.1 Fraud Escalation

**Trigger:** `fraud_risk_level` IN ('HIGH', 'CRITICAL')

**Automatic Actions:**
1. Case status transitions to `fraud_investigation` if CRITICAL
2. Payment processing blocked
3. Fraud officer notified
4. Supervisor notified (if CRITICAL)

**Authorization Changes:**
- fraud_officer gains full case access
- case_handler retains read access only
- citizen access unchanged (cannot see fraud data)

**Resolution:**
- fraud_officer clears case → returns to previous status
- fraud_officer confirms fraud → status = rejected, reason = fraud_confirmed

### 5.2 Payment Escalation

**Trigger:** Payment failure after 3 retries

**Automatic Actions:**
1. finance_officer notified
2. Case flagged for manual intervention
3. Payment status = 'manual_required'

**Authorization Changes:**
- finance_officer required for any payment action
- case_handler read-only on payment data

### 5.3 Decision Override Escalation

**Trigger:** Eligibility override requested

**Requirements:**
1. case_reviewer or case_handler initiates
2. department_head approval required
3. Written justification mandatory
4. Audit event created

**Authorization Flow:**
```
case_handler/reviewer requests override
  → Creates override_request event
    → department_head receives notification
      → department_head approves/rejects
        → If approved: eligibility result updated
        → Audit trail records override
```

### 5.4 Case Reopen Escalation

**Trigger:** Closed case reopen requested

**Requirements:**
1. Only department_head can reopen
2. Written justification mandatory
3. Audit event created
4. Original handler notified

**Status Transition:**
```
closed → reopened → [determined by dept_head]
```

---

## 6. Multi-Case Authorization Rules

### 6.1 Citizen Multi-Case Access

A citizen may have multiple cases. Each case is independently authorized:
- Citizen sees all own cases
- Citizen cannot see other household members' cases (unless explicitly linked)
- Citizen cannot compare cases or access aggregate data

### 6.2 Handler Case Load

Case handlers may be assigned multiple cases:
- Each case authorized independently
- Handler cannot bulk-update across cases
- Handler assignment tracked per case

### 6.3 Cross-Case Investigation

For fraud investigation across multiple cases:
- fraud_officer can view related cases if flagged
- Relationship determined by citizen_id, address, or other signals
- Cross-case access logged in audit

---

## 7. Temporal Authorization

### 7.1 Case Age Rules

| Condition | Authorization Impact |
|-----------|---------------------|
| Case closed < 30 days | Normal access |
| Case closed 30-365 days | case_handler loses access |
| Case closed > 365 days | Only audit_viewer and system_admin |

### 7.2 Session-Based Restrictions

- Authorization checked per request
- No cached authorization decisions
- Role changes effective immediately
- Office reassignment effective next session

---

## 8. Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Phase 7 | System | Initial specification |
