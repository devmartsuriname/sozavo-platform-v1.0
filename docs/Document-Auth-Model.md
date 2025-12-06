# SoZaVo Platform v1.0 – Document Authorization Model

> **Version:** 1.0  
> **Phase:** 7 – RLS Security & Authorization Layer  
> **Status:** Specification Document  
> **Cross-References:** RLS-Policy-Specification.md, Service-Layer-Specification.md

---

## 1. Overview

This document defines the detailed access model for document uploads, storage, and retrieval within the SoZaVo Platform.

---

## 2. Document Ownership Rules

### 2.1 Primary Ownership

**Definition:** Document ownership is determined by case association.

**Ownership Chain:**
```
documents.case_id 
  → cases.id 
    → cases.citizen_id 
      → citizens.portal_user_id
```

**Ownership Expression:**
```
documents.case_id IN (
  SELECT id FROM cases 
  WHERE citizen_id IN (
    SELECT id FROM citizens 
    WHERE portal_user_id = auth.uid()
  )
)
```

### 2.2 Secondary Ownership (Staff)

Staff ownership is derived from case access:
- Handler owns documents for assigned cases
- Reviewer owns documents for review queue cases
- Fraud officer owns documents for flagged cases

### 2.3 Upload Attribution

| Field | Description |
|-------|-------------|
| uploaded_by | User ID who uploaded |
| uploaded_via | Channel (portal, staff_interface) |
| upload_date | Timestamp of upload |
| uploaded_for_case | Case ID association |

---

## 3. Role-Based Document Permissions

### 3.1 Citizen Permissions

| Action | Allowed | Conditions |
|--------|---------|------------|
| View | ✓ | Own case documents only |
| Upload | ✓ | Case in intake, validation, eligibility_check |
| Replace | ✓ | Before eligibility evaluation |
| Delete | ✗ | Never |
| Download | ✓ | Own documents only |

**Restrictions:**
- Cannot view district-generated documents
- Cannot view internal verification notes
- Cannot upload after case approval

### 3.2 District Intake Officer Permissions

| Action | Allowed | Conditions |
|--------|---------|------------|
| View | ✓ | District cases |
| Upload | ✓ | District cases |
| Replace | ✗ | - |
| Delete | ✗ | - |
| Download | ✓ | District cases |
| Verify | ✗ | - |

### 3.3 Case Handler Permissions

| Action | Allowed | Conditions |
|--------|---------|------------|
| View | ✓ | Assigned cases |
| Upload | ✓ | Assigned cases |
| Replace | ✗ | - |
| Delete | ✗ | - |
| Download | ✓ | Assigned cases |
| Verify | ✓ | Assigned cases |
| Reject | ✓ | Assigned cases |

### 3.4 Case Reviewer Permissions

| Action | Allowed | Conditions |
|--------|---------|------------|
| View | ✓ | Review queue cases |
| Upload | ✗ | - |
| Replace | ✗ | - |
| Delete | ✗ | - |
| Download | ✓ | Review queue cases |
| Verify | ✓ | Review queue cases |
| Reject | ✓ | Review queue cases |

### 3.5 Department Head Permissions

| Action | Allowed | Conditions |
|--------|---------|------------|
| View | ✓ | Department cases |
| Upload | ✗ | - |
| Replace | ✗ | - |
| Delete | ✗ | - |
| Download | ✓ | Department cases |
| Verify | ✓ | Department cases |
| Override rejection | ✓ | With justification |

### 3.6 Finance Officer Permissions

| Action | Allowed | Conditions |
|--------|---------|------------|
| View | ✓ | Payment-stage cases only |
| Upload | ✗ | - |
| Replace | ✗ | - |
| Delete | ✗ | - |
| Download | ✓ | Payment validation only |
| Verify | ✗ | - |

**Access Filter:**
```
documents.case_id IN (
  SELECT id FROM cases 
  WHERE current_status IN ('approved', 'payment_pending')
)
```

### 3.7 Fraud Officer Permissions

| Action | Allowed | Conditions |
|--------|---------|------------|
| View | ✓ | Fraud-flagged cases only |
| Upload | ✗ | - |
| Replace | ✗ | - |
| Delete | ✗ | - |
| Download | ✓ | Investigation purposes |
| Verify | ✗ | - |
| Flag suspicious | ✓ | Investigation |

**Access Filter:**
```
documents.case_id IN (
  SELECT id FROM cases 
  WHERE fraud_risk_level IN ('HIGH', 'CRITICAL')
)
```

### 3.8 System Admin Permissions

| Action | Allowed | Conditions |
|--------|---------|------------|
| View | ✓ | All documents |
| Upload | ✓ | All cases |
| Replace | ✓ | All documents |
| Delete | ✓ | All documents |
| Download | ✓ | All documents |
| Verify | ✓ | All documents |

### 3.9 Audit Viewer Permissions

| Action | Allowed | Conditions |
|--------|---------|------------|
| View | ✓ | All documents (read-only) |
| Upload | ✗ | - |
| Replace | ✗ | - |
| Delete | ✗ | - |
| Download | ✓ | All documents |
| Verify | ✗ | - |

---

## 4. Document Types & Access

### 4.1 Document Type Categories

| Category | Examples | Sensitivity |
|----------|----------|-------------|
| Identity | ID card, passport, birth certificate | HIGH |
| Financial | Bank statements, income proof | HIGH |
| Residency | Utility bills, rental agreement | MEDIUM |
| Medical | Medical certificates, disability proof | HIGH |
| Supporting | Photos, additional evidence | LOW |
| System | Generated reports, decision letters | MEDIUM |

### 4.2 Type-Specific Access Rules

| Document Type | Citizen | Staff | Finance | Fraud | Admin |
|---------------|---------|-------|---------|-------|-------|
| Identity | ✓ | ✓ | ✓ | ✓ | ✓ |
| Financial | ✓ | ✓ | ✓ | ✓ | ✓ |
| Residency | ✓ | ✓ | ○ | ✓ | ✓ |
| Medical | ✓ | ✓ | ✗ | ✓ | ✓ |
| Supporting | ✓ | ✓ | ○ | ✓ | ✓ |
| System | ○ | ✓ | ✓ | ✓ | ✓ |

**Legend:** ✓ = Full access, ○ = Conditional access, ✗ = No access

---

## 5. Integrity & Chain Rules

### 5.1 Immutability Rules

| Rule | Description |
|------|-------------|
| No deletion | Documents cannot be deleted (only system_admin) |
| No overwrite | Original file preserved; new version creates new record |
| Hash verification | File hash stored for integrity verification |
| Audit trail | All access logged with user, timestamp, action |

### 5.2 Version Chain

When a document is replaced:
1. Original document marked `superseded = true`
2. New document references `supersedes_id = original.id`
3. Original remains accessible for audit
4. Only latest version used for eligibility

**Version Chain Expression:**
```
documents.superseded = false  -- Current version only
OR documents.superseded = true AND include_history = true  -- With history
```

### 5.3 Replacement Restrictions

| Case Status | Replacement Allowed |
|-------------|---------------------|
| intake | ✓ |
| validation | ✓ |
| eligibility_check | ✓ (before evaluation) |
| under_review | ✗ |
| approved | ✗ |
| rejected | ✗ |
| payment_* | ✗ |
| fraud_investigation | ✗ |
| closed | ✗ |

**Replacement Expression:**
```
CASE WHEN (
  SELECT current_status FROM cases WHERE id = documents.case_id
) IN ('intake', 'validation', 'eligibility_check')
AND NOT EXISTS (
  SELECT 1 FROM eligibility_evaluations 
  WHERE case_id = documents.case_id
)
THEN TRUE
ELSE FALSE
END
```

### 5.4 Deletion Rules

| Actor | Can Delete | Conditions |
|-------|------------|------------|
| citizen | ✗ | Never |
| Staff roles | ✗ | Never |
| system_admin | ✓ | Audit logged, reason required |
| System | ✓ | Data retention policy only |

**Soft Delete Pattern:**
```
UPDATE documents 
SET deleted_at = now(), 
    deleted_by = auth.uid(),
    deletion_reason = 'reason'
WHERE id = document_id
```

---

## 6. Storage Access Control

### 6.1 Storage Bucket Policy

Documents stored in Supabase Storage require bucket-level policies aligned with RLS:

**Bucket Structure:**
```
sozavo-documents/
  ├── cases/
  │   └── {case_id}/
  │       └── {document_id}.{ext}
  └── temp/
      └── {upload_session_id}/
```

### 6.2 Storage Access Expression

```
-- Read access
storage.foldername = 'cases' 
AND storage.name LIKE cases_user_can_access || '/%'

-- Write access (upload)
storage.foldername = 'temp'
OR (
  storage.foldername = 'cases'
  AND can_upload_to_case(extract_case_id(storage.name))
)
```

### 6.3 Direct URL Access

Document URLs should NOT be directly accessible. Access must go through:
1. RLS-protected API endpoint
2. Signed URL generation (short-lived)
3. Access logging

---

## 7. Verification Workflow Authorization

### 7.1 Verification States

| State | Description | Transition By |
|-------|-------------|---------------|
| pending | Uploaded, not reviewed | - |
| under_review | Being reviewed | case_handler, case_reviewer |
| verified | Accepted | case_handler, case_reviewer, dept_head |
| rejected | Not accepted | case_handler, case_reviewer, dept_head |
| requires_replacement | Citizen must re-upload | case_handler |

### 7.2 Verification Authorization Matrix

| From State | To State | Authorized Roles |
|------------|----------|------------------|
| pending | under_review | case_handler |
| under_review | verified | case_handler, case_reviewer, dept_head |
| under_review | rejected | case_handler, case_reviewer, dept_head |
| under_review | requires_replacement | case_handler |
| rejected | requires_replacement | case_handler, dept_head |
| requires_replacement | pending | citizen (re-upload) |

### 7.3 Verification Fields

| Field | Who Can Update | When |
|-------|----------------|------|
| verification_status | Authorized verifiers | Case not closed |
| verified_by | System | On verification |
| verified_at | System | On verification |
| rejection_reason | Verifier | On rejection |
| verification_notes | Verifier | Any time |

---

## 8. Audit Requirements

### 8.1 Document Access Logging

All document access must be logged:

| Field | Description |
|-------|-------------|
| document_id | Document accessed |
| user_id | Who accessed |
| action | view, download, upload, verify, reject |
| timestamp | When accessed |
| ip_address | Hashed IP |
| user_agent | Truncated UA |
| access_granted | Whether access was permitted |

### 8.2 Failed Access Logging

Failed access attempts must also be logged:
- User who attempted
- Document they tried to access
- Reason for denial
- Timestamp

---

## 9. Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Phase 7 | System | Initial specification |
