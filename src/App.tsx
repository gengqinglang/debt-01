import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UnifiedAppProvider } from "@/components/providers/UnifiedAppProvider";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

// 导入页面组件
import FinancialStatusPage from "./pages/FinancialStatusPage";

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
            <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen px-2 py-safe relative">
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<FinancialStatusPage />} />
                  <Route path="/financial-status" element={<FinancialStatusPage />} />
                  <Route path="*" element={<FinancialStatusPage />} />
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
