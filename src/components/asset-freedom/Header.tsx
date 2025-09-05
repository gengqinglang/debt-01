
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  isUnlocked: boolean;
  isMember: boolean;
}

const Header: React.FC<HeaderProps> = ({ isUnlocked, isMember }) => {
  const navigate = useNavigate();

  const handlePersonalCenterClick = () => {
    navigate('/personal-center');
  };

  // 普通客户：展示左侧icon和"您的财富分型结果"标题
  if (!isUnlocked && !isMember) {
    return (
      <div className="relative px-6 pt-8 pb-6 z-10">
        <div className="flex items-center">
          <Star className="w-6 h-6 text-teal-400 mr-2" />
          <span className="text-lg font-semibold text-gray-800">您的财富分型结果</span>
        </div>
      </div>
    );
  }

  // 已解锁或会员状态：展示头像和个人中心，无导航按钮 - 减少顶部间距
  return (
    <div className="relative px-6 pt-4 pb-4 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="w-10 h-10 shadow-lg bg-[#B3EBEF]">
            <AvatarImage src="" alt="avatar" />
            <AvatarFallback>
              <span className="text-lg text-gray-700">U</span>
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handlePersonalCenterClick}
              variant="ghost"
              size="sm"
              className="ml-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full px-3 py-2 flex items-center space-x-2"
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">个人中心</span>
            </Button>
            {isMember && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs px-2 py-1">
                月度会员
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
