import React, { useEffect, useState } from 'react';
import { Share, GitCompare, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

// 直接导入所有组件，消除懒加载
import RiskAndSuggestionsTab from '@/components/asset-freedom/components/RiskAndSuggestionsTab';
import MainNavigationTabs from '@/components/asset-freedom/MainNavigationTabs';
import PlanningNavigationTabs from '@/components/asset-freedom/PlanningNavigationTabs';
import SnapshotInsightsForNewPage from '@/components/asset-freedom/components/SnapshotInsightsForNewPage';
import FinancialStatusContent from '@/components/asset-freedom/components/FinancialStatusContent';
import FutureIncomeContent from '@/components/asset-freedom/components/FutureIncomeContent';
import WealthPrediction from '@/components/asset-freedom/WealthPrediction';
import AssessmentToolsSection from '@/components/asset-freedom/AssessmentToolsSection';
import CoachingSolution from '@/components/asset-freedom/components/CoachingSolution';
import LifeExpenditureDisplay from '@/components/life-events/LifeExpenditureDisplay';
import CareerPlanTabs from '@/components/career/CareerPlanTabs';
import MemberProfileTab from '@/components/asset-freedom/MemberProfileTab';
import IncomeExpenditureDisplay from '@/components/career/IncomeExpenditureDisplay';
import PersonaCard from '@/components/asset-freedom/components/PersonaCard';
import WealthTypingCard from '@/components/asset-freedom/components/WealthTypingCard';

import EnhancedLifeExpenditureDisplay from '@/components/life-events/EnhancedLifeExpenditureDisplay';

import { useUnifiedApp } from '@/components/providers/UnifiedAppProvider';
import { useMembership } from '@/components/membership/MembershipProvider';

// 导入开发调试组件
import DevModeToggle from '@/components/membership/DevModeToggle';

// 简化的加载骨架组件
const SimpleLoadingSkeleton = React.memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B3EBEF] mx-auto mb-4"></div>
      <p className="text-gray-600">加载中...</p>
    </div>
  </div>
));

// 故障保护组件
const FailSafeWrapper = React.memo<{ children: React.ReactNode; fallback?: React.ReactNode }>(
  ({ children, fallback }) => {
    const [hasError, setHasError] = useState(false);
    
    useEffect(() => {
      const timer = setTimeout(() => {
        if (hasError) {
          setHasError(false);
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }, [hasError]);

    if (hasError) {
      return fallback || <div className="p-4 text-center text-gray-500">内容加载中...</div>;
    }

    try {
      return <>{children}</>;
    } catch (error) {
      console.error('FailSafeWrapper caught error:', error);
      setHasError(true);
      return fallback || <div className="p-4 text-center text-gray-500">内容加载中...</div>;
    }
  }
);

FailSafeWrapper.displayName = 'FailSafeWrapper';

const OptimizedChangshiPage = () => {
  console.log('[OptimizedChangshiPage] Rendering...');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isLoading, setIsLoading, isInitialized } = useUnifiedApp();
  const { isMember } = useMembership();
  
  // 添加会员状态的调试日志
  useEffect(() => {
    console.log('=== OptimizedChangshiPage 会员状态调试 ===');
    console.log('当前会员状态:', { isMember });
  }, [isMember]);

  // 检查 location.state 来设置初始状态，支持状态恢复
  const [activeTab, setActiveTab] = useState(() => {
    const returnState = location.state;
    return returnState?.activeTab || location.state?.activeTab || 'discover';
  });
  const [activePlanningTab, setActivePlanningTab] = useState(() => {
    const returnState = location.state;
    // 如果从 timeline 页面返回并且指定了 activePage 为 'expenditure'，则显示生涯支出页面
    if (location.state?.activePage === 'expenditure') {
      return 'life-events';
    }
    return returnState?.activePlanningTab || 'wealth-typing';
  });
  const [activeRiskTab, setActiveRiskTab] = useState(() => {
    const returnState = location.state;
    return returnState?.activeRiskTab || location.state?.activeRiskTab || 'main-risk';
  });
  // 修正初始状态值，使用正确的分类名称
  const [activeToolsTab, setActiveToolsTab] = useState(() => {
    const returnState = location.state;
    return returnState?.activeToolsTab || location.state?.activeToolsTab || 'ai-planning';
  });
  const [isPageReady, setIsPageReady] = useState(false);

  // 简化的页面初始化
  useEffect(() => {
    console.log('[OptimizedChangshiPage] Initializing...');
    
    // 快速初始化，避免长时间等待
    const initTimer = setTimeout(() => {
      if (isInitialized) {
        setIsPageReady(true);
        setIsLoading(false);
      }
    }, 200);

    // 故障保护：最多等待2秒
    const failSafeTimer = setTimeout(() => {
      console.log('[OptimizedChangshiPage] Fail-safe activation');
      setIsPageReady(true);
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(failSafeTimer);
    };
  }, [isInitialized, setIsLoading]);

  const handleShare = async () => {
    try {
      if (navigator.share && navigator.canShare) {
        await navigator.share({
          title: '生涯财富快照',
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "链接已复制",
          description: "快照链接已复制到剪贴板"
        });
      }
    } catch (error) {
      console.log('分享失败，使用复制链接作为备选方案:', error);
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "链接已复制",
          description: "快照链接已复制到剪贴板"
        });
      } catch (clipboardError) {
        toast({
          title: "分享失败",
          description: "请手动复制当前页面链接",
          variant: "destructive"
        });
      }
    }
  };

  const handleCompareWithPrevious = () => {
    toast({
      title: "功能开发中",
      description: "对比功能即将上线"
    });
  };

  // 新增：切换到规划tab的处理函数
  const handleSwitchToPlanning = () => {
    setActiveTab('planning');
    setActivePlanningTab('wealth-typing');
  };

  // 用户欢迎头部组件
  const UserWelcomeHeader = React.memo(() => {
    console.log('=== OptimizedChangshiPage UserWelcomeHeader 渲染 ===');
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

  // 更新字母解读数据为正确含义
  const traits = [
    { label: 'C 财富分型', value: '01', progress: 20, description: '中度支出压缩型' },
    { label: 'I 收入来源', value: '02', progress: 40, description: '被动收入主导' },
    { label: 'E 支出水平', value: '03', progress: 60, description: '奢侈型' },
    { label: 'R 潜在风险', value: '2', progress: 50, description: '2个潜在风险' }
  ];

  // 渲染规划标签内容
  const renderPlanningTabContent = () => {
    switch (activePlanningTab) {
      case 'wealth-typing':
        return (
          <div className="px-4 py-3 space-y-4">
            <FailSafeWrapper>
              <WealthTypingCard 
                onCompareWithPrevious={handleCompareWithPrevious}
              />
              <SnapshotInsightsForNewPage 
                currentTab="planning"
                currentPlanningTab={activePlanningTab}
                currentRiskTab={activeRiskTab}
              />
            </FailSafeWrapper>
          </div>
        );
      case 'life-events':
        return (
          <div className="px-4 py-3 space-y-4">
            <FailSafeWrapper>
              <EnhancedLifeExpenditureDisplay />
            </FailSafeWrapper>
          </div>
        );
      case 'career-income':
        return (
          <div className="px-4 py-3 space-y-4">
            <FailSafeWrapper>
              <IncomeExpenditureDisplay />
            </FailSafeWrapper>
          </div>
        );
      case 'assets-liabilities':
        return (
          <div className="pt-4">
            <FailSafeWrapper>
              <FinancialStatusContent 
                showHeader={false}
                showSummary={true}
                showNextButton={false}
              />
            </FailSafeWrapper>
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
            {/* 人设卡片模块 */}
            <div className="px-4 mb-4">
              <FailSafeWrapper>
                <PersonaCard onSwitchToPlanning={handleSwitchToPlanning} />
              </FailSafeWrapper>
            </div>
            {/* 财富预测模块 */}
            <div className="px-4 mb-4 mt-4">
              <FailSafeWrapper>
                <WealthPrediction onStepClick={() => {}} completedSteps={[]} />
              </FailSafeWrapper>
            </div>
            {/* 行动指南模块 - 只在非会员状态下显示 */}
            {!isMember && (
              <div className="px-4 mb-4">
                <FailSafeWrapper>
                  <CoachingSolution />
                </FailSafeWrapper>
              </div>
            )}
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
            <FailSafeWrapper>
              <RiskAndSuggestionsTab 
                initialActiveRiskTab={activeRiskTab}
                isMember={isMember}
                showActionButtons={true}
              />
            </FailSafeWrapper>
          </div>
        );
      case 'tools':
        return (
          <div className="flex-1 pb-16">
            <FailSafeWrapper>
              <AssessmentToolsSection 
                activeCategory={activeToolsTab}
                onCategoryChange={setActiveToolsTab}
              />
            </FailSafeWrapper>
          </div>
        );
      case 'profile':
        return (
          <div className="flex-1 pb-16">
            <FailSafeWrapper>
              <MemberProfileTab />
            </FailSafeWrapper>
          </div>
        );
      default:
        return null;
    }
  };

  // 白屏检测和自动恢复
  useEffect(() => {
    const whiteScreenTimer = setTimeout(() => {
      if (!isPageReady && !isLoading) {
        console.log('[OptimizedChangshiPage] White screen detected, force recovery');
        setIsPageReady(true);
        setIsLoading(false);
      }
    }, 3000);

    return () => clearTimeout(whiteScreenTimer);
  }, [isPageReady, isLoading, setIsLoading]);

  if (isLoading || !isPageReady) {
    return <SimpleLoadingSkeleton />;
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

export default OptimizedChangshiPage;
