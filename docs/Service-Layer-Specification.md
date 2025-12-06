# SoZaVo Platform v1.0 – Service Layer Specification

> **Version:** 1.0  
> **Phase:** 6 – Engine Runtime Assembly  
> **Status:** Specification Document  
> **Cross-References:** DAL-Specification.md, Engine-Runtime-Configuration.md, API-Reference.md

---

## 1. Overview

This document defines the Service Layer (SL) that binds JSON-configured engines to the Data Access Layer. It specifies execution pipelines, chaining rules, and transformation contracts.

---

## 2. Engine-to-DAL Bindings

### 2.1 Eligibility Engine Bindings

| Engine Input/Output | DAL Model | Table | Operation |
|---------------------|-----------|-------|-----------|
| Citizen data input | Citizen | citizens | READ |
| Case data input | Case | cases | READ |
| Household data input | Citizen.household_members | citizens | READ |
| Income data input | (derived from wizard_data) | cases | READ |
| Rule definitions | EligibilityRule | eligibility_rules | READ |
| Evaluation result output | EligibilityEvaluation | eligibility_evaluations | CREATE |
| Case status update | Case | cases | UPDATE |

**Data Flow:**
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ citizens table  │────▶│ Eligibility     │────▶│eligibility_     │
│ cases table     │     │ Engine          │     │evaluations      │
│ eligibility_    │     │                 │     │                 │
│ rules table     │     │ (JSON config)   │     │ case_events     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 2.2 Wizard Engine Bindings

| Engine Input/Output | DAL Model | Table | Operation |
|---------------------|-----------|-------|-----------|
| Wizard configuration | WizardDefinition | wizard_definitions | READ |
| Step definitions | WizardStep | (JSON config) | READ |
| Citizen data input | Citizen | citizens | READ/CREATE |
| Case creation output | Case | cases | CREATE |
| Step data output | Case.wizard_data | cases | UPDATE |
| Step progress output | CaseWizardStep | case_wizard_steps | CREATE/UPDATE |
| Document requirements | DocumentRequirement | document_requirements | READ |

**Data Flow:**
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ wizard config   │────▶│ Wizard          │────▶│ cases table     │
│ (JSON)          │     │ Engine          │     │ (wizard_data)   │
│                 │     │                 │     │                 │
│ citizens table  │     │                 │     │ case_wizard_    │
│ (for lookup)    │     │                 │     │ steps           │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 2.3 Workflow Engine Bindings

| Engine Input/Output | DAL Model | Table | Operation |
|---------------------|-----------|-------|-----------|
| Workflow definition | WorkflowDefinition | workflow_definitions | READ |
| Current state input | Case.current_status | cases | READ |
| Transition request | (runtime) | - | - |
| Guard condition data | Case, Documents, EligibilityEvaluation | multiple | READ |
| New state output | Case.current_status | cases | UPDATE |
| Transition event output | CaseEvent | case_events | CREATE |
| Notification trigger | Notification | notifications | CREATE |

**Data Flow:**
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ workflow config │────▶│ Workflow        │────▶│ cases table     │
│ (JSON)          │     │ Engine          │     │ (current_status)│
│                 │     │                 │     │                 │
│ cases table     │     │ Guard           │     │ case_events     │
│ documents       │     │ Evaluation      │     │ table           │
│ eligibility_    │     │                 │     │                 │
│ evaluations     │     │                 │     │ notifications   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 2.4 Payment Engine Bindings

| Engine Input/Output | DAL Model | Table | Operation |
|---------------------|-----------|-------|-----------|
| Payment formula | PaymentFormula | (JSON config) | READ |
| Case data input | Case | cases | READ |
| Citizen data input | Citizen | citizens | READ |
| Income data input | Case.wizard_data | cases | READ |
| Household data input | Citizen.household_members | citizens | READ |
| Payment calculation output | Payment | payments | CREATE |
| Batch assignment | PaymentBatch | payment_batches | CREATE/UPDATE |
| Payment item output | PaymentItem | payment_items | CREATE |
| Case status update | Case | cases | UPDATE |

**Data Flow:**
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ payment config  │────▶│ Payment         │────▶│ payments table  │
│ (JSON)          │     │ Engine          │     │                 │
│                 │     │                 │     │ payment_batches │
│ cases table     │     │ Formula         │     │                 │
│ citizens table  │     │ Evaluation      │     │ payment_items   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 2.5 Fraud Engine Bindings

| Engine Input/Output | DAL Model | Table | Operation |
|---------------------|-----------|-------|-----------|
| Fraud rules | FraudRule | (JSON config) | READ |
| Case data input | Case | cases | READ |
| Citizen data input | Citizen | citizens | READ |
| Historical cases input | Case | cases | READ (multiple) |
| Payment history input | Payment | payments | READ |
| Document metadata input | Document | documents | READ |
| Fraud signal output | FraudSignal | fraud_signals | CREATE |
| Risk score output | FraudRiskScore | fraud_risk_scores | CREATE |
| Case flag output | Case.fraud_risk_level | cases | UPDATE |
| Alert output | Notification | notifications | CREATE |

**Data Flow:**
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ fraud config    │────▶│ Fraud           │────▶│ fraud_signals   │
│ (JSON)          │     │ Engine          │     │                 │
│                 │     │                 │     │ fraud_risk_     │
│ cases table     │     │ Signal          │     │ scores          │
│ citizens table  │     │ Detection       │     │                 │
│ payments table  │     │ & Scoring       │     │ cases table     │
│ documents table │     │                 │     │ (fraud flag)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 2.6 Notification Engine Bindings

| Engine Input/Output | DAL Model | Table | Operation |
|---------------------|-----------|-------|-----------|
| Notification templates | NotificationTemplate | notification_templates | READ |
| Event trigger input | CaseEvent | case_events | READ |
| Recipient data input | Citizen, User | citizens, users | READ |
| Internal notification output | Notification | notifications | CREATE |
| Portal notification output | PortalNotification | portal_notifications | CREATE |
| Delivery status update | Notification | notifications | UPDATE |

---

## 3. Execution Pipelines

### 3.1 Case Intake Pipeline

**Purpose:** Process new benefit applications from citizen submission to case creation.

**Pipeline Stages:**
```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ Wizard   │──▶│ BIS      │──▶│ Citizen  │──▶│ Case     │──▶│ Fraud    │
│ Engine   │   │ Lookup   │   │ Record   │   │ Creation │   │ Initial  │
│          │   │ (if new) │   │ Create/  │   │          │   │ Screen   │
│          │   │          │   │ Update   │   │          │   │          │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
      │              │              │              │              │
      ▼              ▼              ▼              ▼              ▼
 wizard_data    bis_verified   citizens      cases         fraud_signals
 stored        flag set       table         table         (initial)
```

**Stage Details:**

| Stage | Engine | Input | Output | Failure Action |
|-------|--------|-------|--------|----------------|
| 1. Wizard | Wizard Engine | User input | wizard_data JSONB | Save partial, allow resume |
| 2. BIS Lookup | Integration | national_id | BIS verification | Flag for manual verification |
| 3. Citizen Record | DAL | wizard_data + BIS | Citizen record | Halt, log error |
| 4. Case Creation | DAL | Citizen + wizard_data | Case record | Rollback, notify user |
| 5. Fraud Initial | Fraud Engine | Case + Citizen | Initial risk score | Default LOW, continue |

**Transaction Boundary:** Stages 3-5 are within a single database transaction.

### 3.2 Eligibility Pipeline

**Purpose:** Evaluate case eligibility based on configured rules.

**Pipeline Stages:**
```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ Data     │──▶│ Rule     │──▶│ Result   │──▶│ Workflow │──▶│ Notify   │
│ Collect  │   │ Evaluate │   │ Record   │   │ Transition│  │ Handler  │
│          │   │          │   │          │   │          │   │          │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
      │              │              │              │              │
      ▼              ▼              ▼              ▼              ▼
 Runtime        Rule results   eligibility_   case_events   notifications
 Context        per rule       evaluations    case status
```

**Stage Details:**

| Stage | Engine | Input | Output | Failure Action |
|-------|--------|-------|--------|----------------|
| 1. Data Collect | DAL | case_id | Runtime Context | Halt, log error |
| 2. Rule Evaluate | Eligibility Engine | Context + Rules | Rule results | Return PENDING |
| 3. Result Record | DAL | Evaluation | eligibility_evaluations | Retry, then halt |
| 4. Workflow Transition | Workflow Engine | Result | Case status change | Hold status, notify |
| 5. Notify Handler | Notification Engine | Transition | Internal notification | Log, continue |

### 3.3 Document Validation Pipeline

**Purpose:** Process and validate uploaded documents.

**Pipeline Stages:**
```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ Upload   │──▶│ Virus    │──▶│ Type     │──▶│ Storage  │──▶│ Record   │
│ Receive  │   │ Scan     │   │ Validate │   │ Write    │   │ Create   │
│          │   │          │   │          │   │          │   │          │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
      │              │              │              │              │
      ▼              ▼              ▼              ▼              ▼
 temp file     scan result    type check    file path    documents
 created       pass/fail      pass/fail     stored       table
```

**Stage Details:**

| Stage | Engine | Input | Output | Failure Action |
|-------|--------|-------|--------|----------------|
| 1. Upload Receive | Storage | File stream | Temp file path | Return upload error |
| 2. Virus Scan | External | Temp file | Clean/Infected | Reject, delete file |
| 3. Type Validate | Validation | File + metadata | Valid/Invalid | Reject, notify user |
| 4. Storage Write | Storage | Validated file | Permanent path | Retry, then fail |
| 5. Record Create | DAL | File metadata | Document record | Rollback storage, fail |

### 3.4 Payment Pipeline

**Purpose:** Calculate, batch, and submit payments.

**Pipeline Stages:**
```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ Case     │──▶│ Amount   │──▶│ Batch    │──▶│ Subema   │──▶│ Status   │
│ Select   │   │ Calculate│   │ Assign   │   │ Submit   │   │ Sync     │
│          │   │          │   │          │   │          │   │          │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
      │              │              │              │              │
      ▼              ▼              ▼              ▼              ▼
 approved      payment        payment_     subema_ref    payment
 cases         amount         batches      assigned      status
```

**Stage Details:**

| Stage | Engine | Input | Output | Failure Action |
|-------|--------|-------|--------|----------------|
| 1. Case Select | DAL | status=approved | Case list | Empty list = skip |
| 2. Amount Calculate | Payment Engine | Case + Formula | Payment amount | Log, skip case |
| 3. Batch Assign | DAL | Payments | Batch record | Create new batch |
| 4. Subema Submit | Integration | Batch | Subema references | Queue for retry |
| 5. Status Sync | DAL | Subema response | Payment status | Queue status check |

### 3.5 Fraud Detection Pipeline

**Purpose:** Continuous fraud monitoring and escalation.

**Pipeline Stages:**
```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ Signal   │──▶│ Score    │──▶│ Risk     │──▶│ Escalate │──▶│ Case     │
│ Collect  │   │ Calculate│   │ Classify │   │ (if HIGH)│   │ Flag     │
│          │   │          │   │          │   │          │   │          │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
      │              │              │              │              │
      ▼              ▼              ▼              ▼              ▼
 fraud_       risk_score     risk_level   notification   cases.
 signals      computed       assigned     sent           fraud_flag
```

**Stage Details:**

| Stage | Engine | Input | Output | Failure Action |
|-------|--------|-------|--------|----------------|
| 1. Signal Collect | Fraud Engine | Case + History | Signal list | Continue with available |
| 2. Score Calculate | Fraud Engine | Signals + Weights | Risk score | Default 0, continue |
| 3. Risk Classify | Fraud Engine | Score + Thresholds | Risk level | Default LOW |
| 4. Escalate | Workflow Engine | HIGH/CRITICAL risk | Notification | Log, continue |
| 5. Case Flag | DAL | Risk level | Case update | Log error, continue |

---

## 4. Chaining Rules

### 4.1 Mandatory Chains

These chains MUST complete successfully in order:

| Chain ID | Stages | Failure Behavior |
|----------|--------|------------------|
| INTAKE-WIZARD | Wizard → BIS → Citizen → Case | Halt at failure point, save progress |
| ELIG-EVAL | DataCollect → RuleEvaluate → ResultRecord | Return PENDING if incomplete |
| PAY-CALC | CaseSelect → Calculate → BatchAssign | Skip failed cases, continue batch |
| DOC-UPLOAD | Upload → Scan → Validate → Store → Record | Reject document on any failure |

### 4.2 Optional Chains

These chains may be skipped under certain conditions:

| Chain ID | Condition to Skip | Fallback |
|----------|-------------------|----------|
| BIS-LOOKUP | Citizen already exists and is_verified=true | Use existing data |
| SUBEMA-SYNC | Subema unavailable | Queue for later |
| FRAUD-SCORE | Fraud engine unavailable | Default to LOW risk |
| EMAIL-NOTIFY | No email address | Use portal notification only |

### 4.3 Conditional Execution

| Condition | Chain Activated | Chain Skipped |
|-----------|-----------------|---------------|
| service_type = 'child_allowance' | Child verification chain | Standard income chain |
| fraud_risk_level = 'HIGH' | Supervisor review chain | Auto-approval chain |
| documents.status = 'all_verified' | Fast-track eligibility | Document reminder chain |
| citizen.bis_verified = false | BIS lookup chain | Direct case creation |

### 4.4 Bailout Rules

Conditions that immediately halt pipeline execution:

| Bailout Condition | Pipeline Affected | System Response |
|-------------------|-------------------|-----------------|
| Database connection lost | ALL | Halt, queue, notify admin |
| Authentication token expired | ALL | Reject request, re-auth required |
| Case already closed | Most pipelines | Reject, return error |
| Citizen deceased flag | Intake, Payment | Halt, notify supervisor |
| Fraud alert active | Payment | Hold payment, notify fraud officer |
| System maintenance mode | ALL | Queue all operations |

---

## 5. Transformation Contracts

### 5.1 Wizard to Case Transformation

**Input (Wizard Engine Output):**
```json
{
  "wizard_data": {
    "step_1_identification": {
      "national_id": "123456789",
      "first_name": "Jan",
      "last_name": "Jansen"
    },
    "step_2_personal": {
      "date_of_birth": "1985-03-15",
      "gender": "male",
      "marital_status": "married"
    },
    "step_3_address": {
      "street": "Kernkampweg 42",
      "district": "Paramaribo"
    },
    "step_4_household": {
      "household_size": 4,
      "members": [...]
    },
    "step_5_income": {
      "total_monthly_income": 2500.00,
      "income_sources": [...]
    }
  },
  "service_type": "general_assistance",
  "completed_at": "2024-01-15T10:30:00Z"
}
```

**Output (Case Record):**
```json
{
  "case": {
    "id": "uuid",
    "case_reference": "GA-20240115-0042",
    "citizen_id": "uuid",
    "service_type_id": "uuid",
    "current_status": "intake",
    "wizard_data": { /* full wizard_data */ },
    "created_at": "2024-01-15T10:30:00Z"
  },
  "citizen": {
    "id": "uuid",
    "national_id": "123456789",
    "first_name": "Jan",
    "last_name": "Jansen",
    "date_of_birth": "1985-03-15",
    "address": "Kernkampweg 42",
    "district": "Paramaribo",
    "household_members": [...]
  }
}
```

### 5.2 Eligibility to Workflow Transformation

**Input (Eligibility Engine Output):**
```json
{
  "evaluation": {
    "case_id": "uuid",
    "result": "ELIGIBLE",
    "criteria_results": [
      { "rule_id": "GA_INCOME_MAX_20000", "passed": true },
      { "rule_id": "GA_RESIDENCY_REQUIRED", "passed": true },
      { "rule_id": "GA_MIN_AGE_18", "passed": true }
    ],
    "evaluated_at": "2024-01-15T11:00:00Z"
  }
}
```

**Output (Workflow Transition):**
```json
{
  "transition": {
    "case_id": "uuid",
    "from_status": "eligibility_check",
    "to_status": "under_review",
    "triggered_by": "eligibility_engine",
    "metadata": {
      "evaluation_id": "uuid",
      "result": "ELIGIBLE"
    }
  },
  "event": {
    "case_id": "uuid",
    "event_type": "eligibility_evaluated",
    "actor_id": null,
    "meta": {
      "result": "ELIGIBLE",
      "all_criteria_passed": true
    }
  }
}
```

### 5.3 Case to Payment Transformation

**Input (Payment Engine Input):**
```json
{
  "case": {
    "id": "uuid",
    "service_type": "general_assistance",
    "wizard_data": {
      "step_5_income": {
        "total_monthly_income": 2500.00
      },
      "step_4_household": {
        "household_size": 4
      }
    }
  },
  "citizen": {
    "national_id": "123456789",
    "bank_account": "SR12345678901234"
  },
  "formula": {
    "base_amount": 800.00,
    "per_dependent": 150.00,
    "max_amount": 2500.00
  }
}
```

**Output (Payment Record):**
```json
{
  "payment": {
    "id": "uuid",
    "case_id": "uuid",
    "amount": 1250.00,
    "calculation_breakdown": {
      "base": 800.00,
      "dependents_supplement": 450.00,
      "total_before_cap": 1250.00,
      "cap_applied": false
    },
    "payment_type": "general_assistance",
    "status": "pending",
    "payment_period": "2024-01"
  }
}
```

---

## 6. Error Handling Patterns

### 6.1 Pipeline-Level Error Handling

```
Pipeline Execution
       │
       ▼
   ┌───────────────┐
   │ Stage Execute │
   └───────────────┘
       │
   ┌───┴───┐
   │Success│──▶ Next Stage
   └───────┘
       │
   ┌───┴───┐
   │Failure│
   └───────┘
       │
   ┌───┴───────────────┐
   │ Recoverable?      │
   └───────────────────┘
       │           │
      YES         NO
       │           │
       ▼           ▼
   ┌───────┐   ┌───────────┐
   │ Retry │   │ Log Error │
   │ Logic │   │ Halt      │
   └───────┘   │ Rollback  │
       │       └───────────┘
   ┌───┴───┐
   │Success│──▶ Next Stage
   └───────┘
       │
   ┌───┴───┐
   │ Max   │──▶ Escalate
   │Retries│
   └───────┘
```

### 6.2 Standard Error Response

```json
{
  "error": {
    "code": "PIPELINE_FAILURE",
    "pipeline": "eligibility_pipeline",
    "stage": "rule_evaluate",
    "message": "Rule evaluation failed: missing income data",
    "recoverable": true,
    "retry_after": 300,
    "context": {
      "case_id": "uuid",
      "missing_fields": ["total_monthly_income"]
    }
  }
}
```

---

## 7. Performance Requirements

### 7.1 Pipeline SLAs

| Pipeline | Max Duration | 95th Percentile |
|----------|--------------|-----------------|
| Case Intake | 30 seconds | 10 seconds |
| Eligibility | 5 seconds | 2 seconds |
| Document Validation | 10 seconds | 5 seconds |
| Payment Calculation | 2 seconds | 500ms |
| Fraud Detection | 3 seconds | 1 second |

### 7.2 Throughput Targets

| Pipeline | Peak Load | Concurrent Executions |
|----------|-----------|----------------------|
| Case Intake | 100/hour | 10 |
| Eligibility | 500/hour | 50 |
| Payment Batch | 1000/batch | 1 batch at a time |
| Fraud Detection | 500/hour | 50 |

---

## 8. Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Phase 6 | System | Initial specification |
