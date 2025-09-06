import React, { useState, useEffect, useId, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { Home, Car, CreditCard, ShoppingCart, Check, Edit, CalendarIcon, Percent, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
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
  isExpanded: boolean;
  onToggleExpand: () => void;
}> = ({
  loan,
  index,
  updateLoan,
  removeLoan,
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
  isExpanded,
  onToggleExpand,
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
      {/* 收起时的摘要显示 */}
      {!isExpanded && (
        <div 
          className="rounded-lg py-6 px-3 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
          style={{ border: '2px solid #CAF4F7' }}
          onClick={onToggleExpand}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-medium text-gray-900">
                {loan.propertyName || `房贷 ${index + 1}`}
              </h4>
              <span className="text-xs px-2 py-1 bg-white/80 rounded text-gray-600">
                {loan.loanType === 'commercial' ? '商业贷款' : 
                 loan.loanType === 'provident' ? '公积金贷款' : '组合贷款'}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {/* 贷款基本信息展示 */}
            <div className="grid grid-cols-3 gap-3 border-b border-white pb-2">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">原始贷款本金</div>
                <div className="text-sm font-bold text-gray-900">
                  {loan.loanAmount || '未设置'}万元
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">利率</div>
                <div className="text-sm font-bold text-gray-900">
                  {loan.rateType === 'fixed' ? `${loan.fixedRate || '未设置'}%` : `LPR${loan.floatingRateAdjustment || '+0'}BP`}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">月供</div>
                <div className="text-sm font-bold text-gray-900">
                  {stats?.currentMonthlyPayment ? `${Math.round(stats.currentMonthlyPayment).toLocaleString()}元` : '计算中...'}
                </div>
              </div>
            </div>
            
            {/* 时间进度 */}
            <div>
                <div className="grid grid-cols-3 gap-3 mb-2">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">已还时间</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {stats?.paidMonths || 0}个月
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">剩余时间</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {(stats?.totalMonths || 0) - (stats?.paidMonths || 0)}个月
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">进度</div>
                  <div className="text-sm font-semibold" style={{ color: '#01BCD6' }}>
                    {stats?.timeProgress?.toFixed(1) || '0.0'}%
                  </div>
                </div>
              </div>
              <Progress value={stats?.timeProgress || 0} className="h-2" />
            </div>

            {/* 本金进度 - 只有输入了原始金额才显示 */}
            {stats?.hasOriginalAmount && (
              <div>
                <div className="grid grid-cols-3 gap-3 mb-2">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">已还本金</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {((stats?.paidPrincipal || 0) / 10000).toFixed(1)}万元
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">待还本金</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {(((stats?.totalPrincipal || 0) - (stats?.paidPrincipal || 0)) / 10000).toFixed(1)}万元
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">进度</div>
                    <div className="text-sm font-semibold" style={{ color: '#01BCD6' }}>
                      {stats?.principalProgress?.toFixed(1) || '0.0'}%
                    </div>
                  </div>
                </div>
                <Progress value={stats?.principalProgress || 0} className="h-2" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 展开时的编辑表单 */}
      <Collapsible open={isExpanded} onOpenChange={onToggleExpand}>
        <CollapsibleContent>
          {isExpanded && (
            <div className="rounded-lg py-6 px-3 bg-white" style={{ border: '2px solid #CAF4F7' }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">
                  {loan.propertyName || `房贷 ${index + 1}`}
                </h4>
                <div className="flex items-center space-x-1">
                  {loansLength > 1 && (
                    <button 
                      onClick={() => removeLoan(loan.id)}
                      className="p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700"
                      title="删除此房贷"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <button 
                    onClick={onToggleExpand}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
            {/* 第一行：房产名 + 贷款类型 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 min-w-0">
                <Label className="text-xs font-medium">
                  房产名称 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`property-${loan.id}`}
                  type="text"
                  placeholder="如：海淀某小区"
                  value={loan.propertyName}
                  onChange={(e) => updateLoan(loan.id, 'propertyName', e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-2 min-w-0">
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
                  <SelectTrigger className="h-9 text-sm w-full focus:ring-0 focus:ring-offset-0">
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
                <div className="space-y-2 min-w-0">
                  <Label className="text-xs font-medium">
                    贷款原始金额(万元)
                  </Label>
                  <Input
                    type="text"
                    placeholder="如：300"
                    value={loan.loanAmount}
                    onChange={(e) => updateLoan(loan.id, 'loanAmount', e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-2 min-w-0">
                  <Label className="text-xs font-medium">
                     贷款剩余本金(万元) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="如：200"
                    value={loan.remainingPrincipal || ''}
                    onChange={(e) => updateLoan(loan.id, 'remainingPrincipal', e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            )}

            {/* 第三行：贷款开始/结束日期（非组合贷款） */}
            {loan.loanType !== 'combination' && (
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="space-y-2 min-w-0">
                  <Label className="text-xs font-medium">
                    贷款开始日期 <span className="text-red-500">*</span>
                  </Label>
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-9 w-full justify-start text-left font-normal",
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
                <div className="space-y-2 min-w-0">
                  <Label className="text-xs font-medium">
                    贷款结束日期 <span className="text-red-500">*</span>
                  </Label>
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-9 w-full justify-start text-left font-normal",
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
                <div className="space-y-2 min-w-0">
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
                <div className="space-y-2 min-w-0">
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
                    <div className="space-y-2 min-w-0">
                      <Label className="text-xs font-medium">
                        固定利率(%) <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="如：4.9"
                          value={loan.fixedRate}
                          onChange={(e) => updateLoan(loan.id, 'fixedRate', e.target.value)}
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
                        id={`rate-${loan.id}`}
                        type="number"
                        step="1"
                        placeholder="如：-30(减30个基点) 或 +50(加50个基点)"
                        value={loan.floatingRateAdjustment}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || /^-?\d+$/.test(value)) {
                            updateLoan(loan.id, 'floatingRateAdjustment', value);
                          }
                        }}
                        className="h-9 w-full min-w-0 box-border rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                            ¥{Math.round(calculateMonthlyPayment(loan)).toLocaleString()}
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
                <div className="space-y-2 min-w-0">
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
                <div className="space-y-2 min-w-0">
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
                          ¥{Math.round(calculateMonthlyPayment(loan)).toLocaleString()}
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
                  <div className="space-y-2 min-w-0">
                    <Label className="text-xs font-medium">
                      商业贷款金额(万元)
                    </Label>
                    <Input
                      type="text"
                      placeholder="如：250"
                      value={loan.commercialLoanAmount}
                      onChange={(e) => updateLoan(loan.id, 'commercialLoanAmount', e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2 min-w-0">
                    <Label className="text-xs font-medium">
                      商业剩余本金(万元) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="如：180"
                      value={loan.commercialRemainingPrincipal || ''}
                      onChange={(e) => updateLoan(loan.id, 'commercialRemainingPrincipal', e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                {/* 商业贷款开始和结束日期 */}
                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div className="space-y-2 min-w-0">
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
                            updateLoan(loan.id, 'commercialStartDate', date ? format(date, "yyyy-MM-dd") : '');
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
                  <div className="space-y-2 min-w-0">
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
                            updateLoan(loan.id, 'commercialEndDate', date ? format(date, "yyyy-MM-dd") : '');
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
                  <div className="space-y-2 min-w-0">
                    <Label className="text-xs font-medium">
                      还款方式 <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={loan.commercialPaymentMethod}
                      onValueChange={(value) => updateLoan(loan.id, 'commercialPaymentMethod', value)}
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
                  <div className="space-y-2 min-w-0">
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
                    <div className="space-y-2 min-w-0">
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
                        className="h-9 w-full min-w-0 box-border rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                            ¥{Math.round(calculateCommercialMonthlyPayment(loan)).toLocaleString()}
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
                  <div className="space-y-2 min-w-0">
                    <Label className="text-xs font-medium">
                      公积金贷款金额(万元)
                    </Label>
                    <Input
                      type="text"
                      placeholder="如：50"
                      value={loan.providentLoanAmount}
                      onChange={(e) => updateLoan(loan.id, 'providentLoanAmount', e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2 min-w-0">
                    <Label className="text-xs font-medium">
                      公积金剩余本金(万元) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="如：20"
                      value={loan.providentRemainingPrincipal || ''}
                      onChange={(e) => updateLoan(loan.id, 'providentRemainingPrincipal', e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                {/* 公积金贷款开始和结束日期 */}
                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div className="space-y-2 min-w-0">
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
                  <div className="space-y-2 min-w-0">
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
                  <div className="space-y-2 min-w-0">
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
                  <div className="space-y-2 min-w-0">
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
                            ¥{Math.round(calculateProvidentMonthlyPayment(loan)).toLocaleString()}
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
                      {Math.round(calculateCommercialMonthlyPayment(loan) + calculateProvidentMonthlyPayment(loan)).toLocaleString()}元
                    </span>
                  </div>
                </div>
              </>
            )}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
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
  const { loans, updateLoan, addLoan, removeLoan, setLoans } = useLoanData({ persist: false });
  
  // Carloan hooks
  const { 
    carLoans, 
    addCarLoan, 
    removeCarLoan, 
    updateCarLoan, 
    isCarLoanComplete 
  } = useCarLoanData();
  
  // Consumer loan hooks
  const { 
    consumerLoans, 
    addConsumerLoan, 
    removeConsumerLoan, 
    updateConsumerLoan, 
    isConsumerLoanComplete 
  } = useConsumerLoanData();
  
  // Business loan hooks
  const { 
    businessLoans, 
    addBusinessLoan, 
    removeBusinessLoan, 
    updateBusinessLoan, 
    isBusinessLoanComplete 
  } = useBusinessLoanData();
  
  // Private loan hooks
  const { 
    privateLoans, 
    addPrivateLoan, 
    removePrivateLoan, 
    updatePrivateLoan, 
    isPrivateLoanComplete,
    updateRateFen,
    updateRateLi 
  } = usePrivateLoanData();
  
  // Credit card hooks
  const { 
    creditCards, 
    addCreditCard, 
    removeCreditCard, 
    updateCreditCard, 
    isCreditCardComplete 
  } = useCreditCardData();

  // 基础表单数据
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  
  // 用于跟踪数据变化
  const [lastConfirmedData, setLastConfirmedData] = useState<any>(null);
  const [hasDataChanged, setHasDataChanged] = useState(false);
  const skipExistingSyncRef = useRef(false);

  // LPR 利率常量
  const currentLPR_5Year = 3.50; // 5年期LPR（公积金）
  const currentLPR_5YearPlus = 3.50; // 5年期以上LPR（商业）

  // Check if data has changed since last confirmation
  useEffect(() => {
    if (!lastConfirmedData) return;
    
    const currentData = {
      loans,
      carLoans,
      consumerLoans,
      businessLoans,
      privateLoans,
      creditCards,
      formData
    };
    
    const changed = JSON.stringify(currentData) !== JSON.stringify(lastConfirmedData);
    setHasDataChanged(changed);
  }, [loans, carLoans, consumerLoans, businessLoans, privateLoans, creditCards, formData, lastConfirmedData]);

  // Sync with existing data when component mounts or existingData changes
  useEffect(() => {
    if (existingData && !skipExistingSyncRef.current) {
      if (existingData.loans && category.type === 'mortgage') {
        setLoans(existingData.loans);
      }
      if (existingData.formData) {
        setFormData(existingData.formData);
      }
    }
  }, [existingData, category.type, setLoans]);

  // 汇总车贷数据
  const getCarLoanAggregatedData = () => {
    const completeCarLoans = carLoans.filter(isCarLoanComplete);
    const totalMonthlyPayment = completeCarLoans.reduce((sum, carLoan) => {
      return sum + parseFloat(carLoan.installmentAmount || '0');
    }, 0);
    
    const maxRemainingMonths = completeCarLoans.reduce((max, carLoan) => {
      return Math.max(max, parseInt(carLoan.remainingInstallments || '0'));
    }, 0);
    
    return {
      count: completeCarLoans.length,
      totalMonthlyPayment,
      maxRemainingMonths
    };
  };

  // 汇总消费贷数据
  const getConsumerLoanAggregatedData = () => {
    const completeConsumerLoans = consumerLoans.filter(isConsumerLoanComplete);
    const totalLoanAmount = completeConsumerLoans.reduce((sum, loan) => {
      return sum + parseFloat(loan.loanAmount || '0');
    }, 0);
    
    // Calculate monthly payment based on loan amount, term and rate
    const totalMonthlyPayment = completeConsumerLoans.reduce((sum, loan) => {
      const principal = parseFloat(loan.loanAmount || '0') * 10000; // Convert to yuan
      const rate = parseFloat(loan.annualRate || '0') / 100 / 12; // Monthly rate
      const term = parseFloat(loan.loanTerm || '0') * 12; // Total months
      
      if (principal > 0 && rate > 0 && term > 0) {
        const monthlyPayment = principal * rate * Math.pow(1 + rate, term) / (Math.pow(1 + rate, term) - 1);
        return sum + monthlyPayment;
      }
      return sum;
    }, 0);
    
    const maxRemainingMonths = completeConsumerLoans.reduce((max, loan) => {
      const termMonths = parseFloat(loan.loanTerm || '0') * 12;
      return Math.max(max, termMonths);
    }, 0);
    
    return {
      count: completeConsumerLoans.length,
      totalLoanAmount,
      totalMonthlyPayment,
      maxRemainingMonths
    };
  };

  // 汇总经营贷数据
  const getBusinessLoanAggregatedData = () => {
    const completeBusinessLoans = businessLoans.filter(isBusinessLoanComplete);
    const totalLoanAmount = completeBusinessLoans.reduce((sum, loan) => {
      return sum + parseFloat(loan.loanAmount || '0');
    }, 0);
    
    // Calculate monthly payment based on loan amount, term and rate  
    const totalMonthlyPayment = completeBusinessLoans.reduce((sum, loan) => {
      const principal = parseFloat(loan.loanAmount || '0') * 10000; // Convert to yuan
      const rate = parseFloat(loan.annualRate || '0') / 100 / 12; // Monthly rate
      const term = parseFloat(loan.loanTerm || '0') * 12; // Total months
      
      if (principal > 0 && rate > 0 && term > 0) {
        const monthlyPayment = principal * rate * Math.pow(1 + rate, term) / (Math.pow(1 + rate, term) - 1);
        return sum + monthlyPayment;
      }
      return sum;
    }, 0);
    
    const maxRemainingMonths = completeBusinessLoans.reduce((max, loan) => {
      const termMonths = parseFloat(loan.loanTerm || '0') * 12;
      return Math.max(max, termMonths);
    }, 0);
    
    return {
      count: completeBusinessLoans.length,
      totalLoanAmount,
      totalMonthlyPayment,
      maxRemainingMonths
    };
  };

  // 汇总民间借贷数据
  const getPrivateLoanAggregatedData = () => {
    const completePrivateLoans = privateLoans.filter(isPrivateLoanComplete);
    const totalLoanAmount = completePrivateLoans.reduce((sum, loan) => {
      return sum + parseFloat(loan.loanAmount || '0');
    }, 0);
    
    // For private loans, we only have the loan amount, no specific monthly payment calculation
    // Assume a default simple calculation or return 0 for monthly payment
    const totalMonthlyPayment = 0; // Private loans don't have structured monthly payments
    
    // Private loans don't have specific term, assume 12 months default
    const maxRemainingMonths = 12;
    
    return {
      count: completePrivateLoans.length,
      totalLoanAmount,
      totalMonthlyPayment,
      maxRemainingMonths
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
      
      setLastConfirmedData({
        loans,
        carLoans,
        consumerLoans,
        businessLoans,
        privateLoans,
        creditCards,
        formData
      });
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
    if (category.type === 'mortgage' && onDataChange && loans.length > 0) {
      let completeLoanCount = 0;
      let totalRemainingPrincipal = 0;
      let totalMonthlyPayment = 0;
      let maxRemainingMonths = 0;
      
      loans.forEach(loan => {
        if (isLoanComplete(loan)) {
          completeLoanCount++;
          
          // Calculate remaining principal in 万元
          if (loan.loanType === 'combination') {
            const commercialRemaining = parseFloat(loan.commercialRemainingPrincipal || '0') / 10000;
            const providentRemaining = parseFloat(loan.providentRemainingPrincipal || '0') / 10000;
            totalRemainingPrincipal += commercialRemaining + providentRemaining;
          } else {
            const remaining = parseFloat(String(loan.remainingPrincipal || '0').replace(/[,\\s]/g, '')) / 10000;
            totalRemainingPrincipal += remaining;
          }
          
          // Calculate monthly payment in 元
          totalMonthlyPayment += calculateMonthlyPayment(loan);
          
          // Calculate remaining months
          let startDate, endDate;
          if (loan.loanType === 'combination') {
            startDate = new Date((loan.commercialStartDate || '') + '-01');
            endDate = new Date((loan.commercialEndDate || '') + '-01');
          } else {
            startDate = new Date(loan.loanStartDate + '-01');
            endDate = new Date(loan.loanEndDate + '-01');
          }
          
          const currentDate = new Date();
          const remainingMonths = (endDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                                 (endDate.getMonth() - currentDate.getMonth());
          
          maxRemainingMonths = Math.max(maxRemainingMonths, Math.max(0, remainingMonths));
        }
      });
      
      // 如果有完成的贷款，计算并发送实时数据
      if (completeLoanCount > 0) {
        // 计算待还利息（万元）
        const totalRemainingInterest = totalMonthlyPayment * maxRemainingMonths / 10000 - totalRemainingPrincipal;
        
        // 通知父组件实时数据变化
        const liveData = {
          count: completeLoanCount,
          remainingPrincipal: totalRemainingPrincipal,
          remainingInterest: Math.max(0, totalRemainingInterest),
          monthlyPayment: totalMonthlyPayment,
          remainingMonths: maxRemainingMonths
        };
        
        onDataChange(category.id, liveData);
      }
    }
  }, [loans, category.type, category.id, onDataChange, isLoanComplete, calculateMonthlyPayment]);
  
  // 车贷实时数据更新
  useEffect(() => {
    if (category.type === 'carLoan' && onDataChange && carLoans.length > 0) {
      const aggregatedData = getCarLoanAggregatedData();
      if (aggregatedData.count > 0) {
        onDataChange(category.id, {
          count: aggregatedData.count,
          monthlyPayment: aggregatedData.totalMonthlyPayment,
          remainingMonths: aggregatedData.maxRemainingMonths
        });
      }
    }
  }, [carLoans, category.type, category.id, onDataChange, getCarLoanAggregatedData]);
  
  // 消费贷实时数据更新
  useEffect(() => {
    if (category.type === 'consumerLoan' && onDataChange && consumerLoans.length > 0) {
      const aggregatedData = getConsumerLoanAggregatedData();
      if (aggregatedData.count > 0) {
        onDataChange(category.id, {
          count: aggregatedData.count,
          amount: aggregatedData.totalLoanAmount, // 消费贷使用总贷款金额
          monthlyPayment: aggregatedData.totalMonthlyPayment,
          remainingMonths: aggregatedData.maxRemainingMonths
        });
      }
    }
  }, [consumerLoans, category.type, category.id, onDataChange, getConsumerLoanAggregatedData]);
  
  // 经营贷实时数据更新
  useEffect(() => {
    if (category.type === 'businessLoan' && onDataChange && businessLoans.length > 0) {
      const aggregatedData = getBusinessLoanAggregatedData();
      if (aggregatedData.count > 0) {
        onDataChange(category.id, {
          count: aggregatedData.count,
          amount: aggregatedData.totalLoanAmount,
          monthlyPayment: aggregatedData.totalMonthlyPayment,
          remainingMonths: aggregatedData.maxRemainingMonths
        });
      }
    }
  }, [businessLoans, category.type, category.id, onDataChange, getBusinessLoanAggregatedData]);
  
  // 民间借贷实时数据更新
  useEffect(() => {
    if (category.type === 'privateLoan' && onDataChange && privateLoans.length > 0) {
      const aggregatedData = getPrivateLoanAggregatedData();
      if (aggregatedData.count > 0) {
        onDataChange(category.id, {
          count: aggregatedData.count,
          amount: aggregatedData.totalLoanAmount,
          monthlyPayment: aggregatedData.totalMonthlyPayment,
          remainingMonths: aggregatedData.maxRemainingMonths
        });
      }
    }
  }, [privateLoans, category.type, category.id, onDataChange, getPrivateLoanAggregatedData]);
  
  // 信用卡实时数据更新
  useEffect(() => {
    if (category.type === 'creditCard' && onDataChange && creditCards.length > 0) {
      const aggregatedData = getCreditCardAggregatedData();
      if (aggregatedData.count > 0) {
        onDataChange(category.id, {
          count: aggregatedData.count,
          amount: aggregatedData.totalAmount, // 使用万元
          monthlyPayment: 0, // 信用卡没有固定月供
          remainingMonths: 0
        });
      }
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
            persist={false}
          >
            <Button 
              onClick={() => {
                // Aggregate loan data and confirm
                const completeLoanExists = loans.some(loan => isLoanComplete(loan));
                if (completeLoanExists) {
                  let totalRemainingPrincipal = 0;
                  let totalMonthlyPayment = 0;
                  let maxRemainingMonths = 0;
                  
                  loans.forEach(loan => {
                    if (isLoanComplete(loan)) {
                      if (loan.loanType === 'combination') {
                        const commercialRemaining = parseFloat(loan.commercialRemainingPrincipal || '0') / 10000;
                        const providentRemaining = parseFloat(loan.providentRemainingPrincipal || '0') / 10000;
                        totalRemainingPrincipal += commercialRemaining + providentRemaining;
                      } else {
                        const remaining = parseFloat(loan.remainingPrincipal || '0') / 10000;
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
                  
                  const aggregatedData = {
                    amount: totalRemainingPrincipal,
                    monthlyPayment: totalMonthlyPayment,
                    remainingMonths: maxRemainingMonths,
                    loans
                  };
                  
                  // 保存确认时的数据状态
                  setLastConfirmedData({
                    loans,
                    carLoans,
                    consumerLoans,
                    businessLoans,
                    privateLoans,
                    creditCards,
                    formData
                  });
                  setHasDataChanged(false);
                  
                  // Set skip flag to prevent existingData sync after confirmation
                  skipExistingSyncRef.current = true;
                  setTimeout(() => {
                    skipExistingSyncRef.current = false;
                  }, 100);
                  
                  onConfirm(category.id, aggregatedData);
                }
              }}
              className={`w-full h-12 font-semibold rounded-lg transition-all duration-300 ${
                isConfirmed && !hasDataChanged
                  ? 'bg-[#B3EBEF]/50 text-gray-500'
                  : 'bg-[#B3EBEF] hover:bg-[#8FD8DC] text-gray-900'
              }`}
              disabled={!loans.some(loan => isLoanComplete(loan))}
            >
              <Check className="w-4 h-4 mr-2" />
              {isConfirmed && !hasDataChanged ? '已确认' : '确认房贷信息'}
            </Button>
          </FSSharedLoanModule>
        ) : category.type === 'carLoan' ? (
          /* 车贷使用SharedCarLoanModule */
          <SharedCarLoanModule 
            existingData={existingData?.carLoans}
            carLoans={carLoans}
            addCarLoan={addCarLoan}
            removeCarLoan={removeCarLoan}
            updateCarLoan={updateCarLoan}
            isCarLoanComplete={isCarLoanComplete}
          >
            <Button 
              onClick={() => {
                // 汇总车贷数据并确认
                const aggregatedData = getCarLoanAggregatedData();
                if (aggregatedData.count > 0) {
                  // 保存确认时的数据状态
                  setLastConfirmedData({
                    loans,
                    carLoans,
                    consumerLoans,
                    businessLoans,
                    privateLoans,
                    creditCards,
                    formData
                  });
                  setHasDataChanged(false);
                  
                  // Set skip flag to prevent existingData sync after confirmation
                  skipExistingSyncRef.current = true;
                  setTimeout(() => {
                    skipExistingSyncRef.current = false;
                  }, 100);
                  
                  onConfirm(category.id, {
                    installmentAmount: aggregatedData.totalMonthlyPayment,
                    remainingInstallments: aggregatedData.maxRemainingMonths,
                    carLoans: carLoans // 保存原始车贷数据用于后续编辑
                  });
                }
              }}
              className={`w-full h-12 font-semibold rounded-lg transition-all duration-300 ${
                isConfirmed && !hasDataChanged
                  ? 'bg-[#B3EBEF]/50 text-gray-500'
                  : 'bg-[#B3EBEF] hover:bg-[#8FD8DC] text-gray-900'
              }`}
              disabled={!carLoans.some(isCarLoanComplete)}
            >
              <Check className="w-4 h-4 mr-2" />
              {isConfirmed && !hasDataChanged ? '已确认' : '确认车贷信息'}
            </Button>
          </SharedCarLoanModule>
        ) : category.type === 'consumerLoan' ? (
          /* 消费贷使用SharedConsumerLoanModule */
          <SharedConsumerLoanModule 
            existingData={existingData?.consumerLoans}
            consumerLoans={consumerLoans}
            addConsumerLoan={addConsumerLoan}
            removeConsumerLoan={removeConsumerLoan}
            updateConsumerLoan={updateConsumerLoan}
            isConsumerLoanComplete={isConsumerLoanComplete}
          >
            <Button 
              onClick={() => {
                // 汇总消费贷数据并确认
                const aggregatedData = getConsumerLoanAggregatedData();
                if (aggregatedData.count > 0) {
                  // 保存确认时的数据状态
                  setLastConfirmedData({
                    loans,
                    carLoans,
                    consumerLoans,
                    businessLoans,
                    privateLoans,
                    creditCards,
                    formData
                  });
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
                    consumerLoans: consumerLoans // 保存原始消费贷数据用于后续编辑
                  });
                }
              }}
              className={`w-full h-12 font-semibold rounded-lg transition-all duration-300 ${
                isConfirmed && !hasDataChanged
                  ? 'bg-[#B3EBEF]/50 text-gray-500'
                  : 'bg-[#B3EBEF] hover:bg-[#8FD8DC] text-gray-900'
              }`}
              disabled={!consumerLoans.some(isConsumerLoanComplete)}
            >
              <Check className="w-4 h-4 mr-2" />
              {isConfirmed && !hasDataChanged ? '已确认' : '确认消费贷信息'}
            </Button>
          </SharedConsumerLoanModule>
        ) : category.type === 'businessLoan' ? (
          /* 经营贷使用SharedBusinessLoanModule */
          <SharedBusinessLoanModule 
            existingData={existingData?.businessLoans}
            businessLoans={businessLoans}
            addBusinessLoan={addBusinessLoan}
            removeBusinessLoan={removeBusinessLoan}
            updateBusinessLoan={updateBusinessLoan}
            isBusinessLoanComplete={isBusinessLoanComplete}
          >
            <Button 
              onClick={() => {
                // 汇总经营贷数据并确认
                const aggregatedData = getBusinessLoanAggregatedData();
                if (aggregatedData.count > 0) {
                  // 保存确认时的数据状态
                  setLastConfirmedData({
                    loans,
                    carLoans,
                    consumerLoans,
                    businessLoans,
                    privateLoans,
                    creditCards,
                    formData
                  });
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
                    businessLoans: businessLoans // 保存原始经营贷数据用于后续编辑
                  });
                }
              }}
              className={`w-full h-12 font-semibold rounded-lg transition-all duration-300 ${
                isConfirmed && !hasDataChanged
                  ? 'bg-[#B3EBEF]/50 text-gray-500'
                  : 'bg-[#B3EBEF] hover:bg-[#8FD8DC] text-gray-900'
              }`}
              disabled={!businessLoans.some(isBusinessLoanComplete)}
            >
              <Check className="w-4 h-4 mr-2" />
              {isConfirmed && !hasDataChanged ? '已确认' : '确认经营贷信息'}
            </Button>
          </SharedBusinessLoanModule>
        ) : category.type === 'privateLoan' ? (
          /* 民间借贷使用SharedPrivateLoanModule */
          <SharedPrivateLoanModule 
            existingData={existingData?.privateLoans}
            privateLoans={privateLoans}
            addPrivateLoan={addPrivateLoan}
            removePrivateLoan={removePrivateLoan}
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
                  setLastConfirmedData({
                    loans,
                    carLoans,
                    consumerLoans,
                    businessLoans,
                    privateLoans,
                    creditCards,
                    formData
                  });
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
                    privateLoans: privateLoans // 保存原始民间借贷数据用于后续编辑
                  });
                }
              }}
              className={`w-full h-12 font-semibold rounded-lg transition-all duration-300 ${
                isConfirmed && !hasDataChanged
                  ? 'bg-[#B3EBEF]/50 text-gray-500'
                  : 'bg-[#B3EBEF] hover:bg-[#8FD8DC] text-gray-900'
              }`}
              disabled={!privateLoans.some(isPrivateLoanComplete)}
            >
              <Check className="w-4 h-4 mr-2" />
              {isConfirmed && !hasDataChanged ? '已确认' : '确认民间借贷信息'}
            </Button>
          </SharedPrivateLoanModule>
        ) : category.type === 'creditCard' ? (
          /* 信用卡使用SharedCreditCardModule */
          <SharedCreditCardModule 
            existingData={existingData?.creditCards}
            creditCards={creditCards}
            addCreditCard={addCreditCard}
            removeCreditCard={removeCreditCard}
            updateCreditCard={updateCreditCard}
            isCreditCardComplete={isCreditCardComplete}
          >
            <Button 
              onClick={() => {
                // 汇总信用卡数据并确认
                const aggregatedData = getCreditCardAggregatedData();
                if (aggregatedData.count > 0) {
                  // 保存确认时的数据状态
                  setLastConfirmedData({
                    loans,
                    carLoans,
                    consumerLoans,
                    businessLoans,
                    privateLoans,
                    creditCards,
                    formData
                  });
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
              className={`w-full h-12 font-semibold rounded-lg transition-all duration-300 ${
                isConfirmed && !hasDataChanged
                  ? 'bg-[#B3EBEF]/50 text-gray-500'
                  : 'bg-[#B3EBEF] hover:bg-[#8FD8DC] text-gray-900'
              }`}
              disabled={!creditCards.some(isCreditCardComplete)}
            >
              <Check className="w-4 h-4 mr-2" />
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
                className="w-full py-3 bg-[#B3EBEF] hover:bg-[#8FD8DC] text-gray-900 font-semibold rounded-lg"
                disabled={!canConfirm()}
              >
                <Check className="w-4 h-4 mr-2" />
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
