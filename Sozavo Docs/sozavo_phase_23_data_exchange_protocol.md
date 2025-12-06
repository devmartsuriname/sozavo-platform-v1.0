# SoZaVo Central Social Services Platform – Phase 23 (National Social Support Data Exchange Protocol)

> **Status:** Phase 23 – Inter-Ministry Data Exchange Protocol (National Standard v1.0)  
> **Prepared for:** Ministry of Social Affairs & Housing (SoZaVo)  
> **Prepared by:** Devmart Suriname  
> **Scope:** National data-sharing framework, API standards, validation rules, interoperability governance, cross-ministry integration strategy  
> **Related Docs:** Phase 22 Transformation Roadmap, Technical Architecture v2, Governance Charter, Eligibility Engine, Subema Adapter Plan

---

# 1. Purpose of Phase 23
Phase 23 defines a **national data exchange standard** for social services, enabling SoZaVo to securely and consistently exchange information with:
- Ministry of Finance
- Ministry of Health
- General Bureau of Statistics (ABS)
- Civil Registry / CBB
- Subema
- Future ministries and agencies

This protocol ensures **interoperability**, **security**, and **data consistency** across all social protection processes.

---

# 2. Vision & Principles of National Data Exchange

## 2.1 Vision
Create a unified, secure, API-driven ecosystem for all government social support programs, enabling real-time data exchange and accurate eligibility decisions.

## 2.2 Core Principles
1. **Data Minimization** – Only required fields for eligibility decisions.  
2. **Integrity First** – Every data source must be traceable and validated.  
3. **Security by Design** – Encryption, authentication, authorization layers.  
4. **Auditability** – Every exchange logged for compliance.  
5. **Standardization** – Same structures, naming conventions, and error-handling protocols.  
6. **Cross-Ministry Reusability** – One protocol for all agencies.

---

# 3. System Roles in Data Exchange

| Role | Description |
|------|-------------|
| **SoZaVo (Consumer & Producer)** | Requests identity, income, household, health, and demographic data; also produces benefit results. |
| **Finance Ministry** | Income verification, employment records, tax compliance flags. |
| **Health Ministry** | Child health indicators, disability certificates, medical eligibility. |
| **CBB / Civil Registry** | National ID validation, demographics, household composition. |
| **Statistics Bureau (ABS)** | Demographic trends, poverty indices. |
| **Subema** | Employment income verification (primary source). |
| **Banks** | Payment validation (handled in Phase 12+). |

---

# 4. Exchange Categories & Required Data Fields
Each ministry contributes specific datasets.

## 4.1 Identity & Demographics (CBB)
| Field | Type | Required |
|--------|------|----------|
| national_id_number | string | yes |
| first_name | string | yes |
| last_name | string | yes |
| date_of_birth | date | yes |
| gender | enum | yes |
| address | string | yes |
| district | string | yes |
| household_members | list | yes |

---

## 4.2 Income & Employment (Finance + Subema)
| Field | Type | Required |
|--------|------|----------|
| employer_name | string | yes |
| employment_status | enum | yes |
| monthly_income | numeric | yes |
| payroll_tax_paid | boolean | optional |
| employment_start_date | date | optional |
| employment_end_date | date | optional |

---

## 4.3 Child & Health Indicators (Health Ministry)
| Field | Type | Required |
|--------|------|----------|
| child_health_status | enum | yes |
| disability_status | boolean | optional |
| disability_category | string | optional |
| vaccination_compliance | boolean | optional |
| medical_certificate_ref | string | optional |

---

## 4.4 Social Benefit Outcomes (SoZaVo → Ministries)
| Field | Type | Required |
|--------|------|----------|
| benefit_type | enum | yes |
| approval_status | enum | yes |
| approval_date | date | yes |
| payment_amount | numeric | yes |
| household_id | string | yes |
| eligibility_flags | list | optional |

---

# 5. API Standard (National Format)
All national APIs follow the same conventions.

## 5.1 Request Format
```
POST /v1/lookup
{
  "request_id": "uuid",
  "source_system": "sozavo-platform",
  "lookup_type": "identity | income | health | household | benefit_status",
  "payload": { ... }
}
```

## 5.2 Response Format
```
{
  "request_id": "uuid",
  "status": "success | fail | partial",
  "data": { ... },
  "errors": [],
  "timestamp": "ISO8601"
}
```

## 5.3 Error Format
```
{
  "error_code": "INVALID_INPUT | NOT_FOUND | SYSTEM_DOWN | UNAUTHORIZED",
  "message": "Human readable explanation",
  "retry_after_seconds": 30
}
```

---

# 6. Security & Authentication Requirements

## 6.1 Encryption
- HTTPS mandatory
- TLS 1.3 or higher
- Sensitive fields encrypted at rest

## 6.2 Authentication
Government-standard API authentication:
- Public/private key pair with rotation
- JWT with short expiry
- Mutual TLS for high-risk exchanges (income, identity)

## 6.3 Authorization
Role-based access via government-wide OAuth provider (future plan).

## 6.4 Audit Logging
Every request logs:
- requesting agency
- time
- data requested
- success/failure
- IP address

---

# 7. Governance Model for Data Exchange
Managed by a **National Social Protection Interoperability Committee (NSPIC)**.

Members:
- SoZaVo
- Finance Ministry
- Health Ministry
- CBB
- ICT Department (central government)
- Devmart (technical advisory)

Responsibilities:
- Approve new API fields
- Manage access permissions
- Review audit logs
- Enforce data governance standards
- Approve version upgrades

---

# 8. Versioning & Backward Compatibility
Versioning rules:
- MAJOR version: breaking changes
- MINOR version: additional fields but backward compatible
- PATCH version: non-breaking fixes

Example:
```
v1.0.0 → v1.1.0 (add field)
v1.1.0 → v2.0.0 (breaking change)
```

Backward compatibility period: **18 months** per version.

---

# 9. Data Matching Standards
Standardized rules for matching citizen data:
- National ID → primary key
- BIS ID → secondary key
- Full name match with tolerance rules
- DOB exact match
- Household identifier reconciliation rules

---

# 10. Event-Driven Exchange (Future)
The long-term plan introduces event-driven interoperability:
- "Citizen updated"
- "Income updated"
- "Benefit approved"
- "Child health flag changed"

Payload structure:
```
{
  "event_type": "income_updated",
  "entity_id": "citizen_id",
  "timestamp": "ISO8601",
  "data": { ... }
}
```

---

# 11. Compliance & Legal Considerations
Must comply with:
- National Data Protection Act
- Ministry-specific regulations
- Government cybersecurity guidelines

Legal updates required:
- Recognition of digital eligibility checks
- Authorization for inter-ministry data sharing
- National standard for API-based government services

---

# 12. Completion Criteria – Phase 23
### Technical:
- [ ] Standardized API format approved by ministries
- [ ] Security & encryption rules adopted
- [ ] Validation & matching rules confirmed

### Governance:
- [ ] NSPIC committee established
- [ ] Versioning strategy accepted

### Policy:
- [ ] Draft regulations prepared for cross-ministry exchange

After Phase 23, Lovable MUST await explicit approval for Phase 24 (Visual UI Design Guidelines).

---

**END OF PHASE 23 – NATIONAL SOCIAL SUPPORT DATA EXCHANGE PROTOCOL (ENGLISH)**

