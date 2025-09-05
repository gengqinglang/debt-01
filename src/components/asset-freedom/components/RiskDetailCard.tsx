import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Eye, Settings, ArrowLeft, BrainCircuit, RefreshCw, FileText, Target, TrendingDown, BarChart3, DollarSign } from 'lucide-react';
import { useNavigationState } from '@/hooks/useNavigationState';

interface RiskDetailCardProps {
  risk: {
    id: string;
    name: string;
    icon: React.ComponentType<{ className: string }>;
    summary: string;
    description: string;
    descriptionButtonText: string;
    actionTitle: string;
    actionDescription: string[];
    actionButtonText: string;
  };
  fromSecondaryRisk?: boolean;
  showBackButton?: boolean; // 控制是否显示返回按钮
  useInternalPadding?: boolean; // 控制是否使用内部边距
}

const RiskDetailCard: React.FC<RiskDetailCardProps> = ({ risk, fromSecondaryRisk = false, showBackButton = true, useInternalPadding = true }) => {
  const { navigateWithState, navigateBack, getReturnState } = useNavigationState();
  const IconComponent = risk.icon;

  const handleBack = () => {
    console.log('[RiskDetailCard] Navigating back from risk detail');
    navigateBack();
  };

  const handleViewAssessmentBasis = () => {
    console.log('[RiskDetailCard] Viewing assessment basis for:', risk.id);
    
    // Get current return state to preserve context
    const returnState = getReturnState();
    
    // 针对长寿风险，导航到长寿风险测评页面
    if (risk.id === 'longevity-risk') {
      navigateWithState('/changshou-ceping', {
        activeTab: returnState?.activeTab || 'risk',
        activeRiskTab: returnState?.activeRiskTab || 'secondary-risk',
        sourceModule: 'risk-detail-longevity-assessment'
      });
      return;
    }
    
    // 针对资产流动性风险，导航到page-a页面
    if (risk.id === 'asset-liquidity-risk' || risk.id === 'asset-liquidity-risk-contingent') {
      navigateWithState('/page-a', {
        activeTab: returnState?.activeTab || 'risk',
        activeRiskTab: returnState?.activeRiskTab || 'secondary-risk',
        sourceModule: 'risk-detail-assessment'
      });
      return;
    }
    
    // 其他风险导航到风险评估页面
    navigateWithState('/risk-assessment', {
      activeTab: returnState?.activeTab || 'risk',
      activeRiskTab: fromSecondaryRisk ? 'secondary-risk' : 'main-risk',
      sourceModule: 'risk-detail-assessment'
    });
  };

  const handleActionButton = () => {
    console.log(`点击行动按钮: ${risk.actionButtonText}`);
    
    // 针对长寿风险，导航到长寿风险测评页面
    if (risk.id === 'longevity-risk') {
      const returnState = getReturnState();
      navigateWithState('/changshou-ceping', {
        activeTab: returnState?.activeTab || 'risk',
        activeRiskTab: returnState?.activeRiskTab || 'secondary-risk',
        sourceModule: 'risk-detail-longevity-assessment'
      });
      return;
    }
  };

  const getImmediateActionText = (riskId: string) => {
    switch (riskId) {
      case 'stable-income-decline':
        return `面对收益下行的新常态，传统的"躺赢"思维已经难以适应当前的经济环境，主动出击才是破局之道。首先，要深刻认识到这一轮收益下行并非短期波动，而是经济结构调整的必然结果，我们必须调整预期。

其次，人力资本的投资回报正在凸显，持续学习和技能升级不仅能提升职场竞争力，更能为未来的收入增长奠定基础。

最后，资产配置的多元化变得更加重要，在传统投资渠道收益率普遍下降的背景下，适度配置成长性资产，分散投资风险，才能在新的经济周期中保持财富的稳健增长。`;
      case 'layoff-salary-cut':
        return `职场变化瞬息万变，AI技术革命正在重塑各行各业。与其被动等待变化，不如主动拥抱趋势，让AI成为您职业发展的强力助手。

我们的AI职业规划功能基于大数据分析和智能算法，能够深度挖掘您的职业潜力，识别技能短板，预测行业趋势，为您量身定制最适合的职业发展策略。`;
      case 'plan-changes':
        return `人生规划不是一成不变的，随着生活阅历的增长和外界环境的变化，您可能会有新的想法和需求。财富快照测评可以帮您重新审视人生规划，看看不同的选择会带来怎样的财务影响。
比如原本没考虑买房，现在想买了；或者之前没打算要孩子，现在改变主意了。每一次重新测评，都能让您更清楚地看到不同人生道路的财富分型。
这样您就能在做重大决策时心中有数，选择最适合自己的人生路径，避免因为规划变动而陷入财务困境。`;
      case 'serious-illness':
        return `面对重疾风险，光靠储蓄是远远不够的。现代医疗费用动辄几十万，而且治疗期间还会影响家庭收入，双重打击下很容易让家庭陷入财务困境。

我们的保障建议功能会根据您的家庭结构、年龄、收入等具体情况，运用专业的保险配置模型，为您量身定制经济实用的保险方案。不会让您多花冤枉钱，也不会留下保障空白。

让专业的风险管理为您的家庭撑起保护伞，真正做到未雨绸缪，让重疾不再成为压垮家庭的最后一根稻草。`;
      case 'improper-consumption':
        return `花钱如流水，存钱如登山？别慌！我们的"存钱任务测评"就像您的专属财务教练，帮您找到最适合的储蓄节奏。

这个智能工具会根据您的收入状况、生活开支和未来规划，精准计算出未来3年内每年应该存多少钱，更重要的是，清楚地告诉您这笔钱将用于哪一年的具体支出。

就像导航软件为您规划最佳路线一样，存钱任务让您的每一分储蓄都有明确的目标和用途。不再盲目存钱，也不会因为没有计划而乱花钱。让存钱变得有目标、有方向、有动力！`;
      default:
        return null;
    }
  };

  const immediateActionText = getImmediateActionText(risk.id);

  // 统一所有风险卡片配色方案为重疾/意外风险的配色（青色系）
  const colorScheme = {
    cardBg: 'border-[#CAF4F7] bg-gradient-to-br from-[#CAF4F7]/30 to-[#CAF4F7]/10',
    iconColor: 'text-[#01BCD6]',
    titleColor: 'text-[#0891b2]',
    buttonBg: 'bg-[#CAF4F7]/50 hover:bg-[#CAF4F7]/70 text-[#0891b2]'
  };

  const handleCareerPlanning = () => {
    console.log('导航到AI职业规划页面');
    const returnState = getReturnState();
    navigateWithState('/ai-career-planning', {
      activeTab: returnState?.activeTab || 'risk',
      activeRiskTab: returnState?.activeRiskTab || 'secondary-risk',
      sourceModule: 'risk-detail-career'
    });
  };

  const handleRetestSnapshot = () => {
    console.log('重新测评财富快照');
    const returnState = getReturnState();
    navigateWithState('/optional-life', {
      activeTab: returnState?.activeTab || 'risk',
      activeRiskTab: returnState?.activeRiskTab || 'secondary-risk',
      sourceModule: 'risk-detail-retest'
    });
  };

  const handleViewProtectionPlan = () => {
    console.log('查看保障方案');
    const returnState = getReturnState();
    navigateWithState('/protection-plan', {
      activeTab: returnState?.activeTab || 'risk',
      activeRiskTab: returnState?.activeRiskTab || 'secondary-risk',
      sourceModule: 'risk-detail-protection'
    });
  };

  const handleViewRedemptionTask = () => {
    console.log('查看资产赎回任务');
    const returnState = getReturnState();
    navigateWithState('/redemption-task', {
      activeTab: returnState?.activeTab || 'risk',
      activeRiskTab: returnState?.activeRiskTab || 'secondary-risk',
      sourceModule: 'risk-detail-redemption'
    });
  };

  const handleViewSavingsTask = () => {
    console.log('查看存钱任务');
    const returnState = getReturnState();
    navigateWithState('/savings-task', {
      activeTab: returnState?.activeTab || 'risk',
      activeRiskTab: returnState?.activeRiskTab || 'secondary-risk',
      sourceModule: 'risk-detail-savings'
    });
  };

  // 新增：不当传承风险的按钮处理函数
  const handleViewFutureFreeSpending = () => {
    console.log('查看未来随便花的钱');
    const returnState = getReturnState();
    navigateWithState('/future-free-spending', {
      activeTab: returnState?.activeTab || 'risk',
      activeRiskTab: returnState?.activeRiskTab || 'secondary-risk',
      sourceModule: 'risk-detail-free-spending'
    });
  };

  // 新增：不当投资风险的按钮处理函数
  const handleUpdateAssetLiability = () => {
    console.log('更新资产负债');
    const returnState = getReturnState();
    navigateWithState('/new', {
      activeTab: 'planning',
      activePlanningTab: 'assets-liabilities',
      activeRiskTab: returnState?.activeRiskTab || 'secondary-risk',
      sourceModule: 'risk-detail-update-asset-liability'
    });
  };

  // 新增：不当举债风险的按钮处理函数
  const handleViewLoanPrediction = () => {
    console.log('查看贷款期间财务预测');
    const returnState = getReturnState();
    navigateWithState('/daikuan-yuce', {
      activeTab: returnState?.activeTab || 'risk',
      activeRiskTab: returnState?.activeRiskTab || 'secondary-risk',
      sourceModule: 'risk-detail-loan-prediction'
    });
  };

  const handleViewSavingsPlan = () => {
    console.log('查看攒钱计划');
    const returnState = getReturnState();
    navigateWithState('/savings-task', {
      activeTab: returnState?.activeTab || 'risk',
      activeRiskTab: returnState?.activeRiskTab || 'secondary-risk',
      sourceModule: 'risk-detail-savings-plan'
    });
  };

  // 资产流动性风险的按钮处理函数
  const handleRetakeSnapshot = () => {
    console.log('重走财富快照');
    const returnState = getReturnState();
    navigateWithState('/personal-info', {
      activeTab: returnState?.activeTab || 'risk',
      activeRiskTab: returnState?.activeRiskTab || 'secondary-risk',
      sourceModule: 'risk-detail-retake-snapshot'
    });
  };

  const handleViewCashFlowGap = () => {
    console.log('查看资产流动性风险');
    const returnState = getReturnState();
    navigateWithState('/page-a', {
      activeTab: returnState?.activeTab || 'risk',
      activeRiskTab: returnState?.activeRiskTab || 'secondary-risk',
      sourceModule: 'risk-detail-liquidity-assessment'
    });
  };

  const handleGetAdjustmentSolution = () => {
    console.log('获取调缺方案');
    const returnState = getReturnState();
    navigateWithState('/adjustment-solution', {
      activeTab: returnState?.activeTab || 'risk',
      activeRiskTab: returnState?.activeRiskTab || 'secondary-risk',
      sourceModule: 'risk-detail-adjustment'
    });
  };

  // 获取显示的风险名称
  const getDisplayRiskName = (riskId: string, originalName: string) => {
    if (riskId === 'asset-liquidity-risk') {
      return '资产流动性风险-确有';
    }
    if (riskId === 'asset-liquidity-risk-contingent') {
      return '资产流动性风险-或有';
    }
    return originalName;
  };

  // 获取风险描述文案 - 针对资产流动性风险使用新的描述
  const getRiskDescription = (riskId: string, originalDescription: string) => {
    if (riskId === 'asset-liquidity-risk') {
      return '提醒您关注资产流动性风险。根据现金流分析，未来三年内，您存在当年收入不足以覆盖家庭支出的情况，需要动用家庭原有资产来填补开支缺口，俗称"吃老本"。然而，您目前的金融资产尚不足以弥补这一差额。这意味着，除非对现有开支计划进行调整，否则可能不得不通过出售房产或其他固定资产来应对资金需求。需要注意的是，实物资产的变现过程受到市场状况和价格波动的显著影响，可能难以在预期时间内以理想价格完成交易。这种不确定性不仅增加了财务规划的复杂性，还可能对您既定人生目标的实现产生不利影响。因此，我们有必要提前向您提示这一潜在风险，以便您能够及时采取措施，做好更为周全的准备。';
    }
    return originalDescription;
  };

  // 资产流动性风险的特殊应对建议内容
  const renderAssetLiquidityAdvice = () => {
    const adviceItems = [
      {
        text: '建议您再次确认支出规划是否与家庭实际情况相符，若存在不匹配之处，可先更新快照，再观察该风险是否消除。',
        buttonText: '重走财富快照',
        buttonIcon: RefreshCw,
        handler: handleRetakeSnapshot
      },
      {
        text: '若支出规划确认无误，则需重点关注存在收入缺口的年份及其具体金额。',
        buttonText: '查看资产流动性风险',
        buttonIcon: BarChart3,
        handler: handleViewCashFlowGap
      },
      {
        text: '深入思考除变卖实物资产之外，是否还有其他筹资途径可供选择。',
        buttonText: '获取调缺方案',
        buttonIcon: Settings,
        handler: handleGetAdjustmentSolution
      },
      {
        text: '倘若确实需要通过变卖实物资产来筹集资金，请务必提前留意市场交易动态以及相关资产的价格走势，尽早做好准备，以免因急于变现而遭受交易损失，或者出现无法顺利变现的情况，从而影响家庭既定目标的达成。',
        buttonText: '',
        buttonIcon: null,
        handler: null
      }
    ];

    return (
      <div className="space-y-4">
        {adviceItems.map((item, index) => (
          <div key={index} className="space-y-3">
            <p className="text-sm text-gray-700 leading-relaxed">
              {item.text}
            </p>
            {item.buttonText && item.buttonIcon && item.handler && (
              <Button
                onClick={item.handler}
                className={`w-full ${colorScheme.buttonBg} border-0 text-sm font-medium flex items-center justify-center space-x-2`}
              >
                <item.buttonIcon className="w-4 h-4" />
                <span>{item.buttonText}</span>
              </Button>
            )}
          </div>
        ))}
      </div>
    );
  };

  // 不当投资风险的特殊应对建议内容
  const renderImproperInvestmentAdvice = () => {
    const adviceItems = [
      {
        text: '建议您梳理一下家庭资产的投资去向，若已持有中高风险投资产品，建议联系理财经理，做一次深入的资产检视，动态跟踪产品运作情况调整投资策略，防范潜在损失。',
        buttonText: '',
        buttonIcon: null,
        handler: null
      },
      {
        text: '如产品出现亏损，请即可更新资产负债重新测评，获取新的财富分型，以判断是否对家庭未来生活造成了影响。',
        buttonText: '更新资产负债',
        buttonIcon: RefreshCw,
        handler: handleUpdateAssetLiability
      },
      {
        text: '如果您手头的资金尚未投资，建议您投资前参考系统给出的现金流预测，根据攒钱建议的时间和金额进行产品遴选，并做好风险控制。',
        buttonText: '查看攒钱计划',
        buttonIcon: Target,
        handler: handleViewSavingsPlan
      }
    ];

    return (
      <div className="space-y-4">
        {adviceItems.map((item, index) => (
          <div key={index} className="space-y-3">
            <p className="text-sm text-gray-700 leading-relaxed">
              {item.text}
            </p>
            {item.buttonText && item.buttonIcon && item.handler && (
              <Button
                onClick={item.handler}
                className={`w-full ${colorScheme.buttonBg} border-0 text-sm font-medium flex items-center justify-center space-x-2`}
              >
                <item.buttonIcon className="w-4 h-4" />
                <span>{item.buttonText}</span>
              </Button>
            )}
          </div>
        ))}
      </div>
    );
  };

  // 长寿风险的年金购买能力测评
  const handleAnnuityAssessment = () => {
    console.log('导航到年金购买能力测评页面');
    const returnState = getReturnState();
    navigateWithState('/nianjinceping', {
      activeTab: returnState?.activeTab || 'risk',
      activeRiskTab: returnState?.activeRiskTab || 'secondary-risk',
      sourceModule: 'risk-detail-annuity-assessment'
    });
  };

  // 长寿风险的特殊应对建议内容
  const renderLongevityRiskAdvice = () => {
    const adviceItems = [
      {
        text: '建议您用系统预设的长寿风险测评工具，算算具体多少岁钱不够用，如果您家族有长寿基因，建议您及早规划对抗长寿风险。',
        buttonText: '长寿风险测评',
        buttonIcon: Target,
        handler: handleActionButton
      },
      {
        text: '如果您担心该风险，常见且有效的方案是趁年轻通过购买年金险进行风险转移，您可先查看系统给出的现金流情况，并咨询专业顾问确定投保方案；',
        buttonText: '年金购买能力测评',
        buttonIcon: BarChart3,
        handler: handleAnnuityAssessment
      },
      {
        text: '若超出年龄无法通过投保转移或暂时没有资金购买，可根据自己对长寿的预期，及时调整现有规划，平衡资产配置与资金使用，确保未来生活开支有充足保障。',
        buttonText: '',
        buttonIcon: null,
        handler: null
      }
    ];

    return (
      <div className="space-y-4">
        {adviceItems.map((item, index) => (
          <div key={index} className="space-y-3">
            <p className="text-sm text-gray-700 leading-relaxed">
              {item.text}
            </p>
            {item.buttonText && item.buttonIcon && item.handler && (
              <Button
                onClick={item.handler}
                className={`w-full ${colorScheme.buttonBg} border-0 text-sm font-medium flex items-center justify-center space-x-2`}
              >
                <item.buttonIcon className="w-4 h-4" />
                <span>{item.buttonText}</span>
              </Button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 返回按钮 - 仅在指定时显示 */}
      {showBackButton && (
        <div className={useInternalPadding ? "px-4 pt-4" : "pt-4"}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 p-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回</span>
          </Button>
        </div>
      )}
      
      {/* 风险详情卡片 */}
      <div className={useInternalPadding ? "px-4 pb-4" : "pb-4"}>
        <Card className={`${colorScheme.cardBg} relative overflow-hidden`}>
          <CardContent className="p-6 relative z-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1 pr-3">
                  <IconComponent className={`w-5 h-5 ${colorScheme.iconColor}`} />
                  <h3 className={`text-lg font-bold ${colorScheme.titleColor}`}>
                    {getDisplayRiskName(risk.id, risk.name)}
                  </h3>
                </div>
                {/* 只有非稳健收益下行风险、非不当消费风险、非不当传承风险、非不当投资风险和非不当举债风险才显示按钮 */}
                {risk.id !== 'stable-income-decline' && risk.id !== 'improper-consumption' && risk.id !== 'improper-inheritance' && risk.id !== 'improper-investment' && risk.id !== 'improper-debt' && (
                  <Button
                    size="sm"
                    className={`${colorScheme.buttonBg} border-0 text-xs flex-shrink-0`}
                    onClick={handleViewAssessmentBasis}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    {risk.descriptionButtonText}
                  </Button>
                )}
              </div>
              
              {/* 风险描述区域 - 直接展开，使用新的描述文案 */}
              <div className="space-y-2">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {getRiskDescription(risk.id, risk.description)}
                </p>
              </div>

              {/* 应对建议部分 */}
              <div className="mt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Settings className={`w-4 h-4 ${colorScheme.iconColor}`} />
                  <span className={`text-lg font-bold ${colorScheme.titleColor}`}>应对建议</span>
                </div>
                
                {/* 根据风险类型显示不同的应对建议 */}
                {(risk.id === 'asset-liquidity-risk' || risk.id === 'asset-liquidity-risk-contingent') ? (
                  risk.id === 'asset-liquidity-risk' ? renderAssetLiquidityAdvice() : (
                    // 或有风险的应对建议
                    <div className="space-y-4">
                      {/* 第一个段落 */}
                      <div className="space-y-3">
                        <div className="text-sm text-gray-700 leading-relaxed">
                          <p>建议您根据我们给出的赎回任务，对照家庭金融资产的具体到期日进行核对，看看是否匹配？</p>
                        </div>
                        <Button
                          onClick={handleViewRedemptionTask}
                          className={`w-full ${colorScheme.buttonBg} border-0 text-sm font-medium flex items-center justify-center space-x-2`}
                        >
                          <FileText className="w-4 h-4" />
                          <span>{risk.actionButtonText}</span>
                        </Button>
                      </div>
                      
                      {/* 第二个段落 */}
                      <div className="text-sm text-gray-700 leading-relaxed">
                        <p>如果是高风险产品如基金、三级以上理财产品需要格外注意，因为即便产品可以赎回，但也要关注一下是否会出现本金或收益损失。如果您觉得自己搞不清，可以立刻行动，联系专业理财经理，结合系统给出的赎回任务清单，对现有资产进行一次全面检视，充分评估是否会出现此种风险，并提前做好预案。</p>
                      </div>
                    </div>
                  )
                ) : risk.id === 'improper-investment' ? (
                  // 不当投资风险的应对建议
                  renderImproperInvestmentAdvice()
                ) : risk.id === 'longevity-risk' ? (
                  // 长寿风险的应对建议
                  renderLongevityRiskAdvice()
                ) : risk.id === 'improper-inheritance' ? (
                  // 不当传承风险的应对建议
                  <div className="space-y-2 mb-3">
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {risk.actionDescription.map((desc, index) => (
                        <p key={index} className="mb-2 last:mb-0">{desc}</p>
                      ))}
                    </div>
                    <Button
                      onClick={handleViewFutureFreeSpending}
                      className={`w-full ${colorScheme.buttonBg} border-0 text-sm font-medium flex items-center justify-center space-x-2`}
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>{risk.actionButtonText}</span>
                    </Button>
                  </div>
                ) : risk.id === 'improper-debt' ? (
                  // 不当举债风险的应对建议
                  <div className="space-y-2 mb-3">
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {risk.actionDescription.map((desc, index) => (
                        <p key={index} className="mb-2 last:mb-0">{desc}</p>
                      ))}
                    </div>
                    <Button
                      onClick={handleViewLoanPrediction}
                      className={`w-full ${colorScheme.buttonBg} border-0 text-sm font-medium flex items-center justify-center space-x-2`}
                    >
                      <Eye className="w-4 h-4" />
                      <span>查看测评依据</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 mb-3">
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {risk.actionDescription.map((desc, index) => (
                        <p key={index} className="mb-2 last:mb-0">{desc}</p>
                      ))}
                    </div>
                    {/* 针对重疾/意外风险显示查看保障建议按钮 */}
                    {risk.id === 'critical-illness-accident' && (
                      <Button
                        onClick={handleViewProtectionPlan}
                        className={`w-full ${colorScheme.buttonBg} border-0 text-sm font-medium flex items-center justify-center space-x-2`}
                      >
                        <Settings className="w-4 h-4" />
                        <span>查看保障建议</span>
                      </Button>
                    )}
                  </div>
                )}

                {/* 马上行动的内容移动到应对建议下方 - 只对非资产流动性风险、非不当传承风险和非不当投资风险显示 */}
                {immediateActionText && !['asset-liquidity-risk', 'asset-liquidity-risk-contingent', 'improper-inheritance', 'improper-investment'].includes(risk.id) && (
                  <div className="space-y-4 mt-4">
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {immediateActionText}
                    </div>
                    
                    {/* 针对裁员降薪风险显示职业规划按钮 */}
                    {risk.id === 'layoff-salary-cut' && (
                      <Button
                        onClick={handleCareerPlanning}
                        className={`w-full ${colorScheme.buttonBg} border-0 text-sm font-medium flex items-center justify-center space-x-2`}
                      >
                        <BrainCircuit className="w-4 h-4" />
                        <span>去做职业规划</span>
                      </Button>
                    )}

                    {/* 针对规划变动风险显示重新测评按钮 */}
                    {risk.id === 'plan-changes' && (
                      <Button
                        onClick={handleRetestSnapshot}
                        className={`w-full ${colorScheme.buttonBg} border-0 text-sm font-medium flex items-center justify-center space-x-2`}
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>重走人生快照</span>
                      </Button>
                    )}

                    {/* 针对重疾/意外风险显示保障建议按钮 */}
                    {risk.id === 'critical-illness-accident' && (
                      <Button
                        onClick={handleViewProtectionPlan}
                        className={`w-full ${colorScheme.buttonBg} border-0 text-sm font-medium flex items-center justify-center space-x-2`}
                      >
                        <Settings className="w-4 h-4" />
                        <span>查看保障建议</span>
                      </Button>
                    )}

                    {/* 針對重疾風險顯示保障方案按鈕 */}
                    {risk.id === 'serious-illness' && (
                      <Button
                        onClick={handleViewProtectionPlan}
                        className={`w-full ${colorScheme.buttonBg} border-0 text-sm font-medium flex items-center justify-center space-x-2`}
                      >
                        <Settings className="w-4 h-4" />
                        <span>查看保障方案</span>
                      </Button>
                    )}

                    {/* 针对不当消费风险显示存钱任务按钮 */}
                    {risk.id === 'improper-consumption' && (
                      <Button
                        onClick={handleViewSavingsTask}
                        className={`w-full ${colorScheme.buttonBg} border-0 text-sm font-medium flex items-center justify-center space-x-2`}
                      >
                        <Target className="w-4 h-4" />
                        <span>查看存钱任务</span>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskDetailCard;
