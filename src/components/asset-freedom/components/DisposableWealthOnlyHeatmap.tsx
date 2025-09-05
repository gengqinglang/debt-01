import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { useMembership } from '@/components/membership/MembershipProvider';
import { useFinancialHeatmapData, DisposableWealthData } from '@/hooks/useFinancialHeatmapData';

interface DisposableWealthOnlyHeatmapProps {
  onInteractionAttempt?: () => void;
}

const DisposableWealthOnlyHeatmap = ({ onInteractionAttempt }: DisposableWealthOnlyHeatmapProps) => {
  const { isMember } = useMembership();
  const { disposableWealthData } = useFinancialHeatmapData();
  const [selectedCell, setSelectedCell] = useState<DisposableWealthData | null>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const maxAmount = Math.max(...disposableWealthData.map(d => d.amount));
  const yearsWithAmount = disposableWealthData.filter(d => d.amount > 0).length;

  // 根据金额计算颜色深度
  const getColorIntensity = (amount: number) => {
    if (amount === 0) return 'bg-white border-gray-200';
    
    const intensity = amount / maxAmount;
    if (intensity <= 0.2) return 'bg-[#CAF4F7]/20 border-[#CAF4F7]/30';
    if (intensity <= 0.4) return 'bg-[#CAF4F7]/40 border-[#CAF4F7]/50';
    if (intensity <= 0.6) return 'bg-[#CAF4F7]/60 border-[#CAF4F7]/70';
    if (intensity <= 0.8) return 'bg-[#CAF4F7]/80 border-[#CAF4F7]/90';
    return 'bg-[#4A90A4] border-[#4A90A4]';
  };

  // 按行排列数据（每行14年）
  const dataRows: DisposableWealthData[][] = [];
  for (let i = 0; i < disposableWealthData.length; i += 14) {
    dataRows.push(disposableWealthData.slice(i, i + 14));
  }

  const handleCellClick = (data: DisposableWealthData) => {
    if (!isMember) {
      onInteractionAttempt?.();
      return;
    }
    setSelectedCell(selectedCell?.age === data.age ? null : data);
  };

  const handleTooltipClick = () => {
    setIsTooltipOpen(!isTooltipOpen);
  };

  const renderCellWithAgeLabel = (data: DisposableWealthData, isFirst: boolean = false, isLast: boolean = false) => {
    const isSelected = selectedCell?.age === data.age;
    const colorIntensity = getColorIntensity(data.amount);
    
    return (
      <div
        key={data.age}
        className={`
          w-6 h-6 border cursor-pointer transition-all duration-200 hover:scale-110 relative flex items-center justify-center
          ${colorIntensity}
          ${isSelected ? 'ring-2 ring-blue-500' : ''}
        `}
        onClick={() => handleCellClick(data)}
        title={`${data.age}岁`}
      >
        {isFirst && (
          <span className="text-xs text-gray-800 font-bold z-10">30</span>
        )}
        {isLast && (
          <span className="text-xs text-gray-800 font-bold z-10">85</span>
        )}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium text-gray-800">可自由支配财富</h4>
            <Tooltip open={isTooltipOpen}>
              <TooltipTrigger asChild>
                <button
                  onClick={handleTooltipClick}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent 
                className="bg-white border border-gray-200 shadow-lg p-3 max-w-xs text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-sm text-gray-700">
                  扣除基本生活支出和必要储蓄后，可用于自由支配的资金
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="text-xs text-gray-500">
            有资金年份: {yearsWithAmount}年
          </div>
        </div>

        {/* 热力图网格 */}
        <div className="space-y-1">
          {dataRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex space-x-1">
              {row.map((data, cellIndex) => {
                const isFirst = rowIndex === 0 && cellIndex === 0;
                const isLast = rowIndex === dataRows.length - 1 && cellIndex === row.length - 1;
                return renderCellWithAgeLabel(data, isFirst, isLast);
              })}
            </div>
          ))}
        </div>

        {/* 图例 */}
        <div className="flex items-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-[#4A90A4] border border-[#4A90A4] rounded"></div>
            <span className="text-gray-600">金额较高</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-[#CAF4F7]/60 border border-[#CAF4F7]/70 rounded"></div>
            <span className="text-gray-600">金额适中</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
            <span className="text-gray-600">无可支配资金</span>
          </div>
        </div>

        {/* 详情展示 */}
        {selectedCell && isMember && (
          <Card className="mt-4 border-blue-200 bg-blue-50/30">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-lg font-semibold text-gray-800">
                    {selectedCell.age}岁 ({selectedCell.year}年) 可支配资金
                  </h5>
                </div>

                <div className="p-3 bg-[#CAF4F7]/15 rounded-lg border border-[#CAF4F7]/10">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">可自由支配金额：</span>
                    <span className="text-lg font-bold text-[#4A90A4]">¥{selectedCell.amount}万</span>
                  </div>
                </div>

                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  {selectedCell.amount > 0 ? 
                    '💎 这部分资金可用于提升生活品质、投资理财或应急储备' : 
                    '📊 该年份暂无可自由支配的资金'
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};

export default DisposableWealthOnlyHeatmap;