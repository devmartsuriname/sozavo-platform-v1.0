# SoZaVo Central Social Services Platform – Lovable Build Instructions (Phase 1 & Phase 2)

> **Status:** Implementation Blueprint for Lovable AI Builder  
> **Prepared for:** Devmart Suriname – SoZaVo MVP Build  
> **Scope:** Database (Phase 1) + Admin UI Base (Phase 2)  
> **Related Docs:** PRD v2, Workflow Blueprint v2, Technical Architecture v2, Eligibility Rules Framework v1, Wizard Step Definitions v1

---

# **1. Purpose of This Document**
These instructions define **exactly how Lovable must begin building the SoZaVo MVP**, starting with:

- **Phase 1:** Database foundation in Supabase
- **Phase 2:** Admin UI structure (HTML → React conversion)

The goal is to ensure a clean, controlled, non‑improvised implementation where Lovable follows strict rules:

### **Lovable MAY NOT:**
- Invent new UI components
- Change the design or CSS tokens
- Modify database schema without instruction
- Introduce its own workflows or logic

### **Lovable MUST:**
- Follow this document word‑for‑word
- Build components 1:1 from provided HTML
- Use Supabase exclusively as backend
- Await approval after each phase

---

# **2. Global Build Rules for Lovable**

### **2.1 Technology Stack (Fixed)**
- React + TypeScript
- Vite bundler (or Lovable default React environment)
- TailwindCSS
- HTML → React component conversion (strict 1:1)
- Supabase client

### **2.2 UI Rules**
- No improvisation
- No auto‑generated design changes
- Use exact classes from the provided admin template
- Use design tokens (colors, spacing, typography)
- Maintain accessibility structure

### **2.3 Code Organization**
```
src/
  components/
  layouts/
  pages/
  integrations/supabase/
  integrations/engines/
  utils/
```

---

# **3. Phase 1 – Supabase Database Foundation**

Lovable must create (or migrate) the following schema exactly as defined.

### **3.1 Create Tables in This Exact Order**
1. `service_types`
2. `citizens`
3. `households`
4. `incomes`
5. `offices`
6. `users`
7. `cases`
8. `case_events`
9. `documents`
10. `document_requirements`
11. `workflow_definitions`
12. `wizard_definitions`
13. `wizard_sessions`
14. `eligibility_rules`
15. `eligibility_evaluations`

### **3.2 Required Enums**
- `case_status`: `intake`, `pending_docs`, `eligibility_check`, `under_review`, `approved`, `rejected`, `closed`
- `document_type`: `id_card`, `birth_certificate`, `income_proof`, `residence_proof`, `household_declaration`, `other`
- `validation_level`: `basic`, `intermediate`, `strict`
- `role_type`: `system_admin`, `district_intake_officer`, `case_handler`, `case_reviewer`, `department_head`, `audit`

### **3.3 Relationships**
Lovable must configure the FK relations **exactly** as in Technical Architecture v2.

### **3.4 Indexing Requirements**
- Index on `citizens.bis_id`
- Index on `cases.citizen_id`
- Index on `documents.case_id`
- Index on `eligibility_rules.service_type_id`

### **3.5 Seed Data for MVP**
Lovable must insert:
- 3 service_types:
  - GENERAL_ASSISTANCE
  - SOCIAL_ASSISTANCE
  - CHILD_ALLOWANCE
- At least 1 district office
- 1 system_admin user placeholder

### **3.6 Validation Requirements**
Lovable must validate:
- Required fields are NOT nullable unless specified
- Dates use ISO format
- Currency fields are numeric

### **3.7 Completion Criteria for Phase 1**
Lovable must output:
- A full schema report
- Generated SQL migrations
- Confirmation that all tables exist and are linked
- Seed data installed
- No errors or warnings

Lovable must then **await explicit approval**.

---

# **4. Phase 2 – Admin UI Base Foundation**

This phase focuses on converting the HTML template into React components.

### **4.1 Required Layout Components**
Lovable must generate:
- `layouts/AdminLayout.tsx`
- `components/Sidebar.tsx`
- `components/Topbar.tsx`
- `components/PageHeader.tsx`

### **4.2 Required Pages (Empty Shells)**
Lovable must create pages for:
- `/dashboard`
- `/cases`
- `/cases/[id]`
- `/citizens`
- `/citizens/[id]`
- `/documents`
- `/eligibility`
- `/workflows`
- `/wizards`
- `/reports`
- `/settings`

Each page must:
- Render a correct title
- Include placeholder cards or tables
- Use design tokens
- Follow HTML template exactly

### **4.3 Navigation Rules**
- Sidebar links must correspond to pages above
- Active state styling must match template
- Routes must be file‑based when possible

### **4.4 Supabase Integration Setup**
Lovable must:
- Create `supabaseClient.ts`
- Add example queries:
  - Get citizens list
  - Get case list
  - Get uploaded documents

### **4.5 Wizard Shell Components**
Lovable must create:
```
components/wizard/WizardContainer.tsx
components/wizard/WizardStep.tsx
components/wizard/WizardNavigation.tsx
```
These will be populated in Phase 3.

### **4.6 Error Boundaries & Loading States**
Lovable must generate:
- `components/Loading.tsx`
- `components/ErrorState.tsx`

### **4.7 Authentication Shell**
(Not full auth implementation yet)
Lovable must create placeholder pages:
- `/login`
- `/logout`

### **4.8 Completion Criteria for Phase 2**
Lovable must show:
- All pages compile and display
- Layout is 1:1 with HTML
- No broken styles
- No missing components
- Supabase client successfully connects

Lovable then must **await approval**.

---

# **5. Forbidden Actions for Lovable**
Lovable must NOT:
- Modify the schema unless instructed
- Merge steps or restructure wizard flows
- Change layout spacing or colors
- Replace our template with its own components
- Add animations, transitions, or visual effects

---

# **6. Future Build Phases (For Reference)**
(Not included for implementation until approved)

- **Phase 3:** Wizard + Eligibility integration
- **Phase 4:** Case Handling Workspaces
- **Phase 5:** Document Validation Engine
- **Phase 6:** Review Module + Reporting
- **Phase 7:** Security + RLS Policies
- **Phase 8:** Public Portal Foundation

---

# **7. Approval Checklist (For Devmart Use)**
Before moving to next phase, Devmart must confirm:
- [ ] All tables exist in Supabase
- [ ] All relationships validated
- [ ] Seed data correct
- [ ] Pages display correctly
- [ ] Layout matches HTML 1:1
- [ ] Supabase connection works

---

**END OF LOVABLE BUILD INSTRUCTIONS – PHASE 1 & 2 (ENGLISH)**

