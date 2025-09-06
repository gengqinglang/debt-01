import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { PrivateLoanInfo } from '@/hooks/usePrivateLoanData';
import { calculateEqualPaymentMonthly, calculateEqualPrincipalFirstMonthly, calculateLoanTermMonths, formatAmount } from '@/lib/loanCalculations';

interface PrivateLoanFieldsProps {
  privateLoan: PrivateLoanInfo;
  updatePrivateLoan: (id: string, field: keyof PrivateLoanInfo, value: string) => void;
}

export const PrivateLoanFields: React.FC<PrivateLoanFieldsProps> = ({
  privateLoan,
  updatePrivateLoan,
}) => {
  const [endDateOpen, setEndDateOpen] = useState(false);

  // 计算月供
  const calculateMonthlyPayment = (): number | null => {
    if (!privateLoan.loanAmount || !privateLoan.endDate || !privateLoan.annualRate) {
      return null;
    }

    const principal = parseFloat(privateLoan.loanAmount) * 10000; // 万元转元
    const annualRate = parseFloat(privateLoan.annualRate) / 100;
    const startDate = privateLoan.startDate || new Date().toISOString().split('T')[0];
    const termMonths = calculateLoanTermMonths(startDate, privateLoan.endDate);

    if (principal <= 0 || annualRate < 0 || termMonths <= 0) {
      return null;
    }

    switch (privateLoan.repaymentMethod) {
      case 'equal-payment':
        return calculateEqualPaymentMonthly(principal, annualRate, termMonths);
      case 'equal-principal':
        return calculateEqualPrincipalFirstMonthly(principal, annualRate, termMonths);
      default:
        return null;
    }
  };

  const monthlyPayment = calculateMonthlyPayment();

  return (
    <div className="space-y-4">
      {/* 第一行：出借人 + 还款方式 */}
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
            还款方式 <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={privateLoan.repaymentMethod} 
            onValueChange={(value) => updatePrivateLoan(privateLoan.id, 'repaymentMethod', value)}
          >
            <SelectTrigger className="h-9 text-sm mt-1">
              <SelectValue placeholder="选择还款方式" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="interest-first">先息后本</SelectItem>
              <SelectItem value="lump-sum">一次性还本付息</SelectItem>
              <SelectItem value="equal-payment">等额本息</SelectItem>
              <SelectItem value="equal-principal">等额本金</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 根据还款方式显示不同的字段布局 */}
      {privateLoan.repaymentMethod === 'interest-first' ? (
        /* 先息后本：剩余贷款本金在第一行，年化利率和分利率在第二行 */
        <>
          <div className="grid grid-cols-1 gap-4">
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
        </>
      ) : privateLoan.repaymentMethod === 'lump-sum' ? (
        /* 一次性还本付息：剩余贷款本金在第一行，年化利率和分利率在第二行 */
        <>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label className="text-xs font-medium">
                贷款金额（万元） <span className="text-red-500">*</span>
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
        </>
      ) : (
        /* 等额本息/等额本金：剩余贷款本金 + 贷款结束日期在一行，年化利率在下一行 */
        <>
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <Label className="text-xs font-medium">
                贷款结束日期 <span className="text-red-500">*</span>
              </Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-9 w-full justify-start text-left font-normal mt-1",
                      !privateLoan.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {privateLoan.endDate ? format(new Date(privateLoan.endDate), "yyyy-MM-dd") : "选择日期"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={privateLoan.endDate ? new Date(privateLoan.endDate) : undefined}
                    onSelect={(date) => {
                      updatePrivateLoan(privateLoan.id, 'endDate', date ? format(date, "yyyy-MM-dd") : '');
                      setEndDateOpen(false);
                    }}
                    initialFocus
                    captionLayout="dropdown"
                    fromYear={1990}
                    toYear={2050}
                    locale={zhCN}
                    classNames={{ 
                      caption_label: "hidden", 
                      nav: "hidden",
                      caption_dropdowns: "flex justify-between w-full",
                      dropdown: "min-w-[120px] w-[120px]"
                    }}
                    className={cn("p-3 pointer-events-auto w-full")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
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
          </div>
          {/* 月供显示 */}
          {(privateLoan.repaymentMethod === 'equal-payment' || privateLoan.repaymentMethod === 'equal-principal') && monthlyPayment && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800">
                  {privateLoan.repaymentMethod === 'equal-payment' ? '等额本息月供' : '等额本金首期月供'}
                </span>
                <span className="text-lg font-bold text-blue-900">
                  {formatAmount(monthlyPayment)}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};