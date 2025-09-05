import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, CheckCircle, TrendingUp } from 'lucide-react';

interface AdjustmentResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: () => void;
}

export const AdjustmentResultModal: React.FC<AdjustmentResultModalProps> = ({
  isOpen,
  onClose,
  onViewDetails
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleViewDetails = () => {
    onViewDetails();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
        <div className="space-y-4 p-4">
          {/* 恭喜文案 */}
          <div className="flex justify-center mb-4">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-6 h-6 text-[#01BCD6] mt-1" />
              <div className="text-center">
                <p className="text-base text-gray-600">
                  恭喜您，您的决策对未来人生产生了
                </p>
                <div className="text-lg font-bold text-[#01BCD6]">
                  积极影响！
                </div>
              </div>
            </div>
          </div>

          {/* 三个影响项目 */}
          <div className="space-y-3">
            {/* 分型变化 */}
            <div className="border border-gray-200 rounded-lg">
              <div 
                className="p-3 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleSection('wealthType')}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">分型变好</span>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-xs text-gray-800 hover:text-gray-600 p-1 h-auto">
                        详情
                      </Button>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-[#01BCD6] bg-[#CAF4F7]/30 px-3 py-1 rounded-full">
                      中度支出压缩型 → 收支平衡型
                    </span>
                  </div>
                </div>
              </div>
              
              {expandedSection === 'wealthType' && (
                <div className="px-3 pb-3 border-t border-gray-100">
                  <div className="space-y-3 text-sm">
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">原分型：</span>
                        <span className="text-gray-800 font-medium">中度支出压缩型 (C2)</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        支出压力较大，需要适度压缩非必要支出来维持财务平衡
                      </div>
                    </div>
                    
                    <div className="bg-[#CAF4F7]/20 p-3 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">新分型：</span>
                        <span className="text-[#01BCD6] font-medium">收支平衡型 (B1)</span>
                      </div>
                      <div className="text-xs text-[#01BCD6]">
                        收支基本平衡，财务状况良好，有一定的财务缓冲空间
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 现金流缺口消失 */}
            <div className="border border-gray-200 rounded-lg">
              <div 
                className="p-3 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleSection('cashFlow')}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">现金流缺口消失</span>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-xs text-gray-800 hover:text-gray-600 p-1 h-auto">
                        详情
                      </Button>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-[#01BCD6] bg-[#CAF4F7]/30 px-3 py-1 rounded-full">
                      10个年份降低至0个年份
                    </span>
                  </div>
                </div>
              </div>
              
              {expandedSection === 'cashFlow' && (
                <div className="px-3 pb-3 border-t border-gray-100">
                  <div className="space-y-3 text-sm">
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">原缺口年份：</span>
                        <span className="text-red-600 font-medium">10个年份</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          <div className="flex justify-between">
                            <span>31岁:</span>
                            <span>-8.5万元</span>
                          </div>
                          <div className="flex justify-between">
                            <span>33岁:</span>
                            <span>-12.3万元</span>
                          </div>
                          <div className="flex justify-between">
                            <span>35岁:</span>
                            <span>-6.7万元</span>
                          </div>
                          <div className="flex justify-between">
                            <span>45岁:</span>
                            <span>-15.2万元</span>
                          </div>
                          <div className="flex justify-between">
                            <span>50岁:</span>
                            <span>-9.8万元</span>
                          </div>
                          <div className="flex justify-between">
                            <span>51岁:</span>
                            <span>-11.4万元</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#CAF4F7]/20 p-3 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">新缺口年份：</span>
                        <span className="text-[#01BCD6] font-medium">0个年份</span>
                      </div>
                      <div className="text-xs text-[#01BCD6]">
                        所有年份均实现正现金流，财务风险大幅降低
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 风险数量变少 */}
            <div className="border border-gray-200 rounded-lg">
              <div 
                className="p-3 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleSection('risks')}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">风险数量变少</span>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-xs text-gray-800 hover:text-gray-600 p-1 h-auto">
                        详情
                      </Button>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-[#01BCD6] bg-[#CAF4F7]/30 px-3 py-1 rounded-full">
                      8个 → 5个
                    </span>
                  </div>
                </div>
              </div>
              
              {expandedSection === 'risks' && (
                <div className="px-3 pb-3 border-t border-gray-100">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">原风险数量：</span>
                      <span className="text-red-600 font-medium">8个</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">新风险数量：</span>
                      <span className="text-[#01BCD6] font-medium">5个</span>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      {/* 原风险 vs 新风险对比 */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* 原风险列 */}
                        <div>
                          <div className="text-gray-600 mb-2 text-center font-medium">原风险</div>
                          <div className="text-xs bg-red-50 p-3 rounded space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                              <span className="text-red-700">重疾风险</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                              <span className="text-red-700">意外风险</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                              <span className="text-red-700">裁员降薪</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                              <span className="text-red-700">房产贬值风险</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                              <span className="text-red-700">投资收益下降风险</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                              <span className="text-red-700">通货膨胀风险</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                              <span className="text-red-700">长寿风险</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* 新风险列 */}
                        <div>
                          <div className="text-gray-600 mb-2 text-center font-medium">新风险</div>
                          <div className="text-xs bg-green-50 p-3 rounded space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                              <span className="text-orange-700">重疾风险</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                              <span className="text-orange-700">意外风险</span>
                            </div>
                            <div className="flex items-center space-x-2 opacity-30">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                              <span className="text-gray-500 line-through">裁员降薪</span>
                            </div>
                            <div className="flex items-center space-x-2 opacity-30">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                              <span className="text-gray-500 line-through">房产贬值风险</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                              <span className="text-orange-700">投资收益下降风险</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                              <span className="text-orange-700">通货膨胀风险</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                              <span className="text-orange-700">长寿风险</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <Button
              onClick={handleViewDetails}
              className="w-full bg-[#B3EBEF] hover:bg-[#9FE6EB] text-gray-800 font-medium border border-[#B3EBEF]/30"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              去查看新的洞见及建议
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdjustmentResultModal;