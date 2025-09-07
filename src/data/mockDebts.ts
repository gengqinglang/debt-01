import type { DebtInfo } from '@/pages/FinancialStatusPage';

export const mockDebts: DebtInfo[] = [
  {
    id: 'mock-mortgage-1',
    type: 'mortgage',
    name: '首套房贷',
    amount: 180, // 万元
    monthlyPayment: 8500, // 元
    interestRate: 0.042, // 4.2%
    remainingMonths: 240,
    loanType: 'commercial',
    principal: 1800000, // 元
    term: 300,
    repaymentMethod: 'equal_installment'
  },
  {
    id: 'mock-car-1',
    type: 'carLoan',
    name: '奔驰C260',
    vehicleName: '奔驰C260',
    amount: 25, // 万元
    monthlyPayment: 4200, // 元
    interestRate: 0.048, // 4.8%
    remainingMonths: 36,
    carLoanType: 'bankLoan',
    carPrincipal: 250000, // 元
    carTerm: 60,
    carInterestRate: 0.048,
    carStartDate: new Date('2022-03-10')
  },
  {
    id: 'mock-consumer-1',
    type: 'consumerLoan',
    name: '装修贷',
    amount: 15, // 万元
    monthlyPayment: 3100, // 元
    interestRate: 0.058, // 5.8%
    remainingMonths: 60
  },
  {
    id: 'mock-business-1',
    type: 'businessLoan',
    name: '经营周转贷',
    amount: 50, // 万元
    monthlyPayment: 5800, // 元
    interestRate: 0.065, // 6.5%
    remainingMonths: 120
  },
  {
    id: 'mock-private-1',
    type: 'privateLoan',
    name: '朋友借款',
    amount: 8, // 万元
    monthlyPayment: 2000, // 元
    interestRate: 0.072, // 7.2%
    remainingMonths: 48
  },
  {
    id: 'mock-credit-1',
    type: 'creditCard',
    name: '招商银行信用卡',
    amount: 2, // 万元 (本期+未出账单)
    monthlyPayment: 2500 // 元（假设最低还款）
  }
];

export const setMockDebts = () => {
  localStorage.setItem('confirmed_debts', JSON.stringify(mockDebts));
  localStorage.setItem('mock_debts_active', 'true');
};

export const clearMockDebts = () => {
  localStorage.removeItem('confirmed_debts');
  localStorage.removeItem('mock_debts_active');
};

export const isMockDebtsActive = () => {
  return localStorage.getItem('mock_debts_active') === 'true';
};