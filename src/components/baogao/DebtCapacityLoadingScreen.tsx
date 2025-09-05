import React from 'react';
import { Loader2, FileBarChart } from 'lucide-react';

const DebtCapacityLoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 px-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-[#01BCD6] to-[#0EA5E9] rounded-full flex items-center justify-center mx-auto mb-4">
            <FileBarChart className="w-10 h-10 text-white" />
          </div>
          <Loader2 className="w-8 h-8 text-[#01BCD6] animate-spin absolute -bottom-2 -right-2 bg-white rounded-full p-1" />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">
            偿债能力测评中
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
            正在分析您的财务状况，生成专业的偿债能力测评结果...
          </p>
        </div>

        <div className="flex items-center justify-center space-x-1 mt-8">
          <div className="w-2 h-2 bg-[#01BCD6] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-[#01BCD6] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-[#01BCD6] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default DebtCapacityLoadingScreen;