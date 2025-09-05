
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { User, Crown, Calendar, CreditCard, Phone, LogOut } from 'lucide-react';

interface PersonalCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const PersonalCenter: React.FC<PersonalCenterProps> = ({ isOpen, onClose }) => {
  const [isVip, setIsVip] = useState(true);
  const [autoRenewal, setAutoRenewal] = useState(true);

  const handleToggleAutoRenewal = () => {
    setAutoRenewal(!autoRenewal);
    console.log(`自动续费${!autoRenewal ? '已开启' : '已关闭'}`);
  };

  const handleManageSubscription = () => {
    console.log('跳转到订阅管理');
  };

  const handleLogout = () => {
    console.log('退出登录');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>个人中心</span>
          </DialogTitle>
          <DialogDescription>
            查看您的会员状态和管理订阅
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 用户信息 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>用户信息</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-gray-600 space-y-1">
                <div>手机号：138****8888</div>
                <div>注册时间：2024-01-15</div>
              </div>
            </CardContent>
          </Card>

          {/* 月度会员状态 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span>月度会员</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {isVip ? (
                <div className="space-y-2">
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
                <div className="text-center py-4">
                  <div className="text-gray-500 text-sm">您还不是月度会员</div>
                  <Button className="mt-2" size="sm">开通月度会员</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 自动续费设置 */}
          {isVip && (
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
                  <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-700">
                    关闭自动续费后，会员将在到期后失效
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* 管理订阅 */}
          {isVip && (
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleManageSubscription}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                管理订阅和付款方式
              </Button>
              <div className="text-xs text-gray-500 text-center">
                您可以随时取消或修改订阅计划
              </div>
            </div>
          )}

          {/* 退出登录 */}
          <Button 
            variant="outline" 
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            退出登录
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalCenter;
