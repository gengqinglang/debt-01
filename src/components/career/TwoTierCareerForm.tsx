
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface CareerStage {
  id: string;
  stageName: string;
  startYear: number;
  endYear: number;
  annualIncome: number; // in 万元
}

interface TwoTierCareerFormProps {
  currentStatus: 'not-retired' | 'retired';
  retirementIncome?: string;
  onCurrentStatusChange: (value: 'not-retired' | 'retired') => void;
  onRetirementIncomeChange?: (value: string) => void;
  placeholder: string;
  levelPlaceholder: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
  emptyStateHint: string;
  personType: 'personal' | 'partner';
  hasCareerPlan?: boolean;
  careerStages: CareerStage[];
  onCareerStagesChange: (stages: CareerStage[]) => void;
}

const TwoTierCareerForm: React.FC<TwoTierCareerFormProps> = ({
  currentStatus,
  retirementIncome,
  onCurrentStatusChange,
  onRetirementIncomeChange,
  placeholder,
  levelPlaceholder,
  emptyStateTitle,
  emptyStateDescription,
  emptyStateHint,
  personType,
  hasCareerPlan = false,
  careerStages,
  onCareerStagesChange
}) => {
  const isNotRetired = currentStatus === 'not-retired';
  const isRetired = currentStatus === 'retired';

  // Initialize with one empty stage if no stages exist
  React.useEffect(() => {
    if (isNotRetired && careerStages.length === 0) {
      const newStage: CareerStage = {
        id: '1',
        stageName: '',
        startYear: new Date().getFullYear(),
        endYear: new Date().getFullYear() + 5,
        annualIncome: 0
      };
      onCareerStagesChange([newStage]);
    }
  }, [isNotRetired, careerStages.length, onCareerStagesChange]);

  const addCareerStage = () => {
    if (careerStages.length >= 10) return;
    
    const lastStage = careerStages[careerStages.length - 1];
    const newStage: CareerStage = {
      id: Date.now().toString(),
      stageName: '',
      startYear: lastStage ? lastStage.endYear + 1 : new Date().getFullYear(),
      endYear: lastStage ? lastStage.endYear + 6 : new Date().getFullYear() + 5,
      annualIncome: 0
    };
    onCareerStagesChange([...careerStages, newStage]);
  };

  const removeCareerStage = (id: string) => {
    if (careerStages.length <= 1) return;
    onCareerStagesChange(careerStages.filter(stage => stage.id !== id));
  };

  const updateCareerStage = (id: string, field: keyof CareerStage, value: string | number) => {
    onCareerStagesChange(
      careerStages.map(stage =>
        stage.id === id ? { ...stage, [field]: value } : stage
      )
    );
  };

  // Generate year options (from 10 years ago to 30 years in the future)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 41 }, (_, i) => currentYear - 10 + i);


  return (
    <div className="space-y-4">
      {/* 第一层：当前工作状态选择 */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">
          {personType === 'personal' ? '本人' : '伴侣'}当前状态
        </Label>
        <RadioGroup 
          value={currentStatus} 
          onValueChange={(value: 'not-retired' | 'retired') => onCurrentStatusChange(value)}
          className="flex flex-row space-x-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="not-retired" id={`${personType}-not-retired`} />
            <Label htmlFor={`${personType}-not-retired`} className="text-sm cursor-pointer">未退休</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="retired" id={`${personType}-retired`} />
            <Label htmlFor={`${personType}-retired`} className="text-sm cursor-pointer">已退休</Label>
          </div>
        </RadioGroup>
      </div>

      {/* 未退休状态下显示职业规划录入 */}
      {isNotRetired && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-foreground">
              职业规划阶段
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCareerStage}
              disabled={careerStages.length >= 10}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加阶段
            </Button>
          </div>
          
          <div className="space-y-6">
            {careerStages.map((stage, index) => (
              <div key={stage.id} className="relative group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-flex items-center rounded-full bg-[#B3EBEF] px-2.5 py-1 text-xs text-gray-700">第 {index + 1} 阶段</div>
                    {careerStages.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeCareerStage(stage.id)} className="text-muted-foreground hover:text-foreground hover:bg-muted/30">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">阶段名称</Label>
                      <Input
                        placeholder="如：初级工程师、高级经理..."
                        value={stage.stageName}
                        onChange={(e) => updateCareerStage(stage.id, 'stageName', e.target.value)}
                        className="border-0 bg-muted/30 focus:bg-background focus:ring-2 focus:ring-ring transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">年收入（万元）</Label>
                      <Input
                        type="number"
                        placeholder="30"
                        value={stage.annualIncome || ''}
                        onChange={(e) => updateCareerStage(stage.id, 'annualIncome', Number(e.target.value))}
                        className="border-0 bg-muted/30 focus:bg-background focus:ring-2 focus:ring-ring transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">开始年份</Label>
                      <Select 
                        value={stage.startYear.toString()} 
                        onValueChange={(value) => updateCareerStage(stage.id, 'startYear', Number(value))}
                      >
                        <SelectTrigger className="border-0 bg-muted/30 focus:bg-background focus:ring-2 focus:ring-ring">
                          <SelectValue placeholder="选择年份" />
                        </SelectTrigger>
                        <SelectContent>
                          {yearOptions.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}年
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">结束年份</Label>
                      <Select 
                        value={stage.endYear.toString()} 
                        onValueChange={(value) => updateCareerStage(stage.id, 'endYear', Number(value))}
                      >
                        <SelectTrigger className="border-0 bg-muted/30 focus:bg-background focus:ring-2 focus:ring-ring">
                          <SelectValue placeholder="选择年份" />
                        </SelectTrigger>
                        <SelectContent>
                          {yearOptions.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}年
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 已退休状态下只显示退休收入 */}
      {isRetired && (
        <div className="space-y-2">
          <Label htmlFor="retirementIncome" className="text-sm font-medium text-foreground">
            退休收入
          </Label>
          <div className="relative">
            <Input
              id="retirementIncome"
              type="number"
              placeholder="请输入退休收入"
              value={retirementIncome || ''}
              onChange={(e) => onRetirementIncomeChange?.(e.target.value)}
              className="pr-16 focus:ring-ring"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-sm text-muted-foreground">元/月</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TwoTierCareerForm;
