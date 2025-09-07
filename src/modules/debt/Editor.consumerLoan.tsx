// Unified debt editor component for consumer loan (消费贷)

import React from 'react';
import { SharedConsumerLoanModule } from '@/components/loan/SharedConsumerLoanModule';
import { useDebtConsumerLoan } from './useDebt.consumerLoan';
import { adaptDebtInfoForSave } from '@/loan-core/normalize';

interface EditorConsumerLoanProps {
  existingData?: any;
  onDataChange?: (normalizedData: any) => void;
  onConfirm?: (confirmPayload: any) => void;
  children?: React.ReactNode;
}

export const EditorConsumerLoan: React.FC<EditorConsumerLoanProps> = ({
  existingData,
  onDataChange,
  onConfirm,
  children
}) => {
  const debtHook = useDebtConsumerLoan({
    existingData,
    onDataChange
  });

  const handleConfirm = () => {
    const normalizedData = debtHook.getNormalizedData();
    const confirmPayload = adaptDebtInfoForSave('consumerLoan', normalizedData);
    onConfirm?.(confirmPayload);
  };

  // 创建适配的确认按钮
  const confirmButton = React.cloneElement(children as React.ReactElement, {
    onClick: handleConfirm
  });

  return (
    <SharedConsumerLoanModule
      existingData={existingData}
      consumerLoans={debtHook.consumerLoans}
      addConsumerLoan={debtHook.addConsumerLoan}
      removeConsumerLoan={debtHook.removeConsumerLoan}
      updateConsumerLoan={debtHook.updateConsumerLoan}
      isConsumerLoanComplete={debtHook.isConsumerLoanComplete}
    >
      {confirmButton}
    </SharedConsumerLoanModule>
  );
};