import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Trash2, Plus } from 'lucide-react';
import { ConsumerLoanInfo } from '@/hooks/useConsumerLoanData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface ConsumerLoanCardProps {
  consumerLoan: ConsumerLoanInfo;
  index: number;
  updateConsumerLoan: (id: string, field: keyof ConsumerLoanInfo, value: string) => void;
  removeConsumerLoan: (id: string) => void;
  consumerLoansLength: number;
}

const ConsumerLoanCard: React.FC<ConsumerLoanCardProps> = ({
  consumerLoan,
  index,
  updateConsumerLoan,
  removeConsumerLoan,
  consumerLoansLength,
}) => {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  
  return (
    <div className="rounded-lg py-6 px-3 bg-white" style={{ border: '2px solid #CAF4F7' }}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-900">
          消费贷 {index + 1}
        </h4>
        {consumerLoansLength > 1 && (
          <button 
            onClick={() => removeConsumerLoan(consumerLoan.id)}
            className="p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700"
            title="删除此消费贷"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      
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
                        "h-9 w-full justify-start text-left font-normal",
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
            <div>
              <Label className="text-xs font-medium">
                年化利率（%） <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]*"
                step="0.01"
                placeholder="如：6.5"
                value={consumerLoan.annualRate}
                onChange={(e) => updateConsumerLoan(consumerLoan.id, 'annualRate', e.target.value)}
                className="h-9 text-sm mt-1"
              />
            </div>
          </>
        ) : consumerLoan.repaymentMethod === 'lump-sum' ? (
          /* 一次性还本付息：按照用户要求的布局 */
          <>
            {/* 第二行：贷款开始日期 + 贷款结束日期 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium">
                  贷款开始日期 <span className="text-red-500">*</span>
                </Label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 w-full justify-start text-left font-normal",
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
              <div>
                <Label className="text-xs font-medium">
                  贷款结束日期 <span className="text-red-500">*</span>
                </Label>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 w-full justify-start text-left font-normal",
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
            
            {/* 第三行：剩余贷款本金 + 年化利率 */}
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
                  年化利率（%） <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  pattern="[0-9]*\.?[0-9]*"
                  step="0.01"
                  placeholder="如：6.5"
                  value={consumerLoan.annualRate}
                  onChange={(e) => updateConsumerLoan(consumerLoan.id, 'annualRate', e.target.value)}
                  className="h-9 text-sm mt-1"
                />
              </div>
            </div>
          </>
        ) : (
          /* 等额本息/等额本金：新的字段布局 */
          <>
            {/* 贷款原始金额 + 贷款剩余本金 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium">
                  贷款原始金额（万元）
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
                  贷款剩余本金（万元） <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  placeholder="如：8"
                  value={consumerLoan.remainingPrincipal || ''}
                  onChange={(e) => updateConsumerLoan(consumerLoan.id, 'remainingPrincipal', e.target.value)}
                  className="h-9 text-sm mt-1"
                />
              </div>
            </div>
            
            {/* 贷款开始日期 + 贷款结束日期 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium">
                  贷款开始日期 <span className="text-red-500">*</span>
                </Label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 w-full justify-start text-left font-normal",
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
              <div>
                <Label className="text-xs font-medium">
                  贷款结束日期 <span className="text-red-500">*</span>
                </Label>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 w-full justify-start text-left font-normal",
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
            
            {/* 贷款利率 */}
            <div>
              <Label className="text-xs font-medium">
                贷款利率（%） <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]*"
                step="0.01"
                placeholder="如：6.5"
                value={consumerLoan.annualRate}
                onChange={(e) => updateConsumerLoan(consumerLoan.id, 'annualRate', e.target.value)}
                className="h-9 text-sm mt-1"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface SharedConsumerLoanModuleProps {
  children: React.ReactNode;
  existingData?: any;
  consumerLoans: ConsumerLoanInfo[];
  addConsumerLoan: () => void;
  removeConsumerLoan: (id: string) => void;
  updateConsumerLoan: (id: string, field: keyof ConsumerLoanInfo, value: string) => void;
  isConsumerLoanComplete: (consumerLoan: ConsumerLoanInfo) => boolean;
}

export const SharedConsumerLoanModule: React.FC<SharedConsumerLoanModuleProps> = ({ 
  children, 
  existingData,
  consumerLoans,
  addConsumerLoan,
  removeConsumerLoan,
  updateConsumerLoan,
  isConsumerLoanComplete
}) => {
  return (
    <>
      {/* 消费贷列表 */}
      {consumerLoans.map((consumerLoan, index) => (
        <div key={consumerLoan.id} className="mb-4">
          <ConsumerLoanCard
            consumerLoan={consumerLoan}
            index={index}
            updateConsumerLoan={updateConsumerLoan}
            removeConsumerLoan={removeConsumerLoan}
            consumerLoansLength={consumerLoans.length}
          />
        </div>
      ))}

      {/* 按钮区域 - 只显示确认按钮，不显示"再录一笔" */}
      <div className="mt-6 mb-3">
        {children}
      </div>
    </>
  );
};