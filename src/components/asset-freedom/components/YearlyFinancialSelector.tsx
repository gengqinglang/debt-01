import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, AlertTriangle, X } from 'lucide-react';
import { useFinancialHeatmapData } from '@/hooks/useFinancialHeatmapData';

interface YearlyFinancialSelectorProps {
  onInteractionAttempt?: () => void;
}

const YearlyFinancialSelector = ({ onInteractionAttempt }: YearlyFinancialSelectorProps) => {
  const { annualSurplusData, withdrawSavingsData, financingData } = useFinancialHeatmapData();
  const [selectedYear, setSelectedYear] = useState<string>('');

  // 获取选中年份的详细信息
  const getSelectedYearData = () => {
    if (!selectedYear) return null;

    const age = parseInt(selectedYear);
    const surplusData = annualSurplusData.find(d => d.age === age);
    const withdrawData = withdrawSavingsData.find(d => d.age === age);
    const financingInfo = financingData.find(d => d.age === age);

    return {
      surplus: surplusData,
      withdraw: withdrawData,
      financing: financingInfo
    };
  };

  const selectedYearData = getSelectedYearData();
  const isDeficit = selectedYearData?.surplus && selectedYearData.surplus.amount < 0;

  // 生成年份选项（30-85岁）
  const yearOptions = annualSurplusData.map(data => ({
    age: data.age,
    year: data.year,
    amount: data.amount
  }));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-800">选择年份查看详情</h4>
      </div>

      {/* 年份选择器 */}
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="选择查看年份（年龄）" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((option) => (
                <SelectItem key={option.age} value={option.age.toString()}>
                  {option.age}岁 ({option.year}年) - 
                  {option.amount >= 0 ? (
                    <span className="text-green-600 ml-1">结余 ¥{option.amount}万</span>
                  ) : (
                    <span className="text-red-600 ml-1">亏损 ¥{Math.abs(option.amount)}万</span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* 清除按钮 */}
          {selectedYear && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedYear('')}
              className="px-2 h-10"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 选中年份的详细信息 */}
      {selectedYearData && (
        <div className="space-y-4">
          {/* 收支结余/亏损情况 */}
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {isDeficit ? (
                    <>
                      <TrendingDown className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-medium text-gray-700">收支亏损</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-gray-700">收支结余</span>
                    </>
                  )}
                </div>
                <Badge variant={isDeficit ? "destructive" : "default"}>
                  {selectedYearData.surplus?.age}岁 ({selectedYearData.surplus?.year}年)
                </Badge>
              </div>
              
              <div className="text-center p-3 rounded-lg border" 
                   style={{ 
                     backgroundColor: isDeficit ? '#fef2f2' : '#f0fdf4',
                     borderColor: isDeficit ? '#fecaca' : '#bbf7d0'
                   }}>
                <div className="text-2xl font-bold" 
                     style={{ color: isDeficit ? '#dc2626' : '#16a34a' }}>
                  ¥{Math.abs(selectedYearData.surplus?.amount || 0)}万
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 亏损解决方案 */}
          {isDeficit && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">亏损解决方案</span>
              </div>

              {/* 动老本解决 */}
              {selectedYearData.withdraw && selectedYearData.withdraw.amount > 0 && (
                <Card className="border-red-200 bg-red-50/30">
                  <CardContent className="p-4">
                    {/* 72岁特殊显示 */}
                    {selectedYearData.withdraw.age === 72 && 
                     selectedYearData.withdraw.savingsAmount && 
                     selectedYearData.withdraw.propertyAmount ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">动用金融资产：</span>
                          <span className="text-blue-600 font-medium">
                            ¥{selectedYearData.withdraw.savingsAmount}万
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">变卖房产：</span>
                          <span className="text-orange-600 font-medium">
                            ¥{selectedYearData.withdraw.propertyAmount}万
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">动用金融资产：</span>
                        <span className="text-blue-600 font-medium">¥{selectedYearData.withdraw.amount}万</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* 融资解决 */}
              {selectedYearData.financing && selectedYearData.financing.isRepaymentYear && (
                <Card className="border-blue-200 bg-blue-50/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">融资解决</span>
                      <span className="text-lg font-bold text-blue-700">
                        ¥{selectedYearData.financing.repaymentAmount}万
                      </span>
                    </div>
                    
                    <div className="space-y-1 mt-3 text-sm text-gray-600">
                      <div>• 年度还款金额：¥{selectedYearData.financing.repaymentAmount}万</div>
                      <div>• 融资类型：房屋抵押贷款</div>
                      <div>• 贷款期限：15年</div>
                      {selectedYearData.financing.isLoanYear && (
                        <div className="text-green-600 font-medium mt-2">
                          ✓ 本年度为放款年份
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

          {/* 如果既没有动老本也没有融资，显示提示 */}
          {(!selectedYearData.withdraw || selectedYearData.withdraw.amount === 0) && 
           (!selectedYearData.financing || !selectedYearData.financing.isRepaymentYear) && (
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="p-4 text-center">
                <div className="text-sm text-gray-600">
                  该年份暂无具体解决方案数据，建议提前进行财务规划
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
        </div>
      )}
    </div>
  );
};

export default YearlyFinancialSelector;