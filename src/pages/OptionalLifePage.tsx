import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Baby, Home, Car, Heart, Users, Plane, ArrowLeft } from 'lucide-react';
import AmountEditModal from '@/components/AmountEditModal';
import ModuleSelectionStep from '@/components/optional-life/ModuleSelectionStep';
import TotalExpenditureDisplay from '@/components/optional-life/TotalExpenditureDisplay';
import ConfigurationFlow from '@/components/optional-life/ConfigurationFlow';
import { useOptionalLifeState } from '@/hooks/useOptionalLifeState';

const OptionalLifePage = () => {
  const navigate = useNavigate();
  const state = useOptionalLifeState();

  // Standard data
  const marriageStandards = [
    { value: '不办婚礼', label: '不办婚礼', description: '不举办婚礼仪式，简单登记结婚', price: '0', icon: Heart, iconColor: 'text-gray-400', minAmount: 0, maxAmount: 3 },
    { value: '轻简甜蜜版', label: '轻简甜蜜版', description: '简约婚礼+周边蜜月+心意彩礼', price: '5', icon: Heart, iconColor: 'text-pink-400', minAmount: 3, maxAmount: 8 },
    { value: '温馨记忆版', label: '温馨记忆版', description: '主题婚礼+国内蜜月+传统彩礼', price: '10', icon: Heart, iconColor: 'text-amber-400', minAmount: 8, maxAmount: 15 },
    { value: '悦己臻选版', label: '悦己臻选版', description: '精致婚礼+海外蜜月+丰厚彩礼', price: '30', icon: Heart, iconColor: 'text-purple-400', minAmount: 20, maxAmount: 50 },
    { value: '梦幻绽放版', label: '梦幻绽放版', description: '豪华婚礼+浪漫蜜月+贵重彩礼', price: '60', icon: Heart, iconColor: 'text-rose-500', minAmount: 40, maxAmount: 300 },
  ];

  const birthStandards = [
    { value: '简约温馨版', label: '简约温馨版', description: '社区产检/公立生产/家人月子/基础育儿', price: '3', icon: Baby, iconColor: 'text-blue-400', minAmount: 2, maxAmount: 5 },
    { value: '精算优选版', label: '精算优选版', description: '私立产检/助产陪产/月嫂月子/早教启蒙', price: '10', icon: Baby, iconColor: 'text-green-400', minAmount: 8, maxAmount: 15 },
    { value: '品质护航版', label: '品质护航版', description: 'VIP产检/LDR分娩/月子会所/双语早教', price: '30', icon: Baby, iconColor: 'text-cyan-400', minAmount: 20, maxAmount: 50 },
    { value: '尊享定制版', label: '尊享定制版', description: '专家产检/无痛分娩/星级月子/国际早教', price: '80', icon: Baby, iconColor: 'text-indigo-500', minAmount: 60, maxAmount: 120 },
    { value: '星际臻享版', label: '星际臻享版', description: '定制产检/水中分娩/医护月子/海外早教', price: '150+', icon: Baby, iconColor: 'text-violet-500', minAmount: 120, maxAmount: 200 },
  ];

  const carLevels = [
    { value: '通勤神器', label: '通勤神器', description: '五菱宏光MINI EV、比亚迪海鸥', price: '8', icon: Car, iconColor: 'text-green-500', minAmount: 5, maxAmount: 15 },
    { value: '家庭旗舰', label: '家庭旗舰', description: '比亚迪宋PLUS、深蓝S7', price: '20', icon: Car, iconColor: 'text-blue-500', minAmount: 15, maxAmount: 30 },
    { value: '精英座驾', label: '精英座驾', description: '特斯拉Model 3、宝马i3', price: '40', icon: Car, iconColor: 'text-purple-500', minAmount: 30, maxAmount: 60 },
    { value: '豪华臻选', label: '豪华臻选', description: '蔚来ET7、奥迪Q5 e-tron', price: '60', icon: Car, iconColor: 'text-orange-500', minAmount: 50, maxAmount: 80 },
    { value: '巅峰性能', label: '巅峰性能', description: '保时捷Taycan、路特斯EVIJA', price: '100+', icon: Car, iconColor: 'text-red-500', minAmount: 80, maxAmount: 200 },
  ];

  const careStandards = [
    { value: '基础关怀版', label: '基础关怀版', description: '定期探望+基础生活费+社区医疗', price: '1', icon: Users, iconColor: 'text-green-400', minAmount: 0.5, maxAmount: 2 },
    { value: '舒心照料版', label: '舒心照料版', description: '专属营养餐+家庭医生+适老改造', price: '3', icon: Users, iconColor: 'text-blue-400', minAmount: 2, maxAmount: 5 },
    { value: '品质陪伴版', label: '品质陪伴版', description: '旅居疗养+健康管家+文娱课程', price: '8', icon: Users, iconColor: 'text-purple-400', minAmount: 5, maxAmount: 12 },
    { value: '尊享颐养版', label: '尊享颐养版', description: '高端养老社区+专属护理+全球疗养', price: '20', icon: Users, iconColor: 'text-orange-500', minAmount: 15, maxAmount: 30 },
    { value: '殿堂级守护版', label: '殿堂级守护版', description: '私人医疗团队+抗衰管理+环球旅居', price: '50+', icon: Users, iconColor: 'text-red-500', minAmount: 40, maxAmount: 80 },
  ];
  // Travel standards - 添加旅游标准
  const travelStandards = [
    { value: '丐帮流浪版', label: '丐帮流浪版', description: '逃票大师+睡沙发+便利店续命', price: '0.5', icon: Plane, iconColor: 'text-cyan-400', minAmount: 0.2, maxAmount: 1 },
    { value: '仓鼠囤货版', label: '仓鼠囤货版', description: '365天抢特价+自带泡面+平替之王', price: '1', icon: Plane, iconColor: 'text-blue-400', minAmount: 0.8, maxAmount: 2 },
    { value: '人间清醒版', label: '人间清醒版', description: '连锁酒店+网红店打卡+为"来都来了"咬牙', price: '2', icon: Plane, iconColor: 'text-orange-400', minAmount: 1.5, maxAmount: 3 },
    { value: '土豪撒钱版', label: '土豪撒钱版', description: '五星酒店+米其林+"全包起来"购物疗法', price: '5', icon: Plane, iconColor: 'text-purple-500', minAmount: 3, maxAmount: 8 },
    { value: '凡尔赛烦恼版', label: '凡尔赛烦恼版', description: '包场景点+管家伺候+"这季新品还没送来？"', price: '20', icon: Plane, iconColor: 'text-yellow-500', minAmount: 15, maxAmount: 30 },
  ];

  const careOptions = [
    { id: '本人父母', label: '本人父母' },
    { id: '未来伴侣父母', label: '未来伴侣父母' }
  ];

  // State for housing motives
  const [housingMotives, setHousingMotives] = useState<string[]>([]);

  // Module configuration - 添加旅游到模块列表
  const allModuleTabs = [
    { id: '结婚', name: '结婚', icon: Heart, color: 'text-pink-500' },
    { id: '生育', name: '生育', icon: Baby, color: 'text-blue-500' },
    { id: '购房', name: '购房', icon: Home, color: 'text-green-500' },
    { id: '购车', name: '购车', icon: Car, iconColor: 'text-purple-500' },
    { id: '旅游', name: '旅游', icon: Plane, color: 'text-cyan-500' },
    { id: '赡养', name: '赡养', icon: Users, color: 'text-orange-500' }
  ];

  const moduleTabs = state.isMarried 
    ? allModuleTabs.filter(tab => tab.id !== '结婚')
    : allModuleTabs;

  const filteredModuleTabs = moduleTabs.filter(tab => state.selectedModules.includes(tab.id));

  // Calculate total expenditure
  const { totalAmount, breakdown } = useMemo(() => {
    let total = 0;
    const breakdown: any = {};

    // Marriage (one-time)
    if (state.selectedModules.includes('结婚') && state.configConfirmed['结婚']) {
      const confirmedConfig = state.confirmedConfigs['结婚'];
      if (confirmedConfig) {
        breakdown.marriage = confirmedConfig.amount;
        total += confirmedConfig.amount;
      }
    }

    // Birth (one-time, multiplied by children count)
    if (state.selectedModules.includes('生育') && state.configConfirmed['生育']) {
      const confirmedConfig = state.confirmedConfigs['生育'];
      if (confirmedConfig) {
        const amount = confirmedConfig.amount * confirmedConfig.childrenCount;
        breakdown.birth = amount;
        total += amount;
      }
    }

    // Housing (from HousePlanSelector)
    if (state.selectedModules.includes('购房') && state.configConfirmed['购房']) {
      const confirmedConfig = state.confirmedConfigs['购房'];
      if (confirmedConfig) {
        breakdown.housing = confirmedConfig.amount;
        total += confirmedConfig.amount;
      }
    }

    // Car (one-time, based on car count and levels)
    if (state.selectedModules.includes('购车') && state.configConfirmed['购车']) {
      const confirmedConfig = state.confirmedConfigs['购车'];
      if (confirmedConfig) {
        breakdown.car = confirmedConfig.amount;
        total += confirmedConfig.amount;
      }
    }

    // Travel (ongoing, calculated as total over years)
    if (state.selectedModules.includes('旅游') && state.configConfirmed['旅游']) {
      const confirmedConfig = state.confirmedConfigs['旅游'];
      if (confirmedConfig) {
        breakdown.travel = confirmedConfig.amount;
        total += confirmedConfig.amount;
      }
    }

    // Care (ongoing, calculated as total over care period)
    if (state.selectedModules.includes('赡养') && state.configConfirmed['赡养']) {
      const confirmedConfig = state.confirmedConfigs['赡养'];
      if (confirmedConfig) {
        breakdown.care = confirmedConfig.amount;
        total += confirmedConfig.amount;
      }
    }

    return { totalAmount: total, breakdown };
  }, [state.selectedModules, state.configConfirmed, state.confirmedConfigs]);

  // Event handlers
  const handleModuleToggle = (moduleId: string) => {
    state.setSelectedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const proceedToConfiguration = () => {
    if (state.selectedModules.length > 0) {
      state.setCurrentStep(2);
      state.setCurrentCardIndex(0);
    } else {
      // Save empty optional life data and go directly to required-life
      const optionalLifeData = { totalAmount: 0, breakdown: {}, selectedModules: [] };
      localStorage.setItem('optionalLifeData', JSON.stringify(optionalLifeData));
      navigate('/required-life');
    }
  };

  const backToSelection = () => {
    state.setCurrentStep(1);
    state.setCurrentCardIndex(0);
  };

  const handleCareRecipientToggle = (recipientId: string) => {
    state.setSelectedCareRecipients({
      ...state.selectedCareRecipients,
      [recipientId]: !state.selectedCareRecipients[recipientId]
    });
  };

  const updateCarLevel = (carIndex: number, level: string) => {
    const newConfigs = [...state.carLevelConfigs];
    newConfigs[carIndex] = level;
    state.setCarLevelConfigs(newConfigs);
  };

  const openEditModal = (option: any) => {
    state.setEditingOption(option);
    state.setEditModalOpen(true);
  };

  const saveAmount = (newAmount: string) => {
    if (state.editingOption && filteredModuleTabs[state.currentCardIndex]) {
      const currentModule = filteredModuleTabs[state.currentCardIndex];
      const key = `${currentModule.id}-${state.editingOption.value}`;
      state.setCustomAmounts({
        ...state.customAmounts,
        [key]: newAmount
      });
    }
  };

  // Handle housing data change with motives
  const handleHousingDataChange = (totalAmount: number, motives: string[]) => {
    console.log('OptionalLifePage: Received housing data:', { totalAmount, motives });
    state.setHousingTotalAmount(totalAmount);
    setHousingMotives(motives);
  };

  // Fixed completeSelection to properly save all configuration data
  const completeSelection = () => {
    // Collect complete configuration data
    const detailedConfigs: any = {};
    
    // Marriage configuration
    if (state.selectedModules.includes('结婚') && state.configConfirmed['结婚']) {
      detailedConfigs.marriage = {
        standard: state.selectedMarriageStandard,
        hasPartner: state.hasMarriagePartner,
        partnerBirthYear: state.partnerBirthYear,
        amount: state.confirmedConfigs['结婚']?.amount || 0
      };
    }

    // Travel configuration - 添加旅游配置保存
    if (state.selectedModules.includes('旅游') && state.configConfirmed['旅游']) {
      const travelConfig = state.confirmedConfigs['旅游'];
      detailedConfigs.travel = {
        standard: travelConfig?.standard || state.selectedTravelStandard,
        yearlyAmount: travelConfig?.yearlyAmount || 0,
        amount: travelConfig?.amount || 0
      };
    }

    // Birth configuration
    if (state.selectedModules.includes('生育') && state.configConfirmed['生育']) {
      detailedConfigs.birth = {
        standard: state.selectedBirthStandard,
        childrenCount: state.childrenCount,
        amount: state.confirmedConfigs['生育']?.amount || 0
      };
    }

    // Housing configuration - properly save motives from confirmed config
    if (state.selectedModules.includes('购房') && state.configConfirmed['购房']) {
      const housingConfig = state.confirmedConfigs['购房'];
      console.log('Housing config being saved:', housingConfig);
      detailedConfigs.housing = {
        motives: housingConfig?.motives || housingMotives || [],
        amount: housingConfig?.amount || 0
      };
    }

    // Car configuration
    if (state.selectedModules.includes('购车') && state.configConfirmed['购车']) {
      detailedConfigs.car = {
        count: state.carCount,
        levels: state.carLevelConfigs.slice(0, state.carCount),
        amount: state.confirmedConfigs['购车']?.amount || 0
      };
    }

    // Care configuration - properly save standard from confirmed config
    if (state.selectedModules.includes('赡养') && state.configConfirmed['赡养']) {
      const careConfig = state.confirmedConfigs['赡养'];
      
      console.log('Care config being saved:', careConfig);
      
      detailedConfigs.care = {
        standard: careConfig?.standard || state.selectedCareStandard,
        recipients: Object.keys(state.selectedCareRecipients).filter(
          key => state.selectedCareRecipients[key]
        ),
        startAge: careConfig?.careStartAge || state.careStartAge,
        yearlyAmount: careConfig?.yearlyAmount || 0,
        amount: careConfig?.amount || 0
      };
      
      // Update breakdown with correct care amount
      breakdown.care = careConfig?.amount || 0;
    }

    const optionalLifeData = { 
      totalAmount, 
      breakdown, 
      selectedModules: state.selectedModules,
      detailedConfigs
    };
    
    console.log('Saving complete optional life data:', optionalLifeData);
    localStorage.setItem('optionalLifeData', JSON.stringify(optionalLifeData));
    navigate('/required-life');
  };

  const goToPreviousCard = () => {
    if (state.currentCardIndex > 0) {
      state.setCurrentCardIndex(state.currentCardIndex - 1);
      state.setConfirmedConfigs({
        ...state.confirmedConfigs,
        [filteredModuleTabs[state.currentCardIndex].id]: undefined
      });
      state.setConfigConfirmed({
        ...state.configConfirmed,
        [filteredModuleTabs[state.currentCardIndex].id]: false
      });
    } else {
      backToSelection();
    }
  };

  const goBack = () => {
    if (state.currentStep === 2) {
      backToSelection();
    } else {
      navigate('/personal-info');
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            state.currentStep >= 1 ? 'bg-[#B3EBEF] text-gray-900' : 'bg-gray-200 text-gray-500'
          }`}>
            1
          </div>
          <span className={`text-sm font-medium ${state.currentStep >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>
            选择大事
          </span>
        </div>
        
        <div className={`w-8 h-0.5 ${state.currentStep >= 2 ? 'bg-[#B3EBEF]' : 'bg-gray-200'}`}></div>
        
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            state.currentStep >= 2 ? 'bg-[#B3EBEF] text-gray-900' : 'bg-gray-200 text-gray-500'
          }`}>
            2
          </div>
          <span className={`text-sm font-medium ${state.currentStep >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>
            配置支出
          </span>
        </div>
      </div>
    );
  };

  // Module configuration props
  const moduleConfigProps = {
    marriageStandards,
    birthStandards,
    carLevels,
    careStandards,
    careOptions,
    travelStandards,
    hasMarriagePartner: state.hasMarriagePartner,
    setHasMarriagePartner: state.setHasMarriagePartner,
    partnerBirthYear: state.partnerBirthYear,
    setPartnerBirthYear: state.setPartnerBirthYear,
    marriageAge: state.marriageAge,
    setMarriageAge: state.setMarriageAge,
    idealPartnerAge: state.idealPartnerAge,
    setIdealPartnerAge: state.setIdealPartnerAge,
    selectedMarriageStandard: state.selectedMarriageStandard,
    setSelectedMarriageStandard: state.setSelectedMarriageStandard,
    selectedBirthStandard: state.selectedBirthStandard,
    setSelectedBirthStandard: state.setSelectedBirthStandard,
    childrenCount: state.childrenCount,
    setChildrenCount: state.setChildrenCount,
    carCount: state.carCount,
    setCarCount: state.setCarCount,
    currentCarCount: state.currentCarCount,
    setCurrentCarCount: state.setCurrentCarCount,
    selectedCarLevel: state.selectedCarLevel,
    setSelectedCarLevel: state.setSelectedCarLevel,
    carLevelConfigs: state.carLevelConfigs,
    updateCarLevel,
    selectedCareRecipients: state.selectedCareRecipients,
    handleCareRecipientToggle,
    careStartAge: state.careStartAge,
    setCareStartAge: state.setCareStartAge,
    careCount: state.careCount,
    setCareCount: state.setCareCount,
    careYears: state.careYears,
    setCareYears: state.setCareYears,
    selectedCareStandard: state.selectedCareStandard,
    setSelectedCareStandard: state.setSelectedCareStandard,
    selectedTravelStandard: state.selectedTravelStandard,
    setSelectedTravelStandard: state.setSelectedTravelStandard,
    customAmounts: state.customAmounts,
    onEditAmount: openEditModal,
    handleHousingDataChange,
    getDisplayAmount: state.getDisplayAmount,
    housingTotalAmount: state.housingTotalAmount,
    housingMotives: housingMotives
  };

  return (
    <div className="min-h-screen bg-[#F4FDFD] flex flex-col">
      <div className="relative flex flex-col bg-white/90 backdrop-blur-xl flex-1">
        {/* Page header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#B3EBEF]/20 via-white/60 to-[#B3EBEF]/20">
          <div className="relative p-2 text-center flex flex-col justify-center" style={{ minHeight: '64px' }}>
            <h1 className="text-lg font-bold text-gray-900 mb-1 tracking-tight">
              选择非刚需支出水平
            </h1>
            
          </div>
        </div>

        {/* Total Expenditure Display - Only show in step 2 when modules are selected */}
        {state.currentStep === 2 && state.selectedModules.length > 0 && (
          <div className="px-3">
            <TotalExpenditureDisplay
              totalAmount={totalAmount}
              breakdown={breakdown}
              selectedModules={state.selectedModules}
            />
          </div>
        )}

        {state.currentStep === 1 ? (
          // Step 1: Module selection
          <div className="flex-1 p-3 overflow-y-auto pb-28">
            <div className="max-w-2xl mx-auto">
              {renderStepIndicator()}
              <ModuleSelectionStep
                selectedModules={state.selectedModules}
                onModuleToggle={handleModuleToggle}
                onContinue={proceedToConfiguration}
                availableModules={moduleTabs}
              />
            </div>
          </div>
        ) : (
          // Step 2: Card flow configuration
          <ConfigurationFlow
            filteredModuleTabs={filteredModuleTabs}
            currentCardIndex={state.currentCardIndex}
            setCurrentCardIndex={state.setCurrentCardIndex}
            configConfirmed={state.configConfirmed}
            setConfigConfirmed={state.setConfigConfirmed}
            confirmedConfigs={state.confirmedConfigs}
            setConfirmedConfigs={state.setConfirmedConfigs}
            showProjectList={state.showProjectList}
            setShowProjectList={state.setShowProjectList}
            onGoToPreviousCard={goToPreviousCard}
            onCompleteSelection={completeSelection}
            onBackToSelection={backToSelection}
            moduleConfigProps={moduleConfigProps}
          />
        )}

        {/* Bottom confirmation button - only show in step 1 */}
        {state.currentStep === 1 && (
          <div className="fixed bottom-0 left-0 right-0 z-50 p-2 space-y-3 bg-gradient-to-t from-white via-white/95 to-white/90 backdrop-blur-xl border-t border-gray-100 pb-safe" 
               style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
            <div className="flex gap-2">
              <Button 
                onClick={goBack}
                className="flex-1 py-2 text-gray-700 font-bold rounded-2xl text-xs shadow-lg transform hover:scale-[1.02] transition-all duration-300 border border-gray-300 bg-white hover:bg-gray-50"
                variant="outline"
              >
                <span className="flex items-center justify-center gap-2">
                  <ArrowLeft className="w-3 h-3" />
                  返回上一页
                </span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Amount edit modal */}
      <AmountEditModal
        isOpen={state.editModalOpen}
        onClose={() => state.setEditModalOpen(false)}
        onSave={saveAmount}
        currentAmount={state.editingOption && filteredModuleTabs[state.currentCardIndex] ? (state.customAmounts[`${filteredModuleTabs[state.currentCardIndex].id}-${state.editingOption.value}`] || state.editingOption.price) : ''}
        itemName={state.editingOption ? state.editingOption.label : ''}
        minAmount={state.editingOption ? state.editingOption.minAmount : 0}
        maxAmount={state.editingOption ? state.editingOption.maxAmount : 100}
        unit="万"
      />
    </div>
  );
};

export default OptionalLifePage;
