
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

interface ExpenditureItem {
  name: string;
  amount: number;
}

const LifeExpenditureDisplay: React.FC = () => {
  // 模拟数据 - 各科目支出金额（万元）
  const expenditureItems: ExpenditureItem[] = [
    { name: '结婚', amount: 50 },
    { name: '生育', amount: 30 },
    { name: '教育', amount: 200 },
    { name: '基础生活', amount: 800 },
    { name: '居住', amount: 500 },
    { name: '交通', amount: 150 },
    { name: '养老', amount: 600 },
    { name: '医疗', amount: 300 },
    { name: '赡养', amount: 200 },
    { name: '大额消费', amount: 100 }
  ];

  const totalAmount = expenditureItems.reduce((sum, item) => sum + item.amount, 0);

  const formatAmount = (amount: number) => {
    return amount.toFixed(0);
  };

  return (
    <Card className="mb-4 bg-gradient-to-r from-[#E3F7FA]/20 to-[#B3EBEF]/20 border-[#B3EBEF] shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] rounded-full flex items-center justify-center">
              <Calculator className="w-4 h-4 text-gray-900" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">未来人生总支出</h3>
              <p className="text-xs text-gray-600">所有人生大事的支出总和</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-bold text-gray-900">
              {formatAmount(totalAmount)}万
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LifeExpenditureDisplay;
