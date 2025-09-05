import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface InvestmentGuideDetailPageProps {
  onBack: () => void;
}

const InvestmentGuideDetailPage = ({ onBack }: InvestmentGuideDetailPageProps) => {
  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">如何避免不当投资？</h1>
        </div>
      </div>

      {/* 内容区域 - 可滑动 */}
      <div className="overflow-y-auto h-[calc(100vh-73px)]">
        <div className="px-4 py-6">
          <Card className="mx-0">
            <CardContent className="p-4">
              <div className="prose prose-gray max-w-none prose-sm">
              <h1 className="text-lg font-bold text-gray-900 mb-4">如何避免不当投资？</h1>
              
              <div className="space-y-4">
                {/* 第一部分 */}
                  <section>
                    <h2 className="text-base font-semibold text-gray-800 mb-2">一、核心前提：明确家庭投资约束</h2>
                  <p className="text-sm text-gray-700 mb-2">
                    家庭金融资产投资首要原则是确保用钱时能足额及时取出，这决定了必须明确以下投资约束条件：
                  </p>
                    <ul className="space-y-2 text-sm text-gray-700 ml-2">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>投多少：</strong>取决于资金用途，根据家庭资金需求规划确定。</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>能投多久：</strong>依据资金使用时间确定，防止投资期限与用款时间冲突。</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>投资标的的风险：</strong>考量所投产品的风险程度是否在家庭可承受范围内。</span>
                    </li>
                  </ul>
                  <p className="text-sm text-gray-700 mt-2">
                    而不当投资，指的是违背上述投资约束条件的投资行为，比如投资金额影响家庭正常用款、投资期限与资金使用时间冲突、所投产品风险超出家庭可承受范围等。
                  </p>
                </section>

                {/* 第二部分 */}
                  <section>
                    <h2 className="text-base font-semibold text-gray-800 mb-2">二、当前资产尚未投资：核心任务是如何规避不当投资</h2>
                  
                    <div className="ml-2 space-y-3">
                    <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-2">（一）产品筛选逻辑</h3>
                        <ul className="space-y-2 text-sm text-gray-700 ml-2">
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>选择起点金额与计划投资数额相匹配的产品；</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>选择期限与资金可投资时长相契合的产品。</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-2">（二）风险匹配原则</h3>
                        <ul className="space-y-2 text-sm text-gray-700 ml-2">
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>个人风险评级是购买产品的风险上限，具体产品风险需结合系统给定的投资期限确定。</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>原则上：五年内需用的资金，除非已实现财务自由，否则尽可能不投资五级以上高风险产品，避免用钱时因市场波动受损。</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-2">（三）借助系统与专业力量</h3>
                        <ul className="space-y-2 text-sm text-gray-700 ml-2">
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span><strong>系统作用：</strong>解决"投多少""能投多久"的难题，按指引操作可减少因这两项因素导致的不当投资。</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span><strong>专业支持：</strong>"投什么"可咨询专业顾问，获取符合约束条件的产品建议，进一步规避风险。</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* 第三部分 */}
                  <section>
                    <h2 className="text-base font-semibold text-gray-800 mb-2">三、当前资产已经投资：核心任务是排查是否存在不当投资风险</h2>
                  
                  <div className="ml-2 space-y-3">
                    <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-2">（一）对照投资约束开展资产检视</h3>
                        <ul className="space-y-2 text-sm text-gray-700 ml-2">
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>已投产品金额和到期日是否与系统提示的用款时间匹配，是否存在因金额或期限问题导致的用款风险；</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>已投产品到期时是否存在投资损失风险，其风险等级是否超出家庭可承受范围；</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>已投产品收益是否达到预期，收益未达预期是否影响家庭目标实现。</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-2">（二）具体操作</h3>
                        <ul className="space-y-2 text-sm text-gray-700 ml-2">
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>联系理财经理，详细了解产品运作情况、风险变化及未来走势；</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>若发现存在不当投资风险，及时制定调整方案，如赎回部分或全部产品、更换投资标的等，避免影响家庭资金安排。</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvestmentGuideDetailPage;