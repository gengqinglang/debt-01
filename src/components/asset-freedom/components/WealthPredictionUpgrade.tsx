import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Crown, TrendingUp, Calendar, Heart, ArrowRight, Smartphone, CheckCircle, Loader2, Shield, Target, Users, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useMembership } from '@/components/membership/MembershipProvider';

const WealthPredictionUpgrade = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setMembershipStatus, isDevMode } = useMembership();
  
  // 登录流程状态
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginStep, setLoginStep] = useState<'phone' | 'verification' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  // 支付流程状态
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleUpgrade = () => {
    console.log('升级会员');
    // 开始登录流程
    setShowLoginModal(true);
    setLoginStep('phone');
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

  const handleViewBenefits = () => {
    navigate('/member-benefits');
  };

  return (
    <>
      <div className="space-y-4">
        {/* 整合的会员专享功能卡片 */}
        <Card className="bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 border-[#FFD700]/30">
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">会员专享服务</h3>
              <p className="text-sm text-gray-600">专业财富管理 • 个性化建议 • 全方位保障</p>
            </div>
            
            {/* 财富预测模块 - 压缩为单行 */}
            <div className="space-y-3 text-sm mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-[#4A90A4]" />
                <span className="font-medium text-gray-800">财富预测模块</span>
              </div>
              
              <div className="bg-white/50 rounded-lg p-3 border border-[#B3EBEF]/30">
                <p className="text-xs text-gray-700 leading-relaxed">
                  预测未来3年储蓄需求、56年完整财务热力图、财务健康度评分和改善建议
                </p>
              </div>
            </div>

            {/* 行动建议模块 - 压缩为单行 */}
            <div className="space-y-3 text-sm mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-[#4A90A4]" />
                <span className="font-medium text-gray-800">专业行动建议</span>
              </div>
              
              <div className="bg-white/50 rounded-lg p-3 border border-[#B3EBEF]/30">
                <p className="text-xs text-gray-700 leading-relaxed">
                  识别财务风险、优化资产配置、定制化财务规划和执行指导
                </p>
              </div>
            </div>

            {/* 查看完整会员权益链接 */}
            <div className="text-center mt-3 mb-2">
              <button
                onClick={handleViewBenefits}
                className="text-sm text-[#4A90A4] hover:text-[#4A90A4]/80 flex items-center justify-center space-x-1 mx-auto transition-colors"
              >
                <span>查看完整会员权益</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* 升级会员按钮 */}
            <Button
              onClick={handleUpgrade}
              className="w-full mt-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-gray-900 hover:from-[#FFD700]/90 hover:to-[#FFA500]/90 text-sm font-medium"
            >
              立即升级会员
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
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
                    <path d="M8.5 2A5.5 5.5 0 003 7.5v9A5.5 5.5 0 008.5 22h7a5.5 5.5 0 005.5-5.5v-9A5.5 5.5 0 0015.5 2h-7zm0 2h7A3.5 3.5 0 0119 7.5v9a3.5 3.5 0 01-3.5 3.5h-7A3.5 3.5 0 015 16.5v-9A3.5 3.5 0 018.5 4zM12 6.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zm0 2a3.5 3.5 0 110 7 3.5 3.5 0 010-7z"/>
                  </svg>
                  微信支付 ¥29.9
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WealthPredictionUpgrade;
