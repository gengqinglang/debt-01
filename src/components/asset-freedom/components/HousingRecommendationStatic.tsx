import React from 'react';
import { TrendingUp } from 'lucide-react';

export const HousingRecommendationStatic: React.FC = () => {
  return (
    <div className="bg-[#CAF4F7]/10 rounded-lg p-3 border-2" style={{borderColor: '#CAF4F750'}}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 pr-3">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{color: '#01BCD6'}} />
            <h3 className="text-lg font-bold" style={{color: '#01BCD6'}}>
              建议购房方式
            </h3>
          </div>
          
          {/* 恭喜文案 */}
          <div className="text-sm text-gray-800 mb-3 leading-relaxed">
            恭喜！经过系统精准测算，您具备全款购房的强大实力，您的购房计划完全可以实现！
          </div>
        </div>
      </div>

      {/* 直接显示详情内容，无需展开收起 */}
      <div className="mt-3 pt-3 border-t border-[#CAF4F7]/30">
        <div className="space-y-8">
          {/* 购房计划一 */}
          <div className="space-y-4">
            {/* 购房信息卡片 */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              {/* 计划标题和标签 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h4 className="text-base font-semibold text-gray-800">购房计划1</h4>
                </div>
                <div className="px-2 py-1 rounded text-xs font-medium text-black" style={{backgroundColor: '#CAF4F7'}}>
                  全款购房
                </div>
              </div>
              
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
          </div>

          {/* 购房计划二 */}
          <div className="space-y-4">
            {/* 购房信息卡片 */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              {/* 计划标题和标签 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h4 className="text-base font-semibold text-gray-800">购房计划2</h4>
                </div>
                <div className="px-2 py-1 rounded text-xs font-medium text-black" style={{backgroundColor: '#CAF4F7'}}>
                  全款购房
                </div>
              </div>
              
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
          </div>
        </div>
      </div>
    </div>
  );
};