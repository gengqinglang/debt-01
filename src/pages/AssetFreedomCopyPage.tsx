
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/asset-freedom/Header';
import ParticleBackground from '@/components/asset-freedom/ParticleBackground';
import LoadingSection from '@/components/asset-freedom/LoadingSection';
import HeroSection from '@/components/asset-freedom/HeroSection';
import InsightsSection from '@/components/asset-freedom/InsightsSection';
import DevelopmentModeCard from '@/components/asset-freedom/DevelopmentModeCard';
import MemberExclusiveContent from '@/components/asset-freedom/MemberExclusiveContent';
import { useAssetFreedomState } from '@/hooks/useAssetFreedomState';
import { useLoadingProgress } from '@/hooks/useLoadingProgress';

const AssetFreedomCopyPage = () => {
  const location = useLocation();
  const skipLoading = location.state?.skipLoading;
  const [shouldScrollToDefault, setShouldScrollToDefault] = useState(false);

  // 使用自定义 hooks 管理状态
  const { isUnlocked, isMember, handleResetAllStates } = useAssetFreedomState({ skipLoading });
  const { loadingProgress, showContent } = useLoadingProgress({ skipLoading });

  // 监听会员状态变化，触发滚动
  useEffect(() => {
    if (showContent && isMember) {
      console.log('会员状态检测，准备滚动到默认位置');
      setShouldScrollToDefault(true);
      
      // 滚动触发后重置标识
      const timer = setTimeout(() => {
        setShouldScrollToDefault(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [showContent, isMember]);

  return (
    <div className={`min-h-screen flex flex-col w-full max-w-md mx-auto relative overflow-hidden transition-colors duration-500 ${
      showContent 
        ? 'bg-white' 
        : 'bg-gradient-to-br from-gray-100 via-green-50 to-blue-50'
    }`}>
      <ParticleBackground />
      
      {/* 固定的Header区域 - 使用透明背景和轻微模糊效果实现自然融合 */}
      <div className={`fixed top-0 left-0 right-0 z-50 max-w-md mx-auto ${
        showContent 
          ? 'bg-white/95 backdrop-blur-sm' 
          : 'bg-transparent'
      }`}>
        <Header isUnlocked={isUnlocked} isMember={isMember} />
      </div>

      {/* 只在 showContent 为 false 且未走 skipLoading 时才显示加载动画 */}
      {!showContent && !skipLoading && <LoadingSection loadingProgress={loadingProgress} />}

      {/* Main Content - 减少顶部padding让整体内容上移 */}
      {showContent && (
        <div className="relative z-10 flex-1 animate-fade-in pt-16">
          {/* 人设卡片 - 所有状态都显示 */}
          <HeroSection isUnlocked={isUnlocked} isMember={isMember} />
          
          {/* 快照解读 - 所有状态都显示 */}
          <InsightsSection isUnlocked={isUnlocked} isMember={isMember} />
          
          {/* 会员专享内容 - 只在会员状态下显示，传递滚动标识 */}
          {isMember && (
            <MemberExclusiveContent 
              isUnlocked={isUnlocked}
              isMember={isMember}
              onResetStates={handleResetAllStates}
              shouldScrollToDefault={shouldScrollToDefault}
            />
          )}
          
          {/* 开发模式卡片 - 只在非会员状态下显示 */}
          {!isMember && (
            <DevelopmentModeCard 
              isUnlocked={isUnlocked}
              isMember={isMember}
              onResetStates={handleResetAllStates}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AssetFreedomCopyPage;
