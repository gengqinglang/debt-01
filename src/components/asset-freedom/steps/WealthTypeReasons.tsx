
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle } from 'lucide-react';

interface WealthTypeReasonsProps {
  onBack: () => void;
  onComplete: () => void;
}

const WealthTypeReasons: React.FC<WealthTypeReasonsProps> = ({ onBack, onComplete }) => {
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
          <HelpCircle className="w-5 h-5" style={{ color: '#0891b2' }} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">第二步：分型形成原因</h2>
          <p className="text-gray-600">深入了解形成这种分型的根本原因</p>
        </div>
      </div>

      {/* 详细内容 */}
      <div 
        className="rounded-2xl p-6"
        style={{ backgroundColor: 'rgba(202, 244, 247, 0.1)' }}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">为什么您是这种类型？</h3>
          
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            这一财富分型的形成，核心症结在于资产虽多"不够用"与收入结构"独木难支"，成为制约财务收支平衡的两大枷锁。
          </p>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-800 font-semibold mb-2">症结一：资产虽多"不够用"的深层原因</p>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                你处于职业发展高峰期，工资水平中低但资产高，形成这种资产现状的原因可能是以下几点：
              </p>
              <ul className="pl-4 list-disc text-gray-700 space-y-2 text-sm">
                <li>
                  <span className="font-semibold">家庭财富支持或遗产继承：</span>
                  你的高资产可能主要来源于家庭财富的支持或遗产继承。即使当前工资不高，你可能通过父母一代的房产、存款或其他资产直接获得大额财富。
                </li>
                <li>
                  <span className="font-semibold">早期抓住重大资产增值机会：</span>
                  你的高资产可能得益于早期的关键决策，比如在房价低点购房、参与早期股权投资或投资稀缺资源。
                </li>
                <li>
                  <span className="font-semibold">资产配置稳健，被动收入稳定：</span>
                  尽管工资中低，但你可能拥有稳健的资产配置，形成了稳定的被动收入来源。
                </li>
                <li>
                  <span className="font-semibold">高杠杆运作与资本操作能力：</span>
                  你可能通过高杠杆运作或资本操作获取资产，并利用资产增值带来的收益维持资产增长。
                </li>
                <li>
                  <span className="font-semibold">职业发展初期积累的核心资产：</span>
                  尽管目前工资中低，但在职业发展初期，你可能积累了关键资产，这些资产在后期大幅增值。
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm text-gray-800 font-semibold mb-2">症结二：收入结构"独木难支"</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                收入来源高度依赖主动收入，形成"独木难支"的脆弱格局，抗风险能力薄弱。缺乏被动收益作为补充缓冲，仅靠你一人的有限固定工资，收入水平不高且不稳定，已难以应对突发支出与生活成本的持续上涨。这种结构性失衡，在长期生活压力下逐渐显露出支撑力不足的短板，成为"支出压缩"的核心症结。
              </p>
            </div>
          </div>
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

export default WealthTypeReasons;
