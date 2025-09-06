
import { useEffect, useRef } from 'react';

interface MemoryMonitorProps {
  children: React.ReactNode;
}

export const MemoryMonitor: React.FC<MemoryMonitorProps> = ({ children }) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const componentMountedRef = useRef(true);

  useEffect(() => {
    // 只在开发环境和内存监控需要时启用
    if (process.env.NODE_ENV !== 'development' || !('memory' in performance)) {
      return;
    }

    const monitorMemory = () => {
      if (!componentMountedRef.current) return;

      try {
        const memory = (performance as any).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
        
        // 只在内存使用较高时输出日志
        if (usedMB > 50) {
          console.log(`[MemoryMonitor] Memory usage: ${usedMB}MB / ${limitMB}MB`);
        }
        
        // 如果内存使用超过限制的80%，发出警告
        if (usedMB > limitMB * 0.8) {
          console.warn('[MemoryMonitor] High memory usage detected, consider cleaning up resources');
          
          // 触发垃圾回收（如果可用）
          if ('gc' in window) {
            (window as any).gc();
          }
        }
      } catch (error) {
        // 忽略内存监控错误，避免影响应用运行
        console.debug('[MemoryMonitor] Memory monitoring error:', error);
      }
    };

    // 延长检查间隔到60秒，减少性能影响
    intervalRef.current = setInterval(monitorMemory, 60000);
    
    // 初始检查延迟5秒，让应用先完全加载
    const initialTimer = setTimeout(monitorMemory, 5000);

    return () => {
      componentMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      clearTimeout(initialTimer);
    };
  }, []);

  return <>{children}</>;
};
