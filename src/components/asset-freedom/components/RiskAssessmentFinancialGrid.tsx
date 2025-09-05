import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calendar, CircleCheck, AlertCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface RiskSelection {
  who: string;
  age: string;
  type: string;
}

interface RiskAssessmentFinancialGridProps {
  riskSelection: RiskSelection;
  riskLevel: 'high' | 'moderate' | 'none';
}

// 财务阶段数据结构
interface YearlyFinancialData {
  year: number;
  healthy: boolean;
  cashFlow: number;
  beginningBalance: number;
}

interface FinancialStage {
  period: string;
  healthy: boolean;
  yearlyData: YearlyFinancialData[];
}

export const RiskAssessmentFinancialGrid: React.FC<RiskAssessmentFinancialGridProps> = ({ 
  riskSelection, 
  riskLevel 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // 基于风险测评创建财务阶段数据 - 从选择年龄到85岁
  const createFinancialStagesData = (): FinancialStage[] => {
    const baseAge = parseInt(riskSelection.age) || 30;
    const stages: FinancialStage[] = [];
    
    // 生成从baseAge到85岁的数据，每5年一个阶段
    for (let startAge = baseAge; startAge <= 85; startAge += 5) {
      const endAge = Math.min(startAge + 4, 85);
      const yearsInStage = endAge - startAge + 1;
      
      stages.push({
        period: `${startAge}岁-${endAge}岁`,
        healthy: startAge === baseAge ? riskLevel !== 'high' : Math.random() > 0.2,
        yearlyData: Array.from({length: yearsInStage}, (_, i) => {
          const currentYear = startAge + i;
          return {
            year: currentYear,
            healthy: currentYear === baseAge ? riskLevel !== 'high' : Math.random() > 0.25,
            cashFlow: currentYear === baseAge && riskLevel === 'high' 
              ? -500000 
              : Math.floor(Math.random() * 150000 - 30000),
            beginningBalance: 500000 + (currentYear - baseAge) * 60000
          };
        })
      });
    }
    
    return stages;
  };

  const financialStagesData = createFinancialStagesData();

  const handlePeriodClick = (period: string) => {
    setSelectedPeriod(period);
  };

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
  };

  const handleBack = () => {
    if (selectedYear) {
      setSelectedYear(null);
    } else if (selectedPeriod) {
      setSelectedPeriod(null);
    }
  };

  const handleWeChatPay = async () => {
    setIsProcessingPayment(true);
    try {
      // 模拟支付处理
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowPaymentModal(false);
    } catch (error) {
      console.error('支付失败:', error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const selectedPeriodData = selectedPeriod 
    ? financialStagesData.find(stage => stage.period === selectedPeriod)
    : null;
  
  const selectedYearData = selectedYear && selectedPeriodData
    ? selectedPeriodData.yearlyData.find(data => data.year === selectedYear)
    : null;

  // 如果选择了具体年份，显示年份详情
  if (selectedYear && selectedYearData) {
    return (
      <div>
        <div className="flex items-center mb-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack} 
            className="flex items-center text-xs p-1"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            返回
          </Button>
          <span className="text-xs font-medium ml-2">{selectedYear}岁财务详情</span>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">现金流状况</span>
              <span className={`text-sm font-medium ${selectedYearData.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {selectedYearData.cashFlow >= 0 ? '+' : ''}¥{selectedYearData.cashFlow.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">期初余额</span>
              <span className="text-sm font-medium">¥{selectedYearData.beginningBalance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">财务健康状况</span>
              <div className="flex items-center gap-1">
                {selectedYearData.healthy ? (
                  <CircleCheck className="h-4 w-4 text-[#01BCD6]" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${selectedYearData.healthy ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedYearData.healthy ? '健康' : '需要关注'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 如果选择了时期，显示该时期的年份列表
  if (selectedPeriod && selectedPeriodData) {
    return (
      <div>
        <div className="flex items-center mb-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack} 
            className="flex items-center text-xs p-1"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            返回
          </Button>
          <span className="text-xs font-medium ml-2">{selectedPeriod}详情</span>
        </div>
        
        <div className="space-y-2">
          {selectedPeriodData.yearlyData.map((yearData, index) => (
            <div 
              key={index}
              className={`rounded-md px-3 py-3 text-xs cursor-pointer transition-shadow ${
                yearData.healthy 
                  ? 'bg-green-50 border border-green-100' 
                  : 'bg-red-50 border border-red-100'
              }`}
              onClick={() => handleYearClick(yearData.year)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Calendar className={`h-4 w-4 ${yearData.healthy ? 'text-[#01BCD6]' : 'text-red-600'}`} />
                  <span>{yearData.year}岁</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={yearData.healthy ? 'text-green-600' : 'text-red-600'}>
                    {yearData.cashFlow > 0 ? '+' : ''}¥{yearData.cashFlow.toLocaleString()}
                  </span>
                  {yearData.healthy ? (
                    <CircleCheck className="h-3.5 w-3.5 text-[#01BCD6]" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 默认显示3x3网格
  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {financialStagesData.map((stage, index) => {
          return (
            <Card 
              key={index}
              onClick={() => {
                // 模拟会员检查 - 实际使用时应该从props传入
                const isMember = true; // 假设是会员
                
                if (!isMember) {
                  setShowPaymentModal(true);
                } else {
                  handlePeriodClick(stage.period);
                }
              }}
              className="bg-white rounded-xl aspect-square flex flex-col items-center justify-center p-3 cursor-pointer transition-all duration-200 border-0 relative shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
              style={{
                boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.4), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 -1px 3px -1px rgba(0, 0, 0, 0.03)'
              }}
            >
              {stage.healthy ? (
                <CircleCheck className="h-8 w-8 text-[#01BCD6] mb-2" strokeWidth={1} />
              ) : (
                <AlertCircle className="h-8 w-8 text-red-600 mb-2" strokeWidth={1} />
              )}
              
              <div className="font-medium text-xs text-center text-gray-800">
                {stage.period}
              </div>
            </Card>
          );
        })}
      </div>
      
      {/* 支付弹窗 */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">开通会员</DialogTitle>
            <DialogDescription className="text-center">
              查看风险测评详细分析需要升级为会员
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* 价格信息 */}
            <div className="text-center bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-800 mb-1">¥29.9</div>
              <div className="text-sm text-gray-600">月度会员</div>
              <div className="text-xs text-gray-500 line-through">原价 ¥99</div>
            </div>

            {/* 会员权益 */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">会员权益：</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 专业风险评估和解决方案</li>
                <li>• 个性化财富管理建议</li>
                <li>• 完整的财富分型解读</li>
                <li>• 不限次数的工具使用</li>
              </ul>
            </div>

            {/* 微信支付按钮 */}
            <Button
              onClick={handleWeChatPay}
              disabled={isProcessingPayment}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  处理中...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.5 2A5.5 5.5 0 003 7.5v9A5.5 5.5 0 008.5 22h7a5.5 5.5 0 0015.5-5.5v-9A5.5 5.5 0 0015.5 2h-7zm0 2h7A3.5 3.5 0 0119 7.5v9a3.5 3.5 0 01-3.5 3.5h-7A3.5 3.5 0 015 16.5v-9A3.5 3.5 0 018.5 4zM12 6.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zm0 2a3.5 3.5 0 110 7 3.5 3.5 0 010-7z"/>
                  </svg>
                  微信支付 ¥29.9
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};