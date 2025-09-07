// Unified debt hook for consumer loan (消费贷)

import { useState, useEffect, useCallback } from 'react';
import { useConsumerLoanData } from '@/hooks/useConsumerLoanData';
import { normalizeConsumerLoanData } from '@/loan-core/normalize';
import { NormalizedDebtData } from '@/loan-core/types';

export interface UseDebtConsumerLoanOptions {
  existingData?: any;
  onDataChange?: (normalizedData: NormalizedDebtData) => void;
}

export function useDebtConsumerLoan({ existingData, onDataChange }: UseDebtConsumerLoanOptions = {}) {
  const consumerLoanDataHook = useConsumerLoanData(existingData?.consumerLoans);

  // 监听数据变化并标准化
  useEffect(() => {
    const rawData = { 
      consumerLoans: consumerLoanDataHook.consumerLoans,
      getAggregatedData: consumerLoanDataHook.getAggregatedData
    };
    const normalizedData = normalizeConsumerLoanData(rawData);
    onDataChange?.(normalizedData);
  }, [consumerLoanDataHook.consumerLoans, onDataChange]);

  // 获取当前标准化数据
  const getNormalizedData = useCallback((): NormalizedDebtData => {
    const rawData = { 
      consumerLoans: consumerLoanDataHook.consumerLoans,
      getAggregatedData: consumerLoanDataHook.getAggregatedData
    };
    return normalizeConsumerLoanData(rawData);
  }, [consumerLoanDataHook.consumerLoans, consumerLoanDataHook.getAggregatedData]);

  return {
    // 原始hook的所有功能
    ...consumerLoanDataHook,
    // 标准化数据接口
    getNormalizedData
  };
}