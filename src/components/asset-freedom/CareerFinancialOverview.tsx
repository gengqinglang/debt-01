import React from 'react';
import FinancialSummaryOverview from './components/FinancialSummaryOverview';

interface CareerFinancialOverviewProps {
  financialMetrics?: any;
  simplified?: boolean;
  pageMode?: 'member-severe-shortage' | 'member-liquidity-tight' | 'member-balanced' | 'public-severe-shortage' | 'public-liquidity-tight' | 'public-balanced';
  displayMode?: 'first-time' | 'returning';
  onNavigateToWealthTyping?: () => void;
}

const CareerFinancialOverview: React.FC<CareerFinancialOverviewProps> = ({ 
  financialMetrics,
  simplified = false,
  pageMode = 'public-balanced',
  displayMode = 'first-time',
  onNavigateToWealthTyping
}) => {
  return (
    <div className="space-y-4">
      {/* 未来人生财务总览标题 */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          {displayMode === 'returning' ? '财富分型及财务总览' : '财务总览'}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          更新时间：{new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
      
      {/* 财务指标概览 */}
      <FinancialSummaryOverview 
        simplified={simplified} 
        pageMode={pageMode}
        displayMode={displayMode}
        onNavigateToWealthTyping={onNavigateToWealthTyping}
        financialMetrics={financialMetrics}
      />
    </div>
  );
};

export default CareerFinancialOverview;