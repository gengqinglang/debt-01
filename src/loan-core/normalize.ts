// Normalization functions for all debt types

import { DebtAggregate, DebtItem, NormalizedDebtData, ConfirmPayload } from './types';
import { LoanInfo } from '@/hooks/useLoanData';
import { CarLoanInfo } from '@/hooks/useCarLoanData';
import { ConsumerLoanInfo } from '@/hooks/useConsumerLoanData';
import { BusinessLoanInfo } from '@/hooks/useBusinessLoanData';
import { PrivateLoanInfo } from '@/hooks/usePrivateLoanData';
import { CreditCardInfo } from '@/hooks/useCreditCardData';

// 房贷标准化
export function normalizeMortgageData(data: any): NormalizedDebtData {
  if (!data) {
    return {
      aggregate: { count: 0, amountWan: 0, monthlyPaymentYuan: 0, remainingMonths: 0 },
      items: [],
      rawData: data
    };
  }

  // 处理聚合形式的数据（来自hooks或确认后的汇总）
  if (typeof data.count === 'number' && typeof data.remainingPrincipal === 'number') {
    return {
      aggregate: {
        count: data.count || 0,
        amountWan: data.remainingPrincipal || 0,
        monthlyPaymentYuan: data.monthlyPayment || 0,
        remainingMonths: data.remainingMonths || 0
      },
      items: [],
      rawData: data
    };
  }

  // 处理详细数组形式的数据
  const loans: LoanInfo[] = data.loans || [];
  if (loans.length === 0) {
    return {
      aggregate: { count: 0, amountWan: 0, monthlyPaymentYuan: 0, remainingMonths: 0 },
      items: [],
      rawData: data
    };
  }

  const items: DebtItem[] = loans.map(loan => ({
    id: loan.id,
    name: loan.propertyName || '房贷',
    amountWan: parseFloat(loan.remainingPrincipal || '0'),
    monthlyPaymentYuan: 0, // 需要从计算函数获取
    remainingMonths: 0 // 需要从计算函数获取
  }));

  const totalAmountWan = items.reduce((sum, item) => sum + item.amountWan, 0);

  return {
    aggregate: {
      count: items.length,
      amountWan: totalAmountWan,
      monthlyPaymentYuan: data.monthlyPayment || 0,
      remainingMonths: data.remainingMonths || 0
    },
    items,
    rawData: data
  };
}

// 车贷标准化
export function normalizeCarLoanData(data: any): NormalizedDebtData {
  if (!data || !data.carLoans) {
    return {
      aggregate: { count: 0, amountWan: 0, monthlyPaymentYuan: 0, remainingMonths: 0 },
      items: [],
      rawData: data
    };
  }

  const carLoans: CarLoanInfo[] = data.carLoans;
  const items: DebtItem[] = carLoans
    .filter((loan: CarLoanInfo) => {
      if (loan.loanType === 'installment') {
        return loan.installmentAmount && parseFloat(loan.installmentAmount) > 0 && 
               loan.remainingInstallments && parseFloat(loan.remainingInstallments) > 0;
      } else {
        return loan.remainingPrincipal && parseFloat(loan.remainingPrincipal) > 0;
      }
    })
    .map((loan: CarLoanInfo) => {
      let amountWan = 0;
      let monthlyPaymentYuan = 0;
      let remainingMonths = 0;

      if (loan.loanType === 'installment') {
        const installmentAmount = parseFloat(loan.installmentAmount || '0');
        const remainingInstallments = parseFloat(loan.remainingInstallments || '0');
        amountWan = (installmentAmount * remainingInstallments) / 10000; // 估算总额
        monthlyPaymentYuan = installmentAmount;
        remainingMonths = remainingInstallments;
      } else {
        amountWan = parseFloat(loan.remainingPrincipal || '0');
        // 月供和剩余月数需要从详细计算中获取
        monthlyPaymentYuan = 0;
        remainingMonths = 0;
      }

      return {
        id: loan.id,
        name: loan.vehicleName || '车贷',
        amountWan,
        monthlyPaymentYuan,
        remainingMonths
      };
    });

  const totalAmountWan = items.reduce((sum, item) => sum + item.amountWan, 0);
  const totalMonthlyPaymentYuan = items.reduce((sum, item) => sum + item.monthlyPaymentYuan, 0);
  const maxRemainingMonths = Math.max(...items.map(item => item.remainingMonths), 0);

  return {
    aggregate: {
      count: items.length,
      amountWan: totalAmountWan,
      monthlyPaymentYuan: totalMonthlyPaymentYuan,
      remainingMonths: maxRemainingMonths
    },
    items,
    rawData: data
  };
}

// 消费贷标准化
export function normalizeConsumerLoanData(data: any): NormalizedDebtData {
  if (!data || !data.consumerLoans) {
    return {
      aggregate: { count: 0, amountWan: 0, monthlyPaymentYuan: 0, remainingMonths: 0 },
      items: [],
      rawData: data
    };
  }

  const consumerLoans: ConsumerLoanInfo[] = data.consumerLoans;
  const aggregatedData = data.getAggregatedData ? data.getAggregatedData() : {
    count: 0,
    totalLoanAmount: 0,
    totalMonthlyPayment: 0,
    maxRemainingMonths: 0
  };

  const items: DebtItem[] = consumerLoans.map((loan: ConsumerLoanInfo) => ({
    id: loan.id,
    name: loan.name || '消费贷',
    amountWan: parseFloat(loan.loanAmount || '0'),
    monthlyPaymentYuan: 0, // 从聚合数据中分摊
    remainingMonths: 0
  }));

  return {
    aggregate: {
      count: aggregatedData.count,
      amountWan: aggregatedData.totalLoanAmount,
      monthlyPaymentYuan: aggregatedData.totalMonthlyPayment,
      remainingMonths: aggregatedData.maxRemainingMonths
    },
    items,
    rawData: data
  };
}

// 经营贷标准化
export function normalizeBusinessLoanData(data: any): NormalizedDebtData {
  if (!data || !data.businessLoans) {
    return {
      aggregate: { count: 0, amountWan: 0, monthlyPaymentYuan: 0, remainingMonths: 0 },
      items: [],
      rawData: data
    };
  }

  const businessLoans: BusinessLoanInfo[] = data.businessLoans;
  const aggregatedData = data.getAggregatedData ? data.getAggregatedData() : {
    count: 0,
    totalLoanAmount: 0,
    totalMonthlyPayment: 0,
    maxRemainingMonths: 0
  };

  const items: DebtItem[] = businessLoans.map((loan: BusinessLoanInfo) => ({
    id: loan.id,
    name: loan.name || '经营贷',
    amountWan: parseFloat(loan.loanAmount || '0'),
    monthlyPaymentYuan: 0, // 从聚合数据中分摊
    remainingMonths: 0
  }));

  return {
    aggregate: {
      count: aggregatedData.count,
      amountWan: aggregatedData.totalLoanAmount,
      monthlyPaymentYuan: aggregatedData.totalMonthlyPayment,
      remainingMonths: aggregatedData.maxRemainingMonths
    },
    items,
    rawData: data
  };
}

// 民间贷标准化
export function normalizePrivateLoanData(data: any): NormalizedDebtData {
  if (!data || !data.privateLoans) {
    return {
      aggregate: { count: 0, amountWan: 0, monthlyPaymentYuan: 0, remainingMonths: 0 },
      items: [],
      rawData: data
    };
  }

  const privateLoans: PrivateLoanInfo[] = data.privateLoans;
  const aggregatedData = data.getAggregatedData ? data.getAggregatedData() : {
    count: 0,
    totalLoanAmount: 0,
    totalMonthlyPayment: 0,
    maxRemainingMonths: 0
  };

  const items: DebtItem[] = privateLoans.map((loan: PrivateLoanInfo) => ({
    id: loan.id,
    name: loan.name || '民间贷',
    amountWan: parseFloat(loan.loanAmount || '0'),
    monthlyPaymentYuan: 0, // 从聚合数据中分摊
    remainingMonths: 0
  }));

  return {
    aggregate: {
      count: aggregatedData.count,
      amountWan: aggregatedData.totalLoanAmount,
      monthlyPaymentYuan: aggregatedData.totalMonthlyPayment,
      remainingMonths: aggregatedData.maxRemainingMonths
    },
    items,
    rawData: data
  };
}

// 信用卡标准化
export function normalizeCreditCardData(data: any): NormalizedDebtData {
  if (!data || !data.creditCards) {
    return {
      aggregate: { count: 0, amountWan: 0, monthlyPaymentYuan: 0, remainingMonths: 0 },
      items: [],
      rawData: data
    };
  }

  const creditCards: CreditCardInfo[] = data.creditCards;
  const aggregatedData = data.getAggregatedData ? data.getAggregatedData() : {
    count: 0,
    totalAmount: 0
  };

  const items: DebtItem[] = creditCards.map((card: CreditCardInfo) => ({
    id: card.id,
    name: card.name || '信用卡',
    amountWan: ((parseFloat(card.currentAmount || '0') + parseFloat(card.unbilledAmount || '0')) / 10000),
    monthlyPaymentYuan: 0, // 信用卡没有固定月供
    remainingMonths: 0
  }));

  return {
    aggregate: {
      count: aggregatedData.count,
      amountWan: aggregatedData.totalAmount,
      monthlyPaymentYuan: 0, // 信用卡没有固定月供
      remainingMonths: 0
    },
    items,
    rawData: data
  };
}

// 统一标准化入口
export function normalizeDebtData(type: string, data: any): NormalizedDebtData {
  switch (type) {
    case 'mortgage':
      return normalizeMortgageData(data);
    case 'carLoan':
      return normalizeCarLoanData(data);
    case 'consumerLoan':
      return normalizeConsumerLoanData(data);
    case 'businessLoan':
      return normalizeBusinessLoanData(data);
    case 'privateLoan':
      return normalizePrivateLoanData(data);
    case 'creditCard':
      return normalizeCreditCardData(data);
    default:
      return {
        aggregate: { count: 0, amountWan: 0, monthlyPaymentYuan: 0, remainingMonths: 0 },
        items: [],
        rawData: data
      };
  }
}

// 为保存生成适配的债务信息
export function adaptDebtInfoForSave(type: string, normalizedData: NormalizedDebtData): ConfirmPayload {
  const { aggregate, rawData } = normalizedData;
  
  return {
    type,
    name: getDebtDisplayName(type),
    amount: aggregate.amountWan,
    monthlyPayment: aggregate.monthlyPaymentYuan,
    remainingMonths: aggregate.remainingMonths,
    normalized: aggregate,
    rawData
  };
}

function getDebtDisplayName(type: string): string {
  const names: { [key: string]: string } = {
    mortgage: '房贷',
    carLoan: '车贷',
    consumerLoan: '消费贷',
    businessLoan: '经营贷',
    privateLoan: '民间贷',
    creditCard: '信用卡'
  };
  return names[type] || type;
}