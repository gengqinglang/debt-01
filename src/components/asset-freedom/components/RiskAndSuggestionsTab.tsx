import React, { useState, useCallback, useMemo, useReducer } from 'react';
import { Separator } from '@/components/ui/separator';
import { TrendingDown, Calendar, Heart, Zap, ShoppingCart, CreditCard, Briefcase, UserX, RotateCcw, AlertTriangle, DollarSign, TrendingUp, Droplets, Clock, Gift } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import MainRiskCard from './MainRiskCard';
import SecondaryRiskItem from './SecondaryRiskItem';
import RiskNavigationTabs from './RiskNavigationTabs';
import ContentMask from '@/components/membership/ContentMask';
import { useNavigationState } from '@/hooks/useNavigationState';
import { SharedInsightsContent } from './SharedInsightsContent';

// 使用reducer简化状态管理
interface RiskState {
  isMainRiskExpanded: boolean;
  isActionExpanded: boolean;
  activeRiskTab: string;
  expandedRisks: { [key: number]: { description: boolean; action: boolean } };
}

type RiskAction = 
  | { type: 'TOGGLE_MAIN_RISK' }
  | { type: 'TOGGLE_ACTION' }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'TOGGLE_RISK_EXPANSION'; payload: { index: number; type: 'description' | 'action' } };

const riskReducer = (state: RiskState, action: RiskAction): RiskState => {
  switch (action.type) {
    case 'TOGGLE_MAIN_RISK':
      return { ...state, isMainRiskExpanded: !state.isMainRiskExpanded };
    case 'TOGGLE_ACTION':
      return { ...state, isActionExpanded: !state.isActionExpanded };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeRiskTab: action.payload };
    case 'TOGGLE_RISK_EXPANSION':
      return {
        ...state,
        expandedRisks: {
          ...state.expandedRisks,
          [action.payload.index]: {
            ...state.expandedRisks[action.payload.index],
            [action.payload.type]: !state.expandedRisks[action.payload.index]?.[action.payload.type]
          }
        }
      };
    default:
      return state;
  }
};

interface RiskAndSuggestionsTabProps {
  initialActiveRiskTab?: string;
  isMember?: boolean;
  showActionButtons?: boolean;
  currentTab?: string;
  currentRiskTab?: string;
  currentPlanningTab?: string;
  currentToolsTab?: string;
  pageMode?: 'member-severe-shortage' | 'member-liquidity-tight' | 'member-balanced' | 'public-severe-shortage' | 'public-liquidity-tight' | 'public-balanced';
}

const RiskAndSuggestionsTab = React.memo<RiskAndSuggestionsTabProps>(({ 
  initialActiveRiskTab = 'main-risk',
  isMember = false,
  showActionButtons = true,
  currentTab = 'risk',
  currentRiskTab,
  currentPlanningTab,
  currentToolsTab,
  pageMode = 'public-balanced'
}) => {
  console.log('[RiskAndSuggestionsTab] Component rendering...');
  
  // 根据pageMode调整初始activeTab
  const getInitialActiveTab = () => {
    if (pageMode === 'member-balanced') {
      return 'family-risks'; // 会员-平状态默认显示"家庭面临风险"
    }
    return initialActiveRiskTab;
  };

  const [state, dispatch] = useReducer(riskReducer, {
    isMainRiskExpanded: false,
    isActionExpanded: false,
    activeRiskTab: getInitialActiveTab(),
    expandedRisks: {}
  });

  // 添加弹窗状态管理
  const [showGapWarningDialog, setShowGapWarningDialog] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { navigateWithState } = useNavigationState();

  // 处理"获取调缺方案"按钮点击
  const handleGetGapSolution = useCallback(() => {
    console.log('[RiskAndSuggestionsTab] 获取调缺方案按钮点击');
    setShowGapWarningDialog(false);
    // 导航到调缺方案页面
    navigate('/adjustment-solution', {
      state: {
        activeTab: 'risk',
        activeRiskTab: 'secondary-risk',
        sourceModule: 'gap-warning-dialog',
        pageMode: pageMode
      }
    });
  }, [navigate, pageMode]);

  const handleViewAssessmentBasis = useCallback(() => {
    if (!isMember) {
      toast({
        title: "会员专享功能",
        description: "请升级会员后使用此功能"
      });
      return;
    }
    console.log('[RiskAndSuggestionsTab] Navigate to future wealth prediction');
    navigateWithState('/future-wealth-prediction', {
      activeTab: 'risk',
      activeRiskTab: state.activeRiskTab,
      sourceModule: 'risk-assessment-basis'
    });
  }, [navigateWithState, isMember, toast, state.activeRiskTab]);

  const handleEnterAdjustmentModule = useCallback(() => {
    if (!isMember) {
      toast({
        title: "会员专享功能", 
        description: "请升级会员后使用此功能"
      });
      return;
    }
    console.log('[RiskAndSuggestionsTab] Enter adjustment module');
    toast({
      title: "即将跳转",
      description: "正在为您准备调缺模块..."
    });
  }, [toast, isMember]);

  // 次要风险数据 - 按会员-平状态家庭面临风险的顺序：重疾/意外风险、重疾风险、意外风险、裁员降薪、房产贬值、投资收益下降风险、通货膨胀、长寿风险
  const allSecondaryRisks = useMemo(() => [
    {
      id: 'critical-illness-accident',
      name: "重疾/意外风险",
      icon: Heart,
      summary: "大病意外，家庭易陷困境",
      description: `由于您的资产数据仅覆盖未来某些家庭大事的开支，这意味着一旦家庭成员罹患重疾或遭遇意外，可能面临"资金紧张"或"影响既定家庭大事"的风险。虽然您可能已经拥有保险保障，但我们无法确认保障是否充足。为确保万无一失，建议进行一次全面的保障检视。`,
      descriptionButtonText: "查看测评依据",
      actionTitle: "保险保障，守护家庭安全",
      actionDescription: [
        "建议进行一次保单检视，以全面了解保障情况，并根据需要补充完善，确保家庭在疾病和意外风险下不受冲击。",
        "针对重疾风险，建议配置充足的重疾险保额，覆盖治疗费用和收入损失；",
        "针对意外风险，建议配置意外险和意外医疗险，提供全方位保障。"
      ],
      actionButtonText: "查看家庭风险保障方案"
    },
    {
      id: 'asset-liquidity-risk',
      name: "资产流动性风险",
      icon: Droplets,
      summary: "资产不足，需卖房应急",
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
    {
      id: 'asset-liquidity-risk-contingent',
      name: "资产流动性风险-或有",
      icon: Droplets,
      summary: "资产够用，但到期不明",
      description: `提醒您关注资产流动性风险。根据现金流分析，未来三年内，您存在收入不足以覆盖家庭支出的情况，需要动用家庭原有资产来填补开支缺口。虽然您目前的金融资产足以弥补这一差额，但由于仅记录了资产总额，我们尚不清楚这些资金具体投资于哪些产品，也不了解相关产品的到期时间。因此，在您需要用钱时，我们无法确定您是否能够及时获取这笔资产。本着对您负责的态度，我们有必要向您提示这一潜在风险，以便您提前做好应对准备，从而确保支出计划能够如期实现。`,
      descriptionButtonText: "查看测评依据",
      actionTitle: "立即行动，保障资金流动性",
      actionDescription: [
        "建议您根据我们给出的赎回任务，对照家庭金融资产的具体到期日进行核对，看看是否匹配？如果是高风险产品如基金、三级以上理财产品需要格外注意，因为即便产品可以赎回，但也要关注一下是否会出现本金或收益损失。如果您觉得自己搞不清，可以立刻行动，联系专业理财经理，结合系统给出的赎回任务清单，对现有资产进行一次全面检视，充分评估是否会出现此种风险，并提前做好预案。"
      ],
      actionButtonText: "查看赎回任务"
    },
    {
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
    {
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
    {
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
    {
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
      actionButtonText: "查看未来随便花的钱"
    },
    {
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
    },
    {
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
    {
      id: 'plan-changes',
      name: "规划变动",
      icon: RotateCcw,
      summary: "人生计划变，钱不够用",
      description: "由于您目前的规划中尚未涵盖所有可能的人生大事，如果未来您的想法发生变化，希望增加的目标或需求（如购房、结婚、育儿、赡养等），可能会出现资产不足的风险。",
      descriptionButtonText: "查看测评依据",
      actionTitle: "未雨绸缪，现在规划未来",
      actionDescription: [
        `别等未来未雨绸缪才着急！现在就可以重新梳理一遍「人生快照」，把买房、结婚、养娃这些人生大事考虑出来，看看钱包扛得住不住？要是发现预算不够，则要根据需求及时规划变动，每年都打个小算盘，像升级软件一样及时调整目标和储蓄。`
      ],
      actionButtonText: "重新规划人生"
    },
    {
      id: 'marriage-changes',
      name: "婚姻变动",
      icon: Heart,
      summary: "婚姻变化，财务需重新规划",
      description: "婚姻变动风险是指由于结婚、离婚等婚姻状况变化，导致家庭财务结构发生重大调整的风险。婚姻状况的改变可能影响收入来源、支出结构、资产归属和财务目标，需要重新评估和调整财务规划。特别是在离婚情况下，可能面临财产分割、抚养费支付等额外财务负担。",
      descriptionButtonText: "查看测评依据",
      actionTitle: "婚姻规划，财务先行",
      actionDescription: [
        "建议在婚姻状况发生变化前，提前做好财务规划和风险评估；",
        "制定婚前财产协议或离婚财产分割预案，明确资产归属；",
        "定期审视和调整家庭财务目标，确保规划与实际情况匹配；",
        "考虑购买相关保险产品，如人寿保险等，为家庭变动提供保障。"
      ],
      actionButtonText: "婚姻财务规划建议"
    },
    {
      id: 'longevity-risk',
      name: "长寿风险",
      icon: Clock,
      summary: "寿命延长，资产不足",
      description: `测算显示，您的资产不足以支撑百岁人生，需要提前做好应对准备。根据家庭现金流测算，伴侣活到88岁（本人84岁）时，家庭就会面临现金流缺口问题。随着人均寿命延长，人生百岁不是梦想，但养老所需资金的使用时间也会相应变长，若未提前做好规划和储备，退休后极易出现现金流缺口，进而影响生活质量或医疗保障等方面。`,
      descriptionButtonText: "查看测评依据",
      actionTitle: "长寿规划，未雨绸缪",
      actionDescription: [
        "建议您用系统预设的长寿风险测评工具，算算具体多少岁钱不够用，如果您家族有长寿基因，建议您及早规划对抗长寿风险。常见且有效的方案是趁年轻通过购买年金险进行风险转移，您可先查看系统给出的现金流情况，并咨询专业顾问确定投保方案；若超出年龄无法通过投保转移或暂时没有资金购买，可根据自己对长寿的预期，及时调整现有规划，平衡资产配置与资金使用，确保未来生活开支有充足保障。"
      ],
      actionButtonText: "查看长寿风险测评工具"
    },
    {
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
    {
      id: 'inflation-risk',
      name: "通货膨胀风险",
      icon: TrendingUp,
      summary: "通胀侵蚀，购买力下降",
      description: `通货膨胀风险是指由于物价持续上涨，导致家庭资产的实际购买力不断下降的风险。虽然您目前的资产可以覆盖既定的家庭开支，但如果通胀率超过预期，同样的资产在未来可能无法购买到同等价值的商品和服务，从而影响生活质量和既定规划的实现。特别是在长期规划中，通胀的累积效应可能显著侵蚀资产价值。`,
      descriptionButtonText: "查看测评依据",
      actionTitle: "抗通胀配置，保值增值",
      actionDescription: [
        "建议适当配置抗通胀资产，如通胀保护债券、实物资产、股权类投资等，以对冲通胀风险；",
        "定期审视和调整投资组合，确保资产配置能够跑赢通胀；",
        "考虑将部分资产投资于具有定价权的优质企业股权，以分享经济增长红利。"
      ],
      actionButtonText: "查看抗通胀投资建议"
    },
    {
      id: 'property-depreciation-risk',
      name: "房产贬值风险",
      icon: TrendingDown,
      summary: "房价下跌，资产缩水",
      description: `房产贬值风险是指由于房地产市场波动、政策调整、区域发展变化等因素，导致房产价值下降，影响家庭总资产和财务规划的风险。由于房产通常占据家庭资产的重要比重，房产价值的大幅下跌可能显著影响家庭财务状况，特别是在需要变现房产时可能面临损失。`,
      descriptionButtonText: "查看测评依据",
      actionTitle: "分散投资，降低房产集中度",
      actionDescription: [
        "避免将过多资产集中在房地产上，适当分散投资到其他资产类别；",
        "关注房产所在区域的发展规划和市场趋势，及时评估房产价值；",
        "如房产占比过高，可考虑适当减持，将资金配置到更稳健的投资品种。"
      ],
      actionButtonText: "查看资产配置建议"
    },
    {
      id: 'investment-return-decline-risk',
      name: "投资收益下降风险",
      icon: TrendingDown,
      summary: "市场波动，收益不达预期",
      description: `投资收益下降风险是指由于市场环境变化、经济周期波动、投资标的表现不佳等因素，导致投资收益低于预期，影响家庭财务目标实现的风险。在低利率环境或经济下行周期中，传统的稳健投资可能难以提供足够的收益，而高风险投资又可能面临较大损失。`,
      descriptionButtonText: "查看测评依据",
      actionTitle: "优化配置，平衡风险收益",
      actionDescription: [
        "建立合理的资产配置组合，平衡安全性和收益性；",
        "定期审视投资组合表现，及时调整配置比例；",
        "避免过度集中投资，分散投资风险；",
        "根据市场环境变化，适时调整投资策略和预期收益率。"
      ],
      actionButtonText: "查看投资组合优化建议"
    }
  ], []);

  // 根据pageMode分组次要风险
  const { familyRisks, avoidRisks } = useMemo(() => {
    if (pageMode === 'member-balanced') {
      // 会员-平状态下的风险分组
      // 移动到"主动风险"的项目：资产流动性风险-或有、不当投资、不当传承、规划变动、婚姻变动、不当举债、不当消费
      const moveToAvoidRisks = ['asset-liquidity-risk-contingent', 'improper-investment', 'improper-inheritance', 'plan-changes', 'marriage-changes', 'improper-debt', 'improper-consumption'];
      
      // "被动风险"包含：重疾/意外风险、裁员降薪、房产贬值、投资收益下降风险、通货膨胀、长寿风险
      const familyRiskIds = ['critical-illness-accident', 'layoff-salary-cut', 'property-depreciation-risk', 'investment-return-decline-risk', 'inflation-risk', 'longevity-risk'];
      const familyRisks = familyRiskIds.map(id => allSecondaryRisks.find(risk => risk.id === id)).filter(Boolean);
      // "主动风险"包含指定的7个风险，资产流动性风险-或有排在第一位
      const avoidRisks = allSecondaryRisks.filter(risk => moveToAvoidRisks.includes(risk.id));
      
      return { familyRisks, avoidRisks };
    } else {
      // 其他状态保持原有的全部次要风险
      return { familyRisks: allSecondaryRisks, avoidRisks: [] };
    }
  }, [allSecondaryRisks, pageMode]);

  // 主要风险内容组件 - 传递导航参数
  const MainRiskContent = React.memo(() => (
    <div className="px-4 pt-4 pb-4 space-y-4">
      {isMember ? (
        <MainRiskCard
          onViewAssessmentBasis={handleViewAssessmentBasis}
          onEnterAdjustmentModule={handleEnterAdjustmentModule}
          currentActiveTab={currentTab}
          currentActiveRiskTab={state.activeRiskTab}
        />
      ) : (
        <ContentMask 
          memberOnly={true}
          maskType="disable"
          upgradePrompt={{
            title: "风险分析 - 会员专享",
            description: "深度风险分析和调缺方案",
            feature: "专业的风险评估和解决方案"
          }}
          currentTab={currentTab}
          currentPlanningTab={currentPlanningTab}
          currentRiskTab={currentRiskTab || state.activeRiskTab}
          currentToolsTab={currentToolsTab}
        >
          <MainRiskCard
            onViewAssessmentBasis={handleViewAssessmentBasis}
            onEnterAdjustmentModule={handleEnterAdjustmentModule}
            currentActiveTab={currentTab}
            currentActiveRiskTab={state.activeRiskTab}
          />
        </ContentMask>
      )}
    </div>
  ));

  MainRiskContent.displayName = 'MainRiskContent';

  // 次要风险内容组件 - 优化布局和间距
  const SecondaryRiskContent = React.memo(() => (
    <div className="bg-gray-50/30 min-h-screen">
      <div className="pt-4 pb-6">
        {familyRisks.map((risk, index) => (
          <SecondaryRiskItem
            key={index}
            risk={risk}
            isExpanded={state.expandedRisks[index]?.description || false}
            isActionExpanded={state.expandedRisks[index]?.action || false}
            onToggleExpansion={() => dispatch({ 
              type: 'TOGGLE_RISK_EXPANSION', 
              payload: { index, type: 'description' } 
            })}
            onToggleActionExpansion={() => dispatch({ 
              type: 'TOGGLE_RISK_EXPANSION', 
              payload: { index, type: 'action' } 
            })}
            isMember={isMember}
            showActionButtons={showActionButtons}
            currentActiveTab={currentTab}
            currentActiveRiskTab={currentRiskTab || state.activeRiskTab}
            currentTab={currentTab}
            currentPlanningTab={currentPlanningTab}
            currentRiskTab={currentRiskTab || state.activeRiskTab}
            currentToolsTab={currentToolsTab}
            pageMode={pageMode}
            onGapWarningClick={() => setShowGapWarningDialog(true)}
            riskModule="family-risks"
          />
        ))}
      </div>
    </div>
  ));

  SecondaryRiskContent.displayName = 'SecondaryRiskContent';

  // "提醒您规避可能导致风险的事件"内容组件
  const AvoidRisksContent = React.memo(() => (
    <div className="bg-gray-50/30 min-h-screen">
      <div className="pt-4 pb-6">
        {avoidRisks.map((risk, index) => (
          <SecondaryRiskItem
            key={index}
            risk={risk}
            isExpanded={state.expandedRisks[index]?.description || false}
            isActionExpanded={state.expandedRisks[index]?.action || false}
            onToggleExpansion={() => dispatch({ 
              type: 'TOGGLE_RISK_EXPANSION', 
              payload: { index, type: 'description' } 
            })}
            onToggleActionExpansion={() => dispatch({ 
              type: 'TOGGLE_RISK_EXPANSION', 
              payload: { index, type: 'action' } 
            })}
            isMember={isMember}
            showActionButtons={showActionButtons}
            currentActiveTab={currentTab}
            currentActiveRiskTab={currentRiskTab || state.activeRiskTab}
            currentTab={currentTab}
            currentPlanningTab={currentPlanningTab}
            currentRiskTab={currentRiskTab || state.activeRiskTab}
            currentToolsTab={currentToolsTab}
            pageMode={pageMode}
            onGapWarningClick={() => setShowGapWarningDialog(true)}
            riskModule="avoid-risks"
          />
        ))}
      </div>
    </div>
  ));

  AvoidRisksContent.displayName = 'AvoidRisksContent';

  // 根据pageMode和activeTab渲染不同内容
  const renderContent = () => {
    if (pageMode === 'member-balanced') {
      // 会员-平状态的特殊逻辑
      switch (state.activeRiskTab) {
        case 'family-risks':
          return <SecondaryRiskContent />; // 显示原次要风险内容
        case 'avoid-risks':
          return <AvoidRisksContent />; // 显示要避免的风险内容
        default:
          return <SecondaryRiskContent />;
      }
    } else if (pageMode === 'member-severe-shortage') {
      // 会员-没钱状态：在主要风险显示共用的洞见内容
      switch (state.activeRiskTab) {
        case 'main-risk':
          return (
            <div className="bg-gray-50/30 min-h-screen">
              <div className="pt-4 pb-6 px-4">
                <SharedInsightsContent
                  onViewAssessmentBasis={handleViewAssessmentBasis}
                  onAcceptSuggestions={() => {
                    console.log('[RiskAndSuggestionsTab] Accept suggestions clicked');
                    // 处理接受建议的逻辑
                  }}
                  onRejectSuggestions={() => {
                    console.log('[RiskAndSuggestionsTab] Reject suggestions clicked');
                    // 处理拒绝建议的逻辑
                  }}
                />
              </div>
            </div>
          );
        default:
          return <MainRiskContent />;
      }
    } else if (pageMode === 'member-liquidity-tight') {
      // 会员-融资购房状态：与会员-没钱状态内容一致
      switch (state.activeRiskTab) {
        case 'main-risk':
          return (
            <div className="bg-gray-50/30 min-h-screen">
              <div className="pt-4 pb-6 px-4">
                <SharedInsightsContent
                  onViewAssessmentBasis={handleViewAssessmentBasis}
                  onAcceptSuggestions={() => {
                    console.log('[RiskAndSuggestionsTab] Accept suggestions clicked');
                    // 处理接受建议的逻辑
                  }}
                  onRejectSuggestions={() => {
                    console.log('[RiskAndSuggestionsTab] Reject suggestions clicked');
                    // 处理拒绝建议的逻辑
                  }}
                />
              </div>
            </div>
          );
        default:
          return <MainRiskContent />;
      }
    } else {
      // 其他所有状态保持原有逻辑
      switch (state.activeRiskTab) {
        case 'main-risk':
          return <MainRiskContent />;
        case 'secondary-risk':
          return <SecondaryRiskContent />;
        default:
          return <MainRiskContent />;
      }
    }
  };

  console.log('[RiskAndSuggestionsTab] Rendering with activeRiskTab:', state.activeRiskTab);

  return (
    <>
      <div className="space-y-0">
        {/* 导航条 - 传递pageMode */}
        <RiskNavigationTabs 
          activeTab={state.activeRiskTab}
          onTabChange={(tab) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab })}
          pageMode={pageMode}
          familyRisksCount={familyRisks.length}
          avoidRisksCount={avoidRisks.length}
        />
        
        {/* 内容区域 */}
        <div>
          {renderContent()}
        </div>
      </div>

      {/* 收支失衡警告弹窗 */}
      <Dialog open={showGapWarningDialog} onOpenChange={setShowGapWarningDialog}>
        <DialogContent className="max-w-sm mx-auto bg-white border border-gray-200 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-gray-800 font-medium">
              风险测评提示
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              根据您未来的财务情况预测，您在未来年度仍存在收支失衡的问题，这表明您当前的规划尚有不合理之处，需要及时调整；需要说明的是，在您完成规划调整前，任何风险场景测评的结果都可能存在偏差，因此建议您参考系统提供的收支均衡建议，或使用智能调平工具优化规划，确保未来各年度均能实现收支平衡，待您的规划调整至收支平衡状态后，系统将自动为您开展风险测评。
            </p>
          </div>
          <DialogFooter className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setShowGapWarningDialog(false)}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              关闭
            </Button>
            <Button 
              onClick={handleGetGapSolution}
              className="flex-1 bg-[#B3EBEF] hover:bg-[#9FE6EB] text-gray-800 border-0"
            >
              获取调缺方案
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

RiskAndSuggestionsTab.displayName = 'RiskAndSuggestionsTab';

export default RiskAndSuggestionsTab;
