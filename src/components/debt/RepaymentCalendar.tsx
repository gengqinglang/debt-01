import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import type { DebtInfo } from '@/pages/FinancialStatusPage';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { 
  buildRepaymentItems, 
  getMonthlyRepaymentDates,
  type RepaymentItem
} from '@/lib/repaymentSchedule';

interface RepaymentCalendarProps {
  debts: DebtInfo[];
}

// 格式化金额
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const RepaymentCalendar: React.FC<RepaymentCalendarProps> = ({ debts }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Debug flag to show container outlines
  const debug = false;

  // 计算当月每日的还款信息 - 使用统一的还款计划构建逻辑
  const monthlyRepayments = useMemo(() => {
    const repaymentItems = buildRepaymentItems(debts);
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    return getMonthlyRepaymentDates(repaymentItems, year, month);
  }, [debts, currentMonth]);

  // 自动选择当月有还款计划的最早日期
  useEffect(() => {
    if (monthlyRepayments.size > 0) {
      // 获取所有有还款的日期并排序
      const repaymentDates = Array.from(monthlyRepayments.keys())
        .map(dateKey => new Date(dateKey))
        .sort((a, b) => a.getTime() - b.getTime());
      
      // 只有在没有选中日期或选中的日期不在当月还款日期中时，才自动选择最早日期
      if (repaymentDates.length > 0 && (!selectedDate || !monthlyRepayments.has(format(selectedDate, 'yyyy-MM-dd')))) {
        setSelectedDate(repaymentDates[0]);
      }
    } else {
      // 如果当月没有还款，清除选中状态
      setSelectedDate(undefined);
    }
  }, [monthlyRepayments]);

  // 获取指定日期的还款信息
  const getDateRepayments = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return monthlyRepayments.get(dateKey) || [];
  };

  // 自定义日期渲染
  const dayContent = (day: Date) => {
    const repayments = getDateRepayments(day);
    
    return (
      <div className="relative flex flex-col items-center justify-center w-full h-full">
        <span className="text-sm">{day.getDate()}</span>
        {repayments.length > 0 && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-1.5 w-1.5 bg-[#01BCD6] rounded-full"></div>
        )}
      </div>
    );
  };

  // 处理日期点击
  const handleDateClick = (date: Date | undefined) => {
    console.log('Selected date:', date);
    if (date) {
      setSelectedDate(date);
    }
  };

  // 获取选中日期的还款信息
  const selectedRepayments = selectedDate ? getDateRepayments(selectedDate) : [];
  const selectedTotal = selectedRepayments.reduce((sum, r) => sum + r.amount, 0);

  return (
    <Card>
      <CardHeader className="pt-6 pb-3">
        <CardTitle className="flex items-center text-lg">
          <CalendarDays className="w-5 h-5 text-[#01BCD6] mr-2" />
          还款日历
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className={`px-6 sm:px-8 py-3 sm:py-5 flex justify-center overflow-hidden ${debug ? 'border-2 border-red-500' : ''}`}>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateClick}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            locale={zhCN}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const checkDate = new Date(date);
              checkDate.setHours(0, 0, 0, 0);
              return checkDate < today; // 禁用今天之前的日期
            }}
            className={`w-full pointer-events-auto p-0 ${debug ? 'border-2 border-blue-500' : ''}`}
            classNames={{
              months: "w-full flex justify-center",
              month: "scale-[1.0] md:scale-[1.05] origin-top",
              table: "w-full border-collapse space-y-0",
              row: "flex w-full mt-0",
              caption: "relative flex justify-center pt-0 mb-3",
              head_row: "flex w-full mb-0",
              head_cell: "text-muted-foreground rounded-md w-10 h-8 sm:w-14 sm:h-10 font-normal text-[0.75rem] leading-none",
              cell: "text-center text-sm relative p-0 w-10 h-10 sm:w-14 sm:h-14 focus-within:relative focus-within:z-20",
              day: cn(
                buttonVariants({ variant: "ghost" }),
                "h-10 w-10 sm:h-14 sm:w-14 p-0 font-normal aria-selected:opacity-100 flex items-start justify-center pt-0.5 sm:pt-1 hover:bg-transparent"
              ),
              day_selected: "bg-gradient-to-r from-[#B3EBEF]/20 to-[#8FD8DC]/20 text-primary-foreground focus:bg-gradient-to-r focus:from-[#B3EBEF]/20 focus:to-[#8FD8DC]/20 focus:text-primary-foreground",
              day_today: "bg-transparent",
              day_disabled: "text-gray-300 opacity-50 cursor-not-allowed" // 过去日期样式
            }}
            components={{
              DayContent: ({ date }) => dayContent(date)
            }}
          />
        </div>

        {/* 选中日期还款详情 */}
        <div className={`px-3 sm:px-4 pb-6 pt-2 flex justify-center ${debug ? 'border-2 border-green-500' : ''}`}>
          <div className="w-full">
            {!selectedDate ? (
              <div className="text-center py-8 text-gray-500">
                请选择日期查看还款计划
              </div>
            ) : selectedRepayments.length > 0 ? (
              <>
                {/* 总计卡片 */}
                <div className="bg-gradient-to-r from-[#B3EBEF]/20 to-[#8FD8DC]/20 rounded-lg p-4 mb-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">
                      {format(selectedDate, 'yyyy年MM月dd日', { locale: zhCN })} 还款总额
                    </div>
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
                          {repayment.type}
                        </div>
                        <div className="text-sm text-gray-500">
                          {repayment.name}
                          {repayment.subType && ` - ${repayment.subType}`}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-[#01BCD6]">
                        {formatCurrency(repayment.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* 空状态 */
              <div className="flex flex-col items-center justify-center py-8">
                <CalendarDays className="w-12 h-12 text-gray-300 mb-3" />
                <div className="text-gray-500 text-center">
                  <div className="font-medium mb-1">
                    {format(selectedDate, 'yyyy年MM月dd日', { locale: zhCN })} 无还款计划
                  </div>
                  <div className="text-sm">您在此日期没有安排任何还款</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RepaymentCalendar;