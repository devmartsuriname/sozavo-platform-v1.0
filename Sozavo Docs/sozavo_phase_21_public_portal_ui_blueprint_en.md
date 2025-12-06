# SoZaVo Central Social Services Platform – Phase 21 (Public Portal UI Blueprint)

> **Status:** Phase 21 – UI Blueprint (Citizen-Facing Portal Design Specification)  
> **Prepared for:** Ministry of Social Affairs & Housing (SoZaVo)  
> **Prepared by:** Devmart Suriname  
> **Scope:** Component library, page layouts, UI states, accessibility rules, responsive design patterns, Lovable-ready UI structure  
> **Related Docs:** Phase 18 Wireflow, Technical Architecture v2, Wizard Engine, Document Engine, Messaging & Notifications

---

# 1. Purpose of Phase 21
Phase 21 converts the **wireflows from Phase 18** into a **UI Blueprint**, meaning:
- Full component library definition
- Page-level structure for every screen
- UI state definitions (loading, error, empty)
- Responsive rules (mobile-first)
- Accessibility and contrast guidelines
- Lovable-ready HTML/React structure

This is **not** final visual design — it is the structural UI specification used by Lovable and designers.

---

# 2. UI Design Principles
1. **Government Clarity** – clean, simple, official.
2. **Mobile-first** – 70%+ of citizens use mobile.
3. **Minimal cognitive load** – short text, large buttons.
4. **Visual guidance** – progress bars, checklists, status indicators.
5. **Accessibility (WCAG 2.1 AA)** – required for national use.
6. **Consistency** – one component library across all screens.

---

# 3. Global UI Structure

## 3.1 Header (Public Portal)
- SoZaVo logo
- Language switcher
- Login/Register buttons (if not authenticated)
- Dropdown menu (if authenticated)

## 3.2 Footer
- Ministry links
- Privacy policy
- Contact information
- Version number

## 3.3 Layout Containers
Reusable containers:
- `PageContainer`
- `SectionContainer`
- `Card`
- `FormContainer`
- `TwoColumnLayout`
- `StickyBottomBar` (for wizard next/back)

---

# 4. Component Library

## 4.1 Inputs
- TextInput
- NumberInput
- DateInput
- Select/Dropdown
- Checkbox
- Radio groups
- FileUpload component
- Phone number input with masks

## 4.2 Buttons
- Primary button (solid)
- Secondary (outline)
- Tertiary (text-only)
- Danger (red)

Sizes:
- Large (mobile default)
- Medium
- Small

## 4.3 Indicators
- Status badges (Submitted, Pending, Approved…)
- Progress steps
- Timeline component
- Alert banners (info, warning, error, success)

## 4.4 Cards
Cards for:
- Active applications
- Service selection
- Document upload items
- Notification items

---

# 5. Page Blueprints

# 5.1 Landing Page
### Layout:
- Hero section
- Service preview cards
- Login/Register CTA
- Info section ("How Benefits Work")

### Components Used:
- Header
- Footer
- HeroBanner
- ServiceCard
- CTAButton

---

# 5.2 Login & Registration

### Login Page
- Email field
- Password field
- Forgot password link
- Login button
- Error messages

### Register Page
- Email
- Password + confirmation
- Continue button

### Email Verification Page
- Illustration + instructions
- “Resend email” button

---

# 5.3 Identity Linking (CCR Verification)
### Page Structure:
- BIS number input
- Date of birth input
- Submit button
- Loading state
- BIS success → CCR linked
- BIS fail → manual verification option

### Manual Verification Page
- Full form
- Upload ID document
- Submit for staff review

---

# 5.4 Household Confirmation
### Layout:
- Household list card
- For each member: name, relation, DOB
- Buttons: "Confirm" or "Request Correction"

### Correction Flow:
- Form to indicate errors
- Upload supporting documents (if needed)

---

# 5.5 Citizen Dashboard
### Sections:
- Your Benefits (active applications)
- Start New Application
- Messages
- Notifications
- Profile completeness tracker

### Widgets:
- `ApplicationStatusCard`
- `NotificationList`
- `ActionCard`

---

# 6. Application Wizard UI
Wizard → same layout for all services.

### 6.1 Wizard Framework Components
- Progress bar (5 steps)
- Left-side summary (optional desktop)
- Sticky bottom navigation (Next / Back)
- Autosave indicator

### 6.2 Step Screens
#### Step 1: Personal Details
- Read-only CCR data
- "Edit via support" link

#### Step 2: Household & Income
- Editable fields
- Add/Delete income entries

#### Step 3: Service-Specific Questions
- Conditional fields
- Info tooltips

#### Step 4: Document Uploads
- FileUpload grid
- Status: pending, uploaded, invalid
- Image/PDF preview

#### Step 5: Summary
- Accordion of all data
- Declaration checkbox
- Submit button

---

# 7. Document Upload UI Blueprint
### Structure:
- For each required document:
  - DocumentCard
  - Upload button
  - Replace button
  - File preview
  - Validation feedback

Error states:
- Wrong format
- Too large
- Unreadable

---

# 8. Status Tracking UI
### Timeline Layout:
```
Submitted → Intake Review → Documents Pending → Eligibility Check → Review → Approved/Rejected → Payment
```

Components:
- StepTimeline
- StatusBadge
- CaseHistoryList
- MessageThread

---

# 9. Notifications Center
### Components:
- NotificationItem
- Filters (All, Case Updates, Payment Updates)
- Mark all as read

---

# 10. Profile & Security UI
### Pages:
- Your Information (readonly)
- Contact update
- Change password
- Household view
- Two-factor authentication (future)

---

# 11. Error & Loading States (Global)
### Error Screens:
- BIS down
- Form validation errors
- Wizard autosave error

### Loading Patterns:
- Skeleton screens
- Spinner for submissions
- “Saving…” indicator

---

# 12. Responsive Rules
### Mobile First:
- Single-column layout
- Large tap areas
- Sticky footer navigation for wizard

### Tablet:
- Two-column wizard layout
- Larger cards

### Desktop:
- Side navigation panel for wizard
- Multi-column dashboards

---

# 13. Accessibility Requirements
- WCAG 2.1 AA compliance
- Proper HTML semantics
- ARIA labels for inputs
- Keyboard navigation
- 4.5:1 contrast ratio
- Error messages with screenreader support

---

# 14. Completion Criteria – Phase 21
### UI Architecture:
- [ ] All pages have structural blueprint
- [ ] All components defined
- [ ] All states defined (error, loading, empty)

### UX Consistency:
- [ ] Wizard framework approved
- [ ] Document upload UI approved
- [ ] Status tracking UI approved

### Lovable Readiness:
- [ ] Pages and components mapped for HTML → React conversion
- [ ] Blueprint approved by SoZaVo leadership

After Phase 21, Lovable MUST await explicit approval before Phase 22 (Multi-Year Digital Transformation Roadmap).

---

**END OF PHASE 21 – PUBLIC PORTAL UI BLUEPRINT (ENGLISH)**

