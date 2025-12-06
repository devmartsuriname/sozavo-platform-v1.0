# SoZaVo Central Social Services Platform – Phase 13 Plan (Financial Reporting & Disbursement Forecasts)

> **Status:** Implementation Blueprint – Phase 13 (Post-MVP Financial Intelligence Layer)  
> **Prepared for:** Devmart Suriname – SoZaVo Platform  
> **Scope:** Financial analytics, expenditure reporting, forecast modeling, reconciliation dashboards  
> **Related Docs:** Technical Architecture v2, Reporting Engine (Phase 11), Payments & Disbursement Plan (Phase 12), Eligibility Engine, Messaging System

---

# 1. Purpose of Phase 13
Phase 13 introduces **financial intelligence** into the SoZaVo platform.

This phase enables:
- Real-time visibility into expenditures
- Budget forecasting for each social service
- Monitoring of payment patterns (approved, rejected, failed)
- Predicting monthly and yearly financial obligations
- Assisting directors and finance officers with planning and accountability

This is the first phase that aligns SoZaVo’s digital platform with **national budgeting and treasury requirements**.

---

# 2. Design Principles

1. **Accuracy First**  
   Forecasts must rely only on reliable data: approved cases, active cases, service rules.

2. **Explainability**  
   Every number must be traceable to underlying payment items or eligibility results.

3. **Separation of Financial Logic**  
   Use a dedicated forecasting engine; never embed logic in UI.

4. **High-Level + Detailed Views**  
   Directors see budgets; finance officers see detailed breakdowns.

5. **Security and Privacy**  
   Financial data is highly sensitive; RLS applies strictly.

---

# 3. Data Model Enhancements for Phase 13

### 3.1 Materialized Views (Financial)

#### MV5: `mv_monthly_expenditures`
Fields:
- `month`
- `year`
- `service_type_id`
- `total_amount_paid`
- `total_amount_failed`
- `total_cases_paid`
- `updated_at`

#### MV6: `mv_forecast_next_12_months`
Fields:
- `month`
- `year`
- `service_type_id`
- `expected_beneficiaries`
- `expected_expenditure`
- `updated_at`

#### MV7: `mv_district_financial_summary`
Fields:
- `district`
- `service_type_id`
- `total_amount_paid`
- `total_pending_amount`
- `updated_at`

---

# 4. Financial Forecast Engine

New module:
```
src/integrations/engines/financialForecastEngine.ts
```

### Responsibilities:
- Estimate next-month and next-year expenditure
- Forecast based on:
  - Active approved cases
  - Recurring monthly service payments
  - Household size or income modifiers (if applicable)
  - Case expiration or renewal rules
- Integrate with payment_batches + payment_items

### Example Forecast Logic (configurable):
- **General Assistance:** fixed monthly payment × number of active cases
- **Social Assistance:** variable amount; forecast from latest eligibility evaluation
- **Child Allowance:** per-child monthly rate × total eligible children

Forecast engine must allow switching between:
- Conservative model (min)  
- Standard model (expected)  
- Expanded model (max)  

---

# 5. Reconciliation Dashboard

A new admin area:
```
Financial Reports
│
├── Expenditure Overview
├── Monthly Forecasts
├── District Financial View
└── Reconciliation Center
```

---

# 6. Dashboard Pages

## 6.1 Expenditure Overview
Shows:
- Total expenditure by service type
- Month-over-month trend lines
- Breakdown of paid vs failed payments
- Cost per district

Widgets:
- KPI tiles
- Line graph
- Bar chart for district comparison

---

## 6.2 Monthly Forecasts
Provides:
- Next 12 months expenditure projection
- Beneficiary growth/decline trends
- Forecast assumptions (shown clearly for transparency)

Filters:
- District
- Service type
- Scenario (min/expected/max)

---

## 6.3 District Financial View
District directors can monitor:
- Approved vs paid cases
- Payment totals
- Pending payments
- Forecasted district-level obligations

RLS Enforcement:
- District officers see only their district
- Finance officers and department heads see all

---

## 6.4 Reconciliation Center
Enables the finance department to:
- Compare batch export totals vs bank-confirmed totals
- Identify discrepancies
- Mark unresolved mismatches
- Export reconciliation reports

---

# 7. Financial Calculations – Requirements

### 7.1 Accuracy Rules
- Use only **approved** cases for forecasts
- Exclude cases with missing bank info
- Use latest eligibility result for variable payments
- Recalculate forecasts nightly (cron refresh of materialized views)

### 7.2 Transparency Rules
For each forecast amount, engine must be able to answer:
- How was this amount computed?
- Which beneficiaries are included?
- Which service rules were applied?

---

# 8. UI Requirements

- Clear labeling (e.g., “Forecast – Expected Scenario”)
- Drilldown from aggregated numbers → payment_items → case
- Export buttons for CSV/PDF
- Tooltips explaining each metric
- Warning banners if data is incomplete

---

# 9. Security & RLS Requirements

1. Financial dashboards restricted to:
   - finance_officer
   - department_head
   - system_admin
   - audit

2. District-level filtering enforced through RLS

3. Forecasts must **never** expose personal details to unauthorized roles

4. Exported data must:
   - Use pre-signed URLs
   - Be logged in `report_export_logs`

5. Forecast views should default to aggregated data, not payment_items

---

# 10. Error Handling

- If MV refresh fails → show fallback and notify admin
- If forecast engine encounters missing data → display warning
- If reconciliation mismatches occur → highlight and tag
- If data volume too large → paginate or chunk queries

---

# 11. Completion Criteria for Phase 13

### Data Layer:
- [ ] Materialized views MV5–MV7 created
- [ ] Forecast engine operational
- [ ] Nightly MV refresh jobs implemented

### UI Layer:
- [ ] Expenditure Overview dashboard completed
- [ ] Monthly Forecasts dashboard completed
- [ ] District Financial View completed
- [ ] Reconciliation Center completed

### Security:
- [ ] RLS limits visibility by role & district
- [ ] Sensitive details hidden from non-finance roles
- [ ] Export logs work correctly

### Performance:
- [ ] Dashboards load < 1.5s
- [ ] Forecast calculations optimized

After completion, Lovable MUST await explicit approval before any Phase 14 planning.

---

**END OF PHASE 13 PLAN – FINANCIAL REPORTING & DISBURSEMENT FORECASTS (ENGLISH)**

