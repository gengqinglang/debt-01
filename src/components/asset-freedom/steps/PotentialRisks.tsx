
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useNavigate } from 'react-router-dom';

interface PotentialRisksProps {
  onBack: () => void;
  onComplete: () => void;
  isMember?: boolean;
}

const PotentialRisks: React.FC<PotentialRisksProps> = ({ onBack, onComplete, isMember = true }) => {
  const [isSecondaryRisksOpen, setIsSecondaryRisksOpen] = useState(false);
  const navigate = useNavigate();

  const handleViewAssessmentBasis = (riskType: string) => {
    console.log('查看测评依据:', riskType);
    // 导航到测评依据页面
    navigate('/assessment-basis', { state: { skipLoading: true } });
  };

  return (
    <div className="space-y-6">
      {/* 头部导航 */}
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回概览
        </Button>
      </div>

      {/* 步骤标题 */}
      <div className="flex items-center space-x-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#CAF4F7' }}
        >
          <AlertTriangle className="w-5 h-5" style={{ color: '#0891b2' }} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">第三步：潜在风险分析</h2>
          <p className="text-gray-600">识别并量化您面临的财务风险</p>
        </div>
      </div>

      {/* 详细内容 */}
      <div 
        className="rounded-2xl p-6"
        style={{ backgroundColor: 'rgba(202, 244, 247, 0.1)' }}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">您存在的潜在风险有哪些？</h3>
          
          <p className="text-sm text-gray-700 leading-relaxed">
            您一共有
            <span className="font-medium text-gray-800">5种潜在风险</span>
            ，分别是：规划改动风险、重疾风险、意外风险、不当消费风险、不当举债风险。
          </p>
          
          {/* 重点风险警告 */}
          <div>
            <p className="text-sm font-medium text-gray-800 mb-1">重点提示您关注——规划改动风险-取消改善房计划</p>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              鉴于您当前收支失衡的财务状况，需出售现有房产转为租房居住，此过程将伴随显著的生活质量下降及资产变动风险。这些调整会导致带来居住环境改变、生活便利性与舒适度下降，产生较大的心理落差，这意味着您的规划整体是不合理的，请您充分认知和评估由此带来的生活方式改变，审慎决策后续资金安排。
            </p>
            {isMember && (
              <Button
                size="sm"
                className="text-xs text-gray-600 border-0 mt-2"
                style={{ backgroundColor: '#E7FBFB' }}
                onClick={() => handleViewAssessmentBasis('规划改动风险')}
              >
                查看测评依据（会员专属）
              </Button>
            )}
          </div>
          
          {/* 次要风险列表 */}
          <div>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              同时，您还有以下风险，但是建议您不用过多关注，建议您解决第一种风险之后，再关注下面风险：
            </p>
            
            <Collapsible open={isSecondaryRisksOpen} onOpenChange={setIsSecondaryRisksOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-gray-600 border-gray-300 hover:bg-gray-50 mb-3"
                >
                  <span>{isSecondaryRisksOpen ? '收起' : '展开'}次要风险详情</span>
                  <ChevronDown 
                    className={`w-3 h-3 ml-1 transition-transform duration-200 ${
                      isSecondaryRisksOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="space-y-3">
                  {/* 重疾风险 */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-800">重疾风险</p>
                      {isMember && (
                        <Button
                          size="sm"
                          className="text-xs text-gray-600 border-0 px-2 py-1 h-6"
                          style={{ backgroundColor: '#E7FBFB' }}
                          onClick={() => handleViewAssessmentBasis('重疾风险')}
                        >
                          查看测评依据（会员专属）
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      由于您的资产数额仅够覆盖未来家庭大事的开支，这意味着一旦家庭成员罹患重疾，可能会面临"没钱看病"或"因收入中断而影响家庭大事"的风险。
                    </p>
                  </div>
                  
                  {/* 意外风险 */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-800">意外风险</p>
                      {isMember && (
                        <Button
                          size="sm"
                          className="text-xs text-gray-600 border-0 px-2 py-1 h-6"
                          style={{ backgroundColor: '#E7FBFB' }}
                          onClick={() => handleViewAssessmentBasis('意外风险')}
                        >
                          查看测评依据（会员专属）
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      由于您的资产数额仅够覆盖未来家庭大事的开支，这意味着一旦家庭成员遭遇意外事故，可能会面临"没钱治疗"或"因收入中断而影响家庭大事"的风险。
                    </p>
                  </div>
                  
                  {/* 不当消费风险 */}
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-1">不当消费风险</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      这种风险主要源于您此前设定的生活品质目标并非最高标准。如果未来您对生活品质的要求有所提升，现有资产可能难以满足这些新增需求。
                    </p>
                  </div>
                  
                  {/* 不当举债风险 */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-800">不当举债风险</p>
                      {isMember && (
                        <Button
                          size="sm"
                          className="text-xs text-gray-600 border-0 px-2 py-1 h-6"
                          style={{ backgroundColor: '#E7FBFB' }}
                          onClick={() => handleViewAssessmentBasis('不当举债风险')}
                        >
                          查看测评依据（会员专属）
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      不当举债有两层含义，一是超出家庭偿债能力的负债行为，二是为他人或企业担保造成的或有负债超出家庭偿付能力。
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>

      {/* 完成按钮 */}
      <div className="flex justify-center">
        <Button
          onClick={onComplete}
          className="w-full text-gray-800 px-8 py-2"
          style={{ backgroundColor: '#BFF6F8' }}
        >
          我已了解，继续下一步
        </Button>
      </div>
    </div>
  );
};

export default PotentialRisks;
