import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Auth
import { AuthProvider } from "./integrations/supabase/AuthContext";
import { RequireAuth } from "./components/auth/RequireAuth";
import { RequireRole } from "./components/auth/RequireRole";

// Darkone Admin imports
import AdminLayout from "./components/darkone/layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import SignIn from "./pages/admin/auth/SignIn";
import SignUp from "./pages/admin/auth/SignUp";
import ResetPassword from "./pages/admin/auth/ResetPassword";
import LockScreen from "./pages/admin/auth/LockScreen";
import AccessDenied from "./pages/admin/AccessDenied";
import TablesBasic from "./pages/admin/tables/TablesBasic";
import TablesGridJS from "./pages/admin/tables/TablesGridJS";
import UITabs from "./pages/admin/ui/UITabs";
import UIAccordion from "./pages/admin/ui/UIAccordion";
import UIAlerts from "./pages/admin/ui/UIAlerts";
import UIAvatar from "./pages/admin/ui/UIAvatar";
import UIBadge from "./pages/admin/ui/UIBadge";
import UIBreadcrumb from "./pages/admin/ui/UIBreadcrumb";
import UIButtons from "./pages/admin/ui/UIButtons";
import UICard from "./pages/admin/ui/UICard";
import UICarousel from "./pages/admin/ui/UICarousel";
import UICollapse from "./pages/admin/ui/UICollapse";
import UIDropdown from "./pages/admin/ui/UIDropdown";
import UIListGroup from "./pages/admin/ui/UIListGroup";
import UIModal from "./pages/admin/ui/UIModal";
import UIOffcanvas from "./pages/admin/ui/UIOffcanvas";
import UIPagination from "./pages/admin/ui/UIPagination";
import UIPlaceholders from "./pages/admin/ui/UIPlaceholders";
import UIPopovers from "./pages/admin/ui/UIPopovers";
import UIProgress from "./pages/admin/ui/UIProgress";
import UIScrollspy from "./pages/admin/ui/UIScrollspy";
import UISpinners from "./pages/admin/ui/UISpinners";
import UIToasts from "./pages/admin/ui/UIToasts";
import UITooltips from "./pages/admin/ui/UITooltips";
import Charts from "./pages/admin/Charts";
import FormsBasic from "./pages/admin/forms/FormsBasic";
import FormsValidation from "./pages/admin/forms/FormsValidation";
import FormsFlatpicker from "./pages/admin/forms/FormsFlatpicker";
import FormsFileUpload from "./pages/admin/forms/FormsFileUpload";
import FormsEditors from "./pages/admin/forms/FormsEditors";
import IconsBoxicons from "./pages/admin/icons/IconsBoxicons";
import IconsSolar from "./pages/admin/icons/IconsSolar";
import MapsGoogle from "./pages/admin/maps/MapsGoogle";
import MapsVector from "./pages/admin/maps/MapsVector";
import LayoutsPlaceholder from "./pages/admin/layouts/LayoutsPlaceholder";
import Page404 from "./pages/admin/pages/Page404";
import Page404Alt from "./pages/admin/pages/Page404Alt";

// Placeholder components for MVP modules (to be implemented in future phases)
import AdminComingSoonPage from "./components/darkone/placeholders/AdminComingSoonPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Admin Auth Routes (standalone, no layout, no protection) */}
            <Route path="/admin/auth/signin" element={<SignIn />} />
            <Route path="/admin/auth/signup" element={<SignUp />} />
            <Route path="/admin/auth/password" element={<ResetPassword />} />
            <Route path="/admin/auth/lock-screen" element={<LockScreen />} />
            
            {/* Admin Error/Access Pages (standalone, no layout) */}
            <Route path="/admin/pages/404" element={<Page404 />} />
            <Route path="/admin/pages/404-alt" element={<Page404Alt />} />
            <Route path="/admin/access-denied" element={<AccessDenied />} />
            
            {/* Protected Admin Routes with Layout */}
            <Route path="/admin" element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }>
              {/* Dashboard - requires dashboard permission */}
              <Route index element={
                <RequireRole allowed={["dashboard"]}>
                  <Dashboard />
                </RequireRole>
              } />
              
              {/* MVP Business Modules - Role Protected */}
              <Route path="cases/*" element={
                <RequireRole allowed={["cases"]}>
                  <AdminComingSoonPage title="Cases" subTitle="Case Management" message="Case management module coming soon." />
                </RequireRole>
              } />
              <Route path="eligibility/*" element={
                <RequireRole allowed={["eligibility"]}>
                  <AdminComingSoonPage title="Eligibility" subTitle="Eligibility Review" message="Eligibility review module coming soon." />
                </RequireRole>
              } />
              <Route path="documents/*" element={
                <RequireRole allowed={["documents"]}>
                  <AdminComingSoonPage title="Documents" subTitle="Document Management" message="Document management module coming soon." />
                </RequireRole>
              } />
              <Route path="payments/*" element={
                <RequireRole allowed={["payments"]}>
                  <AdminComingSoonPage title="Payments" subTitle="Payment Processing" message="Payment processing module coming soon." />
                </RequireRole>
              } />
              <Route path="fraud/*" element={
                <RequireRole allowed={["fraud"]}>
                  <AdminComingSoonPage title="Fraud & Risk" subTitle="Fraud Detection" message="Fraud detection module coming soon." />
                </RequireRole>
              } />
              <Route path="config/*" element={
                <RequireRole allowed={["config"]}>
                  <AdminComingSoonPage title="Configuration" subTitle="System Settings" message="System configuration module coming soon." />
                </RequireRole>
              } />
              <Route path="users/*" element={
                <RequireRole allowed={["users"]}>
                  <AdminComingSoonPage title="User Management" subTitle="User Administration" message="User management module coming soon." />
                </RequireRole>
              } />
              
              {/* UI Kit Routes - system_admin only */}
              <Route path="tables/basic" element={
                <RequireRole allowed={["ui_kit"]}>
                  <TablesBasic />
                </RequireRole>
              } />
              <Route path="tables/gridjs" element={
                <RequireRole allowed={["ui_kit"]}>
                  <TablesGridJS />
                </RequireRole>
              } />
              
              {/* UI Components */}
              <Route path="ui/tabs" element={
                <RequireRole allowed={["ui_kit"]}>
                  <UITabs />
                </RequireRole>
              } />
              <Route path="ui/accordion" element={
                <RequireRole allowed={["ui_kit"]}>
                  <UIAccordion />
                </RequireRole>
              } />
              <Route path="ui/alerts" element={
                <RequireRole allowed={["ui_kit"]}>
                  <UIAlerts />
                </RequireRole>
              } />
              <Route path="ui/avatar" element={
                <RequireRole allowed={["ui_kit"]}>
                  <UIAvatar />
                </RequireRole>
              } />
              <Route path="ui/badge" element={
                <RequireRole allowed={["ui_kit"]}>
                  <UIBadge />
                </RequireRole>
              } />
              <Route path="ui/breadcrumb" element={
                <RequireRole allowed={["ui_kit"]}>
                  <UIBreadcrumb />
                </RequireRole>
              } />
              <Route path="ui/buttons" element={
                <RequireRole allowed={["ui_kit"]}>
                  <UIButtons />
                </RequireRole>
              } />
              <Route path="ui/card" element={
                <RequireRole allowed={["ui_kit"]}>
                  <UICard />
                </RequireRole>
              } />
              <Route path="ui/carousel" element={
                <RequireRole allowed={["ui_kit"]}>
                  <UICarousel />
                </RequireRole>
              } />
              <Route path="ui/collapse" element={
                <RequireRole allowed={["ui_kit"]}>
                  <UICollapse />
                </RequireRole>
              } />
              <Route path="ui/dropdown" element={
                <RequireRole allowed={["ui_kit"]}>
                  <UIDropdown />
                </RequireRole>
              } />
              <Route path="ui/list-group" element={
                <RequireRole allowed={["ui_kit"]}>
                  <UIListGroup />
                </RequireRole>
              } />
              <Route path="ui/modal" element={
                <RequireRole allowed={["ui_kit"]}>
                  <UIModal />
                </RequireRole>
              } />
              <Route path="ui/offcanvas" element={
                <RequireRole allowed={["ui_kit"]}>
                  <UIOffcanvas />
                </RequireRole>
              } />
              <Route path="ui/pagination" element={
                <RequireRole allowed={["ui_kit"]}>
                  <UIPagination />
                </RequireRole>
              } />
              <Route path="ui/placeholders" element={
                <RequireRole allowed={["ui_kit"]}>
                  <UIPlaceholders />
                </RequireRole>
              } />
              <Route path="ui/popovers" element={
                <RequireRole allowed={["ui_kit"]}>
                  <UIPopovers />
                </RequireRole>
              } />
              <Route path="ui/progress" element={
                <RequireRole allowed={["ui_kit"]}>
                  <UIProgress />
                </RequireRole>
              } />
              <Route path="ui/scrollspy" element={
                <RequireRole allowed={["ui_kit"]}>
                  <UIScrollspy />
                </RequireRole>
              } />
              <Route path="ui/spinners" element={
                <RequireRole allowed={["ui_kit"]}>
                  <UISpinners />
                </RequireRole>
              } />
              <Route path="ui/toasts" element={
                <RequireRole allowed={["ui_kit"]}>
                  <UIToasts />
                </RequireRole>
              } />
              <Route path="ui/tooltips" element={
                <RequireRole allowed={["ui_kit"]}>
                  <UITooltips />
                </RequireRole>
              } />
              
              {/* Charts */}
              <Route path="charts" element={
                <RequireRole allowed={["ui_kit"]}>
                  <Charts />
                </RequireRole>
              } />
              
              {/* Forms */}
              <Route path="forms/basic" element={
                <RequireRole allowed={["ui_kit"]}>
                  <FormsBasic />
                </RequireRole>
              } />
              <Route path="forms/validation" element={
                <RequireRole allowed={["ui_kit"]}>
                  <FormsValidation />
                </RequireRole>
              } />
              <Route path="forms/flatpicker" element={
                <RequireRole allowed={["ui_kit"]}>
                  <FormsFlatpicker />
                </RequireRole>
              } />
              <Route path="forms/file-upload" element={
                <RequireRole allowed={["ui_kit"]}>
                  <FormsFileUpload />
                </RequireRole>
              } />
              <Route path="forms/editors" element={
                <RequireRole allowed={["ui_kit"]}>
                  <FormsEditors />
                </RequireRole>
              } />
              
              {/* Icons */}
              <Route path="icons/boxicons" element={
                <RequireRole allowed={["ui_kit"]}>
                  <IconsBoxicons />
                </RequireRole>
              } />
              <Route path="icons/solar" element={
                <RequireRole allowed={["ui_kit"]}>
                  <IconsSolar />
                </RequireRole>
              } />
              
              {/* Maps */}
              <Route path="maps/google" element={
                <RequireRole allowed={["ui_kit"]}>
                  <MapsGoogle />
                </RequireRole>
              } />
              <Route path="maps/vector" element={
                <RequireRole allowed={["ui_kit"]}>
                  <MapsVector />
                </RequireRole>
              } />
              
              {/* Layouts */}
              <Route path="layouts/dark-sidenav" element={
                <RequireRole allowed={["ui_kit"]}>
                  <LayoutsPlaceholder />
                </RequireRole>
              } />
              <Route path="layouts/dark-topnav" element={
                <RequireRole allowed={["ui_kit"]}>
                  <LayoutsPlaceholder />
                </RequireRole>
              } />
              <Route path="layouts/small-sidenav" element={
                <RequireRole allowed={["ui_kit"]}>
                  <LayoutsPlaceholder />
                </RequireRole>
              } />
              <Route path="layouts/hidden-sidenav" element={
                <RequireRole allowed={["ui_kit"]}>
                  <LayoutsPlaceholder />
                </RequireRole>
              } />
              <Route path="layouts/light" element={
                <RequireRole allowed={["ui_kit"]}>
                  <LayoutsPlaceholder />
                </RequireRole>
              } />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
