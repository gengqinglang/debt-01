
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ProgressIndicator from '@/components/optional-life/ProgressIndicator';
import ConfigurationConfirmation from '@/components/optional-life/ConfigurationConfirmation';
import MarriageConfig from '@/components/optional-life/modules/MarriageConfig';
import BirthConfig from '@/components/optional-life/modules/BirthConfig';
import HousingConfig from '@/components/optional-life/modules/HousingConfig';
import CarConfig from '@/components/optional-life/modules/CarConfig';
import CareConfig from '@/components/optional-life/modules/CareConfig';
import TravelConfig from '@/components/optional-life/modules/TravelConfig';

interface ConfigurationFlowProps {
  filteredModuleTabs: any[];
  currentCardIndex: number;
  setCurrentCardIndex: (index: number) => void;
  configConfirmed: {[key: string]: boolean};
  setConfigConfirmed: (config: {[key: string]: boolean}) => void;
  confirmedConfigs: {[key: string]: any};
  setConfirmedConfigs: (configs: {[key: string]: any}) => void;
  showProjectList: boolean;
  setShowProjectList: (show: boolean) => void;
  onGoToPreviousCard: () => void;
  onCompleteSelection: () => void;
  onBackToSelection: () => void;
  moduleConfigProps: any;
}

const ConfigurationFlow: React.FC<ConfigurationFlowProps> = ({
  filteredModuleTabs,
  currentCardIndex,
  setCurrentCardIndex,
  configConfirmed,
  setConfigConfirmed,
  confirmedConfigs,
  setConfirmedConfigs,
  showProjectList,
  setShowProjectList,
  onGoToPreviousCard,
  onCompleteSelection,
  onBackToSelection,
  moduleConfigProps
}) => {
  const currentModule = filteredModuleTabs[currentCardIndex];
  const isLastCard = currentCardIndex === filteredModuleTabs.length - 1;
  const isCurrentTabConfirmed = configConfirmed[currentModule?.id];

  // Check if car configuration can be confirmed
  const canConfirmCarConfig = () => {
    if (currentModule?.id !== '购车') return true;
    
    if (moduleConfigProps.carCount === 1) {
      return true; // Single car can always be confirmed
    } else {
      // For 2 cars, need to check if both steps are completed
      // This logic should match the CarConfig component's internal state
      return true; // Let CarConfig handle its own confirmation flow
    }
  };

  // Confirm current module configuration
  const confirmCurrentModuleConfig = () => {
    if (!currentModule) return;

    let configSnapshot: any = {};

    switch (currentModule.id) {
      case '结婚':
        const marriageOption = moduleConfigProps.marriageStandards.find(
          (s: any) => s.value === moduleConfigProps.selectedMarriageStandard
        );
        if (marriageOption) {
          configSnapshot = {
            amount: moduleConfigProps.getDisplayAmount(marriageOption, '结婚'),
            standard: moduleConfigProps.selectedMarriageStandard
          };
        }
        break;

      case '生育':
        const birthOption = moduleConfigProps.birthStandards.find(
          (s: any) => s.value === moduleConfigProps.selectedBirthStandard
        );
        if (birthOption) {
          configSnapshot = {
            amount: moduleConfigProps.getDisplayAmount(birthOption, '生育'),
            standard: moduleConfigProps.selectedBirthStandard,
            childrenCount: moduleConfigProps.childrenCount
          };
        }
        break;

      case '购房':
        // Save housing data with motives
        console.log('ConfigurationFlow: Saving housing config with motives:', moduleConfigProps.housingMotives);
        configSnapshot = {
          amount: moduleConfigProps.housingTotalAmount,
          motives: moduleConfigProps.housingMotives || []
        };
        break;

      case '购车':
        let carTotal = 0;
        if (moduleConfigProps.carCount === 1) {
          const carOption = moduleConfigProps.carLevels.find(
            (l: any) => l.value === moduleConfigProps.selectedCarLevel
          );
          if (carOption) {
            carTotal = moduleConfigProps.getDisplayAmount(carOption, '购车');
          }
        } else {
          moduleConfigProps.carLevelConfigs.slice(0, moduleConfigProps.carCount).forEach((level: string, index: number) => {
            const carOption = moduleConfigProps.carLevels.find((l: any) => l.value === level);
            if (carOption) {
              carTotal += moduleConfigProps.getDisplayAmount(carOption, `购车-${index}`);
            }
          });
        }
        configSnapshot = {
          amount: carTotal,
          carCount: moduleConfigProps.carCount,
          selectedCarLevel: moduleConfigProps.selectedCarLevel,
          carLevelConfigs: [...moduleConfigProps.carLevelConfigs]
        };
        break;

      case '旅游':
        const travelOption = moduleConfigProps.travelStandards.find(
          (s: any) => s.value === moduleConfigProps.selectedTravelStandard
        );
        if (travelOption) {
          const annualAmount = moduleConfigProps.getDisplayAmount(travelOption, '旅游');
          const travelYears = 30; // 30年旅游支出
          const travelTotal = annualAmount * travelYears;
          configSnapshot = {
            amount: travelTotal,
            standard: moduleConfigProps.selectedTravelStandard,
            yearlyAmount: annualAmount
          };
        }
        break;

      case '赡养':
        const careOption = moduleConfigProps.careStandards.find(
          (s: any) => s.value === moduleConfigProps.selectedCareStandard
        );
        if (careOption) {
          // 获取年度金额
          const annualAmount = moduleConfigProps.getDisplayAmount(careOption, '赡养');
          // 计算赡养年限（从开始年龄到85岁）
          const careYears = Math.max(0, 85 - moduleConfigProps.careStartAge);
          // 计算选择的赡养对象数量
          const recipientCount = Object.values(moduleConfigProps.selectedCareRecipients).filter(Boolean).length;
          // 计算总金额：年度金额 × 年限 × 人数
          const careTotal = annualAmount * careYears * recipientCount;
          
          console.log('ConfigurationFlow: 赡养配置计算详情:', {
            standard: moduleConfigProps.selectedCareStandard,
            annualAmount,
            careYears,
            recipientCount,
            careStartAge: moduleConfigProps.careStartAge,
            selectedRecipients: moduleConfigProps.selectedCareRecipients,
            careTotal
          });
          
          configSnapshot = {
            amount: careTotal,
            standard: moduleConfigProps.selectedCareStandard,
            yearlyAmount: annualAmount,
            selectedCareRecipients: {...moduleConfigProps.selectedCareRecipients},
            careStartAge: moduleConfigProps.careStartAge
          };
        }
        break;
    }

    console.log(`ConfigurationFlow: Saving ${currentModule.id} config:`, configSnapshot);

    setConfirmedConfigs({
      ...confirmedConfigs,
      [currentModule.id]: configSnapshot
    });

    setConfigConfirmed({
      ...configConfirmed,
      [currentModule.id]: true
    });

    // If this is the last card, complete selection directly
    if (isLastCard) {
      onCompleteSelection();
    } else {
      setCurrentCardIndex(currentCardIndex + 1);
      // Scroll to top when switching to next module
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  // Edit current module configuration
  const editCurrentModuleConfig = () => {
    setConfigConfirmed({
      ...configConfirmed,
      [currentModule.id]: false
    });
  };

  // Check if all configs are confirmed
  const allConfigsConfirmed = () => {
    return filteredModuleTabs.every(tab => configConfirmed[tab.id]);
  };

  // Render module configuration content
  const renderModuleContent = () => {
    if (!currentModule) return null;

    switch (currentModule.id) {
      case '结婚':
        return (
          <MarriageConfig
            marriageStandards={moduleConfigProps.marriageStandards}
            selectedMarriageStandard={moduleConfigProps.selectedMarriageStandard}
            setSelectedMarriageStandard={moduleConfigProps.setSelectedMarriageStandard}
            customAmounts={moduleConfigProps.customAmounts}
            onEditAmount={moduleConfigProps.onEditAmount}
            isConfirmed={isCurrentTabConfirmed}
            hasMarriagePartner={moduleConfigProps.hasMarriagePartner}
            setHasMarriagePartner={moduleConfigProps.setHasMarriagePartner}
            partnerBirthYear={moduleConfigProps.partnerBirthYear}
            setPartnerBirthYear={moduleConfigProps.setPartnerBirthYear}
            marriageAge={moduleConfigProps.marriageAge}
            setMarriageAge={moduleConfigProps.setMarriageAge}
            idealPartnerAge={moduleConfigProps.idealPartnerAge}
            setIdealPartnerAge={moduleConfigProps.setIdealPartnerAge}
          />
        );

      case '生育':
        return (
          <BirthConfig
            birthStandards={moduleConfigProps.birthStandards}
            childrenCount={moduleConfigProps.childrenCount}
            setChildrenCount={moduleConfigProps.setChildrenCount}
            selectedBirthStandard={moduleConfigProps.selectedBirthStandard}
            setSelectedBirthStandard={moduleConfigProps.setSelectedBirthStandard}
            customAmounts={moduleConfigProps.customAmounts}
            onEditAmount={moduleConfigProps.onEditAmount}
            isConfirmed={isCurrentTabConfirmed}
          />
        );

      case '购房':
        return (
          <HousingConfig
            onHousingDataChange={moduleConfigProps.handleHousingDataChange}
          />
        );

      case '购车':
        return (
           <CarConfig
            carLevels={moduleConfigProps.carLevels}
            carCount={moduleConfigProps.carCount}
            setCarCount={moduleConfigProps.setCarCount}
            selectedCarLevel={moduleConfigProps.selectedCarLevel}
            setSelectedCarLevel={moduleConfigProps.setSelectedCarLevel}
            carLevelConfigs={moduleConfigProps.carLevelConfigs}
            updateCarLevel={moduleConfigProps.updateCarLevel}
            customAmounts={moduleConfigProps.customAmounts}
            onEditAmount={moduleConfigProps.onEditAmount}
            isConfirmed={isCurrentTabConfirmed}
            currentCarCount={moduleConfigProps.currentCarCount}
            setCurrentCarCount={moduleConfigProps.setCurrentCarCount}
            carPurchaseTimes={moduleConfigProps.carPurchaseTimes || []}
            updateCarPurchaseTime={moduleConfigProps.updateCarPurchaseTime || (() => {})}
          />
        );

      case '赡养':
        return (
          <CareConfig
            careOptions={moduleConfigProps.careOptions}
            careStandards={moduleConfigProps.careStandards}
            selectedCareRecipients={moduleConfigProps.selectedCareRecipients}
            handleCareRecipientToggle={moduleConfigProps.handleCareRecipientToggle}
            careStartAge={moduleConfigProps.careStartAge}
            setCareStartAge={moduleConfigProps.setCareStartAge}
            careCount={moduleConfigProps.careCount}
            setCareCount={moduleConfigProps.setCareCount}
            careYears={moduleConfigProps.careYears}
            setCareYears={moduleConfigProps.setCareYears}
            selectedCareStandard={moduleConfigProps.selectedCareStandard}
            setSelectedCareStandard={moduleConfigProps.setSelectedCareStandard}
            customAmounts={moduleConfigProps.customAmounts}
            onEditAmount={moduleConfigProps.onEditAmount}
            isConfirmed={isCurrentTabConfirmed}
          />
        );

      case '旅游':
        return (
          <TravelConfig
            travelStandards={moduleConfigProps.travelStandards}
            selectedTravelStandard={moduleConfigProps.selectedTravelStandard}
            setSelectedTravelStandard={moduleConfigProps.setSelectedTravelStandard}
            customAmounts={moduleConfigProps.customAmounts}
            onEditAmount={moduleConfigProps.onEditAmount}
            isConfirmed={isCurrentTabConfirmed}
          />
        );

      default:
        return null;
    }
  };

  // Show current module configuration
  return (
    <div className="flex-1 flex flex-col">
      <ProgressIndicator
        currentCardIndex={currentCardIndex}
        filteredModuleTabs={filteredModuleTabs}
        configConfirmed={configConfirmed}
        showProjectList={showProjectList}
        setShowProjectList={setShowProjectList}
      />

      {/* Module content */}
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {/* Module title section - matching required-life style */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{currentModule?.name}规划</h2>
            <p className="text-sm text-gray-600">请选择您期待的标准</p>
          </div>

          {renderModuleContent()}
          
          <ConfigurationConfirmation
            isConfirmed={isCurrentTabConfirmed}
            onConfirm={confirmCurrentModuleConfig}
            onEdit={editCurrentModuleConfig}
            canConfirm={canConfirmCarConfig()}
          />
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-2 space-y-3 bg-gradient-to-t from-white via-white/95 to-white/90 backdrop-blur-xl border-t border-gray-100 pb-safe" 
           style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
        <div className="flex gap-2">
          <Button 
            onClick={onGoToPreviousCard}
            className="flex-1 py-2 text-gray-700 font-bold rounded-2xl text-xs shadow-lg transform hover:scale-[1.02] transition-all duration-300 border border-gray-300 bg-white hover:bg-gray-50"
            variant="outline"
          >
            <span className="flex items-center justify-center gap-2">
              <ArrowLeft className="w-3 h-3" />
              {currentCardIndex === 0 ? '重新选择大事' : '上一个'}
            </span>
          </Button>
          
          {allConfigsConfirmed() && (
            <Button 
              onClick={onCompleteSelection}
              className="flex-1 py-2 font-bold rounded-2xl text-xs shadow-xl transform hover:scale-[1.02] transition-all duration-300 border-0 bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] hover:from-[#A0E4E9] hover:to-[#7DD3D7] text-gray-900"
            >
              <span className="flex items-center justify-center gap-2">
                完成配置
                <ArrowRight className="w-3 h-3" />
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigurationFlow;
