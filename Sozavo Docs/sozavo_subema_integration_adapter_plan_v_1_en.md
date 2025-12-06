# SoZaVo Central Social Services Platform – Subema Integration Adapter Plan v1.0 (Income Verification)

> **Status:** Concept & Implementation Blueprint – Draft v1.0  
> **Prepared for:** Devmart Suriname – SoZaVo MVP & Post-MVP Expansion  
> **Scope:** Design of the Subema integration layer (adapter), focused on income verification for social services
> **Related Docs:** Technical Architecture v2, BIS → CCR Mapping v1, Eligibility Rules Framework v1, Build Instructions Phases 1–9

---

## 1. Purpose of This Document
This document defines **how Subema will be integrated** into the SoZaVo Central Social Services Platform as an **income verification provider**.

Key goals:
- Use Subema as a **trusted external source** for income verification.
- Keep SoZaVo’s internal data model (CCR, incomes, cases) **stable and decoupled** from Subema’s API format.
- Protect Subema credentials and enforce **server-side only** communication.
- Provide clear UX for case handlers and reviewers when Subema is used.

---

## 2. Design Principles

1. **Adapter Pattern**  
   All Subema calls are wrapped in a single adapter module / Edge Function. The rest of the system never calls Subema directly.

2. **Server-Side Only**  
   - All Subema credentials and endpoints live inside **Supabase Edge Functions**.  
   - The frontend (admin or portal) never talks to Subema directly.

3. **Non-Blocking**  
   If Subema is down or slow, the platform:
   - Falls back to internal income data (CCR, documents, BIS where available).  
   - Marks cases as `needs_review` instead of blocking everything.

4. **Traceable & Auditable**  
   Each Subema call must be logged in a dedicated log table with:
   - who requested it, when, for which citizen/case, and outcome.

5. **Minimal Data Retention**  
   Store only the **necessary financial summary and reference** to Subema, not the full raw payload, unless required by SoZaVo policy.

---

## 3. High-Level Architecture

### 3.1 Components

- **Subema Edge Function** (Supabase):
  - `subemaVerifyIncome` – performs a call to Subema to verify income for a specific citizen.

- **Subema Adapter Module** (backend integration):
  - `src/integrations/engines/subemaAdapter.ts` – TypeScript wrapper used by Eligibility Engine and Case UI.

- **Log Table** (database):
  - `subema_sync_logs` – records all verification attempts.

- **Income References** (data model):
  - Additional fields inside `incomes` to store Subema references (e.g. `subema_reference`, `verified_by_subema`, `subema_last_checked_at`).

> Exact column names can be aligned with the existing technical architecture placeholders.

---

## 4. Data Model Impact

### 4.1 `incomes` Table (Extension)

Assumed additional fields (to be added via migration by Devmart):
- `subema_reference` (text, nullable) – external reference ID from Subema.
- `verified_by_subema` (boolean, default `false`).
- `subema_last_checked_at` (timestamp, nullable).

### 4.2 `subema_sync_logs` Table

New table schema (conceptual):
- `id` (PK)
- `citizen_id` (FK → `citizens.id`)
- `case_id` (FK → `cases.id`, nullable)
- `requested_by_user_id` (FK → `users.id`)
- `request_payload` (JSONB) – minimal metadata (e.g. national_id, period)
- `response_summary` (JSONB) – normalized summary (not raw full payload)
- `status` (enum: `success`, `not_found`, `error`)
- `error_message` (text, nullable)
- `created_at` (timestamp)

> This table is primarily for **audit and troubleshooting**, not for operational queries.

---

## 5. Edge Function Design – `subemaVerifyIncome`

### 5.1 Responsibilities

- Receive a **secure request** from the backend / admin UI (never from the public portal directly).  
- Validate input (citizen identifier, period, case ID).  
- Build and send a request to the Subema API using stored credentials.  
- Normalize the Subema response into an internal canonical structure.  
- Write an entry into `subema_sync_logs`.  
- Optionally update the `incomes` record with verification details.  
- Return a **safe, minimal** JSON back to the caller.

### 5.2 Input Contract (Example)

```json
{
  "citizen_id": "uuid",
  "case_id": "uuid",
  "national_id_number": "string",
  "period_from": "YYYY-MM-DD",
  "period_to": "YYYY-MM-DD"
}
```

### 5.3 Output Contract (Internal Canonical Format)

```json
{
  "status": "success" | "not_found" | "error",
  "normalized_income": {
    "monthly_amount": 12345.67,
    "currency": "SRD",
    "source_type": "salary" | "self_employed" | "other",
    "period_from": "YYYY-MM-DD",
    "period_to": "YYYY-MM-DD"
  },
  "subema_reference": "SUBEMA-REF-123456",
  "message": "Optional human-readable summary"
}
```

> The exact mapping depends on Subema’s real API, but this canonical shape is what the rest of the system will consume.

---

## 6. Adapter Module – `subemaAdapter.ts`

File: `src/integrations/engines/subemaAdapter.ts`

### 6.1 Responsibilities

- Provide a clean TypeScript API for the app:
  - `verifyIncomeWithSubema(citizenId, caseId): Promise<SubemaResult>`
- Call the Edge Function via Supabase client with proper auth context.
- Handle network and API errors gracefully.

### 6.2 Example Type Definitions

```ts
type SubemaStatus = "success" | "not_found" | "error";

type SubemaNormalizedIncome = {
  monthlyAmount: number | null;
  currency: string | null;
  sourceType: string | null;
  periodFrom: string | null;
  periodTo: string | null;
};

type SubemaResult = {
  status: SubemaStatus;
  normalizedIncome: SubemaNormalizedIncome | null;
  subemaReference: string | null;
  message?: string;
};
```

---

## 7. Integration with Eligibility Engine

The **Eligibility Engine** should treat Subema as an **optional enhancement**, not a hard dependency.

### 7.1 Flow Option A – On-Demand Verification

When a case handler clicks **"Verify Income with Subema"** on the Eligibility tab:

1. UI calls `subemaAdapter.verifyIncomeWithSubema(citizenId, caseId)`.
2. On `success`:
   - Create or update an `incomes` record flagged `verified_by_subema = true`.
   - Run `evaluateCaseEligibility(caseId)` again, now using the Subema-backed income.
3. On `not_found` or `error`:
   - Show clear message in UI.
   - Keep existing income data.
   - Optionally mark the evaluation as `needs_review`.

### 7.2 Flow Option B – Automatic Pre-Evaluation (Future)

Later phases might:
- Automatically attempt Subema verification before eligibility evaluation.  
- This is **not required for v1** and must only be enabled if performance and reliability are acceptable.

---

## 8. Admin UI Integration

### 8.1 Case Detail – Eligibility Tab

Add:
- Button: `Verify Income with Subema`
- Display section: `Subema Verification` showing:
  - Status: `Verified`, `Not Found`, `Error`, `Not Checked`
  - Last checked date
  - Monthly amount returned

### 8.2 Income Records View

On Citizen Profile / Income section, display:
- Badge: `Subema Verified` where applicable
- A link or icon to view last `subema_sync_logs` entry in a modal (for audit users only).

---

## 9. Security & Compliance Considerations

1. **Credentials Storage**  
   - Subema API keys and endpoints must be stored **only** in secure Edge Function environment variables.  
   - Never exposed to frontend.

2. **RLS & Authorization**  
   - Only authorized roles (case handlers, reviewers, admins) should be able to trigger Subema verification.

3. **Data Minimization**  
   - Store only the normalized income summary and reference ID.  
   - Avoid storing full Subema raw payload unless explicitly required.

4. **Auditability**  
   - All calls logged in `subema_sync_logs`.  
   - Helpful for dispute resolution and internal audits.

5. **Graceful Degradation**  
   - If Subema is unreachable, the platform must remain usable.  
   - Eligibility Engine falls back to existing CCR + document-based income data.

---

## 10. Error Handling & Fallbacks

- **Timeouts:** If Subema doesn’t respond within a defined timeout, return `status = "error"` with a generic message.
- **Not Found:** If no record exists in Subema, return `status = "not_found"` and do not modify existing income.
- **Validation Errors:** If Subema’s response is incomplete or inconsistent, map to `status = "error"` and log details.

UI Behavior:
- Show a clear banner on the Eligibility tab if verification failed or no record was found.
- Do not present Subema as the "truth" when there is a mismatch; instead, show it as **"External income data (Subema)"**.

---

## 11. Performance Considerations

- Avoid frequent repeated calls for the same citizen within a short window.  
- Implement simple caching or cooldown logic (e.g. "do not recheck within 7 days"), using `subema_last_checked_at`.
- Use pagination and filtering when building views around `subema_sync_logs`.

---

## 12. Forbidden Actions for Subema Integration

Lovable must NOT:
- Call Subema directly from the browser or public portal.  
- Store API keys or secrets in the client.  
- Automatically overwrite incomes without explicit logic.  
- Make Subema a hard requirement for eligibility (system must still work without it).

---

## 13. Completion Criteria (v1 Adapter)

Subema Adapter v1 is considered complete when:

- [ ] `subemaVerifyIncome` Edge Function is implemented with secure env-based configuration.  
- [ ] `subemaAdapter.ts` exposes a clean TypeScript API.  
- [ ] `subema_sync_logs` captures all verification attempts.  
- [ ] `incomes` records can be marked as `verified_by_subema` with a reference.  
- [ ] Eligibility tab displays Subema verification status and data.  
- [ ] Errors and unavailability are handled gracefully without blocking case processing.

---

**END OF SUBEMA INTEGRATION ADAPTER PLAN v1.0 (INCOME VERIFICATION, ENGLISH)**

