
import React, { ReactNode } from 'react';
import { useMembership } from './MembershipProvider';
import UpgradePrompt from './UpgradePrompt';

interface ContentMaskProps {
  children: ReactNode;
  memberOnly?: boolean;
  maskType?: 'hide' | 'blur' | 'disable';
  upgradePrompt?: {
    title?: string;
    description?: string;
    feature?: string; 
  };
  className?: string;
  currentTab?: string;
  currentPlanningTab?: string;
  currentRiskTab?: string;
  currentToolsTab?: string;
}

const ContentMask: React.FC<ContentMaskProps> = ({
  children,
  memberOnly = false,
  maskType = 'hide',
  upgradePrompt,
  className = "",
  currentTab,
  currentPlanningTab,
  currentRiskTab,
  currentToolsTab
}) => {
  const { isMember } = useMembership();

  // 会员或不需要会员权限时直接显示内容
  if (isMember || !memberOnly) {
    return <div className={className}>{children}</div>;
  }

  // 根据遮罩类型处理非会员用户
  switch (maskType) {
    case 'blur':
      return (
        <div className={`relative ${className}`}>
          <div className="filter blur-sm pointer-events-none">
            {children}
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <UpgradePrompt 
              {...upgradePrompt} 
              currentTab={currentTab}
              currentPlanningTab={currentPlanningTab}
              currentRiskTab={currentRiskTab}
              currentToolsTab={currentToolsTab}
            />
          </div>
        </div>
      );
    
    case 'disable':
      return (
        <div className={`relative ${className}`}>
          <div className="opacity-50 pointer-events-none">
            {children}
          </div>
        </div>
      );
    
    case 'hide':
    default:
      return (
        <div className={className}>
          <UpgradePrompt 
            {...upgradePrompt} 
            currentTab={currentTab}
            currentPlanningTab={currentPlanningTab}
            currentRiskTab={currentRiskTab}
            currentToolsTab={currentToolsTab}
          />
        </div>
      );
  }
};

export default ContentMask;
