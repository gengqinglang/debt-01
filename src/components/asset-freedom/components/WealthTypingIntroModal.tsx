
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogPortal } from '@/components/ui/dialog';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PaymentModal from '../PaymentModal';
import PressureDiagnosisModule from './PressureDiagnosisModule';
import PaymentSuccessModal from './PaymentSuccessModal';

interface WealthTypingIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMembership: () => void;
  onViewLater: () => void;
  pageMode: string;
  onPaymentSuccess?: () => void;
}

const WealthTypingIntroModal: React.FC<WealthTypingIntroModalProps> = ({
  isOpen,
  onClose,
  onOpenMembership,
  onViewLater,
  pageMode,
  onPaymentSuccess
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);

  // 根据pageMode获取财富分型信息
  const getWealthTypingInfo = (mode: string) => {
    switch (mode) {
      case 'public-severe-shortage':
        return {
          name: '中度支出压缩型',
          code: 'A3',
          description: '危险信号！您的财富状况亮红灯，支出挤压生活品质，需及时调整！',
          traits: []
        };
      case 'public-liquidity-tight':
        return {
          name: '流动性紧张型',
          code: 'B2', 
          description: '您有一定的资产基础，但流动性资金相对紧张，需要优化资产配置。',
          traits: ['资产结构需优化', '流动性管理重要', '投资策略需调整']
        };
      case 'public-balanced':
        return {
          name: '财务平衡型',
          code: 'C1',
          description: '您的财务状况相对均衡，是进一步提升财富管理效率的好时机。',
          traits: ['财务基础良好', '优化空间较大', '可探索多元投资']
        };
      default:
        return {
          name: '财务平衡型',
          code: 'C1',
          description: '您的财务状况相对均衡，是进一步提升财富管理效率的好时机。',
          traits: ['财务基础良好', '优化空间较大', '可探索多元投资']
        };
    }
  };

  const wealthInfo = getWealthTypingInfo(pageMode);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // 支付成功处理函数
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setShowPaymentSuccessModal(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogPortal>
          {/* 手机宽度区域的黑色遮罩 */}
          <div className="fixed inset-0 z-40 flex items-center justify-center">
            <div className="w-full max-w-md h-full bg-black/80" />
          </div>
          
          {/* 弹窗内容在手机区域内可滚动 */}
          <div className="fixed inset-0 z-50 flex justify-center items-start p-4 overflow-y-auto" onKeyDown={handleKeyDown}>
            <div className="relative w-full max-w-md min-h-full flex items-center py-8">
              {/* 关闭按钮在弹窗外侧右上角，更靠近弹窗 */}
              <button
                onClick={onClose}
                className="absolute top-6 right-2 z-10 p-1.5 rounded-full bg-white/70 transition-colors shadow-md border border-gray-200"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
              
              <div className="w-full bg-white shadow-2xl rounded-md">
                {/* 主要内容 - 移除冲突的高度设置 */}
              <div className="h-[80vh] overflow-y-auto">
                <div className="p-4 sm:p-6 pt-6 sm:pt-6">
                  <div className="mx-auto space-y-3 sm:space-y-4">
                    {/* 信件标题 */}
                    <div className="text-center space-y-1 sm:space-y-2">
                      <div className="text-base sm:text-lg font-bold text-gray-800 mb-1">
                        您的生涯财富快照已生成
                      </div>
                    </div>

                    {/* 财富分型展示卡片 */}
                    <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 shadow-lg">
                      <CardContent className="p-3 sm:p-4">
                        <div className="text-center space-y-3 sm:space-y-4">
                          {/* 分型标识 */}
                          <div className="text-center space-y-2">
                            <div className="text-lg sm:text-xl font-bold text-gray-800">{wealthInfo.name}</div>
                            <div className="text-sm text-gray-600 font-mono">C01-I02-E03-R2</div>
                          </div>

                          {/* 核心描述 */}
                          <div className="bg-blue-50 p-3 sm:p-4 rounded-xl border border-blue-200">
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                              {wealthInfo.description}
                            </p>
                          </div>

                          {/* 特征标签 */}
                          {wealthInfo.traits.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2">
                              {wealthInfo.traits.map((trait, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 sm:px-3 sm:py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium border border-blue-200"
                                >
                                  {trait}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 压力诊断分析模块 */}
                    <PressureDiagnosisModule 
                      showTitle={false}
                      showWarningTip={false}
                      isMember={false}
                      onInteractionAttempt={() => {
                        alert('这是演示功能，开通会员后可体验完整功能');
                      }}
                    />

                    {/* 债务优化方案提醒 */}
                    <div className="bg-gradient-to-br from-[#CAF4F7]/20 to-[#CAF4F7]/40 p-4 rounded-2xl border border-[#CAF4F7]/50 backdrop-blur-sm">
                      <div className="flex items-center justify-center mb-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-[#CAF4F7] to-[#A8E6E1] rounded-full flex items-center justify-center mr-2">
                          <span className="text-gray-700 text-sm">💡</span>
                        </div>
                        <h3 className="text-base font-bold text-gray-800 text-center">
                          获取专属债务优化方案
                        </h3>
                      </div>
                      
                      <div className="text-center space-y-2">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          根据您的财务状况，我们可以为您量身定制债务优化方案，帮助您：
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          <div className="bg-white/60 p-2 rounded-lg">• 降低还款压力</div>
                          <div className="bg-white/60 p-2 rounded-lg">• 节省利息支出</div>
                          <div className="bg-white/60 p-2 rounded-lg">• 优化现金流</div>
                          <div className="bg-white/60 p-2 rounded-lg">• 提升财务健康</div>
                        </div>
                        <p className="text-xs text-[#01BCD6] font-medium mt-3">
                          开通会员即可获取完整的债务优化建议
                        </p>
                      </div>
                    </div>

                    {/* 查看完整会员权益入口 */}
                    <div className="text-center">
                      <button className="text-blue-600 font-medium text-sm underline transition-colors">
                        查看完整会员权益
                      </button>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex flex-col gap-2 sm:gap-3 justify-center pt-1 sm:pt-2">
                      <Button
                        onClick={() => setShowPaymentModal(true)}
                        size="lg"
                        className="w-full px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all duration-300"
                      >
                        🚀 开通会员获取债务优化方案
                      </Button>
                      <Button
                        onClick={onViewLater}
                        variant="outline"
                        size="lg"
                        className="w-full px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-medium border-2 border-gray-300 text-gray-700 transition-all duration-300"
                      >
                        稍后再看
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </DialogPortal>
      </Dialog>

      {/* 支付弹窗 */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
        amount="29.9"
        title="开通会员"
        description="开通会员，获取专属债务优化方案和财富分型完整解读"
      />

      {/* 支付成功弹窗 */}
      <PaymentSuccessModal
        isOpen={showPaymentSuccessModal}
        onClose={() => {
          setShowPaymentSuccessModal(false);
          onClose();
          // 注释掉这行避免触发额外的祝贺弹窗，因为PaymentSuccessModal本身就是祝贺界面
          // if (onPaymentSuccess) {
          //   onPaymentSuccess();
          // }
        }}
      />
    </>
  );
};

export default WealthTypingIntroModal;
