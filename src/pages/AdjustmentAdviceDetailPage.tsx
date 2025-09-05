import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigationState } from '@/hooks/useNavigationState';

const AdjustmentAdviceDetailPage = () => {
  const navigate = useNavigate();
  const { navigateBack } = useNavigationState();

  const handleBack = () => {
    navigateBack();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-gray-700" />
              <h1 className="text-xl font-bold text-gray-900">规划调整建议详情</h1>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* 标题 */}
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                规划调整建议背后的逻辑：如何用最小代价守住目标？
              </h2>
            </div>

            {/* 内容 */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                在收支规划调整的建议算法中，核心逻辑始终围绕 "以最少代价确保规划目标最大程度实现" 展开，所有调整策略均以您的利益最大化为出发点，在未明确您具体意愿前，为您提供当前场景下的最优解。
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                这一算法的设计思路，本质上是通过分层防御、优先级排序和柔性调整的方式，在保障核心目标的同时，最大限度降低您的执行难度和成本。具体而言，算法会优先选择对您的生活节奏和财务状态影响最小的解决方案。例如，当规划目标面临资金缺口时，算法会首先评估是否可通过金融手段或提前规划来化解 —— 若您有稳定的还款能力，会建议通过合理融资填补缺口；若缺口可通过提前储蓄覆盖，则会及时提醒您增加储备，而非直接调整既定的收支结构。这种思路的底层逻辑是：金融工具和前瞻性规划本身就是为平滑财务波动设计的，善用它们能避免收支规划的大幅变动，从而减少对您日常生活的干扰。
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                在需要增加收入以达成目标时，算法会优先选择门槛较低、灵活性更高的方式。比如，若您名下有闲置房产，算法会优先建议通过出租获取稳定现金流，而非直接要求您通过跳槽、加班等方式提高工资收入。这是因为房产出租属于对既有资源的合理利用，执行难度相对较低，且不会额外增加您的工作强度和时间成本；而工资收入的提升往往涉及职业发展、市场环境等多重不确定因素，对您的要求更高，可能带来更大的压力。这种优先级排序的核心，是在实现收入增长的同时，将您的行动成本和心理负担降到最低。
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                当目标确实无法按原计划推进时，算法会遵循 "柔性调整"原则，尽可能保留核心目标的实现可能性。具体来说，若目标因短期资金问题难以按时达成，算法会优先考虑延迟实现时间，而非直接取消，但这一延迟建议并非适用于所有情况，而是会严格依据目标的实际属性判断 —— 例如，孩子的入学时间、特定医疗手术的最佳治疗窗口等具有强时效性、无法延后的目标，算法绝不会给出延迟建议，避免因调整不当对您造成实质性损失。对于可延迟的目标，如将原本计划一年内完成的家庭装修推迟至两年后，以匹配资金积累节奏，则会积极提供延迟方案。若延迟仍无法解决问题，必须削减目标时，算法会按照 "非刚需优先" 的顺序进行调整：先取消旅游、购买奢侈品等非必要支出目标，再考虑缩减购房、教育、医疗、养老等刚性支出的预算。这种调整逻辑的本质，是在资源有限的情况下，通过牺牲次要利益来保全您的核心权益，确保规划的整体价值不受根本性损害。
              </p>

              <p className="text-gray-700 leading-relaxed">
                综上，这套算法始终以 "您的利益最大化" 为核心导向，借助分层防御、优先级排序与柔性调整等策略，在最大程度实现规划目标的同时，将您需付出的代价控制在最低水平，最终形成未明确您具体意愿前的最优方案。您也可以在此基础上融入个人想法进行调整，让规划既贴合自身需求，又更具合理性。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentAdviceDetailPage;