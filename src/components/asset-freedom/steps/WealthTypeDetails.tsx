
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle } from 'lucide-react';

interface WealthTypeDetailsProps {
  onBack: () => void;
  onComplete: () => void;
}

const WealthTypeDetails: React.FC<WealthTypeDetailsProps> = ({ onBack, onComplete }) => {
  return (
    <div className="space-y-6">
      {/* 头部导航 */}
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回概览
        </Button>
      </div>

      {/* 步骤标题 */}
      <div className="flex items-center space-x-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#CAF4F7' }}
        >
          <MessageCircle className="w-5 h-5" style={{ color: '#0891b2' }} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">第一步：财富分型详情</h2>
          <p className="text-gray-600">了解您的财富分型意味着什么</p>
        </div>
      </div>

      {/* 详细内容 */}
      <div 
        className="rounded-2xl p-6"
        style={{ backgroundColor: 'rgba(202, 244, 247, 0.1)' }}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">这种财富分型意味着什么？</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            您的财富分型属于中度压缩型。这意味着您的规划整体是不合理的，看来短期内买房这事得彻底搁置了，只能先维持现状继续住着，原本改善居住条件、提升生活品质的计划，也得往后推了。日常开销这块，像周末约饭、健身卡续费、买贵价护肤品，都得狠狠"砍一刀"；人情往来能精简就精简，家政服务也别太频繁；至于种草的限量珠宝、心心念念的出国游，更是得果断放下。说实话，这么调整肯定会让日子少了很多享受，生活舒适度也会大打折扣，但这也是没办法的事，先把经济稳住才是当务之急！
          </p>
        </div>
      </div>

      {/* 完成按钮 */}
      <div className="flex justify-center">
        <Button
          onClick={onComplete}
          className="w-full text-gray-800 px-8 py-2"
          style={{ backgroundColor: '#BFF6F8' }}
        >
          我已了解，继续下一步
        </Button>
      </div>
    </div>
  );
};

export default WealthTypeDetails;
