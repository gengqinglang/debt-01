
import React, { useState } from 'react';
import { MessageCircle, HelpCircle, AlertTriangle, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import ContentMask from '@/components/membership/ContentMask';

interface SnapshotInsightsForNewPageProps {
  isMember?: boolean;
  currentTab?: string;
  currentPlanningTab?: string;
  currentRiskTab?: string;
  currentToolsTab?: string;
}

// 独立的快照解读组件 - 不依赖外部组件，移除"我们的建议"模块
const SnapshotInsightsForNewPage: React.FC<SnapshotInsightsForNewPageProps> = ({ 
  isMember = false,
  currentTab,
  currentPlanningTab,
  currentRiskTab,
  currentToolsTab
}) => {
  const [isSecondaryRisksOpen, setIsSecondaryRisksOpen] = useState(false);

  return (
    <div className="space-y-6">
      <ContentMask
        memberOnly={true}
        maskType="hide"
        upgradePrompt={{
          title: "财富分型解读 - 会员专享",
          description: "升级会员解锁专业的财富分型解读和深度分析",
          feature: "财富分型详解、风险分析、成因解读"
        }}
        currentTab={currentTab}
        currentPlanningTab={currentPlanningTab}
        currentRiskTab={currentRiskTab}
        currentToolsTab={currentToolsTab}
      >
        <div 
          className="rounded-xl p-8 space-y-8 border border-[#B3EBEF]/20 shadow-sm"
          style={{ backgroundColor: 'rgba(179, 235, 239, 0.05)' }}
        >
          {/* 模块1：这种财富分型意味着什么？ */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-6">一、这种财富分型意味着什么？</h4>
            <div className="space-y-4">
              <p className="text-base text-gray-800 leading-relaxed">
                您的财富分型属于中度压缩型。这意味着，当前的财务规划存在较大问题，必须对生活目标和支出计划进行大幅调整，才能避免未来的财务困境。
              </p>
              
              <p className="text-base text-gray-700 leading-relaxed mt-4">具体来说：</p>
              
              <p className="text-base text-gray-700 leading-relaxed">
                <span className="font-medium">住房改善计划：</span>不得不搁置，只能维持现状。
              </p>
              
              <p className="text-base text-gray-700 leading-relaxed">
                <span className="font-medium">生活品质提升：</span>原本计划升级的生活方式需要暂停，比如减少或取消非必要消费。
              </p>
              
              <p className="text-base text-gray-700 leading-relaxed">
                <span className="font-medium">日常开销削减：</span>像周末聚会、健身房会员、高端护肤品等享受型支出需要大幅缩减；人情往来、家政服务等频次也需降低。
              </p>
              
              <p className="text-base text-gray-700 leading-relaxed">
                <span className="font-medium">大额消费梦想：</span>如购买心仪已久的奢侈品、规划海外旅行等，可能需要彻底放弃。
              </p>
              
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                这些调整虽然会显著降低生活的舒适度和幸福感，但却是帮助您渡过财务难关的必要措施。
              </p>
            </div>
          </div>

          {/* 模块 2：为什么您是这种类型？ */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-6">二、为什么您是这种类型？</h4>
            <div className="space-y-4">
              <p className="text-base text-gray-700 leading-relaxed">
                出现这种情况的原因，可以从以下两种主要情形分析：
              </p>
              
              <p className="text-base text-gray-800 font-medium leading-relaxed mt-6">第一种情况：科学规划下的收支失衡</p>
              <p className="text-base text-gray-700 leading-relaxed">
                如果您对人生大事的规划已经经过审慎思考，并且相关金额估算较为准确，那么收支失衡的主要原因可能包括以下几点：
              </p>
              
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                <span className="font-medium">1、现有资产虽多，但不足以支撑未来需求</span>
              </p>
              <p className="text-base text-gray-700 leading-relaxed">
                您目前拥有1000万元可支配资产，但未来刚性支出需求高达3000万元，存在2000万元的资金缺口。尽管年轻时已拥有远超同龄人的资产，但仍需通过未来收入持续填补缺口。
              </p>
              
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                <span className="font-medium">2、被动收入受经济环境影响，难以弥补缺口</span>
              </p>
              <p className="text-base text-gray-700 leading-relaxed">
                在当前低利率环境下，投资收益预期下降（如1年期国债收益率降至1.8%，银行理财收益率跌破3%）。以2%的稳健收益率测算，被动收入仅能覆盖部分缺口，仍存在较大资金压力。
              </p>
              
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                <span className="font-medium">3、主动收入增长虽乐观，但难以完全填补差额</span>
              </p>
              <p className="text-base text-gray-700 leading-relaxed">
                根据您的职业信息和发展预期，系统预测未来家庭总收入可达1200万元（个人600万+配偶600万），但面对2000万元的总资金缺口，仍存在500万元的不足。
              </p>
              
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                <span className="font-medium">4、资产积累模式的延续性存疑</span>
              </p>
              <p className="text-base text-gray-700 leading-relaxed">
                年轻时拥有的高资产通常来源于外部因素，例如：
              </p>
              <p className="text-base text-gray-700 leading-relaxed">
                家庭财富转移：父母赠与房产、存款或遗产继承；特殊领域创收：如体育明星、网红主播等通过专业能力快速积累财富；偶发性收入：如中彩票、高额奖学金、拆迁补偿等；地域政策红利：特定地区的低价购房指标或土地增值机会。
              </p>
              <p className="text-base text-gray-700 leading-relaxed">
                这些因素具有不可控性和不可持续性，无法纳入长期收入规划。
              </p>
              
              <p className="text-base text-gray-800 font-medium leading-relaxed mt-6">第二种情况：规划不够审慎</p>
              <p className="text-base text-gray-700 leading-relaxed">
                如果您的规划缺乏深入思考，可能源于以下原因：1、对人生大事的复杂性估计不足，缺乏生活阅历；2、缺乏对各类开支的量化工具和物价数据，未能准确预判支出金额；3、测评填写时未依据实际情况，导致严重偏差。
              </p>
              
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                无论是科学规划下的收支失衡，还是因思考不足导致的偏差，都反映了「主观预期」与「专业量化」之间的显著差距。若不及时调整，最终将陷入支出压缩的困境。
              </p>
            </div>
          </div>

          {/* 模块 3：风险揭示 */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-6">三、您存在的潜在风险有哪些？</h4>
            
            <div className="space-y-4">
              <p className="text-base text-gray-700 leading-relaxed">
                您面临<span className="font-medium text-gray-800">5种潜在风险</span>，分别是：规划改动风险、重疾风险、意外风险、不当消费风险、不当举债风险。
              </p>
              
              <p className="text-base text-gray-800 font-medium leading-relaxed mt-6">
                重点提示：规划改动风险——取消改善房计划
              </p>
              <p className="text-base text-gray-700 leading-relaxed">
                由于当前财务状况紧张，改善居住环境、提升生活品质的计划将被迫长期搁置。同时，日常消费结构也需要大幅压缩，这可能导致生活便利性和舒适度下降，产生较大的心理落差。尽管这些调整是缓解财务压力的必要手段，但您需要充分评估由此带来的生活方式改变，并审慎决策后续资金安排。
              </p>
              
              <p className="text-base text-gray-700 leading-relaxed mt-4">
                其他风险（如重疾、意外等）建议您优先解决规划改动风险后，再逐步关注。
              </p>
              
              <p className="text-base text-gray-800 font-medium leading-relaxed mt-6">总结与建议</p>
              <p className="text-base text-gray-700 leading-relaxed">
                综上所述，无论是收支失衡的根本原因，还是潜在风险的应对策略，都需要您重新审视当前的财务规划，并借助专业工具优化支出结构，缩小认知鸿沟，实现长期财务平衡。
              </p>
              
            </div>
          </div>
        </div>
      </ContentMask>
    </div>
  );
};

SnapshotInsightsForNewPage.displayName = 'SnapshotInsightsForNewPage';

export default SnapshotInsightsForNewPage;
