
import { useEffect, useRef } from 'react';

interface PerformanceMonitorProps {
  children: React.ReactNode;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ children }) => {
  const startTimeRef = useRef(Date.now());
  const componentMountedRef = useRef(true);

  useEffect(() => {
    // 性能监控 - 只在开发环境启用
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const monitorPerformance = () => {
      if (!componentMountedRef.current) return;

      const loadTime = Date.now() - startTimeRef.current;
      
      // 如果加载时间超过3秒，发出警告
      if (loadTime > 3000) {
        console.warn('[PerformanceMonitor] Slow component loading detected:', loadTime + 'ms');
      } else {
        console.log('[PerformanceMonitor] Component loaded in:', loadTime + 'ms');
      }
    };

    // 延迟检查，确保组件完全加载
    const timer = setTimeout(monitorPerformance, 100);

    return () => {
      componentMountedRef.current = false;
      clearTimeout(timer);
    };
  }, []);

  // 白屏检测 - 移除强制刷新避免无限循环
  useEffect(() => {
    const whiteScreenDetector = setTimeout(() => {
      if (!componentMountedRef.current) return;
      
      // 检查是否有实际内容渲染
      const hasContent = document.body.textContent?.trim().length || 0;
      if (hasContent < 10) {
        console.error('[PerformanceMonitor] Potential white screen detected');
        
        // 移除强制刷新，仅记录警告避免无限循环
        console.warn('[PerformanceMonitor] White screen detected, but auto-reload disabled to prevent infinite loops');
      }
    }, 5000);

    return () => clearTimeout(whiteScreenDetector);
  }, []);

  return <>{children}</>;
};
