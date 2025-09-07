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

type SortType = 'interest-desc' | 'principal-desc';

const LoanOverviewList: React.FC<LoanOverviewListProps> = ({ debts }) => {
  const [sortType, setSortType] = useState<SortType>('interest-desc');

  // 过滤有效债务并排序
  const validDebts = debts
    .filter(debt => (debt.amount || 0) > 0)
    .map(debt => ({
      ...debt,
      normalizedRate: normalizeRate(debt.interestRate)
    }))
    .sort((a, b) => {
      if (sortType === 'interest-desc') {
        return b.normalizedRate - a.normalizedRate;
      } else {
        return (b.amount || 0) - (a.amount || 0);
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
              variant={sortType === 'interest-desc' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortType('interest-desc')}
              className={`text-xs px-3 py-1 ${
                sortType === 'interest-desc' 
                  ? 'bg-[#B3EBEF] text-gray-900 hover:bg-[#A0E2E6]' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              利率
            </Button>
            <Button
              variant={sortType === 'principal-desc' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortType('principal-desc')}
              className={`text-xs px-3 py-1 ${
                sortType === 'principal-desc' 
                  ? 'bg-[#B3EBEF] text-gray-900 hover:bg-[#A0E2E6]' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingDown className="w-3 h-3 mr-1" />
              本金
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B3EBEF]/30 to-[#8FD8DC]/30 flex items-center justify-center mr-3">
                        <IconComponent className="w-5 h-5 text-[#01BCD6]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">
                          {config?.name || debt.type}
                        </div>
                        <div className="text-sm text-gray-500">
                          {debt.name && <span>{debt.name}</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 mb-1">
                        {Math.round(debt.amount || 0).toLocaleString()}万
                      </div>
                      <div className="text-sm text-[#01BCD6] font-medium">
                        {debt.normalizedRate.toFixed(2)}%
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