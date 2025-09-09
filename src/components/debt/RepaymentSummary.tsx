import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PiggyBank, TrendingDown, PieChart, Home, Car, CreditCard, Wallet, Briefcase, Handshake } from 'lucide-react';
import type { DebtInfo } from '@/pages/FinancialStatusPage';
import { buildRepaymentItems, calculateCurrentMonthRemaining, calculateNextMonthTotal } from '@/lib/repaymentSchedule';
interface RepaymentSummaryProps {
  debts: DebtInfo[];
}

// 债务类型配置
const debtTypeConfig: Record<string, { name: string; icon: React.ComponentType<any> }> = {
  mortgage: { name: '房贷', icon: Home },
  carLoan: { name: '车贷', icon: Car },
  consumerLoan: { name: '消费贷', icon: CreditCard },
  businessLoan: { name: '经营贷', icon: Briefcase },
  privateLoan: { name: '民间贷', icon: Handshake },
  creditCard: { name: '信用卡', icon: Wallet }
};

// 格式化金额
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const RepaymentSummary: React.FC<RepaymentSummaryProps> = ({
  debts
}) => {
  // Build detailed repayment schedule from all loan sources
  const repaymentItems = buildRepaymentItems(debts);
  
  // 计算汇总数据
  const totalDebtWan = debts.reduce((sum, debt) => sum + (debt.amount || 0), 0);
  
  // Calculate current month's remaining payments (from today onwards)
  const monthlyRemainingYuan = calculateCurrentMonthRemaining(repaymentItems);
  
  // Calculate next month's total payments
  const nextMonthTotalYuan = calculateNextMonthTotal(repaymentItems);

  // 计算按分类的剩余本金数据
  const debtByCategory = debts.filter(debt => (debt.amount || 0) > 0).reduce((acc, debt) => {
    const config = debtTypeConfig[debt.type];
    const category = config?.name || debt.type;
    const amount = debt.amount || 0;
    
    if (acc[category]) {
      acc[category] += amount;
    } else {
      acc[category] = amount;
    }
    return acc;
  }, {} as Record<string, number>);

  // 准备分类数据
  const pieData = Object.entries(debtByCategory).map(([category, amount]) => {
    // 找到对应的债务类型以获取图标
    const debtType = Object.keys(debtTypeConfig).find(key => debtTypeConfig[key].name === category);
    const config = debtType ? debtTypeConfig[debtType] : null;
    
    return {
      name: category,
      value: amount,
      percentage: totalDebtWan > 0 ? ((amount / totalDebtWan) * 100).toFixed(1) : '0.0',
      icon: config?.icon || Wallet
    };
  });
  return <div className="space-y-4">
      {/* 汇总卡片 */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-gradient-to-br from-[#B3EBEF]/20 to-[#8FD8DC]/20 border-[#B3EBEF]/30">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="text-sm text-gray-600">负债总额</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {Math.round(totalDebtWan).toLocaleString()}万
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-[#B3EBEF]/20 to-[#8FD8DC]/20 border-[#B3EBEF]/30">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="text-sm text-gray-600">本月待还款额</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(monthlyRemainingYuan)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#B3EBEF]/20 to-[#8FD8DC]/20 border-[#B3EBEF]/30">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="text-sm text-gray-600">下月待还款额</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(nextMonthTotalYuan)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 按分类汇总 */}
      <Card>
        <CardHeader className="pt-6 pb-4 px-4">
          <CardTitle className="flex items-center text-lg">
            <PieChart className="w-5 h-5 text-[#01BCD6] mr-2" />
            按分类汇总
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-4 px-2">
          {pieData.length > 0 ? (
            <div className="space-y-3">
              {pieData.map((item, index) => {
                const IconComponent = item.icon;
                
                return (
                  <div key={item.name} className="bg-gradient-to-r from-[#B3EBEF]/10 to-[#8FD8DC]/10 rounded-lg py-2 px-4 border border-[#B3EBEF]/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B3EBEF]/30 to-[#8FD8DC]/30 flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-[#01BCD6]" />
                        </div>
                        <div>
                          <div className="text-base font-semibold text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-sm text-[#01BCD6] font-medium">
                            占比 {item.percentage}%
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-bold text-gray-900">
                          {Math.round(item.value).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          万元
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              暂无债务数据
            </div>
          )}
        </CardContent>
      </Card>
    </div>;
};
export default RepaymentSummary;