import React from 'react';

interface MemberExclusiveContentProps {
  isUnlocked: boolean;
  isMember: boolean;
  onResetStates: () => void;
  shouldScrollToDefault: boolean;
}

const MemberExclusiveContent: React.FC<MemberExclusiveContentProps> = ({ 
  isUnlocked, 
  isMember, 
  onResetStates,
  shouldScrollToDefault 
}) => {
  return (
    <div className="space-y-6">
      {/* 移除了 MainNavigationTabs 组件，因为在 NewPage 中已经有底部导航了 */}
    </div>
  );
};

export default MemberExclusiveContent;
