
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExpenditureData } from './ExpenditureComparisonChart';

interface ExpenditureDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ExpenditureData | null;
  title: string;
  unit: string;
}

export const ExpenditureDetailModal: React.FC<ExpenditureDetailModalProps> = ({
  isOpen,
  onClose,
  data,
  title,
  unit
}) => {
  if (!data) return null;

  const reductionAmount = data.originalAmount - data.adjustedAmount;
  const reductionPercentage = ((reductionAmount / data.originalAmount) * 100).toFixed(1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            {title} - {data.age}岁详情
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-xs text-blue-600 mb-1">原标准</div>
              <div className="text-lg font-semibold text-blue-800">
                {data.originalAmount.toLocaleString()}{unit}
              </div>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-xs text-green-600 mb-1">新标准</div>
              <div className="text-lg font-semibold text-green-800">
                {data.adjustedAmount.toLocaleString()}{unit}
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="text-xs text-orange-600 mb-1">调整幅度</div>
            <div className="text-sm font-medium text-orange-800">
              减少 {reductionAmount.toLocaleString()}{unit} ({reductionPercentage}%)
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">当年家庭人口：</span>
              <span className="font-medium text-gray-800">{data.familyMembers}人</span>
            </div>
            <div>
              <span className="text-gray-600">全家合计支出：</span>
              <span className="font-medium text-gray-800">
                {data.totalFamilyExpenditure.toLocaleString()}元
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
