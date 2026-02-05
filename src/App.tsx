 import { Toaster } from "@/components/ui/toaster";
 import { Toaster as Sonner } from "@/components/ui/sonner";
 import { TooltipProvider } from "@/components/ui/tooltip";
 import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 import { BrowserRouter, Routes, Route } from "react-router-dom";
 import { VotingProvider } from "@/contexts/VotingContext";
 import Index from "./pages/Index";
 import AuthPage from "./pages/AuthPage";
 import CandidatesPage from "./pages/CandidatesPage";
 import VotingPage from "./pages/VotingPage";
 import ResultsPage from "./pages/ResultsPage";
 import AdminDashboard from "./pages/AdminDashboard";
 import NotFound from "./pages/NotFound";
 
 const queryClient = new QueryClient();
 
 const App = () => (
   <QueryClientProvider client={queryClient}>
     <VotingProvider>
       <TooltipProvider>
         <Toaster />
         <Sonner />
         <BrowserRouter>
           <Routes>
             <Route path="/" element={<Index />} />
             <Route path="/auth" element={<AuthPage />} />
             <Route path="/login" element={<AuthPage />} />
             <Route path="/admin-login" element={<AuthPage />} />
             <Route path="/candidates" element={<CandidatesPage />} />
             <Route path="/vote" element={<VotingPage />} />
             <Route path="/results" element={<ResultsPage />} />
             <Route path="/admin" element={<AdminDashboard />} />
             {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
             <Route path="*" element={<NotFound />} />
           </Routes>
         </BrowserRouter>
       </TooltipProvider>
     </VotingProvider>
   </QueryClientProvider>
 );
 
 export default App;
