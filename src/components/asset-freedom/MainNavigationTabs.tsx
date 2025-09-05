import React from 'react';
import { Search, Target, Shield, Wrench, User, BookOpen } from 'lucide-react';

interface MainNavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MainNavigationTabs: React.FC<MainNavigationTabsProps> = ({ activeTab, onTabChange }) => {
  console.log('[MainNavigationTabs] Rendered with activeTab:', activeTab);
  console.log('[MainNavigationTabs] onTabChange function:', typeof onTabChange);
  
  const tabs = [
    { id: 'discover', label: '发现', icon: Search },
    { id: 'planning', label: '规划', icon: Target },
    { id: 'risk', label: '风险及建议', icon: Shield },
    { id: 'tools', label: '工具', icon: Wrench },
    { id: 'cases', label: '热点', icon: BookOpen },
    { id: 'profile', label: '我的', icon: User },
  ];

  return (
    <div className="px-1 md:px-2 py-2 bg-white">
      <div className="grid grid-cols-6 gap-1">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                console.log('[MainNavigationTabs] Tab clicked:', tab.id);
                console.log('[MainNavigationTabs] Calling onTabChange with:', tab.id);
                onTabChange(tab.id);
              }}
              className={`flex flex-col items-center justify-center py-1 md:py-2 px-1 transition-all duration-200 min-w-0 ${
                activeTab === tab.id
                  ? 'text-teal-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <IconComponent 
                className={`w-4 h-4 md:w-5 md:h-5 mb-0.5 md:mb-1 ${
                  activeTab === tab.id ? 'text-teal-600' : 'text-gray-400'
                }`} 
              />
              <span className={`text-xs font-medium truncate ${
                activeTab === tab.id ? 'text-teal-600' : 'text-gray-400'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MainNavigationTabs;
