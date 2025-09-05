import React from 'react';
import { Card } from '@/components/ui/card';

interface LongevityAgeGapDetailsProps {
  age: number;
  gapAmount: number;
}

export const LongevityAgeGapDetailsComponent: React.FC<LongevityAgeGapDetailsProps> = ({ age, gapAmount }) => {
  console.log(`[LongevityAgeGapDetails] Age: ${age}, 传入的gapAmount: ${gapAmount}万`);
  
  // 使用传入的gapAmount作为实际缺口，确保一致性
  const actualGap = gapAmount * 10000; // 转换为元
  console.log(`[LongevityAgeGapDetails] 转换后的actualGap: ${actualGap}元 (${actualGap/10000}万)`);

  // 根据年龄模拟长寿风险场景下的现金流入数据（排除重疾相关）
  const generateIncomeData = (age: number) => {
    const baseIncome = {
      pension: 80000 + (age - 80) * 2000,     // 养老金随年龄增长
      rent: 8000 + (age - 80) * 300,          // 房租收入
      investment: 15000 + (age - 80) * 500,   // 投资收益
      savings: 5000,                          // 储蓄利息
      other: 0                                // 其他收入
    };
    
    return baseIncome;
  };

  // 根据年龄和实际缺口金额，反推现金流出数据
  const generateExpenseData = (age: number, actualGap: number) => {
    const incomeData = generateIncomeData(age);
    const totalIncome = Object.values(incomeData).reduce((sum, value) => sum + value, 0);
    
    // 总支出 = 总收入 + 实际缺口
    const totalExpensesNeeded = totalIncome + actualGap;
    
    // 按比例分配各项支出，确保总和等于需要的总支出
    const baseExpenses = {
      basic: 60000 + (age - 80) * 2000,       // 基础生活费用随年龄增长
      medical: 25000 + (age - 80) * 3000,     // 日常医疗费用随年龄增长
      nursing: 40000 + (age - 80) * 5000,     // 护理费用随年龄显著增长
      housing: 30000 + (age - 80) * 1000,     // 居住费用
      transportation: 8000,                   // 交通费用
      entertainment: 15000,                   // 娱乐休闲
      familySupport: 20000,                   // 家庭支持
      other: 5000                             // 其他支出
    };
    
    // 计算基础支出总和
    const baseTotal = Object.values(baseExpenses).reduce((sum, value) => sum + value, 0);
    
    // 计算调整比例，使总支出等于需要的金额
    const adjustmentRatio = totalExpensesNeeded / baseTotal;
    
    // 按比例调整各项支出
    const adjustedExpenses = {
      basic: Math.round(baseExpenses.basic * adjustmentRatio),
      medical: Math.round(baseExpenses.medical * adjustmentRatio),
      nursing: Math.round(baseExpenses.nursing * adjustmentRatio),
      housing: Math.round(baseExpenses.housing * adjustmentRatio),
      transportation: Math.round(baseExpenses.transportation * adjustmentRatio),
      entertainment: Math.round(baseExpenses.entertainment * adjustmentRatio),
      familySupport: Math.round(baseExpenses.familySupport * adjustmentRatio),
      other: Math.round(baseExpenses.other * adjustmentRatio)
    };
    
    return adjustedExpenses;
  };

  const incomeData = generateIncomeData(age);
  const expenseData = generateExpenseData(age, actualGap);
  
  // 计算总收入和总支出
  const totalIncome = Object.values(incomeData).reduce((sum, value) => sum + value, 0);
  const totalExpenses = Object.values(expenseData).reduce((sum, value) => sum + value, 0);

  return (
    <div className="space-y-2">
      {/* 当年现金流缺口显示 */}
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <Card className="p-3 bg-red-50/60 border-red-200/40">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">当年现金流缺口</span>
              <span className="text-sm font-semibold text-red-600">
                {gapAmount}万元
              </span>
            </div>
          </Card>
        </div>
      </div>
      
      {/* 等号分隔符 */}
      <div className="flex justify-center">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-600">=</span>
        </div>
      </div>
      
      {/* 现金流明细：垂直布局 */}
      <div className="space-y-2">
        {/* 现金流入 */}
        <Card className="p-3 bg-green-50/40 border-green-200/60">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-green-800">现金流入</span>
            <span className="text-sm font-semibold text-green-700">
              ¥{totalIncome.toLocaleString()}
            </span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">养老金</span>
              <span className="text-sm text-gray-800">¥{incomeData.pension.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">房租收入</span>
              <span className="text-sm text-gray-800">¥{incomeData.rent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">投资收益</span>
              <span className="text-sm text-gray-800">¥{incomeData.investment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">储蓄利息</span>
              <span className="text-sm text-gray-800">¥{incomeData.savings.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* 减号分隔符 */}
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-600">−</span>
          </div>
        </div>

        {/* 现金流出 */}
        <Card className="p-3 bg-red-50/40 border-red-200/60">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-red-800">现金流出</span>
            <span className="text-sm font-semibold text-red-700">
              ¥{totalExpenses.toLocaleString()}
            </span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">基础生活</span>
              <span className="text-sm text-gray-800">¥{expenseData.basic.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">日常医疗</span>
              <span className="text-sm text-gray-800">¥{expenseData.medical.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">护理费用</span>
              <span className="text-sm text-gray-800">¥{expenseData.nursing.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">居住</span>
              <span className="text-sm text-gray-800">¥{expenseData.housing.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">交通</span>
              <span className="text-sm text-gray-800">¥{expenseData.transportation.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">娱乐休闲</span>
              <span className="text-sm text-gray-800">¥{expenseData.entertainment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">家庭支持</span>
              <span className="text-sm text-gray-800">¥{expenseData.familySupport.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">其他支出</span>
              <span className="text-sm text-gray-800">¥{expenseData.other.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};