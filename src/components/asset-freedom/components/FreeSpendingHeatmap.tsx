import React, { useState, useMemo } from 'react';
import { HelpCircle, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useMembership } from '@/components/membership/MembershipProvider';

interface DisposableWealthData {
  age: number;
  year: string;
  amount: number;
}

interface BeneficiaryPlan {
  name: string;
  amount: number;
}

interface SupportPlan {
  age: number;
  year: string;
  maxAmount: number;
  beneficiaries: BeneficiaryPlan[]; // 改为支持多个被资助人
  supportType: 'current' | 'cumulative'; // 资助方式：当年金额 or 累计金额
}

interface FreeSpendingHeatmapProps {
  onInteractionAttempt?: () => void;
  onCreatePlan?: () => void;
  onSupportPlansChange?: (plans: SupportPlan[]) => void;
}

const FreeSpendingHeatmap: React.FC<FreeSpendingHeatmapProps> = ({ onInteractionAttempt, onCreatePlan, onSupportPlansChange }) => {
  const { isMember } = useMembership();
  const [selectedCell, setSelectedCell] = useState<DisposableWealthData | null>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [showCreatePlanHint, setShowCreatePlanHint] = useState(false);
  const [supportPlans, setSupportPlans] = useState<SupportPlan[]>([]);
  const [showNoMoneyDialog, setShowNoMoneyDialog] = useState(false);
  const [noMoneyAge, setNoMoneyAge] = useState<number | null>(null);
  const [cumulativeTooltipOpen, setCumulativeTooltipOpen] = useState<{ [key: number]: boolean }>({});

  // 被资助人选项及出生年份
  const beneficiaryOptions = [
    { name: '老大', birthYear: 2020 },
    { name: '老二', birthYear: 2022 },
    { name: '老三', birthYear: 2024 }
  ];

  // 可自由支配金额数据
  const disposableWealthData = useMemo(() => {
    const data: DisposableWealthData[] = [];
    
    for (let age = 30; age <= 85; age++) {
      // 模拟可自由支配金额的增长模式
      let amount = 0;
      
      if (age >= 35 && age <= 65) {
        // 35-65岁期间有可自由支配金额，呈现先增后减的模式
        const peak = 50; // 50岁达到峰值
        const maxAmount = 15; // 最大15万
        
        if (age <= peak) {
          amount = Math.round((age - 35) / (peak - 35) * maxAmount);
        } else {
          // 45-65岁存钱需求逐渐减少
          amount = Math.round(maxAmount - (age - peak) / (65 - peak) * maxAmount);
        }
        
        // 使用固定的伪随机变化，基于年龄生成固定值
        const pseudoRandom = (age * 17 + 23) % 7 - 3; // 生成-3到3的固定值
        amount = Math.max(0, amount + pseudoRandom);
      }
      
      data.push({
        age,
        year: `${2024 - 30 + age}`,
        amount
      });
    }
    
    return data;
  }, []);

  const maxDisposableAmount = Math.max(...disposableWealthData.map(d => d.amount));
  const yearsWithDisposableWealth = disposableWealthData.filter(d => d.amount > 0).length;

  // 根据金额计算颜色深度
  const getDisposableColorIntensity = (amount: number) => {
    if (amount === 0) return 'bg-white border-gray-200';
    
    const intensity = amount / maxDisposableAmount;
    if (intensity <= 0.2) return 'bg-[#CAF4F7]/20 border-[#CAF4F7]/30';
    if (intensity <= 0.4) return 'bg-[#CAF4F7]/40 border-[#CAF4F7]/50';
    if (intensity <= 0.6) return 'bg-[#CAF4F7]/60 border-[#CAF4F7]/70';
    if (intensity <= 0.8) return 'bg-[#CAF4F7]/80 border-[#CAF4F7]/90';
    return 'bg-[#4A90A4] border-[#4A90A4]';
  };

  // 按行排列数据（每行14年）
  const disposableRows: DisposableWealthData[][] = [];
  for (let i = 0; i < disposableWealthData.length; i += 14) {
    disposableRows.push(disposableWealthData.slice(i, i + 14));
  }

  // 处理创建计划按钮点击
  const handleCreatePlanClick = () => {
    setShowCreatePlanHint(true);
    onCreatePlan?.();
  };

  // 处理点击事件
  const handleDisposableCellClick = (data: DisposableWealthData) => {
    if (!isMember) {
      onInteractionAttempt?.();
      return;
    }
    
    // 如果显示创建计划提示，点击格子创建资助计划
    if (showCreatePlanHint) {
      if (data.amount === 0) {
        // 当年无资助能力，显示提示弹窗
        setNoMoneyAge(data.age);
        setShowNoMoneyDialog(true);
        return;
      }
      
      const existingPlan = supportPlans.find(plan => plan.age === data.age);
      if (!existingPlan) {
        const newPlan: SupportPlan = {
          age: data.age,
          year: data.year,
          maxAmount: data.amount,
          beneficiaries: [{ name: beneficiaryOptions[0].name, amount: data.amount }], // 默认添加第一个被资助人
          supportType: 'current' // 默认为当年金额
        };
        const updatedPlans = [...supportPlans, newPlan];
        setSupportPlans(updatedPlans);
        onSupportPlansChange?.(updatedPlans);
      }
      return;
    }
    
    setSelectedCell(selectedCell?.age === data.age ? null : data);
  };

  // 添加被资助人到某个计划
  const handleAddBeneficiary = (age: number) => {
    const updatedPlans = supportPlans.map(plan => {
      if (plan.age === age) {
        // 找到还没有添加的被资助人
        const existingNames = plan.beneficiaries.map(b => b.name);
        const availableOption = beneficiaryOptions.find(option => !existingNames.includes(option.name));
        if (availableOption) {
          const remainingAmount = plan.maxAmount - getTotalAmount(plan.beneficiaries);
          return {
            ...plan,
            beneficiaries: [...plan.beneficiaries, { name: availableOption.name, amount: Math.min(remainingAmount, 1) }]
          };
        }
      }
      return plan;
    });
    setSupportPlans(updatedPlans);
    onSupportPlansChange?.(updatedPlans);
  };

  // 移除某个被资助人
  const handleRemoveBeneficiary = (age: number, beneficiaryName: string) => {
    const updatedPlans = supportPlans.map(plan => {
      if (plan.age === age) {
        return {
          ...plan,
          beneficiaries: plan.beneficiaries.filter(b => b.name !== beneficiaryName)
        };
      }
      return plan;
    });
    setSupportPlans(updatedPlans);
    onSupportPlansChange?.(updatedPlans);
  };

  // 更新被资助人的金额
  const handleBeneficiaryAmountChange = (age: number, beneficiaryName: string, value: string) => {
    const newAmount = value === '' ? 0 : Number(value);
    const updatedPlans = supportPlans.map(plan => {
      if (plan.age === age) {
        const updatedBeneficiaries = plan.beneficiaries.map(b => {
          if (b.name === beneficiaryName) {
            // 计算其他被资助人的总金额
            const otherAmount = plan.beneficiaries
              .filter(other => other.name !== beneficiaryName)
              .reduce((sum, other) => sum + other.amount, 0);
            // 根据资助方式确定最大允许金额
            const maxTotal = plan.supportType === 'current' ? plan.maxAmount : getCumulativeAmount(plan.age);
            const maxAllowed = maxTotal - otherAmount;
            return { ...b, amount: Math.min(newAmount, maxAllowed) };
          }
          return b;
        });
        return { ...plan, beneficiaries: updatedBeneficiaries };
      }
      return plan;
    });
    setSupportPlans(updatedPlans);
    onSupportPlansChange?.(updatedPlans);
  };

  // 计算被资助人总金额
  const getTotalAmount = (beneficiaries: BeneficiaryPlan[]) => {
    return beneficiaries.reduce((sum, b) => sum + b.amount, 0);
  };

  // 删除资助计划
  const handleDeletePlan = (age: number) => {
    const updatedPlans = supportPlans.filter(plan => plan.age !== age);
    setSupportPlans(updatedPlans);
    onSupportPlansChange?.(updatedPlans);
  };

  // 计算累计可资助金额（从今年到指定年份）
  const getCumulativeAmount = (targetAge: number) => {
    const currentYear = 2024;
    const currentAge = 30; // 假设当前30岁
    const targetYear = currentYear + (targetAge - currentAge);
    
    let cumulativeAmount = 0;
    for (let age = currentAge; age <= targetAge; age++) {
      const yearData = disposableWealthData.find(d => d.age === age);
      if (yearData) {
        cumulativeAmount += yearData.amount;
      }
    }
    return cumulativeAmount;
  };

  // 更新资助方式
  const handleSupportTypeChange = (age: number, supportType: 'current' | 'cumulative') => {
    const updatedPlans = supportPlans.map(plan => {
      if (plan.age === age) {
        return { ...plan, supportType };
      }
      return plan;
    });
    setSupportPlans(updatedPlans);
    onSupportPlansChange?.(updatedPlans);
  };

  // 处理累计金额tooltip点击
  const handleCumulativeTooltipClick = (age: number) => {
    setCumulativeTooltipOpen(prev => ({
      ...prev,
      [age]: !prev[age]
    }));
  };

  // 计算被资助人在资助年份的年龄
  const getBeneficiaryAge = (beneficiaryName: string, supportYear: string) => {
    const beneficiary = beneficiaryOptions.find(option => option.name === beneficiaryName);
    if (!beneficiary) return 0;
    return Number(supportYear) - beneficiary.birthYear;
  };

  // Tooltip 处理函数
  const handleTooltipClick = () => {
    setIsTooltipOpen(!isTooltipOpen);
  };

  // 渲染带年龄标签的格子
  const renderCellWithAgeLabel = (data: DisposableWealthData, colorIntensity: string, selectedCell: DisposableWealthData | null, handleClick: (data: DisposableWealthData) => void, isFirst: boolean = false, isLast: boolean = false) => {
    const isSelected = selectedCell?.age === data.age;
    
    return (
      <div
        key={data.age}
        className={`
          w-6 h-6 border cursor-pointer transition-all duration-200 hover:scale-110 relative flex items-center justify-center
          ${colorIntensity}
          ${isSelected ? 'ring-2 ring-blue-500' : ''}
        `}
        onClick={() => handleClick(data)}
        title={`${data.age}岁: ${data.amount}万元`}
      >
        {isFirst && (
          <span className="text-xs text-gray-800 font-bold z-10">
            30
          </span>
        )}
        {isLast && (
          <span className="text-xs text-gray-800 font-bold z-10">
            85
          </span>
        )}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h5 className="text-sm font-medium text-gray-700">可以随便花的钱</h5>
            <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
              <TooltipTrigger asChild>
                <button 
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 active:bg-gray-200"
                  onClick={handleTooltipClick}
                  onTouchStart={handleTooltipClick}
                  type="button"
                >
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent 
                className="max-w-[280px] sm:max-w-xs p-3 bg-white border-2 border-[#B3EBEF] text-gray-800 text-sm rounded-lg shadow-xl z-[9999]"
                side="top"
                align="center"
              >
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">什么是"可以随便花的钱"？</p>
                  <p className="text-gray-700 leading-relaxed">
                    指的是扣除当年支出和为未来储蓄后，可以用于消费、资助、传承或投资等用途的可自由支配资金。
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="text-sm font-medium text-[#4A90A4] bg-[#CAF4F7]/20 px-2 py-1 rounded-full">
            共{yearsWithDisposableWealth}年
          </span>
        </div>
        
        <div className="space-y-1 mb-4">
          {disposableRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex space-x-1">
              {row.map((data, cellIndex) => {
                const isFirst = rowIndex === 0 && cellIndex === 0;
                const isLast = rowIndex === disposableRows.length - 1 && cellIndex === row.length - 1;
                return renderCellWithAgeLabel(
                  data, 
                  getDisposableColorIntensity(data.amount), 
                  selectedCell, 
                  handleDisposableCellClick,
                  isFirst,
                  isLast
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-xs text-gray-600 mb-4">
          <span>金额:</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-white border border-gray-200"></div>
            <span>0万</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-[#CAF4F7]/40"></div>
            <span>较少</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-[#4A90A4]"></div>
            <span>较多</span>
          </div>
        </div>

        {/* 创建资助亲人计划按钮 */}
        {!showCreatePlanHint && (
          <div className="mt-4">
            <Button
              onClick={handleCreatePlanClick}
              className="w-full bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] text-gray-900 hover:from-[#A5E0E4] hover:to-[#7DD3D7]"
            >
              <Plus className="w-4 h-4 mr-2" />
              创建资助亲人计划
            </Button>
          </div>
        )}

        {/* 创建计划提示 */}
        {showCreatePlanHint && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 text-center">
              点击上图表格中的年份，即可创建资助计划
            </p>
          </div>
        )}

        {/* 资助计划列表 */}
        {supportPlans.length > 0 && (
          <div className="mt-4 space-y-3">
            <h6 className="text-sm font-medium text-gray-700">资助计划</h6>
            {supportPlans.map((plan) => (
              <div key={plan.age} className="p-4 bg-gray-50/50 rounded-lg border border-gray-100">
                {/* 标题栏 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-gray-800">
                    {plan.age}岁 ({plan.year}年)
                  </div>
                  <button
                    onClick={() => handleDeletePlan(plan.age)}
                    className="p-1 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                {/* 资助能力信息 */}
                <div className="space-y-2 mb-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">当年可资助金额</span>
                    <span className="font-medium text-gray-700">{plan.maxAmount}万元</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-500">截止到当年累计可资助金额</span>
                      <Tooltip open={cumulativeTooltipOpen[plan.age]} onOpenChange={(open) => setCumulativeTooltipOpen(prev => ({ ...prev, [plan.age]: open }))}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleCumulativeTooltipClick(plan.age)}
                            className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <HelpCircle className="w-3 h-3 text-gray-400" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent 
                          className="max-w-[280px] p-3 bg-white border border-gray-200 text-gray-800 text-xs rounded-lg shadow-lg"
                          side="top"
                          align="center"
                        >
                          <div className="space-y-2">
                            <p className="font-medium text-gray-900">累计可资助金额说明</p>
                            <p className="text-gray-700 leading-relaxed">
                              从今年（30岁）开始计算，到您选择的{plan.age}岁为止，这期间所有年份的可自由支配资金累加后的总金额。这笔资金可以一次性用于资助亲人。
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="font-medium text-gray-700">{getCumulativeAmount(plan.age)}万元</span>
                  </div>
                </div>

                {/* 资助方式 */}
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-2">资助方式</div>
                  <Select 
                    value={plan.supportType} 
                    onValueChange={(value: 'current' | 'cumulative') => handleSupportTypeChange(plan.age, value)}
                  >
                    <SelectTrigger className="h-8 text-xs border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">当年可资助金额</SelectItem>
                      <SelectItem value="cumulative">累计可资助金额</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 被资助人区域 */}
                <div className="space-y-2 mb-3">
                  {plan.beneficiaries.map((beneficiary, index) => (
                    <div key={beneficiary.name} className="flex items-center space-x-2 p-2 bg-white rounded border border-gray-100">
                      <span className="text-xs text-gray-500 w-16 flex-shrink-0">被资助人</span>
                      <span className="text-xs font-medium text-gray-700 flex-1">
                        {beneficiary.name} ({getBeneficiaryAge(beneficiary.name, plan.year)}岁)
                      </span>
                      <div className="flex items-center space-x-1">
                        <Input
                          type="number"
                          value={beneficiary.amount === 0 ? '' : beneficiary.amount}
                          onChange={(e) => handleBeneficiaryAmountChange(plan.age, beneficiary.name, e.target.value)}
                          max={plan.supportType === 'current' ? plan.maxAmount : getCumulativeAmount(plan.age)}
                          min={0}
                          step={0.1}
                          placeholder="0"
                          className="w-16 h-7 text-xs border-gray-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-xs text-gray-500">万</span>
                      </div>
                      {plan.beneficiaries.length > 1 && (
                        <button
                          onClick={() => handleRemoveBeneficiary(plan.age, beneficiary.name)}
                          className="p-1 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {/* 添加被资助人按钮 */}
                  {plan.beneficiaries.length < beneficiaryOptions.length && (
                    <button
                      onClick={() => handleAddBeneficiary(plan.age)}
                      className="w-full py-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 rounded border border-dashed border-blue-200 transition-colors"
                    >
                      + 添加被资助人
                    </button>
                  )}
                </div>
                
                {/* 已分配金额 */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">已分配资助金额</span>
                    <span className="font-medium text-gray-700">
                      {getTotalAmount(plan.beneficiaries)}万元 / {plan.supportType === 'current' ? plan.maxAmount : getCumulativeAmount(plan.age)}万元
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedCell && isMember && !showCreatePlanHint && (
          <div className="mt-3 p-3 bg-[#CAF4F7]/10 rounded-lg border border-[#CAF4F7]/30">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-700">
                <span className="font-medium">{selectedCell.age}岁</span>
                <span className="text-gray-500 ml-2">({selectedCell.year}年)</span>
              </div>
              <div className="text-base font-semibold text-[#4A90A4]">
                ¥{selectedCell.amount}万
              </div>
            </div>
            {selectedCell.amount > 0 && (
              <p className="text-xs text-gray-600 mt-1">
                扣除支出和储蓄后可自由支配
              </p>
            )}
            {selectedCell.amount === 0 && (
              <p className="text-xs text-gray-600 mt-1">
                当年无可自由支配金额
              </p>
            )}
          </div>
        )}

        {/* 无资助能力提示弹窗 */}
        <Dialog open={showNoMoneyDialog} onOpenChange={setShowNoMoneyDialog}>
          <DialogContent className="max-w-sm">
            <DialogTitle className="sr-only">无法资助提示</DialogTitle>
            <DialogDescription className="sr-only">该年份无可资助金额的说明</DialogDescription>
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                当年无法资助
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {noMoneyAge}岁当年可自由支配金额为0万元，无法创建资助计划。建议选择其他有资助能力的年份。
              </p>
              <Button 
                onClick={() => setShowNoMoneyDialog(false)}
                className="mt-4 bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] text-gray-900 hover:from-[#A5E0E4] hover:to-[#7DD3D7]"
              >
                我知道了
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default FreeSpendingHeatmap;