import { useState, useCallback, useEffect } from 'react';

// Helper function to get today's date in yyyy-MM-dd format
const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export interface CarLoanInfo {
  id: string;
  vehicleName: string;
  loanType: 'installment' | 'bankLoan'; // 贷款类型：分期或银行贷款
  // 分期字段
  installmentAmount: string; // 每期还款额（元）
  remainingInstallments: string; // 剩余期数（月）
  // 银行贷款字段
  principal?: string; // 原始贷款本金（万元）
  term?: string; // 原始贷款期限（年）
  interestRate?: string; // 利率（%）
  startDate?: Date; // 贷款开始时间
  endDate?: Date; // 贷款结束时间
  repaymentMethod?: 'equal-payment' | 'equal-principal'; // 还款方式
  // 扩展字段（为匹配房贷-公积金录入样式）
  remainingPrincipal?: string; // 贷款剩余本金（元）
  startDateMonth?: string; // YYYY-MM
  endDateMonth?: string; // YYYY-MM
}

export const useCarLoanData = (initialData?: CarLoanInfo[]) => {
  const [carLoans, setCarLoans] = useState<CarLoanInfo[]>(
    initialData && initialData.length > 0 
      ? initialData 
      : [{ 
          id: crypto.randomUUID(), 
          vehicleName: '', 
          loanType: 'installment',
          installmentAmount: '', 
          remainingInstallments: '' 
         }]
  );

  // Set default dates to today for existing loans with empty date fields
  useEffect(() => {
    const todayDate = getTodayDate();
    setCarLoans(prev => prev.map(loan => ({
      ...loan,
      startDateMonth: loan.startDateMonth || todayDate,
      endDateMonth: loan.endDateMonth || todayDate
    })));
  }, []);

  const addCarLoan = useCallback(() => {
    const todayDate = getTodayDate();
    const newCarLoan: CarLoanInfo = {
      id: crypto.randomUUID(),
      vehicleName: '',
      loanType: 'installment',
      installmentAmount: '',
      remainingInstallments: '',
      startDateMonth: todayDate,
      endDateMonth: todayDate
    };
    setCarLoans(prev => [...prev, newCarLoan]);
  }, []);

  const removeCarLoan = useCallback((id: string) => {
    setCarLoans(prev => prev.length > 1 ? prev.filter(loan => loan.id !== id) : prev);
  }, []);

  const updateCarLoan = useCallback((id: string, field: keyof CarLoanInfo, value: string) => {
    setCarLoans(prev => prev.map(loan => 
      loan.id === id ? { ...loan, [field]: value } : loan
    ));
  }, []);

  // 检查车贷信息是否完整
  const isCarLoanComplete = useCallback((carLoan: CarLoanInfo): boolean => {
    if (!carLoan.vehicleName) return false;
    
    if (carLoan.loanType === 'installment') {
      return Boolean(
        carLoan.installmentAmount && 
        parseFloat(carLoan.installmentAmount) > 0 &&
        carLoan.remainingInstallments && 
        parseFloat(carLoan.remainingInstallments) > 0
      );
    } else {
      // 银行贷款验证：需要车辆名称、还款方式、贷款利率、开始/结束日期
      // 金额验证：优先检查剩余本金，如果没有则检查原始金额
      const hasValidAmount = Boolean(
        (carLoan.remainingPrincipal && parseFloat(carLoan.remainingPrincipal) > 0) ||
        (carLoan.principal && parseFloat(carLoan.principal) > 0)
      );
      
      return Boolean(
        hasValidAmount &&
        carLoan.interestRate && parseFloat(carLoan.interestRate) > 0 &&
        carLoan.startDateMonth && carLoan.endDateMonth &&
        carLoan.repaymentMethod
      );
    }
  }, []);

  // 计算汇总数据
  const getAggregatedData = useCallback(() => {
    const completeLoans = carLoans.filter(isCarLoanComplete);
    
    if (completeLoans.length === 0) {
      return {
        count: 0,
        totalMonthlyPayment: 0,
        maxRemainingMonths: 0
      };
    }

    const totalMonthlyPayment = completeLoans.reduce((sum, loan) => {
      if (loan.loanType === 'installment') {
        return sum + parseFloat(loan.installmentAmount);
      } else {
        // 银行贷款计算月供 - 优先使用剩余本金，如果没有则使用原始金额
        const principalAmount = parseFloat(loan.remainingPrincipal || loan.principal || '0') * 10000; // 万元转元
        const annualRate = parseFloat(loan.interestRate || '0') / 100;
        const monthlyRate = annualRate / 12;
        const monthsFromTerm = parseFloat(loan.term || '0') * 12;
        let months = monthsFromTerm;
        if (!months && loan.startDate && loan.endDate) {
          const totalMonths = Math.max(0, Math.round((loan.endDate.getTime() - loan.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)));
          months = totalMonths;
        }
        if (monthlyRate > 0 && months > 0) {
          const monthlyPayment = principalAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
          return sum + monthlyPayment;
        }
        return sum;
      }
    }, 0);

    const maxRemainingMonths = Math.max(
      ...completeLoans.map(loan => {
        if (loan.loanType === 'installment') {
          return parseFloat(loan.remainingInstallments);
        } else {
          // 银行贷款计算剩余月数
          const currentDate = new Date();
          if (loan.endDate) {
            const remainingMonths = Math.max(0, Math.round((loan.endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)));
            return remainingMonths;
          }
          const totalMonths = parseFloat(loan.term || '0') * 12;
          const startDate = loan.startDate || new Date();
          const elapsedMonths = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
          return Math.max(0, totalMonths - elapsedMonths);
        }
      })
    );

    return {
      count: completeLoans.length,
      totalMonthlyPayment,
      maxRemainingMonths
    };
  }, [carLoans, isCarLoanComplete]);

  return {
    carLoans,
    addCarLoan,
    removeCarLoan,
    updateCarLoan,
    isCarLoanComplete,
    getAggregatedData
  };
};