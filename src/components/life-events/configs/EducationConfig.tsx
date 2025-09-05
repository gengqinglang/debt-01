
import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import AmountEditModal from '@/components/AmountEditModal';

interface EducationConfigProps {
  initialSelectedLevel?: string;
  initialCustomAmounts?: {[key: string]: string};
  onConfigChange: (selectedLevel: string, amount: number, isCustom: boolean, educationStage: string) => void;
}

const EducationConfig: React.FC<EducationConfigProps> = ({ 
  initialSelectedLevel = '',
  initialCustomAmounts = {},
  onConfigChange 
}) => {
  const [selectedLevel, setSelectedLevel] = useState(initialSelectedLevel);
  const [educationStage, setEducationStage] = useState('大学');
  const [customAmounts, setCustomAmounts] = useState<{[key: string]: string}>(initialCustomAmounts);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<any>(null);

  const options = [
    { name: '基础保障型', core: '公立学费、基础教辅书、校服', amount: '0.5', minAmount: 0.3, maxAmount: 1, emoji: '📚' },
    { name: '普惠提升型', core: '平价兴趣班（绘画/篮球）、线上课程、中档教辅', amount: '2', minAmount: 1.5, maxAmount: 3, emoji: '🎨' },
    { name: '学科投资型', core: '重点学科补习（数英物）、竞赛培训、私立中学学费', amount: '10', minAmount: 8, maxAmount: 15, emoji: '🧮' },
    { name: '全面发展型', core: '国际学校/双语学校、海外夏校、马术/编程等高端兴趣、留学顾问', amount: '20', minAmount: 15, maxAmount: 30, emoji: '🌍' },
    { name: '资源冗余型', core: '顶级私校、1对1名师、海外升学全包、科研项目"镀金"', amount: '50', minAmount: 40, maxAmount: 80, emoji: '👑' }
  ];

  // 初始化时如果有选中档位，触发回调
  useEffect(() => {
    if (selectedLevel) {
      updateConfig(selectedLevel, educationStage);
    }
  }, []);

  const getDisplayAmount = (option: any) => {
    return customAmounts[option.name] || option.amount;
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
    updateConfig(level, educationStage);
  };

  const handleEducationStageChange = (stage: string) => {
    setEducationStage(stage);
    updateConfig(selectedLevel, stage);
  };

  const updateConfig = (level: string, stage: string) => {
    if (level) {
      const option = options.find(opt => opt.name === level);
      if (option) {
        const amount = parseFloat(customAmounts[option.name] || option.amount);
        onConfigChange(level, amount, !!customAmounts[option.name], stage);
      }
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
        onConfigChange(selectedLevel, parseFloat(newAmount), true, educationStage);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-700 mb-2">
          计划培养孩子到什么阶段：
        </div>
        <RadioGroup value={educationStage} onValueChange={handleEducationStageChange} className="flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="大学" id="university" />
            <Label htmlFor="university" className="text-sm">大学</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="研究生" id="graduate" />
            <Label htmlFor="graduate" className="text-sm">研究生</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="博士" id="phd" />
            <Label htmlFor="phd" className="text-sm">博士</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="text-sm font-medium text-gray-700 mb-3">
        选择教育投入标准：
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

export default EducationConfig;
