import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ArrowDown } from 'lucide-react';

interface HousingRecommendationCardProps {
  onAcceptSuggestions?: () => void;
  onRejectSuggestions?: () => void;
  defaultExpanded?: boolean;
  showLabels?: boolean;
}

export const HousingRecommendationCard: React.FC<HousingRecommendationCardProps> = ({
  onAcceptSuggestions,
  onRejectSuggestions,
  defaultExpanded = false,
  showLabels = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-[#CAF4F7]/10 rounded-lg p-3 transition-all duration-200 cursor-pointer group">
      <div 
        onClick={toggleExpanded}
        className="flex items-start justify-between mb-3"
      >
        <div className="flex-1 pr-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-base font-medium text-gray-800">
              建议购房方式
            </h4>
          </div>
          {/* 收起状态下只显示标签 */}
          {showLabels && (
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs rounded-full text-black" style={{backgroundColor: '#CAF4F7'}}>全款购房</span>
            </div>
          )}
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 mt-1 ${
            isExpanded ? 'rotate-180' : ''
          }`} 
        />
      </div>

      {/* 展开的详情内容 */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-[#CAF4F7]/30">
          <div className="space-y-8">
            {/* 购房计划一 */}
            <div className="space-y-4">
              {/* 计划标题 */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#CAF4F7'}}></div>
                <h4 className="text-base font-semibold text-gray-800">购房计划一</h4>
              </div>

              {/* 购房信息卡片 */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">年龄：</span>
                    <span className="text-sm font-medium text-gray-800">40岁</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">用途：</span>
                    <span className="text-sm font-medium text-gray-800">投资购房</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">房型：</span>
                    <span className="text-sm font-medium text-gray-800">3居室</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">预算：</span>
                    <span className="text-sm font-bold text-gray-800">500万</span>
                  </div>
                </div>
              </div>

              {/* 购房计划一不再显示调整建议卡片 */}
            </div>

            {/* 购房计划二 */}
            <div className="space-y-4">
              {/* 计划标题 */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#CAF4F7'}}></div>
                <h4 className="text-base font-semibold text-gray-800">购房计划二</h4>
              </div>

              {/* 购房信息卡片 */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">年龄：</span>
                    <span className="text-sm font-medium text-gray-800">45岁</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">用途：</span>
                    <span className="text-sm font-medium text-gray-800">自住购房</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">房型：</span>
                    <span className="text-sm font-medium text-gray-800">4居室</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">预算：</span>
                    <span className="text-sm font-bold text-gray-800">800万</span>
                  </div>
                </div>
              </div>

              {/* 购房计划二不再显示建议购房方式卡片 */}
            </div>
          </div>

          {/* 底部按钮 */}
          {onAcceptSuggestions && onRejectSuggestions && (
            <div className="flex space-x-3 mt-6">
              <Button 
                onClick={onAcceptSuggestions}
                className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm py-2"
              >
                接受建议
              </Button>
              <Button 
                onClick={onRejectSuggestions}
                className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm py-2"
              >
                不接受建议
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};