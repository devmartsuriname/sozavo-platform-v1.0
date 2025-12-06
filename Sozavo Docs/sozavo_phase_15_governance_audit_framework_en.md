# SoZaVo Central Social Services Platform – Phase 15 Plan (Governance, Data Retention & Audit Framework)

> **Status:** Implementation Blueprint – Phase 15 (Governance, Compliance & Oversight Layer)  
> **Prepared for:** Devmart Suriname – SoZaVo Platform  
> **Scope:** Governance standards, data retention policy, audit trails, compliance controls, logging architecture, access governance  
> **Related Docs:** Technical Architecture v2, RLS Policies (Phase 7), Reporting Engine (Phase 11), Payments (Phase 12), Fraud Detection (Phase 14), PRD v2

---

# 1. Purpose of Phase 15
Phase 15 establishes the **governance, oversight, and compliance framework** required for SoZaVo to operate a national-level digital social services system.

This phase ensures:
- Legal and policy alignment with Surinamese government standards
- Proper data retention and archival
- Immutable audit trails for every sensitive operation
- Full traceability from user actions to system outcomes
- Access governance across ministries and departments

This is essential for:
- Anti-fraud measures
- Internal controls
- Audits (internal & external)
- Data privacy compliance
- Accountability and transparency

---

# 2. Governance Principles

1. **Accountability by Design**  
   All critical actions must be tied to a specific authenticated user.

2. **Least Privilege Access**  
   Users only see and do what their role requires.

3. **Immutable Audit Trails**  
   Logs cannot be modified or deleted.

4. **Regulatory Compliance**  
   Align with Suriname’s digital government policies & social protections framework.

5. **Transparent Oversight**  
   Supervisors and auditors have full trace visibility.

6. **Secure Retention & Deletion**  
   Citizens’ personal data must be retained minimally and destroyed when lawful.

---

# 3. Data Retention Policy
Retention timelines must reflect social services regulations.

## 3.1 Case Data
- **Active cases:** retained indefinitely
- **Closed cases:** retain **7 years** after closure
- **Rejected applications:** retain **3 years**

## 3.2 Documents
- **Identity documents:** retained 7 years
- **Income evidence:** retained 5 years
- **Uploaded documents in portal:** retained 3 years after case closure
- **Invalid or duplicate documents:** retain 1 year

## 3.3 Financial Records
- Payment batches & payment_items: retain **10 years** (audit requirement)
- Bank export logs: retain 10 years
- Reconciliation logs: retain 10 years

## 3.4 Fraud Data
- Fraud signals + risk scores: retain 7 years
- Fraud review logs: retain 10 years

## 3.5 System Logs
- Security logs (auth events): 2 years
- Access logs: 3 years
- Error logs: 1 year

> All retention timelines configurable in Admin Settings.

---

# 4. Audit Trail Architecture

Phase 15 formalizes and expands audit logging using:

## 4.1 `audit_events` Table (New)
Tracks all critical system actions.

Fields:
- `id`
- `actor_user_id` (FK users.id or NULL if system)
- `event_type` (enum: login, case_update, eligibility_run, document_upload, payment_approval, fraud_scan, export_created, etc.)
- `entity_type` (case, citizen, document, payment_batch, rule, workflow)
- `entity_id`
- `ip_address`
- `meta` (JSONB)
- `created_at`

## 4.2 Audit Trail Requirements
Every critical action must:
- Store user identity
- Store timestamp (UTC)
- Store originating IP
- Store before/after values for sensitive fields
- Be immutable (no updates or deletes)

## 4.3 Integration Points
Events must be logged for:
- Logins, failed logins
- Case creation/updates
- Eligibility evaluations
- Document uploads, validation updates
- Messaging actions (citizen ↔ staff)
- Notifications sent
- Payment approvals, exports, feedback
- Fraud scans and risk score updates
- Admin changes to rules or settings

---

# 5. Access Governance Framework

## 5.1 Role Hierarchy
Roles grouped by privilege level:
- **Level 1:** Citizen
- **Level 2:** District Intake Officer
- **Level 3:** Case Handler
- **Level 4:** Reviewer
- **Level 5:** Department Head
- **Level 6:** Finance Officer
- **Level 7:** Audit Officer
- **Level 8:** System Admin

## 5.2 Access Governance Rules
- Role escalation requires explicit approval and logging
- Role-based dashboards only show relevant metrics
- Sensitive screens (payments, fraud) visible only to L5–L8
- User account disabling/enabling logged in audit_events

## 5.3 Delegation & Proxy Access
Optional future support:
- Temporary delegation (e.g., covering for a sick reviewer)
- Strict timeframe limits
- Logged as delegated access events

---

# 6. Compliance Controls

## 6.1 Required Controls
- Identity verification logging (portal profile linking)
- Document validation level logging
- Eligibility rule versioning (immutable)
- Workflow definition versioning
- Payment rule versioning
- Fraud model version logging

## 6.2 Data Protection Controls
- Document watermarks (optional): "Submitted to SoZaVo"
- Redaction features for sensitive documents (future)
- Encrypted storage (native Supabase encryption)

## 6.3 Policy Configuration Module
Add a new Admin Settings section:
```
Governance & Compliance
│
├── Data Retention Settings
├── Access Governance
├── Audit Log Viewer
└── Security Event Monitoring
```

---

# 7. Audit Log Viewer (Admin UI)

A new UI module for L5–L8 roles.

Features:
- Filter logs by: user, entity, event type, date
- View meta details
- Export logs (CSV/PDF)
- Drilldown from log → entity (case/document/etc.)

Security:
- Only visible to department head, audit, system admin
- No delete/edit actions allowed

---

# 8. Data Archival & Purging Workflow

Scheduled job (Supabase cron) must:
- Identify data past retention thresholds
- Archive or purge depending on type
- Log metadata into `audit_events` with event_type=`data_archived` or `data_purged`

Purging Rules:
- Safe delete must not break referential integrity
- Payments never fully purged before 10 years

Archival Options:
- Move to cold storage bucket
- Export to encrypted offsite storage (future)

---

# 9. Security Logging & Monitoring

New module:
```
src/integrations/engines/securityMonitor.ts
```

Responsibilities:
- Monitor suspicious login attempts
- Detect multiple failed logins
- Log IP-based anomalies
- Expose alerts to system admins

Future (optional):
- Integrate with SIEM (Security Information & Event Management)

---

# 10. Completion Criteria – Phase 15

### Governance Layer:
- [ ] Data retention policy implemented
- [ ] Archival and purging workflows operational
- [ ] Governance settings added to Admin UI

### Audit Layer:
- [ ] `audit_events` table created and populated consistently
- [ ] Audit Log Viewer functional
- [ ] All critical operations generate audit entries

### Access Governance:
- [ ] Role hierarchy enforced
- [ ] Sensitive modules restricted (payments, fraud)
- [ ] Delegation framework defined (optional)

### Compliance:
- [ ] Versioning of rules and workflows implemented
- [ ] Retention, protection, and privacy controls active

After Phase 15 completion, Lovable MUST await explicit approval before Phase 16 (Infrastructure Scaling, Load Performance, Caching, & High Availability).

---

**END OF PHASE 15 PLAN – GOVERNANCE, DATA RETENTION & AUDIT FRAMEWORK (ENGLISH)**

