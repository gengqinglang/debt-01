// Unified debt data types and interfaces

export interface DebtAggregate {
  count: number;
  amountWan: number; // 债务金额(万元)
  monthlyPaymentYuan: number; // 月供(元)
  remainingMonths: number; // 剩余月数
}

export interface DebtItem {
  id: string;
  name?: string;
  amountWan: number;
  monthlyPaymentYuan?: number;
  remainingMonths?: number;
  [key: string]: any; // 允许其他特定字段
}

export interface NormalizedDebtData {
  aggregate: DebtAggregate;
  items: DebtItem[];
  rawData?: any; // 保留原始数据结构用于回显
}

export interface ConfirmPayload {
  type: string;
  name: string;
  amount: number; // 债务总额(万元)
  monthlyPayment: number; // 月供(元)
  remainingMonths?: number; // 剩余月数
  interestRate?: number; // 利率
  normalized: DebtAggregate;
  rawData?: any;
}

// 债务类型定义
export type DebtType = 'mortgage' | 'carLoan' | 'consumerLoan' | 'businessLoan' | 'privateLoan' | 'creditCard';

export interface DebtCategory {
  id: string;
  name: string;
  type: DebtType;
}