# SoZaVo Central Social Services Platform – Phase 17 Plan (MVP Go‑Live Readiness Framework)

> **Status:** Implementation Blueprint – Phase 17 (National Rollout Preparation Framework)  
> **Prepared for:** Devmart Suriname – SoZaVo Platform  
> **Scope:** UAT preparation, migration, training, operational readiness, launch sequencing, pilot deployment, support structure  
> **Related Docs:** Phases 1–16, Governance Framework, Technical Architecture v2, Infrastructure Scaling Blueprint

---

# 1. Purpose of Phase 17
Phase 17 prepares SoZaVo for a controlled, safe, and successful MVP go‑live.

This phase ensures:
- The system functions correctly through structured testing
- Personnel are trained and operationally ready
- Data is migrated cleanly and validated
- Support structures are established
- Risks are mitigated before national scale launch

This phase is **mandatory** before the platform is released to district offices or the public.

---

# 2. Go‑Live Philosophy

1. **Soft Launch → Pilot → Controlled Expansion → National Rollout**
2. **Zero critical defects tolerated**
3. **High‑risk workflows tested repeatedly** (payments, eligibility, fraud, documents)
4. **Training-first approach** — users must understand the system before using it
5. **Audit oversight integrated early**

---

# 3. Go‑Live Readiness Pillars
The framework consists of **six readiness pillars**:

1. **Technical Readiness**  
2. **Data Readiness**  
3. **User & Organizational Readiness**  
4. **Process Readiness**  
5. **Support Readiness**  
6. **Risk & Compliance Readiness**

Each must reach “Go” status before launch.

---

# 4. Technical Readiness

## 4.1 System Stability Verification
- Load testing results meet benchmarks
- Queue & worker performance validated
- Redis cache functioning under peak load
- Materialized views refreshing correctly
- Backups tested (restore dry-run)
- Monitoring dashboards active

## 4.2 Issue Resolution Criteria
- **No critical defects (P1)** open
- **Max 3 medium-priority (P2)** open, all with workarounds
- **Low-priority (P3)** may remain open

## 4.3 Environment Freeze Plan
- Code freeze 7 days before pilot rollout
- Security reviews completed
- Database schema locked for MVP

---

# 5. Data Readiness

## 5.1 Data Migration Checklist
- Intake offices submit initial citizen datasets (optional for MVP)
- Manual BIS lookups tested end-to-end
- Legacy spreadsheets converted to CCR format
- Duplicate detection performed
- Document uploads validated on staging

## 5.2 Data Quality Rules
- > 95% of migrated CCRs valid
- No duplicate national IDs
- No orphaned households
- No incomplete service types

## 5.3 Data Verification Workshops
Organize joint SoZaVo + Devmart sessions to:
- Validate migrated test data
- Validate eligibility rule application
- Validate payment calculation accuracy

---

# 6. User & Organizational Readiness

## 6.1 Training Program
**Three training tracks:**
1. District Intake Officers  
2. Case Handlers & Reviewers  
3. Finance, Audit & Leadership

Training format:
- Instructor-led sessions
- Hands-on environment with dummy data
- Role-specific practice scenarios

## 6.2 Training Deliverables
- Training manuals (PDF)
- Short video tutorials (optional)
- Practice environment access
- Supervisors certify team readiness

## 6.3 User Acceptance Criteria
- 80%+ of trained staff complete scenario testing
- Supervisors certify trainee competence

---

# 7. Process Readiness

## 7.1 SOP Documentation
Each workflow must have a documented SOP:
- Intake → Review → Approval → Payment
- Document upload & validation
- Eligibility evaluation
- Fraud review
- Reporting workflows
- Payment reconciliation

## 7.2 SOP Handover & Sign‑off
- Department heads sign off
- Audit department confirms compliance alignment

## 7.3 Inter‑department Process Tests
Simulate:
- District → Central Workflow
- Cross-household eligibility
- Payment batch generation
- Fraud flag escalation

---

# 8. Support Readiness

## 8.1 Support Structure
Establish L1–L3 support:
- **Level 1:** District support & intake supervisors
- **Level 2:** SoZaVo IT Unit
- **Level 3:** Devmart (technical issues)

## 8.2 Ticketing System
- Create SoZaVo ticket form or portal
- Categorization by severity (P1–P3)
- SLA definition:
  - P1: < 4 hours
  - P2: < 24 hours
  - P3: < 72 hours

## 8.3 On‑Call Rotation
- Evening/weekend rotation for launch week
- Monitoring alerts routed to responsible staff

---

# 9. Risk & Compliance Readiness

## 9.1 Risk Register
Each identified risk receives:
- Likelihood rating
- Impact rating
- Mitigation plan
- Responsible owner

Examples:
- Payment calculation errors
- Failed BIS sync
- Queue overload
- Missing user training

## 9.2 Compliance Verification
Confirm:
- Data retention configured (Phase 15)
- Audit events logging 100%
- RLS restrictions validated for each role
- Access governance approved by leadership

## 9.3 Go‑Live Gate Review
A final review held by:
- SoZaVo leadership
- IT department
- Audit officers
- Devmart team

Status options:
- **Approve**
- **Approve with conditions**
- **Delay**

---

# 10. Pilot Deployment Strategy

## 10.1 Pilot District Selection Criteria
Choose 1–2 districts with:
- High staff availability
- Strong supervision
- Moderate case volume (not extreme)

Suggested starting districts:
- Paramaribo Noord‑Oost
- Wanica

## 10.2 Pilot Scope
- Limited set of real applicants
- Full workflows enabled
- Payments disabled (test mode)
- Fraud engine in soft mode

## 10.3 Pilot Timeline
**Week 1:** Training + environment setup  
**Week 2:** Real cases intake simulation  
**Week 3:** Eligibility + review simulation  
**Week 4:** Reporting + fraud + mock payments  

## 10.4 Pilot Exit Criteria
- No critical issues detected
- Users report confidence in workflow
- Leadership signs approval for expansion

---

# 11. National Rollout Strategy

## 11.1 Sequenced Regional Rollout
Rollout 2–3 districts at a time.

## 11.2 Central Go‑Live Day Planning
- Hotline active
- Extended Devmart on-call team
- Real-time dashboard monitoring
- Rapid defect resolution

## 11.3 Post-Go‑Live Stabilization Window
For first 60 days:
- Daily monitoring
- Weekly leadership check-ins
- Strict patch control
- Performance tracking

---

# 12. Completion Criteria – Phase 17

### Technical:
- [ ] Load tests passed
- [ ] All P1 issues resolved
- [ ] Monitoring operating correctly

### Data:
- [ ] Migrations verified
- [ ] Data quality validated

### Users:
- [ ] Training completed for all roles
- [ ] UAT sign‑off achieved

### Processes:
- [ ] SOPs approved
- [ ] Cross‑department tests succeeded

### Support:
- [ ] Ticketing system active
- [ ] On‑call rotation live

### Compliance:
- [ ] Audit + RLS validated
- [ ] Go‑Live Gate Review approved

After Phase 17, Lovable MUST await explicit approval before Phase 18 (Public Portal UX Wireflow).

---

**END OF PHASE 17 PLAN – MVP GO‑LIVE READINESS FRAMEWORK (ENGLISH)**

