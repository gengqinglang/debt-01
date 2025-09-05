
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CircleCheck, AlertCircle, Calendar, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';

// 扩展年度财务数据结构，加入更多详细信息
interface YearlyFinancialData {
  year: number;
  healthy: boolean;
  cashFlow: number;
  beginningBalance: number;
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
  };
}

// 更新财务阶段数据结构
interface FinancialStage {
  period: string;
  healthy: boolean;
  yearlyData: YearlyFinancialData[];
}

// 完整的财务阶段数据（30-85岁）
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
        cashFlow: 18000,
        beginningBalance: 65000,
        diagnosis: "现金流健康，收入稳步增长，支出稳定",
        healthType: 'income_covers_expenses',
        income: {
          total: 35000,
          salary: 27000,
          rent: 5500,
          housingFund: 2500
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
        year: 32, 
        healthy: true, 
        cashFlow: 20000,
        beginningBalance: 83000,
        diagnosis: "现金流健康，储蓄稳步增加",
        healthType: 'income_covers_expenses',
        income: {
          total: 38000,
          salary: 29000,
          rent: 6000,
          housingFund: 3000
        },
        expenses: {
          total: 18000,
          basic: 5000,
          education: 2000,
          medical: 1000,
          pension: 1200,
          housing: 5000,
          transportation: 1800,
          majorPurchases: 1000,
          familySupport: 1000
        }
      },
      { 
        year: 33, 
        healthy: true, 
        cashFlow: 22000,
        beginningBalance: 103000,
        diagnosis: "现金流健康，可考虑增加投资",
        healthType: 'income_covers_expenses',
        income: {
          total: 41000,
          salary: 31000,
          rent: 7000,
          housingFund: 3000
        },
        expenses: {
          total: 19000,
          basic: 5000,
          education: 2500,
          medical: 1000,
          pension: 1500,
          housing: 5000,
          transportation: 2000,
          majorPurchases: 1000,
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
        cashFlow: -5000,
        beginningBalance: 295000,
        diagnosis: "现金流紧张，需要动用积蓄和房产变现",
        pressureType: 'need_sell_property',
        income: {
          total: 58000,
          salary: 41000,
          rent: 9000,
          housingFund: 8000
        },
        expenses: {
          total: 63000,
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

// 获取财务状态详细描述
const getFinancialDescription = (yearData: YearlyFinancialData) => {
  if (!yearData.healthy) {
    // 财务压力情况
    if (!yearData.pressureType) return yearData.diagnosis;
    
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

const FinancialLifeStages = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  
  // 处理卡片点击，展示详情
  const handlePeriodClick = (period: string) => {
    setSelectedPeriod(period);
    setSelectedYear(null);
  };
  
  // 返回5年视图
  const handleBack = () => {
    if (selectedYear !== null) {
      setSelectedYear(null);
    } else {
      setSelectedPeriod(null);
    }
  };
  
  // 处理年份点击，展示详情
  const handleYearClick = (year: number) => {
    setSelectedYear(year);
  };
  
  // 选中的5年期数据
  const selectedPeriodData = selectedPeriod 
    ? financialStagesData.find(stage => stage.period === selectedPeriod)
    : null;
  
  // 选中的年份数据
  const selectedYearData = selectedYear && selectedPeriodData
    ? selectedPeriodData.yearlyData.find(data => data.year === selectedYear)
    : null;
  
  return (
    <div className="mt-4 mb-6">
      <h3 className="text-sm font-medium mb-2">生涯现金流健康概览</h3>
      
      <div className="bg-white rounded-lg border p-3">
        {selectedYear !== null && selectedYearData ? (
          // 年份详细视图
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
            
            {/* 健康状态卡片 */}
            <Card className={`p-3 mb-3 ${
              selectedYearData.healthy 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {selectedYearData.healthy ? (
                  <CircleCheck className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-medium text-sm">
                  {selectedYearData.healthy ? "财务健康" : "财务压力"}
                </span>
              </div>
              <div className="text-xs text-gray-700">
                {getFinancialDescription(selectedYearData)}
              </div>
            </Card>
            
            {/* 年初积蓄 */}
            <Card className="p-3 mb-3 bg-blue-50 border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">年初可用积蓄</span>
                <span className="text-sm font-medium text-blue-700">
                  ¥{selectedYearData.beginningBalance.toLocaleString()}
                </span>
              </div>
            </Card>

            {/* 当年收支缺口 - 当收入小于支出时显示 */}
            {selectedYearData.income.total < selectedYearData.expenses.total && (
              <Card className="p-3 mb-3 bg-orange-50 border-orange-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">当年收支缺口</span>
                  <span className="text-sm font-medium text-orange-700">
                    ¥{Math.abs(selectedYearData.income.total - selectedYearData.expenses.total).toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  支出大于收入，存在缺口
                </div>
              </Card>
            )}
            
            {/* 收入详情卡片 */}
            <Card className="p-3 mb-3 bg-green-50 border-green-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">总收入</span>
                <span className="text-sm font-medium text-green-700">
                  ¥{selectedYearData.income.total.toLocaleString()}
                </span>
              </div>
              
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span>工资收入</span>
                  <span>¥{selectedYearData.income.salary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>房租收入</span>
                  <span>¥{selectedYearData.income.rent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>公积金</span>
                  <span>¥{selectedYearData.income.housingFund.toLocaleString()}</span>
                </div>
                {selectedYearData.income.other && (
                  <div className="flex justify-between items-center">
                    <span>其他收入</span>
                    <span>¥{selectedYearData.income.other.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </Card>
            
            {/* 支出详情卡片 */}
            <Card className="p-3 bg-red-50 border-red-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">总支出</span>
                <span className="text-sm font-medium text-red-700">
                  ¥{selectedYearData.expenses.total.toLocaleString()}
                </span>
              </div>
              
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span>基础生活</span>
                  <span>¥{selectedYearData.expenses.basic.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>教育</span>
                  <span>¥{selectedYearData.expenses.education.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>医疗</span>
                  <span>¥{selectedYearData.expenses.medical.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>养老</span>
                  <span>¥{selectedYearData.expenses.pension.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>居住</span>
                  <span>¥{selectedYearData.expenses.housing.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>交通</span>
                  <span>¥{selectedYearData.expenses.transportation.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>大额消费</span>
                  <span>¥{selectedYearData.expenses.majorPurchases.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>赡养</span>
                  <span>¥{selectedYearData.expenses.familySupport.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </div>
        ) : selectedPeriod ? (
          // 年度详情视图
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
                  className={`rounded-md px-3 py-3 text-xs cursor-pointer hover:shadow-md transition-shadow ${
                    yearData.healthy 
                      ? 'bg-green-50 border border-green-100' 
                      : 'bg-red-50 border border-red-100'
                  }`}
                  onClick={() => handleYearClick(yearData.year)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <Calendar className={`h-4 w-4 ${yearData.healthy ? 'text-green-600' : 'text-red-600'}`} />
                      <span>{yearData.year}岁</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={yearData.healthy ? 'text-green-600' : 'text-red-600'}>
                        {yearData.cashFlow > 0 ? '+' : ''}¥{yearData.cashFlow.toLocaleString()}
                      </span>
                      {yearData.healthy ? (
                        <CircleCheck className="h-3.5 w-3.5 text-green-600" />
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
          // 5年期视图
          <div>
            <div className="grid grid-cols-3 gap-2">
              {financialStagesData.map((stage, index) => {
                return (
                  <Card 
                    key={index}
                    onClick={() => handlePeriodClick(stage.period)}
                    className={`rounded-lg aspect-square flex flex-col items-center justify-center p-2 cursor-pointer hover:shadow-md transition-shadow ${
                      stage.healthy 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    } border`}
                  >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-1 ${
                      stage.healthy ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {stage.healthy ? (
                        <CircleCheck className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    
                    <div className="font-medium text-xs text-center">
                      {stage.period}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AssessmentBasisPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B3EBEF]/15 via-[#CCE9B5]/10 to-[#FFEA96]/15">
      <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <button onClick={handleBack} className="p-2" aria-label="返回">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">测评依据</h1>
          <div className="w-10 h-10"></div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <FinancialLifeStages />
        </div>
      </div>
    </div>
  );
};

export default AssessmentBasisPage;
