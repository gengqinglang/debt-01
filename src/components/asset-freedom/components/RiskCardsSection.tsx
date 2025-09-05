import React, { useMemo, useState } from 'react';
import { Heart, TrendingDown, UserMinus, TrendingUp, Clock, Droplets, ChevronRight, ChevronDown, HelpCircle, ChevronDown as ExpandIcon, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AgeGapDetailsComponent } from './AgeGapDetailsComponent';
import { LongevityAgeGapDetailsComponent } from './LongevityAgeGapDetailsComponent';
import { DeathAgeGapDetailsComponent } from './DeathAgeGapDetailsComponent';
import { CashFlowDeficitChart } from './CashFlowDeficitChart';
import { InlineCashFlowChart } from './InlineCashFlowChart';
import { InlineLongevityChart } from './InlineLongevityChart';

interface RiskCardsSectionProps {
  pageMode?: 'member-severe-shortage' | 'member-liquidity-tight' | 'member-balanced' | 'public-severe-shortage' | 'public-liquidity-tight' | 'public-balanced';
}

export const RiskCardsSection: React.FC<RiskCardsSectionProps> = ({ pageMode = 'public-balanced' }) => {
  const navigate = useNavigate();
  
  // 展开状态管理
  const [expandedRisks, setExpandedRisks] = useState<Set<string>>(new Set());
  const [expandedSubCard, setExpandedSubCard] = useState<string | null>(null);
  const [expandedByHelp, setExpandedByHelp] = useState<boolean>(false);
  const [timelineExpanded, setTimelineExpanded] = useState<boolean>(false);
  const [expandedTimelineItems, setExpandedTimelineItems] = useState<Set<number>>(new Set());
  const [deathTimelineExpanded, setDeathTimelineExpanded] = useState<boolean>(false);
  const [expandedDeathTimelineItems, setExpandedDeathTimelineItems] = useState<Set<number>>(new Set());
  const [longevityChartExpanded, setLongevityChartExpanded] = useState<boolean>(false);
  const [spouseCashFlowExpanded, setSpouseCashFlowExpanded] = useState(false);
  const [selfCriticalCashFlowExpanded, setSelfCriticalCashFlowExpanded] = useState(false);
  const [selfDeathCashFlowExpanded, setSelfDeathCashFlowExpanded] = useState(false);
  const [spouseDeathCashFlowExpanded, setSpouseDeathCashFlowExpanded] = useState(false);
  
  // 新增意外失能和意外死亡的展开状态
  const [selfAccidentDisabilityCashFlowExpanded, setSelfAccidentDisabilityCashFlowExpanded] = useState(false);
  const [selfAccidentDeathCashFlowExpanded, setSelfAccidentDeathCashFlowExpanded] = useState(false);
  const [spouseAccidentDisabilityCashFlowExpanded, setSpouseAccidentDisabilityCashFlowExpanded] = useState(false);
  const [spouseAccidentDeathCashFlowExpanded, setSpouseAccidentDeathCashFlowExpanded] = useState(false);
  const [childAccidentDisabilityCashFlowExpanded, setChildAccidentDisabilityCashFlowExpanded] = useState(false);
  const [childAccidentDeathCashFlowExpanded, setChildAccidentDeathCashFlowExpanded] = useState(false);

  const toggleSubCardExpansion = (cardId: string) => {
    setExpandedSubCard(expandedSubCard === cardId ? null : cardId);
  };

  // 定义7个风险，按会员-平状态家庭面临风险的顺序
  const familyRisks = useMemo(() => [
    {
      id: 'critical-illness-accident',
      name: "重疾/意外风险",
      icon: Heart,
      summary: "大病意外，家庭易陷困境",
      description: `由于您的资产数额仅够覆盖已规划家庭目标的开支，这意味着一旦家庭成员罹患重疾或者遭遇意外，可能会面临"没钱看病"或"因收入中断而影响家庭大事"的风险。当然，如果您已经购买了重疾保险，这可能在一定程度上起到风险转移的作用。但由于我们没有获取您的保险信息，所以无法确认现有保障是否充足。`,
      descriptionButtonText: "查看详情",
      actionTitle: "保险保障，守护家庭安全",
      actionDescription: [
        "建议进行一次保单检视，以全面了解保障情况，并根据需要补充完善，确保家庭在疾病和意外风险下不受冲击。",
        "针对重疾风险，建议配置充足的重疾险保额，覆盖治疗费用和收入损失；",
        "针对意外风险，建议配置意外险和意外医疗险，提供全方位保障。"
      ],
      actionButtonText: "查看家庭风险保障方案"
    },
    {
      id: 'asset-liquidity-risk-contingent',
      name: "资产流动性风险",
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
      id: 'layoff-salary-cut',
      name: "裁员降薪风险",
      icon: UserMinus,
      summary: "收入单一，遇变动易失衡",
      description: `家庭收入单靠工资奖金，就像独木支撑大厦。行业寒冬，企业裁员、AI抢岗，都可能影响依赖收入来源。但房贷、教育、医疗账单仍如潮水涌来，积蓄难以消耗。若无法及时"回血"，偶发危机一触即发，生活品质崩塌，未来规划全泡汤。`,
      descriptionButtonText: "查看测评依据",
      actionTitle: "职场避险：技能、副业、行业三策略",
      actionDescription: [
        "为避免单点风险，提升专业技能，项目管理等通用技能，学习AI工具等新技能；",
        "发展副业：根据自身特长开展副业，如自媒体、设计接单、电商带货等，增加收入来源；",
        "关注行业：定期了解行业动态，若发现行业前景不佳，缺乏发展空间时，提前规划转型方向。"
      ],
      actionButtonText: "重做职业生涯规划"
    },
    {
      id: 'property-depreciation-risk',
      name: "房产减值风险",
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
      name: "投资收益下行风险",
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
    }
  ], []);

  // 处理风险卡片点击事件
  const handleRiskClick = (riskId: string) => {
    if (riskId === 'critical-illness-accident' && expandedByHelp) {
      setExpandedByHelp(false);
    } else {
      const newExpandedRisks = new Set(expandedRisks);
      if (newExpandedRisks.has(riskId)) {
        newExpandedRisks.delete(riskId);
      } else {
        newExpandedRisks.add(riskId);
      }
      setExpandedRisks(newExpandedRisks);
    }
  };

  // 处理展开切换
  const handleExpandToggle = (riskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpandedRisks = new Set(expandedRisks);
    if (newExpandedRisks.has(riskId)) {
      newExpandedRisks.delete(riskId);
    } else {
      newExpandedRisks.add(riskId);
    }
    setExpandedRisks(newExpandedRisks);
  };

  // 处理问号点击，同时展开卡片
  const handleHelpClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpandedRisks = new Set(expandedRisks);
    newExpandedRisks.add('critical-illness-accident');
    setExpandedRisks(newExpandedRisks);
    setExpandedByHelp(true);
  };

  // 计算实际现金流缺口的工具函数
  const calculateActualGap = (age: number) => {
    // 现金流入计算
    const baseIncome = {
      salary: 400000 + (age - 30) * 5000, // 工资随年龄增长
      rent: 5000 + (age - 30) * 500,      // 房租随年龄增长
      housingFund: 2000 + (age - 30) * 100, // 公积金增长
      criticalIllnessInsurance: 0,   // 删除重疾险赔付
    };
    
    // 因为发生重疾失能，工资大幅减少
    baseIncome.salary = Math.round(baseIncome.salary * 0.3);
    
    const totalIncome = Object.values(baseIncome).reduce((sum, value) => sum + value, 0);
    
    // 现金流出计算
    const baseExpenses = {
      basic: 45000 + (age - 30) * 1000,        // 基础生活费用
      medical: 8000 + (age - 30) * 500,        // 日常医疗
      criticalTreatment: 300000 + (age - 30) * 10000, // 重疾治疗费用
      education: age < 40 ? 20000 + (age - 30) * 2000 : 0, // 教育费用
      pension: 12000 + (age - 30) * 500,       // 养老金缴费
      housing: 50000,                          // 居住费用
      transportation: 15000,                   // 交通费用
      majorPurchases: 10000,                   // 大额消费
      familySupport: 10000 + (age - 30) * 500, // 家庭赡养
    };
    
    const totalExpenses = Object.values(baseExpenses).reduce((sum, value) => sum + value, 0);
    
    // 计算缺口（取绝对值，以万为单位，四舍五入）
    const gap = Math.abs(totalIncome - totalExpenses);
    return Math.round(gap / 10000); // 转换为万元并四舍五入
  };

  // 生成15年的模拟数据，使用实际计算的缺口
  const generateTimelineData = () => {
    const baseYear = 2024;
    const data = [];
    
    // 不连续的年龄分布
    const agePattern = [30, 32, 34, 36, 39, 41, 43, 46, 48, 50, 53, 55, 57, 60, 62];
    
    for (let i = 0; i < 15; i++) {
      const age = agePattern[i];
      const gap = calculateActualGap(age);
      data.push({
        year: baseYear + i,
        age: age,
        gap: gap
      });
    }
    
    return data;
  };

  const timelineData = generateTimelineData();

  // 处理时间轴展开
  const handleTimelineToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTimelineExpanded(!timelineExpanded);
  };

  // 处理时间轴项目展开
  const handleTimelineItemToggle = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpandedItems = new Set(expandedTimelineItems);
    if (newExpandedItems.has(index)) {
      newExpandedItems.delete(index);
    } else {
      newExpandedItems.add(index);
    }
    setExpandedTimelineItems(newExpandedItems);
  };

  // 生成长寿风险时间轴数据（81-100岁中随机选7年）
  const generateLongevityTimelineData = () => {
    // 固定数据，避免随机性导致的不一致
    const fixedData = [
      { age: 81, gap: 52 },
      { age: 83, gap: 56 },
      { age: 87, gap: 64 },
      { age: 91, gap: 72 },
      { age: 94, gap: 78 },
      { age: 97, gap: 85 },
      { age: 100, gap: 95 }
    ];
    
    console.log('[RiskCardsSection] 生成的长寿风险数据:', fixedData);
    return fixedData;
  };

  const longevityTimelineData = generateLongevityTimelineData();

  // 生成重疾死亡时间轴数据（模拟5年数据）
  const generateDeathTimelineData = () => {
    // 重疾死亡风险的5年数据，年龄和缺口金额
    const deathData = [
      { age: 30, gap: 85 },
      { age: 32, gap: 78 },
      { age: 35, gap: 92 },
      { age: 38, gap: 68 },
      { age: 41, gap: 75 }
    ];
    
    console.log('[RiskCardsSection] 生成的重疾死亡数据:', deathData);
    return deathData;
  };

  const deathTimelineData = generateDeathTimelineData();

  // 处理重疾死亡时间轴展开
  const handleDeathTimelineToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeathTimelineExpanded(!deathTimelineExpanded);
  };

  // 处理重疾死亡时间轴项目展开
  const handleDeathTimelineItemToggle = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpandedItems = new Set(expandedDeathTimelineItems);
    if (newExpandedItems.has(index)) {
      newExpandedItems.delete(index);
    } else {
      newExpandedItems.add(index);
    }
    setExpandedDeathTimelineItems(newExpandedItems);
  };

  // 处理长寿风险图表展开
  const handleLongevityChartToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLongevityChartExpanded(!longevityChartExpanded);
  };

  // 重疾/意外风险的展开内容
  const renderCriticalIllnessExpandedContent = () => (
    <div className="space-y-4 mt-4 pt-4 border-t border-orange-200">
      {/* 总结性展示 */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h4 className="text-base font-semibold text-gray-800">风险影响总结</h4>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-white/60 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">家庭谁出险影响最大：</span>
                <span className="text-sm font-bold text-orange-600">本人</span>
              </div>
            </div>
            
            <div className="bg-white/60 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">发生哪种风险后果更严重：</span>
                <span className="text-sm font-bold text-red-600">重疾失能</span>
              </div>
            </div>
            
            <div className="bg-white/60 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">哪一年出险影响最大：</span>
                <span className="text-sm font-bold text-red-600">30岁</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 本人单独出险 */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <h4 className="text-base font-semibold text-gray-800">本人</h4>
          </div>
        </div>
        
        {/* 解释文案区域 - 合并的风险卡片 */}
        <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-white shadow-md">
          {/* 重疾失能标签放在左侧，测评结果标签和问号放右侧 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-gray-800 text-sm font-medium">重疾失能</span>
            </div>
            <div className="bg-[#FF7F7F]/20 text-gray-700 border border-[#FF7F7F]/20 text-xs font-medium px-2 py-1 rounded-full flex items-center space-x-1">
              <span>有风险，处置实物资产也无法解决现金流缺口</span>
              <Dialog>
                <DialogTrigger asChild>
                  <button onClick={handleHelpClick}>
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>重疾失能风险说明</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    "一旦您不幸发生风险，家庭财务将面临严重危机——所有资产都难以维持正常生活，甚至可能出现负债。建议尽早配置保险，为家庭筑起财务安全网。"
                  </p>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* 风险警示文案 */}
          <div className="p-3 bg-white border border-red-200 rounded-lg text-center mb-4">
            <div className="text-sm text-gray-800 font-semibold leading-relaxed">
              <div>30岁发生风险问题最大，导致家庭现金流总缺口</div>
              <div className="flex items-center justify-center space-x-2 text-red-600 font-bold text-base mt-1">
                <span 
                  className="cursor-pointer" 
                  onClick={() => setSelfCriticalCashFlowExpanded(!selfCriticalCashFlowExpanded)}
                >
                  -1000万元
                </span>
                <button 
                  onClick={() => setSelfCriticalCashFlowExpanded(!selfCriticalCashFlowExpanded)}
                  className="text-black hover:text-gray-700 transition-colors"
                >
                  <ExpandIcon className={`w-4 h-4 transition-transform ${selfCriticalCashFlowExpanded ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
            
            {/* 内联现金流图表 */}
            <InlineCashFlowChart isExpanded={selfCriticalCashFlowExpanded} />
          </div>

          {/* 展开的重疾死亡、重疾康复、意外失能、意外死亡内容 */}
          <div className="space-y-6 mb-4 pt-4">
            {/* 重疾死亡 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 text-sm font-medium">重疾死亡</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button onClick={handleHelpClick}>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>重疾死亡风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，虽然家庭总资产足够维持生活，但会面临资金周转困难，可能需要卖房变现才能度过难关。建议适当配置保险，避免被迫变卖资产。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="bg-[#FF7F7F]/20 text-gray-700 border border-[#FF7F7F]/20 text-xs font-medium px-2 py-1 rounded-full">
                  有风险，处置实物资产可解决现金流缺口
                </div>
              </div>
              
              {/* 风险警示文案 */}
              <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                  <div>30岁发生风险问题最大，导致家庭现金流总缺口</div>
                  <div className="flex items-center justify-center space-x-2 text-red-600 font-bold text-base mt-1">
                    <span 
                      className="cursor-pointer" 
                      onClick={() => setSelfDeathCashFlowExpanded(!selfDeathCashFlowExpanded)}
                    >
                      -398万元
                    </span>
                    <button 
                      onClick={() => setSelfDeathCashFlowExpanded(!selfDeathCashFlowExpanded)}
                      className="text-black hover:text-gray-700 transition-colors"
                    >
                      <ExpandIcon className={`w-4 h-4 transition-transform ${selfDeathCashFlowExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
                
                {/* 内联现金流图表 */}
                <InlineCashFlowChart isExpanded={selfDeathCashFlowExpanded} />
              </div>
            </div>
            
            {/* 重疾康复 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 text-sm font-medium">重疾康复</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button onClick={handleHelpClick}>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>重疾康复风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                  无风险
                </div>
              </div>
              
              {/* 风险警示文案 */}
              <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                  任何一年发生此风险，都不会导致现金流缺口
                </div>
              </div>
            </div>
            
            {/* 意外失能 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 text-sm font-medium">意外失能</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button onClick={handleHelpClick}>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>意外失能风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，虽然家庭总资产足够维持生活，但会面临资金周转困难，可能需要卖房变现才能度过难关。建议适当配置保险，避免被迫变卖资产。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                  有风险，处置实物资产可解决现金流缺口
                </div>
              </div>
              
              {/* 风险警示文案 */}
              <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                  <div>30岁发生风险问题最大，导致家庭现金流总缺口</div>
                  <div className="flex items-center justify-center space-x-2 text-red-600 font-bold text-base mt-1">
                    <span 
                      className="cursor-pointer" 
                      onClick={() => setSelfAccidentDisabilityCashFlowExpanded(!selfAccidentDisabilityCashFlowExpanded)}
                    >
                      -398万元
                    </span>
                    <button 
                      onClick={() => setSelfAccidentDisabilityCashFlowExpanded(!selfAccidentDisabilityCashFlowExpanded)}
                      className="text-black hover:text-gray-700 transition-colors"
                    >
                      <ExpandIcon className={`w-4 h-4 transition-transform ${selfAccidentDisabilityCashFlowExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
                
                {/* 内联现金流图表 */}
                <InlineCashFlowChart isExpanded={selfAccidentDisabilityCashFlowExpanded} />
              </div>
            </div>
            
            {/* 意外死亡 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 text-sm font-medium">意外死亡</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button onClick={handleHelpClick}>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>意外死亡风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                  无风险
                </div>
              </div>
              
              {/* 风险警示文案 */}
              <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                  任何一年发生此风险，都不会导致现金流缺口
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 配偶单独出险 */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <h4 className="text-base font-semibold text-gray-800">伴侣</h4>
          </div>
        </div>
        
        {/* 解释文案区域 - 合并的风险卡片 */}
        <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-white shadow-md">
          {/* 重疾失能标签和问号放左侧，测评结果标签放右侧 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-gray-800 text-sm font-medium">重疾失能</span>
              <Dialog>
                <DialogTrigger asChild>
                  <button onClick={handleHelpClick}>
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>重疾失能风险说明</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    "一旦配偶发生风险，虽然家庭总资产足够维持生活，但会面临资金周转困难，可能需要卖房变现才能度过难关。建议适当配置保险，避免被迫变卖资产。"
                  </p>
                </DialogContent>
              </Dialog>
            </div>
            <div className="bg-[#FF7F7F]/20 text-gray-700 border border-[#FF7F7F]/20 text-xs font-medium px-2 py-1 rounded-full">
              有风险，处置实物资产可解决现金流缺口
            </div>
          </div>
          
          {/* 风险警示文案 */}
          <div className="p-3 bg-white border border-red-200 rounded-lg text-center mb-4">
            <div className="text-sm text-gray-800 font-semibold leading-relaxed">
              <div>28岁发生风险问题最大，导致家庭现金流总缺口</div>
              <div className="flex items-center justify-center space-x-2 text-red-600 font-bold text-base mt-1">
                <span>-1,250万元</span>
                <button 
                  onClick={() => setSpouseCashFlowExpanded(!spouseCashFlowExpanded)}
                  className="text-black hover:text-gray-700 transition-colors"
                >
                  <ExpandIcon className={`w-4 h-4 transition-transform ${spouseCashFlowExpanded ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* 内联现金流图表 */}
          <InlineCashFlowChart isExpanded={spouseCashFlowExpanded} />

          {/* 展开的重疾死亡和重疾康复内容 */}
          <div className="space-y-6 mb-4 pt-4">
            {/* 重疾死亡 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 text-sm font-medium">重疾死亡</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button onClick={handleHelpClick}>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>重疾死亡风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，虽然家庭总资产足够维持生活，但会面临资金周转困难，可能需要卖房变现才能度过难关。建议适当配置保险，避免被迫变卖资产。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="bg-[#FF7F7F]/20 text-gray-700 border border-[#FF7F7F]/20 text-xs font-medium px-2 py-1 rounded-full">
                  有风险，处置实物资产可解决现金流缺口
                </div>
              </div>
              
              {/* 风险警示文案 */}
              <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                  <div>28岁发生风险问题最大，导致家庭现金流总缺口</div>
                  <div className="flex items-center justify-center space-x-2 text-red-600 font-bold text-base mt-1">
                    <span 
                      className="cursor-pointer" 
                      onClick={() => setSpouseDeathCashFlowExpanded(!spouseDeathCashFlowExpanded)}
                    >
                      -865万元
                    </span>
                    <button 
                      onClick={() => setSpouseDeathCashFlowExpanded(!spouseDeathCashFlowExpanded)}
                      className="text-black hover:text-gray-700 transition-colors"
                    >
                      <ExpandIcon className={`w-4 h-4 transition-transform ${spouseDeathCashFlowExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 内联现金流图表 */}
              <InlineCashFlowChart isExpanded={spouseDeathCashFlowExpanded} />
            </div>
            
            {/* 重疾康复 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 text-sm font-medium">重疾康复</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button onClick={handleHelpClick}>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>重疾康复风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                  无风险
                </div>
              </div>
              
              {/* 风险警示文案 */}
              <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                  任何一年发生此风险，都不会导致现金流缺口
                </div>
              </div>
            </div>
            
            {/* 意外失能 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 text-sm font-medium">意外失能</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button onClick={handleHelpClick}>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>意外失能风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，虽然家庭总资产足够维持生活，但会面临资金周转困难，可能需要卖房变现才能度过难关。建议适当配置保险，避免被迫变卖资产。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                  有风险，处置实物资产可解决现金流缺口
                </div>
              </div>
              
              {/* 风险警示文案 */}
              <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                  <div>30岁发生风险问题最大，导致家庭现金流总缺口</div>
                  <div className="flex items-center justify-center space-x-2 text-red-600 font-bold text-base mt-1">
                    <span 
                      className="cursor-pointer" 
                      onClick={() => setSpouseAccidentDisabilityCashFlowExpanded(!spouseAccidentDisabilityCashFlowExpanded)}
                    >
                      -285万元
                    </span>
                    <button 
                      onClick={() => setSpouseAccidentDisabilityCashFlowExpanded(!spouseAccidentDisabilityCashFlowExpanded)}
                      className="text-black hover:text-gray-700 transition-colors"
                    >
                      <ExpandIcon className={`w-4 h-4 transition-transform ${spouseAccidentDisabilityCashFlowExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
                
                {/* 内联现金流图表 */}
                <InlineCashFlowChart isExpanded={spouseAccidentDisabilityCashFlowExpanded} />
              </div>
            </div>
            
            {/* 意外死亡 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 text-sm font-medium">意外死亡</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button onClick={handleHelpClick}>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>意外死亡风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                  无风险
                </div>
              </div>
              
              {/* 风险警示文案 */}
              <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                  任何一年发生此风险，都不会导致现金流缺口
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 孩子单独出险 */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <h4 className="text-base font-semibold text-gray-800">孩子</h4>
          </div>
        </div>
        
        {/* 解释文案区域 - 合并的风险卡片 */}
        <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-white shadow-md">
          {/* 重疾失能标签和问号放左侧，测评结果标签放右侧 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-gray-800 text-sm font-medium">重疾失能</span>
              <Dialog>
                <DialogTrigger asChild>
                  <button onClick={handleHelpClick}>
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>重疾失能风险说明</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                  </p>
                </DialogContent>
              </Dialog>
            </div>
            <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
              无风险
            </div>
          </div>
          
          {/* 风险警示文案 */}
          <div className="p-3 bg-white border border-red-200 rounded-lg text-center mb-4">
            <div className="text-sm text-gray-800 font-semibold leading-relaxed">
              任何一年发生此风险，都不会导致现金流缺口
            </div>
          </div>

          {/* 展开的重疾死亡和重疾康复内容 */}
          <div className="space-y-6 mb-4 pt-4">
            {/* 重疾死亡 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 text-sm font-medium">重疾死亡</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button onClick={handleHelpClick}>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>重疾死亡风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                  无风险
                </div>
              </div>
              
              {/* 风险警示文案 */}
              <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                  任何一年发生此风险，都不会导致现金流缺口
                </div>
              </div>
            </div>
            
            {/* 重疾康复 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 text-sm font-medium">重疾康复</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button onClick={handleHelpClick}>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>重疾康复风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                  无风险
                </div>
              </div>
              
              {/* 风险警示文案 */}
              <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                  任何一年发生此风险，都不会导致现金流缺口
                </div>
              </div>
            </div>
            
            {/* 意外失能 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 text-sm font-medium">意外失能</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button onClick={handleHelpClick}>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>意外失能风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                  无风险
                </div>
              </div>
              
              {/* 风险警示文案 */}
              <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                  任何一年发生此风险，都不会导致现金流缺口
                </div>
              </div>
            </div>
            
            {/* 意外死亡 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 text-sm font-medium">意外死亡</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button onClick={handleHelpClick}>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle>意外死亡风险说明</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        "一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。"
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="bg-[#CAEC8D]/20 text-gray-700 border border-[#CAEC8D]/20 text-xs font-medium px-2 py-1 rounded-full">
                  无风险
                </div>
              </div>
              
              {/* 风险警示文案 */}
              <div className="p-3 bg-white border border-red-200 rounded-lg text-center">
                <div className="text-sm text-gray-800 font-semibold leading-relaxed">
                  任何一年发生此风险，都不会导致现金流缺口
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 查看测评过程按钮 - 在会员-平状态下隐藏 */}
      {pageMode !== 'member-balanced' && (
        <button 
          className="w-full bg-white border border-orange-300 text-orange-700 text-sm font-medium py-2.5 rounded-lg hover:bg-orange-50 transition-colors"
          onClick={() => navigate('/risk-assessment-process')}
        >
          查看测评过程
        </button>
      )}
      
      {/* 查看保障建议按钮 */}
      <button className="w-full bg-orange-100 text-orange-700 text-sm font-medium py-2.5 rounded-lg hover:bg-orange-200 transition-colors">
        查看保障建议
      </button>
    </div>
  );

  // 其他风险的展开内容
  const renderOtherRiskExpandedContent = (riskId: string) => {
    switch (riskId) {
      case 'asset-liquidity-risk-contingent':
        return (
          <div className="space-y-4 mt-4 pt-4 border-t border-orange-200">
            {/* 风险说明 */}
            <div className="bg-yellow-50/50 rounded-lg p-4 border border-yellow-200">
              <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                <p className="font-medium text-gray-900">为什么提示您这个风险？</p>
                <p>
                  当年您的收入无法覆盖家庭支出，需要动用现有金融资产来填补缺口。
                  虽然您的资产总额足够，但我们不清楚具体投资产品和到期时间，
                  <span className="font-medium text-red-600">可能存在资金无法及时变现的风险。</span>
                </p>
              </div>
            </div>
            
            {/* 数字展示 */}
            <div className="bg-red-50/50 rounded-lg p-4 border border-red-200">
              <div className="text-center">
                <div className="text-sm text-gray-700 mb-2">本年需赎回金融资产</div>
                <div className="text-2xl font-bold text-red-600">20万元</div>
              </div>
            </div>
          </div>
        );
      
      case 'layoff-salary-cut':
        return (
          <div className="space-y-4 mt-4 pt-4 border-t border-orange-200">
            {/* 风险说明 */}
            <div className="bg-yellow-50/50 rounded-lg p-4 border border-yellow-200">
              <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                <p className="font-medium text-gray-900">为什么提示您这个风险？</p>
                <p>
                  您的家庭支出与职业收入高度相关。一旦发生裁员降薪，
                  <span className="font-medium text-red-600">收入中断将直接冲击家庭生活</span>，
                  提前预案很有必要。
                </p>
              </div>
            </div>
            
            {/* 测评引导 */}
            <div className="rounded-lg p-4 border" style={{ backgroundColor: 'rgba(202, 244, 247, 0.1)', borderColor: '#CAF4F7' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 mb-1">精准测评影响</div>
                  <div className="text-sm text-gray-600">
                    测评裁员降薪对您生活的具体影响程度
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-white border-0"
                  style={{ backgroundColor: '#01BCD6' }}
                >
                  去测评
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'property-depreciation-risk':
        return (
          <div className="space-y-4 mt-4 pt-4 border-t border-orange-200">
            {/* 风险说明 */}
            <div className="bg-yellow-50/50 rounded-lg p-4 border border-yellow-200">
              <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                <p className="font-medium text-gray-900">为什么提示您这个风险？</p>
                <p>
                  根据您的规划，需要在<span className="font-medium text-red-600">35岁</span>前卖掉<span className="font-medium text-red-600">市值300万</span>的房产来补充后续家庭开支，如果后续房价下降有可能对您家庭目标造成影响，因此提醒您关注。
                </p>
              </div>
            </div>
            
            {/* 建议措施 */}
            <div className="rounded-lg p-4 border" style={{ backgroundColor: 'rgba(202, 244, 247, 0.1)', borderColor: '#CAF4F7' }}>
              <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                <p className="font-medium text-gray-900">应对建议</p>
                <p>
                  密切关注房产价值变化，
                  <span className="font-medium" style={{ color: '#01BCD6' }}>可择机出售避免减值</span>，
                  必要时联系专业中介获取建议。
                </p>
              </div>
            </div>
            
            {/* 测评引导 */}
            <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 mb-1">房产减值风险测评</div>
                  <div className="text-sm text-gray-600">
                    精准评估房产价值变动对您的影响
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-gray-400 text-white border-gray-400 cursor-not-allowed"
                  disabled
                >
                  功能待上线
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'investment-return-decline-risk':
        return (
          <div className="space-y-4 mt-4 pt-4 border-t border-orange-200">
            {/* 风险说明 */}
            <div className="bg-yellow-50/50 rounded-lg p-4 border border-yellow-200">
              <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                <p className="font-medium text-gray-900">为什么提示您这个风险？</p>
                <p>
                  在做规划时，为谨慎起见，我们按无风险收益水平预设了家庭被动收入的投资收益。由于您的财务分型是<span className="font-medium text-red-600">B类</span>，即收支平衡，如果未来经济环境变化导致投资收益下降，可能会出现收支缺口。因此提示您关注。
                </p>
              </div>
            </div>
            
            {/* 应对建议 */}
            <div className="rounded-lg p-4 border" style={{ backgroundColor: 'rgba(202, 244, 247, 0.1)', borderColor: '#CAF4F7' }}>
              <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                <p className="font-medium text-gray-900">应对建议</p>
                <p>
                  告别"躺平思维"，<span className="font-medium" style={{ color: '#01BCD6' }}>积极规划通过提高主动收入应对收益下行风险。</span>
                </p>
              </div>
            </div>
            
            {/* 测评引导 */}
            <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 mb-1">投资收益下行风险测评</div>
                  <div className="text-sm text-gray-600">
                    精准评估投资收益变化对您的影响
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-gray-400 text-white border-gray-400 cursor-not-allowed"
                  disabled
                >
                  功能待上线
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'inflation-risk':
        return (
          <div className="space-y-4 mt-4 pt-4 border-t border-orange-200">
            {/* 风险说明 */}
            <div className="bg-yellow-50/50 rounded-lg p-4 border border-yellow-200">
              <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                <p className="font-medium text-gray-900">为什么提示您这个风险？</p>
                <p>
                  您的资产刚好能在当前通胀水平下覆盖未来支出。
                  <span className="font-medium text-red-600">一旦通胀超出预期，资产将不足以支撑家庭开支</span>，
                  必须重视这一风险。
                </p>
              </div>
            </div>
            
            {/* 应对建议 */}
            <div className="rounded-lg p-4 border" style={{ backgroundColor: 'rgba(202, 244, 247, 0.1)', borderColor: '#CAF4F7' }}>
              <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                <p className="font-medium text-gray-900">应对建议</p>
                <p>
                  无需盯盘宏观数据，
                  <span className="font-medium" style={{ color: '#01BCD6' }}>每半年重做财富快照即可</span>，
                  系统自动监测通胀对您财富的影响。
                </p>
              </div>
            </div>
            
            {/* 测评引导 */}
            <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 mb-1">通货膨胀风险测评</div>
                  <div className="text-sm text-gray-600">
                    精准评估通胀变化对您的影响
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-gray-400 text-white border-gray-400 cursor-not-allowed"
                  disabled
                >
                  功能待上线
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'longevity-risk':
        return (
          <div className="space-y-4 mt-4 pt-4 border-t border-orange-200">
            {/* 风险说明 */}
            <div className="bg-yellow-50/50 rounded-lg p-4 border border-yellow-200">
              <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                <p className="font-medium text-gray-900">为什么提示您这个风险？</p>
                <p>
                  根据测算，当您的伴侣<span className="font-medium text-red-600">87岁</span>（届时您<span className="font-medium text-red-600">84岁</span>）时，家庭现金流将开始出现缺口。特此提醒您留意这一潜在风险，建议提前做好规划以应对可能的资金安排需求。
                </p>
              </div>
            </div>
            
            {/* 缺口数据展示 */}
            <div className="bg-red-50/50 rounded-lg p-4 border border-red-200">
              <div className="text-center">
                <div className="text-sm text-gray-700 mb-1">活到100岁现金流总缺口</div>
                <div className="flex items-center justify-center space-x-2 text-red-600 font-bold text-xl mt-1">
                  <span 
                    className="cursor-pointer" 
                    onClick={handleLongevityChartToggle}
                  >
                    453万元
                  </span>
                  <button 
                    onClick={handleLongevityChartToggle}
                    className="text-black hover:text-gray-700 transition-colors"
                  >
                    <ExpandIcon className={`w-4 h-4 transition-transform ${longevityChartExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
              
              {/* 折线图展开内容 */}
              <InlineLongevityChart isExpanded={longevityChartExpanded} />
            </div>
            
            {/* 测评引导 */}
            <div className="rounded-lg p-4 border" style={{ backgroundColor: 'rgba(202, 244, 247, 0.1)', borderColor: '#CAF4F7' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 mb-1">精准测评影响</div>
                  <div className="text-sm text-gray-600">
                    测评长寿对您生活的具体影响程度
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-white border-0"
                  style={{ backgroundColor: '#01BCD6' }}
                >
                  去测评
                </Button>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-4 mt-4 pt-4 border-t border-orange-200">
            <div className="text-center text-gray-500 py-8">
              展开内容待完善
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-3">
      {familyRisks.map((risk) => {
        const isExpanded = expandedRisks.has(risk.id);
        const IconComponent = risk.icon;
        
        return (
          <Card 
            key={risk.id} 
            className={`bg-white border border-orange-300 ${
              isExpanded ? 'h-auto' : 'h-20'
            } transition-all duration-200 cursor-pointer`}
            onClick={() => handleRiskClick(risk.id)}
          >
            <CardContent className="p-4">
              <div className={`${isExpanded ? '' : 'h-12'}`}>
                <div className="flex items-center space-x-4">
                  {/* icon */}
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                    <IconComponent className="w-3 h-3 text-orange-600" />
                  </div>
                  
                  {/* 风险名称和描述 */}
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-medium text-gray-800 mb-1">
                      {risk.name}
                    </div>
                    <div className="text-sm text-gray-800 line-clamp-1">
                      {risk.summary}
                    </div>
                  </div>
                  
                  {/* 查看详情按钮和箭头 */}
                  <div 
                    className="flex-shrink-0 flex items-center space-x-1 cursor-pointer"
                    onClick={(e) => handleExpandToggle(risk.id, e)}
                  >
                    <span className="text-sm font-medium" style={{ color: '#01BCD6' }}>查看详情</span>
                    <ExpandIcon className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} style={{ color: '#01BCD6' }} />
                  </div>
                </div>
              </div>
              
              {/* 展开内容 */}
              {isExpanded && (
                <div onClick={(e) => e.stopPropagation()}>
                  {risk.id === 'critical-illness-accident' 
                    ? renderCriticalIllnessExpandedContent()
                    : renderOtherRiskExpandedContent(risk.id)}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
