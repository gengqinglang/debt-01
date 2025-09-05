import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { LoanInfo } from '@/hooks/useLoanData';

interface MortgageLoanFieldsProps {
  loan: LoanInfo;
  updateLoan: (id: string, field: keyof LoanInfo, value: string) => void;
  currentLPR_5Year: number;
  currentLPR_5YearPlus: number;
}

export const MortgageLoanFields: React.FC<MortgageLoanFieldsProps> = ({
  loan,
  updateLoan,
  currentLPR_5Year,
  currentLPR_5YearPlus,
}) => {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [commercialStartDateOpen, setCommercialStartDateOpen] = useState(false);
  const [commercialEndDateOpen, setCommercialEndDateOpen] = useState(false);
  const [providentStartDateOpen, setProvidentStartDateOpen] = useState(false);
  const [providentEndDateOpen, setProvidentEndDateOpen] = useState(false);

  return (
    <>
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
                <RadioGroupItem value="fixed" id={`fixed-${loan.id}`} />
                <Label htmlFor={`fixed-${loan.id}`} className="text-xs whitespace-nowrap">固定利率</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="floating" id={`floating-${loan.id}`} />
                <Label htmlFor={`floating-${loan.id}`} className="text-xs whitespace-nowrap">浮动利率</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      )}

      {/* 第五行：利率设置（商业贷款单贷） */}
      {loan.loanType === 'commercial' && loan.rateType === 'fixed' && (
        <div className="grid grid-cols-1 gap-4 mt-5">
          <div className="space-y-2 min-w-0">
            <Label className="text-xs font-medium">
              固定利率 (%) <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="如：5.88"
              value={loan.fixedRate}
              onChange={(e) => updateLoan(loan.id, 'fixedRate', e.target.value)}
              className="h-9 text-sm"
            />
          </div>
        </div>
      )}

      {loan.loanType === 'commercial' && loan.rateType === 'floating' && (
        <div className="grid grid-cols-1 gap-4 mt-5">
          <div className="space-y-2 min-w-0">
            <Label className="text-xs font-medium">
              基准利率选择 <span className="text-red-500">*</span>
            </Label>
            <Select value={loan.rateType === 'floating' ? 'lpr-5y' : ''} onValueChange={(value) => {
              // This is a simplified version - in real implementation you'd need proper benchmark rate handling
              updateLoan(loan.id, 'rateType', 'floating');
            }}>
              <SelectTrigger className="h-9 text-sm w-full">
                <SelectValue placeholder="选择基准利率" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lpr-5y">5年期以上LPR ({currentLPR_5Year}%)</SelectItem>
                <SelectItem value="lpr-5y-plus">5年期以上LPR+ ({currentLPR_5YearPlus}%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {loan.loanType === 'commercial' && loan.rateType === 'floating' && (
        <div className="grid grid-cols-1 gap-4 mt-3">
          <div className="space-y-2 min-w-0">
            <Label className="text-xs font-medium">
              浮动点数 (BP) <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              placeholder="如：88（即+0.88%）"
              value={loan.floatingRateAdjustment}
              onChange={(e) => updateLoan(loan.id, 'floatingRateAdjustment', e.target.value)}
              className="h-9 text-sm"
            />
          </div>
        </div>
      )}

      {/* 公积金贷款的字段 */}
      {loan.loanType === 'provident' && (
        <>
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
                公积金利率 (%) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                placeholder="如：3.25"
                value={loan.providentRate}
                onChange={(e) => updateLoan(loan.id, 'providentRate', e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>
        </>
      )}

      {/* 组合贷款的字段 */}
      {loan.loanType === 'combination' && (
        <>
          {/* 商业贷款部分 */}
          <div className="mt-5 p-4 bg-gray-50 rounded-lg">
            <h5 className="text-xs font-medium text-gray-700 mb-3">商业贷款部分</h5>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 min-w-0">
                <Label className="text-xs font-medium">
                  原始金额(万元) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="如：200"
                  value={loan.commercialLoanAmount}
                  onChange={(e) => updateLoan(loan.id, 'commercialLoanAmount', e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-2 min-w-0">
                <Label className="text-xs font-medium">
                  剩余本金(万元) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="如：150"
                  value={loan.commercialRemainingPrincipal || ''}
                  onChange={(e) => updateLoan(loan.id, 'commercialRemainingPrincipal', e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2 min-w-0">
                <Label className="text-xs font-medium">
                  开始日期 <span className="text-red-500">*</span>
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
                  结束日期 <span className="text-red-500">*</span>
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

            <div className="grid grid-cols-2 gap-4 mt-4">
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
                    <RadioGroupItem value="fixed" id={`commercial-fixed-${loan.id}`} />
                    <Label htmlFor={`commercial-fixed-${loan.id}`} className="text-xs whitespace-nowrap">固定利率</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="floating" id={`commercial-floating-${loan.id}`} />
                    <Label htmlFor={`commercial-floating-${loan.id}`} className="text-xs whitespace-nowrap">浮动利率</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* 商业贷款利率设置 */}
            {loan.commercialRateType === 'fixed' && (
              <div className="grid grid-cols-1 gap-4 mt-4">
                <div className="space-y-2 min-w-0">
                  <Label className="text-xs font-medium">
                    固定利率 (%) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="如：5.88"
                    value={loan.commercialFixedRate}
                    onChange={(e) => updateLoan(loan.id, 'commercialFixedRate', e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            )}

            {loan.commercialRateType === 'floating' && (
              <>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <div className="space-y-2 min-w-0">
                  <Label className="text-xs font-medium">
                    基准利率选择 <span className="text-red-500">*</span>
                  </Label>
                  <Select value={loan.commercialRateType === 'floating' ? 'lpr-5y' : ''} onValueChange={(value) => {
                    // Simplified handling
                    updateLoan(loan.id, 'commercialRateType', 'floating');
                  }}>
                    <SelectTrigger className="h-9 text-sm w-full">
                      <SelectValue placeholder="选择基准利率" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lpr-5y">5年期以上LPR ({currentLPR_5Year}%)</SelectItem>
                      <SelectItem value="lpr-5y-plus">5年期以上LPR+ ({currentLPR_5YearPlus}%)</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-3">
                  <div className="space-y-2 min-w-0">
                    <Label className="text-xs font-medium">
                      浮动点数 (BP) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="如：88（即+0.88%）"
                      value={loan.commercialFloatingRateAdjustment}
                      onChange={(e) => updateLoan(loan.id, 'commercialFloatingRateAdjustment', e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 公积金贷款部分 */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h5 className="text-xs font-medium text-gray-700 mb-3">公积金贷款部分</h5>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 min-w-0">
                <Label className="text-xs font-medium">
                  原始金额(万元) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="如：100"
                  value={loan.providentLoanAmount}
                  onChange={(e) => updateLoan(loan.id, 'providentLoanAmount', e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-2 min-w-0">
                <Label className="text-xs font-medium">
                  剩余本金(万元) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="如：80"
                  value={loan.providentRemainingPrincipal || ''}
                  onChange={(e) => updateLoan(loan.id, 'providentRemainingPrincipal', e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2 min-w-0">
                <Label className="text-xs font-medium">
                  开始日期 <span className="text-red-500">*</span>
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
                  结束日期 <span className="text-red-500">*</span>
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

            <div className="grid grid-cols-2 gap-4 mt-4">
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
                  公积金利率 (%) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="如：3.25"
                  value={loan.providentRate}
                  onChange={(e) => updateLoan(loan.id, 'providentRate', e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};