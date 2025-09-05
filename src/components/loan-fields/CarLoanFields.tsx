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
import { CarLoanInfo } from '@/hooks/useCarLoanData';

interface CarLoanFieldsProps {
  carLoan: CarLoanInfo;
  updateCarLoan: (id: string, field: keyof CarLoanInfo, value: string) => void;
}

export const CarLoanFields: React.FC<CarLoanFieldsProps> = ({
  carLoan,
  updateCarLoan,
}) => {
  const [endDateOpen, setEndDateOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* 第一行：车辆名称 + 贷款类型 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-medium">
            车辆名称 <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            placeholder="如：奔驰E200L"
            value={carLoan.vehicleName}
            onChange={(e) => updateCarLoan(carLoan.id, 'vehicleName', e.target.value)}
            className="h-9 text-sm mt-1"
          />
        </div>
        <div>
          <Label className="text-xs font-medium">
            贷款类型 <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={carLoan.loanType} 
            onValueChange={(value) => updateCarLoan(carLoan.id, 'loanType', value)}
          >
            <SelectTrigger className="h-9 text-sm mt-1">
              <SelectValue placeholder="选择贷款类型" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="bank">银行贷款</SelectItem>
              <SelectItem value="finance">金融公司</SelectItem>
              <SelectItem value="lease">融资租赁</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 第二行：分期金额 + 月供 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-medium">
            分期金额（万元） <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            inputMode="decimal"
            pattern="[0-9]*"
            placeholder="如：30"
            value={carLoan.installmentAmount}
            onChange={(e) => updateCarLoan(carLoan.id, 'installmentAmount', e.target.value)}
            className="h-9 text-sm mt-1"
          />
        </div>
        <div>
          <Label className="text-xs font-medium">
            剩余期数（月） <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            inputMode="decimal"
            pattern="[0-9]*"
            placeholder="如：36"
            value={carLoan.remainingInstallments}
            onChange={(e) => updateCarLoan(carLoan.id, 'remainingInstallments', e.target.value)}
            className="h-9 text-sm mt-1"
          />
        </div>
      </div>

      {/* 第三行：贷款开始日期 + 贷款结束日期 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-medium">
            贷款开始日期
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-9 w-full justify-start text-left font-normal mt-1",
                  !carLoan.startDateMonth && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {carLoan.startDateMonth ? carLoan.startDateMonth : "选择日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
              <Calendar
                mode="single"
                selected={carLoan.startDateMonth ? new Date(carLoan.startDateMonth) : undefined}
                onSelect={(date) => {
                  updateCarLoan(carLoan.id, 'startDateMonth', date ? format(date, "yyyy-MM-dd") : '');
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
            贷款结束日期
          </Label>
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-9 w-full justify-start text-left font-normal mt-1",
                  !carLoan.endDateMonth && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {carLoan.endDateMonth ? carLoan.endDateMonth : "选择日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
              <Calendar
                mode="single"
                selected={carLoan.endDateMonth ? new Date(carLoan.endDateMonth) : undefined}
                onSelect={(date) => {
                  updateCarLoan(carLoan.id, 'endDateMonth', date ? format(date, "yyyy-MM-dd") : '');
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

      {/* 第四行：年化利率 + 还款方式 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-medium">
            年化利率（%）
          </Label>
          <Input
            type="number"
            inputMode="decimal"
            pattern="[0-9]*"
            placeholder="如：6.8"
            value={carLoan.interestRate || ''}
            onChange={(e) => updateCarLoan(carLoan.id, 'interestRate', e.target.value)}
            className="h-9 text-sm mt-1"
          />
        </div>
        <div>
          <Label className="text-xs font-medium">
            还款方式
          </Label>
          <Select 
            value={carLoan.repaymentMethod || ''} 
            onValueChange={(value) => updateCarLoan(carLoan.id, 'repaymentMethod', value)}
          >
            <SelectTrigger className="h-9 text-sm mt-1">
              <SelectValue placeholder="选择还款方式" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="equal-payment">等额本息</SelectItem>
              <SelectItem value="equal-principal">等额本金</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};