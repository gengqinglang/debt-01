
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';

// 统一的应用状态接口
interface UnifiedAppContextType {
  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Career data - 简化版本，只保留必要字段
  currentJob: string;
  setCurrentJob: (job: string) => void;
  jobLevel: string;
  setJobLevel: (level: string) => void;
  personalTotalIncome: number;
  partnerTotalIncome: number;
  combinedTotalIncome: number;
  isInitialized: boolean;
  
  // 实用函数
  formatToWan: (amount: number) => string;
  resetAllData: () => void;
}

const UnifiedAppContext = createContext<UnifiedAppContextType | undefined>(undefined);

export const useUnifiedApp = () => {
  const context = useContext(UnifiedAppContext);
  if (!context) {
    throw new Error('useUnifiedApp must be used within UnifiedAppProvider');
  }
  return context;
};

interface UnifiedAppProviderProps {
  children: ReactNode;
}

export const UnifiedAppProvider: React.FC<UnifiedAppProviderProps> = ({ children }) => {
  // 使用ref防止重复初始化
  const providerIdRef = useRef(Math.random().toString(36).substr(2, 9));
  const hasInitialized = useRef(false);
  
  const [isLoading, setIsLoadingState] = useState(false);
  
  const setIsLoading = useCallback((loading: boolean) => {
    console.log('[UnifiedAppProvider] setIsLoading called with:', loading);
    setIsLoadingState(loading);
  }, []);
  
  // 简化的状态管理
  const [currentJob, setCurrentJobState] = useState('');
  const [jobLevel, setJobLevelState] = useState('');
  const [personalTotalIncome] = useState(0);
  const [partnerTotalIncome] = useState(0);

  // 安全的localStorage操作
  const safeGetFromStorage = useCallback((key: string, defaultValue: any) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }, []);

  const safeSetToStorage = useCallback((key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('localStorage write failed:', error);
    }
  }, []);

  // 安全初始化 - 使用ref防止重复执行
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    console.log(`[UnifiedAppProvider] ${providerIdRef.current} Loading initial data...`);
    
    try {
      const storedJob = safeGetFromStorage('career_currentJob', '');
      const storedLevel = safeGetFromStorage('career_jobLevel', '');
      
      setCurrentJobState(storedJob);
      setJobLevelState(storedLevel);
      
      console.log(`[UnifiedAppProvider] ${providerIdRef.current} Data loaded successfully`);
    } catch (error) {
      console.error('[UnifiedAppProvider] Initialization error:', error);
    }
  }, [safeGetFromStorage]);

  // 优化的setter函数
  const setCurrentJob = useCallback((job: string) => {
    setCurrentJobState(job);
    safeSetToStorage('career_currentJob', job);
  }, [safeSetToStorage]);

  const setJobLevel = useCallback((level: string) => {
    setJobLevelState(level);
    safeSetToStorage('career_jobLevel', level);
  }, [safeSetToStorage]);

  const formatToWan = useCallback((amount: number): string => {
    return Math.round(amount / 10000).toString();
  }, []);

  const resetAllData = useCallback(() => {
    console.log('[UnifiedAppProvider] Resetting all data...');
    
    const keys = ['career_currentJob', 'career_jobLevel'];
    keys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('Failed to remove localStorage key:', key, error);
      }
    });
    
    setCurrentJobState('');
    setJobLevelState('');
  }, []);

  const combinedTotalIncome = personalTotalIncome + partnerTotalIncome;

  return (
    <UnifiedAppContext.Provider value={{
      isLoading,
      setIsLoading,
      currentJob,
      setCurrentJob,
      jobLevel,
      setJobLevel,
      personalTotalIncome,
      partnerTotalIncome,
      combinedTotalIncome,
      isInitialized: true, // 简化初始化状态，避免不必要的重渲染
      formatToWan,
      resetAllData
    }}>
      {children}
    </UnifiedAppContext.Provider>
  );
};
