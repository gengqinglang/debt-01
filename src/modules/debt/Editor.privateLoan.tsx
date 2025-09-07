// Unified debt editor component for private loan (民间贷)

import React from 'react';
import { SharedPrivateLoanModule } from '@/components/loan/SharedPrivateLoanModule';
import { useDebtPrivateLoan } from './useDebt.privateLoan';
import { adaptDebtInfoForSave } from '@/loan-core/normalize';

interface EditorPrivateLoanProps {
  existingData?: any;
  onDataChange?: (normalizedData: any) => void;
  onConfirm?: (confirmPayload: any) => void;
  children?: React.ReactNode;
}

export const EditorPrivateLoan: React.FC<EditorPrivateLoanProps> = ({
  existingData,
  onDataChange,
  onConfirm,
  children
}) => {
  const debtHook = useDebtPrivateLoan({
    existingData,
    onDataChange
  });

  const handleConfirm = () => {
    const normalizedData = debtHook.getNormalizedData();
    const confirmPayload = adaptDebtInfoForSave('privateLoan', normalizedData);
    onConfirm?.(confirmPayload);
  };

  // 创建适配的确认按钮
  const confirmButton = React.cloneElement(children as React.ReactElement, {
    onClick: handleConfirm
  });

  return (
    <SharedPrivateLoanModule
      existingData={existingData}
      privateLoans={debtHook.privateLoans}
      addPrivateLoan={debtHook.addPrivateLoan}
      removePrivateLoan={debtHook.removePrivateLoan}
      updatePrivateLoan={debtHook.updatePrivateLoan}
      updateRateFen={debtHook.updateRateFen}
      updateRateLi={debtHook.updateRateLi}
      isPrivateLoanComplete={debtHook.isPrivateLoanComplete}
    >
      {confirmButton}
    </SharedPrivateLoanModule>
  );
};