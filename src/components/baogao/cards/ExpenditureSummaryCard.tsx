import React from 'react';
import { Card } from '@/components/ui/card';
import { Home, Car, GraduationCap, Heart, Plane, Baby } from 'lucide-react';

interface ExpenditureItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  amount: number;
  description: string;
}

const mockExpenditureData: ExpenditureItem[] = [
  { id: '1', name: '住房支出', icon: Home, amount: 800000, description: '首付款、装修等' },
  { id: '2', name: '教育支出', icon: GraduationCap, amount: 300000, description: '子女教育费用' },
  { id: '3', name: '购车支出', icon: Car, amount: 200000, description: '车辆购置及维护' },
  { id: '4', name: '结婚支出', icon: Heart, amount: 150000, description: '婚礼及相关费用' },
  { id: '5', name: '旅游支出', icon: Plane, amount: 80000, description: '年度旅游计划' },
  { id: '6', name: '生育支出', icon: Baby, amount: 50000, description: '生育相关费用' }
];

const ExpenditureSummaryCard: React.FC = () => {
  const totalExpenditure = mockExpenditureData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-3 p-3 border border-gray-200 rounded-lg bg-white">
      {/* 支出总览 */}
      <div className="bg-[#CAF4F7]/30 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              ¥{(totalExpenditure / 10000).toFixed(1)}万
            </div>
            <div className="text-sm text-gray-600 mt-1">预计总支出</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {mockExpenditureData.length}项
            </div>
            <div className="text-sm text-gray-600 mt-1">支出类别</div>
          </div>
        </div>
      </div>

      {/* 支出明细列表 */}
      <div className="space-y-3">
        
        <div className="space-y-1">
          {mockExpenditureData.map((item) => {
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
                      {((item.amount / totalExpenditure) * 100).toFixed(1)}%
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
    </div>
  );
};

export default ExpenditureSummaryCard;