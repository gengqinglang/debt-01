// Unified debt editor component for business loan (经营贷)

import React from 'react';
import { SharedBusinessLoanModule } from '@/components/loan/SharedBusinessLoanModule';
import { useDebtBusinessLoan } from './useDebt.businessLoan';
import { adaptDebtInfoForSave } from '@/loan-core/normalize';

interface EditorBusinessLoanProps {
  existingData?: any;
  onDataChange?: (normalizedData: any) => void;
  onConfirm?: (confirmPayload: any) => void;
  children?: React.ReactNode;
}

export const EditorBusinessLoan: React.FC<EditorBusinessLoanProps> = ({
  existingData,
  onDataChange,
  onConfirm,
  children
}) => {
  const debtHook = useDebtBusinessLoan({
    existingData,
    onDataChange
  });

  const handleConfirm = () => {
    const normalizedData = debtHook.getNormalizedData();
    const confirmPayload = adaptDebtInfoForSave('businessLoan', normalizedData);
    onConfirm?.(confirmPayload);
  };

  // 创建适配的确认按钮
  const confirmButton = React.cloneElement(children as React.ReactElement, {
    onClick: handleConfirm
  });

  return (
    <SharedBusinessLoanModule
      existingData={existingData}
      businessLoans={debtHook.businessLoans}
      addBusinessLoan={debtHook.addBusinessLoan}
      removeBusinessLoan={debtHook.removeBusinessLoan}
      updateBusinessLoan={debtHook.updateBusinessLoan}
      isBusinessLoanComplete={debtHook.isBusinessLoanComplete}
    >
      {confirmButton}
    </SharedBusinessLoanModule>
  );
};