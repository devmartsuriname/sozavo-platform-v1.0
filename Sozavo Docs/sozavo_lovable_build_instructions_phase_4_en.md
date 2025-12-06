# SoZaVo Central Social Services Platform – Lovable Build Instructions (Phase 4: Case Handling Workspaces)

> **Status:** Implementation Blueprint – Phase 4  
> **Prepared for:** Devmart Suriname – SoZaVo MVP Build  
> **Scope:** Case creation, case lifecycle screens, case handler workspace, reviewer workspace  
> **Related Docs:** PRD v2, Workflow Blueprint v2, Technical Architecture v2, Eligibility Rules Framework v1, Wizard Step Definitions v1, Lovable Build Instructions Phases 1–3

---

# 1. Purpose of Phase 4
Phase 4 focuses on building the **core operational environment** where SoZaVo staff process applications:

- Case creation after wizard completion
- Case detail pages with multiple tabs
- Status transitions based on workflow definitions
- Eligibility check integration
- Case history (audit trail)
- Reviewer workspace for approvals/rejections
- District office restrictions (logic only, RLS comes later)

Lovable must follow all structures defined in earlier phases.

---

# 2. Global Rules for Lovable in Phase 4

### Lovable MUST:
- Build UI strictly using the provided HTML template fragments (1:1 conversion).
- Use the existing database schema without modification.
- Place all workflow logic in engines, NOT inside UI components.
- Await approval before moving to Phase 5.

### Lovable MUST NOT:
- Create new tables, enums, or modify the schema.
- Invent its own workflow logic.
- Introduce new styling or UI elements.
- Mix business logic directly into components.

All new logic must live in:
```
src/integrations/engines/workflowEngine.ts
```

---

# 3. Case Creation Flow (Post-Wizard)

## 3.1 Trigger for Case Creation
After wizard completion, Lovable must:
1. Read the wizard session answers.
2. Create a new entry in the `cases` table:
   - `citizen_id`
   - `service_type_id`
   - `current_status = 'intake'`
   - `intake_office_id` (from user office)
   - `case_handler_id = null` (assigned later)

3. Insert an initial entry in `case_events`:
   - `event_type = 'status_change'`
   - `old_status = null`
   - `new_status = 'intake'`
   - `actor_user_id = currentUser`

## 3.2 Link Wizard Data to Case
Lovable must store:
- All wizard answers inside `case_events.meta` (as snapshot).
- Do NOT modify `wizard_sessions` after case creation.

---

# 4. Case Handler Workspace – Required Screens

Lovable must build the following UI screens using HTML → React 1:1 transformations.

## 4.1 Case List Page (`/cases`)
- Table with:
  - Case ID
  - Citizen name
  - Service type
  - Current status
  - Intake office
  - Case handler
  - Last updated
- Filters:
  - Service
  - Status
  - District
- Actions:
  - View Case

## 4.2 Case Detail Page (`/cases/[id]`)
Must contain tabbed interface with these tabs:

### **Tab 1: Overview**
- Citizen summary
- Current status
- Next required action
- Assigned handler
- "Assign to me" button

### **Tab 2: Citizen Profile**
- Pull data from `citizens`, `households`, `incomes`
- Display BIS flag if BIS was used during intake

### **Tab 3: Documents**
- List uploaded documents
- Required documents checklist
- Validation status per document (from Phase 5, placeholder for now)

### **Tab 4: Eligibility**
- Button: `Run Eligibility Evaluation`
- Display result + rule breakdown
- Link to previous results (from `eligibility_evaluations`)

### **Tab 5: Case History**
- List all `case_events`:
  - Status changes
  - Notes
  - Eligibility checks
  - Document updates

---

# 5. Workflow Engine – Case Status Transitions

Create file:
```
src/integrations/engines/workflowEngine.ts
```

Responsibilities:
- Read workflow definitions from `workflow_definitions` table.
- Validate allowed transitions.
- Apply transitions and write to `case_events`.
- Expose callable functions:
  - `getAllowedTransitions(caseId)`
  - `transitionCase(caseId, newStatus, actorUserId)`

### 5.1 Transition Rules (from Workflow Blueprint v2)
Lovable must enforce:

#### **General Assistance**
`intake → pending_docs → eligibility_check → under_review → approved/rejected → closed`

#### **Social Assistance (incl. Moni Karta)**
Same as above, plus optional Moni Karta review step.

#### **Child Allowance**
Simplified version.

### 5.2 Security Constraints (Logic Only)
- District officers can only create cases.
- Case handlers can transition up to `under_review`.
- Reviewers can transition to `approved` or `rejected`.

No RLS yet — only logic checks.

---

# 6. Reviewer Workspace

Lovable must build:

### **Reviewer Dashboard (`/cases/review`)**
- List cases in `under_review` status
- Filters for service type, district

### **Reviewer Case View (`/cases/review/[id]`)**
- Same tabs as Case Detail
- Additional reviewer-only actions:
  - `Approve Case`
  - `Reject Case`
- On decision:
  - Update `cases.current_status`
  - Insert `case_events` row
  - Lock case from further editing

---

# 7. Assignment Logic

## 7.1 Manual Assignment
On Case Detail page:
- Button `Assign to me`
- Sets `case_handler_id = currentUser`

## 7.2 Automatic Assignment (Future – not in MVP)
Lovable must NOT implement automated assignment.

---

# 8. Integration with Wizard & Eligibility (Phase 4 Scope)

### Lovable must:
- Display wizard snapshot data in Case Overview
- Link eligibility evaluations to the Eligibility tab
- Allow running eligibility checks manually from Case Detail

### Lovable must NOT:
- Automatically decide eligibility-based approval
- Modify eligibility engine logic

---

# 9. Forbidden Actions for Lovable in Phase 4
Lovable must NOT:
- Change database schema
- Combine tabs or alter UI layout
- Invent new workflows
- Build automatic approval logic
- Add or modify Tailwind classes

---

# 10. Completion Criteria for Phase 4
Phase 4 is considered complete when:

- [ ] Wizard session → case creation works
- [ ] Case list page fully implemented
- [ ] Case detail page with 5 tabs works
- [ ] Workflow transitions function correctly
- [ ] `case_events` logs all actions
- [ ] Reviewer workspace operational
- [ ] No schema changes introduced
- [ ] No design deviation from template

After completion, Lovable MUST await explicit approval before starting Phase 5.

---

**END OF LOVABLE BUILD INSTRUCTIONS – PHASE 4 (CASE HANDLING WORKSPACES, ENGLISH)**

