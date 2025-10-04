import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PersonalityProfiler from "./pages/PersonalityProfiler";
import MicroLearning from "./pages/MicroLearning";
import MistakeMirror from "./pages/MistakeMirror";
import FinancialSimulator from "./pages/FinancialSimulator";
import SmartAlerts from "./pages/SmartAlerts";
import SmartInvestmentAdvisor from "./pages/SmartInvestmentAdvisor";
import GoalPlanner from "./pages/GoalPlanner";
import CrowdWisdom from "./pages/CrowdWisdom";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-blue-900">
        {/* Decorative background elements */}
        <div className="fixed inset-0 bg-grid-pattern opacity-5"></div>
        <div className="fixed top-0 -left-4 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
        <div className="fixed top-0 -right-4 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="fixed -bottom-8 left-20 w-80 h-80 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
        
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="relative z-10">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/personality-profiler" element={<PersonalityProfiler />} />
              <Route path="/micro-learning" element={<MicroLearning />} />
              <Route path="/mistake-mirror" element={<MistakeMirror />} />
              <Route path="/financial-simulator" element={<FinancialSimulator />} />
              <Route path="/smart-alerts" element={<SmartAlerts />} />
              <Route path="/investment-advisor" element={<SmartInvestmentAdvisor />} />
              <Route path="/goal-planner" element={<GoalPlanner />} />
              <Route path="/crowd-wisdom" element={<CrowdWisdom />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;