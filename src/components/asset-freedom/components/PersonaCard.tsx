import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertTriangle, Crown, ArrowRight, Smartphone, CheckCircle, Loader2, RefreshCw, ChevronDown, ChevronUp, History, Share, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useMembership } from '@/components/membership/MembershipProvider';
import { useNavigationState } from '@/hooks/useNavigationState';
import { useShareCard } from '@/hooks/useShareCard';
import ShareCard from './ShareCard';
import UpdateConfirmationModal from './UpdateConfirmationModal';

interface PersonaCardProps {
  onSwitchToPlanning?: () => void;
  pageMode?: 'member-severe-shortage' | 'member-liquidity-tight' | 'member-balanced' | 'public-severe-shortage' | 'public-liquidity-tight' | 'public-balanced';
  displayMode?: 'first-time' | 'returning';
  onDisplayModeChange?: (mode: 'first-time' | 'returning') => void;
  onNavigateToModule?: (module: 'life-events' | 'career-income' | 'assets-liabilities') => void;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ onSwitchToPlanning, pageMode, displayMode = 'first-time', onDisplayModeChange, onNavigateToModule }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isMember, setMembershipStatus, isDevMode } = useMembership();
  const { navigateWithState } = useNavigationState();
  
  // 登录流程状态
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginStep, setLoginStep] = useState<'phone' | 'verification' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  // 支付流程状态
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // 上一次分型提醒文案展开/收起状态
  const [isPreviousTypingExpanded, setIsPreviousTypingExpanded] = useState(false);

  // 再次模式下的展开状态
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);

  // 分享卡片状态
  const { showShareCard, openShareCard, closeShareCard } = useShareCard();

  // 更新确认弹窗状态
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  
  // 财富分型更新完成状态
  const [isWealthTypingUpdated, setIsWealthTypingUpdated] = useState(false);

  // 监听displayMode变化，切换到"returning"模式时重置更新状态
  useEffect(() => {
    if (displayMode === 'returning') {
      setIsWealthTypingUpdated(false);
    }
  }, [displayMode]);

  const handleViewInterpretation = () => {
    if (isMember) {
      // 会员状态下，切换到规划tab页
      if (onSwitchToPlanning) {
        onSwitchToPlanning();
      }
    } else {
      // 普通客户状态下，进入注册及开通会员支付流程
      setShowLoginModal(true);
      setLoginStep('phone');
    }
  };

  const handleLoginNext = () => {
    if (loginStep === 'phone') {
      if (!phoneNumber) {
        toast({
          title: "请输入手机号",
          description: "手机号不能为空",
          variant: "destructive"
        });
        return;
      }
      setLoginStep('verification');
    } else if (loginStep === 'verification') {
      if (!verificationCode) {
        toast({
          title: "请输入验证码",
          description: "验证码不能为空",
          variant: "destructive"
        });
        return;
      }
      setLoginStep('success');
      setTimeout(() => {
        setShowLoginModal(false);
        setShowPaymentModal(true);
      }, 1500);
    }
  };

  const handleWeChatPay = async () => {
    setIsProcessingPayment(true);
    
    try {
      // 模拟微信支付流程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('=== 支付成功处理 ===');
      console.log('当前环境:', { isDevMode });
      
      // 支付成功后的处理
      toast({
        title: "支付成功！",
        description: "欢迎成为会员，正在跳转到会员页面...",
      });
      
      setShowPaymentModal(false);
      
      // 设置会员状态
      setMembershipStatus(true, 'premium');
      console.log('会员状态已设置');
      
      // 跳转到会员状态的new页面
      setTimeout(() => {
        console.log('导航到/new页面');
        navigate('/new', { 
          state: { 
            activeTab: 'discover',
            membershipActivated: true 
          },
          replace: true
        });
      }, 1000);
      
    } catch (error) {
      console.error('支付处理错误:', error);
      toast({
        title: "支付失败",
        description: "请重试或联系客服",
        variant: "destructive"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // 修改：使用导航状态管理导航到personal-info页面
  const handleRetestWealthTyping = () => {
    navigateWithState('/personal-info', {
      sourceModule: 'new-page-retest'
    });
  };

  // 处理模块导航
  const handleNavigateToModule = (module: 'life-events' | 'career-income' | 'assets-liabilities') => {
    if (onNavigateToModule) {
      onNavigateToModule(module);
    }
  };

  // 处理财富分型更新完成
  const handleUpdateComplete = () => {
    setIsWealthTypingUpdated(true);
    navigate('/new', {
      state: {
        activeTab: 'discover',
        wealthTypingUpdated: true
      },
      replace: true
    });
  };

  return (
    <>
      <div className="space-y-4 md:space-y-6 relative">
        {/* 标题区域 - 简洁的标题设计 */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {displayMode === 'returning' ? '以下新闻和您有关' : '财富分型'}
            </h2>
          </div>
          {onDisplayModeChange && (
            <select 
              value={displayMode} 
              onChange={(e) => onDisplayModeChange(e.target.value as 'first-time' | 'returning')}
              className="text-xs px-2 py-1 border border-gray-300 rounded bg-white text-gray-700"
            >
              <option value="first-time">情况1: 首次</option>
              <option value="returning">情况2: 再次</option>
            </select>
          )}
        </div>

        {/* 主要财富分型卡片 - 背景图直接展示风格 */}
        <div className="space-y-4">
          {/* 财富分型卡片 */}
          <Card className="relative overflow-hidden shadow-lg border border-[#B3EBEF]/30">
            {/* 背景图区域 */}
            <div className="relative h-[363px]">
              <img 
                src={displayMode === 'returning' ? "/lovable-uploads/50486061-0aa7-43c3-9616-32288d3d748a.png" : "/lovable-uploads/f3a3c2b7-12a6-4536-872b-066b89f81519.png"}
                alt={displayMode === 'returning' ? "房贷利率新闻" : "财富分型背景"}
                className="w-full h-full object-cover brightness-115 contrast-85 opacity-85" 
              />
              
              {/* 失效标签已移除 - 不在图片右上角显示 */}
              
              {/* 分享按钮 - 仅在首次模式显示 */}
              {displayMode === 'first-time' && (
                <Button 
                  onClick={openShareCard} 
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-md hover:bg-white text-[#01BCD6] border border-white/50 rounded-full w-10 h-10 p-0 shadow-lg z-20"
                >
                  <Share className="w-4 h-4" color="black" />
                </Button>
              )}
              
              {/* 文字内容区域 - 半透明遮罩覆盖在图片底部 */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/[0.18] backdrop-blur-lg p-3 z-10">
                {displayMode === 'returning' ? (
                  /* 再次模式 - 新闻标题靠左展示 */
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-white mb-2">
                      房贷利率突破3%，对我有什么影响？
                    </h3>
                    <p className="text-sm text-white/90 font-medium">
                      智能分析政策变动对您财务规划的深度影响，助您精准决策未来投资方向
                    </p>
                  </div>
                ) : (
                  <>
                    {/* 财富分型名称和编码 */}
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-bold text-white">
                        {(pageMode?.endsWith('-liquidity-tight') || pageMode?.endsWith('-balanced')) ? '资产充裕型' : '中度支出压缩型'}
                      </h3>
                      <Badge className="bg-[#B3EBEF]/20 text-white border-[#B3EBEF]/30 font-medium text-sm px-3 py-1">
                        {(pageMode?.endsWith('-liquidity-tight') || pageMode?.endsWith('-balanced')) ? 'A3-E03-R6' : 'C01-I02-E03-R2'}
                      </Badge>
                    </div>
                    
                    {/* 财富状况描述 */}
                    <p className="text-sm leading-relaxed text-white font-medium mb-3">
                      {(pageMode?.endsWith('-liquidity-tight') || pageMode?.endsWith('-balanced')) ? (
                        "您已达到A3顶级财富水平，拥有真正的财富自由！"
                      ) : (
                        "您的财富状况亮红灯，支出挤压生活品质，需及时调整！"
                      )}
                    </p>
                    
                    {/* 按钮区域 - 现在在图片内部 */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={handleRetestWealthTyping}
                        variant="outline"
                        className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-white/30 font-medium text-sm py-2.5"
                      >
                        重新测评
                      </Button>

                      <Button
                        onClick={handleViewInterpretation}
                        className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 font-medium text-sm py-2.5 relative"
                      >
                        
                        <span>查看分型解读</span>
                        {!isMember && <Crown className="w-4 h-4 ml-2 text-yellow-300" />}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>


          {/* 历史分型信息 */}
          {(displayMode === 'first-time' || (displayMode === 'returning' && isDetailExpanded)) && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-600">上次分型记录</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPreviousTypingExpanded(!isPreviousTypingExpanded)}
                  className="h-6 px-2 text-gray-500 hover:text-gray-700 text-xs"
                >
                  {isPreviousTypingExpanded ? '收起' : '查看'}
                  {isPreviousTypingExpanded ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                </Button>
              </div>
              
              {isPreviousTypingExpanded && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">极限生存压缩型</span>
                    <Badge className="bg-red-100 text-red-700 border-red-200 text-xs px-2 py-1">C013-I02-E02-R2</Badge>
                  </div>
                  <p className="text-xs text-gray-600">上次测评显示为极限压缩型，经济状况较为紧张。通过优化规划，财富状况已有显著改善。</p>
                </div>
              )}
            </div>
          )}
        </div>

        </div>

      {/* 登录弹窗 */}
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
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
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
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  验证码已发送至 {phoneNumber}
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

      {/* 支付弹窗 */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">开通会员</DialogTitle>
            <DialogDescription className="text-center">
              选择支付方式完成会员开通
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* 价格信息 */}
            <div className="text-center bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-800 mb-1">¥29.9</div>
              <div className="text-sm text-gray-600">月度会员</div>
              <div className="text-xs text-gray-500 line-through">原价 ¥99</div>
            </div>

            {/* 会员权益 */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">会员权益：</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 专业风险评估和解决方案</li>
                <li>• 个性化财富管理建议</li>
                <li>• 完整的财富分型解读</li>
                <li>• 不限次数的工具使用</li>
              </ul>
            </div>

            {/* 微信支付按钮 */}
            <Button
              onClick={handleWeChatPay}
              disabled={isProcessingPayment}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  处理中...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.5 2A5.5 5.5 0 003 7.5v9A5.5 5.5 0 008.5 22h7a5.5 5.5 0 0015.5-5.5v-9A5.5 5.5 0 0015.5 2h-7zm0 2h7A3.5 3.5 0 0119 7.5v9a3.5 3.5 0 01-3.5 3.5h-7A3.5 3.5 0 015 16.5v-9A3.5 3.5 0 018.5 4zM12 6.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zm0 2a3.5 3.5 0 110 7 3.5 3.5 0 010-7z"/>
                  </svg>
                  微信支付 ¥29.9
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 更新确认弹窗 */}
      <UpdateConfirmationModal
        open={showUpdateModal}
        onOpenChange={setShowUpdateModal}
        onNavigateToModule={handleNavigateToModule}
        onUpdateComplete={handleUpdateComplete}
      />

      {/* 分享卡片 */}
      <ShareCard 
        isOpen={showShareCard} 
        onClose={closeShareCard} 
        pageMode={pageMode}
      />
    </>
  );
};

export default PersonaCard;
