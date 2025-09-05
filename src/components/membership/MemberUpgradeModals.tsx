import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Crown, ArrowRight, Smartphone, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useMembership } from './MembershipProvider';

interface MemberUpgradeModalsProps {
  showUpgradeDialog: boolean;
  setShowUpgradeDialog: (show: boolean) => void;
  onUpgradeSuccess?: () => void;
}

const MemberUpgradeModals: React.FC<MemberUpgradeModalsProps> = ({
  showUpgradeDialog,
  setShowUpgradeDialog,
  onUpgradeSuccess
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setMembershipStatus } = useMembership();
  
  // 登录流程状态
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginStep, setLoginStep] = useState<'phone' | 'verification' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  // 支付流程状态
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleUpgradeClick = () => {
    // 直接跳过登录，进入支付流程
    setShowUpgradeDialog(false);
    setShowPaymentModal(true);
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "支付成功！",
        description: "欢迎成为会员，正在跳转到会员页面...",
      });
      
      setShowPaymentModal(false);
      
      // 调用成功回调 - 直接切换pageMode而不是设置会员状态
      if (onUpgradeSuccess) {
        onUpgradeSuccess();
      }
      
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

  return (
    <>
      {/* 升级会员弹窗 */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center space-x-2">
              <Crown className="w-5 h-5" style={{ color: '#B3EBEF' }} />
              <span>升级会员</span>
            </DialogTitle>
            <DialogDescription className="text-center">
              查看详细数据需要升级为会员
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* 会员权益说明 */}
            <div className="text-center bg-[#B3EBEF]/10 rounded-lg p-4 border border-[#B3EBEF]/30">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Badge className="bg-[#B3EBEF] text-gray-800 hover:bg-[#B3EBEF]/90">
                  会员专享
                </Badge>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                升级会员后，您可以：
              </p>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li>• 查看详细的热力图数据分析</li>
                <li>• 获取个性化的财务健康报告</li>
                <li>• 享受完整的财富管理服务</li>
                <li>• 获得专业的投资建议</li>
              </ul>
            </div>

            {/* 价格信息 */}
            <div className="text-center bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <span className="text-2xl font-bold text-gray-800">¥29.9</span>
                <span className="text-sm text-gray-600">/月</span>
              </div>
              <div className="text-xs text-gray-500 line-through">原价 ¥99</div>
              <div className="text-xs font-medium" style={{ color: '#01BCD6' }}>限时特价 70% OFF</div>
            </div>

            {/* 升级按钮 */}
            <Button
              onClick={handleUpgradeClick}
              className="w-full py-3 text-gray-800 hover:opacity-90"
              style={{ backgroundColor: '#B3EBEF' }}
            >
              立即升级会员
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            {/* 取消按钮 */}
            <Button
              variant="ghost"
              onClick={() => setShowUpgradeDialog(false)}
              className="w-full text-gray-600"
            >
              稍后再说
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
                  <Input 
                    type="tel" 
                    placeholder="请输入手机号码"
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
                  <Input 
                    type="text" 
                    placeholder="请输入6位验证码"
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

export default MemberUpgradeModals;