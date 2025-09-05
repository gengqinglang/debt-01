import React from 'react';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DebtItem {
  id: string;
  type: string;
  remainingPrincipal: number;
  paidInterest: number;
  remainingInterest: number;
}

const mockDebtData: DebtItem[] = [
  { id: '1', type: '房贷', remainingPrincipal: 800000, paidInterest: 120000, remainingInterest: 280000 },
  { id: '2', type: '车贷', remainingPrincipal: 150000, paidInterest: 15000, remainingInterest: 35000 },
  { id: '3', type: '信用卡', remainingPrincipal: 25000, paidInterest: 3000, remainingInterest: 5000 }
];

const DebtOverviewCard: React.FC = () => {
  const totalDebt = mockDebtData.reduce((sum, debt) => sum + debt.remainingPrincipal, 0);
  const totalInterest = mockDebtData.reduce((sum, debt) => sum + debt.remainingInterest, 0);
  const paidInterest = mockDebtData.reduce((sum, debt) => sum + debt.paidInterest, 0);

  // 饼图数据
  const pieData = [
    {
      name: '1年内',
      value: (totalDebt * 0.15 + totalInterest * 0.20) / 10000,
      percentage: (((totalDebt * 0.15 + totalInterest * 0.20) / (totalDebt + totalInterest)) * 100).toFixed(1)
    },
    {
      name: '2-5年',
      value: (totalDebt * 0.45 + totalInterest * 0.50) / 10000,
      percentage: (((totalDebt * 0.45 + totalInterest * 0.50) / (totalDebt + totalInterest)) * 100).toFixed(1)
    },
    {
      name: '5年以后',
      value: (totalDebt * 0.40 + totalInterest * 0.30) / 10000,
      percentage: (((totalDebt * 0.40 + totalInterest * 0.30) / (totalDebt + totalInterest)) * 100).toFixed(1)
    }
  ];

  const COLORS = ['#01BCD6', '#4ECDC4', '#8FD8DC'];

  return (
    <Card className="p-3 bg-white border border-gray-200">
      <div className="space-y-6">
        {/* 债务总览 */}
        <div className="bg-[#CAF4F7]/30 rounded-lg p-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                ¥{(totalDebt / 10000).toFixed(1)}万
              </div>
              <div className="text-sm text-gray-600 mt-1">剩余本金</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                ¥{(totalInterest / 10000).toFixed(1)}万
              </div>
              <div className="text-sm text-gray-600 mt-1">剩余利息</div>
            </div>
          </div>
        </div>

        {/* 债务期限分布 */}
        <div className="space-y-3">
          <h4 className="text-base font-medium text-gray-900">还债期限分布(本金加利息)</h4>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="42%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}\n${percentage}%`}
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                  fill="#8884d8"
                  dataKey="value"
                  fontSize={12}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`¥${value.toFixed(1)}万`, '金额']}
                  labelFormatter={(label) => label}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DebtOverviewCard;