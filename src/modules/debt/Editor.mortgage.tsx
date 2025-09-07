// Unified debt editor component for mortgage (房贷)

import React from 'react';
import { FSSharedLoanModule } from '@/components/loan-fs/FSSharedLoanModule';
import { useDebtMortgage } from './useDebt.mortgage';
import { adaptDebtInfoForSave } from '@/loan-core/normalize';

interface EditorMortgageProps {
  existingData?: any;
  onDataChange?: (normalizedData: any) => void;
  onConfirm?: (confirmPayload: any) => void;
  children?: React.ReactNode;
}

export const EditorMortgage: React.FC<EditorMortgageProps> = ({
  existingData,
  onDataChange,
  onConfirm,
  children
}) => {
  const debtHook = useDebtMortgage({
    existingData,
    onDataChange
  });

  const handleConfirm = () => {
    const normalizedData = debtHook.getNormalizedData();
    const confirmPayload = adaptDebtInfoForSave('mortgage', normalizedData);
    onConfirm?.(confirmPayload);
  };

  // 创建适配的确认按钮
  const confirmButton = React.cloneElement(children as React.ReactElement, {
    onClick: handleConfirm
  });

  return (
    <FSSharedLoanModule
      // 传入所有必需的计算函数（这些需要从父组件传入或使用默认实现）
      calculateLoanStats={() => ({})}
      isLoanComplete={() => false}
      calculateMonthlyPayment={() => 0}
      currentLPR_5Year={4.2}
      currentLPR_5YearPlus={4.6}
      isCommercialLoanComplete={() => false}
      isProvidentLoanComplete={() => false}
      calculateCommercialMonthlyPayment={() => 0}
      calculateProvidentMonthlyPayment={() => 0}
      calculateCommercialLoanStats={() => ({})}
      calculateProvidentLoanStats={() => ({})}
      existingData={existingData?.loans}
      onLoansChange={(loans) => {
        debtHook.updateAggregatedData({ loans });
      }}
    >
      {confirmButton}
    </FSSharedLoanModule>
  );
};