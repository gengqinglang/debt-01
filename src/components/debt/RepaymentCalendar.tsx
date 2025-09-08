import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
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
    const sharedMortgage = JSON.parse(localStorage.getItem('shared_loan_data') || '[]') as any[];
    // 其他类型当前未持久化，返回空
    return {
      mortgageLoans: Array.isArray(sharedMortgage) ? sharedMortgage : [],
      carLoans: [],
      consumerLoans: [],
      businessLoans: [],
      privateLoans: [],
      creditCards: []
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

// 处理个人贷款数据，生成还款计划（基于已持久化的详细数据）
const processIndividualLoans = (debts: DebtInfo[]): RepaymentItem[] => {
  const { mortgageLoans } = loadIndividualLoanData();
  const repaymentItems: RepaymentItem[] = [];

  console.log('Processing loans with data:', { mortgageLoans, debts });

  // 仅房贷有明确的本地持久化明细（shared_loan_data）
  if (Array.isArray(mortgageLoans) && mortgageLoans.length > 0) {
    type SubLoan = { label: string; dueDay: number; principal: number };
    const subLoans: SubLoan[] = [];

    mortgageLoans.forEach((loan: any, idx: number) => {
      console.log(`Processing loan ${idx}:`, loan);
      const safeName = loan.propertyName || `房贷${idx + 1}`;
      
      const pushSingle = (label: string, startDate?: string, principalWan?: string, rate?: string) => {
        const pWan = parseFloat(principalWan || loan.remainingPrincipal || loan.loanAmount || '0');
        const principal = isNaN(pWan) ? 0 : pWan * 10000; // 万元转元
        
        // 改进日期提取逻辑
        let dueDay = 10; // 默认值
        if (startDate) {
          try {
            const date = new Date(startDate);
            if (!isNaN(date.getTime())) {
              dueDay = date.getDate();
            }
          } catch (e) {
            console.warn('Invalid date:', startDate);
          }
        }
        
        console.log(`Sub-loan: ${safeName}-${label}, dueDay: ${dueDay}, principal: ${principal}`);
        subLoans.push({ label: `${safeName}-${label}`, dueDay, principal });
      };

      if (loan.loanType === 'combination') {
        // 组合贷款拆分两笔
        pushSingle('商贷', loan.commercialStartDate, loan.commercialRemainingPrincipal || loan.commercialLoanAmount);
        pushSingle('公积金', loan.providentStartDate, loan.providentRemainingPrincipal || loan.providentLoanAmount);
      } else if (loan.loanType === 'commercial') {
        pushSingle('商贷', loan.loanStartDate, loan.remainingPrincipal || loan.loanAmount);
      } else if (loan.loanType === 'provident') {
        pushSingle('公积金', loan.loanStartDate, loan.remainingPrincipal || loan.loanAmount);
      } else {
        pushSingle('房贷', loan.loanStartDate, loan.remainingPrincipal || loan.loanAmount);
      }
    });

    console.log('Sub-loans extracted:', subLoans);

    // 按剩余本金占比分摊月份总额（来自聚合数据）
    const mortgageAgg = debts.find(d => d.type === 'mortgage');
    const monthlyPool = Math.max(0, Number(mortgageAgg?.monthlyPayment || 0));
    const totalPrincipal = subLoans.reduce((s, l) => s + (l.principal || 0), 0);

    console.log('Mortgage aggregated data:', { monthlyPool, totalPrincipal });

    subLoans.forEach(sl => {
      if (sl.principal <= 0) return;
      const amount = totalPrincipal > 0 ? (monthlyPool * (sl.principal / totalPrincipal)) : 0;
      if (amount > 0) {
        repaymentItems.push({
          type: '房贷',
          subType: undefined,
          name: sl.label,
          amount,
          dueDay: sl.dueDay || 10,
        });
      }
    });
  }

  // 处理其他类型债务（从聚合数据中获取，使用默认还款日）
  debts.forEach(debt => {
    if (debt.type === 'mortgage') return; // 已处理
    
    const monthlyPayment = debt.monthlyPayment || 0;
    if (monthlyPayment <= 0) return;
    
    let dueDay = 10; // 默认还款日
    
    // 根据债务类型设置不同的还款日
    if (debt.type === 'carLoan' && debt.carStartDate) {
      try {
        const carDate = new Date(debt.carStartDate);
        if (!isNaN(carDate.getTime())) {
          dueDay = carDate.getDate();
        }
      } catch (e) {
        console.warn('Invalid car loan date:', debt.carStartDate);
      }
    }
    
    // 为不同债务类型设置不同的默认还款日（分散显示）
    if (debt.type === 'consumerLoan') dueDay = 15;
    else if (debt.type === 'businessLoan') dueDay = 20;
    else if (debt.type === 'privateLoan') dueDay = 25;
    else if (debt.type === 'creditCard') dueDay = 5;
    
    repaymentItems.push({
      type: debtTypeNames[debt.type] || debt.type,
      subType: undefined,
      name: debt.name || debtTypeNames[debt.type],
      amount: monthlyPayment,
      dueDay,
    });
  });

  console.log('Final processed repayment items:', repaymentItems);
  return repaymentItems;
};

const RepaymentCalendar: React.FC<RepaymentCalendarProps> = ({ debts }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Debug flag to show container outlines
  const debug = true;

  // 计算当月每日的还款信息 - 使用个人贷款数据
  const monthlyRepayments = useMemo(() => {
    const repaymentMap = new Map<string, RepaymentItem[]>();
    
    // 获取所有个人贷款的还款计划
    const repaymentItems = processIndividualLoans(debts);
    
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
    
    return (
      <div className="flex flex-col items-center justify-center">
        <span className="text-sm">{day.getDate()}</span>
        {repayments.length > 0 && (
          <div className="h-1.5 w-1.5 bg-[#01BCD6] rounded-full mt-0.5"></div>
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
        <div className={`p-0 flex justify-center ${debug ? 'border-2 border-red-500' : ''}`}>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateClick}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            locale={zhCN}
            className={`w-full pointer-events-auto ${debug ? 'border-2 border-blue-500' : ''}`}
            classNames={{
              months: "w-full flex justify-center",
              month: "scale-[1.06] md:scale-[1.12] origin-top"
            }}
            components={{
              DayContent: ({ date }) => dayContent(date)
            }}
          />
        </div>

        {/* 选中日期还款详情 */}
        <div className={`px-2 sm:px-4 md:px-6 pb-6 pt-2 ${debug ? 'border-2 border-green-500' : ''}`}>
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
      </CardContent>
    </Card>
  );
};

export default RepaymentCalendar;