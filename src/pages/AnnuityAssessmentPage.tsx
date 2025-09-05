import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigationState } from '@/hooks/useNavigationState';

const AnnuityAssessmentPage: React.FC = () => {
  const { navigateBack } = useNavigationState();

  const handleBack = () => {
    console.log('[AnnuityAssessmentPage] Navigating back');
    navigateBack();
  };

  // 虚拟数据：近10年年金购买能力数据
  // 包含有钱和没钱两种情况
  const annuityData = [
    {
      year: 2024,
      amount: 0,
      status: 'no-money'
    },
    {
      year: 2025,
      amount: 85000,
      status: 'has-money'
    },
    {
      year: 2026,
      amount: 120000,
      status: 'has-money'
    },
    {
      year: 2027,
      amount: 0,
      status: 'no-money'
    },
    {
      year: 2028,
      amount: 95000,
      status: 'has-money'
    },
    {
      year: 2029,
      amount: 150000,
      status: 'has-money'
    },
    {
      year: 2030,
      amount: 75000,
      status: 'has-money'
    },
    {
      year: 2031,
      amount: 0,
      status: 'no-money'
    },
    {
      year: 2032,
      amount: 180000,
      status: 'has-money'
    },
    {
      year: 2033,
      amount: 110000,
      status: 'has-money'
    }
  ];

  const formatAmount = (amount: number) => {
    if (amount === 0) return '0';
    return `¥${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen">
        {/* 返回按钮 */}
        <div className="px-6 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-0 h-auto text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
        </div>

        {/* 页面标题 */}
        <div className="px-6 py-4">
          <h1 className="text-xl font-bold text-gray-800">年金购买能力测评</h1>
        </div>

        {/* 说明文字 */}
        <div className="px-6 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              以下数据为您各年度的年金购买资金能力。系统综合分析了您的可支配收入与退休储备资金，确保年金投入不会对您的日常生活支出和既定财务规划产生影响。
            </p>
          </div>
        </div>

        {/* 年金购买能力卡片列表 */}
        <div className="px-6 space-y-4">
          {annuityData.map((data) => (
            <Card key={data.year} className={`border ${
              data.status === 'has-money' 
                ? 'border-green-200 bg-gradient-to-br from-green-50/80 to-green-50/40' 
                : 'border-gray-200 bg-gradient-to-br from-gray-50/80 to-gray-50/40'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {data.year}年
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      年金购买能力
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      data.status === 'has-money' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {formatAmount(data.amount)}
                    </div>
                    {data.status === 'no-money' && (
                      <p className="text-xs text-gray-500 mt-1">
                        暂无可用资金
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 底部说明 */}
        <div className="px-6 py-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>温馨提示：</strong>年金是一种长期投资工具，建议您在有充足可用资金的年份考虑购买，以确保不影响日常生活和其他重要支出计划。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnuityAssessmentPage;