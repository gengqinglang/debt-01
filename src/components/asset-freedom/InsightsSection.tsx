import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Smartphone, CheckCircle, ChevronDown, Check, X, ArrowRight, Target, Shield, TrendingUp, Heart, Briefcase, Home, DollarSign, AlertTriangle, Users, Info, Eye, MessageCircle, HelpCircle, Zap, TrendingDown, Sparkles, Search, FileText, Settings, User, Share } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import PaymentModal from './PaymentModal';
import ContentPreview from './ContentPreview';
import PurchaseOptions from './PurchaseOptions';
import CongratulationsModal from './CongratulationsModal';

interface InsightsSectionProps {
  isUnlocked: boolean;
  isMember: boolean;
}

const InsightsSection: React.FC<InsightsSectionProps> = ({ isUnlocked, isMember }) => {
  // 会员状态不显示任何内容
  if (isMember) {
    return null;
  }

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [showMembershipDialog, setShowMembershipDialog] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginStep, setLoginStep] = useState<'phone' | 'verification' | 'success'>('phone');
  const [paymentType, setPaymentType] = useState<'unlock' | 'membership'>('unlock');
  const [pendingRiskNavigation, setPendingRiskNavigation] = useState(false);
  const [isSecondaryRisksOpen, setIsSecondaryRisksOpen] = useState(false);

  // 祝贺弹窗状态
  const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
  const [isMembershipSuccess, setIsMembershipSuccess] = useState(false);

  // 统一的功能对比数据
  const features = [
    { name: '快照解读', unlock: true, membership: true, annual: true },
    { name: '重疾风险测评', unlock: false, membership: true, annual: true },
    { name: '重疾保障方案', unlock: false, membership: true, annual: true },
    { name: '意外风险测评', unlock: false, membership: true, annual: true },
    { name: '意外保障方案', unlock: false, membership: true, annual: true },
    { name: '消费防御', unlock: false, membership: true, annual: true },
    { name: '投资防御', unlock: false, membership: true, annual: true },
    { name: '失业风险测评', unlock: false, membership: true, annual: true },
    { name: '职业规划', unlock: false, membership: true, annual: true },
    { name: '婚姻风险测评', unlock: false, membership: true, annual: true },
  ];

  const handleUnlock = () => {
    if (!isLoggedIn) {
      setPaymentType('unlock');
      setShowLoginModal(true);
      setLoginStep('phone');
    } else {
      setPaymentType('unlock');
      setShowPaymentModal(true);
    }
  };

  const handleMembershipUpgrade = () => {
    if (!isLoggedIn) {
      setPaymentType('membership');
      setShowLoginModal(true);
      setLoginStep('phone');
    } else {
      setPaymentType('membership');
      setShowPaymentModal(true);
    }
  };

  const handleLoginNext = () => {
    if (loginStep === 'phone') {
      setLoginStep('verification');
    } else if (loginStep === 'verification') {
      setLoginStep('success');
      setTimeout(() => {
        setIsLoggedIn(true);
        setShowLoginModal(false);
        setShowPaymentModal(true);
      }, 1500);
    }
  };

  const handlePaymentSuccess = () => {
    console.log('=== 支付成功处理开始 ===');
    console.log('支付成功，支付类型:', paymentType);
    
    if (paymentType === 'membership') {
      console.log('开通会员流程开始...');
      
      // 先关闭支付弹窗
      setShowPaymentModal(false);
      console.log('支付弹窗已关闭');
      
      // 延迟更新状态，避免立即触发页面重新渲染
      setTimeout(() => {
        // 开通会员
        localStorage.setItem('assetFreedom_isMember', 'true');
        localStorage.setItem('assetFreedom_isUnlocked', 'true');
        console.log('会员状态已保存到localStorage');
        
        // 设置祝贺弹窗状态
        setIsMembershipSuccess(true);
        console.log('祝贺弹窗类型已设置为会员成功');
        
        // 再延迟一点显示祝贺弹窗，确保支付弹窗完全消失
        setTimeout(() => {
          setShowCongratulationsModal(true);
          console.log('=== 祝贺弹窗已设置为显示 ===');
        }, 100);
      }, 200);
      
    } else {
      // 单次解锁
      localStorage.setItem('assetFreedom_isUnlocked', 'true');
      setShowPaymentModal(false);
      console.log('单次解锁成功');
      
      // 延迟滚动到顶部，确保页面重新渲染完成
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        console.log('页面已滚动到顶部 - 解锁成功');
      }, 300);
    }
  };

  const handleEnterMemberArea = () => {
    console.log('=== 进入会员区域处理 ===');
    // 这里可以添加进入会员区域的特殊逻辑
    // 比如埋点、数据统计等
    console.log('会员已进入专区');
    
    // 滚动到测评工具模块
    setTimeout(() => {
      const assessmentSection = document.getElementById('assessment');
      if (assessmentSection) {
        const headerOffset = 120; // 考虑固定导航的高度
        const elementPosition = assessmentSection.offsetTop - headerOffset;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
        console.log('页面已滚动到测评工具模块 - 会员开通成功');
      } else {
        // 如果找不到测评工具模块，则滚动到顶部
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        console.log('未找到测评工具模块，滚动到顶部 - 会员开通成功');
      }
    }, 100);
  };

  const handleCongratulationsClose = () => {
    console.log('=== 祝贺弹窗关闭处理开始 ===');
    console.log('关闭祝贺弹窗，当前状态:', { showCongratulationsModal, isMembershipSuccess });
    
    setShowCongratulationsModal(false);
    setIsMembershipSuccess(false);
    
    console.log('祝贺弹窗状态已重置');
    
    // 如果有待处理的风险导航，现在跳转
    if (pendingRiskNavigation) {
      console.log('执行待处理的风险评估导航');
      setPendingRiskNavigation(false);
      navigate('/risk-assessment');
    }
  };

  const handleDetailButtonClick = () => {
    setShowMembershipDialog(true);
  };

  const handleRiskDetailClick = () => {
    // 设置待处理的风险导航标记，然后开通会员
    setPendingRiskNavigation(true);
    handleMembershipUpgrade();
  };

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
    // 查看测评依据的处理逻辑
    console.log('查看测评依据:', riskType);
    navigate('/assessment-basis', { state: { skipLoading: true } });
  };

  return (
    <div className="px-6 mb-6 space-y-6">
      {/* 快照解读模块标题 - 只在已解锁状态下显示 */}
      {isUnlocked && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CAF4F7' }}>
              <Lightbulb className="w-5 h-5 text-gray-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">快照解读</h3>
            {/* 已解锁标签 */}
            <div 
              className="flex items-center space-x-1 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: '#CAF4F7' }}
            >
              <CheckCircle className="w-3 h-3" />
              <span>已解锁</span>
            </div>
          </div>
        </div>
      )}

      {/* 根据状态显示不同内容 */}
      {!isUnlocked ? (
        // 普通客户状态：引导购买（不显示快照解读标题）
        <div className="space-y-6">
          {/* 需求说明区域 */}
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">您需要财富分型解读</h3>
            {/* 删除原有说明文案 */}
          </div>

          {/* 内容预览区域 */}
          <ContentPreview />

          {/* 选择对比区域 */}
          <PurchaseOptions
            onUnlock={handleUnlock}
            onMembershipUpgrade={handleMembershipUpgrade}
            onShowMembershipDialog={() => setShowMembershipDialog(true)}
          />
        </div>
      ) : (
        // 已解锁状态：显示快照解读内容 + 会员升级引导
        <div className="space-y-6">
          {/* 快照解读内容 */}
          <div className="relative">
            <div 
              className="rounded-2xl p-6 space-y-8"
              style={{ backgroundColor: 'rgba(202, 244, 247, 0.1)' }}
            >
              {/* 模块0：人设快照 - 已解锁状态下显示 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-700" />
                    <h4 className="text-lg font-semibold text-gray-800">人设快照</h4>
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
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">中度支出压缩型</h3>
                  <Badge variant="secondary" className="bg-[#B3EBEF]/20 text-gray-700 text-sm px-4 py-2">
                    C01-I02-E03-R2
                  </Badge>
                </div>
              </div>

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
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <h4 className="text-lg font-semibold text-gray-800">您存在的潜在风险有哪些？</h4>
                </div>
                
                <div className="space-y-3">
                  {/* 第一段：风险总览 */}
                  <p className="text-sm text-gray-700 leading-relaxed">
                    您一共有
                    <span className="font-medium text-gray-800">5种潜在风险</span>
                    ，分别是：裁员降薪风险、重疾风险、意外风险、不当消费风险、不当举债风险。
                  </p>
                  
                  {/* 第二段：重点风险警告 */}
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-1">重点提示您关注——裁员降薪风险</p>
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      1、裁员降薪风险<br />
                      家庭收入单靠工资奖金，就像独木支撑大厦。行业寒冬、企业裁员、AI抢岗，都可能瞬间砍断收入来源。但房贷、教育、医疗账单仍如潮水涌来，积蓄快速消耗。若无法及时"回血"，债务危机一触即发，生活品质崩塌，未来规划全泡汤。
                    </p>
                    {/* 会员状态下显示查看测评依据按钮 */}
                    {isMember && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs text-gray-600 border-gray-300 hover:bg-gray-50 mb-2"
                        onClick={() => handleViewAssessmentBasis('裁员降薪风险')}
                      >
                        查看测评依据
                      </Button>
                    )}
                    {isMember && (
                      <Button
                        size="sm"
                        className="mt-2 text-xs bg-orange-500 text-white hover:bg-orange-600"
                        onClick={handleRiskDetailClick}
                      >
                        获取详细解决方案
                      </Button>
                    )}
                  </div>
                  
                  {/* 第三段：次要风险列表 */}
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
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-800">重疾风险</p>
                              {isMember && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs text-gray-600 border-gray-300 hover:bg-gray-50 px-2 py-1 h-6"
                                  onClick={() => handleViewAssessmentBasis('重疾风险')}
                                >
                                  查看测评依据
                                </Button>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              由于您的资产数额仅够覆盖未来家庭大事的开支，这意味着一旦家庭成员罹患重疾，可能会面临"没钱看病"或"因收入中断而影响家庭大事"的风险。当然，如果您已经购买了重疾保险，这可能在一定程度上起到风险转移的作用。但由于我们没有获取您的保险信息，所以无法确认现有保障是否充足。
                            </p>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-800">意外风险</p>
                              {isMember && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs text-gray-600 border-gray-300 hover:bg-gray-50 px-2 py-1 h-6"
                                  onClick={() => handleViewAssessmentBasis('意外风险')}
                                >
                                  查看测评依据
                                </Button>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              由于您的资产数额仅够覆盖未来家庭大事的开支，这意味着一旦家庭成员遭遇意外事故，可能会面临"没钱治疗"或"因收入中断而影响家庭大事"的风险。当然，如果您已经购买了意外险，这可能在一定程度上起到风险转移的作用。但由于我们没有获取您的保险信息，所以无法确认现有保障是否充足。
                            </p>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-800">不当消费风险</p>
                              {/*
                                不再显示会员按钮
                              */}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              这种风险主要源于您此前设定的生活品质目标并非最高标准。如果未来您对生活品质的要求有所提升（如追求更高层次的居住条件、教育投入或休闲方式等），现有资产可能难以满足这些新增需求，从而导致资产不足的风险。
                            </p>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-800">不当举债风险</p>
                              {isMember && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs text-gray-600 border-gray-300 hover:bg-gray-50 px-2 py-1 h-6"
                                  onClick={() => handleViewAssessmentBasis('不当举债风险')}
                                >
                                  查看测评依据
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

              {/* 模块 4：我们的建议 */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Zap className="w-4 h-4 text-gray-700" />
                  <h4 className="text-lg font-semibold text-gray-800">我们的建议</h4>
                </div>
                <div className="space-y-3">
                  {/* 新方案文案 */}
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      1、职场避险：技能、副业、行业三策略
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-sm text-gray-700">
                      <li>
                        提升竞争力：深耕专业技能，项目管理等通用技能，学习AI工具等新技能。
                      </li>
                      <li>
                        发展副业：根据自身特长开展副业，如自媒体、设计接单、电商带货等，增加收入来源；
                      </li>
                      <li>
                        关注行业：定期了解行业动态，若发现行业前景不佳、缺乏发展空间时，提前规划转型方向；
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      2、建议进行保单检视
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      为确保万无一失，建议您进行一次保单检视，以全面了解保障情况，并根据需要补充完善，从而更好地保护家庭目标不受意外冲击。
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      3、预算指路，记账护航
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      提前做好预算规划与日常记账管理尤为关键，就像为人生目标绘制清晰的路线图，让每一笔储蓄都有的放矢。而日常记账则是实时监测财务健康的"体检仪"，帮助您清晰掌握资金流向，及时发现并调整不合理消费。
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      4、举债避坑，先测负债"承重线"
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      不当举债风险的发生和资产数额的高低并没有直接关系，高资产的人如果不当举债也会出现风险，识别风险的关键在于判断合理的负债能力。因此负债前一定要做好负债能力的评估更为关键。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 专业解读指导模块 - 引导升级会员 */}
          <div className="mt-6">
            <div
              className="cursor-pointer hover:shadow-lg transition-shadow duration-300 p-6 rounded-2xl"
              onClick={() => setShowMembershipDialog(true)}
              style={{ backgroundColor: 'rgba(202, 244, 247, 0.6)' }}
            >
              <div className="space-y-4 mb-6">
                <h4 className="text-lg font-semibold text-gray-800">
                  您准备如何解决这些风险？
                </h4>
                <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                  <p className="font-medium text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    警告：您面临5大风险同时存在！网上随便找的通用建议不适合您的具体情况，错误行动比不行动更危险！
                  </p>
                  <p className="text-gray-800 font-medium">
                    很多人看到这些建议后，会觉得"我懂了，回去自己照着做就行"。但现实是：
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-gray-700">
                    <li>通用建议无法匹配您的具体收入、支出、资产结构</li>
                    <li>没有详细的执行时间表和优先级排序，容易半途而废</li>
                    <li>缺乏个性化的风险评估，可能遗漏关键风险点</li>
                    <li>没有专业指导，执行过程中遇到问题无人解答</li>
                  </ul>
                  <p className="font-medium text-gray-800">
                    财务规划不是"看懂了就能做好"的事，您需要的是：
                  </p>
                  <div className="bg-white rounded-lg p-4">
                    <p className="flex items-start space-x-2 mb-2">
                      <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                      <span><strong>针对您的精准评估：</strong>不是通用模板，是基于您的实际情况量身定制的风险分析</span>
                    </p>
                    <p className="flex items-start space-x-2 mb-2">
                      <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                      <span><strong>详尽的行动清单：</strong>具体到每个月该做什么、怎么做、注意什么，不让您迷茫</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <Settings className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                      <span><strong>全程专业指导：</strong>执行过程中的疑问随时解答，确保每一步都走对</span>
                    </p>
                  </div>
                  <p className="font-medium text-gray-800">
                    现在您有两个选择：
                  </p>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-800 mb-2">🔥 立即行动（推荐）</p>
                    <p className="text-sm">开通会员，获得系统性的个性化解决方案，有专业团队为您护航</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-800 mb-2">🏢 寻求线下咨询</p>
                    <p className="text-sm">找专业的财务规划师进行一对一咨询（通常费用在3000-8000元/次）</p>
                  </div>
                  <p className="font-medium text-red-600">
                    ⚠️ 切记：拖延只会让风险放大，现在就要开始行动！
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold text-gray-800">开通会员，获得专业指导方案</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="text-sm font-medium">立即行动</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold" style={{ color: '#01BCD6' }}>29.9元/月</span>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-500 line-through">原价99元/月</span>
                      <span className="font-medium" style={{ color: '#01BCD6' }}>限时特价</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 登录、支付、祝贺弹窗等保持不变 */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center space-x-2">
              <Smartphone className="w-5 h-5 text-green-600" />
              <span>微信登录</span>
            </DialogTitle>
            <DialogDescription className="text-center">
              {loginStep === 'phone' && '请输入手机号码进行登录'}
              {loginStep === 'verification' && '请输入验证码'}
              {loginStep === 'success' && '登录成功！'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {loginStep === 'phone' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">手机号码</label>
                  <input 
                    type="tel" 
                    placeholder="请输入手机号码"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    defaultValue="138****8888"
                  />
                </div>
                <Button 
                  onClick={handleLoginNext}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  获取验证码
                </Button>
              </>
            )}

            {loginStep === 'verification' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">验证码</label>
                  <input 
                    type="text" 
                    placeholder="请输入6位验证码"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    defaultValue="123456"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  验证码已发送至 138****8888
                </p>
                <Button 
                  onClick={handleLoginNext}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  确认登录
                </Button>
              </>
            )}

            {loginStep === 'success' && (
              <div className="text-center space-y-4 py-8">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <p className="text-lg font-medium text-gray-800">登录成功！</p>
                <p className="text-sm text-gray-600">即将跳转到支付页面...</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
        amount={paymentType === 'unlock' ? '9.9' : '29.9'}
        title={paymentType === 'unlock' ? '支付解锁内容' : '开通月度会员'}
        description={paymentType === 'unlock' ? '选择支付方式完成 9.9 元付款' : '选择支付方式完成 29.9 元付款'}
      />

      <CongratulationsModal
        isOpen={showCongratulationsModal}
        onClose={handleCongratulationsClose}
        isMembershipSuccess={isMembershipSuccess}
        onEnterMemberArea={handleEnterMemberArea}
      />

      <AlertDialog open={showMembershipDialog} onOpenChange={setShowMembershipDialog}>
        <AlertDialogContent className="w-[95vw] max-w-5xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">会员权益对比</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p className="text-center text-sm text-gray-600">
                  对比 9.9 元解锁 vs 29.9 元月度会员 vs 199 元年度会员权益
                </p>
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/4 text-xs sm:text-sm">功能</TableHead>
                        <TableHead className="text-center text-xs sm:text-sm">9.9元<br className="hidden sm:block"/>单次解锁</TableHead>
                        <TableHead className="text-center text-xs sm:text-sm">29.9元<br className="hidden sm:block"/>月度会员</TableHead>
                        <TableHead className="text-center text-xs sm:text-sm">199元<br className="hidden sm:block"/>年度会员</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {features.map((feature, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium text-xs sm:text-sm">{feature.name}</TableCell>
                          <TableCell className="text-center">
                            {feature.unlock ? (
                              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mx-auto" />
                            ) : (
                              <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mx-auto" />
                          </TableCell>
                          <TableCell className="text-center">
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mx-auto" />
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-gray-50">
                        <TableCell className="font-medium text-xs sm:text-sm">测评次数</TableCell>
                        <TableCell className="text-center font-medium text-xs sm:text-sm text-orange-600">仅1次</TableCell>
                        <TableCell className="text-center font-medium text-xs sm:text-sm text-green-600">不限制</TableCell>
                        <TableCell className="text-center font-medium text-xs sm:text-sm text-green-600">不限制</TableCell>
                      </TableRow>
                      <TableRow className="bg-gray-50">
                        <TableCell className="font-medium text-xs sm:text-sm">会员期限</TableCell>
                        <TableCell className="text-center text-gray-500 text-xs sm:text-sm">-</TableCell>
                        <TableCell className="text-center font-medium text-xs sm:text-sm">1个月</TableCell>
                        <TableCell className="text-center font-medium text-xs sm:text-sm">12个月</TableCell>
                      </TableRow>
                      <TableRow className="bg-gray-50">
                        <TableCell className="font-medium text-xs sm:text-sm">平均月费</TableCell>
                        <TableCell className="text-center text-gray-500 text-xs sm:text-sm">-</TableCell>
                        <TableCell className="text-center font-medium text-xs sm:text-sm">¥29.9</TableCell>
                        <TableCell className="text-center font-medium text-green-600 text-xs sm:text-sm">¥16.6</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div className="rounded-lg p-3" style={{ backgroundColor: '#CAF4F7' }}>
                  <div className="flex items-start space-x-2">
                    <div className="text-gray-700 font-medium text-sm">🔥 限时折扣：</div>
                    <div className="text-sm text-gray-700">
                      会员原价 99 元/月，现在限时折扣仅需 29.9 元/月，
                      <span className="font-medium text-gray-800">立省 70% 费用</span>
                    </div>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-gray-800 text-white hover:bg-gray-900"
              onClick={handleMembershipUpgrade}
            >
              开通月度会员
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InsightsSection;
