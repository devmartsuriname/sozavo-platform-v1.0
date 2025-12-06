# SoZaVo Platform v1.0 – Engine Orchestration Plan

> **Version:** 1.0  
> **Phase:** 6 – Engine Runtime Assembly  
> **Status:** Specification Document  
> **Cross-References:** Engine-Runtime-Configuration.md, Service-Layer-Specification.md, Event-Routing-Framework.md

---

## 1. Overview

This document defines how SoZaVo engines coordinate during case processing, including orchestration topology, failure recovery paths, and output contracts.

---

## 2. Orchestration Topology

### 2.1 Primary Orchestration Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CASE LIFECYCLE ORCHESTRATION                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    │
│  │ WIZARD  │───▶│ELIGIBILITY│──▶│WORKFLOW │───▶│ PAYMENT │───▶│  FRAUD  │   │
│  │ ENGINE  │    │ ENGINE  │    │ ENGINE  │    │ ENGINE  │    │ ENGINE  │   │
│  └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘   │
│       │              │              │              │              │         │
│       ▼              ▼              ▼              ▼              ▼         │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐   │
│  │   BIS   │    │DOCUMENT │    │  CASE   │    │ SUBEMA  │    │  ALERT  │   │
│  │ LOOKUP  │    │VALIDATION│   │ EVENTS  │    │  SYNC   │    │ ROUTING │   │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘   │
│                                                                              │
│                           ┌─────────────────┐                               │
│                           │  NOTIFICATION   │◀──────────────────────────────│
│                           │     ENGINE      │                               │
│                           └─────────────────┘                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Engine Coordination Matrix

| Source Engine | Target Engine | Trigger Condition | Data Passed |
|---------------|---------------|-------------------|-------------|
| Wizard | BIS Lookup | New citizen detected | national_id |
| Wizard | Eligibility | Wizard completed | wizard_data, case_id |
| Eligibility | Workflow | Evaluation complete | result, case_id |
| Eligibility | Fraud | Income data captured | income_data, citizen_id |
| Workflow | Payment | Status → approved | case_id, approval_data |
| Workflow | Notification | Any transition | transition_data |
| Payment | Subema | Batch ready | batch_id, payments[] |
| Payment | Workflow | Payment processed | payment_status |
| Fraud | Workflow | HIGH risk detected | case_id, risk_level |
| Fraud | Notification | Alert triggered | alert_data |
| Document | Workflow | All docs verified | case_id, doc_status |
| Document | Fraud | Doc metadata | doc_metadata |

### 2.3 Parallel vs Sequential Execution

**Sequential (Must Complete Before Next):**
```
Wizard → BIS Lookup → Citizen Record → Case Creation
```

**Parallel (Can Execute Simultaneously):**
```
┌─────────────────────────────────────┐
│          Eligibility Complete       │
└─────────────────────────────────────┘
            │
    ┌───────┴───────┐
    ▼               ▼
┌────────┐    ┌────────┐
│Workflow│    │ Fraud  │
│Update  │    │ Score  │
└────────┘    └────────┘
    │               │
    └───────┬───────┘
            ▼
    ┌────────────────┐
    │  Notification  │
    │  (after both)  │
    └────────────────┘
```

**Conditional Parallel:**
```
Document Upload
      │
      ├──▶ Virus Scan ─┐
      │                ├──▶ Store (if both pass)
      └──▶ Type Check ─┘
```

---

## 3. Orchestration States

### 3.1 Orchestration State Machine

```
┌─────────┐     ┌──────────┐     ┌───────────┐     ┌──────────┐
│ PENDING │────▶│ RUNNING  │────▶│ COMPLETED │     │  FAILED  │
└─────────┘     └──────────┘     └───────────┘     └──────────┘
                     │                                   ▲
                     │                                   │
                     └───────────────────────────────────┘
                                (on error)
                                    
                     ┌──────────┐
                     │ PAUSED   │ (waiting for external)
                     └──────────┘
```

### 3.2 State Definitions

| State | Description | Allowed Transitions |
|-------|-------------|---------------------|
| PENDING | Orchestration queued, not started | RUNNING |
| RUNNING | Actively executing engines | COMPLETED, FAILED, PAUSED |
| COMPLETED | All engines finished successfully | (terminal) |
| FAILED | One or more engines failed unrecoverably | (terminal) |
| PAUSED | Waiting for external action/data | RUNNING, FAILED |

### 3.3 Orchestration Record

```json
{
  "orchestration_id": "uuid",
  "case_id": "uuid",
  "orchestration_type": "case_intake",
  "state": "RUNNING",
  "started_at": "2024-01-15T10:30:00Z",
  "engines": [
    {
      "engine": "wizard",
      "state": "COMPLETED",
      "started_at": "2024-01-15T10:30:00Z",
      "completed_at": "2024-01-15T10:32:00Z"
    },
    {
      "engine": "bis_lookup",
      "state": "COMPLETED",
      "started_at": "2024-01-15T10:32:00Z",
      "completed_at": "2024-01-15T10:32:05Z"
    },
    {
      "engine": "eligibility",
      "state": "RUNNING",
      "started_at": "2024-01-15T10:32:05Z",
      "completed_at": null
    },
    {
      "engine": "fraud_initial",
      "state": "PENDING",
      "started_at": null,
      "completed_at": null
    }
  ],
  "context": { /* runtime context */ }
}
```

---

## 4. Orchestration Failure Paths

### 4.1 Failure Classification

| Failure Type | Description | Recovery Strategy |
|--------------|-------------|-------------------|
| TRANSIENT | Temporary issue, likely to resolve | Automatic retry |
| RECOVERABLE | Requires action but can continue | Pause, notify, resume |
| FATAL | Cannot continue, requires intervention | Halt, rollback, escalate |
| PARTIAL | Some engines succeeded, some failed | Complete successful, queue failed |

### 4.2 Failure Response Matrix

| Engine | Failure Type | Orchestration Response | User Impact |
|--------|--------------|------------------------|-------------|
| Wizard | Validation error | RECOVERABLE - return errors | Show validation messages |
| Wizard | Data save failed | TRANSIENT - retry | Brief delay |
| BIS Lookup | Timeout | TRANSIENT - retry 3x | May delay, fallback available |
| BIS Lookup | Not found | RECOVERABLE - continue | Manual verification required |
| Eligibility | Rule error | FATAL - halt | Case on hold, notify handler |
| Eligibility | Missing data | RECOVERABLE - pause | Request additional info |
| Workflow | Invalid transition | RECOVERABLE - reject | Show allowed actions |
| Workflow | Concurrent conflict | TRANSIENT - retry | Transparent retry |
| Payment | Calculation error | FATAL - halt | Notify finance |
| Payment | Subema unavailable | TRANSIENT - queue | Delayed payment |
| Fraud | Scoring error | RECOVERABLE - default LOW | Continue with caution |
| Notification | Delivery failed | TRANSIENT - retry | May delay notification |

### 4.3 Failure Recovery Flow

```
Engine Failure Detected
         │
         ▼
┌─────────────────────┐
│ Classify Failure    │
└─────────────────────┘
         │
    ┌────┼────┬────────┐
    ▼    ▼    ▼        ▼
TRANSIENT RECOVERABLE PARTIAL FATAL
    │         │         │       │
    ▼         ▼         ▼       ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│ Retry │ │ Pause │ │ Split │ │ Halt  │
│ Auto  │ │ Notify│ │ Track │ │Rollback│
└───────┘ └───────┘ └───────┘ └───────┘
    │         │         │       │
    ▼         ▼         ▼       ▼
Success?  External   Queue    Escalate
    │     Action     Failed   to Admin
    │         │         │
    └────┬────┘         │
         ▼              │
    ┌─────────┐         │
    │ Resume  │◀────────┘
    │ Orch.   │
    └─────────┘
```

### 4.4 Rollback Scenarios

| Trigger | Rollback Actions | Data State |
|---------|------------------|------------|
| Case creation failed after citizen created | Keep citizen, log failed case attempt | Citizen exists, no case |
| Eligibility failed after case created | Keep case in INTAKE, log error | Case exists, no evaluation |
| Payment failed after approval | Keep approval, queue payment retry | Case approved, payment pending |
| Fraud check failed | Default to LOW, continue | Risk assumed LOW |

---

## 5. Output Contract Matrix

### 5.1 Wizard Engine Output Contract

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| wizard_data | object | Yes | Complete wizard responses |
| service_type | string | Yes | Selected service type |
| citizen_data | object | Yes | Extracted citizen information |
| household_data | object | Conditional | If household questions answered |
| income_data | object | Conditional | If income questions answered |
| completed_steps | array | Yes | List of completed step IDs |
| completion_status | enum | Yes | complete, partial, abandoned |
| validation_errors | array | No | Any validation issues |

**Output Example:**
```json
{
  "wizard_output": {
    "wizard_data": {
      "step_1_identification": { },
      "step_2_personal": { },
      "step_3_address": { },
      "step_4_household": { },
      "step_5_income": { }
    },
    "service_type": "general_assistance",
    "citizen_data": {
      "national_id": "123456789",
      "first_name": "Jan",
      "last_name": "Jansen",
      "date_of_birth": "1985-03-15"
    },
    "household_data": {
      "household_size": 4,
      "dependents_count": 2
    },
    "income_data": {
      "total_monthly": 2500.00,
      "sources": ["employment"]
    },
    "completed_steps": ["IDENTIFICATION", "PERSONAL_INFO", "ADDRESS", "HOUSEHOLD", "INCOME"],
    "completion_status": "complete",
    "validation_errors": []
  }
}
```

### 5.2 Eligibility Engine Output Contract

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| evaluation_id | uuid | Yes | Unique evaluation identifier |
| case_id | uuid | Yes | Associated case |
| result | enum | Yes | ELIGIBLE, INELIGIBLE, PENDING |
| criteria_results | array | Yes | Per-rule evaluation results |
| missing_data | array | No | Fields needed for complete evaluation |
| rule_version | string | Yes | Version of rules applied |
| evaluated_at | timestamp | Yes | When evaluation occurred |

**Output Example:**
```json
{
  "eligibility_output": {
    "evaluation_id": "uuid",
    "case_id": "uuid",
    "result": "ELIGIBLE",
    "criteria_results": [
      {
        "rule_id": "GA_INCOME_MAX_20000",
        "rule_name": "Maximum Income Threshold",
        "passed": true,
        "actual_value": 2500,
        "threshold_value": 20000,
        "data_source": "wizard_data"
      },
      {
        "rule_id": "GA_RESIDENCY_REQUIRED",
        "rule_name": "Suriname Residency Required",
        "passed": true,
        "actual_value": "Paramaribo",
        "data_source": "BIS"
      }
    ],
    "missing_data": [],
    "rule_version": "1.0.0",
    "evaluated_at": "2024-01-15T10:35:00Z"
  }
}
```

### 5.3 Workflow Engine Output Contract

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| transition_id | uuid | Yes | Unique transition identifier |
| case_id | uuid | Yes | Associated case |
| previous_status | string | Yes | Status before transition |
| new_status | string | Yes | Status after transition |
| transition_allowed | boolean | Yes | Whether transition was permitted |
| guard_results | array | Conditional | Results of guard condition checks |
| actions_triggered | array | No | Side-effect actions triggered |
| event_id | uuid | Yes | Generated case event ID |

**Output Example:**
```json
{
  "workflow_output": {
    "transition_id": "uuid",
    "case_id": "uuid",
    "previous_status": "eligibility_check",
    "new_status": "under_review",
    "transition_allowed": true,
    "guard_results": [
      {
        "guard": "eligibility_complete",
        "passed": true
      },
      {
        "guard": "documents_uploaded",
        "passed": true
      }
    ],
    "actions_triggered": [
      "assign_to_reviewer",
      "notify_citizen",
      "log_event"
    ],
    "event_id": "uuid"
  }
}
```

### 5.4 Payment Engine Output Contract

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| payment_id | uuid | Yes | Unique payment identifier |
| case_id | uuid | Yes | Associated case |
| amount | decimal | Yes | Calculated payment amount |
| currency | string | Yes | Always "SRD" |
| calculation_breakdown | object | Yes | Detailed calculation steps |
| payment_type | string | Yes | Service type code |
| payment_period | string | Yes | Period covered (YYYY-MM) |
| batch_id | uuid | No | If assigned to batch |
| caps_applied | boolean | Yes | Whether caps limited amount |

**Output Example:**
```json
{
  "payment_output": {
    "payment_id": "uuid",
    "case_id": "uuid",
    "amount": 1250.00,
    "currency": "SRD",
    "calculation_breakdown": {
      "base_amount": 800.00,
      "dependent_supplement": 450.00,
      "income_deduction": 0.00,
      "subtotal": 1250.00,
      "cap_maximum": 2500.00,
      "final_amount": 1250.00
    },
    "payment_type": "general_assistance",
    "payment_period": "2024-01",
    "batch_id": null,
    "caps_applied": false,
    "formula_version": "1.0.0"
  }
}
```

### 5.5 Fraud Engine Output Contract

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| score_id | uuid | Yes | Unique score identifier |
| case_id | uuid | Yes | Associated case |
| risk_score | integer | Yes | 0-100 risk score |
| risk_level | enum | Yes | LOW, MEDIUM, HIGH, CRITICAL |
| signals_detected | array | Yes | List of triggered signals |
| recommended_actions | array | No | Suggested responses |
| auto_actions_taken | array | No | Automatic responses applied |
| scoring_version | string | Yes | Version of scoring algorithm |

**Output Example:**
```json
{
  "fraud_output": {
    "score_id": "uuid",
    "case_id": "uuid",
    "risk_score": 35,
    "risk_level": "MEDIUM",
    "signals_detected": [
      {
        "signal_type": "INCOME_ANOMALY",
        "severity": "MEDIUM",
        "weight": 20,
        "details": "Reported income significantly below district average"
      },
      {
        "signal_type": "RECENT_ADDRESS_CHANGE",
        "severity": "LOW",
        "weight": 10,
        "details": "Address changed within last 30 days"
      }
    ],
    "recommended_actions": [
      "standard_review"
    ],
    "auto_actions_taken": [],
    "scoring_version": "1.0.0"
  }
}
```

### 5.6 Notification Engine Output Contract

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| notification_id | uuid | Yes | Unique notification identifier |
| recipient_id | uuid | Yes | Recipient user/citizen ID |
| channels_used | array | Yes | Channels attempted |
| delivery_status | object | Yes | Status per channel |
| template_used | string | Yes | Template identifier |
| sent_at | timestamp | Yes | When sent |

**Output Example:**
```json
{
  "notification_output": {
    "notification_id": "uuid",
    "recipient_id": "uuid",
    "recipient_type": "citizen",
    "channels_used": ["portal", "email"],
    "delivery_status": {
      "portal": {
        "status": "delivered",
        "delivered_at": "2024-01-15T10:35:00Z"
      },
      "email": {
        "status": "sent",
        "provider_id": "resend-12345"
      }
    },
    "template_used": "case_status_update",
    "sent_at": "2024-01-15T10:35:00Z"
  }
}
```

---

## 6. Orchestration Patterns

### 6.1 Saga Pattern (Long-Running Transactions)

For case intake that spans multiple steps:

```
┌────────────────────────────────────────────────────────────────┐
│                    CASE INTAKE SAGA                            │
├────────────────────────────────────────────────────────────────┤
│ Step 1: Create Citizen Record                                  │
│   ├── Success → Continue                                       │
│   └── Failure → End Saga (no compensation needed)              │
├────────────────────────────────────────────────────────────────┤
│ Step 2: Create Case Record                                     │
│   ├── Success → Continue                                       │
│   └── Failure → Compensate: Mark citizen as incomplete         │
├────────────────────────────────────────────────────────────────┤
│ Step 3: Evaluate Eligibility                                   │
│   ├── Success → Continue                                       │
│   └── Failure → Compensate: Set case to ON_HOLD                │
├────────────────────────────────────────────────────────────────┤
│ Step 4: Initial Fraud Screening                                │
│   ├── Success → Complete Saga                                  │
│   └── Failure → Default LOW risk, log warning                  │
└────────────────────────────────────────────────────────────────┘
```

### 6.2 Choreography Pattern (Event-Driven)

For payment processing:

```
payment_calculated event
        │
        ├──▶ Payment Engine: Create payment record
        │           │
        │           └──▶ payment_created event
        │                       │
        │                       ├──▶ Batch Engine: Assign to batch
        │                       │           │
        │                       │           └──▶ batch_ready event (when full)
        │                       │                       │
        │                       │                       └──▶ Subema: Submit batch
        │                       │
        │                       └──▶ Notification: Payment pending notice
        │
        └──▶ Audit: Log payment calculation
```

### 6.3 Priority Queue Pattern

For handling high-priority cases:

| Priority | Queue | Processing Order |
|----------|-------|------------------|
| CRITICAL | fraud_critical | Immediate, preempts other work |
| HIGH | priority_queue | Before normal queue |
| NORMAL | standard_queue | FIFO |
| LOW | batch_queue | During low-load periods |

---

## 7. Monitoring & Observability

### 7.1 Orchestration Metrics

| Metric | Type | Labels |
|--------|------|--------|
| orchestration_started_total | Counter | type, service_type |
| orchestration_completed_total | Counter | type, status |
| orchestration_duration_seconds | Histogram | type |
| engine_execution_duration_seconds | Histogram | engine, status |
| orchestration_active | Gauge | type |
| orchestration_queued | Gauge | type, priority |

### 7.2 Tracing

All orchestrations must include distributed tracing:

```json
{
  "trace_id": "abc123",
  "orchestration_id": "uuid",
  "spans": [
    {
      "span_id": "span1",
      "operation": "wizard_complete",
      "start_time": "2024-01-15T10:30:00Z",
      "duration_ms": 120000
    },
    {
      "span_id": "span2",
      "parent_span_id": "span1",
      "operation": "bis_lookup",
      "start_time": "2024-01-15T10:32:00Z",
      "duration_ms": 5000
    }
  ]
}
```

---

## 8. Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Phase 6 | System | Initial specification |
