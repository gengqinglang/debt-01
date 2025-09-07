// Unified debt hook for business loan (经营贷)

import { useState, useEffect, useCallback } from 'react';
import { useBusinessLoanData } from '@/hooks/useBusinessLoanData';
import { normalizeBusinessLoanData } from '@/loan-core/normalize';
import { NormalizedDebtData } from '@/loan-core/types';

export interface UseDebtBusinessLoanOptions {
  existingData?: any;
  onDataChange?: (normalizedData: NormalizedDebtData) => void;
}

export function useDebtBusinessLoan({ existingData, onDataChange }: UseDebtBusinessLoanOptions = {}) {
  const businessLoanDataHook = useBusinessLoanData(existingData?.businessLoans);

  // 监听数据变化并标准化
  useEffect(() => {
    const rawData = { 
      businessLoans: businessLoanDataHook.businessLoans,
      getAggregatedData: businessLoanDataHook.getAggregatedData
    };
    const normalizedData = normalizeBusinessLoanData(rawData);
    onDataChange?.(normalizedData);
  }, [businessLoanDataHook.businessLoans, onDataChange]);

  // 获取当前标准化数据
  const getNormalizedData = useCallback((): NormalizedDebtData => {
    const rawData = { 
      businessLoans: businessLoanDataHook.businessLoans,
      getAggregatedData: businessLoanDataHook.getAggregatedData
    };
    return normalizeBusinessLoanData(rawData);
  }, [businessLoanDataHook.businessLoans, businessLoanDataHook.getAggregatedData]);

  return {
    // 原始hook的所有功能
    ...businessLoanDataHook,
    // 标准化数据接口
    getNormalizedData
  };
}