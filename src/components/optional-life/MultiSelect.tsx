
import React from 'react';
import { Check, ChevronDown } from 'lucide-react';

interface MultiSelectOption {
  id: string;
  label: string;
  subOptions?: { id: string; label: string; price?: string }[];
}

interface MultiSelectProps {
  label: string;
  options: MultiSelectOption[];
  selectedOptions: { [key: string]: boolean };
  subSelections?: { [key: string]: string };
  onToggleOption: (optionId: string) => void;
  onSubSelect?: (optionId: string, subOptionId: string) => void;
  onAmountChange?: (optionId: string, amount: string) => void;
  houseAmounts?: { [key: string]: string };
}

// 推荐的户型配置
const getRecommendedConfig = (motiveId: string) => {
  const recommendations = {
    '买套改善房': { type: '3居室(100-200㎡)', amount: '350' },
    '买个学区房': { type: '2居室(70-120㎡)', amount: '280' },
    '跨城置业': { type: '2居室(70-120㎡)', amount: '200' },
    '给父母买房': { type: '2居室(70-120㎡)', amount: '220' },
    '买个养老房': { type: '2居室(70-120㎡)', amount: '180' },
    '投资买房': { type: '1居室(40-70㎡)', amount: '120' },
    '给孩子买婚房': { type: '3居室(100-200㎡)', amount: '400' }
  };
  return recommendations[motiveId] || { type: '2居室(70-120㎡)', amount: '200' };
};

// 所有可选户型
const roomTypeOptions = [
  { id: '1居室', label: '1居室(40-70㎡)' },
  { id: '2居室', label: '2居室(70-120㎡)' },
  { id: '3居室', label: '3居室(100-200㎡)' },
  { id: '4居室', label: '4居室(120-250㎡)' }
];

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selectedOptions,
  subSelections,
  onToggleOption,
  onSubSelect,
  onAmountChange,
  houseAmounts
}) => {
  const handleAmountChange = (optionId: string, value: string) => {
    // 只允许数字输入
    const numericValue = value.replace(/[^\d]/g, '');
    onAmountChange?.(optionId, numericValue);
  };

  const handleRoomTypeChange = (motiveId: string, roomTypeId: string) => {
    onSubSelect?.(motiveId, roomTypeId);
  };

  // 获取已选择的购房动机
  const getSelectedMotives = () => {
    return Object.keys(selectedOptions).filter(key => selectedOptions[key]);
  };

  const selectedMotives = getSelectedMotives();

  return (
    <div className="space-y-6">
      {/* 已选择的购房动机汇总 */}
      {selectedMotives.length > 0 && (
        <div className="bg-gradient-to-br from-[#B3EBEF]/10 to-[#8FD8DC]/10 border border-[#B3EBEF] rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">已选择的购房计划</h3>
          <div className="space-y-4">
            {selectedMotives.map((motiveId) => {
              const recommendedConfig = getRecommendedConfig(motiveId);
              const currentAmount = houseAmounts?.[motiveId] || recommendedConfig.amount;
              const currentRoomType = subSelections?.[motiveId] || recommendedConfig.type;
              
              return (
                <div key={motiveId} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-800">{motiveId}</h4>
                    <span className="text-sm text-gray-500">预算 {currentAmount}万元</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#B3EBEF]/20 text-gray-700 font-medium">
                      {currentRoomType}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <p className="text-sm font-semibold text-gray-700">{label}：</p>
        <div className="space-y-3">
          {options.map((option) => {
            const isSelected = selectedOptions[option.id];
            const recommendedConfig = getRecommendedConfig(option.id);
            const currentAmount = houseAmounts?.[option.id] || recommendedConfig.amount;
            const currentRoomType = subSelections?.[option.id] || recommendedConfig.type;
            
            return (
              <div key={option.id} className="space-y-3">
                <div
                  onClick={() => onToggleOption(option.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#B3EBEF]/10 to-[#8FD8DC]/10 border-[#B3EBEF] shadow-lg'
                      : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{option.label}</span>
                    <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                      isSelected
                        ? 'border-[#B3EBEF] bg-[#B3EBEF]'
                        : 'border-gray-400 bg-white'
                    }`}>
                      {isSelected && (
                        <Check className="w-4 h-4 text-white" strokeWidth={2} />
                      )}
                    </div>
                  </div>
                </div>
                
                {isSelected && (
                  <div className="ml-4 space-y-4 animate-fade-in">
                    {/* 居室户型选择 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">选择户型：</p>
                      <div className="relative">
                        <select
                          value={currentRoomType}
                          onChange={(e) => handleRoomTypeChange(option.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#B3EBEF] focus:border-transparent appearance-none bg-white pr-8"
                        >
                          {roomTypeOptions.map((roomType) => (
                            <option key={roomType.id} value={roomType.label}>
                              {roomType.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">系统已为您推荐合适的户型，您可以根据实际情况调整</p>
                    </div>

                    {/* 预算金额输入 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">预算金额：</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={currentAmount}
                          onChange={(e) => handleAmountChange(option.id, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#B3EBEF] focus:border-transparent"
                          placeholder="输入金额"
                        />
                        <span className="text-sm text-gray-600 font-medium">万元</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">系统已为您推荐合适的预算，您可以根据实际情况调整</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
