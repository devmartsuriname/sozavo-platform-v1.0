# SoZaVo Central Social Services Platform – Lovable Build Instructions (Phase 5: Document Uploads & Validation Engine)

> **Status:** Implementation Blueprint – Phase 5  
> **Prepared for:** Devmart Suriname – SoZaVo MVP Build  
> **Scope:** Document uploads, storage integration, Level 2 validation, document status display  
> **Related Docs:** PRD v2, Workflow Blueprint v2, Technical Architecture v2, Eligibility Rules Framework v1, Wizard Step Definitions v1, Lovable Build Instructions Phases 1–4

---

# 1. Purpose of Phase 5
Phase 5 introduces **document handling as an operational core feature**:

- Uploading required documents during or after intake
- Storing documents in Supabase Storage
- Writing document metadata into the `documents` table
- Implementing **Validation Level 2 (Intermediate)** checks:
  - expiry date validation
  - duplicate detection
  - basic structural consistency

Lovable must strictly follow this document and MUST NOT change the database schema.

---

# 2. Global Rules for Lovable in Phase 5

Lovable MUST:
- Use the existing `documents` and `document_requirements` tables exactly as defined.
- Use Supabase Storage buckets for file storage.
- Encapsulate validation logic in a separate engine module.
- Use existing UI layout and design from Phase 2.

Lovable MUST NOT:
- Add or remove columns to `documents`.
- Change enums for `document_type` or `validation_level`.
- Introduce new storage providers.
- Add custom visual styling beyond the template.

---

# 3. Storage & Documents Infrastructure

## 3.1 Supabase Storage Bucket

Lovable must:
- Create a Supabase Storage bucket named: `sozavo-documents` (if not already created).
- Use a folder structure per citizen and per case:
  - `citizen_{citizenId}/case_{caseId}/{documentType}/{filename}`

## 3.2 `documents` Table Usage

For each uploaded file, Lovable must insert a row into `documents`:
- `citizen_id`
- `case_id`
- `document_type`
- `storage_path` (full path inside `sozavo-documents` bucket)
- `issue_date` (optional input from user, if relevant)
- `expiry_date` (optional input from user, if relevant)
- `is_valid` (default `null` until validation)
- `validation_level` (default `intermediate` per MVP)
- `duplicate_of_document_id` (null by default)

No extra fields may be added.

---

# 4. Document Upload UI Implementation

## 4.1 Entry Points

Lovable must implement document upload flows in:
- Wizard document steps (for each service)
- Case Detail → Documents tab

## 4.2 Wizard-Level Uploads

At the `DOCUMENTS` steps defined in **Wizard Step Definitions v1**, Lovable must:
- Show dynamic required document types based on `documents_required` array.
- Allow upload of a file per required type.
- Temporarily stage documents until wizard completion.

When the wizard is completed and a case is created (Phase 4 integration):
- Staged documents must be persisted as real entries in `documents` + uploaded to Storage.

## 4.3 Case Detail – Documents Tab

On `/cases/[id]` → Documents tab, Lovable must:
- Display:
  - List of existing documents for this case
  - Document type
  - Issue and expiry dates
  - Validation status (Valid / Invalid / Pending)
- Provide:
  - Button: `Upload New Document`
  - Optional: `Replace Document` link per row (upload new file, mark old as outdated)

---

# 5. Document Validation Engine (Level 2 – Intermediate)

Create file:
```
src/integrations/engines/documentValidationEngine.ts
```

Responsibilities:
- Perform Level 2 validation for a single document or a case’s documents.
- Update `is_valid` and `duplicate_of_document_id` where applicable.

## 5.1 Validation Checks (Level 2)

Lovable must implement at least the following checks:

1. **Expiry Check**  
   - If `expiry_date` is present and `expiry_date < today` → `is_valid = false`.

2. **Issue Date Consistency**  
   - If `issue_date > today` → flag as invalid OR `needs_review` (logged in meta).

3. **Duplicate Detection**  
   - For each uploaded document, check if another document exists for the **same citizen, same document_type, same storage_path hash or same file size + name**.
   - If potential duplicate found:
     - Set `duplicate_of_document_id` to the original document.

4. **Required Document Coverage** (per service + case status)  
   - Compare existing `documents` against `document_requirements` for the relevant `service_type_id` and `step_code`.
   - Return a list of missing mandatory documents.

## 5.2 Validation Functions

Required exported functions:
- `validateDocument(documentId: string): Promise<ValidationResult>`
- `validateCaseDocuments(caseId: string): Promise<CaseDocumentsValidationResult>`

Where:
```ts
type ValidationResult = {
  documentId: string;
  isValid: boolean;
  reasons: string[]; // e.g. ["EXPIRED", "POSSIBLE_DUPLICATE"]
};

type CaseDocumentsValidationResult = {
  caseId: string;
  allValid: boolean;
  missingRequiredDocuments: string[]; // list of document_type codes
  invalidDocuments: ValidationResult[];
};
```

---

# 6. UI Integration for Validation

## 6.1 Documents Tab – Validation Display

On the Documents tab of the Case Detail page, Lovable must:
- Show for each document:
  - `Valid`, `Invalid`, or `Pending` (badge style from template)
- Provide a button:
  - `Run Document Validation` (per case)

When pressed:
- Call `validateCaseDocuments(caseId)`.
- Update the UI with:
  - Which documents are invalid
  - Which required documents are missing

## 6.2 Integration with Workflow (Read-Only Influence)

Phase 5 must **NOT** enforce status transitions based on documents.
Instead:
- Expose validation results to the case handler.
- Optionally show a warning when attempting to move to `eligibility_check` if required docs are missing.

Actual blocking/enforcement may be added in a later phase.

---

# 7. Internal Tools & Logs

Lovable must create an internal-only debug page:
- `/dev/document-validation-test`

This page must:
- Allow selection of a case
- Run `validateCaseDocuments(caseId)`
- Display structured JSON result for debugging

---

# 8. Forbidden Actions in Phase 5

Lovable must NOT:
- Change the `documents` or `document_requirements` schema
- Store files outside of Supabase Storage
- Bypass the Document Validation Engine
- Hardcode validation rules directly in UI components
- Build complex OCR/AI flows (future phase)

---

# 9. Completion Criteria for Phase 5

Phase 5 is considered complete when:

- [ ] Document uploads work in wizard and in Case Detail
- [ ] All uploads are stored in Supabase Storage under `sozavo-documents`
- [ ] Metadata for each document is correctly written to `documents`
- [ ] Level 2 validation checks work as specified
- [ ] Case-level document validation runs and returns structured results
- [ ] Documents tab clearly displays validation status and missing docs
- [ ] `/dev/document-validation-test` works as an internal tool
- [ ] No schema changes or design deviations were introduced

After completion, Lovable MUST await explicit approval before starting Phase 6.

---

**END OF LOVABLE BUILD INSTRUCTIONS – PHASE 5 (DOCUMENT UPLOADS & VALIDATION ENGINE, ENGLISH)**

