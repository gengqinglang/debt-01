
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X } from 'lucide-react';

interface PurchaseOptionsProps {
  onUnlock: () => void;
  onMembershipUpgrade: () => void;
  onShowMembershipDialog: () => void;
}

const PurchaseOptions: React.FC<PurchaseOptionsProps> = ({
  onUnlock,
  onMembershipUpgrade,
  onShowMembershipDialog
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    { name: '快照解读', unlock: true, membership: true },
    { name: '重疾风险测评', unlock: false, membership: true },
    { name: '重疾保障方案', unlock: false, membership: true },
    { name: '意外风险测评', unlock: false, membership: true },
    { name: '意外保障方案', unlock: false, membership: true },
    { name: '消费防御', unlock: false, membership: true },
    { name: '投资防御', unlock: false, membership: true },
    { name: '失业风险测评', unlock: false, membership: true },
    { name: '职业规划', unlock: false, membership: true },
    { name: '婚姻风险测评', unlock: false, membership: true },
  ];

  return (
    <div className="space-y-6">
      {/* 选择标题 */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">选择解锁方式</h3>
      </div>

      {/* 选项1：29.9元月度会员（推荐） */}
      <div className="bg-white border-2 rounded-2xl p-6 relative" style={{ borderColor: '#CAF4F7' }}>
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gray-800 text-white px-4 py-1">
            推荐
          </Badge>
        </div>
        <div className="text-center space-y-4 pt-2">
          <div className="flex items-center justify-center space-x-2">
            <Badge className="border-0" style={{ backgroundColor: '#BFF6F8', color: '#374151' }}>
              完整版解读
            </Badge>
            <div className="space-x-2">
              <span className="text-sm text-gray-500 line-through">¥99</span>
              <span className="text-3xl font-bold text-gray-800">¥29.9</span>
              <span className="text-sm text-gray-600 font-medium">/月</span>
            </div>
          </div>
          <h4 className="text-lg font-semibold text-gray-800">开通月度会员</h4>
          <div className="rounded-lg p-4 text-left" style={{ backgroundColor: 'rgba(202, 244, 247, 0.2)' }}>
            <p className="text-sm font-medium mb-2" style={{ color: '#01BCD6' }}>
              ✨ 获得更详尽的解读内容：
            </p>
            <ul className="text-sm space-y-1" style={{ color: '#01BCD6' }}>
              <li>• <span className="font-semibold">更细致的分型分析</span> - 深度剖析你的财富模式</li>
              <li>• <span className="font-semibold">多维度风险评估</span> - 覆盖10+专业评估领域</li>
              <li>• <span className="font-semibold">个性化建议方案</span> - 针对性强的行动指导</li>
              <li>• <span className="font-semibold">专业顾问级内容</span> - 享受全套服务体系</li>
            </ul>
          </div>
          <p className="text-sm text-gray-600">
            享受全部10项专业服务，含深度解读+专业评估+完整方案+持续指导
          </p>
          
          {/* 会员权益按钮 */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              >
                查看月度会员权益
              </Button>
            </DialogTrigger>
            
            <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle className="text-center text-lg font-bold">月度会员权益对比</DialogTitle>
              </DialogHeader>
              
              <div className="mt-4 overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3 text-xs sm:text-sm">功能</TableHead>
                      <TableHead className="text-center text-xs sm:text-sm">9.9元<br className="hidden sm:block"/>单次解锁</TableHead>
                      <TableHead className="text-center text-xs sm:text-sm">29.9元<br className="hidden sm:block"/>月度会员</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {features.map((feature, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium text-xs sm:text-sm">{feature.name}</TableCell>
                        <TableCell className="text-center">
                          {feature.unlock ? (
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mx-auto" />
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mx-auto" />
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-gray-50">
                      <TableCell className="font-medium text-xs sm:text-sm">测评次数</TableCell>
                      <TableCell className="text-center font-medium text-xs sm:text-sm text-orange-600">仅1次</TableCell>
                      <TableCell className="text-center font-medium text-xs sm:text-sm text-green-600">不限制</TableCell>
                    </TableRow>
                    <TableRow className="bg-gray-50">
                      <TableCell className="font-medium text-xs sm:text-sm">会员期限</TableCell>
                      <TableCell className="text-center text-gray-500 text-xs sm:text-sm">-</TableCell>
                      <TableCell className="text-center font-medium text-xs sm:text-sm">1个月</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            onClick={onMembershipUpgrade}
            className="w-full font-semibold py-3 text-base mt-4"
            style={{ backgroundColor: '#CAF4F7', color: '#374151' }}
          >
            开通月度会员 ¥29.9
          </Button>
        </div>
      </div>

      {/* 选项2：9.9元快照解读 */}
      <div className="bg-white border-2 rounded-2xl p-6" style={{ borderColor: '#E5E7EB' }}>
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Badge className="border-0" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>
              概略版解读
            </Badge>
            <span className="text-3xl font-bold text-gray-800">¥9.9</span>
          </div>
          <h4 className="text-lg font-semibold text-gray-800">体验版快照解读</h4>
          <div className="rounded-lg p-4 text-left" style={{ backgroundColor: 'rgba(243, 244, 246, 0.5)' }}>
            <p className="text-sm font-medium mb-2 text-gray-600">
              💡 适合想要先体验的用户：
            </p>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• 获得基础分型分析和风险识别</li>
              <li>• 了解主要改善方向和建议要点</li>
              <li>• 体验专业解读服务的价值</li>
              <li>• 为后续升级会员提供参考</li>
            </ul>
          </div>
          <p className="text-sm text-gray-600">
            如果还没想好是否升级月度会员，可以先花9.9元体验一下概略版解读
          </p>
          <Button 
            onClick={onUnlock}
            className="w-full font-semibold py-3 text-base"
            style={{ backgroundColor: '#F9FAFB', color: '#6B7280', border: '1px solid #E5E7EB' }}
          >
            先体验概略版 ¥9.9
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOptions;
