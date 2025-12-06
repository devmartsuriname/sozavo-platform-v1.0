# SoZaVo Central Social Services Platform – Technical Architecture Document (v2.0, English)

> **Status:** Updated Version Aligned with Workflow Blueprint v2**  
> **Prepared for:** Ministry of Social Affairs & Housing (SoZaVo)  
> **Prepared by:** Devmart Suriname  
> **Related Docs:** PRD v2.0 (English), Workflow Blueprint v2.0 (English)

---

# **1. Architectural Overview**
The SoZaVo Central Social Services Platform is architected as a modular, scalable, and integration-ready system designed to operate **independently** of external government systems (BIS, Subema), while remaining fully capable of consuming their data as optional upstream sources.

The architecture supports the MVP services:
- General Assistance
- Social Assistance (incl. Moni Karta)
- Child Allowance

A unified core component, the **Central Citizen Record (CCR)**, maintains all authoritative citizen and household data. All workflows, eligibility checks, and case processing depend on the CCR rather than external systems.

---

# **2. Updated Architecture Principles (v2 Enhancements)**
1. **CCR is the internal source of truth.**
2. **BIS is treated as optional intake prefill only.**
3. **Subema integration is future-proofed, but not required for MVP.**
4. **Each service has its own workflow engine** to support isolated logic.
5. **Eligibility Engine operates on JSON-based rules** for maintainability.
6. **Wizard Engine dynamically generates intake flows** from stored definitions.
7. **All integrations use pluggable adapters with fallback behavior.**
8. **The admin UI is built from HTML → React with no AI improvisation.**

---

# **3. System Architecture Layers**

### **3.1 Presentation Layer (UI/UX)**
- React + TypeScript (Lovable-generated)
- Vite bundler
- TailwindCSS with design tokens
- Admin screens for:
  - Dashboard
  - Cases
  - Citizen Profiles (CCR)
  - Document Manager
  - Eligibility Results
  - Workflow Definitions
  - Reports
  - Settings
- Future: Public Portal (separate frontend sharing same backend)

---

### **3.2 Application Layer**
This layer contains the system’s business logic and engines.

#### **3.2.1 Workflow Engines (Module-Specific)**
Each service type has its own engine:
- `GeneralAssistanceEngine`
- `SocialAssistanceEngine`
- `ChildBenefitEngine`

Responsibilities:
- Interpret workflow definitions
- Control status transitions
- Invoke eligibility checks
- Validate required documents
- Log case events

#### **3.2.2 Eligibility Engine**
- Consumes rules from `eligibility_rules` table (JSON)
- Executes conditions server-side
- Supports:
  - income checks
  - household checks
  - child age validation
  - duplicate application detection
- Outputs structured results + rule trace

#### **3.2.3 Wizard Engine**
- Renders intake flows based on `wizard_definitions`
- Supports conditional logic & required document triggers
- Can operate fully offline from BIS

#### **3.2.4 Document Validation Engine (Level 2)**
- Duplicate detection
- Expiration checks
- Metadata consistency

---

### **3.3 Integration Layer**
Handles communication with BIS, Subema, and future systems.

#### **3.3.1 BIS Prefill Integration (Updated)**
- Triggered only during intake
- Implemented via Edge Function `fetchFromBIS`
- Output maps to CCR fields
- If BIS fails → fallback to manual entry
- No continuous synchronization

#### **3.3.2 Subema (Future Ingestion Adapter)**
- Income verification source
- Integration path established:
  - Edge Function: `fetchFromSubema`
  - Stores results in `incomes`
- Does not block case creation

#### **3.3.3 Adapter Pattern Requirements**
All integrations:
- must be optional
- must not break workflows when offline
- must support versioning

---

# **4. Data Layer (Supabase Database Schema)**

### **4.1 Core Entities**
Tables:
- `citizens` (CCR)
- `households`
- `incomes`
- `cases`
- `case_events`
- `documents`
- `document_requirements`
- `eligibility_rules`
- `eligibility_evaluations`
- `wizard_definitions`
- `wizard_sessions`
- `workflow_definitions`
- `service_types`
- `offices`
- `users`

### **4.2 CCR as Internal Source of Truth**
All incoming external data is normalized into CCR tables.
CCR handles:
- citizen identity
- household structure
- income history
- service history

---

# **5. Application Data Flows**

### **5.1 Intake Flow**
1. Wizard starts.
2. BIS lookup attempted.
3. If BIS success → prefill CCR.
4. If BIS fails → manual input.
5. Required documents uploaded.
6. Wizard saves session.
7. Case created.

### **5.2 Eligibility Flow**
1. Engine loads service-specific rules.
2. Extracts CCR, documents, and case data.
3. Runs rule JSON.
4. Returns structured result.
5. Logs evaluation snapshot.

### **5.3 Document Flow**
1. Upload → Supabase Storage.
2. Metadata saved in `documents`.
3. Level 2 validation executed.
4. Duplicate links detected.

### **5.4 Case Lifecycle Flow**
- Intake → Pending Docs → Eligibility → Under Review → Approved/Rejected → Closed

### **5.5 Audit Flow**
- Every action logged in `case_events`.

---

# **6. Security Architecture (RLS Phase Scheduled)**

### **6.1 Authentication**
- Supabase Auth (email/password or SSO in future)
- `users` table mirrors auth identity

### **6.2 Authorization (Phase 2)**
Roles:
- system_admin
- district_intake_officer
- case_handler
- case_reviewer
- department_head
- audit

### **6.3 Row-Level Security (To Be Implemented After MVP)**
RLS will restrict:
- visibility of cases by office
- citizen visibility tied to cases
- document access for assigned staff

### **6.4 Audit Requirements**
- All systems must support forensic audit
- Case events, eligibility evaluations, and document versioning required

---

# **7. Deployment Architecture**

### **7.1 Environments**
- **Development**: Supabase Dev + Lovable workspace
- **Staging**: VPS-hosted frontend + staging DB
- **Production**: VPS frontend + Supabase production DB

### **7.2 Configuration**
- Managed through `.env` per environment
- Service Role Keys only used server-side
- API rate limits enforced between frontend and Supabase

### **7.3 Build Pipeline**
- HTML templates → React components in Lovable
- Database migrations managed through Supabase
- Versioned workflow + eligibility definitions stored in DB

---

# **8. Future-Proof Extensions (Post-MVP)**

### **8.1 Public Portal**
- Citizen login
- Self-service application initiation
- Document uploads
- Status tracking

### **8.2 Expanded Integrations**
- Subema ingestion
- Civil Registry
- Automated fraud detection

### **8.3 Advanced Document Validation**
- OCR scanning
- AI duplicate detection
- Multi-document correlation

### **8.4 Role-Based Dashboards**
- District performance metrics
- Policy insights
- Fraud heatmaps

---

# **9. Open Architectural Questions (Pending SoZaVo Review)**
1. Should BIS refresh be allowed by Case Handlers or restricted to intake?
2. Should duplicate detection be limited to document hashes or expanded to OCR comparisons?
3. Should Moni Karta be treated as a tag or a sub-service within Social Assistance?
4. Will SoZaVo require offline support for remote district operations?

---

**END OF TECHNICAL ARCHITECTURE DOCUMENT v2.0 (English)**

