import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Trash2, Plus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ConsumerLoanInfo } from '@/hooks/useConsumerLoanData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { calculateEqualPaymentMonthly, calculateEqualPrincipalFirstMonthly, calculateLoanTermMonths, formatAmount } from '@/lib/loanCalculations';

interface ConsumerLoanCardProps {
  consumerLoan: ConsumerLoanInfo;
  index: number;
  updateConsumerLoan: (id: string, field: keyof ConsumerLoanInfo, value: string) => void;
  removeConsumerLoan: (id: string) => void;
  resetConsumerLoan: (id: string) => void;
  consumerLoansLength: number;
}

const ConsumerLoanCard: React.FC<ConsumerLoanCardProps> = ({
  consumerLoan,
  index,
  updateConsumerLoan,
  removeConsumerLoan,
  resetConsumerLoan,
  consumerLoansLength,
}) => {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // 等额本息/等额本金 月供计算
  const { requiredFilled, monthlyPayment } = (() => {
    if (consumerLoan.repaymentMethod !== 'equal-payment' && consumerLoan.repaymentMethod !== 'equal-principal') {
      return { requiredFilled: false, monthlyPayment: null as number | null };
    }
    const principalWan = parseFloat(consumerLoan.remainingPrincipal || '');
    const annualRatePct = parseFloat(consumerLoan.annualRate || '');
    const hasDates = Boolean(consumerLoan.startDate && consumerLoan.endDate);
    const hasPrincipal = !isNaN(principalWan) && principalWan > 0;
    const hasRate = !isNaN(annualRatePct) && annualRatePct > 0;
    const requiredFilled = hasDates && hasPrincipal && hasRate;
    if (!requiredFilled) return { requiredFilled, monthlyPayment: null };

    const principal = principalWan * 10000;
    const annualRate = annualRatePct / 100;
    const termMonths = calculateLoanTermMonths(consumerLoan.startDate, consumerLoan.endDate);
    if (termMonths <= 0) return { requiredFilled, monthlyPayment: null };
    const monthly = consumerLoan.repaymentMethod === 'equal-payment'
      ? calculateEqualPaymentMonthly(principal, annualRate, termMonths)
      : calculateEqualPrincipalFirstMonthly(principal, annualRate, termMonths);
    return { requiredFilled, monthlyPayment: monthly };
  })();

  // 先息后本/一次性还本付息 待还利息计算
  const pendingInterest = (() => {
    if (consumerLoan.repaymentMethod !== 'interest-first' && consumerLoan.repaymentMethod !== 'lump-sum') {
      return null;
    }
    const principalWan = parseFloat(consumerLoan.loanAmount || '');
    const annualRatePct = parseFloat(consumerLoan.annualRate || '');
    const hasEndDate = Boolean(consumerLoan.endDate);
    const hasPrincipal = !isNaN(principalWan) && principalWan > 0;
    const hasRate = !isNaN(annualRatePct) && annualRatePct > 0;
    
    if (!hasPrincipal || !hasRate || !hasEndDate) return null;
    
    const principal = principalWan * 10000;
    const annualRate = annualRatePct / 100;
    
    if (consumerLoan.repaymentMethod === 'interest-first') {
      // 先息后本：每月利息
      const monthlyInterest = (principal * annualRate) / 12;
      return monthlyInterest;
    } else {
      // 一次性还本付息：从开始日期到结束日期的利息
      const startDate = new Date(consumerLoan.startDate || '');
      const endDate = new Date(consumerLoan.endDate);
      const diffTime = endDate.getTime() - startDate.getTime();
      const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      const yearlyInterest = principal * annualRate;
      return (yearlyInterest * diffDays) / 365;
    }
  })();
  
  return (
    <div className="rounded-lg py-6 px-3 bg-white" style={{ border: '2px solid #CAF4F7' }}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-900">
          消费贷 {index + 1}
        </h4>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button 
              className="p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700"
              title={consumerLoansLength > 1 ? "删除此消费贷" : "清空此消费贷"}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {consumerLoansLength > 1 ? '确认删除' : '确认清空'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {consumerLoansLength > 1 
                  ? '您确定要删除这笔消费贷吗？此操作不可撤销。'
                  : '您确定要清空这笔消费贷信息吗？将恢复至默认值。'
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                if (consumerLoansLength > 1) {
                  removeConsumerLoan(consumerLoan.id);
                } else {
                  resetConsumerLoan(consumerLoan.id);
                }
              }}>
                {consumerLoansLength > 1 ? '确定删除' : '确定清空'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
                       disabled={(date) => {
                         // 贷款结束日期：今天 到 今天+50年
                         const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                         const today = new Date();
                         const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                         const maxDate = new Date(todayDate.getTime());
                         maxDate.setFullYear(maxDate.getFullYear() + 50);
                         return selectedDate.getTime() < todayDate.getTime() || selectedDate.getTime() > maxDate.getTime();
                       }}
                       initialFocus
                       captionLayout="dropdown"
                       fromYear={new Date().getFullYear()}
                       toYear={new Date().getFullYear() + 50}
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
            
            {/* 待还利息栏位 */}
            <div className="mt-5">
              <div className="space-y-2">
                <div className="rounded-lg p-3 bg-white border border-cyan-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2" style={{ color: '#01BCD6' }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#01BCD6' }}></div>
                      <span className="text-sm font-medium">{consumerLoan.repaymentMethod === 'interest-first' ? '每月利息' : '待还利息'}</span>
                    </div>
                     <div className="text-right" style={{ color: '#01BCD6' }}>
                       <div className="text-lg font-semibold">
                         {(() => {
                           // 检查必输项是否完整
                           const basicRequired = consumerLoan.repaymentMethod;
                           if (!basicRequired) return '--';
                           
                           if (consumerLoan.repaymentMethod === 'interest-first') {
                             // 先息后本必填项：剩余贷款本金 + 贷款结束日期 + 年化利率
                             const requiredFilled = consumerLoan.loanAmount && 
                                    consumerLoan.endDate && 
                                    consumerLoan.annualRate;
                             if (!requiredFilled) return '--';
                           } else if (consumerLoan.repaymentMethod === 'lump-sum') {
                             // 一次性还本付息必填项：贷款开始日期 + 贷款结束日期 + 剩余贷款本金 + 年化利率
                             const requiredFilled = consumerLoan.startDate && 
                                    consumerLoan.endDate && 
                                    consumerLoan.loanAmount && 
                                    consumerLoan.annualRate;
                             if (!requiredFilled) return '--';
                           }
                           
                           return pendingInterest !== null ? `¥${Math.round(pendingInterest).toLocaleString()}` : '--';
                         })()}
                       </div>
                     </div>
                  </div>
                </div>
              </div>
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
                       disabled={(date) => {
                         // 贷款开始日期：今天-50年 到 今天（不能选择未来日期）
                         const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                         const today = new Date();
                         const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                         const minDate = new Date(todayDate.getTime());
                         minDate.setFullYear(minDate.getFullYear() - 50);
                         return selectedDate.getTime() < minDate.getTime() || selectedDate.getTime() > todayDate.getTime();
                       }}
                       initialFocus
                       captionLayout="dropdown"
                       fromYear={1975}
                       toYear={new Date().getFullYear()}
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
                       disabled={(date) => {
                         // 贷款结束日期：今天 到 今天+50年
                         const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                         const today = new Date();
                         const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                         const maxDate = new Date(todayDate.getTime());
                         maxDate.setFullYear(maxDate.getFullYear() + 50);
                         return selectedDate.getTime() < todayDate.getTime() || selectedDate.getTime() > maxDate.getTime();
                       }}
                       initialFocus
                       captionLayout="dropdown"
                       fromYear={new Date().getFullYear()}
                       toYear={new Date().getFullYear() + 50}
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
            
            {/* 待还利息栏位 */}
            <div className="mt-5">
              <div className="space-y-2">
                <div className="rounded-lg p-3 bg-white border border-cyan-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2" style={{ color: '#01BCD6' }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#01BCD6' }}></div>
                       <span className="text-sm font-medium">待还利息</span>
                    </div>
                    <div className="text-right" style={{ color: '#01BCD6' }}>
                      <div className="text-lg font-semibold">
                        {pendingInterest !== null ? `¥${Math.round(pendingInterest).toLocaleString()}` : '--'}
                      </div>
                    </div>
                  </div>
                </div>
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
                       disabled={(date) => {
                         // 贷款开始日期：今天-50年 到 今天（不能选择未来日期）
                         const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                         const today = new Date();
                         const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                         const minDate = new Date(todayDate.getTime());
                         minDate.setFullYear(minDate.getFullYear() - 50);
                         return selectedDate.getTime() < minDate.getTime() || selectedDate.getTime() > todayDate.getTime();
                       }}
                       initialFocus
                       captionLayout="dropdown"
                       fromYear={1975}
                       toYear={new Date().getFullYear()}
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
                       disabled={(date) => {
                         // 贷款结束日期：今天 到 今天+50年
                         const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                         const today = new Date();
                         const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                         const maxDate = new Date(todayDate.getTime());
                         maxDate.setFullYear(maxDate.getFullYear() + 50);
                         return selectedDate.getTime() < todayDate.getTime() || selectedDate.getTime() > maxDate.getTime();
                       }}
                       initialFocus
                       captionLayout="dropdown"
                       fromYear={new Date().getFullYear()}
                       toYear={new Date().getFullYear() + 50}
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

              {(consumerLoan.repaymentMethod === 'equal-payment' || consumerLoan.repaymentMethod === 'equal-principal') && (
                <div className="mt-5">
                  <div className="space-y-2">
                    <div className="rounded-lg p-3 bg-white border border-cyan-500">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2" style={{ color: '#01BCD6' }}>
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#01BCD6' }}></div>
                          <span className="text-sm font-medium">月供金额</span>
                        </div>
                        <div className="text-right" style={{ color: '#01BCD6' }}>
                          <div className="text-lg font-semibold">
                            {(() => {
                              // 检查必输项是否完整
                              const requiredFilled = consumerLoan.remainingPrincipal && 
                                     consumerLoan.startDate && 
                                     consumerLoan.endDate && 
                                     consumerLoan.annualRate;
                              
                              if (!requiredFilled) return '--';
                              return monthlyPayment !== null ? `¥${Math.round(monthlyPayment).toLocaleString()}` : '--';
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
  resetConsumerLoan: (id: string) => void;
  updateConsumerLoan: (id: string, field: keyof ConsumerLoanInfo, value: string) => void;
  isConsumerLoanComplete: (consumerLoan: ConsumerLoanInfo) => boolean;
}

export const SharedConsumerLoanModule: React.FC<SharedConsumerLoanModuleProps> = ({ 
  children, 
  existingData,
  consumerLoans,
  addConsumerLoan,
  removeConsumerLoan,
  resetConsumerLoan,
  updateConsumerLoan,
  isConsumerLoanComplete
}) => {
  // 自动添加空白卡片
  useEffect(() => {
    const hasExistingData = existingData && existingData.length > 0;
    const hasCurrentData = consumerLoans && consumerLoans.length > 0;
    
    if (!hasExistingData && !hasCurrentData) {
      addConsumerLoan();
    }
  }, [existingData, addConsumerLoan]);

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
            resetConsumerLoan={resetConsumerLoan}
            consumerLoansLength={consumerLoans.length}
          />
        </div>
      ))}

      {/* 按钮区域 - 左侧"再录一笔" + 右侧确认按钮 */}
      <div className="grid grid-cols-2 gap-3 mt-6 mb-3">
        {/* 左侧：再录一笔（虚线边框，青色） */}
        <Button
          onClick={addConsumerLoan}
          variant="outline"
          className="h-10 border-dashed text-sm"
          style={{ borderColor: '#01BCD6', color: '#01BCD6' }}
        >
          <Plus className="w-3 h-3 mr-2" />
          再录一笔
        </Button>

        {/* 右侧：确认消费贷信息（传入的children） */}
        <div className="w-full">
          {children}
        </div>
      </div>
    </>
  );
};