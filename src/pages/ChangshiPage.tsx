import React, { useEffect, useState } from 'react';
import { Share, GitCompare, UserPlus, Crown, Sparkles, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

// 导入组件
import MainNavigationTabs from '@/components/asset-freedom/MainNavigationTabs';
import PlanningNavigationTabs from '@/components/asset-freedom/PlanningNavigationTabs';
import SnapshotInsightsForNewPage from '@/components/asset-freedom/components/SnapshotInsightsForNewPage';
import FinancialStatusContent from '@/components/asset-freedom/components/FinancialStatusContent';
import WealthPrediction from '@/components/asset-freedom/WealthPrediction';
import AssessmentToolsSection from '@/components/asset-freedom/AssessmentToolsSection';
import IncomeExpenditureDisplay from '@/components/career/IncomeExpenditureDisplay';
import PersonaCard from '@/components/asset-freedom/components/PersonaCard';
import EnhancedLifeExpenditureDisplay from '@/components/life-events/EnhancedLifeExpenditureDisplay';
import RiskAndSuggestionsTab from '@/components/asset-freedom/components/RiskAndSuggestionsTab';
import MemberProfileTab from '@/components/asset-freedom/MemberProfileTab';
import WealthTypingCard from '@/components/asset-freedom/components/WealthTypingCard';

// 导入会员制组件
import ContentMask from '@/components/membership/ContentMask';
import UpgradePrompt from '@/components/membership/UpgradePrompt';
import CashFlowForecast from '@/components/asset-freedom/components/CashFlowForecast';
import AnnualSurplusHeatmap from '@/components/asset-freedom/components/AnnualSurplusHeatmap';
import DisposableWealthOnlyHeatmap from '@/components/asset-freedom/components/DisposableWealthOnlyHeatmap';
import SavingsHeatmap from '@/components/asset-freedom/components/SavingsHeatmap';
import WithdrawSavingsHeatmap from '@/components/asset-freedom/components/WithdrawSavingsHeatmap';
import FinancialHealthOverview from '@/components/asset-freedom/components/FinancialHealthOverview';
import CoachingSolution from '@/components/asset-freedom/components/CoachingSolution';

// 导入开发调试组件
import DevModeToggle from '@/components/membership/DevModeToggle';

import { useUnifiedApp } from '@/components/providers/UnifiedAppProvider';
import { useMembership } from '@/components/membership/MembershipProvider';

const ChangshiPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isLoading, setIsLoading, isInitialized } = useUnifiedApp();
  const { isMember } = useMembership();
  
  // 检查 location.state 来设置初始状态，支持状态恢复
  const [activeTab, setActiveTab] = useState(() => {
    const returnState = location.state;
    return returnState?.activeTab || 'discover';
  });
  const [activePlanningTab, setActivePlanningTab] = useState(() => {
    const returnState = location.state;
    if (location.state?.activePage === 'expenditure') {
      return 'life-events';
    }
    return returnState?.activePlanningTab || 'wealth-typing';
  });
  const [activeRiskTab, setActiveRiskTab] = useState(() => {
    const returnState = location.state;
    return returnState?.activeRiskTab || 'main-risk';
  });
  const [activeToolsTab, setActiveToolsTab] = useState(() => {
    const returnState = location.state;
    return returnState?.activeToolsTab || 'ai-planning';
  });
  const [isPageReady, setIsPageReady] = useState(false);

  // 添加会员状态的调试日志
  useEffect(() => {
    console.log('=== ChangshiPage 会员状态调试 ===');
    console.log('当前会员状态:', { isMember });
  }, [isMember]);

  // 监听 location.state 变化，及时更新状态
  useEffect(() => {
    console.log('[ChangshiPage] Location state changed:', location.state);
    if (location.state) {
      const { activeTab, activeRiskTab, activePlanningTab, activeToolsTab } = location.state;
      if (activeTab) setActiveTab(activeTab);
      if (activeRiskTab) setActiveRiskTab(activeRiskTab);
      if (activePlanningTab) setActivePlanningTab(activePlanningTab);
      if (activeToolsTab) setActiveToolsTab(activeToolsTab);
    }
  }, [location.state]);

  useEffect(() => {
    const initTimer = setTimeout(() => {
      if (isInitialized) {
        setIsPageReady(true);
        setIsLoading(false);
      }
    }, 200);

    const failSafeTimer = setTimeout(() => {
      setIsPageReady(true);
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(failSafeTimer);
    };
  }, [isInitialized, setIsLoading]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '生涯财富快照',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "链接已复制",
        description: "快照链接已复制到剪贴板"
      });
    }
  };

  const handleCompareWithPrevious = () => {
    toast({
      title: "功能开发中",
      description: "对比功能即将上线"
    });
  };

  // 用户欢迎头部组件
  const UserWelcomeHeader = React.memo(() => {
    console.log('=== UserWelcomeHeader 渲染 ===');
    console.log('UserWelcomeHeader 中的会员状态:', { isMember });
    
    return (
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12 shadow-md border-2 border-[#B3EBEF]/30">
            <AvatarImage 
              src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&h=150&fit=crop&crop=face" 
              alt="用户头像" 
            />
            <AvatarFallback className="bg-[#B3EBEF]/20 text-gray-700 font-semibold">
              用户
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-gray-800">您好，欢迎回来！</h1>
              {isMember && (
                <Badge className="bg-amber-100 text-amber-700 text-xs px-2 py-1 border border-amber-200">
                  <Crown className="w-3 h-3 mr-1" />
                  会员
                </Badge>
              )}
            </div>
          </div>

          {/* 开发调试状态切换按钮 */}
          <DevModeToggle />
        </div>
      </div>
    );
  });

  UserWelcomeHeader.displayName = 'UserWelcomeHeader';

  const traits = [
    { label: 'C 财富分型', value: '01', progress: 20, description: '中度支出压缩型' },
    { label: 'I 收入来源', value: '02', progress: 40, description: '被动收入主导' },
    { label: 'E 支出水平', value: '03', progress: 60, description: '奢侈型' },
    { label: 'R 潜在风险', value: '2', progress: 50, description: '2个潜在风险' }
  ];

  // 示例数据遮罩组件 - 移除按钮，只保留提示
  const SampleDataMask = ({ children }) => (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[0.5px] flex flex-col items-center justify-center rounded-lg">
        <div className="text-center p-4 bg-white/90 rounded-lg shadow-sm border border-gray-200 max-w-xs">
          <p className="text-xs text-gray-600">
            当前为示例数据，开通会员查看您的真实分析
          </p>
        </div>
      </div>
    </div>
  );

  // 会员开通卡片组件
  const MembershipUpgradeCard = () => (
    <Card className="bg-gradient-to-br from-[#B3EBEF]/10 via-white to-[#CAF4F7]/10 border border-[#B3EBEF]/30 shadow-sm">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          {/* 图标和标题 */}
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#B3EBEF] to-[#9FE6EB] rounded-full flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-gray-700" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-800">解锁完整财富分析</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              开通会员，获取基于您真实数据的专业分析与个性化建议
            </p>
          </div>

          {/* 会员权益列表 */}
          <div className="bg-[#CAF4F7]/10 rounded-lg p-4 space-y-3 text-left">
            <h4 className="font-medium text-gray-800 text-sm text-center mb-3">会员专享权益</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-[#01BCD6] rounded-full"></div>
                <span className="text-xs text-gray-700">查看真实财富预测和现金流分析</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-[#01BCD6] rounded-full"></div>
                <span className="text-xs text-gray-700">获取个性化行动建议和解决方案</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-[#01BCD6] rounded-full"></div>
                <span className="text-xs text-gray-700">专业风险评估和防范建议</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-[#01BCD6] rounded-full"></div>
                <span className="text-xs text-gray-700">完整的财富管理工具箱</span>
              </div>
            </div>
          </div>

          {/* 价格和开通按钮 */}
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl font-bold text-gray-800">¥29.9</span>
              <span className="text-sm text-gray-500">/月</span>
              <Badge className="bg-red-100 text-red-700 text-xs px-2 py-1">
                限时优惠
              </Badge>
            </div>
            
            <Button className="w-full bg-gradient-to-r from-[#B3EBEF] to-[#9FE6EB] hover:from-[#9FE6EB] hover:to-[#8AE1E6] text-gray-800 font-medium py-3 shadow-md border-0 flex items-center justify-center space-x-2">
              <Crown className="w-4 h-4" />
              <span>立即开通会员</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // 渲染规划标签内容
  const renderPlanningTabContent = () => {
    switch (activePlanningTab) {
      case 'wealth-typing':
        return (
          <div className="px-4 py-3 space-y-4">
            <WealthTypingCard 
              onCompareWithPrevious={handleCompareWithPrevious}
            />
            <SnapshotInsightsForNewPage 
              currentTab="planning"
              currentPlanningTab={activePlanningTab}
              currentRiskTab={activeRiskTab}
              currentToolsTab={activeToolsTab}
            />
          </div>
        );
      case 'life-events':
        return (
          <div className="px-4 py-3 space-y-4">
            <EnhancedLifeExpenditureDisplay />
          </div>
        );
      case 'career-income':
        return (
          <div className="px-4 py-3 space-y-4">
            <IncomeExpenditureDisplay />
          </div>
        );
      case 'assets-liabilities':
        return (
          <div className="pt-4">
            <FinancialStatusContent 
              showHeader={false}
              showSummary={true}
              showNextButton={false}
            />
          </div>
        );
      default:
        return null;
    }
  };

  // 渲染主标签内容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'discover':
        return (
          <div className="flex-1 pb-16">
            <UserWelcomeHeader />
            <div className="px-4 mb-4">
              <PersonaCard />
            </div>
            <div className="px-4 mb-4 mt-4">
              <WealthPrediction onStepClick={() => {}} completedSteps={[]} />
              
              {/* 示例数据模块 - 移除按钮 */}
              <div className="mt-6 space-y-4">
                {/* 未来三年重点关注模块 */}
                <div>
                  <h4 className="text-base font-semibold text-gray-800 mb-3">未来三年重点关注</h4>
                  <SampleDataMask>
                    <CashFlowForecast />
                  </SampleDataMask>
                </div>

                {/* 未来每年预测模块 */}
                <div>
                  <h4 className="text-base font-semibold text-gray-800 mb-3">未来每年预测</h4>
                  <SampleDataMask>
                    <div className="space-y-6">
                      <AnnualSurplusHeatmap />
                      <DisposableWealthOnlyHeatmap />
                      <SavingsHeatmap />
                      <WithdrawSavingsHeatmap />
                    </div>
                  </SampleDataMask>
                </div>

                {/* 生涯现金流健康概览模块 */}
                <div>
                  <h4 className="text-base font-semibold text-gray-800 mb-3">生涯现金流健康概览</h4>
                  <SampleDataMask>
                    <FinancialHealthOverview />
                  </SampleDataMask>
                </div>
              </div>
            </div>
            <div className="px-4 mt-6">
              {/* 行动建议模块 */}
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-800">行动建议</h3>
              </div>
              <SampleDataMask>
                <CoachingSolution />
              </SampleDataMask>
              
              {/* 会员开通卡片 - 新增 */}
              <div className="mt-6">
                <MembershipUpgradeCard />
              </div>
            </div>
          </div>
        );
      case 'planning':
        return (
          <div className="flex-1 pb-16">
            <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
              <PlanningNavigationTabs 
                activeTab={activePlanningTab} 
                onTabChange={setActivePlanningTab} 
              />
            </div>
            <div className="pt-2">
              {renderPlanningTabContent()}
            </div>
          </div>
        );
      case 'risk':
        return (
          <div className="flex-1 pb-16">
            <div className="px-4 py-6 space-y-6">
              <Card className="bg-[#CAF4F7]/5 border border-[#CAF4F7]/20">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-[#CAF4F7]/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      风险识别与建议方案
                    </h3>
                    <div className="space-y-3 text-left">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        <strong className="text-gray-800">您当前面临 5 大财务风险！</strong>
                      </p>
                      <div className="bg-[#CAF4F7]/15 rounded-lg p-4 space-y-2 border border-[#CAF4F7]/30">
                        <h4 className="font-medium text-gray-800 text-sm">专业风险评估将为您揭示：</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• 裁员降薪风险的具体影响和应对策略</li>
                          <li>• 重疾意外风险的保障缺口分析</li>
                          <li>• 不当消费和举债的潜在危害</li>
                          <li>• 规划变动对财务目标的冲击评估</li>
                          <li>• 针对性的风险防范和解决方案</li>
                        </ul>
                      </div>
                      <div className="bg-[#CAF4F7]/15 rounded-lg p-4 border border-[#CAF4F7]/30">
                        <h4 className="font-medium text-gray-800 text-sm mb-2">为什么需要专业分析？</h4>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          网上的通用建议无法匹配您的具体情况，错误的风险判断比不行动更危险。
                          我们基于您的收入、支出、资产结构，提供个性化的风险评估和解决方案。
                        </p>
                      </div>
                      <div className="bg-[#CAF4F7]/20 rounded-lg p-4 border border-[#CAF4F7]/40">
                        <h4 className="font-medium text-gray-800 text-sm mb-2">开通会员您将获得：</h4>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>✓ 5大风险的详细分析报告</li>
                          <li>✓ 针对每个风险的具体解决方案</li>
                          <li>✓ 优先级排序和执行时间表</li>
                          <li>✓ 专业的保障方案建议</li>
                          <li>✓ 持续的风险监控和调整建议</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <UpgradePrompt 
                title="立即获取专业风险分析"
                description="不要让风险成为您财务规划的隐患，现在就开始专业的风险防范"
                feature="个性化风险评估、解决方案、执行指导"
                currentTab="risk"
                currentRiskTab={activeRiskTab}
                currentPlanningTab={activePlanningTab}
                currentToolsTab={activeToolsTab}
              />
            </div>
          </div>
        );
      case 'tools':
        return (
          <div className="flex-1 pb-16">
            <div className="pt-2">
              <AssessmentToolsSection 
                activeCategory={activeToolsTab}
                onCategoryChange={setActiveToolsTab}
              />
            </div>
            <div className="px-4 mt-6">
              <UpgradePrompt 
                title="工具箱 - 会员专享"
                description="升级会员解锁专业的财富管理工具集合"
                feature="风险评估、投资建议、财务规划等专业工具"
                currentTab="tools"
                currentToolsTab={activeToolsTab}
              />
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="flex-1 pb-16 flex items-center justify-center min-h-[calc(100vh-16rem)]">
            <div className="px-6 w-full max-w-sm">
              {/* 登录注册卡片 - 简约高级设计 */}
              <Card className="border-0 shadow-none bg-white">
                <CardContent className="p-0 text-center">
                  <div className="mb-8">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
                      <UserPlus className="w-7 h-7 text-gray-400" />
                    </div>
                    
                    <h3 className="text-xl font-medium text-gray-900 mb-3">登录账户</h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                      登录后享受完整的财富管理服务，数据同步保存
                    </p>
                  </div>
                  
                  <Button className="w-full h-12 bg-[#B3EBEF] hover:bg-[#9FE6EB] text-gray-800 font-medium border-0 rounded-lg text-base">
                    立即登录
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading || !isPageReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B3EBEF] mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full max-w-md mx-auto bg-white">
      {renderTabContent()}

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-md bg-white border-t border-gray-200">
        <MainNavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default ChangshiPage;
