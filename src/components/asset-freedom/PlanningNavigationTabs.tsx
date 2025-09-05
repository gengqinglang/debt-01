
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlanningNavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

const PlanningNavigationTabs: React.FC<PlanningNavigationTabsProps> = ({ 
  activeTab, 
  onTabChange,
  showBackButton = false,
  onBack
}) => {
  const tabs = [
    { value: 'assets-liabilities', label: '资产负债' },
    { value: 'life-events', label: '未来支出' },
    { value: 'career-income', label: '未来收入' },
    { value: 'wealth-typing', label: '财富分型' }
  ];

  return (
    <div className="px-4 md:px-6 py-2">
      <div className="flex items-center">
        {/* 条件渲染返回按钮 */}
        {showBackButton && (
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="p-2 mr-2 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </Button>
        )}
        
        {/* Tab 导航 */}
        <div className="flex justify-between items-baseline flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={`py-2 px-1 text-center transition-all duration-200 whitespace-nowrap min-w-0 ${
                activeTab === tab.value
                  ? 'text-black text-base md:text-lg font-bold'
                  : 'text-gray-400 text-xs md:text-sm font-normal'
              }`}
            >
              <span className="break-words">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanningNavigationTabs;
