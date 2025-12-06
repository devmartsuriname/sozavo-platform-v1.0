# SoZaVo Central Social Services Platform – Phase 10 Plan (Notifications, Messaging & Case Interaction)

> **Status:** Implementation Blueprint – Phase 10 (MVP+ Extension)  
> **Prepared for:** Devmart Suriname – SoZaVo Platform  
> **Scope:** Notification system, secure citizen–admin messaging, case interaction tools, internal communication workflow  
> **Related Docs:** PRD v2, Workflow Blueprint v2, Technical Architecture v2, Build Instructions Phases 1–9, Subema Integration Adapter Plan v1

---

# 1. Purpose of Phase 10
Phase 10 enables **communication between citizens and SoZaVo** and **status-driven automated notifications**.

Goals:
- Provide citizens with timely updates on their cases.
- Allow secure, logged messaging between SoZaVo staff and citizens.
- Support case-specific notes, tasks, and requests for additional documents.
- Ensure all communication becomes part of the case audit trail.

This phase transforms the system from a static workflow engine into an interactive digital service.

---

# 2. Design Principles

1. **Two-Way Communication, Fully Logged**  
   Every message or notification must be stored with timestamps and actor identity.

2. **Non-Intrusive, Non-Blocking**  
   Messaging must not replace official decisions. It only facilitates clarification.

3. **Role-Based Visibility**  
   - Citizens see only their own communication.  
   - District officers and case handlers see internal + citizen messages.  
   - Reviewers see full threads.  
   - Audit sees everything.

4. **Separation of Channels**  
   - Internal notes (visible only inside SoZaVo)  
   - Messages to/from citizens  
   - Automated notifications

---

# 3. Database Additions (Phase 10)

## 3.1 `portal_notifications` (Already defined in Phase 8)
Fields:
- `id`, `citizen_id`, `type`, `message`, `created_at`, `read`

## 3.2 NEW: `case_messages`
For citizen ↔ SoZaVo two-way messaging.

Fields:
- `id` (PK)
- `case_id` (FK → cases.id)
- `sender_type` (enum: `citizen`, `staff`)
- `sender_user_id` (nullable FK → users.id)
- `sender_citizen_id` (nullable FK → citizens.id)
- `message_text`
- `attachments` (JSONB, optional)
- `created_at`
- `is_internal` (boolean; if true → staff-only internal note)

## 3.3 NEW: `case_tasks`
Internal task management for SoZaVo staff.

Fields:
- `id`
- `case_id`
- `assigned_to` (FK → users.id)
- `title`
- `description`
- `status` (enum: `open`, `in_progress`, `completed`)
- `due_date` (optional)
- `created_at`

> Note: Tasks are **internal only**; citizens must never see them.

## 3.4 RLS Requirements
- Citizens can only read/write messages where:
  - `case_messages.sender_citizen_id = their own ID`, OR
  - `case_messages.case_id` belongs to one of their cases.

- Staff can only view messages for cases they have access to (per Phase 7 RLS).

- Internal notes (`is_internal = true`) must be invisible to citizens.

---

# 4. Notification System – Architecture

Notifications must be generated in three ways:

### 4.1 Automated Workflow Notifications
Triggered when:
- Case status changes (`intake → pending_docs → under_review → approved → rejected`).
- A new document request is created.
- A Subema or BIS check is completed.
- Eligibility evaluation completes.

### 4.2 Manual Notifications (Admin)
Case handlers can send a custom notification to a citizen:
- Short text (max 200 chars)
- Type: info / request / alert

### 4.3 System Notifications (Portal)
Citizens see:
- Unread notification count
- Full notification list in `/portal/notifications`
- Click-through to case detail

---

# 5. Messaging System – Architecture

## 5.1 Citizen-Side Messaging
Implemented on:
- `/portal/applications/[id]/messages`

Features:
- Citizen can send messages to the case handler.
- Citizen can upload attachments (documents/images).
- Citizen sees all messages except internal notes.

## 5.2 Staff-Side Messaging
Implemented inside Admin Case Detail as a **Messages** tab.

Tab contains:
- Threaded message list
- Internal notes toggle
- Send to citizen + internal note fields
- Attachment upload

Messages are color-coded:
- Citizen messages (blue)
- Staff messages (gray)
- Internal notes (yellow)

---

# 6. Case Interaction Tools

## 6.1 Document Request Feature
Staff can:
- Request additional documents
- Select document type
- Add a note for citizen

Result:
- Portal notification + message
- Case status changes to `pending_docs`
- Required document added to Document tab

## 6.2 Case Tasks
Staff can create internal tasks:
- Assign to team member
- Add deadline
- Track progress

Tasks appear on:
- Case Detail → Tasks tab
- Staff Dashboard → My Tasks widget

---

# 7. Eligibility Engine Integration

When new messages or documents arrive:
- Staff can click **Re-evaluate Eligibility**.
- The Eligibility Engine consumes updated income, household, or document info.

If eligibility changes, triggers:
- Workflow event
- Auto-notification to citizen

---

# 8. UI Requirements

## 8.1 Portal UI
- Clean, citizen-friendly messaging screen
- Notification dropdown + full page list
- Progressive disclosure (hide internal logic)

## 8.2 Admin UI
- Separate tabs for: Messages, Tasks, Notifications, Document Requests
- Threaded chat-style messaging
- Internal/External toggles for notes
- Status indicators for pending actions

---

# 9. RLS & Security Requirements

1. Citizens must NOT see:
   - Internal notes
   - Tasks
   - Reviews or decisions before officially set

2. Messaging API must enforce:
   - Citizens can post only to their own cases
   - Staff can post only to cases allowed by RLS Case policies

3. Attachments must be stored in dedicated Storage bucket with:
   - Citizen read/write limited to their own files
   - Staff read/write limited to case files

4. All communication must be timestamped and immutable.

---

# 10. Error Handling & UX Fragility Prevention

- If messaging fails → retry option + clear feedback.
- If notification delivery fails → store locally and display once resolved.
- If citizen uploads unsupported file → show allowed formats.
- If Subema/BIS references are mentioned → hide from citizen and translate into simple wording.

---

# 11. Completion Criteria for Phase 10

Phase 10 is complete when:

### Notifications:
- [ ] Automated workflow notifications work
- [ ] Manual admin notifications work
- [ ] Citizen sees new notifications in portal dashboard and details page

### Messaging:
- [ ] Citizen ↔ staff messaging works
- [ ] Staff internal notes are invisible to citizen
- [ ] Attachments supported
- [ ] Message thread appears in case detail (admin) and portal

### Case Interaction:
- [ ] Staff can request documents
- [ ] Staff can create and complete internal tasks
- [ ] Document requests appear in citizen portal

### Security:
- [ ] RLS blocks unauthorized message visibility
- [ ] Attachments follow storage security rules
- [ ] All actions logged correctly

After completion, Lovable MUST await explicit approval before Phase 11 (Reporting Engine + Analytics Dashboard).

---

**END OF PHASE 10 PLAN – NOTIFICATIONS, MESSAGING & CASE INTERACTION (ENGLISH)**

