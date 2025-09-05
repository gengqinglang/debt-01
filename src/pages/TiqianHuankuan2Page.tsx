import React, { useEffect, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, ReferenceDot } from 'recharts';
import { Home, DollarSign, Calculator, TrendingUp, Percent, BarChart3, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoanSelectorDrawer } from '@/components/tiqian/LoanSelectorDrawer';
import { SelectedSummaryBar } from '@/components/tiqian/SelectedSummaryBar';

interface DebtItem {
  id: string;
  name?: string; // 用户在财务状态页录入的“名称”
  type: string;
  category?: string; // Add category field to distinguish debt types
  loanType?: string; // Add loan type for mortgage/car loan subtypes
  remainingPrincipal: number;
  borrower: string;
  term: number;
  interestRate: number;
  interestRateCommercial?: number;
  interestRatePublic?: number;
  repaymentMethod: string;
  totalAmount: number;
  paidPrincipal: number;
  paidInterest: number;
  remainingInterest: number;
  monthsPaid?: number;
  remainingMonths?: number;
}

interface CashFlowData {
  age: number;
  normalInflow: number;
  normalOutflow: number;
  normalSurplus: number;
  riskInflow: number;
  riskOutflow: number;
  riskSurplus: number;
  prepaymentSurplus: number;
  salaryIncome: number;
  bonusIncome: number;
  investmentIncome: number;
  otherIncome: number;
  mortgagePayment: number;
  carLoanPayment: number;
  livingExpenses: number;
  educationExpenses: number;
  insuranceFees: number;
  otherExpenses: number;
}

const mockDebtData: DebtItem[] = [{
  id: '2',
  type: '幸福里',
  remainingPrincipal: 200000,
  borrower: '张三',
  term: 5,
  interestRate: 6.8,
  interestRateCommercial: 4.9,
  interestRatePublic: 3.25,
  repaymentMethod: '等额本息',
  totalAmount: 300000,
  paidPrincipal: 100000,
  paidInterest: 45000,
  remainingInterest: 35000,
  monthsPaid: 24,
  remainingMonths: 36
}, {
  id: '1',
  type: '栖海云颂',
  remainingPrincipal: 2500000,
  borrower: '张三',
  term: 30,
  interestRate: 4.5,
  repaymentMethod: '等额本息',
  totalAmount: 2500000,
  paidPrincipal: 25400,
  paidInterest: 120000,
  remainingInterest: 1180000,
  monthsPaid: 1,
  remainingMonths: 359
}, {
  id: '3',
  type: '车贷',
  remainingPrincipal: 150000,
  borrower: '张三',
  term: 5,
  interestRate: 7.2,
  repaymentMethod: '分期还款',
  totalAmount: 180000,
  paidPrincipal: 30000,
  paidInterest: 12000,
  remainingInterest: 18000,
  monthsPaid: 12,
  remainingMonths: 48
}, {
  id: '4',
  type: '经营贷',
  remainingPrincipal: 2670000,
  borrower: '张三',
  term: 3,
  interestRate: 4.8,
  repaymentMethod: '先息后本',
  totalAmount: 2670000,
  paidPrincipal: 0,
  paidInterest: 36000,
  remainingInterest: 348000,
  monthsPaid: 12,
  remainingMonths: 24
}, {
  id: '5',
  type: '消费贷',
  remainingPrincipal: 270000,
  borrower: '张三',
  term: 2,
  interestRate: 8.5,
  repaymentMethod: '一次性还本付息',
  totalAmount: 270000,
  paidPrincipal: 0,
  paidInterest: 0,
  remainingInterest: 45900,
  monthsPaid: 0,
  remainingMonths: 24
}, {
  id: '6',
  type: '民间贷',
  remainingPrincipal: 450000,
  borrower: '张三',
  term: 1,
  interestRate: 12.0,
  repaymentMethod: '一次性还本付息',
  totalAmount: 450000,
  paidPrincipal: 0,
  paidInterest: 0,
  remainingInterest: 54000,
  monthsPaid: 0,
  remainingMonths: 12
}];

// 财务状态页面的债务类型
interface FinancialStatusDebtInfo {
  id: string;
  type: 'mortgage' | 'carLoan' | 'consumerLoan' | 'businessLoan' | 'privateLoan' | 'creditCard';
  name: string;
  amount: number;
  monthlyPayment: number;
  remainingMonths?: number;
  interestRate?: number;
  repaymentMethod?: string;
}

// 将财务状态页面的债务数据转换为提前还款页面的债务格式（更健壮的字段与单位处理）
const convertFinancialStatusDebtToDebtItem = (fsDebt: FinancialStatusDebtInfo): DebtItem[] => {
  const items: DebtItem[] = [];

  const toNumber = (v: any) => {
    if (v === undefined || v === null) return 0;
    const s = String(v).replace(/[,\s]/g, '');
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  };
  const toYuan = (v: any) => {
    const n = toNumber(v);
    // 如果数值很小（例如 < 100000），可能是“万元”或本来就是元的小额；
    // 无法准确识别的情况下，优先按“万元”转换（常见录入为万元）。
    return n > 100000 ? n : n * 10000;
  };

  if (fsDebt.type === 'mortgage') {
    const loans = (fsDebt as any).loans as any[] | undefined;
    if (Array.isArray(loans) && loans.length > 0) {
      loans.forEach((loan: any, index: number) => {
        // 组合贷款：分别取两部分剩余本金相加；否则用单贷剩余本金
        const remainingPrincipalYuan = loan.loanType === 'combination'
          ? toYuan(loan.commercialRemainingPrincipal) + toYuan(loan.providentRemainingPrincipal)
          : toYuan(loan.remainingPrincipal);
        const rate = toNumber(loan.fixedRate || loan.commercialFixedRate || loan.providentRate || loan.floatingRateAdjustment || 3.5);
        const payMethod = loan.paymentMethod || loan.commercialPaymentMethod || loan.providentPaymentMethod || '等额本息';

        const remainingMonths = toNumber((fsDebt as any).remainingMonths) || 360;
        const monthlyPayment = toNumber((fsDebt as any).monthlyPayment) || (remainingPrincipalYuan * (rate / 100 / 12));

        const getLoanTypeName = (loanType: string) => {
          switch (loanType) {
            case 'commercial': return '商业贷款';
            case 'provident': return '公积金贷款';
            case 'combination': return '组合贷款';
            default: return '';
          }
        };

        items.push({
          id: `${fsDebt.id}_${index}`,
          name: loan.propertyName || (fsDebt as any).name || '房贷',
          type: loan.propertyName || '房贷',
          category: 'mortgage',
          loanType: getLoanTypeName(loan.loanType),
          remainingPrincipal: remainingPrincipalYuan,
          borrower: '张三',
          term: Math.ceil(remainingMonths / 12),
          interestRate: rate,
          repaymentMethod: payMethod,
          totalAmount: remainingPrincipalYuan + Math.max(0, monthlyPayment * remainingMonths - remainingPrincipalYuan),
          paidPrincipal: 0,
          paidInterest: 0,
          remainingInterest: Math.max(0, monthlyPayment * remainingMonths - remainingPrincipalYuan),
          monthsPaid: 0,
          remainingMonths: remainingMonths
        });
      });
    } else {
      // 单条汇总项兜底
      const remainingPrincipalYuan = toYuan((fsDebt as any).amount);
      const rate = toNumber((fsDebt as any).interestRate || 3.5);
      const remainingMonths = toNumber((fsDebt as any).remainingMonths) || 360;
      const monthlyPayment = toNumber((fsDebt as any).monthlyPayment) || (remainingPrincipalYuan * (rate / 100 / 12));

      items.push({
        id: fsDebt.id,
        name: (fsDebt as any).name || '房贷',
        type: '房贷',
        category: 'mortgage',
        remainingPrincipal: remainingPrincipalYuan,
        borrower: '张三',
        term: Math.ceil(remainingMonths / 12),
        interestRate: rate,
        repaymentMethod: (fsDebt as any).repaymentMethod || '等额本息',
        totalAmount: remainingPrincipalYuan + Math.max(0, monthlyPayment * remainingMonths - remainingPrincipalYuan),
        paidPrincipal: 0,
        paidInterest: 0,
        remainingInterest: Math.max(0, monthlyPayment * remainingMonths - remainingPrincipalYuan),
        monthsPaid: 0,
        remainingMonths: remainingMonths
      });
    }
  } else if (fsDebt.type === 'carLoan') {
    const carLoans = (fsDebt as any).carLoans as any[] | undefined;
    if (Array.isArray(carLoans) && carLoans.length > 0) {
      const now = new Date();
      carLoans.forEach((carLoan: any, index: number) => {
        const isInstallment = carLoan.loanType === 'installment';
        // 分期：剩余本金近似= 每期金额 * 剩余期数；银行：优先用剩余本金（元），否则原始本金(万元)
        const remainingPrincipalYuan = isInstallment
          ? toNumber(carLoan.installmentAmount) * toNumber(carLoan.remainingInstallments)
          : (toNumber(carLoan.remainingPrincipal) || toYuan(carLoan.principal));

        const rate = toNumber(carLoan.interestRate || 4.0);
        const repaymentMethod = isInstallment
          ? '分期还款'
          : (carLoan.repaymentMethod === 'equal-principal' ? '等额本金' : '等额本息');

        // 计算剩余月数
        let remainingMonths = 0;
        if (isInstallment) {
          remainingMonths = Math.max(0, Math.round(toNumber(carLoan.remainingInstallments)));
        } else {
          if (carLoan.endDate || carLoan.endDateMonth) {
            const end = new Date((carLoan.endDate || carLoan.endDateMonth) + (String(carLoan.endDate || carLoan.endDateMonth).length === 7 ? '-01' : ''));
            remainingMonths = Math.max(0, (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth()));
          } else if (carLoan.term) {
            remainingMonths = Math.max(0, Math.round(toNumber(carLoan.term) * 12));
          } else {
            remainingMonths = 60;
          }
        }

        const monthlyPayment = isInstallment
          ? toNumber(carLoan.installmentAmount)
          : (remainingPrincipalYuan * (rate / 100 / 12));

        const getCarLoanTypeName = (loanType: string) => {
          return loanType === 'installment' ? '分期贷款' : '银行贷款';
        };

        items.push({
          id: `${fsDebt.id}_${index}`,
          name: carLoan.vehicleName || carLoan.name || '车贷',
          type: carLoan.vehicleName || '车贷',
          category: 'carLoan',
          loanType: getCarLoanTypeName(carLoan.loanType),
          remainingPrincipal: remainingPrincipalYuan,
          borrower: '张三',
          term: Math.ceil(remainingMonths / 12) || 5,
          interestRate: rate,
          repaymentMethod,
          totalAmount: remainingPrincipalYuan + Math.max(0, monthlyPayment * remainingMonths - remainingPrincipalYuan),
          paidPrincipal: 0,
          paidInterest: 0,
          remainingInterest: Math.max(0, monthlyPayment * remainingMonths - remainingPrincipalYuan),
          monthsPaid: 0,
          remainingMonths
        });
      });
    }
  } else {
    // 其他类型
    const getDebtTypeDetails = (type: string) => {
      switch (type) {
        case 'consumerLoan':
          return { name: '消费贷', category: 'consumerLoan', rate: 6.0 };
        case 'businessLoan':
          return { name: '经营贷', category: 'businessLoan', rate: 5.5 };
        case 'privateLoan':
          return { name: '民间贷', category: 'privateLoan', rate: 12.0 };
        case 'creditCard':
          return { name: '信用卡', category: 'creditCard', rate: 18.0 };
        default:
          return { name: type, category: type, rate: 5.0 };
      }
    };
    const typeDetails = getDebtTypeDetails(fsDebt.type);

    const arrayKey = fsDebt.type + 's';
    const detailArray = (fsDebt as any)[arrayKey];
    if (detailArray && Array.isArray(detailArray)) {
      detailArray.forEach((detail: any, index: number) => {
        const remainingPrincipalYuan = toYuan(detail.loanAmount || detail.outstandingBalance);
        const rate = toNumber(detail.interestRate || detail.annualFeeRate || typeDetails.rate);
        const remainingMonths = Math.max(0, Math.round(toNumber(detail.remainingMonths) || 60));
        const monthlyPayment = toNumber(detail.monthlyPayment) || (remainingPrincipalYuan * (rate / 100 / 12));

        items.push({
          id: `${fsDebt.id}_${index}`,
          name: detail.name || detail.loanName || detail.cardName || typeDetails.name,
          type: detail.loanName || detail.cardName || typeDetails.name,
          category: typeDetails.category,
          remainingPrincipal: remainingPrincipalYuan,
          borrower: '张三',
          term: Math.ceil(remainingMonths / 12),
          interestRate: rate,
          repaymentMethod: detail.paymentMethod || '等额本息',
          totalAmount: remainingPrincipalYuan + Math.max(0, monthlyPayment * remainingMonths - remainingPrincipalYuan),
          paidPrincipal: 0,
          paidInterest: 0,
          remainingInterest: Math.max(0, monthlyPayment * remainingMonths - remainingPrincipalYuan),
          monthsPaid: 0,
          remainingMonths
        });
      });
    } else if ((fsDebt as any).amount) {
      const remainingPrincipalYuan = toYuan((fsDebt as any).amount);
      const rate = toNumber((fsDebt as any).interestRate || typeDetails.rate);
      const remainingMonths = Math.max(0, Math.round(toNumber((fsDebt as any).remainingMonths) || 60));
      const monthlyPayment = toNumber((fsDebt as any).monthlyPayment) || (remainingPrincipalYuan * (rate / 100 / 12));

      items.push({
        id: fsDebt.id,
        name: (fsDebt as any).name || typeDetails.name,
        type: typeDetails.name,
        category: typeDetails.category,
        remainingPrincipal: remainingPrincipalYuan,
        borrower: '张三',
        term: Math.ceil(remainingMonths / 12),
        interestRate: rate,
        repaymentMethod: (fsDebt as any).repaymentMethod || '等额本息',
        totalAmount: remainingPrincipalYuan + Math.max(0, monthlyPayment * remainingMonths - remainingPrincipalYuan),
        paidPrincipal: 0,
        paidInterest: 0,
        remainingInterest: Math.max(0, monthlyPayment * remainingMonths - remainingPrincipalYuan),
        monthsPaid: 0,
        remainingMonths
      });
    }
  }

  return items;
};

// 获取实际债务数据（优先使用localStorage中的数据）
const getActualDebtData = (): DebtItem[] => {
  try {
    const confirmedDebtsStr = localStorage.getItem('confirmed_debts');
    console.log('Debug: localStorage confirmed_debts:', confirmedDebtsStr);
    if (confirmedDebtsStr) {
      const confirmedDebts: any[] = JSON.parse(confirmedDebtsStr);
      console.log('Debug: parsed confirmed_debts:', confirmedDebts);

      // 如果房贷缺少详细loans，尝试从 shared_loan_data 兜底补齐
      const sharedLoansStr = localStorage.getItem('shared_loan_data');
      const sharedLoans = sharedLoansStr ? JSON.parse(sharedLoansStr) : [];
      if (Array.isArray(sharedLoans) && sharedLoans.length > 0) {
        confirmedDebts.forEach(d => {
          if (d.type === 'mortgage' && (!d.loans || !Array.isArray(d.loans) || d.loans.length === 0)) {
            d.loans = sharedLoans;
          }
        });
      }

      if (confirmedDebts.length > 0) {
        const convertedItems = confirmedDebts.flatMap(convertFinancialStatusDebtToDebtItem);
        console.log('Debug: converted debt items:', convertedItems);
        return convertedItems;
      }
    }
  } catch (error) {
    console.warn('Failed to parse confirmed debts from localStorage:', error);
  }
  
  return [];
};

const TiqianHuankuan2Page: React.FC = () => {
  console.log('Debug: TiqianHuankuan2Page component started rendering');
  const debtData = getActualDebtData();
  console.log('Debug: debtData from getActualDebtData:', debtData);
  
  const [selectedLoanIds, setSelectedLoanIds] = useState<string[]>(() => {
    const actualData = getActualDebtData();
    if (actualData.length === 1) return [actualData[0].id];
    // Find first mortgage loan using category field
    const firstMortgage = actualData.find(debt => debt.category === 'mortgage');
    return firstMortgage ? [firstMortgage.id] : (actualData.length > 0 ? [actualData[0].id] : []);
  });
  const [loanPrepaymentAmounts, setLoanPrepaymentAmounts] = useState<{
    [key: string]: string;
  }>({});
  const [loanFeeRates, setLoanFeeRates] = useState<{
    [key: string]: string;
  }>({});
  const [loanRepaymentMethods, setLoanRepaymentMethods] = useState<{
    [key: string]: string;
  }>({});
  const [selectedPoint, setSelectedPoint] = useState<CashFlowData | null>(null);
  const [isDetailExpanded, setIsDetailExpanded] = useState(true);
  const [showHousePlan, setShowHousePlan] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { toast } = useToast();

  // 计算总的提前还款金额和费用
  const getTotalPrepaymentAmount = () => {
    return selectedLoanIds.reduce((total, loanId) => {
      const amount = parseFloat(loanPrepaymentAmounts[loanId] || '0');
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);
  };
  const getTotalHandlingFee = () => {
    return selectedLoanIds.reduce((total, loanId) => {
      const amount = parseFloat(loanPrepaymentAmounts[loanId] || '0');
      const rate = parseFloat(loanFeeRates[loanId] || '0');
      if (isNaN(amount) || isNaN(rate)) return total;
      return total + amount * 10000 * rate / 100;
    }, 0);
  };

  // 单笔贷款的计算函数
  const getLoanCostSaving = (loanId: string) => {
    const amount = parseFloat(loanPrepaymentAmounts[loanId] || '0');
    const rate = parseFloat(loanFeeRates[loanId] || '0');
    console.log(`Debug getLoanCostSaving - loanId: ${loanId}, amount: ${amount}, rate: ${rate}`);
    console.log(`Debug getLoanCostSaving - loanPrepaymentAmounts:`, loanPrepaymentAmounts);
    console.log(`Debug getLoanCostSaving - loanFeeRates:`, loanFeeRates);
    
    if (isNaN(amount) || isNaN(rate)) {
      console.log(`Debug getLoanCostSaving - returning 0 due to NaN`);
      return 0;
    }
    
    // 简化计算：假设节省成本为提前还款金额的4.5%利息
    const interestSavings = amount * 10000 * 0.045;
    const handlingFee = amount * 10000 * rate / 100;
    const result = interestSavings - handlingFee;
    console.log(`Debug getLoanCostSaving - interestSavings: ${interestSavings}, handlingFee: ${handlingFee}, result: ${result}`);
    return result;
  };

  const getLoanNextMonthlyPayment = (loanId: string) => {
    const debt = debtData.find(d => d.id === loanId);
    if (!debt) {
      console.log(`Debug getLoanNextMonthlyPayment - debt not found for loanId: ${loanId}`);
      return 0;
    }
    
    const amount = parseFloat(loanPrepaymentAmounts[loanId] || '0');
    const repaymentMethod = loanRepaymentMethods[loanId] || '期限不变，减少月供';
    console.log(`Debug getLoanNextMonthlyPayment - loanId: ${loanId}, amount: ${amount}, repaymentMethod: ${repaymentMethod}`);
    console.log(`Debug getLoanNextMonthlyPayment - debt:`, debt);
    
    if (isNaN(amount)) {
      console.log(`Debug getLoanNextMonthlyPayment - amount is NaN, using original monthly payment`);
      // 没有提前还款，返回原月供 - 使用等额本息公式
      const monthlyRate = debt.interestRate / 100 / 12;
      const remainingMonths = debt.remainingMonths || 240; // 默认20年
      const originalPayment = monthlyRate === 0 
        ? debt.remainingPrincipal / remainingMonths
        : debt.remainingPrincipal * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths) / (Math.pow(1 + monthlyRate, remainingMonths) - 1);
      console.log(`Debug getLoanNextMonthlyPayment - originalPayment: ${originalPayment}`);
      return originalPayment;
    }
    
    const monthlyRate = debt.interestRate / 100 / 12;
    const remainingMonths = debt.remainingMonths || 240;
    const currentMonthlyPayment = monthlyRate === 0 
      ? debt.remainingPrincipal / remainingMonths
      : debt.remainingPrincipal * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths) / (Math.pow(1 + monthlyRate, remainingMonths) - 1);
    console.log(`Debug getLoanNextMonthlyPayment - currentMonthlyPayment: ${currentMonthlyPayment}`);
    
    if (repaymentMethod === '期限不变，减少月供') {
      // 减少月供计算
      const reductionRatio = amount * 10000 / debt.remainingPrincipal;
      const result = currentMonthlyPayment * (1 - reductionRatio * 0.7); // 简化计算
      console.log(`Debug getLoanNextMonthlyPayment - reductionRatio: ${reductionRatio}, result: ${result}`);
      return result;
    } else {
      // 月供不变，缩短期限
      console.log(`Debug getLoanNextMonthlyPayment - returning current payment (period shortened): ${currentMonthlyPayment}`);
      return currentMonthlyPayment;
    }
  };

  const getLoanMonthlyPaymentChange = (loanId: string) => {
    const debt = debtData.find(d => d.id === loanId);
    if (!debt) return 0;
    
    const monthlyRate = debt.interestRate / 100 / 12;
    const remainingMonths = debt.remainingMonths || 240;
    const currentMonthlyPayment = monthlyRate === 0 
      ? debt.remainingPrincipal / remainingMonths
      : debt.remainingPrincipal * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths) / (Math.pow(1 + monthlyRate, remainingMonths) - 1);
    const nextMonthlyPayment = getLoanNextMonthlyPayment(loanId);
    
    return nextMonthlyPayment - currentMonthlyPayment;
  };

  // 计算缩短后的期限
  const getLoanShortenedPeriod = (loanId: string) => {
    const debt = debtData.find(d => d.id === loanId);
    if (!debt) return { years: 0, months: 0 };
    
    const amount = parseFloat(loanPrepaymentAmounts[loanId] || '0');
    const repaymentMethod = loanRepaymentMethods[loanId] || '期限不变，减少月供';
    
    if (isNaN(amount) || amount <= 0 || repaymentMethod !== '月供不变，缩短期限') {
      return { years: 0, months: 0 };
    }
    
    // 简化计算：根据提前还款金额计算缩短的期限
    const shortenedMonths = Math.round((amount * 10000 / debt.remainingPrincipal) * (debt.remainingMonths || 0) * 0.8);
    const years = Math.floor(shortenedMonths / 12);
    const months = shortenedMonths % 12;
    
    return { years, months };
  };

  // 计算债务期内断供年份变化
  const getDebtPeriodSupplyDisruptionChange = () => {
    const debtStartAge = 28;
    const debtEndAge = 58;
    
    // 提前还款前的断供年份
    let beforeDisruptionYears = 0;
    for (let age = debtStartAge; age <= debtEndAge; age++) {
      const dataPoint = cashFlowData.find(d => d.age === age);
      if (dataPoint && dataPoint.riskSurplus < 0) {
        beforeDisruptionYears++;
      }
    }
    
    // 提前还款后的断供年份
    let afterDisruptionYears = 0;
    for (let age = debtStartAge; age <= debtEndAge; age++) {
      const dataPoint = cashFlowData.find(d => d.age === age);
      if (dataPoint && dataPoint.prepaymentSurplus < 0) {
        afterDisruptionYears++;
      }
    }
    
    return afterDisruptionYears - beforeDisruptionYears;
  };

  // 计算债务期结束后现金流缺口年份变化
  const getPostDebtGapChange = () => {
    const postDebtStartAge = 59;
    const endAge = 85;
    
    // 提前还款前的缺口年份
    let beforeGapYears = 0;
    for (let age = postDebtStartAge; age <= endAge; age++) {
      const dataPoint = cashFlowData.find(d => d.age === age);
      if (dataPoint && dataPoint.riskSurplus < 0) {
        beforeGapYears++;
      }
    }
    
    // 提前还款后的缺口年份
    let afterGapYears = 0;
    for (let age = postDebtStartAge; age <= endAge; age++) {
      const dataPoint = cashFlowData.find(d => d.age === age);
      if (dataPoint && dataPoint.prepaymentSurplus < 0) {
        afterGapYears++;
      }
    }
    
    return afterGapYears - beforeGapYears;
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    document.title = '提前还款测算 - 资产规划';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', '提前还款测算，评估不同方案下的现金流变化与成本节省。');
  }, []);

  const generateCashFlowData = (): CashFlowData[] => {
    const data: CashFlowData[] = [];
    const riskStartAge = 28;
    const riskDuration = 15;
    for (let age = 28; age <= 85; age++) {
      const baseInflow = 45 + (age - 28) * 0.8;
      const baseOutflow = 25 + (age - 28) * 0.3;
      const waveEffect1 = Math.sin((age - 28) * 0.3) * 3;
      const waveEffect2 = Math.cos((age - 28) * 0.5) * 1.5;
      const randomVariation = (Math.random() - 0.5) * 2;
      const normalInflow = baseInflow + waveEffect1 + randomVariation;
      const normalOutflow = baseOutflow + waveEffect2 * 0.5;
      const normalSurplus = normalInflow - normalOutflow;
      let riskSurplus;
      if (age >= riskStartAge && age < riskStartAge + riskDuration) {
        const riskProgress = (age - riskStartAge) / (riskDuration - 1);
        riskSurplus = -40 + riskProgress * 15;
      } else if (age < riskStartAge) {
        riskSurplus = normalSurplus * 0.9;
      } else {
        const yearsAfterRisk = age - (riskStartAge + riskDuration);
        if (yearsAfterRisk <= 10) {
          const recoveryProgress = yearsAfterRisk / 10;
          riskSurplus = -25 + recoveryProgress * (normalSurplus * 0.6 + 25);
        } else {
          const stabilizationFactor = Math.min(0.7, 0.6 + (yearsAfterRisk - 10) / 100);
          riskSurplus = normalSurplus * stabilizationFactor;
        }
      }
      let prepaymentSurplus;
      const prepaymentImpactAmount = getTotalPrepaymentAmount();
      if (age === 28) {
        prepaymentSurplus = riskSurplus - prepaymentImpactAmount;
      } else if (age >= 29) {
        const improvementFactor = Math.min(0.3, (age - 28) * 0.02);
        const interestSavings = prepaymentImpactAmount * 0.045;
        prepaymentSurplus = riskSurplus + interestSavings + normalSurplus * improvementFactor;
      } else {
        prepaymentSurplus = riskSurplus;
      }
      let riskInflow, riskOutflow;
      if (age >= riskStartAge && age < riskStartAge + riskDuration) {
        riskInflow = normalInflow * 0.4;
        riskOutflow = riskInflow - riskSurplus;
      } else if (age < riskStartAge) {
        riskInflow = normalInflow * 0.95;
        riskOutflow = normalOutflow * 1.05;
      } else {
        riskInflow = normalInflow * 0.8;
        riskOutflow = riskInflow - riskSurplus;
      }
      const baseSalary = 30 + (age - 28) * 0.5;
      const baseBonus = 8 + (age - 28) * 0.2;
      const baseInvestment = 5 + (age - 28) * 0.1;
      const baseOther = 2;
      const salaryIncome = Math.round(baseSalary + Math.sin((age - 28) * 0.2) * 2);
      const bonusIncome = Math.round(baseBonus + Math.cos((age - 28) * 0.3) * 1);
      const investmentIncome = Math.round(baseInvestment + Math.sin((age - 28) * 0.4) * 0.5);
      const otherIncome = Math.round(baseOther);
      const mortgagePayment = age <= 58 ? 15 : 0;
      const carLoanPayment = age <= 33 ? 8 : 0;
      const livingExpenses = Math.round(12 + (age - 28) * 0.2);
      const educationExpenses = age >= 35 && age <= 55 ? 6 : 0;
      const insuranceFees = 3;
      const otherExpenses = Math.round(5 + (age - 28) * 0.1);
      data.push({
        age,
        normalInflow: Math.round(normalInflow),
        normalOutflow: Math.round(normalOutflow),
        normalSurplus: Math.round(normalSurplus * 10) / 10,
        riskInflow: Math.round(riskInflow),
        riskOutflow: Math.round(riskOutflow),
        riskSurplus: Math.round(riskSurplus * 10) / 10,
        prepaymentSurplus: Math.round(prepaymentSurplus * 10) / 10,
        salaryIncome,
        bonusIncome,
        investmentIncome,
        otherIncome,
        mortgagePayment,
        carLoanPayment,
        livingExpenses,
        educationExpenses,
        insuranceFees,
        otherExpenses
      });
    }
    return data;
  };
  const cashFlowData = generateCashFlowData();
  
  // 自动选择提前还款当年(28岁)的数据点
  useEffect(() => {
    if (cashFlowData.length > 0 && !selectedPoint) {
      const prepaymentYearData = cashFlowData.find(data => data.age === 28);
      if (prepaymentYearData) {
        setSelectedPoint(prepaymentYearData);
      }
    }
  }, [cashFlowData, selectedPoint]);
  
  const handlePointClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const pointData = data.activePayload[0].payload;
      setSelectedPoint(pointData);
    }
  };
  const CustomTooltip = ({
    active,
    payload,
    label
  }: any) => {
    if (active && payload && payload.length) {
      const age = label;
      const pointData = cashFlowData.find(data => data.age === age);
      
      if (!pointData) return null;
      
      const beforeSurplus = pointData.riskSurplus;
      const afterSurplus = pointData.prepaymentSurplus;
      
      const formatSurplusText = (value: number) => {
        return value >= 0 ? `盈余：${value}万元` : `缺口：${Math.abs(value)}万元`;
      };
      
      const getColorClass = (value: number) => {
        return value >= 0 ? 'text-blue-600' : 'text-red-600';
      };

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg min-w-[200px]">
          <p className="font-medium mb-2">{`年龄: ${label}岁`}</p>
          
          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium text-gray-700 mb-1">提前还款前：</p>
              <p className={`text-sm ${getColorClass(beforeSurplus)}`}>
                {formatSurplusText(beforeSurplus)}
              </p>
            </div>
            
            <div>
              <p className="text-xs font-medium text-gray-700 mb-1">提前还款后：</p>
              <p className={`text-sm ${getColorClass(afterSurplus)}`}>
                {formatSurplusText(afterSurplus)}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };
  console.log('Debug: About to render page, debtData length:', debtData.length);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-0 py-4 max-w-md">
        <div className="space-y-6">
          <div className="text-center mb-2">
            <h2 className="text-xl font-bold text-foreground">提前还款测算</h2>
          </div>

          {/* 债务选择汇总栏 - 移到最上方 */}
          <SelectedSummaryBar
            selectedCount={selectedLoanIds.length}
            totalCount={debtData.length}
            totalPrepaymentAmount={getTotalPrepaymentAmount()}
            totalHandlingFee={getTotalHandlingFee()}
            onSelectDebts={() => setIsDrawerOpen(true)}
            singleLoanData={(debtData.length === 1 || selectedLoanIds.length === 1) && selectedLoanIds.length > 0 ? (() => {
              const targetLoan = selectedLoanIds.length === 1 ? debtData.find(d => d.id === selectedLoanIds[0]) : debtData[0];
              if (!targetLoan) return undefined;
              return {
                id: targetLoan.id,
                type: targetLoan.type,
                category: targetLoan.category,
                remainingPrincipal: targetLoan.remainingPrincipal,
                prepaymentAmount: loanPrepaymentAmounts[targetLoan.id] || '',
                feeRate: loanFeeRates[targetLoan.id] || '',
                repaymentMethod: loanRepaymentMethods[targetLoan.id] || '期限不变，减少月供',
                onPrepaymentAmountChange: (value: string) => {
                  setLoanPrepaymentAmounts(prev => ({
                    ...prev,
                    [targetLoan.id]: value
                  }));
                },
                onFeeRateChange: (value: string) => {
                  setLoanFeeRates(prev => ({
                    ...prev,
                    [targetLoan.id]: value
                  }));
                },
                onRepaymentMethodChange: (value: string) => {
                  setLoanRepaymentMethods(prev => ({
                    ...prev,
                    [targetLoan.id]: value
                  }));
                }
              };
            })() : undefined}
          />

          {/* 测算结果区域 */}
          {debtData.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-500 mb-2">暂无债务信息</p>
              <p className="text-xs text-gray-400">请先到财务状态页面录入债务信息并点击"负债录入完毕，下一步"保存数据</p>
            </div>
          ) : selectedLoanIds.length > 0 && (
            <div className="bg-white rounded-xl pt-2 pb-4 px-0 mt-2">
              <div className="space-y-6">
                <div className="pt-0">
                  <h4 className="text-base font-bold text-cyan-700 mb-4 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    测算结果
                  </h4>

                  {/* 模块一：成本节省测算 */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 shadow-md border border-gray-200">
                    <h5 className="text-sm font-semibold text-gray-700 mb-3">成本节省测算</h5>
                    
                    {/* 当没有选中任何贷款时，显示总计 */}
                    {selectedLoanIds.length === 0 && (
                      <div className="text-center text-gray-500 py-4">
                        请选择房贷进行测算
                      </div>
                    )}

                    {/* 当只选中一笔贷款时，显示该贷款的详细数据 */}
                    {selectedLoanIds.length === 1 && (
                      <div className="space-y-4">
                        {selectedLoanIds.map(loanId => {
                          const debt = debtData.find(d => d.id === loanId);
                          if (!debt) return null;
                          
                          const costSaving = getLoanCostSaving(loanId);
                          const nextMonthlyPayment = getLoanNextMonthlyPayment(loanId);
                          const monthlyPaymentChange = getLoanMonthlyPaymentChange(loanId);
                          
                          return (
                            <div key={loanId} className="bg-white rounded-lg p-4 border border-gray-200">
                              <h6 className="text-sm font-medium text-gray-800 mb-3">{debt.type}</h6>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                  <span className="text-xs font-medium block mb-1 text-gray-600">节省成本</span>
                                  <div className="text-base font-bold" style={{
                                    color: '#01BCD6'
                                  }}>{costSaving > 0 ? `${(costSaving/10000).toFixed(1)}万元` : '--'}</div>
                                </div>
                                <div className="text-center">
                                  <span className="text-xs font-medium block mb-1 text-gray-600">下期月供</span>
                                  <div className="text-base font-bold" style={{
                                    color: '#01BCD6'
                                  }}>{nextMonthlyPayment > 0 ? `${Math.round(nextMonthlyPayment).toLocaleString()}元` : '--'}</div>
                                </div>
                                <div className="text-center">
                                  <span className="text-xs font-medium block mb-1 text-gray-600">下期月供变化</span>
                                  <div className="text-base font-bold" style={{
                                    color: monthlyPaymentChange >= 0 ? '#ef4444' : '#01BCD6'
                                  }}>{monthlyPaymentChange !== 0 ? `${monthlyPaymentChange >= 0 ? '+' : ''}${Math.round(monthlyPaymentChange).toLocaleString()}元` : '--'}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* 当选中多笔贷款时，显示汇总和分笔明细 */}
                    {selectedLoanIds.length > 1 && (
                      <div className="space-y-4">
                        {/* 汇总数据 */}
                        <div>
                          <h6 className="text-sm font-medium text-gray-800 mb-3">汇总数据</h6>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                              <span className="text-xs font-medium block mb-1 text-gray-600">节省总成本</span>
                              <div className="text-base font-bold" style={{
                                color: '#01BCD6'
                              }}>
                                {(() => {
                                  const totalSaving = selectedLoanIds.reduce((total, loanId) => total + getLoanCostSaving(loanId), 0);
                                  return totalSaving > 0 ? `${(totalSaving/10000).toFixed(1)}万元` : '--';
                                })()}
                              </div>
                            </div>
                            <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                              <span className="text-xs font-medium block mb-1 text-gray-600">下期月供</span>
                              <div className="text-base font-bold" style={{
                                color: '#01BCD6'
                              }}>
                                {(() => {
                                  const totalPayment = selectedLoanIds.reduce((total, loanId) => total + getLoanNextMonthlyPayment(loanId), 0);
                                  return totalPayment > 0 ? `${Math.round(totalPayment).toLocaleString()}元` : '--';
                                })()}
                              </div>
                            </div>
                            <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                              <span className="text-xs font-medium block mb-1 text-gray-600">下期月供变化</span>
                              <div className="text-base font-bold" style={{
                                color: (() => {
                                  const totalChange = selectedLoanIds.reduce((total, loanId) => total + getLoanMonthlyPaymentChange(loanId), 0);
                                  return totalChange >= 0 ? '#ef4444' : '#01BCD6';
                                })()
                              }}>
                                {(() => {
                                  const totalChange = selectedLoanIds.reduce((total, loanId) => total + getLoanMonthlyPaymentChange(loanId), 0);
                                  return totalChange !== 0 ? `${totalChange >= 0 ? '+' : ''}${Math.round(totalChange).toLocaleString()}元` : '--';
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 分笔明细 */}
                        <div>
                          <h6 className="text-sm font-medium text-gray-800 mb-3">各笔房贷明细</h6>
                          <div className="space-y-3">
                            {selectedLoanIds.map(loanId => {
                              const debt = debtData.find(d => d.id === loanId);
                              if (!debt) return null;
                              
                              const costSaving = getLoanCostSaving(loanId);
                              const nextMonthlyPayment = getLoanNextMonthlyPayment(loanId);
                              const monthlyPaymentChange = getLoanMonthlyPaymentChange(loanId);
                              
                              return (
                                <div key={loanId} className="bg-white rounded-lg p-3 border border-gray-200">
                                  <div className="text-xs font-medium text-gray-700 mb-2 block">{debt.type}</div>
                                  <div className="grid grid-cols-3 gap-3">
                                    <div className="text-center">
                                      <span className="text-xs font-medium block mb-1 text-gray-500">节省成本</span>
                                      <div className="text-sm font-bold" style={{
                                        color: '#01BCD6'
                                      }}>{costSaving > 0 ? `${(costSaving/10000).toFixed(1)}万元` : '--'}</div>
                                    </div>
                                    <div className="text-center">
                                      <span className="text-xs font-medium block mb-1 text-gray-500">下期月供</span>
                                      <div className="text-sm font-bold" style={{
                                        color: '#01BCD6'
                                      }}>{nextMonthlyPayment > 0 ? `${Math.round(nextMonthlyPayment).toLocaleString()}元` : '--'}</div>
                                    </div>
                                    <div className="text-center">
                                      {(() => {
                                        const repaymentMethod = loanRepaymentMethods[loanId] || '期限不变，减少月供';
                                        if (repaymentMethod === '月供不变，缩短期限') {
                                          const { years, months } = getLoanShortenedPeriod(loanId);
                                          return (
                                            <>
                                              <span className="text-xs font-medium block mb-1 text-gray-500">缩短后期限</span>
                                              <div className="text-sm font-bold" style={{ color: '#01BCD6' }}>
                                                {years > 0 || months > 0 ? `${years}年${months}月` : '--'}
                                              </div>
                                            </>
                                          );
                                        } else {
                                          return (
                                            <>
                                              <span className="text-xs font-medium block mb-1 text-gray-500">月供变化</span>
                                              <div className="text-sm font-bold" style={{
                                                color: monthlyPaymentChange >= 0 ? '#ef4444' : '#01BCD6'
                                              }}>{monthlyPaymentChange !== 0 ? `${monthlyPaymentChange >= 0 ? '+' : ''}${Math.round(monthlyPaymentChange).toLocaleString()}元` : '--'}</div>
                                            </>
                                          );
                                        }
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 模块二：现金流影响分析 */}
                  <div className="bg-gray-50 rounded-lg p-4 shadow-md border border-gray-200">
                     <h5 className="text-sm font-semibold text-gray-700 mb-3">对未来家庭现金流的影响</h5>
                     
                     {/* 提前还款变化统计 */}
                     {selectedLoanIds.length > 0 && getTotalPrepaymentAmount() > 0 && (
                       <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                         <h6 className="text-sm font-medium text-gray-800 mb-3">提前还款后的变化</h6>
                         <div className="grid grid-cols-2 gap-4">
                           <div className="text-center">
                             <div className="text-xs text-gray-500 mb-1">债务期内断供年份变化</div>
                             <div className="text-lg font-bold" style={{
                               color: (() => {
                                 const change = getDebtPeriodSupplyDisruptionChange();
                                 return change <= 0 ? '#01BCD6' : '#ef4444';
                               })()
                             }}>
                                {(() => {
                                  const change = getDebtPeriodSupplyDisruptionChange();
                                  if (change === 0) return '无变化';
                                  if (change < 0) return `少${Math.abs(change)}年`;
                                  return `多${change}年`;
                                })()}
                             </div>
                           </div>
                           <div className="text-center">
                             <div className="text-xs text-gray-500 mb-1">债务期后缺口年份变化</div>
                             <div className="text-lg font-bold" style={{
                               color: (() => {
                                 const change = getPostDebtGapChange();
                                 return change <= 0 ? '#01BCD6' : '#ef4444';
                               })()
                             }}>
                               {(() => {
                                 const change = getPostDebtGapChange();
                                 if (change === 0) return '无变化';
                                 return `${change > 0 ? '+' : ''}${change}年`;
                               })()}
                             </div>
                           </div>
                         </div>
                       </div>
                     )}
                     
                     <div className="space-y-4">
                      <div className="p-3 bg-white rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2 text-sm">家庭现金流分析</h4>
                         <div className="text-xs text-gray-600 space-y-1">
                           <p className="flex items-center">
                             <span className="inline-block w-4 h-0.5 bg-[#01BCD6] mr-2"></span>
                             提前还款后未来每年家庭现金流盈余/缺口
                           </p>
                           <p className="flex items-center">
                             <span className="inline-block w-4 h-0.5 bg-[#ef4444] mr-2"></span>
                             未来每年家庭现金流盈余/缺口
                           </p>
                           <p className="flex items-center">
                             <span className="inline-block w-4 h-2 bg-red-100 border border-red-300 mr-2"></span>
                             债务期（28岁-58岁）
                           </p>
                         </div>
                      </div>

                      <div className="h-64 pl-3">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={cashFlowData} margin={{
                        top: 10,
                        right: 0,
                        left: 0,
                        bottom: 10
                      }} onClick={handlePointClick}>
                            <defs>
                              <linearGradient id="normalSurplusGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#01BCD6" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#01BCD6" stopOpacity={0.05} />
                              </linearGradient>
                              <linearGradient id="riskSurplusGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                              </linearGradient>
                              <linearGradient id="prepaymentSurplusGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#01BCD6" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#01BCD6" stopOpacity={0.05} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="age" tick={{
                          fontSize: 10
                        }} ticks={[28, 33, 38, 43, 48, 53, 58, 63, 68, 73, 78, 83]} axisLine={{
                          stroke: '#e5e7eb',
                          strokeWidth: 1
                        }} tickLine={{
                          stroke: '#e5e7eb',
                          strokeWidth: 1
                        }} />
                            <YAxis tick={{
                          fontSize: 10,
                          textAnchor: 'end',
                          fill: '#000'
                        }} tickFormatter={v => `${v}`} domain={[-50, 50]} ticks={[-50, -25, 0, 25, 50]} axisLine={{
                          stroke: '#000',
                          strokeWidth: 1
                        }} tickLine={{
                          stroke: '#000',
                          strokeWidth: 1
                        }} width={26} />
                            <Tooltip content={<CustomTooltip />} />
                            <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="2 2" />
                            <ReferenceArea x1={28} x2={58} fill="rgba(239, 68, 68, 0.1)" stroke="none" />
                            <ReferenceDot x={50} y={cashFlowData.find(d => d.age === 50)?.riskSurplus || 0} r={8} fill="#f59e0b" stroke="#fff" strokeWidth={2} onClick={() => setShowHousePlan(true)} style={{
                          cursor: 'pointer'
                        }} />
                            <Area type="monotone" dataKey="riskSurplus" stroke="#ef4444" strokeWidth={2} fill="url(#riskSurplusGradient)" fillOpacity={0.6} dot={false} activeDot={{
                          r: 5,
                          stroke: '#ef4444',
                          strokeWidth: 2,
                          fill: '#ffffff'
                        }} />
                            {getTotalPrepaymentAmount() > 0 && <Area type="monotone" dataKey="prepaymentSurplus" stroke="#01BCD6" strokeWidth={2} fill="url(#prepaymentSurplusGradient)" fillOpacity={0.4} dot={false} activeDot={{
                          r: 5,
                          stroke: '#01BCD6',
                          strokeWidth: 2,
                          fill: '#ffffff'
                        }} />}
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {/* 详细数据展示 */}
                      {selectedPoint && (
                        <Collapsible open={isDetailExpanded} onOpenChange={setIsDetailExpanded}>
                          <div className="p-3 rounded-lg border" style={{ backgroundColor: 'rgba(202, 244, 247, 0.3)', borderColor: '#CAF4F7' }}>
                            <CollapsibleTrigger className="w-full">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-800 text-sm">{selectedPoint.age}岁详细数据</h4>
                                <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${isDetailExpanded ? 'rotate-180' : ''}`} />
                              </div>
                            </CollapsibleTrigger>
                            
                            <CollapsibleContent>
                              <div className="mt-3 space-y-4">
                                {/* 提前还款前数据 */}
                                <div className="p-3 rounded-lg border bg-white" style={{ borderColor: '#CAF4F7' }}>
                                  <h5 className="text-sm font-medium text-gray-800 mb-3">提前还款前</h5>
                                  
                                  {/* 现金流汇总 */}
                                  <div className="grid grid-cols-3 gap-4 pb-3 border-b mb-3" style={{ borderColor: '#CAF4F7' }}>
                                    <div className="text-center">
                                      <div className="text-lg font-bold mb-1 text-gray-800">
                                        {selectedPoint.riskInflow}万元
                                      </div>
                                      <p className="text-xs text-muted-foreground">现金流入</p>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-lg font-bold text-gray-800 mb-1">
                                        {selectedPoint.riskOutflow}万元
                                      </div>
                                      <p className="text-xs text-muted-foreground">现金流出</p>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-lg font-bold mb-1 text-gray-800">
                                        {selectedPoint.riskSurplus >= 0 ? selectedPoint.riskSurplus : Math.abs(selectedPoint.riskSurplus)}万元
                                      </div>
                                      <p className="text-xs text-muted-foreground">{selectedPoint.riskSurplus >= 0 ? '现金盈余' : '现金缺口'}</p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    {/* 现金流入明细 */}
                                    <div>
                                      <h6 className="font-medium text-sm mb-2 text-gray-800">现金流入明细</h6>
                                      <div className="space-y-1 text-xs">
                                        <div className="flex justify-between">
                                          <span>• 工资收入：</span>
                                          <span className="font-medium">{selectedPoint.salaryIncome}万元</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>• 奖金收入：</span>
                                          <span className="font-medium">{selectedPoint.bonusIncome}万元</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>• 投资收入：</span>
                                          <span className="font-medium">{selectedPoint.investmentIncome}万元</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>• 其他收入：</span>
                                          <span className="font-medium">{selectedPoint.otherIncome}万元</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* 现金流出明细 */}
                                    <div>
                                      <h6 className="font-medium text-gray-800 text-sm mb-2">现金流出明细</h6>
                                      <div className="space-y-1 text-xs">
                                        <div className="flex justify-between">
                                          <span>• 房贷还款：</span>
                                          <span className="font-medium">{selectedPoint.mortgagePayment}万元</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>• 车贷还款：</span>
                                          <span className="font-medium">{selectedPoint.carLoanPayment}万元</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>• 生活支出：</span>
                                          <span className="font-medium">{selectedPoint.livingExpenses}万元</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>• 教育支出：</span>
                                          <span className="font-medium">{selectedPoint.educationExpenses}万元</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>• 保险费用：</span>
                                          <span className="font-medium">{selectedPoint.insuranceFees}万元</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>• 其他支出：</span>
                                          <span className="font-medium">{selectedPoint.otherExpenses}万元</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* 提前还款后数据 */}
                                <div className="p-3 rounded-lg border bg-white" style={{ borderColor: '#CAF4F7' }}>
                                  <h5 className="text-sm font-medium text-gray-800 mb-3">提前还款后</h5>
                                  
                                  {/* 现金流汇总 */}
                                  <div className="grid grid-cols-3 gap-4 pb-3 border-b mb-3" style={{ borderColor: '#CAF4F7' }}>
                                    <div className="text-center">
                                      <div className="text-lg font-bold mb-1 text-gray-800">
                                        {selectedPoint.riskInflow}万元
                                      </div>
                                      <p className="text-xs text-muted-foreground">现金流入</p>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-lg font-bold text-gray-800 mb-1">
                                        {(selectedPoint.riskOutflow - (selectedPoint.prepaymentSurplus - selectedPoint.riskSurplus)).toFixed(1)}万元
                                      </div>
                                      <p className="text-xs text-muted-foreground">现金流出</p>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-lg font-bold mb-1 text-gray-800">
                                        {selectedPoint.prepaymentSurplus >= 0 ? selectedPoint.prepaymentSurplus : Math.abs(selectedPoint.prepaymentSurplus)}万元
                                      </div>
                                      <p className="text-xs text-muted-foreground">{selectedPoint.prepaymentSurplus >= 0 ? '现金盈余' : '现金缺口'}</p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    {/* 现金流入明细 */}
                                    <div>
                                      <h6 className="font-medium text-sm mb-2 text-gray-800">现金流入明细</h6>
                                      <div className="space-y-1 text-xs">
                                        <div className="flex justify-between">
                                          <span>• 工资收入：</span>
                                          <span className="font-medium">{selectedPoint.salaryIncome}万元</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>• 奖金收入：</span>
                                          <span className="font-medium">{selectedPoint.bonusIncome}万元</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>• 投资收入：</span>
                                          <span className="font-medium">{selectedPoint.investmentIncome}万元</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>• 其他收入：</span>
                                          <span className="font-medium">{selectedPoint.otherIncome}万元</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* 现金流出明细 - 调整房贷还款 */}
                                    <div>
                                      <h6 className="font-medium text-gray-800 text-sm mb-2">现金流出明细</h6>
                                      <div className="space-y-1 text-xs">
                                        <div className="flex justify-between">
                                          <span>• 房贷还款：</span>
                                          <span className="font-medium">{Math.max(0, selectedPoint.mortgagePayment - (selectedPoint.prepaymentSurplus - selectedPoint.riskSurplus) * 0.6).toFixed(1)}万元</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>• 车贷还款：</span>
                                          <span className="font-medium">{selectedPoint.carLoanPayment}万元</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>• 生活支出：</span>
                                          <span className="font-medium">{selectedPoint.livingExpenses}万元</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>• 教育支出：</span>
                                          <span className="font-medium">{selectedPoint.educationExpenses}万元</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>• 保险费用：</span>
                                          <span className="font-medium">{selectedPoint.insuranceFees}万元</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>• 其他支出：</span>
                                          <span className="font-medium">{selectedPoint.otherExpenses}万元</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* 变化情况 */}
                                <div className="p-3 rounded-lg border bg-white" style={{ borderColor: '#CAF4F7' }}>
                                  <h5 className="text-sm font-medium text-gray-800 mb-2">变化情况</h5>
                                  <div className="text-xs space-y-1">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">现金流变化：</span>
                                      <span className="font-medium text-gray-800">
                                        {(selectedPoint.prepaymentSurplus - selectedPoint.riskSurplus) >= 0 ? '+' : ''}{(selectedPoint.prepaymentSurplus - selectedPoint.riskSurplus).toFixed(1)}万元
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">月供变化：</span>
                                      <span className="font-medium text-gray-800">
                                        {(() => {
                                          const change = ((selectedPoint.prepaymentSurplus - selectedPoint.riskSurplus) * 0.6 / 12);
                                          return `${change >= 0 ? '+' : ''}${change.toFixed(2)}万元/月`;
                                        })()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
                      )}

                      <Dialog open={showHousePlan} onOpenChange={setShowHousePlan}>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2"><Home className="w-5 h-5 text-orange-600" /><span>50岁购房计划</span></DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="p-4 bg-orange-50 rounded-lg">
                              <div className="space-y-3">
                                <div className="flex justify-between"><span className="text-sm text-gray-600">预计房价：</span><span className="font-medium text-orange-800">450万元</span></div>
                                <div className="flex justify-between"><span className="text-sm text-gray-600">贷款金额：</span><span className="font-medium text-orange-800">315万元</span></div>
                                <div className="flex justify-between"><span className="text-sm text-gray-600">贷款期限：</span><span className="font-medium text-orange-800">20年</span></div>
                                <div className="flex justify-between"><span className="text-sm text-gray-600">预计月供：</span><span className="font-medium text-orange-800">约2.1万元</span></div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 text-center">💡 基于当前收入水平和现金流状况制定的融资方案</div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* 贷款选择抽屉 */}
          <LoanSelectorDrawer
            isOpen={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            debtData={debtData}
            selectedLoanIds={selectedLoanIds}
            setSelectedLoanIds={setSelectedLoanIds}
            loanPrepaymentAmounts={loanPrepaymentAmounts}
            setLoanPrepaymentAmounts={setLoanPrepaymentAmounts}
            loanFeeRates={loanFeeRates}
            setLoanFeeRates={setLoanFeeRates}
            loanRepaymentMethods={loanRepaymentMethods}
            setLoanRepaymentMethods={setLoanRepaymentMethods}
            getTotalPrepaymentAmount={getTotalPrepaymentAmount}
            getTotalHandlingFee={getTotalHandlingFee}
          />
        </div>
      </div>
    </div>
  );
};
export default TiqianHuankuan2Page;
