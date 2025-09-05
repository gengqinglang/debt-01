import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileHint from '@/components/ui/mobile-hint';

const RiskAssessmentNotice: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-3">
        <MobileHint 
          message="本评估基于简要资产，默认资产可随时取用，可能低估风险"
          variant="warning"
        />
        <button 
          onClick={() => { sessionStorage.setItem('fromBaogao', '1'); navigate('/asset', { state: { from: 'baogao' } }) }}
          className="w-full py-2.5 px-4 rounded-lg font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
        >
          录入精细资产
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#CAF4F7]/30 border border-[#CAF4F7] rounded-lg p-4">
      {/* 折叠状态的简要说明 */}
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800 leading-relaxed mb-3 font-medium">
            本评估基于简要资产，默认"资产可随时取用"，<span className="font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">可能低估风险</span>
          </p>
          
          {/* 详细说明 */}
          <div className="mt-4 pt-4 border-t border-[#CAF4F7]">
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-2 h-4 bg-[#01BCD6]/40 flex-shrink-0 mt-0.5 rounded-[1px]"></div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">为什么可能低估</h4>
                  <p className="text-gray-600">若资产并非随时可用，短期偿债风险可能被低估</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-4 bg-[#01BCD6]/40 flex-shrink-0 mt-0.5 rounded-[1px]"></div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">建议行动</h4>
                  <p className="text-gray-600">录入精细资产信息，获取更准确评估</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-4 bg-[#01BCD6]/40 flex-shrink-0 mt-0.5 rounded-[1px]"></div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">隐私保证</h4>
                  <p className="text-gray-600">数据仅用于风险计算，不做其他用途</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要行动按钮 */}
      <div className="mt-5 pt-4 border-t border-[#CAF4F7]">
        <button 
          onClick={() => { sessionStorage.setItem('fromBaogao', '1'); navigate('/asset', { state: { from: 'baogao' } }) }}
          className="w-full py-2.5 px-4 rounded-lg font-medium transition-colors bg-[#CAF4F7] text-gray-700 hover:bg-[#CAF4F7]/80"
        >
          录入精细资产，获取更准确风险评估
        </button>
      </div>
    </div>
  );
};

export default RiskAssessmentNotice;