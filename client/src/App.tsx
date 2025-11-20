import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import ApplicationForm from "@/pages/application-form";
import ApplicantLogin from "@/pages/applicant-login";
import ApplicantDashboard from "@/pages/applicant-dashboard";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminStats from "@/pages/admin-stats";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/apply" component={ApplicationForm} />
      <Route path="/applicant-login" component={ApplicantLogin} />
      <Route path="/applicant/dashboard" component={ApplicantDashboard} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/stats" component={AdminStats} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
