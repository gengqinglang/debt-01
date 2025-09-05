import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, ShoppingCart, Calendar, Sparkles, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useExpenditureData from '@/hooks/useExpenditureData';
import ExpenditureConfigModal from './ExpenditureConfigModal';
import AddExpenditureModal from './AddExpenditureModal';
import UpgradePrompt from '@/components/membership/UpgradePrompt';
import { useMembership } from '@/components/membership/MembershipProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Crown, ArrowRight, Smartphone, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnhancedLifeExpenditureDisplayProps {
  pageMode?: 'member-severe-shortage' | 'member-liquidity-tight' | 'member-balanced' | 'public-severe-shortage' | 'public-liquidity-tight' | 'public-balanced';
  onInteractionAttempt?: () => void;
  isFromPlanningTab?: boolean; // 新增：是否来自规划tab页
}

const EnhancedLifeExpenditureDisplay: React.FC<EnhancedLifeExpenditureDisplayProps> = ({ 
  pageMode = 'public-balanced',
  onInteractionAttempt,
  isFromPlanningTab = true // 默认为true，因为主要在规划tab页使用
}) => {
  const navigate = useNavigate();
  const { expenditureData, totalAmount, updateExpenditureItem, addExpenditureItem } = useExpenditureData();
  const { isMember, setMembershipStatus, isDevMode } = useMembership();
  const { toast } = useToast();
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isFromPaymentSuccess, setIsFromPaymentSuccess] = useState(false);
  
  // 登录流程状态
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginStep, setLoginStep] = useState<'phone' | 'verification' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  // 支付流程状态
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // 数据更新时间
  const [lastUpdateTime, setLastUpdateTime] = useState<string>(() => {
    const saved = localStorage.getItem('expenditure_last_update_time');
    return saved || new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  });

  // 更新时间的函数
  const updateLastModifiedTime = () => {
    const newTime = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    setLastUpdateTime(newTime);
    localStorage.setItem('expenditure_last_update_time', newTime);
  };

  const requiredAmount = expenditureData.filter(item => item.type === 'required').reduce((sum, item) => sum + item.amount, 0);
  const optionalAmount = expenditureData.filter(item => item.type === 'optional').reduce((sum, item) => sum + item.amount, 0);

  // 按照金额从大到小排序
  const sortedExpenditureItems = [...expenditureData].sort((a, b) => b.amount - a.amount);

  const formatAmount = (amount: number) => {
    return amount.toFixed(0);
  };

  const handleEditClick = (item: any) => {
    setEditingItem(item);
    setIsFromPaymentSuccess(false); // 普通编辑不是从支付成功来的
    setConfigModalOpen(true);
  };

  const handleSaveConfig = (selectedLevel: string, amount: number, isCustom?: boolean) => {
    if (editingItem) {
      updateExpenditureItem(editingItem.id, {
        selectedLevel,
        amount,
        isCustom
      });
      updateLastModifiedTime();
    }
  };

  const handleCloseModal = () => {
    setConfigModalOpen(false);
    setEditingItem(null);
    setIsFromPaymentSuccess(false); // 重置标识
  };

  const handleTimelineClick = () => {
    navigate('/life-timeline', { state: { from: 'expenditure' } });
  };

  const handleAddExpenditureItem = (itemType: string) => {
    if (itemType === 'family-support') {
      // 检查是否为普通客户状态
      if (pageMode?.startsWith('public-')) {
        if (onInteractionAttempt) {
          onInteractionAttempt();
        } else {
          setShowUpgradePrompt(true);
        }
        return;
      }

      // 会员用户：维持现有流程
      const newItem = {
        id: 'family-support',
        name: '资助亲人',
        type: 'optional' as const,
        category: 'family-support',
        amount: 100,
        selectedLevel: '基础资助',
        isCustom: false
      };
      
      addExpenditureItem(newItem);
      updateLastModifiedTime();
      
      // 延迟一下再打开配置弹窗，让用户看到成功提示
      setTimeout(() => {
        setEditingItem(newItem);
        setIsFromPaymentSuccess(false); // 普通添加不是从支付成功来的
        setConfigModalOpen(true);
      }, 1000);
    }
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
  };

  const handleUpgradeSuccess = () => {
    setShowUpgradePrompt(false);
    // 升级成功后打开新增支出科目弹窗
    setAddModalOpen(true);
  };

  const handleUpgradeClick = () => {
    setShowUpgradePrompt(false);
    // 直接开始登录流程
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
      
      // 关键修改：在支付成功前保存当前页面状态到localStorage
      const currentPageState = {
        activeTab: 'planning',
        activePlanningTab: 'life-events',
        timestamp: Date.now()
      };
      localStorage.setItem('paymentSuccessPageState', JSON.stringify(currentPageState));
      console.log('已保存页面状态到localStorage:', currentPageState);
      
      // 支付成功后的处理
      toast({
        title: "支付成功！",
        description: "欢迎成为会员，正在为您配置资助亲人支出科目...",
      });
      
      setShowPaymentModal(false);
      
      // 设置会员状态
      setMembershipStatus(true, 'premium');
      console.log('会员状态已设置');
      
      // 添加资助亲人支出项目
      const newItem = {
        id: 'family-support',
        name: '资助亲人',
        type: 'optional' as const,
        category: 'family-support',
        amount: 100,
        selectedLevel: '基础资助',
        isCustom: false
      };
      
      addExpenditureItem(newItem);
      updateLastModifiedTime();
      
      // 延迟一下再打开配置弹窗，让用户看到成功提示
      setTimeout(() => {
        setEditingItem(newItem);
        setIsFromPaymentSuccess(true); // 标识这是从支付成功场景打开的
        setConfigModalOpen(true);
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

  return (
    <div className="space-y-3">
      {/* 大卡片容器 - 使用更浅的蓝色基调 */}
      <Card className="bg-gradient-to-r from-[#B3EBEF]/10 to-[#87CEEB]/10 border-[#B3EBEF] shadow-lg rounded-xl">
        <CardContent className="p-4">
          {/* 总支出展示 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#B3EBEF] to-[#87CEEB] rounded-full flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-gray-900" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">未来人生总支出</h3>
                <p className="text-xs text-gray-500 mt-1">最后更新：{lastUpdateTime}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-gray-900">
                {formatAmount(totalAmount)}万
              </div>
            </div>
          </div>

          {/* 人生重大事件时间轴按钮 */}
          <div className="mb-4">
            <Button
              onClick={handleTimelineClick}
              variant="outline"
              size="sm"
              className="w-full text-xs border-[#B3EBEF]/50 hover:bg-[#B3EBEF]/10 text-gray-700 flex items-center justify-center gap-2"
            >
              <Calendar className="w-3 h-3" />
              人生重大事件时间轴
            </Button>
          </div>

          {/* 支出分类统计 */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/60 rounded-lg p-3 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">必需支出</div>
              <div className="text-sm font-bold text-gray-900">{formatAmount(requiredAmount)}万</div>
            </div>
            <div className="bg-white/60 rounded-lg p-3 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">可选支出</div>
              <div className="text-sm font-bold text-gray-900">{formatAmount(optionalAmount)}万</div>
            </div>
          </div>

          {/* 支出科目详细展示 - 作为子项目，按金额从大到小排序 */}
          <div className="space-y-3 mt-4">
            {sortedExpenditureItems.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-gray-100 hover:bg-white/80 transition-all duration-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge 
                      className={`text-xs px-2 py-0.5 text-gray-800 font-medium border ${
                        item.type === 'required' 
                          ? 'bg-[#CAF4F7] border-[#CAF4F7] hover:bg-[#B8F0F4]' 
                          : 'bg-[#CAF4F7]/50 border-[#CAF4F7] hover:bg-[#CAF4F7]/70'
                      }`}
                    >
                      {item.type === 'required' ? '必需' : '可选'}
                    </Badge>
                    <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                  </div>
                  <p className="text-xs text-gray-500">
                    {getItemDescription(item.category)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">
                      {formatAmount(item.amount)}万
                    </div>
                    <div className="text-xs text-gray-500">
                      占比 {((item.amount / totalAmount) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditClick(item)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    title="配置档位"
                  >
                    <Edit className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 新增支出科目按钮 */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <button
              onClick={() => setAddModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-[#B3EBEF]/20 to-[#87CEEB]/20 border border-[#B3EBEF]/30 rounded-lg hover:bg-gradient-to-r hover:from-[#B3EBEF]/30 hover:to-[#87CEEB]/30 transition-all duration-200"
            >
              <Plus className="w-4 h-4 text-[#4A90A4]" />
              <span className="text-sm font-medium text-[#4A90A4]">新增支出科目</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 精准录入提醒 - 使用与页面一致的蓝色基调 */}
      <Card className="bg-gradient-to-r from-[#B3EBEF]/8 to-[#87CEEB]/8 border-[#B3EBEF]/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gradient-to-r from-[#B3EBEF] to-[#87CEEB] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-3 h-3 text-gray-800" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                让分型结果更精准
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                觉得测评结果不够准确？直接在页面上调整支出数据，
                <span className="font-medium text-[#4A90A4]">系统会实时重新计算</span>给你更精准的财富分型结果
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 档位配置弹窗 */}
      <ExpenditureConfigModal
        isOpen={configModalOpen}
        onClose={handleCloseModal}
        item={editingItem}
        onSave={handleSaveConfig}
        isFromPaymentSuccess={isFromPaymentSuccess}
        isFromPlanningTab={isFromPlanningTab}
      />

      {/* 新增支出科目弹窗 */}
      <AddExpenditureModal
        isOpen={addModalOpen}
        onClose={handleCloseAddModal}
        onSelectItem={handleAddExpenditureItem}
      />

      {/* 升级会员弹窗 - 参考CashFlowPrediction.tsx的样式 */}
      <Dialog open={showUpgradePrompt} onOpenChange={setShowUpgradePrompt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center space-x-2">
              <Crown className="w-5 h-5" style={{ color: '#B3EBEF' }} />
              <span>升级会员</span>
            </DialogTitle>
            <DialogDescription className="text-center">
              新增支出科目需要升级为会员
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
                <li>• 新增更多支出科目进行详细规划</li>
                <li>• 获取个性化的财富分型建议</li>
                <li>• 享受完整的财富管理服务</li>
                <li>• 获得专业的投资规划指导</li>
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
              onClick={() => setShowUpgradePrompt(false)}
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
    </div>
  );
};

// 获取科目描述 - 更新旅游规划的描述
const getItemDescription = (category: string) => {
  const descriptions: { [key: string]: string } = {
    '基础生活规划': '日常生活开销、基本生活需求',
    '子女教育规划': '子女教育、培训学习费用',
    '医疗保健规划': '医疗费用、健康保险等',
    '养老规划': '养老储备、退休后生活费用',
    '旅游规划': '旅游、奢侈品等大额消费',
    '贷款利息支出': '房贷、车贷、消费贷还款利息支出',
    '贷款本金支出': '房贷、车贷、消费贷还款本金支出',
    'marriage': '婚礼筹备、婚房装修等结婚费用',
    'birth': '生育费用、孕产期护理等',
    'housing': '购房、租房、装修等住房费用',
    'car': '购车、交通出行等费用',
    'care': '赡养父母、照料长辈费用',
    'family-support': '资助亲人、帮扶家庭成员费用',
    'other': '旅游、奢侈品等大额消费'
  };
  return descriptions[category] || '其他各类支出费用';
};

export default EnhancedLifeExpenditureDisplay;
