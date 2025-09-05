import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from '@/components/ui/sonner';
import { X, ArrowLeft } from 'lucide-react';

interface PhoneLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const PhoneLoginModal: React.FC<PhoneLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length !== 11) {
      toast.error('请输入正确的手机号码');
      return;
    }

    setIsLoading(true);
    try {
      // 模拟发送验证码
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('验证码已发送');
      setStep('otp');
      setCountdown(60);
      
      // 倒计时
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      toast.error('发送验证码失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('请输入6位验证码');
      return;
    }

    setIsLoading(true);
    try {
      // 模拟验证码验证
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 简单验证逻辑：任何6位数字都通过
      if (/^\d{6}$/.test(otp)) {
        toast.success('登录成功');
        
        // 保存登录状态
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userPhone', phoneNumber);
        localStorage.setItem('loginTime', Date.now().toString());
        
        onLoginSuccess();
      } else {
        toast.error('验证码错误');
      }
    } catch (error) {
      toast.error('验证失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('phone');
    setPhoneNumber('');
    setOtp('');
    setCountdown(0);
    onClose();
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {step === 'otp' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToPhone}
                  className="p-1 h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <DialogTitle className="text-lg font-semibold">
                {step === 'phone' ? '手机号登录' : '输入验证码'}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-1 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {step === 'phone' ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  手机号码
                </label>
                <Input
                  type="tel"
                  placeholder="请输入手机号码"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  className="text-base"
                />
              </div>
              
              <Button
                onClick={handleSendOtp}
                disabled={isLoading || !phoneNumber || phoneNumber.length !== 11}
                className="w-full h-12 text-base bg-[#B3EBEF] hover:bg-[#A0E4E9] text-gray-900"
              >
                {isLoading ? '发送中...' : '获取验证码'}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    验证码已发送至
                  </p>
                  <p className="font-medium">
                    {phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
                  </p>
                </div>

                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-gray-500">
                      {countdown}秒后可重新发送
                    </p>
                  ) : (
                    <Button
                      variant="link"
                      onClick={handleSendOtp}
                      disabled={isLoading}
                      className="text-sm"
                    >
                      重新发送验证码
                    </Button>
                  )}
                </div>
              </div>

              <Button
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.length !== 6}
                className="w-full h-12 text-base bg-[#B3EBEF] hover:bg-[#A0E4E9] text-gray-900"
              >
                {isLoading ? '验证中...' : '确认登录'}
              </Button>
            </>
          )}
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500 text-center">
            登录即表示同意《用户协议》和《隐私政策》
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneLoginModal;
