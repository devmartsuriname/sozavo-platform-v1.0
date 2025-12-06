# SoZaVo Platform v1.0 – Integration Service Stubs

> **Version:** 1.0  
> **Phase:** 6 – Engine Runtime Assembly  
> **Status:** Specification Document (Non-Executable)  
> **Cross-References:** API-Reference.md, Backend.md, Architecture.md

---

## 1. Overview

This document defines behavioral contracts for external service integrations. These are NOT implementations—they specify expected behaviors, field mappings, error handling, and retry logic for future implementation.

---

## 2. BIS Service Stub (Civil Registry)

### 2.1 Service Overview

| Attribute | Value |
|-----------|-------|
| Service Name | BIS (Bevolkings Informatie Systeem) |
| Owner | Ministry of Home Affairs |
| Purpose | Citizen identity verification |
| Protocol | REST API (assumed) |
| Authentication | API Key + Certificate (TBD) |
| Status | **Blocked** – Awaiting official API specification |

### 2.2 Endpoint Definitions

#### 2.2.1 Citizen Lookup

| Attribute | Value |
|-----------|-------|
| Endpoint | `GET /api/v1/citizen/lookup` |
| Purpose | Retrieve citizen data by national ID |
| Auth Required | Yes (API Key) |

**Request:**
```json
{
  "national_id": "123456789",
  "request_id": "uuid",
  "requesting_system": "SOZAVO",
  "purpose": "benefit_verification"
}
```

**Success Response (200):**
```json
{
  "found": true,
  "data": {
    "persoonsnummer": "123456789",
    "voornamen": "Jan Willem",
    "achternaam": "Jansen",
    "geboortedatum": "1985-03-15",
    "geboorteplaats": "Paramaribo",
    "geslacht": "M",
    "adres": {
      "straat": "Kernkampweg",
      "huisnummer": "42",
      "plaats": "Paramaribo",
      "postcode": "10001"
    },
    "burgerlijke_staat": "gehuwd",
    "nationaliteit": "Surinaams"
  },
  "verification_timestamp": "2024-01-15T10:30:00Z",
  "request_id": "uuid"
}
```

**Not Found Response (404):**
```json
{
  "found": false,
  "error": {
    "code": "CITIZEN_NOT_FOUND",
    "message": "No citizen found with national ID 123456789"
  },
  "request_id": "uuid"
}
```

**Error Response (500):**
```json
{
  "found": false,
  "error": {
    "code": "BIS_INTERNAL_ERROR",
    "message": "Internal BIS system error"
  },
  "request_id": "uuid"
}
```

#### 2.2.2 Citizen Verify

| Attribute | Value |
|-----------|-------|
| Endpoint | `POST /api/v1/citizen/verify` |
| Purpose | Verify provided data matches BIS records |
| Auth Required | Yes (API Key) |

**Request:**
```json
{
  "national_id": "123456789",
  "verification_fields": {
    "first_name": "Jan",
    "last_name": "Jansen",
    "date_of_birth": "1985-03-15"
  },
  "request_id": "uuid"
}
```

**Success Response (200):**
```json
{
  "verified": true,
  "match_score": 100,
  "field_matches": {
    "first_name": true,
    "last_name": true,
    "date_of_birth": true
  },
  "verification_timestamp": "2024-01-15T10:30:00Z",
  "request_id": "uuid"
}
```

**Partial Match Response (200):**
```json
{
  "verified": false,
  "match_score": 66,
  "field_matches": {
    "first_name": true,
    "last_name": true,
    "date_of_birth": false
  },
  "discrepancies": [
    {
      "field": "date_of_birth",
      "provided": "1985-03-15",
      "expected": "1985-03-16"
    }
  ],
  "request_id": "uuid"
}
```

#### 2.2.3 Household Members

| Attribute | Value |
|-----------|-------|
| Endpoint | `GET /api/v1/household/members` |
| Purpose | Retrieve household composition |
| Auth Required | Yes (API Key) |

**Request:**
```json
{
  "national_id": "123456789",
  "include_extended_family": false,
  "request_id": "uuid"
}
```

**Success Response (200):**
```json
{
  "household_id": "HH-123456",
  "head_of_household": "123456789",
  "members": [
    {
      "national_id": "123456789",
      "relationship": "head",
      "first_name": "Jan",
      "last_name": "Jansen",
      "date_of_birth": "1985-03-15"
    },
    {
      "national_id": "123456790",
      "relationship": "spouse",
      "first_name": "Maria",
      "last_name": "Jansen",
      "date_of_birth": "1987-06-22"
    },
    {
      "national_id": "123456791",
      "relationship": "child",
      "first_name": "Pieter",
      "last_name": "Jansen",
      "date_of_birth": "2010-09-10"
    }
  ],
  "total_members": 3,
  "request_id": "uuid"
}
```

### 2.3 Field Mapping (BIS → CCR)

| BIS Field | CCR Field | Transformation |
|-----------|-----------|----------------|
| persoonsnummer | national_id | Direct copy |
| voornamen | first_name | Extract first name only |
| achternaam | last_name | Direct copy |
| geboortedatum | date_of_birth | Format: YYYY-MM-DD |
| geslacht | gender | Map: M→male, V→female |
| adres.straat + huisnummer | address | Concatenate with space |
| adres.plaats | district | Map to district enum |
| burgerlijke_staat | marital_status | Map to enum |

### 2.4 Retry Logic

| Scenario | Max Retries | Backoff Strategy | Fallback |
|----------|-------------|------------------|----------|
| Connection timeout | 3 | Exponential (1s, 2s, 4s) | Queue for manual lookup |
| HTTP 429 (Rate Limited) | 5 | Wait for Retry-After header | Queue with delay |
| HTTP 500 (Server Error) | 3 | Exponential (2s, 4s, 8s) | Log, notify admin |
| HTTP 503 (Unavailable) | 5 | Linear (30s intervals) | Queue for later |

### 2.5 Failure Modes

| Error Code | Description | System Response |
|------------|-------------|-----------------|
| BIS_UNAVAILABLE | BIS system not responding | Queue request, notify handler |
| BIS_TIMEOUT | Request timed out (>30s) | Retry per logic above |
| BIS_RATE_LIMITED | API quota exceeded | Wait and retry |
| CITIZEN_NOT_FOUND | No matching record | Allow manual entry, flag for review |
| BIS_AUTH_FAILED | Authentication rejected | Alert admin, halt integration |
| BIS_INVALID_REQUEST | Malformed request | Log error, fix code |

### 2.6 Validation Requirements

| Field | Validation Rule |
|-------|-----------------|
| national_id | Must be exactly 9 digits, numeric only |
| date_of_birth | Valid date, not in future |
| request_id | Valid UUID v4 |

---

## 3. Subema Service Stub (Payments)

### 3.1 Service Overview

| Attribute | Value |
|-----------|-------|
| Service Name | Subema (Payment Processing) |
| Owner | Ministry of Finance / Partner Bank |
| Purpose | Benefit payment disbursement |
| Protocol | REST API (assumed) |
| Authentication | API Key + OAuth2 (TBD) |
| Status | **Blocked** – Awaiting official API specification |

### 3.2 Endpoint Definitions

#### 3.2.1 Submit Payment

| Attribute | Value |
|-----------|-------|
| Endpoint | `POST /api/v1/payment/submit` |
| Purpose | Submit single payment for processing |
| Auth Required | Yes |

**Request:**
```json
{
  "payment_id": "uuid",
  "beneficiary": {
    "national_id": "123456789",
    "name": "Jan Jansen",
    "bank_account": "SR12345678901234"
  },
  "amount": {
    "value": 1500.00,
    "currency": "SRD"
  },
  "payment_type": "general_assistance",
  "reference": "GA-20240115-0042",
  "effective_date": "2024-01-20",
  "metadata": {
    "case_id": "uuid",
    "period": "2024-01"
  }
}
```

**Success Response (202):**
```json
{
  "accepted": true,
  "subema_reference": "SUB-2024-00001234",
  "status": "pending",
  "estimated_processing_date": "2024-01-20",
  "payment_id": "uuid"
}
```

**Rejection Response (400):**
```json
{
  "accepted": false,
  "error": {
    "code": "INVALID_BANK_ACCOUNT",
    "message": "Bank account number is invalid or closed"
  },
  "payment_id": "uuid"
}
```

#### 3.2.2 Submit Batch

| Attribute | Value |
|-----------|-------|
| Endpoint | `POST /api/v1/batch/submit` |
| Purpose | Submit multiple payments in a batch |
| Auth Required | Yes |

**Request:**
```json
{
  "batch_id": "uuid",
  "batch_reference": "BATCH-20240115-001",
  "payments": [
    {
      "payment_id": "uuid-1",
      "beneficiary": {
        "national_id": "123456789",
        "name": "Jan Jansen",
        "bank_account": "SR12345678901234"
      },
      "amount": {
        "value": 1500.00,
        "currency": "SRD"
      },
      "reference": "GA-20240115-0042"
    },
    {
      "payment_id": "uuid-2",
      "beneficiary": {
        "national_id": "987654321",
        "name": "Maria Smith",
        "bank_account": "SR98765432109876"
      },
      "amount": {
        "value": 2000.00,
        "currency": "SRD"
      },
      "reference": "SA-20240115-0015"
    }
  ],
  "total_amount": 3500.00,
  "payment_count": 2
}
```

**Success Response (202):**
```json
{
  "accepted": true,
  "batch_reference": "BATCH-20240115-001",
  "subema_batch_id": "SUB-BATCH-2024-0001",
  "status": "processing",
  "payment_results": [
    {
      "payment_id": "uuid-1",
      "subema_reference": "SUB-2024-00001234",
      "status": "accepted"
    },
    {
      "payment_id": "uuid-2",
      "subema_reference": "SUB-2024-00001235",
      "status": "accepted"
    }
  ],
  "accepted_count": 2,
  "rejected_count": 0
}
```

#### 3.2.3 Payment Status

| Attribute | Value |
|-----------|-------|
| Endpoint | `GET /api/v1/payment/status` |
| Purpose | Check payment processing status |
| Auth Required | Yes |

**Request:**
```json
{
  "subema_reference": "SUB-2024-00001234"
}
```

**Success Response (200):**
```json
{
  "subema_reference": "SUB-2024-00001234",
  "status": "processed",
  "processed_at": "2024-01-20T14:30:00Z",
  "bank_reference": "BANK-TXN-12345",
  "amount": {
    "value": 1500.00,
    "currency": "SRD"
  }
}
```

**Status Values:**
| Status | Description |
|--------|-------------|
| pending | Submitted, awaiting processing |
| processing | Currently being processed |
| processed | Successfully disbursed |
| failed | Payment failed |
| cancelled | Cancelled before processing |
| returned | Returned by bank |

#### 3.2.4 Batch Status

| Attribute | Value |
|-----------|-------|
| Endpoint | `GET /api/v1/batch/status` |
| Purpose | Check batch processing status |
| Auth Required | Yes |

**Request:**
```json
{
  "subema_batch_id": "SUB-BATCH-2024-0001"
}
```

**Response (200):**
```json
{
  "subema_batch_id": "SUB-BATCH-2024-0001",
  "status": "completed",
  "submitted_at": "2024-01-15T10:00:00Z",
  "completed_at": "2024-01-20T16:00:00Z",
  "summary": {
    "total_payments": 100,
    "processed": 98,
    "failed": 2,
    "total_amount_processed": 150000.00,
    "total_amount_failed": 3000.00
  },
  "failed_payments": [
    {
      "payment_id": "uuid-50",
      "subema_reference": "SUB-2024-00001284",
      "failure_reason": "ACCOUNT_CLOSED"
    },
    {
      "payment_id": "uuid-75",
      "subema_reference": "SUB-2024-00001309",
      "failure_reason": "INSUFFICIENT_DETAILS"
    }
  ]
}
```

### 3.3 Normalized Income Object

When Subema returns income verification data (future feature):

```json
{
  "income_verification": {
    "citizen_national_id": "123456789",
    "verification_date": "2024-01-15",
    "source": "SUBEMA",
    "income_items": [
      {
        "type": "employment",
        "employer": "ABC Company",
        "gross_monthly": 5000.00,
        "net_monthly": 4200.00,
        "currency": "SRD",
        "verified": true
      },
      {
        "type": "pension",
        "source": "National Pension Fund",
        "monthly_amount": 800.00,
        "currency": "SRD",
        "verified": true
      }
    ],
    "total_gross_monthly": 5800.00,
    "total_net_monthly": 5000.00,
    "verification_confidence": "high"
  }
}
```

### 3.4 Retry Logic

| Scenario | Max Retries | Backoff Strategy | Fallback |
|----------|-------------|------------------|----------|
| Connection timeout | 5 | Exponential (2s, 4s, 8s, 16s, 32s) | Queue for manual processing |
| HTTP 429 (Rate Limited) | 10 | Wait for Retry-After header | Delay batch |
| HTTP 500 (Server Error) | 5 | Exponential with jitter | Alert finance team |
| HTTP 503 (Unavailable) | 10 | Linear (60s intervals) | Queue for later |
| Payment rejected | 0 | No retry | Log, notify handler |

### 3.5 Fallback Behaviors

| Scenario | Fallback Action |
|----------|-----------------|
| Subema completely unavailable | Queue all payments, notify finance |
| Partial batch failure | Process successful, queue failures |
| Duplicate submission detected | Skip, log warning |
| Amount exceeds limit | Hold payment, require supervisor approval |
| Bank account invalid | Return to case handler for correction |

---

## 4. Notification Service Stub

### 4.1 Service Overview

| Attribute | Value |
|-----------|-------|
| Service Name | Notification Service |
| Components | Email (Resend), SMS (TBD), Portal |
| Purpose | Multi-channel citizen and staff notifications |
| Status | Email ready, SMS provider **Requires Clarification** |

### 4.2 Email Service (Resend)

#### 4.2.1 Send Email

| Attribute | Value |
|-----------|-------|
| Provider | Resend |
| Endpoint | Internal edge function |
| Auth Required | Yes (API Key in secrets) |

**Request:**
```json
{
  "notification_id": "uuid",
  "channel": "email",
  "recipient": {
    "email": "citizen@example.com",
    "name": "Jan Jansen"
  },
  "template": "case_status_update",
  "template_data": {
    "case_reference": "GA-20240115-0042",
    "new_status": "approved",
    "action_required": false,
    "message": "Your application has been approved."
  },
  "priority": "normal",
  "language": "nl"
}
```

**Success Response:**
```json
{
  "sent": true,
  "notification_id": "uuid",
  "provider_id": "resend-msg-12345",
  "sent_at": "2024-01-15T10:30:00Z"
}
```

**Failure Response:**
```json
{
  "sent": false,
  "notification_id": "uuid",
  "error": {
    "code": "INVALID_EMAIL",
    "message": "Email address is invalid"
  }
}
```

#### 4.2.2 Email Templates

| Template ID | Purpose | Variables |
|-------------|---------|-----------|
| case_status_update | Case status changed | case_reference, new_status, message |
| document_required | Missing documents | case_reference, documents[], deadline |
| payment_processed | Payment confirmation | case_reference, amount, payment_date |
| application_received | New application confirmation | case_reference, service_type |
| eligibility_result | Eligibility determination | case_reference, result, next_steps |

### 4.3 SMS Service (TBD)

#### 4.3.1 Send SMS

| Attribute | Value |
|-----------|-------|
| Provider | **Requires Clarification** |
| Endpoint | Internal edge function |
| Auth Required | Yes |

**Request:**
```json
{
  "notification_id": "uuid",
  "channel": "sms",
  "recipient": {
    "phone": "+597-8123456",
    "name": "Jan Jansen"
  },
  "template": "status_update_short",
  "template_data": {
    "case_reference": "GA-0042",
    "status": "goedgekeurd"
  },
  "priority": "normal"
}
```

**Success Response:**
```json
{
  "sent": true,
  "notification_id": "uuid",
  "provider_id": "sms-12345",
  "sent_at": "2024-01-15T10:30:00Z"
}
```

#### 4.3.2 SMS Templates

| Template ID | Purpose | Max Length |
|-------------|---------|------------|
| status_update_short | Brief status notification | 160 chars |
| appointment_reminder | Appointment notification | 160 chars |
| payment_alert | Payment processed | 160 chars |

### 4.4 Portal Notifications

#### 4.4.1 Create Portal Notification

| Attribute | Value |
|-----------|-------|
| Storage | portal_notifications table |
| Delivery | Real-time via Supabase Realtime |

**Internal Record:**
```json
{
  "id": "uuid",
  "citizen_id": "uuid",
  "title": "Aanvraag Goedgekeurd",
  "message": "Uw aanvraag GA-20240115-0042 is goedgekeurd.",
  "type": "info",
  "read": false,
  "action_url": "/cases/GA-20240115-0042",
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Notification Types:**
| Type | Icon | Priority |
|------|------|----------|
| info | ℹ️ | Normal |
| success | ✅ | Normal |
| warning | ⚠️ | High |
| error | ❌ | High |
| action_required | 🔔 | High |

### 4.5 Retry Logic (All Channels)

| Channel | Max Retries | Backoff | Fallback |
|---------|-------------|---------|----------|
| Email | 3 | Exponential (1s, 2s, 4s) | Log, portal notification |
| SMS | 3 | Exponential (5s, 10s, 20s) | Email fallback |
| Portal | 5 | Exponential (100ms, 200ms, 400ms, 800ms, 1600ms) | Log error |

### 4.6 Delivery Priority

| Priority | Description | Retry Urgency |
|----------|-------------|---------------|
| critical | Security alerts, system failures | Immediate, max retries |
| high | Action required, deadlines | Within 5 minutes |
| normal | Status updates, confirmations | Within 1 hour |
| low | Informational, newsletters | Within 24 hours |

---

## 5. Integration Health Monitoring

### 5.1 Health Check Requirements

Each integration MUST support:

| Check | Frequency | Timeout | Alert Threshold |
|-------|-----------|---------|-----------------|
| BIS connectivity | 5 minutes | 10 seconds | 3 consecutive failures |
| Subema connectivity | 5 minutes | 10 seconds | 3 consecutive failures |
| Email delivery | 15 minutes | 30 seconds | 5 consecutive failures |
| SMS delivery | 15 minutes | 30 seconds | 5 consecutive failures |

### 5.2 Circuit Breaker Pattern

When integration failures exceed threshold:

| State | Behavior |
|-------|----------|
| CLOSED | Normal operation, requests pass through |
| OPEN | All requests fail immediately, queue locally |
| HALF-OPEN | Limited requests to test recovery |

**State Transitions:**
- CLOSED → OPEN: 5 failures in 1 minute
- OPEN → HALF-OPEN: After 30 seconds
- HALF-OPEN → CLOSED: 3 successful requests
- HALF-OPEN → OPEN: 1 failure

---

## 6. Security Requirements

### 6.1 Credential Management

| Integration | Credential Type | Storage |
|-------------|-----------------|---------|
| BIS | API Key + Certificate | Supabase Secrets |
| Subema | OAuth2 Client Credentials | Supabase Secrets |
| Email (Resend) | API Key | Supabase Secrets |
| SMS (TBD) | API Key | Supabase Secrets |

### 6.2 Data Protection

| Requirement | Implementation |
|-------------|----------------|
| TLS 1.2+ | All external API calls |
| Request signing | Where supported by provider |
| PII masking in logs | national_id, bank_account, phone |
| Audit logging | All integration calls logged |

---

## 7. Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Phase 6 | System | Initial specification |

---

## 8. Open Items

| Item | Type | Owner | Status |
|------|------|-------|--------|
| BIS API specification | Technical | Ministry of Home Affairs | Blocked |
| Subema API specification | Technical | Ministry of Finance | Blocked |
| SMS provider selection | Decision | IT Department | Requires Clarification |
| OAuth2 implementation details | Technical | Subema vendor | Requires Clarification |
