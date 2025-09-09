import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalendarIcon, Trash2, Plus, Percent } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useCarLoanData, CarLoanInfo } from '@/hooks/useCarLoanData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface CarLoanCardProps {
  carLoan: CarLoanInfo;
  index: number;
  updateCarLoan: (id: string, field: keyof CarLoanInfo, value: string) => void;
  removeCarLoan: (id: string) => void;
  resetCarLoan: (id: string) => void;
  carLoansLength: number;
}

const CarLoanCard: React.FC<CarLoanCardProps> = ({
  carLoan,
  index,
  updateCarLoan,
  removeCarLoan,
  resetCarLoan,
  carLoansLength,
}) => {
  const calculateCarLoanMonthlyPayment = (loan: CarLoanInfo) => {
    if (loan.loanType === 'installment') {
      return parseFloat(loan.installmentAmount || '0');
    }
    
    // For bank loans, use remaining months calculation
    const principalWan = parseFloat(loan.remainingPrincipal || loan.principal || '0');
    const annualRate = parseFloat(loan.interestRate || '0') / 100;
    
    if (principalWan <= 0 || annualRate <= 0) return 0;
    
    // Calculate remaining months from dates
    let remainingMonths = 0;
    if (loan.startDateMonth && loan.endDateMonth) {
      const today = new Date();
      const endDate = new Date(loan.endDateMonth);
      const diffTime = endDate.getTime() - today.getTime();
      remainingMonths = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)));
    }
    
    if (remainingMonths <= 0) return 0;
    
    // Use unified calculation logic from loanCalculations
    const monthlyRate = annualRate / 12;
    const principalYuan = principalWan * 10000;
    
    if (loan.repaymentMethod === 'equal-principal') {
      return principalYuan / remainingMonths + principalYuan * monthlyRate;
    }
    
    return principalYuan * (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / (Math.pow(1 + monthlyRate, remainingMonths) - 1);
  };
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  
  return (
    <div className="rounded-lg py-6 px-3 bg-white" style={{ border: '2px solid #CAF4F7' }}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-900">
          {carLoan.vehicleName || `车贷 ${index + 1}`}
        </h4>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button 
              className="p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700"
              title={carLoansLength > 1 ? "删除此车贷" : "清空此车贷"}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {carLoansLength > 1 ? '确认删除' : '确认清空'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {carLoansLength > 1 
                  ? '您确定要删除这笔车贷吗？此操作不可撤销。'
                  : '您确定要清空这笔车贷信息吗？将恢复至默认值。'
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                if (carLoansLength > 1) {
                  removeCarLoan(carLoan.id);
                } else {
                  resetCarLoan(carLoan.id);
                }
              }}>
                {carLoansLength > 1 ? '确定删除' : '确定清空'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <div className="space-y-4">
        {/* 车辆名称和贷款类型在一行 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-medium">
              车辆名称 <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="如：奔驰C200"
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
              onValueChange={(value: 'installment' | 'bankLoan') => updateCarLoan(carLoan.id, 'loanType', value)}
            >
              <SelectTrigger className="h-9 text-sm mt-1">
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
        {carLoan.loanType === 'installment' ? (
          /* 分期类型字段 */
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium">
                  每期分期金额（元） <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  placeholder="如：3000"
                  value={carLoan.installmentAmount}
                  onChange={(e) => updateCarLoan(carLoan.id, 'installmentAmount', e.target.value)}
                  className="h-9 text-sm mt-1"
                />
              </div>
              <div>
                <Label className="text-xs font-medium">
                  剩余期限（月） <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  placeholder="如：24"
                  value={carLoan.remainingInstallments}
                  onChange={(e) => updateCarLoan(carLoan.id, 'remainingInstallments', e.target.value)}
                  className="h-9 text-sm mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium">
                每月还款日 <span className="text-red-500">*</span>
              </Label>
              <Select
                value={carLoan.repaymentDay || '10'}
                onValueChange={(value) => updateCarLoan(carLoan.id, 'repaymentDay', value)}
              >
                <SelectTrigger className="h-9 text-sm mt-1">
                  <SelectValue placeholder="选择还款日" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}号
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          /* 银行贷款类型字段 */
          <div className="space-y-5">
            {/* 金额 + 剩余本金 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 min-w-0">
                <Label className="text-xs font-medium">
                  贷款原始金额(万元) <span className="text-red-500">*</span>
                </Label>
                <input
                  type="text"
                  placeholder="如：30"
                  value={carLoan.principal || ''}
                  onChange={(e) => updateCarLoan(carLoan.id, 'principal', e.target.value)}
                  className="h-9 w-full min-w-0 box-border rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2 min-w-0">
                <Label className="text-xs font-medium">
                  贷款剩余本金(万元) <span className="text-red-500">*</span>
                </Label>
                <input
                  type="text"
                  placeholder="如：25"
                  value={carLoan.remainingPrincipal || ''}
                  onChange={(e) => updateCarLoan(carLoan.id, 'remainingPrincipal', e.target.value)}
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
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 w-full justify-start text-left font-normal",
                        !carLoan.startDateMonth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {carLoan.startDateMonth ? format(new Date(carLoan.startDateMonth), "yyyy-MM-dd") : "选择日期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
                     <Calendar
                       mode="single"
                       selected={carLoan.startDateMonth ? new Date(carLoan.startDateMonth) : undefined}
                       onSelect={(date) => {
                         updateCarLoan(carLoan.id, 'startDateMonth', date ? format(date, "yyyy-MM-dd") : '');
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
                        !carLoan.endDateMonth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {carLoan.endDateMonth ? format(new Date(carLoan.endDateMonth), "yyyy-MM-dd") : "选择日期"}
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

            {/* 还款方式 + 贷款利率 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 min-w-0">
                <Label className="text-xs font-medium">
                  还款方式 <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={carLoan.repaymentMethod || ''}
                  onValueChange={(value) => updateCarLoan(carLoan.id, 'repaymentMethod', value)}
                  className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="equal-payment" id={`car-equal-payment-${carLoan.id}`} />
                    <Label htmlFor={`car-equal-payment-${carLoan.id}`} className="text-xs whitespace-nowrap">等额本息</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="equal-principal" id={`car-equal-principal-${carLoan.id}`} />
                    <Label htmlFor={`car-equal-principal-${carLoan.id}`} className="text-xs whitespace-nowrap">等额本金</Label>
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
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    placeholder="如：6.5"
                    value={carLoan.interestRate || ''}
                    onChange={(e) => updateCarLoan(carLoan.id, 'interestRate', e.target.value)}
                    className="pr-8 text-sm h-9"
                  />
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                </div>
              </div>
            </div>

            {/* 月供金额显示（始终展示，未完成显示'--'） */}
            <div className="mt-2 pt-2">
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
                         const basicRequired = carLoan.vehicleName && carLoan.loanType;
                         if (!basicRequired) return '--';
                         
                         if (carLoan.loanType === 'bankLoan') {
                           // 银行贷款类型必填项检查
                           const requiredFilled = carLoan.principal && 
                                  carLoan.remainingPrincipal && 
                                  carLoan.startDateMonth && 
                                  carLoan.endDateMonth && 
                                  carLoan.repaymentMethod && 
                                  carLoan.interestRate;
                           
                           if (!requiredFilled) return '--';
                           const v = calculateCarLoanMonthlyPayment(carLoan);
                           return v > 0 ? `¥${Math.round(v).toLocaleString()}` : '--';
                          } else if (carLoan.loanType === 'installment') {
                            // 分期类型必填项检查
                            const requiredFilled = carLoan.installmentAmount && 
                                   carLoan.remainingInstallments &&
                                   carLoan.repaymentDay;
                            if (!requiredFilled) return '--';
                            
                            const installmentAmount = parseFloat(carLoan.installmentAmount || '0');
                            return installmentAmount > 0 ? `¥${Math.round(installmentAmount).toLocaleString()}` : '--';
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

interface SharedCarLoanModuleProps {
  children: React.ReactNode;
  existingData?: any;
  carLoans: any[];
  addCarLoan: () => void;
  removeCarLoan: (id: string) => void;
  resetCarLoan: (id: string) => void;
  updateCarLoan: (id: string, field: any, value: string) => void;
  isCarLoanComplete: (carLoan: any) => boolean;
}

export const SharedCarLoanModule: React.FC<SharedCarLoanModuleProps> = ({ 
  children, 
  existingData,
  carLoans,
  addCarLoan,
  removeCarLoan,
  resetCarLoan,
  updateCarLoan,
  isCarLoanComplete
}) => {
  const { toast } = useToast();
  
  // 自动添加空白卡片
  useEffect(() => {
    const hasExistingData = existingData && existingData.length > 0;
    const hasCurrentData = carLoans && carLoans.length > 0;
    
    if (!hasExistingData && !hasCurrentData) {
      addCarLoan();
    }
  }, [existingData, addCarLoan]);
  
  // 检查所有必输栏位是否已填写
  const isAllRequiredFieldsFilled = () => {
    return carLoans.every(carLoan => {
      // 基本必填项：车辆名称和贷款类型
      const basicRequired = carLoan.vehicleName && carLoan.loanType;
      
      if (!basicRequired) return false;
      
      // 根据贷款类型检查特定必填项
      if (carLoan.loanType === 'installment') {
        // 分期类型必填项
        return carLoan.installmentAmount && carLoan.remainingInstallments;
      } else if (carLoan.loanType === 'bankLoan') {
        // 银行贷款类型必填项
        return carLoan.principal && 
               carLoan.remainingPrincipal && 
               carLoan.startDateMonth && 
               carLoan.endDateMonth && 
               carLoan.repaymentMethod && 
               carLoan.interestRate;
      }
      
      return false;
    });
  };

  return (
    <>
      {/* 车贷列表 */}
      {carLoans.map((carLoan, index) => (
        <div key={carLoan.id} className="mb-4">
          <CarLoanCard
            carLoan={carLoan}
            index={index}
            updateCarLoan={updateCarLoan}
            removeCarLoan={removeCarLoan}
            resetCarLoan={resetCarLoan}
            carLoansLength={carLoans.length}
          />
        </div>
      ))}

      {/* 按钮区域 - 与房贷保持一致的grid布局 */}
      <div className="">
        <div className="grid grid-cols-2 gap-3 mt-6 mb-3">
          {/* 左侧：再录一笔（虚线边框，青色） */}
          <Button
            onClick={addCarLoan}
            variant="outline"
            className="h-10 border-dashed text-sm"
            style={{ borderColor: '#01BCD6', color: '#01BCD6' }}
          >
            <Plus className="w-3 h-3 mr-2" />
            再录一笔
          </Button>
          
          {/* 右侧：确认车贷信息（传入的children） */}
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};