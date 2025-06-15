import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ReportIssue from "./pages/ReportIssue";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import MissingCases from "./pages/MissingCases";
import LostFound from "./pages/LostFound";
import SafetyAlerts from "./pages/SafetyAlerts";
import CivicReports from "./pages/CivicReports";

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
            <Route path="/missing" element={<MissingCases />} />
            <Route path="/lostfound" element={<LostFound />} />
            <Route path="/safety" element={<SafetyAlerts />} />
            <Route path="/civic" element={<CivicReports />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
