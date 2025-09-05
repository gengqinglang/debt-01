
import React from 'react';
import { ChevronDown, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlanConfiguratorProps {
  motive: string;
  roomType: string;
  amount: string;
  purchaseAge?: number;
  onRoomTypeChange: (type: string) => void;
  onAmountChange: (amount: string) => void;
  onPurchaseAgeChange?: (age: number) => void;
  onConfirmPlan: () => void;
  onCancel: () => void;
}

const roomTypeOptions = [
  { id: '1居室', label: '1居室(40-70㎡)' },
  { id: '2居室', label: '2居室(70-120㎡)' },
  { id: '3居室', label: '3居室(100-200㎡)' },
  { id: '4居室', label: '4居室(120-250㎡)' }
];

// 根据购房动机和户型获取推荐预算
const getRecommendedAmount = (motive: string, roomType: string) => {
  const baseAmounts = {
    '1居室(40-70㎡)': { base: 100, multiplier: 1.0 },
    '2居室(70-120㎡)': { base: 200, multiplier: 1.0 },
    '3居室(100-200㎡)': { base: 350, multiplier: 1.0 },
    '4居室(120-250㎡)': { base: 500, multiplier: 1.0 }
  };

  const motiveMultipliers = {
    '买套改善房': 1.0,
    '买个学区房': 1.2,
    '跨城置业': 0.8,
    '给父母买房': 0.9,
    '买个养老房': 0.8,
    '投资买房': 0.7,
    '给孩子买婚房': 1.3
  };

  const roomConfig = baseAmounts[roomType] || baseAmounts['2居室(70-120㎡)'];
  const motiveMultiplier = motiveMultipliers[motive] || 1.0;
  
  return Math.round(roomConfig.base * motiveMultiplier).toString();
};

const PlanConfigurator: React.FC<PlanConfiguratorProps> = ({
  motive,
  roomType,
  amount,
  purchaseAge = 30,
  onRoomTypeChange,
  onAmountChange,
  onPurchaseAgeChange,
  onConfirmPlan,
  onCancel
}) => {
  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    onAmountChange(numericValue);
  };

  const handleRoomTypeChange = (newRoomType: string) => {
    onRoomTypeChange(newRoomType);
    // 当户型变化时，自动更新预算金额
    const recommendedAmount = getRecommendedAmount(motive, newRoomType);
    onAmountChange(recommendedAmount);
  };

  const handlePurchaseAgeChange = (newAge: number) => {
    if (onPurchaseAgeChange) {
      onPurchaseAgeChange(newAge);
    }
  };

  return (
    <div className="bg-white border-2 border-[#B3EBEF] rounded-2xl p-3 sm:p-4 shadow-lg">
      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 sm:mb-3">配置购房计划</h3>
      <div className="space-y-3 sm:space-y-4">
        <div className="bg-[#B3EBEF]/10 rounded-lg p-2.5 sm:p-3">
          <h4 className="font-semibold text-gray-800 mb-1 text-sm">{motive}</h4>
          <p className="text-xs text-gray-600">请配置您的购房详情</p>
        </div>

        {/* 计划购房时间和户型选择 - 一行显示 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* 计划购房时间 */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs font-medium text-gray-700">计划购房时间</label>
            <div className="relative">
              <select
                value={purchaseAge}
                onChange={(e) => handlePurchaseAgeChange(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B3EBEF] focus:border-transparent appearance-none bg-white pr-8 z-10"
              >
                {Array.from({ length: 48 }, (_, i) => {
                  const age = i + 18;
                  return (
                    <option key={age} value={age}>
                      {age}岁
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* 户型选择 */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs font-medium text-gray-700">选择户型</label>
            <div className="relative">
              <select
                value={roomType}
                onChange={(e) => handleRoomTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B3EBEF] focus:border-transparent appearance-none bg-white pr-8 z-10"
              >
                {roomTypeOptions.map((option) => (
                  <option key={option.id} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 预算输入 */}
        <div className="space-y-1.5 sm:space-y-2">
          <label className="text-xs font-medium text-gray-700">预算金额</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B3EBEF] focus:border-transparent"
              placeholder="输入金额"
            />
            <span className="text-xs text-gray-600 font-medium">万元</span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 pt-1 sm:pt-2">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 py-2 text-sm rounded-xl border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            取消
          </Button>
          <Button
            onClick={onConfirmPlan}
            className="flex-1 py-2 text-sm rounded-xl bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] hover:from-[#A0E4E9] hover:to-[#7DD3D7] text-gray-900 font-semibold"
          >
            确定计划
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanConfigurator;
