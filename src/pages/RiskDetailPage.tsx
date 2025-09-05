import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { TrendingDown, UserX, RotateCcw, Heart, Zap, ShoppingCart, TrendingUp, Droplets, Clock, Gift, CreditCard } from 'lucide-react';
import RiskDetailCard from '@/components/asset-freedom/components/RiskDetailCard';

const RiskDetailPage: React.FC = () => {
  const { riskId } = useParams<{ riskId: string }>();
  const location = useLocation();
  const { fromSecondaryRisk } = location.state || {};

  // Define risk data with icons locally - added improper-investment
  const getRiskData = (id: string) => {
    const riskDataMap = {
      'asset-liquidity-risk': {
        id: 'asset-liquidity-risk',
        name: "资产流动性风险",
        icon: Droplets,
        summary: "或有风险",
        description: `提醒您注意资产流动性风险，原因在于分析您目前的资产组合后发现，金融资产不足以覆盖未来三年的预期支出。这表明，除非调整您的开支计划，否则可能需要通过出售房产或其他固定资产来应对。鉴于实物资产的销售受市场状况和价格波动的影响，存在无法在合理期限内以合理价格变现的风险，或者在变现过程中可能会导致资产价值下降，从而影响您的资金流动性。因此，我们有必要预先告知您这种风险的可能性。`,
        descriptionButtonText: "查看测评依据",
        actionTitle: "立即行动，保障资金流动性",
        actionDescription: [
          "建议立刻行动，联系专业理财经理，结合系统给出的赎回任务清单，对现有资产进行全面诊断，明确可承受的投资风险等级与资金使用期限；",
          "针对房产等难变现资产，设定合理出售价位，关注市场动态，必要时果断出手。",
          "同时，严格按系统赎回任务处理到期或不达标的投资产品，及时回笼资金；定期检查资产配置，避免缺钱时手忙脚乱。"
        ],
        actionButtonText: "查看资产赎回任务"
      },
      'asset-liquidity-risk-contingent': {
        id: 'asset-liquidity-risk-contingent',
        name: "资产流动性风险",
        icon: Droplets,
        summary: "或有风险",
        description: `提醒您关注资产流动性风险。根据现金流分析，未来三年内，您存在收入不足以覆盖家庭支出的情况，需要动用家庭原有资产来填补开支缺口。虽然您目前的金融资产足以弥补这一差额，但由于仅记录了资产总额，我们尚不清楚这些资金具体投资于哪些产品，也不了解相关产品的到期时间。因此，在您需要用钱时，我们无法确定您是否能够及时获取这笔资产。本着对您负责的态度，我们有必要向您提示这一潜在风险，以便您提前做好应对准备，从而确保支出计划能够如期实现。`,
        descriptionButtonText: "查看测评依据",
        actionTitle: "立即行动，保障资金流动性",
        actionDescription: [
          "建议您根据我们给出的赎回任务，对照家庭金融资产的具体到期日进行核对，看看是否匹配？如果是高风险产品如基金、三级以上理财产品需要格外注意，因为即便产品可以赎回，但也要关注一下是否会出现本金或收益损失。如果您觉得自己搞不清，可以立刻行动，联系专业理财经理，结合系统给出的赎回任务清单，对现有资产进行一次全面检视，充分评估是否会出现此种风险，并提前做好预案。"
        ],
        actionButtonText: "查看赎回任务"
      },
      'improper-investment': {
        id: 'improper-investment',
        name: "不当投资",
        icon: TrendingDown,
        summary: "投资风险不明，或致财富缩水",
        description: `提醒您关注不当投资风险。不当投资可能导致超出自身损失承受底线引发财富缩水，甚至因资金缺口打破财务平衡，重新陷入收入依赖。由于您仅记录了资产总额，我们尚不清楚这些资金具体投资于哪些产品，因此也不了解相关产品的风险情况。所以无法确定您是否会因为投资这些产品而引发风险。本着对您负责的态度，我们有必要向您提示这一潜在风险，以便您提前做好应对准备，从而确保支出计划能够如期实现。`,
        descriptionButtonText: "",
        actionTitle: "理性投资，控制风险",
        actionDescription: [
          "建议您梳理一下家庭资产的投资去向，若已持有中高风险投资产品，建议联系理财经理，做一次深入的资产检视，动态跟踪产品运作情况调整投资策略，防范潜在损失。",
          "如产品出现亏损，请即可更新资产负债重新测评，获取新的财富分型，以判断是否对家庭未来生活造成了影响。",
          "如果您手头的资金尚未投资，建议您投资前参考系统给出的现金流预测，根据攒钱建议的时间和金额进行产品遴选，并做好风险控制。"
        ],
        actionButtonText: "更新资产负债"
      },
      'layoff-salary-cut': {
        id: 'layoff-salary-cut',
        name: "裁员降薪",
        icon: UserX,
        summary: "收入单一，遇变动易失衡",
        description: `家庭收入单靠工资奖金，就像独木支撑大厦。行业寒冬，企业裁员、AI抢岗，都可能影响依赖收入来源。但房贷、教育、医疗账单仍如潮水涌来，积蓄难以消耗。若无法及时"回血"，偶发危机一触即发，生活品质崩塌，未来规划全泡汤。`,
        descriptionButtonText: "查看测评依据",
        actionTitle: "职场避险：技能、副业、行业三策略",
        actionDescription: [
          "为避免单点风险，清淤业技能，项目管理等通用技能，学习AI工具等新技能；",
          "发展副业：根据自身特长开展副业，如自媒体、设计接单、电商带货等，增加收入来源；",
          "关注行业：定期了解行业动态，若发现行业前景不佳，缺乏发展空间时，提前规划转型方向。"
        ],
        actionButtonText: "重做职业生涯规划"
      },
      'plan-changes': {
        id: 'plan-changes',
        name: "规划变动",
        icon: RotateCcw,
        summary: "人生计划变，钱不够用",
        description: "由于您目前的规划中尚未涵盖所有可能的人生大事，如果未来您的想法发生变化，希望增加的目标或需求（如购房、结婚、育儿、赡养等），可能会出现资产不足的风险。",
        descriptionButtonText: "查看测评依据",
        actionTitle: "未雨绸缪，现在规划未来",
        actionDescription: [
          `别等未来目标变了才着急！建议您现在就可以重新过一遍「财富快照」，把您纠结的诸如买房、结婚、养娃这些人生大事拎出来测一测，看看钱包扛不扛得住？要是发现钱不够用，更要警惕不要发生规划变动，每年雷打不动做一次复盘，像升级打怪一样及时调整策略，才能稳稳接住未来的各种挑战！`
        ],
        actionButtonText: "重选人生大事"
      },
      'serious-illness': {
        id: 'serious-illness',
        name: "重疾风险",
        icon: Heart,
        summary: "大病来袭，家庭易陷困境",
        description: `由于您的资产数据仅覆盖未来某天某家庭大事的开支，这意味着一旦家庭成员罹患重疾，可能全面"资金春霜"或"倒入中断的家庭大事"的风险。单如果您已经获得了保险信息，所以无法确认是否已足额。`,
        descriptionButtonText: "查看测评依据",
        actionTitle: "保险保障，守护家庭安全",
        actionDescription: [
          "为确保万无一失，建议进行一次保单检视，以全面了解保障情况，并根据需要补充完善，确保家庭在疾病风险下不受意外冲击。"
        ],
        actionButtonText: "查看家庭风险保障方案"
      },
      'accident-risk': {
        id: 'accident-risk',
        name: "意外风险",
        icon: Zap,
        summary: "意外无常，保障需到位",
        description: `由于您的资产数据仅覆盖未来某天某家庭大事的开支，这意味着一旦家庭成员遭遇意外，可能全面"资金春霜"或"倒入中断的家庭大事"的风险。单如果您已经获得了保险信息，所以无法确认是否已足额。`,
        descriptionButtonText: "查看测评依据",
        actionTitle: "意外保障，防范未然",
        actionDescription: [
          "为确保万无一失，建议进行一次保单检视，以全面了解保障情况，并根据需要补充完善，确保家庭在意外风险下不受意外冲击。"
        ],
        actionButtonText: "查看家庭风险保障方案"
      },
      'longevity-risk': {
        id: 'longevity-risk',
        name: "长寿风险",
        icon: Clock,
        summary: "寿命延长，资产不足",
        description: `所谓长寿风险，是指当您的寿命超过当前预定寿命后，可能出现资产无法支撑后续生活开支的情况。随着人均寿命延长，人生百岁不是梦想，但养老所需资金的使用时间也会相应变长，若未提前做好规划和储备，退休后极易出现现金流缺口，进而影响生活质量或医疗保障等方面。我们提醒您这一风险，源于对您家庭未来现金流进行测算后发现，您的资产不足以支撑百岁人生，提醒您关注并提前做好应对准备。`,
        descriptionButtonText: "查看测评依据",
        actionTitle: "长寿规划，未雨绸缪",
        actionDescription: [
          "建议您用系统预设的长寿风险测评工具，算算具体多少岁钱不够用，如果您家族有长寿基因，建议您及早规划对抗长寿风险。",
          "如果您担心该风险，常见且有效的方案是趁年轻通过购买年金险进行风险转移，您可先查看系统给出的现金流情况，并咨询专业顾问确定投保方案；",
          "若超出年龄无法通过投保转移或暂时没有资金购买，可根据自己对长寿的预期，及时调整现有规划，平衡资产配置与资金使用，确保未来生活开支有充足保障。"
        ],
        actionButtonText: "长寿风险测评"
      },
      'improper-consumption': {
        id: 'improper-consumption',
        name: "不当消费",
        icon: ShoppingCart,
        summary: "花钱无度，财务易失控",
        description: "不当消费风险是指，一是超出家庭实际承受能力的消费，二是为他人或企业过度消费。若您的消费支出未能兼顾储蓄/借贷能力，可能导致家庭财务状况恶化甚至债务危机。",
        descriptionButtonText: "查看测评依据",
        actionTitle: "理性消费，掌控财务",
        actionDescription: [
          `提前做好预算规划与日常记账管理把控好关键钱，就像为人生目标划清航行的路线图，让每一笔消费都在掌控之中。而合理的消费习惯还能帮助您保持健康的"体检位"，帮助您精准管控资金流向，防范财务风险。`
        ],
        actionButtonText: "储蓄任务"
      },
      'improper-inheritance': {
        id: 'improper-inheritance',
        name: "不当传承",
        icon: Gift,
        summary: "过度资助，影响家庭目标",
        description: "我们所说的不当传承风险，是指超出自身资产实力资助他人，可能导致家庭既定大事（如购房、教育等）无法实现的风险。虽然您的资产可覆盖未来家庭开支并有盈余，但若资助超出盈余范围，可能影响家庭目标的实现。",
        descriptionButtonText: "",
        actionTitle: "合理规划，保障家庭",
        actionDescription: [
          "建议优先保障家庭计划的资金需求，合理规划资助额度，避免因过度资助导致既定大事落空。"
        ],
        actionButtonText: "查看资助能力"
      },
      'improper-debt': {
        id: 'improper-debt',
        name: "不当举债",
        icon: CreditCard,
        summary: "超出偿债能力的负债风险",
        description: "不当举债有两层含义，一是超出家庭偿债能力的负债行为，二是为他人或企业担保造成的或有负债超出家庭偿付能力，由此带来的影响家庭既定大事实现的风险。",
        descriptionButtonText: "查看测评依据",
        actionTitle: "理性举债，控制风险",
        actionDescription: [
          "不当举债风险的发生和资产数额的高低并没有直接关系，高资产的人如果不当举债也会出现风险，识别风险的关键在于判断合理的负债能力。因此负债前一定要做好负债能力的评估更为关键。"
        ],
        actionButtonText: "查看负债能力评估"
      }
    };

    return riskDataMap[id as keyof typeof riskDataMap] || null;
  };

  const riskData = riskId ? getRiskData(riskId) : null;

  if (!riskData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">风险详情未找到</h2>
          <p className="text-gray-600">请返回重新选择风险项目</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen">
        <RiskDetailCard risk={riskData} fromSecondaryRisk={fromSecondaryRisk} />
      </div>
    </div>
  );
};

export default RiskDetailPage;
