import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UnifiedAppProvider } from "@/components/providers/UnifiedAppProvider";
import { MembershipProvider } from "@/components/membership/MembershipProvider";
import MembershipGate from "@/components/membership/MembershipGate";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

// 导入页面组件
import LandingPage from "./pages/LandingPage";
import Onboarding from "./pages/Onboarding";
import WhoAreYouPage from "./pages/WhoAreYouPage";
import WealthNavigationPage from "./pages/WealthNavigationPage";
import WealthJourneyLaunchPage from "./pages/WealthJourneyLaunchPage";
import PersonalInfoPage from "./pages/PersonalInfoPage";
import RequiredLifePage from "./pages/RequiredLifePage";
import OptionalLifePage from "./pages/OptionalLifePage";
import ConstraintsPage from "./pages/ConstraintsPage";
import FinancialStatusPage from "./pages/FinancialStatusPage";
import CareerPlanningPage from "./pages/CareerPlanningPage";
import FutureIncomePage from "./pages/FutureIncomeePage";
import AssetPage from "./pages/AssetPage";
import AssetJianPage from "./pages/AssetJianPage";
import ShangzhuanGongjijinPage from "./pages/ShangzhuanGongjijinPage";
import LifeTimelinePage from "./pages/LifeTimelinePage";
import AssetFreedomCopyPage from "./pages/AssetFreedomCopyPage";

import ChangshiPage from "./pages/ChangshiPage";
import OptimizedChangshiPage from "./pages/OptimizedChangshiPage";
import RiskAssessmentPage from "./pages/RiskAssessmentPage";
import RiskAssessmentProcessPage from "./pages/RiskAssessmentProcessPage";
import AssessmentBasisPage from "./pages/AssessmentBasisPage";
import RiskDetailPage from "./pages/RiskDetailPage";
import NotFound from "./pages/NotFound";
import ExpenditureSummaryPage from "./pages/ExpenditureSummaryPage";
import IncomeSummaryPage from "./pages/IncomeSummaryPage";
import PersonalCenterPage from "./pages/PersonalCenterPage";
import MemberCenterPage from "./pages/MemberCenterPage";
import AdjustmentAdvicePage from "./pages/AdjustmentAdvicePage";
import ProtectionAdvicePage from "./pages/ProtectionAdvicePage";
import CareerPlanCoachPage from "./pages/CareerPlanCoachPage";
import AdjustmentSolutionPage from "./pages/AdjustmentSolutionPage";
import AICareerPlanningPage from "./pages/AICareerPlanningPage";
import ProtectionPlanPage from "./pages/ProtectionPlanPage";
import FutureWealthPredictionPage from "./pages/FutureWealthPredictionPage";
import RedemptionTaskPage from "./pages/RedemptionTaskPage";
import SavingsTaskPage from "./pages/SavingsTaskPage";
import MemberBenefitsPage from "./pages/MemberBenefitsPage";
import PageA from "./pages/PageA";
import FutureSpendingPage from "./pages/FutureSpendingPage";
import AnnuityAssessmentPage from "./pages/AnnuityAssessmentPage";
import JuzhuguihuaPage from "./pages/JuzhuguihuaPage";
import DaikuanYucePage from "./pages/DaikuanYucePage";
import ChangshouCepingPage from "./pages/ChangshouCepingPage";
import CaseDetailPage from "./pages/CaseDetailPage";
import AdjustmentAdviceDetailPage from "./pages/AdjustmentAdviceDetailPage";
import DebtInfoEntryPage from "./pages/DebtInfoEntryPage";
import DebtOptimizationPage from "./pages/DebtOptimizationPage";
import DebtPressureAnalysisPage from "./pages/DebtPressureAnalysisPage";
import BaogaoPage from "./pages/BaogaoPage";
import GongjuPage from "./pages/GongjuPage";

import ShangzhuangongPage from "./pages/ShangzhuangongPage";
import GudingZhuanFudongPage from "./pages/GudingZhuanFudongPage";
import BiangengFangshiPage from "./pages/BiangengFangshiPage";
import YanqiHuankuanPage from "./pages/YanqiHuankuanPage";
import ZhihuanPage from "./pages/ZhihuanPage";
import RongziJuecePage from "./pages/RongziJuecePage";

import TiqianHuankuan1Page from "./pages/TiqianHuankuan1Page";
import TiqianHuankuan2Page from "./pages/TiqianHuankuan2Page";
import TqShouyePage from "./pages/TqShouyePage";
import TqbuzhouPage from "./pages/TqbuzhouPage";

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
        <MembershipProvider>
          <UnifiedAppProvider>
            <div className="min-h-screen bg-gray-100">
              <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen px-2 py-safe relative">
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    
                    {/* 会员制控制的 /changshi 路由 */}
                    <Route path="/changshi" element={
                      <MembershipGate>
                        {(isMember) => 
                          isMember ? <OptimizedChangshiPage /> : <ChangshiPage />
                        }
                      </MembershipGate>
                    } />
                    
                    {/* 会员权益详情页面 */}
                    <Route path="/member-benefits" element={<MemberBenefitsPage />} />
                    
                    {/* 新增的页面A */}
                    <Route path="/page-a" element={<PageA />} />
                    
                    {/* 长寿风险测评页面 */}
                    <Route path="/changshou-ceping" element={<ChangshouCepingPage />} />
                    
                    {/* 其他路由保持不变 */}
                    <Route path="/adjustment-solution" element={<AdjustmentSolutionPage />} />
                    <Route path="/career-plan-coach" element={<CareerPlanCoachPage />} />
                    <Route path="/ai-career-planning" element={<AICareerPlanningPage />} />
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/wealth-journey-launch" element={<WealthJourneyLaunchPage />} />
                    <Route path="/debt-pressure-analysis" element={<DebtPressureAnalysisPage />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/who-are-you" element={<WhoAreYouPage />} />
                    <Route path="/personal-info" element={<PersonalInfoPage />} />
                    <Route path="/required-life" element={<RequiredLifePage />} />
                    <Route path="/optional-life" element={<OptionalLifePage />} />
          <Route path="/expenditure-summary" element={<ExpenditureSummaryPage />} />
          <Route path="/income-summary" element={<IncomeSummaryPage />} />
                    <Route path="/constraints" element={<ConstraintsPage />} />
                    <Route path="/financial-status" element={<FinancialStatusPage />} />
                    <Route path="/asset" element={<AssetPage />} />
                    <Route path="/asset-jian" element={<AssetJianPage />} />
                    <Route path="/career-planning" element={<CareerPlanningPage />} />
                    <Route path="/future-income" element={<FutureIncomePage />} />
                    <Route path="/asset-freedom-copy" element={<AssetFreedomCopyPage />} />
                    <Route path="/risk-assessment" element={<RiskAssessmentPage />} />
                    <Route path="/risk-assessment-process" element={<RiskAssessmentProcessPage />} />
                    <Route path="/assessment-basis" element={<AssessmentBasisPage />} />
                    <Route path="/risk-detail/:riskId" element={<RiskDetailPage />} />
                    <Route path="/life-timeline" element={<LifeTimelinePage />} />
                    <Route path="/personal-center" element={<PersonalCenterPage />} />
                    <Route path="/member-center" element={<MemberCenterPage />} />
                    <Route path="/adjustment-advice" element={<AdjustmentAdvicePage />} />
                    <Route path="/protection-advice" element={<ProtectionAdvicePage />} />
                    <Route path="/protection-plan" element={<ProtectionPlanPage />} />
                    <Route path="/future-wealth-prediction" element={<FutureWealthPredictionPage />} />
                    <Route path="/future-free-spending" element={<FutureSpendingPage />} />
                    <Route path="/redemption-task" element={<RedemptionTaskPage />} />
                    <Route path="/savings-task" element={<SavingsTaskPage />} />
                    <Route path="/nianjinceping" element={<AnnuityAssessmentPage />} />
                    <Route path="/juzhuguihua" element={<JuzhuguihuaPage />} />
                    <Route path="/daikuan-yuce" element={<DaikuanYucePage />} />
                    <Route path="/case/:caseId" element={<CaseDetailPage />} />
                    <Route path="/adjustment-advice-detail" element={<AdjustmentAdviceDetailPage />} />
                    <Route path="/debt-info-entry" element={<DebtInfoEntryPage />} />
                    <Route path="/debt-optimization" element={<DebtOptimizationPage />} />
                    <Route path="/baogao" element={<BaogaoPage />} />
                    <Route path="/gongju" element={<GongjuPage />} />
                    <Route path="/tiqianhuankuan1" element={<TiqianHuankuan1Page />} />
                    <Route path="/tiqianhuankuan2" element={<TiqianHuankuan2Page />} />
                    <Route path="/tq-shouye" element={<TqShouyePage />} />
                    <Route path="/tqbuzhou" element={<TqbuzhouPage />} />
                    <Route path="/shangzhuan-gongjijin" element={<ShangzhuanGongjijinPage />} />
                    <Route path="/shangzhuangong" element={<ShangzhuangongPage />} />
                    <Route path="/guding-zhuan-fudong" element={<GudingZhuanFudongPage />} />
                    <Route path="/gudingzhuanfudong" element={<GudingZhuanFudongPage />} />
                    <Route path="/biangeng-fangshi" element={<BiangengFangshiPage />} />
                    <Route path="/biangengfangshi" element={<BiangengFangshiPage />} />
                    <Route path="/yanqi-huankuan" element={<YanqiHuankuanPage />} />
                    <Route path="/yanqihuankuan" element={<YanqiHuankuanPage />} />
                    <Route path="/zhihuan" element={<ZhihuanPage />} />
                    <Route path="/rongzijuece" element={<RongziJuecePage />} />
        <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </div>
            </div>
          </UnifiedAppProvider>
        </MembershipProvider>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
