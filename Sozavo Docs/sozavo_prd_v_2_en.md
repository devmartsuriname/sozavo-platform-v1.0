# SoZaVo Central Social Services Platform – Product Requirements Document (PRD) v2.0 (English)

> **Status:** Updated Version with BIS Fallback Logic  
> **Prepared for:** Ministry of Social Affairs & Housing (SoZaVo)  
> **Prepared by:** Devmart Suriname

---

## **1. Executive Summary**
The Ministry of Social Affairs & Housing (SoZaVo) requires a unified digital platform to centralize the processing, management, and validation of citizen-related social services. The platform will support the MVP services:

- **General Assistance**
- **Social Assistance (including Moni Karta)**
- **Child Allowance**

The system is designed around the **Central Citizen Record (CCR)**, which becomes the internal single source of truth. **BIS** will be used **as an optional upstream prefill source only**, due to its ongoing modernization. All data required for processing will be stored locally in the CCR to ensure reliability and continuity.

The MVP focuses on intake, eligibility, workflow progression, document handling, and case management. Future phases will extend into public-facing portals, additional services, and deeper integrations with Subema and BIS.

---

## **2. Organizational Scope**
### **2.1 Core Departments (MVP)**
- **Social Services & Subsidies Department** – primary processors for all MVP services.
- **District Offices** – responsible only for intake and document collection.
- **Management / Department Heads** – oversight and reporting.
- **Finance (Analytics Only)** – read-only dashboard insights.
- **ICT / System Administration** – configuration, user management, system maintenance.

### **2.2 Future Departments (Post-MVP)**
- Crisis Support
- Food Security Programs
- Educational Support Programs

---

## **3. User Groups (Role Model)**
### **MVP Roles**
1. **System Administrator**  
2. **District Intake Officer**  
3. **Case Handler** (service processing)  
4. **Case Reviewer** (second-line approval)  
5. **Department Head** (reports & decisions)  
6. **Audit & Compliance**  

### **Post-MVP Roles**
- Public Portal Users
- Integration Bots (BIS/Subema automations)

---

## **4. Core System Concept**
### **4.1 Central Citizen Record (CCR) – Internal Source of Truth**
The CCR stores:
- Personal information
- Household composition
- Income sources
- Service application history
- Eligibility results
- Document archive
- Flags for potential fraud or duplicates

**BIS is used only for prefill.** If BIS is unavailable, intake continues manually.

### **4.2 Eligibility Engine (Rule-Based)**
- JSON-defined rules per service
- Income thresholds, age validation, household composition, previous benefits
- Returns: `eligible`, `not_eligible`, `needs_review`
- Outputs detailed rule evaluations

### **4.3 Workflow Engine (Service-Specific)**
Each service has its own workflow definition, allowing nuanced logic:
- Intake → Document Collection → Eligibility → Case Handling → Review → Closure

### **4.4 Document Management (Intermediate Validation)**
- Mandatory document checks
- Duplicate detection
- Issue/expiration validation
- Fraud flags (basic)

---

## **5. MVP Services**
### **5.1 General Assistance**
- Income-based support
- Requires identity, residence, and income documents
- Eligibility based on income ceilings and household status

### **5.2 Social Assistance (including Moni Karta)**
- Moni Karta included as a sub-module
- Eligibility rules applied inside the Social Assistance engine
- Does not operate as a standalone service

### **5.3 Child Allowance**
- Requires parent and child identity information
- Birth certificates and age validation

---

## **6. Cross-Service Functionalities**
### **6.1 Intake Wizard (District Level)**
- Dynamic questions
- Conditional steps
- Document requirements
- BIS lookup at Step 1 → fallback to manual entry

### **6.2 Notifications**
- Email + in-app tasks
- Reminders for pending reviews and missing documents

### **6.3 Audit Trail**
- Every action logged
- Document history maintained

---

## **7. Integrations**

### **7.0 Integration Principles (Updated)**
- The **CCR is the primary source of truth**.
- BIS is an **optional upstream source**, used only to prefill intake data.
- If BIS is down, incomplete, or returns no match → **intake proceeds manually**.
- BIS must not block workflows, eligibility checks, or case creation.
- Subema and all other integrations must follow a **pluggable adapter model**.

### **7.1 BIS Integration (Optional Prefill Source)**
- BIS queried **only at intake**.
- Data used for prefill: personal info, address, household members where applicable.
- No continuous synchronization.
- Manual refresh may be added in future phases.

### **7.2 Subema Integration (Future)**
- Will provide verified income data
- Must not block MVP workflows
- Architecture prepared for Subema ingestion via Edge Functions

---

## **8. UI & UX Requirements**
### **8.1 Admin UI (Internal System First)**
- Built using HTML → React conversion via Lovable
- 1:1 structure from HTML template, no AI-driven design improvisation
- Dark/light mode support
- Tab-based settings sections

### **8.2 Public Portal (Post-MVP)**
- Citizens start applications
- Upload documents
- Check status
- Must reuse CCR and workflow engines
- Using HTML template converted through Lovable

---

## **9. Non-Functional Requirements**
### **9.1 Security**
- Supabase Auth for login
- RLS added in later implementation phase
- Logs must trace all actions

### **9.2 Performance**
- Intake wizard loads < 1.5s
- Eligibility checks < 400ms
- BIS call must degrade gracefully

### **9.3 Scalability**
- New services added via JSON-based rules and workflows
- Engines remain modular

### **9.4 Reliability**
- Offline-safe intake (manual path)
- BIS independence ensures uninterrupted operations

---

## **10. MVP Deliverables**
1. Central Citizen Record (CCR)
2. Intake Wizard for 3 MVP services
3. Eligibility Engine + rules JSON
4. Service-specific Workflow Engines
5. Document Management (Intermediate Validation)
6. Case Handling Workspace
7. Admin UI (HTML → React via Lovable)
8. Reporting Dashboard
9. Audit Logging
10. Technical Architecture v1.0

---

## **11. Appendices**
- Appendix A: JSON Eligibility Rules Structure
- Appendix B: Workflow Model Structure
- Appendix C: Document Validation Rules
- Appendix D: BIS → CCR Mapping Table (provisional)

---

**END OF PRD v2.0 (English)**