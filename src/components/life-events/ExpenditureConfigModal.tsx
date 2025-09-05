import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, CheckCircle } from 'lucide-react';
import { ExpenditureItem } from '@/hooks/useExpenditureData';
import { useNavigate } from 'react-router-dom';

// Import the specific configuration components
import HousingConfig from '@/components/optional-life/modules/HousingConfig';
import MarriageConfig from '@/components/optional-life/modules/MarriageConfig';
import BirthConfig from '@/components/optional-life/modules/BirthConfig';
import CareConfig from '@/components/optional-life/modules/CareConfig';
import CarConfig from '@/components/optional-life/modules/CarConfig';
import FamilySupportConfig from './configs/FamilySupportConfig';

// Import new required-life config components
import BasicLifeConfig from './configs/BasicLifeConfig';
import MedicalConfig from './configs/MedicalConfig';
import EducationConfig from './configs/EducationConfig';
import TravelConfig from './configs/TravelConfig';
import RetirementConfig from './configs/RetirementConfig';

interface ExpenditureConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ExpenditureItem | null;
  onSave: (selectedLevel: string, amount: number, isCustom?: boolean) => void;
  isFromPaymentSuccess?: boolean; // 新增属性
  isFromPlanningTab?: boolean; // 新增：是否来自规划tab页
}

const ExpenditureConfigModal: React.FC<ExpenditureConfigModalProps> = ({
  isOpen,
  onClose,
  item,
  onSave,
  isFromPaymentSuccess = false, // 默认为false
  isFromPlanningTab = false // 默认为false
}) => {
  const navigate = useNavigate();
  const [confirmedConfig, setConfirmedConfig] = useState<any>(null);
  const [isConfigConfirmed, setIsConfigConfirmed] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // 获取已保存的数据
  const getRequiredLifeData = () => {
    try {
      const savedData = localStorage.getItem('requiredLifeData');
      return savedData ? JSON.parse(savedData) : {};
    } catch (error) {
      console.error('Error reading required life data:', error);
      return {};
    }
  };

  const getOptionalLifeData = () => {
    try {
      const savedData = localStorage.getItem('optionalLifeData');
      return savedData ? JSON.parse(savedData) : {};
    } catch (error) {
      console.error('Error reading optional life data:', error);
      return {};
    }
  };

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen && item) {
      setConfirmedConfig(null);
      setIsConfigConfirmed(false);
      setShowSuccessDialog(false);
    }
  }, [isOpen, item]);

  const handleSave = () => {
    if (confirmedConfig) {
      onSave(confirmedConfig.selectedLevel || '', confirmedConfig.amount, confirmedConfig.isCustom);
      setShowSuccessDialog(true);
    }
  };

  const handleViewResult = () => {
    setShowSuccessDialog(false);
    onClose();
    
    // 如果是从支付成功场景打开的，不进行导航
    if (isFromPaymentSuccess) {
      return;
    }
    
    // 使用 replace: false 强制页面重新渲染
    navigate('/new', { 
      replace: false,
      state: { 
        activeTab: 'discover'
      }
    });
  };

  const handleCancel = () => {
    setShowSuccessDialog(false);
    onClose();
    
    // 如果是从支付成功场景打开的，不进行导航
    if (isFromPaymentSuccess) {
      return;
    }
    
    // 使用 replace: false 强制页面重新渲染
    navigate('/new', { 
      replace: false,
      state: { 
        activeTab: 'planning',
        activePlanningTab: 'life-events'
      }
    });
  };

  const renderConfigInterface = () => {
    if (!item) return null;

    const requiredData = getRequiredLifeData();
    const optionalData = getOptionalLifeData();

    switch (item.category) {
      case '基础生活规划':
        return (
          <BasicLifeConfig
            initialSelectedLevel={item.selectedLevel || requiredData.selectedSubjectLevels?.['基础生活规划'] || ''}
            initialCustomAmounts={requiredData.customAmounts || {}}
            onConfigChange={(selectedLevel, amount, isCustom) => {
              setConfirmedConfig({
                selectedLevel,
                amount,
                isCustom
              });
              setIsConfigConfirmed(true);
            }}
          />
        );

      case '医疗保健规划':
        return (
          <MedicalConfig
            initialSelectedLevel={item.selectedLevel || requiredData.selectedSubjectLevels?.['医疗保健规划'] || ''}
            initialCustomAmounts={requiredData.customAmounts || {}}
            onConfigChange={(selectedLevel, amount, isCustom) => {
              setConfirmedConfig({
                selectedLevel,
                amount,
                isCustom
              });
              setIsConfigConfirmed(true);
            }}
          />
        );

      case '子女教育规划':
        return (
          <EducationConfig
            initialSelectedLevel={item.selectedLevel || requiredData.selectedSubjectLevels?.['子女教育规划'] || ''}
            initialCustomAmounts={requiredData.customAmounts || {}}
            onConfigChange={(selectedLevel, amount, isCustom, educationStage) => {
              setConfirmedConfig({
                selectedLevel,
                amount,
                isCustom,
                educationStage
              });
              setIsConfigConfirmed(true);
            }}
          />
        );

      case '旅游规划':
        return (
          <TravelConfig
            initialSelectedLevel={item.selectedLevel || requiredData.selectedSubjectLevels?.['旅游规划'] || ''}
            initialCustomAmounts={requiredData.customAmounts || {}}
            onConfigChange={(selectedLevel, amount, isCustom) => {
              setConfirmedConfig({
                selectedLevel,
                amount,
                isCustom
              });
              setIsConfigConfirmed(true);
            }}
          />
        );

      case '养老规划':
        return (
          <RetirementConfig
            initialSelectedLevel={item.selectedLevel || requiredData.selectedSubjectLevels?.['养老规划'] || ''}
            initialCustomAmounts={requiredData.customAmounts || {}}
            onConfigChange={(selectedLevel, amount, isCustom) => {
              setConfirmedConfig({
                selectedLevel,
                amount,
                isCustom
              });
              setIsConfigConfirmed(true);
            }}
          />
        );

      case 'housing':
        return (
          <HousingConfig
            initialData={optionalData.detailedConfigs?.housing}
            isFromPlanningTab={isFromPlanningTab}
            onHousingDataChange={(totalAmount, motives) => {
              setConfirmedConfig({
                selectedLevel: motives.join(', '),
                amount: totalAmount,
                isCustom: true,
                motives
              });
              setIsConfigConfirmed(true);
            }}
          />
        );

      case 'marriage':
        const marriageStandards = [
          { value: '轻简甜蜜版', label: '轻简甜蜜版', description: '精致登记照+亲友小宴+蜜月周边游', price: '5', minAmount: 3, maxAmount: 8 },
          { value: '温馨记忆版', label: '温馨记忆版', description: '主题婚纱拍摄+三星宴请+轻奢对戒', price: '10', minAmount: 8, maxAmount: 15 },
          { value: '悦己臻选版', label: '悦己臻选版', description: '旅拍婚纱照+设计师礼服+珠宝纪念', price: '30', minAmount: 20, maxAmount: 50 },
          { value: '梦幻绽放版', label: '梦幻绽放版', description: '海外婚礼+高定主纱+定制婚宴', price: '60', minAmount: 40, maxAmount: 100 },
          { value: '名流盛典版', label: '名流盛典版', description: '明星策划团队+私人海岛仪式', price: '100+', minAmount: 80, maxAmount: 200 },
        ];

        return (
          <MarriageConfigWrapper
            marriageStandards={marriageStandards}
            confirmedConfig={confirmedConfig}
            onConfigChange={(selectedLevel, amount) => {
              setConfirmedConfig({
                selectedLevel,
                amount,
                isCustom: false
              });
              setIsConfigConfirmed(true);
            }}
          />
        );

      case 'birth':
        const birthStandards = [
          { value: '简约温馨版', label: '简约温馨版', description: '公立全流程 家人月子 基础育儿', price: '3', minAmount: 2, maxAmount: 5 },
          { value: '精算优选版', label: '精算优选版', description: '私立产检 月嫂助力 早教启蒙', price: '10', minAmount: 8, maxAmount: 15 },
          { value: '品质护航版', label: '品质护航版', description: '高端产检套餐 LDR产房 月子会所', price: '30', minAmount: 20, maxAmount: 50 },
          { value: '尊享定制版', label: '尊享定制版', description: '海外胎教 明星医院 蒙氏早教', price: '80', minAmount: 60, maxAmount: 120 },
          { value: '星际臻享版', label: '星际臻享版', description: '顶尖产科团队 科技分娩 医护月子', price: '150+', minAmount: 120, maxAmount: 200 },
        ];

        return (
          <BirthConfigWrapper
            birthStandards={birthStandards}
            confirmedConfig={confirmedConfig}
            onConfigChange={(selectedLevel, amount, childrenCount, childrenAges) => {
              setConfirmedConfig({
                selectedLevel,
                amount,
                childrenCount,
                childrenAges,
                isCustom: false
              });
              setIsConfigConfirmed(true);
            }}
          />
        );

      case 'car':
        const carLevels = [
          { value: '通勤神器', label: '通勤神器', description: '五菱宏光MINI EV、比亚迪海鸥', price: '8', minAmount: 5, maxAmount: 15 },
          { value: '家庭旗舰', label: '家庭旗舰', description: '比亚迪宋PLUS、深蓝S7', price: '20', minAmount: 15, maxAmount: 30 },
          { value: '精英座驾', label: '精英座驾', description: '特斯拉Model 3、宝马i3', price: '40', minAmount: 30, maxAmount: 60 },
          { value: '豪华臻选', label: '豪华臻选', description: '蔚来ET7、奥迪Q5 e-tron', price: '60', minAmount: 50, maxAmount: 80 },
          { value: '巅峰性能', label: '巅峰性能', description: '保时捷Taycan、路特斯EVIJA', price: '100+', minAmount: 80, maxAmount: 200 },
        ];

        return (
          <CarConfigWrapper
            carLevels={carLevels}
            confirmedConfig={confirmedConfig}
            onConfigChange={(selectedLevel, amount, carCount, carPurchaseTimes) => {
              setConfirmedConfig({
                selectedLevel,
                amount,
                carCount,
                carPurchaseTimes,
                isCustom: false
              });
              setIsConfigConfirmed(true);
            }}
          />
        );

      case 'care':
        const careStandards = [
          { value: '基础关怀版', label: '基础关怀版', description: '定期探望+基础生活费+社区医疗', price: '1', minAmount: 0.5, maxAmount: 2 },
          { value: '舒心照料版', label: '舒心照料版', description: '专属营养餐+家庭医生+适老改造', price: '3', minAmount: 2, maxAmount: 5 },
          { value: '品质陪伴版', label: '品质陪伴版', description: '旅居疗养+健康管家+文娱课程', price: '8', minAmount: 5, maxAmount: 12 },
          { value: '尊享颐养版', label: '尊享颐养版', description: '高端养老社区+专属护理+全球疗养', price: '20', minAmount: 15, maxAmount: 30 },
          { value: '殿堂级守护版', label: '殿堂级守护版', description: '私人医疗团队+抗衰管理+环球旅居', price: '50+', minAmount: 40, maxAmount: 80 },
        ];

        const careOptions = [
          { id: '本人父母', label: '本人父母' },
          { id: '未来伴侣父母', label: '未来伴侣父母' }
        ];

        return (
          <CareConfigWrapper
            careStandards={careStandards}
            careOptions={careOptions}
            confirmedConfig={confirmedConfig}
            onConfigChange={(selectedLevel, amount, recipients, startAge) => {
              setConfirmedConfig({
                selectedLevel,
                amount,
                recipients,
                startAge,
                isCustom: false
              });
              setIsConfigConfirmed(true);
            }}
          />
        );

      case 'family-support':
        return (
          <FamilySupportConfig
            initialData={optionalData.detailedConfigs?.familySupport}
            onConfigChange={(timeSegments, totalAmount) => {
              const segmentDescriptions = timeSegments.map(segment => 
                `${segment.startAge}-${segment.endAge}岁 ${segment.annualAmount}万元/年`
              ).join(', ');
              setConfirmedConfig({
                selectedLevel: segmentDescriptions,
                amount: totalAmount,
                isCustom: true,
                timeSegments
              });
              setIsConfigConfirmed(true);
            }}
          />
        );

      default:
        return (
          <div className="p-4 text-center text-gray-500">
            暂不支持此类支出的详细配置
          </div>
        );
    }
  };

  if (!item) return null;

  return (
    <>
      <Dialog open={isOpen && !showSuccessDialog} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Crown className="w-5 h-5 text-yellow-600" />
              {item.name}配置
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {renderConfigInterface()}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isConfigConfirmed}
              className="flex-1 bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] text-gray-900 hover:from-[#A5E0E4] hover:to-[#7DD3D7]"
            >
              确认配置
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={() => setShowSuccessDialog(false)}>
        <DialogContent className="max-w-sm">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              配置更新成功！
            </h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              您的支出规划已更新，这可能会影响您的财富分型和风险评估结果。建议查看最新的财富分型，了解调整后的财务状况变化。
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1 text-sm"
              >
                {isFromPaymentSuccess ? '继续调整' : '暂不查看，继续调整'}
              </Button>
              <Button
                onClick={handleViewResult}
                className="flex-1 bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] text-gray-900 hover:from-[#A5E0E4] hover:to-[#7DD3D7] text-sm"
              >
                {isFromPaymentSuccess ? '完成配置' : '查看最新财富分型'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// 简化的包装组件 - 移除本地状态，直接响应用户操作
const MarriageConfigWrapper: React.FC<{
  marriageStandards: any[];
  confirmedConfig?: any;
  onConfigChange: (selectedLevel: string, amount: number) => void;
}> = ({ marriageStandards, confirmedConfig, onConfigChange }) => {
  const [marriageAge, setMarriageAge] = React.useState('34');
  
  // 使用 confirmedConfig 或默认值，不使用本地状态
  const currentStandard = confirmedConfig?.selectedLevel || marriageStandards[0]?.value || '';
  
  const handleStandardChange = (standard: string) => {
    const selectedOption = marriageStandards.find(s => s.value === standard);
    if (selectedOption) {
      const amount = parseFloat(selectedOption.price);
      onConfigChange(standard, amount);
    }
  };

  return (
    <MarriageConfig
      marriageStandards={marriageStandards}
      selectedMarriageStandard={currentStandard}
      setSelectedMarriageStandard={handleStandardChange}
      customAmounts={{}}
      onEditAmount={() => {}}
      isConfirmed={false}
      marriageAge={marriageAge}
      setMarriageAge={setMarriageAge}
    />
  );
};

const BirthConfigWrapper: React.FC<{
  birthStandards: any[];
  confirmedConfig?: any;
  onConfigChange: (selectedLevel: string, amount: number, childrenCount: number, childrenAges?: string[]) => void;
}> = ({ birthStandards, confirmedConfig, onConfigChange }) => {
  const currentStandard = confirmedConfig?.selectedLevel || birthStandards[0]?.value || '';
  const [currentChildrenCount, setCurrentChildrenCount] = React.useState(confirmedConfig?.childrenCount || 1);
  const [childrenAges, setChildrenAges] = React.useState<string[]>(confirmedConfig?.childrenAges || []);
  
  const handleStandardChange = (standard: string) => {
    const selectedOption = birthStandards.find(s => s.value === standard);
    if (selectedOption) {
      const unitAmount = parseFloat(selectedOption.price);
      const totalAmount = unitAmount * currentChildrenCount;
      onConfigChange(standard, totalAmount, currentChildrenCount, childrenAges);
    }
  };

  const handleChildrenCountChange = (count: number) => {
    setCurrentChildrenCount(count);
    if (currentStandard) {
      const selectedOption = birthStandards.find(s => s.value === currentStandard);
      if (selectedOption) {
        const unitAmount = parseFloat(selectedOption.price);
        const totalAmount = unitAmount * count;
        onConfigChange(currentStandard, totalAmount, count, childrenAges);
      }
    }
  };

  // 更新年龄数据
  const handleChildrenAgesChange = (ages: string[]) => {
    setChildrenAges(ages);
    if (currentStandard) {
      const selectedOption = birthStandards.find(s => s.value === currentStandard);
      if (selectedOption) {
        const unitAmount = parseFloat(selectedOption.price);
        const totalAmount = unitAmount * currentChildrenCount;
        onConfigChange(currentStandard, totalAmount, currentChildrenCount, ages);
      }
    }
  };

  return (
    <BirthConfig
      birthStandards={birthStandards}
      childrenCount={currentChildrenCount}
      setChildrenCount={handleChildrenCountChange}
      selectedBirthStandard={currentStandard}
      setSelectedBirthStandard={handleStandardChange}
      customAmounts={{}}
      onEditAmount={() => {}}
      isConfirmed={false}
      childrenAges={childrenAges}
      setChildrenAges={handleChildrenAgesChange}
    />
  );
};

const CarConfigWrapper: React.FC<{
  carLevels: any[];
  confirmedConfig?: any;
  onConfigChange: (selectedLevel: string, amount: number, carCount: number, carPurchaseTimes?: string[]) => void;
}> = ({ carLevels, confirmedConfig, onConfigChange }) => {
  const currentLevel = confirmedConfig?.selectedLevel || carLevels[0]?.value || '';
  const currentCarCount = confirmedConfig?.carCount || 1;
  const [currentOwnedCars, setCurrentOwnedCars] = React.useState(0);
  const [carPurchaseTimes, setCarPurchaseTimes] = React.useState<string[]>(confirmedConfig?.carPurchaseTimes || []);
  
  const handleLevelChange = (level: string) => {
    const selectedOption = carLevels.find(l => l.value === level);
    if (selectedOption) {
      const unitAmount = parseFloat(selectedOption.price);
      const totalAmount = unitAmount * currentCarCount;
      onConfigChange(level, totalAmount, currentCarCount, carPurchaseTimes);
    }
  };

  const handleCarCountChange = (count: number) => {
    if (currentLevel) {
      const selectedOption = carLevels.find(l => l.value === currentLevel);
      if (selectedOption) {
        const unitAmount = parseFloat(selectedOption.price);
        const totalAmount = unitAmount * count;
        onConfigChange(currentLevel, totalAmount, count, carPurchaseTimes);
      }
    }
  };

  const updateCarPurchaseTime = (carIndex: number, time: string) => {
    const newTimes = [...carPurchaseTimes];
    newTimes[carIndex] = time;
    setCarPurchaseTimes(newTimes);
    
    // Also trigger config change to save the data
    if (currentLevel) {
      const selectedOption = carLevels.find(l => l.value === currentLevel);
      if (selectedOption) {
        const unitAmount = parseFloat(selectedOption.price);
        const totalAmount = unitAmount * currentCarCount;
        onConfigChange(currentLevel, totalAmount, currentCarCount, newTimes);
      }
    }
  };

  return (
    <CarConfig
      carLevels={carLevels}
      carCount={currentCarCount}
      setCarCount={handleCarCountChange}
      selectedCarLevel={currentLevel}
      setSelectedCarLevel={handleLevelChange}
      carLevelConfigs={[currentLevel]}
      updateCarLevel={() => {}}
      customAmounts={{}}
      onEditAmount={() => {}}
      isConfirmed={false}
      currentCarCount={currentOwnedCars}
      setCurrentCarCount={setCurrentOwnedCars}
      carPurchaseTimes={carPurchaseTimes}
      updateCarPurchaseTime={updateCarPurchaseTime}
    />
  );
};

const CareConfigWrapper: React.FC<{
  careStandards: any[];
  careOptions: any[];
  confirmedConfig?: any;
  onConfigChange: (selectedLevel: string, amount: number, recipients: string[], startAge: number) => void;
}> = ({ careStandards, careOptions, confirmedConfig, onConfigChange }) => {
  const currentStandard = confirmedConfig?.selectedLevel || careStandards[0]?.value || '';
  const currentRecipients = confirmedConfig?.recipients || [careOptions[0]?.id];
  const currentStartAge = confirmedConfig?.startAge || 35;
  
  // 将 recipients 数组转换为对象格式
  const selectedRecipients: {[key: string]: boolean} = {};
  currentRecipients.forEach((recipient: string) => {
    selectedRecipients[recipient] = true;
  });
  
  const handleStandardChange = (standard: string) => {
    const selectedOption = careStandards.find(s => s.value === standard);
    if (selectedOption) {
      const unitAmount = parseFloat(selectedOption.price);
      const recipientCount = currentRecipients.length;
      const yearsOfCare = Math.max(0, 85 - currentStartAge);
      const totalAmount = unitAmount * recipientCount * yearsOfCare;
      onConfigChange(standard, totalAmount, currentRecipients, currentStartAge);
    }
  };

  const handleRecipientToggle = (recipientId: string) => {
    const newRecipients = selectedRecipients[recipientId] 
      ? currentRecipients.filter((r: string) => r !== recipientId)
      : [...currentRecipients, recipientId];
    
    if (currentStandard && newRecipients.length > 0) {
      const selectedOption = careStandards.find(s => s.value === currentStandard);
      if (selectedOption) {
        const unitAmount = parseFloat(selectedOption.price);
        const yearsOfCare = Math.max(0, 85 - currentStartAge);
        const totalAmount = unitAmount * newRecipients.length * yearsOfCare;
        onConfigChange(currentStandard, totalAmount, newRecipients, currentStartAge);
      }
    }
  };

  const handleStartAgeChange = (age: number) => {
    if (currentStandard) {
      const selectedOption = careStandards.find(s => s.value === currentStandard);
      if (selectedOption) {
        const unitAmount = parseFloat(selectedOption.price);
        const yearsOfCare = Math.max(0, 85 - age);
        const totalAmount = unitAmount * currentRecipients.length * yearsOfCare;
        onConfigChange(currentStandard, totalAmount, currentRecipients, age);
      }
    }
  };

  return (
    <CareConfig
      careOptions={careOptions}
      careStandards={careStandards}
      selectedCareRecipients={selectedRecipients}
      handleCareRecipientToggle={handleRecipientToggle}
      careStartAge={currentStartAge}
      setCareStartAge={handleStartAgeChange}
      careCount={2}
      setCareCount={() => {}}
      careYears=""
      setCareYears={() => {}}
      selectedCareStandard={currentStandard}
      setSelectedCareStandard={handleStandardChange}
      customAmounts={{}}
      onEditAmount={() => {}}
      isConfirmed={false}
    />
  );
};

export default ExpenditureConfigModal;
