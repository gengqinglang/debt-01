import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Trash2, Plus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PrivateLoanInfo } from '@/hooks/usePrivateLoanData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { calculateInterestFirstPayment, calculateNextPaymentInterest } from '@/lib/dailyInterestCalculations';

interface PrivateLoanCardProps {
  privateLoan: PrivateLoanInfo;
  index: number;
  updatePrivateLoan: (id: string, field: keyof PrivateLoanInfo, value: string) => void;
  removePrivateLoan: (id: string) => void;
  resetPrivateLoan: (id: string) => void;
  privateLoansLength: number;
  updateRateFen: (id: string, value: string) => void;
  updateRateLi: (id: string, value: string) => void;
}

const PrivateLoanCard: React.FC<PrivateLoanCardProps> = ({
  privateLoan,
  index,
  updatePrivateLoan,
  removePrivateLoan,
  resetPrivateLoan,
  privateLoansLength,
  updateRateFen,
  updateRateLi,
}) => {
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  
  return (
    <div className="rounded-lg py-6 px-3 bg-white" style={{ border: '2px solid #CAF4F7' }}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-900">
          民间借贷 {index + 1}
        </h4>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button 
              className="p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700"
              title={privateLoansLength > 1 ? "删除此民间借贷" : "清空此民间借贷"}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {privateLoansLength > 1 ? '确认删除' : '确认清空'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {privateLoansLength > 1 
                  ? '您确定要删除这笔民间借贷吗？此操作不可撤销。'
                  : '您确定要清空这笔民间借贷信息吗？将恢复至默认值。'
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                if (privateLoansLength > 1) {
                  removePrivateLoan(privateLoan.id);
                } else {
                  resetPrivateLoan(privateLoan.id);
                }
              }}>
                {privateLoansLength > 1 ? '确定删除' : '确定清空'}
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
              placeholder="如：个人借款"
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
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 根据还款方式显示不同的字段布局 */}
        {privateLoan.repaymentMethod === 'interest-first' ? (
          /* 先息后本：第一行：名称、还款方式；第二行：剩余贷款本金、贷款发放日；第三行：贷款结束日期、每月还款日；第四行：利率分、利率厘 */
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
                  value={privateLoan.loanAmount}
                  onChange={(e) => updatePrivateLoan(privateLoan.id, 'loanAmount', e.target.value)}
                  className="h-9 text-sm mt-1"
                />
              </div>
              <div>
                <Label className="text-xs font-medium">
                  贷款发放日 <span className="text-red-500">*</span>
                </Label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 w-full justify-start text-left font-normal mt-1",
                        !privateLoan.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {privateLoan.startDate ? format(new Date(privateLoan.startDate), "yyyy-MM-dd") : "选择日期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
                     <Calendar
                       mode="single"
                       selected={privateLoan.startDate ? new Date(privateLoan.startDate) : undefined}
                       onSelect={(date) => {
                         updatePrivateLoan(privateLoan.id, 'startDate', date ? format(date, "yyyy-MM-dd") : '');
                         setStartDateOpen(false);
                       }}
                       disabled={(date) => {
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
                       disabled={(date) => {
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
              <div>
                <Label className="text-xs font-medium">
                  每月还款日 <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min="1"
                  max="31"
                  placeholder="如：15"
                  value={privateLoan.repaymentDayOfMonth || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 31)) {
                      updatePrivateLoan(privateLoan.id, 'repaymentDayOfMonth', value);
                    }
                  }}
                  className="h-9 text-sm mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">输入1-31之间的数字</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium">
                  利率-分
                </Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    step="0.01"
                    min="0"
                    placeholder="0"
                    value={privateLoan.rateFen}
                    onChange={(e) => updateRateFen(privateLoan.id, e.target.value)}
                    className="h-9 text-sm pr-12"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500 text-sm">分</span>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium">
                  利率-厘
                </Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    step="0.01"
                    min="0"
                    placeholder="0"
                    value={privateLoan.rateLi}
                    onChange={(e) => updateRateLi(privateLoan.id, e.target.value)}
                    className="h-9 text-sm pr-12"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500 text-sm">厘</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 下一次应还利息栏位 */}
            <div className="mt-5">
              <div className="space-y-2">
                <div className="rounded-lg p-3 bg-white border border-cyan-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2" style={{ color: '#01BCD6' }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#01BCD6' }}></div>
                      <span className="text-sm font-medium">下一次应还利息</span>
                    </div>
                     <div className="text-right" style={{ color: '#01BCD6' }}>
                       <div className="text-lg font-semibold">
                         {(() => {
                           const requiredFilled = privateLoan.loanAmount && 
                                  privateLoan.startDate &&
                                  privateLoan.endDate && 
                                  (privateLoan.rateFen || privateLoan.rateLi) &&
                                  privateLoan.repaymentDayOfMonth;
                           if (!requiredFilled) return '--';
                           
                           const principalWan = parseFloat(privateLoan.loanAmount);
                           const annualRatePct = parseFloat(privateLoan.annualRate);
                           const repaymentDay = parseInt(privateLoan.repaymentDayOfMonth);
                           
                           if (isNaN(principalWan) || isNaN(annualRatePct) || isNaN(repaymentDay)) return '--';
                           
                           const nextInterest = calculateNextPaymentInterest(
                             principalWan,
                             annualRatePct,
                             privateLoan.startDate,
                             privateLoan.endDate,
                             repaymentDay,
                             360
                           );
                           
                           return nextInterest !== null ? `¥${Math.round(nextInterest).toLocaleString()}` : '--';
                         })()}
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* 其他还款方式保持原样 */
          <>
            {/* 剩余贷款本金 + 贷款结束日期 */}
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

            {/* 利率输入（分、厘分开输入） */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium">
                  利率-分
                </Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    step="0.01"
                    min="0"
                    placeholder="0"
                    value={privateLoan.rateFen}
                    onChange={(e) => updateRateFen(privateLoan.id, e.target.value)}
                    className="h-9 text-sm pr-12"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500 text-sm">分</span>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium">
                  利率-厘
                </Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    step="0.01"
                    min="0"
                    placeholder="0"
                    value={privateLoan.rateLi}
                    onChange={(e) => updateRateLi(privateLoan.id, e.target.value)}
                    className="h-9 text-sm pr-12"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500 text-sm">厘</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
                className="h-9 text-sm pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">分</span>
            </div>
          </div>
          <div>
            <Label className="text-xs font-medium">
              利率-厘
            </Label>
            <div className="relative mt-1">
              <Input
                type="number"
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]*"
                step="0.01"
                min="0"
                max="9"
                placeholder="0"
                value={privateLoan.rateLi}
                onChange={(e) => updateRateLi(privateLoan.id, e.target.value)}
                className="h-9 text-sm pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">厘</span>
            </div>
          </div>
        </div>
        
        {/* 年化利率显示 */}
        {privateLoan.annualRate && parseFloat(privateLoan.annualRate) > 0 && (
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">年化利率：<span className="font-semibold text-gray-900">{privateLoan.annualRate}%</span></p>
          </div>
        )}
        
        {/* 待还利息/每月利息显示 */}
        {privateLoan.repaymentMethod && (
          <div className="mt-5">
            <div className="space-y-2">
              <div className="rounded-lg p-3 bg-white border border-cyan-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2" style={{ color: '#01BCD6' }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#01BCD6' }}></div>
                    <span className="text-sm font-medium">{privateLoan.repaymentMethod === 'interest-first' ? '下一次利息' : '待还利息'}</span>
                  </div>
                  <div className="text-right" style={{ color: '#01BCD6' }}>
                    <div className="text-lg font-semibold">
                      {(() => {
                        // 检查必输项是否完整
                        const requiredFilled = privateLoan.loanAmount && 
                               privateLoan.endDate && 
                               privateLoan.annualRate;
                        
                        if (!requiredFilled) return '--';
                        
                        const principalWan = parseFloat(privateLoan.loanAmount || '');
                        const annualRatePct = parseFloat(privateLoan.annualRate || '');
                        
                        if (isNaN(principalWan) || principalWan <= 0 || isNaN(annualRatePct) || annualRatePct <= 0) return '--';
                        
                        const principal = principalWan * 10000;
                        const annualRate = annualRatePct / 100;
                        
                         if (privateLoan.repaymentMethod === 'interest-first') {
                           // 先息后本：下一次要支付的利息（基于实际天数）
                           const today = new Date();
                           const year = today.getFullYear();
                           const month = today.getMonth() + 1;
                           const daysInCurrentMonth = new Date(year, month, 0).getDate();
                           
                           // 计算下一期利息：使用当前月的实际天数
                           const nextPeriodInterest = calculateInterestFirstPayment(
                             principalWan, 
                             annualRatePct,
                             today.toISOString().split('T')[0],
                             new Date(year, month - 1, daysInCurrentMonth).toISOString().split('T')[0],
                             360 // 使用360天基础
                           );
                           
                           return `¥${Math.round(nextPeriodInterest).toLocaleString()}`;
                        } else if (privateLoan.repaymentMethod === 'lump-sum') {
                          // 一次性还本付息：从今天到结束日期的利息
                          const startDate = new Date(); // 从今天开始计算
                          const endDate = new Date(privateLoan.endDate || '');
                          const diffTime = endDate.getTime() - startDate.getTime();
                          const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                          const yearlyInterest = principal * annualRate;
                          const totalInterest = (yearlyInterest * diffDays) / 365;
                          return `¥${Math.round(totalInterest).toLocaleString()}`;
                        }
                        
                        return '--';
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface SharedPrivateLoanModuleProps {
  children: React.ReactNode;
  existingData?: any;
  privateLoans: PrivateLoanInfo[];
  addPrivateLoan: () => void;
  removePrivateLoan: (id: string) => void;
  resetPrivateLoan: (id: string) => void;
  updatePrivateLoan: (id: string, field: keyof PrivateLoanInfo, value: string) => void;
  isPrivateLoanComplete: (privateLoan: PrivateLoanInfo) => boolean;
  updateRateFen: (id: string, value: string) => void;
  updateRateLi: (id: string, value: string) => void;
}

export const SharedPrivateLoanModule: React.FC<SharedPrivateLoanModuleProps> = ({ 
  children, 
  existingData,
  privateLoans,
  addPrivateLoan,
  removePrivateLoan,
  resetPrivateLoan,
  updatePrivateLoan,
  isPrivateLoanComplete,
  updateRateFen,
  updateRateLi
}) => {
  // 自动添加空白卡片
  useEffect(() => {
    const hasExistingData = existingData && existingData.length > 0;
    const hasCurrentData = privateLoans && privateLoans.length > 0;
    
    if (!hasExistingData && !hasCurrentData) {
      addPrivateLoan();
    }
  }, [existingData, addPrivateLoan]);

  return (
    <>
      {/* 民间借贷列表 */}
      {privateLoans.map((privateLoan, index) => (
        <div key={privateLoan.id} className="mb-4">
          <PrivateLoanCard
            privateLoan={privateLoan}
            index={index}
            updatePrivateLoan={updatePrivateLoan}
            removePrivateLoan={removePrivateLoan}
            resetPrivateLoan={resetPrivateLoan}
            privateLoansLength={privateLoans.length}
            updateRateFen={updateRateFen}
            updateRateLi={updateRateLi}
          />
        </div>
      ))}

      {/* 按钮区域 - 左侧"再录一笔" + 右侧确认按钮 */}
      <div className="grid grid-cols-2 gap-3 mt-6 mb-3">
        {/* 左侧：再录一笔（虚线边框，青色） */}
        <Button
          onClick={addPrivateLoan}
          variant="outline"
          className="h-10 border-dashed text-sm"
          style={{ borderColor: '#01BCD6', color: '#01BCD6' }}
        >
          <Plus className="w-3 h-3 mr-2" />
          再录一笔
        </Button>

        {/* 右侧：确认民间借贷信息（传入的children） */}
        <div className="w-full">
          {children}
        </div>
      </div>
    </>
  );
};