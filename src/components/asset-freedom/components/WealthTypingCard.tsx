import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Share, GitCompare, RefreshCw, ChevronDown, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useShareCard } from '@/hooks/useShareCard';
import ShareCard from './ShareCard';

interface WealthTypingCardProps {
  onCompareWithPrevious?: () => void;
  onBackToDiscover?: () => void;
  showBackButton?: boolean;
  wealthTyping?: {
    title: string;
    code: string;
    description: string;
    traits: Array<{
      label: string;
      value: string;
      progress: number;
      description: string;
    }>;
    previousType: string;
  };
  pageMode?: 'member-severe-shortage' | 'member-liquidity-tight' | 'member-balanced' | 'public-severe-shortage' | 'public-liquidity-tight' | 'public-balanced';
  displayMode?: 'first-time' | 'returning';
  onDisplayModeChange?: (mode: 'first-time' | 'returning') => void;
}

const WealthTypingCard: React.FC<WealthTypingCardProps> = ({ 
  onCompareWithPrevious,
  onBackToDiscover,
  showBackButton = false,
  wealthTyping,
  pageMode = 'public-balanced',
  displayMode = 'first-time',
  onDisplayModeChange
}) => {
  const { toast } = useToast();
  const { showShareCard, openShareCard, closeShareCard } = useShareCard();

  // 使用传入的财富分型数据或根据pageMode生成默认数据
  const typingData = wealthTyping || (() => {
    const isWealthy = pageMode?.endsWith('-liquidity-tight') || pageMode?.endsWith('-balanced');
    
    if (isWealthy) {
      return {
        title: '资产充裕型',
        code: 'A3-E03-R6',
        description: '资产充裕型',
        traits: [
          { label: 'A 财富分型', value: '3', progress: 80, description: '资产充裕型' },
          { label: 'I 收入来源', value: '03', progress: 70, description: '多元收入来源' },
          { label: 'E 支出水平', value: '03', progress: 60, description: '奢侈型' },
          { label: 'R 潜在风险', value: '6', progress: 30, description: '6个潜在风险' }
        ],
        previousType: '中度支出压缩型'
      };
    } else {
      return {
        title: '中度支出压缩型',
        code: 'C01-I02-E03-R2',
        description: '中度支出压缩型',
        traits: [
          { label: 'C 财富分型', value: '01', progress: 20, description: '中度支出压缩型' },
          { label: 'I 收入来源', value: '02', progress: 40, description: '被动收入主导' },
          { label: 'E 支出水平', value: '03', progress: 60, description: '奢侈型' },
          { label: 'R 潜在风险', value: '2', progress: 50, description: '2个潜在风险' }
        ],
        previousType: '极限生存压缩型'
      };
    }
  })();

  const handleRetestWealthTyping = () => {
    toast({
      title: "即将跳转",
      description: "正在为您跳转到财富分型测评页面...",
    });
    
    setTimeout(() => {
      toast({
        title: "功能开发中",
        description: "财富分型重新测评功能即将上线",
        variant: "default"
      });
    }, 1000);
  };

  const handleCompare = () => {
    if (onCompareWithPrevious) {
      onCompareWithPrevious();
    } else {
      toast({
        title: "功能开发中",
        description: "对比功能即将上线"
      });
    }
  };

  // 简化展示模式（非初次进入）
  if (displayMode === 'returning') {
    return (
      <>
        <Card className="bg-[#B3EBEF]/5 border border-[#B3EBEF]/20 relative">
          <CardContent className="p-4">
            {/* 分享按钮 */}
            <Button 
              onClick={openShareCard} 
              className="absolute top-3 right-3 bg-[#B3EBEF] hover:bg-[#B3EBEF]/80 text-gray-800 rounded-full w-8 h-8 p-0"
            >
              <Share className="w-3 h-3" />
            </Button>

            {/* 简化展示：只显示分型名称、代码、分享图标 */}
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-3">{typingData.title}</h3>
              <Badge className="bg-[#B3EBEF]/20 text-gray-700 text-xs px-2 py-1">
                {typingData.code}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* 分享卡片 */}
        <ShareCard 
          isOpen={showShareCard} 
          onClose={closeShareCard} 
        />
      </>
    );
  }

  // 完整展示模式（初次进入）
  return (
    <>
      {/* 完全自定义的卡片，不使用Card组件的默认布局 */}
      <div className="bg-[#B3EBEF]/5 border border-[#B3EBEF]/20 rounded-lg overflow-hidden shadow-sm">
        {/* 返回按钮 - 在卡片外部 */}
        {showBackButton && (
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToDiscover}
              className="text-gray-600 hover:text-gray-800 flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回发现
            </Button>
          </div>
        )}
        
        {/* 背景图片区域 - 这里是整个卡片的内容 */}
        <div 
          className="relative w-full h-[320px] flex flex-col"
          style={{
            backgroundImage: `url('/lovable-uploads/555a1733-cdfd-4816-ba4e-ac975ff37411.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* 深色遮罩层，确保文字可读性 */}
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* 内容层 - 所有内容都在背景图片上 */}
          <div className="relative z-10 h-full flex flex-col p-4">
            {/* 分享按钮 */}
            <Button 
              onClick={openShareCard} 
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-[#01BCD6] rounded-full w-8 h-8 p-0"
            >
              <Share className="w-3 h-3" />
            </Button>

            {/* 标题区域 */}
            <div className="text-center mt-6 mb-4">
              <h3 className="text-xl font-bold text-white mb-3 drop-shadow-lg">{typingData.title}</h3>
              <Badge className="bg-white/20 text-white text-xs px-3 py-1 backdrop-blur-sm">
                {typingData.code}
              </Badge>
            </div>

            {/* 分型描述 - 占据中间空间 */}
            <div className="flex-1 flex items-center justify-center px-4">
              <p className="text-white text-base font-medium drop-shadow-lg text-center">
                您已达到A3顶级财富水平，拥有真正的财富自由！
              </p>
            </div>

            {/* 按钮组 - 固定在底部，确保在背景图片内 */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button
                onClick={handleRetestWealthTyping}
                variant="outline"
                className="bg-white/90 hover:bg-white text-[#01BCD6] border-[#01BCD6] font-medium flex items-center justify-center space-x-1 backdrop-blur-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>重新测评</span>
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: "功能开发中",
                    description: "分型解读功能即将上线",
                    variant: "default"
                  });
                }}
                className="bg-[#01BCD6] hover:bg-[#01BCD6]/80 text-white font-medium flex items-center justify-center space-x-1"
              >
                <ChevronDown className="w-4 h-4" />
                <span>查看分型解读</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 分享卡片 */}
      <ShareCard 
        isOpen={showShareCard} 
        onClose={closeShareCard} 
      />
    </>
  );
};

export default WealthTypingCard;