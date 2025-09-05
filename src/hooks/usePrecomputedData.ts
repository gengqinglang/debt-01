
import { useMemo } from 'react';
import { PRECOMPUTED_FINANCIAL_DATA, PrecomputedData } from '@/data/precomputedFinancialData';

// 数据缓存层 - 提供O(1)时间复杂度的数据访问
export const usePrecomputedData = (pageMode: 'member-severe-shortage' | 'member-liquidity-tight' | 'member-balanced' | 'public-severe-shortage' | 'public-liquidity-tight' | 'public-balanced' = 'public-balanced') => {
  
  // 使用useMemo确保数据仅在pageMode变化时重新获取
  const data = useMemo((): PrecomputedData => {
    console.log('usePrecomputedData: 获取预计算数据，pageMode:', pageMode);
    
    // 直接从预计算数据中获取，O(1)时间复杂度
    const precomputedData = PRECOMPUTED_FINANCIAL_DATA[pageMode];
    
    if (!precomputedData) {
      console.warn('usePrecomputedData: 未找到对应的预计算数据，使用默认值');
      return PRECOMPUTED_FINANCIAL_DATA['public-balanced'];
    }
    
    return precomputedData;
  }, [pageMode]);

  // 提供与原有useFinancialDataAdapter相同的接口
  return {
    hasFinancialGap: data.hasFinancialGap,
    cashFlowData: data.cashFlowData,
    assetLiabilityData: data.assetLiabilityData,
    financialMetrics: data.financialMetrics,
    wealthTyping: data.wealthTyping,
    threeYearForecast: data.threeYearForecast,
    healthOverviewData: data.healthOverviewData
  };
};
