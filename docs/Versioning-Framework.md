# SoZaVo Platform v1.0 – Versioning Framework

> **Version:** 1.0  
> **Status:** Implementation Blueprint  
> **Source:** Phase Documents, Architecture v3.0  
> **Cross-References:** All documentation files

---

## 1. Purpose

This document defines the versioning framework for all configurable components of the SoZaVo Platform, including rules, workflows, wizards, payment formulas, fraud rules, schema, and documentation.

---

## 2. Versioning Principles

### 2.1 Semantic Versioning

All versioned components follow Semantic Versioning (SemVer):

```
MAJOR.MINOR.PATCH

MAJOR - Breaking changes (incompatible with previous versions)
MINOR - New features (backward compatible)
PATCH - Bug fixes (backward compatible)
```

### 2.2 Version Storage

| Component | Version Storage Location |
|-----------|-------------------------|
| Eligibility Rules | `eligibility_rules.rule_version`, JSON metadata |
| Workflows | `workflow_definitions.version`, JSON metadata |
| Wizard Steps | JSON metadata in `configs/wizard/*.json` |
| Payment Formulas | JSON metadata in `configs/payments/*.json` |
| Fraud Rules | JSON metadata in `configs/fraud/*.json` |
| Schema | Migration files, Schema-Lock-Specification.md |
| Documentation | Document headers |

---

## 3. Rule Versioning

### 3.1 Eligibility Rules

**Storage:** `eligibility_rules` table + `configs/eligibility/*.json`

**Version Attributes:**
```json
{
  "rule_version": "1.0.0",
  "effective_date": "2024-01-01",
  "expiry_date": null,
  "is_active": true
}
```

**Version Advancement:**

| Change Type | Version Impact | Authorization |
|-------------|----------------|---------------|
| Threshold value change | MINOR | Ministry Approval |
| Add new mandatory rule | MAJOR | Ministry Approval |
| Add new optional rule | MINOR | Department Head |
| Fix rule logic bug | PATCH | Technical Lead |
| Disable rule | MINOR | Department Head |

**Backward Compatibility:**
- Previous rule versions remain in database
- `is_active = false` for deprecated versions
- Cases evaluated under old rules retain evaluation reference

### 3.2 Rule Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2024-01-01 | System | Initial rule set |
| (future) | TBD | TBD | Pending Ministry confirmation |

---

## 4. Workflow Versioning

### 4.1 Workflow Definitions

**Storage:** `workflow_definitions` table + `configs/workflows/*.json`

**Version Attributes:**
```json
{
  "workflow_version": "1.0.0",
  "effective_date": "2024-01-01",
  "service_types": ["AB", "FB", "KB"]
}
```

**Version Advancement:**

| Change Type | Version Impact | Authorization |
|-------------|----------------|---------------|
| Add new status | MAJOR | Technical Lead |
| Add new transition | MINOR | Department Head |
| Change role requirements | MINOR | Department Head |
| Fix transition guard | PATCH | Technical Lead |

**Backward Compatibility:**
- Cases in progress continue under current workflow
- New cases use latest workflow version
- Workflow version recorded in case metadata

---

## 5. Wizard Versioning

### 5.1 Wizard Step Definitions

**Storage:** `configs/wizard/*.json`

**Version Attributes:**
```json
{
  "wizard_version": "1.0.0",
  "effective_date": "2024-01-01",
  "total_steps": 7
}
```

**Version Advancement:**

| Change Type | Version Impact | Authorization |
|-------------|----------------|---------------|
| Add new step | MAJOR | Technical Lead |
| Remove step | MAJOR | Department Head |
| Add new field to step | MINOR | Technical Lead |
| Change field validation | PATCH | Technical Lead |
| Reorder steps | MINOR | Technical Lead |

**Backward Compatibility:**
- In-progress wizard sessions continue with original version
- Wizard version stored in `cases.wizard_data.version`

---

## 6. Payment Formula Versioning

### 6.1 Payment Engine Configuration

**Storage:** `configs/payments/*.json`

**Version Attributes:**
```json
{
  "engine_version": "1.0.0",
  "effective_date": "2024-01-01",
  "status": "Requires Clarification"
}
```

**Version Advancement:**

| Change Type | Version Impact | Authorization |
|-------------|----------------|---------------|
| Change base amount | MAJOR | Ministry Approval |
| Add new adjustment | MINOR | Ministry Approval |
| Change cap values | MINOR | Ministry Approval |
| Fix calculation bug | PATCH | Technical Lead |

**Backward Compatibility:**
- Payments created under old formula retain calculation reference
- Recalculation requires explicit authorization
- Formula version recorded in payment metadata

---

## 7. Fraud Rules Versioning

### 7.1 Fraud Engine Configuration

**Storage:** `configs/fraud/*.json`

**Version Attributes:**
```json
{
  "engine_version": "1.0.0",
  "effective_date": "2024-01-01"
}
```

**Version Advancement:**

| Change Type | Version Impact | Authorization |
|-------------|----------------|---------------|
| Add new signal | MINOR | Department Head |
| Change score thresholds | MINOR | Department Head |
| Change escalation rules | MINOR | Department Head |
| Add auto-reject rule | MAJOR | Ministry Approval |
| Fix detection logic | PATCH | Technical Lead |

**Backward Compatibility:**
- Fraud scans record engine version
- Historical scans not recalculated

---

## 8. Schema Versioning

### 8.1 Database Schema

**Storage:** Migration files, Schema-Lock-Specification.md

**Current Version:** 1.0

**Version Advancement:**

| Change Type | Version Impact | Authorization |
|-------------|----------------|---------------|
| Add new table | MINOR | Technical Lead |
| Add new column | MINOR | Technical Lead |
| Modify column type | MAJOR | Technical Lead + Testing |
| Add constraint | MINOR | Technical Lead |
| Remove column/table | MAJOR | Ministry Approval |

**Migration Policy:**
- All migrations must be reversible
- Named: `YYYYMMDD_HHMM_description.sql`
- Schema frozen after Phase 7

### 8.2 Schema Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Phase 1-5 | System | Initial schema |

---

## 9. Documentation Versioning

### 9.1 Document Headers

All documentation files include version headers:

```markdown
> **Version:** X.Y  
> **Status:** [Draft | Review | Authoritative]  
> **Last Updated:** YYYY-MM-DD
```

### 9.2 Document Version Table

| Document | Current Version | Status |
|----------|-----------------|--------|
| PRD.md | 2.0 | Authoritative |
| Architecture.md | 3.0 | Authoritative |
| Backend.md | 2.0 | Authoritative |
| Data-Dictionary.md | 1.0 | Authoritative |
| Schema-Lock-Specification.md | 1.0 | Implementation Blueprint |
| DAL-Specification.md | 1.0 | Implementation Blueprint |
| API-Reference.md | 1.0 | Implementation Blueprint |
| Object-Model-Registry.md | 1.0 | Implementation Blueprint |
| Documentation-Consistency-Matrix.md | 1.0 | Review |
| Documentation-Quality-Report.md | 1.0 | Review |

### 9.3 Documentation Version Advancement

| Change Type | Version Impact | Authorization |
|-------------|----------------|---------------|
| Minor corrections | PATCH | Any contributor |
| Section additions | MINOR | Technical Lead |
| Structure changes | MAJOR | Project Manager |

---

## 10. Version Authorization Matrix

### 10.1 Authorization Levels

| Role | Can Authorize |
|------|---------------|
| Ministry of Social Affairs | Payment formulas, benefit thresholds, auto-reject rules |
| Department Head | Workflow changes, fraud thresholds, optional rules |
| Technical Lead | Schema changes, bug fixes, documentation |
| Project Manager | Documentation structure, phase approvals |

### 10.2 Version Freeze Schedule

| Milestone | Components Frozen |
|-----------|-------------------|
| Phase 7 Complete | Schema, RLS Policies |
| UAT Start | All rule configurations |
| Production | All components (change control required) |

---

## 11. Version Execution

### 11.1 How Previous Versions Remain Executable

| Component | Execution Strategy |
|-----------|-------------------|
| Eligibility Rules | `WHERE is_active = true` OR `WHERE id = case.evaluated_rule_version_id` |
| Workflow Definitions | Transition lookup by current service + status |
| Wizard Steps | JSON version in wizard_data.version |
| Payment Formulas | Formula version in payment.calculation_version |
| Fraud Rules | Engine version in fraud_scan.engine_version |

### 11.2 Version Rollback Procedures

1. Identify affected records
2. Create rollback migration
3. Update configuration to previous version
4. Test in staging environment
5. Deploy during maintenance window
6. Verify affected records

---

## 12. Cross-References

| Document | Section |
|----------|---------|
| Schema-Lock-Specification.md | Section 5 (Migration Policy) |
| Backend.md | Section 14 (Versioning Anchors) |
| Architecture.md | Section 16-18 |
| PRD.md | All requirement IDs |

---

**END OF VERSIONING FRAMEWORK v1.0**
