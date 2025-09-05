import React from 'react';
import { Card } from '@/components/ui/card';
import { Briefcase, Building, TrendingUp, DollarSign, PiggyBank, Coins } from 'lucide-react';

interface IncomeItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  amount: number;
  description: string;
}

const mockIncomeData: IncomeItem[] = [
  { id: '1', name: '本人工资收入', icon: Briefcase, amount: 480000, description: '主职工作收入' },
  { id: '2', name: '伴侣工资收入', icon: DollarSign, amount: 360000, description: '配偶工作收入' },
  { id: '3', name: '房租收入', icon: Building, amount: 60000, description: '房产租赁收入' },
  { id: '4', name: '其他收入', icon: Coins, amount: 40000, description: '投资理财等收入' }
];

const IncomeSummaryCard: React.FC = () => {
  const totalIncome = mockIncomeData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-3 p-3 border border-gray-200 rounded-lg bg-white">
      {/* 收入总览 */}
      <div className="bg-[#CAF4F7]/30 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              ¥{(totalIncome / 10000).toFixed(1)}万
            </div>
            <div className="text-sm text-gray-600 mt-1">年收入总计</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {mockIncomeData.length}项
            </div>
            <div className="text-sm text-gray-600 mt-1">收入来源</div>
          </div>
        </div>
      </div>

      {/* 收入明细列表 */}
      <div className="space-y-1">
        {mockIncomeData.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.id} className="flex items-center gap-3 py-2 px-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 bg-white border" style={{ borderColor: '#01BCD6' }}>
                <IconComponent className="w-4 h-4" style={{ color: '#01BCD6' }} strokeWidth={1.5} />
              </div>
              
              <div className="flex-1 min-w-0 flex justify-between items-center">
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900 mb-1">{item.name}</div>
                  <div className="text-xs text-gray-600 leading-relaxed">{item.description}</div>
                </div>
                
                <div className="text-right flex-shrink-0 ml-3">
                  <div className="text-xs font-medium mb-1" style={{ color: '#01BCD6' }}>
                    {((item.amount / totalIncome) * 100).toFixed(1)}%
                  </div>
                  <div className="text-base font-bold text-gray-900">
                    {(item.amount / 10000).toFixed(0)}万
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IncomeSummaryCard;