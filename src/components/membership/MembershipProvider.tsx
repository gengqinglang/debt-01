
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MembershipContextType {
  isMember: boolean;
  membershipLevel: 'free' | 'premium';
  setMembershipStatus: (isMember: boolean, level?: 'free' | 'premium') => void;
  isDevMode: boolean;
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

interface MembershipProviderProps {
  children: ReactNode;
}

export const MembershipProvider: React.FC<MembershipProviderProps> = ({ children }) => {
  const [isMember, setIsMember] = useState<boolean>(false);
  const [membershipLevel, setMembershipLevel] = useState<'free' | 'premium'>('free');

  // 统一的开发模式检测 - 使用useState避免无限循环
  const [isDevMode] = useState(() => 
    import.meta.env.DEV || 
    import.meta.env.MODE === 'development' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.port === '8080' ||
    window.location.hostname.includes('lovableproject.com') || // 添加Lovable项目域名
    window.location.hostname.includes('lovable.app') // 添加Lovable应用域名
  );

  // 统一的localStorage键，区分环境
  const getMembershipKey = () => {
    const baseKey = 'membershipStatus';
    return isDevMode ? `${baseKey}_dev` : `${baseKey}_prod`;
  };

  const getLevelKey = () => {
    const baseKey = 'membershipLevel';
    return isDevMode ? `${baseKey}_dev` : `${baseKey}_prod`;
  };

  // 初始化会员状态
  useEffect(() => {
    console.log('=== MembershipProvider 初始化 ===');
    console.log('环境检测:', {
      'import.meta.env.DEV': import.meta.env.DEV,
      'import.meta.env.MODE': import.meta.env.MODE,
      'hostname': window.location.hostname,
      'port': window.location.port,
      'includes lovableproject.com': window.location.hostname.includes('lovableproject.com'),
      'includes lovable.app': window.location.hostname.includes('lovable.app'),
      'isDevMode': isDevMode
    });

    const membershipKey = getMembershipKey();
    const levelKey = getLevelKey();
    
    console.log('使用的localStorage键:', { membershipKey, levelKey });

    // 统一的初始化逻辑：默认为普通客户状态
    const defaultMemberStatus = false;
    const defaultLevel: 'free' | 'premium' = 'free';

    let finalMemberStatus = defaultMemberStatus;
    let finalLevel: 'free' | 'premium' = defaultLevel;

    // 只在开发模式下才从localStorage恢复状态
    if (isDevMode) {
      const savedMembership = localStorage.getItem(membershipKey);
      const savedLevel = localStorage.getItem(levelKey);
      
      console.log('开发模式：从localStorage读取状态:', { savedMembership, savedLevel });
      
      if (savedMembership === 'true') {
        finalMemberStatus = true;
        // 确保savedLevel是有效的类型，否则使用premium作为默认值
        finalLevel = (savedLevel === 'free' || savedLevel === 'premium') ? savedLevel : 'premium';
        console.log('开发模式：恢复会员状态');
      } else {
        console.log('开发模式：使用默认状态');
      }
    } else {
      // 生产环境始终使用默认状态
      console.log('生产环境：使用默认状态');
    }

    // 设置实际状态
    setIsMember(finalMemberStatus);
    setMembershipLevel(finalLevel);

    console.log('最终会员状态:', { isMember: finalMemberStatus, membershipLevel: finalLevel });
  }, [isDevMode]);

  // 添加状态更新后的日志
  useEffect(() => {
    console.log('=== 会员状态已更新 ===');
    console.log('当前实际状态:', { isMember, membershipLevel, isDevMode });
  }, [isMember, membershipLevel, isDevMode]);

  const setMembershipStatus = (newIsMember: boolean, level: 'free' | 'premium' = 'premium') => {
    console.log('=== 设置会员状态 ===');
    console.log('新状态:', { newIsMember, level, isDevMode });
    
    setIsMember(newIsMember);
    setMembershipLevel(level);
    
    // 只在开发模式下持久化到localStorage
    if (isDevMode) {
      const membershipKey = getMembershipKey();
      const levelKey = getLevelKey();
      
      localStorage.setItem(membershipKey, newIsMember.toString());
      localStorage.setItem(levelKey, level);
      console.log('开发模式：状态已保存到localStorage');
    } else {
      console.log('生产环境：状态不保存到localStorage');
    }
  };

  return (
    <MembershipContext.Provider 
      value={{ 
        isMember, 
        membershipLevel, 
        setMembershipStatus,
        isDevMode
      }}
    >
      {children}
    </MembershipContext.Provider>
  );
};

export const useMembership = (): MembershipContextType => {
  const context = useContext(MembershipContext);
  if (!context) {
    throw new Error('useMembership must be used within a MembershipProvider');
  }
  return context;
};
