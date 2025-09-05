import React, { useState, useMemo } from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { useMembership } from '@/components/membership/MembershipProvider';

interface FinancingData {
  age: number;
  year: string;
  isLoanYear: boolean; // 是否是贷款年份
  isRepaymentYear: boolean; // 是否是还款年份
  repaymentAmount: number; // 还款金额
}

interface FinancingPlanHeatmapProps {
  onInteractionAttempt?: () => void;
}

const FinancingPlanHeatmap = ({ onInteractionAttempt }: FinancingPlanHeatmapProps) => {
  const { isMember } = useMembership();
  const [selectedCell, setSelectedCell] = useState<FinancingData | null>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  // 融资计划数据 - 45岁贷款，15年期，250万总额
  const financingData = useMemo(() => {
    const data: FinancingData[] = [];
    const loanAge = 45; // 贷款年龄
    const loanTerm = 15; // 贷款期限
    const totalLoanAmount = 250; // 总贷款额度250万
    const annualRepayment = totalLoanAmount / loanTerm; // 年还款额约16.67万
    
    for (let age = 30; age <= 85; age++) {
      const isLoanYear = age === loanAge;
      const isRepaymentYear = age >= loanAge && age < loanAge + loanTerm;
      
      data.push({
        age,
        year: `${2024 - 30 + age}`,
        isLoanYear,
        isRepaymentYear,
        repaymentAmount: isRepaymentYear ? Math.round(annualRepayment * 10) / 10 : 0 // 保留一位小数
      });
    }
    
    return data;
  }, []);

  // 根据状态计算颜色
  const getColorIntensity = (data: FinancingData) => {
    if (data.isLoanYear) {
      return 'bg-green-400/80 border-green-500/90'; // 贷款年份用绿色高亮
    }
    if (data.isRepaymentYear) {
      return 'bg-orange-300/70 border-orange-400/80'; // 还款年份用橙色
    }
    return 'bg-white border-gray-200'; // 其他年份
  };

  // 按行排列数据（每行14年）
  const financingRows: FinancingData[][] = [];
  for (let i = 0; i < financingData.length; i += 14) {
    financingRows.push(financingData.slice(i, i + 14));
  }

  // 处理点击事件
  const handleCellClick = (data: FinancingData) => {
    if (!isMember) {
      onInteractionAttempt?.();
      return;
    }
    setSelectedCell(selectedCell?.age === data.age ? null : data);
  };

  // Tooltip 处理函数
  const handleTooltipClick = () => {
    setIsTooltipOpen(!isTooltipOpen);
  };

  // 渲染带年龄标签的格子
  const renderCellWithAgeLabel = (data: FinancingData, isFirst: boolean = false, isLast: boolean = false) => {
    const isSelected = selectedCell?.age === data.age;
    const colorIntensity = getColorIntensity(data);
    
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
          <span className="text-xs text-gray-800 font-bold z-10">
            30
          </span>
        )}
        {isLast && (
          <span className="text-xs text-gray-800 font-bold z-10">
            85
          </span>
        )}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* 融资计划热力图 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-medium text-gray-800">融资解决</h4>
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
                    展示未来需要融资的年份和还款计划，帮助您提前做好资金安排
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* 热力图网格 */}
          <div className="space-y-1">
            {financingRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex space-x-1">
                {row.map((data, cellIndex) => {
                  const isFirst = rowIndex === 0 && cellIndex === 0;
                  const isLast = rowIndex === financingRows.length - 1 && cellIndex === row.length - 1;
                  return renderCellWithAgeLabel(data, isFirst, isLast);
                })}
              </div>
            ))}
          </div>

          {/* 图例 */}
          <div className="flex items-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-400/80 border border-green-500/90 rounded"></div>
              <span className="text-gray-600">贷款年份</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-300/70 border border-orange-400/80 rounded"></div>
              <span className="text-gray-600">还款期间</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
              <span className="text-gray-600">无需融资</span>
            </div>
          </div>

          {/* 详情展示 */}
          {selectedCell && isMember && (
            <Card className="mt-4 border-blue-200 bg-blue-50/30">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-lg font-semibold text-gray-800">
                      {selectedCell.age}岁 ({selectedCell.year}年) 融资详情
                    </h5>
                  </div>

                  {selectedCell.isLoanYear ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">贷款总金额：</span>
                            <span className="text-lg font-bold text-yellow-700">250万元</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">贷款期限：</span>
                            <span className="text-base font-semibold text-gray-800">15年</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">当年还款额：</span>
                            <span className="text-base font-semibold text-orange-700">{selectedCell.repaymentAmount}万元</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        💡 这是您申请贷款的年份，从此年开始需要承担还款义务
                      </div>
                    </div>
                  ) : selectedCell.isRepaymentYear ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">本年还款金额：</span>
                          <span className="text-lg font-bold text-orange-700">{selectedCell.repaymentAmount}万元</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        📅 还款期间，请确保有充足的现金流支付贷款
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-center text-gray-600">
                        该年份无融资需求
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </TooltipProvider>
  );
};

export default FinancingPlanHeatmap;