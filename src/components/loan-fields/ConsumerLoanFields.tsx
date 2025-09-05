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
import { ConsumerLoanInfo } from '@/hooks/useConsumerLoanData';

interface ConsumerLoanFieldsProps {
  consumerLoan: ConsumerLoanInfo;
  updateConsumerLoan: (id: string, field: keyof ConsumerLoanInfo, value: string) => void;
}

export const ConsumerLoanFields: React.FC<ConsumerLoanFieldsProps> = ({
  consumerLoan,
  updateConsumerLoan,
}) => {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* 名称和还款方式在一行 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-medium">
            名称
          </Label>
          <Input
            type="text"
            placeholder="如：招商银行"
            value={consumerLoan.name || ''}
            onChange={(e) => updateConsumerLoan(consumerLoan.id, 'name', e.target.value)}
            className="h-9 text-sm mt-1"
          />
        </div>
        <div>
          <Label className="text-xs font-medium">
            还款方式 <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={consumerLoan.repaymentMethod} 
            onValueChange={(value) => updateConsumerLoan(consumerLoan.id, 'repaymentMethod', value)}
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
      {consumerLoan.repaymentMethod === 'interest-first' ? (
        /* 先息后本：剩余贷款本金 + 贷款结束日期在一行，然后年化利率在下面 */
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
                placeholder="如：10"
                value={consumerLoan.loanAmount}
                onChange={(e) => updateConsumerLoan(consumerLoan.id, 'loanAmount', e.target.value)}
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
                      !consumerLoan.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {consumerLoan.endDate ? format(new Date(consumerLoan.endDate), "yyyy-MM-dd") : "选择日期"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={consumerLoan.endDate ? new Date(consumerLoan.endDate) : undefined}
                    onSelect={(date) => {
                      updateConsumerLoan(consumerLoan.id, 'endDate', date ? format(date, "yyyy-MM-dd") : '');
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
                placeholder="如：8.5"
                value={consumerLoan.annualRate}
                onChange={(e) => updateConsumerLoan(consumerLoan.id, 'annualRate', e.target.value)}
                className="h-9 text-sm mt-1"
              />
            </div>
          </div>
        </>
      ) : consumerLoan.repaymentMethod === 'lump-sum' ? (
        /* 一次性还本付息：贷款金额 + 贷款开始日期在一行，贷款结束日期 + 年化利率在下一行 */
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-medium">
                贷款金额（万元） <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                inputMode="decimal"
                pattern="[0-9]*"
                placeholder="如：10"
                value={consumerLoan.loanAmount}
                onChange={(e) => updateConsumerLoan(consumerLoan.id, 'loanAmount', e.target.value)}
                className="h-9 text-sm mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">
                贷款开始日期 <span className="text-red-500">*</span>
              </Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-9 w-full justify-start text-left font-normal mt-1",
                      !consumerLoan.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {consumerLoan.startDate ? format(new Date(consumerLoan.startDate), "yyyy-MM-dd") : "选择日期"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={consumerLoan.startDate ? new Date(consumerLoan.startDate) : undefined}
                    onSelect={(date) => {
                      updateConsumerLoan(consumerLoan.id, 'startDate', date ? format(date, "yyyy-MM-dd") : '');
                      setStartDateOpen(false);
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
          <div className="grid grid-cols-2 gap-4">
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
                      !consumerLoan.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {consumerLoan.endDate ? format(new Date(consumerLoan.endDate), "yyyy-MM-dd") : "选择日期"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={consumerLoan.endDate ? new Date(consumerLoan.endDate) : undefined}
                    onSelect={(date) => {
                      updateConsumerLoan(consumerLoan.id, 'endDate', date ? format(date, "yyyy-MM-dd") : '');
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
            <div>
              <Label className="text-xs font-medium">
                年化利率（%） <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                inputMode="decimal"
                pattern="[0-9]*"
                placeholder="如：8.5"
                value={consumerLoan.annualRate}
                onChange={(e) => updateConsumerLoan(consumerLoan.id, 'annualRate', e.target.value)}
                className="h-9 text-sm mt-1"
              />
            </div>
          </div>
        </>
      ) : (
        /* 等额本息/等额本金：剩余贷款本金 + 贷款结束日期在一行，年化利率 + 月供在下一行 */
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
                placeholder="如：10"
                value={consumerLoan.loanAmount}
                onChange={(e) => updateConsumerLoan(consumerLoan.id, 'loanAmount', e.target.value)}
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
                      !consumerLoan.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {consumerLoan.endDate ? format(new Date(consumerLoan.endDate), "yyyy-MM-dd") : "选择日期"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={consumerLoan.endDate ? new Date(consumerLoan.endDate) : undefined}
                    onSelect={(date) => {
                      updateConsumerLoan(consumerLoan.id, 'endDate', date ? format(date, "yyyy-MM-dd") : '');
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-medium">
                年化利率（%） <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                inputMode="decimal"
                pattern="[0-9]*"
                placeholder="如：8.5"
                value={consumerLoan.annualRate}
                onChange={(e) => updateConsumerLoan(consumerLoan.id, 'annualRate', e.target.value)}
                className="h-9 text-sm mt-1"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};