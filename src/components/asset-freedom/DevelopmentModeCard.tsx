
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Unlock, Crown } from 'lucide-react';
import { ASSET_FREEDOM_KEYS } from '@/constants/assetFreedom';

interface DevelopmentModeCardProps {
  isUnlocked: boolean;
  isMember: boolean;
  onResetStates: () => void;
}

const DevelopmentModeCard: React.FC<DevelopmentModeCardProps> = ({
  isUnlocked,
  isMember,
  onResetStates
}) => {
  // 多重开发模式检测，确保稳定性
  const isDevelopment = 
    import.meta.env.DEV || 
    import.meta.env.MODE === 'development' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.port === '8080';

  console.log('开发模式检测:', {
    'import.meta.env.DEV': import.meta.env.DEV,
    'import.meta.env.MODE': import.meta.env.MODE,
    'hostname': window.location.hostname,
    'port': window.location.port,
    'isDevelopment': isDevelopment
  });

  if (!isDevelopment) {
    return null;
  }

  // 设置为普通客户状态 - 移除页面刷新
  const setNormalUser = () => {
    console.log('=== 开发模式：设置为普通客户 ===');
    localStorage.removeItem(ASSET_FREEDOM_KEYS.IS_UNLOCKED);
    localStorage.removeItem(ASSET_FREEDOM_KEYS.IS_MEMBER);
  };

  // 设置为付费解锁状态 - 移除页面刷新
  const setUnlockedUser = () => {
    console.log('=== 开发模式：设置为付费解锁用户 ===');
    localStorage.setItem(ASSET_FREEDOM_KEYS.IS_UNLOCKED, 'true');
    localStorage.removeItem(ASSET_FREEDOM_KEYS.IS_MEMBER);
  };

  // 设置为会员状态 - 移除页面刷新
  const setMemberUser = () => {
    console.log('=== 开发模式：设置为会员用户 ===');
    localStorage.setItem(ASSET_FREEDOM_KEYS.IS_UNLOCKED, 'true');
    localStorage.setItem(ASSET_FREEDOM_KEYS.IS_MEMBER, 'true');
  };

  return (
    <div className="px-6 pb-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        {/* 状态切换按钮 */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={setNormalUser}
            size="sm"
            variant={!isUnlocked && !isMember ? "default" : "outline"}
            className="text-xs h-8"
          >
            <User className="w-3 h-3 mr-1" />
            普通客户
          </Button>
          
          <Button
            onClick={setUnlockedUser}
            size="sm"
            variant={isUnlocked && !isMember ? "default" : "outline"}
            className="text-xs h-8"
          >
            <Unlock className="w-3 h-3 mr-1" />
            已解锁
          </Button>
          
          <Button
            onClick={setMemberUser}
            size="sm"
            variant={isMember ? "default" : "outline"}
            className="text-xs h-8"
          >
            <Crown className="w-3 h-3 mr-1" />
            会员
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentModeCard;
