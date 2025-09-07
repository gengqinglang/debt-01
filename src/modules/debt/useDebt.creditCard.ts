// Unified debt hook for credit card (信用卡)

import { useState, useEffect, useCallback } from 'react';
import { useCreditCardData } from '@/hooks/useCreditCardData';
import { normalizeCreditCardData } from '@/loan-core/normalize';
import { NormalizedDebtData } from '@/loan-core/types';

export interface UseDebtCreditCardOptions {
  existingData?: any;
  onDataChange?: (normalizedData: NormalizedDebtData) => void;
}

export function useDebtCreditCard({ existingData, onDataChange }: UseDebtCreditCardOptions = {}) {
  const creditCardDataHook = useCreditCardData(existingData?.creditCards);

  // 监听数据变化并标准化
  useEffect(() => {
    const rawData = { 
      creditCards: creditCardDataHook.creditCards,
      getAggregatedData: creditCardDataHook.getAggregatedData
    };
    const normalizedData = normalizeCreditCardData(rawData);
    onDataChange?.(normalizedData);
  }, [creditCardDataHook.creditCards, onDataChange]);

  // 获取当前标准化数据
  const getNormalizedData = useCallback((): NormalizedDebtData => {
    const rawData = { 
      creditCards: creditCardDataHook.creditCards,
      getAggregatedData: creditCardDataHook.getAggregatedData
    };
    return normalizeCreditCardData(rawData);
  }, [creditCardDataHook.creditCards, creditCardDataHook.getAggregatedData]);

  return {
    // 原始hook的所有功能
    ...creditCardDataHook,
    // 标准化数据接口
    getNormalizedData
  };
}