# SoZaVo Central Social Services Platform – Phase 25 (National Social Protection Insights Dashboard)

> **Status:** Phase 25 – Cabinet-Level Insights Dashboard Specification (v1.0)  
> **Prepared for:** Ministry of Social Affairs & Housing (SoZaVo), Vice President’s Office, Ministry of Finance  
> **Prepared by:** Devmart Suriname  
> **Scope:** National analytics dashboard for policymakers; real-time metrics, forecasting, fraud insights, financial reporting, household vulnerability indicators  
> **Related Docs:** Phases 1–24, Transformation Roadmap, Eligibility Engine, Fraud Engine, Data Exchange Protocol

---

# 1. Purpose of Phase 25
The National Social Protection Insights Dashboard is designed for **Cabinet-level decision‑making**. It consolidates multi-ministry data to provide:
- Real-time visibility into social benefit distribution
- Financial exposure and forecasts
- Fraud and anomaly detection signals
- Household vulnerability and poverty indicators
- Operational performance of district offices

This dashboard supports **evidence-based policymaking**, enabling leadership to guide national welfare strategy.

---

# 2. Target Users (Cabinet-Level Roles)
| Role | Primary Use |
|------|-------------|
| **Vice President** | National trends, risk indicators, budget exposure |
| **Minister of Social Affairs** | Program performance, case volumes, district operations |
| **Minister of Finance** | Payment forecasting, income distribution trends |
| **Director SoZaVo** | Operational efficiency, bottlenecks, fraud alerts |
| **DSSC Governance Committee** | Audit, compliance, system health |
| **Policy Advisors** | Simulations, demographic insights |

---

# 3. Design Principles
1. **Executive-Level Clarity** — insights must be immediately interpretable.
2. **Real-Time Data** — refreshed every 5 minutes for critical metrics.
3. **Predictive Analytics** — forecasting and risk scoring built-in.
4. **Comparative Views** — district vs. district, month vs. month.
5. **Accessible Anywhere** — responsive, tablet-friendly layouts.
6. **Secure by Default** — RLS, MFA, and full audit logging.

---

# 4. Dashboard Architecture
The Insights Dashboard is composed of **six primary modules**:
1. National Overview
2. Financial Analytics & Forecasting
3. Household Vulnerability Index
4. Fraud & Anomaly Intelligence
5. District Performance & Operations
6. System Health & Workflow Efficiency

Each module has its own page and widget set.

---

# 5. Module 1 – National Overview
The high-level executive summary.

## 5.1 Key Metrics (Top Bar)
- **Total Active Beneficiaries**
- **Monthly Benefit Expenditure**
- **Pending Cases (National)**
- **Approval Rate**
- **Average Processing Time**
- **Households Under Review (Risk Flagged)**

## 5.2 Trend Charts
- Applications Over Time (line chart)
- Approvals vs. Rejections per month
- Benefit distribution by service type

## 5.3 Geographic Heatmap
Visualization by district:
- Density of beneficiaries
- Income distribution patterns
- Vulnerability scores

---

# 6. Module 2 – Financial Analytics & Forecasting
This module supports the Vice President and Minister of Finance.

## 6.1 Key Widgets
- **Monthly Spending (Actual vs. Budget)**
- **Quarterly Forecast (Predictive)**
- **Average Benefit Amount per Service**
- **Bank Reconciliation Status**

## 6.2 Forecasting Engine
- Powered by historical case volumes + demographic + income trends
- Models: ARIMA + Gradient Boosting regression
- Forecast horizon: 3 months, 6 months, 12 months

## 6.3 Cost Exposure Alerts
Triggered when predicted payouts exceed:
- Budget thresholds
- District caps
- Sudden spikes in new beneficiaries

---

# 7. Module 3 – Household Vulnerability Index
A national indicator measuring social risk.

## 7.1 Composite Scoring (0–100)
Factors:
- Household income (Subema)
- Household size
- Number of dependents
- Health indicators (child nutrition, disabilities)
- Geographic risk exposure (flood zones, remote areas)

## 7.2 Visualizations
- National vulnerability heatmap
- Top 10 most vulnerable districts
- Changes over time (12-month trend)

## 7.3 What-if Simulations
Scenario analysis:
- "What if benefit amount increases by X%?"
- "What if eligibility threshold changes?"
- "Impact of population growth on benefits"

---

# 8. Module 4 – Fraud & Anomaly Intelligence
Aligned with Phase 14 (AI Fraud Engine).

## 8.1 Core Metrics
- Fraud Risk Scores by District
- Anomalous Applications (past 30 days)
- Duplicate households
- Income mismatch alerts
- Clusters detected by unsupervised learning

## 8.2 Heatmap View
Color-coded risk distribution across all districts.

## 8.3 Case Investigator Tools
- Drill down from cluster → household → individual case
- Export to governance committee
- Red flag indicators:
  - Repeated household members across unrelated families
  - Suspicious income patterns
  - Document tampering signals

---

# 9. Module 5 – District Performance & Operations
Operational KPI center.

## 9.1 Metrics by District
- Intake volume
- Processing time (avg & median)
- Pending cases by stage
- Rejection/Approval ratios
- Staff productivity indicators

## 9.2 District Comparison Table
Benchmarks:
- Best-performing district
- Underperforming districts
- Bottleneck identification

## 9.3 Workforce Load Balancing
AI-based suggestions:
- "Transfer 120 cases from Wanica to Paramaribo for balanced load."

---

# 10. Module 6 – System Health & Workflow Efficiency
Ensures the platform is operational and performant.

## 10.1 Technical System Metrics
- Uptime (target 99.9%)
- API response times
- Queue depth (wizard saves, eligibility runs)
- Storage usage trends

## 10.2 Workflow Bottleneck Analysis
- Time spent at each case stage
- Abandoned wizards
- Document upload failure rates

## 10.3 Alerts
- BIS down
- Subema unreachable
- Payment export rejected

---

# 11. Dashboard Technology Stack
- **Frontend:** React + Tailwind (admin-theme variant)
- **Data Layer:** Supabase + Data Warehouse (future)
- **Visualization:** Recharts / ECharts
- **Real-Time Updates:** Supabase Realtime + cron processes
- **Prediction Engine:** Edge Functions + Python microservices (future)

---

# 12. Security & Access Control
- Strict RLS policies
- Role: **Cabinet_Dashboard_Viewer**
- MFA mandatory
- All exports logged
- Sensitive data masked unless policy allows

---

# 13. Completion Criteria – Phase 25
### Analytics Framework:
- [ ] All modules defined with widget lists
- [ ] Predictive models identified
- [ ] Risk scoring outputs aligned with Fraud Engine

### Technical:
- [ ] Real-time + batch update architecture confirmed
- [ ] Visualization stack approved

### Governance:
- [ ] Access roles defined (Cabinet, Minister, Director)
- [ ] Data masking rules approved

After Phase 25, Lovable MUST await explicit approval before Phase 26 (Legal & Policy Modernization Requirements).

---

**END OF PHASE 25 – NATIONAL SOCIAL PROTECTION INSIGHTS DASHBOARD (ENGLISH)**

