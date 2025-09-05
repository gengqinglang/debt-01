import React, { useEffect, useState } from 'react';
import { PiggyBank, DollarSign, HandHeart, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Crown, ArrowRight, Smartphone, CheckCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMembership } from '@/components/membership/MembershipProvider';
import AddIncomeModal from '@/components/career/AddIncomeModal';

// 未来收入组件接口定义
interface IncomeItem {
  id: string;
  type: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: Array<{
    key: string;
    label: string;
    placeholder: string;
    unit?: string;
    type: 'number' | 'age-range';
  }>;
}

interface IncomeData {
  [key: string]: any;
}

// 未来收入组件
const FutureIncomeContent = React.memo(() => {
  const [incomeData, setIncomeData] = useState<IncomeData>({});
  const [activeTab, setActiveTab] = useState('企业年金');
  const { isMember, setMembershipStatus, isDevMode } = useMembership();
  const { toast } = useToast();
  
  // 新增收入科目相关状态
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  
  // 登录流程状态
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginStep, setLoginStep] = useState<'phone' | 'verification' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  // 支付流程状态
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Generate age options from 18 to 100
  const ageOptions = Array.from({ length: 83 }, (_, i) => i + 18);

  // 收入科目列表
  const incomeItems: IncomeItem[] = [
    {
      id: 'enterprise-annuity',
      type: '企业年金',
      name: '企业年金',
      icon: PiggyBank,
      fields: [
        { key: 'balance', label: '余额', placeholder: '请输入余额', unit: '万元', type: 'number' }
      ]
    },
    {
      id: 'pension',
      type: '退休金',
      name: '退休金',
      icon: DollarSign,
      fields: [
        { key: 'monthly', label: '月收入', placeholder: '请输入月收入', unit: '元', type: 'number' }
      ]
    },
    {
      id: 'other-income',
      type: '其他收入',
      name: '其他收入',
      icon: HandHeart,
      fields: [
        { key: 'ageRange', label: '收入时间段', placeholder: '例如：40-60', type: 'age-range' },
        { key: 'amount', label: '金额', placeholder: '请输入年收入', unit: '万元/年', type: 'number' }
      ]
    }
  ];

  useEffect(() => {
    // Load saved data from localStorage
    const savedData = localStorage.getItem('futureIncomeData');
    if (savedData) {
      try {
        setIncomeData(JSON.parse(savedData));
      } catch (error) {
        console.error('Failed to parse saved future income data:', error);
      }
    }
  }, []);

  const handleInputChange = (itemId: string, fieldKey: string, value: string) => {
    setIncomeData(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [fieldKey]: value
      }
    }));
  };

  const handleAgeRangeChange = (itemId: string, type: 'startAge' | 'endAge', value: string) => {
    setIncomeData(prev => {
      const currentData = prev[itemId] || {};
      const updatedData = {
        ...currentData,
        [type]: value
      };
      
      // If both start and end ages are set, create the ageRange string
      if (updatedData.startAge && updatedData.endAge) {
        updatedData.ageRange = `${updatedData.startAge}-${updatedData.endAge}`;
      }
      
      return {
        ...prev,
        [itemId]: updatedData
      };
    });
  };

  // 简化：处理添加收入科目按钮点击 - 直接打开弹窗
  const handleAddIncomeClick = () => {
    setAddModalOpen(true);
  };

  // 新增：处理升级会员点击
  const handleUpgradeClick = () => {
    setShowUpgradePrompt(false);
    // 直接开始登录流程
    setShowLoginModal(true);
    setLoginStep('phone');
  };

  // 新增：处理登录流程
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

  // 新增：处理微信支付
  const handleWeChatPay = async () => {
    setIsProcessingPayment(true);
    
    try {
      // 模拟微信支付流程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('=== 收入模块支付成功处理 ===');
      console.log('当前环境:', { isDevMode });
      
      // 关键修改：在支付成功前保存当前页面状态到localStorage
      const currentPageState = {
        activeTab: 'planning',
        activePlanningTab: 'career-income',
        timestamp: Date.now()
      };
      localStorage.setItem('paymentSuccessPageState', JSON.stringify(currentPageState));
      console.log('已保存页面状态到localStorage:', currentPageState);
      
      // 支付成功后的处理
      toast({
        title: "支付成功！",
        description: "欢迎成为会员，现在可以添加更多收入科目...",
      });
      
      setShowPaymentModal(false);
      
      // 设置会员状态
      setMembershipStatus(true, 'premium');
      console.log('会员状态已设置');
      
      // 延迟一下再打开添加收入科目弹窗
      setTimeout(() => {
        setAddModalOpen(true);
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

  // 新增：处理添加收入科目保存
  const handleSaveIncomeItem = (data: any) => {
    console.log('保存收入科目:', data);
    toast({
      title: "添加成功",
      description: `已成功添加${data.name}收入科目`,
    });
    // 这里可以添加实际的保存逻辑
  };

  // Tab配置
  const tabConfig = [
    { id: '企业年金', label: '企业年金', icon: PiggyBank, activeColor: 'from-[#B3EBEF] to-[#B3EBEF]/80' },
    { id: '退休金', label: '退休金', icon: DollarSign, activeColor: 'from-[#B3EBEF] to-[#B3EBEF]/80' },
    { id: '其他收入', label: '其他收入', icon: HandHeart, activeColor: 'from-[#B3EBEF] to-[#B3EBEF]/80' },
  ];

  const getCurrentIncomeItem = () => {
    return incomeItems.find(item => item.type === activeTab);
  };

  return (
    <div className="space-y-6">
      {/* 左右布局内容区域 */}
      <div className="flex bg-white rounded-xl border border-[#B3EBEF]/20 min-h-[400px] shadow-sm">
        {/* 左侧Tab导航 */}
        <div 
          className="w-[130px] bg-[#B3EBEF]/5 border-r border-[#B3EBEF]/20 p-3 flex-shrink-0 rounded-l-xl" 
          style={{ 
            minWidth: '130px', 
            maxWidth: '130px'
          }}
        >
          <div className="space-y-3">
            {tabConfig.map(tab => {
              const IconComponent = tab.icon;
              return (
                <Button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id)} 
                  className={`w-full justify-center px-2 py-3 text-xs font-medium rounded-lg transition-all duration-300 border-0 h-12 relative flex-col gap-1 ${
                    activeTab === tab.id 
                      ? 'bg-[#B3EBEF] text-gray-800 shadow-md' 
                      : 'bg-white text-gray-600 hover:bg-[#B3EBEF]/10 shadow-sm'
                  }`} 
                  variant="ghost"
                >
                  <IconComponent className="w-4 h-4" strokeWidth={1.5} />
                  <span className="text-xs">{tab.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* 右侧内容区域 */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {getCurrentIncomeItem() && (
              <div className="space-y-4">
                <div className="space-y-4">
                  {getCurrentIncomeItem()?.fields.map((field) => {
                    const itemData = incomeData[getCurrentIncomeItem()!.id] || {};
                    
                    if (field.type === 'age-range') {
                      return (
                        <div key={field.key}>
                          <Label className="text-sm text-gray-700 mb-2 block font-medium">
                            {field.label}
                          </Label>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs text-gray-600 mb-1 block">开始年龄</Label>
                              <Select
                                value={itemData.startAge || ''}
                                onValueChange={(value) => handleAgeRangeChange(getCurrentIncomeItem()!.id, 'startAge', value)}
                              >
                                <SelectTrigger className="h-10 text-sm border-[#B3EBEF]/30 focus:border-[#B3EBEF] focus:ring-[#B3EBEF]/20">
                                  <SelectValue placeholder="选择年龄" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-[#B3EBEF]/20 shadow-lg max-h-60">
                                  {ageOptions.map((age) => (
                                    <SelectItem key={age} value={age.toString()}>
                                      {age}岁
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs text-gray-600 mb-1 block">结束年龄</Label>
                              <Select
                                value={itemData.endAge || ''}
                                onValueChange={(value) => handleAgeRangeChange(getCurrentIncomeItem()!.id, 'endAge', value)}
                              >
                                <SelectTrigger className="h-10 text-sm border-[#B3EBEF]/30 focus:border-[#B3EBEF] focus:ring-[#B3EBEF]/20">
                                  <SelectValue placeholder="选择年龄" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-[#B3EBEF]/20 shadow-lg max-h-60">
                                  {ageOptions.map((age) => (
                                    <SelectItem key={age} value={age.toString()}>
                                      {age}岁
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={field.key}>
                        <Label className="text-sm text-gray-700 mb-2 block font-medium">
                          {field.label}
                          {field.unit && (
                            <span className="text-xs text-gray-500 ml-1">({field.unit})</span>
                          )}
                        </Label>
                        <Input
                          type={field.type === 'number' ? 'number' : 'text'}
                          placeholder={field.placeholder}
                          value={itemData[field.key] || ''}
                          onChange={(e) => handleInputChange(getCurrentIncomeItem()!.id, field.key, e.target.value)}
                          className="h-10 text-sm border-[#B3EBEF]/30 focus:border-[#B3EBEF] focus:ring-[#B3EBEF]/20 placeholder:text-xs"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 新增收入科目按钮 */}
      <div className="mt-4">
        <button
          onClick={handleAddIncomeClick}
          className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-[#B3EBEF]/20 to-[#87CEEB]/20 border border-[#B3EBEF]/30 rounded-lg hover:bg-gradient-to-r hover:from-[#B3EBEF]/30 hover:to-[#87CEEB]/30 transition-all duration-200"
        >
          <Plus className="w-4 h-4 text-[#4A90A4]" />
          <span className="text-sm font-medium text-[#4A90A4]">新增收入科目</span>
        </button>
      </div>

      {/* 新增收入科目弹窗 - 移除 isMember prop，改用 pageMode */}
      <AddIncomeModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleSaveIncomeItem}
        pageMode="member-balanced"
      />

      {/* 升级会员弹窗 - 保留以防万一需要 */}
      <Dialog open={showUpgradePrompt} onOpenChange={setShowUpgradePrompt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center space-x-2">
              <Crown className="w-5 h-5" style={{ color: '#B3EBEF' }} />
              <span>升级会员</span>
            </DialogTitle>
            <DialogDescription className="text-center">
              新增收入科目需要升级为会员
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
                <li>• 新增更多收入科目进行详细规划</li>
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
});

FutureIncomeContent.displayName = 'FutureIncomeContent';

export default FutureIncomeContent;
