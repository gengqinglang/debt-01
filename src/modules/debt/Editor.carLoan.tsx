// Unified debt editor component for car loan (车贷)

import React from 'react';
import { SharedCarLoanModule } from '@/components/loan/SharedCarLoanModule';
import { useDebtCarLoan } from './useDebt.carLoan';
import { adaptDebtInfoForSave } from '@/loan-core/normalize';

interface EditorCarLoanProps {
  existingData?: any;
  onDataChange?: (normalizedData: any) => void;
  onConfirm?: (confirmPayload: any) => void;
  children?: React.ReactNode;
}

export const EditorCarLoan: React.FC<EditorCarLoanProps> = ({
  existingData,
  onDataChange,
  onConfirm,
  children
}) => {
  const debtHook = useDebtCarLoan({
    existingData,
    onDataChange
  });

  const handleConfirm = () => {
    const normalizedData = debtHook.getNormalizedData();
    const confirmPayload = adaptDebtInfoForSave('carLoan', normalizedData);
    onConfirm?.(confirmPayload);
  };

  // 创建适配的确认按钮
  const confirmButton = React.cloneElement(children as React.ReactElement, {
    onClick: handleConfirm
  });

  return (
    <SharedCarLoanModule
      existingData={existingData}
      carLoans={debtHook.carLoans}
      addCarLoan={debtHook.addCarLoan}
      removeCarLoan={debtHook.removeCarLoan}
      updateCarLoan={debtHook.updateCarLoan}
      isCarLoanComplete={debtHook.isCarLoanComplete}
    >
      {confirmButton}
    </SharedCarLoanModule>
  );
};