# SoZaVo Central Social Services Platform – Lovable Build Instructions (Phase 9: Identity Profile Completion & Data Sync)

> **Status:** Implementation Blueprint – Phase 9  
> **Prepared for:** Devmart Suriname – SoZaVo MVP Build  
> **Scope:** Citizen Identity Profile Completion, CCR Linking, BIS-Assisted Checks (Admin Side), Data Consistency Rules  
> **Related Docs:** PRD v2, Workflow Blueprint v2, Technical Architecture v2, BIS → CCR Mapping v1, Wizard Step Definitions v1, Build Instructions Phases 1–8

---

# 1. Purpose of Phase 9
Phase 9 ensures that **every citizen account and application** is backed by a **clean, consistent Central Citizen Record (CCR)**.

Goals:
- Link every portal account to a CCR record
- Allow controlled completion or correction of identity profiles
- Optionally use BIS (admin-side only) to support verification
- Enforce minimal identity integrity rules before application submission

Lovable must implement these features **without breaking existing flows** and **without weakening security**.

---

# 2. Global Rules for Lovable in Phase 9

Lovable MUST:
- Treat `citizens` as the **only internal source of truth** for identity
- Keep BIS as an **optional** validator / prefill source (admin-side only)
- Respect all RLS rules from Phase 7
- Make all identity changes traceable

Lovable MUST NOT:
- Allow citizens to edit core CCR fields that are locked by SoZaVo policy
- Overwrite CCR records silently based on BIS data
- Introduce schema changes without explicit instruction

---

# 3. Citizen–CCR Linking Model

## 3.1 New Link Concept (Logical Only)

Lovable must treat the relationship between a portal account and CCR as:
- `auth.users.id` (portal user) ↔ `citizens.id` (CCR)

Implementation:
- A dedicated column in `citizens` (e.g. `portal_user_id`) may already be present or will be added by Devmart via migration; Lovable must **assume it exists** and use it.

## 3.2 Linking on First Login

When a citizen logs in to the portal for the first time:

1. Show **Identity Linking Wizard**:
   - Step 1: Ask for **National ID Number** and **Date of Birth**
   - Step 2: Optional extra check: first name / last name

2. Attempt to match an existing CCR:
   - Look for `citizens` where `national_id_number` + `date_of_birth` match

3. Outcomes:
   - **Match found:**
     - Link portal user to that `citizens.id` via `portal_user_id`
     - Mark profile as `linked`
   - **No match found:**
     - Offer to **create a new CCR entry**, with required fields filled from the identity wizard

---

# 4. Identity Profile Completion Flow (Portal)

## 4.1 New Page: `/portal/profile`

Lovable must create a Profile page where the citizen can:
- View identity data from CCR
- Edit only **allowed fields** (per SoZaVo policy)

### 4.2 Editable vs Non-Editable Fields

Non-editable (view-only in portal):
- National ID Number
- Date of Birth
- First Name
- Last Name

Editable (subject to RLS and policy):
- Phone number
- Email
- Address
- District

All updates must:
- Write changes to `citizens`
- Create a `case_events`-like audit record in a future `identity_audit` table (assumed present) or be logged through existing logging mechanism where available.

Lovable MUST NOT allow changes to non-editable fields directly from the portal.

---

# 5. Identity Prerequisites for Application Submission

Before a citizen can submit a new application from the public portal, Lovable must enforce:

1. **Portal user is linked to a CCR** (`portal_user_id` set).
2. **CCR has required identity fields filled**:
   - `national_id_number`
   - `date_of_birth`
   - `first_name`
   - `last_name`
   - `primary_phone`
   - `district`

If any required field is missing:
- Redirect citizen to `/portal/profile`
- Show a clear message: "Please complete your profile before submitting an application."

Application submission must be blocked until core profile is complete.

---

# 6. Admin-Side Identity Management & BIS-Assisted Checks

## 6.1 Identity Panel in Admin Citizen View

On the **Citizen Profile** tab in the Admin Case Detail page, Lovable must:
- Display identity fields clearly
- Show a badge if CCR is linked to a portal account (e.g., `Linked to Portal`)
- Show whether BIS data has ever been used for this CCR (e.g., `BIS Verified`)

## 6.2 BIS Validation Button (Admin-Only)

Admin-only feature (Case Handler or Reviewer):
- Button: `Run BIS Check`
- Calls the BIS Edge Function with the citizen’s BIS id or national id
- Compares the returned data with the CCR and flags differences.

Lovable must NOT:
- Automatically overwrite CCR fields after BIS check

Instead, it must:
- Display a comparison view (CCR vs BIS)
- Provide checkboxes to allow the admin to selectively update specific fields (e.g., address, phone)
- Any accepted changes must be saved explicitly.

---

# 7. Data Consistency Rules

Lovable must implement simple consistency checks and expose them in the Admin UI (not blocking, only informational):

Examples:
- **Address mismatch**: BIS address ≠ CCR address → show warning
- **Age mismatch**: Computed age from `date_of_birth` must equal `age_years` used in eligibility (if that field exists as a derived value)
- **Duplicate CCR check**: same National ID Number appearing in multiple CCRs → flag for audit

Implementation:
- Utility functions in `src/integrations/engines/identityEngine.ts`:
  - `checkCitizenConsistency(citizenId)`
  - `findPotentialDuplicates(nationalIdNumber)`

Consistency results must be shown:
- In the Admin Citizen Profile
- And optionally in the Case Overview tab when relevant

---

# 8. UX Flows to Prevent Confusion

## 8.1 When Portal User is Not Linked
- Block application submission
- Show clear banner on Dashboard and Services pages
- Provide direct link: `Complete Identity Profile`

## 8.2 When Identity is Partially Completed
- Allow profile editing until all required fields are present
- Display a progress indicator (e.g., `Profile 80% complete`)

## 8.3 After Successful Linking & Completion
- Show status: `Verified Profile` (label, not a legal verification status)

---

# 9. Forbidden Actions in Phase 9

Lovable must NOT:
- Let citizens change core identity fields that SoZaVo wants locked (national ID, DOB, primary name fields)
- Auto-merge data from BIS into CCR without human review
- Weaken RLS or bypass it for portal profile operations
- Assume BIS is always available – all BIS-based checks must be optional and failure-tolerant

---

# 10. Completion Criteria for Phase 9

Phase 9 is complete when:

- [ ] Portal users can link themselves to existing CCR records OR create CCR if none exists
- [ ] `/portal/profile` allows safe, controlled editing of allowed fields
- [ ] Application submission is blocked until identity is complete
- [ ] Admins can run BIS-assisted checks and selectively update CCR fields
- [ ] Identity consistency checks are available and visible in Admin UI
- [ ] No security or RLS rules are broken in the process

After completion, Lovable MUST await explicit approval before implementing any deeper integrations (Subema) or messaging flows.

---

**END OF LOVABLE BUILD INSTRUCTIONS – PHASE 9 (IDENTITY PROFILE COMPLETION & DATA SYNC, ENGLISH)**

