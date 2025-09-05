import React, { useState, createContext, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import OptimizationCards from './OptimizationCards';

// 优化方案状态管理
interface OptimizationState {
  // 商业贷款转公积金
  mortgageConversions: Array<{
    id: number;
    convertAmount: number;
    newRate: number;
    feeRate: number;
  }>;
  // 固定利率转浮动利率  
  rateConversions: Array<{
    id: number;
    newRate: number;
  }>;
  // 修改还款方式
  paymentMethodChanges: Array<{
    id: number;
    newMethod: string;
  }>;
  // 提前还款
  prepayments: Array<{
    id: number;
    amount: number;
    type: 'reduce-term' | 'reduce-payment';
  }>;
  // 延期还款
  deferments: Array<{
    id: number;
    months: number;
  }>;
  // 收支规划调整
  budgetAdjustments: {
    incomeIncrease: number;
    expenseReduction: number;
  };
}

const defaultOptimizationState: OptimizationState = {
  mortgageConversions: [],
  rateConversions: [],
  paymentMethodChanges: [],
  prepayments: [],
  deferments: [],
  budgetAdjustments: {
    incomeIncrease: 0,
    expenseReduction: 0
  }
};

const OptimizationContext = createContext<{
  optimizationState: OptimizationState;
  updateOptimization: (key: keyof OptimizationState, value: any) => void;
}>({
  optimizationState: defaultOptimizationState,
  updateOptimization: () => {}
});

export const useOptimization = () => useContext(OptimizationContext);

const InsightsAdviceModule: React.FC = () => {
  const navigate = useNavigate();
  const [optimizationState, setOptimizationState] = useState<OptimizationState>(defaultOptimizationState);

  const updateOptimization = (key: keyof OptimizationState, value: any) => {
    setOptimizationState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 生成基础现金流数据（现状）
  const generateBaseCashFlowData = () => {
    const data: any[] = [];
    const riskStartAge = 28;
    const riskDuration = 15;

    for (let age = 28; age <= 85; age++) {
      const baseInflow = 45 + (age - 28) * 0.8;
      const baseOutflow = 25 + (age - 28) * 0.3;
      
      const waveEffect1 = Math.sin((age - 28) * 0.3) * 3;
      const waveEffect2 = Math.cos((age - 28) * 0.5) * 1.5;
      const randomVariation = (Math.random() - 0.5) * 2;
      
      const normalInflow = baseInflow + waveEffect1 + randomVariation;
      const normalOutflow = baseOutflow + waveEffect2 * 0.5;
      const normalSurplus = normalInflow - normalOutflow;

      let riskSurplus;
      
      if (age >= riskStartAge && age < riskStartAge + riskDuration) {
        const riskProgress = (age - riskStartAge) / (riskDuration - 1);
        riskSurplus = -40 + riskProgress * 15;
      } else if (age < riskStartAge) {
        riskSurplus = normalSurplus * 0.9;
      } else {
        const yearsAfterRisk = age - (riskStartAge + riskDuration);
        if (yearsAfterRisk <= 10) {
          const recoveryProgress = yearsAfterRisk / 10;
          riskSurplus = -25 + recoveryProgress * (normalSurplus * 0.6 + 25);
        } else {
          const stabilizationFactor = Math.min(0.7, 0.6 + (yearsAfterRisk - 10) / 100);
          riskSurplus = normalSurplus * stabilizationFactor;
        }
      }

      data.push({
        age,
        currentSurplus: Math.round(riskSurplus * 10) / 10, // 现状线（红色）
      });
    }

    return data;
  };

  // 计算优化后的现金流数据
  const calculateOptimizedCashFlow = (baseData: any[]) => {
    return baseData.map(point => {
      let optimizedSurplus = point.currentSurplus;
      
      // 基础优化效果：确保蓝色线与红色线有明显间距
      let baseImprovement = 5; // 增加基础改善到5万元/年，确保间距明显
      
      // 1. 商业贷款转公积金影响
      if (optimizationState.mortgageConversions.length > 0) {
        const totalMonthlySaving = optimizationState.mortgageConversions.reduce((sum, conv) => {
          if (conv.convertAmount > 0 && conv.newRate > 0) {
            // 假设每万元转换平均能节省年利息约1000元
            return sum + (conv.convertAmount * 0.1);
          }
          return sum;
        }, 0);
        baseImprovement += totalMonthlySaving;
      }
      
      // 2. 提前还款影响
      if (optimizationState.prepayments.length > 0) {
        const totalSaving = optimizationState.prepayments.reduce((sum, prep) => {
          if (prep.amount > 0) {
            // 提前还款带来的年化节省
            return sum + (prep.amount * 0.08);
          }
          return sum;
        }, 0);
        baseImprovement += totalSaving;
      }
      
      // 3. 收支规划调整影响
      baseImprovement += optimizationState.budgetAdjustments.incomeIncrease;
      baseImprovement += optimizationState.budgetAdjustments.expenseReduction;
      
      // 4. 其他优化措施影响
      if (optimizationState.rateConversions.length > 0) {
        baseImprovement += 1.5; // 利率转换带来的改善
      }
      
      if (optimizationState.paymentMethodChanges.length > 0) {
        baseImprovement += 1; // 还款方式改变带来的改善
      }
      
      // 应用优化效果
      optimizedSurplus = point.currentSurplus + baseImprovement;
      
      return {
        ...point,
        optimizedSurplus: Math.round(optimizedSurplus * 10) / 10
      };
    });
  };

  const baseCashFlowData = generateBaseCashFlowData();
  const cashFlowData = calculateOptimizedCashFlow(baseCashFlowData);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`年龄: ${label}岁`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === 'currentSurplus' ? '现状' : '优化后'}: {entry.value}万元
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleExploreOptimization = () => {
    navigate('/debt-optimization');
  };

  return (
    <OptimizationContext.Provider value={{ optimizationState, updateOptimization }}>
      <div className="space-y-4">
        {/* Content removed */}
      </div>
    </OptimizationContext.Provider>
  );
};

export default InsightsAdviceModule;