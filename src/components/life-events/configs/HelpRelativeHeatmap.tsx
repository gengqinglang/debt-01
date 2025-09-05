
import React, { useState } from 'react';
import { assetLiabilityData } from '@/components/asset-freedom/data/financialData';

const HelpRelativeHeatmap: React.FC = () => {
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  // 计算可支配资金（净资产的一部分作为可随意支配的资金）
  const disposableWealthData = assetLiabilityData.map(item => {
    const netWorth = item.assets - item.liabilities;
    // 假设净资产的10%可以随意支配
    const disposableWealth = Math.max(0, netWorth * 0.1);
    return {
      ...item,
      disposableWealth
    };
  });

  // 找到最大值用于颜色映射
  const maxDisposableWealth = Math.max(...disposableWealthData.map(d => d.disposableWealth));

  // 获取颜色强度
  const getColorIntensity = (value: number) => {
    if (maxDisposableWealth === 0) return 0;
    return Math.min(1, value / maxDisposableWealth);
  };

  // 获取颜色
  const getColor = (intensity: number) => {
    if (intensity === 0) return 'bg-gray-100';
    if (intensity <= 0.2) return 'bg-green-200';
    if (intensity <= 0.4) return 'bg-green-300';
    if (intensity <= 0.6) return 'bg-green-400';
    if (intensity <= 0.8) return 'bg-green-500';
    return 'bg-green-600';
  };

  // 格式化金额显示（万元）
  const formatAmount = (amount: number) => {
    return `${(amount / 10000).toFixed(1)}万元`;
  };

  const handleCellClick = (age: number, amount: number) => {
    setSelectedAge(age);
    setSelectedAmount(amount);
  };

  return (
    <div className="w-full">
      {/* 选中信息显示 */}
      {selectedAge && selectedAmount !== null && (
        <div className="mb-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs font-medium text-blue-800">
            {selectedAge}岁：{formatAmount(selectedAmount)}
          </div>
        </div>
      )}
      
      {/* 热力图网格 - 显示完整年龄范围 */}
      <div className="grid grid-cols-8 gap-1 mb-2 w-full">
        {disposableWealthData.map((item, index) => {
          const intensity = getColorIntensity(item.disposableWealth);
          const colorClass = getColor(intensity);
          
          return (
            <div
              key={index}
              className={`aspect-square rounded text-xs flex items-center justify-center text-gray-800 ${colorClass} hover:scale-105 transition-transform cursor-pointer`}
              title={`${item.age}岁: ${formatAmount(item.disposableWealth)}`}
              onClick={() => handleCellClick(item.age, item.disposableWealth)}
            >
              <div className="text-xs font-medium">{item.age}</div>
            </div>
          );
        })}
      </div>

      {/* 颜色图例 */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-100 rounded"></div>
          <span>较少</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-300 rounded"></div>
          <span>适中</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-600 rounded"></div>
          <span>充裕</span>
        </div>
      </div>
    </div>
  );
};

export default HelpRelativeHeatmap;
