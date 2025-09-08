import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UnifiedAppProvider } from "@/components/providers/UnifiedAppProvider";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

// 导入页面组件
import FinancialStatusPage from "./pages/FinancialStatusPage";
import DebtAnalysisPage from "./pages/DebtAnalysisPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <UnifiedAppProvider>
          <div className="min-h-screen bg-gray-100">
            <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen px-3 py-safe relative">
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<FinancialStatusPage />} />
                  <Route path="/financial-status" element={<Navigate to="/" replace />} />
                  <Route path="/debt-analysis" element={<DebtAnalysisPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </BrowserRouter>
            </div>
          </div>
        </UnifiedAppProvider>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
