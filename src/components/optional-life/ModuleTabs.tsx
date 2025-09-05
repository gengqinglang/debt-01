
import React from 'react';
import { Baby, Heart, Home, Car, Users } from 'lucide-react';

interface ModuleTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabConfig = [
  { id: '结婚', label: '结婚', icon: Heart, color: 'text-pink-500' },
  { id: '生育', label: '生育', icon: Baby, color: 'text-blue-500' },
  { id: '购房', label: '购房', icon: Home, color: 'text-green-500' },
  { id: '购车', label: '购车', icon: Car, color: 'text-purple-500' },
  { id: '赡养', label: '赡养', icon: Users, color: 'text-orange-500' },
];

const ModuleTabs: React.FC<ModuleTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="relative mb-8">
      <div className="flex overflow-x-auto scrollbar-hide bg-gray-50 rounded-2xl p-1">
        <div className="flex space-x-1 min-w-max">
          {tabConfig.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? 'bg-white text-gray-900 shadow-lg shadow-black/10'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                <IconComponent 
                  className={`w-4 h-4 ${isActive ? tab.color : 'text-gray-400'}`} 
                  strokeWidth={1.5} 
                />
                <span>{tab.label}</span>
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModuleTabs;
