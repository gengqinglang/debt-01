
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Eye, Settings, ArrowRight } from 'lucide-react';
import { useNavigationState } from '@/hooks/useNavigationState';

interface MainRiskCardProps {
  onViewAssessmentBasis: () => void;
  onEnterAdjustmentModule: () => void;
  currentActiveTab?: string;
  currentActiveRiskTab?: string;
}

const MainRiskCard: React.FC<MainRiskCardProps> = ({
  onViewAssessmentBasis,
  onEnterAdjustmentModule,
  currentActiveTab = 'risk',
  currentActiveRiskTab = 'main-risk'
}) => {
  const { navigateWithState } = useNavigationState();
  
  const fullText = "鉴于您当前收支失衡的财务状况，继续推进投资购房计划将显著加剧资金链紧张程度。若在现金流紧张情况下强行推进投资购房，会影响家庭基础生活质量，甚至导致债务累积，进一步阻碍家庭重大目标的资金规划。请您充分评估潜在风险，审慎决策后续资金安排。";

  const actionText1 = "建议取消投资购房计划，优先确保日常生活开支、应急储备及家庭重大目标的资金规划，避免因非刚性需求影响其他刚需支出。";
  const actionText2 = "如您不想放弃投资房计划，可使用【智能调缺工具】寻找其他解决方案。该模块将基于您的财务状况，并兼顾个人消费偏好，持续优化个性化开支压缩方案，精准识别可缩减项目，在保障家庭核心资金需求的同时，降低财务杠杆风险，并为科学投资决策提供专业支持。";

  const handleViewAdjustmentSolution = () => {
    console.log('[MainRiskCard] Navigating to adjustment solution');
    console.log('[MainRiskCard] Current context - activeTab:', currentActiveTab, 'activeRiskTab:', currentActiveRiskTab);
    
    navigateWithState('/adjustment-solution', {
      activeTab: currentActiveTab,
      activeRiskTab: currentActiveRiskTab,
      sourceModule: 'main-risk-adjustment'
    });
  };

  const handleCancelInvestmentHousing = () => {
    console.log('[MainRiskCard] Navigating to juzhuguihua page');
    
    navigateWithState('/juzhuguihua', {
      activeTab: currentActiveTab,
      activeRiskTab: currentActiveRiskTab,
      sourceModule: 'main-risk-cancel-investment'
    });
  };

  return (
    <>
      {/* 风险总览卡片 - 总结部分 */}
      <div className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50 relative overflow-hidden rounded-xl p-5 shadow-lg mb-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-orange-900">您目前面临6项风险</h3>
          </div>
         
         <div className="space-y-2">
            <p className="text-sm text-gray-700 leading-relaxed">
              其中，<span className="text-lg font-bold text-red-800">目标改变风险</span>是您当前最大的风险。我们建议您优先关注并解决此问题，这将对您的财务状况产生最积极的影响。解决此风险后，再逐步关注其他风险。
            </p>
         </div>
        </div>
      </div>

      {/* 分隔线和详细分析标题 */}
      <div className="py-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
          <h4 className="text-base font-bold text-gray-800">详细风险分析</h4>
        </div>
        <div className="h-px bg-gradient-to-r from-orange-200 via-red-200 to-transparent"></div>
      </div>

      {/* 详细风险卡片 */}
      <Card className="bg-gradient-to-br from-red-50/80 to-orange-50/60 relative overflow-hidden shadow-sm border">
        <CardContent className="p-4 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-1 pr-3">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                 <h3 className="text-lg font-bold text-red-800">
                  目标改变风险-取消投资房
                 </h3>
              </div>
              <Button
                size="sm"
                className="bg-red-100 hover:bg-red-200 text-red-700 border-0 text-xs flex-shrink-0"
                onClick={onViewAssessmentBasis}
              >
                <Eye className="w-3 h-3 mr-1" />
                查看测评依据
              </Button>
            </div>
            
            {/* 描述文字区域 - 直接展开 */}
            <div className="space-y-2">
              <p className="text-sm text-gray-700 leading-relaxed">
                {fullText}
              </p>
            </div>

            <div className="mt-4">
              <div className="flex items-center space-x-2 mb-2">
                <Settings className="w-4 h-4 text-red-600" />
                <span className="text-lg font-bold text-red-800">应对建议</span>
              </div>
              
               {/* 应对建议文字区域 - 分为两部分 */}
               <div className="space-y-4 mb-3">
                 {/* 第一部分：取消投资购房建议 */}
                 <div className="space-y-3">
                   <p className="text-sm text-gray-700 leading-relaxed">
                     <span className="font-medium">1、</span>{actionText1}
                   </p>
                   <Button
                     onClick={handleCancelInvestmentHousing}
                     className="w-full bg-red-100 hover:bg-red-200 text-red-700 border-0 text-sm font-medium"
                   >
                     取消投资购房计划
                   </Button>
                 </div>
                 
                 {/* 第二部分：智能调缺建议 */}
                 <div className="space-y-3">
                   <p className="text-sm text-gray-700 leading-relaxed">
                     <span className="font-medium">2、</span>{actionText2}
                   </p>
                 </div>
               </div>

               {/* 获取调缺方案按钮 */}
               <div className="mt-2">
                 <Button
                   onClick={handleViewAdjustmentSolution}
                   className="w-full bg-red-100 hover:bg-red-200 text-red-700 border-0 text-sm font-medium flex items-center justify-center space-x-2"
                 >
                   <Settings className="w-4 h-4" />
                   <span>获取调缺方案</span>
                 </Button>
               </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default MainRiskCard;
