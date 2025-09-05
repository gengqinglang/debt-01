import React from 'react';
import { Card } from '@/components/ui/card';

interface AgeGapDetailsProps {
  age: number;
  gapAmount: number;
}

export const AgeGapDetailsComponent: React.FC<AgeGapDetailsProps> = ({ age, gapAmount }) => {
  // 根据年龄模拟现金流入数据
  const generateIncomeData = (age: number) => {
    const baseIncome = {
      salary: 400000 + (age - 30) * 5000, // 工资随年龄增长
      rent: 5000 + (age - 30) * 500,      // 房租随年龄增长
      housingFund: 2000 + (age - 30) * 100, // 公积金增长
      criticalIllnessInsurance: 0,         // 重疾险赔付
      other: 0                             // 其他收入
    };
    
    // 因为发生重疾失能，部分收入可能会受影响
    baseIncome.salary = Math.round(baseIncome.salary * 0.3); // 工资大幅减少
    baseIncome.criticalIllnessInsurance = 0; // 删除重疾险赔付
    
    return baseIncome;
  };

  // 根据年龄模拟现金流出数据  
  const generateExpenseData = (age: number) => {
    const baseExpenses = {
      basic: 45000 + (age - 30) * 1000,        // 基础生活费用
      medical: 8000 + (age - 30) * 500,        // 日常医疗
      criticalTreatment: 300000 + (age - 30) * 10000, // 重疾治疗费用随年龄增长
      education: age < 40 ? 20000 + (age - 30) * 2000 : 0, // 教育费用
      pension: 12000 + (age - 30) * 500,       // 养老金缴费
      housing: 50000,                          // 居住费用
      transportation: 15000,                   // 交通费用
      majorPurchases: 10000,                   // 大额消费
      familySupport: 10000 + (age - 30) * 500, // 家庭赡养
      other: 0                                 // 其他支出
    };
    
    return baseExpenses;
  };

  const incomeData = generateIncomeData(age);
  const expenseData = generateExpenseData(age);
  
  // 计算总收入和总支出
  const totalIncome = Object.values(incomeData).reduce((sum, value) => sum + value, 0);
  const totalExpenses = Object.values(expenseData).reduce((sum, value) => sum + value, 0);
  const netCashFlow = totalIncome - totalExpenses;

  return (
    <div className="space-y-2">
      {/* 当年现金流缺口显示 */}
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <Card className="p-3 bg-red-50/60 border-red-200/40">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">当年现金流缺口</span>
              <span className="text-sm font-semibold text-red-600">
                -¥{Math.abs(netCashFlow).toLocaleString()}
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
              <span className="text-sm text-gray-600">工资收入（减少后）</span>
              <span className="text-sm text-gray-800">¥{incomeData.salary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">房租收入</span>
              <span className="text-sm text-gray-800">¥{incomeData.rent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">公积金</span>
              <span className="text-sm text-gray-800">¥{incomeData.housingFund.toLocaleString()}</span>
            </div>
            {incomeData.criticalIllnessInsurance > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">重疾险赔付</span>
                <span className="text-sm text-gray-800">¥{incomeData.criticalIllnessInsurance.toLocaleString()}</span>
              </div>
            )}
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
              <span className="text-sm text-gray-600">重疾治疗费用</span>
              <span className="text-sm text-gray-800">¥{expenseData.criticalTreatment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">日常医疗</span>
              <span className="text-sm text-gray-800">¥{expenseData.medical.toLocaleString()}</span>
            </div>
            {expenseData.education > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">教育</span>
                <span className="text-sm text-gray-800">¥{expenseData.education.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">养老</span>
              <span className="text-sm text-gray-800">¥{expenseData.pension.toLocaleString()}</span>
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
              <span className="text-sm text-gray-600">大额消费</span>
              <span className="text-sm text-gray-800">¥{expenseData.majorPurchases.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">赡养</span>
              <span className="text-sm text-gray-800">¥{expenseData.familySupport.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};