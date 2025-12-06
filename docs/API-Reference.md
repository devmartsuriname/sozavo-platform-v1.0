# SoZaVo Platform v1.0 – API Reference

> **Version:** 1.0  
> **Status:** Implementation Blueprint  
> **Source:** Backend Documentation v2.0, Architecture v3.0  
> **Cross-References:** DAL-Specification.md, Backend.md

---

## 1. Purpose

This document defines the API reference foundations for SoZaVo Platform edge functions. It specifies request/response shapes, error handling, and version anchors for all required edge functions.

---

## 2. Edge Function Index

| Function | Purpose | Auth Required | Version | Stability |
|----------|---------|---------------|---------|-----------|
| fetchFromBIS | Query BIS for citizen data | Yes | 1.0.0 | **Blocked** |
| fetchFromSubema | Check payment status | Yes | 1.0.0 | **Blocked** |
| evaluateEligibility | Run eligibility rules | Yes | 1.0.0 | Stable |
| processPaymentBatch | Submit payment batch | Yes | 1.0.0 | **Blocked** |
| scoreFraudSignal | Calculate fraud risk | Yes | 1.0.0 | Stable |
| sendNotification | Send email/SMS/portal | Yes | 1.0.0 | Medium |
| generateCaseEvent | Log case audit event | Yes | 1.0.0 | Stable |

---

## 3. Function Specifications

### 3.1 fetchFromBIS

**Purpose:** Query the BIS (Civil Registry) API for citizen identity verification.

**Endpoint:** `/functions/v1/fetchFromBIS`

**Method:** POST

**Request Object:**
```typescript
{
  national_id: string;  // Required, 9-digit format
}
```

**Response Object (Success):**
```typescript
{
  success: true;
  found: true;
  data: {
    national_id: string;
    person_id: string;        // BIS internal ID
    first_name: string;       // voornamen
    last_name: string;        // achternaam
    date_of_birth: string;    // YYYY-MM-DD (geboortedatum)
    gender: string;
    address: string;          // adres
    district: string;
    is_deceased: boolean;
    household_id: string;
    household_members: Array<{
      national_id: string;
      first_name: string;
      last_name: string;
      relationship: string;
    }>;
  };
  verified_at: string;        // ISO timestamp
}
```

**Response Object (Not Found):**
```typescript
{
  success: true;
  found: false;
  message: "Citizen not found in BIS registry";
}
```

**Error Object:**
```typescript
{
  success: false;
  error: {
    code: string;             // BIS_UNAVAILABLE, BIS_TIMEOUT, INVALID_INPUT
    message: string;
    details?: object;
  };
}
```

**Validation Rules:**
- national_id must be exactly 9 digits
- Caller must be authenticated
- Caller must have role: district_intake_officer, case_handler, or higher

**Security Requirements:**
- JWT authentication required
- Rate limit: 100 requests/minute per user
- All requests logged to audit

**Version Anchor:**
```
Version: 1.0.0
Stability: Blocked
Status: Awaiting BIS API specification
Dependencies: BIS API credentials (secret: BIS_API_KEY, BIS_API_URL)
```

---

### 3.2 fetchFromSubema

**Purpose:** Query Subema payment system for payment status.

**Endpoint:** `/functions/v1/fetchFromSubema`

**Method:** POST

**Request Object:**
```typescript
{
  action: "check_status" | "get_batch";
  payment_id?: string;        // For single payment status
  batch_reference?: string;   // For batch status
}
```

**Response Object (Check Status):**
```typescript
{
  success: true;
  data: {
    payment_id: string;
    subema_reference: string;
    status: "pending" | "processed" | "failed";
    processed_at?: string;
    failure_reason?: string;
    amount: number;
    recipient_account: string;
  };
}
```

**Response Object (Get Batch):**
```typescript
{
  success: true;
  data: {
    batch_reference: string;
    total_payments: number;
    processed: number;
    failed: number;
    pending: number;
    payments: Array<{
      payment_id: string;
      status: string;
    }>;
  };
}
```

**Error Object:**
```typescript
{
  success: false;
  error: {
    code: string;             // SUBEMA_UNAVAILABLE, NOT_FOUND, INVALID_INPUT
    message: string;
  };
}
```

**Version Anchor:**
```
Version: 1.0.0
Stability: Blocked
Status: Awaiting Subema API specification
Dependencies: SUBEMA_API_KEY, SUBEMA_API_URL
```

---

### 3.3 evaluateEligibility

**Purpose:** Execute eligibility rules for a case and return evaluation result.

**Endpoint:** `/functions/v1/evaluateEligibility`

**Method:** POST

**Request Object:**
```typescript
{
  case_id: string;            // UUID
  trigger: "manual" | "auto"; // Who triggered
}
```

**Response Object:**
```typescript
{
  success: true;
  data: {
    case_id: string;
    evaluation_id: string;
    result: "ELIGIBLE" | "INELIGIBLE" | "PENDING";
    criteria_results: Array<{
      rule_id: string;
      rule_name: string;
      passed: boolean;
      is_mandatory: boolean;
      input_value: any;
      expected_value: any;
      message?: string;
    }>;
    passed_count: number;
    failed_count: number;
    pending_count: number;
    evaluated_at: string;
    recommended_action: string;
  };
}
```

**Error Object:**
```typescript
{
  success: false;
  error: {
    code: string;             // CASE_NOT_FOUND, INVALID_STATUS, RULES_NOT_FOUND
    message: string;
  };
}
```

**Validation Rules:**
- case_id must exist
- Case must be in status: validation or eligibility_check
- Rules must exist for service type

**Security Requirements:**
- JWT authentication required
- Caller must have role: case_handler or higher
- Result logged to eligibility_evaluations table

**Version Anchor:**
```
Version: 1.0.0
Stability: Stable
Dependencies: configs/eligibility/*.json
```

---

### 3.4 processPaymentBatch

**Purpose:** Submit a batch of payments to Subema for processing.

**Endpoint:** `/functions/v1/processPaymentBatch`

**Method:** POST

**Request Object:**
```typescript
{
  payment_ids: string[];      // Array of payment UUIDs
  scheduled_date?: string;    // Optional, defaults to next payment day
}
```

**Response Object:**
```typescript
{
  success: true;
  data: {
    batch_reference: string;
    payments_submitted: number;
    payments_failed: number;
    results: Array<{
      payment_id: string;
      status: "submitted" | "failed";
      subema_reference?: string;
      error?: string;
    }>;
    submitted_at: string;
  };
}
```

**Error Object:**
```typescript
{
  success: false;
  error: {
    code: string;             // SUBEMA_UNAVAILABLE, INVALID_PAYMENTS, DUPLICATE_BATCH
    message: string;
    failed_payments?: string[];
  };
}
```

**Validation Rules:**
- All payment_ids must exist
- All payments must have status: pending
- All related cases must be approved

**Security Requirements:**
- JWT authentication required
- Caller must have role: system_admin
- All submissions logged

**Version Anchor:**
```
Version: 1.0.0
Stability: Blocked
Status: Awaiting Subema API specification
Dependencies: SUBEMA_API_KEY, SUBEMA_API_URL
```

---

### 3.5 scoreFraudSignal

**Purpose:** Calculate fraud risk score for a case.

**Endpoint:** `/functions/v1/scoreFraudSignal`

**Method:** POST

**Request Object:**
```typescript
{
  case_id: string;            // UUID
  trigger: "intake" | "validation" | "eligibility" | "manual";
  signals_to_check?: string[]; // Optional, check specific signals
}
```

**Response Object:**
```typescript
{
  success: true;
  data: {
    case_id: string;
    scan_id: string;
    fraud_score: number;       // 0-100
    risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    signals_detected: Array<{
      signal_id: string;
      signal_name: string;
      severity: string;
      score_points: number;
      details: string;
    }>;
    signals_checked: number;
    recommended_action: string;
    scanned_at: string;
  };
}
```

**Error Object:**
```typescript
{
  success: false;
  error: {
    code: string;             // CASE_NOT_FOUND, SCAN_FAILED
    message: string;
  };
}
```

**Validation Rules:**
- case_id must exist
- Case must not be closed or rejected

**Security Requirements:**
- JWT authentication required
- Results logged to fraud_risk_scores table
- Critical risk triggers notification

**Version Anchor:**
```
Version: 1.0.0
Stability: Stable
Dependencies: configs/fraud/fraud_engine.json
```

---

### 3.6 sendNotification

**Purpose:** Send notifications via email, SMS, or portal.

**Endpoint:** `/functions/v1/sendNotification`

**Method:** POST

**Request Object:**
```typescript
{
  recipient_type: "citizen" | "user";
  recipient_id: string;       // UUID
  channels: ("email" | "sms" | "portal")[];
  template: string;           // Notification template ID
  template_data: object;      // Dynamic content
  case_id?: string;           // Related case
  priority?: "low" | "normal" | "high";
}
```

**Response Object:**
```typescript
{
  success: true;
  data: {
    notification_id: string;
    channels_sent: Array<{
      channel: string;
      status: "sent" | "queued" | "failed";
      message_id?: string;
      error?: string;
    }>;
    sent_at: string;
  };
}
```

**Error Object:**
```typescript
{
  success: false;
  error: {
    code: string;             // RECIPIENT_NOT_FOUND, TEMPLATE_NOT_FOUND, CHANNEL_UNAVAILABLE
    message: string;
  };
}
```

**Validation Rules:**
- recipient_id must exist
- Template must exist
- At least one channel must be specified

**Security Requirements:**
- JWT authentication required
- Notification content logged (not PII)

**Version Anchor:**
```
Version: 1.0.0
Stability: Medium
Status: Email ready, SMS requires provider confirmation
Dependencies: EMAIL_API_KEY, SMS_API_KEY (blocked)
```

---

### 3.7 generateCaseEvent

**Purpose:** Log an audit event for a case.

**Endpoint:** `/functions/v1/generateCaseEvent`

**Method:** POST

**Request Object:**
```typescript
{
  case_id: string;            // UUID
  event_type: string;         // status_change, document_upload, etc.
  old_status?: string;        // For status_change events
  new_status?: string;        // For status_change events
  meta?: object;              // Additional event data
}
```

**Response Object:**
```typescript
{
  success: true;
  data: {
    event_id: string;
    case_id: string;
    event_type: string;
    actor_id: string;
    created_at: string;
  };
}
```

**Error Object:**
```typescript
{
  success: false;
  error: {
    code: string;             // CASE_NOT_FOUND, INVALID_EVENT_TYPE
    message: string;
  };
}
```

**Validation Rules:**
- case_id must exist
- event_type must be valid
- Actor determined from JWT

**Security Requirements:**
- JWT authentication required
- Event always logged (cannot be suppressed)

**Version Anchor:**
```
Version: 1.0.0
Stability: Stable
Dependencies: None
```

---

## 4. Common Response Headers

All edge functions return these headers:

```
Content-Type: application/json
X-Request-Id: <uuid>
X-Function-Version: <version>
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type
```

---

## 5. Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Missing or invalid JWT |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid input |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |
| EXTERNAL_SERVICE_ERROR | 502 | BIS/Subema unavailable |
| TIMEOUT | 504 | Request timeout |

---

## 6. Cross-References

| Document | Section |
|----------|---------|
| Backend.md | Section 4 (Edge Functions) |
| DAL-Specification.md | Query/Mutation requirements |
| Architecture.md | Section 5 (Integration Architecture) |

---

**END OF API REFERENCE v1.0**
