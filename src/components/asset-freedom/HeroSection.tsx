
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TraitData {
  label: string;
  value: string;
  color: string;
  percentage: string;
  progressWidth: number;
}

interface HeroSectionProps {
  isUnlocked: boolean;
  isMember: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isUnlocked, isMember }) => {
  // 会员状态下隐藏整个组件
  if (isMember) {
    return null;
  }

  // 已解锁状态下也隐藏整个组件，因为人设快照已移到InsightsSection中
  if (isUnlocked) {
    return null;
  }

  const { toast } = useToast();
  
  const traits: TraitData[] = [{
    label: '财富分型',
    value: '中度压缩，影响生活质量',
    color: 'bg-[#B3EBEF]',
    percentage: 'C01',
    progressWidth: 20
  }, {
    label: '生涯收入',
    value: '被动收入主导',
    color: 'bg-[#B3EBEF]',
    percentage: 'I02',
    progressWidth: 20
  }, {
    label: '消费水平',
    value: '享受型',
    color: 'bg-[#B3EBEF]',
    percentage: 'E03',
    progressWidth: 60
  }, {
    label: '风险',
    value: '2个潜在风险',
    color: 'bg-[#B3EBEF]',
    percentage: 'R2',
    progressWidth: 20
  }];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '生涯财富快照：节俭型家族继承者',
        text: '查看我的财富状况分析报告',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "数据传输完成",
        description: "快照链接已复制到剪贴板"
      });
    }
  };

  return (
    <div className="px-6 mb-8">
      <Card className="bg-[#B3EBEF]/5 border border-[#B3EBEF]/20 animate-fade-in relative overflow-hidden shadow-sm">
        <CardContent className="p-6">
          <div>
            {/* 分享快照按钮 */}
            <Button 
              onClick={handleShare} 
              className="absolute top-4 right-4 z-20 bg-[#B3EBEF] hover:bg-[#B3EBEF]/80 text-gray-800 border-0 rounded-full w-10 h-10 p-0 font-semibold shadow-md"
            >
              <Share className="w-4 h-4" />
            </Button>

            {/* 上半部分：人设快照 */}
            <div className="mb-6">
              <div className="flex items-center space-x-6">
                {/* 左侧大图片 */}
                <div className="flex-shrink-0">
                  <img src="/lovable-uploads/3c9349c3-3b51-43b8-a9f3-63c0ac638452.png" alt="人设图片" className="w-32 h-48 object-cover rounded-lg shadow-md" />
                </div>
                
                {/* 右侧人设信息 */}
                <div className="flex-1 text-center mt-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">中度支出压缩型</h3>
                  <Badge variant="secondary" className="bg-[#B3EBEF]/20 text-gray-700 text-xs px-3 py-1">
                    C01-I02-E03-R2
                  </Badge>
                </div>
              </div>
            </div>

            {/* 下半部分：财富特征分析 */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {traits.map((trait, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-600">{trait.label}</span>
                      <span className="text-xs font-bold text-gray-600">{trait.percentage}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${trait.color} h-2 rounded-full transition-all duration-1000`} style={{
                        width: `${trait.progressWidth}%`
                      }}></div>
                    </div>
                    <div className="text-xs text-gray-700">{trait.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroSection;
