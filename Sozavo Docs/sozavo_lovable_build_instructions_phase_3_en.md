# SoZaVo Central Social Services Platform – Lovable Build Instructions (Phase 3: Wizard + Eligibility Integration)

> **Status:** Implementation Blueprint – Phase 3  
> **Prepared for:** Devmart Suriname – SoZaVo MVP Build  
> **Scope:** Wizard Engine + Eligibility Engine integration for all 3 MVP services  
> **Related Docs:** PRD v2, Workflow Blueprint v2, Technical Architecture v2, Eligibility Rules Framework v1, Wizard Step Definitions v1, Lovable Build Instructions Phase 1 & 2

---

# 1. Purpose of Phase 3
Phase 3 focuses on **making the system intelligent**:

- Implementing the **Wizard Engine** that drives the intake flows for:
  - General Assistance
  - Social Assistance (incl. Moni Karta)
  - Child Allowance

- Wiring the **Eligibility Engine** to:
  - Read rules from `eligibility_rules`
  - Evaluate them against CCR + case data
  - Store outcomes in `eligibility_evaluations`

This phase uses ONLY the structures already defined in:
- `wizard_definitions`
- `wizard_sessions`
- `eligibility_rules`
- `eligibility_evaluations`

Lovable may NOT invent alternative structures.

---

# 2. Global Rules for Lovable in Phase 3

1. **No schema changes** – Lovable must not alter database tables or enums.  
2. **No UI redesign** – all components must reuse the layout and styles from Phase 2.  
3. **No new external dependencies** without explicit instruction.  
4. **All logic must be encapsulated in predictable modules** under `src/integrations/engines/`.

Directory requirements:
```txt
src/
  integrations/
    engines/
      wizardEngine.ts
      eligibilityEngine.ts
  components/
    wizard/
      WizardContainer.tsx
      WizardStep.tsx
      WizardNavigation.tsx
  pages/
    wizards/
      general-assistance.tsx
      social-assistance.tsx
      child-allowance.tsx
```

---

# 3. Wizard Engine Implementation Instructions

## 3.1 Wizard Engine Core Module

Create file: `src/integrations/engines/wizardEngine.ts`

Responsibilities:
- Load wizard definition JSON from `wizard_definitions` table for a given `service_type_id`.
- Provide functions to:
  - `getWizardDefinition(serviceTypeCode: string)`
  - `startWizardSession(citizenId, serviceTypeCode)`
  - `saveStepAnswers(sessionId, stepCode, answers)`
  - `goToNextStep(sessionId)`
  - `getCurrentStep(sessionId)`

Restrictions:
- No hardcoding of wizard flows in code – they must come from `wizard_definitions`.
- All step codes and structures are defined by the **Wizard Step Definitions v1** document.

## 3.2 Wizard Session Handling

Table: `wizard_sessions`

Lovable must use this table to store:
- `citizen_id`
- `service_type_id`
- `current_step`
- `answers_json`

Behavior:
- When a district officer starts a new wizard for a citizen → create a new `wizard_sessions` entry.
- When they move to next step → update `current_step` and merge `answers_json`.

## 3.3 Conditional Logic Handling

Each step may include a JSON `conditions` array.

Lovable must implement:
- A generic condition evaluator:
  - Accepts current `answers_json`
  - Checks conditions: `{ field, operator, value }`
- If conditions are not satisfied → step is skipped.

Condition operators allowed:
- `==`, `!=`, `<`, `>`, `<=`, `>=`

## 3.4 Document Requirements Integration

Each step may contain `documents_required` array.

Lovable must:
- Expose required document types to the UI at each step.
- NOT implement upload logic here (Phase 5), only surface requirements.

---

# 4. Wizard UI Wiring (Admin Side)

## 4.1 Wizard Container Wiring

Use existing components from Phase 2:
- `WizardContainer`
- `WizardStep`
- `WizardNavigation`

For each service route:
- `/wizards/general-assistance`
- `/wizards/social-assistance`
- `/wizards/child-allowance`

Lovable must:
- Load definition using `wizardEngine.getWizardDefinition(serviceTypeCode)`.
- Bind UI state to `wizard_sessions` data.
- Implement:
  - `onNext` → calls `saveStepAnswers` + `goToNextStep`
  - `onBack` → optional; if implemented, must not break sessions.

## 4.2 BIS Prefill Integration (Read-only in Phase 3)

At the **IDENTIFICATION** step:
- If `bis_number` is provided → call existing BIS Edge Function.
- If BIS returns data → only prefill front-end fields.
- Persist into CCR only when wizard completes and a case is created (Phase 4+).

Lovable must NOT:
- Overwrite CCR directly in Phase 3.

---

# 5. Eligibility Engine Implementation Instructions

## 5.1 Eligibility Engine Core Module

Create file: `src/integrations/engines/eligibilityEngine.ts`

Responsibilities:
- Load active rules from `eligibility_rules` for a given `service_type_id`.
- Evaluate rules against:
  - `citizens`
  - `households`
  - `incomes`
  - `cases`
  - `documents`
- Return a structured result:
  - `eligible` | `not_eligible` | `needs_review`
  - Rule-level outcomes in `details_json`.

Functions (required):
- `evaluateCaseEligibility(caseId: string): Promise<EligibilityResult>`
- `evaluateForService(citizenId: string, serviceTypeCode: string): Promise<EligibilityResult>`

## 5.2 Rule Evaluation Model

Lovable must follow the **Eligibility Rules Framework v1**:
- Use `rule_json` structure
- Supported rule types:
  - `threshold`
  - `comparison`
  - `set_membership`
  - `compound`

Lovable must:
- Iterate rules in order of `priority` ascending.
- For each rule, calculate `passed` / `failed` / `not_applicable`.
- Aggregate to a final decision using this logic:
  - If any mandatory rule fails → `not_eligible`.
  - If all mandatory rules pass → `eligible`.
  - If evaluation is incomplete → `needs_review`.

## 5.3 Writing to `eligibility_evaluations`

For each evaluation, Lovable must insert a row into `eligibility_evaluations`:
- `case_id`
- `service_type_id`
- `result`
- `details_json`

No overwriting – multiple evaluations per case are allowed.

---

# 6. Integration Between Wizard & Eligibility

## 6.1 When to Trigger Eligibility

Eligibility checks are triggered:
- After wizard completion
- After case creation (Phase 4), BUT

In Phase 3, Lovable must implement the **evaluation logic** and a simple manual trigger in UI:
- A button: `Run Eligibility Check` on a test page or case detail mock.

## 6.2 Input Assumptions (Phase 3)

Because full case creation is Phase 4, Phase 3 may:
- Use mock case IDs or temporary records, OR
- Focus only on `evaluateForService(citizenId, serviceTypeCode)`.

Lovable must **NOT** assume final case workflow yet.

---

# 7. Test Utilities (Required)

Lovable must create a basic internal test page (admin-only) under:
- `/dev/eligibility-test`

This page must:
- Allow selecting a citizen
- Allow selecting a service (General Assistance, Social Assistance, Child Allowance)
- Call `eligibilityEngine.evaluateForService`
- Display:
  - final result
  - list of rules with pass/fail status

This page is for **internal validation only** and not meant for production users.

---

# 8. Forbidden Actions in Phase 3

Lovable must NOT:
- Change DB schema
- Hardcode wizard flows in code
- Ignore JSON definitions for steps or rules
- Implement actual decisions (approve/reject) – that belongs to Case Handling in later phases
- Mix business logic directly into UI components

All engines must live in `src/integrations/engines/` and be pure, testable functions.

---

# 9. Completion Criteria for Phase 3

Phase 3 is considered complete when:

- [ ] Wizard Engine can:
  - Load definitions from DB
  - Create and update wizard sessions
  - Progress through steps with conditions
- [ ] Eligibility Engine can:
  - Load rules from DB
  - Evaluate rules for a citizen/service
  - Write evaluations to `eligibility_evaluations`
- [ ] Internal test page `/dev/eligibility-test` works end-to-end
- [ ] No schema changes were introduced
- [ ] No UI design was modified

After these are done, Lovable must **await explicit approval** before proceeding to Case Handling (Phase 4).

---

**END OF LOVABLE BUILD INSTRUCTIONS – PHASE 3 (WIZARD + ELIGIBILITY INTEGRATION, ENGLISH)**

