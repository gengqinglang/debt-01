import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CalendarDays, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import type { DebtInfo } from '@/pages/FinancialStatusPage';

interface RepaymentCalendarProps {
  debts: DebtInfo[];
}

// 债务类型中文映射
const debtTypeNames: Record<string, string> = {
  mortgage: '房贷',
  carLoan: '车贷', 
  consumerLoan: '消费贷',
  businessLoan: '经营贷',
  privateLoan: '民间贷',
  creditCard: '信用卡'
};

// 格式化金额
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// 获取债务的还款日
const getDebtDueDay = (debt: DebtInfo): number => {
  // 优先使用车贷开始日期的日期
  if (debt.type === 'carLoan' && debt.carStartDate) {
    const startDate = new Date(debt.carStartDate);
    return startDate.getDate();
  }
  
  // 预留字段：如果有自定义还款日
  if ((debt as any).dueDay) {
    return (debt as any).dueDay;
  }
  
  // 默认10号
  return 10;
};

const RepaymentCalendar: React.FC<RepaymentCalendarProps> = ({ debts }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 计算当月每日的还款信息
  const monthlyRepayments = useMemo(() => {
    const repaymentMap = new Map<string, Array<{ debt: DebtInfo; amount: number }>>();
    
    const validDebts = debts.filter(debt => 
      (debt.amount || 0) > 0 && 
      (debt.remainingMonths || 0) > 0 &&
      (debt.monthlyPayment || 0) > 0
    );

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    validDebts.forEach(debt => {
      const dueDay = getDebtDueDay(debt);
      
      // 检查当月是否有这个还款日
      const dueDate = new Date(year, month, dueDay);
      if (dueDate.getMonth() === month) {
        const dateKey = format(dueDate, 'yyyy-MM-dd');
        
        if (!repaymentMap.has(dateKey)) {
          repaymentMap.set(dateKey, []);
        }
        
        repaymentMap.get(dateKey)!.push({
          debt,
          amount: debt.monthlyPayment || 0
        });
      }
    });

    return repaymentMap;
  }, [debts, currentMonth]);

  // 获取指定日期的还款信息
  const getDateRepayments = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return monthlyRepayments.get(dateKey) || [];
  };

  // 自定义日期渲染
  const dayContent = (day: Date) => {
    const repayments = getDateRepayments(day);
    
    if (repayments.length === 0) {
      return <span>{day.getDate()}</span>;
    }

    const totalAmount = repayments.reduce((sum, r) => sum + r.amount, 0);
    const displayAmount = totalAmount >= 10000 
      ? `${(totalAmount / 10000).toFixed(1)}万`
      : `${(totalAmount / 1000).toFixed(1)}k`;

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <span className="text-sm font-medium">{day.getDate()}</span>
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="bg-[#01BCD6] text-white text-xs px-1 py-0.5 rounded-full min-w-[24px] text-center">
            ¥{displayAmount}
          </div>
        </div>
      </div>
    );
  };

  // 处理日期点击
  const handleDateClick = (date: Date | undefined) => {
    if (date && getDateRepayments(date).length > 0) {
      setSelectedDate(date);
    }
  };

  // 获取选中日期的还款信息
  const selectedRepayments = selectedDate ? getDateRepayments(selectedDate) : [];
  const selectedTotal = selectedRepayments.reduce((sum, r) => sum + r.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <CalendarDays className="w-5 h-5 text-[#01BCD6] mr-2" />
          还款日历
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateClick}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="w-full flex justify-center"
          components={{
            Day: ({ date, ...props }) => (
              <div 
                {...props}
                className={`
                  w-10 h-10 p-0 font-normal aria-selected:opacity-100 relative
                  ${getDateRepayments(date).length > 0 
                    ? 'cursor-pointer hover:bg-[#B3EBEF]/20' 
                    : ''
                  }
                `}
              >
                {dayContent(date)}
              </div>
            )
          }}
        />

        {/* 底部抽屉 - 显示选中日期的还款详情 */}
        <Sheet open={!!selectedDate && selectedRepayments.length > 0} onOpenChange={(open) => !open && setSelectedDate(undefined)}>
          <SheetContent side="bottom" className="h-auto max-h-[50vh]">
            <SheetHeader>
              <SheetTitle className="flex items-center">
                <DollarSign className="w-5 h-5 text-[#01BCD6] mr-2" />
                {selectedDate && format(selectedDate, 'yyyy年MM月dd日')} 还款明细
              </SheetTitle>
            </SheetHeader>
            
            <div className="mt-4 space-y-4">
              {/* 总计 */}
              <div className="bg-gradient-to-r from-[#B3EBEF]/20 to-[#8FD8DC]/20 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">当日还款总额</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(selectedTotal)}
                  </div>
                </div>
              </div>

              {/* 还款清单 */}
              <div className="space-y-3">
                {selectedRepayments.map((repayment, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {debtTypeNames[repayment.debt.type] || repayment.debt.type}
                      </div>
                      {repayment.debt.name && (
                        <div className="text-sm text-gray-500">{repayment.debt.name}</div>
                      )}
                    </div>
                    <div className="text-lg font-bold text-[#01BCD6]">
                      {formatCurrency(repayment.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default RepaymentCalendar;