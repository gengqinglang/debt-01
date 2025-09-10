import React, { useState, useEffect, useId, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { Home, Car, CreditCard, ShoppingCart, Check, Edit, CalendarIcon, Percent, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useLoanData, LoanInfo } from '@/hooks/useLoanData';
import { FSSharedLoanModule } from '@/components/loan-fs/FSSharedLoanModule';
import { useCarLoanData } from '@/hooks/useCarLoanData';
import { SharedCarLoanModule } from '@/components/loan/SharedCarLoanModule';
import { useConsumerLoanData } from '@/hooks/useConsumerLoanData';
import { SharedConsumerLoanModule } from '@/components/loan/SharedConsumerLoanModule';
import { useBusinessLoanData } from '@/hooks/useBusinessLoanData';
import { SharedBusinessLoanModule } from '@/components/loan/SharedBusinessLoanModule';
import { usePrivateLoanData } from '@/hooks/usePrivateLoanData';
import { SharedPrivateLoanModule } from '@/components/loan/SharedPrivateLoanModule';
import { useCreditCardData } from '@/hooks/useCreditCardData';
import { SharedCreditCardModule } from '@/components/loan/SharedCreditCardModule';

interface DebtConfigurationProps {
  category: any;
  onConfirm: (categoryId: string, data: any) => void;
  onDataChange?: (categoryId: string, liveData: any) => void; // 新增实时数据回调
  isConfirmed: boolean;
  existingData?: any;
}

// LoanFormCard component
const LoanFormCard: React.FC<{
  loan: LoanInfo;
  index: number;
  updateLoan: (id: string, field: keyof LoanInfo, value: string) => void;
  removeLoan: (id: string) => void;
  resetLoan: (id: string) => void;
  loansLength: number;
  isLoanComplete: (loan: LoanInfo) => boolean;
  calculateMonthlyPayment: (loan: LoanInfo) => number;
  currentLPR_5Year: number;
  currentLPR_5YearPlus: number;
  isCommercialLoanComplete: (loan: LoanInfo) => boolean;
  isProvidentLoanComplete: (loan: LoanInfo) => boolean;
  calculateCommercialMonthlyPayment: (loan: LoanInfo) => number;
  calculateProvidentMonthlyPayment: (loan: LoanInfo) => number;
  calculateLoanStats: (loan: LoanInfo) => any;
}> = ({
  loan,
  index,
  updateLoan,
  removeLoan,
  resetLoan,
  loansLength,
  isLoanComplete,
  calculateMonthlyPayment,
  currentLPR_5Year,
  currentLPR_5YearPlus,
  isCommercialLoanComplete,
  isProvidentLoanComplete,
  calculateCommercialMonthlyPayment,
  calculateProvidentMonthlyPayment,
  calculateLoanStats,
}) => {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [commercialStartDateOpen, setCommercialStartDateOpen] = useState(false);
  const [commercialEndDateOpen, setCommercialEndDateOpen] = useState(false);
  const [providentStartDateOpen, setProvidentStartDateOpen] = useState(false);
  const [providentEndDateOpen, setProvidentEndDateOpen] = useState(false);
  const stats = calculateLoanStats(loan);
  
  return (
    <div className="relative">
      {/* 房贷编辑表单 */}
      <div className="rounded-lg py-6 px-3 bg-white" style={{ border: '2px solid #CAF4F7' }}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">
            {loan.propertyName || `房贷 ${index + 1}`}
          </h4>
          <div className="flex items-center space-x-1">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button 
                  className="p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700"
                  title={loansLength > 1 ? "删除此房贷" : "清空此房贷"}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {loansLength > 1 ? '确认删除' : '确认清空'}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {loansLength > 1 
                      ? '您确定要删除这笔房贷吗？此操作不可撤销。'
                      : '您确定要清空这笔房贷信息吗？将恢复至默认值。'
                    }
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                    if (loansLength > 1) {
                      removeLoan(loan.id);
                    } else {
                      resetLoan(loan.id);
                    }
                  }}>
                    {loansLength > 1 ? '确定删除' : '确定清空'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
            {/* 第一行：房产名 + 贷款类型 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="min-w-0">
                <Label className="text-xs font-medium">
                  房产名称 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`property-${loan.id}`}
                  type="text"
                  placeholder="如：海淀某小区"
                  value={loan.propertyName}
                  onChange={(e) => updateLoan(loan.id, 'propertyName', e.target.value)}
                  className="h-9 text-sm mt-1"
                />
              </div>
              <div className="min-w-0">
                <Label className="text-xs font-medium">
                  贷款类型 <span className="text-red-500">*</span>
                </Label>
                <Select value={loan.loanType} onValueChange={(value) => {
                  const today = new Date().toISOString().split('T')[0];
                  if (value === 'combination') {
                    // 设置组合贷款的默认值
                    updateLoan(loan.id, 'loanType', value);
                    updateLoan(loan.id, 'commercialStartDate', today);
                    updateLoan(loan.id, 'commercialEndDate', today);
                    updateLoan(loan.id, 'commercialPaymentMethod', 'equal-payment');
                    updateLoan(loan.id, 'commercialRateType', 'floating');
                    updateLoan(loan.id, 'providentStartDate', today);
                    updateLoan(loan.id, 'providentEndDate', today);
                    updateLoan(loan.id, 'providentPaymentMethod', 'equal-payment');
                  } else {
                    updateLoan(loan.id, 'loanType', value);
                    // 为非组合贷款设置默认值
                    if (value === 'commercial') {
                      updateLoan(loan.id, 'rateType', 'floating');
                      updateLoan(loan.id, 'paymentMethod', 'equal-payment');
                    } else if (value === 'provident') {
                      updateLoan(loan.id, 'paymentMethod', 'equal-payment');
                    }
                  }
                }}>
                  <SelectTrigger className="h-9 text-sm w-full mt-1">
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="commercial">商业贷款</SelectItem>
                    <SelectItem value="provident">公积金贷款</SelectItem>
                    <SelectItem value="combination">组合贷款</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 第二行：贷款原始金额 + 剩余贷款本金（非组合贷款） */}
            {loan.loanType !== 'combination' && (
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="min-w-0">
                  <Label className="text-xs font-medium">
                    贷款原始金额(万元)
                  </Label>
                  <Input
                    type="text"
                    placeholder="如：300"
                    value={loan.loanAmount}
                    onChange={(e) => updateLoan(loan.id, 'loanAmount', e.target.value)}
                    className="h-9 text-sm mt-1"
                  />
                </div>
                <div className="min-w-0">
                  <Label className="text-xs font-medium">
                     贷款剩余本金(万元) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="如：200"
                    value={loan.remainingPrincipal || ''}
                    onChange={(e) => updateLoan(loan.id, 'remainingPrincipal', e.target.value)}
                    className="h-9 text-sm mt-1"
                  />
                </div>
              </div>
            )}

            {/* 第三行：贷款开始/结束日期（非组合贷款） */}
            {loan.loanType !== 'combination' && (
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="min-w-0">
                  <Label className="text-xs font-medium">
                    贷款开始日期 <span className="text-red-500">*</span>
                  </Label>
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-9 w-full justify-start text-left font-normal mt-1",
                          !loan.loanStartDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {loan.loanStartDate ? format(new Date(loan.loanStartDate), "yyyy-MM-dd") : "选择日期"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={loan.loanStartDate ? new Date(loan.loanStartDate) : undefined}
                        onSelect={(date) => {
                          updateLoan(loan.id, 'loanStartDate', date ? format(date, "yyyy-MM-dd") : '');
                          setStartDateOpen(false);
                         }}
                         disabled={(date) => {
                           // 更严格的日期比较，确保不能选择未来日期
                           const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                           const today = new Date();
                           const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                           const minDate = new Date(todayDate.getTime());
                           minDate.setFullYear(minDate.getFullYear() - 50);
                           return selectedDate.getTime() < minDate.getTime() || selectedDate.getTime() > todayDate.getTime();
                         }} // 贷款开始日期：今天-50年 到 今天（不能选未来）
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
                <div className="min-w-0">
                  <Label className="text-xs font-medium">
                    贷款结束日期 <span className="text-red-500">*</span>
                  </Label>
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-9 w-full justify-start text-left font-normal mt-1",
                          !loan.loanEndDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {loan.loanEndDate ? format(new Date(loan.loanEndDate), "yyyy-MM-dd") : "选择日期"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={loan.loanEndDate ? new Date(loan.loanEndDate) : undefined}
                          onSelect={(date) => {
                            updateLoan(loan.id, 'loanEndDate', date ? format(date, "yyyy-MM-dd") : '');
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
                           }} // 贷款结束日期：今天 到 今天+50年
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
            )}

            {/* 第四行：还款方式 + 利率类型（商业贷款单贷） */}
            {loan.loanType === 'commercial' && (
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="min-w-0">
                  <Label className="text-xs font-medium">
                    还款方式 <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={loan.paymentMethod}
                    onValueChange={(value) => updateLoan(loan.id, 'paymentMethod', value)}
                    className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 pt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="equal-payment" id={`equal-payment-${loan.id}`} />
                      <Label htmlFor={`equal-payment-${loan.id}`} className="text-xs whitespace-nowrap">等额本息</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="equal-principal" id={`equal-principal-${loan.id}`} />
                      <Label htmlFor={`equal-principal-${loan.id}`} className="text-xs whitespace-nowrap">等额本金</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="min-w-0">
                  <Label className="text-xs font-medium">
                    利率类型 <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={loan.rateType}
                    onValueChange={(value) => updateLoan(loan.id, 'rateType', value)}
                    className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 pt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="floating" id={`floating-${loan.id}`} />
                      <Label htmlFor={`floating-${loan.id}`} className="text-xs whitespace-nowrap">浮动利率</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed" id={`fixed-${loan.id}`} />
                      <Label htmlFor={`fixed-${loan.id}`} className="text-xs whitespace-nowrap">固定利率</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* 第五行：利率具体值（商业贷款单贷） */}
            {loan.loanType === 'commercial' && (
              <>
                {loan.rateType === 'fixed' ? (
                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <div className="min-w-0">
                      <Label className="text-xs font-medium">
                        固定利率(%) <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="如：4.90"
                          value={loan.fixedRate}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
                              updateLoan(loan.id, 'fixedRate', value);
                            }
                          }}
                          className="h-9 text-sm pr-7"
                        />
                        <Percent className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5">
                    <div>
                      <Label className="text-xs font-medium">
                        利率加减点(基点BP) <span className="text-red-500">*</span>
                      </Label>
                      <input
                        id={`rate-${loan.id}`}
                        type="number"
                        step="0.01"
                        placeholder="如：-30.50(减30.50个基点) 或 +50.25(加50.25个基点)"
                        value={loan.floatingRateAdjustment}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || /^-?\d+(\.\d{0,2})?$/.test(value)) {
                            updateLoan(loan.id, 'floatingRateAdjustment', value);
                          }
                        }}
                        className="h-9 w-full min-w-0 box-border rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
                      />
                    </div>
                  </div>
                )}
                
                {/* 月供金额单独占一行，与上方网格宽度一致 */}
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
                            {isLoanComplete(loan) 
                              ? `¥${Math.round(calculateMonthlyPayment(loan)).toLocaleString()}`
                              : '--'
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 第四行：还款方式 + 利率类型（公积金贷款单贷） */}
            {loan.loanType === 'provident' && (
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="min-w-0">
                  <Label className="text-xs font-medium">
                    还款方式 <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={loan.paymentMethod}
                    onValueChange={(value) => updateLoan(loan.id, 'paymentMethod', value)}
                    className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 pt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="equal-payment" id={`equal-payment-${loan.id}`} />
                      <Label htmlFor={`equal-payment-${loan.id}`} className="text-xs whitespace-nowrap">等额本息</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="equal-principal" id={`equal-principal-${loan.id}`} />
                      <Label htmlFor={`equal-principal-${loan.id}`} className="text-xs whitespace-nowrap">等额本金</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="min-w-0">
                  <Label className="text-xs font-medium">
                    利率 <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="如：3.25"
                      value={loan.fixedRate || ''}
                      onChange={(e) => updateLoan(loan.id, 'fixedRate', e.target.value)}
                      className="h-9 text-sm pr-7"
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">%</span>
                  </div>
                </div>
              </div>
            )}

            {/* 公积金贷款单贷月供金额 */}
            {loan.loanType === 'provident' && (
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
                          {isLoanComplete(loan) 
                            ? `¥${Math.round(calculateMonthlyPayment(loan)).toLocaleString()}`
                            : '--'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 组合贷款：商业贷款部分 */}
            {loan.loanType === 'combination' && (
              <>
                {/* 商业贷款标题 */}
                <div className="mt-6 mb-4 flex items-center">
                  <div className="h-4 w-1 mr-2" style={{ backgroundColor: '#01BCD6' }}></div>
                  <h5 className="text-sm font-semibold text-gray-900">商业贷款部分</h5>
                </div>

                {/* 商业贷款金额和剩余本金 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <Label className="text-xs font-medium">
                      商业贷款金额(万元)
                    </Label>
                    <Input
                      type="text"
                      placeholder="如：250"
                      value={loan.commercialLoanAmount}
                      onChange={(e) => updateLoan(loan.id, 'commercialLoanAmount', e.target.value)}
                    className="h-9 text-sm mt-1"
                    />
                  </div>
                  <div className="min-w-0">
                    <Label className="text-xs font-medium">
                      商业剩余本金(万元) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="如：180"
                      value={loan.commercialRemainingPrincipal || ''}
                      onChange={(e) => updateLoan(loan.id, 'commercialRemainingPrincipal', e.target.value)}
                      className="h-9 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* 商业贷款开始和结束日期 */}
                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div className="min-w-0">
                    <Label className="text-xs font-medium">
                      贷款开始日期 <span className="text-red-500">*</span>
                    </Label>
                    <Popover open={commercialStartDateOpen} onOpenChange={setCommercialStartDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-9 w-full justify-start text-left font-normal",
                            !loan.commercialStartDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {loan.commercialStartDate ? format(new Date(loan.commercialStartDate), "yyyy-MM-dd") : "选择日期"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={loan.commercialStartDate ? new Date(loan.commercialStartDate) : undefined}
                          onSelect={(date) => {
                            const dateStr = date ? format(date, "yyyy-MM-dd") : '';
                            updateLoan(loan.id, 'commercialStartDate', dateStr);
                            // 自动填充到公积金贷款开始日期
                            updateLoan(loan.id, 'providentStartDate', dateStr);
                            setCommercialStartDateOpen(false);
                          }}
                           disabled={(date) => {
                             // 更严格的日期比较，确保不能选择未来日期
                             const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                             const today = new Date();
                             const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                             const minDate = new Date(todayDate.getTime());
                             minDate.setFullYear(minDate.getFullYear() - 50);
                             return selectedDate.getTime() < minDate.getTime() || selectedDate.getTime() > todayDate.getTime();
                           }} // 贷款开始日期：今天-50年 到 今天（不能选未来）
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
                  <div className="min-w-0">
                    <Label className="text-xs font-medium">
                      贷款结束日期 <span className="text-red-500">*</span>
                    </Label>
                    <Popover open={commercialEndDateOpen} onOpenChange={setCommercialEndDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-9 w-full justify-start text-left font-normal",
                            !loan.commercialEndDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {loan.commercialEndDate ? format(new Date(loan.commercialEndDate), "yyyy-MM-dd") : "选择日期"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={loan.commercialEndDate ? new Date(loan.commercialEndDate) : undefined}
                          onSelect={(date) => {
                            const dateStr = date ? format(date, "yyyy-MM-dd") : '';
                            updateLoan(loan.id, 'commercialEndDate', dateStr);
                            // 自动填充到公积金贷款结束日期
                            updateLoan(loan.id, 'providentEndDate', dateStr);
                            setCommercialEndDateOpen(false);
                          }}
                           disabled={(date) => {
                             // 贷款结束日期：今天 到 今天+50年
                             const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                             const today = new Date();
                             const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                             const maxDate = new Date(todayDate.getTime());
                             maxDate.setFullYear(maxDate.getFullYear() + 50);
                             return selectedDate.getTime() < todayDate.getTime() || selectedDate.getTime() > maxDate.getTime();
                           }} // 贷款结束日期：今天 到 今天+50年
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

                {/* 商业贷款还款方式和利率类型 */}
                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div className="min-w-0">
                    <Label className="text-xs font-medium">
                      还款方式 <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={loan.commercialPaymentMethod}
                      onValueChange={(value) => {
                        updateLoan(loan.id, 'commercialPaymentMethod', value);
                        // 自动填充到公积金贷款还款方式
                        updateLoan(loan.id, 'providentPaymentMethod', value);
                      }}
                      className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 pt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="equal-payment" id={`commercial-equal-payment-${loan.id}`} />
                        <Label htmlFor={`commercial-equal-payment-${loan.id}`} className="text-xs whitespace-nowrap">等额本息</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="equal-principal" id={`commercial-equal-principal-${loan.id}`} />
                        <Label htmlFor={`commercial-equal-principal-${loan.id}`} className="text-xs whitespace-nowrap">等额本金</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="min-w-0">
                    <Label className="text-xs font-medium">
                      利率类型 <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={loan.commercialRateType}
                      onValueChange={(value) => updateLoan(loan.id, 'commercialRateType', value)}
                      className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 pt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="floating" id={`commercial-floating-${loan.id}`} />
                        <Label htmlFor={`commercial-floating-${loan.id}`} className="text-xs whitespace-nowrap">浮动利率</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id={`commercial-fixed-${loan.id}`} />
                        <Label htmlFor={`commercial-fixed-${loan.id}`} className="text-xs whitespace-nowrap">固定利率</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* 商业贷款利率具体值 */}
                {loan.commercialRateType === 'fixed' ? (
                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <div className="min-w-0">
                      <Label className="text-xs font-medium">
                        固定利率(%) <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="如：4.9"
                          value={loan.commercialFixedRate}
                          onChange={(e) => updateLoan(loan.id, 'commercialFixedRate', e.target.value)}
                          className="h-9 text-sm pr-7"
                        />
                        <Percent className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 mt-5">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">
                        利率加减点(基点BP) <span className="text-red-500">*</span>
                      </Label>
                      <input
                        id={`commercial-rate-${loan.id}`}
                        type="number"
                        step="1"
                        placeholder="如：-30(减30个基点) 或 +50(加50个基点)"
                        value={loan.commercialFloatingRateAdjustment}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || /^-?\d+$/.test(value)) {
                            updateLoan(loan.id, 'commercialFloatingRateAdjustment', value);
                          }
                        }}
                        className="h-9 w-full min-w-0 box-border rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
                      />
                    </div>
                  </div>
                )}
                
                {/* 月供金额单独占一行，与上方网格宽度一致 */}
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
                            {isCommercialLoanComplete(loan) 
                              ? `¥${Math.round(calculateCommercialMonthlyPayment(loan)).toLocaleString()}`
                              : '--'
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 公积金贷款标题 */}
                <div className="mt-8 mb-4 flex items-center">
                  <div className="h-4 w-1 mr-2" style={{ backgroundColor: '#01BCD6' }}></div>
                  <h5 className="text-sm font-semibold text-gray-900">公积金贷款部分</h5>
                </div>

                {/* 公积金贷款金额和剩余本金 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <Label className="text-xs font-medium">
                      公积金贷款金额(万元)
                    </Label>
                    <Input
                      type="text"
                      placeholder="如：50"
                      value={loan.providentLoanAmount}
                      onChange={(e) => updateLoan(loan.id, 'providentLoanAmount', e.target.value)}
                    className="h-9 text-sm mt-1"
                    />
                  </div>
                  <div className="min-w-0">
                    <Label className="text-xs font-medium">
                      公积金剩余本金(万元) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="如：20"
                      value={loan.providentRemainingPrincipal || ''}
                      onChange={(e) => updateLoan(loan.id, 'providentRemainingPrincipal', e.target.value)}
                      className="h-9 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* 公积金贷款开始和结束日期 */}
                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div className="min-w-0">
                    <Label className="text-xs font-medium">
                      贷款开始日期 <span className="text-red-500">*</span>
                    </Label>
                    <Popover open={providentStartDateOpen} onOpenChange={setProvidentStartDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-9 w-full justify-start text-left font-normal",
                            !loan.providentStartDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {loan.providentStartDate ? format(new Date(loan.providentStartDate), "yyyy-MM-dd") : "选择日期"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={loan.providentStartDate ? new Date(loan.providentStartDate) : undefined}
                          onSelect={(date) => {
                            updateLoan(loan.id, 'providentStartDate', date ? format(date, "yyyy-MM-dd") : '');
                            setProvidentStartDateOpen(false);
                          }}
                           disabled={(date) => {
                             // 更严格的日期比较，确保不能选择未来日期
                             const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                             const today = new Date();
                             const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                             const minDate = new Date(todayDate.getTime());
                             minDate.setFullYear(minDate.getFullYear() - 50);
                             return selectedDate.getTime() < minDate.getTime() || selectedDate.getTime() > todayDate.getTime();
                           }} // 贷款开始日期：今天-50年 到 今天（不能选未来）
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
                  <div className="min-w-0">
                    <Label className="text-xs font-medium">
                      贷款结束日期 <span className="text-red-500">*</span>
                    </Label>
                    <Popover open={providentEndDateOpen} onOpenChange={setProvidentEndDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-9 w-full justify-start text-left font-normal",
                            !loan.providentEndDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {loan.providentEndDate ? format(new Date(loan.providentEndDate), "yyyy-MM-dd") : "选择日期"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={loan.providentEndDate ? new Date(loan.providentEndDate) : undefined}
                          onSelect={(date) => {
                            updateLoan(loan.id, 'providentEndDate', date ? format(date, "yyyy-MM-dd") : '');
                            setProvidentEndDateOpen(false);
                          }}
                           disabled={(date) => {
                             // 贷款结束日期：今天 到 今天+50年
                             const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                             const today = new Date();
                             const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                             const maxDate = new Date(todayDate.getTime());
                             maxDate.setFullYear(maxDate.getFullYear() + 50);
                             return selectedDate.getTime() < todayDate.getTime() || selectedDate.getTime() > maxDate.getTime();
                           }} // 贷款结束日期：今天 到 今天+50年
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

                {/* 公积金贷款还款方式和利率 */}
                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div className="min-w-0">
                    <Label className="text-xs font-medium">
                      还款方式 <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={loan.providentPaymentMethod}
                      onValueChange={(value) => updateLoan(loan.id, 'providentPaymentMethod', value)}
                      className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 pt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="equal-payment" id={`provident-equal-payment-${loan.id}`} />
                        <Label htmlFor={`provident-equal-payment-${loan.id}`} className="text-xs whitespace-nowrap">等额本息</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="equal-principal" id={`provident-equal-principal-${loan.id}`} />
                        <Label htmlFor={`provident-equal-principal-${loan.id}`} className="text-xs whitespace-nowrap">等额本金</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="min-w-0">
                    <Label className="text-xs font-medium">
                      利率 <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="如：3.25"
                        value={loan.providentRate || ''}
                        onChange={(e) => updateLoan(loan.id, 'providentRate', e.target.value)}
                        className="h-9 text-sm pr-7"
                      />
                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">%</span>
                    </div>
                  </div>
                </div>
                
                {/* 月供金额单独占一行，与上方网格宽度一致 */}
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
                            {isProvidentLoanComplete(loan) 
                              ? `¥${Math.round(calculateProvidentMonthlyPayment(loan)).toLocaleString()}`
                              : '--'
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 组合贷款总月供显示 */}
                <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">组合贷款总月供：</span>
                    <span className="text-lg font-bold text-gray-900">
                      {(isCommercialLoanComplete(loan) && isProvidentLoanComplete(loan)) 
                        ? `${Math.round(calculateCommercialMonthlyPayment(loan) + calculateProvidentMonthlyPayment(loan)).toLocaleString()}元`
                        : '录入完毕后显示'
                      }
                    </span>
                  </div>
                </div>
              </>
            )}
            </div>
    </div>
  );
};

const DebtConfiguration: React.FC<DebtConfigurationProps> = ({
  category,
  onConfirm,
  onDataChange,
  isConfirmed,
  existingData
}) => {
  const uniqueId = useId();
  const { loans, updateLoan, addLoan, removeLoan, setLoans } = useLoanData({ persist: true });
  
  // Carloan hooks
  const { 
    carLoans, 
    addCarLoan, 
    removeCarLoan,
    resetCarLoan,
    updateCarLoan, 
    isCarLoanComplete 
  } = useCarLoanData(existingData?.carLoans);
  
  // Consumer loan hooks
  const { 
    consumerLoans, 
    addConsumerLoan, 
    removeConsumerLoan,
    resetConsumerLoan,
    updateConsumerLoan, 
    isConsumerLoanComplete 
  } = useConsumerLoanData(existingData?.consumerLoans);
  
  // Business loan hooks
  const { 
    businessLoans, 
    addBusinessLoan, 
    removeBusinessLoan,
    resetBusinessLoan,
    updateBusinessLoan, 
    isBusinessLoanComplete 
  } = useBusinessLoanData(existingData?.businessLoans);
  
  // Private loan hooks
  const { 
    privateLoans, 
    addPrivateLoan, 
    removePrivateLoan,
    resetPrivateLoan,
    updatePrivateLoan, 
    isPrivateLoanComplete,
    updateRateFen,
    updateRateLi 
  } = usePrivateLoanData(existingData?.privateLoans);
  
  // Credit card hooks
  const { 
    creditCards, 
    addCreditCard, 
    removeCreditCard,
    resetCreditCard,
    updateCreditCard, 
    isCreditCardComplete 
  } = useCreditCardData(existingData?.creditCards);

  // 基础表单数据
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  
  // 用于跟踪数据变化
  const [lastConfirmedData, setLastConfirmedData] = useState<any>(null);
  const [hasDataChanged, setHasDataChanged] = useState(false);
  const skipExistingSyncRef = useRef(false);

  // LPR 利率常量
  const currentLPR_5Year = 3.50; // 5年期LPR（公积金）
  const currentLPR_5YearPlus = 3.50; // 5年期以上LPR（商业）

// Check if data has changed since last confirmation (per-category)
useEffect(() => {
  if (!lastConfirmedData) return;
  let currentData: any = {};
  switch (category.type) {
    case 'mortgage':
      currentData = { loans, formData };
      break;
    case 'carLoan':
      currentData = { carLoans };
      break;
    case 'consumerLoan':
      currentData = { consumerLoans };
      break;
    case 'businessLoan':
      currentData = { businessLoans };
      break;
    case 'privateLoan':
      currentData = { privateLoans };
      break;
    case 'creditCard':
      currentData = { creditCards };
      break;
    default:
      currentData = {};
  }
  const changed = JSON.stringify(currentData) !== JSON.stringify(lastConfirmedData);
  setHasDataChanged(changed);
}, [category.type, loans, carLoans, consumerLoans, businessLoans, privateLoans, creditCards, formData, lastConfirmedData]);

  // Sync with existing data when component mounts or existingData changes
  useEffect(() => {
    if (existingData && !skipExistingSyncRef.current) {
      if (existingData.loans && category.type === 'mortgage') {
        setLoans(existingData.loans);
      }
      if (existingData.formData) {
        setFormData(existingData.formData);
      }
      
// 如果已确认且有存在数据，初始化lastConfirmedData（仅当前类别）并重置hasDataChanged
      if (isConfirmed && existingData) {
        let snapshot: any = {};
        switch (category.type) {
          case 'mortgage':
            snapshot = { loans: existingData.loans || [], formData: existingData.formData || {} };
            break;
          case 'carLoan':
            snapshot = { carLoans: existingData.carLoans || [] };
            break;
          case 'consumerLoan':
            snapshot = { consumerLoans: existingData.consumerLoans || [] };
            break;
          case 'businessLoan':
            snapshot = { businessLoans: existingData.businessLoans || [] };
            break;
          case 'privateLoan':
            snapshot = { privateLoans: existingData.privateLoans || [] };
            break;
          case 'creditCard':
            snapshot = { creditCards: existingData.creditCards || [] };
            break;
          default:
            snapshot = {};
        }
        setLastConfirmedData(snapshot);
        setHasDataChanged(false);
      }
    }
  }, [existingData, category.type, setLoans, isConfirmed]);

  // 汇总车贷数据
  const getCarLoanAggregatedData = () => {
    const completeCarLoans = carLoans.filter(isCarLoanComplete);

    // 计算剩余月数（基于结束日期与今天）
    const getRemainingMonths = (endDateStr?: string) => {
      if (!endDateStr) return 0;
      const today = new Date();
      const end = new Date(endDateStr);
      const diffMonths = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
      return Math.max(0, diffMonths);
    };

    let totalMonthlyPayment = 0; // 元
    let maxRemainingMonths = 0;  // 月
    let totalRemainingPrincipal = 0; // 万元
    let totalRemainingInterest = 0;   // 万元

    completeCarLoans.forEach((loan) => {
      if (loan.loanType === 'installment') {
        const monthlyPaymentYuan = parseFloat(loan.installmentAmount || '0');
        const remainingMonths = parseInt(loan.remainingInstallments || '0');
        totalMonthlyPayment += monthlyPaymentYuan;
        maxRemainingMonths = Math.max(maxRemainingMonths, remainingMonths);
        // 分期：以月供*剩余期数估算剩余本金（万元），利息未知设为0
        totalRemainingPrincipal += (monthlyPaymentYuan * remainingMonths) / 10000;
        // 业务约定：分期不计“待还利息”
      } else if (loan.loanType === 'bankLoan') {
        // 银行贷款：优先使用“剩余本金”，否则使用原始本金（均为万元）
        const principalWan = parseFloat(loan.remainingPrincipal || loan.principal || '0');
        const principalYuan = principalWan * 10000;
        const annualRate = parseFloat(loan.interestRate || '0') / 100;
        const monthlyRate = annualRate / 12;
        const remainingMonths = getRemainingMonths(loan.endDateMonth);
        maxRemainingMonths = Math.max(maxRemainingMonths, remainingMonths);
        totalRemainingPrincipal += principalWan;

        if (principalYuan > 0 && monthlyRate > 0 && remainingMonths > 0) {
          if (loan.repaymentMethod === 'equal-principal') {
            // 等额本金：首月月供 = 本金/月 + 本金*月利率；总利息近似 = 本金*月利率*(n+1)/2
            const monthlyPrincipal = principalYuan / remainingMonths;
            const firstMonthPayment = monthlyPrincipal + principalYuan * monthlyRate;
            totalMonthlyPayment += firstMonthPayment;
            const totalInterestWan = (principalYuan * monthlyRate * (remainingMonths + 1) / 2) / 10000;
            totalRemainingInterest += Math.max(0, totalInterestWan);
          } else {
            // 默认等额本息
            const monthlyPayment = principalYuan * (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / (Math.pow(1 + monthlyRate, remainingMonths) - 1);
            totalMonthlyPayment += monthlyPayment;
            const totalPaymentWan = (monthlyPayment * remainingMonths) / 10000;
            totalRemainingInterest += Math.max(0, totalPaymentWan - principalWan);
          }
        }
      }
    });

    return {
      count: completeCarLoans.length,
      totalMonthlyPayment,
      maxRemainingMonths,
      totalRemainingPrincipal,
      totalRemainingInterest,
    };
  };

  // 汇总消费贷数据
  const getConsumerLoanAggregatedData = () => {
    const completeConsumerLoans = consumerLoans.filter(isConsumerLoanComplete);
    const totalLoanAmount = completeConsumerLoans.reduce((sum, loan) => {
      return sum + parseFloat(loan.loanAmount || '0');
    }, 0);
    
    // Calculate remaining months using endDate
    const getRemainingMonths = (endDate: string) => {
      if (!endDate) return 0;
      const today = new Date();
      const end = new Date(endDate);
      const diffTime = end.getTime() - today.getTime();
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // 30.44 days per month average
      return Math.max(0, diffMonths);
    };
    
    let totalMonthlyPayment = 0;
    let totalRemainingInterest = 0; // 万元
    
    completeConsumerLoans.forEach(loan => {
      const principalWan = parseFloat(loan.loanAmount || '0');
      const principalYuan = principalWan * 10000;
      const annualRate = parseFloat(loan.annualRate || '0') / 100;
      const remainingMonths = getRemainingMonths(loan.endDate || '');
      
      if (loan.repaymentMethod === 'interest-first') {
        // 先息后本：待还利息 = 月利息 * 剩余月数
        const monthlyInterest = principalYuan * annualRate / 12;
        totalRemainingInterest += (monthlyInterest * remainingMonths) / 10000;
        totalMonthlyPayment += monthlyInterest;
      } else if (loan.repaymentMethod === 'lump-sum') {
        // 一次性还本付息：计算总利息
        if (loan.endDate) {
          const today = new Date();
          const endDate = new Date(loan.endDate);
          const totalDays = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
          totalRemainingInterest += (principalYuan * annualRate * totalDays / 365) / 10000;
        }
      } else {
        // 其他还款方式（等额本息、等额本金）
        if (principalYuan > 0 && annualRate > 0 && remainingMonths > 0) {
          const monthlyRate = annualRate / 12;
          const monthlyPayment = principalYuan * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths) / (Math.pow(1 + monthlyRate, remainingMonths) - 1);
          const totalPayment = monthlyPayment * remainingMonths;
          totalRemainingInterest += Math.max(0, (totalPayment - principalYuan) / 10000);
          totalMonthlyPayment += monthlyPayment;
        }
      }
    });
    
    const maxRemainingMonths = completeConsumerLoans.reduce((max, loan) => {
      const remainingMonths = getRemainingMonths(loan.endDate || '');
      return Math.max(max, remainingMonths);
    }, 0);
    
    return {
      count: completeConsumerLoans.length,
      totalLoanAmount,
      totalMonthlyPayment,
      maxRemainingMonths,
      totalRemainingInterest
    };
  };

  // 汇总经营贷数据
  const getBusinessLoanAggregatedData = () => {
    const completeBusinessLoans = businessLoans.filter(isBusinessLoanComplete);
    const totalLoanAmount = completeBusinessLoans.reduce((sum, loan) => {
      return sum + parseFloat(loan.loanAmount || '0');
    }, 0);
    
    // Calculate remaining months using startDate (UI stores end date in startDate field)
    const getRemainingMonths = (endDate: string) => {
      if (!endDate) return 0;
      const today = new Date();
      const end = new Date(endDate);
      const diffTime = end.getTime() - today.getTime();
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // 30.44 days per month average
      return Math.max(0, diffMonths);
    };
    
    let totalMonthlyPayment = 0;
    let totalRemainingInterest = 0; // 万元
    
    completeBusinessLoans.forEach(loan => {
      const principalWan = parseFloat(loan.loanAmount || '0');
      const principalYuan = principalWan * 10000;
      const annualRate = parseFloat(loan.annualRate || '0') / 100;
      const remainingMonths = getRemainingMonths(loan.startDate || ''); // UI uses startDate for end date
      
      if (loan.repaymentMethod === 'interest-first') {
        // 先息后本：待还利息 = 月利息 * 剩余月数
        const monthlyInterest = principalYuan * annualRate / 12;
        totalRemainingInterest += (monthlyInterest * remainingMonths) / 10000;
        totalMonthlyPayment += monthlyInterest;
      } else if (loan.repaymentMethod === 'lump-sum') {
        // 一次性还本付息：计算总利息
        if (loan.startDate) {
          const today = new Date();
          const endDate = new Date(loan.startDate); // UI uses startDate for end date
          const totalDays = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
          totalRemainingInterest += (principalYuan * annualRate * totalDays / 365) / 10000;
        }
      } else {
        // 其他还款方式（等额本息、等额本金）
        if (principalYuan > 0 && annualRate > 0 && remainingMonths > 0) {
          const monthlyRate = annualRate / 12;
          const monthlyPayment = principalYuan * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths) / (Math.pow(1 + monthlyRate, remainingMonths) - 1);
          const totalPayment = monthlyPayment * remainingMonths;
          totalRemainingInterest += Math.max(0, (totalPayment - principalYuan) / 10000);
          totalMonthlyPayment += monthlyPayment;
        }
      }
    });
    
    const maxRemainingMonths = completeBusinessLoans.reduce((max, loan) => {
      const remainingMonths = getRemainingMonths(loan.startDate || ''); // UI uses startDate for end date
      return Math.max(max, remainingMonths);
    }, 0);
    
    return {
      count: completeBusinessLoans.length,
      totalLoanAmount,
      totalMonthlyPayment,
      maxRemainingMonths,
      totalRemainingInterest
    };
  };

  // 汇总民间借贷数据
  const getPrivateLoanAggregatedData = () => {
    const completePrivateLoans = privateLoans.filter(isPrivateLoanComplete);
    const totalLoanAmount = completePrivateLoans.reduce((sum, loan) => {
      return sum + parseFloat(loan.loanAmount || '0');
    }, 0);
    
    // Calculate remaining months using endDate field
    const getRemainingMonths = (endDate: string) => {
      if (!endDate) return 0;
      const today = new Date();
      const end = new Date(endDate);
      const diffTime = end.getTime() - today.getTime();
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // 30.44 days per month average
      return Math.max(0, diffMonths);
    };
    
    let totalMonthlyPayment = 0;
    let totalRemainingInterest = 0; // 万元
    
    completePrivateLoans.forEach(loan => {
      const principalWan = parseFloat(loan.loanAmount || '0');
      const principalYuan = principalWan * 10000;
      // Use consistent rate calculation - fen and li to percentage
      const fenValue = parseFloat(loan.rateFen || '0');
      const liValue = parseFloat(loan.rateLi || '0');
      const annualRatePercent = fenValue + liValue / 10; // 1分 = 1%, 1厘 = 0.1%
      const annualRate = annualRatePercent / 100;
      const remainingMonths = getRemainingMonths(loan.endDate || '');
      
      if (loan.repaymentMethod === 'interest-first') {
        // 先息后本：待还利息 = 月利息 * 剩余月数
        const monthlyInterest = principalYuan * annualRate / 12;
        totalRemainingInterest += (monthlyInterest * remainingMonths) / 10000;
        totalMonthlyPayment += monthlyInterest;
      } else if (loan.repaymentMethod === 'lump-sum') {
        // 一次性还本付息：从今天到endDate的总利息（与卡片显示一致）
        if (loan.endDate) {
          const startDate = new Date(); // 从今天开始计算
          const endDate = new Date(loan.endDate);
          const totalDays = Math.max(0, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
          totalRemainingInterest += (principalYuan * annualRate * totalDays / 365) / 10000;
        }
      }
    });
    
    const maxRemainingMonths = completePrivateLoans.reduce((max, loan) => {
      const remainingMonths = getRemainingMonths(loan.endDate || '');
      return Math.max(max, remainingMonths);
    }, 0);
    
    return {
      count: completePrivateLoans.length,
      totalLoanAmount,
      totalMonthlyPayment,
      maxRemainingMonths,
      totalRemainingInterest
    };
  };

  // 汇总信用卡数据
  const getCreditCardAggregatedData = () => {
    const completeCreditCards = creditCards.filter(isCreditCardComplete);
    const totalAmount = completeCreditCards.reduce((sum, card) => {
      const current = parseFloat(card.currentAmount || '0');
      const unbilled = parseFloat(card.unbilledAmount || '0');
      return sum + (current + unbilled) / 10000; // 转换为万元
    }, 0);
    
    return {
      count: completeCreditCards.length,
      totalAmount
    };
  };

  // 计算月供函数
  const calculateMonthlyPayment = (loan: LoanInfo): number => {
    if (loan.loanType === 'combination') {
      const commercialPayment = calculateCommercialMonthlyPayment(loan);
      const providentPayment = calculateProvidentMonthlyPayment(loan);
      return commercialPayment + providentPayment;
    }
    
    return calculateSingleLoanPayment(loan);
  };

  // 单一贷款月供计算
  const calculateSingleLoanPayment = (loan: LoanInfo): number => {
    const principal = parseFloat(loan.remainingPrincipal || '0') * 10000;
    if (!principal || principal <= 0) return 0;

    let rate = 0;
    if (loan.rateType === 'fixed') {
      const fixed = parseFloat(loan.fixedRate || '');
      rate = isFinite(fixed) && fixed > 0
        ? fixed / 100
        : ((loan.loanType === 'provident' ? currentLPR_5Year : currentLPR_5YearPlus) / 100);
    } else {
      const baseLPR = loan.loanType === 'provident' ? currentLPR_5Year : currentLPR_5YearPlus;
      const adjustmentBP = parseFloat(loan.floatingRateAdjustment || '0');
      const adjustment = isFinite(adjustmentBP) ? adjustmentBP / 10000 : 0; // BP 转为小数
      rate = baseLPR / 100 + adjustment;
    }

    if (!isFinite(rate) || rate <= 0) return 0;

    const monthlyRate = rate / 12;
    
    // 计算剩余期数 - 修复日期处理
    if (!loan.loanEndDate) return 0;
    const currentDate = new Date();
    const endDate = new Date(loan.loanEndDate);
    const remainingMonths = Math.max(0, (endDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                                   (endDate.getMonth() - currentDate.getMonth()));

    if (remainingMonths <= 0) return 0;

    if (loan.paymentMethod === 'equal-payment') {
      // 等额本息
      return principal * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths) / 
             (Math.pow(1 + monthlyRate, remainingMonths) - 1);
    } else {
      // 等额本金 - 当前月份的还款额
      const monthlyPrincipal = principal / remainingMonths;
      const interest = principal * monthlyRate;
      return monthlyPrincipal + interest;
    }
  };

  // 商业贷款月供计算
  const calculateCommercialMonthlyPayment = (loan: LoanInfo): number => {
    const principal = parseFloat(loan.commercialRemainingPrincipal || '0') * 10000;
    if (!principal || principal <= 0) return 0;

    let rate = 0;
    if (loan.commercialRateType === 'fixed') {
      const fixed = parseFloat(loan.commercialFixedRate || '');
      rate = isFinite(fixed) && fixed > 0 ? fixed / 100 : currentLPR_5YearPlus / 100;
    } else {
      const adjustmentBP = parseFloat(loan.commercialFloatingRateAdjustment || '0');
      const adjustment = isFinite(adjustmentBP) ? adjustmentBP / 10000 : 0; // BP 转为小数
      rate = currentLPR_5YearPlus / 100 + adjustment;
    }

    if (!isFinite(rate) || rate <= 0) return 0;

    const monthlyRate = rate / 12;
    
    if (!loan.commercialEndDate) return 0;
    const currentDate = new Date();
    const endDate = new Date(loan.commercialEndDate);
    if (isNaN(endDate.getTime())) return 0;
    const remainingMonths = Math.max(0, (endDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                                   (endDate.getMonth() - currentDate.getMonth()));

    if (remainingMonths <= 0) return 0;

    if (loan.commercialPaymentMethod === 'equal-payment') {
      return principal * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths) / 
             (Math.pow(1 + monthlyRate, remainingMonths) - 1);
    } else {
      const monthlyPrincipal = principal / remainingMonths;
      const interest = principal * monthlyRate;
      return monthlyPrincipal + interest;
    }
  };

  // 公积金贷款月供计算
  const calculateProvidentMonthlyPayment = (loan: LoanInfo): number => {
    const principal = parseFloat(loan.providentRemainingPrincipal || '0') * 10000;
    if (!principal || principal <= 0) return 0;

    let rate = parseFloat(loan.providentRate || '');
    rate = isFinite(rate) && rate > 0 ? rate / 100 : currentLPR_5Year / 100;

    const monthlyRate = rate / 12;
    
    if (!loan.providentEndDate) return 0;
    const currentDate = new Date();
    const endDate = new Date(loan.providentEndDate);
    const remainingMonths = Math.max(0, (endDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                                   (endDate.getMonth() - currentDate.getMonth()));

    if (remainingMonths <= 0) return 0;

    if (loan.providentPaymentMethod === 'equal-payment') {
      return principal * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths) / 
             (Math.pow(1 + monthlyRate, remainingMonths) - 1);
    } else {
      const monthlyPrincipal = principal / remainingMonths;
      const interest = principal * monthlyRate;
      return monthlyPrincipal + interest;
    }
  };

  // 贷款完整性检查
  const isLoanComplete = (loan: LoanInfo): boolean => {
    if (loan.loanType === 'combination') {
      return isCommercialLoanComplete(loan) && isProvidentLoanComplete(loan);
    }
    
    return !!(
      loan.propertyName?.trim() &&
      loan.loanType &&
      // 移除 loan.loanAmount?.trim() && // 贷款原始金额变为非必填
      loan.remainingPrincipal?.trim() &&
      loan.loanStartDate &&
      loan.loanEndDate &&
      loan.paymentMethod &&
      loan.rateType &&
      (loan.rateType === 'fixed' ? loan.fixedRate?.trim() : loan.floatingRateAdjustment?.trim())
    );
  };

  // 商业贷款完整性检查
  const isCommercialLoanComplete = (loan: LoanInfo): boolean => {
    return !!(
      loan.propertyName?.trim() &&
      // 移除 loan.commercialLoanAmount?.trim() && // 商业贷款金额变为非必填
      loan.commercialRemainingPrincipal?.trim() &&
      loan.commercialStartDate &&
      loan.commercialEndDate &&
      loan.commercialPaymentMethod &&
      loan.commercialRateType &&
      (loan.commercialRateType === 'fixed' ? loan.commercialFixedRate?.trim() : loan.commercialFloatingRateAdjustment?.trim())
    );
  };

  // 公积金贷款完整性检查
  const isProvidentLoanComplete = (loan: LoanInfo): boolean => {
    return !!(
      // 移除 loan.providentLoanAmount?.trim() && // 公积金贷款金额变为非必填
      loan.providentRemainingPrincipal?.trim() &&
      loan.providentStartDate &&
      loan.providentEndDate &&
      loan.providentPaymentMethod &&
      loan.providentRate?.trim()
    );
  };

  // 其他负债基础字段
  const renderBasicDebtFields = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${uniqueId}-amount`} className="text-sm font-medium">
              {category.name}金额(万元) <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`${uniqueId}-amount`}
              type="text"
              placeholder="请输入金额"
              value={formData.amount || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className="text-sm"
            />
          </div>
        </div>
      </div>
    );
  };

  const canConfirm = () => {
    return formData.amount?.trim();
  };

  const handleConfirm = () => {
    if (canConfirm()) {
      const data = {
        amount: parseFloat(formData.amount || '0'),
        formData
      };
      
setLastConfirmedData({ loans, formData });
      setHasDataChanged(false);
      
      skipExistingSyncRef.current = true;
      setTimeout(() => {
        skipExistingSyncRef.current = false;
      }, 100);
      
      onConfirm(category.id, data);
    }
  };

  // 房贷实时数据更新
  useEffect(() => {
    if (category.type === 'mortgage' && onDataChange) {
      let validLoanCount = 0; // 放宽条件：以是否填写“剩余本金”作为有效笔数标准
      let totalRemainingPrincipal = 0;
      let totalMonthlyPayment = 0;
      let maxRemainingMonths = 0;

      const currentDate = new Date();

      const getParsedEndDate = (dateStr?: string) => {
        if (!dateStr) return null;
        const normalized = dateStr.includes('-') && dateStr.split('-').length === 2
          ? `${dateStr}-01`
          : dateStr;
        const d = new Date(normalized);
        return isNaN(d.getTime()) ? null : d;
      };
      
      loans.forEach(loan => {
        if (loan.loanType === 'combination') {
          const commercialRemainingWan = parseFloat(loan.commercialRemainingPrincipal || '0');
          const providentRemainingWan = parseFloat(loan.providentRemainingPrincipal || '0');
          const remainingWan = (isFinite(commercialRemainingWan) ? commercialRemainingWan : 0)
                             + (isFinite(providentRemainingWan) ? providentRemainingWan : 0);
          if (remainingWan > 0) {
            validLoanCount++;
            totalRemainingPrincipal += remainingWan;

            // 月供尽力计算（字段不全则为0，不影响笔数统计）
            const mp = calculateMonthlyPayment(loan);
            if (isFinite(mp) && mp > 0) totalMonthlyPayment += mp;

            // 剩余期数尽力计算（取两个子贷中更晚的结束时间）
            const cEnd = getParsedEndDate(loan.commercialEndDate);
            const pEnd = getParsedEndDate(loan.providentEndDate);
            const endDate = cEnd && pEnd ? (cEnd > pEnd ? cEnd : pEnd) : (cEnd || pEnd);
            if (endDate) {
              const rm = Math.max(0, (endDate.getFullYear() - currentDate.getFullYear()) * 12 +
                                   (endDate.getMonth() - currentDate.getMonth()));
              maxRemainingMonths = Math.max(maxRemainingMonths, rm);
            }
          }
        } else {
          const remainingWan = parseFloat(String(loan.remainingPrincipal || '0').replace(/[\,\s]/g, ''));
          if (isFinite(remainingWan) && remainingWan > 0) {
            validLoanCount++;
            totalRemainingPrincipal += remainingWan;

            const mp = calculateMonthlyPayment(loan);
            if (isFinite(mp) && mp > 0) totalMonthlyPayment += mp;

            const endDate = getParsedEndDate(loan.loanEndDate);
            if (endDate) {
              const rm = Math.max(0, (endDate.getFullYear() - currentDate.getFullYear()) * 12 +
                                   (endDate.getMonth() - currentDate.getMonth()));
              maxRemainingMonths = Math.max(maxRemainingMonths, rm);
            }
          }
        }
      });

      // 总是发送实时数据更新（包括count为0的情况）
      const totalRemainingInterest = (isFinite(totalMonthlyPayment) && totalMonthlyPayment > 0 && maxRemainingMonths > 0)
        ? (totalMonthlyPayment * maxRemainingMonths) / 10000 - totalRemainingPrincipal
        : 0;

      onDataChange(category.id, {
        count: validLoanCount,
        remainingPrincipal: totalRemainingPrincipal,
        remainingInterest: Math.max(0, totalRemainingInterest),
        monthlyPayment: totalMonthlyPayment,
        remainingMonths: maxRemainingMonths
      });
    }
  }, [loans, category.type, category.id, onDataChange, calculateMonthlyPayment]);
  
  // 车贷实时数据更新（根据需求：仅在点击“确认车贷信息”后再更新，不在录入时实时更新）
  useEffect(() => {
    // 故意不触发 onDataChange：避免录入必填项时提前更新“债务笔数”
    // 车贷的“债务笔数”等聚合数据应在 onConfirm 时由父组件接收
    return;
  }, [carLoans, category.type]);
  
  // 消费贷实时数据更新
  useEffect(() => {
    if (category.type === 'consumerLoan' && onDataChange) {
      const aggregatedData = getConsumerLoanAggregatedData();
      onDataChange(category.id, {
        count: aggregatedData.count,
        amount: aggregatedData.totalLoanAmount, // 消费贷使用总贷款金额
        monthlyPayment: aggregatedData.totalMonthlyPayment,
        remainingMonths: aggregatedData.maxRemainingMonths,
        remainingInterest: aggregatedData.totalRemainingInterest
      });
    }
  }, [consumerLoans, category.type, category.id, onDataChange, getConsumerLoanAggregatedData]);
  
  // 经营贷实时数据更新
  useEffect(() => {
    if (category.type === 'businessLoan' && onDataChange) {
      const aggregatedData = getBusinessLoanAggregatedData();
      onDataChange(category.id, {
        count: aggregatedData.count,
        amount: aggregatedData.totalLoanAmount,
        monthlyPayment: aggregatedData.totalMonthlyPayment,
        remainingMonths: aggregatedData.maxRemainingMonths,
        remainingInterest: aggregatedData.totalRemainingInterest
      });
    }
  }, [businessLoans, category.type, category.id, onDataChange, getBusinessLoanAggregatedData]);
  
  // 民间借贷实时数据更新
  useEffect(() => {
    if (category.type === 'privateLoan' && onDataChange) {
      const aggregatedData = getPrivateLoanAggregatedData();
      onDataChange(category.id, {
        count: aggregatedData.count,
        amount: aggregatedData.totalLoanAmount,
        monthlyPayment: aggregatedData.totalMonthlyPayment,
        remainingMonths: aggregatedData.maxRemainingMonths,
        remainingInterest: aggregatedData.totalRemainingInterest
      });
    }
  }, [privateLoans, category.type, category.id, onDataChange, getPrivateLoanAggregatedData]);
  
  // 信用卡实时数据更新
  useEffect(() => {
    if (category.type === 'creditCard' && onDataChange) {
      const aggregatedData = getCreditCardAggregatedData();
      onDataChange(category.id, {
        count: aggregatedData.count,
        amount: aggregatedData.totalAmount, // 使用万元
        monthlyPayment: 0, // 信用卡没有固定月供
        remainingMonths: 0
      });
    }
  }, [creditCards, category.type, category.id, onDataChange, getCreditCardAggregatedData]);

  // 计算折叠摘要所需的统计数据
  const calculateLoanStats = (loan: LoanInfo) => {
    const now = new Date();

    // 计算期数相关
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    if (loan.loanType === 'combination') {
      // 组合贷使用两个子贷款的最早开始月与最晚结束月
      const cStart = loan.commercialStartDate ? new Date(loan.commercialStartDate + '-01') : null;
      const pStart = loan.providentStartDate ? new Date(loan.providentStartDate + '-01') : null;
      const cEnd = loan.commercialEndDate ? new Date(loan.commercialEndDate + '-01') : null;
      const pEnd = loan.providentEndDate ? new Date(loan.providentEndDate + '-01') : null;

      // 取最早开始、最晚结束
      startDate = cStart && pStart ? (cStart < pStart ? cStart : pStart) : (cStart || pStart);
      endDate = cEnd && pEnd ? (cEnd > pEnd ? cEnd : pEnd) : (cEnd || pEnd);
    } else {
      if (loan.loanStartDate) startDate = new Date(loan.loanStartDate + '-01');
      if (loan.loanEndDate) endDate = new Date(loan.loanEndDate + '-01');
    }

    const totalMonths = startDate && endDate
      ? (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth())
      : 0;
    const paidMonths = startDate
      ? Math.max(0, Math.min(totalMonths, (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth())))
      : 0;
    const timeProgress = totalMonths > 0 ? (paidMonths / totalMonths) * 100 : 0;

    // 本金相关（单位：元）- 检查是否有原始金额
    let totalPrincipal = 0;
    let hasOriginalAmount = false;
    if (loan.loanType === 'combination') {
      const commercial = parseFloat(loan.commercialLoanAmount || '0') * 10000;
      const provident = parseFloat(loan.providentLoanAmount || '0') * 10000;
      totalPrincipal = commercial + provident;
      hasOriginalAmount = !!(loan.commercialLoanAmount?.trim() || loan.providentLoanAmount?.trim());
    } else {
      totalPrincipal = parseFloat(loan.loanAmount || '0') * 10000;
      hasOriginalAmount = !!(loan.loanAmount?.trim());
    }
    let remainingPrincipal = 0;
    if (loan.loanType === 'combination') {
      const c = parseFloat(loan.commercialRemainingPrincipal || '0') * 10000;
      const p = parseFloat(loan.providentRemainingPrincipal || '0') * 10000;
      remainingPrincipal = c + p;
    } else {
      remainingPrincipal = parseFloat(loan.remainingPrincipal || '0') * 10000;
    }
    const paidPrincipal = Math.max(0, totalPrincipal - remainingPrincipal);
    const principalProgress = totalPrincipal > 0 ? (paidPrincipal / totalPrincipal) * 100 : 0;

    // 月供
    const currentMonthlyPayment = calculateMonthlyPayment(loan);

    return {
      totalMonths,
      paidMonths,
      timeProgress,
      totalPrincipal,
      paidPrincipal,
      principalProgress,
      currentMonthlyPayment,
      hasOriginalAmount: hasOriginalAmount // 修复：明确赋值
    };
  };
  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="p-0 mt-4">
        {category.type === 'mortgage' ? (
          /* 房贷使用FSSharedLoanModule */
          <FSSharedLoanModule
            calculateLoanStats={calculateLoanStats}
            isLoanComplete={isLoanComplete}
            calculateMonthlyPayment={calculateMonthlyPayment}
            currentLPR_5Year={currentLPR_5Year}
            currentLPR_5YearPlus={currentLPR_5YearPlus}
            isCommercialLoanComplete={isCommercialLoanComplete}
            isProvidentLoanComplete={isProvidentLoanComplete}
            calculateCommercialMonthlyPayment={calculateCommercialMonthlyPayment}
            calculateProvidentMonthlyPayment={calculateProvidentMonthlyPayment}
            calculateCommercialLoanStats={calculateLoanStats}
            calculateProvidentLoanStats={calculateLoanStats}
            LoanFormCard={LoanFormCard}
            onLoansChange={setLoans}
            persist={true}
            onLastItemCleared={() => {
              // 当最后一笔完成的贷款被清除时，立即确认空状态
              setTimeout(() => {
                const aggregatedData = {
                  count: 0,
                  amount: 0,
                  monthlyPayment: 0,
                  remainingMonths: 0,
                  loans: []
                };
                onConfirm(category.id, aggregatedData);
              }, 0);
            }}
          >
            <Button 
              onClick={() => {
                // Aggregate loan data and confirm
                const completeLoanExists = loans.some(loan => isLoanComplete(loan));
                
                let aggregatedData;
                
                if (completeLoanExists) {
                  let totalRemainingPrincipal = 0;
                  let totalMonthlyPayment = 0;
                  let maxRemainingMonths = 0;
                  
                  loans.forEach(loan => {
                    if (isLoanComplete(loan)) {
                      if (loan.loanType === 'combination') {
                        const commercialRemaining = parseFloat(loan.commercialRemainingPrincipal || '0');
                        const providentRemaining = parseFloat(loan.providentRemainingPrincipal || '0');
                        totalRemainingPrincipal += commercialRemaining + providentRemaining;
                      } else {
                        const remaining = parseFloat(loan.remainingPrincipal || '0');
                        totalRemainingPrincipal += remaining;
                      }
                      
                      totalMonthlyPayment += calculateMonthlyPayment(loan);
                      
                      // Calculate remaining months
                      const currentDate = new Date();
                      let endDate: Date;
                      
                      if (loan.loanType === 'combination') {
                        const commercialEndDateStr = loan.commercialEndDate || '';
                        const providentEndDateStr = loan.providentEndDate || '';
                        const commercialEndDateFormatted = commercialEndDateStr.includes('-') && commercialEndDateStr.split('-').length === 2 
                          ? commercialEndDateStr + '-01' 
                          : commercialEndDateStr;
                        const providentEndDateFormatted = providentEndDateStr.includes('-') && providentEndDateStr.split('-').length === 2 
                          ? providentEndDateStr + '-01' 
                          : providentEndDateStr;
                        const commercialEndDate = new Date(commercialEndDateFormatted);
                        const providentEndDate = new Date(providentEndDateFormatted);
                        endDate = commercialEndDate > providentEndDate ? commercialEndDate : providentEndDate;
                      } else {
                        const endDateStr = loan.loanEndDate.includes('-') && loan.loanEndDate.split('-').length === 2 
                          ? loan.loanEndDate + '-01' 
                          : loan.loanEndDate;
                        endDate = new Date(endDateStr);
                      }
                      
                      const remainingMonths = Math.max(0, (endDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                                             (endDate.getMonth() - currentDate.getMonth()));
                      maxRemainingMonths = Math.max(maxRemainingMonths, remainingMonths);
                    }
                  });
                  
                  const completeLoansCount = loans.filter(loan => isLoanComplete(loan)).length;
                  
                  aggregatedData = {
                    count: completeLoansCount,
                    amount: totalRemainingPrincipal,
                    monthlyPayment: totalMonthlyPayment,
                    remainingMonths: maxRemainingMonths,
                    loans
                  };
                } else {
                  // 没有完成的贷款时，确认空状态
                  aggregatedData = {
                    count: 0,
                    amount: 0,
                    monthlyPayment: 0,
                    remainingMonths: 0,
                    loans: []
                  };
                }
                
                // 保存确认时的数据状态
setLastConfirmedData({ loans, formData });
                setHasDataChanged(false);
                
                // Set skip flag to prevent existingData sync after confirmation
                skipExistingSyncRef.current = true;
                setTimeout(() => {
                  skipExistingSyncRef.current = false;
                }, 100);
                
                onConfirm(category.id, aggregatedData);
              }}
              className={`w-full h-10 text-sm font-semibold rounded-lg transition-all duration-300 ${
                isConfirmed && !hasDataChanged
                  ? 'bg-[#B3EBEF]/50 text-gray-500'
                  : 'bg-[#B3EBEF] hover:bg-[#8FD8DC] text-gray-900'
              }`}
              disabled={loans.length > 0 && !loans.every(loan => isLoanComplete(loan))}
            >
              <Check className="w-3 h-3 mr-2" />
              {isConfirmed && !hasDataChanged ? '已确认' : '确认房贷信息'}
            </Button>
          </FSSharedLoanModule>
        ) : category.type === 'carLoan' ? (
          /* 车贷使用SharedCarLoanModule */
          <SharedCarLoanModule 
            existingData={existingData?.carLoans}
            carLoans={carLoans}
            addCarLoan={addCarLoan}
            removeCarLoan={(id: string) => {
              const loanToRemove = carLoans.find(loan => loan.id === id);
              removeCarLoan(id);
              
              // 检查删除后是否没有完成的贷款了
              if (loanToRemove && isCarLoanComplete(loanToRemove)) {
                const remainingCompleteLoans = carLoans.filter(loan => loan.id !== id && isCarLoanComplete(loan));
                if (remainingCompleteLoans.length === 0) {
                  setTimeout(() => {
                    const aggregatedData = {
                      count: 0,
                      amount: 0,
                      monthlyPayment: 0,
                      remainingMonths: 0,
                      remainingInterest: 0,
                      carLoans: []
                    };
                    onConfirm(category.id, aggregatedData);
                  }, 0);
                }
              }
            }}
            resetCarLoan={(id: string) => {
              const loanToReset = carLoans.find(loan => loan.id === id);
              resetCarLoan(id);
              
              // 检查重置后是否没有完成的贷款了
              if (loanToReset && isCarLoanComplete(loanToReset)) {
                const remainingCompleteLoans = carLoans.filter(loan => loan.id !== id || !isCarLoanComplete(loan));
                if (remainingCompleteLoans.length === 0) {
                  setTimeout(() => {
                    const aggregatedData = {
                      count: 0,
                      amount: 0,
                      monthlyPayment: 0,
                      remainingMonths: 0,
                      remainingInterest: 0,
                      carLoans: []
                    };
                    onConfirm(category.id, aggregatedData);
                  }, 0);
                }
              }
            }}
            updateCarLoan={updateCarLoan}
            isCarLoanComplete={isCarLoanComplete}
          >
            <Button 
              onClick={() => {
                // 汇总车贷数据并确认
                const aggregatedData = getCarLoanAggregatedData();
                if (aggregatedData.count > 0) {
                  // 保存车贷数据到localStorage用于还款日历
                  localStorage.setItem('car_loan_data', JSON.stringify(carLoans.filter(isCarLoanComplete)));
                  
                  // 保存确认时的数据状态
setLastConfirmedData({ carLoans });
                  setHasDataChanged(false);
                  
                  // Set skip flag to prevent existingData sync after confirmation
                  skipExistingSyncRef.current = true;
                  setTimeout(() => {
                    skipExistingSyncRef.current = false;
                  }, 100);
                  
                  onConfirm(category.id, {
                    amount: aggregatedData.totalRemainingPrincipal,
                    count: aggregatedData.count,
                    monthlyPayment: aggregatedData.totalMonthlyPayment,
                    remainingMonths: aggregatedData.maxRemainingMonths,
                    remainingPrincipal: aggregatedData.totalRemainingPrincipal,
                    remainingInterest: aggregatedData.totalRemainingInterest,
                    carLoans: carLoans // 保存原始车贷数据用于后续编辑
                  });
                }
              }}
              className={`w-full h-10 text-sm font-semibold rounded-lg transition-all duration-300 ${
                isConfirmed && !hasDataChanged
                  ? 'bg-[#B3EBEF]/50 text-gray-500'
                  : 'bg-[#B3EBEF] hover:bg-[#8FD8DC] text-gray-900'
              }`}
              disabled={carLoans.length === 0 || !carLoans.every(isCarLoanComplete)}
            >
              <Check className="w-3 h-3 mr-2" />
              {isConfirmed && !hasDataChanged ? '已确认' : '确认车贷信息'}
            </Button>
          </SharedCarLoanModule>
        ) : category.type === 'consumerLoan' ? (
          /* 消费贷使用SharedConsumerLoanModule */
          <SharedConsumerLoanModule 
            existingData={existingData?.consumerLoans}
            consumerLoans={consumerLoans}
            addConsumerLoan={addConsumerLoan}
            removeConsumerLoan={(id: string) => {
              const loanToRemove = consumerLoans.find(loan => loan.id === id);
              removeConsumerLoan(id);
              
              // 检查删除后是否没有完成的贷款了
              if (loanToRemove && isConsumerLoanComplete(loanToRemove)) {
                const remainingCompleteLoans = consumerLoans.filter(loan => loan.id !== id && isConsumerLoanComplete(loan));
                if (remainingCompleteLoans.length === 0) {
                  setTimeout(() => {
                    const aggregatedData = {
                      count: 0,
                      amount: 0,
                      monthlyPayment: 0,
                      remainingMonths: 0,
                      remainingInterest: 0,
                      consumerLoans: []
                    };
                    onConfirm(category.id, aggregatedData);
                  }, 0);
                }
              }
            }}
            resetConsumerLoan={(id: string) => {
              const loanToReset = consumerLoans.find(loan => loan.id === id);
              resetConsumerLoan(id);
              
              // 检查重置后是否没有完成的贷款了
              if (loanToReset && isConsumerLoanComplete(loanToReset)) {
                const remainingCompleteLoans = consumerLoans.filter(loan => loan.id !== id || !isConsumerLoanComplete(loan));
                if (remainingCompleteLoans.length === 0) {
                  setTimeout(() => {
                    const aggregatedData = {
                      count: 0,
                      amount: 0,
                      monthlyPayment: 0,
                      remainingMonths: 0,
                      remainingInterest: 0,
                      consumerLoans: []
                    };
                    onConfirm(category.id, aggregatedData);
                  }, 0);
                }
              }
            }}
            updateConsumerLoan={updateConsumerLoan}
            isConsumerLoanComplete={isConsumerLoanComplete}
          >
            <Button 
              onClick={() => {
                // 汇总消费贷数据并确认
                const aggregatedData = getConsumerLoanAggregatedData();
                if (aggregatedData.count > 0) {
                  // 保存确认时的数据状态
setLastConfirmedData({ consumerLoans });
                  setHasDataChanged(false);
                  
                  // Set skip flag to prevent existingData sync after confirmation
                  skipExistingSyncRef.current = true;
                  setTimeout(() => {
                    skipExistingSyncRef.current = false;
                  }, 100);
                  
                  onConfirm(category.id, {
                    amount: aggregatedData.totalLoanAmount,
                    monthlyPayment: aggregatedData.totalMonthlyPayment,
                    remainingMonths: aggregatedData.maxRemainingMonths,
                    remainingInterest: aggregatedData.totalRemainingInterest,
                    consumerLoans: consumerLoans // 保存原始消费贷数据用于后续编辑
                  });
                }
              }}
              className={`w-full h-10 text-sm font-semibold rounded-lg transition-all duration-300 ${
                isConfirmed && !hasDataChanged
                  ? 'bg-[#B3EBEF]/50 text-gray-500'
                  : 'bg-[#B3EBEF] hover:bg-[#8FD8DC] text-gray-900'
              }`}
              disabled={consumerLoans.length === 0 || !consumerLoans.every(isConsumerLoanComplete)}
            >
              <Check className="w-3 h-3 mr-2" />
              {isConfirmed && !hasDataChanged ? '已确认' : '确认消费贷信息'}
            </Button>
          </SharedConsumerLoanModule>
        ) : category.type === 'businessLoan' ? (
          /* 经营贷使用SharedBusinessLoanModule */
          <SharedBusinessLoanModule 
            existingData={existingData?.businessLoans}
            businessLoans={businessLoans}
            addBusinessLoan={addBusinessLoan}
            removeBusinessLoan={(id: string) => {
              const loanToRemove = businessLoans.find(loan => loan.id === id);
              removeBusinessLoan(id);
              
              // 检查删除后是否没有完成的贷款了
              if (loanToRemove && isBusinessLoanComplete(loanToRemove)) {
                const remainingCompleteLoans = businessLoans.filter(loan => loan.id !== id && isBusinessLoanComplete(loan));
                if (remainingCompleteLoans.length === 0) {
                  setTimeout(() => {
                    const aggregatedData = {
                      count: 0,
                      amount: 0,
                      monthlyPayment: 0,
                      remainingMonths: 0,
                      remainingInterest: 0,
                      businessLoans: []
                    };
                    onConfirm(category.id, aggregatedData);
                  }, 0);
                }
              }
            }}
            resetBusinessLoan={(id: string) => {
              const loanToReset = businessLoans.find(loan => loan.id === id);
              resetBusinessLoan(id);
              
              // 检查重置后是否没有完成的贷款了  
              if (loanToReset && isBusinessLoanComplete(loanToReset)) {
                const remainingCompleteLoans = businessLoans.filter(loan => loan.id !== id || !isBusinessLoanComplete(loan));
                if (remainingCompleteLoans.length === 0) {
                  setTimeout(() => {
                    const aggregatedData = {
                      count: 0,
                      amount: 0,
                      monthlyPayment: 0,
                      remainingMonths: 0,
                      remainingInterest: 0,
                      businessLoans: []
                    };
                    onConfirm(category.id, aggregatedData);
                  }, 0);
                }
              }
            }}
            updateBusinessLoan={updateBusinessLoan}
            isBusinessLoanComplete={isBusinessLoanComplete}
          >
            <Button 
              onClick={() => {
                // 汇总经营贷数据并确认
                const aggregatedData = getBusinessLoanAggregatedData();
                if (aggregatedData.count > 0) {
                  // 保存确认时的数据状态
setLastConfirmedData({ businessLoans });
                  setHasDataChanged(false);
                  
                  // Set skip flag to prevent existingData sync after confirmation
                  skipExistingSyncRef.current = true;
                  setTimeout(() => {
                    skipExistingSyncRef.current = false;
                  }, 100);
                  
                  onConfirm(category.id, {
                    amount: aggregatedData.totalLoanAmount,
                    monthlyPayment: aggregatedData.totalMonthlyPayment,
                    remainingMonths: aggregatedData.maxRemainingMonths,
                    remainingInterest: aggregatedData.totalRemainingInterest,
                    businessLoans: businessLoans // 保存原始经营贷数据用于后续编辑
                  });
                }
              }}
              className={`w-full h-10 text-sm font-semibold rounded-lg transition-all duration-300 ${
                isConfirmed && !hasDataChanged
                  ? 'bg-[#B3EBEF]/50 text-gray-500'
                  : 'bg-[#B3EBEF] hover:bg-[#8FD8DC] text-gray-900'
              }`}
              disabled={businessLoans.length === 0 || !businessLoans.every(isBusinessLoanComplete)}
            >
              <Check className="w-3 h-3 mr-2" />
              {isConfirmed && !hasDataChanged ? '已确认' : '确认经营贷信息'}
            </Button>
          </SharedBusinessLoanModule>
        ) : category.type === 'privateLoan' ? (
          /* 民间借贷使用SharedPrivateLoanModule */
          <SharedPrivateLoanModule 
            existingData={existingData?.privateLoans}
            privateLoans={privateLoans}
            addPrivateLoan={addPrivateLoan}
            removePrivateLoan={(id: string) => {
              const loanToRemove = privateLoans.find(loan => loan.id === id);
              removePrivateLoan(id);
              
              // 检查删除后是否没有完成的贷款了
              if (loanToRemove && isPrivateLoanComplete(loanToRemove)) {
                const remainingCompleteLoans = privateLoans.filter(loan => loan.id !== id && isPrivateLoanComplete(loan));
                if (remainingCompleteLoans.length === 0) {
                  setTimeout(() => {
                    const aggregatedData = {
                      count: 0,
                      amount: 0,
                      monthlyPayment: 0,
                      remainingMonths: 0,
                      remainingInterest: 0,
                      privateLoans: []
                    };
                    onConfirm(category.id, aggregatedData);
                  }, 0);
                }
              }
            }}
            resetPrivateLoan={(id: string) => {
              const loanToReset = privateLoans.find(loan => loan.id === id);
              resetPrivateLoan(id);
              
              // 检查重置后是否没有完成的贷款了
              if (loanToReset && isPrivateLoanComplete(loanToReset)) {
                const remainingCompleteLoans = privateLoans.filter(loan => loan.id !== id || !isPrivateLoanComplete(loan));
                if (remainingCompleteLoans.length === 0) {
                  setTimeout(() => {
                    const aggregatedData = {
                      count: 0,
                      amount: 0,
                      monthlyPayment: 0,
                      remainingMonths: 0,
                      remainingInterest: 0,
                      privateLoans: []
                    };
                    onConfirm(category.id, aggregatedData);
                  }, 0);
                }
              }
            }}
            updatePrivateLoan={updatePrivateLoan}
            isPrivateLoanComplete={isPrivateLoanComplete}
            updateRateFen={updateRateFen}
            updateRateLi={updateRateLi}
          >
            <Button 
              onClick={() => {
                // 汇总民间借贷数据并确认
                const aggregatedData = getPrivateLoanAggregatedData();
                if (aggregatedData.count > 0) {
                  // 保存确认时的数据状态
setLastConfirmedData({ privateLoans });
                  setHasDataChanged(false);
                  
                  // Set skip flag to prevent existingData sync after confirmation
                  skipExistingSyncRef.current = true;
                  setTimeout(() => {
                    skipExistingSyncRef.current = false;
                  }, 100);
                  
                  onConfirm(category.id, {
                    amount: aggregatedData.totalLoanAmount,
                    monthlyPayment: aggregatedData.totalMonthlyPayment,
                    remainingMonths: aggregatedData.maxRemainingMonths,
                    remainingInterest: aggregatedData.totalRemainingInterest,
                    privateLoans: privateLoans // 保存原始民间借贷数据用于后续编辑
                  });
                }
              }}
              className={`w-full h-10 text-sm font-semibold rounded-lg transition-all duration-300 ${
                isConfirmed && !hasDataChanged
                  ? 'bg-[#B3EBEF]/50 text-gray-500'
                  : 'bg-[#B3EBEF] hover:bg-[#8FD8DC] text-gray-900'
              }`}
              disabled={privateLoans.length === 0 || !privateLoans.every(isPrivateLoanComplete)}
            >
              <Check className="w-3 h-3 mr-2" />
              {isConfirmed && !hasDataChanged ? '已确认' : '确认民间借贷信息'}
            </Button>
          </SharedPrivateLoanModule>
        ) : category.type === 'creditCard' ? (
          /* 信用卡使用SharedCreditCardModule */
          <SharedCreditCardModule 
            existingData={existingData?.creditCards}
            creditCards={creditCards}
            addCreditCard={addCreditCard}
            removeCreditCard={(id: string) => {
              const cardToRemove = creditCards.find(card => card.id === id);
              removeCreditCard(id);
              
              // 检查删除后是否没有完成的信用卡了
              if (cardToRemove && isCreditCardComplete(cardToRemove)) {
                const remainingCompleteCards = creditCards.filter(card => card.id !== id && isCreditCardComplete(card));
                if (remainingCompleteCards.length === 0) {
                  setTimeout(() => {
                    const aggregatedData = {
                      count: 0,
                      amount: 0,
                      monthlyPayment: 0,
                      remainingMonths: 0,
                      creditCards: []
                    };
                    onConfirm(category.id, aggregatedData);
                  }, 0);
                }
              }
            }}
            resetCreditCard={(id: string) => {
              const cardToReset = creditCards.find(card => card.id === id);
              resetCreditCard(id);
              
              // 检查重置后是否没有完成的信用卡了
              if (cardToReset && isCreditCardComplete(cardToReset)) {
                const remainingCompleteCards = creditCards.filter(card => card.id !== id || !isCreditCardComplete(card));
                if (remainingCompleteCards.length === 0) {
                  setTimeout(() => {
                    const aggregatedData = {
                      count: 0,
                      amount: 0,
                      monthlyPayment: 0,
                      remainingMonths: 0,
                      creditCards: []
                    };
                    onConfirm(category.id, aggregatedData);
                  }, 0);
                }
              }
            }}
            updateCreditCard={updateCreditCard}
            isCreditCardComplete={isCreditCardComplete}
          >
            <Button 
              onClick={() => {
                // 汇总信用卡数据并确认
                const aggregatedData = getCreditCardAggregatedData();
                if (aggregatedData.count > 0) {
                  // 保存确认时的数据状态
setLastConfirmedData({ creditCards });
                  setHasDataChanged(false);
                  
                  // Set skip flag to prevent existingData sync after confirmation
                  skipExistingSyncRef.current = true;
                  setTimeout(() => {
                    skipExistingSyncRef.current = false;
                  }, 100);
                  
                  onConfirm(category.id, {
                    amount: aggregatedData.totalAmount, // 万元
                    monthlyPayment: 0, // 信用卡没有固定月供
                    remainingMonths: 0,
                    creditCards: creditCards // 保存原始信用卡数据用于后续编辑
                  });
                }
              }}
              className={`w-full h-10 text-sm font-semibold rounded-lg transition-all duration-300 ${
                isConfirmed && !hasDataChanged
                  ? 'bg-[#B3EBEF]/50 text-gray-500'
                  : 'bg-[#B3EBEF] hover:bg-[#8FD8DC] text-gray-900'
              }`}
              disabled={creditCards.length === 0 || !creditCards.every(isCreditCardComplete)}
            >
              <Check className="w-3 h-3 mr-2" />
              {isConfirmed && !hasDataChanged ? '已确认' : '确认信用卡信息'}
            </Button>
          </SharedCreditCardModule>
        ) : (
          /* 其他债务类型保持原有逻辑 */
          <div className="px-3 py-3">
            {/* 其他负债基础字段 */}
            {renderBasicDebtFields()}

            {/* 确认按钮 */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <Button 
                onClick={handleConfirm}
                className="w-full h-10 text-sm bg-[#B3EBEF] hover:bg-[#8FD8DC] text-gray-900 font-semibold rounded-lg"
                disabled={!canConfirm()}
              >
                <Check className="w-3 h-3 mr-2" />
                确认{category.name}信息
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DebtConfiguration;
