import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ChevronLeft, CircleCheck, AlertCircle, Calendar, Crown, Loader2 } from "lucide-react";
import { useMembership } from '@/components/membership/MembershipProvider';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import YearlyFinancialDetails from './YearlyFinancialDetails';

// 扩展年度财务数据结构，加入更多详细信息
interface YearlyFinancialData {
  year: number;
  healthy: boolean;
  cashFlow: number;
  beginningBalance: number;
  propertyValue?: number; // 新增：年初房产金额
  diagnosis?: string;
  // 新增财务压力类型
  pressureType?: 'need_sell_property' | 'insufficient_even_after_selling';
  // 新增财务健康类型
  healthType?: 'income_covers_expenses' | 'need_use_savings';
  income: {
    total: number;
    salary: number;
    rent: number;
    housingFund: number;
    other?: number;
  };
  expenses: {
    total: number;
    basic: number;
    education: number;
    medical: number;
    pension: number;
    housing: number;
    transportation: number;
    majorPurchases: number;
    familySupport: number;
    other?: number;
  };
}

// 财务阶段数据结构
interface FinancialStage {
  period: string;
  healthy: boolean;
  yearlyData: YearlyFinancialData[];
}

interface FinancialHealthOverviewProps {
  onInteractionAttempt?: () => void;
  ageRange?: [number, number]; // 年龄范围过滤，如 [30, 55]
  title?: string; // 自定义标题
  healthOverviewData?: any; // 适配的健康概览数据
  pageMode?: 'member-severe-shortage' | 'member-liquidity-tight' | 'member-balanced' | 'public-severe-shortage' | 'public-liquidity-tight' | 'public-balanced'; // 页面模式
}

// 完整的财务阶段数据
const financialStagesData: FinancialStage[] = [
  {
    period: "30岁-34岁",
    healthy: true,
    yearlyData: [
      { 
        year: 30, 
        healthy: true, 
        cashFlow: 15000,
        beginningBalance: 50000,
        propertyValue: 1000000, // 100万基础房产价值
        diagnosis: "现金流健康，收入大于支出，有结余积累",
        healthType: 'income_covers_expenses',
        income: {
          total: 32000,
          salary: 25000,
          rent: 5000,
          housingFund: 2000
        },
        expenses: {
          total: 17000,
          basic: 4500,
          education: 2000,
          medical: 800,
          pension: 1200,
          housing: 5000,
          transportation: 1500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 31, 
        healthy: true,
        cashFlow: -50000,
        beginningBalance: 65000,
        propertyValue: 1030000, // 房产年增值3%
        diagnosis: "当年收入不足以覆盖支出，需要动用金融资产补足缺口",
        healthType: 'need_use_savings',
        income: {
          total: 32000,
          salary: 25000,
          rent: 5000,
          housingFund: 2000
        },
        expenses: {
          total: 82000,
          basic: 4500,
          education: 2000,
          medical: 800,
          pension: 1200,
          housing: 5000,
          transportation: 1500,
          majorPurchases: 65000,
          familySupport: 2000
        }
      },
      { 
        year: 32, 
        healthy: false, 
        cashFlow: -600000,
        beginningBalance: 750000,
        propertyValue: 1060000, // 房产持续增值，达到106万
        diagnosis: "财务危机，收支严重失衡",
        pressureType: 'need_sell_property',
        income: {
          total: 38000,
          salary: 29000,
          rent: 6000,
          housingFund: 3000
        },
        expenses: {
          total: 638000,
          basic: 5000,
          education: 2000,
          medical: 1000,
          pension: 1200,
          housing: 5000,
          transportation: 1800,
          majorPurchases: 620000,
          familySupport: 1000
        }
      },
      { 
        year: 33, 
        healthy: false, 
        cashFlow: -300000,
        beginningBalance: 150000,
        propertyValue: 1080000, // 房产持续增值
        diagnosis: "财务危机，收支严重失衡",
        pressureType: 'need_sell_property',
        income: {
          total: 41000,
          salary: 31000,
          rent: 7000,
          housingFund: 3000
        },
        expenses: {
          total: 341000,
          basic: 5000,
          education: 2500,
          medical: 1000,
          pension: 1500,
          housing: 5000,
          transportation: 2000,
          majorPurchases: 323000,
          familySupport: 1000
        }
      },
      { 
        year: 34, 
        healthy: true, 
        cashFlow: 25000,
        beginningBalance: 125000,
        diagnosis: "现金流健康，财务状况优秀",
        healthType: 'income_covers_expenses',
        income: {
          total: 45000,
          salary: 33000,
          rent: 8000,
          housingFund: 4000
        },
        expenses: {
          total: 20000,
          basic: 5500,
          education: 2500,
          medical: 1000,
          pension: 1500,
          housing: 5500,
          transportation: 2000,
          majorPurchases: 1000,
          familySupport: 1000
        }
      }
    ]
  },
  {
    period: "35岁-39岁",
    healthy: true,
    yearlyData: [
      { 
        year: 35, 
        healthy: true, 
        cashFlow: 27000,
        beginningBalance: 150000,
        diagnosis: "现金流健康，财务状况持续向好",
        healthType: 'income_covers_expenses',
        income: {
          total: 50000,
          salary: 37000,
          rent: 8000,
          housingFund: 5000
        },
        expenses: {
          total: 23000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 36, 
        healthy: true, 
        cashFlow: 29000,
        beginningBalance: 180000,
        diagnosis: "现金流健康，收入稳定，支出合理",
        healthType: 'income_covers_expenses',
        income: {
          total: 52000,
          salary: 38000,
          rent: 9000,
          housingFund: 5000
        },
        expenses: {
          total: 23000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 37, 
        healthy: true, 
        cashFlow: 31000,
        beginningBalance: 210000,
        diagnosis: "现金流健康，储蓄增加，财务状况良好",
        healthType: 'income_covers_expenses',
        income: {
          total: 54000,
          salary: 39000,
          rent: 9000,
          housingFund: 6000
        },
        expenses: {
          total: 23000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 38, 
        healthy: true, 
        cashFlow: 32000,
        beginningBalance: 240000,
        diagnosis: "现金流健康，财务状况持续向好",
        healthType: 'income_covers_expenses',
        income: {
          total: 56000,
          salary: 40000,
          rent: 9000,
          housingFund: 7000
        },
        expenses: {
          total: 24000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 39, 
        healthy: true, 
        cashFlow: 33000,
        beginningBalance: 270000,
        diagnosis: "现金流健康，财务状况良好",
        healthType: 'income_covers_expenses',
        income: {
          total: 58000,
          salary: 41000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 25000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      }
    ]
  },
  {
    period: "40岁-44岁",
    healthy: false,
    yearlyData: [
      { 
        year: 40, 
        healthy: true, 
        cashFlow: 34000,
        beginningBalance: 300000,
        diagnosis: "现金流健康，收入稳定",
        healthType: 'income_covers_expenses',
        income: {
          total: 60000,
          salary: 42000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 26000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 41, 
        healthy: false, 
        cashFlow: -800000,
        beginningBalance: 100000,
        diagnosis: "当年收不抵支，收支缺口80万，金融资产仅有10万，房产100万；存在入不敷出风险",
        pressureType: 'need_sell_property',
        income: {
          total: 1058000,
          salary: 41000,
          rent: 9000,
          housingFund: 8000,
          other: 1000000
        },
        expenses: {
          total: 1858000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 1335000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000,
          other: 500000
        }
      },
      { 
        year: 42, 
        healthy: false, 
        cashFlow: -8000,
        beginningBalance: 287000,
        diagnosis: "现金流紧张，即使卖房也无法完全覆盖支出",
        pressureType: 'insufficient_even_after_selling',
        income: {
          total: 57000,
          salary: 40000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 65000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 43, 
        healthy: true, 
        cashFlow: 10000,
        beginningBalance: 297000,
        diagnosis: "现金流恢复，收入增加",
        healthType: 'need_use_savings',
        income: {
          total: 59000,
          salary: 41000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 49000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 44, 
        healthy: true, 
        cashFlow: 15000,
        beginningBalance: 312000,
        diagnosis: "现金流健康，财务状况良好",
        healthType: 'need_use_savings',
        income: {
          total: 60000,
          salary: 42000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 45000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      }
    ]
  },
  {
    period: "45岁-49岁",
    healthy: true,
    yearlyData: [
      { 
        year: 45, 
        healthy: true, 
        cashFlow: 38000,
        beginningBalance: 327000,
        diagnosis: "现金流健康，财务状况良好",
        healthType: 'income_covers_expenses',
        income: {
          total: 62000,
          salary: 43000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 24000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 46, 
        healthy: true, 
        cashFlow: 40000,
        beginningBalance: 365000,
        diagnosis: "现金流健康，收入稳定",
        healthType: 'income_covers_expenses',
        income: {
          total: 64000,
          salary: 44000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 24000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 47, 
        healthy: true, 
        cashFlow: 42000,
        beginningBalance: 405000,
        diagnosis: "现金流健康，储蓄增加",
        healthType: 'income_covers_expenses',
        income: {
          total: 66000,
          salary: 45000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 24000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 48, 
        healthy: true, 
        cashFlow: 45000,
        beginningBalance: 447000,
        diagnosis: "现金流健康，财务状况良好",
        healthType: 'income_covers_expenses',
        income: {
          total: 68000,
          salary: 46000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 23000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 49, 
        healthy: true, 
        cashFlow: 48000,
        beginningBalance: 492000,
        diagnosis: "现金流健康，财务状况良好",
        healthType: 'income_covers_expenses',
        income: {
          total: 70000,
          salary: 47000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 22000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      }
    ]
  },
  {
    period: "50岁-54岁",
    healthy: false,
    yearlyData: [
      { 
        year: 50, 
        healthy: false, 
        cashFlow: -10000,
        beginningBalance: 482000,
        diagnosis: "现金流紧张，需要动用积蓄和房产变现",
        pressureType: 'need_sell_property',
        income: {
          total: 72000,
          salary: 48000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 82000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 51, 
        healthy: false, 
        cashFlow: -15000,
        beginningBalance: 467000,
        diagnosis: "现金流紧张，即使卖房也无法完全覆盖支出",
        pressureType: 'insufficient_even_after_selling',
        income: {
          total: 74000,
          salary: 49000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 89000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 52, 
        healthy: false, 
        cashFlow: -12000,
        beginningBalance: 455000,
        diagnosis: "现金流紧张，即使卖房也无法完全覆盖支出",
        pressureType: 'insufficient_even_after_selling',
        income: {
          total: 76000,
          salary: 50000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 88000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 53, 
        healthy: true, 
        cashFlow: 30000,
        beginningBalance: 485000,
        diagnosis: "现金流健康，收入增加",
        healthType: 'need_use_savings',
        income: {
          total: 80000,
          salary: 52000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 50000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 54, 
        healthy: true, 
        cashFlow: 35000,
        beginningBalance: 520000,
        diagnosis: "现金流健康，财务状况良好",
        healthType: 'need_use_savings',
        income: {
          total: 82000,
          salary: 53000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 47000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      }
    ]
  },
  {
    period: "55岁-59岁",
    healthy: true,
    yearlyData: [
      { 
        year: 55, 
        healthy: true, 
        cashFlow: 40000,
        beginningBalance: 555000,
        diagnosis: "现金流健康，财务状况良好",
        healthType: 'income_covers_expenses',
        income: {
          total: 84000,
          salary: 54000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 44000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 56, 
        healthy: true, 
        cashFlow: 38000,
        beginningBalance: 593000,
        diagnosis: "现金流健康，收入稳定",
        healthType: 'income_covers_expenses',
        income: {
          total: 86000,
          salary: 55000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 48000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 57, 
        healthy: true, 
        cashFlow: 36000,
        beginningBalance: 629000,
        diagnosis: "现金流健康，储蓄增加",
        healthType: 'income_covers_expenses',
        income: {
          total: 88000,
          salary: 56000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 52000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 58, 
        healthy: true, 
        cashFlow: 34000,
        beginningBalance: 663000,
        diagnosis: "现金流健康，财务状况良好",
        healthType: 'income_covers_expenses',
        income: {
          total: 90000,
          salary: 57000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 56000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 59, 
        healthy: true, 
        cashFlow: 32000,
        beginningBalance: 695000,
        diagnosis: "现金流健康，财务状况良好",
        healthType: 'income_covers_expenses',
        income: {
          total: 92000,
          salary: 58000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 60000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      }
    ]
  },
  {
    period: "60岁-64岁",
    healthy: true,
    yearlyData: [
      { 
        year: 60, 
        healthy: true, 
        cashFlow: 30000,
        beginningBalance: 725000,
        diagnosis: "现金流健康，财务状况良好",
        healthType: 'income_covers_expenses',
        income: {
          total: 94000,
          salary: 59000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 64000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 61, 
        healthy: true, 
        cashFlow: 28000,
        beginningBalance: 753000,
        diagnosis: "现金流健康，收入稳定",
        healthType: 'income_covers_expenses',
        income: {
          total: 96000,
          salary: 60000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 68000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 62, 
        healthy: true, 
        cashFlow: 26000,
        beginningBalance: 779000,
        diagnosis: "现金流健康，储蓄增加",
        healthType: 'income_covers_expenses',
        income: {
          total: 98000,
          salary: 61000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 72000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 63, 
        healthy: true, 
        cashFlow: 24000,
        beginningBalance: 803000,
        diagnosis: "现金流健康，财务状况良好",
        healthType: 'income_covers_expenses',
        income: {
          total: 100000,
          salary: 62000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 76000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 64, 
        healthy: true, 
        cashFlow: 22000,
        beginningBalance: 825000,
        diagnosis: "现金流健康，财务状况良好",
        healthType: 'income_covers_expenses',
        income: {
          total: 102000,
          salary: 63000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 80000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      }
    ]
  },
  {
    period: "65岁-69岁",
    healthy: false,
    yearlyData: [
      { 
        year: 65, 
        healthy: false, 
        cashFlow: -8000,
        beginningBalance: 817000,
        diagnosis: "现金流紧张，支出大于收入",
        income: {
          total: 104000,
          salary: 64000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 112000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 66, 
        healthy: false, 
        cashFlow: -10000,
        beginningBalance: 807000,
        diagnosis: "现金流紧张，需控制支出",
        income: {
          total: 106000,
          salary: 65000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 116000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 67, 
        healthy: false, 
        cashFlow: -12000,
        beginningBalance: 795000,
        diagnosis: "现金流紧张，需控制支出",
        income: {
          total: 108000,
          salary: 66000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 120000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 68, 
        healthy: false, 
        cashFlow: -14000,
        beginningBalance: 783000,
        diagnosis: "现金流紧张，需控制支出",
        income: {
          total: 110000,
          salary: 67000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 124000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 69, 
        healthy: true, 
        cashFlow: 15000,
        beginningBalance: 769000,
        diagnosis: "现金流恢复，收入增加",
        healthType: 'need_use_savings',
        income: {
          total: 112000,
          salary: 68000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 97000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      }
    ]
  },
  {
    period: "70岁-74岁",
    healthy: true,
    yearlyData: [
      { 
        year: 70, 
        healthy: true, 
        cashFlow: 18000,
        beginningBalance: 787000,
        diagnosis: "现金流健康，财务状况良好",
        healthType: 'income_covers_expenses',
        income: {
          total: 114000,
          salary: 69000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 96000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 71, 
        healthy: true, 
        cashFlow: 17000,
        beginningBalance: 804000,
        diagnosis: "现金流健康，收入稳定",
        healthType: 'income_covers_expenses',
        income: {
          total: 116000,
          salary: 70000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 99000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 72, 
        healthy: true, 
        cashFlow: 16000,
        beginningBalance: 820000,
        diagnosis: "现金流健康，储蓄增加",
        healthType: 'income_covers_expenses',
        income: {
          total: 118000,
          salary: 71000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 102000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 73, 
        healthy: true, 
        cashFlow: 15000,
        beginningBalance: 835000,
        diagnosis: "现金流健康，财务状况良好",
        healthType: 'income_covers_expenses',
        income: {
          total: 120000,
          salary: 72000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 105000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 74, 
        healthy: true, 
        cashFlow: 14000,
        beginningBalance: 850000,
        diagnosis: "现金流健康，财务状况良好",
        healthType: 'income_covers_expenses',
        income: {
          total: 122000,
          salary: 73000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 108000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      }
    ]
  },
  {
    period: "75岁-79岁",
    healthy: true,
    yearlyData: [
      { 
        year: 75, 
        healthy: true, 
        cashFlow: 13000,
        beginningBalance: 863000,
        diagnosis: "现金流健康，财务状况良好",
        healthType: 'income_covers_expenses',
        income: {
          total: 124000,
          salary: 74000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 111000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 76, 
        healthy: true, 
        cashFlow: 12000,
        beginningBalance: 875000,
        diagnosis: "现金流健康，收入稳定",
        healthType: 'income_covers_expenses',
        income: {
          total: 126000,
          salary: 75000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 114000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 77, 
        healthy: true, 
        cashFlow: 11000,
        beginningBalance: 886000,
        diagnosis: "现金流健康，储蓄增加",
        healthType: 'income_covers_expenses',
        income: {
          total: 128000,
          salary: 76000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 117000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 78, 
        healthy: true, 
        cashFlow: 10000,
        beginningBalance: 896000,
        diagnosis: "现金流健康，财务状况良好",
        healthType: 'income_covers_expenses',
        income: {
          total: 130000,
          salary: 77000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 120000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 79, 
        healthy: true, 
        cashFlow: 9000,
        beginningBalance: 905000,
        diagnosis: "现金流健康，财务状况良好",
        healthType: 'income_covers_expenses',
        income: {
          total: 132000,
          salary: 78000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 123000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      }
    ]
  },
  {
    period: "80岁-84岁",
    healthy: false,
    yearlyData: [
      { 
        year: 80, 
        healthy: false, 
        cashFlow: -5000,
        beginningBalance: 896000,
        diagnosis: "现金流紧张，支出大于收入",
        income: {
          total: 134000,
          salary: 79000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 139000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 81, 
        healthy: false, 
        cashFlow: -7000,
        beginningBalance: 889000,
        diagnosis: "现金流紧张，需控制支出",
        income: {
          total: 136000,
          salary: 80000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 143000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 82, 
        healthy: true, 
        cashFlow: 8000,
        beginningBalance: 897000,
        diagnosis: "现金流恢复，收入增加",
        healthType: 'need_use_savings',
        income: {
          total: 138000,
          salary: 81000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 130000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 83, 
        healthy: true, 
        cashFlow: 7000,
        beginningBalance: 904000,
        diagnosis: "现金流恢复，财务状况良好",
        healthType: 'need_use_savings',
        income: {
          total: 140000,
          salary: 82000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 133000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 84, 
        healthy: true, 
        cashFlow: 6000,
        beginningBalance: 910000,
        diagnosis: "现金流恢复，财务状况良好",
        healthType: 'need_use_savings',
        income: {
          total: 142000,
          salary: 83000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 136000,
          basic: 6000,
          education: 3000,
          medical: 1500,
          pension: 2000,
          housing: 6000,
          transportation: 2500,
          majorPurchases: 1000,
          familySupport: 1000
        }
      }
    ]
  }
];

const FinancialHealthOverview = ({ 
  onInteractionAttempt, 
  ageRange, 
  title = "生涯现金流健康概览",
  healthOverviewData,
  pageMode = 'public-balanced'
}: FinancialHealthOverviewProps) => {
  const { isMember, setMembershipStatus, isDevMode } = useMembership();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // 支付弹窗状态
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // 判断是否为普通客户状态
  const isPublicUser = pageMode?.startsWith('public-') || false;
  
  // 支付处理函数
  const handleWeChatPay = async () => {
    setIsProcessingPayment(true);
    
    try {
      // 模拟微信支付流程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 支付成功后的处理
      toast({
        title: "支付成功！",
        description: "欢迎成为会员，正在跳转到会员页面...",
      });
      
      setShowPaymentModal(false);
      
      // 设置会员状态 - 移除，改为直接处理pageMode
      
      // 跳转回当前页面，切换到对应的会员状态
      setTimeout(() => {
        // 根据当前普通客户状态切换到对应的会员状态
        const targetPageMode = pageMode?.startsWith('public-') 
          ? pageMode.replace('public-', 'member-') as 'member-balanced' | 'member-severe-shortage' | 'member-liquidity-tight'
          : 'member-balanced';
          
        navigate('/new', { 
          state: { 
            activeTab: 'discover',
            membershipActivated: true,
            pageMode: targetPageMode
          },
          replace: true
        });
      }, 1000);
      
    } catch (error) {
      console.error('支付处理错误:', error);
      toast({
        title: "支付失败",
        description: "请重试或联系客服",
        variant: "destructive"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };
  
  const getFinancialStagesData = () => {
    // 使用传入的healthOverviewData进行数据适配
    if (healthOverviewData?.pageMode === 'member-liquidity-tight' && healthOverviewData?.redYears) {
      const stages = [];
      
      // 生成30-85岁的数据，每5年一个阶段，使用传入的8年红色年份数据
      const redYears = healthOverviewData.redYears; // 8年红色年份: [32, 33, 38, 39, 41, 42, 46, 47]
      const description = healthOverviewData.description;
      
      for (let startAge = 30; startAge <= 80; startAge += 5) {
        const endAge = Math.min(startAge + 4, 85);
        const years = [];
        
        for (let year = startAge; year <= endAge; year++) {
          const isRedYear = redYears.includes(year);
          
          years.push({
            year,
            healthy: year === 30 ? true : !isRedYear,
            cashFlow: year === 30 ? -15000 : (isRedYear ? -8000 - Math.random() * 5000 : 15000 + (year - 30) * 1000),
            beginningBalance: year === 32 ? 10000 : 50000 + (year - 30) * 15000,
            diagnosis: year === 30 
              ? "当年收不抵支，金融资产余额5万，需确保1.5万流动性"
              : (isRedYear 
                ? description || "收支不平，消耗掉所有积蓄后仍然不够，需要卖掉房产才能覆盖支出"
                : "现金流健康，收入大于支出，财务状况良好"),
            pressureType: year === 30 ? undefined : (isRedYear ? 'need_sell_property' as const : undefined),
            healthType: year === 30 ? 'sufficient_assets' as const : (isRedYear ? undefined : 'income_covers_expenses' as const),
            income: {
              total: 30000 + (year - 30) * 2000,
              salary: 25000 + (year - 30) * 1500,
              rent: 5000 + Math.floor((year - 30) / 5) * 500,
              housingFund: 2000 + Math.floor((year - 30) / 10) * 500
            },
            expenses: {
              total: isRedYear ? 45000 + (year - 30) * 2000 : 15000 + (year - 30) * 800,
              basic: 4000 + Math.floor((year - 30) / 10) * 500,
              education: Math.max(0, 3000 - Math.floor((year - 50) / 5) * 500),
              medical: 800 + Math.floor((year - 30) / 10) * 200,
              pension: 1000 + Math.floor((year - 30) / 5) * 100,
              housing: 4000 + Math.floor((year - 30) / 10) * 500,
              transportation: 1500 + Math.floor((year - 30) / 15) * 200,
              majorPurchases: Math.max(500, 1000 - Math.floor((year - 60) / 5) * 200),
              familySupport: 1000 + Math.floor((year - 40) / 10) * 300
            }
          });
        }
        
        const hasRedYear = years.some(y => !y.healthy);
        stages.push({
          period: `${startAge}岁-${endAge}岁`,
          healthy: !hasRedYear,
          yearlyData: years
        });
      }
      
      return stages;
    }
    
    // 如果是会员-没钱状态，使用原有的严重缺口数据
    if (pageMode === 'member-severe-shortage') {
      return financialStagesData;
    }
    
    // 如果传入了无缺口数据，生成全绿色的财务阶段数据（30-85岁）
    if (healthOverviewData?.allHealthyYears) {
      const stages = [];
      
      // 生成30-85岁的数据，每5年一个阶段
      for (let startAge = 30; startAge <= 80; startAge += 5) {
        const endAge = Math.min(startAge + 4, 85);
        const years = [];
        
        for (let year = startAge; year <= endAge; year++) {
          years.push({
            year,
            healthy: true,
            cashFlow: 15000 + (year - 30) * 1000, // 逐年递增
            beginningBalance: 50000 + (year - 30) * 15000,
            diagnosis: "现金流健康，收入大于支出，财务状况良好",
            healthType: 'income_covers_expenses' as const,
            income: {
              total: 30000 + (year - 30) * 2000,
              salary: 25000 + (year - 30) * 1500,
              rent: 5000 + Math.floor((year - 30) / 5) * 500,
              housingFund: 2000 + Math.floor((year - 30) / 10) * 500
            },
            expenses: {
              total: 15000 + (year - 30) * 800,
              basic: 4000 + Math.floor((year - 30) / 10) * 500,
              education: Math.max(0, 3000 - Math.floor((year - 50) / 5) * 500),
              medical: 800 + Math.floor((year - 30) / 10) * 200,
              pension: 1000 + Math.floor((year - 30) / 5) * 100,
              housing: 4000 + Math.floor((year - 30) / 10) * 500,
              transportation: 1500 + Math.floor((year - 30) / 15) * 200,
              majorPurchases: Math.max(500, 1000 - Math.floor((year - 60) / 5) * 200),
              familySupport: 1000 + Math.floor((year - 40) / 10) * 300
            }
          });
        }
        
        stages.push({
          period: `${startAge}岁-${endAge}岁`,
          healthy: true,
          yearlyData: years
        });
      }
      
      return stages;
    }
    
    // 否则使用原有的包含红色年份的数据
    return financialStagesData;
  };

  const adaptedFinancialStagesData = getFinancialStagesData();
  
  // 根据年龄范围过滤数据
  const filteredStagesData = ageRange 
    ? adaptedFinancialStagesData.map(stage => ({
        ...stage,
        yearlyData: stage.yearlyData.filter(data => 
          data.year >= ageRange[0] && data.year <= ageRange[1]
        )
      })).filter(stage => stage.yearlyData.length > 0)
    : adaptedFinancialStagesData;
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showAllCards, setShowAllCards] = useState(false);
  
  const handlePeriodClick = (period: string) => {
    if (!isMember) {
      onInteractionAttempt?.();
      return;
    }
    setSelectedPeriod(period);
    setSelectedYear(null);
  };
  
  const handleBack = () => {
    if (selectedYear !== null) {
      setSelectedYear(null);
    } else {
      setSelectedPeriod(null);
    }
  };
  
  const handleYearClick = (year: number) => {
    if (!isMember) {
      onInteractionAttempt?.();
      return;
    }
    setSelectedYear(year);
  };
  
  const selectedPeriodData = selectedPeriod 
    ? filteredStagesData.find(stage => stage.period === selectedPeriod)
    : null;
  
  const selectedYearData = selectedYear && selectedPeriodData
    ? selectedPeriodData.yearlyData.find(data => data.year === selectedYear)
    : null;

  // 获取财务状态详细描述
  const getFinancialDescription = (yearData: YearlyFinancialData) => {
    if (!yearData.healthy) {
      // 财务压力情况
      if (!yearData.pressureType) return yearData.diagnosis;
      
      // 对于会员-没钱状态下的31岁年份，使用特定描述
      if (pageMode === 'member-severe-shortage' && yearData.year === 31) {
        return "虽然当年收入不足以覆盖支出，但动用金融资产即可补足缺口，财务健康";
      }
      
      // 对于会员-没钱状态下的32岁年份，使用特定描述
      if (pageMode === 'member-severe-shortage' && yearData.year === 32) {
        return "当年收入不足以覆盖支出，动用全部金融资产无法补足缺口，加上房产价值才可抵御缺口";
      }
      
      // 对于会员-没钱状态下的33岁年份，使用特定描述
      if (pageMode === 'member-severe-shortage' && yearData.year === 33) {
        return "当年收入不足以覆盖支出，动用全部金融资产和房产，仍无法补足缺口";
      }
      
      // 对于会员-差流动性状态下的32岁年份，使用特定描述
      if (pageMode === 'member-liquidity-tight' && yearData.year === 32) {
        return "当年收不抵支，收支缺口80万，金融资产仅有50万，房产100万；存在资产流动性风险。";
      }
      
      // 对于会员-没钱状态下的41岁年份，使用特定描述
      if (pageMode === 'member-severe-shortage' && yearData.year === 41) {
        return "当年收不抵支，收支缺口80万，金融资产仅有10万，房产100万；存在入不敷出风险";
      }
      
      switch (yearData.pressureType) {
        case 'need_sell_property':
          return "收支不平，消耗掉所有积蓄后仍然不够，需要卖掉房产才能覆盖支出";
        case 'insufficient_even_after_selling':
          return "收支不平，消耗掉所有积蓄后，且卖掉房产也无法覆盖支出";
        default:
          return yearData.diagnosis;
      }
    } else {
      // 财务健康情况
      if (!yearData.healthType) return yearData.diagnosis;
      
      switch (yearData.healthType) {
        case 'income_covers_expenses':
          return "当年收入足以覆盖支出，不需要动用积蓄";
        case 'need_use_savings':
          return "当年收入无法覆盖支出，需要动用金融资产的积蓄才能覆盖支出";
        default:
          return yearData.diagnosis;
      }
    }
  };
  
  return (
    <div className="mt-4 mb-6">
      {selectedYear !== null && selectedYearData && isMember ? (
        <div>
          <div className="flex items-center mb-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack} 
              className="flex items-center text-xs p-1"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              返回
            </Button>
            <span className="text-xs font-medium ml-2">{selectedYear}岁财务详情</span>
          </div>
          
          <YearlyFinancialDetails yearData={selectedYearData} pageMode={pageMode} />
          
        </div>
      ) : selectedPeriod && isMember ? (
        <div>
          <div className="flex items-center mb-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack} 
              className="flex items-center text-xs p-1"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              返回
            </Button>
            <span className="text-xs font-medium ml-2">{selectedPeriod}详情</span>
          </div>
          
          <div className="space-y-2">
            {selectedPeriodData?.yearlyData.map((yearData, index) => (
              <div 
                key={index}
                className={`rounded-md px-3 py-3 text-xs cursor-pointer transition-shadow ${
                  yearData.healthy 
                    ? 'bg-green-50 border border-green-100' 
                    : 'bg-red-50 border border-red-100'
                }`}
                onClick={() => handleYearClick(yearData.year)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <Calendar className={`h-4 w-4 ${yearData.healthy ? 'text-[#01BCD6]' : 'text-red-600'}`} />
                    <span>{yearData.year}岁</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={yearData.healthy ? 'text-green-600' : 'text-red-600'}>
                      {yearData.cashFlow > 0 ? '+' : ''}¥{yearData.cashFlow.toLocaleString()}
                    </span>
                    {yearData.healthy ? (
                      <CircleCheck className="h-3.5 w-3.5 text-[#01BCD6]" />
                    ) : (
                      <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-3 gap-3 relative">
            {(showAllCards ? filteredStagesData : filteredStagesData.slice(0, 5)).map((stage, index) => {
              return (
                <Card 
                  key={index}
                  onClick={() => {
                    console.log('=== FinancialHealthOverview 卡片点击调试 ===');
                    console.log('pageMode:', pageMode);
                    console.log('isPublicUser:', isPublicUser);
                    console.log('isMember:', isMember);
                    console.log('stage:', stage.period);
                    console.log('showPaymentModal:', showPaymentModal);
                    
                    if (isPublicUser) {
                      // 普通客户点击卡片，显示会员弹窗
                      console.log('普通客户状态，触发显示支付弹窗');
                      setShowPaymentModal(true);
                    } else {
                      // 会员客户正常执行点击逻辑
                      console.log('会员用户，执行正常点击逻辑');
                      handlePeriodClick(stage.period);
                    }
                  }}
                  className="bg-white rounded-xl aspect-square flex flex-col items-center justify-center p-3 cursor-pointer transition-all duration-200 border-0 relative shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                  style={{
                    boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.4), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 -1px 3px -1px rgba(0, 0, 0, 0.03)'
                  }}
                >
                  {(stage.healthy && !(pageMode === 'member-severe-shortage' && stage.period === '30岁-34岁')) ? (
                    <CircleCheck className="h-8 w-8 text-[#01BCD6] mb-2" strokeWidth={1} />
                  ) : (
                    <AlertCircle className="h-8 w-8 text-red-600 mb-2" strokeWidth={1} />
                  )}
                  
                  <div className="font-medium text-xs text-center text-gray-800">
                    {stage.period}
                  </div>
                </Card>
              );
            })}
            
            {/* 展开更多按钮 - 只在第6个位置显示，且还有更多数据时 */}
            {!showAllCards && filteredStagesData.length > 5 && (
              <Card 
                onClick={() => setShowAllCards(true)}
                className="bg-white rounded-xl aspect-square flex flex-col items-center justify-center p-3 cursor-pointer transition-all duration-200 border-0 relative shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                style={{
                  boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.4), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 -1px 3px -1px rgba(0, 0, 0, 0.03)'
                }}
              >
                <div className="text-xl mb-1 text-gray-500">···</div>
                <div className="font-medium text-xs text-center text-gray-600">
                  展开更多
                </div>
              </Card>
            )}
            
            {/* 收起按钮 - 在展开状态下显示 */}
            {showAllCards && filteredStagesData.length > 5 && (
              <Card 
                onClick={() => setShowAllCards(false)}
                className="bg-white rounded-xl aspect-square flex flex-col items-center justify-center p-3 cursor-pointer transition-all duration-200 border-0 relative shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                style={{
                  boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.4), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 -1px 3px -1px rgba(0, 0, 0, 0.03)'
                }}
              >
                <div className="text-xl mb-1 text-gray-500">↑</div>
                <div className="font-medium text-xs text-center text-gray-600">
                  收起
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
      
      {/* 支付弹窗 */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">开通会员</DialogTitle>
            <DialogDescription className="text-center">
              查看生涯现金流健康概览详情需要升级为会员
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* 价格信息 */}
            <div className="text-center bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-800 mb-1">¥29.9</div>
              <div className="text-sm text-gray-600">月度会员</div>
              <div className="text-xs text-gray-500 line-through">原价 ¥99</div>
            </div>

            {/* 会员权益 */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">会员权益：</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 专业风险评估和解决方案</li>
                <li>• 个性化财富管理建议</li>
                <li>• 完整的财富分型解读</li>
                <li>• 不限次数的工具使用</li>
              </ul>
            </div>

            {/* 微信支付按钮 */}
            <Button
              onClick={handleWeChatPay}
              disabled={isProcessingPayment}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  处理中...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.5 2A5.5 5.5 0 003 7.5v9A5.5 5.5 0 008.5 22h7a5.5 5.5 0 0015.5-5.5v-9A5.5 5.5 0 0015.5 2h-7zm0 2h7A3.5 3.5 0 0119 7.5v9a3.5 3.5 0 01-3.5 3.5h-7A3.5 3.5 0 015 16.5v-9A3.5 3.5 0 018.5 4zM12 6.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zm0 2a3.5 3.5 0 110 7 3.5 3.5 0 010-7z"/>
                  </svg>
                  微信支付 ¥29.9
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancialHealthOverview;
