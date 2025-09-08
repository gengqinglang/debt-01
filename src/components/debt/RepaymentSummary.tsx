import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PiggyBank, TrendingDown, Calendar } from 'lucide-react';
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

  // 准备还款计划清单
  const repaymentPlan = debts.filter(debt => (debt.amount || 0) > 0).map(debt => {
    const today = new Date();
    const estimatedClearDate = addMonths(today, debt.remainingMonths || 0);
    return {
      category: debtTypeNames[debt.type] || debt.type,
      monthlyPayment: debt.monthlyPayment || 0,
      remainingMonths: debt.remainingMonths || 0,
      clearDate: estimatedClearDate.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    };
  });
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

      {/* 还款计划清单 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Calendar className="w-5 h-5 text-[#01BCD6] mr-2" />
            整体还款计划
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {repaymentPlan.length > 0 ? <div className="divide-y divide-gray-100">
              {repaymentPlan.map((plan, index) => <div key={index} className="px-4 py-3 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">{plan.category}</div>
                      <div className="text-sm text-gray-500 space-x-4">
                        <span>月供: {formatCurrency(plan.monthlyPayment)}</span>
                        <span>剩余: {plan.remainingMonths}期</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      <div className="text-xs text-gray-400 mb-1">预计结清</div>
                      <div>{plan.clearDate}</div>
                    </div>
                  </div>
                </div>)}
            </div> : <div className="px-4 py-8 text-center text-gray-500">
              暂无还款计划
            </div>}
        </CardContent>
      </Card>
    </div>;
};
export default RepaymentSummary;