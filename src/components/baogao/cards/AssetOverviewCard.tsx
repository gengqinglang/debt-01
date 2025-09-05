import React from 'react';
import { Card } from '@/components/ui/card';
import { Home, PiggyBank, TrendingUp, Banknote, Building2, Coins } from 'lucide-react';

interface AssetItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  amount: number;
  description: string;
}

const mockAssetData: AssetItem[] = [
  { id: '1', name: '活期存款', icon: PiggyBank, amount: 200000, description: '银行活期存款' },
  { id: '2', name: '定期存款', icon: Banknote, amount: 300000, description: '银行定期存款' },
  { id: '3', name: '理财', icon: TrendingUp, amount: 250000, description: '理财产品投资' },
  { id: '4', name: '房产', icon: Home, amount: 2000000, description: '自住房产价值' },
  { id: '5', name: '车', icon: Building2, amount: 150000, description: '汽车资产价值' }
];

const AssetOverviewCard: React.FC = () => {
  const totalAssets = mockAssetData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-3 p-3 border border-gray-200 rounded-lg bg-white">
      {/* 资产总览 */}
      <div className="bg-[#CAF4F7]/30 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              ¥{(totalAssets / 10000).toFixed(1)}万
            </div>
            <div className="text-sm text-gray-600 mt-1">总资产</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {mockAssetData.length}项
            </div>
            <div className="text-sm text-gray-600 mt-1">资产类别</div>
          </div>
        </div>
      </div>

      {/* 资产明细列表 */}
      <div className="space-y-1">
        {mockAssetData.map((item) => {
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
                    {((item.amount / totalAssets) * 100).toFixed(1)}%
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

export default AssetOverviewCard;