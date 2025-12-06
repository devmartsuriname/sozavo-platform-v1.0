# SoZaVo Platform v1.0 – Engine Runtime Configuration

> **Version:** 1.0  
> **Phase:** 6 – Engine Runtime Assembly  
> **Status:** Specification Document  
> **Cross-References:** DAL-Specification.md, Object-Model-Registry.md, Versioning-Framework.md

---

## 1. Overview

This document defines the runtime environment for all SoZaVo engines, including initialization order, shared execution context, state isolation rules, and error propagation patterns.

---

## 2. Runtime Load Order

Engines MUST be initialized in strict dependency order:

| Order | Engine | Dependencies | Initialization Action |
|-------|--------|--------------|----------------------|
| 1 | Object Model Registry (OMR) | None | Load entity definitions from Object-Model-Registry.md |
| 2 | Data Access Layer (DAL) | OMR | Bind models to database tables |
| 3 | Eligibility Engine | OMR, DAL | Load `/configs/eligibility/*.json` rules |
| 4 | Wizard Engine | OMR, DAL | Load `/configs/wizard/*.json` step definitions |
| 5 | Workflow Engine | OMR, DAL | Load `/configs/workflows/*.json` state machines |
| 6 | Payment Engine | OMR, DAL, Workflow | Load `/configs/payments/*.json` formulas |
| 7 | Fraud Engine | OMR, DAL, Workflow | Load `/configs/fraud/*.json` signal definitions |
| 8 | Notification Engine | OMR, DAL, Workflow | Load notification templates and routing rules |

### 2.1 Initialization Failure Handling

| Failure Point | Recovery Action | System State |
|---------------|-----------------|--------------|
| OMR fails | HALT system startup | Non-operational |
| DAL fails | HALT system startup | Non-operational |
| Eligibility Engine fails | Log error, disable eligibility checks | Degraded |
| Wizard Engine fails | Log error, disable new applications | Degraded |
| Workflow Engine fails | Log error, freeze case transitions | Degraded |
| Payment Engine fails | Log error, queue payments | Degraded |
| Fraud Engine fails | Log error, default to LOW risk | Degraded |
| Notification Engine fails | Log error, queue notifications | Degraded |

---

## 3. Runtime Context Document

All engines share a common execution context structure:

### 3.1 Citizen Context

```json
{
  "citizen_context": {
    "citizen_id": "uuid",
    "national_id": "string (9 digits)",
    "first_name": "string",
    "last_name": "string",
    "date_of_birth": "date",
    "district": "string",
    "household_size": "integer",
    "household_members": [
      {
        "national_id": "string",
        "relationship": "string",
        "date_of_birth": "date"
      }
    ],
    "bis_verified": "boolean",
    "bis_verified_at": "timestamp"
  }
}
```

### 3.2 Case Context

```json
{
  "case_context": {
    "case_id": "uuid",
    "case_reference": "string (format: SRV-YYYYMMDD-NNNN)",
    "service_type": "string (general_assistance | social_assistance | child_allowance)",
    "current_status": "string (case_status enum)",
    "previous_status": "string | null",
    "case_handler_id": "uuid | null",
    "intake_office_id": "uuid",
    "district_id": "uuid",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

### 3.3 Session Metadata

```json
{
  "session_metadata": {
    "user_id": "uuid",
    "auth_user_id": "uuid (from auth.users)",
    "role": "string (user_role enum)",
    "office_id": "uuid | null",
    "district_id": "uuid | null",
    "session_started_at": "timestamp",
    "ip_address": "string (hashed for privacy)",
    "user_agent": "string (truncated)"
  }
}
```

### 3.4 Version Pointers

```json
{
  "version_pointers": {
    "eligibility_rule_version": "string (e.g., 1.0.0)",
    "workflow_version": "string (e.g., 1.0.0)",
    "payment_formula_version": "string (e.g., 1.0.0)",
    "fraud_rule_version": "string (e.g., 1.0.0)",
    "wizard_version": "string (e.g., 1.0.0)",
    "effective_date": "date",
    "locked": "boolean"
  }
}
```

### 3.5 Combined Runtime Context

```json
{
  "runtime_context": {
    "citizen_context": { },
    "case_context": { },
    "session_metadata": { },
    "version_pointers": { },
    "execution_id": "uuid (unique per request)",
    "execution_started_at": "timestamp",
    "trace_id": "string (for distributed tracing)"
  }
}
```

---

## 4. Engine State Isolation

### 4.1 Isolation Rules

| Rule | Description | Enforcement |
|------|-------------|-------------|
| ISR-001 | Engine state MUST NOT be shared across cases | Each case execution creates new context |
| ISR-002 | Input data MUST be immutable during execution | Deep copy on entry, no mutations |
| ISR-003 | Outputs MUST be deterministic given same inputs | No random values, timestamps frozen at execution start |
| ISR-004 | Cross-case queries MUST NOT affect current case state | Read-only for lookup operations |
| ISR-005 | Engine failures MUST NOT corrupt shared state | Transaction rollback on failure |

### 4.2 State Boundaries

```
┌─────────────────────────────────────────────────────────────────┐
│                     CASE EXECUTION BOUNDARY                      │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    Runtime Context                          │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │  │
│  │  │ Citizen Ctx │  │  Case Ctx   │  │ Session Metadata    │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              │                                    │
│                              ▼                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                     ENGINE EXECUTION                          │ │
│  │  Eligibility → Wizard → Workflow → Payment → Fraud → Notify  │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                     OUTPUT (Immutable)                        │ │
│  │  - Evaluation results, events, payment records, notifications │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Thread Safety

All engine operations MUST be:
- Atomic at the database transaction level
- Idempotent for retry safety
- Isolated from concurrent case executions

---

## 5. Error Propagation Rules

### 5.1 Eligibility Engine Errors

| Error Type | Classification | Action | Blocks Workflow |
|------------|----------------|--------|-----------------|
| Rule configuration missing | CRITICAL | Halt evaluation, log, notify admin | YES |
| Data field missing (required) | RECOVERABLE | Return PENDING, request data | NO |
| Data field missing (optional) | RECOVERABLE | Use default value, continue | NO |
| BIS lookup timeout | RECOVERABLE | Retry 3x, then fallback to manual | NO |
| Rule evaluation exception | CRITICAL | Log, return PENDING, escalate | YES |

### 5.2 Wizard Engine Errors

| Error Type | Classification | Action | Blocks Workflow |
|------------|----------------|--------|-----------------|
| Step definition missing | CRITICAL | Halt wizard, log, notify admin | YES |
| Validation failure | RECOVERABLE | Return validation errors to user | NO |
| Conditional logic error | CRITICAL | Log, skip to next step, notify | NO |
| Data persistence failure | CRITICAL | Rollback, retry, escalate | YES |

### 5.3 Workflow Engine Errors

| Error Type | Classification | Action | Blocks Workflow |
|------------|----------------|--------|-----------------|
| Invalid transition requested | RECOVERABLE | Reject, return allowed transitions | NO |
| Guard condition failure | RECOVERABLE | Reject, return failure reason | NO |
| State definition missing | CRITICAL | Halt, log, freeze case | YES |
| Concurrent transition conflict | RECOVERABLE | Retry with optimistic lock | NO |

### 5.4 Payment Engine Errors

| Error Type | Classification | Action | Blocks Workflow |
|------------|----------------|--------|-----------------|
| Formula parsing error | CRITICAL | Halt, log, notify finance | YES |
| Calculation overflow | CRITICAL | Cap at maximum, log warning | NO |
| Subema submission failure | RECOVERABLE | Queue for retry, max 5 attempts | NO |
| Subema timeout | RECOVERABLE | Queue for retry | NO |
| Duplicate payment detected | RECOVERABLE | Skip, log, notify handler | NO |

### 5.5 Fraud Engine Errors

| Error Type | Classification | Action | Blocks Workflow |
|------------|----------------|--------|-----------------|
| Signal definition missing | RECOVERABLE | Skip signal, log warning | NO |
| Scoring algorithm failure | RECOVERABLE | Default to LOW risk, log | NO |
| Historical data unavailable | RECOVERABLE | Score with available data only | NO |
| Threshold configuration error | CRITICAL | Default to MEDIUM, notify admin | NO |

### 5.6 Notification Engine Errors

| Error Type | Classification | Action | Blocks Workflow |
|------------|----------------|--------|-----------------|
| Template missing | RECOVERABLE | Use fallback template, log | NO |
| Email delivery failure | RECOVERABLE | Retry 3x, then queue | NO |
| SMS delivery failure | RECOVERABLE | Retry 3x, then fallback to email | NO |
| Portal notification failure | RECOVERABLE | Retry, log error | NO |

---

## 6. Error Escalation Matrix

| Severity | Response Time | Notification Target | System Impact |
|----------|---------------|---------------------|---------------|
| CRITICAL | Immediate | System Admin, Department Head | May halt operations |
| HIGH | 15 minutes | Case Supervisor | Degraded functionality |
| MEDIUM | 1 hour | Case Handler | Minor degradation |
| LOW | 24 hours | Logged only | No user impact |

---

## 7. Recovery Procedures

### 7.1 Engine Recovery Order

When recovering from system failure:

1. Verify database connectivity
2. Reload OMR from source
3. Reinitialize DAL bindings
4. Load engine configurations from `/configs/`
5. Validate version pointers
6. Resume queued operations

### 7.2 Partial Failure Recovery

| Scenario | Recovery Action |
|----------|-----------------|
| Single engine failure | Restart engine, replay queued items |
| Database connection lost | Exponential backoff retry, alert at 5 failures |
| Configuration corruption | Rollback to previous version, notify admin |
| Memory exhaustion | Graceful shutdown, clear caches, restart |

---

## 8. Monitoring Requirements

### 8.1 Health Check Endpoints

Each engine MUST expose:

| Endpoint | Purpose | Response |
|----------|---------|----------|
| `/health` | Basic liveness | `{ "status": "ok" }` |
| `/ready` | Initialization complete | `{ "ready": true, "version": "1.0.0" }` |
| `/metrics` | Performance metrics | Prometheus format |

### 8.2 Required Metrics

| Metric | Type | Description |
|--------|------|-------------|
| engine_execution_duration_ms | Histogram | Time per engine execution |
| engine_error_count | Counter | Errors by engine and type |
| engine_queue_depth | Gauge | Pending operations per engine |
| context_load_duration_ms | Histogram | Time to load runtime context |

---

## 9. Version Compatibility

### 9.1 Version Lock Rules

- All engines MUST use the same effective_date for rule versions
- Version changes require coordinated deployment
- Rollback MUST restore all engines to previous version set

### 9.2 Version Mismatch Handling

| Scenario | Action |
|----------|--------|
| Engine version newer than rules | Log warning, use latest compatible rules |
| Engine version older than rules | HALT, require engine update |
| Cross-engine version mismatch | HALT, require synchronized deployment |

---

## 10. Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Phase 6 | System | Initial specification |

---

## 11. Appendix: Runtime Context Examples

### 11.1 Complete Runtime Context (General Assistance Application)

```json
{
  "runtime_context": {
    "citizen_context": {
      "citizen_id": "c7b9a1e2-4f3d-4a8b-9c1e-2f3a4b5c6d7e",
      "national_id": "123456789",
      "first_name": "Maria",
      "last_name": "Jansen",
      "date_of_birth": "1985-03-15",
      "district": "Paramaribo",
      "household_size": 4,
      "household_members": [
        {
          "national_id": "123456790",
          "relationship": "spouse",
          "date_of_birth": "1987-06-22"
        },
        {
          "national_id": "123456791",
          "relationship": "child",
          "date_of_birth": "2010-09-10"
        },
        {
          "national_id": "123456792",
          "relationship": "child",
          "date_of_birth": "2015-01-05"
        }
      ],
      "bis_verified": true,
      "bis_verified_at": "2024-01-15T10:30:00Z"
    },
    "case_context": {
      "case_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "case_reference": "GA-20240115-0042",
      "service_type": "general_assistance",
      "current_status": "eligibility_check",
      "previous_status": "validation",
      "case_handler_id": "h1a2n3d4-l5e6-r789-0abc-def123456789",
      "intake_office_id": "o1f2f3i4-c5e6-7890-abcd-ef1234567890",
      "district_id": "d1i2s3t4-r5i6-c789-0abc-def123456789",
      "created_at": "2024-01-15T09:00:00Z",
      "updated_at": "2024-01-15T10:35:00Z"
    },
    "session_metadata": {
      "user_id": "u1s2e3r4-5678-90ab-cdef-123456789abc",
      "auth_user_id": "a1u2t3h4-5678-90ab-cdef-123456789abc",
      "role": "case_handler",
      "office_id": "o1f2f3i4-c5e6-7890-abcd-ef1234567890",
      "district_id": "d1i2s3t4-r5i6-c789-0abc-def123456789",
      "session_started_at": "2024-01-15T08:00:00Z",
      "ip_address": "sha256:abc123...",
      "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    },
    "version_pointers": {
      "eligibility_rule_version": "1.0.0",
      "workflow_version": "1.0.0",
      "payment_formula_version": "1.0.0",
      "fraud_rule_version": "1.0.0",
      "wizard_version": "1.0.0",
      "effective_date": "2024-01-01",
      "locked": false
    },
    "execution_id": "e1x2e3c4-5678-90ab-cdef-123456789abc",
    "execution_started_at": "2024-01-15T10:35:00Z",
    "trace_id": "trace-2024011510350042"
  }
}
```
