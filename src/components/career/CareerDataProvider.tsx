import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface CareerStage {
  id: string;
  stageName: string;
  position: string;
  description: string;
  ageRange: string;
  yearlyIncome: number;
  duration: string;
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
  
  // Work status - Updated to match new types
  personalWorkStatus: 'working' | 'not-working-future' | 'retired';
  setPersonalWorkStatus: (status: 'working' | 'not-working-future' | 'retired') => void;
  partnerWorkStatus: 'working' | 'not-working-future' | 'retired';
  setPartnerWorkStatus: (status: 'working' | 'not-working-future' | 'retired') => void;
  
  // Current income and career outlook
  personalCurrentIncome: string;
  setPersonalCurrentIncome: (income: string) => void;
  personalCareerOutlook: string;
  setPersonalCareerOutlook: (outlook: string) => void;
  partnerCurrentIncome: string;
  setPartnerCurrentIncome: (income: string) => void;
  partnerCareerOutlook: string;
  setPartnerCareerOutlook: (outlook: string) => void;
  
  // New fields for start work age and retirement income
  personalStartWorkAge: string;
  setPersonalStartWorkAge: (age: string) => void;
  personalRetirementIncome: string;
  setPersonalRetirementIncome: (income: string) => void;
  partnerStartWorkAge: string;
  setPartnerStartWorkAge: (age: string) => void;
  partnerRetirementIncome: string;
  setPartnerRetirementIncome: (income: string) => void;
  
  // Calculated values
  personalTotalIncome: number;
  partnerTotalIncome: number;
  combinedTotalIncome: number;
  hasAnyCareerPlan: boolean;
  
  // Loading state
  isInitialized: boolean;
  
  // Utility functions
  generatePlanForJobAndLevel: (job: string, level: string, currentIncome?: string, careerOutlook?: string) => CareerStage[];
  calculateTotalCareerIncome: (plan: CareerStage[]) => number;
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
  children: React.ReactNode;
}

export const CareerDataProvider: React.FC<CareerDataProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 检测是否需要重置数据的函数
  const checkAndResetIfNeeded = useCallback(() => {
    const currentSessionId = localStorage.getItem('flow_session_id');
    const lastSessionId = localStorage.getItem('career_last_session_id');
    
    console.log('检查会话ID:', { currentSessionId, lastSessionId });
    
    // 如果是新的流程会话，清空所有职业数据
    if (currentSessionId && currentSessionId !== lastSessionId) {
      console.log('检测到新流程，清空职业数据');
      
      // 清空所有职业相关的localStorage数据
      const careerKeys = [
        'career_currentJob',
        'career_jobLevel', 
        'career_careerPlan',
        'career_partnerJob',
        'career_partnerLevel',
        'career_partnerCareerPlan',
        'career_personalWorkStatus',
        'career_partnerWorkStatus',
        'career_personalCurrentIncome',
        'career_personalCareerOutlook',
        'career_partnerCurrentIncome',
        'career_partnerCareerOutlook',
        'career_personalStartWorkAge',
        'career_personalRetirementIncome',
        'career_partnerStartWorkAge',
        'career_partnerRetirementIncome'
      ];
      
      careerKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      // 更新记录的会话ID
      localStorage.setItem('career_last_session_id', currentSessionId);
      
      return true; // 表示已重置
    }
    
    return false; // 表示无需重置
  }, []);

  // Helper function to load from localStorage with fallback
  const loadFromStorage = useCallback((key: string, defaultValue: any) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }, []);

  // 检查是否需要重置，如果需要则使用默认值
  const shouldReset = checkAndResetIfNeeded();
  const getInitialValue = useCallback((key: string, defaultValue: any) => {
    return shouldReset ? defaultValue : loadFromStorage(key, defaultValue);
  }, [shouldReset, loadFromStorage]);

  // Personal career state with auto-reset logic
  const [currentJob, setCurrentJobState] = useState(() => getInitialValue('career_currentJob', ''));
  const [jobLevel, setJobLevelState] = useState(() => getInitialValue('career_jobLevel', ''));
  const [careerPlan, setCareerPlanState] = useState<CareerStage[]>(() => getInitialValue('career_careerPlan', []));
  
  // Partner career state with auto-reset logic
  const [partnerJob, setPartnerJobState] = useState(() => getInitialValue('career_partnerJob', ''));
  const [partnerLevel, setPartnerLevelState] = useState(() => getInitialValue('career_partnerLevel', ''));
  const [partnerCareerPlan, setPartnerCareerPlanState] = useState<CareerStage[]>(() => getInitialValue('career_partnerCareerPlan', []));

  // Work status with auto-reset logic - 默认选择"当前在工作"
  const [personalWorkStatus, setPersonalWorkStatusState] = useState<'working' | 'not-working-future' | 'retired'>(() => getInitialValue('career_personalWorkStatus', 'working'));
  const [partnerWorkStatus, setPartnerWorkStatusState] = useState<'working' | 'not-working-future' | 'retired'>(() => getInitialValue('career_partnerWorkStatus', 'working'));

  // Current income and career outlook
  const [personalCurrentIncome, setPersonalCurrentIncomeState] = useState(() => getInitialValue('career_personalCurrentIncome', ''));
  const [personalCareerOutlook, setPersonalCareerOutlookState] = useState(() => getInitialValue('career_personalCareerOutlook', ''));
  const [partnerCurrentIncome, setPartnerCurrentIncomeState] = useState(() => getInitialValue('career_partnerCurrentIncome', ''));
  const [partnerCareerOutlook, setPartnerCareerOutlookState] = useState(() => getInitialValue('career_partnerCareerOutlook', ''));

  // New fields for start work age and retirement income
  const [personalStartWorkAge, setPersonalStartWorkAgeState] = useState(() => getInitialValue('career_personalStartWorkAge', ''));
  const [personalRetirementIncome, setPersonalRetirementIncomeState] = useState(() => getInitialValue('career_personalRetirementIncome', ''));
  const [partnerStartWorkAge, setPartnerStartWorkAgeState] = useState(() => getInitialValue('career_partnerStartWorkAge', ''));
  const [partnerRetirementIncome, setPartnerRetirementIncomeState] = useState(() => getInitialValue('career_partnerRetirementIncome', ''));

  // Set initialized state
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // 手动重置所有职业数据的函数
  const resetCareerData = useCallback(() => {
    console.log('手动重置所有职业数据');
    
    // 清空localStorage
    const careerKeys = [
      'career_currentJob',
      'career_jobLevel', 
      'career_careerPlan',
      'career_partnerJob',
      'career_partnerLevel',
      'career_partnerCareerPlan',
      'career_personalWorkStatus',
      'career_partnerWorkStatus',
      'career_personalCurrentIncome',
      'career_personalCareerOutlook',
      'career_partnerCurrentIncome',
      'career_partnerCareerOutlook',
      'career_personalStartWorkAge',
      'career_personalRetirementIncome',
      'career_partnerStartWorkAge',
      'career_partnerRetirementIncome'
    ];
    
    careerKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // 重置所有state
    setCurrentJobState('');
    setJobLevelState('');
    setCareerPlanState([]);
    setPartnerJobState('');
    setPartnerLevelState('');
    setPartnerCareerPlanState([]);
    setPersonalWorkStatusState('working');
    setPartnerWorkStatusState('working');
    setPersonalCurrentIncomeState('');
    setPersonalCareerOutlookState('');
    setPartnerCurrentIncomeState('');
    setPartnerCareerOutlookState('');
    setPersonalStartWorkAgeState('');
    setPersonalRetirementIncomeState('');
    setPartnerStartWorkAgeState('');
    setPartnerRetirementIncomeState('');
  }, []);

  const getJobInfo = useCallback((jobKey: string) => {
    const jobInfoMap: Record<string, { title: string; industry: string; }> = {
      // 科技行业
      '软件工程师': { title: '软件工程师', industry: '科技行业' },
      '产品经理': { title: '产品经理', industry: '科技行业' },
      '数据分析师': { title: '数据分析师', industry: '科技行业' },
      
      // 医疗行业
      '医生': { title: '医生', industry: '医疗行业' },
      '护士': { title: '护士', industry: '医疗行业' },
      
      // 公务员和事业单位
      '公务员': { title: '公务员', industry: '政府机关' },
      '教师': { title: '教师', industry: '教育行业' },
      
      // 法律行业
      '律师': { title: '律师', industry: '法律服务' },
      
      // 工程技术
      '工程师': { title: '工程师', industry: '工程技术' },
      
      // 金融服务
      '财务分析师': { title: '财务分析师', industry: '金融服务' },
      '银行职员': { title: '银行职员', industry: '金融服务' },
      
      // 营销传媒
      '市场营销': { title: '市场营销专员', industry: '营销传媒' },
      '媒体编辑': { title: '媒体编辑', industry: '营销传媒' },
      
      // 人力资源
      '人力资源': { title: '人力资源专员', industry: '人力资源' },
      
      // 创意设计
      '设计师': { title: '设计师', industry: '创意设计' },
      
      // 销售服务
      '销售': { title: '销售代表', industry: '销售服务' },
      
      // 咨询服务
      '咨询师': { title: '咨询师', industry: '咨询服务' }
    };
    return jobInfoMap[jobKey] || { title: jobKey, industry: '通用行业' };
  }, []);

  // Updated getBaseSalary function to consider current income and career outlook
  const getBaseSalary = useCallback((job: string, level: string, currentIncome?: string, careerOutlook?: string): number => {
    // 职业基础薪资 - 作为参考基准
    const jobSalaryMap: Record<string, number> = {
      // 科技行业 - 薪资较高
      '软件工程师': 150000,
      '产品经理': 180000,
      '数据分析师': 120000,
      
      // 医疗行业 - 薪资中上
      '医生': 200000,
      '护士': 80000,
      
      // 公务员和事业单位 - 薪资稳定但相对较低
      '公务员': 90000,
      '教师': 85000,
      
      // 法律行业 - 薪资较高
      '律师': 250000,
      
      // 工程技术 - 薪资中等
      '工程师': 110000,
      
      // 金融服务 - 薪资中上
      '财务分析师': 130000,
      '银行职员': 95000,
      
      // 营销传媒 - 薪资中等
      '市场营销': 100000,
      '媒体编辑': 90000,
      
      // 人力资源 - 薪资中等
      '人力资源': 90000,
      
      // 创意设计 - 薪资中等
      '设计师': 110000,
      
      // 销售服务 - 薪资中等但有提成空间
      '销售': 120000,
      
      // 咨询服务 - 薪资较高
      '咨询师': 160000
    };

    // 职业特定的职级系数
    const levelMultiplierMap: Record<string, Record<string, number>> = {
      // 医疗行业
      '医生': {
        '住院医师': 0.7,
        '主治医师': 1.0,
        '副主任医师': 1.4,
        '主任医师': 1.8
      },
      '护士': {
        '护士': 0.7,
        '护师': 1.0,
        '主管护师': 1.3,
        '副主任护师': 1.6
      },
      
      // 科技行业
      '软件工程师': {
        '初级工程师': 0.7,
        '中级工程师': 1.0,
        '高级工程师': 1.3,
        '资深工程师': 1.6
      },
      '产品经理': {
        '助理产品经理': 0.6,
        '产品经理': 1.0,
        '高级产品经理': 1.4,
        '产品总监': 2.0
      },
      '数据分析师': {
        '初级分析师': 0.7,
        '数据分析师': 1.0,
        '高级分析师': 1.3,
        '首席分析师': 1.8
      },
      
      // 公务员和事业单位
      '公务员': {
        '科员': 0.8,
        '副主任科员': 1.0,
        '主任科员': 1.2,
        '副处级': 1.5
      },
      '教师': {
        '助教': 0.7,
        '讲师': 1.0,
        '副教授': 1.4,
        '教授': 1.8
      },
      
      // 法律行业
      '律师': {
        '实习律师': 0.5,
        '执业律师': 1.0,
        '合伙人律师': 2.0,
        '首席合伙人': 3.0
      },
      
      // 工程技术
      '工程师': {
        '助理工程师': 0.7,
        '工程师': 1.0,
        '高级工程师': 1.3,
        '教授级高工': 1.7
      },
      
      // 金融服务
      '财务分析师': {
        '初级分析师': 0.7,
        '财务分析师': 1.0,
        '高级分析师': 1.4,
        '财务总监': 2.2
      },
      '银行职员': {
        '柜员': 0.6,
        '客户经理': 1.0,
        '部门经理': 1.5,
        '分行行长': 2.5
      },
      
      // 营销传媒
      '市场营销': {
        '营销专员': 0.7,
        '营销主管': 1.0,
        '营销经理': 1.4,
        '营销总监': 2.0
      },
      '媒体编辑': {
        '编辑助理': 0.6,
        '编辑': 1.0,
        '主编': 1.5,
        '总编辑': 2.2
      },
      
      // 人力资源
      '人力资源': {
        'HR专员': 0.7,
        'HR主管': 1.0,
        'HR经理': 1.4,
        'HR总监': 2.0
      },
      
      // 创意设计
      '设计师': {
        '初级设计师': 0.7,
        '设计师': 1.0,
        '高级设计师': 1.4,
        '设计总监': 2.0
      },
      
      // 销售服务
      '销售': {
        '销售代表': 0.8,
        '销售主管': 1.2,
        '销售经理': 1.6,
        '销售总监': 2.5
      },
      
      // 咨询服务
      '咨询师': {
        '初级咨询师': 0.7,
        '咨询师': 1.0,
        '高级咨询师': 1.5,
        '合伙人': 2.5
      }
    };

    // 如果用户输入了当前收入，优先使用用户输入的收入作为基准
    let baseSalary: number;
    if (currentIncome && parseFloat(currentIncome) > 0) {
      baseSalary = parseFloat(currentIncome) * 10000; // 将万元转换为元
    } else {
      // 否则使用系统预设的基础薪资
      const systemBaseSalary = jobSalaryMap[job] || 100000;
      const jobLevelMultipliers = levelMultiplierMap[job];
      const multiplier = jobLevelMultipliers?.[level] || 1.0;
      baseSalary = Math.round(systemBaseSalary * multiplier);
    }
    
    return baseSalary;
  }, []);

  // Updated generatePlanForJobAndLevel function
  const generatePlanForJobAndLevel = useCallback((job: string, level: string, currentIncome?: string, careerOutlook?: string): CareerStage[] => {
    console.log('生成职业规划:', { job, level, currentIncome, careerOutlook });
    const baseSalary = getBaseSalary(job, level, currentIncome, careerOutlook);
    const jobInfo = getJobInfo(job);
    
    // 根据职业发展水平设置增长率
    const getGrowthRates = (outlook: string) => {
      switch (outlook) {
        case '正常发展':
          return [0, 0.15, 0.25, 0.35, 0.45]; // 正常增长
        case '发展停滞':
          return [0, 0.05, 0.08, 0.10, 0.12]; // 缓慢增长
        case '走下坡路':
          return [0, -0.05, -0.10, -0.15, -0.20]; // 负增长
        default:
          return [0, 0.15, 0.25, 0.35, 0.45]; // 默认正常增长
      }
    };

    // 根据不同职业生成不同的职业发展路径
    const getCareerPath = (job: string, currentLevel: string) => {
      const careerPaths: Record<string, string[]> = {
        '医生': ['住院医师', '主治医师', '副主任医师', '主任医师', '科室主任'],
        '护士': ['护士', '护师', '主管护师', '副主任护师', '护理部主任'],
        '软件工程师': ['初级工程师', '中级工程师', '高级工程师', '资深工程师', '技术总监'],
        '产品经理': ['助理产品经理', '产品经理', '高级产品经理', '产品总监', 'VP产品'],
        '公务员': ['科员', '副主任科员', '主任科员', '副处级', '处级'],
        '教师': ['助教', '讲师', '副教授', '教授', '院长'],
        '律师': ['实习律师', '执业律师', '合伙人律师', '首席合伙人', '事务所主任']
      };
      
      return careerPaths[job] || ['初级', '中级', '高级', '资深', '专家'];
    };

    const careerPath = getCareerPath(job, level);
    const currentIndex = careerPath.findIndex(path => path === level);
    const startIndex = Math.max(0, currentIndex);
    const growthRates = getGrowthRates(careerOutlook || '正常发展');

    const plan: CareerStage[] = [];
    const baseAges = [30, 34, 38, 43, 49];
    const durations = [3, 4, 5, 6, 7];

    for (let i = 0; i < 5; i++) {
      const pathIndex = startIndex + i;
      const position = pathIndex < careerPath.length ? careerPath[pathIndex] : careerPath[careerPath.length - 1];
      
      // 应用增长率计算收入
      const adjustedSalary = Math.round(baseSalary * (1 + growthRates[i]));
      
      plan.push({
        id: (i + 1).toString(),
        stageName: i === 0 ? '当前阶段' : i === 1 ? '成长阶段' : i === 2 ? '发展阶段' : i === 3 ? '领导阶段' : '高级阶段',
        position: `${position}`,
        description: i === 0 ? '巩固当前技能，积累工作经验，建立专业声誉' : 
                    i === 1 ? '提升专业技能，承担更多责任，开始带团队' :
                    i === 2 ? '管理团队，制定策略，跨部门协作' :
                    i === 3 ? '战略规划，业务决策，组织管理' :
                    '行业影响力，战略决策，投资规划',
        ageRange: `${baseAges[i]}-${baseAges[i] + durations[i] - 1}岁`,
        yearlyIncome: Math.max(0, adjustedSalary), // 确保收入不为负数
        duration: `${durations[i]}年`
      });
    }

    console.log('生成的职业规划:', plan);
    return plan;
  }, [getBaseSalary, getJobInfo]);

  // Updated calculateTotalCareerIncome function
  const calculateTotalCareerIncome = useCallback((plan: CareerStage[]): number => {
    return plan.reduce((total, stage) => {
      const years = parseInt(stage.duration);
      return total + stage.yearlyIncome * years;
    }, 0);
  }, []);

  const formatToWan = useCallback((amount: number): string => {
    return Math.round(amount / 10000).toString();
  }, []);

  // Wrapper functions that also save to localStorage
  const setCurrentJob = useCallback((job: string) => {
    console.log('设置当前工作:', job);
    setCurrentJobState(job);
    localStorage.setItem('career_currentJob', JSON.stringify(job));
  }, []);

  const setJobLevel = useCallback((level: string) => {
    console.log('设置工作级别:', level);
    setJobLevelState(level);
    localStorage.setItem('career_jobLevel', JSON.stringify(level));
  }, []);

  const setCareerPlan = useCallback((plan: CareerStage[]) => {
    console.log('设置职业规划:', plan);
    setCareerPlanState(plan);
    localStorage.setItem('career_careerPlan', JSON.stringify(plan));
  }, []);

  const setPartnerJob = useCallback((job: string) => {
    console.log('设置伴侣工作:', job);
    setPartnerJobState(job);
    localStorage.setItem('career_partnerJob', JSON.stringify(job));
  }, []);

  const setPartnerLevel = useCallback((level: string) => {
    console.log('设置伴侣级别:', level);
    setPartnerLevelState(level);
    localStorage.setItem('career_partnerLevel', JSON.stringify(level));
  }, []);

  const setPartnerCareerPlan = useCallback((plan: CareerStage[]) => {
    console.log('设置伴侣职业规划:', plan);
    setPartnerCareerPlanState(plan);
    localStorage.setItem('career_partnerCareerPlan', JSON.stringify(plan));
  }, []);

  const setPersonalWorkStatus = useCallback((status: 'working' | 'not-working-future' | 'retired') => {
    console.log('设置个人工作状态:', status);
    setPersonalWorkStatusState(status);
    localStorage.setItem('career_personalWorkStatus', JSON.stringify(status));
    
    // 自动设置职业发展水平默认值
    if (status === 'working' && !personalCareerOutlook) {
      console.log('自动设置个人职业发展水平默认值: 正常发展');
      setPersonalCareerOutlookState('正常发展');
      localStorage.setItem('career_personalCareerOutlook', JSON.stringify('正常发展'));
    }
  }, [personalCareerOutlook]);

  const setPartnerWorkStatus = useCallback((status: 'working' | 'not-working-future' | 'retired') => {
    console.log('设置伴侣工作状态:', status);
    setPartnerWorkStatusState(status);
    localStorage.setItem('career_partnerWorkStatus', JSON.stringify(status));
    
    // 自动设置职业发展水平默认值
    if (status === 'working' && !partnerCareerOutlook) {
      console.log('自动设置伴侣职业发展水平默认值: 正常发展');
      setPartnerCareerOutlookState('正常发展');
      localStorage.setItem('career_partnerCareerOutlook', JSON.stringify('正常发展'));
    }
  }, [partnerCareerOutlook]);

  // New setter functions for current income and career outlook
  const setPersonalCurrentIncome = useCallback((income: string) => {
    console.log('设置个人当前收入:', income);
    setPersonalCurrentIncomeState(income);
    localStorage.setItem('career_personalCurrentIncome', JSON.stringify(income));
  }, []);

  const setPersonalCareerOutlook = useCallback((outlook: string) => {
    console.log('设置个人职业发展水平:', outlook);
    setPersonalCareerOutlookState(outlook);
    localStorage.setItem('career_personalCareerOutlook', JSON.stringify(outlook));
  }, []);

  const setPartnerCurrentIncome = useCallback((income: string) => {
    console.log('设置伴侣当前收入:', income);
    setPartnerCurrentIncomeState(income);
    localStorage.setItem('career_partnerCurrentIncome', JSON.stringify(income));
  }, []);

  const setPartnerCareerOutlook = useCallback((outlook: string) => {
    console.log('设置伴侣职业发展水平:', outlook);
    setPartnerCareerOutlookState(outlook);
    localStorage.setItem('career_partnerCareerOutlook', JSON.stringify(outlook));
  }, []);

  // New setter functions for start work age and retirement income
  const setPersonalStartWorkAge = useCallback((age: string) => {
    console.log('设置个人开始工作年龄:', age);
    setPersonalStartWorkAgeState(age);
    localStorage.setItem('career_personalStartWorkAge', JSON.stringify(age));
  }, []);

  const setPersonalRetirementIncome = useCallback((income: string) => {
    console.log('设置个人退休收入:', income);
    setPersonalRetirementIncomeState(income);
    localStorage.setItem('career_personalRetirementIncome', JSON.stringify(income));
  }, []);

  const setPartnerStartWorkAge = useCallback((age: string) => {
    console.log('设置伴侣开始工作年龄:', age);
    setPartnerStartWorkAgeState(age);
    localStorage.setItem('career_partnerStartWorkAge', JSON.stringify(age));
  }, []);

  const setPartnerRetirementIncome = useCallback((income: string) => {
    console.log('设置伴侣退休收入:', income);
    setPartnerRetirementIncomeState(income);
    localStorage.setItem('career_partnerRetirementIncome', JSON.stringify(income));
  }, []);

  // 初始化时设置默认值
  useEffect(() => {
    if (personalWorkStatus === 'working' && !personalCareerOutlook) {
      console.log('初始化设置个人职业发展水平默认值: 正常发展');
      setPersonalCareerOutlookState('正常发展');
      localStorage.setItem('career_personalCareerOutlook', JSON.stringify('正常发展'));
    }
  }, [personalWorkStatus, personalCareerOutlook]);

  useEffect(() => {
    if (partnerWorkStatus === 'working' && !partnerCareerOutlook) {
      console.log('初始化设置伴侣职业发展水平默认值: 正常发展');
      setPartnerCareerOutlookState('正常发展');
      localStorage.setItem('career_partnerCareerOutlook', JSON.stringify('正常发展'));
    }
  }, [partnerWorkStatus, partnerCareerOutlook]);

  // Auto-generate personal career plan - Fixed useEffect with proper dependencies
  useEffect(() => {
    console.log('个人职业规划 useEffect 触发:', { personalWorkStatus, currentJob, jobLevel, personalCurrentIncome, personalCareerOutlook });
    if (personalWorkStatus === 'working' && currentJob && jobLevel) {
      const plan = generatePlanForJobAndLevel(currentJob, jobLevel, personalCurrentIncome, personalCareerOutlook);
      setCareerPlan(plan);
      console.log('生成个人职业规划成功:', plan);
    } else {
      setCareerPlan([]);
      console.log('清空个人职业规划');
    }
  }, [currentJob, jobLevel, personalWorkStatus, personalCurrentIncome, personalCareerOutlook, generatePlanForJobAndLevel, setCareerPlan]);

  // Auto-generate partner career plan - Fixed useEffect with proper dependencies
  useEffect(() => {
    console.log('伴侣职业规划 useEffect 触发:', { partnerWorkStatus, partnerJob, partnerLevel, partnerCurrentIncome, partnerCareerOutlook });
    if (partnerWorkStatus === 'working' && partnerJob && partnerLevel) {
      const plan = generatePlanForJobAndLevel(partnerJob, partnerLevel, partnerCurrentIncome, partnerCareerOutlook);
      setPartnerCareerPlan(plan);
      console.log('生成伴侣职业规划成功:', plan);
    } else {
      setPartnerCareerPlan([]);
      console.log('清空伴侣职业规划');
    }
  }, [partnerJob, partnerLevel, partnerWorkStatus, partnerCurrentIncome, partnerCareerOutlook, generatePlanForJobAndLevel, setPartnerCareerPlan]);

  // Clear job data when switching to not working
  useEffect(() => {
    if (personalWorkStatus === 'retired') {
      setCurrentJob('');
      setJobLevel('');
      setPersonalCurrentIncome('');
      setPersonalCareerOutlook('');
    }
  }, [personalWorkStatus, setCurrentJob, setJobLevel, setPersonalCurrentIncome, setPersonalCareerOutlook]);

  useEffect(() => {
    if (partnerWorkStatus === 'retired') {
      setPartnerJob('');
      setPartnerLevel('');
      setPartnerCurrentIncome('');
      setPartnerCareerOutlook('');
    }
  }, [partnerWorkStatus, setPartnerJob, setPartnerLevel, setPartnerCurrentIncome, setPartnerCareerOutlook]);

  // Calculated values
  const personalTotalIncome = calculateTotalCareerIncome(careerPlan);
  const partnerTotalIncome = calculateTotalCareerIncome(partnerCareerPlan);
  const combinedTotalIncome = personalTotalIncome + partnerTotalIncome;
  const hasAnyCareerPlan = careerPlan.length > 0 || partnerCareerPlan.length > 0;

  // Debug log to monitor context state
  useEffect(() => {
    console.log('CareerDataProvider 状态更新:', {
      currentJob,
      jobLevel,
      personalWorkStatus,
      personalCurrentIncome,
      personalCareerOutlook,
      careerPlanLength: careerPlan.length,
      partnerJob,
      partnerLevel,
      partnerWorkStatus,
      partnerCurrentIncome,
      partnerCareerOutlook,
      partnerCareerPlanLength: partnerCareerPlan.length,
      hasAnyCareerPlan
    });
  }, [currentJob, jobLevel, personalWorkStatus, personalCurrentIncome, personalCareerOutlook, careerPlan, partnerJob, partnerLevel, partnerWorkStatus, partnerCurrentIncome, partnerCareerOutlook, partnerCareerPlan, hasAnyCareerPlan]);

  return (
    <CareerDataContext.Provider value={{
      currentJob,
      setCurrentJob,
      jobLevel,
      setJobLevel,
      careerPlan,
      setCareerPlan,
      partnerJob,
      setPartnerJob,
      partnerLevel,
      setPartnerLevel,
      partnerCareerPlan,
      setPartnerCareerPlan,
      personalWorkStatus,
      setPersonalWorkStatus,
      partnerWorkStatus,
      setPartnerWorkStatus,
      personalCurrentIncome,
      setPersonalCurrentIncome,
      personalCareerOutlook,
      setPersonalCareerOutlook,
      partnerCurrentIncome,
      setPartnerCurrentIncome,
      partnerCareerOutlook,
      setPartnerCareerOutlook,
      personalStartWorkAge,
      setPersonalStartWorkAge,
      personalRetirementIncome,
      setPersonalRetirementIncome,
      partnerStartWorkAge,
      setPartnerStartWorkAge,
      partnerRetirementIncome,
      setPartnerRetirementIncome,
      personalTotalIncome,
      partnerTotalIncome,
      combinedTotalIncome,
      hasAnyCareerPlan,
      isInitialized,
      generatePlanForJobAndLevel,
      calculateTotalCareerIncome,
      formatToWan,
      resetCareerData
    }}>
      {children}
    </CareerDataContext.Provider>
  );
};
