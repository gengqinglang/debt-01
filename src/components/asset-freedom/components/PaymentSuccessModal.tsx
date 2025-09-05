import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogPortal } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();

  const handleViewOptimization = () => {
    console.log('=== PaymentSuccessModal: 点击立即查看专属方案 ===');
    onClose();
    
    // 检查当前是否已经在 /new 页面
    if (window.location.pathname === '/new') {
      console.log('=== 当前在/new页面，触发页面状态更新事件 ===');
      // 如果已经在 /new 页面，直接触发页面状态更新
      window.dispatchEvent(new CustomEvent('updatePageMode', {
        detail: {
          pageMode: 'member-severe-shortage',
          scrollToModule: 'cash-flow-prediction'
        }
      }));
    } else {
      console.log('=== 导航到/new页面 ===');
      // 导航到new页面，设置会员-没钱状态，并滚动到现金流预测模块
      navigate('/new', {
        state: {
          activeTab: 'discover',
          pageMode: 'member-severe-shortage',
          scrollToModule: 'cash-flow-prediction'
        },
        replace: false
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        {/* 手机宽度区域的黑色遮罩 */}
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="w-full max-w-md h-full bg-black/80" />
        </div>
        
        {/* 弹窗内容 - 使用与第一个弹窗相同的高度结构 */}
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
              {/* 主要内容 - 使用与第一个弹窗相同的高度设置 */}
              <div className="h-[80vh] overflow-y-auto">
                <div className="p-4 sm:p-6 pt-6 sm:pt-6">
                  <div className="text-center space-y-6">
                    {/* 成功图标 */}
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    {/* 恭喜文案 */}
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold text-gray-900">
                        🎉 恭喜您开通会员成功！
                      </h2>
                      <p className="text-gray-600">
                        感谢您的信任，会员权益已为您激活
                      </p>
                    </div>

                    {/* 债务优化方案提示 */}
                    <div className="bg-gradient-to-br from-[#CAF4F7]/30 to-[#CAF4F7]/50 p-4 rounded-xl border border-[#CAF4F7]/50">
                      <div className="flex items-center justify-center mb-3">
                        <div className="w-8 h-8 bg-[#01BCD6] rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-lg">📊</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          专属债务优化方案已生成
                        </h3>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        系统已根据您的财务状况为您定制专属的债务优化方案，包含详细的现金流预测和优化建议。
                      </p>

                      {/* 方案亮点 */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
                        <div className="bg-white/60 p-2 rounded-lg text-center">
                          <div className="font-medium text-[#01BCD6]">💰</div>
                          <div>节省利息支出</div>
                        </div>
                        <div className="bg-white/60 p-2 rounded-lg text-center">
                          <div className="font-medium text-[#01BCD6]">📈</div>
                          <div>优化现金流</div>
                        </div>
                        <div className="bg-white/60 p-2 rounded-lg text-center">
                          <div className="font-medium text-[#01BCD6]">⚡</div>
                          <div>降低还款压力</div>
                        </div>
                        <div className="bg-white/60 p-2 rounded-lg text-center">
                          <div className="font-medium text-[#01BCD6]">🎯</div>
                          <div>精准分析预测</div>
                        </div>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="space-y-3">
                      <Button
                        onClick={handleViewOptimization}
                        className="w-full bg-[#01BCD6] hover:bg-[#01BCD6]/90 text-white font-semibold py-3 rounded-lg"
                      >
                        立即查看专属方案
                      </Button>
                      
                      <Button
                        onClick={onClose}
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700"
                      >
                        稍后查看
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
  );
};

export default PaymentSuccessModal;