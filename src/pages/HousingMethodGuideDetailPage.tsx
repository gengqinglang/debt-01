import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface HousingMethodGuideDetailPageProps {
  onBack: () => void;
}

const HousingMethodGuideDetailPage = ({ onBack }: HousingMethodGuideDetailPageProps) => {
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
          <h1 className="text-lg font-semibold text-gray-900">如何选对购房方式</h1>
        </div>
      </div>

      {/* 内容区域 - 可滑动 */}
      <div className="overflow-y-auto h-[calc(100vh-73px)]">
        <div className="px-4 py-6">
          <Card className="mx-0">
            <CardContent className="p-4">
              <div className="prose prose-gray max-w-none prose-sm">
                <h1 className="text-lg font-bold text-gray-900 mb-4">怎样选对购房方式？</h1>
                
                <p className="text-sm text-gray-700 mb-4">
                  在购房过程中，选择合适的购房方式至关重要，它不仅关系到当下的财务安排，更会对家庭未来多年的生活质量和财务规划产生深远影响。
                </p>
                
                <div className="space-y-4">
                  {/* 第一部分 */}
                  <section>
                    <h2 className="text-base font-semibold text-gray-800 mb-2">一、购房方式选择的重要性</h2>
                    <p className="text-sm text-gray-700 mb-2">
                      购房方式的选择之所以关键，可从以下几点具体来看：
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 ml-2">
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span><strong>直接影响经济压力大小：</strong>不同的购房方式会带来截然不同的资金负担。全款购房需要一次性拿出巨额资金，可能瞬间掏空家庭储蓄；而按揭购房的月供高低，会直接决定每个月的可支配收入，若选择不当，可能让家庭长期处于紧绷的还款状态；置换购买则需考虑旧房处置与新房购入的资金衔接，避免出现资金断裂的情况。</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span><strong>关联长期财务规划落地：</strong>购房是家庭重大支出，若方式选择不合理，可能挤压子女教育、养老储备等其他关键规划的资金。比如过度依赖按揭导致月供过高，可能不得不缩减孩子的教育投入或推迟养老储蓄计划；置换过程中若对资金估算失误，也可能影响其他财务安排。</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span><strong>关乎生活质量稳定性：</strong>一旦购房方式超出家庭承受能力，可能被迫削减日常必要开支，如饮食、医疗、休闲等，从而降低生活品质；严重时甚至可能面临逾期还款风险，影响个人征信。</span>
                      </li>
                    </ul>
                  </section>

                  {/* 第二部分 */}
                  <section>
                    <h2 className="text-base font-semibold text-gray-800 mb-2">二、常见的购房方式</h2>
                    <p className="text-sm text-gray-700 mb-2">
                      目前，主流的购房方式主要有以下三种：
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 ml-2">
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span><strong>全款购买：</strong>一次性支付全部房款，无需承担贷款利息，但对家庭资金实力要求极高，适合资金储备充足的家庭。</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span><strong>置换购买：</strong>通过出售现有房产，用所得房款购入新的房产。其中也包含置换加按揭的方式，即出售旧房后，若房款仍不足以支付新房款项，可申请按揭贷款补足差额，这种方式能在一定程度上减轻资金压力。</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span><strong>按揭购房：</strong>向银行等金融机构申请贷款，分期偿还本金和利息，无需一次性拿出巨额资金，能让更多家庭提前实现购房需求，但总体成本会因利息而增加。</span>
                      </li>
                    </ul>
                  </section>

                  {/* 第三部分 */}
                  <section>
                    <h2 className="text-base font-semibold text-gray-800 mb-2">三、选择购房方式的关键因素</h2>
                    <p className="text-sm text-gray-700 mb-2">
                      选择购房方式时，需综合考量多方面因素，以匹配家庭实际情况：
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 ml-2">
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span><strong>家庭经济实力：</strong>直接决定了能否承担全款购房，或置换、按揭过程中的资金周转与还款压力。</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span><strong>未来的收入预期：</strong>如果收入稳定且有增长空间，可能更适合选择按揭购房或置换加按揭的方式；若收入波动较大，则需谨慎评估。</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span><strong>房产的处置与衔接：</strong>对于置换购买，需考虑旧房的出售周期、价格等因素，确保与新房购买的时间和资金需求相匹配。同时，要关注处置房产对家庭收支的影响，比如处置掉一套正在出租的房产，会减少未来持续的租金收入，但也会相应减少该房产的物业费、维修费等养房开支，这些收支变化都需纳入考量。</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span><strong>家庭的其他财务规划：</strong>比如是否有子女教育、养老储备等需求，需与购房支出相协调，避免因购房过度占用资金而影响长期目标。</span>
                      </li>
                    </ul>
                  </section>

                  {/* 第四部分 */}
                  <section>
                    <h2 className="text-base font-semibold text-gray-800 mb-2">四、系统建议的核心依据</h2>
                    <p className="text-sm text-gray-700 mb-2">
                      系统给出购房建议的核心逻辑，始终围绕<strong>"现金流"</strong>展开，最终目标是保障家庭长期目标不受影响：
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      系统会全面分析家庭的现有资金、每月收入和支出情况，评估不同购房方式下的现金流变化。例如，对于按揭购房或置换加按揭，系统会计算每月还款额是否在家庭可承受范围内；对于置换购买，会将处置房产带来的租金收入增减、养房开支变化等因素纳入现金流分析，精细化评估置换购房是否影响家庭的日常开支、子女教育基金的积累、养老储备等长期目标的实现。
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      值得注意的是，个人不借助系统，很难准确计算现金流。这是因为现金流涉及家庭每月固定收入、浮动收入、日常固定支出、不定期支出、未来收入预期变化、各项债务还款等众多复杂变量，尤其是在决策按揭方式时，既要考虑如何选择贷款期限、还款方式以实现利息支出最小化，又要确保在整个还款期间有足够的现金流避免断供风险，个人很难精准权衡这两者的关系，容易出现计算偏差。
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      系统的购房方式建议旨在平衡购房需求与家庭长期财务健康。通过对现金流的合理规划，系统力求为用户推荐最适合其家庭情况的购房方式，在满足购房需求的同时，保障家庭长期的财务稳定和目标达成。
                    </p>
                  </section>

                  {/* 第五部分 */}
                  <section>
                    <h2 className="text-base font-semibold text-gray-800 mb-2">五、总结：跟随系统建议是最佳选择</h2>
                    <p className="text-sm text-gray-700 mb-2">
                      综合来看，购房方式的选择涉及诸多复杂因素，从家庭经济实力、收入预期到房产处置的收支变化，再到长期财务规划，每一项都需要细致考量。而系统的建议正是基于对这些因素的全面、精准分析，以现金流为核心，从保障家庭长期目标的角度出发，为用户量身定制。
                    </p>
                    <p className="text-sm text-gray-700">
                      尤其在面对按揭方式选择时，个人难以准确计算现金流，很难平衡利息支出最小化和不发生断供风险的诉求，而系统能凭借其强大的数据分析能力，精准测算各种变量影响，给出最优方案。它能够避免个人决策时可能出现的疏漏或主观判断偏差，确保购房方式既符合当下的购房需求，又不会对家庭的长期财务稳定造成影响。因此，跟随系统建议，无疑是在购房过程中做出的最佳选择。
                    </p>
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

export default HousingMethodGuideDetailPage;