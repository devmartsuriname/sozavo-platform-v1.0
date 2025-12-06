# SoZaVo Platform v1.0 – Test Scenario Suite

> **Version:** 1.0  
> **Phase:** 6 – Engine Runtime Assembly  
> **Status:** Dry-Run Scenarios (Non-Executable)  
> **Cross-References:** Engine-Orchestration-Plan.md, Service-Layer-Specification.md

---

## 1. Overview

This document defines dry-run test scenarios for validating engine behavior and orchestration. These are specification-level scenarios, NOT executable tests.

---

## 2. Scenario 1: Valid Case Intake

### 2.1 Scenario Description

A citizen successfully completes the intake wizard for General Assistance, BIS verification succeeds, and the case is created with initial fraud screening.

### 2.2 Input

```json
{
  "scenario_id": "INTAKE-001",
  "scenario_name": "Valid Case Intake - General Assistance",
  "input": {
    "wizard_data": {
      "step_1_identification": {
        "national_id": "123456789",
        "first_name": "Maria",
        "last_name": "Jansen"
      },
      "step_2_personal": {
        "date_of_birth": "1985-03-15",
        "gender": "female",
        "marital_status": "married"
      },
      "step_3_address": {
        "street": "Kernkampweg 42",
        "district": "Paramaribo"
      },
      "step_4_household": {
        "household_size": 4,
        "dependents_under_18": 2
      },
      "step_5_income": {
        "total_monthly_income": 2500.00,
        "income_sources": [
          {
            "type": "employment",
            "amount": 2500.00
          }
        ]
      }
    },
    "service_type": "general_assistance",
    "intake_channel": "portal",
    "intake_office_id": "uuid-paramaribo-main"
  },
  "preconditions": {
    "citizen_exists": false,
    "bis_available": true,
    "bis_citizen_found": true
  }
}
```

### 2.3 Expected Engine Sequence

| Step | Engine | Action | Duration |
|------|--------|--------|----------|
| 1 | Wizard Engine | Validate and store wizard_data | 50ms |
| 2 | BIS Lookup | Query citizen by national_id | 2s |
| 3 | DAL | Create citizen record | 20ms |
| 4 | DAL | Create case record | 20ms |
| 5 | Fraud Engine | Initial screening | 100ms |
| 6 | Workflow Engine | Set status to 'intake' | 10ms |
| 7 | Notification Engine | Send confirmation (portal, email) | 500ms |

### 2.4 Expected Outputs

```json
{
  "expected_outputs": {
    "citizen_created": {
      "national_id": "123456789",
      "first_name": "Maria",
      "last_name": "Jansen",
      "bis_verified": true,
      "bis_verified_at": "2024-01-15T10:30:00Z"
    },
    "case_created": {
      "case_reference": "GA-20240115-XXXX",
      "service_type": "general_assistance",
      "current_status": "intake",
      "fraud_risk_level": "LOW"
    },
    "fraud_screening": {
      "risk_score": 10,
      "risk_level": "LOW",
      "signals_detected": []
    },
    "notifications_sent": [
      {
        "type": "application_received",
        "channel": "portal",
        "status": "delivered"
      },
      {
        "type": "application_received",
        "channel": "email",
        "status": "sent"
      }
    ]
  }
}
```

### 2.5 Expected Errors/Warnings

```json
{
  "expected_errors": [],
  "expected_warnings": []
}
```

---

## 3. Scenario 2: Invalid Case (Missing Data)

### 3.1 Scenario Description

A citizen attempts to submit an incomplete wizard with missing required fields. The system rejects the submission with validation errors.

### 3.2 Input

```json
{
  "scenario_id": "INTAKE-002",
  "scenario_name": "Invalid Case Intake - Missing Required Data",
  "input": {
    "wizard_data": {
      "step_1_identification": {
        "national_id": "123456789",
        "first_name": "Jan"
        // last_name MISSING
      },
      "step_2_personal": {
        "date_of_birth": "1985-03-15"
        // gender, marital_status MISSING
      },
      "step_3_address": {
        // street MISSING
        "district": "Paramaribo"
      }
      // step_4_household MISSING
      // step_5_income MISSING
    },
    "service_type": "general_assistance"
  },
  "preconditions": {
    "citizen_exists": false
  }
}
```

### 3.3 Expected Engine Sequence

| Step | Engine | Action | Duration |
|------|--------|--------|----------|
| 1 | Wizard Engine | Validate wizard_data | 20ms |
| 2 | Wizard Engine | Return validation errors | 5ms |

### 3.4 Expected Outputs

```json
{
  "expected_outputs": {
    "citizen_created": null,
    "case_created": null,
    "wizard_status": "validation_failed",
    "validation_errors": [
      {
        "field": "step_1_identification.last_name",
        "error": "REQUIRED_FIELD_MISSING",
        "message": "Last name is required"
      },
      {
        "field": "step_3_address.street",
        "error": "REQUIRED_FIELD_MISSING",
        "message": "Street address is required"
      },
      {
        "field": "step_4_household",
        "error": "REQUIRED_STEP_INCOMPLETE",
        "message": "Household information is required"
      },
      {
        "field": "step_5_income",
        "error": "REQUIRED_STEP_INCOMPLETE",
        "message": "Income information is required"
      }
    ]
  }
}
```

### 3.5 Expected Errors/Warnings

```json
{
  "expected_errors": [
    {
      "code": "WIZARD_VALIDATION_FAILED",
      "severity": "ERROR",
      "user_visible": true
    }
  ],
  "expected_warnings": []
}
```

---

## 4. Scenario 3: BIS Unavailable

### 4.1 Scenario Description

Citizen submits a valid application, but BIS system is unavailable. System proceeds with fallback behavior.

### 4.2 Input

```json
{
  "scenario_id": "INTEGRATION-001",
  "scenario_name": "BIS System Unavailable",
  "input": {
    "wizard_data": {
      "step_1_identification": {
        "national_id": "123456789",
        "first_name": "Jan",
        "last_name": "Bakker"
      },
      "step_2_personal": {
        "date_of_birth": "1990-06-20",
        "gender": "male"
      },
      "step_3_address": {
        "street": "Waterkant 10",
        "district": "Paramaribo"
      },
      "step_4_household": {
        "household_size": 1
      },
      "step_5_income": {
        "total_monthly_income": 1800.00
      }
    },
    "service_type": "general_assistance"
  },
  "preconditions": {
    "citizen_exists": false,
    "bis_available": false,
    "bis_response": "CONNECTION_TIMEOUT"
  }
}
```

### 4.3 Expected Engine Sequence

| Step | Engine | Action | Duration |
|------|--------|--------|----------|
| 1 | Wizard Engine | Validate and store wizard_data | 50ms |
| 2 | BIS Lookup | Attempt query (retry 1) | 10s (timeout) |
| 3 | BIS Lookup | Attempt query (retry 2) | 10s (timeout) |
| 4 | BIS Lookup | Attempt query (retry 3) | 10s (timeout) |
| 5 | BIS Lookup | Mark as unverified | 5ms |
| 6 | DAL | Create citizen record (unverified) | 20ms |
| 7 | DAL | Create case record | 20ms |
| 8 | Fraud Engine | Initial screening (elevated) | 100ms |
| 9 | Workflow Engine | Set status to 'intake' | 10ms |
| 10 | Notification Engine | Notify handler (verification needed) | 500ms |

### 4.4 Expected Outputs

```json
{
  "expected_outputs": {
    "citizen_created": {
      "national_id": "123456789",
      "first_name": "Jan",
      "last_name": "Bakker",
      "bis_verified": false,
      "bis_verified_at": null,
      "verification_pending": true
    },
    "case_created": {
      "case_reference": "GA-20240115-XXXX",
      "current_status": "intake",
      "flags": ["PENDING_BIS_VERIFICATION"]
    },
    "fraud_screening": {
      "risk_score": 25,
      "risk_level": "LOW",
      "signals_detected": [
        {
          "signal_type": "UNVERIFIED_IDENTITY",
          "severity": "LOW",
          "weight": 15
        }
      ]
    },
    "notifications_sent": [
      {
        "type": "verification_required",
        "recipient_type": "handler",
        "channel": "internal"
      }
    ]
  }
}
```

### 4.5 Expected Errors/Warnings

```json
{
  "expected_errors": [],
  "expected_warnings": [
    {
      "code": "BIS_UNAVAILABLE",
      "severity": "WARNING",
      "message": "BIS verification failed - manual verification required",
      "recovery_action": "FLAGGED_FOR_MANUAL_VERIFICATION"
    }
  ]
}
```

---

## 5. Scenario 4: Subema Unavailable

### 5.1 Scenario Description

Payment batch is ready for submission, but Subema system is unavailable. System queues payments for retry.

### 5.2 Input

```json
{
  "scenario_id": "INTEGRATION-002",
  "scenario_name": "Subema System Unavailable",
  "input": {
    "batch": {
      "batch_id": "uuid-batch-001",
      "batch_reference": "BATCH-20240115-001",
      "payment_count": 50,
      "total_amount": 75000.00
    },
    "payments": [
      {
        "payment_id": "uuid-pay-001",
        "case_id": "uuid-case-001",
        "amount": 1500.00,
        "citizen_national_id": "123456789"
      }
      // ... 49 more payments
    ]
  },
  "preconditions": {
    "subema_available": false,
    "subema_response": "SERVICE_UNAVAILABLE"
  }
}
```

### 5.3 Expected Engine Sequence

| Step | Engine | Action | Duration |
|------|--------|--------|----------|
| 1 | Payment Engine | Prepare batch submission | 100ms |
| 2 | Subema Sync | Attempt submission (retry 1) | 30s (timeout) |
| 3 | Subema Sync | Attempt submission (retry 2) | 60s (wait + timeout) |
| 4 | Subema Sync | Attempt submission (retry 3) | 120s (wait + timeout) |
| 5 | Subema Sync | Queue for later retry | 10ms |
| 6 | Notification Engine | Alert finance team | 500ms |

### 5.4 Expected Outputs

```json
{
  "expected_outputs": {
    "batch_status": "queued_for_retry",
    "payments_status": "pending",
    "retry_scheduled_at": "2024-01-15T11:00:00Z",
    "notifications_sent": [
      {
        "type": "subema_unavailable",
        "recipient_role": "finance_officer",
        "channel": "internal",
        "priority": "HIGH"
      }
    ]
  }
}
```

### 5.5 Expected Errors/Warnings

```json
{
  "expected_errors": [],
  "expected_warnings": [
    {
      "code": "SUBEMA_UNAVAILABLE",
      "severity": "WARNING",
      "message": "Subema system unavailable - payments queued for retry",
      "retry_count": 0,
      "max_retries": 5
    }
  ]
}
```

---

## 6. Scenario 5: Eligibility Borderline

### 6.1 Scenario Description

Citizen's income is exactly at the eligibility threshold, testing boundary condition handling.

### 6.2 Input

```json
{
  "scenario_id": "ELIGIBILITY-001",
  "scenario_name": "Eligibility Borderline - Exact Threshold",
  "input": {
    "case_id": "uuid-case-borderline",
    "service_type": "general_assistance",
    "citizen_data": {
      "national_id": "987654321",
      "age": 35,
      "district": "Paramaribo"
    },
    "income_data": {
      "total_monthly_income": 20000.00
    },
    "household_data": {
      "household_size": 3
    }
  },
  "preconditions": {
    "eligibility_rules": {
      "GA_INCOME_MAX_20000": {
        "threshold": 20000.00,
        "operator": "less_than_or_equal"
      }
    }
  }
}
```

### 6.3 Expected Engine Sequence

| Step | Engine | Action | Duration |
|------|--------|--------|----------|
| 1 | Eligibility Engine | Load runtime context | 20ms |
| 2 | Eligibility Engine | Evaluate GA_INCOME_MAX_20000 | 10ms |
| 3 | Eligibility Engine | Evaluate GA_RESIDENCY_REQUIRED | 5ms |
| 4 | Eligibility Engine | Evaluate GA_MIN_AGE_18 | 5ms |
| 5 | Eligibility Engine | Calculate final result | 5ms |
| 6 | DAL | Store evaluation record | 20ms |
| 7 | Workflow Engine | Transition to eligibility_check | 10ms |

### 6.4 Expected Outputs

```json
{
  "expected_outputs": {
    "evaluation_result": "ELIGIBLE",
    "criteria_results": [
      {
        "rule_id": "GA_INCOME_MAX_20000",
        "passed": true,
        "actual_value": 20000.00,
        "threshold_value": 20000.00,
        "operator": "less_than_or_equal",
        "note": "Exactly at threshold - PASS"
      },
      {
        "rule_id": "GA_RESIDENCY_REQUIRED",
        "passed": true
      },
      {
        "rule_id": "GA_MIN_AGE_18",
        "passed": true,
        "actual_value": 35
      }
    ],
    "flags": ["BORDERLINE_INCOME"]
  }
}
```

### 6.5 Expected Errors/Warnings

```json
{
  "expected_errors": [],
  "expected_warnings": [
    {
      "code": "BORDERLINE_ELIGIBILITY",
      "severity": "INFO",
      "message": "Income exactly at threshold - may require review if income increases",
      "field": "total_monthly_income",
      "value": 20000.00
    }
  ]
}
```

---

## 7. Scenario 6: Payment Formula Edge Case

### 7.1 Scenario Description

Payment calculation results in amount exceeding maximum cap, testing cap enforcement.

### 7.2 Input

```json
{
  "scenario_id": "PAYMENT-001",
  "scenario_name": "Payment Cap Enforcement",
  "input": {
    "case_id": "uuid-case-largefamily",
    "service_type": "general_assistance",
    "citizen_data": {
      "national_id": "111222333"
    },
    "household_data": {
      "household_size": 10,
      "dependents_count": 8
    },
    "income_data": {
      "total_monthly_income": 500.00
    }
  },
  "preconditions": {
    "payment_formula": {
      "base_amount": 800.00,
      "per_dependent": 150.00,
      "max_amount": 2500.00,
      "min_amount": 200.00
    }
  }
}
```

### 7.3 Expected Engine Sequence

| Step | Engine | Action | Duration |
|------|--------|--------|----------|
| 1 | Payment Engine | Load formula configuration | 10ms |
| 2 | Payment Engine | Calculate base amount | 5ms |
| 3 | Payment Engine | Calculate dependent supplement | 5ms |
| 4 | Payment Engine | Apply income deduction | 5ms |
| 5 | Payment Engine | Enforce maximum cap | 5ms |
| 6 | DAL | Store payment record | 20ms |

### 7.4 Expected Outputs

```json
{
  "expected_outputs": {
    "payment_calculation": {
      "base_amount": 800.00,
      "dependent_supplement": 1200.00,
      "subtotal_before_cap": 2000.00,
      "income_deduction": 0.00,
      "subtotal_after_deduction": 2000.00,
      "cap_applied": false,
      "final_amount": 2000.00
    },
    "payment_record": {
      "amount": 2000.00,
      "currency": "SRD",
      "calculation_notes": "8 dependents × SRD 150 = SRD 1,200 supplement"
    }
  }
}
```

### 7.5 Expected Errors/Warnings

```json
{
  "expected_errors": [],
  "expected_warnings": []
}
```

---

## 8. Scenario 7: Fraud Signal Triggering

### 8.1 Scenario Description

Multiple fraud signals are detected, triggering HIGH risk classification and automatic escalation.

### 8.2 Input

```json
{
  "scenario_id": "FRAUD-001",
  "scenario_name": "Multiple Fraud Signals - High Risk",
  "input": {
    "case_id": "uuid-case-suspicious",
    "citizen_id": "uuid-citizen-suspicious",
    "citizen_data": {
      "national_id": "555666777",
      "address": "Nieuwe Straat 1",
      "address_changed_at": "2024-01-10T00:00:00Z"
    },
    "historical_data": {
      "previous_applications": [
        {
          "case_reference": "GA-20231201-0100",
          "status": "rejected",
          "rejection_reason": "FRAUD_SUSPECTED",
          "created_at": "2023-12-01T00:00:00Z"
        },
        {
          "case_reference": "SA-20231215-0050",
          "status": "rejected",
          "rejection_reason": "INCOMPLETE_DOCUMENTATION",
          "created_at": "2023-12-15T00:00:00Z"
        }
      ],
      "other_cases_at_address": [
        {
          "case_reference": "GA-20240110-0020",
          "citizen_national_id": "555666778",
          "relationship": "unknown"
        }
      ]
    }
  },
  "preconditions": {
    "fraud_thresholds": {
      "LOW": 30,
      "MEDIUM": 50,
      "HIGH": 70,
      "CRITICAL": 90
    }
  }
}
```

### 8.3 Expected Engine Sequence

| Step | Engine | Action | Duration |
|------|--------|--------|----------|
| 1 | Fraud Engine | Collect signals | 50ms |
| 2 | Fraud Engine | Detect RAPID_REAPPLICATION | 10ms |
| 3 | Fraud Engine | Detect PREVIOUS_FRAUD_FLAG | 10ms |
| 4 | Fraud Engine | Detect DUPLICATE_ADDRESS | 10ms |
| 5 | Fraud Engine | Detect RECENT_ADDRESS_CHANGE | 10ms |
| 6 | Fraud Engine | Calculate total score | 20ms |
| 7 | Fraud Engine | Classify risk level | 5ms |
| 8 | DAL | Store fraud signals | 30ms |
| 9 | DAL | Store risk score | 20ms |
| 10 | Workflow Engine | Apply automatic hold | 10ms |
| 11 | Notification Engine | Alert fraud officer | 500ms |
| 12 | Notification Engine | Alert supervisor | 500ms |

### 8.4 Expected Outputs

```json
{
  "expected_outputs": {
    "fraud_analysis": {
      "signals_detected": [
        {
          "signal_type": "RAPID_REAPPLICATION",
          "severity": "MEDIUM",
          "weight": 20,
          "details": "2 applications in last 60 days"
        },
        {
          "signal_type": "PREVIOUS_FRAUD_FLAG",
          "severity": "HIGH",
          "weight": 35,
          "details": "Previous case rejected for FRAUD_SUSPECTED"
        },
        {
          "signal_type": "DUPLICATE_ADDRESS",
          "severity": "HIGH",
          "weight": 25,
          "details": "Another active case at same address"
        },
        {
          "signal_type": "RECENT_ADDRESS_CHANGE",
          "severity": "LOW",
          "weight": 10,
          "details": "Address changed within last 30 days"
        }
      ],
      "total_score": 90,
      "risk_level": "CRITICAL"
    },
    "auto_actions_taken": [
      "CASE_HOLD_APPLIED",
      "FRAUD_OFFICER_NOTIFIED",
      "SUPERVISOR_NOTIFIED",
      "PAYMENT_BLOCKED"
    ],
    "case_status": "on_hold",
    "case_flags": ["FRAUD_INVESTIGATION_REQUIRED"]
  }
}
```

### 8.5 Expected Errors/Warnings

```json
{
  "expected_errors": [],
  "expected_warnings": [
    {
      "code": "CRITICAL_FRAUD_RISK",
      "severity": "CRITICAL",
      "message": "Critical fraud risk detected - case automatically held for investigation",
      "recommended_action": "IMMEDIATE_FRAUD_INVESTIGATION"
    }
  ]
}
```

---

## 9. Scenario 8: Workflow Transition Failure

### 9.1 Scenario Description

User attempts an invalid workflow transition. System rejects and returns allowed transitions.

### 9.2 Input

```json
{
  "scenario_id": "WORKFLOW-001",
  "scenario_name": "Invalid Workflow Transition",
  "input": {
    "case_id": "uuid-case-workflow",
    "current_status": "intake",
    "requested_transition": "approved",
    "actor": {
      "user_id": "uuid-user-handler",
      "role": "case_handler"
    }
  },
  "preconditions": {
    "valid_transitions_from_intake": ["validation", "on_hold"],
    "documents_verified": false,
    "eligibility_evaluated": false
  }
}
```

### 9.3 Expected Engine Sequence

| Step | Engine | Action | Duration |
|------|--------|--------|----------|
| 1 | Workflow Engine | Load current state | 10ms |
| 2 | Workflow Engine | Validate requested transition | 5ms |
| 3 | Workflow Engine | Check transition allowed | 5ms |
| 4 | Workflow Engine | Reject transition | 5ms |
| 5 | Workflow Engine | Return allowed transitions | 10ms |

### 9.4 Expected Outputs

```json
{
  "expected_outputs": {
    "transition_result": {
      "success": false,
      "error_code": "INVALID_TRANSITION",
      "message": "Cannot transition from 'intake' to 'approved'"
    },
    "current_status": "intake",
    "allowed_transitions": [
      {
        "to_status": "validation",
        "label": "Submit for Validation",
        "requirements": ["All wizard steps complete"],
        "available": true
      },
      {
        "to_status": "on_hold",
        "label": "Put on Hold",
        "requirements": ["Hold reason required"],
        "available": true
      }
    ],
    "blocked_transitions": [
      {
        "to_status": "approved",
        "label": "Approve",
        "requirements": [
          "Documents verified",
          "Eligibility evaluated",
          "Under review status"
        ],
        "blocking_requirements": [
          "Documents verified",
          "Eligibility evaluated",
          "Under review status"
        ]
      }
    ]
  }
}
```

### 9.5 Expected Errors/Warnings

```json
{
  "expected_errors": [
    {
      "code": "INVALID_TRANSITION",
      "severity": "ERROR",
      "message": "Transition from 'intake' to 'approved' is not allowed",
      "user_visible": true
    }
  ],
  "expected_warnings": []
}
```

---

## 10. Scenario Summary Matrix

| Scenario ID | Type | Expected Result | Critical Paths Tested |
|-------------|------|-----------------|----------------------|
| INTAKE-001 | Happy Path | Success | Wizard, BIS, Citizen, Case, Fraud, Notification |
| INTAKE-002 | Validation | Failure | Wizard validation |
| INTEGRATION-001 | Integration Failure | Degraded Success | BIS fallback, manual verification flag |
| INTEGRATION-002 | Integration Failure | Queued | Subema retry, finance notification |
| ELIGIBILITY-001 | Boundary | Success (borderline) | Threshold comparison, flags |
| PAYMENT-001 | Calculation | Success | Formula, cap enforcement |
| FRAUD-001 | Detection | Alert | Signal detection, scoring, escalation |
| WORKFLOW-001 | Invalid Action | Rejection | Transition validation, guard conditions |

---

## 11. Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Phase 6 | System | Initial scenario suite |
