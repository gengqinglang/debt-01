import { useState, useCallback, useEffect } from 'react';
import { calculateEqualPaymentMonthly, calculateEqualPrincipalFirstMonthly, calculateLoanTermMonths } from '@/lib/loanCalculations';

// Helper function to get today's date in yyyy-MM-dd format
const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export interface PrivateLoanInfo {
  id: string;
  name?: string; // 民间借贷名称（非必输）
  loanAmount: string; // 剩余贷款本金（万元）
  startDate: string; // 贷款开始日期（到日）
  endDate?: string; // 贷款结束日期（到日）- 新增，用于等额本息/等额本金
  annualRate: string; // 年化利率（%）
  rateFen: string; // 分（如：1）
  rateLi: string; // 厘（如：3）
  repaymentMethod: string; // 还款方式
}

export const usePrivateLoanData = (initialData?: PrivateLoanInfo[]) => {
  const [privateLoans, setPrivateLoans] = useState<PrivateLoanInfo[]>(
    initialData && initialData.length > 0 ? initialData : []
  );

  // Sync with initialData when it changes
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setPrivateLoans(initialData);
    }
  }, [JSON.stringify(initialData)]);

// Removed default date autofill to prevent unintended diffs on mount

  const addPrivateLoan = useCallback(() => {
    const todayDate = getTodayDate();
    const newPrivateLoan: PrivateLoanInfo = {
      id: crypto.randomUUID(),
      name: '',
      loanAmount: '',
      startDate: todayDate,
      endDate: '',
      annualRate: '',
      rateFen: '',
      rateLi: '',
      repaymentMethod: 'interest-first'
    };
    setPrivateLoans(prev => [...prev, newPrivateLoan]);
  }, []);

  const removePrivateLoan = useCallback((id: string) => {
    setPrivateLoans(prev => prev.length > 1 ? prev.filter(loan => loan.id !== id) : prev);
  }, []);

  const resetPrivateLoan = useCallback((id: string) => {
    const todayDate = getTodayDate();
    setPrivateLoans(prev => prev.map(loan => 
      loan.id === id ? {
        id: loan.id,
        name: '',
        loanAmount: '',
        startDate: todayDate,
        endDate: '',
        annualRate: '',
        rateFen: '',
        rateLi: '',
        repaymentMethod: 'interest-first',
      } : loan
    ));
  }, []);

  const updatePrivateLoan = useCallback((id: string, field: keyof PrivateLoanInfo, value: string) => {
    setPrivateLoans(prev => prev.map(loan => 
      loan.id === id ? { ...loan, [field]: value } : loan
    ));
  }, []);

  // 分厘计算年化利率
  const calculateAnnualRate = useCallback((fen: string, li: string): string => {
    const fenValue = fen ? parseFloat(fen) : 0;
    const liValue = li ? parseFloat(li) : 0;
    // 1分 = 1%, 1厘 = 0.1% (consistent with industry standard)
    const totalRate = fenValue + liValue / 10;
    return totalRate.toString();
  }, []);

  // 更新分值并重新计算年化利率
  const updateRateFen = useCallback((id: string, value: string) => {
    setPrivateLoans(prev => prev.map(loan => {
      if (loan.id === id) {
        const newAnnualRate = calculateAnnualRate(value, loan.rateLi);
        return { 
          ...loan, 
          rateFen: value,
          annualRate: newAnnualRate
        };
      }
      return loan;
    }));
  }, [calculateAnnualRate]);

  // 更新厘值并重新计算年化利率
  const updateRateLi = useCallback((id: string, value: string) => {
    setPrivateLoans(prev => prev.map(loan => {
      if (loan.id === id) {
        const newAnnualRate = calculateAnnualRate(loan.rateFen, value);
        return { 
          ...loan, 
          rateLi: value,
          annualRate: newAnnualRate
        };
      }
      return loan;
    }));
  }, [calculateAnnualRate]);

  // 检查民间借贷信息是否完整
  const isPrivateLoanComplete = useCallback((privateLoan: PrivateLoanInfo): boolean => {
    // 检查分、厘至少有一个输入且大于0
    const hasFenRate = privateLoan.rateFen && parseFloat(privateLoan.rateFen) > 0;
    const hasLiRate = privateLoan.rateLi && parseFloat(privateLoan.rateLi) > 0;
    
    // 基本字段检查
    const basicComplete = Boolean(
      privateLoan.loanAmount && 
      parseFloat(privateLoan.loanAmount) > 0 &&
      (hasFenRate || hasLiRate) && // 分、厘任选其一即可
      privateLoan.repaymentMethod &&
      privateLoan.endDate // 所有民间借贷都需要结束日期
    );
    
    return basicComplete;
  }, []);

  // 计算汇总数据
  const getAggregatedData = useCallback(() => {
    const completeLoans = privateLoans.filter(isPrivateLoanComplete);
    
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

    // 计算总月供
    let totalMonthlyPayment = 0;
    completeLoans.forEach(loan => {
      const principal = parseFloat(loan.loanAmount) * 10000; // 万元转元
      const annualRate = parseFloat(loan.annualRate) / 100;
      
      // 根据还款方式计算月供
      switch (loan.repaymentMethod) {
        case 'interest-first': // 先息后本
          totalMonthlyPayment += principal * (annualRate / 12); // 只计算利息
          break;
        case 'lump-sum': // 一次性还本付息
          totalMonthlyPayment += 0; // 到期一次性还款，月供为0
          break;
        case 'equal-payment': // 等额本息
          if (loan.endDate) {
            const startDate = loan.startDate || getTodayDate();
            const termMonths = calculateLoanTermMonths(startDate, loan.endDate);
            if (termMonths > 0) {
              const monthlyPayment = calculateEqualPaymentMonthly(principal, annualRate, termMonths);
              totalMonthlyPayment += monthlyPayment;
            }
          }
          break;
        case 'equal-principal': // 等额本金
          if (loan.endDate) {
            const startDate = loan.startDate || getTodayDate();
            const termMonths = calculateLoanTermMonths(startDate, loan.endDate);
            if (termMonths > 0) {
              const firstMonthlyPayment = calculateEqualPrincipalFirstMonthly(principal, annualRate, termMonths);
              totalMonthlyPayment += firstMonthlyPayment;
            }
          }
          break;
        default:
          totalMonthlyPayment += principal * (annualRate / 12); // 默认先息后本
      }
    });

    // 民间借贷通常期限较短，这里设定为12个月作为最大剩余期限
    const maxRemainingMonths = 12;

    return {
      count: completeLoans.length,
      totalLoanAmount,
      totalMonthlyPayment: Math.round(totalMonthlyPayment),
      maxRemainingMonths
    };
  }, [privateLoans, isPrivateLoanComplete]);

  return {
    privateLoans,
    addPrivateLoan,
    removePrivateLoan,
    resetPrivateLoan,
    updatePrivateLoan,
    updateRateFen,
    updateRateLi,
    isPrivateLoanComplete,
    getAggregatedData,
    calculateAnnualRate
  };
};