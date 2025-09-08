import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Car, CreditCard, Wallet, Briefcase, Handshake, ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import type { DebtInfo } from '@/pages/FinancialStatusPage';

interface LoanOverviewListProps {
  debts: DebtInfo[];
}

// 债务类型配置
const debtConfig: Record<string, { name: string; icon: React.ComponentType<any> }> = {
  mortgage: { name: '房贷', icon: Home },
  carLoan: { name: '车贷', icon: Car },
  consumerLoan: { name: '消费贷', icon: CreditCard },
  businessLoan: { name: '经营贷', icon: Briefcase },
  privateLoan: { name: '民间贷', icon: Handshake },
  creditCard: { name: '信用卡', icon: Wallet }
};

// 标准化利率 - 转换为百分数显示
const normalizeRate = (rate: number | undefined): number => {
  if (!rate) return 0;
  // 如果利率小于1，认为是小数形式（如0.045），转换为百分数
  return rate < 1 ? rate * 100 : rate;
};

// 格式化剩余期限为"X年X月"格式
const formatRemainingTerm = (months: number | undefined): string => {
  if (!months || months <= 0) return '已结清';
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) return `${remainingMonths}月`;
  if (remainingMonths === 0) return `${years}年`;
  return `${years}年${remainingMonths}月`;
};

interface FlattenedLoan {
  id: string;
  type: string;
  name: string;
  amount: number; // 万元
  interestRate: number; // 年化利率
  remainingMonths: number; // 剩余月数
}

type SortType = 'principal-desc' | 'interest-desc' | 'term-desc';

// 展平债务数据，将各类型的贷款数组展开为单个贷款条目
const flattenDebts = (debts: DebtInfo[]): FlattenedLoan[] => {
  const flattenedLoans: FlattenedLoan[] = [];

  debts.forEach(debt => {
    // 房贷 - 从 loans 数组提取
    if (debt.type === 'mortgage' && (debt as any).loans) {
      (debt as any).loans.forEach((loan: any, index: number) => {
        const remainingPrincipal = parseFloat(loan.remainingPrincipal || '0') / 10000;
        if (remainingPrincipal > 0) {
          // 计算剩余期限
          let remainingMonths = 0;
          if (loan.commercialEndDate && loan.providentEndDate) {
            const commercialEnd = new Date(loan.commercialEndDate + '-01');
            const providentEnd = new Date(loan.providentEndDate + '-01');
            const laterEnd = commercialEnd > providentEnd ? commercialEnd : providentEnd;
            remainingMonths = Math.max(0, (laterEnd.getFullYear() - new Date().getFullYear()) * 12 + laterEnd.getMonth() - new Date().getMonth());
          } else if (loan.commercialEndDate) {
            const endDate = new Date(loan.commercialEndDate + '-01');
            remainingMonths = Math.max(0, (endDate.getFullYear() - new Date().getFullYear()) * 12 + endDate.getMonth() - new Date().getMonth());
          }

          // 计算加权平均利率
          let avgRate = 0;
          const commercialAmount = parseFloat(loan.commercialLoanAmount || '0');
          const providentAmount = parseFloat(loan.providentLoanAmount || '0');
          const totalAmount = commercialAmount + providentAmount;
          
          if (totalAmount > 0) {
            const commercialRate = parseFloat(loan.commercialFixedRate || loan.commercialFloatingRateBase || '0');
            const providentRate = parseFloat(loan.providentRate || '0');
            avgRate = (commercialAmount * commercialRate + providentAmount * providentRate) / totalAmount;
          }

          flattenedLoans.push({
            id: `${debt.id}-loan-${index}`,
            type: 'mortgage',
            name: loan.propertyName || `房贷${index + 1}`,
            amount: remainingPrincipal,
            interestRate: avgRate,
            remainingMonths
          });
        }
      });
    }

    // 车贷 - 从 carLoans 数组提取
    if (debt.type === 'carLoan' && (debt as any).carLoans) {
      (debt as any).carLoans.forEach((carLoan: any, index: number) => {
        let amount = 0;
        let rate = 0;
        let months = 0;

        if (carLoan.loanType === 'bankLoan') {
          amount = parseFloat(carLoan.remainingPrincipal || '0') / 10000;
          rate = parseFloat(carLoan.annualRate || '0');
          if (carLoan.startDateMonth && carLoan.endDateMonth) {
            const startDate = new Date(carLoan.startDateMonth + '-01');
            const endDate = new Date(carLoan.endDateMonth + '-01');
            months = Math.max(0, (endDate.getFullYear() - new Date().getFullYear()) * 12 + endDate.getMonth() - new Date().getMonth());
          }
        } else {
          amount = parseFloat(carLoan.installmentAmount || '0') * parseFloat(carLoan.remainingInstallments || '0') / 10000;
          months = parseFloat(carLoan.remainingInstallments || '0');
        }

        if (amount > 0) {
          flattenedLoans.push({
            id: `${debt.id}-car-${index}`,
            type: 'carLoan',
            name: carLoan.vehicleName || `车贷${index + 1}`,
            amount,
            interestRate: rate,
            remainingMonths: months
          });
        }
      });
    }

    // 消费贷 - 从 consumerLoans 数组提取
    if (debt.type === 'consumerLoan' && (debt as any).consumerLoans) {
      (debt as any).consumerLoans.forEach((loan: any, index: number) => {
        const amount = parseFloat(loan.remainingPrincipal || loan.loanAmount || '0') / 10000;
        if (amount > 0) {
          let months = 0;
          if (loan.startDate && loan.endDate) {
            const startDate = new Date(loan.startDate);
            const endDate = new Date(loan.endDate);
            months = Math.max(0, Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)));
          }

          flattenedLoans.push({
            id: `${debt.id}-consumer-${index}`,
            type: 'consumerLoan',
            name: loan.name || `消费贷${index + 1}`,
            amount,
            interestRate: parseFloat(loan.annualRate || '0'),
            remainingMonths: months
          });
        }
      });
    }

    // 经营贷 - 从 businessLoans 数组提取
    if (debt.type === 'businessLoan' && (debt as any).businessLoans) {
      (debt as any).businessLoans.forEach((loan: any, index: number) => {
        const amount = parseFloat(loan.remainingPrincipal || loan.loanAmount || '0') / 10000;
        if (amount > 0) {
          let months = 0;
          if (loan.startDate && loan.endDate) {
            const startDate = new Date(loan.startDate);
            const endDate = new Date(loan.endDate);
            months = Math.max(0, Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)));
          }

          flattenedLoans.push({
            id: `${debt.id}-business-${index}`,
            type: 'businessLoan',
            name: loan.name || `经营贷${index + 1}`,
            amount,
            interestRate: parseFloat(loan.annualRate || '0'),
            remainingMonths: months
          });
        }
      });
    }

    // 民间贷 - 从 privateLoans 数组提取
    if (debt.type === 'privateLoan' && (debt as any).privateLoans) {
      (debt as any).privateLoans.forEach((loan: any, index: number) => {
        const amount = parseFloat(loan.loanAmount || '0') / 10000;
        if (amount > 0) {
          let months = 0;
          if (loan.startDate && loan.endDate) {
            const startDate = new Date(loan.startDate);
            const endDate = new Date(loan.endDate);
            months = Math.max(0, Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)));
          }

          flattenedLoans.push({
            id: `${debt.id}-private-${index}`,
            type: 'privateLoan',
            name: loan.name || `民间贷${index + 1}`,
            amount,
            interestRate: parseFloat(loan.annualRate || '0'),
            remainingMonths: months
          });
        }
      });
    }
  });

  return flattenedLoans;
};

const LoanOverviewList: React.FC<LoanOverviewListProps> = ({ debts }) => {
  const [sortType, setSortType] = useState<SortType>('principal-desc');

  // 展平并排序债务数据
  const validDebts = flattenDebts(debts)
    .sort((a, b) => {
      if (sortType === 'interest-desc') {
        return b.interestRate - a.interestRate;
      } else if (sortType === 'term-desc') {
        return b.remainingMonths - a.remainingMonths;
      } else {
        return b.amount - a.amount;
      }
    });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <ArrowUpDown className="w-5 h-5 text-[#01BCD6] mr-2" />
            每笔债务概览
          </CardTitle>
          
          {/* 排序切换 */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={sortType === 'principal-desc' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortType('principal-desc')}
              className={`text-xs px-2 py-1 ${
                sortType === 'principal-desc' 
                  ? 'bg-[#B3EBEF] text-gray-900 hover:bg-[#A0E2E6]' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              本金
            </Button>
            <Button
              variant={sortType === 'interest-desc' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortType('interest-desc')}
              className={`text-xs px-2 py-1 ${
                sortType === 'interest-desc' 
                  ? 'bg-[#B3EBEF] text-gray-900 hover:bg-[#A0E2E6]' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              利率
            </Button>
            <Button
              variant={sortType === 'term-desc' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortType('term-desc')}
              className={`text-xs px-2 py-1 ${
                sortType === 'term-desc' 
                  ? 'bg-[#B3EBEF] text-gray-900 hover:bg-[#A0E2E6]' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              期限
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {validDebts.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {validDebts.map((debt, index) => {
              const config = debtConfig[debt.type];
              const IconComponent = config?.icon || Wallet;
              
              return (
                <div 
                  key={debt.id || index} 
                  className="px-4 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B3EBEF]/30 to-[#8FD8DC]/30 flex items-center justify-center mr-3">
                        <IconComponent className="w-5 h-5 text-[#01BCD6]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">
                          {debt.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {config?.name} • 剩余期限 {formatRemainingTerm(debt.remainingMonths)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 mb-1">
                        {Math.round(debt.amount).toLocaleString()}万
                      </div>
                      <div className="text-sm text-[#01BCD6] font-medium">
                        年化 {debt.interestRate > 0 ? debt.interestRate.toFixed(2) + '%' : '-'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-4 py-8 text-center text-gray-500">
            暂无债务信息
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoanOverviewList;