
import { useState, useEffect } from 'react';

interface UseLoadingProgressProps {
  skipLoading?: boolean;
}

export const useLoadingProgress = ({ skipLoading }: UseLoadingProgressProps = {}) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showContent, setShowContent] = useState(true); // 默认显示内容，避免空白闪烁

  useEffect(() => {
    console.log('[useLoadingProgress] Starting with skipLoading:', skipLoading);
    
    // 如果是从风险测评或调平建议页返回，直接显示内容
    if (skipLoading) {
      console.log('[useLoadingProgress] Skipping loading animation');
      setLoadingProgress(100);
      setShowContent(true);
      return;
    }

    // 否则，正常显示加载动画 - 修复定时器冲突
    let animationFrame: number;
    const startTime = Date.now();
    const duration = 2000; // 2秒完成加载

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 99.7);
      
      setLoadingProgress(progress);
      
      if (progress < 99.7) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        console.log('[useLoadingProgress] Animation completed');
        // 移除延迟设置，避免内容闪烁
      }
    };

    animationFrame = requestAnimationFrame(animate);

    // 清理函数 - 确保动画帧被正确清理
    return () => {
      console.log('[useLoadingProgress] Cleaning up animation frame');
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [skipLoading]);

  return {
    loadingProgress,
    showContent
  };
};
