import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CalendarDays, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import type { DebtInfo } from '@/pages/FinancialStatusPage';
import { calculateEqualPaymentMonthly, calculateEqualPrincipalFirstMonthly } from '@/lib/loanCalculations';
import type { ConsumerLoanInfo } from '@/hooks/useConsumerLoanData';
import type { CarLoanInfo } from '@/hooks/useCarLoanData';
import type { BusinessLoanInfo } from '@/hooks/useBusinessLoanData';

interface RepaymentCalendarProps {
  debts: DebtInfo[];
}

// Individual loan interfaces for localStorage data
interface MortgageLoanInfo {
  id: string;
  loanType: 'commercial' | 'housingFund' | 'combination';
  amount: string;
  term: string;
  interestRate: string;
  startDate?: string;
  remainingPrincipal?: string;
  repaymentMethod?: string;
}

interface PrivateLoanInfo {
  id: string;
  name?: string;
  loanAmount: string;
  monthlyPayment?: string;
  startDate: string;
  endDate?: string;
  remainingMonths?: string;
}

interface CreditCardInfo {
  id: string;
  bankName?: string;
  monthlyPayment: string;
  remainingAmount?: string;
  minimumPayment?: string;
}

// Individual repayment item
interface RepaymentItem {
  type: string;
  subType?: string;
  name: string;
  amount: number;
  dueDay: number;
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

// 从localStorage加载各类贷款的详细数据
const loadIndividualLoanData = () => {
  try {
    const mortgageData = JSON.parse(localStorage.getItem('mortgage_loans') || '[]') as MortgageLoanInfo[];
    const carLoanData = JSON.parse(localStorage.getItem('car_loans') || '[]') as CarLoanInfo[];
    const consumerLoanData = JSON.parse(localStorage.getItem('consumer_loans') || '[]') as ConsumerLoanInfo[];
    const businessLoanData = JSON.parse(localStorage.getItem('business_loans') || '[]') as BusinessLoanInfo[];
    const privateLoanData = JSON.parse(localStorage.getItem('private_loans') || '[]') as PrivateLoanInfo[];
    const creditCardData = JSON.parse(localStorage.getItem('credit_cards') || '[]') as CreditCardInfo[];
    
    return {
      mortgageLoans: mortgageData,
      carLoans: carLoanData,
      consumerLoans: consumerLoanData,
      businessLoans: businessLoanData,
      privateLoans: privateLoanData,
      creditCards: creditCardData
    };
  } catch (error) {
    console.error('Error loading individual loan data:', error);
    return {
      mortgageLoans: [],
      carLoans: [],
      consumerLoans: [],
      businessLoans: [],
      privateLoans: [],
      creditCards: []
    };
  }
};

// 获取还款日（从日期字符串中提取日数）
const getDueDayFromDate = (dateStr?: string, defaultDay: number = 10): number => {
  if (!dateStr) return defaultDay;
  
  try {
    const date = new Date(dateStr);
    const day = date.getDate();
    return day >= 1 && day <= 31 ? day : defaultDay;
  } catch {
    return defaultDay;
  }
};

// 计算月供金额
const calculateMonthlyPayment = (
  principal: number, // 本金（元）
  annualRate: number, // 年利率（小数）
  termMonths: number, // 期限（月）
  repaymentMethod: string = 'equal-payment'
): number => {
  if (principal <= 0 || termMonths <= 0) return 0;
  
  if (annualRate <= 0) {
    return principal / termMonths;
  }
  
  if (repaymentMethod === 'equal-principal') {
    return calculateEqualPrincipalFirstMonthly(principal, annualRate, termMonths);
  } else {
    return calculateEqualPaymentMonthly(principal, annualRate, termMonths);
  }
};

// 处理个人贷款数据，生成还款计划
const processIndividualLoans = (): RepaymentItem[] => {
  const loanData = loadIndividualLoanData();
  const repaymentItems: RepaymentItem[] = [];
  
  // 处理房贷
  loanData.mortgageLoans.forEach((loan) => {
    if (loan.amount && parseFloat(loan.amount) > 0) {
      const principal = parseFloat(loan.remainingPrincipal || loan.amount) * 10000; // 万元转元
      const rate = parseFloat(loan.interestRate || '0') / 100;
      const termMonths = parseFloat(loan.term || '0') * 12;
      const monthlyPayment = calculateMonthlyPayment(principal, rate, termMonths, loan.repaymentMethod);
      
      if (monthlyPayment > 0) {
        repaymentItems.push({
          type: '房贷',
          subType: loan.loanType === 'commercial' ? '商业贷款' : loan.loanType === 'housingFund' ? '公积金贷款' : '组合贷款',
          name: `房贷-${loan.loanType === 'commercial' ? '商贷' : loan.loanType === 'housingFund' ? '公积金' : '组合'}`,
          amount: monthlyPayment,
          dueDay: getDueDayFromDate(loan.startDate)
        });
      }
    }
  });
  
  // 处理车贷
  loanData.carLoans.forEach((loan) => {
    let monthlyPayment = 0;
    let dueDay = 10;
    
    if (loan.loanType === 'installment' && loan.installmentAmount) {
      monthlyPayment = parseFloat(loan.installmentAmount);
      // 分期贷款通常没有明确的开始日期，使用默认还款日
    } else if (loan.loanType === 'bankLoan') {
      const principal = parseFloat(loan.remainingPrincipal || loan.principal || '0') * 10000; // 万元转元
      const rate = parseFloat(loan.interestRate || '0') / 100;
      let termMonths = 0;
      
      if (loan.startDateMonth && loan.endDateMonth) {
        const [sy, sm] = loan.startDateMonth.split('-').map(Number);
        const [ey, em] = loan.endDateMonth.split('-').map(Number);
        termMonths = (ey - sy) * 12 + (em - sm);
        dueDay = sm; // 使用开始月份作为还款日
      } else if (loan.term) {
        termMonths = parseFloat(loan.term) * 12;
      }
      
      monthlyPayment = calculateMonthlyPayment(principal, rate, termMonths, loan.repaymentMethod);
    }
    
    if (monthlyPayment > 0) {
      repaymentItems.push({
        type: '车贷',
        subType: loan.loanType === 'installment' ? '分期还款' : '银行贷款',
        name: loan.vehicleName || `车贷-${loan.loanType === 'installment' ? '分期' : '银行'}`,
        amount: monthlyPayment,
        dueDay
      });
    }
  });
  
  // 处理消费贷
  loanData.consumerLoans.forEach((loan) => {
    if (loan.loanAmount && parseFloat(loan.loanAmount) > 0) {
      let monthlyPayment = 0;
      
      if (loan.repaymentMethod === 'interest-first') {
        // 先息后本：月供 = 本金 * 月利率
        const principal = parseFloat(loan.loanAmount) * 10000;
        const rate = parseFloat(loan.annualRate || '0') / 100 / 12;
        monthlyPayment = principal * rate;
      } else if (loan.repaymentMethod === 'lump-sum') {
        // 一次性还本付息：月供为0
        monthlyPayment = 0;
      } else {
        // 等额本息/等额本金
        const principal = parseFloat(loan.remainingPrincipal || loan.loanAmount) * 10000;
        const rate = parseFloat(loan.annualRate || '0') / 100;
        const termMonths = parseFloat(loan.loanTerm || '0') * 12;
        monthlyPayment = calculateMonthlyPayment(principal, rate, termMonths, loan.repaymentMethod);
      }
      
      if (monthlyPayment > 0) {
        repaymentItems.push({
          type: '消费贷',
          subType: loan.repaymentMethod,
          name: loan.name || '消费贷',
          amount: monthlyPayment,
          dueDay: getDueDayFromDate(loan.startDate)
        });
      }
    }
  });
  
  // 处理经营贷
  loanData.businessLoans.forEach((loan) => {
    if (loan.loanAmount && parseFloat(loan.loanAmount) > 0) {
      let monthlyPayment = 0;
      
      if (loan.repaymentMethod === 'interest-first') {
        const principal = parseFloat(loan.loanAmount) * 10000;
        const rate = parseFloat(loan.annualRate || '0') / 100 / 12;
        monthlyPayment = principal * rate;
      } else if (loan.repaymentMethod === 'lump-sum') {
        monthlyPayment = 0;
      } else {
        const principal = parseFloat(loan.loanAmount) * 10000;
        const rate = parseFloat(loan.annualRate || '0') / 100;
        const termMonths = parseFloat(loan.loanTerm || '0') * 12;
        monthlyPayment = calculateMonthlyPayment(principal, rate, termMonths, loan.repaymentMethod);
      }
      
      if (monthlyPayment > 0) {
        repaymentItems.push({
          type: '经营贷',
          subType: loan.repaymentMethod,
          name: loan.name || '经营贷',
          amount: monthlyPayment,
          dueDay: getDueDayFromDate(loan.startDate)
        });
      }
    }
  });
  
  // 处理民间贷
  loanData.privateLoans.forEach((loan) => {
    let monthlyPayment = 0;
    
    if (loan.monthlyPayment) {
      monthlyPayment = parseFloat(loan.monthlyPayment);
    } else if (loan.loanAmount && loan.remainingMonths) {
      // 简单计算：贷款金额 / 剩余月数
      monthlyPayment = parseFloat(loan.loanAmount) * 10000 / parseFloat(loan.remainingMonths);
    }
    
    if (monthlyPayment > 0) {
      repaymentItems.push({
        type: '民间贷',
        subType: '民间借贷',
        name: loan.name || '民间贷',
        amount: monthlyPayment,
        dueDay: getDueDayFromDate(loan.startDate)
      });
    }
  });
  
  // 处理信用卡
  loanData.creditCards.forEach((card) => {
    if (card.monthlyPayment && parseFloat(card.monthlyPayment) > 0) {
      repaymentItems.push({
        type: '信用卡',
        subType: '信用卡还款',
        name: card.bankName || '信用卡',
        amount: parseFloat(card.monthlyPayment),
        dueDay: 10 // 信用卡默认10号还款
      });
    }
  });
  
  console.log('Processed repayment items:', repaymentItems);
  return repaymentItems;
};

const RepaymentCalendar: React.FC<RepaymentCalendarProps> = ({ debts }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 计算当月每日的还款信息 - 使用个人贷款数据
  const monthlyRepayments = useMemo(() => {
    const repaymentMap = new Map<string, RepaymentItem[]>();
    
    // 获取所有个人贷款的还款计划
    const repaymentItems = processIndividualLoans();
    
    if (repaymentItems.length === 0) {
      console.log('No individual loan data found, using aggregated debt data as fallback');
      // 回退到原有逻辑：使用聚合的债务数据
      const validDebts = debts.filter(debt => 
        (debt.amount || 0) > 0 && 
        (debt.remainingMonths || 0) > 0 &&
        (debt.monthlyPayment || 0) > 0
      );

      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      
      validDebts.forEach(debt => {
        const dueDay = getDueDayFromDate(debt.carStartDate?.toString(), 10);
        
        const dueDate = new Date(year, month, dueDay);
        if (dueDate.getMonth() === month) {
          const dateKey = format(dueDate, 'yyyy-MM-dd');
          
          if (!repaymentMap.has(dateKey)) {
            repaymentMap.set(dateKey, []);
          }
          
          repaymentMap.get(dateKey)!.push({
            type: debtTypeNames[debt.type] || debt.type,
            name: debt.name || debtTypeNames[debt.type],
            amount: debt.monthlyPayment || 0,
            dueDay
          });
        }
      });
    } else {
      // 使用个人贷款数据
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      
      repaymentItems.forEach(item => {
        // 为当前显示的月份创建还款日期
        const dueDate = new Date(year, month, item.dueDay);
        
        // 确保日期在当前月份内
        if (dueDate.getMonth() === month) {
          const dateKey = format(dueDate, 'yyyy-MM-dd');
          
          if (!repaymentMap.has(dateKey)) {
            repaymentMap.set(dateKey, []);
          }
          
          repaymentMap.get(dateKey)!.push(item);
        }
      });
    }

    console.log('Monthly repayments for', format(currentMonth, 'yyyy-MM', { locale: zhCN }), repaymentMap);
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
      <CardHeader className="pt-6 pb-3">
        <CardTitle className="flex items-center text-lg">
          <CalendarDays className="w-5 h-5 text-[#01BCD6] mr-2" />
          还款日历
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateClick}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          locale={zhCN}
          className="w-full pointer-events-auto"
          classNames={{
            months: "w-full flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "w-full space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse",
            head_row: "grid grid-cols-7 w-full",
            head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] flex items-center justify-center",
            row: "grid grid-cols-7 w-full",
            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 w-full",
            day: "h-auto w-full p-0 font-normal aria-selected:opacity-100",
            day_range_end: "day-range-end",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
          components={{
            Day: ({ date, ...props }) => (
              <button 
                {...props}
                className={`
                  w-full aspect-square p-1 font-normal aria-selected:opacity-100 relative border-0 bg-transparent
                  ${getDateRepayments(date).length > 0 
                    ? 'cursor-pointer hover:bg-[#B3EBEF]/20' 
                    : ''
                  }
                `}
              >
                {dayContent(date)}
              </button>
            )
          }}
        />

        {/* 底部抽屉 - 显示选中日期的还款详情 */}
        <Sheet open={!!selectedDate && selectedRepayments.length > 0} onOpenChange={(open) => !open && setSelectedDate(undefined)}>
          <SheetContent side="bottom" className="h-auto max-h-[50vh]">
            <SheetHeader>
              <SheetTitle className="flex items-center">
                <DollarSign className="w-5 h-5 text-[#01BCD6] mr-2" />
                {selectedDate && format(selectedDate, 'yyyy年MM月dd日', { locale: zhCN })} 还款明细
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
                        {repayment.type}
                      </div>
                      {repayment.name && (
                        <div className="text-sm text-gray-500">{repayment.name}</div>
                      )}
                      {repayment.subType && (
                        <div className="text-xs text-gray-400">{repayment.subType}</div>
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