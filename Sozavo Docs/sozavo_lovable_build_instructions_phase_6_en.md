# SoZaVo Central Social Services Platform – Lovable Build Instructions (Phase 6: Review Module, Reporting & Dashboards)

> **Status:** Implementation Blueprint – Phase 6  
> **Prepared for:** Devmart Suriname – SoZaVo MVP Build  
> **Scope:** Review module enhancements, analytics dashboard, reporting layer  
> **Related Docs:** PRD v2, Workflow Blueprint v2, Technical Architecture v2, Eligibility Rules Framework v1, Wizard Step Definitions v1, Build Instructions Phases 1–5

---

# 1. Purpose of Phase 6
Phase 6 introduces the **review workflow**, **reporting**, and **dashboard analytics**, giving SoZaVo leadership and department heads real-time operational visibility.

Lovable must implement:
- Reviewer decision workflows (approval/rejection UI + backend logic)
- Analytics dashboard (KPIs, charts, tables)
- Reporting module (export capabilities + structured report pages)

Lovable must NOT introduce new schema or modify design tokens.

---

# 2. Global Rules for Lovable in Phase 6

Lovable MUST:
- Use only existing data tables (`cases`, `case_events`, etc.)
- Render dashboards using HTML → React (no external chart libraries unless explicitly permitted)
- Keep all business logic inside dedicated engines
- Await approval before Phase 7

Lovable MUST NOT:
- Modify schema
- Add stylistic changes
- Hardcode values that belong in the database

---

# 3. Reviewer Module Enhancements

Phase 4 introduced the basic reviewer workspace. Phase 6 must add:

## 3.1 Reviewer Decision Panel
On the Reviewer Case View (`/cases/review/[id]`), Lovable must add:
- Summary panel showing:
  - Eligibility result
  - Missing documents summary
  - Last status change
- Decision inputs:
  - "Approve Case" (button)
  - "Reject Case" (button + required comment field)

## 3.2 Decision Logic
Upon reviewer action:
- Call `workflowEngine.transitionCase` to update status
- Insert a `case_events` entry:
  - `event_type = 'review_performed'`
  - `meta` must include:
    - decision
    - reviewer_id
    - notes/comments

## 3.3 Locking Logic
After approving/rejecting:
- A case becomes read-only for district officers and handlers
- Only reviewers and admins may view details

This is **logic-only**; RLS comes later.

---

# 4. Dashboard Analytics

Create page:
```
/pages/dashboard/index.tsx
```

Dashboard must show summary KPIs:
- Total active cases
- Cases by status
- Cases by service type
- Cases pending review
- Average processing time (use `case_events` timestamps)

## 4.1 Charts
Lovable must use simple, template-consistent chart components (bar, donut). If charts do not exist in template:
- Use simple HTML/Tailwind-based visual blocks
- DO NOT add new chart libraries unless permitted

## 4.2 Data Loading
Lovable must create functions:
```
getCaseStats()
getCasesByStatus()
getCasesByServiceType()
getAvgProcessingTime()
```
Located in:
```
src/integrations/supabase/queries/reports.ts
```

---

# 5. Reporting Module

Create pages under:
```
/pages/reports/
```

Required reports:
- **Monthly Service Report**
- **District Performance Report**
- **Eligibility Outcomes Report**

## 5.1 Report Structure Requirements
Each report must:
- Use existing admin template tables
- Contain filtering options (date range, service, district)
- Show summary totals + detailed rows

## 5.2 Export Options
Lovable must implement **CSV export only** for MVP:
- Button: `Export as CSV`
- Export must include all rows visible under selected filters
- File name format: `reportname_YYYYMMDD.csv`

PDF export is NOT allowed in MVP.

---

# 6. Case Timeline Visualization

Add to Case Detail → Case History tab:
- A vertical timeline component listing events
- Must use basic HTML/Tailwind from template
- Must display:
  - Timestamp
  - Actor
  - Event type
  - Optional metadata

No animations may be added.

---

# 7. Performance Considerations

Lovable must:
- Use pagination for large reports
- Use indexed queries (as defined in Phase 1)
- Avoid loading entire datasets at once

---

# 8. Forbidden Actions in Phase 6

Lovable must NOT:
- Add new tables or fields
- Introduce new chart libraries
- Modify design system
- Add automatic approval logic (only UI and manual actions allowed)

---

# 9. Completion Criteria for Phase 6

Phase 6 is complete when:
- [ ] Reviewer module fully functional (decision panel, comments, locking)
- [ ] Dashboard shows all KPIs and charts with real data
- [ ] Reporting module supports filtering and CSV export
- [ ] Case history timeline is implemented
- [ ] No schema changes or design deviations were introduced

After completion, Lovable MUST await explicit approval before starting Phase 7.

---

**END OF LOVABLE BUILD INSTRUCTIONS – PHASE 6 (REVIEW, REPORTING & DASHBOARDS, ENGLISH)**

