// Unified debt hook for car loan (车贷)

import { useState, useEffect, useCallback } from 'react';
import { useCarLoanData } from '@/hooks/useCarLoanData';
import { normalizeCarLoanData } from '@/loan-core/normalize';
import { NormalizedDebtData } from '@/loan-core/types';

export interface UseDebtCarLoanOptions {
  existingData?: any;
  onDataChange?: (normalizedData: NormalizedDebtData) => void;
}

export function useDebtCarLoan({ existingData, onDataChange }: UseDebtCarLoanOptions = {}) {
  const carLoanDataHook = useCarLoanData(existingData?.carLoans);

  // 监听数据变化并标准化
  useEffect(() => {
    const rawData = { 
      carLoans: carLoanDataHook.carLoans,
      getAggregatedData: carLoanDataHook.getAggregatedData
    };
    const normalizedData = normalizeCarLoanData(rawData);
    onDataChange?.(normalizedData);
  }, [carLoanDataHook.carLoans, onDataChange]);

  // 获取当前标准化数据
  const getNormalizedData = useCallback((): NormalizedDebtData => {
    const rawData = { 
      carLoans: carLoanDataHook.carLoans,
      getAggregatedData: carLoanDataHook.getAggregatedData
    };
    return normalizeCarLoanData(rawData);
  }, [carLoanDataHook.carLoans, carLoanDataHook.getAggregatedData]);

  return {
    // 原始hook的所有功能
    ...carLoanDataHook,
    // 标准化数据接口
    getNormalizedData
  };
}