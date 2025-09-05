
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface RiskNavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  pageMode?: string;
  familyRisksCount?: number;
  avoidRisksCount?: number;
}

const RiskNavigationTabs: React.FC<RiskNavigationTabsProps> = ({ 
  activeTab, 
  onTabChange,
  pageMode,
  familyRisksCount = 0,
  avoidRisksCount = 0
}) => {
  // 根据pageMode确定导航标签和数量
  const getNavigationConfig = () => {
    if (pageMode === 'member-balanced') {
      return {
        firstTab: {
          key: 'family-risks',
          label: '被动风险',
          count: familyRisksCount
        },
        secondTab: {
          key: 'avoid-risks',
          label: '主动风险',
          count: avoidRisksCount
        }
      };
    }
    
    if (pageMode === 'member-severe-shortage' || pageMode === 'member-liquidity-tight') {
      return {
        firstTab: {
          key: 'main-risk',
          label: '家庭面临风险',
          count: 1
        },
        secondTab: null // 会员-没钱状态和会员-融资购房状态不显示次要风险tab
      };
    }
    
    // 其他所有状态保持原有逻辑
    return {
      firstTab: {
        key: 'main-risk',
        label: '主要风险',
        count: 1
      },
      secondTab: {
        key: 'secondary-risk',
        label: '次要风险',
        count: 10
      }
    };
  };

  const navConfig = getNavigationConfig();

  return (
    <div className="px-4 md:px-6 py-2 bg-white border-b border-gray-100">
      <div className="flex justify-start items-baseline space-x-8">
        <button
          onClick={() => onTabChange(navConfig.firstTab.key)}
          className={`py-2 px-1 text-center transition-all duration-200 whitespace-nowrap min-w-0 flex items-center space-x-2 ${
            activeTab === navConfig.firstTab.key
              ? 'text-black text-base md:text-lg font-bold'
              : 'text-gray-400 text-xs md:text-sm font-normal'
          }`}
        >
          <span className="break-words">{navConfig.firstTab.label}</span>
          <Badge 
            variant="secondary" 
            className={`text-xs px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center ${
              activeTab === navConfig.firstTab.key
                ? 'bg-red-100 text-red-600 border-red-200'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {navConfig.firstTab.count}
          </Badge>
        </button>
        
        {navConfig.secondTab && (
          <button
            onClick={() => onTabChange(navConfig.secondTab.key)}
            className={`py-2 px-1 text-center transition-all duration-200 whitespace-nowrap min-w-0 flex items-center space-x-2 ${
              activeTab === navConfig.secondTab.key
                ? 'text-black text-base md:text-lg font-bold'
                : 'text-gray-400 text-xs md:text-sm font-normal'
            }`}
          >
            <span className="break-words">{navConfig.secondTab.label}</span>
            <Badge 
              variant="secondary" 
              className={`text-xs px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center ${
                activeTab === navConfig.secondTab.key
                  ? 'bg-[#CAF4F7]/50 text-[#01BCD6] border-[#CAF4F7]'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {navConfig.secondTab.count}
            </Badge>
          </button>
        )}
      </div>
    </div>
  );
};

export default RiskNavigationTabs;
