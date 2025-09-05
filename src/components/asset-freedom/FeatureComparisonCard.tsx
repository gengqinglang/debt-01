
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Check, X } from 'lucide-react';

interface FeatureComparisonCardProps {
  onUnlock: () => void;
  onMembershipUpgrade: () => void;
}

const FeatureComparisonCard: React.FC<FeatureComparisonCardProps> = ({
  onUnlock,
  onMembershipUpgrade
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const features = [
    { name: '快照解读', unlock: true, membership: true },
    { name: '重疾风险测评', unlock: false, membership: true },
    { name: '重疾风险保障方案', unlock: false, membership: true },
    { name: '意外风险测评', unlock: false, membership: true },
    { name: '意外风险保障方案', unlock: false, membership: true },
    { name: '不当消费防御', unlock: false, membership: true },
    { name: '不当投资防御', unlock: false, membership: true },
    { name: '失业降薪风险测评', unlock: false, membership: true },
    { name: '职业规划辅导', unlock: false, membership: true },
    { name: '婚姻变动风险测评', unlock: false, membership: true },
  ];

  return (
    <Card className="bg-white border-none shadow-lg mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardContent className="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-lg font-semibold text-gray-800">
                  💡 选择更划算的方案
                </h4>
                <p className="text-sm text-gray-600">
                  对比 9.9 元解锁 vs 29.9 元会员权益
                </p>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`} 
              />
            </div>
          </CardContent>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="space-y-4">
              {/* 方案对比表格 */}
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-700">
                        功能模块
                      </th>
                      <th className="px-3 py-3 text-center text-sm font-medium text-gray-700">
                        <div className="space-y-1">
                          <div>9.9元</div>
                          <div className="text-xs text-gray-500">单次解锁</div>
                        </div>
                      </th>
                      <th className="px-3 py-3 text-center text-sm font-medium text-white relative" 
                          style={{ backgroundColor: '#10B981' }}>
                        <div className="space-y-1">
                          <div>29.9元/月</div>
                          <div className="text-xs text-green-100">月度会员</div>
                        </div>
                        <div className="absolute top-1 right-1">
                          <span className="bg-yellow-400 text-black text-xs px-1.5 py-0.5 rounded text-black font-medium">
                            推荐
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {features.map((feature, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-3 text-sm text-gray-800">
                          {feature.name}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {feature.unlock ? (
                            <Check className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          )}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <Check className="w-5 h-5 text-green-600 mx-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 价值说明 */}
              <div 
                className="rounded-lg p-3 border-l-4"
                style={{ 
                  backgroundColor: '#F0FDF4',
                  borderLeftColor: '#10B981'
                }}
              >
                <div className="flex items-start space-x-2">
                  <div className="text-green-600 font-medium text-sm">💰 会员更划算：</div>
                  <div className="text-sm text-gray-700">
                    单独购买所有功能需要 99+ 元，会员价格仅 29.9 元/月，
                    <span className="font-medium text-green-700">节省 70% 费用</span>
                  </div>
                </div>
              </div>

              {/* 行动按钮 */}
              <div className="flex space-x-3">
                <Button 
                  onClick={onUnlock}
                  variant="outline"
                  className="flex-1 text-gray-700 border-gray-300"
                >
                  仅解锁快照解读 9.9元
                </Button>
                <Button 
                  onClick={onMembershipUpgrade}
                  className="flex-1 text-white font-medium"
                  style={{ backgroundColor: '#10B981' }}
                >
                  开通月度会员 29.9元
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default FeatureComparisonCard;
