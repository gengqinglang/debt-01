import { useMemo } from 'react';

export interface AnnualSurplusData {
  age: number;
  year: string;
  amount: number;
}

export interface DisposableWealthData {
  age: number;
  year: string;
  amount: number;
}

export interface SavingsData {
  age: number;
  year: string;
  amount: number;
}

export interface WithdrawSavingsData {
  age: number;
  year: string;
  amount: number;
  savingsAmount?: number; // 动用积蓄金额
  propertyAmount?: number; // 变卖房产金额
}

export interface FinancingData {
  age: number;
  year: string;
  isLoanYear: boolean;
  isRepaymentYear: boolean;
  repaymentAmount: number;
}

export const useFinancialHeatmapData = () => {
  // 1. 每年结余总额数据 - 支持正负数
  const annualSurplusData = useMemo(() => {
    const data: AnnualSurplusData[] = [];
    
    for (let age = 30; age <= 85; age++) {
      let amount = 0;
      
      if (age >= 30 && age <= 70) {
        const peak = 50;
        const maxAmount = 25;
        
        if (age <= peak) {
          amount = Math.round(5 + (age - 30) / (peak - 30) * (maxAmount - 5));
        } else {
          amount = Math.round(maxAmount - (age - peak) / (70 - peak) * (maxAmount - 3));
        }
        
        const pseudoRandom = (age * 11 + 13) % 7 - 3;
        amount = amount + pseudoRandom;
        
        if (age >= 65 && age <= 75) {
          const deficitChance = (age - 65) / 10;
          if ((age * 17 + 23) % 10 < deficitChance * 10) {
            amount = -Math.abs(amount) * 0.5;
          }
        }
      } else if (age > 70) {
        const baseDeficit = (age - 70) * 2;
        const pseudoRandom = (age * 7 + 19) % 11 - 5;
        amount = -Math.max(0, baseDeficit + pseudoRandom);
      }
      
      data.push({
        age,
        year: `${2024 - 30 + age}`,
        amount: Math.round(amount)
      });
    }
    
    return data;
  }, []);

  // 2. 可自由支配财富数据
  const disposableWealthData = useMemo(() => {
    const data: DisposableWealthData[] = [];
    
    for (let age = 30; age <= 85; age++) {
      let amount = 0;
      
      if (age >= 35 && age <= 65) {
        const peak = 50;
        const maxAmount = 15;
        
        if (age <= peak) {
          amount = Math.round((age - 35) / (peak - 35) * maxAmount);
        } else {
          amount = Math.round(maxAmount - (age - peak) / (65 - peak) * maxAmount);
        }
        
        const pseudoRandom = (age * 17 + 23) % 7 - 3;
        amount = Math.max(0, amount + pseudoRandom);
      }
      
      data.push({
        age,
        year: `${2024 - 30 + age}`,
        amount
      });
    }
    
    return data;
  }, []);

  // 3. 需要存钱的数据
  const savingsData = useMemo(() => {
    const data: SavingsData[] = [];
    
    for (let age = 30; age <= 85; age++) {
      let amount = 0;
      
      if (age >= 30 && age <= 60) {
        const maxAmount = 12;
        
        if (age <= 45) {
          amount = Math.round(maxAmount - (age - 30) / 15 * 4);
        } else {
          amount = Math.round(8 - (age - 45) / 15 * 8);
        }
        
        const pseudoRandom = (age * 13 + 19) % 5 - 2;
        amount = Math.max(0, amount + pseudoRandom);
      }
      
      data.push({
        age,
        year: `${2024 - 30 + age}`,
        amount
      });
    }
    
    return data;
  }, []);

  // 4. 动用积蓄的数据
  const withdrawSavingsData = useMemo(() => {
    const data: WithdrawSavingsData[] = [];
    
    for (let age = 30; age <= 85; age++) {
      let amount = 0;
      
      if (age >= 60 && age <= 85) {
        const maxAmount = 20;
        
        if (age <= 75) {
          amount = Math.round((age - 60) / (75 - 60) * maxAmount);
        } else {
          amount = Math.round(maxAmount - (age - 75) / 10 * 5);
        }
        
        const pseudoRandom = (age * 7 + 31) % 5 - 2;
        amount = Math.max(0, amount + pseudoRandom);
      }
      
      let savingsAmount = 0;
      let propertyAmount = 0;
      
      // 72岁分开计算动用积蓄和变卖房产
      if (age === 72) {
        savingsAmount = 50; // 动用积蓄50万
        propertyAmount = 114; // 变卖房产114万
        amount = savingsAmount + propertyAmount; // 总金额
      } else if (amount > 0) {
        savingsAmount = amount; // 其他年份只有动用积蓄
      }
      
      data.push({
        age,
        year: `${2024 - 30 + age}`,
        amount,
        savingsAmount,
        propertyAmount
      });
    }
    
    return data;
  }, []);

  // 5. 融资计划数据
  const financingData = useMemo(() => {
    const data: FinancingData[] = [];
    const loanAge = 45;
    const loanTerm = 15;
    const totalLoanAmount = 250;
    const annualRepayment = totalLoanAmount / loanTerm;
    
    for (let age = 30; age <= 85; age++) {
      const isLoanYear = age === loanAge;
      const isRepaymentYear = age >= loanAge && age < loanAge + loanTerm;
      
      data.push({
        age,
        year: `${2024 - 30 + age}`,
        isLoanYear,
        isRepaymentYear,
        repaymentAmount: isRepaymentYear ? Math.round(annualRepayment * 10) / 10 : 0
      });
    }
    
    return data;
  }, []);

  // 计算攒钱用途的函数
  const getSavingsUsageYears = (savingsAge: number) => {
    const usageYears: Array<{age: number, year: string, amount: number}> = [];
    const futureWithdrawYears = withdrawSavingsData.filter(w => w.age > savingsAge && w.amount > 0);
    
    if (futureWithdrawYears.length > 0) {
      const sortedYears = futureWithdrawYears
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3);
      
      sortedYears.forEach(year => {
        usageYears.push({
          age: year.age,
          year: year.year,
          amount: year.amount
        });
      });
    }
    
    return usageYears;
  };

  return {
    annualSurplusData,
    disposableWealthData,
    savingsData,
    withdrawSavingsData,
    financingData,
    getSavingsUsageYears
  };
};