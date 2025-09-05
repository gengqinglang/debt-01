import React from 'react';

interface HotspotNavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const HotspotNavigationTabs: React.FC<HotspotNavigationTabsProps> = ({ 
  activeTab, 
  onTabChange
}) => {
  const tabs = [
    { value: 'courses', label: '课程' },
    { value: 'topics', label: '话题' }
  ];

  return (
    <div className="px-4 md:px-6 py-2">
      <div className="flex justify-start items-baseline space-x-8">
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
  );
};

export default HotspotNavigationTabs;