# SoZaVo Central Social Services Platform – Phase 27 (Citizen Communications & Transparency Framework)

> **Status:** Phase 27 – Citizen Communications & Transparency Blueprint (v1.0)  
> **Prepared for:** Ministry of Social Affairs & Housing (SoZaVo)  
> **Prepared by:** Devmart Suriname  
> **Scope:** Notification architecture, citizen communication standards, transparency rules, service expectations, public engagement policies  
> **Related Docs:** Phase 10 (Notifications Plan), Phase 18 (Public Portal UX), Phase 21 (UI Blueprint), Governance Charter, Legal & Policy Modernization (Phase 26)

---

# 1. Purpose of the Citizen Communications & Transparency Framework
This framework defines **how SoZaVo communicates with citizens**, across all channels, during:
- Benefit applications
- Eligibility checks
- Document submissions
- Decisions and payments
- Requests for additional information
- Appeals or reviews

It ensures communication is:
- **Clear** (simple language)
- **Consistent** (same structure across services)
- **Proactive** (citizens always know the next step)
- **Transparent** (real-time status + timelines)
- **Legally compliant** (aligned with Phase 26)

---

# 2. Communication Principles
1. **No citizen should ever be unsure of what to do next.**
2. **Every action must produce a corresponding notification.**
3. **Language must be simple, accessible, and mobile-friendly.**
4. **All decisions must include clear reasons.**
5. **Citizens must always have access to their case timeline.**
6. **Every message must be logged for audit and legal traceability.**

---

# 3. Notification Channels
The following channels are used based on risk and importance:

## 3.1 In‑Portal Notifications (Primary)
- Case updates
- Document status
- Eligibility results
- Payment notices

## 3.2 Email
Used for:
- Account creation & verification
- Case submission receipt
- Decision notifications
- Security alerts

## 3.3 SMS (Phase 2+)
Used for:
- High-importance alerts (approval, payment, requested documents)

## 3.4 WhatsApp (Future Phase)
- Two-way messaging for document reminders
- Automated prompts for incomplete applications

---

# 4. Notification Categories
Notifications are structured into **six categories**:

| Category | Trigger Examples |
|----------|------------------|
| **Account** | Verification, password reset |
| **Case Status** | Submitted, under review, approved, rejected |
| **Documents** | Missing files, expired documents |
| **Eligibility** | Outcome explanation, rule breakdown |
| **Payments** | Payment scheduled, processed, delayed |
| **System Alerts** | Maintenance, portal downtime |

---

# 5. Citizen Transparency Standards
Transparency is mandatory across the platform.

## 5.1 Case Timeline Requirements
Every citizen must see:
- All stages completed
- Current stage
- Estimated next step
- Who last handled the file (role only, not personal name)
- Time spent in each stage

## 5.2 Decision Transparency
Every approval or rejection must include:
- Clear explanation
- Eligibility rule outcomes
- Right to appeal
- How to correct information

## 5.3 Processing Time Transparency
Portal must publish average:
- Intake → Review time
- Review → Decision time
- Pending documents time

These must auto-update monthly.

---

# 6. Citizen Communication Templates
Standard templates ensure clarity.

## 6.1 Case Submission Confirmation
```
Your application has been submitted. We are now reviewing your information.
Case ID: {{id}}
Next Step: Document Verification
Estimated Time: 3–5 days
```

## 6.2 Missing Document Request
```
We cannot proceed with your application until the following document is uploaded:
- {{document_type}}
Please upload within 7 days to avoid delays.
```

## 6.3 Approval Notice
```
Your application for {{service_type}} has been approved.
Amount: {{amount}}
Payment Date: {{date}}
```

## 6.4 Rejection Notice (With Reasons)
```
Your application for {{service_type}} could not be approved.
Reason(s): {{eligibility_failures}}
You may correct your information and request a review.
```

## 6.5 Payment Notification
```
A payment of {{amount}} has been processed to your bank.
Transaction Date: {{date}}
```

---

# 7. Real-Time Status Indicators
Status colors:
- Blue — Submitted / In Progress
- Yellow — Pending Documents
- Orange — Needs Review
- Green — Approved
- Red — Rejected
- Grey — Closed

These must match the internal case management system.

---

# 8. Transparency Dashboard (Public Facing)
A simplified version of the Cabinet dashboard (Phase 25) should be made public.

## 8.1 Public Metrics
- Processing times (national + by district)
- Number of applications submitted monthly
- Percentage approved/rejected
- Benefit distribution stats

## 8.2 Compliance & Oversight Metrics
- Appeals submitted
- Fraud investigations (aggregated, anonymized)
- Audit findings summaries

No personal data is ever shown.

---

# 9. Accessibility Requirements for Communication
All notifications must:
- Use A1-level Dutch + optional English
- Avoid acronyms unless defined
- Use large text on mobile
- Be screen-reader friendly
- Support citizens with limited literacy

---

# 10. Citizen Support & Helpdesk Flow
Support must include:
- In‑portal guided help
- FAQ system
- Support ticket creation
- Hotline number shown on all error pages

Escalation levels:
1. Automated suggestions
2. Knowledge base
3. Live support agent (during business hours)
4. Case supervisor

---

# 11. Data Logging & Audit Requirements
Every communication must record:
- message_id
- channel used
- delivery status
- read/unread status
- associated case
- timestamp

This supports accountability and appeals.

---

# 12. Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Citizens do not read notifications | SMS reminders + bold in-portal banners |
| Misunderstanding decisions | Simple language + rule explanations |
| Notification overload | Prioritization engine + batching |
| Fraudsters intercept SMS | Encourage portal login for details + MFA |

---

# 13. Completion Criteria – Phase 27
### Communications:
- [ ] Notification templates approved
- [ ] Status colors standardized
- [ ] Email/SMS structure validated

### Transparency:
- [ ] Case timelines approved
- [ ] Decision explanation format approved
- [ ] Public dashboard requirements defined

### Governance:
- [ ] Alignment with Legal & Policy Modernization (Phase 26)
- [ ] DSSC approval

After Phase 27, Lovable MUST await explicit approval before Phase 28 (System Testing & Certification Framework).

---

**END OF PHASE 27 – CITIZEN COMMUNICATIONS & TRANSPARENCY FRAMEWORK (ENGLISH)**

