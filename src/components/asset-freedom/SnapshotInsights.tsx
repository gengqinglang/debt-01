
import React, { useState } from 'react';
import { Lightbulb, MessageCircle, HelpCircle, AlertTriangle, Zap, ChevronDown, User, Share, RotateCcw } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import NextActionsSection from './NextActionsSection';

interface TraitData {
  label: string;
  value: string;
  color: string;
  percentage: string;
  progressWidth: number;
}

interface SnapshotInsightsProps {
  isMember?: boolean;
}

const SnapshotInsights: React.FC<SnapshotInsightsProps> = ({ isMember = false }) => {
  const [isSecondaryRisksOpen, setIsSecondaryRisksOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '生涯财富快照：节俭型家族继承者',
        text: '查看我的财富状况分析报告',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "数据传输完成",
        description: "快照链接已复制到剪贴板"
      });
    }
  };

  const handleViewAssessmentBasis = (riskType: string) => {
    // 导航到测评依据页面，并传递 skipLoading 给location.state
    console.log('导航到测评依据页面:', riskType);
    navigate('/assessment-basis', { state: { skipLoading: true } });
  };

  const handleReassessment = () => {
    // 导航到重新测评页面
    console.log('导航到重新测评页面');
    navigate('/');
  };

  return (
    <div className="space-y-6">
      {/* 解读内容 */}
      <div 
        className="rounded-2xl p-6 space-y-8"
        style={{ backgroundColor: 'rgba(202, 244, 247, 0.1)' }}
      >
        {/* 模块0：人设快照（仅在会员状态下显示） */}
        {isMember && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-700" />
                <h4 className="text-lg font-semibold text-gray-800">人设快照</h4>
                {/* 重新测评按钮 */}
                <Button 
                  onClick={handleReassessment}
                  size="sm"
                  className="text-xs text-gray-600 border-0 ml-2"
                  style={{ backgroundColor: '#CAF4F7' }}
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  重新测评
                </Button>
              </div>
              {/* 分享按钮 */}
              <Button 
                onClick={handleShare} 
                className="bg-[#B3EBEF] hover:bg-[#B3EBEF]/80 text-gray-800 border-0 rounded-full w-8 h-8 p-0 font-semibold shadow-lg"
              >
                <Share className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-4">中度支出压缩型</h3>
              <Badge variant="secondary" className="bg-[#B3EBEF]/20 text-gray-700 text-xs px-3 py-1">
                C01-I02-E03-R2
              </Badge>
            </div>
          </div>
        )}

        {/* 模块1：这种财富分型意味着什么？ */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <MessageCircle className="w-4 h-4 text-gray-700" />
            <h4 className="text-lg font-semibold text-gray-800">这种财富分型意味着什么？</h4>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-700 leading-relaxed">
              您的财富分型属于中度压缩型。这意味着您的规划整体是不合理的，必须对生活规划来一场"大整顿"！改善住房先别想了，只能暂时维持现状，原本升级生活品质的计划也得按下暂停键。日常开销上，像周末约朋友聚会、健身房打卡、大牌护肤品这些享受型消费，都得大刀阔斧砍掉；逢年过节的人情往来、请家政帮忙打扫，频次也得一减再减。至于种草已久的大牌珠宝、心心念念的海外旅行，更是得彻底搁置。这些调整确实会让日子少了很多"小确幸"，生活舒适度会明显下降，但这也是帮您渡过财务难关的必经之路。
            </p>
          </div>
        </div>

        {/* 模块 2：为什么您是这种类型？ */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <HelpCircle className="w-4 h-4 text-gray-700" />
            <h4 className="text-lg font-semibold text-gray-800">为什么您是这种类型？</h4>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-700 leading-relaxed mb-1">
                这一财富分型的形成，核心症结在于资产虽多"不够用"与收入结构"独木难支"，成为制约财务收支平衡的两大枷锁。
              </p>
              <p className="text-sm text-gray-800 font-semibold mt-4">症结一：资产虽多"不够用"的深层的原因</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                你处于职业发展高峰期，工资水平中低但资产高，形成这种资产现状的原因可能是以下几点：
              </p>
              <ul className="pl-4 list-disc text-gray-700 space-y-1 text-sm">
                <li>
                  <span className="font-semibold">1、家庭财富支持或遗产继承：</span>
                  你的高资产可能主要来源于家庭财富的支持或遗产继承。即使当前工资不高，你可能通过父母一代的房产、存款或其他资产直接获得大额财富（如早期房产增值、家族企业分红等）。这种代际财富转移为你提供了高资产的基础。
                </li>
                <li>
                  <span className="font-semibold">2、早期抓住重大资产增值机会：</span>
                  你的高资产可能得益于早期的关键决策，比如在房价低点购房、参与早期股权投资或投资稀缺资源（如一线城市核心地段房产）。这些资产随着时间增值显著，即便当前工资不高，也足以支撑你的高资产状态。
                </li>
                <li>
                  <span className="font-semibold">3、资产配置稳健，被动收入稳定：</span>
                  尽管工资中低，但你可能拥有稳健的资产配置（如房产租金、股息分红、理财收益），形成了稳定的被动收入来源。这部分收入能够持续补充现金流，避免对工资收入的依赖，同时进一步扩大你的资产规模。
                </li>
                <li>
                  <span className="font-semibold">4、高杠杆运作与资本操作能力：</span>
                  你可能通过高杠杆运作（如低息贷款购房）或资本操作（如股权质押融资）获取资产，并利用资产升值带来的收益维持资产增长。虽然工资不高，但资产增值和资本运作能力弥补了现金流不足的问题。
                </li>
                <li>
                  <span className="font-semibold">5、职业发展初期积累的核心资产：</span>
                  尽管目前工资中低，但在职业发展初期，你可能积累了关键资产（如低价购入房产或股权），这些资产在后期大幅增值，成为你高资产的主要来源。如今，你更多依赖资产增值而非薪资收入。
                </li>
              </ul>
              <p className="text-sm text-gray-800 font-semibold mt-4">症结二：收入结构"独木难支"</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                收入来源高度依赖主动收入，形成"独木难支"的脆弱格局，抗风险能力薄弱。缺乏被动收益作为补充缓冲，仅靠你一人的有限固定工资，收入水平不高且不稳定，已难以应对突发支出与生活成本的持续上涨。这种结构性失衡，在长期生活压力下逐渐显露出支撑力不足的短板，成为"支出压缩"的核心症结。
              </p>
            </div>
          </div>
        </div>

        {/* 模块 3：风险揭示 */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-gray-700" />
            <h4 className="text-lg font-semibold text-gray-800">您存在的潜在风险有哪些？</h4>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-gray-700 leading-relaxed">
              您一共有
              <span className="font-medium text-gray-800">5种潜在风险</span>
              ，分别是：裁员降薪风险、重疾风险、意外风险、不当消费风险、不当举债风险。
            </p>
            
            <div>
              <p className="text-sm font-medium text-gray-800 mb-1">重点提示您关注——裁员降薪风险</p>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                1、裁员降薪风险<br />
                家庭收入单靠工资奖金，就像独木支撑大厦。行业寒冬、企业裁员、AI抢岗，都可能瞬间砍断收入来源。但房贷、教育、医疗账单仍如潮水涌来，积蓄快速消耗。若无法及时"回血"，债务危机一触即发，生活品质崩塌，未来规划全泡汤。
              </p>
              {isMember && (
                <Button
                  size="sm"
                  className="text-xs text-gray-600 border-0 mt-2"
                  style={{ backgroundColor: '#E7FBFB' }}
                  onClick={() => handleViewAssessmentBasis('裁员降薪风险')}
                >
                  查看测评依据（会员专属）
                </Button>
              )}
            </div>
            
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
                        由于您的资产数额仅够覆盖未来家庭大事的开支，这意味着一旦家庭成员罹患重疾，可能会面临"没钱看病"或"因收入中断而影响家庭大事"的风险。当然，如果您已经购买了重疾保险，这可能在一定程度上起到风险转移的作用。但由于我们没有获取您的保险信息，所以无法确认现有保障是否充足。
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
                        由于您的资产数额仅够覆盖未来家庭大事的开支，这意味着一旦家庭成员遭遇意外事故，可能会面临"没钱治疗"或"因收入中断而影响家庭大事"的风险。当然，如果您已经购买了意外险，这可能在一定程度上起到风险转移的作用。但由于我们没有获取您的保险信息，所以无法确认现有保障是否充足。
                      </p>
                    </div>
                    {/* 不当消费风险 */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-800">不当消费风险</p>
                        {/* 不再显示会员按钮 */}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        这种风险主要源于您此前设定的生活品质目标并非最高标准。如果未来您对生活品质的要求有所提升（如追求更高层次的居住条件、教育投入或休闲方式等），现有资产可能难以满足这些新增需求，从而导致资产不足的风险。
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
                        不当举债有两层含义，一是超出家庭偿债能力的负债行为，二是为他人或企业担保造成的或有负债超出家庭偿付能力，由此带来的影响家庭既定大事实现的风险。
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>

        {/* 下一步行动模块 */}
        <NextActionsSection isMember={isMember} />
      </div>
    </div>
  );
};

export default SnapshotInsights;
