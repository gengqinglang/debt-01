import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, PiggyBank, Home, Building, Gift, Heart, HandHeart, DollarSign, Briefcase, Crown, ArrowRight, Smartphone, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMembership } from '@/components/membership/MembershipProvider';

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  existingIncomeIds?: string[];
  pageMode?: 'member-severe-shortage' | 'member-liquidity-tight' | 'member-balanced' | 'public-severe-shortage' | 'public-liquidity-tight' | 'public-balanced';
  onInteractionAttempt?: () => void;
}

const AddIncomeModal = ({
  isOpen,
  onClose,
  onSave,
  existingIncomeIds = [],
  pageMode = 'public-balanced',
  onInteractionAttempt
}: AddIncomeModalProps) => {
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [showDetailForm, setShowDetailForm] = useState(false);
  
  // 内部升级提示相关状态
  const [showInternalUpgradePrompt, setShowInternalUpgradePrompt] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginStep, setLoginStep] = useState<'phone' | 'verification' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const { toast } = useToast();
  const { setMembershipStatus, isDevMode } = useMembership();

  // 可添加的收入科目类型
  const incomeTypes = [
    { 
      value: 'personal-pension', 
      label: '本人企业年金', 
      fields: ['balance', 'contributionRate'],
      icon: PiggyBank,
      description: '企业为您缴纳的年金账户',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    { 
      value: 'partner-pension', 
      label: '伴侣企业年金', 
      fields: ['balance', 'contributionRate'],
      icon: PiggyBank,
      description: '伴侣企业缴纳的年金账户',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    { 
      value: 'personal-fund', 
      label: '本人公积金', 
      fields: ['balance', 'contributionRate'],
      icon: Building,
      description: '您的住房公积金账户',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    { 
      value: 'partner-fund', 
      label: '伴侣公积金', 
      fields: ['balance', 'contributionRate'],
      icon: Building,
      description: '伴侣的住房公积金账户',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200'
    },
    { 
      value: 'rent', 
      label: '房租', 
      fields: ['monthlyRent', 'rentPeriod'],
      icon: Home,
      description: '出租房产获得的租金收入',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    { 
      value: 'inheritance', 
      label: '继承/赠予', 
      fields: ['incomePeriod', 'annualAmount'],
      icon: Gift,
      description: '预期获得的继承或赠予收入',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    { 
      value: 'children-support', 
      label: '子女赡养', 
      fields: ['incomePeriod', 'annualAmount'],
      icon: Heart,
      description: '子女提供的赡养费用',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    { 
      value: 'family-support', 
      label: '亲友资助', 
      fields: ['incomePeriod', 'annualAmount'],
      icon: HandHeart,
      description: '亲友提供的经济资助',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    { 
      value: 'other', 
      label: '其他收入', 
      fields: ['incomePeriod', 'annualAmount'],
      icon: DollarSign,
      description: '其他类型的收入来源',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    }
  ];

  // 过滤出未添加过的收入科目
  const availableIncomeTypes = incomeTypes.filter(type => !existingIncomeIds.includes(type.value));

  const resetForm = () => {
    setSelectedType('');
    setFormData({});
    setErrors({});
    setShowDetailForm(false);
    setShowInternalUpgradePrompt(false);
    setShowLoginModal(false);
    setShowPaymentModal(false);
    setLoginStep('phone');
    setPhoneNumber('');
    setVerificationCode('');
    setIsProcessingPayment(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // 简化的 handleTypeSelect 函数
  const handleTypeSelect = (type: any) => {
    console.log('=== AddIncomeModal handleTypeSelect 调试 ===');
    console.log('pageMode:', pageMode);
    console.log('点击的收入科目:', type.label);
    
    // 普通客户状态检查
    if (pageMode?.startsWith('public-')) {
      console.log('检测到普通客户用户，显示升级提示');
      if (onInteractionAttempt) {
        onInteractionAttempt();
      } else {
        setShowInternalUpgradePrompt(true);
      }
      return;
    }
    
    console.log('会员用户，继续正常流程');
    // 会员用户的正常流程
    setSelectedType(type.value);
    setFormData({});
    setErrors({});
    setShowDetailForm(true);
  };

  // 升级流程处理函数
  const handleUpgradeClick = () => {
    setShowInternalUpgradePrompt(false);
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
        description: "欢迎成为会员，现在可以在生涯收入模块添加更多收入科目了",
      });
      
      setShowPaymentModal(false);
      
      // 设置会员状态
      setMembershipStatus(true, 'premium');
      console.log('会员状态已设置');
      
      // 关闭整个弹窗，让用户看到页面停留在生涯收入模块
      handleClose();
      
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

  const handleBackToSelection = () => {
    setShowDetailForm(false);
    setSelectedType('');
    setFormData({});
    setErrors({});
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
    
    // 清除该字段的错误
    if (errors[field]) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};
    const selectedTypeData = incomeTypes.find(type => type.value === selectedType);
    
    if (!selectedTypeData) {
      newErrors.type = '请选择收入科目类型';
      setErrors(newErrors);
      return false;
    }

    selectedTypeData.fields.forEach(field => {
      const value = formData[field];
      
      if (!value || value.trim() === '') {
        newErrors[field] = '此字段为必填项';
      } else if (['balance', 'contributionRate', 'monthlyRent', 'equityAmount', 'annualAmount'].includes(field)) {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0) {
          newErrors[field] = '请输入有效的数值';
        } else if (field === 'contributionRate' && numValue > 20) {
          newErrors[field] = '缴纳比例不能超过20%';
        } else if (['balance', 'equityAmount'].includes(field) && numValue > 10000) {
          newErrors[field] = '金额不能超过10000万';
        } else if (field === 'monthlyRent' && numValue > 100000) {
          newErrors[field] = '月租金不能超过10万元';
        } else if (field === 'annualAmount' && numValue > 1000) {
          newErrors[field] = '年收入金额不能超过1000万';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const selectedTypeData = incomeTypes.find(type => type.value === selectedType);
      if (selectedTypeData) {
        const saveData = {
          name: selectedTypeData.label,
          type: selectedType,
          ...formData
        };
        
        // 计算总金额
        if (formData.balance) {
          saveData.amount = formData.balance;
        } else if (formData.monthlyRent) {
          saveData.amount = (parseFloat(formData.monthlyRent) * 12 / 10000).toFixed(2); // 转换为年收入（万元）
        } else if (formData.equityAmount) {
          saveData.amount = formData.equityAmount;
        } else if (formData.annualAmount) {
          saveData.amount = formData.annualAmount;
        }
        
        onSave(saveData);
        handleClose();
      }
    }
  };

  const renderFormFields = () => {
    const selectedTypeData = incomeTypes.find(type => type.value === selectedType);
    if (!selectedTypeData) return null;

    return selectedTypeData.fields.map(field => {
      const fieldConfig = getFieldConfig(field);
      
      return (
        <div key={field} className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            {fieldConfig.label}
            {fieldConfig.unit && (
              <span className="text-xs text-gray-500 ml-1">({fieldConfig.unit})</span>
            )}
          </Label>
          <Input
            type={fieldConfig.type}
            value={formData[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={fieldConfig.placeholder}
            className={`text-base ${errors[field] ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
          />
          {errors[field] && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <X className="w-4 h-4" />
              {errors[field]}
            </p>
          )}
        </div>
      );
    });
  };

  const getFieldConfig = (field: string) => {
    const configs: any = {
      balance: { label: '余额', placeholder: '请输入余额', unit: '万元', type: 'number' },
      contributionRate: { label: '缴纳比例', placeholder: '请输入缴纳比例', unit: '%', type: 'number' },
      monthlyRent: { label: '月租金', placeholder: '请输入月租金', unit: '元', type: 'number' },
      rentPeriod: { label: '租赁期限', placeholder: '例如：2024-2030', unit: '', type: 'text' },
      equityAmount: { label: '股权金额', placeholder: '请输入股权金额', unit: '万元', type: 'number' },
      maturityTime: { label: '到期时间', placeholder: '例如：2030年12月', unit: '', type: 'text' },
      incomePeriod: { label: '收入时间段', placeholder: '例如：2024-2050', unit: '', type: 'text' },
      annualAmount: { label: '收入金额', placeholder: '请输入年收入金额', unit: '万元/年', type: 'number' }
    };
    
    return configs[field] || { label: field, placeholder: `请输入${field}`, unit: '', type: 'text' };
  };

  const selectedTypeData = incomeTypes.find(type => type.value === selectedType);

  if (showDetailForm && selectedTypeData) {
    // 详情录入弹窗
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <selectedTypeData.icon className={`w-5 h-5 ${selectedTypeData.color}`} />
              {selectedTypeData.label}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {renderFormFields()}
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleBackToSelection}
              className="flex-1"
            >
              返回选择
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-[#CCE9B5] to-[#B8E0A1] text-gray-900 hover:from-[#BBE3A8] hover:to-[#A5D094]"
            >
              确认添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // 收入科目选择弹窗
  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold text-gray-800">
              新增收入科目
            </DialogTitle>
          </DialogHeader>
          
          {availableIncomeTypes.length === 0 ? (
            <div className="py-8 text-center">
              <div className="text-gray-500">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">所有收入科目已添加完毕</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 mt-4 max-h-96 overflow-y-auto">
              {availableIncomeTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Card 
                    key={type.value}
                    className={`cursor-pointer hover:shadow-md transition-all duration-200 ${type.borderColor}`}
                    onClick={() => {
                      console.log('Card onClick triggered for:', type.label);
                      handleTypeSelect(type);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${type.bgColor}`}>
                          <IconComponent className={`w-5 h-5 ${type.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{type.label}</h3>
                          <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                        </div>
                        <Plus className="w-4 h-4 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <Button 
              onClick={handleClose}
              variant="outline"
              className="px-6"
            >
              取消
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 内部升级会员弹窗 */}
      <Dialog open={showInternalUpgradePrompt} onOpenChange={setShowInternalUpgradePrompt}>
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
              onClick={() => setShowInternalUpgradePrompt(false)}
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
    </>
  );
};

export default AddIncomeModal;
