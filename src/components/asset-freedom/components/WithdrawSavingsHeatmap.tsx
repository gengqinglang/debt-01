import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { useMembership } from '@/components/membership/MembershipProvider';
import { useFinancialHeatmapData, WithdrawSavingsData } from '@/hooks/useFinancialHeatmapData';

interface WithdrawSavingsHeatmapProps {
  onInteractionAttempt?: () => void;
}

const WithdrawSavingsHeatmap = ({ onInteractionAttempt }: WithdrawSavingsHeatmapProps) => {
  const { isMember } = useMembership();
  const { withdrawSavingsData } = useFinancialHeatmapData();
  const [selectedCell, setSelectedCell] = useState<WithdrawSavingsData | null>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const maxAmount = Math.max(...withdrawSavingsData.map(d => d.amount));
  const yearsNeedWithdraw = withdrawSavingsData.filter(d => d.amount > 0).length;

  // 根据金额计算颜色深度
  const getColorIntensity = (amount: number) => {
    if (amount === 0) return 'bg-white border-gray-200';
    
    const intensity = amount / maxAmount;
    if (intensity <= 0.2) return 'bg-red-100/40 border-red-200/50';
    if (intensity <= 0.4) return 'bg-red-200/60 border-red-300/70';
    if (intensity <= 0.6) return 'bg-red-300/70 border-red-400/80';
    if (intensity <= 0.8) return 'bg-red-400/80 border-red-500/90';
    return 'bg-red-500 border-red-500';
  };

  // 按行排列数据（每行14年）
  const dataRows: WithdrawSavingsData[][] = [];
  for (let i = 0; i < withdrawSavingsData.length; i += 14) {
    dataRows.push(withdrawSavingsData.slice(i, i + 14));
  }

  const handleCellClick = (data: WithdrawSavingsData) => {
    if (!isMember) {
      onInteractionAttempt?.();
      return;
    }
    setSelectedCell(selectedCell?.age === data.age ? null : data);
  };

  const handleTooltipClick = () => {
    setIsTooltipOpen(!isTooltipOpen);
  };

  const renderCellWithAgeLabel = (data: WithdrawSavingsData, isFirst: boolean = false, isLast: boolean = false) => {
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
            <h4 className="text-sm font-medium text-gray-800">动老本解决</h4>
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
                  需要动用之前积累的储蓄来维持生活或应对支出的年份
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="text-xs text-gray-500">
            需要动用积蓄年份: {yearsNeedWithdraw}年
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
            <div className="w-4 h-4 bg-red-500 border border-red-500 rounded"></div>
            <span className="text-gray-600">动用金额高</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-300/70 border border-red-400/80 rounded"></div>
            <span className="text-gray-600">动用金额中等</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
            <span className="text-gray-600">无需动用积蓄</span>
          </div>
        </div>

        {/* 详情展示 */}
        {selectedCell && isMember && (
          <Card className="mt-4 border-blue-200 bg-blue-50/30">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-lg font-semibold text-gray-800">
                    {selectedCell.age}岁 ({selectedCell.year}年) 资金需求
                  </h5>
                </div>

                {selectedCell.amount > 0 ? (
                  <>
                     <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                       {selectedCell.age === 72 && selectedCell.savingsAmount && selectedCell.propertyAmount ? (
                         <div className="space-y-1">
                           <div className="flex justify-between text-sm">
                             <span className="text-gray-600">动用金融资产：</span>
                             <span className="text-blue-600 font-medium">¥{selectedCell.savingsAmount}万</span>
                           </div>
                           <div className="flex justify-between text-sm">
                             <span className="text-gray-600">变卖房产：</span>
                             <span className="text-orange-600 font-medium">¥{selectedCell.propertyAmount}万</span>
                           </div>
                         </div>
                       ) : (
                         <div className="flex justify-between items-center">
                           <span className="text-sm font-medium text-gray-700">动用金融资产：</span>
                           <span className="text-lg font-bold text-red-700">¥{selectedCell.amount}万</span>
                         </div>
                       )}
                     </div>

                     <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                       ⚠️ 该年份需要动用之前的储蓄来满足支出需求，建议提前规划
                       {selectedCell.age === 72 && "（包含变卖房产）"}
                     </div>
                  </>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-center text-gray-600">
                      该年份无需动用积蓄
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};

export default WithdrawSavingsHeatmap;