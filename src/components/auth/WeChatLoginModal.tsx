import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { X } from 'lucide-react';

interface WeChatLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const WeChatLoginModal: React.FC<WeChatLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [step, setStep] = useState<'scan' | 'success'>('scan');
  const [isLoading, setIsLoading] = useState(false);

  // 模拟微信扫码登录流程
  useEffect(() => {
    if (isOpen && step === 'scan') {
      // 模拟2秒后扫码成功
      const timer = setTimeout(() => {
        setStep('success');
        // 再过1秒后自动登录成功
        setTimeout(() => {
          handleLoginSuccess();
        }, 1000);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, step]);

  const handleLoginSuccess = () => {
    setIsLoading(true);
    
    // 保存登录状态
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loginMethod', 'wechat');
    localStorage.setItem('loginTime', Date.now().toString());
    
    toast.success('微信登录成功');
    
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 500);
  };

  const handleClose = () => {
    setStep('scan');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              微信登录
            </DialogTitle>
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
          {step === 'scan' ? (
            <div className="text-center space-y-4">
              {/* 微信二维码占位图 */}
              <div className="w-48 h-48 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 mx-auto bg-[#1AAD19] rounded-lg flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current">
                      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.172 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 4.882-1.657 7.227-.67-.591-3.111-4.117-5.516-8.272-5.516z"/>
                      <path d="M23.999 14.191c0-3.159-2.892-5.63-6.475-5.63-3.475 0-6.471 2.471-6.471 5.63s2.996 5.63 6.471 5.63a7.788 7.788 0 0 0 2.612-.473.59.59 0 0 1 .486.068l1.397.816a.24.24 0 0 0 .378-.199 3.548 3.548 0 0 0-.033-.157l-.288-1.094a.425.425 0 0 1 .154-.479c1.573-1.178 2.769-2.722 2.769-4.912z"/>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">请使用微信扫描二维码</p>
                  <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-[#1AAD19] rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-[#1AAD19] rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-[#1AAD19] rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-500">
                打开微信扫一扫，扫描上方二维码
              </p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">扫码成功</h3>
                <p className="text-sm text-gray-600 mt-1">正在登录中...</p>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-[#1AAD19] rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-[#1AAD19] rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-[#1AAD19] rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
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

export default WeChatLoginModal;