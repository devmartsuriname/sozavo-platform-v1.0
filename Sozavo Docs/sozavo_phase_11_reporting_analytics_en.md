# SoZaVo Central Social Services Platform – Phase 11 Plan (Reporting Engine & Analytics Dashboard)

> **Status:** Implementation Blueprint – Phase 11 (MVP+ / Director-Level Feature)  
> **Prepared for:** Devmart Suriname – SoZaVo Platform  
> **Scope:** Reporting Engine, Analytics Dashboard, KPI Framework, Data Aggregation Layer  
> **Related Docs:** PRD v2, Workflow Blueprint v2, Technical Architecture v2, Notification & Messaging Plan (Phase 10), Build Instructions Phases 1–10

---

# 1. Purpose of Phase 11
Phase 11 provides SoZaVo with **real-time operational visibility** over programs and case processing.

Goals:
- Deliver an internal dashboard showing live KPIs
- Provide department-level and district-level reporting
- Enable exports for auditors, decision-makers, and supervisors
- Introduce a dedicated Reporting Engine that aggregates data efficiently
- Avoid heavy load on transactional tables

This phase is leadership-facing and must be **fast, reliable, and simple**.

---

# 2. Design Principles

1. **Separation of Analytics from Transactions**  
   Avoid heavy queries on core tables; use pre-aggregated materialized views.

2. **Role-Based Visibility**  
   Department heads, directors, reviewers, and audit roles have increasing visibility.

3. **Performance First**  
   Dashboards must load in under 1.5 seconds.

4. **Explainable Numbers**  
   Every metric must be traceable to case-level data.

5. **Future-Proof**  
   Allow adding new services (food aid, housing subsidies) without redesign.

---

# 3. Analytics Data Model Components

The analytics layer adds **materialized views**, **summary tables**, and a **reporting engine**.

## 3.1 Materialized Views (MV)
These will be updated automatically via scheduled refresh.

### MV1: `mv_case_counts_by_status`
Fields:
- `service_type_id`
- `status`
- `count`
- `district`
- `updated_at`

### MV2: `mv_case_processing_times`
Fields:
- `service_type_id`
- `avg_days_intake_to_review`
- `avg_days_review_to_decision`
- `avg_days_total`
- `district`
- `updated_at`

### MV3: `mv_income_verification_stats`
Fields:
- `service_type_id`
- `subema_verified`
- `bis_verified`
- `manual_only`
- `updated_at`

### MV4: `mv_document_submission_stats`
Fields:
- `service_type_id`
- `submitted_on_time`
- `submitted_late`
- `missing_docs`
- `updated_at`

---

## 3.2 Reporting Tables
Optional but recommended for audit consistency.

### Table: `report_export_logs`
Fields:
- `id`
- `report_type` (enum: cases, payments, processing_times, etc.)
- `requested_by_user_id`
- `parameters_json`
- `export_url`
- `created_at`

---

# 4. Reporting Engine Architecture

### File: `src/integrations/engines/reportingEngine.ts`
Responsibilities:
- Provide safe, RLS-respecting access to analytics
- Expose high-level functions:

```ts
getCaseCounts(params)
getProcessingTimeStats(params)
getIncomeVerificationStats(params)
getDocumentStats(params)
exportReport(reportType, params)
```

- Use **materialized views** for all aggregate queries
- Fall back to transactional tables only when necessary (small slices)

---

# 5. Analytics Dashboard (Admin UI)

A new section in the Admin Sidebar:
```
Analytics
│
├── Overview Dashboard
├── Service Performance
├── District Reports
└── Export Center
```

---

# 6. Dashboard Pages

## 6.1 Overview Dashboard
Displays universal KPIs:
- Total applications (today / this week / this month)
- Cases by status (pie/bar chart)
- Average processing times
- Pending document submissions
- Eligibility outcomes (eligible / not eligible / needs review)

Widgets:
- KPI tiles (4–6 tiles)
- Line chart for trends
- Pie/bar charts for status breakdown

---

## 6.2 Service Performance Dashboard
Event-level metrics for:
- General Assistance
- Social Assistance (incl. Moni Karta)
- Child Allowance

Shows:
- Volume of applications per week
- Approval vs rejection rates
- Average time from intake → decision
- Document compliance rate
- BIS / Subema verification usage

---

## 6.3 District Reports
For directors, district managers, supervisors.

Metrics:
- Cases submitted per district
- Processing speed per district
- Document submission performance per district
- Demographics (age group, household size)

RLS Enforcement:
- District officers see only their own district
- Department heads see all
- Audit sees all

---

## 6.4 Export Center
Admins can export:
- Case list (filtered)
- Processing time reports
- Income verification reports
- Document compliance reports

Exports generated via Edge Function:
```
exportReport(reportType, params)
```

Files stored in:
- `exports/` bucket in Supabase Storage

All exports logged in `report_export_logs`.

---

# 7. UI Implementation Requirements

### 7.1 Charts & Visualizations
Use a consistent charting library (e.g., Recharts):
- Line charts
- Bar charts
- Pie charts
- KPI metric tiles

### 7.2 Filters
Each analytics page must support filtering by:
- Date range
- Service type
- District
- Status

### 7.3 Performance
- Load data from materialized views
- Show skeleton loaders
- Avoid blocking UI

---

# 8. RLS & Security

1. **RLS must apply to materialized views** using `security_invoker = true` PostgreSQL logic (managed by Devmart).
2. **District-level restrictions** must cascade into aggregated results.
3. **Audit role** may view all analytics.
4. **Exports** must include only data visible to the requester.

---

# 9. Error Handling

- If a materialized view fails to refresh → show fallback message
- If export fails → allow retry and log error
- If no data available → show empty-state UI
- If filters produce too large a range → warn user (performance protection)

---

# 10. Completion Criteria for Phase 11

Phase 11 is complete when:

### Data Layer:
- [ ] All materialized views exist and refresh correctly
- [ ] `reportingEngine.ts` can retrieve all KPIs
- [ ] RLS applied to MV queries

### UI Layer:
- [ ] Overview Dashboard implemented
- [ ] Service Performance Dashboard implemented
- [ ] District Reports page implemented
- [ ] Export Center implemented

### Exports:
- [ ] Export Edge Function operational
- [ ] Export logs stored in `report_export_logs`
- [ ] Files are downloadable from Storage

### Security:
- [ ] RLS restrictions apply to all reporting data
- [ ] Directors, department heads, audit roles have expanded visibility only
- [ ] No sensitive citizen detail leaked in aggregated views

After completion, Lovable MUST await explicit approval before Phase 12 (Payments & Disbursement Integration – optional future phase).

---

**END OF PHASE 11 PLAN – REPORTING ENGINE & ANALYTICS DASHBOARD (ENGLISH)**

