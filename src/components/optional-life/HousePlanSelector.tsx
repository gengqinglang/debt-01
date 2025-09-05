
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MotiveSelector from './MotiveSelector';
import HousePlanSummary from './HousePlanSummary';
import PlanConfigurator from './PlanConfigurator';
import RentEditModal, { RentStage } from './RentEditModal';
import { ArrowLeft, Plus, Trash2, HelpCircle, Edit2 } from 'lucide-react';

interface MotiveOption {
  id: string;
  label: string;
}

interface HousePlan {
  id: string;
  motive: string;
  houseType: string;
  location: string;
  budget: number;
  downPayment: number;
  monthlyPayment: number;
  years: number;
  purchaseAge: number; // 购房时间（年龄）
}

interface HousePlanSelectorProps {
  initialMotives?: string[];
  initialAmount?: number;
  onDataChange?: (totalAmount: number, motives: string[]) => void;
  onHousingDataChange?: (totalAmount: number, motives: string[]) => void;
  isFromPlanningTab?: boolean; // 新增：是否来自规划tab页
  isFromOptionalLife?: boolean; // 新增：是否来自optional-life页
}

const HousePlanSelector: React.FC<HousePlanSelectorProps> = ({ 
  initialMotives = [],
  initialAmount = 0,
  onDataChange,
  onHousingDataChange,
  isFromPlanningTab = false,
  isFromOptionalLife = false
}) => {
  const motiveOptions: MotiveOption[] = [
    { id: '刚需购房', label: '刚需购房' },
    { id: '买套改善房', label: '买套改善房' },
    { id: '买个学区房', label: '买个学区房' },
    { id: '跨城置业', label: '跨城置业' },
    { id: '给父母买房', label: '给父母买房' },
    { id: '买个养老房', label: '买个养老房' },
    { id: '投资买房', label: '投资买房' }
  ];

  const [selectedMotive, setSelectedMotive] = useState<string | null>(null);
  
  // 默认的3套房子
  const defaultHousePlans: HousePlan[] = [
    {
      id: 'default-1',
      motive: '刚需购房',
      houseType: '2居室(70-120㎡)',
      location: '市中心',
      budget: 200,
      downPayment: 60,
      monthlyPayment: 5600,
      years: 30,
      purchaseAge: 30
    },
    {
      id: 'default-2',
      motive: '买套改善房',
      houseType: '3居室(120-180㎡)',
      location: '市中心',
      budget: 400,
      downPayment: 120,
      monthlyPayment: 16000,
      years: 30,
      purchaseAge: 40
    },
    {
      id: 'default-3',
      motive: '买个学区房',
      houseType: '2居室(70-120㎡)',
      location: '学区',
      budget: 350,
      downPayment: 105,
      monthlyPayment: 9800,
      years: 30,
      purchaseAge: 35
    }
  ];
  
  const [housePlans, setHousePlans] = useState<HousePlan[]>(isFromOptionalLife ? [] : defaultHousePlans);
  const [confirmedPlanMotives, setConfirmedPlanMotives] = useState<string[]>(isFromOptionalLife ? [] : ['刚需购房', '买套改善房', '买个学区房']);
  const [showConfigCard, setShowConfigCard] = useState(false);
  const [configRoomType, setConfigRoomType] = useState('2居室(70-120㎡)');
  const [configAmount, setConfigAmount] = useState('200');
  const [showHouseExpenseHelp, setShowHouseExpenseHelp] = useState(false);
  const [showRentEditModal, setShowRentEditModal] = useState(false);
  
  // 租房阶段数据 - 默认为空
  const [rentStages, setRentStages] = useState<RentStage[]>([]);

  // Calculate total amount whenever plans change
  useEffect(() => {
    const totalHousingAmount = housePlans.reduce((total, plan) => total + plan.budget, 0);
    const motives = housePlans.map(plan => plan.motive);
    
    console.log('HousePlanSelector: Sending data to parent:', {
      totalHousingAmount,
      motives
    });
    
    // Call both callback functions if they exist
    if (onDataChange) {
      onDataChange(totalHousingAmount, motives);
    }
    if (onHousingDataChange) {
      onHousingDataChange(totalHousingAmount, motives);
    }
  }, [housePlans, onDataChange, onHousingDataChange]);

  const handleMotiveSelect = (motiveId: string) => {
    setSelectedMotive(motiveId);
    setShowConfigCard(true);
  };

  const handleConfirmPlan = () => {
    if (!selectedMotive) return;

    // Create a new plan with configured values
    const newPlan: HousePlan = {
      id: Date.now().toString(),
      motive: selectedMotive,
      houseType: configRoomType,
      location: '市中心',
      budget: parseInt(configAmount) || 200,
      downPayment: Math.round((parseInt(configAmount) || 200) * 0.3),
      monthlyPayment: Math.round((parseInt(configAmount) || 200) * 0.04),
      years: 30,
      purchaseAge: 35 // 默认购房年龄
    };

    setHousePlans([...housePlans, newPlan]);
    setConfirmedPlanMotives([...confirmedPlanMotives, selectedMotive]);
    setSelectedMotive(null);
    setShowConfigCard(false);
    setConfigRoomType('2居室(70-120㎡)');
    setConfigAmount('200');
  };

  const handleCancelConfig = () => {
    setSelectedMotive(null);
    setShowConfigCard(false);
    setConfigRoomType('2居室(70-120㎡)');
    setConfigAmount('200');
  };

  const handleDeletePlan = (planId: string) => {
    const planToDelete = housePlans.find(plan => plan.id === planId);
    if (planToDelete) {
      setHousePlans(housePlans.filter(plan => plan.id !== planId));
      setConfirmedPlanMotives(confirmedPlanMotives.filter(motive => motive !== planToDelete.motive));
    }
  };

  const handleUpdatePlan = (planId: string, updatedPlan: Partial<HousePlan>) => {
    setHousePlans(housePlans.map(plan => 
      plan.id === planId ? { ...plan, ...updatedPlan } : plan
    ));
  };

  // 计算总租金
  const calculateTotalRentExpense = () => {
    return rentStages.reduce((total, stage) => {
      const years = stage.endAge - stage.startAge;
      const totalCost = stage.monthlyRent * 12 * years;
      return total + totalCost;
    }, 0);
  };

  const handleRentStagesSave = (newStages: RentStage[]) => {
    setRentStages(newStages);
  };

  // Convert housePlans to the format expected by HousePlanSummary
  const summaryPlans = housePlans.map(plan => {
    const summaryPlan: any = {
      id: plan.id,
      motive: plan.motive,
      roomType: plan.houseType,
      amount: plan.budget.toString(),
      purchaseAge: plan.purchaseAge
    };
    // 根据不同的购房动机添加不同的信息
    if (plan.motive === '刚需购房') {
      summaryPlan.purchaseMethod = '融资购房';
      summaryPlan.downPayment = plan.downPayment;
      summaryPlan.loanAmount = plan.budget - plan.downPayment;
      summaryPlan.loanYears = plan.years;
      summaryPlan.monthlyPayment = plan.monthlyPayment;
    } else if (plan.motive === '买套改善房') {
      summaryPlan.purchaseMethod = '全款购房';
    } else if (plan.motive === '买个学区房') {
      summaryPlan.purchaseMethod = '置换+融资购房';
      summaryPlan.downPayment = plan.downPayment;
      summaryPlan.loanAmount = plan.budget - plan.downPayment;
      summaryPlan.loanYears = plan.years;
      summaryPlan.monthlyPayment = plan.monthlyPayment;
      summaryPlan.saleInfo = {
        currentValue: 200,
        earlyRepayment: 80
      };
    }

    return summaryPlan;
  });

  return (
    <div className="space-y-6">
      {housePlans.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">您还没有确定任何购房计划</p>
          <p className="text-sm text-gray-400">请在下方选择购房动机并配置详情</p>
        </div>
      ) : (
        <div className="space-y-4">
          <HousePlanSummary
            plans={summaryPlans}
            onRemovePlan={handleDeletePlan}
            onUpdatePlan={handleUpdatePlan}
            hideDetails={!isFromPlanningTab}
          />
        </div>
      )}

      {!showConfigCard && (
        <>
          <MotiveSelector
            motives={motiveOptions}
            selectedMotive={null}
            onSelectMotive={handleMotiveSelect}
            confirmedPlanMotives={confirmedPlanMotives}
          />
          
          {/* 未来养房支出展示 - 在optional-life页隐藏 */}
          {!isFromOptionalLife && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">未来养房支出</span>
                  <button
                    onClick={() => setShowHouseExpenseHelp(true)}
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                ¥{(housePlans.reduce((total, plan) => total + plan.budget * 0.6, 0)).toFixed(0)}万
              </div>
              <div className="text-sm text-gray-500 mb-4">
                预计房屋持有期间的各项费用总和
              </div>
            </div>
          )}

          {/* 租房支出卡片 - 在optional-life页隐藏 */}
          {!isFromOptionalLife && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200 space-y-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-800">租房支出</h4>
                <button
                  onClick={() => setShowRentEditModal(true)}
                  className="text-green-500 hover:text-green-600 transition-colors flex items-center gap-1 text-sm"
                >
                  <Edit2 className="w-3 h-3" />
                  编辑
                </button>
              </div>
              
              {rentStages.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <p className="text-sm">暂无租房支出配置</p>
                  <button
                    onClick={() => setShowRentEditModal(true)}
                    className="mt-2 text-green-500 hover:text-green-600 text-sm underline"
                  >
                    添加租房阶段
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {rentStages.map((stage, index) => (
                    <div key={stage.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {stage.startAge}-{stage.endAge}岁
                      </span>
                      <span className="font-medium">¥{stage.monthlyRent}/月</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center font-medium">
                      <span>总租金支出</span>
                      <span className="text-green-600">¥{(calculateTotalRentExpense() / 10000).toFixed(1)}万</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* 显示配置卡片时隐藏选择动机模块 */}
      {showConfigCard && selectedMotive && (
        <PlanConfigurator
          motive={selectedMotive}
          roomType={configRoomType}
          amount={configAmount}
          onRoomTypeChange={setConfigRoomType}
          onAmountChange={setConfigAmount}
          onConfirmPlan={handleConfirmPlan}
          onCancel={handleCancelConfig}
        />
      )}

      {/* 未来养房支出解释弹窗 */}
      <Dialog open={showHouseExpenseHelp} onOpenChange={setShowHouseExpenseHelp}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>未来养房支出说明</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              未来养房支出是指在房屋持有期间需要承担的各项费用，主要包括：
            </p>
            <ul className="space-y-2 pl-4">
              <li>• <span className="font-medium">物业管理费</span>：每月的物业服务费用</li>
              <li>• <span className="font-medium">房屋维修费</span>：房屋日常维护和大修费用</li>
              <li>• <span className="font-medium">房产税费</span>：持有期间的税费支出</li>
              <li>• <span className="font-medium">装修费用</span>：定期装修更新的费用</li>
              <li>• <span className="font-medium">其他费用</span>：水电气暖等基础设施费用</li>
            </ul>
            <p className="text-xs text-gray-500">
              * 该数据基于房屋总价的一定比例进行估算，实际费用可能因地区和房屋类型而有所差异
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* 租房支出编辑弹窗 */}
      <RentEditModal
        isOpen={showRentEditModal}
        onClose={() => setShowRentEditModal(false)}
        rentStages={rentStages}
        onSave={handleRentStagesSave}
      />
    </div>
  );
};

export default HousePlanSelector;
