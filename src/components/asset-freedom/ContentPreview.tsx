
import React from 'react';
import { MessageCircle, HelpCircle, AlertTriangle, Zap } from 'lucide-react';

const ContentPreview: React.FC = () => {
  const modules = [
    {
      icon: MessageCircle,
      title: '财富分型解析',
      description: '深度解读您的财富类型特征'
    },
    {
      icon: HelpCircle,
      title: '成因分析',
      description: '分析形成当前状况的根本原因'
    },
    {
      icon: AlertTriangle,
      title: '风险识别',
      description: '识别13种潜在风险点'
    }
  ];

  return (
    <div className="bg-white border-2 rounded-2xl p-6" style={{ borderColor: '#CAF4F7' }}>
      {/* 重点说明文案 */}
      <div className="text-gray-600 leading-relaxed text-base space-y-3 mb-6">
        <p>
          仅仅知道自己的财富分型远远不够！<br />
          财富分型好比贴了个"标签"，但每个人的财富困境都各有根源——有的人是
          <span className="font-bold text-teal-600">"钱多却不够用"</span>
          ，有的人是
          <span className="font-bold text-orange-600">"收入结构单薄"</span>
          ，有人靠家族，有人靠奋斗……<br />
          明明同样分型，背后的成因、风险点、改善方向都大不一样！
        </p>
        <p>
          <span className="font-bold">【快照解读】</span>
          就是为你量身定制的一份"财富体检报告"：
        </p>
        <ul className="list-disc text-left pl-6 space-y-1">
          <li>帮你剖析<span className="text-teal-600 font-semibold">自己的独特成因</span>，不是千篇一律的模板！</li>
          <li>揭示<span className="text-orange-600 font-semibold">属于你的风险隐患</span>，对症下药才有效！</li>
          <li>甄选<span className="text-green-600 font-semibold">专属建议与行动清单</span>，不浪费一分力气！</li>
          <li>还有<span className="text-purple-600 font-semibold">专业顾问级内容</span>，让你少走弯路！</li>
        </ul>
        <p>
          简单说：<span className="font-semibold text-gray-800">分型只是表面，快照解读才能看到全貌，</span>
          只有解锁后你才能获得真正属于自己的专属解决方案！
        </p>
      </div>
    </div>
  );
};

export default ContentPreview;
