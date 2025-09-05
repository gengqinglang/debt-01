import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

export interface RentStage {
  id: string;
  startAge: number;
  endAge: number;
  monthlyRent: number;
}

interface RentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentStages: RentStage[];
  onSave: (stages: RentStage[]) => void;
}

const RentEditModal: React.FC<RentEditModalProps> = ({
  isOpen,
  onClose,
  rentStages,
  onSave
}) => {
  const [stages, setStages] = useState<RentStage[]>(rentStages);

  useEffect(() => {
    setStages(rentStages);
  }, [rentStages]);

  const handleAddStage = () => {
    const newStage: RentStage = {
      id: Date.now().toString(),
      startAge: stages.length > 0 ? Math.max(...stages.map(s => s.endAge)) + 1 : 25,
      endAge: stages.length > 0 ? Math.max(...stages.map(s => s.endAge)) + 5 : 30,
      monthlyRent: 3000
    };
    setStages([...stages, newStage]);
  };

  const handleRemoveStage = (stageId: string) => {
    setStages(stages.filter(stage => stage.id !== stageId));
  };

  const handleStageChange = (stageId: string, field: keyof RentStage, value: string) => {
    setStages(stages.map(stage => 
      stage.id === stageId 
        ? { ...stage, [field]: field === 'id' ? value : Number(value) }
        : stage
    ));
  };

  const handleSave = () => {
    // 按开始年龄排序
    const sortedStages = [...stages].sort((a, b) => a.startAge - b.startAge);
    onSave(sortedStages);
    onClose();
  };

  const calculateTotalYears = (stage: RentStage) => {
    return stage.endAge - stage.startAge;
  };

  const calculateTotalCost = (stage: RentStage) => {
    const years = calculateTotalYears(stage);
    return stage.monthlyRent * 12 * years;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto w-[90vw] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>编辑租房支出</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">租房阶段配置</h3>
            <Button onClick={handleAddStage} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              添加阶段
            </Button>
          </div>

          {stages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>暂无租房阶段</p>
              <Button onClick={handleAddStage} className="mt-2">
                添加第一个租房阶段
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {stages.map((stage, index) => (
                <div key={stage.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm">阶段 {index + 1}</h4>
                    {stages.length > 1 && (
                      <Button
                        onClick={() => handleRemoveStage(stage.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`startAge-${stage.id}`} className="text-xs">
                        开始年龄
                      </Label>
                      <Input
                        id={`startAge-${stage.id}`}
                        type="number"
                        value={stage.startAge}
                        onChange={(e) => handleStageChange(stage.id, 'startAge', e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`endAge-${stage.id}`} className="text-xs">
                        结束年龄
                      </Label>
                      <Input
                        id={`endAge-${stage.id}`}
                        type="number"
                        value={stage.endAge}
                        onChange={(e) => handleStageChange(stage.id, 'endAge', e.target.value)}
                        className="h-8"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`monthlyRent-${stage.id}`} className="text-xs">
                      月租金（元）
                    </Label>
                    <Input
                      id={`monthlyRent-${stage.id}`}
                      type="number"
                      value={stage.monthlyRent}
                      onChange={(e) => handleStageChange(stage.id, 'monthlyRent', e.target.value)}
                      className="h-8"
                    />
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>租房时长：{calculateTotalYears(stage)}年</div>
                    <div>总租金：¥{(calculateTotalCost(stage) / 10000).toFixed(1)}万</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">取消</Button>
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RentEditModal;