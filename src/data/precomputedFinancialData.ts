
// 预计算的财务数据配置
// 将所有6种页面模式的数据预先计算并存储为静态常量

import { FinancialDataItem } from '@/components/asset-freedom/data/financialData';

// 财务指标数据接口
export interface FinancialMetrics {
  totalAssets: number;
  totalLiabilities: number;
  futureIncome: number;
  futureExpenditure: number;
  lifeBalance: number;
  yearsMoneyLasts: number;
  yearsToRetirement: string;
  cashFlowGapYears: number;
}

// 财富分型数据接口
export interface WealthTyping {
  title: string;
  code: string;
  description: string;
  traits: Array<{
    label: string;
    value: string;
    progress: number;
    description: string;
  }>;
  previousType: string;
}

// 三年预测数据接口
export interface ThreeYearForecast {
  year: string;
  age: number;
  status: 'surplus' | 'use-physical' | 'insufficient';
  statusLabel?: string;
  statusLabels?: string[];
  description: string;
  breakdown: Array<{
    title: string;
    amount: string;
  }>;
  extraLabels?: string[];
  titleRightLabels?: string[];
  rightCard?: {
    title: string;
    amount: string;
  };
}

// 健康概览数据接口
export interface HealthOverviewData {
  pageMode?: string;
  hasGap?: boolean;
  allHealthyYears?: boolean;
  redYears?: number[];
  description?: string;
}

// 完整的预计算数据结构
export interface PrecomputedData {
  hasFinancialGap: boolean;
  cashFlowData: FinancialDataItem[];
  assetLiabilityData: Array<{
    year: string;
    age: number;
    assets: number;
    liabilities: number;
  }>;
  financialMetrics: FinancialMetrics;
  wealthTyping: WealthTyping;
  threeYearForecast: ThreeYearForecast[];
  healthOverviewData: HealthOverviewData | null;
}

// 基础现金流数据
const baseCashFlowData: FinancialDataItem[] = [
  { age: 30, income: 20000, beginningBalance: 8000, expenses: 24000, totalInflow: 28000, cashFlow: 4000 },
  { age: 35, income: 21000, beginningBalance: 4000, expenses: 25000, totalInflow: 25000, cashFlow: 0 },
  { age: 40, income: 22000, beginningBalance: 0, expenses: 30000, totalInflow: 22000, cashFlow: -8000 },
  { age: 45, income: 24000, beginningBalance: 0, expenses: 22000, totalInflow: 24000, cashFlow: 2000 },
  { age: 50, income: 25000, beginningBalance: 2000, expenses: 25000, totalInflow: 27000, cashFlow: 2000 },
  { age: 55, income: 26000, beginningBalance: 2000, expenses: 26000, totalInflow: 28000, cashFlow: 2000 },
  { age: 60, income: 28000, beginningBalance: 2000, expenses: 34000, totalInflow: 30000, cashFlow: -4000 },
  { age: 65, income: 30000, beginningBalance: 0, expenses: 42000, totalInflow: 30000, cashFlow: -12000 },
  { age: 70, income: 28000, beginningBalance: 0, expenses: 35000, totalInflow: 28000, cashFlow: -7000 },
  { age: 75, income: 25000, beginningBalance: 0, expenses: 30000, totalInflow: 25000, cashFlow: -5000 },
  { age: 80, income: 22000, beginningBalance: 0, expenses: 28000, totalInflow: 22000, cashFlow: -6000 },
  { age: 85, income: 18000, beginningBalance: 0, expenses: 24000, totalInflow: 18000, cashFlow: -6000 },
];

// 无缺口现金流数据
const noCashFlowGapData: FinancialDataItem[] = [
  { age: 30, income: 20000, beginningBalance: 8000, expenses: 23000, totalInflow: 28000, cashFlow: 5000 },
  { age: 35, income: 21000, beginningBalance: 4000, expenses: 20000, totalInflow: 25000, cashFlow: 5000 },
  { age: 40, income: 22000, beginningBalance: 0, expenses: 17000, totalInflow: 22000, cashFlow: 5000 },
  { age: 45, income: 24000, beginningBalance: 0, expenses: 19000, totalInflow: 24000, cashFlow: 5000 },
  { age: 50, income: 25000, beginningBalance: 2000, expenses: 20000, totalInflow: 27000, cashFlow: 7000 },
  { age: 55, income: 26000, beginningBalance: 2000, expenses: 21000, totalInflow: 28000, cashFlow: 7000 },
  { age: 60, income: 28000, beginningBalance: 2000, expenses: 25000, totalInflow: 30000, cashFlow: 5000 },
  { age: 65, income: 30000, beginningBalance: 0, expenses: 25000, totalInflow: 30000, cashFlow: 5000 },
  { age: 70, income: 28000, beginningBalance: 0, expenses: 23000, totalInflow: 28000, cashFlow: 5000 },
  { age: 75, income: 25000, beginningBalance: 0, expenses: 20000, totalInflow: 25000, cashFlow: 5000 },
  { age: 80, income: 22000, beginningBalance: 0, expenses: 17000, totalInflow: 22000, cashFlow: 5000 },
  { age: 85, income: 18000, beginningBalance: 0, expenses: 13000, totalInflow: 18000, cashFlow: 5000 },
];

// 基础资产负债数据
const baseAssetLiabilityData = [
  { year: '2024', age: 30, assets: 120000, liabilities: 50000 },
  { year: '2025', age: 31, assets: 150000, liabilities: 280000 },
  { year: '2026', age: 32, assets: 180000, liabilities: 350000 },
  { year: '2027', age: 33, assets: 210000, liabilities: 420000 },
  { year: '2028', age: 34, assets: 280000, liabilities: 350000 },
  { year: '2029', age: 35, assets: 380000, liabilities: 250000 },
  { year: '2030', age: 36, assets: 420000, liabilities: 150000 },
  { year: '2031', age: 37, assets: 550000, liabilities: 80000 },
  { year: '2032', age: 38, assets: 620000, liabilities: 0 },
  { year: '2033', age: 39, assets: 850000, liabilities: 0 },
  { year: '2034', age: 40, assets: 1200000, liabilities: 0 },
];

// 优化资产负债数据
const optimizedAssetLiabilityData = [
  { year: '2024', age: 30, assets: 150000, liabilities: 50000 },
  { year: '2025', age: 31, assets: 200000, liabilities: 280000 },
  { year: '2026', age: 32, assets: 250000, liabilities: 350000 },
  { year: '2027', age: 33, assets: 300000, liabilities: 320000 },
  { year: '2028', age: 34, assets: 380000, liabilities: 250000 },
  { year: '2029', age: 35, assets: 550000, liabilities: 150000 },
  { year: '2030', age: 36, assets: 780000, liabilities: 80000 },
  { year: '2031', age: 37, assets: 1100000, liabilities: 0 },
  { year: '2032', age: 38, assets: 1500000, liabilities: 0 },
  { year: '2033', age: 39, assets: 2200000, liabilities: 0 },
  { year: '2034', age: 40, assets: 2800000, liabilities: 0 },
];

// 预计算所有6种页面模式的数据
export const PRECOMPUTED_FINANCIAL_DATA: Record<string, PrecomputedData> = {
  'member-severe-shortage': {
    hasFinancialGap: true,
    cashFlowData: baseCashFlowData,
    assetLiabilityData: baseAssetLiabilityData,
    financialMetrics: {
      totalAssets: 500,
      totalLiabilities: 224,
      futureIncome: 2093,
      futureExpenditure: 1982,
      lifeBalance: -387,
      yearsMoneyLasts: 5,
      yearsToRetirement: '本人不能提前退休',
      cashFlowGapYears: 3
    },
    wealthTyping: {
      title: '中度支出压缩型',
      code: 'C01-I02-E03-R2',
      description: '中度支出压缩型',
      traits: [
        { label: 'C 财富分型', value: '01', progress: 20, description: '中度支出压缩型' },
        { label: 'I 收入来源', value: '02', progress: 40, description: '被动收入主导' },
        { label: 'E 支出水平', value: '03', progress: 60, description: '奢侈型' },
        { label: 'R 潜在风险', value: '2', progress: 50, description: '2个潜在风险' }
      ],
      previousType: '极限生存压缩型'
    },
    threeYearForecast: [
      {
        year: '今年(30岁)',
        age: 30,
        status: 'surplus',
        statusLabel: '无现金流缺口',
        description: '',
        breakdown: [
          { title: '当年现金流盈余', amount: '+5万元' }
        ],
        titleRightLabels: ['当年有融资计划', '当年有卖房计划', '当年需赎回金融资产']
      },
      {
        year: '明年(31岁)',
        age: 31,
        status: 'use-physical',
        statusLabels: ['无现金流缺口'],
        description: '',
        breakdown: [
          { title: '当年现金流盈余', amount: '0万元' }
        ],
        titleRightLabels: ['当年需赎回金融资产']
      },
      {
        year: '后年(32岁)',
        age: 32,
        status: 'use-physical',
        statusLabels: ['有现金流缺口'],
        description: '',
        breakdown: [
          { title: '当年现金流缺口', amount: '-60万元' }
        ]
      },
      {
        year: '大后年(33岁)',
        age: 33,
        status: 'insufficient',
        statusLabels: ['有现金流缺口'],
        description: '',
        breakdown: [
          { title: '当年现金流缺口', amount: '-30万元' }
        ],
        titleRightLabels: ['当年有卖房计划']
      }
    ],
    healthOverviewData: {
      pageMode: 'member-severe-shortage',
      hasGap: true,
      redYears: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
      description: '严重缺口，多年收支不平，需要动用资产和调整规划'
    }
  },

  'public-severe-shortage': {
    hasFinancialGap: true,
    cashFlowData: baseCashFlowData,
    assetLiabilityData: baseAssetLiabilityData,
    financialMetrics: {
      totalAssets: 500,
      totalLiabilities: 224,
      futureIncome: 2093,
      futureExpenditure: 1982,
      lifeBalance: -387,
      yearsMoneyLasts: 5,
      yearsToRetirement: '本人不能提前退休',
      cashFlowGapYears: 3
    },
    wealthTyping: {
      title: '中度支出压缩型',
      code: 'C01-I02-E03-R2',
      description: '中度支出压缩型',
      traits: [
        { label: 'C 财富分型', value: '01', progress: 20, description: '中度支出压缩型' },
        { label: 'I 收入来源', value: '02', progress: 40, description: '被动收入主导' },
        { label: 'E 支出水平', value: '03', progress: 60, description: '奢侈型' },
        { label: 'R 潜在风险', value: '2', progress: 50, description: '2个潜在风险' }
      ],
      previousType: '极限生存压缩型'
    },
    threeYearForecast: [
      {
        year: '今年(30岁)',
        age: 30,
        status: 'surplus',
        statusLabel: '无现金流缺口',
        description: '当年收入大于支出，现金流健康',
        breakdown: [
          { title: '当年结余', amount: '20万元' }
        ],
        extraLabels: ['现金流健康']
      },
      {
        year: '明年(31岁)',
        age: 31,
        status: 'use-physical',
        statusLabel: '有现金流缺口，有资产可抵御',
        description: '当年收入无法覆盖支出，需要动用家庭资产',
        breakdown: [
          { title: '当年现金流缺口金额', amount: '60万元' }
        ],
        extraLabels: ['收不抵支', '现金流不健康']
      },
      {
        year: '后年(32岁)',
        age: 32,
        status: 'use-physical',
        statusLabel: '有现金流缺口，有资产可抵御',
        description: '当年收入无法覆盖支出，需要动用家庭资产',
        breakdown: [
          { title: '当年现金流缺口金额', amount: '60万元' }
        ],
        extraLabels: ['收不抵支', '现金流不健康']
      }
    ],
    healthOverviewData: {
      pageMode: 'public-severe-shortage',
      hasGap: true,
      redYears: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
      description: '严重缺口，多年收支不平，需要动用资产和调整规划'
    }
  },

  'member-liquidity-tight': {
    hasFinancialGap: false,
    cashFlowData: noCashFlowGapData,
    assetLiabilityData: optimizedAssetLiabilityData,
    financialMetrics: {
      totalAssets: 500,
      totalLiabilities: 224,
      futureIncome: 2193,
      futureExpenditure: 1882,
      lifeBalance: 587,
      yearsMoneyLasts: 8,
      yearsToRetirement: '本人12年后',
      cashFlowGapYears: 0
    },
    wealthTyping: {
      title: '稳健财富积累型',
      code: 'C02-I03-E02-R1',
      description: '稳健财富积累型',
      traits: [
        { label: 'C 财富分型', value: '02', progress: 60, description: '稳健积累型' },
        { label: 'I 收入来源', value: '03', progress: 70, description: '多元收入来源' },
        { label: 'E 支出水平', value: '02', progress: 40, description: '适度型' },
        { label: 'R 潜在风险', value: '1', progress: 25, description: '1个潜在风险' }
      ],
      previousType: '中度支出压缩型'
    },
    threeYearForecast: [
      {
        year: '今年(30岁)',
        age: 30,
        status: 'surplus',
        statusLabel: '有结余',
        description: '当年收入大于支出，结余充足可用于投资',
        breakdown: [
          { title: '当年结余', amount: '35万元' },
          { title: '要攒下以后花的', amount: '20万元' },
          { title: '当前可随便花的', amount: '15万元' }
        ]
      },
      {
        year: '明年(31岁)',
        age: 31,
        status: 'use-physical',
        statusLabel: '要动老本',
        description: '当年收不抵支，金融资产余额100万，需确保20万流动性',
        breakdown: [
          { title: '当年收支缺口', amount: '80万元' },
          { title: '仅有100万', amount: '100万元' }
        ]
      },
      {
        year: '后年(32岁)',
        age: 32,
        status: 'surplus',
        statusLabel: '有结余',
        description: '财务状况恢复，收入增长覆盖支出',
        breakdown: [
          { title: '当年结余', amount: '30万元' },
          { title: '要攒下以后花的', amount: '20万元' },
          { title: '当前可随便花的', amount: '10万元' }
        ]
      }
    ],
    healthOverviewData: {
      pageMode: 'member-liquidity-tight',
      redYears: [32, 33, 38, 39, 41, 42, 46, 47],
      description: '收支不平，消耗掉所有积蓄后仍然不够，需要卖掉房产才能覆盖支出'
    }
  },

  'public-liquidity-tight': {
    hasFinancialGap: false,
    cashFlowData: noCashFlowGapData,
    assetLiabilityData: optimizedAssetLiabilityData,
    financialMetrics: {
      totalAssets: 500,
      totalLiabilities: 224,
      futureIncome: 2193,
      futureExpenditure: 1882,
      lifeBalance: 587,
      yearsMoneyLasts: 8,
      yearsToRetirement: '本人12年后',
      cashFlowGapYears: 0
    },
    wealthTyping: {
      title: '稳健财富积累型',
      code: 'C02-I03-E02-R1',
      description: '稳健财富积累型',
      traits: [
        { label: 'C 财富分型', value: '02', progress: 60, description: '稳健积累型' },
        { label: 'I 收入来源', value: '03', progress: 70, description: '多元收入来源' },
        { label: 'E 支出水平', value: '02', progress: 40, description: '适度型' },
        { label: 'R 潜在风险', value: '1', progress: 25, description: '1个潜在风险' }
      ],
      previousType: '中度支出压缩型'
    },
    threeYearForecast: [
      {
        year: '今年(30岁)',
        age: 30,
        status: 'surplus',
        statusLabel: '有结余',
        description: '当年收入大于支出，结余充足可用于投资',
        breakdown: [
          { title: '当年结余', amount: '35万元' },
          { title: '要攒下以后花的', amount: '20万元' },
          { title: '当前可随便花的', amount: '15万元' }
        ]
      },
      {
        year: '明年(31岁)',
        age: 31,
        status: 'use-physical',
        statusLabel: '要动老本',
        description: '当年收入无法覆盖支出，金融资产仅50万存在流动性风险',
        breakdown: [
          { title: '当年收支缺口', amount: '80万元' },
          { title: '金融资产余额', amount: '50万元' }
        ]
      },
      {
        year: '后年(32岁)',
        age: 32,
        status: 'surplus',
        statusLabel: '有结余',
        description: '财务状况恢复，收入增长覆盖支出',
        breakdown: [
          { title: '当年结余', amount: '30万元' },
          { title: '要攒下以后花的', amount: '20万元' },
          { title: '当前可随便花的', amount: '10万元' }
        ]
      }
    ],
    healthOverviewData: {
      pageMode: 'public-liquidity-tight',
      redYears: [32, 33, 38, 39, 41, 42, 46, 47],
      description: '收支不平，消耗掉所有积蓄后仍然不够，需要卖掉房产才能覆盖支出'
    }
  },

  'member-balanced': {
    hasFinancialGap: false,
    cashFlowData: noCashFlowGapData,
    assetLiabilityData: optimizedAssetLiabilityData,
    financialMetrics: {
      totalAssets: 500,
      totalLiabilities: 224,
      futureIncome: 2193,
      futureExpenditure: 1882,
      lifeBalance: 311,
      yearsMoneyLasts: 8,
      yearsToRetirement: '本人12年后',
      cashFlowGapYears: 0
    },
    wealthTyping: {
      title: '稳健财富积累型',
      code: 'C02-I03-E02-R1',
      description: '稳健财富积累型',
      traits: [
        { label: 'C 财富分型', value: '02', progress: 60, description: '稳健积累型' },
        { label: 'I 收入来源', value: '03', progress: 70, description: '多元收入来源' },
        { label: 'E 支出水平', value: '02', progress: 40, description: '适度型' },
        { label: 'R 潜在风险', value: '1', progress: 25, description: '1个潜在风险' }
      ],
      previousType: '中度支出压缩型'
    },
    threeYearForecast: [
      // 复用 member-severe-shortage 的 30岁卡片
      {
        year: '今年(30岁)',
        age: 30,
        status: 'surplus',
        statusLabel: '无现金流缺口',
        description: '',
        breakdown: [
          { title: '当年现金流盈余', amount: '+5万元' }
        ],
        titleRightLabels: ['当年有融资计划', '当年有卖房计划', '当年需赎回金融资产']
      },
      // 复用 member-severe-shortage 的 31岁卡片
      {
        year: '明年(31岁)',
        age: 31,
        status: 'use-physical',
        statusLabels: ['无现金流缺口'],
        description: '',
        breakdown: [
          { title: '当年现金流盈余', amount: '0万元' }
        ],
        titleRightLabels: ['当年需赎回金融资产']
      },
      // 复用 member-severe-shortage 的 31岁卡片内容（但显示为32岁）
      {
        year: '后年(32岁)',
        age: 32,
        status: 'use-physical',
        statusLabels: ['无现金流缺口'],
        description: '',
        breakdown: [
          { title: '当年现金流盈余', amount: '0万元' }
        ],
        titleRightLabels: ['当年需赎回金融资产']
      }
    ],
    healthOverviewData: {
      hasGap: false,
      allHealthyYears: true
    }
  },

  'public-balanced': {
    hasFinancialGap: false,
    cashFlowData: noCashFlowGapData,
    assetLiabilityData: optimizedAssetLiabilityData,
    financialMetrics: {
      totalAssets: 500,
      totalLiabilities: 224,
      futureIncome: 2193,
      futureExpenditure: 1882,
      lifeBalance: 587,
      yearsMoneyLasts: 8,
      yearsToRetirement: '本人12年后',
      cashFlowGapYears: 0
    },
    wealthTyping: {
      title: '稳健财富积累型',
      code: 'C02-I03-E02-R1',
      description: '稳健财富积累型',
      traits: [
        { label: 'C 财富分型', value: '02', progress: 60, description: '稳健积累型' },
        { label: 'I 收入来源', value: '03', progress: 70, description: '多元收入来源' },
        { label: 'E 支出水平', value: '02', progress: 40, description: '适度型' },
        { label: 'R 潜在风险', value: '1', progress: 25, description: '1个潜在风险' }
      ],
      previousType: '中度支出压缩型'
    },
    threeYearForecast: [
      {
        year: '今年(30岁)',
        age: 30,
        status: 'surplus',
        statusLabel: '有结余',
        description: '当年收入大于支出，结余充足可用于投资',
        breakdown: [
          { title: '当年结余', amount: '35万元' },
          { title: '要攒下以后花的', amount: '20万元' },
          { title: '当前可随便花的', amount: '15万元' }
        ]
      },
      {
        year: '明年(31岁)',
        age: 31,
        status: 'use-physical',
        statusLabel: '要动老本',
        description: '当年收入无法覆盖支出，金融资产50万，需确保20万的流动性',
        breakdown: [
          { title: '当年收支缺口', amount: '20万元' },
          { title: '金融资产余额', amount: '50万元' }
        ]
      },
      {
        year: '后年(32岁)',
        age: 32,
        status: 'surplus',
        statusLabel: '有结余',
        description: '财务状况稳定，可考虑提高生活品质',
        breakdown: [
          { title: '当年结余', amount: '45万元' },
          { title: '要攒下以后花的', amount: '25万元' },
          { title: '当前可随便花的', amount: '20万元' }
        ]
      }
    ],
    healthOverviewData: {
      hasGap: false,
      allHealthyYears: true
    }
  }
};
