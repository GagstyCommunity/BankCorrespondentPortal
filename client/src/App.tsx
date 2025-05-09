import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";

// Layouts
import MainLayout from "@/components/layouts/main-layout";

// Public Pages
import Home from "@/pages/home";
import Login from "@/pages/login";
import Services from "@/pages/services";
import Apply from "@/pages/apply";
import Contact from "@/pages/contact";

// Agent Pages
import AgentDashboard from "@/pages/agent/dashboard";
import AgentProfile from "@/pages/agent/profile";
import AgentTransactions from "@/pages/agent/transactions";
import AgentCheckIn from "@/pages/agent/check-in";
import AgentLocationLogs from "@/pages/agent/location-logs";

// Admin Pages
import AdminDashboard from "@/pages/admin/dashboard";
import AdminFraudEngine from "@/pages/admin/fraud-engine";
import AdminMapView from "@/pages/admin/map-view";
import AdminManageUsers from "@/pages/admin/manage-users";
import AdminAuditLogs from "@/pages/admin/audit-logs";
import AdminNotifications from "@/pages/admin/notifications";

// Auditor Pages
import AuditorDashboard from "@/pages/auditor/dashboard";
import AuditorAssignedCSPs from "@/pages/auditor/assigned-csps";
import AuditorRoutes from "@/pages/auditor/routes";
import AuditorAuditSubmissions from "@/pages/auditor/audit-submissions";
import AuditorAuditHistory from "@/pages/auditor/audit-history";

// Bank Officer Pages
import BankDashboard from "@/pages/bank/dashboard";
import BankRegionCSPs from "@/pages/bank/region-csps";
import BankReports from "@/pages/bank/reports";
import BankDisputes from "@/pages/bank/disputes";
import BankAuditReviews from "@/pages/bank/audit-reviews";

// Not Found
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/services" component={Services} />
      <Route path="/apply" component={Apply} />
      <Route path="/contact" component={Contact} />
      
      {/* Agent Routes */}
      <Route path="/agent/dashboard">
        <MainLayout>
          <AgentDashboard />
        </MainLayout>
      </Route>
      <Route path="/agent/profile">
        <MainLayout>
          <AgentProfile />
        </MainLayout>
      </Route>
      <Route path="/agent/transactions">
        <MainLayout>
          <AgentTransactions />
        </MainLayout>
      </Route>
      <Route path="/agent/check-in">
        <MainLayout>
          <AgentCheckIn />
        </MainLayout>
      </Route>
      <Route path="/agent/location-logs">
        <MainLayout>
          <AgentLocationLogs />
        </MainLayout>
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard">
        <MainLayout>
          <AdminDashboard />
        </MainLayout>
      </Route>
      <Route path="/admin/fraud-engine">
        <MainLayout>
          <AdminFraudEngine />
        </MainLayout>
      </Route>
      <Route path="/admin/map-view">
        <MainLayout>
          <AdminMapView />
        </MainLayout>
      </Route>
      <Route path="/admin/manage-users">
        <MainLayout>
          <AdminManageUsers />
        </MainLayout>
      </Route>
      <Route path="/admin/audit-logs">
        <MainLayout>
          <AdminAuditLogs />
        </MainLayout>
      </Route>
      <Route path="/admin/notifications">
        <MainLayout>
          <AdminNotifications />
        </MainLayout>
      </Route>
      
      {/* Auditor Routes */}
      <Route path="/auditor/dashboard">
        <MainLayout>
          <AuditorDashboard />
        </MainLayout>
      </Route>
      <Route path="/auditor/assigned-csps">
        <MainLayout>
          <AuditorAssignedCSPs />
        </MainLayout>
      </Route>
      <Route path="/auditor/routes">
        <MainLayout>
          <AuditorRoutes />
        </MainLayout>
      </Route>
      <Route path="/auditor/audit-submissions">
        <MainLayout>
          <AuditorAuditSubmissions />
        </MainLayout>
      </Route>
      <Route path="/auditor/audit-history">
        <MainLayout>
          <AuditorAuditHistory />
        </MainLayout>
      </Route>
      
      {/* Bank Officer Routes */}
      <Route path="/bank/dashboard">
        <MainLayout>
          <BankDashboard />
        </MainLayout>
      </Route>
      <Route path="/bank/region-csps">
        <MainLayout>
          <BankRegionCSPs />
        </MainLayout>
      </Route>
      <Route path="/bank/reports">
        <MainLayout>
          <BankReports />
        </MainLayout>
      </Route>
      <Route path="/bank/disputes">
        <MainLayout>
          <BankDisputes />
        </MainLayout>
      </Route>
      <Route path="/bank/audit-reviews">
        <MainLayout>
          <BankAuditReviews />
        </MainLayout>
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
