
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNavigationState } from '@/hooks/useNavigationState';

const PageA = () => {
  const navigate = useNavigate();
  const { navigateBack } = useNavigationState();

  const handleBack = () => {
    console.log('[PageA] 点击返回按钮');
    navigateBack();
  };

  // 31岁的数据（从CashFlowForecast复用）
  const forecastData = {
    year: '明年（31岁）',
    age: 31,
    status: 'use-physical',
    statusLabel: '要动老本',
    description: '当年收入无法覆盖支出，需要动用积蓄及变卖房产',
    breakdown: [
      { title: '当年收支缺口', amount: '35万元' },
      { title: '需动用资产', amount: '35万元' }
    ]
  };

  // 年份详细数据（从AssessmentBasisPage复用）
  const selectedYearData = {
    year: 31,
    healthy: false,
    cashFlow: -5000,
    beginningBalance: 15, // 改为15万元
    diagnosis: '当年收入无法覆盖支出，需要动用积蓄及变卖房产',
    income: {
      total: 58000,
      salary: 41000,
      rent: 9000,
      housingFund: 8000
    },
    expenses: {
      total: 63000,
      basic: 6000,
      education: 3000,
      medical: 1500,
      pension: 2000,
      housing: 6000,
      transportation: 2500,
      majorPurchases: 1000,
      familySupport: 1000
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'surplus':
        return 'bg-[#CAEC8D]/35 text-gray-700 border-[#CAEC8D]/35';
      case 'use-physical':
        return 'bg-[#80DBE0]/35 text-gray-700 border-[#80DBE0]/35';
      case 'insufficient':
        return 'bg-[#ABABAB]/35 text-gray-700 border-[#ABABAB]/35';
      default:
        return 'bg-gray-200/35 text-gray-700 border-gray-200/35';
    }
  };

  // 收支缺口计算 - 固定为35万元
  const incomeExpenditureGap = -35;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <button onClick={handleBack} className="p-2" aria-label="返回">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">资产流动性风险（确有）测评依据</h1>
          <div className="w-10 h-10"></div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          {/* 整合后的大卡片 */}
          <Card className="bg-white border border-gray-200 shadow-md rounded-lg">
            <CardContent className="p-4">
              {/* 顶部：年龄和状态标签 */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-medium text-gray-800">
                  {forecastData.year}
                </h3>
                <Badge className={`px-3 py-1 text-sm font-medium ${getStatusBadgeStyle(forecastData.status)}`}>
                  {forecastData.statusLabel}
                </Badge>
              </div>

              {/* 描述文案 */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {forecastData.description}
                </p>
              </div>
              
              {/* 资金分解小卡片 */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {forecastData.breakdown.map((breakdownItem, breakdownIndex) => (
                  <div key={breakdownIndex} className="bg-[#F8FEFE] rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-600 mb-1">
                      {breakdownItem.title}
                    </div>
                    <div className="text-base font-bold text-[#01BCD6]">
                      {breakdownItem.amount}
                    </div>
                  </div>
                ))}
              </div>

              {/* 财务详情部分 - 使用更浅的蓝色 */}
              <div className="space-y-3">
                {/* 当年可用积蓄 */}
                <div className="p-3 bg-[#F0FBFC] border border-[#E6F7F8] rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-800">当年可用积蓄</span>
                    <span className="text-sm font-medium text-[#4ABCC8]">
                      {selectedYearData.beginningBalance}万元
                    </span>
                  </div>
                </div>

                {/* 当年收支缺口数据 */}
                <div className="p-3 bg-[#F0FBFC] border border-[#E6F7F8] rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-800">当年收支缺口</span>
                    <span className="text-sm font-medium text-[#4ABCC8]">
                      {Math.abs(incomeExpenditureGap)}万元
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    支出大于收入，存在缺口
                  </div>
                </div>
                
                {/* 收入详情 */}
                <div className="p-3 bg-[#F0FBFC] border border-[#E6F7F8] rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-800">当年总收入</span>
                    <span className="text-sm font-medium text-[#4ABCC8]">
                      ¥{selectedYearData.income.total.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">工资收入</span>
                      <span className="text-gray-700">¥{selectedYearData.income.salary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">房租收入</span>
                      <span className="text-gray-700">¥{selectedYearData.income.rent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">公积金</span>
                      <span className="text-gray-700">¥{selectedYearData.income.housingFund.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* 支出详情 */}
                <div className="p-3 bg-[#F0FBFC] border border-[#E6F7F8] rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-800">当年总支出</span>
                    <span className="text-sm font-medium text-[#4ABCC8]">
                      ¥{selectedYearData.expenses.total.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">基础生活</span>
                      <span className="text-gray-700">¥{selectedYearData.expenses.basic.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">教育</span>
                      <span className="text-gray-700">¥{selectedYearData.expenses.education.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">医疗</span>
                      <span className="text-gray-700">¥{selectedYearData.expenses.medical.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">养老</span>
                      <span className="text-gray-700">¥{selectedYearData.expenses.pension.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">居住</span>
                      <span className="text-gray-700">¥{selectedYearData.expenses.housing.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">交通</span>
                      <span className="text-gray-700">¥{selectedYearData.expenses.transportation.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">大额消费</span>
                      <span className="text-gray-700">¥{selectedYearData.expenses.majorPurchases.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">赡养</span>
                      <span className="text-gray-700">¥{selectedYearData.expenses.familySupport.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PageA;
