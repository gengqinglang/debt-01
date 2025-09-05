
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Crown, Sparkles, CheckCircle, Star } from 'lucide-react';

interface CongratulationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMembershipSuccess?: boolean;
  onEnterMemberArea?: () => void;
  isWealthTypingUpdate?: boolean;
}

const CongratulationsModal: React.FC<CongratulationsModalProps> = ({ 
  isOpen, 
  onClose,
  isMembershipSuccess = false,
  onEnterMemberArea,
  isWealthTypingUpdate = false
}) => {
  const handleButtonClick = () => {
    console.log('恭喜弹窗按钮被点击');
    
    // 先执行会员区域进入逻辑
    if (isMembershipSuccess && onEnterMemberArea) {
      console.log('执行进入会员区域逻辑');
      onEnterMemberArea();
    }
    
    // 然后关闭弹窗
    console.log('关闭恭喜弹窗');
    onClose();
  };

  // 阻止弹窗自动关闭
  const handleOpenChange = (open: boolean) => {
    console.log('弹窗状态变化:', open);
    // 只有当用户明确点击关闭按钮时才允许关闭
    if (!open) {
      console.log('阻止弹窗自动关闭');
      return;
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={handleOpenChange}
      modal={true}
    >
      <DialogContent 
        className="max-w-md p-0 overflow-hidden"
        onPointerDownOutside={(e) => {
          // 阻止点击外部关闭弹窗
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          // 阻止ESC键关闭弹窗
          e.preventDefault();
        }}
      >
        {/* 背景装饰 */}
        <div className="relative">
          {/* 渐变背景 */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: 'linear-gradient(135deg, #01BCD6 0%, #CAF4F7 100%)'
            }}
          />
          
          {/* 装饰性图案 */}
          <div className="absolute top-4 right-4">
            <div className="relative">
              <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
              <Star className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
            </div>
          </div>
          
          <div className="absolute top-8 left-6">
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          
          <div className="absolute bottom-8 right-8">
            <Star className="w-3 h-3 text-green-400 animate-bounce" style={{ animationDelay: '1s' }} />
          </div>

          {/* 主要内容 */}
          <div className="relative z-10 p-8 text-center space-y-6">
            {/* 图标区域 */}
            <div className="flex justify-center">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: '#01BCD6' }}
              >
                <Crown className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* 标题 */}
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
                {isMembershipSuccess ? '🎉 欢迎成为会员！' : 
                 isWealthTypingUpdate ? '🎉 财富分型已更新！' : 
                 '🎉 恭喜您成功解锁！'}
              </DialogTitle>
              <DialogDescription asChild>
                <div className="space-y-4">
                  {/* 主要说明 */}
                  <p className="text-base text-gray-700 leading-relaxed">
                    {isMembershipSuccess ? (
                      <>感谢您选择我们的专业服务！您现在可以享受<span className="font-semibold text-gray-800">全部会员权益</span>，包括专业测评工具、个性化行动方案和专属服务。</>
                    ) : isWealthTypingUpdate ? (
                      <>恭喜您！您的<span className="font-semibold text-gray-800">财富分型已成功更新</span>，现在展示的结果基于您最新的财务信息，确保分析的<span className="font-semibold text-gray-800">准确性和时效性</span>。</>
                    ) : (
                      <>您现在可以查看专业的<span className="font-semibold text-gray-800">解读测评依据</span>，并获得更加<span className="font-semibold text-gray-800">精细化的行动建议</span></>
                    )}
                  </p>
                  
                  {/* 权益列表 */}
                  <div className="space-y-3 text-left">
                    {isMembershipSuccess ? (
                      <>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            <strong>专业测评：</strong>6大风险测评工具，全方位评估您的保障需求
                          </span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            <strong>行动指导：</strong>详细的下一步行动计划和执行建议
                          </span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            <strong>专属服务：</strong>一对一咨询和定制化解决方案
                          </span>
                        </div>
                      </>
                    ) : isWealthTypingUpdate ? (
                      <>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            <strong>最新数据：</strong>基于您刚刚确认的收入、支出和资产负债信息
                          </span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            <strong>精准分析：</strong>重新计算的财富分型和风险评估结果
                          </span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            <strong>优化建议：</strong>基于最新情况的个性化行动方案
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            <strong>透明化解读：</strong>了解每个结论背后的数据支撑和逻辑推导
                          </span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            <strong>个性化方案：</strong>获得量身定制的风险防控和投资配置建议
                          </span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            <strong>落地指导：</strong>手把手的执行步骤和时间规划
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>

            {/* 确认按钮 */}
            <Button 
              onClick={handleButtonClick}
              className="w-full text-white text-base font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              style={{ backgroundColor: '#01BCD6' }}
            >
              {isMembershipSuccess ? '进入会员专区 ✨' : 
               isWealthTypingUpdate ? '查看更新结果 ✨' : 
               '开始体验专业服务 ✨'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CongratulationsModal;
