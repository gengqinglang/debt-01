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
  const flattened: FlattenedLoan[] = [];
  
  debts.forEach((debt) => {
    // 处理房贷
    if (debt.type === 'mortgage' && (debt as any).loans?.length) {
      (debt as any).loans.forEach((loan: any) => {
        const id = `mortgage-${loan.id}`;
        const name = loan.propertyName || '房产';
        
        // 计算剩余本金 (万元) - 数据已是万元单位，无需除10000
        let amount = 0;
        if (loan.loanType === 'combined') {
          const commercial = parseFloat(loan.commercialAmount || '0');
          const provident = parseFloat(loan.providentAmount || '0');
          const commercialRemaining = parseFloat(loan.commercialRemainingPrincipal || '0');
          const providentRemaining = parseFloat(loan.providentRemainingPrincipal || '0');
          amount = (commercialRemaining || commercial) + (providentRemaining || provident);
        } else {
          const principal = parseFloat(loan.loanAmount || '0');
          const remaining = parseFloat(loan.remainingPrincipal || '0');
          amount = remaining || principal;
        }
        
        // 计算利率 - 优先使用fixedRate
        let interestRate = 0;
        if (loan.loanType === 'combined') {
          const commercialRate = parseFloat(loan.commercialFixedRate || loan.commercialFloatingRate || '0');
          const providentRate = parseFloat(loan.providentRate || '0');
          const commercialAmount = parseFloat(loan.commercialAmount || '0');
          const providentAmount = parseFloat(loan.providentAmount || '0');
          const totalAmount = commercialAmount + providentAmount;
          if (totalAmount > 0) {
            interestRate = (commercialRate * commercialAmount + providentRate * providentAmount) / totalAmount;
          }
        } else {
          interestRate = parseFloat(loan.fixedRate || loan.floatingRate || '0');
        }
        
        // 计算剩余期限 (月) - 优先使用最晚的loanEndDate
        let remainingMonths = 0;
        let endDateToUse = '';
        if (loan.loanType === 'combined') {
          const commercialEnd = loan.commercialLoanEndDate;
          const providentEnd = loan.providentLoanEndDate;
          if (commercialEnd && providentEnd) {
            endDateToUse = new Date(commercialEnd) > new Date(providentEnd) ? commercialEnd : providentEnd;
          } else {
            endDateToUse = commercialEnd || providentEnd || '';
          }
        } else {
          endDateToUse = loan.loanEndDate || '';
        }
        
        if (endDateToUse) {
          const now = new Date();
          const end = new Date(endDateToUse);
          remainingMonths = Math.max(0, Math.round((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)));
        }
        
        flattened.push({
          id,
          type: 'mortgage',
          name,
          amount,
          interestRate,
          remainingMonths
        });
      });
    }
    
    // 处理车贷
    if (debt.type === 'carLoan' && (debt as any).carLoans?.length) {
      (debt as any).carLoans.forEach((carLoan: any) => {
        const id = `carLoan-${carLoan.id}`;
        const name = carLoan.carName || '车辆';
        
        let amount = 0;
        let interestRate = 0;
        let remainingMonths = 0;
        
        if (carLoan.loanType === 'bank') {
          // 银行车贷 - 数据已是万元单位，无需除10000
          amount = parseFloat(carLoan.remainingPrincipal || carLoan.loanAmount || '0');
          interestRate = parseFloat(carLoan.interestRate || carLoan.annualRate || '0');
          
          if (carLoan.loanEndDate) {
            const now = new Date();
            const end = new Date(carLoan.loanEndDate);
            remainingMonths = Math.max(0, Math.round((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)));
          }
        } else {
          // 分期车贷 - 月供是元，需要转换
          const installment = parseFloat(carLoan.installmentAmount || '0');
          const term = parseInt(carLoan.installmentTerm || '0');
          amount = (installment * term) / 10000;
          interestRate = 0; // 分期通常不显示年化利率
          remainingMonths = term;
        }
        
        flattened.push({
          id,
          type: 'carLoan',
          name,
          amount,
          interestRate,
          remainingMonths
        });
      });
    }
    
    // 处理消费贷
    if (debt.type === 'consumerLoan' && (debt as any).consumerLoans?.length) {
      (debt as any).consumerLoans.forEach((consumerLoan: any) => {
        const id = `consumerLoan-${consumerLoan.id}`;
        const name = consumerLoan.loanName || '消费贷';
        const amount = parseFloat(consumerLoan.loanAmount || '0'); // 数据已是万元单位
        const interestRate = parseFloat(consumerLoan.annualRate || '0');
        
        let remainingMonths = 0;
        if (consumerLoan.loanEndDate) {
          const now = new Date();
          const end = new Date(consumerLoan.loanEndDate);
          remainingMonths = Math.max(0, Math.round((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)));
        }
        
        flattened.push({
          id,
          type: 'consumerLoan',
          name,
          amount,
          interestRate,
          remainingMonths
        });
      });
    }
    
    // 处理经营贷
    if (debt.type === 'businessLoan' && (debt as any).businessLoans?.length) {
      (debt as any).businessLoans.forEach((businessLoan: any) => {
        const id = `businessLoan-${businessLoan.id}`;
        const name = businessLoan.loanName || '经营贷';
        const amount = parseFloat(businessLoan.loanAmount || '0'); // 数据已是万元单位
        const interestRate = parseFloat(businessLoan.annualRate || '0');
        
        let remainingMonths = 0;
        if (businessLoan.loanStartDate && businessLoan.loanTerm) {
          const start = new Date(businessLoan.loanStartDate);
          const termMonths = parseInt(businessLoan.loanTerm);
          const end = new Date(start);
          end.setMonth(end.getMonth() + termMonths);
          const now = new Date();
          remainingMonths = Math.max(0, Math.round((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)));
        }
        
        flattened.push({
          id,
          type: 'businessLoan',
          name,
          amount,
          interestRate,
          remainingMonths
        });
      });
    }
    
    // 处理民间借贷
    if (debt.type === 'privateLoan' && (debt as any).privateLoans?.length) {
      (debt as any).privateLoans.forEach((privateLoan: any) => {
        const id = `privateLoan-${privateLoan.id}`;
        const name = privateLoan.loanName || '民间借贷';
        const amount = parseFloat(privateLoan.loanAmount || '0'); // 数据已是万元单位
        const interestRate = parseFloat(privateLoan.annualRate || '0');
        
        let remainingMonths = 0;
        if (privateLoan.loanEndDate) {
          const now = new Date();
          const end = new Date(privateLoan.loanEndDate);
          remainingMonths = Math.max(0, Math.round((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)));
        }
        
        flattened.push({
          id,
          type: 'privateLoan',
          name,
          amount,
          interestRate,
          remainingMonths
        });
      });
    }
  });
  
  return flattened;
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
                        {debt.amount >= 10 
                          ? `${Math.round(debt.amount).toLocaleString()}万`
                          : `${debt.amount.toFixed(1)}万`
                        }
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