import { useState, useCallback, useEffect } from 'react';

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
  name?: string; // 出借人名称（非必输）
  loanAmount: string; // 剩余贷款本金（万元）
  startDate: string; // 贷款开始时间（到日）
  endDate?: string; // 贷款结束日期（到日，等额本息/等额本金时必需）
  annualRate: string; // 年化利率（%）
  rateFen: string; // 分利率
  rateLi: string; // 厘利率
  repaymentMethod: string; // 还款方式
}

export const usePrivateLoanData = (initialData?: PrivateLoanInfo[]) => {
  const [privateLoans, setPrivateLoans] = useState<PrivateLoanInfo[]>(
    initialData && initialData.length > 0 
      ? initialData 
      : [{ 
          id: crypto.randomUUID(), 
          name: '',
          loanAmount: '', 
          startDate: getTodayDate(),
          endDate: getTodayDate(),
          annualRate: '',
          rateFen: '',
          rateLi: '',
          repaymentMethod: 'interest-first'
        }]
  );

  // Set default dates to today for existing loans with empty date fields
  useEffect(() => {
    const todayDate = getTodayDate();
    setPrivateLoans(prev => prev.map(loan => ({
      ...loan,
      startDate: loan.startDate || todayDate,
      endDate: loan.endDate || todayDate
    })));
  }, []);

  const addPrivateLoan = useCallback(() => {
    const todayDate = getTodayDate();
    const newPrivateLoan: PrivateLoanInfo = {
      id: crypto.randomUUID(),
      name: '',
      loanAmount: '',
      startDate: todayDate,
      endDate: todayDate,
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

  const updatePrivateLoan = useCallback((id: string, field: keyof PrivateLoanInfo, value: string) => {
    setPrivateLoans(prev => prev.map(loan => 
      loan.id === id ? { ...loan, [field]: value } : loan
    ));
  }, []);

  // 分厘计算年化利率
  const calculateAnnualRate = useCallback((fen: string, li: string): string => {
    const fenValue = fen ? parseFloat(fen) : 0;
    const liValue = li ? parseFloat(li) : 0;
    const totalRate = fenValue * 10 + liValue; // 1分 = 10%, 1厘 = 1%
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

  // 检查民间贷信息是否完整
  const isPrivateLoanComplete = useCallback((privateLoan: PrivateLoanInfo): boolean => {
    // 基础必填字段
    const hasBasicFields = Boolean(
      privateLoan.loanAmount && 
      parseFloat(privateLoan.loanAmount) > 0 &&
      privateLoan.startDate &&
      privateLoan.repaymentMethod
    );

    // 利率字段检查
    const hasValidRate = Boolean(
      (privateLoan.annualRate && parseFloat(privateLoan.annualRate) > 0) ||
      (privateLoan.rateFen && parseFloat(privateLoan.rateFen) > 0) ||
      (privateLoan.rateLi && parseFloat(privateLoan.rateLi) > 0)
    );

    // 等额本息/等额本金需要额外的结束日期
    if (privateLoan.repaymentMethod === 'equal-payment' || privateLoan.repaymentMethod === 'equal-principal') {
      return hasBasicFields && hasValidRate && Boolean(privateLoan.endDate);
    }

    return hasBasicFields && hasValidRate;
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
        case 'equal-payment': // 等额本息
          if (loan.endDate && loan.startDate) {
            const startDate = new Date(loan.startDate);
            const endDate = new Date(loan.endDate);
            const termMonths = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
            if (annualRate > 0 && termMonths > 0) {
              const monthlyRate = annualRate / 12;
              const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths) / 
                                    (Math.pow(1 + monthlyRate, termMonths) - 1);
              totalMonthlyPayment += monthlyPayment;
            } else {
              totalMonthlyPayment += principal / termMonths;
            }
          }
          break;
        case 'equal-principal': // 等额本金
          if (loan.endDate && loan.startDate) {
            const startDate = new Date(loan.startDate);
            const endDate = new Date(loan.endDate);
            const termMonths = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
            if (termMonths > 0) {
              const monthlyPrincipal = principal / termMonths;
              const firstMonthInterest = principal * (annualRate / 12);
              totalMonthlyPayment += monthlyPrincipal + firstMonthInterest; // 使用首期月供
            }
          }
          break;
        case 'interest-first': // 先息后本
          totalMonthlyPayment += principal * (annualRate / 12); // 只计算利息
          break;
        case 'lump-sum': // 一次性还本付息
          totalMonthlyPayment += 0; // 到期一次性还款，月供为0
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
    updatePrivateLoan,
    updateRateFen,
    updateRateLi,
    isPrivateLoanComplete,
    getAggregatedData,
    calculateAnnualRate
  };
};