import React, { useState, useEffect } from 'react';

interface ContentNavigationTabsProps {
  onTabChange?: (tabValue: string) => void;
  defaultValue?: string;
  pageMode?: string;
  displayMode?: 'first-time' | 'returning';
}

const ContentNavigationTabs: React.FC<ContentNavigationTabsProps> = ({ 
  onTabChange, 
  defaultValue = "typing",
  pageMode = "member-balanced",
  displayMode = 'first-time'
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange?.(value);
    
    // 滚动到对应区域
    const sectionMap: Record<string, string> = {
      'typing': 'wealth-typing-section',
      'overview': 'career-financial-overview-section', 
      'planning-progress': 'planning-progress-section',
      'prediction': 'future-life-prediction-section',
      'insights': 'insights-suggestions-section',
      'current-tasks': 'yearly-financial-management'
    };
    
    const targetId = sectionMap[value];
    if (targetId) {
      // 先尝试通过id查找，如果找不到则通过data-section属性查找
      let element = document.getElementById(targetId);
      if (!element) {
        element = document.querySelector(`[data-section="${targetId}"]`);
      }
      
      if (element) {
        // 找到可滚动的内容容器
        const scrollContainer = document.querySelector('.overflow-y-auto');
        
        if (scrollContainer) {
          // 计算目标元素相对于滚动容器的位置
          const containerRect = scrollContainer.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          const scrollTop = scrollContainer.scrollTop;
          
          // 设置滚动偏移量，为固定头部预留空间
          // 固定头部（ContentNavigationTabs）大约60px高度，减少offset值让滚动距离更大
          let offset = 70; // 减少offset值，让滚动距离更大，确保上个模块内容不显示
          
          if (value === 'typing') {
            offset = 70; // 财富分型
          } else if (value === 'overview') {
            offset = 70; // 未来人生财务总览
          } else if (value === 'planning-progress') {
            offset = 70; // 未来人生规划进展
          } else if (value === 'prediction') {
            offset = 70; // 未来人生财务预测
          } else if (value === 'insights') {
            offset = 70; // 洞见及建议
          } else if (value === 'current-tasks') {
            offset = 70; // 当年家庭财务管理重点
          }
          
          // 计算目标滚动位置
          const targetScrollTop = scrollTop + elementRect.top - containerRect.top - offset;
          
          scrollContainer.scrollTo({
            top: Math.max(0, targetScrollTop),
            behavior: 'smooth'
          });
        }
      }
    }
  };

  // 根据pageMode和displayMode动态生成标签
  const getTabs = () => {
    const baseTabs = [
      { 
        value: 'typing', 
        label: displayMode === 'returning' ? '以下新闻和您有关' : '财富分型' 
      },
      { 
        value: 'overview', 
        label: displayMode === 'returning' ? '财富分型及财务总览' : '财务总览' 
      },
      { value: 'planning-progress', label: '规划进展' },
      { value: 'prediction', label: '现金流预测' },
      { value: 'insights', label: '风险及建议' }
    ];

    // 在会员-缺钱状态下，不显示当年家庭财务管理重点
    if (pageMode !== 'member-severe-shortage') {
      baseTabs.push(
        { value: 'current-tasks', label: '本年任务' }
      );
    }

    return baseTabs;
  };

  const tabs = getTabs();

  return (
    <div className="bg-white">
      <div className="px-4 py-2">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`flex-shrink-0 px-0 py-2 font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.value
                  ? 'text-gray-900 font-semibold text-base md:text-lg'
                  : 'text-gray-400 hover:text-gray-600 text-sm'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentNavigationTabs;