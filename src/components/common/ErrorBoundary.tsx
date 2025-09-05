
import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
  errorId: string;
  lastErrorTime: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 2; // 减少最大重试次数
  private minRetryInterval = 5000; // 5秒最小重试间隔

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      retryCount: 0,
      errorId: '',
      lastErrorTime: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const currentTime = Date.now();
    
    console.error(`[ErrorBoundary] Error caught with ID: ${errorId}`, error);
    
    return { 
      hasError: true, 
      error,
      errorId,
      lastErrorTime: currentTime
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorDetails = {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      retryCount: this.state.retryCount,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      memoryUsage: (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      } : 'Not available'
    };
    
    console.error('[ErrorBoundary] Detailed error info:', errorDetails);
    
    // 检测是否是内存相关错误
    if (error.message.includes('Maximum call stack') || 
        error.message.includes('out of memory') ||
        error.message.includes('stack overflow')) {
      console.error('[ErrorBoundary] Memory/Stack overflow detected, forcing reload');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      return;
    }
    
    // 调用外部错误处理函数
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    const currentTime = Date.now();
    const timeSinceLastError = currentTime - this.state.lastErrorTime;
    
    // 防止过于频繁的重试
    if (timeSinceLastError < this.minRetryInterval) {
      console.warn('[ErrorBoundary] Retry too soon, waiting...');
      return;
    }
    
    const newRetryCount = this.state.retryCount + 1;
    
    console.log(`[ErrorBoundary] Retry attempt ${newRetryCount}/${this.maxRetries}`);
    
    if (newRetryCount > this.maxRetries) {
      console.error('[ErrorBoundary] Max retries reached, forcing page reload');
      window.location.reload();
      return;
    }

    this.setState({ 
      hasError: false, 
      error: null, 
      retryCount: newRetryCount,
      lastErrorTime: currentTime
    });
  };

  handleForceReload = () => {
    console.log('[ErrorBoundary] Force reload requested');
    window.location.reload();
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    // 如果错误状态被清除，记录恢复信息
    if (prevState.hasError && !this.state.hasError) {
      console.log('[ErrorBoundary] Component recovered from error');
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const canRetry = this.state.retryCount < this.maxRetries;
      const timeSinceLastError = Date.now() - this.state.lastErrorTime;
      const canRetryNow = timeSinceLastError >= this.minRetryInterval;

      return (
        <div className="min-h-[200px] flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center space-y-4">
              <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  页面加载出错
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  页面遇到了一些问题，请稍后重试
                </p>
                {this.state.retryCount > 0 && (
                  <p className="text-xs text-gray-500">
                    重试次数: {this.state.retryCount}/{this.maxRetries}
                  </p>
                )}
                {!canRetryNow && (
                  <p className="text-xs text-yellow-600">
                    请等待 {Math.ceil((this.minRetryInterval - timeSinceLastError) / 1000)} 秒后重试
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  错误ID: {this.state.errorId}
                </p>
              </div>
              <div className="space-y-2">
                {canRetry && canRetryNow ? (
                  <Button 
                    onClick={this.handleRetry}
                    className="bg-[#B3EBEF] hover:bg-[#B3EBEF]/80 text-gray-800 w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    重新加载 ({this.maxRetries - this.state.retryCount} 次剩余)
                  </Button>
                ) : (
                  <Button 
                    onClick={this.handleForceReload}
                    className="bg-red-500 hover:bg-red-600 text-white w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    刷新页面
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
