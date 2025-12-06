# SoZaVo Central Social Services Platform – Lovable Build Instructions (Phase 8: Public Portal Foundation)

> **Status:** Implementation Blueprint – Phase 8  
> **Prepared for:** Devmart Suriname – SoZaVo MVP Build  
> **Scope:** External Public Portal (Citizens), Authentication, Service Application Flow, Status Tracking  
> **Related Docs:** PRD v2, Workflow Blueprint v2, Technical Architecture v2, Wizard Step Definitions v1, Build Instructions Phases 1–7

---

# 1. Purpose of Phase 8
Phase 8 introduces the **citizen-facing public portal** that allows applicants to:
- Create an account
- Log in securely
- Start an application for General Assistance, Social Assistance, or Child Allowance
- Submit required information and documents
- Track the status of their applications
- Receive notifications on updates

Lovable must implement this foundation **without interfering with the internal Admin system**. The two frontends must remain fully isolated.

---

# 2. Global Rules for Lovable in Phase 8

Lovable MUST:
- Create a **separate frontend** inside the repo: `/portal/`
- Use React + Tailwind + Vite (or Lovable defaults)
- Follow the HTML template provided for the public portal (future import)
- Use Supabase Auth for citizens (separate from internal users)
- Respect RLS policies defined in Phase 7
- Await approval before proceeding to extended public features

Lovable MUST NOT:
- Mix admin and portal routes
- Reuse admin UI components
- Alter admin-side schema or flows
- Disable or bypass RLS

---

# 3. Public Portal Directory Structure

Lovable must generate:
```
/portal/
  pages/
    index.tsx
    login.tsx
    register.tsx
    dashboard.tsx
    services/
      general-assistance.tsx
      social-assistance.tsx
      child-allowance.tsx
    applications/
      [id].tsx
  components/
    layout/
    forms/
    widgets/
  integrations/
    supabaseClient.ts
    portalQueries.ts
```

Portal and Admin must never share components.

---

# 4. Authentication Layer (Public Portal)

Lovable must:
- Use Supabase Auth **email/password** for citizen login
- Store citizens in `auth.users` (separate from internal "users" table)
- Create a mapping:
  - When a citizen logs in for the first time → check if they exist in `citizens` table by national ID
  - If not found → prompt to complete identity profile (Phase 9 expansion)

Required pages:
- `/portal/register`
- `/portal/login`

Validation:
- Strong password pattern
- Email verification (optional for MVP)

---

# 5. Public Portal – Dashboard

Citizen dashboard (`/portal/dashboard`) must display:
- Welcome message
- Active applications list
- Application statuses
- Button: `Start New Application`

Lovable must not show internal statuses like `under_review`; instead use human-readable labels:
- Submitted
- In Review
- Documents Required
- Approved
- Rejected

Mapping logic must stay inside `portalQueries.ts`.

---

# 6. Public Application Flow

This uses the same wizard definitions as the admin system **but runs in citizen-friendly mode**.

Lovable must:
- Render wizard steps using portal components (simplified UI)
- Support document uploads
- Submit application into `cases` table with:
  - `case_handler_id = null`
  - `intake_office_id = null`
  - `current_status = 'intake'`
  - `citizen_id = loggedInCitizenCCRId`

## 6.1 Wizard Differences (Public vs Admin)
- Public users cannot see internal fields
- No BIS lookup (handled admin-side only)
- No eligibility check button
- No reviewer fields

Wizard logic remains the same.

---

# 7. Public Status Tracking

Citizen must see:
- Current status (mapped to friendly label)
- Required documents still missing
- Uploaded documents
- Messages or instructions from SoZaVo (future phase)

Lovable must only expose data that citizen owns:
- Their own `cases`
- Their own `documents`
- Their own `eligibility_evaluations`

RLS must enforce all restrictions.

---

# 8. Document Uploads (Public Portal)

Citizen must be able to:
- Upload required documents at application time
- Upload additional documents when requested by SoZaVo

Uploads must:
- Write into `documents` table
- Follow the same Supabase Storage structure
- Trigger validation through the existing Document Validation Engine (Phase 5)

---

# 9. Notifications (Basic MVP)

Lovable must create an internal function:
```
sendPortalNotification(citizenId, type, message)
```

This writes into a simple `portal_notifications` table (predefined placeholder):
- `citizen_id`
- `type`
- `message`
- `created_at`
- `read` (default false)

Citizen dashboard must show unread notifications.

(No email/SMS integration yet.)

---

# 10. Forbidden Actions in Phase 8
Lovable must NOT:
- Merge admin and portal frontends
- Expose internal workflow statuses
- Allow citizens to edit CCR directly
- Add new tables except the predefined notification table
- Break RLS boundaries

---

# 11. Completion Criteria for Phase 8
Phase 8 is complete when:
- [ ] Public portal loads independently under `/portal`
- [ ] Citizen authentication is functional
- [ ] Citizens can submit new applications
- [ ] Citizens can upload documents
- [ ] Citizens can track their application status safely
- [ ] Notifications appear in portal dashboard
- [ ] No admin functionality is exposed publicly

After completion, Lovable MUST await explicit approval before proceeding to Phase 9 (Identity Profile Completion & Data Sync).

---

**END OF LOVABLE BUILD INSTRUCTIONS – PHASE 8 (PUBLIC PORTAL FOUNDATION, ENGLISH)**

