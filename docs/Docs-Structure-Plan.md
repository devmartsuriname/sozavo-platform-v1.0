# SoZaVo Platform v1.0 – Documentation Structure Plan

> **Version:** 1.0  
> **Status:** Proposed Plan (NOT EXECUTED)  
> **Purpose:** Reorganization blueprint for existing documentation

---

## 1. Current State

### 1.1 Current Location
All 34 documents are currently in a flat structure under:
```
/Sozavo Docs/
```

### 1.2 Current Document List
1. sozavo_prd_v_2_en.md
2. sozavo_technical_architecture_v_2_en.md
3. sozavo_workflow_blueprint_v_2_en.md
4. sozavo_wizard_step_definitions_v1_en.md
5. sozavo_eligibility_rules_framework_v1_en.md
6. sozavo_bis_ccr_field_mapping_v1_en.md
7. sozavo_subema_integration_plan_v1_en.md
8. sozavo_role_permission_matrix_v1_en.md
9. sozavo_lovable_build_instructions_phase_1_2_en.md
10. sozavo_lovable_build_instructions_phase_3_en.md
11. sozavo_lovable_build_instructions_phase_4_en.md
12. sozavo_lovable_build_instructions_phase_5_en.md
13. sozavo_lovable_build_instructions_phase_6_en.md
14. sozavo_lovable_build_instructions_phase_7_en.md
15. sozavo_lovable_build_instructions_phase_8_en.md
16. sozavo_lovable_build_instructions_phase_9_en.md
17. sozavo_lovable_build_instructions_phase_10_en.md
18. sozavo_lovable_build_instructions_phase_11_en.md
19. sozavo_lovable_build_instructions_phase_12_en.md
20. sozavo_lovable_build_instructions_phase_13_en.md
21. sozavo_lovable_build_instructions_phase_14_en.md
22. sozavo_lovable_build_instructions_phase_15_en.md
23. sozavo_lovable_build_instructions_phase_16_en.md
24. sozavo_lovable_build_instructions_phase_17_en.md
25. sozavo_lovable_build_instructions_phase_18_en.md
26. sozavo_lovable_build_instructions_phase_19_en.md
27. sozavo_lovable_build_instructions_phase_20_en.md
28. sozavo_lovable_build_instructions_phase_21_en.md
29. sozavo_lovable_build_instructions_phase_22_en.md
30. sozavo_lovable_build_instructions_phase_23_en.md
31. sozavo_lovable_build_instructions_phase_25_en.md
32. sozavo_lovable_build_instructions_phase_26_en.md
33. sozavo_lovable_build_instructions_phase_27_28_29_en.md
34. Onbekend document (if exists)

**Note:** Phase 24 is intentionally omitted per project requirements.

---

## 2. Proposed Structure

### 2.1 New Folder Organization

```
/docs/
├── 01-foundation/
│   ├── PRD.md                          (consolidated)
│   ├── Architecture.md                 (consolidated)
│   └── Workflow-Blueprint.md
│
├── 02-specifications/
│   ├── Wizard-Step-Definitions.md
│   ├── Eligibility-Rules-Framework.md
│   └── Role-Permission-Matrix.md
│
├── 03-integrations/
│   ├── BIS-CCR-Field-Mapping.md
│   └── Subema-Integration-Plan.md
│
├── 04-backend/
│   └── Backend.md                      (consolidated)
│
├── 05-phases-mvp/
│   ├── Phase-01-02-Database-UI.md
│   ├── Phase-03-Wizard-CCR.md
│   ├── Phase-04-Case-Handling.md
│   ├── Phase-05-Documents.md
│   ├── Phase-06-Review-Reporting.md
│   ├── Phase-07-Security-RLS.md
│   ├── Phase-08-Portal-Foundation.md
│   └── Phase-09-Eligibility-Engine.md
│
├── 06-phases-extended/
│   ├── Phase-10-Payments.md
│   ├── Phase-11-BIS-Integration.md
│   ├── Phase-12-Subema-Integration.md
│   ├── Phase-13-Notifications.md
│   ├── Phase-14-Fraud-Detection.md
│   ├── Phase-15-Audit.md
│   ├── Phase-16-Performance.md
│   └── Phase-17-Workflow-Automation.md
│
├── 07-phases-strategic/
│   ├── Phase-18-Multi-Language.md
│   ├── Phase-19-Mobile.md
│   ├── Phase-20-Analytics.md
│   ├── Phase-21-Monitoring.md
│   ├── Phase-22-Disaster-Recovery.md
│   ├── Phase-23-Advanced-Reporting.md
│   ├── Phase-25-Inter-Ministry.md
│   ├── Phase-26-Identity-Verification.md
│   └── Phase-27-28-29-Appeals-Batch-API.md
│
├── 08-governance/
│   └── (Future: Compliance, Policies)
│
├── 09-roadmap/
│   └── Tasks.md                        (consolidated)
│
└── 10-reference/
    └── Docs-Structure-Plan.md          (this document)
```

---

## 3. Document Mapping

### 3.1 Foundation Documents

| Current File | Proposed Location | Action |
|--------------|-------------------|--------|
| sozavo_prd_v_2_en.md | /docs/01-foundation/PRD-Original.md | Archive |
| sozavo_technical_architecture_v_2_en.md | /docs/01-foundation/Architecture-Original.md | Archive |
| sozavo_workflow_blueprint_v_2_en.md | /docs/01-foundation/Workflow-Blueprint.md | Move |
| (New) PRD.md | /docs/01-foundation/PRD.md | Already created |
| (New) Architecture.md | /docs/01-foundation/Architecture.md | Already created |

### 3.2 Specification Documents

| Current File | Proposed Location | Action |
|--------------|-------------------|--------|
| sozavo_wizard_step_definitions_v1_en.md | /docs/02-specifications/Wizard-Step-Definitions.md | Move |
| sozavo_eligibility_rules_framework_v1_en.md | /docs/02-specifications/Eligibility-Rules-Framework.md | Move |
| sozavo_role_permission_matrix_v1_en.md | /docs/02-specifications/Role-Permission-Matrix.md | Move |

### 3.3 Integration Documents

| Current File | Proposed Location | Action |
|--------------|-------------------|--------|
| sozavo_bis_ccr_field_mapping_v1_en.md | /docs/03-integrations/BIS-CCR-Field-Mapping.md | Move |
| sozavo_subema_integration_plan_v1_en.md | /docs/03-integrations/Subema-Integration-Plan.md | Move |

### 3.4 Backend Documents

| Current File | Proposed Location | Action |
|--------------|-------------------|--------|
| (New) Backend.md | /docs/04-backend/Backend.md | Already created |

### 3.5 MVP Phase Documents

| Current File | Proposed Location | Action |
|--------------|-------------------|--------|
| sozavo_lovable_build_instructions_phase_1_2_en.md | /docs/05-phases-mvp/Phase-01-02-Database-UI.md | Move |
| sozavo_lovable_build_instructions_phase_3_en.md | /docs/05-phases-mvp/Phase-03-Wizard-CCR.md | Move |
| sozavo_lovable_build_instructions_phase_4_en.md | /docs/05-phases-mvp/Phase-04-Case-Handling.md | Move |
| sozavo_lovable_build_instructions_phase_5_en.md | /docs/05-phases-mvp/Phase-05-Documents.md | Move |
| sozavo_lovable_build_instructions_phase_6_en.md | /docs/05-phases-mvp/Phase-06-Review-Reporting.md | Move |
| sozavo_lovable_build_instructions_phase_7_en.md | /docs/05-phases-mvp/Phase-07-Security-RLS.md | Move |
| sozavo_lovable_build_instructions_phase_8_en.md | /docs/05-phases-mvp/Phase-08-Portal-Foundation.md | Move |
| sozavo_lovable_build_instructions_phase_9_en.md | /docs/05-phases-mvp/Phase-09-Eligibility-Engine.md | Move |

### 3.6 Extended Phase Documents

| Current File | Proposed Location | Action |
|--------------|-------------------|--------|
| sozavo_lovable_build_instructions_phase_10_en.md | /docs/06-phases-extended/Phase-10-Payments.md | Move |
| sozavo_lovable_build_instructions_phase_11_en.md | /docs/06-phases-extended/Phase-11-BIS-Integration.md | Move |
| sozavo_lovable_build_instructions_phase_12_en.md | /docs/06-phases-extended/Phase-12-Subema-Integration.md | Move |
| sozavo_lovable_build_instructions_phase_13_en.md | /docs/06-phases-extended/Phase-13-Notifications.md | Move |
| sozavo_lovable_build_instructions_phase_14_en.md | /docs/06-phases-extended/Phase-14-Fraud-Detection.md | Move |
| sozavo_lovable_build_instructions_phase_15_en.md | /docs/06-phases-extended/Phase-15-Audit.md | Move |
| sozavo_lovable_build_instructions_phase_16_en.md | /docs/06-phases-extended/Phase-16-Performance.md | Move |
| sozavo_lovable_build_instructions_phase_17_en.md | /docs/06-phases-extended/Phase-17-Workflow-Automation.md | Move |

### 3.7 Strategic Phase Documents

| Current File | Proposed Location | Action |
|--------------|-------------------|--------|
| sozavo_lovable_build_instructions_phase_18_en.md | /docs/07-phases-strategic/Phase-18-Multi-Language.md | Move |
| sozavo_lovable_build_instructions_phase_19_en.md | /docs/07-phases-strategic/Phase-19-Mobile.md | Move |
| sozavo_lovable_build_instructions_phase_20_en.md | /docs/07-phases-strategic/Phase-20-Analytics.md | Move |
| sozavo_lovable_build_instructions_phase_21_en.md | /docs/07-phases-strategic/Phase-21-Monitoring.md | Move |
| sozavo_lovable_build_instructions_phase_22_en.md | /docs/07-phases-strategic/Phase-22-Disaster-Recovery.md | Move |
| sozavo_lovable_build_instructions_phase_23_en.md | /docs/07-phases-strategic/Phase-23-Advanced-Reporting.md | Move |
| sozavo_lovable_build_instructions_phase_25_en.md | /docs/07-phases-strategic/Phase-25-Inter-Ministry.md | Move |
| sozavo_lovable_build_instructions_phase_26_en.md | /docs/07-phases-strategic/Phase-26-Identity-Verification.md | Move |
| sozavo_lovable_build_instructions_phase_27_28_29_en.md | /docs/07-phases-strategic/Phase-27-28-29-Appeals-Batch-API.md | Move |

### 3.8 Task Documents

| Current File | Proposed Location | Action |
|--------------|-------------------|--------|
| (New) Tasks.md | /docs/09-roadmap/Tasks.md | Already created |

---

## 4. Index Files

Each folder should contain an index file for navigation:

```markdown
# /docs/01-foundation/README.md

## Foundation Documents

This folder contains the core project documentation:

- [PRD.md](./PRD.md) - Product Requirements Document
- [Architecture.md](./Architecture.md) - System Architecture
- [Workflow-Blueprint.md](./Workflow-Blueprint.md) - Workflow Definitions

## Original Documents (Archived)
- [PRD-Original.md](./PRD-Original.md) - Original PRD v2
- [Architecture-Original.md](./Architecture-Original.md) - Original Technical Architecture v2
```

---

## 5. Notes on Phase 24

**Phase 24 is intentionally omitted from this structure.**

Per project requirements:
- Phase 24 will use a frontend HTML template
- No documentation is to be generated for Phase 24
- This gap is intentional and not an error

---

## 6. Execution Plan

When approved, the following steps will be executed:

### Step 1: Create Folder Structure
```
mkdir -p docs/01-foundation
mkdir -p docs/02-specifications
mkdir -p docs/03-integrations
mkdir -p docs/04-backend
mkdir -p docs/05-phases-mvp
mkdir -p docs/06-phases-extended
mkdir -p docs/07-phases-strategic
mkdir -p docs/08-governance
mkdir -p docs/09-roadmap
mkdir -p docs/10-reference
```

### Step 2: Move Consolidated Documents
- PRD.md → /docs/01-foundation/
- Architecture.md → /docs/01-foundation/
- Backend.md → /docs/04-backend/
- Tasks.md → /docs/09-roadmap/

### Step 3: Archive Original Foundation Docs
- sozavo_prd_v_2_en.md → /docs/01-foundation/PRD-Original.md
- sozavo_technical_architecture_v_2_en.md → /docs/01-foundation/Architecture-Original.md

### Step 4: Move Remaining Documents
- Move all specification documents
- Move all integration documents
- Move all phase documents

### Step 5: Create Index Files
- Create README.md for each folder

### Step 6: Verify and Clean Up
- Verify all documents are in correct locations
- Remove empty original folder (if approved)

---

## 7. Status

| Action | Status |
|--------|--------|
| Proposed folder structure | ✓ Defined |
| Document mapping | ✓ Complete |
| Execution plan | ✓ Documented |
| Approval | ⏳ AWAITING |
| Execution | ⏳ NOT STARTED |

---

**THIS IS A PLAN ONLY. NO REORGANIZATION HAS BEEN EXECUTED.**

Awaiting explicit approval before proceeding with document restructuring.

---

**END OF DOCUMENTATION STRUCTURE PLAN v1.0**
