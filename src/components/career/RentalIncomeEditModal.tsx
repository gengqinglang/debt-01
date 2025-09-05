
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface RentalPeriod {
  id: string;
  startAge: string;
  endAge: string;
  monthlyRent: string;
  propertyValue: string;
}

interface RentalIncomeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (periods: RentalPeriod[]) => void;
  itemName: string;
  currentPeriods: RentalPeriod[];
}

const RentalIncomeEditModal: React.FC<RentalIncomeEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemName,
  currentPeriods
}) => {
  const [periods, setPeriods] = useState<RentalPeriod[]>(currentPeriods);

  // 房产市值选项
  const propertyValueOptions = [
    { value: '50', label: '50万' },
    { value: '80', label: '80万' },
    { value: '100', label: '100万' },
    { value: '150', label: '150万' },
    { value: '200', label: '200万' },
    { value: '250', label: '250万' },
    { value: '300', label: '300万' },
    { value: '400', label: '400万' },
    { value: '500', label: '500万' },
    { value: '600', label: '600万' },
    { value: '800', label: '800万' },
    { value: '1000', label: '1000万' },
  ];

  useEffect(() => {
    setPeriods(currentPeriods);
  }, [currentPeriods]);

  const addPeriod = () => {
    const newPeriod: RentalPeriod = {
      id: Date.now().toString(),
      startAge: '',
      endAge: '',
      monthlyRent: '',
      propertyValue: ''
    };
    setPeriods([...periods, newPeriod]);
  };

  const removePeriod = (id: string) => {
    setPeriods(periods.filter(p => p.id !== id));
  };

  const updatePeriod = (id: string, field: keyof RentalPeriod, value: string) => {
    setPeriods(periods.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleSave = () => {
    onSave(periods);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            编辑{itemName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {periods.map((period, index) => (
            <div key={period.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">
                  收入期间 {index + 1}
                </h4>
                {periods.length > 1 && (
                  <Button
                    onClick={() => removePeriod(period.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-600">开始年龄</Label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={period.startAge}
                    onChange={(e) => updatePeriod(period.id, 'startAge', e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">结束年龄</Label>
                  <Input
                    type="number"
                    placeholder="45"
                    value={period.endAge}
                    onChange={(e) => updatePeriod(period.id, 'endAge', e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-gray-600">月租金（元）</Label>
                <Input
                  type="number"
                  placeholder="8000"
                  value={period.monthlyRent}
                  onChange={(e) => updatePeriod(period.id, 'monthlyRent', e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              
              <div>
                <Label className="text-xs text-gray-600">房产市值（万元）</Label>
                <Select 
                  value={period.propertyValue} 
                  onValueChange={(value) => updatePeriod(period.id, 'propertyValue', value)}
                >
                  <SelectTrigger className="h-9 text-sm bg-white">
                    <SelectValue placeholder="请选择房产市值" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {propertyValueOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
          
          <Button
            onClick={addPeriod}
            variant="outline"
            className="w-full border-dashed border-[#CCE9B5] text-[#6B8E5A] hover:bg-[#CCE9B5]/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加收入期间
          </Button>
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            取消
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-[#CCE9B5] hover:bg-[#B8E6A1] text-gray-800"
          >
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RentalIncomeEditModal;
