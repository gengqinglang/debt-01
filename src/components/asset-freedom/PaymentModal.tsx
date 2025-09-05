
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, Smartphone } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  amount?: string;
  title?: string;
  description?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  onPaymentSuccess,
  amount = '9.9',
  title = '支付解锁内容',
  description = '选择支付方式完成 9.9 元付款'
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMethod, setProcessingMethod] = useState<'alipay' | 'wechat' | null>(null);
  const [autoRenewalAgreed, setAutoRenewalAgreed] = useState(false);

  const isMonthlyMembership = amount !== '9.9';

  const handlePayment = async (method: 'alipay' | 'wechat') => {
    // 如果是月度会员但没有勾选自动扣费协议，则不允许支付
    if (isMonthlyMembership && !autoRenewalAgreed) {
      alert('请先勾选自动扣费协议');
      return;
    }

    setProcessingMethod(method);
    setIsProcessing(true);
    
    console.log(`正在调起${method === 'alipay' ? '支付宝' : '微信'}支付...`);
    
    // 模拟调起小程序支付API的过程
    setTimeout(() => {
      console.log('支付成功！');
      setIsProcessing(false);
      setProcessingMethod(null);
      onPaymentSuccess();
      onClose();
    }, 2000);
  };

  const PaymentOption = ({ 
    method, 
    icon, 
    name, 
    description 
  }: { 
    method: 'alipay' | 'wechat'; 
    icon: React.ReactNode; 
    name: string; 
    description: string; 
  }) => (
    <Card 
      className={`cursor-pointer transition-all duration-200 ${
        isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
      }`}
      onClick={() => !isProcessing && handlePayment(method)}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            {icon}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-800">{name}</h4>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          {processingMethod === method && isProcessing && (
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 价格显示 */}
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-gray-800">¥{amount}</div>
            <div className="text-sm text-gray-600">
              {amount === '9.9' ? '一次性解锁全部内容' : '月度会员，享受全部功能'}
            </div>
          </div>

          <Separator />

          {/* 月度会员自动扣费协议 */}
          {isMonthlyMembership && (
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Checkbox
                  id="auto-renewal"
                  checked={autoRenewalAgreed}
                  onCheckedChange={(checked) => setAutoRenewalAgreed(checked as boolean)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor="auto-renewal" className="text-sm text-gray-700 cursor-pointer">
                    我已阅读并同意
                    <span className="text-blue-600 underline mx-1">《自动扣费协议》</span>
                    ，同意开通会员自动续费服务
                  </label>
                  <div className="text-xs text-gray-500 mt-1">
                    会员到期前24小时将自动续费，可随时取消
                  </div>
                </div>
              </div>
              <Separator />
            </div>
          )}

          {/* 支付选项 */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">选择支付方式</h4>
            <PaymentOption
              method="alipay"
              icon={<CreditCard className="w-5 h-5 text-blue-600" />}
              name="支付宝"
              description="使用支付宝支付"
            />
            <PaymentOption
              method="wechat"
              icon={<Smartphone className="w-5 h-5 text-green-600" />}
              name="微信支付"
              description="使用微信支付"
            />
          </div>

          {/* 支付处理状态 */}
          {isProcessing && (
            <div className="text-center space-y-4 py-4">
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">
                  正在调起{processingMethod === 'alipay' ? '支付宝' : '微信'}支付...
                </span>
              </div>
              <div className="text-xs text-gray-500">
                请在{processingMethod === 'alipay' ? '支付宝' : '微信'}中完成支付
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
