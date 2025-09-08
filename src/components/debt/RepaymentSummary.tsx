import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PiggyBank, TrendingDown, PieChart } from 'lucide-react';
import type { DebtInfo } from '@/pages/FinancialStatusPage';
interface RepaymentSummaryProps {
  debts: DebtInfo[];
}

// 债务类型中文映射
const debtTypeNames: Record<string, string> = {
  mortgage: '房贷',
  carLoan: '车贷',
  consumerLoan: '消费贷',
  businessLoan: '经营贷',
  privateLoan: '民间贷',
  creditCard: '信用卡'
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

// 计算预计结清日期
const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};
const RepaymentSummary: React.FC<RepaymentSummaryProps> = ({
  debts
}) => {
  // 计算汇总数据
  const totalDebtWan = debts.reduce((sum, debt) => sum + (debt.amount || 0), 0);
  const monthlyTotalYuan = debts.reduce((sum, debt) => {
    if ((debt.remainingMonths || 0) > 0) {
      return sum + (debt.monthlyPayment || 0);
    }
    return sum;
  }, 0);

  // 计算按分类的剩余本金数据
  const debtByCategory = debts.filter(debt => (debt.amount || 0) > 0).reduce((acc, debt) => {
    const category = debtTypeNames[debt.type] || debt.type;
    const amount = debt.amount || 0;
    
    if (acc[category]) {
      acc[category] += amount;
    } else {
      acc[category] = amount;
    }
    return acc;
  }, {} as Record<string, number>);

  // 准备分类数据
  const pieData = Object.entries(debtByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
    percentage: totalDebtWan > 0 ? ((amount / totalDebtWan) * 100).toFixed(1) : '0.0'
  }));
  return <div className="space-y-4">
      {/* 汇总卡片 */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-br from-[#B3EBEF]/20 to-[#8FD8DC]/20 border-[#B3EBEF]/30">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <PiggyBank className="w-5 h-5 text-[#01BCD6] mr-2" />
              <span className="text-sm text-gray-600">负债总额</span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {Math.round(totalDebtWan).toLocaleString()}万
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#B3EBEF]/20 to-[#8FD8DC]/20 border-[#B3EBEF]/30">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingDown className="w-5 h-5 text-[#01BCD6] mr-2" />
              <span className="text-sm text-gray-600">下期还款额</span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {formatCurrency(monthlyTotalYuan)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 按分类汇总 */}
      <Card>
        <CardHeader className="p-2">
          <CardTitle className="flex items-center text-lg">
            <PieChart className="w-5 h-5 text-[#01BCD6] mr-2" />
            按分类汇总
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {pieData.length > 0 ? (
            <div className="space-y-3">
              {pieData.map((item, index) => (
                <div key={item.name} className="bg-gradient-to-r from-[#B3EBEF]/10 to-[#8FD8DC]/10 rounded-lg p-4 border border-[#B3EBEF]/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: '#01BCD6' }}
                      />
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
                      <div className="text-xl font-bold text-gray-900">
                        {Math.round(item.value).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        万元
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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