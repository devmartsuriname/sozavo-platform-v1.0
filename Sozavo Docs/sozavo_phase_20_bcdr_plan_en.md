# SoZaVo Central Social Services Platform – Phase 20 (Business Continuity & Disaster Recovery Plan)

> **Status:** Phase 20 – Business Continuity & Disaster Recovery (BCDR) Blueprint  
> **Prepared for:** Ministry of Social Affairs & Housing (SoZaVo)  
> **Prepared by:** Devmart Suriname  
> **Scope:** Operational continuity, outage handling, disaster scenarios, recovery procedures, fallback operations, communication protocols  
> **Related Docs:** Technical Architecture v2, Phase 15 Governance, Phase 16 Infrastructure Scaling, Phase 17 Go-Live Framework

---

# 1. Purpose of Phase 20
Phase 20 establishes the **Business Continuity & Disaster Recovery (BCDR)** framework required for the SoZaVo Social Services Platform to continue delivering essential services even under technical failure, cyber incidents, or infrastructure outages.

This plan ensures:
- Mission‑critical workflows continue during disruptions
- The platform can recover rapidly and safely
- No loss of citizen data or payment data
- Clear responsibilities and escalation procedures
- Compliance with government digital resilience standards

---

# 2. Continuity Principles
1. **Zero Data Loss** (RPO = 0–5 minutes)  
2. **Rapid Recovery** (RTO = 15 min for critical services, 2 hours full platform)  
3. **Clear Fallback Modes** (manual intake, offline workflows)  
4. **Transparent Communication**  
5. **Auditability** during and after incidents  
6. **Resilience Over Convenience** — continuity takes priority over non‑critical features

---

# 3. System Criticality Levels
Define the criticality of each module:

| Module | Criticality | RTO | Notes |
|--------|-------------|-----|-------|
| Authentication | Critical | 15 min | Required for admin & portal access |
| CCR / Cases | Critical | 15 min | Must be restored immediately |
| Payments | Critical | 1 hour | Must avoid double payments |
| Eligibility Engine | High | 2 hours | Degraded mode possible |
| Fraud Engine | Medium | 4 hours | Can be temporarily disabled |
| Reporting | Low | 24 hours | Non-essential during disaster |
| Messaging/Notifications | Medium | 4 hours | Email fallback allowed |

---

# 4. Disaster Scenarios & Response Actions

## 4.1 Scenario A – Supabase Outage (Database Unavailable)
**Impact:** Platform fully or partially unusable.

**Continuity Actions:**
- Switch to read replica (if available)
- Activate offline intake forms for districts
- Freeze payment operations

**Recovery Actions:**
- Wait for Supabase uptime restoration
- Validate integrity with PITR checks
- Re-enable payment engine

---

## 4.2 Scenario B – VPS / Frontend Outage
**Impact:** Portal or Admin UI inaccessible.

**Continuity Actions:**
- Activate static fallback page with instructions
- Redirect citizens to hotline
- District offices continue using offline forms

**Recovery Actions:**
- Switch to secondary VPS node
- Re-deploy frontend

---

## 4.3 Scenario C – BIS / Subema Down
**Impact:** Identity verification & income verification disrupted.

**Continuity Actions:**
- Allow manual identity capture
- Queue verification to run later
- Mark cases as “Verification Pending”

**Recovery Actions:**
- Retry verification tasks in queue
- Update cases automatically

---

## 4.4 Scenario D – Payment System Failure (Bank Rejects Files)
**Impact:** Payments blocked, delayed, or mismatched.

**Continuity Actions:**
- Freeze batch generation
- Notify Finance Unit
- Activate reconciliation mode

**Recovery Actions:**
- Regenerate batch using backup dataset
- Re-upload to bank

---

## 4.5 Scenario E – Cyberattack / Security Breach
**Impact:** Potential data compromise.

**Continuity Actions:**
- Immediate SEV‑1 incident declaration
- Revoke privileged access
- Force logout of all users
- Activate read-only mode

**Recovery Actions:**
- Full forensic audit
- Patch vulnerabilities
- Restore system from clean snapshot
- Update passwords & keys

---

## 4.6 Scenario F – Data Corruption
**Impact:** CCR, cases, payments may contain invalid data.

**Continuity Actions:**
- Freeze affected module
- Trigger PITR restoration into isolated environment

**Recovery Actions:**
- Compare corruption window
- Select clean restore point
- Re-deploy database

---

# 5. Business Continuity Modes

## 5.1 Degraded Mode (Limited Functionality)
Used when one or more engines fail.

Examples:
- Fraud engine disabled temporarily
- Eligibility evaluated in queue rather than live

## 5.2 Manual Offline Mode
Used by district offices when:
- Database/portal is down
- Internet outage in district

Tools:
- Printable intake forms
- Local spreadsheet templates
- Later uploading into portal once restored

## 5.3 Read-Only Recovery Mode
Used during cyber incidents or corruption review.

Only viewing allowed:
- CCR
- Cases
- Documents
- Payments

No write operations.

---

# 6. Backup, Retention & Recovery Strategy

## 6.1 Database Backups
- Automated daily backups
- PITR enabled (point-in-time recovery)
- 30-day PITR retention

## 6.2 Storage Backups
- Weekly storage snapshots
- Redundant object replication

## 6.3 Application Snapshots
- Pre-release snapshots for each deployment

## 6.4 Recovery Procedure (Database)
```
Trigger Restore → Validate snapshot → Redirect services → Unlock operations
```

## 6.5 Recovery Procedure (Documents)
- Restore missing documents from cold storage
- Check hash integrity

---

# 7. Communication Protocols During Outages

## 7.1 Internal (SoZaVo + Devmart)
- SEV‑1 alert sent via WhatsApp + email
- Update every 30 minutes
- Lead: SoZaVo IT Director
- Devmart escalates to engineers

## 7.2 External (District Offices)
- Notify supervisors immediately
- Provide fallback intake instructions
- Share expected resolution timeline

## 7.3 Citizens
Displayed on portal:
```
“We are currently experiencing technical issues. Your data is safe. Please try again later.”
```

---

# 8. Recovery Time Objective (RTO) & Recovery Point Objective (RPO)

| Module | RTO | RPO |
|--------|-----|------|
| CCR / Cases | 15 min | < 5 min |
| Authentication | 15 min | < 5 min |
| Payments | 1 hour | < 5 min |
| Wizard + Intake | 2 hours | < 5 min |
| Reporting | 24 hours | < 1 hour |
| Fraud Engine | 4 hours | < 1 hour |
| Notifications | 4 hours | < 1 hour |

---

# 9. Post‑Disaster Validation Procedures
After recovery, the system must:
- Validate data integrity
- Re-run eligibility for pending cases
- Re-sync all queued BIS/Subema operations
- Re-run fraud engine for cases affected by missing data
- Regenerate governance reports
- Document full incident timeline

---

# 10. Annual BCDR Testing
SoZaVo & Devmart will simulate disasters yearly:
- Database outage drill
- Storage corruption drill
- Cyberattack tabletop exercise
- Payment export failure simulation
- Red-only mode switch test

All results are documented and reviewed by DSSC.

---

# 11. Completion Criteria – Phase 20

### Continuity:
- [ ] Offline intake workflow approved
- [ ] Degraded mode rules documented
- [ ] Communication protocols verified

### Disaster Recovery:
- [ ] Backup & PITR strategy validated
- [ ] Recovery procedures tested
- [ ] RTO/RPO targets achieved

### Governance:
- [ ] DSSC approval of BCDR policy
- [ ] Annual testing policy adopted

After Phase 20, Lovable MUST await explicit approval for Phase 21 (Public Portal UI Blueprint).

---

**END OF PHASE 20 – BUSINESS CONTINUITY & DISASTER RECOVERY PLAN (ENGLISH)**

