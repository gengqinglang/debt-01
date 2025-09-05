
import React, { ReactNode } from 'react';
import { useMembership } from './MembershipProvider';

interface MembershipGateProps {
  children: (isMember: boolean, setMembershipStatus?: (isMember: boolean, level?: 'free' | 'premium') => void) => ReactNode;
  fallback?: ReactNode;
}

const MembershipGate: React.FC<MembershipGateProps> = ({ children, fallback }) => {
  const { isMember, setMembershipStatus } = useMembership();
  
  if (typeof children === 'function') {
    return <>{children(isMember, setMembershipStatus)}</>;
  }
  
  return isMember ? <>{children}</> : <>{fallback}</>;
};

export default MembershipGate;
