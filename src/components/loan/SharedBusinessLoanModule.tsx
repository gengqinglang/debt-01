import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Trash2, Plus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { BusinessLoanInfo } from '@/hooks/useBusinessLoanData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { calculateEqualPaymentMonthly, calculateEqualPrincipalFirstMonthly, calculateLoanTermMonths, formatAmount } from '@/lib/loanCalculations';

interface BusinessLoanCardProps {
  businessLoan: BusinessLoanInfo;
  index: number;
  updateBusinessLoan: (id: string, field: keyof BusinessLoanInfo, value: string) => void;
  removeBusinessLoan: (id: string) => void;
  resetBusinessLoan: (id: string) => void;
  businessLoansLength: number;
}

const BusinessLoanCard: React.FC<BusinessLoanCardProps> = ({
  businessLoan,
  index,
  updateBusinessLoan,
  removeBusinessLoan,
  resetBusinessLoan,
  businessLoansLength,
}) => {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  
  // 等额本息/等额本金 月供计算
  const { requiredFilled, monthlyPayment } = (() => {
    if (businessLoan.repaymentMethod !== 'equal-payment' && businessLoan.repaymentMethod !== 'equal-principal') {
      return { requiredFilled: false, monthlyPayment: null as number | null };
    }
    const principalWan = parseFloat(businessLoan.remainingPrincipal || '');
    const annualRatePct = parseFloat(businessLoan.annualRate || '');
    const hasDates = Boolean(businessLoan.startDate && businessLoan.endDate);
    const hasPrincipal = !isNaN(principalWan) && principalWan > 0;
    const hasRate = !isNaN(annualRatePct) && annualRatePct > 0;
    const requiredFilled = hasDates && hasPrincipal && hasRate;
    if (!requiredFilled) return { requiredFilled, monthlyPayment: null };

    const principal = principalWan * 10000;
    const annualRate = annualRatePct / 100;
    const termMonths = calculateLoanTermMonths(businessLoan.startDate, businessLoan.endDate);
    if (termMonths <= 0) return { requiredFilled, monthlyPayment: null };
    const monthly = businessLoan.repaymentMethod === 'equal-payment'
      ? calculateEqualPaymentMonthly(principal, annualRate, termMonths)
      : calculateEqualPrincipalFirstMonthly(principal, annualRate, termMonths);
    return { requiredFilled, monthlyPayment: monthly };
  })();

  // 先息后本/一次性还本付息 待还利息计算
  const pendingInterest = (() => {
    if (businessLoan.repaymentMethod !== 'interest-first' && businessLoan.repaymentMethod !== 'lump-sum') {
      return null;
    }
    const principalWan = parseFloat(businessLoan.loanAmount || '');
    const annualRatePct = parseFloat(businessLoan.annualRate || '');
    const hasEndDate = Boolean(businessLoan.endDate);
    const hasPrincipal = !isNaN(principalWan) && principalWan > 0;
    const hasRate = !isNaN(annualRatePct) && annualRatePct > 0;
    
    if (!hasPrincipal || !hasRate || !hasEndDate) return null;
    
    const principal = principalWan * 10000;
    const annualRate = annualRatePct / 100;
    
    if (businessLoan.repaymentMethod === 'interest-first') {
      // 先息后本：每月利息
      const monthlyInterest = (principal * annualRate) / 12;
      return monthlyInterest;
    } else {
      // 一次性还本付息：从今天到结束日期的利息
      const today = new Date();
      const endDate = new Date(businessLoan.endDate || '');
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      const yearlyInterest = principal * annualRate;
      return (yearlyInterest * diffDays) / 365;
    }
  })();
  
  return (
    <div className="rounded-lg py-6 px-3 bg-white" style={{ border: '2px solid #CAF4F7' }}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-900">
          经营贷 {index + 1}
        </h4>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button 
              className="p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700"
              title={businessLoansLength > 1 ? "删除此经营贷" : "清空此经营贷"}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {businessLoansLength > 1 ? '确认删除' : '确认清空'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {businessLoansLength > 1 
                  ? '您确定要删除这笔经营贷吗？此操作不可撤销。'
                  : '您确定要清空这笔经营贷信息吗？将恢复至默认值。'
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                if (businessLoansLength > 1) {
                  removeBusinessLoan(businessLoan.id);
                } else {
                  resetBusinessLoan(businessLoan.id);
                }
              }}>
                {businessLoansLength > 1 ? '确定删除' : '确定清空'}
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
              placeholder="如：流动资金贷款"
              value={businessLoan.name || ''}
              onChange={(e) => updateBusinessLoan(businessLoan.id, 'name', e.target.value)}
              className="h-9 text-sm mt-1"
            />
          </div>
          <div>
            <Label className="text-xs font-medium">
              还款方式 <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={businessLoan.repaymentMethod} 
              onValueChange={(value) => updateBusinessLoan(businessLoan.id, 'repaymentMethod', value)}
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
        {(businessLoan.repaymentMethod === 'interest-first' || businessLoan.repaymentMethod === 'lump-sum') ? (
          /* 先息后本/一次性还本付息：剩余贷款本金 + 贷款结束日期在一行，然后年化利率在下面 */
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
                  placeholder="如：100"
                  value={businessLoan.loanAmount}
                  onChange={(e) => updateBusinessLoan(businessLoan.id, 'loanAmount', e.target.value)}
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
                         !businessLoan.endDate && "text-muted-foreground"
                       )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {businessLoan.endDate ? format(new Date(businessLoan.endDate), "yyyy-MM-dd") : "选择日期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
                     <Calendar
                       mode="single"
                       selected={businessLoan.endDate ? new Date(businessLoan.endDate) : undefined}
                       onSelect={(date) => {
                         updateBusinessLoan(businessLoan.id, 'endDate', date ? format(date, "yyyy-MM-dd") : '');
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
                value={businessLoan.annualRate}
                onChange={(e) => updateBusinessLoan(businessLoan.id, 'annualRate', e.target.value)}
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
                      <span className="text-sm font-medium">{businessLoan.repaymentMethod === 'interest-first' ? '每月利息' : '待还利息'}</span>
                    </div>
                     <div className="text-right" style={{ color: '#01BCD6' }}>
                       <div className="text-lg font-semibold">
                         {(() => {
                           // 检查必输项是否完整
                           const basicRequired = businessLoan.repaymentMethod;
                           if (!basicRequired) return '--';
                           
                           if (businessLoan.repaymentMethod === 'interest-first') {
                              // 先息后本必填项：剩余贷款本金 + 贷款结束日期 + 年化利率
                              const requiredFilled = businessLoan.loanAmount && 
                                     businessLoan.endDate && 
                                     businessLoan.annualRate;
                              if (!requiredFilled) return '--';
                            } else if (businessLoan.repaymentMethod === 'lump-sum') {
                              // 一次性还本付息必填项：剩余贷款本金 + 贷款结束日期 + 年化利率
                              const requiredFilled = businessLoan.loanAmount && 
                                     businessLoan.endDate && 
                                     businessLoan.annualRate;
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
                  placeholder="如：100"
                  value={businessLoan.loanAmount}
                  onChange={(e) => updateBusinessLoan(businessLoan.id, 'loanAmount', e.target.value)}
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
                  placeholder="如：80"
                  value={businessLoan.remainingPrincipal || ''}
                  onChange={(e) => updateBusinessLoan(businessLoan.id, 'remainingPrincipal', e.target.value)}
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
                        !businessLoan.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {businessLoan.startDate ? format(new Date(businessLoan.startDate), "yyyy-MM-dd") : "选择日期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
                     <Calendar
                       mode="single"
                       selected={businessLoan.startDate ? new Date(businessLoan.startDate) : undefined}
                       onSelect={(date) => {
                         updateBusinessLoan(businessLoan.id, 'startDate', date ? format(date, "yyyy-MM-dd") : '');
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
                         !businessLoan.endDate && "text-muted-foreground"
                       )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {businessLoan.endDate ? format(new Date(businessLoan.endDate), "yyyy-MM-dd") : "选择日期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
                     <Calendar
                       mode="single"
                       selected={businessLoan.endDate ? new Date(businessLoan.endDate) : undefined}
                       onSelect={(date) => {
                         updateBusinessLoan(businessLoan.id, 'endDate', date ? format(date, "yyyy-MM-dd") : '');
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
                value={businessLoan.annualRate}
                onChange={(e) => updateBusinessLoan(businessLoan.id, 'annualRate', e.target.value)}
                className="h-9 text-sm mt-1"
              />
            </div>

            {(businessLoan.repaymentMethod === 'equal-payment' || businessLoan.repaymentMethod === 'equal-principal') && (
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
                             const requiredFilled = businessLoan.remainingPrincipal && 
                                    businessLoan.startDate && 
                                    businessLoan.endDate && 
                                    businessLoan.annualRate;
                             
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
          </>
        )}
      </div>
    </div>
  );
};

interface SharedBusinessLoanModuleProps {
  children: React.ReactNode;
  existingData?: any;
  businessLoans: BusinessLoanInfo[];
  addBusinessLoan: () => void;
  removeBusinessLoan: (id: string) => void;
  resetBusinessLoan: (id: string) => void;
  updateBusinessLoan: (id: string, field: keyof BusinessLoanInfo, value: string) => void;
  isBusinessLoanComplete: (businessLoan: BusinessLoanInfo) => boolean;
}

export const SharedBusinessLoanModule: React.FC<SharedBusinessLoanModuleProps> = ({ 
  children, 
  existingData,
  businessLoans,
  addBusinessLoan,
  removeBusinessLoan,
  resetBusinessLoan,
  updateBusinessLoan,
  isBusinessLoanComplete
}) => {
  // 自动添加空白卡片
  useEffect(() => {
    const hasExistingData = existingData && existingData.length > 0;
    const hasCurrentData = businessLoans && businessLoans.length > 0;
    
    if (!hasExistingData && !hasCurrentData) {
      addBusinessLoan();
    }
  }, [existingData, addBusinessLoan]);

  return (
    <>
      {/* 经营贷列表 */}
      {businessLoans.map((businessLoan, index) => (
        <div key={businessLoan.id} className="mb-4">
          <BusinessLoanCard
            businessLoan={businessLoan}
            index={index}
            updateBusinessLoan={updateBusinessLoan}
            removeBusinessLoan={removeBusinessLoan}
            resetBusinessLoan={resetBusinessLoan}
            businessLoansLength={businessLoans.length}
          />
        </div>
      ))}

      {/* 按钮区域 - 左侧"再录一笔" + 右侧确认按钮 */}
      <div className="grid grid-cols-2 gap-3 mt-6 mb-3">
        {/* 左侧：再录一笔（虚线边框，青色） */}
        <Button
          onClick={addBusinessLoan}
          variant="outline"
          className="h-10 border-dashed text-sm"
          style={{ borderColor: '#01BCD6', color: '#01BCD6' }}
        >
          <Plus className="w-3 h-3 mr-2" />
          再录一笔
        </Button>

        {/* 右侧：确认经营贷信息（传入的children） */}
        <div className="w-full">
          {children}
        </div>
      </div>
    </>
  );
};