# Darkone Admin Wiring Plan
## SoZaVo Platform v1.0 — Phase 9

**Document Version**: 1.0  
**Phase**: 9 — Admin MVP Implementation Blueprint  
**Status**: Approved for Implementation  
**Last Updated**: 2025-01-XX

---

## 1. Overview

This document defines how the Darkone Admin template connects to backend slices. It specifies page-to-module mapping, data-binding contracts, and role-aware navigation.

---

## 2. Darkone Template Structure

The Darkone Admin template provides the following reusable layouts and components:

### 2.1 Layout Files

| File | Purpose | Used For |
|------|---------|----------|
| `layouts-dark-sidenav.html` | Main app shell with sidebar | All authenticated pages |
| `layouts-light.html` | Light theme variant | Future option |
| `layouts-small-sidenav.html` | Compact sidebar | Mobile/tablet |
| `layouts-hidden-sidenav.html` | Collapsible sidebar | Dense views |

### 2.2 Authentication Pages

| File | Purpose |
|------|---------|
| `auth-signin.html` | Login form |
| `auth-signup.html` | Registration (not used in MVP) |
| `auth-password.html` | Password reset (Phase 10+) |
| `auth-lock-screen.html` | Session lock (Phase 10+) |

### 2.3 UI Component Pages

| File | Components |
|------|------------|
| `ui-tabs.html` | Tabbed content panels |
| `ui-accordion.html` | Collapsible sections |
| `ui-card.html` | Card layouts |
| `ui-modal.html` | Modal dialogs |
| `ui-badge.html` | Status badges |
| `ui-alerts.html` | Alert messages |
| `ui-breadcrumb.html` | Navigation breadcrumbs |

### 2.4 Data Display Pages

| File | Purpose |
|------|---------|
| `tables-basic.html` | Simple HTML tables |
| `tables-gridjs.html` | Advanced data grid with sorting/filtering |
| `charts.html` | Chart visualizations (ApexCharts) |
| `index.html` | Dashboard with stat cards |

---

## 3. Page-to-Module Mapping

### 3.1 Module 1: Login & Role-Based Access Shell

| Component | Darkone Base | Adaptations |
|-----------|--------------|-------------|
| Login Page | `auth-signin.html` | Connect form to Supabase Auth |
| App Shell | `layouts-dark-sidenav.html` | Dynamic sidebar based on roles |
| Error States | `ui-alerts.html` | Invalid credentials, session expired |

**React Component Structure**:
```
src/
├── pages/
│   └── Login.tsx              # Based on auth-signin.html
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx       # Main layout wrapper
│   │   ├── Sidebar.tsx        # Role-aware navigation
│   │   ├── Topbar.tsx         # User menu, notifications
│   │   └── Footer.tsx         # Standard footer
│   └── auth/
│       └── ProtectedRoute.tsx # Route guard
└── hooks/
    └── useAuth.ts             # Auth state management
```

---

### 3.2 Module 2: Case Search & Overview

| Component | Darkone Base | Adaptations |
|-----------|--------------|-------------|
| Case List Page | `tables-gridjs.html` | Case data grid |
| Filter Panel | `ui-card.html` | Filter form in card |
| Status Badges | `ui-badge.html` | Case status indicators |

**React Component Structure**:
```
src/
├── pages/
│   └── cases/
│       └── CaseList.tsx       # Main case search page
└── components/
    └── cases/
        ├── CaseTable.tsx      # GridJS-powered table
        ├── CaseFilters.tsx    # Filter form
        ├── CaseStatusBadge.tsx # Status indicator
        └── CasePagination.tsx # Page controls
```

**Data Binding Contract**:

| Element | Backend Endpoint | Request | Response Mapping |
|---------|------------------|---------|------------------|
| Case Grid | `getCases` | Filters + pagination | Map to table rows |
| Filter: Status | `getServiceTypes` | None | Populate dropdown |
| Filter: Office | `getOffices` | None | Populate dropdown |
| Search | `getCases` | `{ search: term }` | Refresh grid |

---

### 3.3 Module 3: Case Detail & Timeline View

| Component | Darkone Base | Adaptations |
|-----------|--------------|-------------|
| Case Header | `index.html` (stat cards) | Case info cards |
| Timeline | Custom | Vertical timeline component |
| Tab Container | `ui-tabs.html` | Detail sections |
| Summary Cards | `ui-card.html` | Eligibility, fraud, docs |

**React Component Structure**:
```
src/
├── pages/
│   └── cases/
│       └── CaseDetail.tsx     # Main detail page
└── components/
    └── cases/
        ├── CaseHeader.tsx     # Case info + status
        ├── CitizenSummary.tsx # Citizen info card
        ├── CaseTimeline.tsx   # Events timeline
        ├── EligibilitySummary.tsx # Evaluation summary
        ├── FraudSummary.tsx   # Risk indicators
        └── DocumentsSummary.tsx # Doc count + link
```

**Data Binding Contract**:

| Element | Backend Endpoint | Request | Response Mapping |
|---------|------------------|---------|------------------|
| Header | `getCaseById` | `{ case_id }` | Case + citizen data |
| Timeline | `getCaseEvents` | `{ case_id }` | Event list |
| Eligibility | `getEligibilityEvaluation` | `{ case_id }` | Evaluation summary |
| Fraud | `getFraudRiskScores` | `{ case_id }` | Risk score |
| Documents | `getDocumentsByCase` | `{ case_id }` | Document count |

---

### 3.4 Module 4: Intake & Eligibility Review Panel

| Component | Darkone Base | Adaptations |
|-----------|--------------|-------------|
| Tab Container | `ui-tabs.html` | 3 tabs: Intake, Docs, Eligibility |
| Wizard Data | `ui-accordion.html` | Accordion per wizard step |
| Document List | `tables-basic.html` | Simple table |
| Rule Breakdown | `ui-accordion.html` | Expandable rules |

**React Component Structure**:
```
src/
├── pages/
│   └── cases/
│       └── IntakeReview.tsx   # Or tab within CaseDetail
└── components/
    └── intake/
        ├── WizardDataView.tsx # Accordion display
        ├── DocumentChecklist.tsx # Required vs received
        ├── EligibilityDetail.tsx # Full evaluation
        └── RuleBreakdown.tsx  # Individual rules
```

**Data Binding Contract**:

| Element | Backend Endpoint | Request | Response Mapping |
|---------|------------------|---------|------------------|
| Wizard Data | `getIntakeReview` | `{ case_id }` | wizard_data object |
| Documents | `getDocumentsByCase` | `{ case_id }` | Document list |
| Eligibility | `getEligibilityEvaluation` | `{ case_id }` | Full evaluation |

---

### 3.5 Module 5: Documents Viewer

| Component | Darkone Base | Adaptations |
|-----------|--------------|-------------|
| Document Table | `tables-basic.html` | Simple document list |
| Status Badges | `ui-badge.html` | Verification status |
| Download Link | Button | Pre-signed URL |

**React Component Structure**:
```
src/
├── pages/
│   └── cases/
│       └── CaseDocuments.tsx  # Or tab within CaseDetail
└── components/
    └── documents/
        ├── DocumentTable.tsx  # Document list
        ├── DocumentRow.tsx    # Single document row
        └── VerificationBadge.tsx # Status indicator
```

**Data Binding Contract**:

| Element | Backend Endpoint | Request | Response Mapping |
|---------|------------------|---------|------------------|
| Document List | `getDocumentsByCase` | `{ case_id }` | Document array |
| Download | `getDocumentDownloadUrl` | `{ document_id }` | Signed URL |

---

### 3.6 Module 6: Payments Overview

| Component | Darkone Base | Adaptations |
|-----------|--------------|-------------|
| Batch Grid | `tables-gridjs.html` | Payment batch table |
| Items Grid | `tables-gridjs.html` | Items within batch |
| Summary Cards | `index.html` (stat cards) | Total, pending, failed |
| Filters | `ui-card.html` | Date, status filters |

**React Component Structure**:
```
src/
├── pages/
│   └── payments/
│       ├── PaymentBatches.tsx # Batch list
│       └── BatchDetail.tsx    # Items within batch
└── components/
    └── payments/
        ├── BatchTable.tsx     # Batch grid
        ├── BatchFilters.tsx   # Filter form
        ├── PaymentItemTable.tsx # Item grid
        └── PaymentSummary.tsx # Summary cards
```

**Data Binding Contract**:

| Element | Backend Endpoint | Request | Response Mapping |
|---------|------------------|---------|------------------|
| Batch List | `getPaymentBatches` | Filters + pagination | Batch array |
| Batch Items | `getPaymentItems` | `{ batch_id }` | Item array |
| Summary | `getPaymentSummary` | None | Aggregate stats |

---

### 3.7 Module 7: Fraud & Risk Overview

| Component | Darkone Base | Adaptations |
|-----------|--------------|-------------|
| Summary Cards | `index.html` (stat cards) | Signal counts, risk tiers |
| Chart | `charts.html` | Risk distribution chart |
| Signal Grid | `tables-gridjs.html` | Fraud signals table |
| Risk Grid | `tables-gridjs.html` | Risk scores table |

**React Component Structure**:
```
src/
├── pages/
│   └── fraud/
│       └── FraudOverview.tsx  # Dashboard + grids
└── components/
    └── fraud/
        ├── FraudSummary.tsx   # Summary cards
        ├── RiskChart.tsx      # ApexCharts viz
        ├── SignalTable.tsx    # Signal grid
        └── RiskScoreTable.tsx # Risk score grid
```

**Data Binding Contract**:

| Element | Backend Endpoint | Request | Response Mapping |
|---------|------------------|---------|------------------|
| Summary | `getFraudSummary` | None | Aggregate stats |
| Signals | `getFraudSignals` | Filters | Signal array |
| Risk Scores | `getFraudRiskScores` | Filters | Score array |

---

### 3.8 Module 8: Configuration Panel

| Component | Darkone Base | Adaptations |
|-----------|--------------|-------------|
| Accordion Container | `ui-accordion.html` | Expandable sections |
| Service Types | `tables-basic.html` | Simple list |
| Offices | `tables-basic.html` | Simple list |
| Rules Summary | `ui-card.html` | Rule metadata cards |
| Workflows | Custom | State machine diagram |

**React Component Structure**:
```
src/
├── pages/
│   └── config/
│       └── ConfigPanel.tsx    # Main config page
└── components/
    └── config/
        ├── ServiceTypesList.tsx # Service types
        ├── OfficesList.tsx    # Offices/districts
        ├── RulesSummary.tsx   # Eligibility rules
        └── WorkflowDiagram.tsx # Workflow viz
```

**Data Binding Contract**:

| Element | Backend Endpoint | Request | Response Mapping |
|---------|------------------|---------|------------------|
| Service Types | `getServiceTypes` | None | Type array |
| Offices | `getOffices` | None | Office array |
| Rules | `getEligibilityRules` | None | Rule summaries |
| Workflows | `getWorkflowDefinitions` | None | Workflow defs |

---

## 4. Role-Aware Navigation

### 4.1 Sidebar Menu Structure

```typescript
const menuItems = [
  {
    id: 'cases',
    label: 'Cases',
    icon: 'folder',
    path: '/cases',
    roles: ['case_handler', 'case_reviewer', 'department_head', 'fraud_officer', 'system_admin'],
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: 'credit-card',
    path: '/payments',
    roles: ['finance_officer', 'fraud_officer', 'department_head', 'system_admin'],
  },
  {
    id: 'fraud',
    label: 'Fraud & Risk',
    icon: 'shield-alert',
    path: '/fraud',
    roles: ['fraud_officer', 'department_head', 'system_admin'],
  },
  {
    id: 'config',
    label: 'Configuration',
    icon: 'settings',
    path: '/config',
    roles: ['department_head', 'system_admin', 'audit_viewer'],
  },
];
```

### 4.2 Role → Default Landing Page

| Role | Default Route | Fallback |
|------|---------------|----------|
| case_handler | `/cases` | - |
| case_reviewer | `/cases` | - |
| department_head | `/cases` | - |
| finance_officer | `/payments` | `/cases` |
| fraud_officer | `/fraud` | `/cases` |
| system_admin | `/config` | `/cases` |
| audit_viewer | `/config` | - |

### 4.3 Navigation Filtering Logic

```typescript
// Sidebar.tsx
const filteredMenuItems = menuItems.filter(item => 
  item.roles.some(role => userRoles.includes(role))
);
```

### 4.4 Topbar Elements

| Element | Description | Roles |
|---------|-------------|-------|
| User Menu | Profile, logout | All |
| Notifications Bell | Unread count (Phase 10+) | All |
| Quick Search | Global search (Phase 10+) | All |
| Role Indicator | Current role badge | All |

---

## 5. Error Handling

### 5.1 Error States by Module

| Error Type | Display | Component |
|------------|---------|-----------|
| 401 Unauthorized | Redirect to login | ProtectedRoute |
| 403 Forbidden | "Access Denied" card | AccessDenied.tsx |
| 404 Not Found | "Case Not Found" message | NotFound.tsx |
| 500 Server Error | "Something went wrong" | ErrorBoundary |
| Network Error | "Connection lost" toast | Global handler |
| Empty State | "No results" message | Per-module |

### 5.2 Loading States

| State | Display |
|-------|---------|
| Initial Load | Skeleton placeholders |
| Pagination | Inline spinner |
| Refresh | Subtle loading indicator |
| Submit (future) | Button disabled + spinner |

---

## 6. Responsive Breakpoints

Based on Darkone template:

| Breakpoint | Width | Layout Adaptation |
|------------|-------|-------------------|
| Mobile | < 768px | Collapsed sidebar, stacked cards |
| Tablet | 768px - 1024px | Mini sidebar, 2-column grid |
| Desktop | > 1024px | Full sidebar, 3-4 column grid |

---

## 7. Asset Integration

### 7.1 CSS Dependencies

From Darkone `src/assets/scss/`:
- `style.scss` - Main stylesheet
- `icons.scss` - Boxicons
- Component-specific SCSS files

### 7.2 JavaScript Dependencies

From Darkone `src/assets/js/`:
- `app.js` - Core functionality
- `config.js` - Theme configuration
- `pages/dashboard.js` - Dashboard charts

### 7.3 Migration Strategy

1. Extract CSS variables to Tailwind config
2. Convert SCSS to Tailwind utilities where possible
3. Keep complex component styles in CSS modules
4. Use Boxicons via React component wrapper

---

## 8. File Structure Summary

```
src/
├── assets/
│   └── (Darkone assets)
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── Footer.tsx
│   ├── auth/
│   │   └── ProtectedRoute.tsx
│   ├── cases/
│   │   ├── CaseTable.tsx
│   │   ├── CaseFilters.tsx
│   │   ├── CaseHeader.tsx
│   │   ├── CaseTimeline.tsx
│   │   └── ...
│   ├── intake/
│   │   ├── WizardDataView.tsx
│   │   ├── DocumentChecklist.tsx
│   │   └── ...
│   ├── documents/
│   │   └── DocumentTable.tsx
│   ├── payments/
│   │   ├── BatchTable.tsx
│   │   └── ...
│   ├── fraud/
│   │   ├── SignalTable.tsx
│   │   └── ...
│   ├── config/
│   │   └── ...
│   └── ui/
│       └── (shared components)
├── hooks/
│   ├── useAuth.ts
│   ├── useCases.ts
│   ├── usePayments.ts
│   └── ...
├── pages/
│   ├── Login.tsx
│   ├── cases/
│   │   ├── CaseList.tsx
│   │   └── CaseDetail.tsx
│   ├── payments/
│   │   └── PaymentBatches.tsx
│   ├── fraud/
│   │   └── FraudOverview.tsx
│   └── config/
│       └── ConfigPanel.tsx
├── lib/
│   └── api.ts
└── types/
    └── index.ts
```

---

*End of Darkone-Admin-Wiring-Plan.md*
