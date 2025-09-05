
import React from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import WealthPrediction from '@/components/asset-freedom/WealthPrediction';
import { useNavigationState } from '@/hooks/useNavigationState';

const FutureWealthPredictionPage = () => {
  const { navigateBack } = useNavigationState();

  const handleBack = () => {
    console.log('[FutureWealthPredictionPage] Navigating back');
    navigateBack();
  };

  return (
    <div className="min-h-screen flex flex-col w-full max-w-md mx-auto bg-white">
      {/* 头部导航 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="返回"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">未来财富预测</h1>
        <div className="w-8 h-8"></div> {/* 占位符保持居中 */}
      </div>

      {/* 提醒模块 */}
      <div className="px-4 pt-4">
        <Card className="border border-yellow-200 shadow-sm" style={{ backgroundColor: 'hsl(54, 100%, 96%)' }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: 'hsl(45, 93%, 47%)' }} />
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: 'hsl(45, 93%, 30%)' }}>
                  提醒：您未来一共有387万资产缺口，未来有3年现金流缺口的年份
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 财富预测内容 */}
      <div className="flex-1 px-4 py-4">
        <WealthPrediction onStepClick={() => {}} completedSteps={[]} simplified={true} />
      </div>
    </div>
  );
};

export default FutureWealthPredictionPage;
