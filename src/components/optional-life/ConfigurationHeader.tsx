
import React from 'react';

interface ConfigurationHeaderProps {
  currentModule: any;
  currentCardIndex: number;
  totalCards: number;
}

const ConfigurationHeader: React.FC<ConfigurationHeaderProps> = ({
  currentModule,
  currentCardIndex,
  totalCards
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2 gap-2">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 flex-1 min-w-0 truncate">
          {currentModule?.name}配置
        </h3>
        <div className="text-xs sm:text-sm text-gray-500 flex-shrink-0 whitespace-nowrap">
          {currentCardIndex + 1} / {totalCards}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentCardIndex + 1) / totalCards) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ConfigurationHeader;
