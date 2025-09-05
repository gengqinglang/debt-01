
import { useState, useEffect, useCallback, useRef } from 'react';
import { ASSET_FREEDOM_KEYS } from '@/constants/assetFreedom';

interface UseAssetFreedomStateProps {
  skipLoading?: boolean;
}

export const useAssetFreedomState = ({ skipLoading }: UseAssetFreedomStateProps = {}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isMember, setIsMember] = useState(false);
  
  // 使用 useRef 来标记组件是否已挂载
  const isComponentMountedRef = useRef(true);

  // 重置所有状态的函数
  const handleResetAllStates = useCallback(() => {
    console.log('=== 开发模式：重置所有状态 ===');
    
    // 清除所有相关的 localStorage
    localStorage.removeItem(ASSET_FREEDOM_KEYS.IS_UNLOCKED);
    localStorage.removeItem(ASSET_FREEDOM_KEYS.IS_MEMBER);
    localStorage.removeItem(ASSET_FREEDOM_KEYS.LAST_SESSION_ID);
    
    // 重置组件状态
    if (isComponentMountedRef.current) {
      setIsUnlocked(false);
      setIsMember(false);
    }
    
    console.log('所有状态已重置');
  }, []);

  // 页面初始化时的状态管理 - 移除定时器，改为一次性检查
  useEffect(() => {
    console.log('[useAssetFreedomState] Initializing with skipLoading:', skipLoading);
    
    // 检查是否是带 skipLoading 返回（如调平建议页）
    if (skipLoading) {
      // 直接读取 localStorage 保持最新会员和解锁状态
      const storedUnlocked = localStorage.getItem(ASSET_FREEDOM_KEYS.IS_UNLOCKED) === 'true';
      const storedMember = localStorage.getItem(ASSET_FREEDOM_KEYS.IS_MEMBER) === 'true';
      if (isComponentMountedRef.current) {
        setIsUnlocked(storedUnlocked);
        setIsMember(storedMember);
      }
      return;
    }

    // 原有：风险测评页返回的判断
    const isFromRiskAssessment = skipLoading && 
      (localStorage.getItem(ASSET_FREEDOM_KEYS.IS_UNLOCKED) === 'true' || 
       localStorage.getItem(ASSET_FREEDOM_KEYS.IS_MEMBER) === 'true');

    if (isFromRiskAssessment) {
      // 如果是从风险测评页返回，保持现有状态
      console.log('=== 从风险测评页返回，保持会员状态 ===');
      const storedUnlocked = localStorage.getItem(ASSET_FREEDOM_KEYS.IS_UNLOCKED) === 'true';
      const storedMember = localStorage.getItem(ASSET_FREEDOM_KEYS.IS_MEMBER) === 'true';
      if (isComponentMountedRef.current) {
        setIsUnlocked(storedUnlocked);
        setIsMember(storedMember);
      }
    } else {
      // 其他情况下重置为普通客户状态
      console.log('=== 页面初始化：重置为普通客户状态 ===');
      localStorage.removeItem(ASSET_FREEDOM_KEYS.IS_UNLOCKED);
      localStorage.removeItem(ASSET_FREEDOM_KEYS.IS_MEMBER);
      localStorage.removeItem(ASSET_FREEDOM_KEYS.LAST_SESSION_ID);
      if (isComponentMountedRef.current) {
        setIsUnlocked(false);
        setIsMember(false);
      }
      console.log('已重置为普通客户状态');
    }
  }, [skipLoading]); // 移除其他依赖，避免循环

  // 组件卸载时的清理
  useEffect(() => {
    return () => {
      console.log('[useAssetFreedomState] Component unmounting, cleaning up');
      isComponentMountedRef.current = false;
    };
  }, []);

  return {
    isUnlocked,
    isMember,
    handleResetAllStates
  };
};
