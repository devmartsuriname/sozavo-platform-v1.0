# SoZaVo Central Social Services Platform – Workflow Blueprint v2.0 (English)

> **Status:** Updated Version with BIS fallback logic & refined workflows  
> **Prepared for:** Ministry of Social Affairs & Housing (SoZaVo)  
> **Prepared by:** Devmart Suriname

---

## **1. Organizational Overview**
This Workflow Blueprint defines how SoZaVo’s operational processes function across departments, how service applications move through intake, processing, eligibility verification, and approval, and how the system must support these workflows.

The document reflects updated integration assumptions: BIS is used **only as an optional prefill source** during intake. All workflows must function normally even if BIS is unavailable.

---

## **2. Departments & Responsibilities**

### **2.1 Core Departments (MVP-Relevant)**
1. **Social Services & Subsidies Department**  
   - Full responsibility for processing General Assistance, Social Assistance (incl. Moni Karta), and Child Allowance.
   - Performs eligibility checks, document verification, and first-line decisions.

2. **District Offices**  
   - Perform intake only.
   - Collect documents, initiate applications, and support citizens.
   - No approval authority in the MVP.

3. **Department Heads / Management**  
   - Monitoring and reporting.
   - High-level decisions and policy oversight.

4. **Finance (Analytics Only)**  
   - Dashboard access to view aggregated data.
   - No financial processing or disbursement functions.

5. **ICT / System Administration**  
   - System configuration, user management, audit monitoring.

---

## **3. Workflow Breakdown per Service (MVP)**
The workflows for the three MVP services share a consistent structure but each includes service-specific logic.

---

# **3.1 General Assistance Workflow**

### **Step 1: Intake (District Office)**
- Intake Officer starts application wizard.
- BIS number requested at the start.
- **If BIS returns data → prefill citizen fields.**
- **If BIS fails or no match → manual data entry continues.**
- Required documents uploaded (ID, income statements, residence proof).

### **Step 2: Case Creation**
- CCR (Central Citizen Record) created or updated.
- New case created under `GENERAL_ASSISTANCE`.

### **Step 3: Document Review**
- Officer marks documents as present.
- Intermediate-level validation applied (expiry, completeness, duplicates).

### **Step 4: Eligibility Check**
Eligibility Engine evaluates rule set:
- Income ceiling
- Household size & dependents
- Duplicate applications
- Previous approval gaps

### **Step 5: Case Handling**
- Case Handler reviews all details.
- Adds notes, requests clarifications if needed.

### **Step 6: Review Layer**
- Second-line review by Case Reviewer.
- Reviewer approves or rejects.

### **Step 7: Closure**
- Case status set to Approved / Rejected / Closed.
- Final eligibility stored in audit.

---

# **3.2 Social Assistance Workflow (incl. Moni Karta)**
Moni Karta is **not a standalone service**. It is embedded within Social Assistance eligibility.

### **Step 1: Intake Wizard**
- BIS optional prefill.
- Wizard includes Moni Karta–specific questions:
  - employment status
  - household structure
  - income streams
- Documents required: ID, income proof, household declarations.

### **Step 2: Case Creation & Document Intake**
- CCR updated with household + income changes.
- Documents uploaded.

### **Step 3: Eligibility Check**
Eligibility Engine evaluates:
- Income threshold for Social Assistance
- Special thresholds for Moni Karta
- Household dependency structure
- Duplicate and fraud flags

### **Step 4: Case Handling**
- Case Handler validates documents.
- Confirms Moni Karta eligibility.

### **Step 5: Review**
- Final approval by Case Reviewer.

### **Step 6: Closure**
- Approved / Rejected / Closed.
- Eligibility snapshot saved.

---

# **3.3 Child Allowance Workflow**

### **Step 1: Intake Wizard**
- BIS optional prefill for parent.
- BIS or manual entry for child data.

### **Step 2: Document Intake**
- Parent and child ID documents.
- Birth certificate.

### **Step 3: Eligibility Check**
- Age validation (< 18).
- Duplicate claim check across CCR.
- Parental link verification.

### **Step 4: Case Handling**
- Document validation.
- Manual overrides (if needed).

### **Step 5: Review**
- Second-line approval.

### **Step 6: Closure**
- Decision stored.
- Case event history updated.

---

## **4. Cross-Organizational Workflow Structure**

### **4.1 Intake → District Offices**
- First point of contact.
- Guided by Wizard Engine.
- Must function fully without BIS.
- Required documents collected at intake.

### **4.2 Processing → Central Department Teams**
- Case Handlers perform eligibility validation.
- Central Reviewers confirm final decisions.

### **4.3 Review → Second-Line Assurance**
- All services require a second-line decision.
- Reviewer can approve, reject, or request additional documents.

### **4.4 Reporting → Management**
- Dashboard with:
  - active applications
  - approvals & rejections
  - district performance
  - key demographic indicators

---

## **5. Data Flows**

### **5.1 BIS → CCR Flow (Updated)**
- BIS checked only at intake.
- Intake wizard attempts BIS lookup.
- If BIS responds → CCR prefilled.
- If BIS fails → manual entry.
- No ongoing sync.

### **5.2 Document Flow**
- Documents uploaded to Supabase Storage.
- Metadata stored in `documents` table.
- Validation checks:
  - expiry
  - duplicates
  - matching citizen identity

### **5.3 Eligibility Flow**
- Eligibility Engine loads appropriate JSON rules per service.
- Returns structured decision + failed/passed rules.

### **5.4 Case History & Audit Flow**
- Every action written to `case_events`.
- Reviewer notes, eligibility results, transitions all logged.

---

## **6. Wizard Logic Framework**
Wizard Engine supports:
- Conditional steps (if/else logic)
- Dynamic required fields
- Service-specific document triggers
- Automatic stopping points for missing eligibility

All wizard definitions stored in `wizard_definitions` (JSON).

---

## **7. Cross-Cutting Requirements**

### **7.1 Standardized Case Lifecycle**
All services follow the base structure:
- Intake
- Document Intake
- Eligibility Check
- Case Handling
- Review
- Closure

### **7.2 Auditability**
- Every significant action logged.
- Document history must be preserved.

### **7.3 Scalability & Modularity**
- New services added via:
  - new service_type
  - new workflow_definitions
  - new wizard_definitions
  - new eligibility_rules

### **7.4 Independence from BIS**
- System reliability must not depend on BIS availability.
- BIS is optional and can be disabled.

---

## **8. Post-MVP Considerations**

### **8.1 External Public Portal**
- Citizens start applications online.
- Upload documents directly.
- Status tracking.
- Must share CCR and workflow engines.

### **8.2 Additional Services**
- Crisis Support
- Food Packages
- Educational Support
- Elderly/Disability Programs

### **8.3 Enhanced Validation (Future)**
- OCR document scanning
- AI duplicate detection
- Fraud pattern detection

---

## **9. Open Questions (For SoZaVo Validation)**
1. Should document rules be identical across all districts?
2. Can intake officers reject documents or only upload them?
3. Should suspicious cases be automatically flagged for escalation?
4. Should BIS manual refresh be available to Case Handlers in later phases?

---

**END OF WORKFLOW BLUEPRINT v2.0 (English)**