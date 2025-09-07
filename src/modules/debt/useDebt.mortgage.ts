// Unified debt hook for mortgage (房贷)

import { useState, useEffect, useCallback } from 'react';
import { useLoanData } from '@/hooks/useLoanData';
import { normalizeMortgageData } from '@/loan-core/normalize';
import { NormalizedDebtData } from '@/loan-core/types';

export interface UseDebtMortgageOptions {
  existingData?: any;
  onDataChange?: (normalizedData: NormalizedDebtData) => void;
}

export function useDebtMortgage({ existingData, onDataChange }: UseDebtMortgageOptions = {}) {
  const loanDataHook = useLoanData({ persist: false });
  const [aggregatedData, setAggregatedData] = useState<any>(null);

  // 初始化数据
  useEffect(() => {
    if (existingData) {
      if (existingData.loans) {
        loanDataHook.setLoans(existingData.loans);
      }
      if (existingData.count !== undefined) {
        setAggregatedData(existingData);
      }
    }
  }, [existingData]);

  // 监听数据变化并标准化
  useEffect(() => {
    const rawData = aggregatedData || { loans: loanDataHook.loans };
    const normalizedData = normalizeMortgageData(rawData);
    onDataChange?.(normalizedData);
  }, [loanDataHook.loans, aggregatedData, onDataChange]);

  // 更新聚合数据的接口
  const updateAggregatedData = useCallback((data: any) => {
    setAggregatedData(data);
  }, []);

  // 获取当前标准化数据
  const getNormalizedData = useCallback((): NormalizedDebtData => {
    const rawData = aggregatedData || { loans: loanDataHook.loans };
    return normalizeMortgageData(rawData);
  }, [loanDataHook.loans, aggregatedData]);

  return {
    // 原始hook的所有功能
    ...loanDataHook,
    // 聚合数据相关
    aggregatedData,
    updateAggregatedData,
    // 标准化数据接口
    getNormalizedData
  };
}