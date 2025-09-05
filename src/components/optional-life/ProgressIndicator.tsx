
import React from 'react';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentCardIndex: number;
  filteredModuleTabs: Array<{
    id: string;
    name: string;
    icon: any;
    color: string;
  }>;
  configConfirmed: {[key: string]: boolean};
  showProjectList: boolean;
  setShowProjectList: (show: boolean) => void;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentCardIndex,
  filteredModuleTabs,
  configConfirmed,
  showProjectList,
  setShowProjectList
}) => {
  const currentModule = filteredModuleTabs[currentCardIndex];

  return (
    <div className="px-4 py-4 bg-gradient-to-r from-[#B3EBEF]/10 to-[#8FD8DC]/10 border-b border-gray-100">
      <div className="flex items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-800">配置进度</h3>
        <span className="text-xs text-gray-600 ml-1">（{currentCardIndex + 1}/{filteredModuleTabs.length}）</span>
      </div>
      
      <div className="mb-3">
        <div className="relative w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentCardIndex + 1) / filteredModuleTabs.length) * 100}%` }}
          />
          
          {filteredModuleTabs.map((module, index) => {
            const isCompleted = configConfirmed[module.id];
            const isCurrent = index === currentCardIndex;
            const position = ((index + 1) / filteredModuleTabs.length) * 100;
            
            return (
              <div
                key={index}
                className="absolute top-0 flex flex-col items-center"
                style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
              >
                <div className={`w-3 h-3 rounded-full border-2 border-white flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-green-500' 
                    : isCurrent 
                    ? 'bg-[#B3EBEF]' 
                    : 'bg-gray-300'
                }`}>
                  {isCompleted && (
                    <Check className="w-1.5 h-1.5 text-white" strokeWidth={3} />
                  )}
                </div>
                
                <div className={`mt-1 text-xs font-medium whitespace-nowrap ${
                  isCurrent 
                    ? 'text-gray-900' 
                    : isCompleted 
                    ? 'text-green-700' 
                    : 'text-gray-500'
                }`}>
                  {module.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
