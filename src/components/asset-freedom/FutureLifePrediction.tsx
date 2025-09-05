import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import CashFlowForecast from './components/CashFlowForecast';
import FinancialHealthOverview from './components/FinancialHealthOverview';

interface FutureLifePredictionProps {
  threeYearForecast?: any[];
  healthOverviewData?: any;
  pageMode?: 'member-severe-shortage' | 'member-liquidity-tight' | 'member-balanced' | 'public-severe-shortage' | 'public-liquidity-tight' | 'public-balanced';
  onInteractionAttempt?: () => void;
}

const FutureLifePrediction: React.FC<FutureLifePredictionProps> = ({ 
  threeYearForecast,
  healthOverviewData,
  pageMode = 'public-balanced',
  onInteractionAttempt
}) => {
  const handleNonMemberInteraction = onInteractionAttempt || (() => {});

  return (
    <div className="space-y-4" data-module="cash-flow-prediction" data-testid="cash-flow-prediction">
      {/* 未来人生财务预测标题 */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800">现金流预测</h3>
      </div>
      
      <div className="space-y-4">
        {/* 会员-没钱状态下的警告卡片 */}
        {pageMode === 'member-severe-shortage' && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-red-700 font-medium">
                  注意！家庭未来有15年存在现金流缺口
                </span>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* 会员-平状态下的恭喜卡片 */}
        {pageMode === 'member-balanced' && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-green-700 font-medium">
                  恭喜！家庭未来不会遇到现金流缺口问题
                </span>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* 未来三年财务预测卡片 */}
        <div>
          <CashFlowForecast 
            forecastData={threeYearForecast} 
            isMember={!pageMode?.startsWith('public-')}
            pageMode={pageMode}
            onInteractionAttempt={onInteractionAttempt}
          />
        </div>

        {/* 整个人生现金流预测（5年为单位的小卡片） */}
        <div>
          <FinancialHealthOverview
            onInteractionAttempt={handleNonMemberInteraction} 
            healthOverviewData={healthOverviewData}
            pageMode={pageMode}
          />
        </div>
      </div>
    </div>
  );
};

export default FutureLifePrediction;