# SoZaVo Platform v1.0 – Event Routing Framework

> **Version:** 1.0  
> **Phase:** 6 – Engine Runtime Assembly  
> **Status:** Specification Document  
> **Cross-References:** Engine-Runtime-Configuration.md, Service-Layer-Specification.md, Backend.md

---

## 1. Overview

This document defines the event-driven architecture for SoZaVo, including event types, routing rules, subscriber registration, and retry/failure handling.

---

## 2. Event Types

### 2.1 Case Lifecycle Events

| Event Type | Trigger | Payload |
|------------|---------|---------|
| case_created | New case record inserted | case_id, citizen_id, service_type, created_by |
| case_status_changed | Case status transition | case_id, previous_status, new_status, changed_by |
| case_assigned | Handler assigned to case | case_id, handler_id, assigned_by |
| case_closed | Case reaches terminal state | case_id, closure_reason, closed_by |
| case_reopened | Closed case reopened | case_id, reopen_reason, reopened_by |

**case_created Payload:**
```json
{
  "event_type": "case_created",
  "event_id": "uuid",
  "timestamp": "2024-01-15T10:30:00Z",
  "payload": {
    "case_id": "uuid",
    "case_reference": "GA-20240115-0042",
    "citizen_id": "uuid",
    "service_type": "general_assistance",
    "intake_office_id": "uuid",
    "created_by": {
      "user_id": "uuid",
      "role": "district_intake_officer"
    }
  }
}
```

**case_status_changed Payload:**
```json
{
  "event_type": "case_status_changed",
  "event_id": "uuid",
  "timestamp": "2024-01-15T11:00:00Z",
  "payload": {
    "case_id": "uuid",
    "case_reference": "GA-20240115-0042",
    "previous_status": "intake",
    "new_status": "validation",
    "transition_reason": "wizard_completed",
    "changed_by": {
      "user_id": "uuid",
      "role": "case_handler",
      "system_triggered": false
    }
  }
}
```

### 2.2 Eligibility Events

| Event Type | Trigger | Payload |
|------------|---------|---------|
| eligibility_evaluated | Eligibility check completed | case_id, result, criteria_summary |
| eligibility_overridden | Manual override applied | case_id, original_result, override_result, override_reason, overridden_by |

**eligibility_evaluated Payload:**
```json
{
  "event_type": "eligibility_evaluated",
  "event_id": "uuid",
  "timestamp": "2024-01-15T11:30:00Z",
  "payload": {
    "case_id": "uuid",
    "evaluation_id": "uuid",
    "result": "ELIGIBLE",
    "criteria_summary": {
      "total_rules": 3,
      "passed": 3,
      "failed": 0,
      "pending": 0
    },
    "rule_version": "1.0.0"
  }
}
```

### 2.3 Document Events

| Event Type | Trigger | Payload |
|------------|---------|---------|
| document_uploaded | New document uploaded | case_id, document_id, document_type, uploaded_by |
| document_verified | Document verification completed | case_id, document_id, verification_result, verified_by |
| document_rejected | Document rejected | case_id, document_id, rejection_reason, rejected_by |
| document_expired | Document expiration detected | case_id, document_id, expired_at |

**document_uploaded Payload:**
```json
{
  "event_type": "document_uploaded",
  "event_id": "uuid",
  "timestamp": "2024-01-15T10:45:00Z",
  "payload": {
    "case_id": "uuid",
    "document_id": "uuid",
    "document_type": "id_card",
    "file_name": "id_card_scan.pdf",
    "file_size": 245000,
    "mime_type": "application/pdf",
    "uploaded_by": {
      "user_id": "uuid",
      "role": "citizen",
      "channel": "portal"
    }
  }
}
```

### 2.4 Payment Events

| Event Type | Trigger | Payload |
|------------|---------|---------|
| payment_calculated | Payment amount determined | case_id, payment_id, amount, calculation_details |
| payment_batch_created | New payment batch created | batch_id, payment_count, total_amount |
| payment_submitted | Payment sent to Subema | payment_id, subema_reference |
| payment_processed | Payment successfully disbursed | payment_id, subema_reference, processed_at |
| payment_failed | Payment processing failed | payment_id, failure_reason, retry_count |

**payment_processed Payload:**
```json
{
  "event_type": "payment_processed",
  "event_id": "uuid",
  "timestamp": "2024-01-20T14:30:00Z",
  "payload": {
    "case_id": "uuid",
    "payment_id": "uuid",
    "batch_id": "uuid",
    "amount": {
      "value": 1500.00,
      "currency": "SRD"
    },
    "subema_reference": "SUB-2024-00001234",
    "bank_reference": "BANK-TXN-12345",
    "processed_at": "2024-01-20T14:30:00Z"
  }
}
```

### 2.5 Fraud Events

| Event Type | Trigger | Payload |
|------------|---------|---------|
| fraud_signal_detected | New fraud signal identified | case_id, signal_id, signal_type, severity |
| fraud_score_updated | Risk score recalculated | case_id, previous_score, new_score, risk_level |
| fraud_alert_triggered | High-risk threshold exceeded | case_id, alert_type, risk_level, recommended_action |
| fraud_investigation_opened | Investigation started | case_id, investigation_id, assigned_to |
| fraud_case_cleared | Investigation cleared case | case_id, investigation_id, cleared_by |

**fraud_alert_triggered Payload:**
```json
{
  "event_type": "fraud_alert_triggered",
  "event_id": "uuid",
  "timestamp": "2024-01-15T11:45:00Z",
  "payload": {
    "case_id": "uuid",
    "alert_id": "uuid",
    "risk_level": "HIGH",
    "risk_score": 78,
    "signals_detected": [
      {
        "signal_type": "DUPLICATE_ADDRESS",
        "severity": "HIGH",
        "weight": 30
      },
      {
        "signal_type": "RAPID_REAPPLICATION",
        "severity": "MEDIUM",
        "weight": 20
      }
    ],
    "recommended_action": "supervisor_review",
    "auto_actions_taken": [
      "payment_hold",
      "supervisor_notification"
    ]
  }
}
```

### 2.6 Notification Events

| Event Type | Trigger | Payload |
|------------|---------|---------|
| notification_sent | Notification dispatched | notification_id, channel, recipient, status |
| notification_delivered | Delivery confirmed | notification_id, channel, delivered_at |
| notification_failed | Delivery failed | notification_id, channel, failure_reason, retry_count |
| notification_read | Recipient read notification | notification_id, read_at |

### 2.7 Integration Events

| Event Type | Trigger | Payload |
|------------|---------|---------|
| bis_lookup_completed | BIS query finished | citizen_id, found, verification_status |
| bis_lookup_failed | BIS query failed | citizen_id, error_code, will_retry |
| subema_sync_completed | Subema sync finished | batch_id, success_count, failure_count |
| subema_sync_failed | Subema sync failed | batch_id, error_code, will_retry |

---

## 3. Event Routing Rules

### 3.1 Routing Matrix

| Event Type | Notification Engine | Audit Log | Workflow Engine | Fraud Engine |
|------------|---------------------|-----------|-----------------|--------------|
| case_created | ✓ | ✓ | ✓ | ✓ |
| case_status_changed | ✓ | ✓ | ✓ | ✓ |
| case_assigned | ✓ | ✓ | - | - |
| case_closed | ✓ | ✓ | ✓ | - |
| eligibility_evaluated | ✓ | ✓ | ✓ | ✓ |
| eligibility_overridden | ✓ | ✓ | ✓ | ✓ |
| document_uploaded | - | ✓ | ✓ | ✓ |
| document_verified | ✓ | ✓ | ✓ | - |
| document_rejected | ✓ | ✓ | ✓ | ✓ |
| payment_processed | ✓ | ✓ | ✓ | - |
| payment_failed | ✓ | ✓ | ✓ | ✓ |
| fraud_alert_triggered | ✓ | ✓ | ✓ | - |
| bis_lookup_completed | - | ✓ | - | - |
| subema_sync_completed | - | ✓ | - | - |

### 3.2 Routing Rules by Subscriber

#### 3.2.1 Notification Engine Routes

| Event | Notification Type | Recipients | Channel |
|-------|-------------------|------------|---------|
| case_created | Application received | Citizen | Portal, Email |
| case_status_changed (to: approved) | Approval notification | Citizen | Portal, Email, SMS |
| case_status_changed (to: rejected) | Rejection notification | Citizen | Portal, Email |
| case_assigned | Assignment notification | Case handler | Internal |
| eligibility_evaluated (INELIGIBLE) | Ineligibility notice | Citizen | Portal, Email |
| document_rejected | Document rejection | Citizen | Portal, Email |
| payment_processed | Payment confirmation | Citizen | Portal, Email, SMS |
| fraud_alert_triggered (HIGH) | Fraud alert | Fraud officer, Supervisor | Internal |

#### 3.2.2 Audit Log Routes

ALL events are routed to audit log with:
- Full event payload
- Actor information
- Timestamp
- Request trace ID
- IP address (hashed)

#### 3.2.3 Workflow Engine Routes

| Event | Workflow Action |
|-------|-----------------|
| case_created | Initialize case workflow |
| case_status_changed | Validate transition, update state |
| eligibility_evaluated | Trigger next transition based on result |
| document_verified | Check document completion, may trigger transition |
| payment_processed | Update case to payment_processed |
| fraud_alert_triggered | Hold case, require supervisor action |

#### 3.2.4 Fraud Engine Routes

| Event | Fraud Action |
|-------|--------------|
| case_created | Initial fraud screening |
| case_status_changed | Update case risk profile |
| eligibility_overridden | Flag for review if frequent |
| document_uploaded | Analyze document metadata |
| document_rejected | Increase suspicion score |
| payment_failed | Check for payment manipulation patterns |

### 3.3 Conditional Routing

| Condition | Routing Modification |
|-----------|---------------------|
| citizen.notification_preferences.sms = false | Skip SMS channel |
| case.fraud_risk_level = 'HIGH' | Add fraud_officer to all notifications |
| user.role = 'system_admin' | Add admin to critical events |
| office.district = citizen.district | Route to local office |
| event.severity = 'CRITICAL' | Immediate routing, bypass queue |

---

## 4. Event Delivery Guarantees

### 4.1 Delivery Semantics

| Subscriber Type | Delivery Guarantee | Ordering |
|-----------------|-------------------|----------|
| Audit Log | At-least-once | Ordered by timestamp |
| Notification Engine | At-least-once | Best effort |
| Workflow Engine | Exactly-once | Ordered per case |
| Fraud Engine | At-least-once | Best effort |

### 4.2 Idempotency Requirements

All event handlers MUST be idempotent:
- Use event_id as deduplication key
- Check for existing records before creating
- Use upsert operations where appropriate

```json
{
  "event_id": "uuid",
  "idempotency_key": "case_created:GA-20240115-0042",
  "processed_at": null
}
```

---

## 5. Retry Logic

### 5.1 Retry Configuration by Subscriber

| Subscriber | Max Retries | Initial Delay | Max Delay | Backoff |
|------------|-------------|---------------|-----------|---------|
| Audit Log | 10 | 100ms | 60s | Exponential |
| Notification Engine | 5 | 1s | 5m | Exponential |
| Workflow Engine | 3 | 500ms | 10s | Exponential |
| Fraud Engine | 5 | 1s | 2m | Exponential |

### 5.2 Retry Flow

```
Event Received
      │
      ▼
┌─────────────────┐
│ Process Event   │
└─────────────────┘
      │
  ┌───┴───┐
  │Success│──▶ Complete, ACK
  └───────┘
      │
  ┌───┴───┐
  │Failure│
  └───────┘
      │
      ▼
┌─────────────────┐
│ Retry Count < Max? │
└─────────────────┘
      │         │
     YES       NO
      │         │
      ▼         ▼
┌─────────┐  ┌─────────────┐
│ Wait    │  │ Dead Letter │
│ Backoff │  │ Queue       │
└─────────┘  └─────────────┘
      │              │
      ▼              ▼
┌─────────┐  ┌─────────────┐
│ Retry   │  │ Alert Admin │
│ Process │  │ Manual Fix  │
└─────────┘  └─────────────┘
```

### 5.3 Backoff Calculation

```
delay = min(initial_delay * (2 ^ retry_count) + jitter, max_delay)

Where:
- jitter = random(0, initial_delay * 0.1)
```

**Example (Notification Engine):**
| Retry | Base Delay | With Jitter | Actual Wait |
|-------|------------|-------------|-------------|
| 1 | 2s | 2.1s | ~2s |
| 2 | 4s | 4.3s | ~4s |
| 3 | 8s | 8.5s | ~8s |
| 4 | 16s | 16.2s | ~16s |
| 5 | 32s | 32.8s | ~33s (capped at 5m) |

---

## 6. Failure Escalation

### 6.1 Escalation Thresholds

| Subscriber | Threshold | Escalation Action |
|------------|-----------|-------------------|
| Audit Log | 10 failures | Alert system admin, investigation required |
| Notification Engine | 5 failures | Log, use fallback channel |
| Workflow Engine | 3 failures | Freeze case, alert supervisor |
| Fraud Engine | 5 failures | Default to MEDIUM risk, log |

### 6.2 Dead Letter Queue (DLQ)

Events that exceed max retries are moved to DLQ:

```json
{
  "dlq_entry": {
    "id": "uuid",
    "original_event": { /* full event */ },
    "subscriber": "notification_engine",
    "failure_count": 5,
    "last_failure_reason": "SMTP_CONNECTION_REFUSED",
    "first_failure_at": "2024-01-15T10:30:00Z",
    "last_failure_at": "2024-01-15T10:35:00Z",
    "status": "pending_review"
  }
}
```

### 6.3 DLQ Processing

| Status | Description | Action |
|--------|-------------|--------|
| pending_review | Awaiting manual review | Admin reviews |
| retry_scheduled | Manual retry scheduled | Will retry at scheduled time |
| resolved | Issue fixed, retried successfully | Archive |
| discarded | Event obsolete or duplicate | Archive with reason |

---

## 7. Event Storage

### 7.1 Event Retention

| Event Category | Retention Period | Storage Tier |
|----------------|------------------|--------------|
| Audit events | 7 years | Cold storage after 1 year |
| Case events | Life of case + 5 years | Hot first year, then cold |
| Payment events | 7 years | Hot first year, then cold |
| Notification events | 1 year | Hot 30 days, then cold |
| Integration events | 90 days | Hot only |

### 7.2 Event Table Schema

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_id UUID UNIQUE NOT NULL,
  aggregate_type TEXT NOT NULL,
  aggregate_id UUID NOT NULL,
  payload JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ,
  retry_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending'
);

CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_aggregate ON events(aggregate_type, aggregate_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_created ON events(created_at);
```

---

## 8. Monitoring & Observability

### 8.1 Metrics

| Metric | Type | Labels |
|--------|------|--------|
| events_published_total | Counter | event_type |
| events_processed_total | Counter | event_type, subscriber, status |
| event_processing_duration_ms | Histogram | event_type, subscriber |
| event_retry_count | Counter | event_type, subscriber |
| dlq_size | Gauge | subscriber |

### 8.2 Alerts

| Alert | Condition | Severity |
|-------|-----------|----------|
| High DLQ size | DLQ > 100 events | HIGH |
| Processing delay | Lag > 5 minutes | MEDIUM |
| Subscriber failure rate | > 10% failures in 5 min | HIGH |
| Event storm | > 1000 events/minute | MEDIUM |

---

## 9. Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Phase 6 | System | Initial specification |
