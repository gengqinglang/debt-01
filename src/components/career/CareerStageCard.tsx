
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Coins, Edit3, X } from 'lucide-react';

interface CareerStage {
  id: string;
  stageName: string;
  position: string;
  description: string;
  ageRange: string;
  yearlyIncome: number;
  duration: string;
}

interface CareerStageCardProps {
  stage: CareerStage;
  index: number;
  currentJobIcon: React.ReactNode;
  isEditing: boolean;
  editValues: { position: string; yearlyIncome: string };
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditChange: (field: 'position' | 'yearlyIncome', value: string) => void;
  formatToWan: (amount: number) => string;
}

const CareerStageCard: React.FC<CareerStageCardProps> = ({
  stage,
  index,
  currentJobIcon,
  isEditing,
  editValues,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditChange,
  formatToWan
}) => {
  return (
    <Card className="border-gray-200 hover:border-[#CCE9B5] transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            {currentJobIcon}
            {stage.position}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 bg-[#FFEA96] px-2 py-1 rounded">
              {stage.duration}
            </span>
            {!isEditing && (
              <button
                onClick={onStartEdit}
                className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        {isEditing && (
          <div className="space-y-3 mt-2">
            <div className="space-y-1">
              <Label htmlFor="edit-position" className="text-xs text-gray-600">职位名称</Label>
              <Input
                id="edit-position"
                value={editValues.position}
                onChange={(e) => onEditChange('position', e.target.value)}
                placeholder="请输入职位名称"
                className="text-sm h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-income" className="text-xs text-gray-600">年收入（万元）</Label>
              <Input
                id="edit-income"
                value={editValues.yearlyIncome}
                onChange={(e) => onEditChange('yearlyIncome', e.target.value)}
                placeholder="请输入年收入"
                className="text-sm h-9"
                type="number"
                step="0.1"
              />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Button
                onClick={onSaveEdit}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white h-8 px-3"
              >
                保存
              </Button>
              <Button
                onClick={onCancelEdit}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-600 hover:bg-gray-50 h-8 px-3"
              >
                <X className="w-3 h-3 mr-1" />
                取消
              </Button>
            </div>
          </div>
        )}
      </CardHeader>
      {!isEditing && (
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{stage.ageRange}</span>
            </div>
            <div className="flex items-center text-gray-700 font-medium">
              <Coins className="w-3 h-3 mr-1" />
              <span>{formatToWan(stage.yearlyIncome)}万/年</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default CareerStageCard;
