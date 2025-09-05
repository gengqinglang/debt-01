import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { PlanningOverview } from './PlanningOverview';

interface AdjustmentMethod {
  id: number;
  name: string;
  beforeAmount: string;
  afterAmount: string;
  timePeriod: string;
  details?: string;
}

interface AdjustmentSuggestionsProps {
  onAcceptSuggestions: () => void;
  onRejectSuggestions: () => void;
}

export const AdjustmentSuggestions: React.FC<AdjustmentSuggestionsProps> = ({
  onAcceptSuggestions,
  onRejectSuggestions
}) => {

  return (
    <div 
      className="bg-white rounded-lg p-4"
      style={{
        boxShadow: `
          inset 0 1px 0 rgba(255, 255, 255, 0.05),
          0 1px 2px rgba(0, 0, 0, 0.03),
          0 4px 8px rgba(0, 0, 0, 0.05),
          0 0 0 1px rgba(0, 0, 0, 0.03),
          0 2px 4px rgba(0, 0, 0, 0.03)
        `
      }}
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Settings className="w-4 h-4 text-black" />
          <h3 className="text-lg font-bold text-black">调整建议</h3>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            系统为您自动计算了能够支撑支出实现的调整手段：
          </p>
          
          {/* 规划概览 - 两层结构 */}
          <PlanningOverview />
        </div>

        {/* 操作按钮 */}
        <div className="mt-6 space-y-3">
          <Button
            onClick={onAcceptSuggestions}
            className="w-full bg-[#B3EBEF] text-gray-800 font-medium border border-[#B3EBEF]/30 text-sm"
          >
            接受建议
          </Button>
          <Button
            onClick={onRejectSuggestions}
            variant="outline"
            className="w-full bg-white text-[#01BCD6] border-[#01BCD6] font-medium text-sm"
          >
            不接受，自己调整
          </Button>
        </div>
      </div>
    </div>
  );
};