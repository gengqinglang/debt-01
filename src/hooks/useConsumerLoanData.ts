import { useState, useCallback, useEffect } from 'react';

// Helper function to get today's date in yyyy-MM-dd format
const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export interface ConsumerLoanInfo {
  id: string;
  name?: string; // 消费贷名称（非必输）
  loanAmount: string; // 贷款金额（万元）
  remainingPrincipal?: string; // 贷款剩余本金（万元）
  startDate: string; // 贷款开始时间（到日）
  endDate?: string; // 贷款结束日期（到日）
  loanTerm: string; // 贷款期限（年）
  annualRate: string; // 年化利率（%）
  repaymentMethod: string; // 还款方式
}

export const useConsumerLoanData = (initialData?: ConsumerLoanInfo[]) => {
  const [consumerLoans, setConsumerLoans] = useState<ConsumerLoanInfo[]>(
    initialData && initialData.length > 0 
      ? initialData 
      : [{ 
          id: crypto.randomUUID(), 
          name: '',
          loanAmount: '', 
          remainingPrincipal: '',
          startDate: getTodayDate(),
          endDate: getTodayDate(),
          loanTerm: '',
          annualRate: '',
          repaymentMethod: 'interest-first'
        }]
  );

  // Set default dates to today for existing loans with empty date fields
  useEffect(() => {
    const todayDate = getTodayDate();
    setConsumerLoans(prev => prev.map(loan => ({
      ...loan,
      startDate: loan.startDate || todayDate,
      endDate: loan.endDate || todayDate
    })));
  }, []);

  const addConsumerLoan = useCallback(() => {
    const todayDate = getTodayDate();
    const newConsumerLoan: ConsumerLoanInfo = {
      id: crypto.randomUUID(),
      name: '',
      loanAmount: '',
      remainingPrincipal: '',
      startDate: todayDate,
      endDate: todayDate,
      loanTerm: '',
      annualRate: '',
      repaymentMethod: 'interest-first'
    };
    setConsumerLoans(prev => [...prev, newConsumerLoan]);
  }, []);

  const removeConsumerLoan = useCallback((id: string) => {
    setConsumerLoans(prev => prev.length > 1 ? prev.filter(loan => loan.id !== id) : prev);
  }, []);

  const resetConsumerLoan = useCallback((id: string) => {
    const todayDate = getTodayDate();
    setConsumerLoans(prev => prev.map(loan => 
      loan.id === id ? {
        id: loan.id,
        name: '',
        loanAmount: '',
        startDate: todayDate,
        endDate: '',
        loanTerm: '',
        annualRate: '',
        repaymentMethod: 'interest-first',
        remainingPrincipal: '',
      } : loan
    ));
  }, []);

  const updateConsumerLoan = useCallback((id: string, field: keyof ConsumerLoanInfo, value: string) => {
    setConsumerLoans(prev => prev.map(loan => 
      loan.id === id ? { ...loan, [field]: value } : loan
    ));
  }, []);

  // 检查消费贷信息是否完整
  const isConsumerLoanComplete = useCallback((consumerLoan: ConsumerLoanInfo): boolean => {
    // 基础验证：还款方式必须选择
    if (!consumerLoan.repaymentMethod) return false;
    
    if (consumerLoan.repaymentMethod === 'interest-first') {
      // 先息后本：需要剩余贷款本金、贷款结束日期、年化利率
      return Boolean(
        consumerLoan.loanAmount && 
        parseFloat(consumerLoan.loanAmount) > 0 &&
        consumerLoan.endDate &&
        consumerLoan.annualRate && 
        parseFloat(consumerLoan.annualRate) > 0
      );
    } else if (consumerLoan.repaymentMethod === 'lump-sum') {
      // 一次性还本付息：需要贷款开始日期、贷款结束日期、剩余贷款本金、年化利率
      return Boolean(
        consumerLoan.loanAmount && 
        parseFloat(consumerLoan.loanAmount) > 0 &&
        consumerLoan.startDate &&
        consumerLoan.endDate &&
        consumerLoan.annualRate && 
        parseFloat(consumerLoan.annualRate) > 0
      );
    } else {
      // 等额本息/等额本金：需要贷款剩余本金、贷款开始日期、贷款结束日期、贷款利率
      return Boolean(
        consumerLoan.remainingPrincipal && 
        parseFloat(consumerLoan.remainingPrincipal) > 0 &&
        consumerLoan.startDate &&
        consumerLoan.endDate &&
        consumerLoan.annualRate && 
        parseFloat(consumerLoan.annualRate) > 0
      );
    }
  }, []);

  // 计算汇总数据
  const getAggregatedData = useCallback(() => {
    const completeLoans = consumerLoans.filter(isConsumerLoanComplete);
    
    if (completeLoans.length === 0) {
      return {
        count: 0,
        totalLoanAmount: 0,
        totalMonthlyPayment: 0,
        maxRemainingMonths: 0
      };
    }

    const totalLoanAmount = completeLoans.reduce((sum, loan) => {
      return sum + parseFloat(loan.loanAmount);
    }, 0);

    // 计算总月供（简化计算，实际应根据还款方式计算）
    let totalMonthlyPayment = 0;
    completeLoans.forEach(loan => {
      const principal = parseFloat(loan.loanAmount) * 10000; // 万元转元
      const annualRate = parseFloat(loan.annualRate) / 100;
      const termYears = parseFloat(loan.loanTerm);
      const termMonths = termYears * 12;
      
      // 根据还款方式计算月供
      switch (loan.repaymentMethod) {
        case 'equal-payment': // 等额本息
          if (annualRate > 0) {
            const monthlyRate = annualRate / 12;
            const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths) / 
                                  (Math.pow(1 + monthlyRate, termMonths) - 1);
            totalMonthlyPayment += monthlyPayment;
          } else {
            totalMonthlyPayment += principal / termMonths;
          }
          break;
        case 'equal-principal': // 等额本金
          const monthlyPrincipal = principal / termMonths;
          const firstMonthInterest = principal * (annualRate / 12);
          totalMonthlyPayment += monthlyPrincipal + firstMonthInterest; // 使用首期月供
          break;
        case 'interest-first': // 先息后本
          totalMonthlyPayment += principal * (annualRate / 12); // 只计算利息
          break;
        case 'lump-sum': // 一次性还本付息
          totalMonthlyPayment += 0; // 到期一次性还款，月供为0
          break;
        default:
          totalMonthlyPayment += principal / termMonths; // 默认按等额本金计算
      }
    });

    const maxRemainingMonths = Math.max(
      ...completeLoans.map(loan => parseFloat(loan.loanTerm) * 12)
    );

    return {
      count: completeLoans.length,
      totalLoanAmount,
      totalMonthlyPayment: Math.round(totalMonthlyPayment),
      maxRemainingMonths
    };
  }, [consumerLoans, isConsumerLoanComplete]);

  return {
    consumerLoans,
    addConsumerLoan,
    removeConsumerLoan,
    resetConsumerLoan,
    updateConsumerLoan,
    isConsumerLoanComplete,
    getAggregatedData
  };
};