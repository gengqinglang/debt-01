
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ContentMask from '@/components/membership/ContentMask';
import { useNavigationState } from '@/hooks/useNavigationState';

interface SecondaryRiskItemProps {
  risk: {
    id: string;
    name: string;
    icon: React.ComponentType<{ className: string }>;
    summary: string;
    description: string;
    descriptionButtonText: string;
    actionTitle: string;
    actionDescription: string[];
    actionButtonText: string;
  };
  isExpanded: boolean;
  isActionExpanded: boolean;
  onToggleExpansion: () => void;
  onToggleActionExpansion: () => void;
  isMember?: boolean;
  showActionButtons?: boolean;
  currentActiveTab?: string;
  currentActiveRiskTab?: string;
  currentTab?: string;
  currentPlanningTab?: string;
  currentRiskTab?: string;
  currentToolsTab?: string;
  pageMode?: 'member-severe-shortage' | 'member-liquidity-tight' | 'member-balanced' | 'public-severe-shortage' | 'public-liquidity-tight' | 'public-balanced';
  onGapWarningClick?: () => void;
  riskModule?: 'family-risks' | 'avoid-risks'; // 新增：区分风险模块
}

const SecondaryRiskItem: React.FC<SecondaryRiskItemProps> = ({
  risk,
  isExpanded,
  isActionExpanded,
  onToggleExpansion,
  onToggleActionExpansion,
  isMember = false,
  showActionButtons = true,
  currentActiveTab = 'risk',
  currentActiveRiskTab = 'secondary-risk',
  currentTab = 'risk',
  currentPlanningTab,
  currentRiskTab = 'secondary-risk',
  currentToolsTab,
  pageMode = 'public-balanced',
  onGapWarningClick,
  riskModule = 'avoid-risks' // 默认为避免风险模块
}) => {
  const IconComponent = risk.icon;
  const navigate = useNavigate();
  const { navigateWithState } = useNavigationState();

  const handleViewDetails = () => {
    console.log(`[SecondaryRiskItem] Navigating to ${risk.name} details page`);
    console.log(`[SecondaryRiskItem] Current context - activeTab: ${currentActiveTab}, activeRiskTab: ${currentActiveRiskTab}, pageMode: ${pageMode}`);
    
    // 在"会员-没钱"状态下，点击次要风险显示弹窗
    if (pageMode === 'member-severe-shortage' && onGapWarningClick) {
      console.log('[SecondaryRiskItem] 会员-没钱状态，显示收支失衡弹窗');
      onGapWarningClick();
      return;
    }
    
    // 特殊处理：重疾/意外风险导航到风险测评流程页面
    if (risk.id === 'critical-illness-accident') {
      console.log('[SecondaryRiskItem] 导航到重疾/意外风险测评流程页面');
      navigate('/risk-assessment-process', {
        state: {
          returnPath: window.location.pathname,
          activeTab: currentActiveTab,
          pageMode: pageMode
        }
      });
      return;
    }
    
    if (!isMember) {
      // For non-members, still allow viewing but with limited functionality
      console.log(`Navigate to ${risk.name} details page (limited access)`);
    } else {
      console.log(`Navigate to ${risk.name} details page`);
    }
    
    navigateWithState(`/risk-detail/${risk.id}`, {
      activeTab: currentActiveTab,
      activeRiskTab: currentActiveRiskTab,
      sourceModule: 'secondary-risk-details'
    });
  };

  // 获取显示的风险名称
  const getDisplayRiskName = (riskId: string, originalName: string) => {
    if (riskId === 'asset-liquidity-risk') {
      return '资产流动性风险-确有';
    }
    if (originalName === '资产流动定风险') {
      return '资产流动性风险-或有';
    }
    return originalName;
  };
  
  // 根据风险模块获取颜色配置
  const getColorConfig = () => {
    if (riskModule === 'family-risks') {
      // 家庭面临风险 - 红色系（与MainRiskCard背景色一致）
      return {
        cardBg: 'bg-gradient-to-br from-red-50/80 to-orange-50/60',
        cardHoverBorder: 'hover:border-red-200/50',
        iconBg: 'bg-gradient-to-br from-red-50/80 to-orange-50/60',
        iconBorder: 'border-red-200/30',
        iconColor: 'text-red-700/70',
        summaryColor: 'text-red-700/70',
        buttonText: 'text-red-700/70',
        buttonHover: 'hover:text-red-800/80 hover:bg-red-100',
        buttonBorder: 'border-red-200/30 hover:border-red-300'
      };
    } else {
      // 提醒您避免以下风险 - 青色系（原有颜色）
      return {
        cardBg: 'bg-white',
        cardHoverBorder: 'hover:border-[#CAF4F7]/50',
        iconBg: 'bg-gradient-to-br from-[#CAF4F7]/20 to-[#CAF4F7]/10',
        iconBorder: 'border-[#CAF4F7]/20',
        iconColor: 'text-[#01BCD6]',
        summaryColor: 'text-[#01BCD6]',
        buttonText: 'text-[#01BCD6]',
        buttonHover: 'hover:text-white hover:bg-[#01BCD6]',
        buttonBorder: 'border-[#01BCD6]/20 hover:border-[#01BCD6]'
      };
    }
  };

  const colorConfig = getColorConfig();

  const content = (
    <div className={`mx-4 my-3 ${colorConfig.cardBg} rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 ${colorConfig.cardHoverBorder}`}>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className={`w-10 h-10 rounded-xl ${colorConfig.iconBg} flex items-center justify-center border ${colorConfig.iconBorder} shadow-sm`}>
              <IconComponent className={`w-5 h-5 ${colorConfig.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-semibold text-gray-900 mb-1.5 leading-tight">
                {getDisplayRiskName(risk.id, risk.name)}
              </h4>
              <p className={`text-sm font-medium ${colorConfig.summaryColor} leading-relaxed`}>
                {risk.summary}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className={`${colorConfig.buttonText} ${colorConfig.buttonHover} p-3 h-auto rounded-full transition-all duration-200 border ${colorConfig.buttonBorder} shadow-sm hover:shadow-md group`}
            onClick={handleViewDetails}
          >
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform duration-200" />
          </Button>
        </div>
      </div>
    </div>
  );

  if (!isMember) {
    return (
      <ContentMask 
        memberOnly={true}
        maskType="disable"
        upgradePrompt={{
          title: "风险详情 - 会员专享",
          description: "深度风险分析需要会员权限",
          feature: "专业的风险评估和解决方案"
        }}
        currentTab={currentTab}
        currentPlanningTab={currentPlanningTab}
        currentRiskTab={currentRiskTab}
        currentToolsTab={currentToolsTab}
      >
        {content}
      </ContentMask>
    );
  }

  return content;
};

export default SecondaryRiskItem;
