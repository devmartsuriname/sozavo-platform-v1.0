# SoZaVo Central Social Services Platform – BIS → CCR Mapping Table (v1.0, English)

> **Status:** Draft – Structure + Assumptions (to be validated with BIS team)  
> **Prepared for:** Ministry of Social Affairs & Housing (SoZaVo)  
> **Prepared by:** Devmart Suriname  
> **Related Docs:** PRD v2.0, Workflow Blueprint v2.0, Technical Architecture v2.0, Eligibility Rules Framework v1.0

---

## 1. Purpose
This document defines the **logical mapping** between BIS data fields and the internal **Central Citizen Record (CCR)** model used by the SoZaVo Central Social Services Platform.

The mapping allows:
- A clean intake prefill from BIS
- A stable CCR that does **not** depend on BIS structure
- Easy adaptation if BIS changes in future

> **Important:** Field names on the BIS side are partially assumed and must be confirmed with the BIS / e-Gov technical team.

---

## 2. Core Principles
1. **CCR is the internal source of truth.**  
2. **BIS is used only as an upstream intake prefill source.**  
3. **All BIS data is mapped and normalized into CCR tables:** `citizens`, `households`, `incomes`, and related entities.  
4. No hard dependency on BIS keys beyond `bis_id` for linking.

---

## 3. Legend
- **BIS Domain:** Logical group of fields in BIS (e.g. Citizen, Household).
- **BIS Field (Assumed):** Field name / label from BIS (to be confirmed).
- **CCR Target Table.Field:** Our internal Supabase schema target.
- **Transformation Notes:** Any conversions, validations, or rules.

---

## 4. Citizen Identity Mapping

| BIS Domain | BIS Field (Assumed)      | CCR Target Table.Field       | Transformation Notes                                      |
|-----------|--------------------------|------------------------------|-----------------------------------------------------------|
| Citizen   | `bis_person_id`          | `citizens.bis_id`            | Primary BIS key; used for matching on repeated intakes.   |
| Citizen   | `national_id`            | `citizens.national_id_number`| 1:1 copy; trimmed and normalized (e.g. remove spaces).    |
| Citizen   | `first_name`             | `citizens.first_name`        | Capitalize; remove leading/trailing spaces.               |
| Citizen   | `last_name`              | `citizens.last_name`         | Capitalize; remove leading/trailing spaces.               |
| Citizen   | `middle_name`            | *(optional: extend CCR)*     | Could be mapped into an optional `middle_name` column.    |
| Citizen   | `date_of_birth`          | `citizens.date_of_birth`     | Store as ISO date; derive `age_years` in views, not table.|
| Citizen   | `gender`                 | `citizens.gender`            | Map BIS code (M/F/O) to readable values if needed.        |
| Citizen   | `phone_primary`          | `citizens.primary_phone`     | Basic format normalization; no strict validation at MVP.  |
| Citizen   | `email`                  | `citizens.email`             | Lowercase; optional field.                                |

---

## 5. Address & Location Mapping

| BIS Domain | BIS Field (Assumed) | CCR Target Table.Field | Transformation Notes                                                |
|-----------|---------------------|------------------------|---------------------------------------------------------------------|
| Address   | `address_line`      | `citizens.address`     | Combined address line; future split into street/number is possible. |
| Address   | `district_code`     | `citizens.district`    | Map BIS district codes → readable district names if required.       |
| Address   | `postal_code`       | *(optional CCR field)* | Only if relevant to SoZaVo context.                                 |

---

## 6. Household Mapping

| BIS Domain | BIS Field (Assumed)     | CCR Target Table.Field         | Transformation Notes                                                  |
|-----------|-------------------------|--------------------------------|-----------------------------------------------------------------------|
| Household | `household_id`          | `households.id` (or external)  | If BIS household ID is stable, store as reference.                    |
| Household | `is_household_head`     | `households.head_citizen_id`   | If flag = true → citizen becomes `head_citizen_id`.                   |
| Household | `household_size`        | `households.total_members`     | Direct map; recalculated if local overrides exist.                    |
| Household | `dependents_count`      | `households.total_dependents`  | Direct map; can be validated against CCR members later.               |
| Household | `household_address`     | `households.address`           | If present and different from citizen address → stored separately.    |
| Household | `household_district`    | `households.district`          | District code mapping to internal representation.                     |

> In many cases, SoZaVo will treat the **citizen’s address** as leading. Household address is secondary and used mainly for cross-checking.

---

## 7. Income & Employment Mapping

| BIS Domain | BIS Field (Assumed)     | CCR Target Table.Field            | Transformation Notes                                                      |
|-----------|-------------------------|-----------------------------------|---------------------------------------------------------------------------|
| Income    | `employment_status`     | `incomes.source_type`             | Map BIS codes → `salary`, `self_employed`, `pension`, `other`.            |
| Income    | `employer_name`         | `incomes.employer_name`           | Direct map; optional for unemployed citizens.                             |
| Income    | `monthly_income_amount` | `incomes.monthly_amount`          | Numeric SRD value; store as decimal.                                      |
| Income    | `currency`              | `incomes.currency`                | Default `SRD` unless specified otherwise.                                 |
| Income    | `income_verified_flag`  | `incomes.verified`                | `true` if BIS considers the income officially verified.                   |
| Income    | `income_valid_from`     | `incomes.valid_from`              | Direct date; optional.                                                    |
| Income    | `income_valid_to`       | `incomes.valid_to`                | Direct date; optional; may be `null` for ongoing employment.             |

> Additional income records may be created manually by case workers if BIS does not contain full income data.

---

## 8. Service & Benefit History Mapping (Optional for MVP)

If BIS exposes service or benefit history, it can be mapped to internal case context for **read-only reference**.

| BIS Domain | BIS Field (Assumed)   | CCR Target Table.Field     | Transformation Notes                                            |
|-----------|-----------------------|----------------------------|-----------------------------------------------------------------|
| Benefits  | `benefit_type`        | *(reference only)*         | Mapped to internal `service_types.code` if aligned.             |
| Benefits  | `benefit_status`      | *(reference only)*         | May be used only for display; no direct case creation in MVP.   |
| Benefits  | `benefit_start_date`  | *(reference only)*         | Shown in UI for context; not mandatory for MVP eligibility.     |
| Benefits  | `benefit_end_date`    | *(reference only)*         | Shown in UI for context.                                       |

> For MVP, this history is **not required** to drive decisions, but may be helpful for review.

---

## 9. BIS Lookup & Matching Logic

### 9.1 Primary Matching Keys
1. `bis_person_id` → `citizens.bis_id`  
2. Fallback match on `national_id` + `date_of_birth` if `bis_person_id` missing.

### 9.2 Matching Rules
- If a citizen with the same `bis_id` exists → update CCR with latest BIS info (non-destructive: keep internal overrides where needed).
- If no match is found → create a new CCR entry.
- If multiple matches are returned (edge case) → flag for manual review.

---

## 10. Edge Cases & Conflict Handling

### 10.1 Address Conflicts
- If BIS address differs from existing CCR address:
  - Mark a flag in case metadata (e.g. `address_mismatch = true`).
  - Allow case handler to decide which address is correct.

### 10.2 Income Conflicts
- If BIS income differs from applicant-declared income:
  - Both values are stored.
  - Eligibility Engine uses **verified BIS income** if `income_verified_flag = true`.
  - Case handler can override with justification.

### 10.3 Missing BIS Data
- If BIS returns partial data (e.g. no income):
  - Wizard prompts for manual completion of missing fields.

---

## 11. Open Questions for BIS / SoZaVo Technical Teams
1. What are the official BIS field names and their data types?  
2. Is `bis_person_id` globally unique and stable over time?  
3. Does BIS maintain household IDs and relationships, or are these derived at SoZaVo level?  
4. Does BIS already calculate total income, or must we aggregate multiple income entries ourselves?  
5. Are there BIS-side flags for special conditions (disability, crisis, etc.) that should be mapped to CCR?  

---

**END OF BIS → CCR MAPPING TABLE v1.0 (ENGLISH)**

