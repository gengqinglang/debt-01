

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Code, Target, BarChart3, Megaphone, Calculator, UserCheck, Palette, ShoppingCart, Stethoscope, Building, GraduationCap, Scale, Wrench, Briefcase, Users, Camera } from 'lucide-react';

interface SimpleCareerPlanFormProps {
  job: string;
  level: string;
  workStatus: 'working' | 'not-working-future' | 'retired';
  currentIncome: string;
  careerOutlook: string;
  startWorkAge?: string;
  retirementIncome?: string;
  onJobChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onWorkStatusChange: (value: 'working' | 'not-working-future' | 'retired') => void;
  onCurrentIncomeChange: (value: string) => void;
  onCareerOutlookChange: (value: string) => void;
  onStartWorkAgeChange?: (value: string) => void;
  onRetirementIncomeChange?: (value: string) => void;
  placeholder: string;
  levelPlaceholder: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
  emptyStateHint: string;
  personType: 'personal' | 'partner';
  hasCareerPlan?: boolean;
}

const SimpleCareerPlanForm: React.FC<SimpleCareerPlanFormProps> = ({
  job,
  level,
  workStatus,
  currentIncome,
  careerOutlook,
  startWorkAge,
  retirementIncome,
  onJobChange,
  onLevelChange,
  onWorkStatusChange,
  onCurrentIncomeChange,
  onCareerOutlookChange,
  onStartWorkAgeChange,
  onRetirementIncomeChange,
  placeholder,
  levelPlaceholder,
  emptyStateTitle,
  emptyStateDescription,
  emptyStateHint,
  personType,
  hasCareerPlan = false
}) => {
  const isWorking = workStatus === 'working';
  const isNotWorkingFuture = workStatus === 'not-working-future';
  const isRetired = workStatus === 'retired';

  // 根据职业获取对应的职级选项
  const getLevelOptions = (selectedJob: string) => {
    const levelMap: Record<string, string[]> = {
      // 医疗行业
      '医生': ['住院医师', '主治医师', '副主任医师', '主任医师'],
      '护士': ['护士', '护师', '主管护师', '副主任护师'],
      
      // 科技行业
      '软件工程师': ['初级工程师', '中级工程师', '高级工程师', '资深工程师'],
      '产品经理': ['助理产品经理', '产品经理', '高级产品经理', '产品总监'],
      '数据分析师': ['初级分析师', '数据分析师', '高级分析师', '首席分析师'],
      
      // 公务员和事业单位
      '公务员': ['科员', '副主任科员', '主任科员', '副处级'],
      '教师': ['助教', '讲师', '副教授', '教授'],
      
      // 法律行业
      '律师': ['实习律师', '执业律师', '合伙人律师', '首席合伙人'],
      
      // 工程技术
      '工程师': ['助理工程师', '工程师', '高级工程师', '教授级高工'],
      
      // 金融服务
      '财务分析师': ['初级分析师', '财务分析师', '高级分析师', '财务总监'],
      '银行职员': ['柜员', '客户经理', '部门经理', '分行行长'],
      
      // 营销传媒
      '市场营销': ['营销专员', '营销主管', '营销经理', '营销总监'],
      '媒体编辑': ['编辑助理', '编辑', '主编', '总编辑'],
      
      // 人力资源
      '人力资源': ['HR专员', 'HR主管', 'HR经理', 'HR总监'],
      
      // 创意设计
      '设计师': ['初级设计师', '设计师', '高级设计师', '设计总监'],
      
      // 销售服务
      '销售': ['销售代表', '销售主管', '销售经理', '销售总监'],
      
      // 咨询服务
      '咨询师': ['初级咨询师', '咨询师', '高级咨询师', '合伙人']
    };
    
    return levelMap[selectedJob] || ['初级', '中级', '高级', '资深'];
  };

  const levelOptions = getLevelOptions(job);

  return (
    <div className="space-y-4">
      {/* 工作状态选择 - 压缩文案并放在一行 */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          {personType === 'personal' ? '本人' : '伴侣'}当前状态
        </Label>
        <RadioGroup 
          value={workStatus} 
          onValueChange={(value: 'working' | 'not-working-future' | 'retired') => onWorkStatusChange(value)}
          className="flex flex-row space-x-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="working" id={`${personType}-working`} />
            <Label htmlFor={`${personType}-working`} className="text-sm cursor-pointer">在工作</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="not-working-future" id={`${personType}-not-working-future`} />
            <Label htmlFor={`${personType}-not-working-future`} className="text-sm cursor-pointer">暂无工作</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="retired" id={`${personType}-retired`} />
            <Label htmlFor={`${personType}-retired`} className="text-sm cursor-pointer">已退休</Label>
          </div>
        </RadioGroup>
      </div>

      {/* 已退休状态下只显示退休收入 */}
      {isRetired && (
        <div className="space-y-2">
          <Label htmlFor="retirementIncome" className="text-sm font-medium text-gray-700">
            退休收入
          </Label>
          <div className="relative">
            <Input
              id="retirementIncome"
              type="number"
              placeholder="请输入退休收入"
              value={retirementIncome || ''}
              onChange={(e) => onRetirementIncomeChange?.(e.target.value)}
              className="pr-16 border-[#CCE9B5] focus:ring-[#CCE9B5]"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-sm text-gray-500">元/月</span>
            </div>
          </div>
        </div>
      )}

      {/* 当前没有工作但未来会工作的状态下显示开始工作年龄 */}
      {isNotWorkingFuture && (
        <div className="space-y-2">
          <Label htmlFor="startWorkAge" className="text-sm font-medium text-gray-700">
            计划开始工作的年龄
          </Label>
          <div className="relative">
            <Input
              id="startWorkAge"
              type="number"
              placeholder="请输入计划开始工作的年龄"
              value={startWorkAge || ''}
              onChange={(e) => onStartWorkAgeChange?.(e.target.value)}
              className="pr-8 border-[#CCE9B5] focus:ring-[#CCE9B5]"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-sm text-gray-500">岁</span>
            </div>
          </div>
        </div>
      )}

      {/* 职业和职级选择（仅在选择工作或未来工作时可用） */}
      {(isWorking || isNotWorkingFuture) && (
        <>
          <div className="space-y-2">
            <Label htmlFor="job" className="text-sm font-medium text-gray-700">
              {isWorking ? '当前职业' : '未来职业'}
            </Label>
            <Select onValueChange={onJobChange} value={job}>
              <SelectTrigger className="border-[#CCE9B5] focus:ring-[#CCE9B5]">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {/* 科技行业 */}
                <SelectItem value="软件工程师">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    软件工程师 (科技行业)
                  </div>
                </SelectItem>
                <SelectItem value="产品经理">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    产品经理 (科技行业)
                  </div>
                </SelectItem>
                <SelectItem value="数据分析师">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    数据分析师 (科技行业)
                  </div>
                </SelectItem>
                
                {/* 医疗行业 */}
                <SelectItem value="医生">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    医生 (医疗行业)
                  </div>
                </SelectItem>
                <SelectItem value="护士">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    护士 (医疗行业)
                  </div>
                </SelectItem>
                
                {/* 公务员和事业单位 */}
                <SelectItem value="公务员">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    公务员 (政府机关)
                  </div>
                </SelectItem>
                <SelectItem value="教师">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    教师 (教育行业)
                  </div>
                </SelectItem>
                
                {/* 法律行业 */}
                <SelectItem value="律师">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    律师 (法律服务)
                  </div>
                </SelectItem>
                
                {/* 工程技术 */}
                <SelectItem value="工程师">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    工程师 (工程技术)
                  </div>
                </SelectItem>
                
                {/* 金融服务 */}
                <SelectItem value="财务分析师">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    财务分析师 (金融服务)
                  </div>
                </SelectItem>
                <SelectItem value="银行职员">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    银行职员 (金融服务)
                  </div>
                </SelectItem>
                
                {/* 营销传媒 */}
                <SelectItem value="市场营销">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4" />
                    市场营销专员 (营销传媒)
                  </div>
                </SelectItem>
                <SelectItem value="媒体编辑">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    媒体编辑 (营销传媒)
                  </div>
                </SelectItem>
                
                {/* 人力资源 */}
                <SelectItem value="人力资源">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    人力资源专员 (人力资源)
                  </div>
                </SelectItem>
                
                {/* 创意设计 */}
                <SelectItem value="设计师">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    设计师 (创意设计)
                  </div>
                </SelectItem>
                
                {/* 销售服务 */}
                <SelectItem value="销售">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    销售代表 (销售服务)
                  </div>
                </SelectItem>
                
                {/* 咨询服务 */}
                <SelectItem value="咨询师">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    咨询师 (咨询服务)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level" className="text-sm font-medium text-gray-700">
              {isWorking ? '当前职级' : '预期职级'}
            </Label>
            <Select onValueChange={onLevelChange} value={level}>
              <SelectTrigger className="border-[#CCE9B5] focus:ring-[#CCE9B5]">
                <SelectValue placeholder={levelPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {levelOptions.map((levelOption) => (
                  <SelectItem key={levelOption} value={levelOption}>
                    {levelOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 当前年收入输入 */}
          <div className="space-y-2">
            <Label htmlFor="currentIncome" className="text-sm font-medium text-gray-700">
              {isWorking ? '当前年收入' : '预期年收入'}
            </Label>
            <div className="relative">
              <Input
                id="currentIncome"
                type="number"
                placeholder={isWorking ? "请输入当前年收入" : "请输入预期年收入"}
                value={currentIncome}
                onChange={(e) => onCurrentIncomeChange(e.target.value)}
                className="pr-16 border-[#CCE9B5] focus:ring-[#CCE9B5]"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-sm text-gray-500">万元/年</span>
              </div>
            </div>
          </div>

          {/* 未来职业发展水平选择 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              您认为自己未来职业发展水平
            </Label>
            <RadioGroup 
              value={careerOutlook || '正常发展'} 
              onValueChange={onCareerOutlookChange}
              className="flex flex-row space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="正常发展" id={`${personType}-normal-development`} />
                <Label htmlFor={`${personType}-normal-development`} className="text-sm cursor-pointer text-gray-700">
                  正常发展
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="发展停滞" id={`${personType}-stagnant-development`} />
                <Label htmlFor={`${personType}-stagnant-development`} className="text-sm cursor-pointer text-gray-700">
                  发展停滞
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="走下坡路" id={`${personType}-declining-development`} />
                <Label htmlFor={`${personType}-declining-development`} className="text-sm cursor-pointer text-gray-700">
                  走下坡路
                </Label>
              </div>
            </RadioGroup>
          </div>
        </>
      )}
    </div>
  );
};

export default SimpleCareerPlanForm;

