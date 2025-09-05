
import { usePrecomputedData } from './usePrecomputedData';
import { 
  FinancialMetrics,
  WealthTyping,
  ThreeYearForecast,
  HealthOverviewData
} from '@/data/precomputedFinancialData';
import { FinancialDataItem } from '@/components/asset-freedom/data/financialData';

// 保持原有接口不变，确保页面功能不受影响
export type { FinancialMetrics, WealthTyping };

export const useFinancialDataAdapter = (pageMode: 'member-severe-shortage' | 'member-liquidity-tight' | 'member-balanced' | 'public-severe-shortage' | 'public-liquidity-tight' | 'public-balanced' = 'public-balanced') => {
  
  // 使用预计算数据替代原有的复杂计算逻辑
  const precomputedData = usePrecomputedData(pageMode);
  
  console.log('useFinancialDataAdapter: 使用预计算数据，pageMode:', pageMode);
  
  // 直接返回预计算的数据，无需任何计算
  return {
    hasFinancialGap: precomputedData.hasFinancialGap,
    cashFlowData: precomputedData.cashFlowData,
    assetLiabilityData: precomputedData.assetLiabilityData,
    financialMetrics: precomputedData.financialMetrics,
    wealthTyping: precomputedData.wealthTyping,
    threeYearForecast: precomputedData.threeYearForecast,
    healthOverviewData: precomputedData.healthOverviewData
  };
};
