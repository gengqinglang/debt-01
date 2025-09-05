
import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import AmountEditModal from '@/components/AmountEditModal';

interface BasicLifeConfigProps {
  initialSelectedLevel?: string;
  initialCustomAmounts?: {[key: string]: string};
  onConfigChange: (selectedLevel: string, amount: number, isCustom: boolean) => void;
}

const BasicLifeConfig: React.FC<BasicLifeConfigProps> = ({ 
  initialSelectedLevel = '',
  initialCustomAmounts = {},
  onConfigChange 
}) => {
  const [selectedLevel, setSelectedLevel] = useState(initialSelectedLevel);
  const [customAmounts, setCustomAmounts] = useState<{[key: string]: string}>(initialCustomAmounts);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<any>(null);

  const options = [
    { name: '荒野求生版', core: '泡面战神+拼夕夕常客+公交卡永动机', amount: '0.2', minAmount: 0.1, maxAmount: 0.5, emoji: '🏕️' },
    { name: '精打细算版', core: '菜场砍价王者/外卖用券大师/优衣库年度VIP', amount: '0.5', minAmount: 0.3, maxAmount: 0.8, emoji: '💰' },
    { name: '小康滋润版', core: '盒马自由+周末brunch+健身房年卡不心疼', amount: '1', minAmount: 0.8, maxAmount: 1.5, emoji: '☕' },
    { name: '品质生活家', core: '有机超市随便拿/私教课约满/新款手机说换就换', amount: '2', minAmount: 1.5, maxAmount: 3, emoji: '✨' },
    { name: '凡尔赛天花板', core: '米其林当食堂/爱马仕买菜包/"这季新品全包了"', amount: '5', minAmount: 4, maxAmount: 8, emoji: '👑' }
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
        选择基础生活标准：
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
                      {getDisplayAmount(option)}万/月
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

export default BasicLifeConfig;
