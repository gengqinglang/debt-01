import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';

interface CareerStage {
  id: string;
  stageName: string;
  position: string;
  description: string;
  ageRange: string;
  yearlyIncome: number;
  duration: string;
}

interface CareerStageInput {
  id: string;
  stageName: string;
  startYear: number;
  endYear: number;
  annualIncome: number; // in 万元
}

interface CareerDataContextType {
  // Personal career data
  currentJob: string;
  setCurrentJob: (job: string) => void;
  jobLevel: string;
  setJobLevel: (level: string) => void;
  careerPlan: CareerStage[];
  setCareerPlan: (plan: CareerStage[]) => void;
  
  // Partner career data
  partnerJob: string;
  setPartnerJob: (job: string) => void;
  partnerLevel: string;
  setPartnerLevel: (level: string) => void;
  partnerCareerPlan: CareerStage[];
  setPartnerCareerPlan: (plan: CareerStage[]) => void;
  
  // Updated work status - simplified
  personalCurrentStatus: 'not-retired' | 'retired';
  setPersonalCurrentStatus: (status: 'not-retired' | 'retired') => void;
  partnerCurrentStatus: 'not-retired' | 'retired';
  setPartnerCurrentStatus: (status: 'not-retired' | 'retired') => void;
  
  // Career stages for planning
  personalCareerStages: CareerStageInput[];
  setPersonalCareerStages: (stages: CareerStageInput[]) => void;
  partnerCareerStages: CareerStageInput[];
  setPartnerCareerStages: (stages: CareerStageInput[]) => void;
  
  // Current income and career outlook
  personalCurrentIncome: string;
  setPersonalCurrentIncome: (income: string) => void;
  personalCareerOutlook: string;
  setPersonalCareerOutlook: (outlook: string) => void;
  partnerCurrentIncome: string;
  setPartnerCurrentIncome: (income: string) => void;
  partnerCareerOutlook: string;
  setPartnerCareerOutlook: (outlook: string) => void;
  
  // Start work age and retirement income
  personalStartWorkAge: string;
  setPersonalStartWorkAge: (age: string) => void;
  personalRetirementIncome: string;
  setPersonalRetirementIncome: (income: string) => void;
  personalRetirementAge: string;
  setPersonalRetirementAge: (age: string) => void;
  partnerStartWorkAge: string;
  setPartnerStartWorkAge: (age: string) => void;
  partnerRetirementIncome: string;
  setPartnerRetirementIncome: (income: string) => void;
  partnerRetirementAge: string;
  setPartnerRetirementAge: (age: string) => void;
  
  // Calculated values
  personalTotalIncome: number;
  partnerTotalIncome: number;
  combinedTotalIncome: number;
  hasAnyCareerPlan: boolean;
  
  // Progressive calculation values
  personalProgressiveIncome: number;
  partnerProgressiveIncome: number;
  combinedProgressiveIncome: number;
  personalCompleteness: number;
  partnerCompleteness: number;
  
  // Loading state
  isInitialized: boolean;
  
  // Utility functions
  generatePlanForJobAndLevel: (job: string, level: string, currentIncome?: string, careerOutlook?: string) => CareerStage[];
  calculateTotalCareerIncome: (plan: CareerStage[]) => number;
  calculateProgressiveIncome: (job: string, level: string, currentIncome: string, status: string) => number;
  calculateCompleteness: (job: string, level: string, currentIncome: string, status: string, outlook: string) => number;
  formatToWan: (amount: number) => string;
  resetCareerData: () => void;
}

const CareerDataContext = createContext<CareerDataContextType | undefined>(undefined);

export const useCareerData = () => {
  const context = useContext(CareerDataContext);
  if (!context) {
    throw new Error('useCareerData must be used within a CareerDataProvider');
  }
  return context;
};

interface CareerDataProviderProps {
  children: ReactNode;
}

export const SimplifiedCareerDataProvider: React.FC<CareerDataProviderProps> = ({ children }) => {
  
  const [isInitialized, setIsInitialized] = useState(false);
  const initRef = useRef(false);
  
  // Safe localStorage operations - 移除 debouncing
  const safeGetFromStorage = useCallback((key: string, defaultValue: any) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.warn(`[CareerDataProvider] Error reading localStorage key ${key}:`, error);
      return defaultValue;
    }
  }, []);

  const safeSetToStorage = useCallback((key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`[CareerDataProvider] Error writing localStorage key ${key}:`, error);
    }
  }, []);

  // Initialize states with defaults
  const [currentJob, setCurrentJobState] = useState(() => '');
  const [jobLevel, setJobLevelState] = useState(() => '');
  const [careerPlan, setCareerPlanState] = useState<CareerStage[]>(() => []);
  const [partnerJob, setPartnerJobState] = useState(() => '');
  const [partnerLevel, setPartnerLevelState] = useState(() => '');
  const [partnerCareerPlan, setPartnerCareerPlanState] = useState<CareerStage[]>(() => []);
  
  // Simplified work status system
  const [personalCurrentStatus, setPersonalCurrentStatusState] = useState<'not-retired' | 'retired'>('not-retired');
  const [partnerCurrentStatus, setPartnerCurrentStatusState] = useState<'not-retired' | 'retired'>('not-retired');
  
  // Career stages for planning
  const [personalCareerStages, setPersonalCareerStagesState] = useState<CareerStageInput[]>([]);
  const [partnerCareerStages, setPartnerCareerStagesState] = useState<CareerStageInput[]>([]);
  
  const [personalCurrentIncome, setPersonalCurrentIncomeState] = useState(() => '');
  const [personalCareerOutlook, setPersonalCareerOutlookState] = useState(() => '');
  const [partnerCurrentIncome, setPartnerCurrentIncomeState] = useState(() => '');
  const [partnerCareerOutlook, setPartnerCareerOutlookState] = useState(() => '');
  const [personalStartWorkAge, setPersonalStartWorkAgeState] = useState(() => '');
  const [personalRetirementIncome, setPersonalRetirementIncomeState] = useState(() => '');
  const [personalRetirementAge, setPersonalRetirementAgeState] = useState(() => '');
  const [partnerStartWorkAge, setPartnerStartWorkAgeState] = useState(() => '');
  const [partnerRetirementIncome, setPartnerRetirementIncomeState] = useState(() => '');
  const [partnerRetirementAge, setPartnerRetirementAgeState] = useState(() => '');

  // Initialization logic - 优化初始化，立即同步
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    
    try {
      const data = {
        currentJob: safeGetFromStorage('career_currentJob', ''),
        jobLevel: safeGetFromStorage('career_jobLevel', ''),
        careerPlan: safeGetFromStorage('career_careerPlan', []),
        partnerJob: safeGetFromStorage('career_partnerJob', ''),
        partnerLevel: safeGetFromStorage('career_partnerLevel', ''),
        partnerCareerPlan: safeGetFromStorage('career_partnerCareerPlan', []),
        personalCurrentStatus: safeGetFromStorage('career_personalCurrentStatus', 'not-retired'),
        partnerCurrentStatus: safeGetFromStorage('career_partnerCurrentStatus', 'not-retired'),
        personalCareerStages: safeGetFromStorage('career_personalCareerStages', []),
        partnerCareerStages: safeGetFromStorage('career_partnerCareerStages', []),
        personalCurrentIncome: safeGetFromStorage('career_personalCurrentIncome', ''),
        personalCareerOutlook: safeGetFromStorage('career_personalCareerOutlook', ''),
        partnerCurrentIncome: safeGetFromStorage('career_partnerCurrentIncome', ''),
        partnerCareerOutlook: safeGetFromStorage('career_partnerCareerOutlook', ''),
        personalStartWorkAge: safeGetFromStorage('career_personalStartWorkAge', ''),
        personalRetirementIncome: safeGetFromStorage('career_personalRetirementIncome', ''),
        personalRetirementAge: safeGetFromStorage('career_personalRetirementAge', '60'),
        partnerStartWorkAge: safeGetFromStorage('career_partnerStartWorkAge', ''),
        partnerRetirementIncome: safeGetFromStorage('career_partnerRetirementIncome', ''),
        partnerRetirementAge: safeGetFromStorage('career_partnerRetirementAge', '60')
      };
      
      console.log('[CareerDataProvider] Loaded data from localStorage:', data);
      
      setCurrentJobState(data.currentJob);
      setJobLevelState(data.jobLevel);
      setCareerPlanState(data.careerPlan);
      setPartnerJobState(data.partnerJob);
      setPartnerLevelState(data.partnerLevel);
      setPartnerCareerPlanState(data.partnerCareerPlan);
      setPersonalCurrentStatusState(data.personalCurrentStatus);
      setPartnerCurrentStatusState(data.partnerCurrentStatus);
      setPersonalCareerStagesState(data.personalCareerStages);
      setPartnerCareerStagesState(data.partnerCareerStages);
      setPersonalCurrentIncomeState(data.personalCurrentIncome);
      setPersonalCareerOutlookState(data.personalCareerOutlook);
      setPartnerCurrentIncomeState(data.partnerCurrentIncome);
      setPartnerCareerOutlookState(data.partnerCareerOutlook);
      setPersonalStartWorkAgeState(data.personalStartWorkAge);
      setPersonalRetirementIncomeState(data.personalRetirementIncome);
      setPersonalRetirementAgeState(data.personalRetirementAge);
      setPartnerStartWorkAgeState(data.partnerStartWorkAge);
      setPartnerRetirementIncomeState(data.partnerRetirementIncome);
      setPartnerRetirementAgeState(data.partnerRetirementAge);
      
      console.log('[CareerDataProvider] Initialization completed successfully');
      setIsInitialized(true);
    } catch (error) {
      console.error('[CareerDataProvider] Initialization error:', error);
      setIsInitialized(true);
    }
  }, [safeGetFromStorage]);

  // Utility functions
  const getBaseSalary = useCallback((job: string, level: string, currentIncome?: string): number => {
    if (currentIncome && parseFloat(currentIncome) > 0) {
      return parseFloat(currentIncome) * 10000;
    }
    
    const baseSalaries: Record<string, number> = {
      '软件工程师': 150000,
      '产品经理': 180000,
      '医生': 200000,
      '教师': 85000,
      '律师': 250000
    };
    
    return baseSalaries[job] || 100000;
  }, []);

  const generatePlanForJobAndLevel = useCallback((job: string, level: string, currentIncome?: string, careerOutlook?: string): CareerStage[] => {
    const baseSalary = getBaseSalary(job, level, currentIncome);
    const growthRates = [0, 0.15, 0.25, 0.35, 0.45];
    
    return Array.from({ length: 5 }, (_, i) => ({
      id: (i + 1).toString(),
      stageName: ['当前阶段', '成长阶段', '发展阶段', '领导阶段', '高级阶段'][i],
      position: level,
      description: `阶段${i + 1}描述`,
      ageRange: `${30 + i * 4}-${33 + i * 4}岁`,
      yearlyIncome: Math.round(baseSalary * (1 + growthRates[i])),
      duration: `${3 + i}年`
    }));
  }, [getBaseSalary]);

  const calculateTotalCareerIncome = useCallback((plan: CareerStage[]): number => {
    return plan.reduce((total, stage) => {
      const years = parseInt(stage.duration);
      return total + stage.yearlyIncome * years;
    }, 0);
  }, []);

  const formatToWan = useCallback((amount: number): string => {
    return Math.round(amount / 10000).toString();
  }, []);

  // Progressive income calculation - only calculate when current income is provided
  const calculateProgressiveIncome = useCallback((job: string, level: string, currentIncome: string, status: string): number => {
    // If retired, return 0
    if (status === 'retired') {
      return 0;
    }
    
    // Need at least job, level and current income to calculate
    if (!job || !level || !currentIncome || parseFloat(currentIncome) <= 0) {
      return 0;
    }
    
    // Use provided current income
    const income = parseFloat(currentIncome) * 10000;
    
    // Simple 30-year career estimation with 3% annual growth
    const years = 30;
    const annualGrowth = 0.03;
    let totalIncome = 0;
    let currentYearIncome = income;
    
    for (let i = 0; i < years; i++) {
      totalIncome += currentYearIncome;
      currentYearIncome *= (1 + annualGrowth);
    }
    
    return totalIncome;
  }, [getBaseSalary]);

  // Calculate completeness percentage
  const calculateCompleteness = useCallback((job: string, level: string, currentIncome: string, status: string, outlook: string): number => {
    if (status === 'retired') {
      return 100; // Consider complete if retired
    }
    
    let completeness = 0;
    if (status) completeness += 20; // Status selected
    if (job) completeness += 30;    // Job selected
    if (level) completeness += 30;  // Level selected
    if (currentIncome) completeness += 15; // Income provided
    if (outlook) completeness += 5;  // Outlook provided
    
    return Math.min(completeness, 100);
  }, []);

  const resetCareerData = useCallback(() => {
    console.log('[CareerDataProvider] Resetting career data...');
    
    const keys = [
      'career_currentJob', 'career_jobLevel', 'career_careerPlan',
      'career_partnerJob', 'career_partnerLevel', 'career_partnerCareerPlan',
      'career_personalCurrentStatus', 'career_personalFutureWorkPlan',
      'career_partnerCurrentStatus', 'career_partnerFutureWorkPlan',
      'career_personalCurrentIncome', 'career_personalCareerOutlook',
      'career_partnerCurrentIncome', 'career_partnerCareerOutlook',
      'career_personalStartWorkAge', 'career_personalRetirementIncome',
      'career_partnerStartWorkAge', 'career_partnerRetirementIncome'
    ];
    
    keys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn(`[CareerDataProvider] Error removing localStorage key ${key}:`, error);
      }
    });
    
    // Reset states
    setCurrentJobState('');
    setJobLevelState('');
    setCareerPlanState([]);
    setPartnerJobState('');
    setPartnerLevelState('');
    setPartnerCareerPlanState([]);
    setPersonalCurrentStatusState('not-retired');
    setPartnerCurrentStatusState('not-retired');
    setPersonalCareerStagesState([]);
    setPartnerCareerStagesState([]);
    setPersonalCurrentIncomeState('');
    setPersonalCareerOutlookState('');
    setPartnerCurrentIncomeState('');
    setPartnerCareerOutlookState('');
    setPersonalStartWorkAgeState('');
    setPersonalRetirementIncomeState('');
    setPartnerStartWorkAgeState('');
    setPartnerRetirementIncomeState('');
  }, []);

  // Setter functions with immediate storage - 移除 debounce
  const setCurrentJob = useCallback((job: string) => {
    setCurrentJobState(job);
    safeSetToStorage('career_currentJob', job);
  }, [safeSetToStorage]);

  const setJobLevel = useCallback((level: string) => {
    setJobLevelState(level);
    safeSetToStorage('career_jobLevel', level);
  }, [safeSetToStorage]);

  const setCareerPlan = useCallback((plan: CareerStage[]) => {
    setCareerPlanState(plan);
    safeSetToStorage('career_careerPlan', plan);
  }, [safeSetToStorage]);

  const setPartnerJob = useCallback((job: string) => {
    setPartnerJobState(job);
    safeSetToStorage('career_partnerJob', job);
  }, [safeSetToStorage]);

  const setPartnerLevel = useCallback((level: string) => {
    setPartnerLevelState(level);
    safeSetToStorage('career_partnerLevel', level);
  }, [safeSetToStorage]);

  const setPartnerCareerPlan = useCallback((plan: CareerStage[]) => {
    setPartnerCareerPlanState(plan);
    safeSetToStorage('career_partnerCareerPlan', plan);
  }, [safeSetToStorage]);

  const setPersonalCurrentStatus = useCallback((status: 'not-retired' | 'retired') => {
    setPersonalCurrentStatusState(status);
    safeSetToStorage('career_personalCurrentStatus', status);
    // Clear career stages when status changes to retired
    if (status === 'retired') {
      setPersonalCareerStagesState([]);
      safeSetToStorage('career_personalCareerStages', []);
    }
  }, [safeSetToStorage]);

  const setPartnerCurrentStatus = useCallback((status: 'not-retired' | 'retired') => {
    setPartnerCurrentStatusState(status);
    safeSetToStorage('career_partnerCurrentStatus', status);
    // Clear career stages when status changes to retired
    if (status === 'retired') {
      setPartnerCareerStagesState([]);
      safeSetToStorage('career_partnerCareerStages', []);
    }
  }, [safeSetToStorage]);

  const setPersonalCareerStages = useCallback((stages: CareerStageInput[]) => {
    setPersonalCareerStagesState(stages);
    safeSetToStorage('career_personalCareerStages', stages);
  }, [safeSetToStorage]);

  const setPartnerCareerStages = useCallback((stages: CareerStageInput[]) => {
    setPartnerCareerStagesState(stages);
    safeSetToStorage('career_partnerCareerStages', stages);
  }, [safeSetToStorage]);

  const setPersonalCurrentIncome = useCallback((income: string) => {
    setPersonalCurrentIncomeState(income);
    safeSetToStorage('career_personalCurrentIncome', income);
  }, [safeSetToStorage]);

  const setPersonalCareerOutlook = useCallback((outlook: string) => {
    setPersonalCareerOutlookState(outlook);
    safeSetToStorage('career_personalCareerOutlook', outlook);
  }, [safeSetToStorage]);

  const setPartnerCurrentIncome = useCallback((income: string) => {
    setPartnerCurrentIncomeState(income);
    safeSetToStorage('career_partnerCurrentIncome', income);
  }, [safeSetToStorage]);

  const setPartnerCareerOutlook = useCallback((outlook: string) => {
    setPartnerCareerOutlookState(outlook);
    safeSetToStorage('career_partnerCareerOutlook', outlook);
  }, [safeSetToStorage]);

  const setPersonalStartWorkAge = useCallback((age: string) => {
    setPersonalStartWorkAgeState(age);
    safeSetToStorage('career_personalStartWorkAge', age);
  }, [safeSetToStorage]);

  const setPersonalRetirementIncome = useCallback((income: string) => {
    setPersonalRetirementIncomeState(income);
    safeSetToStorage('career_personalRetirementIncome', income);
  }, [safeSetToStorage]);

  const setPartnerStartWorkAge = useCallback((age: string) => {
    setPartnerStartWorkAgeState(age);
    safeSetToStorage('career_partnerStartWorkAge', age);
  }, [safeSetToStorage]);

  const setPartnerRetirementIncome = useCallback((income: string) => {
    setPartnerRetirementIncomeState(income);
    safeSetToStorage('career_partnerRetirementIncome', income);
  }, [safeSetToStorage]);

  const setPersonalRetirementAge = useCallback((age: string) => {
    setPersonalRetirementAgeState(age);
    safeSetToStorage('career_personalRetirementAge', age);
  }, [safeSetToStorage]);

  const setPartnerRetirementAge = useCallback((age: string) => {
    setPartnerRetirementAgeState(age);
    safeSetToStorage('career_partnerRetirementAge', age);
  }, [safeSetToStorage]);

  // Calculated values
  const personalTotalIncome = calculateTotalCareerIncome(careerPlan);
  const partnerTotalIncome = calculateTotalCareerIncome(partnerCareerPlan);
  const combinedTotalIncome = personalTotalIncome + partnerTotalIncome;
  const hasAnyCareerPlan = careerPlan.length > 0 || partnerCareerPlan.length > 0;

  // Progressive calculations for immediate feedback
  const personalProgressiveIncome = calculateProgressiveIncome(currentJob, jobLevel, personalCurrentIncome, personalCurrentStatus);
  const partnerProgressiveIncome = calculateProgressiveIncome(partnerJob, partnerLevel, partnerCurrentIncome, partnerCurrentStatus);
  const combinedProgressiveIncome = personalProgressiveIncome + partnerProgressiveIncome;
  
  const personalCompleteness = calculateCompleteness(currentJob, jobLevel, personalCurrentIncome, personalCurrentStatus, personalCareerOutlook);
  const partnerCompleteness = calculateCompleteness(partnerJob, partnerLevel, partnerCurrentIncome, partnerCurrentStatus, partnerCareerOutlook);

  console.log('[CareerDataProvider] Rendering with isInitialized:', isInitialized);

  return (
    <CareerDataContext.Provider value={{
      currentJob, setCurrentJob,
      jobLevel, setJobLevel,
      careerPlan, setCareerPlan,
      partnerJob, setPartnerJob,
      partnerLevel, setPartnerLevel,
      partnerCareerPlan, setPartnerCareerPlan,
      personalCurrentStatus, setPersonalCurrentStatus,
      partnerCurrentStatus, setPartnerCurrentStatus,
      personalCareerStages, setPersonalCareerStages,
      partnerCareerStages, setPartnerCareerStages,
      personalCurrentIncome, setPersonalCurrentIncome,
      personalCareerOutlook, setPersonalCareerOutlook,
      partnerCurrentIncome, setPartnerCurrentIncome,
      partnerCareerOutlook, setPartnerCareerOutlook,
      personalStartWorkAge, setPersonalStartWorkAge,
      personalRetirementIncome, setPersonalRetirementIncome,
      personalRetirementAge, setPersonalRetirementAge,
      partnerStartWorkAge, setPartnerStartWorkAge,
      partnerRetirementIncome, setPartnerRetirementIncome,
      partnerRetirementAge, setPartnerRetirementAge,
      personalTotalIncome,
      partnerTotalIncome,
      combinedTotalIncome,
      hasAnyCareerPlan,
      personalProgressiveIncome,
      partnerProgressiveIncome,
      combinedProgressiveIncome,
      personalCompleteness,
      partnerCompleteness,
      isInitialized,
      generatePlanForJobAndLevel,
      calculateTotalCareerIncome,
      calculateProgressiveIncome,
      calculateCompleteness,
      formatToWan,
      resetCareerData
    }}>
      {children}
    </CareerDataContext.Provider>
  );
};
