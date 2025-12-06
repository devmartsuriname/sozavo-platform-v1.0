# SoZaVo Central Social Services Platform – Wizard Step Definitions (v1.0, English)

> **Status:** Draft – MVP Intake Wizards for all 3 services  
> **Prepared for:** Ministry of Social Affairs & Housing (SoZaVo)  
> **Prepared by:** Devmart Suriname  
> **Related Docs:** PRD v2.0, Workflow Blueprint v2.0, Technical Architecture v2.0, Eligibility Rules Framework v1.0

---

# 1. Purpose of This Document
This document defines the **exact intake wizard steps**, **questions**, **conditional logic**, and **required documents** for:

- General Assistance
- Social Assistance (incl. Moni Karta)
- Child Allowance

Each wizard is configured using JSON stored in `wizard_definitions`, and interpreted by the Wizard Engine.

The structure ensures:
- District offices can complete intake consistently
- BIS data can prefill but never block progress
- All required documents are gathered BEFORE eligibility evaluation

---

# 2. Wizard Engine JSON Schema (Simplified)

```json
{
  "version": 1,
  "service_type": "GENERAL_ASSISTANCE",
  "steps": [
    {
      "code": "INTRO",
      "title": "Start Application",
      "fields": [],
      "conditions": []
    }
  ]
}
```

### Step object fields
- `code`: unique step identifier
- `title`: displayed heading
- `description`: optional helper text
- `fields`: array of input definitions
- `conditions`: when the step appears
- `documents_required`: list of document types for that step

---

# 3. GENERAL ASSISTANCE – Wizard Steps

## **STEP 1 — IDENTIFICATION (BIS Prefill Attempt)**
```json
{
  "code": "IDENTIFICATION",
  "title": "Citizen Identification",
  "fields": [
    { "id": "bis_number", "label": "BIS Number", "type": "text", "required": false },
    { "id": "national_id", "label": "National ID Number", "type": "text", "required": true }
  ],
  "bis_lookup": true,
  "documents_required": []
}
```

Conditions:
- If BIS returns data → prefill CCR fields
- If BIS fails → continue manually

---

## **STEP 2 — PERSONAL INFORMATION**
```json
{
  "code": "PERSONAL_INFO",
  "title": "Personal Information",
  "fields": [
    { "id": "first_name", "type": "text", "required": true },
    { "id": "last_name", "type": "text", "required": true },
    { "id": "date_of_birth", "type": "date", "required": true },
    { "id": "gender", "type": "select", "options": ["Male", "Female", "Other"], "required": true },
    { "id": "phone", "type": "text", "required": true },
    { "id": "email", "type": "text", "required": false }
  ]
}
```

---

## **STEP 3 — ADDRESS & RESIDENCY**
```json
{
  "code": "ADDRESS",
  "title": "Residential Address",
  "fields": [
    { "id": "address", "type": "text", "required": true },
    { "id": "district", "type": "select", "required": true },
    { "id": "years_residing", "type": "number", "required": false }
  ],
  "documents_required": ["residence_proof"]
}
```

---

## **STEP 4 — HOUSEHOLD INFORMATION**
```json
{
  "code": "HOUSEHOLD",
  "title": "Household Composition",
  "fields": [
    { "id": "household_size", "type": "number", "required": true },
    { "id": "dependents", "type": "number", "required": true }
  ]
}
```

---

## **STEP 5 — INCOME DISCLOSURE**
```json
{
  "code": "INCOME",
  "title": "Income Information",
  "fields": [
    { "id": "employment_status", "type": "select", "options": ["Employed", "Self-Employed", "Unemployed", "Student", "Retired"], "required": true },
    { "id": "monthly_income", "type": "number", "required": true },
    { "id": "income_sources", "type": "textarea", "required": false }
  ],
  "documents_required": ["income_proof"]
}
```

---

## **STEP 6 — REQUIRED DOCUMENTS**
```json
{
  "code": "DOCUMENTS",
  "title": "Upload Required Documents",
  "documents_required": ["id_card", "income_proof", "residence_proof"]
}
```

---

## **STEP 7 — CONFIRMATION**
```json
{
  "code": "CONFIRM",
  "title": "Confirm Application",
  "fields": [],
  "final_step": true
}
```

---

# 4. SOCIAL ASSISTANCE (incl. Moni Karta) – Wizard Steps

## **STEP 1 — IDENTIFICATION (BIS Prefill Attempt)**
Same as General Assistance.

---

## **STEP 2 — PERSONAL & HOUSEHOLD INFO**
```json
{
  "code": "PERSONAL_HOUSEHOLD",
  "title": "Personal & Household Information",
  "fields": [
    { "id": "first_name", "type": "text", "required": true },
    { "id": "last_name", "type": "text", "required": true },
    { "id": "date_of_birth", "type": "date", "required": true },
    { "id": "dependents", "type": "number", "required": true }
  ]
}
```

---

## **STEP 3 — EMPLOYMENT & INCOME**
```json
{
  "code": "EMPLOYMENT_INCOME",
  "title": "Employment & Income",
  "fields": [
    { "id": "employment_status", "type": "select", "options": ["Employed", "Self-Employed", "Unemployed", "Student", "Retired"], "required": true },
    { "id": "monthly_income", "type": "number", "required": true }
  ],
  "documents_required": ["income_proof"]
}
```

---

## **STEP 4 — MONI KARTA CONDITIONS (Conditional Step)**
Condition:
- Only appears if `monthly_income <= 10000` **AND** `dependents >= 1`.

```json
{
  "code": "MONI_KARTA",
  "title": "Moni Karta Eligibility Questions",
  "conditions": [
    { "field": "monthly_income", "operator": "<=", "value": 10000 },
    { "field": "dependents", "operator": ">=", "value": 1 }
  ],
  "fields": [
    { "id": "requires_additional_support", "type": "select", "options": ["Yes", "No"], "required": true }
  ]
}
```

---

## **STEP 5 — DOCUMENTS**
```json
{
  "code": "DOCUMENTS",
  "title": "Upload Required Documents",
  "documents_required": ["id_card", "income_proof", "household_declaration"]
}
```

---

## **STEP 6 — CONFIRMATION**
Same as General Assistance.

---

# 5. CHILD ALLOWANCE – Wizard Steps

## **STEP 1 — PARENT IDENTIFICATION (BIS Optional)**
```json
{
  "code": "PARENT_IDENTIFICATION",
  "title": "Parent Identification",
  "fields": [
    { "id": "national_id_parent", "type": "text", "required": true }
  ],
  "bis_lookup": true
}
```

---

## **STEP 2 — CHILD IDENTIFICATION**
```json
{
  "code": "CHILD_IDENTIFICATION",
  "title": "Child Information",
  "fields": [
    { "id": "child_first_name", "type": "text", "required": true },
    { "id": "child_last_name", "type": "text", "required": true },
    { "id": "child_date_of_birth", "type": "date", "required": true }
  ]
}
```

---

## **STEP 3 — CHILD RELATIONSHIP VALIDATION**
```json
{
  "code": "RELATIONSHIP",
  "title": "Child Relationship",
  "fields": [
    { "id": "relationship_type", "type": "select", "options": ["Mother", "Father", "Legal Guardian"], "required": true }
  ]
}
```

---

## **STEP 4 — DOCUMENTS FOR CHILD**
```json
{
  "code": "CHILD_DOCUMENTS",
  "title": "Upload Child Documents",
  "documents_required": ["birth_certificate", "id_card_child"]
}
```

---

## **STEP 5 — DOCUMENTS FOR PARENT**
```json
{
  "code": "PARENT_DOCUMENTS",
  "title": "Upload Parent Documents",
  "documents_required": ["id_card"]
}
```

---

## **STEP 6 — CONFIRMATION**
Same as other services.

---

# 6. Open Questions for SoZaVo
1. Should Moni Karta conditions appear earlier or later in the flow?
2. Should district officers verify parent-child relationships manually or rely on documents only?
3. Should wizard steps be allowed to skip if documents already exist in CCR?
4. Should income documents require separate verification for self-employed individuals?

---

**END OF WIZARD STEP DEFINITIONS v1.0 (ENGLISH)**

