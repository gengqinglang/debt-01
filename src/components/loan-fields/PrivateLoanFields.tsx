import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { PrivateLoanInfo } from '@/hooks/usePrivateLoanData';

interface PrivateLoanFieldsProps {
  privateLoan: PrivateLoanInfo;
  updatePrivateLoan: (id: string, field: keyof PrivateLoanInfo, value: string) => void;
}

export const PrivateLoanFields: React.FC<PrivateLoanFieldsProps> = ({
  privateLoan,
  updatePrivateLoan,
}) => {
  const [endDateOpen, setEndDateOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* 第一行：出借人 + 剩余贷款本金 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-medium">
            出借人
          </Label>
          <Input
            type="text"
            placeholder="如：张三"
            value={privateLoan.name || ''}
            onChange={(e) => updatePrivateLoan(privateLoan.id, 'name', e.target.value)}
            className="h-9 text-sm mt-1"
          />
        </div>
        <div>
          <Label className="text-xs font-medium">
            剩余贷款本金（万元） <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            inputMode="decimal"
            pattern="[0-9]*"
            placeholder="如：50"
            value={privateLoan.loanAmount}
            onChange={(e) => updatePrivateLoan(privateLoan.id, 'loanAmount', e.target.value)}
            className="h-9 text-sm mt-1"
          />
        </div>
      </div>

      {/* 第二行：贷款结束日期 + 年化利率 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-medium">
            年化利率（%） <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            inputMode="decimal"
            pattern="[0-9]*"
            placeholder="如：12"
            value={privateLoan.annualRate}
            onChange={(e) => updatePrivateLoan(privateLoan.id, 'annualRate', e.target.value)}
            className="h-9 text-sm mt-1"
          />
        </div>
        <div>
          <Label className="text-xs font-medium">
            分利率
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              inputMode="decimal"
              pattern="[0-9]*"
              placeholder="分"
              value={privateLoan.rateFen}
              onChange={(e) => updatePrivateLoan(privateLoan.id, 'rateFen', e.target.value)}
              className="h-9 text-sm mt-1"
            />
            <Input
              type="number"
              inputMode="decimal"
              pattern="[0-9]*"
              placeholder="厘"
              value={privateLoan.rateLi}
              onChange={(e) => updatePrivateLoan(privateLoan.id, 'rateLi', e.target.value)}
              className="h-9 text-sm mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};