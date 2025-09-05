import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Crown, Calendar, CreditCard, Settings, LogOut, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MemberCenterPage = () => {
  const navigate = useNavigate();
  const [isVip, setIsVip] = useState(true);
  const [autoRenewal, setAutoRenewal] = useState(true);

  const goBack = () => {
    navigate(-1);
  };

  const handleToggleAutoRenewal = () => {
    setAutoRenewal(!autoRenewal);
    console.log(`自动续费${!autoRenewal ? '已开启' : '已关闭'}`);
  };

  const handleUpgradeMembership = () => {
    console.log('开通月度会员');
    // 这里可以调用开通会员的API或跳转到支付页面
  };

  const handleManageSubscription = () => {
    console.log('跳转到订阅管理');
    // 这里可以调用客户门户API
  };

  const handleLogout = () => {
    console.log('退出登录');
    // 这里实现退出登录逻辑
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-[#F8FDF8] relative">
      <div className="relative min-h-screen flex flex-col bg-white/90 backdrop-blur-xl">
        {/* 页面头部 */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回</span>
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">会员中心</h1>
            <div className="w-16"></div>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-6">
          {/* 用户信息卡片 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>用户信息</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">手机号</span>
                <span className="text-sm text-gray-800">138****8888</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">注册时间</span>
                <span className="text-sm text-gray-800">2024-01-15</span>
              </div>
              
              <Separator />
              
              {/* 退出登录按钮 */}
              <Button
                variant="outline"
                className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                退出登录
              </Button>
            </CardContent>
          </Card>

          {/* 会员状态卡片 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span>月度会员</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              {isVip ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">当前状态</span>
                    <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                      月度会员
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">到期时间</span>
                    <span className="text-sm text-gray-800">2024-07-15</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">月费</span>
                    <span className="text-sm text-gray-800">¥29.9/月</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Crown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <div className="text-gray-500 text-sm mb-4">您还不是月度会员</div>
                  <Button onClick={handleUpgradeMembership} className="w-full">
                    开通月度会员 ¥29.9/月
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 会员设置 */}
          {isVip && (
            <>
              {/* 自动续费设置 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>自动续费</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-800">自动续费服务</div>
                      <div className="text-xs text-gray-500">到期前24小时自动扣费</div>
                    </div>
                    <Switch
                      checked={autoRenewal}
                      onCheckedChange={handleToggleAutoRenewal}
                    />
                  </div>
                  {!autoRenewal && (
                    <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-yellow-700">
                      关闭自动续费后，会员将在到期后失效
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 订阅管理 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center space-x-2">
                    <Settings className="w-4 h-4 text-gray-600" />
                    <span>订阅管理</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleManageSubscription}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    管理订阅和付款方式
                  </Button>
                  <div className="text-xs text-gray-500 text-center">
                    您可以随时取消或修改订阅
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* 月度会员权益说明 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-gray-900">月度会员权益</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>无限制访问所有功能</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>专业财富分型解读</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>风险评估和建议方案</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>数据云端同步</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>优先体验新功能</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberCenterPage;
