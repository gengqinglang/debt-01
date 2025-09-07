import { useState, useEffect, useRef } from 'react';

export interface LoanInfo {
  id: string;
  propertyName: string;
  loanType: string;
  loanStartDate: string;
  loanEndDate: string;
  rateType: string;
  fixedRate: string;
  floatingRateAdjustment: string;
  paymentMethod: string;
  loanAmount: string;
  remainingPrincipal: string; // 剩余贷款本金
  // 组合贷款专用字段
  commercialLoanAmount?: string;
  commercialStartDate?: string;
  commercialEndDate?: string;
  commercialPaymentMethod?: string;
  commercialRateType?: string;
  commercialFixedRate?: string;
  commercialFloatingRateAdjustment?: string;
  commercialRemainingPrincipal?: string; // 商业贷款剩余本金
  providentLoanAmount?: string;
  providentStartDate?: string;
  providentEndDate?: string;
  providentPaymentMethod?: string;
  providentRate?: string;
  providentRemainingPrincipal?: string; // 公积金贷款剩余本金
}

const STORAGE_KEY = 'shared_loan_data';

// 获取今天的日期
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // 格式: yyyy-MM-dd
};

// 规范化贷款对象，确保必填项有默认值（首次录入或旧数据缺失时）
const normalizeLoan = (loan: LoanInfo): LoanInfo => {
  const today = getTodayDate();
  return {
    ...loan,
    loanType: loan.loanType || 'commercial',
    loanStartDate: loan.loanStartDate || today,
    loanEndDate: loan.loanEndDate || today,
    rateType: loan.rateType || 'floating',
    paymentMethod: loan.paymentMethod || 'equal-payment',
    remainingPrincipal: loan.remainingPrincipal || '',
    // 组合贷款商业贷款默认值
    commercialStartDate: loan.commercialStartDate || today,
    commercialEndDate: loan.commercialEndDate || today,
    commercialPaymentMethod: loan.commercialPaymentMethod || 'equal-payment',
    commercialRateType: loan.commercialRateType || 'floating',
    // 组合贷款公积金贷款默认值
    providentStartDate: loan.providentStartDate || today,
    providentEndDate: loan.providentEndDate || today,
    providentPaymentMethod: loan.providentPaymentMethod || 'equal-payment',
  };
};

interface UseLoanDataOptions {
  persist?: boolean;
}

export const useLoanData = (options: UseLoanDataOptions = { persist: true }) => {
  const { persist = true } = options;
  
  const [loans, setLoans] = useState<LoanInfo[]>(() => {
    const today = getTodayDate();
    
    if (!persist) {
      // 不持久化时返回空白贷款
      return [{
        id: Date.now().toString(),
        propertyName: '',
        loanType: 'commercial', // 默认商业贷款
        loanStartDate: today, // 默认今天
        loanEndDate: today, // 默认今天
        rateType: 'floating', // 默认浮动利率
        fixedRate: '',
        floatingRateAdjustment: '',
        paymentMethod: 'equal-payment', // 默认等额本息
        loanAmount: '',
        remainingPrincipal: '',
      }];
    }
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.map(normalizeLoan) : [normalizeLoan(parsed)];
      }
    } catch (error) {
      console.error('Failed to load loan data from localStorage:', error);
    }
    return [{
      id: Date.now().toString(),
      propertyName: '',
      loanType: 'commercial', // 默认商业贷款
      loanStartDate: today, // 默认今天
      loanEndDate: today, // 默认今天
      rateType: 'floating', // 默认浮动利率
      fixedRate: '',
      floatingRateAdjustment: '',
      paymentMethod: 'equal-payment', // 默认等额本息
      loanAmount: '',
      remainingPrincipal: '',
    }];
  });

  // 跨组件同步控制
  const syncingRef = useRef(false);

  // 保存到localStorage并广播更新事件
  useEffect(() => {
    if (!persist) return; // 不持久化时跳过localStorage操作
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loans));
      if (!syncingRef.current) {
        window.dispatchEvent(new Event('shared_loan_data_updated'));
      } else {
        // 本次变更来自同步，不再继续广播，防止循环
        syncingRef.current = false;
      }
    } catch (error) {
      console.error('Failed to save loan data to localStorage:', error);
    }
  }, [loans, persist]);

  // 监听来自其他组件实例的更新事件
  useEffect(() => {
    if (!persist) return; // 不持久化时跳过监听
    
    const handler = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          syncingRef.current = true;
          setLoans(Array.isArray(parsed) ? parsed.map(normalizeLoan) : [normalizeLoan(parsed)]);
        }
      } catch (error) {
        console.error('Failed to sync loan data from localStorage:', error);
      }
    };
    window.addEventListener('shared_loan_data_updated', handler);
    return () => window.removeEventListener('shared_loan_data_updated', handler);
  }, [persist]);

  const updateLoan = (id: string, field: keyof LoanInfo, value: string) => {
    setLoans(prevLoans => 
      prevLoans.map(loan => 
        loan.id === id ? { ...loan, [field]: value } : loan
      )
    );
  };

  const addLoan = () => {
    const today = getTodayDate();
    const newLoan: LoanInfo = {
      id: Date.now().toString(),
      propertyName: '',
      loanType: 'commercial', // 默认商业贷款
      loanStartDate: today, // 默认今天
      loanEndDate: today, // 默认今天
      rateType: 'floating', // 默认浮动利率
      fixedRate: '',
      floatingRateAdjustment: '',
      paymentMethod: 'equal-payment', // 默认等额本息
      loanAmount: '',
      remainingPrincipal: '',
      // 组合贷款默认值
      commercialLoanAmount: '',
      commercialStartDate: today, // 默认今天
      commercialEndDate: today, // 默认今天
      commercialPaymentMethod: 'equal-payment', // 默认等额本息
      commercialRateType: 'floating', // 默认浮动利率
      commercialFixedRate: '',
      commercialFloatingRateAdjustment: '',
      commercialRemainingPrincipal: '',
      providentLoanAmount: '',
      providentStartDate: today, // 默认今天
      providentEndDate: today, // 默认今天
      providentPaymentMethod: 'equal-payment', // 默认等额本息
      providentRate: '',
      providentRemainingPrincipal: '',
    };
    setLoans(prevLoans => [...prevLoans, newLoan]);
  };

  const removeLoan = (id: string) => {
    setLoans(prevLoans => prevLoans.filter(loan => loan.id !== id));
  };

  const resetLoan = (id: string) => {
    const today = getTodayDate();
    setLoans(prevLoans => 
      prevLoans.map(loan => 
        loan.id === id ? {
          ...loan,
          propertyName: '',
          loanType: 'commercial',
          loanStartDate: today,
          loanEndDate: today,
          rateType: 'floating',
          fixedRate: '',
          floatingRateAdjustment: '',
          paymentMethod: 'equal-payment',
          loanAmount: '',
          remainingPrincipal: '',
          commercialLoanAmount: '',
          commercialStartDate: today,
          commercialEndDate: today,
          commercialPaymentMethod: 'equal-payment',
          commercialRateType: 'floating',
          commercialFixedRate: '',
          commercialFloatingRateAdjustment: '',
          commercialRemainingPrincipal: '',
          providentLoanAmount: '',
          providentStartDate: today,
          providentEndDate: today,
          providentPaymentMethod: 'equal-payment',
          providentRate: '',
          providentRemainingPrincipal: '',
        } : loan
      )
    );
  };

  return {
    loans,
    updateLoan,
    addLoan,
    removeLoan,
    resetLoan,
    setLoans
  };
};