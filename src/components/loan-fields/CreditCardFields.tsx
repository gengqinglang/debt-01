import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCardInfo } from '@/hooks/useCreditCardData';

interface CreditCardFieldsProps {
  creditCard: CreditCardInfo;
  updateCreditCard: (id: string, field: keyof CreditCardInfo, value: string) => void;
}

export const CreditCardFields: React.FC<CreditCardFieldsProps> = ({
  creditCard,
  updateCreditCard,
}) => {
  return (
    <div className="space-y-4">
      {/* 第一行：信用卡名称 */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label className="text-xs font-medium">
            信用卡名称
          </Label>
          <Input
            type="text"
            placeholder="如：招商银行信用卡"
            value={creditCard.name || ''}
            onChange={(e) => updateCreditCard(creditCard.id, 'name', e.target.value)}
            className="h-9 text-sm mt-1"
          />
        </div>
      </div>

      {/* 第二行：本期待还金额 + 未出账单金额 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-medium">
            本期待还金额（元） <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            inputMode="decimal"
            pattern="[0-9]*"
            placeholder="如：5000"
            value={creditCard.currentAmount}
            onChange={(e) => updateCreditCard(creditCard.id, 'currentAmount', e.target.value)}
            className="h-9 text-sm mt-1"
          />
        </div>
        <div>
          <Label className="text-xs font-medium">
            未出账单金额（元）
          </Label>
          <Input
            type="number"
            inputMode="decimal"
            pattern="[0-9]*"
            placeholder="如：2000"
            value={creditCard.unbilledAmount}
            onChange={(e) => updateCreditCard(creditCard.id, 'unbilledAmount', e.target.value)}
            className="h-9 text-sm mt-1"
          />
        </div>
      </div>
    </div>
  );
};