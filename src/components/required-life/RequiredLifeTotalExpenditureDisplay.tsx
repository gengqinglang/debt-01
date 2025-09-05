import React from 'react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calculator, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface FamilyMember {
  name: string;
  age: number;
  relationship: string;
}

interface Child extends FamilyMember {
  educationEndAge: number;
}

interface ExpenditureBreakdown {
  basicLife?: number;
  medical?: number;
  education?: number;
  retirement?: number;
  houseKeeping?: number;
  carKeeping?: number;
  // Optional life categories
  marriage?: number;
  birth?: number;
  housing?: number;
  car?: number;
  travel?: number;
  care?: number;
}

interface OptionalLifeData {
  totalAmount: number;
  breakdown: {[key: string]: number};
  selectedModules: string[];
}

interface RequiredLifeTotalExpenditureDisplayProps {
  selectedSubjectLevels: {[key: string]: string};
  confirmedTabs: {[key: string]: boolean};
  customAmounts: {[key: string]: string};
  educationStage: string;
  familyMembers?: FamilyMember[];
  children?: Child[];
  optionalLifeData: OptionalLifeData;
}

const RequiredLifeTotalExpenditureDisplay: React.FC<RequiredLifeTotalExpenditureDisplayProps> = ({
  selectedSubjectLevels,
  confirmedTabs,
  customAmounts,
  educationStage,
  familyMembers = [],
  children = [],
  optionalLifeData
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>('');

  // 获取教育结束年龄
  const getEducationEndAge = (stage: string) => {
    switch (stage) {
      case '大学': return 22;
      case '研究生': return 25;
      case '博士': return 28;
      default: return 22;
    }
  };

  // 获取显示金额
  const getDisplayAmount = (categoryKey: string, optionName: string, defaultAmount: string) => {
    const key = `${categoryKey}-${optionName}`;
    return customAmounts[key] || defaultAmount;
  };

  // 计算各项支出
  const calculateExpenditures = () => {
    const breakdown: ExpenditureBreakdown = {};

    console.log('Calculating expenditures with optional life data:', optionalLifeData);

    // 添加optional-life支出的详细分类
    if (optionalLifeData.breakdown) {
      Object.entries(optionalLifeData.breakdown).forEach(([key, value]) => {
        if (value > 0) {
          breakdown[key as keyof ExpenditureBreakdown] = value;
        }
      });
    }

    // 默认家庭成员数据（如果没有提供）
    const defaultFamilyMembers = familyMembers.length > 0 ? familyMembers : [
      { name: '本人', age: 30, relationship: 'self' },
      { name: '伴侣', age: 32, relationship: 'spouse' }
    ];

    const defaultChildren = children.length > 0 ? children : [
      { name: '孩子', age: 5, relationship: 'child', educationEndAge: getEducationEndAge(educationStage) }
    ];

    // 基础生活支出计算
    if (confirmedTabs['基础生活'] && selectedSubjectLevels['基础生活规划']) {
      const optionName = selectedSubjectLevels['基础生活规划'];
      const monthlyAmount = parseFloat(getDisplayAmount('基础生活规划', optionName, '0.5'));
      
      let totalYears = 0;
      // 成人计算到85岁
      defaultFamilyMembers.forEach(member => {
        totalYears += Math.max(0, 85 - member.age);
      });
      // 孩子计算到教育结束
      defaultChildren.forEach(child => {
        totalYears += Math.max(0, child.educationEndAge - child.age);
      });
      
      breakdown.basicLife = monthlyAmount * 12 * totalYears;
    }

    // 医疗保健支出计算
    if (confirmedTabs['医疗保健'] && selectedSubjectLevels['医疗保健规划']) {
      const optionName = selectedSubjectLevels['医疗保健规划'];
      const yearlyAmount = parseFloat(getDisplayAmount('医疗保健规划', optionName, '1'));
      
      let totalYears = 0;
      defaultFamilyMembers.forEach(member => {
        totalYears += Math.max(0, 85 - member.age);
      });
      defaultChildren.forEach(child => {
        totalYears += Math.max(0, child.educationEndAge - child.age);
      });
      
      breakdown.medical = yearlyAmount * totalYears;
    }

    // 子女教育支出计算
    if (confirmedTabs['子女教育'] && selectedSubjectLevels['子女教育规划']) {
      const optionName = selectedSubjectLevels['子女教育规划'];
      const yearlyAmount = parseFloat(getDisplayAmount('子女教育规划', optionName, '150'));
      
      let totalEducationYears = 0;
      defaultChildren.forEach(child => {
        totalEducationYears += Math.max(0, child.educationEndAge - child.age);
      });
      
      breakdown.education = yearlyAmount * totalEducationYears;
    }

    // 养老支出计算
    if (confirmedTabs['养老'] && selectedSubjectLevels['养老规划']) {
      const optionName = selectedSubjectLevels['养老规划'];
      const yearlyAmount = parseFloat(getDisplayAmount('养老规划', optionName, '5'));
      
      let totalAdultYears = 0;
      defaultFamilyMembers.forEach(member => {
        totalAdultYears += Math.max(0, 85 - member.age);
      });
      
      breakdown.retirement = yearlyAmount * totalAdultYears;
    }

    // 养房支出计算
    if (confirmedTabs['养房']) {
      // 从localStorage读取houseItems数据
      try {
        const savedData = localStorage.getItem('requiredLifeData');
        if (savedData) {
          const data = JSON.parse(savedData);
          const houseItems = data.houseItems || [];
          const totalHouseKeeping = houseItems.reduce((sum: number, item: any) => sum + item.amount, 0) * 30;
          if (totalHouseKeeping > 0) {
            breakdown.houseKeeping = totalHouseKeeping;
          }
        }
      } catch (error) {
        console.error('Error reading house items:', error);
        // 如果没有数据，使用默认计算
        if (selectedSubjectLevels['养房规划']) {
          const optionName = selectedSubjectLevels['养房规划'];
          const yearlyAmount = parseFloat(getDisplayAmount('养房规划', optionName, '1.5'));
          breakdown.houseKeeping = yearlyAmount * 30;
        }
      }
    }

    // 养车支出计算
    if (confirmedTabs['养车']) {
      // 从localStorage读取carItems数据
      try {
        const savedData = localStorage.getItem('requiredLifeData');
        if (savedData) {
          const data = JSON.parse(savedData);
          const carItems = data.carItems || [];
          const totalCarKeeping = carItems.reduce((sum: number, item: any) => sum + item.amount, 0) * 30;
          if (totalCarKeeping > 0) {
            breakdown.carKeeping = totalCarKeeping;
          }
        }
      } catch (error) {
        console.error('Error reading car items:', error);
        // 如果没有数据，使用默认计算
        if (selectedSubjectLevels['养车规划']) {
          const optionName = selectedSubjectLevels['养车规划'];
          const yearlyAmount = parseFloat(getDisplayAmount('养车规划', optionName, '1.2'));
          breakdown.carKeeping = yearlyAmount * 30;
        }
      }
    }

    return breakdown;
  };

  const breakdown = calculateExpenditures();
  const totalAmount = Object.values(breakdown).reduce((sum, amount) => sum + (amount || 0), 0);

  const formatAmount = (amount: number) => {
    return amount.toFixed(0);
  };

  const moduleNames = {
    // Required life modules
    basicLife: '基础生活',
    medical: '医疗保健',
    education: '子女教育',
    retirement: '养老',
    houseKeeping: '养房',
    carKeeping: '养车',
    // Optional life modules
    marriage: '结婚',
    birth: '生育',
    housing: '购房',
    car: '购车',
    travel: '旅游',
    care: '赡养'
  };

  const moduleExplanations = {
    basicLife: '基础生活支出包含日常生活费用、衣食住行等基本开销',
    medical: '医疗保健支出包含医疗保险、体检费用、日常医疗开销等健康相关费用',
    education: '子女教育支出包含学费、培训费、教育用品等孩子教育相关开销',
    retirement: '养老支出包含退休后的生活费用、医疗费用等养老相关开销',
    houseKeeping: '养房支出包含物业费、水电费、维修费、装修更新等日常房屋维护开支',
    carKeeping: '养车支出包含保险费、保养费、油费、停车费等日常车辆维护开支',
    marriage: '结婚支出包含婚礼费用、彩礼、蜜月旅行等所有结婚相关开销',
    birth: '生育支出包含孕期检查、分娩费用、产后护理、婴儿用品等生育相关开销',
    housing: '购房支出包含房款、装修费用、后续的养房成本（物业费、维修等）',
    car: '购车支出包含车辆购置费、保险费、养车成本（保养、油费等）',
    travel: '旅游支出包含度假旅行、交通费用、住宿餐饮等休闲娱乐开销',
    care: '赡养支出包含父母日常生活费、医疗费、护理费等赡养相关开销'
  };

  const handleHelpClick = () => {
    setDialogOpen(true);
  };

  const handleItemHelpClick = (key: string) => {
    setSelectedItem(key);
    setItemDialogOpen(true);
  };

  const confirmedCount = Object.values(confirmedTabs).filter(Boolean).length;
  const hasOptionalLifeExpenses = optionalLifeData.totalAmount > 0;

  // 只要有已确认的required-life项目或有optional-life支出就显示下拉箭头
  const shouldShowDropdown = confirmedCount > 0 || hasOptionalLifeExpenses;

  return (
    <Card className="mb-6 bg-gradient-to-r from-[#CCE9B5]/20 to-[#B8E0A1]/20 border-[#CCE9B5] shadow-lg">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#CCE9B5] to-[#B8E0A1] rounded-full flex items-center justify-center">
              <Calculator className="w-4 h-4 text-gray-900" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">未来人生总支出</h3>
              <HelpCircle 
                className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" 
                onClick={handleHelpClick}
              />
            </div>
          </div>
          <div className="text-right">
            <div 
              className={`flex items-center gap-2 ${shouldShowDropdown ? 'cursor-pointer' : ''} transition-all duration-300`}
              onClick={() => shouldShowDropdown && setShowBreakdown(!showBreakdown)}
            >
              <div className="text-base font-bold text-gray-900">
                {formatAmount(totalAmount)}万
              </div>
              {shouldShowDropdown && (
                showBreakdown ? (
                  <ChevronUp className="w-4 h-4 text-gray-600 hover:text-gray-900 transition-colors" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600 hover:text-gray-900 transition-colors" />
                )
              )}
            </div>
          </div>
        </div>
        
        {showBreakdown && shouldShowDropdown && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 animate-fade-in">
             {Object.entries(breakdown).map(([key, amount]) => {
               if (!amount || amount === 0) return null;
               const moduleName = moduleNames[key as keyof typeof moduleNames];
               return (
                 <div key={key} className="flex justify-between items-center text-sm">
                   <div className="flex items-center gap-2">
                     <span className="text-gray-700">{moduleName}</span>
                     <HelpCircle 
                       className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" 
                       onClick={() => handleItemHelpClick(key)}
                     />
                   </div>
                   <span className="font-medium text-gray-900">{formatAmount(amount)}万</span>
                 </div>
               );
             })}
           </div>
         )}
       </div>

       {/* 总支出解释弹窗 */}
       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
         <DialogContent className="max-w-md">
           <DialogHeader>
             <DialogTitle>未来人生总支出</DialogTitle>
           </DialogHeader>
           <DialogDescription className="text-sm leading-relaxed text-gray-700">
             此处需要解释一下未来人生支出考虑了增长率
           </DialogDescription>
         </DialogContent>
       </Dialog>

       {/* 支出项解释弹窗 */}
       <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
         <DialogContent className="max-w-md">
           <DialogHeader>
             <DialogTitle>{moduleNames[selectedItem as keyof typeof moduleNames]}支出说明</DialogTitle>
           </DialogHeader>
           <DialogDescription className="text-sm leading-relaxed text-gray-700">
             {moduleExplanations[selectedItem as keyof typeof moduleExplanations]}
           </DialogDescription>
         </DialogContent>
       </Dialog>
     </Card>
  );
};

export default RequiredLifeTotalExpenditureDisplay;
