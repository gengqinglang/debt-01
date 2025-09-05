
import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export const useOptionalLifeState = () => {
  const location = useLocation();
  
  // Get marital status from navigation state
  const maritalStatus = location.state?.maritalStatus;
  const isMarried = maritalStatus === 'married-no-child' || maritalStatus === 'married-with-child';
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Configuration confirmation states
  const [configConfirmed, setConfigConfirmed] = useState<{[key: string]: boolean}>({});
  const [confirmedConfigs, setConfirmedConfigs] = useState<{[key: string]: any}>({});

  // Custom amounts state
  const [customAmounts, setCustomAmounts] = useState<{[key: string]: string}>({});

  // Edit modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<any>(null);

  // Housing data state
  const [housingTotalAmount, setHousingTotalAmount] = useState(0);

  // Configuration states
  const [hasMarriagePartner, setHasMarriagePartner] = useState<boolean | null>(null);
  const [partnerBirthYear, setPartnerBirthYear] = useState('');
  const [marriageAge, setMarriageAge] = useState<string>('32');
  const [idealPartnerAge, setIdealPartnerAge] = useState<string>('30');
  const [selectedMarriageStandard, setSelectedMarriageStandard] = useState('梦幻绽放版');
  const [selectedBirthStandard, setSelectedBirthStandard] = useState('品质护航版');
  const [childrenCount, setChildrenCount] = useState(1);
  const [carCount, setCarCount] = useState(1);
  const [currentCarCount, setCurrentCarCount] = useState(0);
  const [selectedCarLevel, setSelectedCarLevel] = useState('通勤神器');
  const [carLevelConfigs, setCarLevelConfigs] = useState<string[]>(['通勤神器', '通勤神器']);
  const [selectedCareRecipients, setSelectedCareRecipients] = useState<{[key: string]: boolean}>({});
  const [careStartAge, setCareStartAge] = useState(40);
  const [careCount, setCareCount] = useState(2); // 默认2个人
  const [careYears, setCareYears] = useState('10'); // 默认10年
  const [selectedCareStandard, setSelectedCareStandard] = useState('舒心照料版');
  const [selectedTravelStandard, setSelectedTravelStandard] = useState('人间清醒版');

  // Project list state
  const [showProjectList, setShowProjectList] = useState(false);

  // Housing data callback
  const handleHousingDataChange = useCallback((totalAmount: number) => {
    setHousingTotalAmount(totalAmount);
  }, []);

  // Helper function to get display amount
  const getDisplayAmount = (option: any, tabKey?: string) => {
    const key = tabKey ? `${tabKey}-${option.value}` : `${option.value}`;
    const customAmount = customAmounts[key];
    if (customAmount) {
      return tabKey ? parseFloat(customAmount) : customAmount;
    }
    const defaultPrice = option.price?.replace('+', '') || '0';
    return tabKey ? parseFloat(defaultPrice) : defaultPrice;
  };

  return {
    // Basic states
    isMarried,
    currentStep,
    setCurrentStep,
    selectedModules,
    setSelectedModules,
    currentCardIndex,
    setCurrentCardIndex,
    
    // Configuration states
    configConfirmed,
    setConfigConfirmed,
    confirmedConfigs,
    setConfirmedConfigs,
    customAmounts,
    setCustomAmounts,
    
    // Modal states
    editModalOpen,
    setEditModalOpen,
    editingOption,
    setEditingOption,
    
    // Housing states
    housingTotalAmount,
    setHousingTotalAmount,
    handleHousingDataChange,
    
    // Module configuration states
    hasMarriagePartner,
    setHasMarriagePartner,
    partnerBirthYear,
    setPartnerBirthYear,
    marriageAge,
    setMarriageAge,
    idealPartnerAge,
    setIdealPartnerAge,
    selectedMarriageStandard,
    setSelectedMarriageStandard,
    selectedBirthStandard,
    setSelectedBirthStandard,
    childrenCount,
    setChildrenCount,
    carCount,
    setCarCount,
    currentCarCount,
    setCurrentCarCount,
    selectedCarLevel,
    setSelectedCarLevel,
    carLevelConfigs,
    setCarLevelConfigs,
    selectedCareRecipients,
    setSelectedCareRecipients,
    careStartAge,
    setCareStartAge,
    careCount,
    setCareCount,
    careYears,
    setCareYears,
    selectedCareStandard,
    setSelectedCareStandard,
    selectedTravelStandard,
    setSelectedTravelStandard,
    
    // Project list state
    showProjectList,
    setShowProjectList,
    
    // Helper functions
    getDisplayAmount
  };
};
