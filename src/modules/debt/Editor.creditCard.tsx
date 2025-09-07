// Unified debt editor component for credit card (信用卡)

import React from 'react';
import { SharedCreditCardModule } from '@/components/loan/SharedCreditCardModule';
import { useDebtCreditCard } from './useDebt.creditCard';
import { adaptDebtInfoForSave } from '@/loan-core/normalize';

interface EditorCreditCardProps {
  existingData?: any;
  onDataChange?: (normalizedData: any) => void;
  onConfirm?: (confirmPayload: any) => void;
  children?: React.ReactNode;
}

export const EditorCreditCard: React.FC<EditorCreditCardProps> = ({
  existingData,
  onDataChange,
  onConfirm,
  children
}) => {
  const debtHook = useDebtCreditCard({
    existingData,
    onDataChange
  });

  const handleConfirm = () => {
    const normalizedData = debtHook.getNormalizedData();
    const confirmPayload = adaptDebtInfoForSave('creditCard', normalizedData);
    onConfirm?.(confirmPayload);
  };

  // 创建适配的确认按钮
  const confirmButton = React.cloneElement(children as React.ReactElement, {
    onClick: handleConfirm
  });

  return (
    <SharedCreditCardModule
      existingData={existingData}
      creditCards={debtHook.creditCards}
      addCreditCard={debtHook.addCreditCard}
      removeCreditCard={debtHook.removeCreditCard}
      updateCreditCard={debtHook.updateCreditCard}
      isCreditCardComplete={debtHook.isCreditCardComplete}
    >
      {confirmButton}
    </SharedCreditCardModule>
  );
};