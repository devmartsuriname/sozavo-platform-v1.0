# Column Masking Specification
## SoZaVo Platform v1.0 — Phase 8

> **Status**: Documentation Only — NO SQL executed  
> **Version**: 1.0  
> **Source**: Data-Dictionary.md, RLS-Policy-Specification.md

---

## 1. Overview

This document defines the column-level data masking requirements for the SoZaVo Platform. Masking ensures that sensitive personal data is protected based on the requesting user's role and relationship to the data.

### 1.1 Masking Objectives

1. **PII Protection**: Prevent unauthorized viewing of personal identifiable information
2. **Role-Based Visibility**: Show full data only to authorized roles
3. **Self-Access**: Allow citizens to view their own unmasked data
4. **Audit Compliance**: Log access to sensitive unmasked data
5. **Performance**: Minimal impact on query performance

### 1.2 Masking Methods

| Method | Description | Use Case |
|--------|-------------|----------|
| Full Mask | Replace with constant (e.g., `****`) | High sensitivity, no context needed |
| Partial Mask | Show prefix/suffix (e.g., `XXX-XXX-123`) | Verification purposes |
| Hash | One-way hash for comparison | Deduplication checks |
| Redact | Remove entirely | Audit logs, exports |
| Conditional | Show based on context | Fraud investigation |

---

## 2. Fields Requiring Masking

### 2.1 HIGH Sensitivity Fields (Always Masked by Default)

| Table | Field | Data Type | Mask Format | Unmasked Access |
|-------|-------|-----------|-------------|-----------------|
| citizens | national_id | VARCHAR(20) | `XXX-XXX-***` (last 3 visible) | owner, fraud_officer (flagged), admin |
| citizens | bank_account_number | VARCHAR(30) | `****-****-****-XXXX` (last 4 visible) | owner, finance_officer, admin |
| citizens | phone_number | VARCHAR(20) | `***-***-XXXX` (last 4 visible) | owner, case_handler (assigned), admin |
| citizens | email | VARCHAR(255) | `***@domain.com` | owner, case_handler (assigned), admin |
| citizens | address_line_1 | VARCHAR(255) | First 10 chars + `...` | owner, case_handler, admin |
| citizens | date_of_birth | DATE | `XXXX-XX-XX` | owner, case_handler, fraud_officer, admin |

### 2.2 MEDIUM Sensitivity Fields (Conditionally Masked)

| Table | Field | Data Type | Mask Format | Unmasked Access |
|-------|-------|-----------|-------------|-----------------|
| households | income_amount | DECIMAL | `$***,***.**` | owner, case_handler, finance_officer, admin |
| incomes | amount | DECIMAL | `$***,***.**` | owner, case_handler, finance_officer, admin |
| incomes | employer_name | VARCHAR(255) | `******` | owner, case_handler, fraud_officer, admin |
| payment_items | amount | DECIMAL | `$***,***.**` | owner, finance_officer, admin |
| payment_items | bank_reference | VARCHAR(50) | `****-****` | finance_officer, admin |

### 2.3 LOW Sensitivity Fields (Masked for Specific Contexts)

| Table | Field | Context | Mask Format |
|-------|-------|---------|-------------|
| cases | internal_notes | Citizen view | Fully redacted |
| case_events | system_details | Non-admin | Fully redacted |
| fraud_signals | detection_algorithm | Non-admin | `[Algorithm: ***]` |

---

## 3. Role-Based Masking Matrix

### 3.1 Citizens Table Access

| Field | citizen | intake | handler | reviewer | finance | fraud | dept_head | admin | audit |
|-------|---------|--------|---------|----------|---------|-------|-----------|-------|-------|
| national_id | Own ✓ | Masked | Masked | Masked | Masked | Flag ✓ | Masked | ✓ | Masked |
| bank_account | Own ✓ | Masked | Masked | Masked | ✓ | Masked | Masked | ✓ | Masked |
| phone_number | Own ✓ | Masked | ✓ | Masked | Masked | ✓ | Masked | ✓ | Masked |
| email | Own ✓ | Masked | ✓ | Masked | Masked | ✓ | Masked | ✓ | Masked |
| address_line_1 | Own ✓ | Partial | ✓ | Partial | Masked | ✓ | Partial | ✓ | Partial |
| date_of_birth | Own ✓ | ✓ | ✓ | Masked | Masked | ✓ | Masked | ✓ | Masked |

**Legend**:
- ✓ = Full access
- Masked = Masked value shown
- Partial = Partially masked
- Own ✓ = Full access to own record only
- Flag ✓ = Full access when fraud_flag = true

### 3.2 Financial Data Access

| Field | citizen | intake | handler | reviewer | finance | fraud | dept_head | admin | audit |
|-------|---------|--------|---------|----------|---------|-------|-----------|-------|-------|
| income_amount | Own ✓ | Masked | ✓ | Masked | ✓ | ✓ | Masked | ✓ | Masked |
| payment_amount | Own ✓ | Masked | Masked | Masked | ✓ | Masked | ✓ | ✓ | Masked |
| bank_reference | Masked | Masked | Masked | Masked | ✓ | Masked | Masked | ✓ | Masked |

---

## 4. Masking Implementation Patterns

### 4.1 Pattern A: CASE Expression in SELECT

```sql
-- Example: Masking national_id in citizens table
SELECT 
  id,
  first_name,
  last_name,
  CASE 
    -- Owner sees full value
    WHEN portal_user_id = auth.uid() THEN national_id
    -- Admin sees full value
    WHEN public.is_admin() THEN national_id
    -- Fraud officer sees full value when fraud flagged
    WHEN public.is_fraud_officer() AND EXISTS (
      SELECT 1 FROM public.cases c 
      WHERE c.citizen_id = citizens.id AND c.fraud_flag = true
    ) THEN national_id
    -- Default: masked
    ELSE CONCAT('XXX-XXX-', RIGHT(national_id, 3))
  END AS national_id,
  -- ... other columns
FROM public.citizens;
```

### 4.2 Pattern B: Masking View

```sql
-- Create a view that automatically applies masking
CREATE OR REPLACE VIEW public.citizens_view AS
SELECT 
  id,
  first_name,
  last_name,
  public.mask_national_id(national_id, portal_user_id) AS national_id,
  public.mask_phone(phone_number, portal_user_id) AS phone_number,
  public.mask_email(email, portal_user_id) AS email,
  public.mask_bank_account(bank_account_number, portal_user_id) AS bank_account_number,
  -- Non-sensitive columns pass through
  created_at,
  updated_at
FROM public.citizens;

-- Grant SELECT on view, revoke on base table
REVOKE SELECT ON public.citizens FROM authenticated;
GRANT SELECT ON public.citizens_view TO authenticated;
```

### 4.3 Pattern C: SECURITY DEFINER Masking Functions

```sql
-- Function to mask national_id
CREATE OR REPLACE FUNCTION public.mask_national_id(
  _value TEXT,
  _owner_portal_id UUID
)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Owner sees full value
  IF _owner_portal_id = auth.uid() THEN
    RETURN _value;
  END IF;
  
  -- Admin sees full value
  IF public.is_admin() THEN
    RETURN _value;
  END IF;
  
  -- Fraud officer sees full when investigating
  -- (context would need to be passed differently)
  
  -- Default: masked
  RETURN CONCAT('XXX-XXX-', RIGHT(_value, 3));
END;
$$;
```

### 4.4 Pattern D: Generated Column (Compile-Time Mask)

```sql
-- Add a pre-masked column for general queries
ALTER TABLE public.citizens 
ADD COLUMN national_id_masked TEXT 
GENERATED ALWAYS AS (
  CONCAT('XXX-XXX-', RIGHT(national_id, 3))
) STORED;

-- RLS policy uses base column, API uses masked column
```

---

## 5. Conditional Masking Rules

### 5.1 Self-Access (Portal Owner)

```sql
-- Citizen can always see their own data unmasked
CASE 
  WHEN citizens.portal_user_id = auth.uid() 
  THEN field_value
  ELSE masked_value
END
```

### 5.2 Case Relationship Access

```sql
-- Case handler can see unmasked data for assigned cases
CASE 
  WHEN EXISTS (
    SELECT 1 FROM public.cases c
    WHERE c.citizen_id = citizens.id
      AND c.case_handler_id = auth.uid()
  )
  THEN field_value
  ELSE masked_value
END
```

### 5.3 Fraud Investigation Access

```sql
-- Fraud officer sees unmasked when fraud_flag = true
CASE 
  WHEN public.is_fraud_officer() 
    AND EXISTS (
      SELECT 1 FROM public.cases c
      WHERE c.citizen_id = citizens.id
        AND c.fraud_flag = true
    )
  THEN field_value
  ELSE masked_value
END
```

### 5.4 Payment Processing Access

```sql
-- Finance officer sees bank details for approved payments
CASE 
  WHEN public.is_finance_officer()
    AND EXISTS (
      SELECT 1 FROM public.cases c
      WHERE c.citizen_id = citizens.id
        AND c.current_status IN ('approved', 'payment_pending', 'payment_processed')
    )
  THEN bank_account_number
  ELSE CONCAT('****-****-****-', RIGHT(bank_account_number, 4))
END
```

---

## 6. Mask Format Specifications

### 6.1 National ID

```
Format: XXX-XXX-NNN (where N = actual digit)
Example: 123-456-789 → XXX-XXX-789
Purpose: Allow partial verification without full exposure
```

### 6.2 Phone Number

```
Format: ***-***-NNNN (where N = actual digit)
Example: 599-123-4567 → ***-***-4567
Purpose: Last 4 digits for callback verification
```

### 6.3 Email

```
Format: ***@domain.tld
Example: john.doe@email.com → ***@email.com
Purpose: Show domain for context, hide local part
```

### 6.4 Bank Account

```
Format: ****-****-****-NNNN (where N = actual digit)
Example: 1234-5678-9012-3456 → ****-****-****-3456
Purpose: Standard financial masking, last 4 for verification
```

### 6.5 Address

```
Format: First 10 characters + "..."
Example: 123 Main Street, Apt 4B → 123 Main S...
Purpose: Partial context without full address
```

### 6.6 Monetary Amounts

```
Format: $***,***.**
Example: $45,678.90 → $***,***.**
Purpose: Hide exact financial details
```

---

## 7. Masking Function Definitions

### 7.1 mask_national_id()

```sql
CREATE OR REPLACE FUNCTION public.mask_national_id(
  _value TEXT,
  _portal_user_id UUID DEFAULT NULL,
  _case_id UUID DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Null check
  IF _value IS NULL THEN
    RETURN NULL;
  END IF;

  -- Owner access
  IF _portal_user_id IS NOT NULL AND _portal_user_id = auth.uid() THEN
    RETURN _value;
  END IF;

  -- Admin access
  IF public.is_admin() THEN
    RETURN _value;
  END IF;

  -- Fraud officer with flagged case
  IF public.is_fraud_officer() AND _case_id IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.cases 
      WHERE id = _case_id AND fraud_flag = true
    ) THEN
      RETURN _value;
    END IF;
  END IF;

  -- Default: masked
  RETURN CONCAT('XXX-XXX-', RIGHT(_value, 3));
END;
$$;
```

### 7.2 mask_phone()

```sql
CREATE OR REPLACE FUNCTION public.mask_phone(
  _value TEXT,
  _portal_user_id UUID DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _value IS NULL THEN
    RETURN NULL;
  END IF;

  -- Owner or handler access
  IF _portal_user_id = auth.uid() 
     OR public.is_case_handler() 
     OR public.is_admin() 
     OR public.is_fraud_officer() THEN
    RETURN _value;
  END IF;

  -- Default: masked (last 4 digits)
  RETURN CONCAT('***-***-', RIGHT(REGEXP_REPLACE(_value, '[^0-9]', '', 'g'), 4));
END;
$$;
```

### 7.3 mask_bank_account()

```sql
CREATE OR REPLACE FUNCTION public.mask_bank_account(
  _value TEXT,
  _portal_user_id UUID DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _value IS NULL THEN
    RETURN NULL;
  END IF;

  -- Owner access
  IF _portal_user_id = auth.uid() THEN
    RETURN _value;
  END IF;

  -- Finance or admin access
  IF public.is_finance_officer() OR public.is_admin() THEN
    RETURN _value;
  END IF;

  -- Default: masked (last 4 digits)
  RETURN CONCAT('****-****-****-', RIGHT(REGEXP_REPLACE(_value, '[^0-9]', '', 'g'), 4));
END;
$$;
```

### 7.4 mask_amount()

```sql
CREATE OR REPLACE FUNCTION public.mask_amount(
  _value DECIMAL,
  _portal_user_id UUID DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _value IS NULL THEN
    RETURN NULL;
  END IF;

  -- Owner, handler, finance, or admin access
  IF _portal_user_id = auth.uid()
     OR public.is_case_handler()
     OR public.is_finance_officer()
     OR public.is_admin() THEN
    RETURN TO_CHAR(_value, 'FM$999,999,999.00');
  END IF;

  -- Default: masked
  RETURN '$***,***.**';
END;
$$;
```

---

## 8. Implementation Recommendations

### 8.1 Recommended Approach: View + Functions

The recommended implementation combines:

1. **Base tables**: Store raw data with RLS policies
2. **Masking functions**: SECURITY DEFINER functions for each masked field
3. **Masked views**: Views that apply masking functions
4. **API layer**: Application queries views, not base tables

```sql
-- Base table with RLS
CREATE TABLE public.citizens (...);
ALTER TABLE public.citizens ENABLE ROW LEVEL SECURITY;
CREATE POLICY ... ON public.citizens ...;

-- Masking functions
CREATE FUNCTION public.mask_national_id(...);
CREATE FUNCTION public.mask_phone(...);

-- Masked view
CREATE VIEW public.citizens_api AS
SELECT 
  id,
  first_name,
  last_name,
  public.mask_national_id(national_id, portal_user_id) AS national_id,
  ...
FROM public.citizens;

-- Application queries the view
SELECT * FROM public.citizens_api WHERE id = $1;
```

### 8.2 Alternative: Application-Level Masking

For simpler deployments:

1. **Base tables**: Full data with RLS policies
2. **API layer**: Apply masking in application code
3. **Audit logging**: Track unmasked access

```typescript
// Application-level masking example
function maskNationalId(value: string, requestingUser: User, dataOwner: UUID): string {
  if (requestingUser.id === dataOwner) return value;
  if (requestingUser.roles.includes('admin')) return value;
  return `XXX-XXX-${value.slice(-3)}`;
}
```

---

## 9. Audit Requirements

### 9.1 Unmasked Access Logging

Log whenever a user accesses unmasked sensitive data:

```sql
CREATE TABLE public.sensitive_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  table_name TEXT NOT NULL,
  field_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  access_time TIMESTAMPTZ DEFAULT now(),
  access_reason TEXT,
  ip_address INET
);

-- Trigger function to log unmasked access
CREATE OR REPLACE FUNCTION public.log_sensitive_access()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'SELECT' AND public.is_unmasked_access() THEN
    INSERT INTO public.sensitive_access_log (...)
    VALUES (...);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 9.2 Retention Policy

| Log Type | Retention Period | Archive |
|----------|------------------|---------|
| Unmasked access | 7 years | Yes |
| Masked access | 90 days | No |
| Failed access | 1 year | Yes |

---

## 10. Requires Clarification

| Item | Context | Impact |
|------|---------|--------|
| View vs function approach | Performance implications | Implementation choice |
| Audit log storage | Separate database? | Architecture |
| Masking for exports | Different rules? | Export functionality |
| Historical data masking | Retroactive application | Migration scope |
| GDPR right to erasure | Physical vs logical deletion | Retention policies |

---

## 11. References

- [Data-Dictionary.md](./Data-Dictionary.md)
- [RLS-Policy-Definitions.md](./RLS-Policy-Definitions.md)
- [Security-Definer-Functions.md](./Security-Definer-Functions.md)
- GDPR Article 25: Data Protection by Design

---

**Document Version**: 1.0  
**Phase**: 8  
**Status**: Documentation Only — Pending Phase 9 Execution
