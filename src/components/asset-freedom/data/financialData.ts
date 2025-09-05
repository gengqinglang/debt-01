// 财务数据接口定义
export interface FinancialDataItem {
  age: number;
  income: number;
  beginningBalance: number;
  expenses: number;
  totalInflow: number;
  cashFlow: number;
}

export interface WorstShortage {
  age: number | string;
  cashFlow: number;
}

// 财务数据
export const financialData = [
  { age: 30, income: 20000, beginningBalance: 8000, expenses: 24000 },
  { age: 35, income: 21000, beginningBalance: 4000, expenses: 25000 },
  { age: 40, income: 22000, beginningBalance: 0, expenses: 30000 },
  { age: 45, income: 24000, beginningBalance: 0, expenses: 22000 },
  { age: 50, income: 25000, beginningBalance: 2000, expenses: 25000 },
  { age: 55, income: 26000, beginningBalance: 2000, expenses: 26000 },
  { age: 60, income: 28000, beginningBalance: 2000, expenses: 34000 },
  { age: 65, income: 30000, beginningBalance: 0, expenses: 42000 },
  { age: 70, income: 28000, beginningBalance: 0, expenses: 35000 },
  { age: 75, income: 25000, beginningBalance: 0, expenses: 30000 },
  { age: 80, income: 22000, beginningBalance: 0, expenses: 28000 },
  { age: 85, income: 18000, beginningBalance: 0, expenses: 24000 },
];

// 计算现金流数据
export const cashFlowData = financialData.map(item => {
  const totalInflow = item.income + item.beginningBalance;
  const cashFlow = totalInflow - item.expenses;
  return {
    ...item,
    totalInflow,
    cashFlow,
  };
});

// 平滑曲线函数 - 使用三次贝塞尔曲线进行插值
const smoothInterpolate = (age: number, keyPoints: Array<{age: number, value: number}>) => {
  // 如果年龄正好匹配关键点，直接返回
  const exactMatch = keyPoints.find(point => point.age === age);
  if (exactMatch) return exactMatch.value;
  
  // 找到年龄范围
  let beforePoint = keyPoints[0];
  let afterPoint = keyPoints[keyPoints.length - 1];
  
  for (let i = 0; i < keyPoints.length - 1; i++) {
    if (keyPoints[i].age <= age && keyPoints[i + 1].age >= age) {
      beforePoint = keyPoints[i];
      afterPoint = keyPoints[i + 1];
      break;
    }
  }
  
  // 计算插值参数
  const t = (age - beforePoint.age) / (afterPoint.age - beforePoint.age);
  
  // 使用缓动函数创建平滑过渡
  const smoothT = t * t * (3 - 2 * t); // 平滑步进函数
  
  return beforePoint.value + (afterPoint.value - beforePoint.value) * smoothT;
};

// 资产增长关键点 - 设计为指数增长模式
const assetKeyPoints = [
  { age: 30, value: 120000 },   // 起步较低
  { age: 35, value: 180000 },   // 缓慢增长
  { age: 40, value: 280000 },   // 开始加速
  { age: 45, value: 420000 },   // 持续增长
  { age: 50, value: 620000 },   // 快速增长期
  { age: 55, value: 850000 },   // 财富积累期
  { age: 60, value: 1200000 },  // 事业高峰期
  { age: 65, value: 1800000 },  // 退休前准备
  { age: 70, value: 2400000 },  // 退休后稳定增长
  { age: 75, value: 2900000 },  // 增长放缓
  { age: 80, value: 3200000 },  // 保值为主
  { age: 85, value: 3300000 }   // 基本保持
];

// 负债变化关键点 - 设计为先增后减的抛物线模式，65岁后为0
const liabilityKeyPoints = [
  { age: 30, value: 50000 },    // 初期负债较少
  { age: 35, value: 350000 },   // 房贷等大额负债
  { age: 40, value: 420000 },   // 负债高峰期
  { age: 45, value: 350000 },   // 开始还款
  { age: 50, value: 250000 },   // 持续减少
  { age: 55, value: 150000 },   // 大幅减少
  { age: 60, value: 80000 },    // 接近还清
  { age: 65, value: 0 },        // 65岁后无负债
  { age: 70, value: 0 },        
  { age: 75, value: 0 },
  { age: 80, value: 0 },
  { age: 85, value: 0 }
];

// 生成平滑的年度资产负债数据（30-85岁每年）
const generateSmoothAssetData = () => {
  const yearlyData = [];
  
  for (let age = 30; age <= 85; age++) {
    // 使用平滑插值计算每年的资产和负债
    const assets = Math.round(smoothInterpolate(age, assetKeyPoints));
    const liabilities = Math.round(smoothInterpolate(age, liabilityKeyPoints));
    
    yearlyData.push({
      year: `${2024 - 30 + age}`,
      age: age,
      assets: assets,
      liabilities: liabilities
    });
  }
  
  return yearlyData;
};

// 现金流状态检测函数
export const hasFinancialGap = (data: FinancialDataItem[] = cashFlowData): boolean => {
  return data.some(item => item.cashFlow < 0);
};

// 无现金流缺口的数据集（理想状态）
export const noCashFlowGapData = financialData.map(item => {
  const totalInflow = item.income + item.beginningBalance;
  // 确保现金流始终为正，调整支出使其略低于收入
  const adjustedExpenses = Math.min(item.expenses, totalInflow - 5000); // 保证至少5000结余
  const cashFlow = totalInflow - adjustedExpenses;
  return {
    ...item,
    expenses: adjustedExpenses,
    totalInflow,
    cashFlow,
  };
});

// 无缺口状态下的资产增长关键点 - 更优化的增长模式
const optimizedAssetKeyPoints = [
  { age: 30, value: 150000 },   // 起步更高
  { age: 35, value: 250000 },   // 稳步增长
  { age: 40, value: 380000 },   // 加速增长
  { age: 45, value: 550000 },   // 持续积累
  { age: 50, value: 780000 },   // 快速增长期
  { age: 55, value: 1100000 },  // 财富积累期
  { age: 60, value: 1500000 },  // 事业高峰期
  { age: 65, value: 2200000 },  // 退休前准备
  { age: 70, value: 2800000 },  // 退休后稳定增长
  { age: 75, value: 3200000 },  // 持续增长
  { age: 80, value: 3500000 },  // 保值增值
  { age: 85, value: 3600000 }   // 稳定保持
];

// 无缺口状态下的资产负债数据生成
const generateOptimizedAssetData = () => {
  const yearlyData = [];
  
  for (let age = 30; age <= 85; age++) {
    const assets = Math.round(smoothInterpolate(age, optimizedAssetKeyPoints));
    const liabilities = Math.round(smoothInterpolate(age, liabilityKeyPoints));
    
    yearlyData.push({
      year: `${2024 - 30 + age}`,
      age: age,
      assets: assets,
      liabilities: liabilities
    });
  }
  
  return yearlyData;
};

// 资产负债数据 - 现在使用平滑算法生成
export const assetLiabilityData = generateSmoothAssetData();

// 无缺口状态的资产负债数据
export const optimizedAssetLiabilityData = generateOptimizedAssetData();

// 扩展的年度数据
export const detailedYearlyData = [
  { year: '现在', age: 30, assets: 100000, liabilities: 30000, netWorth: 70000, debtRatio: 30, yearsSustainable: 3.5 },
  { year: '2025', age: 31, assets: 150000, liabilities: 280000, netWorth: -130000, debtRatio: 186.7, yearsSustainable: 0 },
  { year: '2026', age: 32, assets: 210000, liabilities: 250000, netWorth: -40000, debtRatio: 119, yearsSustainable: 0 },
  { year: '2027', age: 33, assets: 280000, liabilities: 220000, netWorth: 60000, debtRatio: 78.6, yearsSustainable: 2 },
  { year: '2028', age: 34, assets: 360000, liabilities: 190000, netWorth: 170000, debtRatio: 52.8, yearsSustainable: 5.7 },
  { year: '2029', age: 35, assets: 450000, liabilities: 160000, netWorth: 290000, debtRatio: 35.6, yearsSustainable: 9.6 },
  { year: '2030', age: 36, assets: 550000, liabilities: 130000, netWorth: 420000, debtRatio: 23.6, yearsSustainable: 14 },
  { year: '2031', age: 37, assets: 650000, liabilities: 100000, netWorth: 550000, debtRatio: 15.4, yearsSustainable: 18.3 },
  { year: '2032', age: 38, assets: 750000, liabilities: 70000, netWorth: 680000, debtRatio: 9.3, yearsSustainable: 22.7 },
  { year: '2033', age: 39, assets: 850000, liabilities: 40000, netWorth: 810000, debtRatio: 4.7, yearsSustainable: 27 },
  { year: '2034', age: 40, assets: 950000, liabilities: 10000, netWorth: 940000, debtRatio: 1.1, yearsSustainable: 31.3 },
  { year: '2035', age: 41, assets: 1200000, liabilities: 0, netWorth: 1200000, debtRatio: 0, yearsSustainable: 40 },
  { year: '2045', age: 51, assets: 2000000, liabilities: 0, netWorth: 2000000, debtRatio: 0, yearsSustainable: 66.7 },
  { year: '2055', age: 61, assets: 3200000, liabilities: 0, netWorth: 3200000, debtRatio: 0, yearsSustainable: 106.7 },
  { year: '2065', age: 71, assets: 4000000, liabilities: 0, netWorth: 4000000, debtRatio: 0, yearsSustainable: 133.3 },
  { year: '2075', age: 81, assets: 3500000, liabilities: 0, netWorth: 3500000, debtRatio: 0, yearsSustainable: 116.7 },
  { year: '2076', age: 82, assets: 3400000, liabilities: 0, netWorth: 3400000, debtRatio: 0, yearsSustainable: 113.3 },
  { year: '2077', age: 83, assets: 3300000, liabilities: 0, netWorth: 3300000, debtRatio: 0, yearsSustainable: 110 },
  { year: '2078', age: 84, assets: 3200000, liabilities: 0, netWorth: 3200000, debtRatio: 0, yearsSustainable: 106.7 },
  { year: '2079', age: 85, assets: 3100000, liabilities: 0, netWorth: 3100000, debtRatio: 0, yearsSustainable: 103.3 },
];
