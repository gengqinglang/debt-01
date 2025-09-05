
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, Crown, ChevronDown } from 'lucide-react';
import { useMembership } from './MembershipProvider';

const DevModeToggle: React.FC = () => {
  const { isMember, setMembershipStatus, isDevMode } = useMembership();
  const [showDropdown, setShowDropdown] = useState(false);

  // 只在开发模式下显示
  if (!isDevMode) {
    return null;
  }

  const setNormalUser = () => {
    console.log('开发模式：设置为普通客户');
    setMembershipStatus(false, 'free');
    setShowDropdown(false);
  };

  const setMemberUser = () => {
    console.log('开发模式：设置为会员');
    setMembershipStatus(true, 'premium');
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setShowDropdown(!showDropdown)}
        variant="outline"
        size="sm"
        className="h-8 px-2 border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs"
      >
        {isMember ? (
          <>
            <Crown className="w-3 h-3 mr-1" />
            会员
          </>
        ) : (
          <>
            <User className="w-3 h-3 mr-1" />
            客户
          </>
        )}
        
      </Button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[100px]">
          <button
            onClick={setNormalUser}
            className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center ${
              !isMember ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
            }`}
          >
            <User className="w-3 h-3 mr-2" />
            普通客户
          </button>
          <button
            onClick={setMemberUser}
            className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center ${
              isMember ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
            }`}
          >
            <Crown className="w-3 h-3 mr-2" />
            会员状态
          </button>
        </div>
      )}
    </div>
  );
};

export default DevModeToggle;
