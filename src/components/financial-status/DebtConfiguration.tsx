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
import { SharedLoanModule } from '@/components/loan/SharedLoanModule';
import { useCarLoanData } from '@/hooks/useCarLoanData';
import { TQSharedCarLoanModule } from '@/components/loan-tq/TQSharedCarLoanModule';
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

            {/* 本金进度 */}
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
                <Select value={loan.loanType} onValueChange={(value) => updateLoan(loan.id, 'loanType', value)}>
                  <SelectTrigger className="h-9 text-sm w-full">
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
                    贷款原始金额(万元) <span className="text-red-500">*</span>
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

            {/* 公积金单贷：利率 + 还款方式 */}
            {loan.loanType === 'provident' && (
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="space-y-4 min-w-0">
                  <Label className="text-xs font-medium">
                    贷款利率 <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="如：3.25"
                      value={loan.fixedRate}
                      onChange={(e) => updateLoan(loan.id, 'fixedRate', e.target.value)}
                      className="pr-8 text-sm h-9"
                    />
                    <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-4 min-w-0">
                  <Label className="text-xs font-medium">
                    还款方式 <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={loan.paymentMethod}
                    onValueChange={(value) => updateLoan(loan.id, 'paymentMethod', value)}
                    className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 pt-2"
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
              </div>
            )}

            {/* 组合贷款 */}
            {loan.loanType === 'combination' && (
              <div className="space-y-3">
                {/* 商业贷款部分 */}
                <div className="border rounded-lg p-3 mt-4" style={{ borderColor: '#CAF4F7', backgroundColor: 'white' }}>
                  <h5 className="text-sm font-medium mb-4" style={{ color: '#01BCD6' }}>商业贷款信息</h5>

                  <div className="space-y-5">
                    {/* 金额 + 剩余本金 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 min-w-0">
                        <Label className="text-xs font-medium">
                          贷款原始金额(万元) <span className="text-red-500">*</span>
                        </Label>
                        <input
                          type="text"
                          placeholder="如：200"
                          value={loan.commercialLoanAmount || ''}
                          onChange={(e) => updateLoan(loan.id, 'commercialLoanAmount', e.target.value)}
                          className="h-9 w-full min-w-0 box-border rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
                      <div className="space-y-2 min-w-0">
                        <Label className="text-xs font-medium">
                           贷款剩余本金(万元) <span className="text-red-500">*</span>
                        </Label>
                        <input
                          type="text"
                          placeholder="如：1500000"
                          value={loan.commercialRemainingPrincipal || ''}
                          onChange={(e) => updateLoan(loan.id, 'commercialRemainingPrincipal', e.target.value)}
                          className="h-9 w-full min-w-0 box-border rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
                    </div>

                    {/* 开始/结束日期 */}
                    <div className="grid grid-cols-2 gap-4">
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

                    {/* 还款方式 + 利率类型 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 min-w-0">
                        <Label className="text-xs font-medium">
                          还款方式 <span className="text-red-500">*</span>
                        </Label>
                        <RadioGroup
                          value={loan.commercialPaymentMethod || ''}
                          onValueChange={(value) => updateLoan(loan.id, 'commercialPaymentMethod', value)}
                          className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 pt-2"
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
                          value={loan.commercialRateType || ''}
                          onValueChange={(value) => updateLoan(loan.id, 'commercialRateType', value)}
                          className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 pt-2"
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

                    {/* 利率输入（商贷） */}
                    {loan.commercialRateType === 'fixed' && (
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">
                          固定利率 <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="如：4.9"
                            value={loan.commercialFixedRate || ''}
                            onChange={(e) => updateLoan(loan.id, 'commercialFixedRate', e.target.value)}
                            className="pr-8 text-sm h-9"
                          />
                          <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                        </div>
                      </div>
                    )}

                    {loan.commercialRateType === 'floating' && (
                      <div className="space-y-2">
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">
                            利率加减点(基点BP) <span className="text-red-500">*</span>
                          </Label>
                          <input
                            type="number"
                            step="1"
                            placeholder="如：-30(减30个基点) 或 +50(加50个基点)"
                            value={loan.commercialFloatingRateAdjustment || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || /^-?\d+$/.test(value)) {
                                updateLoan(loan.id, 'commercialFloatingRateAdjustment', value);
                              }
                            }}
                            className="h-9 w-full min-w-0 box-border rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          />
                        </div>
                        <div className="p-1 rounded text-xs flex items-center space-x-2 text-gray-600">
                          <span>当前LPR：5年内{currentLPR_5Year}%，5年以上{currentLPR_5YearPlus}% | 1基点(BP)=0.01%</span>
                        </div>
                      </div>
                    )}

                    {/* 商贷月供金额显示 */}
                    {isCommercialLoanComplete(loan) && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="rounded-lg p-3" style={{ backgroundColor: '#CAF4F7' }}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2" style={{ color: '#01BCD6' }}>
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#01BCD6' }}></div>
                              <span className="text-sm font-medium">商贷月供</span>
                            </div>
                            <div className="text-right" style={{ color: '#01BCD6' }}>
                              <div className="text-lg font-semibold">
                                ¥{calculateCommercialMonthlyPayment(loan).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 公积金贷款部分 */}
                <div className="border rounded-lg p-4" style={{ borderColor: '#CAF4F7', backgroundColor: 'white' }}>
                  <h5 className="text-sm font-medium mb-4" style={{ color: '#01BCD6' }}>公积金贷款信息</h5>

                  <div className="space-y-5">
                    {/* 金额 + 剩余本金 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 min-w-0">
                        <Label className="text-xs font-medium">
                          贷款原始金额(万元) <span className="text-red-500">*</span>
                        </Label>
                        <input
                          type="text"
                          placeholder="如：100"
                          value={loan.providentLoanAmount || ''}
                          onChange={(e) => updateLoan(loan.id, 'providentLoanAmount', e.target.value)}
                          className="h-9 w-full min-w-0 box-border rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
                      <div className="space-y-2 min-w-0">
                        <Label className="text-xs font-medium">
                          贷款剩余本金(万元) <span className="text-red-500">*</span>
                        </Label>
                        <input
                          type="text"
                          placeholder="如：800000"
                          value={loan.providentRemainingPrincipal || ''}
                          onChange={(e) => updateLoan(loan.id, 'providentRemainingPrincipal', e.target.value)}
                          className="h-9 w-full min-w-0 box-border rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
                    </div>

                    {/* 开始/结束日期 */}
                    <div className="grid grid-cols-2 gap-4">
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

                    {/* 还款方式 + 贷款利率 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 min-w-0">
                        <Label className="text-xs font-medium">
                          还款方式 <span className="text-red-500">*</span>
                        </Label>
                        <RadioGroup
                          value={loan.providentPaymentMethod || ''}
                          onValueChange={(value) => updateLoan(loan.id, 'providentPaymentMethod', value)}
                          className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 pt-2"
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
                          贷款利率 <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="如：3.25"
                            value={loan.providentRate || ''}
                            onChange={(e) => updateLoan(loan.id, 'providentRate', e.target.value)}
                            className="pr-8 text-sm h-9"
                          />
                          <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* 公积金月供金额显示 */}
                    {isProvidentLoanComplete(loan) && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="rounded-lg p-3" style={{ backgroundColor: '#CAF4F7' }}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2" style={{ color: '#01BCD6' }}>
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#01BCD6' }}></div>
                              <span className="text-sm font-medium">公积金月供</span>
                            </div>
                            <div className="text-right" style={{ color: '#01BCD6' }}>
                              <div className="text-lg font-semibold">
                                ¥{calculateProvidentMonthlyPayment(loan).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 商业贷款单贷：利率输入 */}
            {loan.loanType === 'commercial' && loan.rateType === 'fixed' && (
              <div className="space-y-2 mt-5">
                <Label className="text-xs font-medium">
                  固定利率 <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="如：4.9"
                    value={loan.fixedRate}
                    onChange={(e) => updateLoan(loan.id, 'fixedRate', e.target.value)}
                    className="pr-8 text-sm h-9"
                  />
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                </div>
              </div>
            )}

            {loan.loanType === 'commercial' && loan.rateType === 'floating' && (
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

            {/* 月供金额显示（非组合） */}
            {loan.loanType !== 'combination' && (
              <div className="mt-2 pt-2">
                <div className="rounded-lg p-3 bg-white border border-cyan-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2" style={{ color: '#01BCD6' }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#01BCD6' }}></div>
                      <span className="text-sm font-medium">月供金额</span>
                    </div>
                    <div className="text-right" style={{ color: '#01BCD6' }}>
                      <div className="text-lg font-semibold">
                        {isLoanComplete(loan) ? `¥${calculateMonthlyPayment(loan).toLocaleString()}` : '--'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
  const uid = useId();
  // 使用共享的贷款数据（禁用持久化，financial-status页面不保存数据）
  const { loans, updateLoan, setLoans } = useLoanData({ persist: false });
  const [isExpanded, setIsExpanded] = useState(true);
  const hasConfirmedRef = useRef(false);
  
  // 车贷数据管理  
  const carLoanData = useCarLoanData(existingData?.carLoans);
  const {
    carLoans,
    addCarLoan,
    removeCarLoan,
    updateCarLoan,
    isCarLoanComplete,
    getAggregatedData: getCarLoanAggregatedData
  } = carLoanData;
  
  // 消费贷数据管理  
  const consumerLoanData = useConsumerLoanData(existingData?.consumerLoans);
  const {
    consumerLoans,
    addConsumerLoan,
    removeConsumerLoan,
    updateConsumerLoan,
    isConsumerLoanComplete,
    getAggregatedData: getConsumerLoanAggregatedData
  } = consumerLoanData;
  
  // 经营贷数据管理  
  const businessLoanData = useBusinessLoanData(existingData?.businessLoans);
  const {
    businessLoans,
    addBusinessLoan,
    removeBusinessLoan,
    updateBusinessLoan,
    isBusinessLoanComplete,
    getAggregatedData: getBusinessLoanAggregatedData
  } = businessLoanData;
  
  // 民间借贷数据管理  
  const privateLoanData = usePrivateLoanData(existingData?.privateLoans);
  const {
    privateLoans,
    addPrivateLoan,
    removePrivateLoan,
    updatePrivateLoan,
    isPrivateLoanComplete,
    getAggregatedData: getPrivateLoanAggregatedData,
    updateRateFen,
    updateRateLi
  } = privateLoanData;
  
  // 信用卡数据管理  
  const creditCardData = useCreditCardData(existingData?.creditCards);
  const {
    creditCards,
    addCreditCard,
    removeCreditCard,
    updateCreditCard,
    isCreditCardComplete,
    getAggregatedData: getCreditCardAggregatedData
  } = creditCardData;
  
  // LPR rates
  const currentLPR_5Year = 3.0;
  const currentLPR_5YearPlus = 3.5;

  // 跟踪数据变化以重新激活按钮
  const [lastConfirmedData, setLastConfirmedData] = useState<any>(null);
  const [hasDataChanged, setHasDataChanged] = useState(false);
  
  // Add skip sync ref to prevent existingData from overwriting formData after confirmation
  const skipExistingSyncRef = useRef(false);

  const [formData, setFormData] = useState({
    name: category.name,
    amount: 0,
    monthlyPayment: 0,
    remainingMonths: 0,
    interestRate: 0,
    // 房贷特有字段
    propertyValue: 0, // 房产市值
    loanType: 'commercial' as 'commercial' | 'housingFund' | 'combination',
    commercialAmount: 0,
    commercialRate: 0,
    housingFundAmount: 0,
    housingFundRate: 0,
    principal: 0,
    term: 0,
    repaymentMethod: '',
    startDate: undefined as Date | undefined,
    // 车贷特有字段
    isInstallment: false,
    installmentAmount: 0,
    remainingInstallments: 0,
    vehicleName: '',
    carLoanType: 'installment' as 'installment' | 'bankLoan'
  });

  // 从现有数据初始化表单 (Skip if we just confirmed)
  useEffect(() => {
    if (existingData && !skipExistingSyncRef.current) {
      setFormData({ ...formData, ...existingData });
    }
  }, [existingData]);

  // 设置房贷日期默认值为今天
  useEffect(() => {
    if (category.type === 'mortgage' && loans.length > 0) {
      const today = format(new Date(), 'yyyy-MM-dd');
      const updatedLoans = loans.map(loan => {
        const needsUpdate = 
          !loan.loanStartDate || 
          !loan.loanEndDate || 
          (loan.loanType === 'combination' && (!loan.commercialStartDate || !loan.commercialEndDate || !loan.providentStartDate || !loan.providentEndDate));
        
        if (needsUpdate) {
          return {
            ...loan,
            // 非组合贷款日期
            loanStartDate: loan.loanStartDate || today,
            loanEndDate: loan.loanEndDate || today,
            // 组合贷款日期
            commercialStartDate: loan.loanType === 'combination' ? (loan.commercialStartDate || today) : loan.commercialStartDate,
            commercialEndDate: loan.loanType === 'combination' ? (loan.commercialEndDate || today) : loan.commercialEndDate,
            providentStartDate: loan.loanType === 'combination' ? (loan.providentStartDate || today) : loan.providentStartDate,
            providentEndDate: loan.loanType === 'combination' ? (loan.providentEndDate || today) : loan.providentEndDate,
          };
        }
        return loan;
      });
      
      // 如果有更新，更新loans
      if (updatedLoans.some((loan, index) => loans[index] !== loan)) {
        setLoans(updatedLoans);
      }
    }
  }, [loans, category.type, setLoans]);

  // 监听数据变化以重新激活按钮(Refined to only check loan-specific arrays)
  useEffect(() => {
    if (isConfirmed && lastConfirmedData) {
      // Only compare loan-specific arrays to avoid formData interference
      const currentData = JSON.stringify({
        loans,
        carLoans,
        consumerLoans,
        businessLoans,
        privateLoans,
        creditCards
      });
      const confirmedData = JSON.stringify({
        loans: lastConfirmedData.loans || [],
        carLoans: lastConfirmedData.carLoans || [],
        consumerLoans: lastConfirmedData.consumerLoans || [],
        businessLoans: lastConfirmedData.businessLoans || [],
        privateLoans: lastConfirmedData.privateLoans || [],
        creditCards: lastConfirmedData.creditCards || []
      });
      
      if (currentData !== confirmedData) {
        setHasDataChanged(true);
      }
    }
  }, [loans, carLoans, consumerLoans, businessLoans, privateLoans, creditCards, isConfirmed, lastConfirmedData]);

  const getIcon = () => {
    switch (category.type) {
      case 'mortgage':
        return <Home className="w-5 h-5" />;
      case 'carLoan':
        return <Car className="w-5 h-5" />;
      case 'consumerLoan':
        return <ShoppingCart className="w-5 h-5" />;
      case 'creditCard':
        return <CreditCard className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const handleInputChange = (field: string, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // 如果是房贷，自动计算月供
    if (category.type === 'mortgage') {
      calculateMortgagePayment(newFormData);
    }
  };

  // 计算房贷月供
  const calculateMortgagePayment = (data: any) => {
    if (data.loanType === 'combination') {
      // 组合贷款月供计算
      let totalMonthlyPayment = 0;
      
      if (data.commercialAmount && data.commercialRate && data.term) {
        const commercialMonthly = calculateMonthlyPayment_old(data.commercialAmount * 10000, data.commercialRate, data.term * 12);
        totalMonthlyPayment += commercialMonthly;
      }
      
      if (data.housingFundAmount && data.housingFundRate && data.term) {
        const fundMonthly = calculateMonthlyPayment_old(data.housingFundAmount * 10000, data.housingFundRate, data.term * 12);
        totalMonthlyPayment += fundMonthly;
      }
      
      setFormData(prev => ({ ...prev, monthlyPayment: Math.round(totalMonthlyPayment) }));
    } else {
      // 单一贷款月供计算
      if (data.principal && data.interestRate && data.term) {
        const monthly = calculateMonthlyPayment_old(data.principal * 10000, data.interestRate, data.term * 12);
        setFormData(prev => ({ ...prev, monthlyPayment: Math.round(monthly) }));
      }
    }
  };

  // 等额本息月供计算公式
  const calculateMonthlyPayment_old = (principal: number, annualRate: number, months: number) => {
    const monthlyRate = annualRate / 100 / 12;
    if (monthlyRate === 0) return principal / months;
    
    return principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  };

  // 检查房贷信息是否完整
  const isLoanComplete = (loan: LoanInfo): boolean => {
    if (loan.loanType === 'combination') {
      return isCommercialLoanComplete(loan) && isProvidentLoanComplete(loan);
    }
    
    if (loan.loanType === 'provident') {
      // 公积金贷款必填字段
      const required = ['propertyName', 'loanType', 'loanStartDate', 'loanEndDate', 'paymentMethod', 'loanAmount', 'remainingPrincipal', 'fixedRate'];
      return required.every(field => loan[field as keyof LoanInfo]);
    }
    
    // 商业贷款必填字段  
    const required = ['propertyName', 'loanType', 'loanStartDate', 'loanEndDate', 'rateType', 'paymentMethod', 'loanAmount', 'remainingPrincipal'];
    
    for (const field of required) {
      if (!loan[field as keyof LoanInfo]) return false;
    }
    
    if (loan.rateType === 'fixed' && !loan.fixedRate) return false;
    if (loan.rateType === 'floating' && !loan.floatingRateAdjustment) return false;
    
    return true;
  };

  // 检查商业贷款信息是否完整
  const isCommercialLoanComplete = (loan: LoanInfo): boolean => {
    if (loan.loanType !== 'combination') return false;
    
    const required = ['propertyName', 'commercialLoanAmount', 'commercialRemainingPrincipal', 'commercialStartDate', 'commercialEndDate', 'commercialRateType', 'commercialPaymentMethod'];
    
    for (const field of required) {
      if (!loan[field as keyof LoanInfo]) return false;
    }
    
    if (loan.commercialRateType === 'fixed' && !loan.commercialFixedRate) return false;
    if (loan.commercialRateType === 'floating' && !loan.commercialFloatingRateAdjustment) return false;
    
    return true;
  };

  // 检查公积金贷款信息是否完整
  const isProvidentLoanComplete = (loan: LoanInfo): boolean => {
    if (loan.loanType !== 'combination') return false;
    
    const required = ['propertyName', 'providentLoanAmount', 'providentRemainingPrincipal', 'providentStartDate', 'providentEndDate', 'providentPaymentMethod', 'providentRate'];
    
    for (const field of required) {
      if (!loan[field as keyof LoanInfo]) return false;
    }
    
    return true;
  };

  // 计算月供金额
  const calculateMonthlyPayment = (loan: LoanInfo): number => {
    if (loan.loanType === 'combination') {
      return calculateCommercialMonthlyPayment(loan) + calculateProvidentMonthlyPayment(loan);
    }
    
    if (!isLoanComplete(loan)) return 0;

    const currentDate = new Date();
    // 处理年月格式的日期，例如 "2034-12" 转换为 "2034-12-01"
    const endDateStr = loan.loanEndDate.includes('-') && loan.loanEndDate.split('-').length === 2 
      ? loan.loanEndDate + '-01' 
      : loan.loanEndDate;
    const endDate = new Date(endDateStr);
    
    // 计算剩余月数（从当前日期到结束日期）
    const remainingMonths = Math.max(0, (endDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                           (endDate.getMonth() - currentDate.getMonth()));
    
    // 获取利率
    let interestRate = 0;
    if (loan.loanType === 'provident' || loan.rateType === 'fixed') {
      interestRate = parseFloat(loan.fixedRate) / 100;
    } else {
      const adjustmentBP = parseFloat(loan.floatingRateAdjustment) || 0;
      const adjustmentPercent = adjustmentBP / 100;
      const baseLPR = remainingMonths <= 60 ? currentLPR_5Year : currentLPR_5YearPlus;
      interestRate = (baseLPR + adjustmentPercent) / 100;
    }
    
    const monthlyRate = interestRate / 12;
    const principalValue = loan.remainingPrincipal || loan.loanAmount;
    const principal = parseFloat(principalValue) * 10000; // 剩余本金现在是万元，需要转换为元
    
    if (loan.paymentMethod === 'equal-payment') {
      // 等额本息
      if (monthlyRate === 0) return principal / remainingMonths;
      const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths) / 
                            (Math.pow(1 + monthlyRate, remainingMonths) - 1);
      return Math.round(monthlyPayment);
    } else {
      // 等额本金 - 计算当前期的月供
      const monthlyPrincipal = principal / remainingMonths;
      const currentMonthInterest = principal * monthlyRate;
      return Math.round(monthlyPrincipal + currentMonthInterest);
    }
  };

  // 计算商业贷款月供金额
  const calculateCommercialMonthlyPayment = (loan: LoanInfo): number => {
    if (!isCommercialLoanComplete(loan)) return 0;

    const currentDate = new Date();
    // 处理年月格式的日期，例如 "2034-12" 转换为 "2034-12-01"
    const commercialEndDateStr = loan.commercialEndDate || '';
    const endDateStr = commercialEndDateStr.includes('-') && commercialEndDateStr.split('-').length === 2 
      ? commercialEndDateStr + '-01' 
      : commercialEndDateStr;
    const endDate = new Date(endDateStr);
    
    // 计算剩余月数（从当前日期到结束日期）
    const remainingMonths = Math.max(0, (endDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                           (endDate.getMonth() - currentDate.getMonth()));
    
    // 获取利率
    let interestRate = 0;
    if (loan.commercialRateType === 'fixed') {
      interestRate = parseFloat(loan.commercialFixedRate || '0') / 100;
    } else {
      const adjustmentBP = parseFloat(loan.commercialFloatingRateAdjustment || '0') || 0;
      const adjustmentPercent = adjustmentBP / 100;
      const baseLPR = remainingMonths <= 60 ? currentLPR_5Year : currentLPR_5YearPlus;
      interestRate = (baseLPR + adjustmentPercent) / 100;
    }
    
    const monthlyRate = interestRate / 12;
    const principal = parseFloat(loan.commercialRemainingPrincipal || loan.commercialLoanAmount || '0') * 10000; // 剩余本金和原始金额都是万元，需要转换为元
    
    if (loan.commercialPaymentMethod === 'equal-payment') {
      // 等额本息
      if (monthlyRate === 0) return principal / remainingMonths;
      const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths) / 
                            (Math.pow(1 + monthlyRate, remainingMonths) - 1);
      return Math.round(monthlyPayment);
    } else {
      // 等额本金 - 计算当前期的月供
      const monthlyPrincipal = principal / remainingMonths;
      const currentMonthInterest = principal * monthlyRate;
      return Math.round(monthlyPrincipal + currentMonthInterest);
    }
  };

  // 计算公积金贷款月供金额
  const calculateProvidentMonthlyPayment = (loan: LoanInfo): number => {
    if (!isProvidentLoanComplete(loan)) return 0;

    const currentDate = new Date();
    // 处理年月格式的日期，例如 "2034-12" 转换为 "2034-12-01"
    const providentEndDateStr = loan.providentEndDate || '';
    const endDateStr = providentEndDateStr.includes('-') && providentEndDateStr.split('-').length === 2 
      ? providentEndDateStr + '-01' 
      : providentEndDateStr;
    const endDate = new Date(endDateStr);
    
    // 计算剩余月数（从当前日期到结束日期）
    const remainingMonths = Math.max(0, (endDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                           (endDate.getMonth() - currentDate.getMonth()));
    
    // 获取利率
    const interestRate = parseFloat(loan.providentRate || '0') / 100;
    const monthlyRate = interestRate / 12;
    const principal = parseFloat(loan.providentRemainingPrincipal || loan.providentLoanAmount || '0') * 10000; // 剩余本金和原始金额都是万元，需要转换为元
    
    if (loan.providentPaymentMethod === 'equal-payment') {
      // 等额本息
      if (monthlyRate === 0) return principal / remainingMonths;
      const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths) / 
                            (Math.pow(1 + monthlyRate, remainingMonths) - 1);
      return Math.round(monthlyPayment);
    } else {
      // 等额本金 - 计算当前期的月供
      const monthlyPrincipal = principal / remainingMonths;
      const currentMonthInterest = principal * monthlyRate;
      return Math.round(monthlyPrincipal + currentMonthInterest);
    }
  };

  const handleConfirm = () => {
    onConfirm(category.id, formData);
  };

  const canConfirm = () => {
    if (category.type === 'mortgage') {
      if (formData.loanType === 'combination') {
        return formData.propertyValue > 0 && (formData.commercialAmount > 0 || formData.housingFundAmount > 0) && formData.term > 0 && formData.startDate;
      } else {
        return formData.propertyValue > 0 && formData.principal > 0 && formData.term > 0 && formData.interestRate > 0 && formData.startDate;
      }
    }
    
    // 车贷特殊验证逻辑
    if (category.type === 'carLoan') {
      if (!formData.vehicleName) return false;
      
      if (formData.carLoanType === 'installment') {
        return formData.installmentAmount > 0 && formData.remainingInstallments > 0;
      } else {
        return formData.principal > 0 && formData.term > 0 && formData.interestRate > 0 && formData.startDate;
      }
    }
    
    // 消费贷特殊验证逻辑（已改为多笔录入，这里保留向后兼容）
    if (category.type === 'consumerLoan') {
      return formData.amount > 0 || formData.monthlyPayment > 0;
    }
    
    return formData.amount > 0 || formData.monthlyPayment > 0;
  };

  const renderMortgageFields = () => {
    if (category.type !== 'mortgage') return null;

    return (
      <div className="space-y-4">
        {/* 房产市值 */}
        <div>
          <Label htmlFor={`property-value-${category.id}`} className="text-sm text-gray-600">房产市值（万元）</Label>
          <Input
            id={`property-value-${category.id}`}
            type="number"
            inputMode="decimal"
            pattern="[0-9]*"
            placeholder="请输入房产市值"
            value={formData.propertyValue || ''}
            onChange={(e) => handleInputChange('propertyValue', parseFloat(e.target.value) || 0)}
            className="mt-1"
            disabled={isConfirmed}
          />
        </div>

        {/* 贷款类型 */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">贷款类型</Label>
          <RadioGroup
            value={formData.loanType}
            onValueChange={(value) => handleInputChange('loanType', value)}
            className="flex space-x-6"
            disabled={isConfirmed}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="commercial" id={`commercial-${uid}`} disabled={isConfirmed} />
              <Label htmlFor={`commercial-${uid}`} className="text-sm">纯商贷</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="housingFund" id={`housingFund-${uid}`} disabled={isConfirmed} />
              <Label htmlFor={`housingFund-${uid}`} className="text-sm">公积金贷款</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="combination" id={`combination-${uid}`} disabled={isConfirmed} />
              <Label htmlFor={`combination-${uid}`} className="text-sm">组合贷款</Label>
            </div>
          </RadioGroup>
        </div>

        {formData.loanType === 'combination' && (
          <div className="space-y-4">
            {/* 商贷信息 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`commercial-amount-${category.id}`} className="text-sm text-gray-600">商贷金额（万元）</Label>
                <Input
                  id={`commercial-amount-${category.id}`}
                  type="number"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  placeholder="请输入"
                  value={formData.commercialAmount || ''}
                  onChange={(e) => handleInputChange('commercialAmount', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                  disabled={isConfirmed}
                />
              </div>
              <div>
                <Label htmlFor={`commercial-rate-${category.id}`} className="text-sm text-gray-600">商贷利率（%）</Label>
                <Input
                  id={`commercial-rate-${category.id}`}
                  type="number"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  placeholder="请输入"
                  step="0.1"
                  value={formData.commercialRate || ''}
                  onChange={(e) => handleInputChange('commercialRate', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                  disabled={isConfirmed}
                />
              </div>
            </div>
            
            {/* 公积金信息 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`fund-amount-${category.id}`} className="text-sm text-gray-600">公积金金额（万元）</Label>
                <Input
                  id={`fund-amount-${category.id}`}
                  type="number"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  placeholder="请输入"
                  value={formData.housingFundAmount || ''}
                  onChange={(e) => handleInputChange('housingFundAmount', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                  disabled={isConfirmed}
                />
              </div>
              <div>
                <Label htmlFor={`fund-rate-${category.id}`} className="text-sm text-gray-600">公积金利率（%）</Label>
                <Input
                  id={`fund-rate-${category.id}`}
                  type="number"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  placeholder="请输入"
                  step="0.1"
                  value={formData.housingFundRate || ''}
                  onChange={(e) => handleInputChange('housingFundRate', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                  disabled={isConfirmed}
                />
              </div>
            </div>
            
            {/* 贷款期限、开始时间和月供 */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`term-${category.id}`} className="text-sm text-gray-600">原始贷款期限（年）</Label>
                  <Input
                    id={`term-${category.id}`}
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.term || ''}
                    onChange={(e) => handleInputChange('term', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                    disabled={isConfirmed}
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-600">贷款开始时间</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "mt-1 w-full justify-start text-left font-normal",
                          !formData.startDate && "text-muted-foreground"
                        )}
                        disabled={isConfirmed}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "yyyy年MM月") : "请选择日期"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-screen max-w-md mx-auto p-0" align="center">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => handleInputChange('startDate', date)}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto w-full")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div>
                <Label htmlFor={`monthly-payment-${category.id}`} className="text-sm text-gray-600">月供（元）</Label>
                <Input
                  id={`monthly-payment-${category.id}`}
                  type="number"
                  value={formData.monthlyPayment || ''}
                  className="mt-1 bg-gray-50"
                  disabled
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">月供金额将根据贷款信息自动计算</p>
              </div>
            </div>
          </div>
        )}

        {/* 非组合贷款的基础信息 */}
        {formData.loanType !== 'combination' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`principal-${category.id}`} className="text-sm text-gray-600">原始贷款本金（万元）</Label>
                <Input
                  id={`principal-${category.id}`}
                  type="number"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  placeholder="请输入"
                  value={formData.principal || ''}
                  onChange={(e) => handleInputChange('principal', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                  disabled={isConfirmed}
                />
              </div>
              <div>
                <Label htmlFor={`term-simple-${category.id}`} className="text-sm text-gray-600">原始贷款期限（年）</Label>
                <Input
                  id={`term-simple-${category.id}`}
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formData.term || ''}
                  onChange={(e) => handleInputChange('term', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                  disabled={isConfirmed}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm text-gray-600">贷款开始时间</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "mt-1 w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                    disabled={isConfirmed}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "yyyy年MM月") : "请选择日期"}
                  </Button>
                </PopoverTrigger>
                  <PopoverContent className="w-screen max-w-md mx-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => handleInputChange('startDate', date)}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto w-full")}
                    />
                  </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`rate-${category.id}`} className="text-sm text-gray-600">利率（%）</Label>
                <Input
                  id={`rate-${category.id}`}
                  type="number"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  placeholder="请输入年利率"
                  step="0.1"
                  value={formData.interestRate || ''}
                  onChange={(e) => handleInputChange('interestRate', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                  disabled={isConfirmed}
                />
              </div>
              <div>
                <Label htmlFor={`method-${category.id}`} className="text-sm text-gray-600">还款方式</Label>
                <Select
                  value={formData.repaymentMethod}
                  onValueChange={(value) => handleInputChange('repaymentMethod', value)}
                  disabled={isConfirmed}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="请选择还款方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equal-payment">等额本息</SelectItem>
                    <SelectItem value="equal-principal">等额本金</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor={`monthly-payment-simple-${category.id}`} className="text-sm text-gray-600">月供（元）</Label>
              <Input
                id={`monthly-payment-simple-${category.id}`}
                type="number"
                value={formData.monthlyPayment || ''}
                className="mt-1 bg-gray-50"
                disabled
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">月供金额将根据贷款信息自动计算</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBasicDebtFields = () => {
    if (category.type === 'mortgage') return null;

    // 车贷特殊处理 - 贷款类型和对应字段
    if (category.type === 'carLoan') {
      return (
        <div className="space-y-4">
          {/* 车辆名称和贷款类型在一行 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="vehicle-name" className="text-sm text-gray-600">车辆名称 <span className="text-red-500">*</span></Label>
              <Input
                id="vehicle-name"
                type="text"
                placeholder="如：奔驰C200"
                value={formData.vehicleName || ''}
                onChange={(e) => handleInputChange('vehicleName', e.target.value)}
                className="mt-1"
                disabled={isConfirmed}
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600">贷款类型 <span className="text-red-500">*</span></Label>
              <Select
                value={formData.carLoanType || 'installment'}
                onValueChange={(value) => handleInputChange('carLoanType', value)}
                disabled={isConfirmed}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="installment">分期</SelectItem>
                  <SelectItem value="bankLoan">银行贷款</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* 根据贷款类型显示不同字段 */}
          {(formData.carLoanType || 'installment') === 'installment' ? (
            /* 分期类型字段 */
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="installment-amount" className="text-sm text-gray-600">每期分期金额（元） <span className="text-red-500">*</span></Label>
                <Input
                  id="installment-amount"
                  type="number"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  placeholder="如：3000"
                  value={formData.installmentAmount || ''}
                  onChange={(e) => handleInputChange('installmentAmount', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                  disabled={isConfirmed}
                />
              </div>
              <div>
                <Label htmlFor="remaining-installments" className="text-sm text-gray-600">剩余期限（月） <span className="text-red-500">*</span></Label>
                <Input
                  id="remaining-installments"
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="如：24"
                  value={formData.remainingInstallments || ''}
                  onChange={(e) => handleInputChange('remainingInstallments', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                  disabled={isConfirmed}
                />
              </div>
            </div>
          ) : (
            /* 银行贷款类型字段 - 复制房贷-公积金字段 */
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`principal-${category.id}`} className="text-sm text-gray-600">原始贷款本金（万元）</Label>
                  <Input
                    id={`principal-${category.id}`}
                    type="number"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    placeholder="请输入"
                    value={formData.principal || ''}
                    onChange={(e) => handleInputChange('principal', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                    disabled={isConfirmed}
                  />
                </div>
                <div>
                  <Label htmlFor={`term-simple-${category.id}`} className="text-sm text-gray-600">原始贷款期限（年）</Label>
                  <Input
                    id={`term-simple-${category.id}`}
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.term || ''}
                    onChange={(e) => handleInputChange('term', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                    disabled={isConfirmed}
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-600">贷款开始时间</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "mt-1 w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground"
                      )}
                      disabled={isConfirmed}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "yyyy年MM月") : "请选择日期"}
                    </Button>
                  </PopoverTrigger>
                    <PopoverContent className="w-screen max-w-md mx-auto p-0" align="center">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => handleInputChange('startDate', date)}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto w-full")}
                      />
                    </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`rate-${category.id}`} className="text-sm text-gray-600">利率（%）</Label>
                  <Input
                    id={`rate-${category.id}`}
                    type="number"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    placeholder="请输入年利率"
                    step="0.1"
                    value={formData.interestRate || ''}
                    onChange={(e) => handleInputChange('interestRate', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                    disabled={isConfirmed}
                  />
                </div>
                <div>
                  <Label htmlFor={`method-${category.id}`} className="text-sm text-gray-600">还款方式</Label>
                  <Select
                    value={formData.repaymentMethod}
                    onValueChange={(value) => handleInputChange('repaymentMethod', value)}
                    disabled={isConfirmed}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="请选择还款方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equal-payment">等额本息</SelectItem>
                      <SelectItem value="equal-principal">等额本金</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor={`monthly-payment-simple-${category.id}`} className="text-sm text-gray-600">月供（元）</Label>
                <Input
                  id={`monthly-payment-simple-${category.id}`}
                  type="number"
                  value={formData.monthlyPayment || ''}
                  className="mt-1 bg-gray-50"
                  disabled
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">月供金额将根据贷款信息自动计算</p>
              </div>
            </div>
          )}
        </div>
      );
    }

    // 其他债务类型的原有逻辑
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="debt-amount" className="text-sm text-gray-600">
              {category.type === 'creditCard' ? '信用卡欠款（万元）' : '贷款金额（万元）'}
            </Label>
            <Input
              id="debt-amount"
              type="number"
              inputMode="decimal"
              pattern="[0-9]*"
              placeholder="请输入"
              value={formData.amount || ''}
              onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
              className="mt-1"
              disabled={isConfirmed}
            />
          </div>
          <div>
            <Label htmlFor="monthly-payment-basic" className="text-sm text-gray-600">月还款额（元）</Label>
            <Input
              id="monthly-payment-basic"
              type="number"
              inputMode="decimal"
              pattern="[0-9]*"
              placeholder="请输入"
              value={formData.monthlyPayment || ''}
              onChange={(e) => handleInputChange('monthlyPayment', parseFloat(e.target.value) || 0)}
              className="mt-1"
              disabled={isConfirmed}
            />
          </div>
        </div>

        {category.type !== 'creditCard' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="interest-rate" className="text-sm text-gray-600">利率（%）</Label>
              <Input
                id="interest-rate"
                type="number"
                inputMode="decimal"
                pattern="[0-9]*"
                placeholder="请输入年利率"
                step="0.1"
                value={formData.interestRate || ''}
                onChange={(e) => handleInputChange('interestRate', parseFloat(e.target.value) || 0)}
                className="mt-1"
                disabled={isConfirmed}
              />
            </div>
            <div>
              <Label htmlFor="remaining-months-basic" className="text-sm text-gray-600">剩余期数（月）</Label>
              <Input
                id="remaining-months-basic"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="剩余还款月数"
                value={formData.remainingMonths || ''}
                onChange={(e) => handleInputChange('remainingMonths', parseFloat(e.target.value) || 0)}
                className="mt-1"
                disabled={isConfirmed}
              />
            </div>
          </div>
        )}
      </div>
    );
  };


  // Auto-sync effect for mortgage - aggregate loan data and auto-confirm
  useEffect(() => {
    if (false) {
      // Check if there's at least one complete loan
      const completeLoanExists = loans.some(loan => isLoanComplete(loan));
      
      if (completeLoanExists) {
        // Aggregate loan data
        let totalRemainingPrincipal = 0; // in 万元
        let totalMonthlyPayment = 0; // in 元
        let maxRemainingMonths = 0;
        
        loans.forEach(loan => {
          if (isLoanComplete(loan)) {
            // Calculate remaining principal in 万元
            if (loan.loanType === 'combination') {
              const commercialRemaining = parseFloat(String(loan.commercialRemainingPrincipal || '0').replace(/[,\s]/g, '')) / 10000;
              const providentRemaining = parseFloat(String(loan.providentRemainingPrincipal || '0').replace(/[,\s]/g, '')) / 10000;
              totalRemainingPrincipal += commercialRemaining + providentRemaining;
            } else {
              const remaining = parseFloat(String(loan.remainingPrincipal || '0').replace(/[,\s]/g, '')) / 10000;
              totalRemainingPrincipal += remaining;
            }
            
            // Calculate monthly payment in 元
            totalMonthlyPayment += calculateMonthlyPayment(loan);
            
            // Calculate remaining months
            let startDate, endDate;
            if (loan.loanType === 'combination') {
              // Use commercial loan dates as primary for combination loans
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
        
        // Prepare aggregated data
        const aggregatedData = {
          amount: totalRemainingPrincipal, // 万元
          monthlyPayment: totalMonthlyPayment, // 元
          remainingMonths: maxRemainingMonths,
          loans // 保存详细房贷列表，便于后续页面精确展示
        };
        
        // Auto-confirm with aggregated data
        hasConfirmedRef.current = true;
        onConfirm(category.id, aggregatedData);
      }
    }
  }, [loans, category.type, category.id, onConfirm, isLoanComplete, calculateMonthlyPayment]);

  // 实时计算并通知父组件汇总数据变化
  useEffect(() => {
    if (category.type === 'mortgage' && onDataChange && loans.length > 0) {
      // 计算当前房贷的实时汇总数据
      let totalRemainingPrincipal = 0;
      let totalMonthlyPayment = 0;
      let maxRemainingMonths = 0;
      let completeLoanCount = 0;
      
      loans.forEach(loan => {
        const loanComplete = isLoanComplete(loan);
        if (loanComplete) {
          completeLoanCount++;
          
          // Calculate remaining principal in 万元
          if (loan.loanType === 'combination') {
            const commercialRemaining = parseFloat(String(loan.commercialRemainingPrincipal || '0').replace(/[,\s]/g, '')) / 10000;
            const providentRemaining = parseFloat(String(loan.providentRemainingPrincipal || '0').replace(/[,\s]/g, '')) / 10000;
            totalRemainingPrincipal += commercialRemaining + providentRemaining;
          } else {
            const remaining = parseFloat(String(loan.remainingPrincipal || '0').replace(/[,\s]/g, '')) / 10000;
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

    // 本金相关（单位：元）
    let totalPrincipal = 0;
    if (loan.loanType === 'combination') {
      const commercial = parseFloat(loan.commercialLoanAmount || '0') * 10000;
      const provident = parseFloat(loan.providentLoanAmount || '0') * 10000;
      totalPrincipal = commercial + provident;
    } else {
      totalPrincipal = parseFloat(loan.loanAmount || '0') * 10000;
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
    };
  };
  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="p-0 mt-4">
        {category.type === 'mortgage' ? (
          /* 房贷使用SharedLoanModule */
          <SharedLoanModule
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
              className={`w-full h-12 font-bold rounded-lg text-sm transform hover:scale-[1.02] transition-all duration-300 border-0 ${
                !loans.some(loan => isLoanComplete(loan))
                  ? 'bg-[#CAF4F7]/70 text-gray-500'
                  : 'bg-[#CAF4F7] hover:bg-[#CAF4F7]/90 text-gray-900'
              }`}
              disabled={!loans.some(loan => isLoanComplete(loan))}
            >
              进入提前还款测算
            </Button>
          </SharedLoanModule>
        ) : category.type === 'carLoan' ? (
          /* 车贷使用TQSharedCarLoanModule */
          <TQSharedCarLoanModule 
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
              className={`w-full h-12 font-bold rounded-lg text-sm transform hover:scale-[1.02] transition-all duration-300 border-0 ${
                !carLoans.some(isCarLoanComplete)
                  ? 'bg-[#CAF4F7]/70 text-gray-500'
                  : 'bg-[#CAF4F7] hover:bg-[#CAF4F7]/90 text-gray-900'
              }`}
              disabled={!carLoans.some(isCarLoanComplete)}
            >
              进入提前还款测算
            </Button>
          </TQSharedCarLoanModule>
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
              className={`w-full h-12 font-bold rounded-lg text-sm transform hover:scale-[1.02] transition-all duration-300 border-0 ${
                !consumerLoans.some(isConsumerLoanComplete)
                  ? 'bg-[#CAF4F7]/70 text-gray-500'
                  : 'bg-[#CAF4F7] hover:bg-[#CAF4F7]/90 text-gray-900'
              }`}
              disabled={!consumerLoans.some(isConsumerLoanComplete)}
            >
              进入提前还款测算
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
              className={`w-full h-12 font-bold rounded-lg text-sm transform hover:scale-[1.02] transition-all duration-300 border-0 ${
                !businessLoans.some(isBusinessLoanComplete)
                  ? 'bg-[#CAF4F7]/70 text-gray-500'
                  : 'bg-[#CAF4F7] hover:bg-[#CAF4F7]/90 text-gray-900'
              }`}
              disabled={!businessLoans.some(isBusinessLoanComplete)}
            >
              进入提前还款测算
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
              className={`w-full h-12 font-bold rounded-lg text-sm transform hover:scale-[1.02] transition-all duration-300 border-0 ${
                !privateLoans.some(isPrivateLoanComplete)
                  ? 'bg-[#CAF4F7]/70 text-gray-500'
                  : 'bg-[#CAF4F7] hover:bg-[#CAF4F7]/90 text-gray-900'
              }`}
              disabled={!privateLoans.some(isPrivateLoanComplete)}
            >
              进入提前还款测算
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