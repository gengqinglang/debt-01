
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Zap, PiggyBank, Shield, Building, Target, ArrowRight, CheckCircle, Crown, RefreshCw } from 'lucide-react';

interface NextActionsSectionProps {
  isMember?: boolean;
}

const NextActionsSection: React.FC<NextActionsSectionProps> = ({ isMember = false }) => {
  const navigate = useNavigate();
  // 更新第一个行动项目
  const allActionItems = [
    {
      id: 'cancel-house-improvement',
      title: '优先取消改善房计划',
      icon: Building,
      details: [
        '建议优先取消改善房计划，具体细则可查阅《支出压缩方案》，规避收支失衡引发的财务风险。',
        '若需调整压缩内容，可登录系统进入「调缺模块」。该模块将基于您的财务状况，并兼顾个人消费偏好，持续优化个性化开支压缩方案，精准识别可缩减项目。',
        '在保障家庭核心资金需求的同时，降低财务杠杆风险，并为科学投资决策提供专业支持。'
      ],
      priority: 'high',
      timeframe: '当前优先'
    },
    {
      id: 'cancel-house-investment',
      title: '购房投资，别着急，先调平！',
      icon: Building,
      details: [
        '优先建议暂停投资购房计划，先把家庭的现金流与目标安排稳下来！',
        '请务必优先保障日常生活开支、应急资金和家庭重大目标的资金规划，避免因现金流紧张导致债务压力。',
        '如果您依然希望推进购房投资，可登录系统进入「调缺模块」。模块会结合您的财务现状与个人消费偏好，持续优化个性化开支压缩方案，精准识别可缩减支出。这样既可以优先保障核心资金需求，还能科学地控制财务杠杆风险，为您的投资决策提供更专业、安心的支持。'
      ],
      priority: 'high',
      timeframe: '当前优先'
    },
    {
      id: 'asset-redemption',
      title: '资产赎回提醒',
      icon: PiggyBank,
      details: [
        '今年预计需要赎回资金：10万元',
        '今年的支出将超过收入，建议您主动动用一部分积蓄来补充现金流，让日常生活顺畅无忧。',
        '这并不意味着"花超了"，而是合理利用过往积累，让家庭每一步都走得更加从容。',
        '建议提前规划赎回方式，优先选择流动性高、变现损失小的资产，如货币基金、定期存款等，避免影响长期投资布局。'
      ],
      priority: 'high',
      timeframe: '本年度及时关注'
    },
    {
      id: 'savings',
      title: '今年需要攒12万元',
      icon: PiggyBank,
      details: [
        '本年度攒钱目标：12万元',
        '其中5万元最长投资期限建议为2年',
        '另外7万元最长投资期限建议为5年',
        '建议开设专门的储蓄账户，采用自动转账强制储蓄'
      ],
      priority: 'high',
      timeframe: '立即执行'
    },
    {
      id: 'insurance',
      title: '为家庭配置保障',
      icon: Shield,
      details: [
        {
          label: '本人',
          items: [
            '重疾责任保额建议：50万元，保障期限30年，覆盖重大疾病治疗费用',
            '意外责任保额建议：100万元，保障期限30年，保障意外伤害和医疗费用',
            '身故责任保额建议：80万元，保障期限30年，保障家庭责任和债务偿还'
          ]
        },
        {
          label: '伴侣',
          items: [
            '重疾责任保额建议：30万元，保障期限30年，覆盖重大疾病治疗费用',
            '意外责任保额建议：60万元，保障期限30年，保障意外伤害和医疗费用',
            '身故责任保额建议：50万元，保障期限30年，保障家庭责任和债务偿还'
          ]
        },
        {
          label: '子女',
          items: [
            '重疾责任保额建议：20万元，保障期限20年，覆盖重大疾病治疗费用',
            '意外责任保额建议：20万元，保障期限20年，保障意外伤害和医疗费用'
          ]
        }
      ],
      priority: 'high',
      timeframe: '本月内完成'
    },
    {
      id: 'housing-mortgage',
      title: '贷款买房计划',
      icon: Building,
      details: [
        '购房全款：500万元',
        '系统已结合您的未来收入支出情况和偿债能力，建议房贷金额为250万元',
        '系统已综合计算，建议贷款期限为25年以获得最优的还款压力与灵活性'
      ],
      priority: 'high',
      timeframe: '买房决策前规划'
    },
    {
      id: 'career-planning',
      title: '重新规划一下工作生涯',
      icon: Target,
      details: [
        '评估当前技能和市场需求',
        '制定3-5年职业发展路径',
        '考虑兼职或副业机会',
        '目标年收入增长：20-30%'
      ],
      priority: 'high',
      timeframe: '本季度开始规划'
    },
    {
      id: 'sell-property',
      title: '出售房产补充现金流',
      icon: Building,
      details: [
        '今年预计需出售1套房产（面积：70㎡），以补充年度支出。',
        '预估出售总价为300万元，扣除尚未还清的房贷后，实际到手金额为177万元。',
        '出售房产不仅能一次性补充大额现金流，还能大幅缓解家庭年度收支压力，让您的生活更加从容安心。',
        '建议提前规划出售流程，合理安排资金用途，确保家庭现金流稳定无忧。'
      ],
      priority: 'high',
      timeframe: '根据资金需求及时操作'
    }
  ];

  // 为会员用户过滤掉"建议购房方式"卡片
  const actionItems = isMember 
    ? allActionItems.filter(item => item.id !== 'housing-mortgage')
    : allActionItems;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-700 bg-red-50';
      case 'medium': return 'text-amber-700 bg-amber-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '高优先级';
      case 'medium': return '中优先级';
      case 'low': return '低优先级';
      default: return '一般';
    }
  };

  return (
    <div className="space-y-6" id="next-actions-section">
      {/* 模块标题 */}
      <div className="flex items-center space-x-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#CAF4F7' }}
        >
          <Zap className="w-5 h-5" style={{ color: '#0891b2' }} />
        </div>
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-gray-800">下一步行动</h2>
          <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full border border-amber-200">
            <Crown className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-medium text-amber-700">会员专属</span>
          </div>
        </div>
      </div>

      {/* 说明文字 */}
      <p className="text-gray-600 leading-relaxed">
        基于您的财务分析结果，我们为您制定了具体的行动计划。请按优先级顺序执行，每完成一项都将显著改善您的财务状况。
      </p>

      {/* 折叠式行动项目列表 */}
      <Accordion type="multiple" className="space-y-4">
        {actionItems.map((action, index) => {
          const IconComponent = action.icon;
          const isInsuranceCard = action.id === 'insurance';
          const isCareerPlan = action.id === 'career-planning';
          const isCancelHouseImprovement = action.id === 'cancel-house-improvement';
          const isCancelHouseInvestment = action.id === 'cancel-house-investment';

          return (
            <AccordionItem key={action.id} value={action.id} className="border-0">
              <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center space-x-4 w-full">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(202, 244, 247, 0.6)' }}
                    >
                      <IconComponent className="w-6 h-6" style={{ color: '#0891b2' }} />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="text-lg font-semibold text-gray-800 leading-tight">
                        {index + 1}. {action.title}
                      </h3>
                      <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(action.priority)}`}>
                        {getPriorityText(action.priority)}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent>
                  <CardContent className="px-6 pb-6 pt-0">
                    <div className="border border-gray-100 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-medium text-gray-800 mb-3">参考建议：</h4>
                      {isInsuranceCard ? (
                        <div className="space-y-3">
                          {(action.details as Array<{ label: string; items: string[] }>).map((personGroup, groupIdx) => (
                            <div key={personGroup.label}>
                              <div className="flex items-center mb-1 space-x-2">
                                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#0891b2' }} />
                                <span className="font-medium text-gray-800 text-sm">{personGroup.label}</span>
                              </div>
                              <div className="pl-6 space-y-1">
                                {personGroup.items.map((item, itemIdx) => (
                                  <div key={itemIdx} className="flex items-start space-x-2">
                                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {(action.details as string[]).map((detail, detailIndex) => (
                            <div key={detailIndex} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#0891b2' }} />
                              <span className="text-sm text-gray-700">{detail}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 自定义按钮和执行时间 */}
                    {isCancelHouseImprovement ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          执行时间：{action.timeframe}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all"
                          onClick={() => {
                            navigate('/adjustment-advice');
                          }}
                        >
                          查看支出压缩方案
                        </Button>
                      </div>
                    ) : isCancelHouseInvestment ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          执行时间：{action.timeframe}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all"
                          onClick={() => {
                            navigate('/adjustment-advice');
                          }}
                        >
                          去调平
                        </Button>
                      </div>
                    ) : isCareerPlan && isMember ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          执行时间：{action.timeframe}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all rounded-full px-5"
                          onClick={() => {
                            navigate('/career-plan-coach');
                          }}
                        >
                          去规划
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          执行时间：{action.timeframe}
                        </span>
                        {index === 4 && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all"
                            onClick={() => {
                              navigate('/protection-advice');
                            }}
                          >
                            查看详情
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* 执行建议 - 非会员状态显示 */}
      {!isMember && (
        <div 
          className="rounded-lg p-6 border border-gray-100"
          style={{ backgroundColor: 'rgba(202, 244, 247, 0.2)' }}
        >
          <div className="flex items-start space-x-4">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#CAF4F7' }}
            >
              <Zap className="w-4 h-4" style={{ color: '#0891b2' }} />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">执行建议</h4>
              <p className="text-gray-700 mb-3">
                建议您优先执行高优先级的行动项目，这些措施将直接改善您的财务安全性。
                中低优先级的项目可以根据实际情况和资金状况逐步实施。
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>• 预计总投入：15-20万元</span>
                <span>• 预期改善周期：6-12个月</span>
                <span>• 风险降低程度：显著</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NextActionsSection;
