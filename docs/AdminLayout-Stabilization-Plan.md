# Admin Layout Stabilization Plan

> **Version:** 1.0.0  
> **Status:** Draft – Pending Approval  
> **Purpose:** Lock in the Darkone admin layout before wiring MVP business logic  
> **Dependencies:** Phase X (Darkone 1:1 React Conversion) must be complete

---

## 1. Overview

This document defines the strategy for stabilizing the Darkone admin layout before integrating any MVP modules (cases, documents, payments, fraud, configuration). The goal is to ensure that the admin shell is:

1. **Visually identical** to the original Darkone HTML template
2. **Structurally stable** with no missing imports or broken routes
3. **Reusable** with clearly extracted components for MVP module development
4. **Error-proof** with graceful handling of empty/loading states

---

## 2. Layout Import Verification Checklist

### 2.1 Assets Verification

| Asset Type | Location | Status |
|------------|----------|--------|
| Theme CSS | `public/darkone/css/darkone.css` | ✅ Present |
| Logos | `public/darkone/images/logo-*.png` | ✅ Present (3 files) |
| Avatars | `public/darkone/images/users/avatar-*.jpg` | ✅ Present (6 files) |
| Fonts | `public/darkone/fonts/boxicons.*` | ✅ Present |
| App JS | `public/darkone/js/app.js` | ✅ Present |
| Config JS | `public/darkone/js/config.js` | ✅ Present |

### 2.2 Core Layout Components

| Component | File | Status | Notes |
|-----------|------|--------|-------|
| AdminLayout | `src/components/darkone/layout/AdminLayout.tsx` | ✅ Complete | Root wrapper with `.darkone-admin` scope |
| Sidebar | `src/components/darkone/layout/Sidebar.tsx` | ✅ Complete | Full menu structure with icons |
| Topbar | `src/components/darkone/layout/Topbar.tsx` | ✅ Complete | Theme toggle, sidebar toggle, notifications, user menu |
| Footer | `src/components/darkone/layout/Footer.tsx` | ✅ Complete | Footer text |
| PageTitle | `src/components/darkone/layout/PageTitle.tsx` | ✅ Complete | Breadcrumb component |
| Icon | `src/components/darkone/ui/Icon.tsx` | ✅ Complete | Iconify wrapper |

### 2.3 Key Page Coverage

| Route | Page | Status | Notes |
|-------|------|--------|-------|
| `/admin` | Dashboard | ✅ Verified | Light/dark mode working |
| `/admin/auth/signin` | Sign In | ✅ Verified | Gradient background working |
| `/admin/auth/signup` | Sign Up | ✅ Verified | Matches demo |
| `/admin/tables/basic` | Basic Tables | ✅ Created | Table structure matches demo |
| `/admin/tables/gridjs` | Grid JS Tables | ✅ Created | Placeholder ready |
| `/admin/ui/tabs` | UI Tabs | ✅ Created | Tab component working |
| `/admin/ui/accordion` | UI Accordion | ✅ Created | Accordion component working |

---

## 3. Element Inventory

### 3.1 Reusable UI Elements (Currently in Dashboard)

| Element Type | Location in Dashboard | Extraction Status |
|--------------|----------------------|-------------------|
| Stat Cards (KPI tiles) | Top row - 4 cards | 🔲 Not extracted |
| Revenue Chart Container | Left column | 🔲 Not extracted |
| Sessions Chart Container | Right column | 🔲 Not extracted |
| New Accounts Table | Bottom left | 🔲 Not extracted |
| Recent Transactions Table | Bottom right | 🔲 Not extracted |
| Badge (Verified/Pending) | Tables | 🔲 Not extracted |
| Avatar with status | Tables | 🔲 Not extracted |

### 3.2 Proposed Component Extraction (Phase 9)

| Component Name | Purpose | Source |
|----------------|---------|--------|
| `DarkoneCard` | Reusable card wrapper with header/body | Dashboard cards |
| `DarkoneStatWidget` | KPI stat card with icon, value, change % | Dashboard stat row |
| `DarkoneTable` | Table with Darkone styling | Tables pages |
| `DarkoneBadge` | Status badges (success/warning/danger) | Table badges |
| `DarkoneChartBlock` | Chart container with header and placeholder | Dashboard charts |
| `DarkoneFilterBar` | Filter/search bar for tables | Tables pages |

---

## 4. Refactor & Cleanup Strategy

### 4.1 Safe Refactoring Rules

1. **DO NOT** change any visual styling or spacing
2. **DO NOT** introduce Tailwind or ShadCN into Darkone components
3. **DO** extract repeated JSX into small, focused components
4. **DO** replace hardcoded demo text with neutral placeholders
5. **DO** ensure all components accept props for dynamic data

### 4.2 Cleanup Steps (To Be Executed After Approval)

1. **Step 1:** Extract `DarkoneCard` from Dashboard
   - Single card wrapper with `header` and `children` props
   - No styling changes

2. **Step 2:** Extract `DarkoneStatWidget` 
   - Props: `title`, `value`, `change`, `icon`, `iconBg`
   - Replace hardcoded numbers with placeholder values

3. **Step 3:** Extract `DarkoneTable`
   - Props: `columns`, `data`, `striped`, `hover`
   - Works with any data shape

4. **Step 4:** Extract `DarkoneBadge`
   - Props: `variant` (success/warning/danger/info), `children`
   - Maps to Bootstrap badge classes

5. **Step 5:** Replace demo-specific content
   - "$12.87M" → "[Revenue Value]"
   - "Bitless Bucket" → "[Account Name]"
   - Chart areas → "[Chart Placeholder]"

---

## 5. Error-Proofing Checklist

### 5.1 Pre-MVP Integration Checks

- [ ] All admin routes load without console errors
- [ ] All images/icons render correctly (no 404s)
- [ ] Theme toggle works on all pages
- [ ] Sidebar toggle works on all pages
- [ ] Sidebar navigation links resolve correctly
- [ ] Footer appears on all pages
- [ ] No dead imports in any component

### 5.2 Empty State Handling

All extracted components must:
- Render gracefully when data is `undefined` or empty array
- Show appropriate "No data" message where applicable
- Not throw runtime errors with missing props

---

## 6. Module Reuse Guidelines

### 6.1 How MVP Modules Should Use the Layout

Each MVP module (cases, documents, payments, fraud, configuration) should:

1. **Use `AdminLayout` as parent** - Already configured in router
2. **Use `PageTitle` for breadcrumbs** - Pass `title` and `breadcrumb` array
3. **Use extracted Darkone components** - `DarkoneCard`, `DarkoneTable`, etc.
4. **Follow Bootstrap class conventions** - Use only classes from Darkone CSS
5. **Respect theme variables** - Use CSS variables, not hardcoded colors

### 6.2 Theme Persistence

- Theme state stored in `localStorage` as `"darkone-theme"`
- Sidebar state stored in `localStorage` as `"darkone-sidebar-size"`
- Both are initialized on `AdminLayout` mount

### 6.3 Adding New Pages

To add a new admin page:

1. Create page component in `src/pages/admin/[module]/[Page].tsx`
2. Add route to router configuration
3. Add sidebar navigation item in `Sidebar.tsx`
4. Use `PageTitle` component at top of page
5. Use `DarkoneCard` for content sections
6. Use `DarkoneTable` for data tables

---

## 7. Known Limitations

1. **Charts:** ApexCharts not yet integrated; using placeholder divs
2. **Maps:** Google/Vector maps not yet integrated; pages exist as placeholders
3. **File Upload:** Dropzone not integrated; using native file input
4. **Rich Editor:** Quill.js not integrated; using textarea placeholder

---

## 8. Pending Approval

### Status: ⏸️ DRAFT - NOT EXECUTED

The following actions are **proposed only** and have NOT been executed:

1. Component extraction (DarkoneCard, DarkoneStatWidget, etc.)
2. Demo content replacement with placeholders
3. Empty state handling additions

**Awaiting explicit approval before proceeding with any refactoring.**

---

## 9. Next Steps After Approval

1. Execute component extraction (Steps 4.2.1 - 4.2.5)
2. Verify all error-proofing checks (Section 5.1)
3. Document final component API in dedicated component docs
4. Begin Phase 9 MVP module wiring

---

**END OF ADMIN LAYOUT STABILIZATION PLAN v1.0.0**
