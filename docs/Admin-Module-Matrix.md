# Admin Module Matrix
## SoZaVo Platform v1.0 — Phase 9

**Document Version**: 1.0  
**Phase**: 9 — Admin MVP Implementation Blueprint  
**Status**: Approved for Implementation  
**Last Updated**: 2025-01-XX

---

## 1. Overview

This matrix maps each Admin MVP module to its technical dependencies: user roles, Darkone page templates, database tables, engines, RLS policies, JSON configs, and MVP status.

---

## 2. Module-to-Technical Mapping Matrix

| Module | Primary User Roles | Darkone Page/Layout | Tables Used | Engines Used | RLS Considerations | JSON Configs Referenced | MVP Status |
|--------|-------------------|---------------------|-------------|--------------|-------------------|------------------------|------------|
| **1. Login & Role-Based Access Shell** | All roles | `auth-signin.html`, `layouts-dark-sidenav.html` | `auth.users`, `user_roles` | — | `user_roles_select` policy | — | Read+Write |
| **2. Case Search & Overview** | case_handler, case_reviewer, department_head, fraud_officer, system_admin | `tables-gridjs.html` | `cases`, `citizens`, `service_types`, `offices` | — | `case_select` (role-scoped) | — | Read-only |
| **3. Case Detail & Timeline View** | case_handler, case_reviewer, department_head, fraud_officer, system_admin | `index.html` (dashboard cards) | `cases`, `citizens`, `case_events`, `eligibility_evaluations`, `fraud_risk_scores`, `documents` | Workflow | `case_select`, `case_event_select`, `citizen_select` | `case_workflow.json` | Read-only |
| **4. Intake & Eligibility Review Panel** | case_handler, case_reviewer, department_head | `ui-tabs.html`, `ui-accordion.html` | `cases`, `wizard_submissions`, `documents`, `eligibility_evaluations`, `eligibility_rules` | Eligibility, Wizard | `eligibility_select`, `document_select` | `child_allowance.json`, `social_assistance.json`, `general_assistance.json` (eligibility) | Read-only |
| **5. Documents Viewer** | case_handler, case_reviewer, department_head, fraud_officer | `tables-basic.html` | `documents`, `cases` | — | `document_select` (case-bound) | — | Read-only |
| **6. Payments Overview** | finance_officer, fraud_officer, department_head, system_admin | `tables-gridjs.html` | `payment_batches`, `payment_items`, `cases`, `citizens` | Payment | `payment_select` (role-restricted) | `payment_engine.json` | Read-only |
| **7. Fraud & Risk Overview** | fraud_officer, department_head, system_admin | `charts.html`, `tables-gridjs.html` | `fraud_signals`, `fraud_risk_scores`, `cases` | Fraud | `fraud_select` (role-restricted) | `fraud_engine.json` | Read-only |
| **8. Configuration Panel** | department_head, system_admin, audit_viewer | `ui-accordion.html` | `service_types`, `offices`, `eligibility_rules`, `workflow_definitions` | — | Public select (non-sensitive) | All `/configs/**` | Read-only |

---

## 3. Detailed Module Specifications

### 3.1 Login & Role-Based Access Shell

| Attribute | Value |
|-----------|-------|
| **Primary Roles** | All authenticated roles |
| **Darkone Base** | `auth-signin.html` for login, `layouts-dark-sidenav.html` for shell |
| **Tables** | `auth.users` (Supabase managed), `user_roles` |
| **RLS Policies** | `user_roles_select`: Users can read own roles |
| **Edge Functions** | `getCurrentUserRoles` |
| **Response Shape** | `{ user_id, roles: app_role[] }` |
| **Navigation Logic** | Sidebar items filtered by `roles.includes(required_role)` |

**Role → Default Landing Page**:
| Role | Landing Page |
|------|--------------|
| case_handler | Case Search |
| case_reviewer | Case Search |
| department_head | Case Search |
| finance_officer | Payments Overview |
| fraud_officer | Fraud Overview |
| system_admin | Configuration Panel |
| audit_viewer | Configuration Panel |

---

### 3.2 Case Search & Overview

| Attribute | Value |
|-----------|-------|
| **Primary Roles** | case_handler, case_reviewer, department_head, fraud_officer, system_admin |
| **Darkone Base** | `tables-gridjs.html` |
| **Tables** | `cases`, `citizens` (join), `service_types` (join), `offices` (join) |
| **RLS Policies** | `case_select`: Scoped by `case_handler_id` OR `office_id` OR admin |
| **Edge Functions** | `getCases` |
| **Request Params** | `{ status?, service_type_id?, office_id?, date_from?, date_to?, page, limit, sort_by, sort_order }` |
| **Response Shape** | `{ data: Case[], total: number, page: number, limit: number }` |

**Grid Columns**:
| Column | Source | Sortable | Filterable |
|--------|--------|----------|------------|
| Case ID | `cases.id` | Yes | Yes (search) |
| Citizen Name | `citizens.full_name` | Yes | Yes (search) |
| Service Type | `service_types.name` | Yes | Yes (dropdown) |
| Status | `cases.status` | Yes | Yes (dropdown) |
| District | `offices.name` | Yes | Yes (dropdown) |
| Created | `cases.created_at` | Yes | Yes (date range) |
| Handler | `cases.case_handler_id` → name | Yes | No |

---

### 3.3 Case Detail & Timeline View

| Attribute | Value |
|-----------|-------|
| **Primary Roles** | case_handler, case_reviewer, department_head, fraud_officer, system_admin |
| **Darkone Base** | `index.html` (dashboard card layout) |
| **Tables** | `cases`, `citizens`, `case_events`, `eligibility_evaluations`, `fraud_risk_scores`, `documents` |
| **RLS Policies** | `case_select`, `case_event_select`, `citizen_select`, `eligibility_select`, `fraud_select`, `document_select` |
| **Edge Functions** | `getCaseById`, `getCaseEvents`, `getCaseSummary` |
| **Request Params** | `{ case_id }` |
| **Response Shape** | `{ case: Case, citizen: Citizen, events: CaseEvent[], eligibility: EligibilityEvaluation, fraud: FraudRiskScore, document_count: number }` |

**UI Sections**:
| Section | Data Source | Component |
|---------|-------------|-----------|
| Case Header | `cases` + `citizens` | Card with status badge |
| Timeline | `case_events` | Vertical timeline |
| Eligibility Summary | `eligibility_evaluations` | Summary card |
| Fraud Summary | `fraud_risk_scores` | Risk indicator card |
| Documents Count | `documents` (count) | Badge/link |

---

### 3.4 Intake & Eligibility Review Panel

| Attribute | Value |
|-----------|-------|
| **Primary Roles** | case_handler, case_reviewer, department_head |
| **Darkone Base** | `ui-tabs.html`, `ui-accordion.html` |
| **Tables** | `cases`, `wizard_submissions`, `documents`, `eligibility_evaluations`, `eligibility_rules` |
| **RLS Policies** | `eligibility_select`, `document_select`, `wizard_submission_select` |
| **Edge Functions** | `getIntakeReview`, `getEligibilityEvaluation` |
| **JSON Configs** | `/configs/eligibility/*.json`, `/configs/wizard/*.json` |
| **Request Params** | `{ case_id }` |
| **Response Shape** | `{ wizard_data: WizardSubmission, documents: Document[], eligibility: EligibilityEvaluation, rules_fired: RuleFired[] }` |

**Tab Structure**:
| Tab | Content |
|-----|---------|
| Intake Data | Wizard answers in accordion by step |
| Documents | Document checklist with status |
| Eligibility | Evaluation result with rule breakdown |

---

### 3.5 Documents Viewer

| Attribute | Value |
|-----------|-------|
| **Primary Roles** | case_handler, case_reviewer, department_head, fraud_officer |
| **Darkone Base** | `tables-basic.html` |
| **Tables** | `documents`, `cases` |
| **RLS Policies** | `document_select`: Case-bound, role-scoped |
| **Edge Functions** | `getDocumentsByCase`, `getDocumentDownloadUrl` |
| **Request Params** | `{ case_id }` |
| **Response Shape** | `{ documents: Document[] }` |

**Table Columns**:
| Column | Source |
|--------|--------|
| Filename | `documents.filename` |
| Type | `documents.document_type` |
| Upload Date | `documents.created_at` |
| Status | `documents.verification_status` |
| Uploaded By | `documents.uploaded_by_type` |
| Actions | Download link |

---

### 3.6 Payments Overview

| Attribute | Value |
|-----------|-------|
| **Primary Roles** | finance_officer, fraud_officer, department_head, system_admin |
| **Darkone Base** | `tables-gridjs.html` |
| **Tables** | `payment_batches`, `payment_items`, `cases`, `citizens` |
| **RLS Policies** | `payment_batch_select`, `payment_item_select`: Role-restricted |
| **Edge Functions** | `getPaymentBatches`, `getPaymentItems` |
| **JSON Configs** | `/configs/payments/payment_engine.json` |
| **Request Params** | `{ batch_id?, status?, date_from?, date_to?, page, limit }` |
| **Response Shape** | `{ batches: PaymentBatch[], items?: PaymentItem[], summary: PaymentSummary }` |

**Batch List Columns**:
| Column | Source |
|--------|--------|
| Batch ID | `payment_batches.id` |
| Created | `payment_batches.created_at` |
| Status | `payment_batches.status` |
| Total Amount | `payment_batches.total_amount` |
| Item Count | `payment_batches.item_count` |

---

### 3.7 Fraud & Risk Overview

| Attribute | Value |
|-----------|-------|
| **Primary Roles** | fraud_officer, department_head, system_admin |
| **Darkone Base** | `charts.html`, `tables-gridjs.html` |
| **Tables** | `fraud_signals`, `fraud_risk_scores`, `cases` |
| **RLS Policies** | `fraud_signal_select`, `fraud_risk_score_select`: Role-restricted |
| **Edge Functions** | `getFraudSignals`, `getFraudRiskScores`, `getFraudSummary` |
| **JSON Configs** | `/configs/fraud/fraud_engine.json` |
| **Request Params** | `{ severity?, signal_type?, date_from?, date_to?, page, limit }` |
| **Response Shape** | `{ signals: FraudSignal[], risk_scores: FraudRiskScore[], summary: FraudSummary }` |

**Dashboard Cards**:
| Card | Metric |
|------|--------|
| Total Signals | Count of `fraud_signals` |
| High-Risk Cases | Count where `risk_tier = 'high'` or `'critical'` |
| Pending Escalation | Count where `escalation_status = 'pending'` |

---

### 3.8 Configuration Panel

| Attribute | Value |
|-----------|-------|
| **Primary Roles** | department_head, system_admin, audit_viewer |
| **Darkone Base** | `ui-accordion.html` |
| **Tables** | `service_types`, `offices`, `eligibility_rules`, `workflow_definitions` |
| **RLS Policies** | Public select (non-sensitive config data) |
| **Edge Functions** | `getServiceTypes`, `getOffices`, `getEligibilityRules`, `getWorkflowDefinitions` |
| **JSON Configs** | All `/configs/**` |
| **Request Params** | None (full list) |
| **Response Shape** | Per-entity lists |

**Accordion Sections**:
| Section | Content |
|---------|---------|
| Service Types | List with name, description, status |
| Offices | List with name, code, region |
| Eligibility Rules | Summary by service type with version |
| Workflows | State machine overview |

---

## 4. RLS Policy Quick Reference

| Policy Name | Tables | Access Pattern |
|-------------|--------|----------------|
| `case_select` | `cases` | Handler sees assigned, reviewer sees office, dept_head sees all |
| `citizen_select` | `citizens` | Via case ownership or admin |
| `case_event_select` | `case_events` | Inherits from case access |
| `eligibility_select` | `eligibility_evaluations` | Inherits from case access |
| `document_select` | `documents` | Case-bound + role verification |
| `payment_batch_select` | `payment_batches` | finance_officer, fraud_officer, dept_head, admin |
| `payment_item_select` | `payment_items` | Same as batch |
| `fraud_signal_select` | `fraud_signals` | fraud_officer, dept_head, admin |
| `fraud_risk_score_select` | `fraud_risk_scores` | fraud_officer, dept_head, admin |
| `user_roles_select` | `user_roles` | Own roles only |

---

## 5. Engine Dependencies

| Engine | Used By Modules | Config File | Read/Write |
|--------|-----------------|-------------|------------|
| Eligibility Engine | 4. Intake & Eligibility | `/configs/eligibility/*.json` | Read |
| Wizard Engine | 4. Intake & Eligibility | `/configs/wizard/*.json` | Read |
| Workflow Engine | 3. Case Detail | `/configs/workflows/case_workflow.json` | Read |
| Payment Engine | 6. Payments Overview | `/configs/payments/payment_engine.json` | Read |
| Fraud Engine | 7. Fraud Overview | `/configs/fraud/fraud_engine.json` | Read |

---

## 6. Darkone Template Utilization

| Template | Purpose | Modules Using |
|----------|---------|---------------|
| `auth-signin.html` | Login form | 1 |
| `layouts-dark-sidenav.html` | Main layout shell | All |
| `index.html` | Dashboard with cards | 3, 7 |
| `tables-gridjs.html` | Advanced data tables | 2, 6, 7 |
| `tables-basic.html` | Simple tables | 5 |
| `ui-tabs.html` | Tabbed content | 4 |
| `ui-accordion.html` | Collapsible sections | 4, 8 |
| `charts.html` | Data visualization | 7 |

---

*End of Admin-Module-Matrix.md*
