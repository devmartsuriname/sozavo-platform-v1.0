# SoZaVo Central Social Services Platform – Phase 19 (System Governance Charter)

> **Status:** Governance Charter – Phase 19 (Institutional Oversight & Policy Framework)  
> **Prepared for:** Ministry of Social Affairs & Housing (SoZaVo)  
> **Prepared by:** Devmart Suriname  
> **Scope:** Governance roles, committees, approval workflows, change management, operational oversight, responsibility matrix  
> **Related Docs:** Phase 15 (Governance & Data Retention), Phase 17 (Go-Live Readiness), Technical Architecture v2

---

# 1. Purpose of the System Governance Charter
This charter defines **how SoZaVo governs, manages, and controls** the digital social services platform after go-live.

The charter establishes:
- Organizational roles and responsibilities
- Governance committees and decision-making structures
- Rules for system changes and updates
- Policies for security, compliance, and audits
- Escalation paths and operational accountability

This ensures the system remains **stable, secure, compliant, and continuously improved**.

---

# 2. Governance Principles
1. **Accountability:** Clear responsibility for every area of the platform.
2. **Transparency:** Decisions and changes must be logged and documented.
3. **Continuity:** System operations must not depend on individuals.
4. **Controlled Change:** No module or rule may change without governance approval.
5. **Security & Privacy First:** CCR data and case data require highest protection.
6. **Citizen-Centric:** Governance must aim to ensure consistent, fair service delivery.

---

# 3. Governance Structure
A multi-layered governance model ensures oversight at both technical and policy levels.

## 3.1 Governance Bodies

### A. **Digital Social Services Steering Committee (DSSC)**
**Composition:**
- Permanent Secretary (Chair)
- Department Heads (Social Services, Finance, Audit)
- ICT Director
- Devmart Technical Lead (Advisory)

**Responsibilities:**
- Approve major system changes
- Prioritize roadmap & new modules
- Review quarterly performance & audit results
- Approve budgets for system expansion

---

### B. **Technical Change Approval Board (TCAB)**
**Composition:**
- SoZaVo IT Lead
- Devmart Lead Engineer
- Security Officer
- Database Architect (optional)

**Responsibilities:**
- Approve schema changes
- Approve changes to eligibility, workflows, fraud models
- Approve module releases and version upgrades
- Ensure all changes follow CI/CD rules

---

### C. **Operational Review Board (ORB)**
**Composition:**
- Supervisors of District Intake
- Supervisors of Case Handling
- Finance Unit Lead
- Audit Unit Representative

**Responsibilities:**
- Identify operational issues
- Recommend improvements to DSSC
- Validate service workflows

---

# 4. Roles & Responsibilities

## 4.1 SoZaVo Leadership
- Strategic oversight of the platform
- Approval of high-impact decisions
- Public communication

## 4.2 SoZaVo IT Department
- System access management
- Infrastructure oversight
- Coordinating with Devmart for maintenance

## 4.3 Case Handling Supervisors
- Ensure correct workflow usage by staff
- Approve escalated cases
- Validate reports

## 4.4 Finance Department
- Oversee payments module
- Approve disbursement batches
- Validate reconciliation reports

## 4.5 Audit Department
- Oversight of audit trails
- Lead fraud investigations
- Ensure policy compliance

## 4.6 District Intake Offices
- First-line interaction with citizens
- Intake submissions
- Document verification

## 4.7 Devmart (Vendor)
**Responsibilities:**
- Technical maintenance & patching
- System enhancements
- Infrastructure scaling
- Critical bug fixes

**Restrictions:**
- Cannot deploy updates without TCAB approval
- Cannot modify eligibility rules without written authorization

---

# 5. Change Management Policy

## 5.1 Types of Changes
- **Emergency Fix:** Critical system outage or data issue
- **Routine Update:** UI improvements, minor bug fixes
- **Major Change:** New module, workflow change, eligibility rule modification

## 5.2 Approval Workflow
```
Request → Impact Analysis → TCAB Approval → Staging Deployment → UAT → Production Release
```

## 5.3 Version Control Rules
- Every release tagged with semantic versioning
- Eligibility rule versions immutable
- Fraud model versions traceable
- Workflow definitions versioned

## 5.4 Release Cycles
- Regular changes: monthly
- Major releases: quarterly
- Emergency fix: within 24 hours

---

# 6. Access Governance Rules

## 6.1 Role Assignment
- Must be approved by Department Head + IT unit
- Logged in audit events

## 6.2 Privilege Escalation Rules
- Time-limited
- Use-case specific
- Mandatory removal after task completion

## 6.3 Account Suspension Policy
Triggered by:
- Security incident
- Suspicious activity
- Role reassignment

Suspension must be logged.

---

# 7. Audit & Compliance Governance

## 7.1 Audit Frequency
- Internal audit: quarterly
- External audit: annually

## 7.2 Mandatory Audit Zones
- Payments
- Fraud detection
- Eligibility outcomes
- Identity linking
- Data retention compliance

## 7.3 Compliance Documentation
- RLS policy documentation
- Audit event logs
- Eligibility & workflow versions
- User access logs

---

# 8. Data Governance

## 8.1 Data Ownership
- Data belongs to SoZaVo, not Devmart
- Devmart may not extract or reuse data

## 8.2 Data Retention Enforcement
- Automatic purging per Phase 15 rules

## 8.3 Data Integrity Rules
- No manual edits in database
- Corrections only via documented workflows
- All modifications logged in audit_events

## 8.4 Data Classification
- **Highly Sensitive:** CCR, documents, payments, fraud signals
- **Sensitive:** Case history, eligibility evaluations
- **Internal:** Reports, dashboards
- **Public:** None by default

---

# 9. Incident Response Framework

## 9.1 Severity Levels
- **SEV-1:** Platform outage, corrupted data, payments blocked
- **SEV-2:** Module errors, broken workflows
- **SEV-3:** UI issues without workflow impact

## 9.2 Response Workflow
```
Detect → Log Incident → Notify IT & Devmart → Hotfix → Postmortem
```

## 9.3 Postmortem Requirements
- Root cause analysis
- Fix & prevention plan
- Timeline documentation
- Leadership review

---

# 10. Governance Reporting

Monthly summary reports include:
- System uptime
- Critical incidents
- Changes deployed
- Audit events count
- Access changes
- Fraud detection statistics
- Payment reconciliation outcomes

Reports shared with:
- DSSC
- Audit Unit
- Department Heads

---

# 11. Completion Criteria – Phase 19

### Governance Structure:
- [ ] DSSC, TCAB, ORB defined and approved
- [ ] Roles and responsibilities documented

### Policies:
- [ ] Change management process operational
- [ ] Access governance rules enforced

### Compliance:
- [ ] Audit & retention rules implemented (via Phase 15)
- [ ] Incident response plan approved

### Reporting:
- [ ] Monthly governance report template created

After Phase 19, Lovable MUST await explicit approval before Phase 20 (Business Continuity & Disaster Recovery Plan).

---

**END OF PHASE 19 – SYSTEM GOVERNANCE CHARTER (ENGLISH)**

