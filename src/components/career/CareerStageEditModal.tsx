import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CareerStage {
  id: string;
  stageName: string;
  position: string;
  description: string;
  ageRange: string;
  yearlyIncome: number;
  duration: string;
}

interface CareerStageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage: CareerStage;
  onSave: (updatedStage: CareerStage) => void;
}

const CareerStageEditModal: React.FC<CareerStageEditModalProps> = ({
  isOpen,
  onClose,
  stage,
  onSave
}) => {
  const [position, setPosition] = useState('');
  const [startAge, setStartAge] = useState('');
  const [endAge, setEndAge] = useState('');
  const [yearlyIncome, setYearlyIncome] = useState('');

  // 年龄选项（22-65岁）
  const ageOptions = Array.from({ length: 44 }, (_, i) => (22 + i).toString());
  useEffect(() => {
    if (stage) {
      setPosition(stage.position);
      // 解析年龄段，例如 "22-25岁" -> startAge: "22", endAge: "25"
      const ageMatch = stage.ageRange.match(/(\d+)-(\d+)/);
      if (ageMatch) {
        setStartAge(ageMatch[1]);
        setEndAge(ageMatch[2]);
      }
      setYearlyIncome(Math.round(stage.yearlyIncome / 10000).toString());
    }
  }, [stage]);

  const handleSave = () => {
    const incomeInWan = parseFloat(yearlyIncome);
    if (isNaN(incomeInWan) || incomeInWan <= 0) {
      return;
    }

    // 构建年龄段字符串
    const ageRange = `${startAge}-${endAge}岁`;

    const updatedStage: CareerStage = {
      ...stage,
      position,
      ageRange,
      yearlyIncome: incomeInWan * 10000
    };

    onSave(updatedStage);
  };

  const isValid = position.trim() !== '' && startAge !== '' && endAge !== '' &&
                  parseInt(endAge) > parseInt(startAge) &&
                  yearlyIncome !== '' && !isNaN(parseFloat(yearlyIncome)) && parseFloat(yearlyIncome) > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑职业阶段</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="position">岗位名称</Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="请输入岗位名称"
            />
          </div>

          <div className="space-y-2">
            <Label>时间段</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Select value={startAge} onValueChange={setStartAge}>
                  <SelectTrigger>
                    <SelectValue placeholder="开始年龄" />
                  </SelectTrigger>
                  <SelectContent>
                    {ageOptions.map((age) => (
                      <SelectItem key={age} value={age}>
                        {age}岁
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <span className="text-gray-500">至</span>
              <div className="flex-1">
                <Select value={endAge} onValueChange={setEndAge}>
                  <SelectTrigger>
                    <SelectValue placeholder="结束年龄" />
                  </SelectTrigger>
                  <SelectContent>
                    {ageOptions.map((age) => (
                      <SelectItem key={age} value={age}>
                        {age}岁
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="income">年收入（万）</Label>
            <Input
              id="income"
              type="number"
              value={yearlyIncome}
              onChange={(e) => setYearlyIncome(e.target.value)}
              placeholder="请输入年收入"
              min="0"
              step="0.1"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!isValid}
            className="bg-[#CCE9B5] hover:bg-[#B3EBEF] text-gray-800"
          >
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CareerStageEditModal;