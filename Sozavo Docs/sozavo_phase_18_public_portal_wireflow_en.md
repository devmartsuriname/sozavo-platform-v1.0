# SoZaVo Central Social Services Platform – Phase 18 (Public Portal UX Wireflow)

> **Status:** Implementation Blueprint – Phase 18 (Citizen-Facing UX Foundation)  
> **Prepared for:** Devmart Suriname – SoZaVo Platform  
> **Scope:** UX wireflows for citizen login, identity linking, application wizard, document upload, status tracking, notifications  
> **Related Docs:** PRD v2, Technical Architecture v2, Eligibility/Wizard Engines, Phase 17 Go-Live Framework

---

# 1. Purpose of Phase 18
Phase 18 introduces the **Public Portal UX Wireflow**, defining how citizens interact with SoZaVo’s system.

This includes:
- Registration & secure login
- Identity linking (via BIS or manual intake)
- Household confirmation
- Social services application wizard
- Document uploads
- Status tracking & notifications
- Profile management

No UI design yet — **pure structural wireflow**, used for:
- UX Pilot
- Lovable UI generation
- Ministry review

---

# 2. Portal Principles
1. **Simple language, minimal steps**  
2. **Mobile-first**  
3. **Identity-first flows** (CCR link required)  
4. **Autosave at every step**  
5. **Document-lite approach** — only essential uploads  
6. **Transparent status tracking**  
7. **Accessible (WCAG 2.1 AA)**

---

# 3. High-Level User Journey
```
Landing Page → Login/Register → Identity Linking → Dashboard → Apply for Service → Wizard → Upload Documents → Review Summary → Submit → Status Tracking
```

---

# 4. Wireflow Overview (Top-Level)
1. **Landing Page**
2. **Registration / Login**
3. **Identity Verification (CCR Linking)**
4. **Household Confirmation**
5. **Citizen Dashboard**
6. **Service Selection**
7. **Application Wizard**
8. **Document Upload**
9. **Summary & Submit**
10. **Status Tracking**
11. **Notifications Center**
12. **Profile & Security Settings**

---

# 5. Detailed UX Wireflows

## 5.1 Landing Page
**Purpose:** Introduce services and guide citizens to login.

Elements:
- Hero banner (Government of Suriname / SoZaVo)
- List of supported services
- Button: "Log In / Register"
- Link: "How Benefits Work"
- Language selector

---

## 5.2 Login / Registration Flow
**Goal:** Create a secure account.

### 5.2.1 Register
Fields:
- Email
- Password
- Confirm password

Flow:
```
Register → Email Verification → Redirect to Identity Linking
```

### 5.2.2 Login
Fields:
- Email
- Password

Forgot password → email recovery.

---

## 5.3 Identity Linking (CCR Verification)
**Mandatory step** before using any services.

Flow:
```
Enter BIS Number → Date of Birth → Validate via BIS Sync → Create/Link CCR
```

If BIS not available or fails:
```
Manual Identity Verification → Form → Staff Approval Required
```

If citizen already exists in CCR → link account.

---

## 5.4 Household Confirmation
After linking identity:
```
View household members → Confirm or request correction
```

If corrections needed:
```
Citizen submits correction form → Staff reviews
```

---

## 5.5 Citizen Dashboard
Widgets:
- Active Applications
- Benefit Status
- Messages/Notifications
- Start New Application
- Profile Completion

---

# 6. Service Application Wireflows

## 6.1 Service Selection
Citizen chooses:
- General Assistance
- Social Assistance (incl. Moni Karta)
- Child Benefit

Each service card displays:
- Eligibility criteria summary
- Required documents
- Expected processing time

---

## 6.2 Application Wizard
The wizard is dynamic per service.

### Shared Wizard Structure:
```
Step 1 – Personal Data Review (readonly from CCR)  
Step 2 – Household & Income  
Step 3 – Service-Specific Questions  
Step 4 – Document Uploads  
Step 5 – Summary
```

### Wizard Behaviors:
- Autosave every step
- Conditional logic
- Mandatory fields validation
- Progress indicator (1–5)
- Exit & Resume Later option

---

## 6.3 Document Upload Flow
Upload requirements depend on service rules.

Flow:
```
Upload → Virus/MIME check → Preview → Submit
```

Document types:
- ID card
- Birth certificate
- Residence proof
- Income proof

Validation via document engine (Level 2).

---

## 6.4 Summary & Submit Flow
Citizen reviews:
- Personal data
- Household
- Document list
- Service-specific answers

Checkbox:
```
“I declare all information is truthful.”
```

Button: **Submit Application**

Submission triggers:
- Case creation
- Intake routing
- Notification to citizen
- Message entry in case history

---

# 7. Post-Submission Experience

## 7.1 Status Tracking
Statuses:
- Submitted
- Intake Under Review
- Pending Documents
- Eligibility Check
- Review
- Approved
- Rejected
- Payment Pending
- Payment Completed

Citizen sees:
- Current step
- Timeline
- Expected duration
- Messages from case handlers

---

## 7.2 Notifications Center
Supports:
- New case updates
- Request for additional documents
- Eligibility results
- Approval/denial notices
- Payment status

Notification types:
- In-app
- Email (optional)
- SMS (future)

---

# 8. Profile & Security Settings
Includes:
- Personal details (readonly CCR)
- Phone & email updates
- Two-factor authentication (future)
- Password reset
- Linked household view

---

# 9. Error Handling Flows

## BIS Sync Fails
```
Show fallback: “Unable to verify identity” → Offer manual verification
```

## Document Upload Errors
- File too large
- Wrong format
- Scan unreadable

## Wizard Incomplete
- Warn and save draft

## Eligibility System Down
- Allow submission → queue for later evaluation

---

# 10. Accessibility & Usability Requirements
- Large buttons, readable fonts
- Screenreader support
- Keyboard navigation
- High contrast theme option
- Form instructions clear & simple

---

# 11. Completion Criteria – Phase 18

### UX Architecture:
- [ ] All wireflows defined end-to-end
- [ ] BIS identity linking flow approved
- [ ] Wizard navigation flows verified

### User Journeys:
- [ ] First-time user journey complete
- [ ] Returning user journey complete

### Integration Points:
- [ ] Identity → CCR linking aligned with backend model
- [ ] Wizard definitions mapped to Phase 5 engine
- [ ] Notifications integrated with messaging engine

### Approval:
- [ ] Ministry signs off on UX
- [ ] Ready for UI design & Lovable build

After Phase 18, Lovable MUST await explicit approval before Phase 19 (System Governance Charter).

---

**END OF PHASE 18 PLAN – PUBLIC PORTAL UX WIREFLOW (ENGLISH)**

