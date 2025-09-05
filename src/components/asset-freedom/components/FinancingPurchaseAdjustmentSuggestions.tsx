import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface FinancingPurchaseAdjustmentSuggestionsProps {
  onRestartSnapshot: () => void;
}

export const FinancingPurchaseAdjustmentSuggestions: React.FC<FinancingPurchaseAdjustmentSuggestionsProps> = ({
  onRestartSnapshot
}) => {
  return (
    <div 
      className="bg-[#CAF4F7]/5 rounded-lg p-4"
      style={{
        boxShadow: `
          inset 0 1px 0 rgba(255, 255, 255, 0.05),
          0 1px 2px rgba(0, 0, 0, 0.03),
          0 4px 8px rgba(0, 0, 0, 0.05),
          0 0 0 1px rgba(0, 0, 0, 0.03),
          0 2px 4px rgba(0, 0, 0, 0.03)
        `
      }}
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Settings className="w-4 h-4 text-black" />
          <h3 className="text-lg font-bold text-black">人生规划调整建议</h3>
        </div>
        
        <div className="space-y-4">
          {/* 文案内容 */}
          <div className="space-y-3">
            <p className="text-[14px] text-gray-700 leading-relaxed mb-3">
              经系统深度分析发现，您的财富规划存在重大缺陷，多项重要人生目标面临搁浅风险。
            </p>
            <p className="text-[14px] text-gray-600 leading-relaxed">
              建议您立即重启「财富快照」，重新审视收支结构和资产配置，确保人生重要节点不因资金缺口而延误。
            </p>
          </div>
          
          {/* 重走财富快照按钮 */}
          <div className="mt-4">
            <Button
              onClick={onRestartSnapshot}
              className="w-full bg-[#B3EBEF] text-gray-800 font-medium border border-[#B3EBEF]/30 text-sm"
            >
              重走财富快照
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};