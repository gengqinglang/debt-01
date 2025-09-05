import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Trash2, Plus } from 'lucide-react';
import { PrivateLoanInfo } from '@/hooks/usePrivateLoanData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface PrivateLoanCardProps {
  privateLoan: PrivateLoanInfo;
  index: number;
  updatePrivateLoan: (id: string, field: keyof PrivateLoanInfo, value: string) => void;
  removePrivateLoan: (id: string) => void;
  privateLoansLength: number;
  updateRateFen: (id: string, value: string) => void;
  updateRateLi: (id: string, value: string) => void;
}

const PrivateLoanCard: React.FC<PrivateLoanCardProps> = ({
  privateLoan,
  index,
  updatePrivateLoan,
  removePrivateLoan,
  privateLoansLength,
  updateRateFen,
  updateRateLi,
}) => {
  const [endDateOpen, setEndDateOpen] = useState(false);
  
  return (
    <div className="rounded-lg py-6 px-3 bg-white" style={{ border: '2px solid #CAF4F7' }}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-900">
          民间借贷 {index + 1}
        </h4>
        {privateLoansLength > 1 && (
          <button 
            onClick={() => removePrivateLoan(privateLoan.id)}
            className="p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700"
            title="删除此民间借贷"
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
                <SelectItem value="equal-payment">等额本息</SelectItem>
                <SelectItem value="equal-principal">等额本金</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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
                        "h-9 w-full justify-start text-left font-normal",
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
  updatePrivateLoan,
  isPrivateLoanComplete,
  updateRateFen,
  updateRateLi
}) => {
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
            privateLoansLength={privateLoans.length}
            updateRateFen={updateRateFen}
            updateRateLi={updateRateLi}
          />
        </div>
      ))}

      {/* 按钮区域 - 一行显示 */}
      {/* 按钮区域 - 只显示确认按钮，不显示"再录一笔" */}
      <div className="mt-6 mb-3">
        {children}
      </div>
    </>
  );
};