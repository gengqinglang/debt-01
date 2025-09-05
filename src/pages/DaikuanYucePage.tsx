import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigationState } from '@/hooks/useNavigationState';
import FinancialHealthOverview from '@/components/asset-freedom/components/FinancialHealthOverview';

// 贷款信息数据结构
interface LoanInfo {
  id: string;
  principal: number; // 贷款本金（万元）
  startAge: number;  // 开始年龄
  endAge: number;    // 结束年龄
  purpose: string;   // 贷款用途
}

// 模拟贷款数据
const loanData: LoanInfo[] = [
  {
    id: '1',
    principal: 300,
    startAge: 30,
    endAge: 55,
    purpose: '房贷'
  },
  {
    id: '2', 
    principal: 20,
    startAge: 32,
    endAge: 37,
    purpose: '车贷'
  },
  {
    id: '3',
    principal: 15,
    startAge: 35,
    endAge: 40,
    purpose: '信用贷'
  }
];

const DaikuanYucePage: React.FC = () => {
  const { navigateBack } = useNavigationState();

  const handleBack = () => {
    console.log('[DaikuanYucePage] Navigating back using navigateBack');
    navigateBack();
  };

  return (
    <div className="min-h-screen bg-[#F4FDFD] flex flex-col">
      <div className="relative flex flex-col bg-white/90 backdrop-blur-xl flex-1">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#B3EBEF]/20 via-white/60 to-[#B3EBEF]/20">
          <div className="relative p-4">
            {/* Back button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="absolute left-4 top-4 p-0 h-auto text-gray-600 hover:text-gray-800 z-10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            
            {/* Title */}
            <div className="text-center flex flex-col justify-center pt-8" style={{ minHeight: '60px' }}>
              <h1 className="text-lg font-bold text-gray-900 mb-1 tracking-tight">
                贷款期间财务预测
              </h1>
              <div className="w-20 h-1 mx-auto rounded-full mb-2 bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC]"></div>
              <p className="text-gray-700 text-xs font-medium">
                查看您的举债期间每年财务预测
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* 提醒模块 */}
            <Card className="border border-yellow-200 shadow-sm" style={{ backgroundColor: 'hsl(54, 100%, 96%)' }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: 'hsl(45, 93%, 47%)' }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'hsl(45, 93%, 30%)' }}>
                      提醒：您在贷款期间有8年存在断供风险
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* 贷款信息展示 */}
            <div className="space-y-3">
              <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#01BCD6]" />
                贷款信息
              </h2>
              <div className="space-y-3">
                {loanData.map((loan, index) => (
                  <Card key={loan.id} className="bg-white border border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#B3EBEF]/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-[#01BCD6]">{index + 1}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">{loan.purpose}</span>
                            <span className="text-sm text-gray-500">
                              {loan.startAge}岁到{loan.endAge}岁
                            </span>
                          </div>
                        </div>
                        <span className="text-base font-semibold text-[#01BCD6]">
                          ¥{loan.principal}万
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* 财务预测模块标题 */}
            <div className="space-y-3">
              <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#01BCD6]" />
                贷款期间财务预测
              </h2>
              
              {/* 财务预测组件 */}
              <FinancialHealthOverview
                ageRange={[30, 55]}
                title="贷款期间财务预测"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaikuanYucePage;