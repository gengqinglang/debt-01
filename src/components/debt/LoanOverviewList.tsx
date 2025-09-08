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

// LPR基准利率 (当前3.5%)
const LPR_BASE_RATE = 3.5;

// 精确计算两个日期之间的月数差
const calculateMonthsDifference = (startDate: Date, endDate: Date): number => {
  const yearDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthDiff = endDate.getMonth() - startDate.getMonth();
  const dayDiff = endDate.getDate() - startDate.getDate();
  
  let totalMonths = yearDiff * 12 + monthDiff;
  
  // 如果结束日期的天数小于开始日期，说明还没到完整月份
  if (dayDiff < 0) {
    totalMonths -= 1;
  }
  
  return Math.max(0, totalMonths);
};

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
          const commercial = parseFloat(loan.commercialLoanAmount || '0');
          const provident = parseFloat(loan.providentLoanAmount || '0');
          const commercialRemaining = parseFloat(loan.commercialRemainingPrincipal || '0');
          const providentRemaining = parseFloat(loan.providentRemainingPrincipal || '0');
          amount = (commercialRemaining || commercial) + (providentRemaining || provident);
        } else {
          const principal = parseFloat(loan.loanAmount || '0');
          const remaining = parseFloat(loan.remainingPrincipal || '0');
          amount = remaining || principal;
        }
        
        // 计算利率 - 修正字段名称和浮动利率计算
        let interestRate = 0;
        if (loan.loanType === 'combination') {
          // 组合贷：计算加权平均利率
          const commercialRemainingPrincipal = parseFloat(loan.commercialRemainingPrincipal || '0');
          const providentRemainingPrincipal = parseFloat(loan.providentRemainingPrincipal || '0');
          const commercialAmount = parseFloat(loan.commercialLoanAmount || '0');
          const providentAmount = parseFloat(loan.providentLoanAmount || '0');
          
          // 优先使用剩余本金作为权重，否则使用原始贷款金额
          const commercialWeight = commercialRemainingPrincipal || commercialAmount;
          const providentWeight = providentRemainingPrincipal || providentAmount;
          const totalWeight = commercialWeight + providentWeight;
          
          if (totalWeight > 0) {
            // 获取商贷利率
            let commercialRate = 0;
            if (loan.commercialRateType === 'fixed') {
              commercialRate = parseFloat(loan.commercialFixedRate || '0');
            } else if (loan.commercialRateType === 'floating') {
              // 浮动利率 = LPR基准利率 + 调整值(BP转换为百分点)
              const adjustment = parseFloat(loan.commercialFloatingRateAdjustment || '0');
              commercialRate = LPR_BASE_RATE + (adjustment / 100);
            }
            
            // 获取公积金利率
            const providentRate = parseFloat(loan.providentRate || '0');
            
            // 计算加权平均
            interestRate = (commercialRate * commercialWeight + providentRate * providentWeight) / totalWeight;
          }
        } else {
          // 单一贷款：根据利率类型获取
          if (loan.rateType === 'fixed') {
            interestRate = parseFloat(loan.fixedRate || '0');
          } else if (loan.rateType === 'floating') {
            // 浮动利率 = LPR基准利率 + 调整值(BP转换为百分点)
            const adjustment = parseFloat(loan.floatingRateAdjustment || '0');
            interestRate = LPR_BASE_RATE + (adjustment / 100);
          }
        }
        
        // 计算剩余期限 (月) - 修正字段名称
        let remainingMonths = 0;
        let endDateToUse = '';
        if (loan.loanType === 'combined') {
          const commercialEnd = loan.commercialEndDate;
          const providentEnd = loan.providentEndDate;
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
          remainingMonths = calculateMonthsDifference(now, end);
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
        const name = carLoan.vehicleName || carLoan.carName || '车辆';
        
        let amount = 0;
        let interestRate = 0;
        let remainingMonths = 0;
        
        if (carLoan.loanType === 'bankLoan') {
          // 银行车贷 - 使用principal字段，数据已是万元单位
          amount = parseFloat(carLoan.remainingPrincipal || carLoan.principal || '0');
          // 银行车贷显示利率
          interestRate = parseFloat(carLoan.interestRate || '0');
          
          // 使用endDateMonth计算剩余期限
          if (carLoan.endDateMonth) {
            const now = new Date();
            let endDate = new Date(carLoan.endDateMonth);
            // 如果是YYYY-MM格式，补充日期部分
            if (carLoan.endDateMonth.length === 7) {
              endDate = new Date(carLoan.endDateMonth + '-01');
              endDate.setMonth(endDate.getMonth() + 1, 0); // 设置为该月最后一天
            }
            remainingMonths = calculateMonthsDifference(now, endDate);
          }
        } else if (carLoan.loanType === 'installment') {
          // 分期车贷 - 月供是元，需要转换为万元
          const installment = parseFloat(carLoan.installmentAmount || '0');
          const term = parseInt(carLoan.remainingInstallments || '0');
          amount = (installment * term) / 10000;
          interestRate = -1; // 分期不显示利率，用-1标记
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
        const name = consumerLoan.name || consumerLoan.loanName || '消费贷';
        const amount = parseFloat(consumerLoan.loanAmount || '0'); // 数据已是万元单位
        const interestRate = parseFloat(consumerLoan.annualRate || '0');
        
        let remainingMonths = 0;
        if (consumerLoan.loanEndDate) {
          const now = new Date();
          const end = new Date(consumerLoan.loanEndDate);
          remainingMonths = calculateMonthsDifference(now, end);
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
        const name = businessLoan.name || businessLoan.loanName || '经营贷';
        const amount = parseFloat(businessLoan.loanAmount || '0'); // 数据已是万元单位
        const interestRate = parseFloat(businessLoan.annualRate || '0');
        
        let remainingMonths = 0;
        if (businessLoan.loanStartDate && businessLoan.loanTerm) {
          const start = new Date(businessLoan.loanStartDate);
          const termMonths = parseInt(businessLoan.loanTerm);
          const end = new Date(start);
          end.setMonth(end.getMonth() + termMonths);
          const now = new Date();
          remainingMonths = calculateMonthsDifference(now, end);
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
        const name = privateLoan.name || privateLoan.loanName || '民间借贷';
        const amount = parseFloat(privateLoan.loanAmount || '0'); // 数据已是万元单位
        const interestRate = parseFloat(privateLoan.annualRate || '0');
        
        let remainingMonths = 0;
        if (privateLoan.loanEndDate) {
          const now = new Date();
          const end = new Date(privateLoan.loanEndDate);
          remainingMonths = calculateMonthsDifference(now, end);
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
                        年化 {debt.interestRate === -1 ? '-' : (debt.interestRate > 0 ? debt.interestRate.toFixed(2) + '%' : '-')}
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