
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CashFlowPrediction from './components/CashFlowPrediction';
import AssetLiabilityPrediction from './components/AssetLiabilityPrediction';
import FinancialSummaryOverview from './components/FinancialSummaryOverview';

interface WealthPredictionProps {
  onStepClick: (stepId: string) => void;
  completedSteps: string[];
  simplified?: boolean;
  financialMetrics?: any;
  threeYearForecast?: any[];
  healthOverviewData?: any;
  // hideDisposableWealthHeatmap prop removed
  pageMode?: 'member-severe-shortage' | 'member-liquidity-tight' | 'member-balanced' | 'public-severe-shortage' | 'public-liquidity-tight' | 'public-balanced';
  onInteractionAttempt?: () => void;
  hideTabs?: boolean;
}

const WealthPrediction: React.FC<WealthPredictionProps> = ({ 
  onStepClick, 
  completedSteps, 
  simplified = false, 
  financialMetrics,
  threeYearForecast,
  healthOverviewData,
  // hideDisposableWealthHeatmap = false, // removed
  pageMode = 'public-balanced',
  onInteractionAttempt,
  hideTabs = false
}) => {
  
  // 如果是简化模式，只显示财务指标概览和生涯现金流健康概览
  if (simplified) {
    return (
      <div className="space-y-4">
        {/* 未来财富总览 */}
        <div>
          <h4 className="text-base font-semibold text-gray-800 mb-3">未来财富总览</h4>
          <FinancialSummaryOverview 
            simplified={simplified} 
            pageMode={pageMode}
            financialMetrics={financialMetrics}
          />
        </div>
        
        {/* 生涯现金流健康概览 */}
        <CashFlowPrediction 
          simplified={simplified} 
          forecastData={threeYearForecast}
          healthOverviewData={healthOverviewData}
          // hideDisposableWealthHeatmap prop removed
          pageMode={pageMode}
          onInteractionAttempt={onInteractionAttempt}
        />
      </div>
    );
  }

  // 完整模式保持原有的tabs结构
  const [showAssetLiabilityPrediction, setShowAssetLiabilityPrediction] = useState(true);
  
  return (
    <div className="space-y-4" data-module="cash-flow-prediction" data-testid="cash-flow-prediction">
      {/* 条件渲染 Tabs - 当 hideTabs 为 true 时不显示，但直接显示现金流预测内容 */}
      {!hideTabs ? (
        <Tabs defaultValue="cashflow" className="w-full">
          <TabsList className={`grid w-full ${showAssetLiabilityPrediction ? 'grid-cols-2' : 'grid-cols-1'} bg-white border border-[#B3EBEF]/20`}>
            <TabsTrigger 
              value="cashflow" 
              className="data-[state=active]:bg-[#B3EBEF] data-[state=active]:text-gray-800 text-gray-600 font-medium"
            >
              未来现金流预测
            </TabsTrigger>
            {showAssetLiabilityPrediction && (
              <TabsTrigger 
                value="assets"
                className="data-[state=active]:bg-[#B3EBEF] data-[state=active]:text-gray-800 text-gray-600 font-medium"
              >
                未来资产负债预测
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="cashflow" className="mt-4">
            <CashFlowPrediction 
              simplified={simplified} 
              forecastData={threeYearForecast}
              healthOverviewData={healthOverviewData}
              // hideDisposableWealthHeatmap prop removed
              pageMode={pageMode}
              onInteractionAttempt={onInteractionAttempt}
              hideChartAndCards={hideTabs}
            />
          </TabsContent>
          {showAssetLiabilityPrediction && (
            <TabsContent value="assets" className="mt-4">
              <AssetLiabilityPrediction />
            </TabsContent>
          )}
        </Tabs>
      ) : (
        // 当隐藏Tab时，直接显示现金流预测内容（包括未来三年卡片、现金流健康概览等）
        <div className="mt-4">
          <CashFlowPrediction 
            simplified={simplified} 
            forecastData={threeYearForecast}
            healthOverviewData={healthOverviewData}
            // hideDisposableWealthHeatmap prop removed
            pageMode={pageMode}
            onInteractionAttempt={onInteractionAttempt}
            hideChartAndCards={hideTabs}
          />
        </div>
      )}
    </div>
  );
};

export default WealthPrediction;
