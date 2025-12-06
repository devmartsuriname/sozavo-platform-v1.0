import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Darkone Admin imports
import AdminLayout from "./components/darkone/layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import SignIn from "./pages/admin/auth/SignIn";
import SignUp from "./pages/admin/auth/SignUp";
import TablesBasic from "./pages/admin/tables/TablesBasic";
import TablesGridJS from "./pages/admin/tables/TablesGridJS";
import UITabs from "./pages/admin/ui/UITabs";
import UIAccordion from "./pages/admin/ui/UIAccordion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Admin Auth Routes (standalone, no layout) */}
          <Route path="/admin/auth/signin" element={<SignIn />} />
          <Route path="/admin/auth/signup" element={<SignUp />} />
          
          {/* Admin Routes with Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="tables/basic" element={<TablesBasic />} />
            <Route path="tables/gridjs" element={<TablesGridJS />} />
            <Route path="ui/tabs" element={<UITabs />} />
            <Route path="ui/accordion" element={<UIAccordion />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
