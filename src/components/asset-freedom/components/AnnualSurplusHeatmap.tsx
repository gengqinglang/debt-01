import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { useMembership } from '@/components/membership/MembershipProvider';
import { useFinancialHeatmapData, AnnualSurplusData } from '@/hooks/useFinancialHeatmapData';

interface AnnualSurplusHeatmapProps {
  onInteractionAttempt?: () => void;
}

const AnnualSurplusHeatmap = ({ onInteractionAttempt }: AnnualSurplusHeatmapProps) => {
  const { isMember } = useMembership();
  const { annualSurplusData } = useFinancialHeatmapData();
  const [selectedCell, setSelectedCell] = useState<AnnualSurplusData | null>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const maxAmount = Math.max(...annualSurplusData.map(d => Math.abs(d.amount)));
  const yearsWithSurplus = annualSurplusData.filter(d => d.amount > 0).length;
  const yearsWithDeficit = annualSurplusData.filter(d => d.amount < 0).length;

  // 根据金额计算颜色深度 - 支持结余/亏损双色显示
  const getColorIntensity = (amount: number) => {
    if (amount === 0) return 'bg-white border-gray-200';
    
    const intensity = Math.abs(amount) / maxAmount;
    
    if (amount > 0) {
      if (intensity <= 0.2) return 'bg-green-100/40 border-green-200/50';
      if (intensity <= 0.4) return 'bg-green-200/60 border-green-300/70';
      if (intensity <= 0.6) return 'bg-green-300/70 border-green-400/80';
      if (intensity <= 0.8) return 'bg-green-400/80 border-green-500/90';
      return 'bg-green-500 border-green-500';
    } else {
      if (intensity <= 0.2) return 'bg-red-100/40 border-red-200/50';
      if (intensity <= 0.4) return 'bg-red-200/60 border-red-300/70';
      if (intensity <= 0.6) return 'bg-red-300/70 border-red-400/80';
      if (intensity <= 0.8) return 'bg-red-400/80 border-red-500/90';
      return 'bg-red-500 border-red-500';
    }
  };

  // 按行排列数据（每行14年）
  const dataRows: AnnualSurplusData[][] = [];
  for (let i = 0; i < annualSurplusData.length; i += 14) {
    dataRows.push(annualSurplusData.slice(i, i + 14));
  }

  const handleCellClick = (data: AnnualSurplusData) => {
    if (!isMember) {
      onInteractionAttempt?.();
      return;
    }
    setSelectedCell(selectedCell?.age === data.age ? null : data);
  };

  const handleTooltipClick = () => {
    setIsTooltipOpen(!isTooltipOpen);
  };

  const renderCellWithAgeLabel = (data: AnnualSurplusData, isFirst: boolean = false, isLast: boolean = false) => {
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
            <h4 className="text-sm font-medium text-gray-800">未来年份收支结余/亏损</h4>
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
                  显示每年收入与支出的差额情况，绿色表示结余，红色表示亏损
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="text-xs text-gray-500">
            结余年份: {yearsWithSurplus}年 | 亏损年份: {yearsWithDeficit}年
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
            <div className="w-4 h-4 bg-green-400/80 border border-green-500/90 rounded"></div>
            <span className="text-gray-600">收支结余</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-400/80 border border-red-500/90 rounded"></div>
            <span className="text-gray-600">收支亏损</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
            <span className="text-gray-600">收支平衡</span>
          </div>
        </div>

        {/* 详情展示 */}
        {selectedCell && isMember && (
          <Card className="mt-4 border-blue-200 bg-blue-50/30">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-lg font-semibold text-gray-800">
                    {selectedCell.age}岁 ({selectedCell.year}年) 收支情况
                  </h5>
                </div>

                <div className={`p-3 rounded-lg border ${selectedCell.amount >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {selectedCell.amount >= 0 ? '收支结余：' : '收支亏损：'}
                    </span>
                    <span className={`text-lg font-bold ${selectedCell.amount >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      ¥{Math.abs(selectedCell.amount)}万
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  {selectedCell.amount >= 0 ? 
                    '💰 该年份收入大于支出，可用于储蓄或投资' : 
                    '⚠️ 该年份支出大于收入，需要动用积蓄或寻求其他资金来源'
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

export default AnnualSurplusHeatmap;