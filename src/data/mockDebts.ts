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

// 提供匹配各组件hook期望格式的模拟数据
export const getMockFormData = () => {
  const today = new Date().toISOString().split('T')[0];
  
  return {
    mortgage: {
      loans: [
        {
          id: 'mock-mortgage-1',
          propertyName: '海淀某小区',
          loanType: 'commercial',
          loanAmount: '300',
          remainingPrincipal: '180',
          loanStartDate: '2020-05',
          loanEndDate: '2040-05',
          paymentMethod: 'equal-payment',
          rateType: 'floating',
          floatingRateAdjustment: '0'
        }
      ]
    },
    carLoan: {
      carLoans: [
        {
          id: 'mock-car-1',
          vehicleName: '奔驰C260',
          loanType: 'bankLoan',
          principal: '25',
          term: '5',
          interestRate: '4.8',
          startDate: '2022-03-10',
          endDate: '2027-03-10',
          repaymentMethod: 'equal-payment',
          remainingPrincipal: '15',
          startDateMonth: '2022-03-10',
          endDateMonth: '2027-03-10'
        }
      ]
    },
    consumerLoan: {
      consumerLoans: [
        {
          id: 'mock-consumer-1',
          name: '装修贷',
          loanAmount: '20',
          remainingPrincipal: '15',
          startDate: '2023-01-15',
          endDate: '2028-01-15',
          loanTerm: '5',
          annualRate: '5.8',
          repaymentMethod: 'equal-payment'
        }
      ]
    },
    businessLoan: {
      businessLoans: [
        {
          id: 'mock-business-1',
          name: '经营周转贷',
          loanAmount: '80',
          remainingPrincipal: '50',
          startDate: '2022-08-20',
          endDate: '2032-08-20',
          loanTerm: '10',
          annualRate: '6.5',
          repaymentMethod: 'equal-payment'
        }
      ]
    },
    privateLoan: {
      privateLoans: [
        {
          id: 'mock-private-1',
          name: '朋友借款',
          loanAmount: '8',
          startDate: '2023-06-01',
          endDate: '2027-06-01',
          annualRate: '7.2',
          rateFen: '2',
          rateLi: '0',
          repaymentMethod: 'equal-payment'
        }
      ]
    },
    creditCard: {
      creditCards: [
        {
          id: 'mock-credit-1',
          name: '招商银行信用卡',
          currentAmount: '12000',
          unbilledAmount: '8000'
        }
      ]
    }
  };
};

export const setMockDebts = () => {
  const mockFormData = getMockFormData();
  localStorage.setItem('confirmed_debts', JSON.stringify(mockDebts));
  localStorage.setItem('mock_debts_active', 'true');
  localStorage.setItem('mock_form_data', JSON.stringify(mockFormData));
  localStorage.setItem('shared_loan_data', JSON.stringify(mockFormData.mortgage.loans));
};

export const clearMockDebts = () => {
  localStorage.removeItem('confirmed_debts');
  localStorage.removeItem('mock_debts_active');
  localStorage.removeItem('mock_form_data');
  localStorage.removeItem('shared_loan_data');
};

export const isMockDebtsActive = () => {
  return localStorage.getItem('mock_debts_active') === 'true';
};