# SoZaVo Platform v1.0 – Task Breakdown

> **Version:** 1.0 (Consolidated)  
> **Status:** Reference Document  
> **Source:** Synthesized from all Phase Documents (1–29)

---

## Task Legend

| Priority | Meaning |
|----------|---------|
| **MUST** | Required for phase completion |
| **SHOULD** | Important but not blocking |
| **COULD** | Nice-to-have, defer if needed |

| Layer | Meaning |
|-------|---------|
| **DB** | Database schema/migrations |
| **BE** | Backend logic/edge functions |
| **INT** | External integrations |
| **PROC** | Process/workflow logic |
| **SEC** | Security implementation |
| **DATA** | Data operations/queries |

---

## Phase 1: Supabase Database Foundation

| Task ID | Description | Layer | Priority | Dependencies | External Validation |
|---------|-------------|-------|----------|--------------|---------------------|
| P1-001 | Create `service_types` table | DB | MUST | None | No |
| P1-002 | Create `offices` table with district references | DB | MUST | None | No |
| P1-003 | Create `citizens` table with CCR fields | DB | MUST | None | No |
| P1-004 | Create `users` table with role enum | DB | MUST | None | No |
| P1-005 | Create `cases` table with FK relationships | DB | MUST | P1-001, P1-003, P1-004 | No |
| P1-006 | Create `case_events` table for audit trail | DB | MUST | P1-005 | No |
| P1-007 | Create `documents` table | DB | MUST | P1-005 | No |
| P1-008 | Create `eligibility_rules` table | DB | MUST | P1-001 | No |
| P1-009 | Create `eligibility_evaluations` table | DB | MUST | P1-005 | No |
| P1-010 | Create `document_requirements` table | DB | MUST | P1-001 | No |
| P1-011 | Create `workflow_definitions` table | DB | MUST | P1-001 | No |
| P1-012 | Create `payments` table | DB | MUST | P1-005 | No |
| P1-013 | Create `notifications` table | DB | MUST | P1-004 | No |
| P1-014 | Create all required enums | DB | MUST | None | No |
| P1-015 | Create database indexes | DB | MUST | All tables | No |
| P1-016 | Insert seed data for service_types | DATA | MUST | P1-001 | No |
| P1-017 | Insert seed data for offices | DATA | MUST | P1-002 | No |
| P1-018 | Insert seed data for workflow_definitions | DATA | MUST | P1-011 | No |
| P1-019 | Insert seed data for eligibility_rules | DATA | MUST | P1-008 | No |
| P1-020 | Generate schema report | DB | SHOULD | All above | No |

---

## Phase 2: Admin UI Base Foundation

| Task ID | Description | Layer | Priority | Dependencies | External Validation |
|---------|-------------|-------|----------|--------------|---------------------|
| P2-001 | Set up Supabase client integration | BE | MUST | Phase 1 | No |
| P2-002 | Create base type definitions | BE | MUST | Phase 1 | No |
| P2-003 | Implement authentication context | BE | MUST | P2-001 | No |
| P2-004 | Create case query functions | DATA | MUST | P2-001 | No |
| P2-005 | Create citizen query functions | DATA | MUST | P2-001 | No |
| P2-006 | Create document query functions | DATA | MUST | P2-001 | No |

---

## Phase 3: Intake Wizard & CCR

| Task ID | Description | Layer | Priority | Dependencies | External Validation |
|---------|-------------|-------|----------|--------------|---------------------|
| P3-001 | Implement wizard state management | BE | MUST | Phase 2 | No |
| P3-002 | Implement citizen identification step | PROC | MUST | P3-001 | No |
| P3-003 | Implement CCR lookup function | DATA | MUST | P2-005 | BIS field mapping |
| P3-004 | Implement CCR create/update function | DATA | MUST | P2-005 | No |
| P3-005 | Implement personal info step | PROC | MUST | P3-001 | No |
| P3-006 | Implement address step | PROC | MUST | P3-001 | No |
| P3-007 | Implement household composition step | PROC | MUST | P3-001 | No |
| P3-008 | Implement financial info step | PROC | MUST | P3-001 | No |
| P3-009 | Implement document requirements step | PROC | MUST | P3-001 | No |
| P3-010 | Implement summary/confirmation step | PROC | MUST | P3-001 | No |
| P3-011 | Store wizard data in cases.wizard_data | DATA | MUST | P3-001 | No |
| P3-012 | Create case on wizard completion | DATA | MUST | All above | No |
| P3-013 | Log case_event for case creation | DATA | MUST | P3-012 | No |
| P3-014 | Validate step navigation rules | PROC | SHOULD | P3-001 | No |
| P3-015 | Implement step progress indicator | PROC | SHOULD | P3-001 | No |

---

## Phase 4: Case Handling Workspaces

| Task ID | Description | Layer | Priority | Dependencies | External Validation |
|---------|-------------|-------|----------|--------------|---------------------|
| P4-001 | Create workflow engine module | PROC | MUST | Phase 3 | No |
| P4-002 | Implement status transition validation | PROC | MUST | P4-001 | No |
| P4-003 | Implement transition execution | PROC | MUST | P4-001 | No |
| P4-004 | Log transitions to case_events | DATA | MUST | P4-003 | No |
| P4-005 | Create case detail query with joins | DATA | MUST | Phase 2 | No |
| P4-006 | Implement case assignment logic | PROC | MUST | P4-001 | No |
| P4-007 | Create reviewer queue query | DATA | MUST | Phase 2 | No |
| P4-008 | Implement approve case action | PROC | MUST | P4-001 | No |
| P4-009 | Implement reject case action | PROC | MUST | P4-001 | No |
| P4-010 | Implement case locking after decision | PROC | MUST | P4-008, P4-009 | No |
| P4-011 | Create case list query with filters | DATA | SHOULD | Phase 2 | No |
| P4-012 | Implement case search | DATA | SHOULD | Phase 2 | No |

---

## Phase 5: Document Management

| Task ID | Description | Layer | Priority | Dependencies | External Validation |
|---------|-------------|-------|----------|--------------|---------------------|
| P5-001 | Create document validation engine | PROC | MUST | Phase 4 | No |
| P5-002 | Implement required documents check | PROC | MUST | P5-001 | No |
| P5-003 | Implement document expiration check | PROC | MUST | P5-001 | No |
| P5-004 | Generate missing documents list | PROC | MUST | P5-001 | No |
| P5-005 | Create document upload function | DATA | MUST | Phase 2 | No |
| P5-006 | Configure storage bucket policies | SEC | MUST | P5-005 | No |
| P5-007 | Implement document verification action | PROC | MUST | P5-001 | No |
| P5-008 | Implement document rejection action | PROC | MUST | P5-001 | No |
| P5-009 | Log document events | DATA | SHOULD | P5-007, P5-008 | No |

---

## Phase 6: Review, Reporting & Dashboards

| Task ID | Description | Layer | Priority | Dependencies | External Validation |
|---------|-------------|-------|----------|--------------|---------------------|
| P6-001 | Implement reviewer decision panel logic | PROC | MUST | Phase 4 | No |
| P6-002 | Create getCaseStats query | DATA | MUST | Phase 2 | No |
| P6-003 | Create getCasesByStatus query | DATA | MUST | Phase 2 | No |
| P6-004 | Create getCasesByServiceType query | DATA | MUST | Phase 2 | No |
| P6-005 | Create getAvgProcessingTime query | DATA | MUST | Phase 2 | No |
| P6-006 | Create monthly service report query | DATA | MUST | Phase 2 | No |
| P6-007 | Create district performance report query | DATA | MUST | Phase 2 | No |
| P6-008 | Create eligibility outcomes report query | DATA | MUST | Phase 2 | No |
| P6-009 | Implement CSV export function | BE | MUST | P6-006, P6-007, P6-008 | No |
| P6-010 | Create case timeline query | DATA | SHOULD | Phase 2 | No |
| P6-011 | Implement report pagination | DATA | SHOULD | P6-006 | No |

---

## Phase 7: Security & RLS

| Task ID | Description | Layer | Priority | Dependencies | External Validation |
|---------|-------------|-------|----------|--------------|---------------------|
| P7-001 | Enable RLS on citizens table | SEC | MUST | Phase 1 | No |
| P7-002 | Enable RLS on cases table | SEC | MUST | Phase 1 | No |
| P7-003 | Enable RLS on documents table | SEC | MUST | Phase 1 | No |
| P7-004 | Enable RLS on eligibility_evaluations | SEC | MUST | Phase 1 | No |
| P7-005 | Enable RLS on payments table | SEC | MUST | Phase 1 | No |
| P7-006 | Enable RLS on case_events table | SEC | MUST | Phase 1 | No |
| P7-007 | Create get_user_context function | SEC | MUST | None | No |
| P7-008 | Create citizens SELECT policies | SEC | MUST | P7-001, P7-007 | No |
| P7-009 | Create cases SELECT policies | SEC | MUST | P7-002, P7-007 | No |
| P7-010 | Create cases UPDATE policies | SEC | MUST | P7-002, P7-007 | No |
| P7-011 | Create documents policies | SEC | MUST | P7-003, P7-007 | No |
| P7-012 | Create secure query wrapper | BE | MUST | P7-007 | No |
| P7-013 | Update all queries to use wrapper | BE | MUST | P7-012 | No |
| P7-014 | Create security test functions | SEC | SHOULD | All above | No |

---

## Phase 8: Public Portal Foundation

| Task ID | Description | Layer | Priority | Dependencies | External Validation |
|---------|-------------|-------|----------|--------------|---------------------|
| P8-001 | Create portal authentication flow | BE | MUST | Phase 7 | No |
| P8-002 | Create citizen registration function | BE | MUST | P8-001 | No |
| P8-003 | Create citizen login function | BE | MUST | P8-001 | No |
| P8-004 | Create portal-specific queries | DATA | MUST | Phase 2 | No |
| P8-005 | Implement portal wizard logic | PROC | MUST | Phase 3 | No |
| P8-006 | Create portal document upload | DATA | MUST | Phase 5 | No |
| P8-007 | Create portal_notifications table | DB | MUST | Phase 1 | No |
| P8-008 | Implement portal notification insert | DATA | MUST | P8-007 | No |
| P8-009 | Create status label mapping | DATA | MUST | None | No |
| P8-010 | Implement application status query | DATA | MUST | P8-004 | No |

---

## Phase 9: Extended Eligibility Engine

| Task ID | Description | Layer | Priority | Dependencies | External Validation |
|---------|-------------|-------|----------|--------------|---------------------|
| P9-001 | Implement income threshold rule | PROC | MUST | Phase 4 | No |
| P9-002 | Implement age range rule | PROC | MUST | Phase 4 | No |
| P9-003 | Implement household composition rule | PROC | MUST | Phase 4 | No |
| P9-004 | Implement document presence rule | PROC | MUST | Phase 5 | No |
| P9-005 | Implement residency rule | PROC | MUST | Phase 4 | No |
| P9-006 | Create rule evaluation pipeline | PROC | MUST | P9-001 to P9-005 | No |
| P9-007 | Store evaluation results | DATA | MUST | P9-006 | No |
| P9-008 | Implement manual override function | PROC | MUST | P9-007 | No |

---

## Phase 10: Payment Processing

| Task ID | Description | Layer | Priority | Dependencies | External Validation |
|---------|-------------|-------|----------|--------------|---------------------|
| P10-001 | Create payment creation function | DATA | MUST | Phase 4 | No |
| P10-002 | Implement payment schedule logic | PROC | MUST | P10-001 | No |
| P10-003 | Create payment status update function | DATA | MUST | P10-001 | No |
| P10-004 | Create payment queries | DATA | MUST | Phase 2 | No |
| P10-005 | Implement payment adjustment logic | PROC | SHOULD | P10-001 | No |

---

## Phase 11: BIS Integration

| Task ID | Description | Layer | Priority | Dependencies | External Validation |
|---------|-------------|-------|----------|--------------|---------------------|
| P11-001 | Create bis-lookup edge function | INT | MUST | Phase 2 | **BIS API specs** |
| P11-002 | Implement BIS field mapping | INT | MUST | P11-001 | **BIS API specs** |
| P11-003 | Create CCR update from BIS data | DATA | MUST | P11-002 | No |
| P11-004 | Implement BIS lookup error handling | INT | MUST | P11-001 | No |
| P11-005 | Store BIS_API_KEY secret | SEC | MUST | None | **BIS credentials** |
| P11-006 | Log BIS lookup events | DATA | SHOULD | P11-001 | No |

---

## Phase 12: Subema Integration

| Task ID | Description | Layer | Priority | Dependencies | External Validation |
|---------|-------------|-------|----------|--------------|---------------------|
| P12-001 | Create subema-sync edge function | INT | MUST | Phase 10 | **Subema API specs** |
| P12-002 | Implement payment batch submission | INT | MUST | P12-001 | **Subema API specs** |
| P12-003 | Implement payment status sync | INT | MUST | P12-001 | **Subema API specs** |
| P12-004 | Handle sync failures | INT | MUST | P12-001 | No |
| P12-005 | Store SUBEMA_API_KEY secret | SEC | MUST | None | **Subema credentials** |
| P12-006 | Create payment sync scheduler | BE | SHOULD | P12-001 | No |

---

## Phase 13: Advanced Notifications

| Task ID | Description | Layer | Priority | Dependencies | External Validation |
|---------|-------------|-------|----------|--------------|---------------------|
| P13-001 | Create notification edge function | BE | MUST | Phase 8 | No |
| P13-002 | Implement email notification | INT | MUST | P13-001 | **Email service** |
| P13-003 | Implement SMS notification | INT | COULD | P13-001 | **SMS service** |
| P13-004 | Create notification templates | DATA | MUST | P13-001 | No |
| P13-005 | Store RESEND_API_KEY secret | SEC | MUST | None | **Resend credentials** |

---

## Phase 14: Fraud Detection

| Task ID | Description | Layer | Priority | Dependencies | External Validation |
|---------|-------------|-------|----------|--------------|---------------------|
| P14-001 | Create fraud detection engine | PROC | MUST | Phase 9 | No |
| P14-002 | Implement duplicate application check | PROC | MUST | P14-001 | No |
| P14-003 | Implement income discrepancy check | PROC | MUST | P14-001 | No |
| P14-004 | Create fraud alert function | DATA | MUST | P14-001 | No |
| P14-005 | Log fraud detection events | DATA | MUST | P14-004 | No |

---

## Phase 15: Audit Module

| Task ID | Description | Layer | Priority | Dependencies | External Validation |
|---------|-------------|-------|----------|--------------|---------------------|
| P15-001 | Create audit trail queries | DATA | MUST | Phase 6 | No |
| P15-002 | Implement audit report generation | DATA | MUST | P15-001 | No |
| P15-003 | Create audit log archive function | DATA | SHOULD | P15-001 | No |
| P15-004 | Implement compliance report | DATA | MUST | P15-001 | **Legal requirements** |

---

## Phase 16: Performance Optimization

| Task ID | Description | Layer | Priority | Dependencies | External Validation |
|---------|-------------|-------|----------|--------------|---------------------|
| P16-001 | Create materialized views for reports | DB | SHOULD | Phase 6 | No |
| P16-002 | Implement query result caching | BE | SHOULD | Phase 2 | No |
| P16-003 | Optimize report queries | DATA | MUST | Phase 6 | No |
| P16-004 | Implement background job processing | BE | COULD | Phase 12 | No |

---

## Phase 17: Extended Workflow Automation

| Task ID | Description | Layer | Priority | Dependencies | External Validation |
|---------|-------------|-------|----------|--------------|---------------------|
| P17-001 | Implement workflow triggers | PROC | MUST | Phase 4 | No |
| P17-002 | Create auto-assignment rules | PROC | SHOULD | P17-001 | No |
| P17-003 | Implement SLA monitoring | PROC | SHOULD | P17-001 | No |
| P17-004 | Create escalation rules | PROC | COULD | P17-001 | No |

---

## Phases 18–29: Strategic Phases

These phases are documented at high level; detailed task breakdown pending.

| Phase | Focus Area | Status |
|-------|------------|--------|
| 18 | Multi-language support | Future |
| 19 | Mobile optimization | Future |
| 20 | Predictive analytics | Future |
| 21 | System monitoring | Future |
| 22 | Disaster recovery | Future |
| 23 | Advanced reporting | Future |
| 25 | Inter-ministry integration | Future |
| 26 | Citizen identity verification | Future |
| 27 | Appeals workflow | Future |
| 28 | Batch processing | Future |
| 29 | API gateway | Future |

---

## External Validation Requirements

| Dependency | Required For | Contact/Source |
|------------|--------------|----------------|
| BIS API specifications | Phase 11 | Ministry of Home Affairs |
| BIS API credentials | Phase 11 | Ministry of Home Affairs |
| Subema API specifications | Phase 12 | Subema vendor |
| Subema API credentials | Phase 12 | Subema vendor |
| Email service credentials | Phase 13 | Resend.com |
| SMS service contract | Phase 13 | TBD |
| Legal data retention rules | Phase 15 | Legal department |
| GDPR/privacy requirements | Phase 15 | Legal department |

---

## Task Dependencies Graph (Simplified)

```
Phase 1 (DB) 
    │
    ▼
Phase 2 (Queries) ──────────────────────────────┐
    │                                           │
    ▼                                           ▼
Phase 3 (Wizard) ──────────────────────> Phase 8 (Portal)
    │
    ▼
Phase 4 (Workflow) ─────────────────────────────┐
    │                                           │
    ├──────────────────┐                        │
    ▼                  ▼                        ▼
Phase 5 (Docs)    Phase 6 (Reports)    Phase 9 (Eligibility)
    │                  │                        │
    │                  │                        │
    ▼                  ▼                        ▼
Phase 7 (RLS) ◄────────┴────────────────────────┘
    │
    ▼
Phase 10 (Payments)
    │
    ├──────────────────┐
    ▼                  ▼
Phase 11 (BIS)    Phase 12 (Subema)
    │                  │
    └─────────┬────────┘
              ▼
       Phase 13+ (Extended)
```

---

**END OF CONSOLIDATED TASK BREAKDOWN v1.0**
