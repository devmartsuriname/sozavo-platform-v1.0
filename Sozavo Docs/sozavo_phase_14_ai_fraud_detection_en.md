# SoZaVo Central Social Services Platform – Phase 14 Plan (AI-Based Fraud Detection & Anomaly Analysis)

> **Status:** Implementation Blueprint – Phase 14 (Post-MVP Advanced Intelligence Layer)  
> **Prepared for:** Devmart Suriname – SoZaVo Platform  
> **Scope:** Machine-learning–driven fraud detection, anomaly scoring, risk signals, investigation workflows  
> **Related Docs:** Technical Architecture v2, Eligibility Engine, Reporting Engine, Payment Engine, Phase 1–13 Blueprints

---

# 1. Purpose of Phase 14
Phase 14 introduces **AI-powered fraud detection and anomaly monitoring** to identify high‑risk cases, suspicious payment patterns, duplicate identities, unexpected income shifts, and household irregularities.

This phase strengthens SoZaVo’s ability to:
- Prevent fraud before disbursements occur
- Detect misuse or manipulation of benefits
- Flag risky cases for human review
- Reduce financial losses
- Improve audit readiness

AI does not replace decisions — it **augments case reviewers and auditors**.

---

# 2. Design Principles

1. **Human‑in‑the‑Loop**  
   AI only generates signals; human reviewers make final decisions.

2. **Transparency & Explainability**  
   Every risk score must be explainable via features (e.g., income mismatch, duplicate CCR signals).

3. **Non‑Intrusive**  
   AI flags do not block applications but recommend review.

4. **High‑Value Targets**  
   Detect fraud most likely to impact payments or eligibility.

5. **Privacy Respecting**  
   No model uses unnecessary personal data.

---

# 3. New Data Structures for Phase 14

## 3.1 `fraud_signals`
Tracks raw AI or rule-based signals.

Fields:
- `id`
- `case_id`
- `citizen_id`
- `signal_code` (e.g., `INCOME_MISMATCH`, `DUPLICATE_IDENTITY`, `BANK_ACCOUNT_REUSED`, `HOUSEHOLD_ANOMALY`)
- `severity` (1–5)
- `details_json`
- `created_at`

## 3.2 `fraud_risk_scores`
Aggregate AI output per case.

Fields:
- `id`
- `case_id`
- `citizen_id`
- `risk_score` (0–100)
- `risk_level` (enum: `low`, `medium`, `high`)
- `explanations_json`
- `updated_at`

## 3.3 `fraud_review_logs`
Human review and decisions.

Fields:
- `id`
- `case_id`
- `reviewer_user_id`
- `decision` (enum: `pass`, `needs_followup`, `flag_for_investigation`)
- `notes`
- `created_at`

---

# 4. Fraud Detection Engines

Phase 14 introduces THREE detection engines working together.

---

## 4.1 Engine 1 – **Rule-Based Detection Engine** (Phase 14A)
Simple, deterministic rules catch obvious fraud patterns.

Examples:
- **Duplicate CCR:** same national ID in multiple CCRs
- **Income mismatch:** Subema income > 20,000 SRD but applicant declares 0–5,000 SRD
- **Bank reuse:** bank account number used by multiple unrelated citizens
- **Suspicious document patterns:** repeated use of identical documents
- **Unusual household size:** > 12 individuals flagged

Output:
- Creates entries in `fraud_signals`
- Produces preliminary risk score (0–30)

---

## 4.2 Engine 2 – **Anomaly Detection Model** (Phase 14B)
Uses unsupervised ML (no labeled data needed).

Techniques:
- Isolation Forest
- DBSCAN clustering
- Autoencoder reconstruction error

Features considered:
- Household size deviation
- Payment frequency patterns
- Income changes vs eligibility rules
- Historical service usage
- Suspicious document upload timing

Output:
- Adds anomaly score (0–40)
- Writes signals with model metadata

---

## 4.3 Engine 3 – **Risk Scoring Model** (Phase 14C)
Combines:
- Rule engine signals
- Anomaly engine signals
- Payment history
- Eligibility inconsistencies

Final scoring:
```
0–30  → Low Risk
31–65 → Medium Risk
66–100 → High Risk
```

Each score must have **explainable factors**:
```
explanations_json = [
  { "feature": "Income mismatch", "weight": 0.35 },
  { "feature": "Duplicate ID signals", "weight": 0.20 },
  { "feature": "Bank account reused", "weight": 0.15 }
]
```

---

# 5. Integration Points

### 5.1 Case Detail (Admin)
Add a new **Fraud Check** tab:
- Risk Score (Low/Medium/High)
- Timeline of signals
- Explanation breakdown
- Button: `Run Full Fraud Scan`
- Human review panel

### 5.2 Eligibility Engine Hooks
- If risk level ≥ *medium*, eligibility engine suggests review
- Does NOT auto-block approval

### 5.3 Payments Engine Hooks
- If risk level = *high*, payment batch warns finance officers

---

# 6. Admin Investigation Tooling

A new section:
```
Fraud Center
│
├── High Risk Cases
├── Medium Risk Cases
├── Citizen Identity Checks
└── Household Anomaly Monitor
```

Capabilities:
- Filter by district, service type, risk level
- Investigate individuals or households
- Visualize connections (e.g., bank accounts shared)
- Export investigation summary

---

# 7. ML Training & Deployment Considerations

### 7.1 For MVP+ (Phase 14 initial):
- Use **rules + basic anomaly detection** (no external training server)
- Use Supabase Edge Functions or local JS ML libraries

### 7.2 For full ML (Phase 14 extended):
- Deploy a lightweight model server
- Enable scheduled retraining (monthly)
- Maintain explainability logs

### 7.3 Privacy & Ethics
- No use of demographic bias‑prone features (gender, ethnicity)
- Only use operational data necessary for eligibility & fraud prevention
- Maintain audit trail for all model changes

---

# 8. RLS & Security Rules

- Fraud data visible only to:
  - audit
  - system_admin
  - department_head
  - case_reviewer (limited view)
- No visibility for district officers or citizens
- Exports must go through secure channels
- All signals & reviews logged immutably

---

# 9. Error Handling & Safety

- If ML engine fails → fallback to rules only
- If too many false positives → adjust thresholds
- If missing data → model must reduce confidence, not guess
- If fraud score is high → recommend review, do NOT block payments automatically

---

# 10. Completion Criteria – Phase 14

### Detection Engines:
- [ ] Rule-based detection operational
- [ ] Anomaly detection model operational
- [ ] Combined risk scoring engine operational

### Data & Visibility:
- [ ] Fraud Center functional
- [ ] Fraud tab visible in Case Detail for authorized roles
- [ ] RLS restricts visibility properly

### Explainability:
- [ ] Every risk score ties to explainable factors
- [ ] Signals recorded in `fraud_signals`
- [ ] Reviews logged in `fraud_review_logs`

### Safety:
- [ ] AI does not auto-block benefits
- [ ] Thresholds adjustable by admin
- [ ] Model fallback handling implemented

After completion, Lovable MUST await explicit approval for Phase 15 (System Governance, Compliance, Data Retention & Audit Framework).

---

**END OF PHASE 14 PLAN – AI-BASED FRAUD DETECTION & ANOMALY ANALYSIS (ENGLISH)**

