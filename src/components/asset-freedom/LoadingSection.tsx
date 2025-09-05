
import React from 'react';
import { Camera } from 'lucide-react';

interface LoadingSectionProps {
  loadingProgress: number;
}

const LoadingSection: React.FC<LoadingSectionProps> = ({ loadingProgress }) => {
  return (
    <div className="mt-20 space-y-4 px-4">
      <div className="text-center">
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 break-words">财富快照生成中...</div>
        <div className="text-gray-600 text-base sm:text-lg font-mono">{loadingProgress.toFixed(1)} 分析完成</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-[#B3EBEF] to-[#CCE9B5] h-full rounded-full transition-all duration-300 shadow-sm" 
          style={{ width: `${loadingProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingSection;
