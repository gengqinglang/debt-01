
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, Crown, Calendar, CreditCard, LogOut, 
  Settings, Clock, TrendingUp, Shield, Star, UserPlus, Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MemberProfileTab = () => {
  const navigate = useNavigate();
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
    navigate('/');
  };

  const handleInvitePartner = () => {
    console.log('邀请伴侣加入家庭账户');
  };

  return (
    <div className="px-6 py-4 space-y-6">
      {/* 用户信息头部 */}
      <div className="text-center space-y-4">
        <Avatar className="w-20 h-20 mx-auto shadow-lg border-2 border-[#B3EBEF]/30">
          <AvatarImage 
            src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&h=150&fit=crop&crop=face" 
            alt="用户头像" 
          />
          <AvatarFallback className="bg-[#B3EBEF]/20 text-gray-700 text-xl font-semibold">
            用户
          </AvatarFallback>
        </Avatar>
        
        <div>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Badge className="bg-[#B3EBEF]/20 text-gray-700 border-[#B3EBEF]/50 font-semibold px-3 py-1">
              <Crown className="w-3 h-3 mr-1" />
              月度会员
            </Badge>
          </div>
          <p className="text-sm text-gray-600">138****8888</p>
        </div>
      </div>

      {/* 会员状态卡片 */}
      <Card className="bg-gradient-to-r from-[#B3EBEF]/10 to-[#CAF4F7]/10 border-[#B3EBEF]/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span>月度会员状态</span>
            </div>
            <Badge className="bg-green-50 text-green-600 border-green-200">
              有效
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">到期时间</p>
              <p className="text-sm font-medium text-gray-800">2024-07-15</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">月费</p>
              <p className="text-sm font-medium text-gray-800">¥29.9/月</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#B3EBEF] h-2 rounded-full w-3/4"></div>
          </div>
          <p className="text-xs text-gray-500 text-center">距离到期还有 25 天</p>
        </CardContent>
      </Card>


      {/* 会员权益概览 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>我的权益</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center text-gray-500 py-4">
            待补充...
          </div>
        </CardContent>
      </Card>

      {/* 家庭账户邀请 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#B3EBEF]" />
            <span>家庭账户</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-800">邀请伴侣加入</div>
              <div className="text-xs text-gray-500">共享所有账户数据编辑权限</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-[#B3EBEF] text-[#B3EBEF] hover:bg-[#B3EBEF]/10"
              onClick={handleInvitePartner}
            >
              <UserPlus className="w-4 h-4 mr-1" />
              邀请
            </Button>
          </div>
          
          {/* 当前家庭成员状态 */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-2">当前家庭成员</div>
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage 
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=32&h=32&fit=crop&crop=face" 
                  alt="用户头像" 
                />
                <AvatarFallback className="bg-[#B3EBEF]/20 text-gray-600 text-sm">
                  我
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium text-gray-800">我（账户所有者）</div>
                <div className="text-xs text-gray-500">138****8888</div>
              </div>
            </div>
            
            <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700 text-center">
              邀请伴侣后，您和伴侣都可以编辑本家庭账户下的所有数据
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* 底部操作区域 */}
      <div className="space-y-3">        
        <Button 
          variant="outline" 
          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          退出登录
        </Button>
      </div>
    </div>
  );
};

export default MemberProfileTab;
