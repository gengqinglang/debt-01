import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UnifiedAppProvider } from "@/components/providers/UnifiedAppProvider";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import React, { Suspense, lazy } from "react";

// 路由级按需加载页面，降低首屏 JS 体积
const FinancialStatusPage = lazy(() => import("./pages/FinancialStatusPage"));

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
                  <Suspense fallback={<div className="p-6 text-center text-gray-500">页面加载中…</div>}>
                    <Routes>
                      <Route path="/" element={<FinancialStatusPage />} />
                      <Route path="/financial-status" element={<FinancialStatusPage />} />
                      <Route path="*" element={<FinancialStatusPage />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
            </div>
          </div>
        </UnifiedAppProvider>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
