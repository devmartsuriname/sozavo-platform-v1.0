# SoZaVo Central Social Services Platform – Eligibility Rules Framework v1.0 (English)

> **Status:** Draft – MVP Rules Framework  
> **Prepared for:** Ministry of Social Affairs & Housing (SoZaVo)  
> **Prepared by:** Devmart Suriname  
> **Related Docs:** PRD v2.0, Workflow Blueprint v2.0, Technical Architecture v2.0

---

## 1. Purpose of this Document
This document defines the **structure**, **storage format**, and **evaluation model** for eligibility rules used in the SoZaVo Central Social Services Platform.

It is not a legal or policy document. Instead, it translates SoZaVo policy into:
- JSON-based rule definitions
- A consistent evaluation model
- A clear mapping between data fields and conditions

The initial focus is on the three MVP services:
- General Assistance
- Social Assistance (incl. Moni Karta)
- Child Allowance

---

## 2. Storage Model – Database Tables

Eligibility rules are stored in the Supabase database in the table:

### 2.1 `eligibility_rules`

Fields:
- `id` (PK)
- `service_type_id` (FK → `service_types.id`)
- `rule_code` (e.g. `INCOME_MAX_20000`, `AGE_CHILD_UNDER_18`)
- `description` (human-readable explanation)
- `priority` (integer – lower means higher priority)
- `rule_json` (JSONB – machine-readable condition)
- `is_active` (bool)
- `created_at`

### 2.2 `eligibility_evaluations`

Used to log each evaluation event:
- `id` (PK)
- `case_id` (FK → `cases.id`)
- `service_type_id` (FK)
- `result` (enum: `eligible`, `not_eligible`, `needs_review`)
- `details_json` (JSONB – rule-level outcomes)
- `created_at`

---

## 3. Rule JSON Structure

Each `rule_json` follows a standard pattern so the Eligibility Engine can evaluate conditions in a generic way.

### 3.1 Base JSON Schema

```json
{
  "version": 1,
  "type": "threshold" | "comparison" | "set_membership" | "compound",
  "target": "citizen" | "household" | "income" | "case" | "document",
  "field": "string",  
  "operator": "<" | ">" | "<=" | ">=" | "==" | "!=" | "in" | "not_in",
  "value": "any",  
  "logic": "AND" | "OR",  
  "conditions": [ /* nested subconditions for compound rules */ ]
}
```

### 3.2 Example – Simple Income Threshold Rule

> Rule: citizen’s total verified monthly income must be **≤ SRD 20,000**.

```json
{
  "version": 1,
  "type": "threshold",
  "target": "income",
  "field": "total_verified_monthly_income",
  "operator": "<=",
  "value": 20000,
  "currency": "SRD"
}
```

### 3.3 Example – Age Rule for Child Allowance

> Rule: child must be **under 18 years** at the time of evaluation.

```json
{
  "version": 1,
  "type": "threshold",
  "target": "citizen_child",
  "field": "age_years",
  "operator": "<",
  "value": 18
}
```

### 3.4 Example – Compound Rule (Income + Household Size)

> Rule: income threshold depends on household size.

```json
{
  "version": 1,
  "type": "compound",
  "logic": "AND",
  "conditions": [
    {
      "type": "threshold",
      "target": "income",
      "field": "total_verified_monthly_income",
      "operator": "<=",
      "value": 20000
    },
    {
      "type": "threshold",
      "target": "household",
      "field": "total_members",
      "operator": ">=",
      "value": 1
    }
  ]
}
```

---

## 4. Evaluation Model

### 4.1 Evaluation Flow
1. Load all **active rules** for the given `service_type_id`.
2. Sort by `priority` (ascending).
3. Evaluate each rule against the case, CCR, and documents.
4. Capture each rule’s outcome:
   - `passed` | `failed` | `not_applicable`
5. Combine outcomes according to service-specific aggregation logic:
   - e.g. **all mandatory rules must pass**.

### 4.2 Evaluation Output – `details_json` Structure

```json
{
  "rules": [
    {
      "rule_code": "INCOME_MAX_20000",
      "result": "passed",
      "evaluated_value": 18000
    },
    {
      "rule_code": "AGE_CHILD_UNDER_18",
      "result": "failed",
      "evaluated_value": 19
    }
  ],
  "summary": {
    "passed_count": 1,
    "failed_count": 1,
    "not_applicable_count": 0
  }
}
```

### 4.3 Final Result Resolution
A service-specific engine translates rule outcomes into a final decision:

- If all mandatory rules pass → `eligible`.
- If any mandatory rule fails → `not_eligible`.
- If some rules cannot be evaluated due to missing data → `needs_review`.

---

## 5. Service-Specific Rule Sets (MVP Draft)

Below are draft rule sets for each MVP service. These will be refined once SoZaVo provides final policy parameters.

### 5.1 General Assistance – Rule Set (Draft)

**Key categories:**
- Income ceiling
- Residency
- Age (adult)
- No conflicting benefits

```json
[
  {
    "rule_code": "GA_INCOME_MAX_20000",
    "description": "Total verified monthly income must be less than or equal to SRD 20,000.",
    "priority": 1,
    "rule_json": {
      "version": 1,
      "type": "threshold",
      "target": "income",
      "field": "total_verified_monthly_income",
      "operator": "<=",
      "value": 20000,
      "currency": "SRD"
    }
  },
  {
    "rule_code": "GA_RESIDENCY_REQUIRED",
    "description": "Citizen must reside within Suriname and be registered in a valid district.",
    "priority": 2,
    "rule_json": {
      "version": 1,
      "type": "comparison",
      "target": "citizen",
      "field": "country_of_residence",
      "operator": "==",
      "value": "Suriname"
    }
  },
  {
    "rule_code": "GA_MIN_AGE_18",
    "description": "Citizen must be at least 18 years old.",
    "priority": 3,
    "rule_json": {
      "version": 1,
      "type": "threshold",
      "target": "citizen",
      "field": "age_years",
      "operator": ">=",
      "value": 18
    }
  }
]
```

---

### 5.2 Social Assistance (incl. Moni Karta) – Rule Set (Draft)

**Key categories:**
- Stricter income threshold (example)
- Household composition
- Special Moni Karta conditions

```json
[
  {
    "rule_code": "SA_INCOME_MAX_15000",
    "description": "Total verified monthly income must be less than or equal to SRD 15,000.",
    "priority": 1,
    "rule_json": {
      "version": 1,
      "type": "threshold",
      "target": "income",
      "field": "total_verified_monthly_income",
      "operator": "<=",
      "value": 15000,
      "currency": "SRD"
    }
  },
  {
    "rule_code": "SA_HOUSEHOLD_DEPENDENTS_MIN_1",
    "description": "Household must contain at least one dependent.",
    "priority": 2,
    "rule_json": {
      "version": 1,
      "type": "threshold",
      "target": "household",
      "field": "total_dependents",
      "operator": ">=",
      "value": 1
    }
  },
  {
    "rule_code": "SA_MONI_KARTA_FLAG",
    "description": "Citizens eligible for Moni Karta must satisfy a specific income and dependency profile.",
    "priority": 3,
    "rule_json": {
      "version": 1,
      "type": "compound",
      "logic": "AND",
      "conditions": [
        {
          "type": "threshold",
          "target": "income",
          "field": "total_verified_monthly_income",
          "operator": "<=",
          "value": 10000
        },
        {
          "type": "threshold",
          "target": "household",
          "field": "total_dependents",
          "operator": ">=",
          "value": 1
        }
      ]
    }
  }
]
```

> **Note:** Exact thresholds and rule combinations will be updated according to SoZaVo policy.

---

### 5.3 Child Allowance – Rule Set (Draft)

**Key categories:**
- Age of child
- Parent-child relationship
- No duplicate benefit for same child

```json
[
  {
    "rule_code": "CA_CHILD_UNDER_18",
    "description": "Child must be younger than 18 years at evaluation time.",
    "priority": 1,
    "rule_json": {
      "version": 1,
      "type": "threshold",
      "target": "citizen_child",
      "field": "age_years",
      "operator": "<",
      "value": 18
    }
  },
  {
    "rule_code": "CA_PARENT_LINK_REQUIRED",
    "description": "Child must be linked to a valid parent citizen record.",
    "priority": 2,
    "rule_json": {
      "version": 1,
      "type": "comparison",
      "target": "case",
      "field": "has_valid_parent_link",
      "operator": "==",
      "value": true
    }
  },
  {
    "rule_code": "CA_NO_DUPLICATE_CHILD_CASE",
    "description": "No other active Child Allowance case for the same child.",
    "priority": 3,
    "rule_json": {
      "version": 1,
      "type": "comparison",
      "target": "case",
      "field": "has_active_duplicate_for_child",
      "operator": "==",
      "value": false
    }
  }
]
```

---

## 6. Governance & Change Management

### 6.1 Rule Versioning
- Each change to rules should create a new logical version (tracked via `created_at` and optional `version` field inside `rule_json`).
- Old rules should remain stored but marked `is_active = false`.

### 6.2 Ownership
- SoZaVo policy team defines rules.
- Devmart technical team translates them into JSON.
- Changes are rolled out via controlled migrations or admin tooling (later phase).

### 6.3 Testing
- Each rule set must be tested with sample citizen profiles.
- Unit tests can be added around the Eligibility Engine.

---

## 7. Open Questions (To be Answered by SoZaVo)
1. Exact income thresholds and brackets for each service.
2. Additional special cases (e.g., disability, single parent households, crisis conditions).
3. Whether exceptions can override failed rules (manual override policy).
4. Whether Moni Karta must have its own decision label (e.g., `eligible_for_moni_karta = true`).

---

**END OF ELIGIBILITY RULES FRAMEWORK v1.0**

