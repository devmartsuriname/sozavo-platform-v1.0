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

// Darkone Admin imports
import AdminLayout from "./components/darkone/layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import SignIn from "./pages/admin/auth/SignIn";
import SignUp from "./pages/admin/auth/SignUp";
import ResetPassword from "./pages/admin/auth/ResetPassword";
import LockScreen from "./pages/admin/auth/LockScreen";
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
            
            {/* Admin Error Pages (standalone, no layout) */}
            <Route path="/admin/pages/404" element={<Page404 />} />
            <Route path="/admin/pages/404-alt" element={<Page404Alt />} />
            
            {/* Protected Admin Routes with Layout */}
            <Route path="/admin" element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }>
              <Route index element={<Dashboard />} />
              
              {/* Tables */}
              <Route path="tables/basic" element={<TablesBasic />} />
              <Route path="tables/gridjs" element={<TablesGridJS />} />
              
              {/* UI Components */}
              <Route path="ui/tabs" element={<UITabs />} />
              <Route path="ui/accordion" element={<UIAccordion />} />
              <Route path="ui/alerts" element={<UIAlerts />} />
              <Route path="ui/avatar" element={<UIAvatar />} />
              <Route path="ui/badge" element={<UIBadge />} />
              <Route path="ui/breadcrumb" element={<UIBreadcrumb />} />
              <Route path="ui/buttons" element={<UIButtons />} />
              <Route path="ui/card" element={<UICard />} />
              <Route path="ui/carousel" element={<UICarousel />} />
              <Route path="ui/collapse" element={<UICollapse />} />
              <Route path="ui/dropdown" element={<UIDropdown />} />
              <Route path="ui/list-group" element={<UIListGroup />} />
              <Route path="ui/modal" element={<UIModal />} />
              <Route path="ui/offcanvas" element={<UIOffcanvas />} />
              <Route path="ui/pagination" element={<UIPagination />} />
              <Route path="ui/placeholders" element={<UIPlaceholders />} />
              <Route path="ui/popovers" element={<UIPopovers />} />
              <Route path="ui/progress" element={<UIProgress />} />
              <Route path="ui/scrollspy" element={<UIScrollspy />} />
              <Route path="ui/spinners" element={<UISpinners />} />
              <Route path="ui/toasts" element={<UIToasts />} />
              <Route path="ui/tooltips" element={<UITooltips />} />
              
              {/* Charts */}
              <Route path="charts" element={<Charts />} />
              
              {/* Forms */}
              <Route path="forms/basic" element={<FormsBasic />} />
              <Route path="forms/validation" element={<FormsValidation />} />
              <Route path="forms/flatpicker" element={<FormsFlatpicker />} />
              <Route path="forms/file-upload" element={<FormsFileUpload />} />
              <Route path="forms/editors" element={<FormsEditors />} />
              
              {/* Icons */}
              <Route path="icons/boxicons" element={<IconsBoxicons />} />
              <Route path="icons/solar" element={<IconsSolar />} />
              
              {/* Maps */}
              <Route path="maps/google" element={<MapsGoogle />} />
              <Route path="maps/vector" element={<MapsVector />} />
              
              {/* Layouts */}
              <Route path="layouts/dark-sidenav" element={<LayoutsPlaceholder />} />
              <Route path="layouts/dark-topnav" element={<LayoutsPlaceholder />} />
              <Route path="layouts/small-sidenav" element={<LayoutsPlaceholder />} />
              <Route path="layouts/hidden-sidenav" element={<LayoutsPlaceholder />} />
              <Route path="layouts/light" element={<LayoutsPlaceholder />} />
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
