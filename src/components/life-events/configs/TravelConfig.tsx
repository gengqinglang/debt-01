
import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import AmountEditModal from '@/components/AmountEditModal';

interface TravelConfigProps {
  initialSelectedLevel?: string;
  initialCustomAmounts?: {[key: string]: string};
  onConfigChange: (selectedLevel: string, amount: number, isCustom: boolean) => void;
}

const TravelConfig: React.FC<TravelConfigProps> = ({ 
  initialSelectedLevel = '',
  initialCustomAmounts = {},
  onConfigChange 
}) => {
  const [selectedLevel, setSelectedLevel] = useState(initialSelectedLevel);
  const [customAmounts, setCustomAmounts] = useState<{[key: string]: string}>(initialCustomAmounts);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<any>(null);

  const options = [
    { name: '丐帮流浪版', core: '逃票大师+睡沙发+便利店续命', amount: '0.5', minAmount: 0.2, maxAmount: 1, emoji: '🦶' },
    { name: '仓鼠囤货版', core: '365天抢特价+自带泡面+平替之王', amount: '1', minAmount: 0.8, maxAmount: 2, emoji: '🐹' },
    { name: '人间清醒版', core: '连锁酒店+网红店打卡+为"来都来了"咬牙', amount: '2', minAmount: 1.5, maxAmount: 3, emoji: '🛋️' },
    { name: '土豪撒钱版', core: '五星酒店+米其林+"全包起来"购物疗法', amount: '5', minAmount: 3, maxAmount: 8, emoji: '💸' },
    { name: '凡尔赛烦恼版', core: '包场景点+管家伺候+"这季新品还没送来？"', amount: '20', minAmount: 15, maxAmount: 30, emoji: '👑' }
  ];

  // 初始化时如果有选中档位，触发回调
  useEffect(() => {
    if (selectedLevel) {
      const option = options.find(opt => opt.name === selectedLevel);
      if (option) {
        const amount = parseFloat(customAmounts[option.name] || option.amount);
        onConfigChange(selectedLevel, amount, !!customAmounts[option.name]);
      }
    }
  }, []);

  const getDisplayAmount = (option: any) => {
    return customAmounts[option.name] || option.amount;
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
    const option = options.find(opt => opt.name === level);
    if (option) {
      const amount = parseFloat(customAmounts[option.name] || option.amount);
      onConfigChange(level, amount, !!customAmounts[option.name]);
    }
  };

  const openEditModal = (option: any) => {
    setEditingOption(option);
    setEditModalOpen(true);
  };

  const saveAmount = (newAmount: string) => {
    if (editingOption) {
      const updatedCustomAmounts = {
        ...customAmounts,
        [editingOption.name]: newAmount
      };
      setCustomAmounts(updatedCustomAmounts);
      
      if (selectedLevel === editingOption.name) {
        onConfigChange(selectedLevel, parseFloat(newAmount), true);
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700 mb-3">
        选择旅游消费标准：
      </div>
      
      <RadioGroup value={selectedLevel} onValueChange={handleLevelChange}>
        {options.map((option) => (
          <div key={option.name} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value={option.name} id={option.name} />
            <Label htmlFor={option.name} className="flex-1 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{option.emoji}</span>
                    <span className="font-medium text-gray-900">{option.name}</span>
                  </div>
                  <div className="text-xs text-gray-600 leading-relaxed">
                    {option.core}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">
                      {getDisplayAmount(option)}万/年
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-6 h-6 p-0 hover:bg-gray-100"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openEditModal(option);
                    }}
                  >
                    <Edit className="w-3 h-3 text-gray-600" />
                  </Button>
                </div>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <AmountEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={saveAmount}
        currentAmount={editingOption ? getDisplayAmount(editingOption) : ''}
        itemName={editingOption ? editingOption.name : ''}
        minAmount={editingOption ? editingOption.minAmount : 0}
        maxAmount={editingOption ? editingOption.maxAmount : 100}
        unit="万"
      />
    </div>
  );
};

export default TravelConfig;
