// Unified debt hook for private loan (民间贷)

import { useState, useEffect, useCallback } from 'react';
import { usePrivateLoanData } from '@/hooks/usePrivateLoanData';
import { normalizePrivateLoanData } from '@/loan-core/normalize';
import { NormalizedDebtData } from '@/loan-core/types';

export interface UseDebtPrivateLoanOptions {
  existingData?: any;
  onDataChange?: (normalizedData: NormalizedDebtData) => void;
}

export function useDebtPrivateLoan({ existingData, onDataChange }: UseDebtPrivateLoanOptions = {}) {
  const privateLoanDataHook = usePrivateLoanData(existingData?.privateLoans);

  // 监听数据变化并标准化
  useEffect(() => {
    const rawData = { 
      privateLoans: privateLoanDataHook.privateLoans,
      getAggregatedData: privateLoanDataHook.getAggregatedData
    };
    const normalizedData = normalizePrivateLoanData(rawData);
    onDataChange?.(normalizedData);
  }, [privateLoanDataHook.privateLoans, onDataChange]);

  // 获取当前标准化数据
  const getNormalizedData = useCallback((): NormalizedDebtData => {
    const rawData = { 
      privateLoans: privateLoanDataHook.privateLoans,
      getAggregatedData: privateLoanDataHook.getAggregatedData
    };
    return normalizePrivateLoanData(rawData);
  }, [privateLoanDataHook.privateLoans, privateLoanDataHook.getAggregatedData]);

  return {
    // 原始hook的所有功能
    ...privateLoanDataHook,
    // 标准化数据接口
    getNormalizedData
  };
}