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

## Tasks Requiring External Validation

This section identifies all tasks that cannot progress without external stakeholder input. Each task is classified with blocking factors, risk levels, and required clarifications.

### Classification Tags Legend

| Tag | Meaning |
|-----|---------|
| `critical-path` | Blocks downstream phases |
| `external-risk` | Depends on external party response time |
| `gov-decision` | Requires government/ministry decision |
| `blocked-by-legal` | Requires legal/compliance approval |
| `infra-dependency` | Requires infrastructure decisions |

---

### BIS Validation Blockers

| Task Name | Phase | Layer | Blocking Reason | Blocking Stakeholder | Priority | Risk Level | Notes | Tags |
|-----------|-------|-------|-----------------|----------------------|----------|------------|-------|------|
| Create bis-lookup edge function | P11 | INT | BIS API endpoint URL unknown | Ministry of Home Affairs | MUST | Critical | Cannot implement without API specs | `critical-path`, `external-risk` |
| Implement BIS field mapping | P11 | INT | Field names assumed, not confirmed | Ministry of Home Affairs | MUST | Critical | Current mapping uses `persoonsnummer`, `voornamen`, `achternaam`, `geboortedatum`, `adres` - all require validation | `critical-path`, `external-risk` |
| Store BIS_API_KEY secret | P11 | SEC | Credentials not provided | Ministry of Home Affairs | MUST | Critical | Cannot test integration without credentials | `external-risk` |
| Implement CCR lookup function | P3 | DATA | BIS field `persoonsnummer` format unknown | Ministry of Home Affairs | MUST | High | Lookup logic depends on ID format | `external-risk` |
| Create households table with BIS fields | P1 | DB | `bis_household_id` field name assumed | Ministry of Home Affairs | SHOULD | Medium | May require schema change if field differs | `external-risk` |
| Implement residency rule | P9 | PROC | `country_of_residence` field availability uncertain | Ministry of Home Affairs | MUST | Medium | Eligibility rule depends on this field | `gov-decision` |

**Required Clarifications for BIS:**
1. Confirm exact API endpoint URL and authentication method (API key, OAuth, certificate)
2. Confirm all field names in API response payload
3. Confirm data availability (household composition, income data)
4. Confirm rate limits and SLA guarantees
5. Provide sandbox/test environment credentials

---

### Subema Validation Blockers

| Task Name | Phase | Layer | Blocking Reason | Blocking Stakeholder | Priority | Risk Level | Notes | Tags |
|-----------|-------|-------|-----------------|----------------------|----------|------------|-------|------|
| Create subema-sync edge function | P12 | INT | Subema API specifications unknown | Subema vendor | MUST | Critical | Cannot implement without API docs | `critical-path`, `external-risk` |
| Implement payment batch submission | P12 | INT | Batch submission payload format unknown | Subema vendor | MUST | Critical | Assumed fields may be incorrect | `critical-path`, `external-risk` |
| Implement payment status sync | P12 | INT | Status codes and callback mechanism unknown | Subema vendor | MUST | Critical | Don't know if push or poll model | `external-risk` |
| Store SUBEMA_API_KEY secret | P12 | SEC | Credentials not provided | Subema vendor | MUST | Critical | Cannot test integration | `external-risk` |
| Create `subema_reference` field | P10 | DB | Response field name assumed | Subema vendor | MUST | Medium | Field may need renaming | `external-risk` |
| Create payment sync scheduler | P12 | BE | Sync frequency requirements unknown | Subema vendor | SHOULD | Medium | Depends on API rate limits | `external-risk` |

**Required Clarifications for Subema:**
1. Confirm API documentation location and version
2. Confirm authentication method and credential format
3. Confirm payment submission payload structure
4. Confirm status callback mechanism (webhook vs polling)
5. Confirm batch size limits and processing times
6. Provide test environment access

---

### Legal/Compliance Blockers

| Task Name | Phase | Layer | Blocking Reason | Blocking Stakeholder | Priority | Risk Level | Notes | Tags |
|-----------|-------|-------|-----------------|----------------------|----------|------------|-------|------|
| Implement compliance report | P15 | DATA | Data retention requirements unknown | Legal department | MUST | High | Cannot design archive logic without retention rules | `blocked-by-legal`, `gov-decision` |
| Create audit log archive function | P15 | DATA | Archive requirements unclear | Legal department | SHOULD | Medium | How long to keep, where to store | `blocked-by-legal` |
| Implement citizen consent tracking | P8 | PROC | Consent policy not defined | Legal department | MUST | High | Portal registration requires consent flow | `blocked-by-legal`, `critical-path` |
| Define data deletion policy | P1 | DB | Soft delete vs hard delete not decided | Legal department | SHOULD | High | Affects schema design (deleted_at columns) | `blocked-by-legal` |

**Required Clarifications for Legal:**
1. Minimum data retention period (assumed 7 years, needs confirmation)
2. Audit trail requirements for compliance reporting
3. Citizen consent requirements for data processing
4. Right to deletion/erasure policy
5. Cross-border data transfer restrictions (if any)

---

### Ministerial Decision Blockers

| Task Name | Phase | Layer | Blocking Reason | Blocking Stakeholder | Priority | Risk Level | Notes | Tags |
|-----------|-------|-------|-----------------|----------------------|----------|------------|-------|------|
| Implement income threshold rule | P9 | PROC | Threshold amounts not confirmed | Ministry of Social Affairs | MUST | High | Current values are placeholders | `gov-decision`, `critical-path` |
| Implement age range rule | P9 | PROC | Age limits per service type not confirmed | Ministry of Social Affairs | MUST | High | Kinderbijslag age limits assumed | `gov-decision` |
| Implement household composition rule | P9 | PROC | Household size limits not confirmed | Ministry of Social Affairs | MUST | Medium | Maximum household members for benefits | `gov-decision` |
| Define payment amounts | P10 | DATA | Benefit formulas not specified | Ministry of Social Affairs | MUST | Critical | Cannot calculate payments without formulas | `gov-decision`, `critical-path` |
| Create manual override function | P9 | PROC | Override authorization policy unclear | Ministry of Social Affairs | MUST | Medium | Who can override, under what conditions | `gov-decision` |
| Implement SMS notification | P13 | INT | SMS as official channel not confirmed | Ministry of Social Affairs | COULD | Low | Budget and policy decision | `gov-decision`, `infra-dependency` |

**Required Clarifications for Ministry:**
1. Confirm eligibility thresholds for all three services (AB, FB, KB)
2. Confirm benefit calculation formulas
3. Confirm manual override authorization policy
4. Confirm official communication channels (email, SMS, postal)
5. Confirm multi-district user assignment rules

---

### Technical/Infrastructure Blockers

| Task Name | Phase | Layer | Blocking Reason | Blocking Stakeholder | Priority | Risk Level | Notes | Tags |
|-----------|-------|-------|-----------------|----------------------|----------|------------|-------|------|
| Implement background job processing | P16 | BE | Supabase tier/plan not decided | Project management | COULD | Medium | Edge function limits affect design | `infra-dependency` |
| Create materialized views for reports | P16 | DB | Database tier affects capabilities | Project management | SHOULD | Medium | Some features require higher tier | `infra-dependency` |
| Implement real-time subscriptions | P8 | BE | Realtime connection limits unknown | Project management | SHOULD | Medium | Concurrent citizen connections | `infra-dependency` |
| Configure disaster recovery | P22 | BE | Backup infrastructure budget unknown | Project management | MUST | Critical | Strategic phase blocked | `infra-dependency`, `critical-path` |
| Store RESEND_API_KEY secret | P13 | SEC | Email service provider not contracted | Project management | MUST | Medium | Assumed Resend, may change | `infra-dependency` |

**Required Clarifications for Infrastructure:**
1. Confirm Supabase pricing tier (Free, Pro, Enterprise)
2. Confirm email service provider (Resend, SendGrid, other)
3. Confirm SMS service provider (if SMS required)
4. Confirm backup and DR budget allocation
5. Confirm expected concurrent user load

---

### Blocked Tasks Summary

| Category | Total Tasks | Critical | High | Medium | Low |
|----------|-------------|----------|------|--------|-----|
| BIS Validation | 6 | 3 | 1 | 2 | 0 |
| Subema Validation | 6 | 4 | 0 | 2 | 0 |
| Legal/Compliance | 4 | 0 | 3 | 1 | 0 |
| Ministerial Decisions | 6 | 2 | 2 | 2 | 0 |
| Infrastructure | 5 | 1 | 0 | 4 | 0 |
| **TOTAL** | **27** | **10** | **6** | **11** | **0** |

### Critical Path Blockers (Must Resolve Before MVP)

1. **BIS API Specifications** → Blocks Phases 3, 11, and CCR functionality
2. **Subema API Specifications** → Blocks Phases 10, 12, and payment processing
3. **Eligibility Thresholds** → Blocks Phase 9 rule implementation
4. **Benefit Formulas** → Blocks Phase 10 payment calculation
5. **Legal Data Retention** → Blocks Phase 15 compliance reporting

---

### Recommended Validation Timeline

| Week | Action | Stakeholder |
|------|--------|-------------|
| 1 | Submit BIS API documentation request | Ministry of Home Affairs |
| 1 | Submit Subema API documentation request | Subema vendor |
| 2 | Schedule eligibility rules workshop | Ministry of Social Affairs |
| 2 | Submit data retention policy inquiry | Legal department |
| 3 | Confirm infrastructure budget | Project management |
| 4 | Review responses, escalate blockers | All |

---

## Cross-Referenced Blockers

This section links each blocked task to PRD requirements, architecture components, and data dictionary tables for traceability.

### BIS Validation Blockers – Cross-References

| Task Name | PRD Requirement | Architecture Component | Data Dictionary Table | Impact Level |
|-----------|-----------------|------------------------|----------------------|--------------|
| Create bis-lookup edge function | PRD-INT-001 (BIS Integration) | Section 5.1 (BIS Integration) | citizens, households | `blocks-MVP` |
| Implement BIS field mapping | PRD-INT-002 (Field Mapping) | Section 5.1 (Field Mapping) | citizens (national_id, bis_person_id, first_name, last_name, date_of_birth, address) | `blocks-MVP` |
| Store BIS_API_KEY secret | PRD-SEC-003 (Secrets Management) | Section 4 (Security Architecture) | N/A | `blocks-MVP` |
| Implement CCR lookup function | PRD-CORE-005 (Citizen Registry) | Section 3.1 (Core Data Model) | citizens | `blocks-MVP` |
| Create households table with BIS fields | PRD-DATA-007 (Household Data) | Section 3.1 (Core Data Model) | households | `blocks-Fraud` |
| Implement residency rule | PRD-ELIG-003 (Residency Check) | Section 6.3 (Eligibility Engine) | citizens, eligibility_rules | `blocks-MVP` |

### Subema Validation Blockers – Cross-References

| Task Name | PRD Requirement | Architecture Component | Data Dictionary Table | Impact Level |
|-----------|-----------------|------------------------|----------------------|--------------|
| Create subema-sync edge function | PRD-INT-010 (Payment Processing) | Section 5.2 (Subema Integration) | payments, subema_sync_logs | `blocks-Payments` |
| Implement payment batch submission | PRD-PAY-002 (Batch Payments) | Section 5.2 (Sync Operations) | payment_batches, payment_items | `blocks-Payments` |
| Implement payment status sync | PRD-PAY-003 (Status Tracking) | Section 5.2 (Subema Integration) | payments, subema_sync_logs | `blocks-Payments` |
| Store SUBEMA_API_KEY secret | PRD-SEC-004 (Secrets Management) | Section 4 (Security Architecture) | N/A | `blocks-Payments` |
| Create `subema_reference` field | PRD-PAY-001 (Payment Records) | Section 3.1 (Core Data Model) | payments | `blocks-Payments` |
| Create payment sync scheduler | PRD-PAY-004 (Automated Sync) | Section 5.2 (Subema Integration) | subema_sync_logs | `blocks-Go-Live` |

### Legal/Compliance Blockers – Cross-References

| Task Name | PRD Requirement | Architecture Component | Data Dictionary Table | Impact Level |
|-----------|-----------------|------------------------|----------------------|--------------|
| Implement compliance report | PRD-AUD-001 (Audit Trail) | Section 9.1 (Logging & Audit) | audit_events, case_events | `blocks-Go-Live` |
| Create audit log archive function | PRD-AUD-002 (Data Retention) | Section 9.1 (Logging & Audit) | audit_events | `blocks-Go-Live` |
| Implement citizen consent tracking | PRD-PRT-005 (Portal Consent) | Section 2.1 (Public Portal) | citizens, portal_notifications | `blocks-Public-Portal` |
| Define data deletion policy | PRD-SEC-010 (Data Management) | Section 10.1 (Constraints) | All tables | `blocks-Go-Live` |

### Ministerial Decision Blockers – Cross-References

| Task Name | PRD Requirement | Architecture Component | Data Dictionary Table | Impact Level |
|-----------|-----------------|------------------------|----------------------|--------------|
| Implement income threshold rule | PRD-ELIG-001 (Eligibility Rules) | Section 6.3 (Eligibility Engine) | eligibility_rules, incomes | `blocks-MVP` |
| Implement age range rule | PRD-ELIG-002 (Age Requirements) | Section 6.3 (Eligibility Engine) | eligibility_rules, citizens | `blocks-MVP` |
| Implement household composition rule | PRD-ELIG-004 (Household Rules) | Section 6.3 (Eligibility Engine) | eligibility_rules, households | `blocks-MVP` |
| Define payment amounts | PRD-PAY-005 (Benefit Amounts) | Section 7.4 (Payment Flow) | payments | `blocks-Payments` |
| Create manual override function | PRD-ELIG-010 (Override Logic) | Section 6.3 (Eligibility Engine) | eligibility_evaluations | `blocks-MVP` |
| Implement SMS notification | PRD-NOT-003 (SMS Channel) | Section 5 (Integration Architecture) | notifications | `blocks-Go-Live` |

### Technical/Infrastructure Blockers – Cross-References

| Task Name | PRD Requirement | Architecture Component | Data Dictionary Table | Impact Level |
|-----------|-----------------|------------------------|----------------------|--------------|
| Implement background job processing | PRD-PERF-001 (Performance) | Section 9.3 (Performance) | N/A | `blocks-Go-Live` |
| Create materialized views for reports | PRD-REP-005 (Report Performance) | Section 9.3 (Performance) | N/A | `blocks-Go-Live` |
| Implement real-time subscriptions | PRD-PRT-010 (Live Updates) | Section 2.2 (Backend Services) | N/A | `blocks-Public-Portal` |
| Configure disaster recovery | PRD-OPS-001 (Operations) | Section 8.1 (Environment Structure) | N/A | `blocks-Go-Live` |
| Store RESEND_API_KEY secret | PRD-NOT-001 (Email Notifications) | Section 4 (Security Architecture) | N/A | `blocks-Go-Live` |

---

## Impact Labels Summary

| Impact Level | Description | Affected Phases | Task Count |
|--------------|-------------|-----------------|------------|
| `blocks-MVP` | Prevents MVP launch | Phases 1–9 | 10 |
| `blocks-Payments` | Prevents payment processing | Phases 10, 12 | 6 |
| `blocks-Fraud` | Prevents fraud detection | Phase 14 | 1 |
| `blocks-Public-Portal` | Prevents citizen self-service | Phase 8 | 2 |
| `blocks-Go-Live` | Prevents production deployment | All | 8 |

---

## Unresolved Policy Questions

This section extracts policy decisions from eligibility rules, payments, fraud detection, and governance that require Ministry or legal approval.

### Eligibility Policy Questions

| Question ID | Policy Question | Blocking Phase | Required Stakeholder | Current Assumption | Risk |
|-------------|-----------------|----------------|---------------------|-------------------|------|
| POL-ELG-001 | What is the maximum monthly income threshold for General Assistance (AB)? | P9 | Ministry of Social Affairs | SRD 2,500 (placeholder) | High |
| POL-ELG-002 | What is the maximum monthly income threshold for Social Assistance (FB)? | P9 | Ministry of Social Affairs | SRD 3,000 (placeholder) | High |
| POL-ELG-003 | What is the maximum monthly income threshold for Child Allowance (KB)? | P9 | Ministry of Social Affairs | SRD 4,000 (placeholder) | High |
| POL-ELG-004 | What is the minimum age for General Assistance applicants? | P9 | Ministry of Social Affairs | 18 years | Medium |
| POL-ELG-005 | What is the maximum age for Child Allowance eligibility (child's age)? | P9 | Ministry of Social Affairs | 18 years | Medium |
| POL-ELG-006 | What is the maximum number of dependents for benefit calculation? | P9 | Ministry of Social Affairs | No limit assumed | Low |
| POL-ELG-007 | Is Suriname residency mandatory for all services? | P9 | Ministry of Social Affairs | Yes | Medium |
| POL-ELG-008 | Are concurrent benefits from multiple services allowed? | P9 | Ministry of Social Affairs | No | Medium |

### Payment Policy Questions

| Question ID | Policy Question | Blocking Phase | Required Stakeholder | Current Assumption | Risk |
|-------------|-----------------|----------------|---------------------|-------------------|------|
| POL-PAY-001 | What is the base payment amount for General Assistance? | P10 | Ministry of Social Affairs | SRD 800/month (placeholder) | Critical |
| POL-PAY-002 | What is the base payment amount for Social Assistance? | P10 | Ministry of Social Affairs | SRD 600/month (placeholder) | Critical |
| POL-PAY-003 | What is the per-child allowance amount for Child Allowance? | P10 | Ministry of Social Affairs | SRD 200/child/month (placeholder) | Critical |
| POL-PAY-004 | Are payment amounts adjusted for household size? | P10 | Ministry of Social Affairs | Yes (formula unknown) | High |
| POL-PAY-005 | What is the payment schedule (monthly, bi-weekly, etc.)? | P10 | Ministry of Social Affairs | Monthly | Medium |
| POL-PAY-006 | Are retroactive payments allowed for delayed approvals? | P10 | Ministry of Social Affairs | Yes (limit unknown) | Medium |
| POL-PAY-007 | What is the payment cutoff date each month? | P12 | Ministry of Social Affairs | 25th of month | Low |

### Fraud Detection Policy Questions

| Question ID | Policy Question | Blocking Phase | Required Stakeholder | Current Assumption | Risk |
|-------------|-----------------|----------------|---------------------|-------------------|------|
| POL-FRD-001 | What income discrepancy percentage triggers a fraud alert? | P14 | Ministry of Social Affairs | 30% variance | Medium |
| POL-FRD-002 | How should duplicate applications be handled (auto-reject or review)? | P14 | Ministry of Social Affairs | Flag for review | Medium |
| POL-FRD-003 | What risk score threshold requires mandatory manual review? | P14 | Ministry of Social Affairs | 70/100 | Medium |
| POL-FRD-004 | Should fraud signals block case progression automatically? | P14 | Ministry of Social Affairs | No (advisory only) | Low |
| POL-FRD-005 | What is the statute of limitations for fraud investigation? | P14 | Legal Department | 5 years | Medium |

### Governance Policy Questions

| Question ID | Policy Question | Blocking Phase | Required Stakeholder | Current Assumption | Risk |
|-------------|-----------------|----------------|---------------------|-------------------|------|
| POL-GOV-001 | What is the minimum data retention period for case records? | P15 | Legal Department | 7 years | High |
| POL-GOV-002 | What is the minimum data retention period for payment records? | P15 | Legal Department | 10 years | High |
| POL-GOV-003 | Are citizens entitled to request data deletion? | P15 | Legal Department | No (public records) | High |
| POL-GOV-004 | Who can authorize eligibility overrides? | P9 | Ministry of Social Affairs | Case Reviewer or above | Medium |
| POL-GOV-005 | Who can authorize payment reversals? | P12 | Ministry of Social Affairs | Department Head | Medium |
| POL-GOV-006 | What audit reports are required for compliance? | P15 | Legal Department | Undefined | High |

---

## External System Dependency Matrix

### BIS (Civil Registry) Dependencies

| Endpoint | Purpose | Required Fields | Authentication | Risk Level | Status |
|----------|---------|-----------------|----------------|------------|--------|
| `/api/person/lookup` | Citizen identity verification | `persoonsnummer`, `geboortedatum` | **Unknown** | Critical | **Unconfirmed** |
| `/api/person/details` | Full citizen data retrieval | All CCR fields | **Unknown** | Critical | **Unconfirmed** |
| `/api/household/lookup` | Household composition | `bis_household_id` | **Unknown** | High | **Unconfirmed** |
| `/api/address/verify` | Address validation | `adres`, `district` | **Unknown** | Medium | **Unconfirmed** |

**BIS Confirmation Requirements:**
1. API base URL and version
2. Authentication method (API key, OAuth 2.0, client certificate)
3. Rate limiting and quota
4. Request/response payload schemas
5. Error code definitions
6. Sandbox environment access
7. SLA and support contacts

### Subema (Payments) Dependencies

| Endpoint | Purpose | Required Fields | Authentication | Risk Level | Status |
|----------|---------|-----------------|----------------|------------|--------|
| `/api/batch/submit` | Submit payment batch | Batch reference, items array | **Unknown** | Critical | **Unconfirmed** |
| `/api/batch/status` | Query batch status | Batch reference | **Unknown** | Critical | **Unconfirmed** |
| `/api/payment/status` | Query individual payment | Payment reference | **Unknown** | High | **Unconfirmed** |
| `/api/payment/reverse` | Reverse failed payment | Payment reference, reason | **Unknown** | High | **Unconfirmed** |
| Webhook (push) | Receive status updates | N/A | **Unknown** | Medium | **Unconfirmed** |

**Subema Confirmation Requirements:**
1. API base URL and version
2. Authentication method
3. Batch size limits
4. Payment item schema
5. Status callback mechanism (webhook vs polling)
6. Processing time SLA
7. Test environment access

### Email Service Dependencies

| Provider | Purpose | Required Config | Authentication | Risk Level | Status |
|----------|---------|-----------------|----------------|------------|--------|
| Resend | Transactional emails | API key, verified domain | API Key | Medium | **Assumed** |
| SendGrid | Alternative provider | API key, sender identity | API Key | Medium | **Not Confirmed** |

**Email Confirmation Requirements:**
1. Confirm provider selection
2. Sender domain verification
3. Email template requirements
4. Daily/monthly sending limits
5. Unsubscribe/compliance requirements

### SMS Service Dependencies

| Provider | Purpose | Required Config | Authentication | Risk Level | Status |
|----------|---------|-----------------|----------------|------------|--------|
| TBD | SMS notifications | API key, sender ID | **Unknown** | Low | **Not Started** |

**SMS Confirmation Requirements:**
1. Provider selection
2. Budget allocation
3. Sender ID registration
4. Character limits
5. Delivery reporting

---

## Phase 24 Status

> **Note:** Phase 24 is intentionally reserved for Frontend HTML Template Integration.
> Implementation instructions will be provided separately with the HTML template.
> No documentation, tasks, or dependencies should be created for Phase 24 at this time.

**Status:** Reserved – Frontend HTML Template Integration (instructions will follow later)

---

**END OF CONSOLIDATED TASK BREAKDOWN v1.0**
