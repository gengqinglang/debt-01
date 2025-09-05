import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Home, Calculator, CheckCircle, Info, TrendingUp, Shield, Lightbulb, Target, PiggyBank, FileText, ChevronLeft, ChevronRight, AlertTriangle, Settings } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useOptimization } from '../baogao/InsightsAdviceModule';
import PrepaymentCapacityHeatmap from './PrepaymentCapacityHeatmap';
import { FourModuleAdjustmentSuggestions } from '../asset-freedom/components/FourModuleAdjustmentSuggestions';

interface MortgageData {
  id: number;
  name: string;
  currentAmount: number;
  currentRate: number;
  remainingYears: number;
  convertAmount: number;
  newRate: number; // legacy field
  publicFundRate: number; // 公积金利率(%)
  lprBp: number; // LPR加减点（以百分比表示，如-0.2 代表-20bp）
  feeRate: number;
  // 提前还款相关字段
  prepaymentAmount?: number;
  prepaymentType?: 'reduce-term' | 'reduce-payment';
}

const OptimizationCards: React.FC = () => {
  const { optimizationState } = useOptimization();
  const navigationRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [subStep, setSubStep] = useState(1); // 子步骤，用于第一个手段内部流程
  const [isCustomPaymentExpanded, setIsCustomPaymentExpanded] = useState(false); // 控制自定义还款方式调整展开状态
  const [isAdvancePaymentExpanded, setIsAdvancePaymentExpanded] = useState(false); // 控制自定义提前还款展开状态
  const [hasInputDefermentPeriods, setHasInputDefermentPeriods] = useState(false); // 控制是否已录入延期期限
  const [isPrepaymentCapacityExpanded, setIsPrepaymentCapacityExpanded] = useState(false); // 控制未来提前还款能力预测展开状态
  const [selectedYearData, setSelectedYearData] = useState<any>(null); // 选中年份的详细数据
  const [hasViewedOptimization, setHasViewedOptimization] = useState(false); // 跟踪用户是否点击了查看优化效果
  const [optimizationSnapshot, setOptimizationSnapshot] = useState<MortgageData[]>([]); // 保存点击"查看优化效果"时的数据快照
  const [confirmedOptimizations, setConfirmedOptimizations] = useState<number[]>([]); // 记录已确认的优化步骤
  const optimizationMethods = [
    { id: 1, name: '商业贷款转化为公积金贷款', shortName: '商贷转公积金', icon: Home, color: 'text-blue-600' },
    { id: 2, name: '固定利率转浮动利率', shortName: '转浮动利率', icon: TrendingUp, color: 'text-green-600' },
    { id: 3, name: '修改还款方式', shortName: '改还款方式', icon: Shield, color: 'text-orange-600' },
    { id: 4, name: '提前还款', shortName: '提前还款', icon: Lightbulb, color: 'text-purple-600' },
    { id: 5, name: '延期还款', shortName: '延期还款', icon: Target, color: 'text-red-600' },
    { id: 6, name: '调整收支规划', shortName: '调整收支', icon: PiggyBank, color: 'text-indigo-600' }
  ];
  const [mortgages, setMortgages] = useState<MortgageData[]>([
    {
      id: 1,
      name: '房贷2',
      currentAmount: 2000000,
      currentRate: 4.9,
      remainingYears: 25,
      convertAmount: 0,
      newRate: 0,
      publicFundRate: 0,
      lprBp: 0,
      feeRate: 0
    },
    {
      id: 2,
      name: '房贷1',
      currentAmount: 1500000,
      currentRate: 5.4,
      remainingYears: 20,
      convertAmount: 0,
      newRate: 0,
      publicFundRate: 0,
      lprBp: 0,
      feeRate: 0
    },
    {
      id: 3,
      name: '房贷2',
      currentAmount: 1000000,
      currentRate: 5.6,
      remainingYears: 15,
      convertAmount: 0,
      newRate: 0,
      publicFundRate: 0,
      lprBp: 0,
      feeRate: 0
    },
    {
      id: 4,
      name: '房贷4',
      currentAmount: 800000,
      currentRate: 5.1,
      remainingYears: 18,
      convertAmount: 0,
      newRate: 0,
      publicFundRate: 0,
      lprBp: 0,
      feeRate: 0
    }
  ]);

  const formatAmount = (amount: number) => {
    return (amount / 10000).toFixed(0) + '万';
  };

  const calculateSavings = (mortgage: MortgageData) => {
    // For step 1 (commercial to public fund conversion)
    if (currentStep === 1) {
      if (mortgage.convertAmount === 0) return { interestSaved: 0, monthlySaved: 0 };
      
      const convertAmountNum = mortgage.convertAmount * 10000;
      const remainingAmount = mortgage.currentAmount - convertAmountNum;
      
      // 计算原月供
      const monthlyRateOld = mortgage.currentRate / 100 / 12;
      const monthsOld = mortgage.remainingYears * 12;
      const oldMonthlyPayment = mortgage.currentAmount * monthlyRateOld * Math.pow(1 + monthlyRateOld, monthsOld) / (Math.pow(1 + monthlyRateOld, monthsOld) - 1);
      
      // 计算新月供（公积金部分 + 商贷剩余部分）
      const monthlyRateNew = mortgage.publicFundRate / 100 / 12;
      const newPublicPayment = convertAmountNum * monthlyRateNew * Math.pow(1 + monthlyRateNew, monthsOld) / (Math.pow(1 + monthlyRateNew, monthsOld) - 1);
      const newCommercialPayment = remainingAmount * monthlyRateOld * Math.pow(1 + monthlyRateOld, monthsOld) / (Math.pow(1 + monthlyRateOld, monthsOld) - 1);
      const newTotalPayment = newPublicPayment + newCommercialPayment;
      
      const monthlySaved = oldMonthlyPayment - newTotalPayment;
      const interestSaved = monthlySaved * monthsOld - (convertAmountNum * mortgage.feeRate / 100);
      
      return {
        interestSaved: Math.max(0, interestSaved),
        monthlySaved: Math.max(0, monthlySaved)
      };
    }
    
    // For step 2 (fixed to floating rate conversion)
    if (currentStep === 2) {
      if (mortgage.lprBp === 0) return { interestSaved: 0, monthlySaved: 0 };
      
      // 计算原月供（固定利率）
      const monthlyRateOld = mortgage.currentRate / 100 / 12;
      const monthsOld = mortgage.remainingYears * 12;
      const oldMonthlyPayment = mortgage.currentAmount * monthlyRateOld * Math.pow(1 + monthlyRateOld, monthsOld) / (Math.pow(1 + monthlyRateOld, monthsOld) - 1);
      
      // 计算新月供（LPR + 加减点）
      // 假设当前LPR为4.2%，这里简化处理
      const currentLPR = 4.2;
      const newRate = currentLPR + mortgage.lprBp;
      const monthlyRateNew = newRate / 100 / 12;
      const newMonthlyPayment = mortgage.currentAmount * monthlyRateNew * Math.pow(1 + monthlyRateNew, monthsOld) / (Math.pow(1 + monthlyRateNew, monthsOld) - 1);
      
      const monthlySaved = oldMonthlyPayment - newMonthlyPayment;
      const interestSaved = monthlySaved * monthsOld;
      
      return {
        interestSaved: Math.max(0, interestSaved),
        monthlySaved: Math.max(0, monthlySaved)
      };
    }
    
    return { interestSaved: 0, monthlySaved: 0 };
  };

  // 计算提前还款节省效果
  const calculatePrepaymentSavings = (mortgage: MortgageData) => {
    if (!mortgage.prepaymentAmount || mortgage.prepaymentAmount === 0) {
      return { interestSaved: 0, monthlyReduced: 0, termReduced: 0 };
    }

    const monthlyRate = mortgage.currentRate / 100 / 12;
    const remainingMonths = mortgage.remainingYears * 12;
    const prepaymentAmountNum = mortgage.prepaymentAmount * 10000;

    // 计算原始月供
    const originalMonthlyPayment = mortgage.currentAmount * monthlyRate * 
      Math.pow(1 + monthlyRate, remainingMonths) / (Math.pow(1 + monthlyRate, remainingMonths) - 1);

    // 提前还款后剩余本金
    const remainingPrincipal = mortgage.currentAmount - prepaymentAmountNum;

    if (mortgage.prepaymentType === 'reduce-term') {
      // 缩短年限：月供不变，计算新的还款期限
      if (remainingPrincipal <= 0) return { interestSaved: prepaymentAmountNum, monthlyReduced: originalMonthlyPayment, termReduced: remainingMonths };
      
      // 计算新的还款期限
      const newTermMonths = Math.log(1 + (remainingPrincipal * monthlyRate) / originalMonthlyPayment) / Math.log(1 + monthlyRate);
      const termReduced = Math.max(0, remainingMonths - newTermMonths);
      const interestSaved = originalMonthlyPayment * termReduced - prepaymentAmountNum;

      return {
        interestSaved: Math.max(0, interestSaved),
        monthlyReduced: 0,
        termReduced: Math.round(termReduced)
      };
    } else {
      // 减少月供：年限不变，计算新的月供
      if (remainingPrincipal <= 0) return { interestSaved: prepaymentAmountNum, monthlyReduced: originalMonthlyPayment, termReduced: 0 };
      
      const newMonthlyPayment = remainingPrincipal * monthlyRate * 
        Math.pow(1 + monthlyRate, remainingMonths) / (Math.pow(1 + monthlyRate, remainingMonths) - 1);
      const monthlyReduced = originalMonthlyPayment - newMonthlyPayment;
      const interestSaved = monthlyReduced * remainingMonths - prepaymentAmountNum;

      return {
        interestSaved: Math.max(0, interestSaved),
        monthlyReduced: Math.max(0, monthlyReduced),
        termReduced: 0
      };
    }
  };

  const getTotalPrepaymentSavings = () => {
    return mortgages.reduce((total, mortgage) => {
      const savings = calculatePrepaymentSavings(mortgage);
      return {
        interestSaved: total.interestSaved + savings.interestSaved,
        monthlyReduced: total.monthlyReduced + savings.monthlyReduced,
        termReduced: total.termReduced + savings.termReduced
      };
    }, { interestSaved: 0, monthlyReduced: 0, termReduced: 0 });
  };

  const getTotalSavings = () => {
    return mortgages.reduce((total, mortgage) => {
      const savings = calculateSavings(mortgage);
      return {
        interestSaved: total.interestSaved + savings.interestSaved,
        monthlySaved: total.monthlySaved + savings.monthlySaved
      };
    }, { interestSaved: 0, monthlySaved: 0 });
  };

  const updateMortgage = (id: number, field: keyof MortgageData, value: number) => {
    setMortgages(prev => prev.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  // 滚动到导航区域的函数
  const scrollToChart = () => {
    if (navigationRef.current) {
      const elementPosition = navigationRef.current.offsetTop;
      const offsetPosition = elementPosition - 15; // 向上偏移15px
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const updateMortgageType = (id: number, field: 'prepaymentType', value: 'reduce-term' | 'reduce-payment') => {
    setMortgages(prev => prev.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
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

      // 累积各已确认步骤的优化效果（以万/年为单位）
      let cumulativeImprovementWan = 0;

      // 步骤1：商业贷款转公积金
      if (confirmedOptimizations.includes(1)) {
        const step1MonthlySavedTotal = mortgages.reduce((sum, m) => {
          if (!m.convertAmount || m.convertAmount <= 0 || !m.publicFundRate || m.publicFundRate <= 0) return sum;
          const convertAmountNum = m.convertAmount * 10000;
          const remainingAmount = m.currentAmount - convertAmountNum;
          const monthlyRateOld = m.currentRate / 100 / 12;
          const monthsOld = m.remainingYears * 12;
          const oldMonthlyPayment = m.currentAmount * monthlyRateOld * Math.pow(1 + monthlyRateOld, monthsOld) / (Math.pow(1 + monthlyRateOld, monthsOld) - 1);
          const monthlyRateNew = m.publicFundRate / 100 / 12;
          const newPublicPayment = convertAmountNum * monthlyRateNew * Math.pow(1 + monthlyRateNew, monthsOld) / (Math.pow(1 + monthlyRateNew, monthsOld) - 1);
          const newCommercialPayment = remainingAmount * monthlyRateOld * Math.pow(1 + monthlyRateOld, monthsOld) / (Math.pow(1 + monthlyRateOld, monthsOld) - 1);
          const newTotalPayment = newPublicPayment + newCommercialPayment;
          const monthlySaved = Math.max(0, oldMonthlyPayment - newTotalPayment);
          return sum + monthlySaved;
        }, 0);
        cumulativeImprovementWan += (step1MonthlySavedTotal * 12) / 10000;
      }

      // 步骤2：固定利率转浮动利率（示例按LPR简化）
      if (confirmedOptimizations.includes(2)) {
        const currentLPR = 4.2;
        const step2MonthlySavedTotal = mortgages.reduce((sum, m) => {
          if (m.lprBp === 0) return sum;
          const monthlyRateOld = m.currentRate / 100 / 12;
          const monthsOld = m.remainingYears * 12;
          const oldMonthlyPayment = m.currentAmount * monthlyRateOld * Math.pow(1 + monthlyRateOld, monthsOld) / (Math.pow(1 + monthlyRateOld, monthsOld) - 1);
          const newRate = currentLPR + m.lprBp;
          const monthlyRateNew = newRate / 100 / 12;
          const newMonthlyPayment = m.currentAmount * monthlyRateNew * Math.pow(1 + monthlyRateNew, monthsOld) / (Math.pow(1 + monthlyRateNew, monthsOld) - 1);
          const monthlySaved = Math.max(0, oldMonthlyPayment - newMonthlyPayment);
          return sum + monthlySaved;
        }, 0);
        cumulativeImprovementWan += (step2MonthlySavedTotal * 12) / 10000;
      }

      // 当前步骤的优化效果（仅在点击"查看优化效果"后显示）
      if (currentStep === 1 && hasViewedOptimization) {
        const step1MonthlySavedTotal = optimizationSnapshot.reduce((sum, m) => {
          if (!m.convertAmount || m.convertAmount <= 0 || !m.publicFundRate || m.publicFundRate <= 0) return sum;
          const convertAmountNum = m.convertAmount * 10000;
          const remainingAmount = m.currentAmount - convertAmountNum;
          const monthlyRateOld = m.currentRate / 100 / 12;
          const monthsOld = m.remainingYears * 12;
          const oldMonthlyPayment = m.currentAmount * monthlyRateOld * Math.pow(1 + monthlyRateOld, monthsOld) / (Math.pow(1 + monthlyRateOld, monthsOld) - 1);
          const monthlyRateNew = m.publicFundRate / 100 / 12;
          const newPublicPayment = convertAmountNum * monthlyRateNew * Math.pow(1 + monthlyRateNew, monthsOld) / (Math.pow(1 + monthlyRateNew, monthsOld) - 1);
          const newCommercialPayment = remainingAmount * monthlyRateOld * Math.pow(1 + monthlyRateOld, monthsOld) / (Math.pow(1 + monthlyRateOld, monthsOld) - 1);
          const newTotalPayment = newPublicPayment + newCommercialPayment;
          const monthlySaved = Math.max(0, oldMonthlyPayment - newTotalPayment);
          return sum + monthlySaved;
        }, 0);
        cumulativeImprovementWan += (step1MonthlySavedTotal * 12) / 10000;
      } else if (currentStep === 2 && hasViewedOptimization) {
        const currentLPR = 4.2;
        const step2MonthlySavedTotal = optimizationSnapshot.reduce((sum, m) => {
          if (m.lprBp === 0) return sum;
          const monthlyRateOld = m.currentRate / 100 / 12;
          const monthsOld = m.remainingYears * 12;
          const oldMonthlyPayment = m.currentAmount * monthlyRateOld * Math.pow(1 + monthlyRateOld, monthsOld) / (Math.pow(1 + monthlyRateOld, monthsOld) - 1);
          const newRate = currentLPR + m.lprBp;
          const monthlyRateNew = newRate / 100 / 12;
          const newMonthlyPayment = m.currentAmount * monthlyRateNew * Math.pow(1 + monthlyRateNew, monthsOld) / (Math.pow(1 + monthlyRateNew, monthsOld) - 1);
          const monthlySaved = Math.max(0, oldMonthlyPayment - newMonthlyPayment);
          return sum + monthlySaved;
        }, 0);
        cumulativeImprovementWan += (step2MonthlySavedTotal * 12) / 10000;
      } else if (currentStep === 3 && hasViewedOptimization) {
        // 步骤3：修改还款方式优化效果
        // 假设从等额本息改为等额本金，通常前期月供会增加，但总利息会减少
        // 这里模拟一个合理的现金流改善效果
        const step3MonthlySavedTotal = optimizationSnapshot.reduce((sum, m) => {
          // 简化计算：假设还款方式改变带来的年化节省为贷款余额的0.3%
          const annualSaving = m.currentAmount * 0.003;
          const monthlySaved = annualSaving / 12;
          return sum + monthlySaved;
        }, 0);
        cumulativeImprovementWan += (step3MonthlySavedTotal * 12) / 10000;
      }

      optimizedSurplus = point.currentSurplus + cumulativeImprovementWan;

      return {
        ...point,
        optimizedSurplus: Math.round(optimizedSurplus * 10) / 10,
      };
    });
  };

  const baseCashFlowData = generateBaseCashFlowData();
  const cashFlowData = calculateOptimizedCashFlow(baseCashFlowData);

  // 移除useEffect，图表数据不再实时更新

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

  // 现金流对比图表组件
  const renderCashFlowChart = () => (
    <div className="space-y-4 mb-0">
      
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600 space-y-1">
          <p className="flex items-center">
            <span className="inline-block w-4 h-0.5 bg-[#ef4444] mr-2"></span>
            现状：每年现金盈余/缺口
          </p>
          <p className="flex items-center">
            <span className="inline-block w-4 h-0.5 bg-[#01BCD6] mr-2"></span>
            优化后：预期每年现金盈余/缺口
          </p>
        </div>
      </div>

      {/* 节省效果数据展示 - 始终显示 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-white shadow-md rounded-lg">
          <p className="text-xs text-gray-500 mb-1">总成本节省</p>
          <p className="text-lg font-bold" style={{ color: '#01BCD6' }}>
            {(() => {
              // 如果没有查看优化效果，显示已确认步骤的累计节省
              if (!hasViewedOptimization) {
                let cumulativeSavings = 0;
                
                // 步骤1已确认的节省
                if (confirmedOptimizations.includes(1)) {
                  const step1Savings = mortgages.reduce((total, mortgage) => {
                    if (mortgage.convertAmount === 0 || mortgage.publicFundRate === 0) return total;
                    const convertAmountNum = mortgage.convertAmount * 10000;
                    const remainingAmount = mortgage.currentAmount - convertAmountNum;
                    const monthlyRateOld = mortgage.currentRate / 100 / 12;
                    const monthsOld = mortgage.remainingYears * 12;
                    const oldMonthlyPayment = mortgage.currentAmount * monthlyRateOld * Math.pow(1 + monthlyRateOld, monthsOld) / (Math.pow(1 + monthlyRateOld, monthsOld) - 1);
                    const monthlyRateNew = mortgage.publicFundRate / 100 / 12;
                    const newPublicPayment = convertAmountNum * monthlyRateNew * Math.pow(1 + monthlyRateNew, monthsOld) / (Math.pow(1 + monthlyRateNew, monthsOld) - 1);
                    const newCommercialPayment = remainingAmount * monthlyRateOld * Math.pow(1 + monthlyRateOld, monthsOld) / (Math.pow(1 + monthlyRateOld, monthsOld) - 1);
                    const newTotalPayment = newPublicPayment + newCommercialPayment;
                    const monthlySaved = oldMonthlyPayment - newTotalPayment;
                    const interestSaved = monthlySaved * monthsOld - (convertAmountNum * mortgage.feeRate / 100);
                    return total + Math.max(0, interestSaved);
                  }, 0);
                  cumulativeSavings += step1Savings;
                }
                
                // 当前步骤2的节省（如果有录入LPR数据）
                if (currentStep === 2 && mortgages.some(m => m.lprBp !== 0)) {
                  const currentLPR = 4.2;
                  const step2Savings = mortgages.reduce((total, mortgage) => {
                    if (mortgage.lprBp === 0) return total;
                    const monthlyRateOld = mortgage.currentRate / 100 / 12;
                    const monthsOld = mortgage.remainingYears * 12;
                    const oldMonthlyPayment = mortgage.currentAmount * monthlyRateOld * Math.pow(1 + monthlyRateOld, monthsOld) / (Math.pow(1 + monthlyRateOld, monthsOld) - 1);
                    const newRate = currentLPR + mortgage.lprBp;
                    const monthlyRateNew = newRate / 100 / 12;
                    const newMonthlyPayment = mortgage.currentAmount * monthlyRateNew * Math.pow(1 + monthlyRateNew, monthsOld) / (Math.pow(1 + monthlyRateNew, monthsOld) - 1);
                    const monthlySaved = oldMonthlyPayment - newMonthlyPayment;
                    const interestSaved = monthlySaved * monthsOld;
                    return total + Math.max(0, interestSaved);
                  }, 0);
                  cumulativeSavings += step2Savings;
                }
                
                return formatAmount(cumulativeSavings);
              }
              
              // 如果已查看优化效果，显示快照数据
              const totalSavings = optimizationSnapshot.reduce((total, mortgage) => {
                if (currentStep === 1) {
                  if (mortgage.convertAmount === 0) return total;
                  const convertAmountNum = mortgage.convertAmount * 10000;
                  const remainingAmount = mortgage.currentAmount - convertAmountNum;
                  const monthlyRateOld = mortgage.currentRate / 100 / 12;
                  const monthsOld = mortgage.remainingYears * 12;
                  const oldMonthlyPayment = mortgage.currentAmount * monthlyRateOld * Math.pow(1 + monthlyRateOld, monthsOld) / (Math.pow(1 + monthlyRateOld, monthsOld) - 1);
                  const monthlyRateNew = mortgage.publicFundRate / 100 / 12;
                  const newPublicPayment = convertAmountNum * monthlyRateNew * Math.pow(1 + monthlyRateNew, monthsOld) / (Math.pow(1 + monthlyRateNew, monthsOld) - 1);
                  const newCommercialPayment = remainingAmount * monthlyRateOld * Math.pow(1 + monthlyRateOld, monthsOld) / (Math.pow(1 + monthlyRateOld, monthsOld) - 1);
                  const newTotalPayment = newPublicPayment + newCommercialPayment;
                  const monthlySaved = oldMonthlyPayment - newTotalPayment;
                  const interestSaved = monthlySaved * monthsOld - (convertAmountNum * mortgage.feeRate / 100);
                  return total + Math.max(0, interestSaved);
                } else if (currentStep === 2) {
                  if (mortgage.lprBp === 0) return total;
                  const currentLPR = 4.2;
                  const monthlyRateOld = mortgage.currentRate / 100 / 12;
                  const monthsOld = mortgage.remainingYears * 12;
                  const oldMonthlyPayment = mortgage.currentAmount * monthlyRateOld * Math.pow(1 + monthlyRateOld, monthsOld) / (Math.pow(1 + monthlyRateOld, monthsOld) - 1);
                  const newRate = currentLPR + mortgage.lprBp;
                  const monthlyRateNew = newRate / 100 / 12;
                  const newMonthlyPayment = mortgage.currentAmount * monthlyRateNew * Math.pow(1 + monthlyRateNew, monthsOld) / (Math.pow(1 + monthlyRateNew, monthsOld) - 1);
                  const monthlySaved = oldMonthlyPayment - newMonthlyPayment;
                  const interestSaved = monthlySaved * monthsOld;
                  return total + Math.max(0, interestSaved);
                } else if (currentStep === 3) {
                  // 步骤3：修改还款方式的总节省利息
                  // 假设还款方式改变带来总利息节省为贷款余额的2%
                  const paymentMethodSavings = mortgage.currentAmount * 0.02;
                  return total + paymentMethodSavings;
                }
                return total;
              }, 0);
              return formatAmount(totalSavings);
            })()}
          </p>
        </div>
        <div className="text-center p-3 bg-white shadow-md rounded-lg">
          <p className="text-xs text-gray-500 mb-1">下次还贷月供节省</p>
          <p className="text-lg font-bold" style={{ color: '#01BCD6' }}>
            {(() => {
              // 如果没有查看优化效果，显示已确认步骤的累计节省
              if (!hasViewedOptimization) {
                let cumulativeMonthlySaved = 0;
                
                // 步骤1已确认的月供节省
                if (confirmedOptimizations.includes(1)) {
                  const step1MonthlySaved = mortgages.reduce((total, mortgage) => {
                    if (mortgage.convertAmount === 0 || mortgage.publicFundRate === 0) return total;
                    const convertAmountNum = mortgage.convertAmount * 10000;
                    const remainingAmount = mortgage.currentAmount - convertAmountNum;
                    const monthlyRateOld = mortgage.currentRate / 100 / 12;
                    const monthsOld = mortgage.remainingYears * 12;
                    const oldMonthlyPayment = mortgage.currentAmount * monthlyRateOld * Math.pow(1 + monthlyRateOld, monthsOld) / (Math.pow(1 + monthlyRateOld, monthsOld) - 1);
                    const monthlyRateNew = mortgage.publicFundRate / 100 / 12;
                    const newPublicPayment = convertAmountNum * monthlyRateNew * Math.pow(1 + monthlyRateNew, monthsOld) / (Math.pow(1 + monthlyRateNew, monthsOld) - 1);
                    const newCommercialPayment = remainingAmount * monthlyRateOld * Math.pow(1 + monthlyRateOld, monthsOld) / (Math.pow(1 + monthlyRateOld, monthsOld) - 1);
                    const newTotalPayment = newPublicPayment + newCommercialPayment;
                    const monthlySaved = oldMonthlyPayment - newTotalPayment;
                    return total + Math.max(0, monthlySaved);
                  }, 0);
                  cumulativeMonthlySaved += step1MonthlySaved;
                }
                
                // 当前步骤2的月供节省（如果有录入LPR数据）
                if (currentStep === 2 && mortgages.some(m => m.lprBp !== 0)) {
                  const currentLPR = 4.2;
                  const step2MonthlySaved = mortgages.reduce((total, mortgage) => {
                    if (mortgage.lprBp === 0) return total;
                    const monthlyRateOld = mortgage.currentRate / 100 / 12;
                    const monthsOld = mortgage.remainingYears * 12;
                    const oldMonthlyPayment = mortgage.currentAmount * monthlyRateOld * Math.pow(1 + monthlyRateOld, monthsOld) / (Math.pow(1 + monthlyRateOld, monthsOld) - 1);
                    const newRate = currentLPR + mortgage.lprBp;
                    const monthlyRateNew = newRate / 100 / 12;
                    const newMonthlyPayment = mortgage.currentAmount * monthlyRateNew * Math.pow(1 + monthlyRateNew, monthsOld) / (Math.pow(1 + monthlyRateNew, monthsOld) - 1);
                    const monthlySaved = oldMonthlyPayment - newMonthlyPayment;
                    return total + Math.max(0, monthlySaved);
                  }, 0);
                  cumulativeMonthlySaved += step2MonthlySaved;
                }
                
                return (cumulativeMonthlySaved / 100).toFixed(0) + '元';
              }
              
              // 如果已查看优化效果，显示快照数据
              const totalMonthlySaved = optimizationSnapshot.reduce((total, mortgage) => {
                if (currentStep === 1) {
                  if (mortgage.convertAmount === 0) return total;
                  const convertAmountNum = mortgage.convertAmount * 10000;
                  const remainingAmount = mortgage.currentAmount - convertAmountNum;
                  const monthlyRateOld = mortgage.currentRate / 100 / 12;
                  const monthsOld = mortgage.remainingYears * 12;
                  const oldMonthlyPayment = mortgage.currentAmount * monthlyRateOld * Math.pow(1 + monthlyRateOld, monthsOld) / (Math.pow(1 + monthlyRateOld, monthsOld) - 1);
                  const monthlyRateNew = mortgage.publicFundRate / 100 / 12;
                  const newPublicPayment = convertAmountNum * monthlyRateNew * Math.pow(1 + monthlyRateNew, monthsOld) / (Math.pow(1 + monthlyRateNew, monthsOld) - 1);
                  const newCommercialPayment = remainingAmount * monthlyRateOld * Math.pow(1 + monthlyRateOld, monthsOld) / (Math.pow(1 + monthlyRateOld, monthsOld) - 1);
                  const newTotalPayment = newPublicPayment + newCommercialPayment;
                  const monthlySaved = oldMonthlyPayment - newTotalPayment;
                  return total + Math.max(0, monthlySaved);
                } else if (currentStep === 2) {
                  if (mortgage.lprBp === 0) return total;
                  const currentLPR = 4.2;
                  const monthlyRateOld = mortgage.currentRate / 100 / 12;
                  const monthsOld = mortgage.remainingYears * 12;
                  const oldMonthlyPayment = mortgage.currentAmount * monthlyRateOld * Math.pow(1 + monthlyRateOld, monthsOld) / (Math.pow(1 + monthlyRateOld, monthsOld) - 1);
                  const newRate = currentLPR + mortgage.lprBp;
                  const monthlyRateNew = newRate / 100 / 12;
                  const newMonthlyPayment = mortgage.currentAmount * monthlyRateNew * Math.pow(1 + monthlyRateNew, monthsOld) / (Math.pow(1 + monthlyRateNew, monthsOld) - 1);
                  const monthlySaved = oldMonthlyPayment - newMonthlyPayment;
                  return total + Math.max(0, monthlySaved);
                } else if (currentStep === 3) {
                  // 步骤3：修改还款方式的月供节省
                  // 简化计算：假设还款方式改变带来的月供节省为贷款余额的0.025%
                  const monthlySaved = mortgage.currentAmount * 0.00025;
                  return total + monthlySaved;
                }
                return total;
              }, 0);
              return (totalMonthlySaved / 100).toFixed(0) + '元';
            })()}
          </p>
        </div>
      </div>

      {/* 折线图 */}
      <div className="h-64 pl-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={cashFlowData}
            margin={{ top: 10, right: 0, left: 0, bottom: 10 }}
          >
            <defs>
              <linearGradient id="currentSurplusGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="optimizedSurplusGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#01BCD6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#01BCD6" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="age" 
              tick={{ fontSize: 10 }}
              ticks={[28, 33, 38, 43, 48, 53, 58, 63, 68, 73, 78, 83]}
              axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
              tickLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
            />
            <YAxis 
              tick={{ 
                fontSize: 10, 
                textAnchor: 'end', 
                fill: '#000'
              }}
              tickFormatter={(value) => `${value}`}
              domain={[-50, 50]}
              ticks={[-50, -25, 0, 25, 50]}
              axisLine={{ stroke: '#000', strokeWidth: 1 }}
              tickLine={{ stroke: '#000', strokeWidth: 1 }}
              width={26}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="2 2" />
              <Area
                type="monotone"
                dataKey="currentSurplus"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#currentSurplusGradient)"
                fillOpacity={0.6}
                dot={false}
                activeDot={{ r: 4, stroke: '#ef4444', strokeWidth: 2, fill: '#ffffff' }}
              />
              {/* 显示蓝线的条件：1）有已确认的优化步骤，或 2）当前步骤已查看优化效果 */}
              {(confirmedOptimizations.length > 0 || hasViewedOptimization) && (
                <Area
                  type="monotone"
                  dataKey="optimizedSurplus"
                  stroke="#01BCD6"
                  strokeWidth={2}
                  fill="url(#optimizedSurplusGradient)"
                  fillOpacity={0.6}
                  dot={false}
                  activeDot={{ r: 4, stroke: '#01BCD6', strokeWidth: 2, fill: '#ffffff' }}
                />
              )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div ref={navigationRef} className="space-y-4 px-safe">
      {/* 进度轴导航 */}
      <div className="mb-8 max-w-md mx-auto">
        {/* 进度指示器容器 */}
        <div className="relative">
          {/* 背景进度线 */}
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-gradient-to-r from-gray-200 via-gray-200 to-gray-200"></div>
          
          {/* 活跃进度线 */}
          <div 
            className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out"
            style={{ 
              width: `calc(${((currentStep - 1) / (optimizationMethods.length - 1)) * 100}% * (100% - 40px) / 100%)` 
            }}
          ></div>
          
          {/* 步骤节点 */}
          <div className="flex items-center justify-between relative">
            {optimizationMethods.map((method, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = confirmedOptimizations.includes(stepNumber);
              const isPassed = stepNumber < currentStep;
              
              return (
                <div key={method.id} className="flex flex-col items-center group">
                  {/* 步骤圆点 */}
                  <button
                    onClick={() => setCurrentStep(stepNumber)}
                    className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 font-semibold text-sm shadow-lg hover:scale-105 ${
                      isActive 
                        ? 'bg-gradient-to-br from-primary to-primary/80 text-white shadow-primary/30 shadow-xl ring-4 ring-primary/20' 
                        : isCompleted 
                          ? 'text-white shadow-[#01BCD6]/30'
                          : isPassed
                            ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700 shadow-gray-300/30'
                            : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500 hover:from-gray-200 hover:to-gray-300 shadow-gray-200/30'
                    }`}
                    style={isCompleted ? { backgroundColor: '#01BCD6' } : {}}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="font-bold">{stepNumber}</span>
                    )}
                    
                    {/* 活跃状态脉冲效果 */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"></div>
                    )}
                  </button>
                  
                  {/* 步骤标签 */}
                  <div className={`mt-3 px-1 py-0.5 rounded text-xs font-medium text-center transition-all duration-300 whitespace-nowrap ${
                    isActive 
                      ? 'text-primary bg-primary/10' 
                      : isCompleted
                        ? 'bg-[#01BCD6]/10'
                        : 'text-gray-500 group-hover:text-gray-700'
                  }`}
                  style={isCompleted ? { color: '#01BCD6' } : {}}>
                    <div className="text-[10px] leading-none">
                      {method.shortName}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
      </div>

      {/* 第一个手段的详细内容 */}
      {currentStep === 1 && (
        <>
          <div className="bg-white rounded-lg shadow-sm p-4 mt-6" style={{ boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <h4 className="text-base font-medium text-foreground mb-4 mt-2">录入商转公信息，测算节省成本</h4>
            {/* 试算节省成本标题 */}
            <div className="space-y-4">
            
            {/* 政策提醒 */}
            <div className="p-3 rounded-lg shadow-sm mb-4" style={{ backgroundColor: 'rgba(202, 244, 247, 0.2)' }}>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#01BCD6' }} />
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: '#01BCD6' }}>政策提醒</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#01BCD6' }}>
                    商转公政策因地区而异，建议您先咨询当地公积金管理中心了解具体政策要求、申请条件和办理流程。
                  </p>
                </div>
              </div>
            </div>
             
            <div className="p-3 shadow-sm rounded-lg space-y-3">
              {mortgages.map((mortgage, index) => (
                <div key={mortgage.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">房贷-商业贷款</span>
                    <span className="text-xs text-muted-foreground">
                      余额 {formatAmount(mortgage.currentAmount)} | {mortgage.currentRate}% | {mortgage.remainingYears}年
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">转换金额(万)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={mortgage.convertAmount || ''}
                        onChange={(e) => updateMortgage(mortgage.id, 'convertAmount', parseFloat(e.target.value) || 0)}
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">公积金利率(%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        value={mortgage.publicFundRate === 0 ? '' : mortgage.publicFundRate.toString()}
                        onChange={(e) => updateMortgage(mortgage.id, 'publicFundRate', parseFloat(e.target.value) || 0)}
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">手续费率(%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        value={mortgage.feeRate === 0 ? '' : mortgage.feeRate.toString()}
                        onChange={(e) => updateMortgage(mortgage.id, 'feeRate', parseFloat(e.target.value) || 0)}
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                  </div>
                  
                  {index < mortgages.length - 1 && (
                    <div className="border-b border-border/30 pb-3"></div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => {
                  setOptimizationSnapshot([...mortgages]); // 保存当前数据快照
                  setHasViewedOptimization(true);
                  // 小延迟确保状态更新后再滚动
                  setTimeout(() => scrollToChart(), 100);
                }}
                className="flex-1"
                variant="outline"
                disabled={!mortgages.some(m => m.convertAmount > 0 && m.publicFundRate > 0)}
              >
                查看优化效果
              </Button>
              
              <Button 
                onClick={() => {
                  setConfirmedOptimizations([...confirmedOptimizations, currentStep]);
                  setHasViewedOptimization(false);
                  setCurrentStep(2);
                  scrollToChart();
                }}
                className="flex-1"
                variant="default"
                disabled={!mortgages.some(m => m.convertAmount > 0 && m.publicFundRate > 0)}
              >
                确认做此优化
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* 节省效果分析 */}
            {subStep >= 3 && (
              <div className="space-y-4 mt-6 pt-4 border-t border-border/50">
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-foreground">节省效果分析</h4>
                </div>
                
                {/* 总体节省 */}
                <div className="p-3 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(202, 244, 247, 0.3)' }}>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <p className="text-xs" style={{ color: '#01BCD6' }}>总节省利息</p>
                      <p className="text-lg font-bold" style={{ color: '#01BCD6' }}>
                        {formatAmount(getTotalSavings().interestSaved)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs" style={{ color: '#01BCD6' }}>月供节省</p>
                      <p className="text-lg font-bold" style={{ color: '#01BCD6' }}>
                        {(getTotalSavings().monthlySaved / 100).toFixed(0)}元
                      </p>
                    </div>
                  </div>
                </div>

                {/* 分项节省 */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-foreground">各房贷节省明细</h5>
                  {mortgages.map((mortgage) => {
                    const savings = calculateSavings(mortgage);
                    if (mortgage.convertAmount === 0) return null;
                    
                    return (
                      <div key={mortgage.id} className="p-2 shadow-sm rounded text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{mortgage.name}</span>
                          <span className="text-muted-foreground">转换 {mortgage.convertAmount}万</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>节省利息: {formatAmount(savings.interestSaved)}</span>
                          <span>月供减少: {(savings.monthlySaved / 100).toFixed(0)}元</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3 mt-4">
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1"
                  >
                    无法优化
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(2)}
                    className="flex-1"
                  >
                    确认可优化
                  </Button>
                </div>
              </div>
            )}
          </div>
          </div>
          
          {/* 债务优化效果对比 */}
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow-sm p-4" style={{ boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <h3 className="text-base font-medium text-foreground mb-4 mt-2">债务优化效果监测</h3>
              {/* 现金流对比图表 */}
              {renderCashFlowChart()}
            </div>
          </div>
        </>
      )}

      {/* 第二个手段的详细内容 */}
      {currentStep === 2 && (
        <>
          {/* 固定利率转浮动利率试算 */}
          <div className="bg-card shadow-sm rounded-lg p-4" style={{ boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <h3 className="text-base font-medium text-foreground mb-4 mt-2">录入固定利率转浮动利率信息，测算节省成本</h3>
            <div className="space-y-4">
            
            {/* 合同查看提醒 */}
            <div className="p-3 rounded-lg shadow-sm mb-4" style={{ backgroundColor: 'rgba(202, 244, 247, 0.2)' }}>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#01BCD6' }} />
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: '#01BCD6' }}>温馨提醒</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#01BCD6' }}>
                    请先查看您的贷款合同，确认当前是否为固定利率，以及是否可以申请转换为浮动利率（LPR）。
                  </p>
                </div>
              </div>
            </div>
            
            {mortgages.map((mortgage, index) => (
              <div key={mortgage.id} className="p-3 shadow-sm rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-foreground text-sm">房贷-商业贷款</h5>
                  <span className="text-xs text-muted-foreground">
                    余额 {formatAmount(mortgage.currentAmount)} | {mortgage.currentRate}% | {mortgage.remainingYears}年
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">当前固定利率(%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={mortgage.currentRate}
                      onChange={(e) => updateMortgage(mortgage.id, 'currentRate', parseFloat(e.target.value) || 0)}
                      className="h-8 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">转为浮动利率后lpr加减点（bp）</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="如减20个基点（bp）"
                      value={mortgage.lprBp === 0 ? '' : mortgage.lprBp.toString()}
                      onChange={(e) => updateMortgage(mortgage.id, 'lprBp', parseFloat(e.target.value) || 0)}
                      className="h-8 text-xs mt-1"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex gap-3">
              <Button 
                onClick={() => {
                  setOptimizationSnapshot([...mortgages]); // 保存当前数据快照
                  setHasViewedOptimization(true);
                  scrollToChart();
                }}
                className="flex-1"
                variant="outline"
                disabled={!mortgages.some(m => m.lprBp !== 0)}
              >
                查看优化效果
              </Button>
              
              <Button 
                onClick={() => {
                  setConfirmedOptimizations([...confirmedOptimizations, currentStep]);
                  setHasViewedOptimization(false);
                  setCurrentStep(currentStep + 1);
                  scrollToChart();
                }}
                className="flex-1"
                variant="default"
                disabled={!mortgages.some(m => m.lprBp !== 0)}
              >
                确认做此优化
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* 节省效果分析 */}
            {subStep >= 3 && (
              <div className="space-y-4 mt-6 pt-4 border-t border-border/50">
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-foreground">节省效果分析</h4>
                </div>
                
                {/* 总体节省 */}
                <div className="p-3 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(202, 244, 247, 0.3)' }}>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <p className="text-xs" style={{ color: '#01BCD6' }}>总节省利息</p>
                      <p className="text-lg font-bold" style={{ color: '#01BCD6' }}>
                        {formatAmount(getTotalSavings().interestSaved)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs" style={{ color: '#01BCD6' }}>月供节省</p>
                      <p className="text-lg font-bold" style={{ color: '#01BCD6' }}>
                        {(getTotalSavings().monthlySaved / 100).toFixed(0)}元
                      </p>
                    </div>
                  </div>
                </div>

                {/* 分项节省 */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-foreground">各房贷节省明细</h5>
                  {mortgages.map((mortgage) => {
                    const savings = calculateSavings(mortgage);
                    if (mortgage.newRate === 0) return null;
                    
                    return (
                      <div key={mortgage.id} className="p-2 shadow-sm rounded text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{mortgage.name}</span>
                          <span className="text-muted-foreground">LPR{mortgage.newRate > 0 ? '+' : ''}{mortgage.newRate}%</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>节省利息: {formatAmount(savings.interestSaved)}</span>
                          <span>月供减少: {(savings.monthlySaved / 100).toFixed(0)}元</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3 mt-4">
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentStep(3)}
                    className="flex-1"
                  >
                    无法优化
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(3)}
                    className="flex-1"
                  >
                    确认可优化
                  </Button>
                </div>
              </div>
            )}
           </div>
           </div>
          
          {/* 债务优化效果对比 */}
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow-sm p-4" style={{ boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <h3 className="text-base font-medium text-foreground mb-4 mt-2">债务优化效果监测</h3>
              {/* 现金流对比图表 */}
              {renderCashFlowChart()}
            </div>
          </div>
        </>
      )}

      {/* 第三个手段的详细内容 */}
      {currentStep === 3 && (
        <>
          <div className="bg-card shadow-sm rounded-lg p-4" style={{ boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <h3 className="text-base font-medium text-foreground mb-4 mt-2">系统推荐方案</h3>
            {/* 系统建议 */}
            <div className="space-y-3 mb-4">
            
            {/* 建议修改的房贷卡片 */}
            <div className="space-y-2">
              {/* 第1笔房贷 */}
              <div className="p-3 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(202, 244, 247, 0.2)' }}>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-foreground text-sm">房贷1</h5>
                  <span className="text-xs text-muted-foreground">
                    余额 {formatAmount(mortgages[1].currentAmount)} | {mortgages[1].currentRate}% | {mortgages[1].remainingYears}年
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">建议:</span>
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#01BCD6', color: 'white' }}>
                    等额本息 → 等额本金
                  </span>
                </div>
              </div>

              {/* 第2笔房贷 */}
              <div className="p-3 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(202, 244, 247, 0.2)' }}>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-foreground text-sm">房贷2</h5>
                  <span className="text-xs text-muted-foreground">
                    余额 {formatAmount(mortgages[0].currentAmount)} | 商贷{mortgages[0].currentRate}%+公积金3.25% | {mortgages[0].remainingYears}年
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">建议:</span>
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#01BCD6', color: 'white' }}>
                    等额本息 → 等额本金
                  </span>
                </div>
              </div>
            </div>
          </div>


          {/* 客户试算 */}
          <div className="space-y-4">
            <div className="mb-3">
              <Button 
                variant="outline"
                onClick={() => setIsCustomPaymentExpanded(prev => { const next = !prev; if (!next) setSubStep(1); return next; })}
                className="w-full justify-between"
              >
                <span className="text-sm font-medium text-foreground">自定义还款方式调整</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${isCustomPaymentExpanded ? 'rotate-90' : ''}`} />
              </Button>
            </div>
            
            {isCustomPaymentExpanded && (
              <>
                {mortgages.map((mortgage, index) => (
                  <div key={mortgage.id} className="p-3 shadow-sm rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-foreground text-sm">房贷-商业贷款</h5>
                      <span className="text-xs text-muted-foreground">
                        余额 {formatAmount(mortgage.currentAmount)} | {mortgage.currentRate}% | {mortgage.remainingYears}年
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Label className="text-xs text-muted-foreground">还款方式:</Label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name={`payment-method-${mortgage.id}`}
                            value="equal-principal-interest"
                            defaultChecked
                            className="w-3 h-3"
                          />
                          <span className="text-xs">等额本息</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name={`payment-method-${mortgage.id}`}
                            value="equal-principal"
                            className="w-3 h-3"
                          />
                          <span className="text-xs">等额本金</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* 优化按钮 - 始终显示 */}
            <div className="flex gap-3">
              <Button 
                onClick={() => {
                  setOptimizationSnapshot([...mortgages]); // 保存当前数据快照
                  setHasViewedOptimization(true);
                  scrollToChart();
                }}
                className="flex-1"
                variant="outline"
              >
                查看优化效果
              </Button>
              
              <Button 
                onClick={() => {
                  setConfirmedOptimizations([...confirmedOptimizations, currentStep]);
                  setHasViewedOptimization(false);
                  setCurrentStep(currentStep + 1);
                  scrollToChart();
                }}
                className="flex-1"
                variant="default"
              >
                确认做此优化
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* 还贷期间+还贷期后现金流分析 */}
            {subStep >= 3 && isCustomPaymentExpanded && (
              <div className="space-y-4 mt-6 pt-4 border-t border-border/50">
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-foreground">偿债风险评估</h4>
                </div>
                
                <div className="mt-4 space-y-4">
                  {/* 图表说明 */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2 text-sm">还贷期间+还贷期后现金流分析</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p className="flex items-center">
                        <span className="inline-block w-4 h-0.5 bg-[#ef4444] mr-2"></span>
                        还贷期间+还贷期后每年现金盈余/缺口
                      </p>
                    </div>
                  </div>

                  {/* 折线图 */}
                  <div className="h-64 pl-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={cashFlowData}
                        margin={{ top: 10, right: 0, left: 0, bottom: 10 }}
                      >
                        <defs>
                          <linearGradient id="riskSurplusGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="age" 
                          tick={{ fontSize: 10 }}
                          ticks={[28, 33, 38, 43, 48, 53, 58, 63, 68, 73, 78, 83]}
                          axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                          tickLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                        />
                        <YAxis 
                          tick={{ 
                            fontSize: 10, 
                            textAnchor: 'end', 
                            fill: '#000'
                          }}
                          tickFormatter={(value) => `${value}`}
                          domain={[-50, 50]}
                          ticks={[-50, -25, 0, 25, 50]}
                          axisLine={{ stroke: '#000', strokeWidth: 1 }}
                          tickLine={{ stroke: '#000', strokeWidth: 1 }}
                          width={26}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="2 2" />
                        <Area
                          type="monotone"
                          dataKey="riskSurplus"
                          stroke="#ef4444"
                          strokeWidth={2}
                          fill="url(#riskSurplusGradient)"
                          fillOpacity={0.6}
                          dot={false}
                          activeDot={{ r: 5, stroke: '#ef4444', strokeWidth: 2, fill: '#ffffff' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* 点击提示 */}
                  <div className="p-3 bg-gray-50 rounded-lg text-center text-gray-500 text-xs">
                    点击图表上的任意点查看详细数据
                  </div>
                </div>

              </div>
            )}
          </div>
          {/* 优化决策按钮 - 在"自定义还款方式调整"模块下方固定展示 */}
          </div>
          
          {/* 债务优化效果对比 */}
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow-sm p-4" style={{ boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <h3 className="text-base font-medium text-foreground mb-4 mt-2">债务优化效果监测</h3>
              {/* 现金流对比图表 */}
              {renderCashFlowChart()}
            </div>
          </div>
        </>
      )}

      {/* 第四个手段的详细内容 */}
      {currentStep === 4 && (
        <>
          <div className="bg-card shadow-sm rounded-lg p-4" style={{ boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <h3 className="text-base font-medium text-foreground mb-4 mt-2">系统推荐提前还款方案</h3>
            {/* 系统建议的提前还款方案 */}
            <div className="space-y-4 mb-6">
              
              {/* 建议提前还款的房贷卡片 */}
              <div className="space-y-2">
                {/* 第1笔房贷建议 */}
                <div className="p-3 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(202, 244, 247, 0.2)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-foreground text-sm">房贷1</h5>
                    <span className="text-xs text-muted-foreground">
                      余额 {formatAmount(mortgages[1].currentAmount)} | {mortgages[1].currentRate}% | {mortgages[1].remainingYears}年
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">建议:</span>
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#01BCD6', color: 'white' }}>
                      提前还款 30万元，选择减少月供
                    </span>
                  </div>
                </div>

                {/* 第2笔房贷建议 */}
                <div className="p-3 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(202, 244, 247, 0.2)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-foreground text-sm">房贷2</h5>
                    <span className="text-xs text-muted-foreground">
                      余额 {formatAmount(mortgages[0].currentAmount)} | 商贷{mortgages[0].currentRate}%+公积金3.25% | {mortgages[0].remainingYears}年
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">建议:</span>
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#01BCD6', color: 'white' }}>
                      提前还款 20万元，选择减少月供
                    </span>
                  </div>
                </div>
              </div>

              {/* 系统建议的节省效果 */}
            </div>

            {/* 客户自定义提前还款 */}
            <div className="space-y-4">
              <div className="mb-3">
                <Button 
                  variant="outline"
                  onClick={() => setIsAdvancePaymentExpanded(prev => !prev)}
                  className="w-full justify-between"
                >
                  <span className="text-sm font-medium text-foreground">自定义提前还款参数</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isAdvancePaymentExpanded ? 'rotate-90' : ''}`} />
                </Button>
              </div>
              
              {isAdvancePaymentExpanded && (
                <>
                  {mortgages.map((mortgage, index) => (
                    <div key={mortgage.id} className="p-3 shadow-sm rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-foreground text-sm">房贷-商业贷款</h5>
                        <span className="text-xs text-muted-foreground">
                          余额 {formatAmount(mortgage.currentAmount)} | {mortgage.currentRate}% | {mortgage.remainingYears}年
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">提前还款金额(万)</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={mortgage.prepaymentAmount || ''}
                            onChange={(e) => updateMortgage(mortgage.id, 'prepaymentAmount', parseFloat(e.target.value) || 0)}
                            className="h-8 text-xs mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">还款策略</Label>
                          <div className="flex items-center h-8 px-3 py-2 shadow-sm rounded-md bg-gray-50 text-xs text-gray-600 mt-1">
                            减少月供
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}


                  {/* 提前还款效果分析 */}
                  {subStep >= 3 && (
                    <div className="space-y-4 mt-6 pt-4 border-t border-border/50">
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-foreground">提前还款效果分析</h4>
                      </div>
                      
                      {/* 总体节省 */}
                      <div className="p-3 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(202, 244, 247, 0.3)' }}>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center">
                            <p className="text-xs" style={{ color: '#01BCD6' }}>总节省利息</p>
                            <p className="text-lg font-bold" style={{ color: '#01BCD6' }}>
                              {formatAmount(getTotalPrepaymentSavings().interestSaved)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs" style={{ color: '#01BCD6' }}>月供减少</p>
                            <p className="text-lg font-bold" style={{ color: '#01BCD6' }}>
                              {Math.round(getTotalPrepaymentSavings().monthlyReduced)}元
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs" style={{ color: '#01BCD6' }}>年限缩短</p>
                            <p className="text-lg font-bold" style={{ color: '#01BCD6' }}>
                              {Math.round(getTotalPrepaymentSavings().termReduced / 12 * 10) / 10}年
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 分项节省 */}
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-foreground">各房贷提前还款明细</h5>
                        {mortgages.map((mortgage) => {
                          const savings = calculatePrepaymentSavings(mortgage);
                          if (!mortgage.prepaymentAmount || mortgage.prepaymentAmount === 0) return null;
                          
                          return (
                            <div key={mortgage.id} className="p-2 shadow-sm rounded text-xs">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium">{mortgage.name}</span>
                                <span className="text-muted-foreground">
                                  提前还款 {mortgage.prepaymentAmount}万 (减少月供)
                                </span>
                              </div>
                              <div className="flex justify-between text-muted-foreground">
                                <span>节省利息: {formatAmount(savings.interestSaved)}</span>
                                <span>月供减少: {Math.round(savings.monthlyReduced)}元</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* 未来提前还款能力预测卡片 */}
              <div className="mb-3">
                <Button 
                  variant="outline"
                  onClick={() => setIsPrepaymentCapacityExpanded(prev => !prev)}
                  className="w-full justify-between"
                >
                  <span className="text-sm font-medium text-foreground">未来提前还款能力预测</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isPrepaymentCapacityExpanded ? 'rotate-90' : ''}`} />
                </Button>
              </div>
              
              {isPrepaymentCapacityExpanded && (
                <div className="p-4 shadow-sm rounded-lg space-y-4 mb-4">
                  <PrepaymentCapacityHeatmap 
                    onCellClick={(data) => setSelectedYearData(data)}
                  />
                  
                  {/* 选中年份详情 */}
                  {selectedYearData && (
                    <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
                      <h5 className="font-medium text-gray-800 mb-2 text-sm">
                        {selectedYearData.age}岁 ({selectedYearData.year}年) 结余详情
                      </h5>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>• 预计年度结余: <span className="font-semibold">{selectedYearData.surplus}万元</span></p>
                        <p>• 可用于提前还款: <span className="font-semibold">{Math.round(selectedYearData.surplus * 0.7 * 10) / 10}万元</span></p>
                        <p className="text-xs text-gray-600 mt-2">
                          *建议保留30%作为应急资金
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 优化决策按钮 - 在模块下方固定展示 */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-border/50">
                <Button 
                  onClick={() => {
                    setOptimizationSnapshot([...mortgages]); // 保存当前数据快照
                    setHasViewedOptimization(true);
                    scrollToChart();
                  }}
                  className="flex-1"
                  variant="outline"
                >
                  查看优化效果
                </Button>
                
                <Button 
                  onClick={() => {
                    setConfirmedOptimizations([...confirmedOptimizations, currentStep]);
                    setHasViewedOptimization(false);
                    setCurrentStep(currentStep + 1);
                    scrollToChart();
                  }}
                  className="flex-1"
                  variant="default"
                >
                  确认做此优化
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* 债务优化效果对比 */}
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow-sm p-4" style={{ boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <h3 className="text-base font-medium text-foreground mb-4 mt-2">债务优化效果监测</h3>
              {/* 现金流对比图表 */}
              {renderCashFlowChart()}
            </div>
          </div>
        </>
      )}

      {/* 第五个手段的详细内容 */}
      {currentStep === 5 && (
        <>
          <div className="bg-card shadow-sm rounded-lg p-4" style={{ boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <h3 className="text-base font-medium text-foreground mb-4 mt-2">录入每笔房贷可延长期限，获取延期还款方案</h3>
            {/* 系统建议的延期还款方案 */}
            <div className="space-y-4 mb-6">
              
              {/* 延期还款政策说明 */}
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-semibold text-destructive leading-relaxed mb-2">
                      延期还款政策要求说明
                    </p>
                    <ul className="text-xs text-destructive space-y-1 leading-relaxed">
                      <li>• 需要向银行申请，并提供相关困难证明材料</li>
                      <li>• 延期期间通常仍需支付利息，本金暂缓归还</li>
                      <li>• 延期期限通常为6-12个月，具体以银行政策为准</li>
                      <li>• 可能影响个人征信记录，需谨慎考虑</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* 录入延期期限 */}
              <div className="space-y-4">
                
                {mortgages.map((mortgage, index) => (
                  <div key={mortgage.id} className="p-3 shadow-sm rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h6 className="font-medium text-foreground text-sm">房贷{index + 1}-商业贷款</h6>
                      <span className="text-xs text-muted-foreground">
                        余额 {formatAmount(mortgage.currentAmount)} | {mortgage.currentRate}% | 剩余期限 {mortgage.remainingYears * 12}月
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">可延期期限(月)</Label>
                        <Input
                          type="number"
                          placeholder="请输入延期月数"
                          className="h-8 text-xs mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button 
                  onClick={() => setHasInputDefermentPeriods(true)}
                  className="w-full"
                  variant="outline"
                >
                  获取延期还款方案
                </Button>
              </div>
              
              {/* 系统建议的延期还款方案 - 只在点击获取方案后显示 */}
              {hasInputDefermentPeriods && (
                <>
                  {/* 建议延期的房贷卡片 */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-foreground">系统建议延期还款方案</h5>
                
                {/* 第1笔房贷建议 */}
                <div className="p-3 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(202, 244, 247, 0.2)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-foreground text-sm">房贷1</h5>
                    <span className="text-xs text-muted-foreground">
                      余额 {formatAmount(mortgages[1].currentAmount)} | {mortgages[1].currentRate}% | {mortgages[1].remainingYears}年
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">建议:</span>
                       <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#01BCD6', color: 'white' }}>
                         延期6个月
                       </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="text-center p-2 rounded" style={{ backgroundColor: 'rgba(202, 244, 247, 0.3)' }}>
                        <div className="font-medium text-foreground">缓解月供</div>
                        <div style={{ color: '#01BCD6' }}>8,850元/月</div>
                      </div>
                      <div className="text-center p-2 rounded" style={{ backgroundColor: 'rgba(202, 244, 247, 0.3)' }}>
                        <div className="font-medium text-foreground">延期利息</div>
                        <div style={{ color: '#01BCD6' }}>7.5万元</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 第2笔房贷建议 */}
                <div className="p-3 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(202, 244, 247, 0.2)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-foreground text-sm">房贷2</h5>
                    <span className="text-xs text-muted-foreground">
                      余额 {formatAmount(mortgages[0].currentAmount)} | 商贷{mortgages[0].currentRate}%+公积金3.25% | {mortgages[0].remainingYears}年
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">建议:</span>
                       <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#01BCD6', color: 'white' }}>
                         延期12个月</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="text-center p-2 rounded" style={{ backgroundColor: 'rgba(202, 244, 247, 0.3)' }}>
                        <div className="font-medium text-foreground">缓解月供</div>
                        <div style={{ color: '#01BCD6' }}>3,200元/月</div>
                      </div>
                      <div className="text-center p-2 rounded" style={{ backgroundColor: 'rgba(202, 244, 247, 0.3)' }}>
                        <div className="font-medium text-foreground">延期利息</div>
                        <div style={{ color: '#01BCD6' }}>8.1万元</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                </>
              )}

              {/* 优化决策按钮 */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-border/50">
                <Button 
                  onClick={() => {
                    setOptimizationSnapshot([...mortgages]); // 保存当前数据快照
                    setHasViewedOptimization(true);
                    scrollToChart();
                  }}
                  className="flex-1"
                  variant="outline"
                >
                  查看优化效果
                </Button>
                
                <Button 
                  onClick={() => {
                    setConfirmedOptimizations([...confirmedOptimizations, currentStep]);
                    setHasViewedOptimization(false);
                    setCurrentStep(currentStep + 1);
                    scrollToChart();
                  }}
                  className="flex-1"
                  variant="default"
                >
                  确认做此优化
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* 债务优化效果对比 */}
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow-sm p-4" style={{ boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <h3 className="text-base font-medium text-foreground mb-4 mt-2">债务优化效果监测</h3>
              {/* 现金流对比图表 */}
              {renderCashFlowChart()}
            </div>
          </div>
        </>
      )}

      {/* 第六个手段的详细内容 */}
      {currentStep === 6 && (
        <>
          <div className="bg-card shadow-sm rounded-lg p-4" style={{ boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <h3 className="text-base font-medium text-foreground mb-4 mt-2">系统推荐调整方案</h3>
            {/* 系统推荐的调整收支方案 */}
            <FourModuleAdjustmentSuggestions
              onAcceptSuggestions={() => {
                console.log("接受建议");
                // 可以在这里添加接受建议的逻辑
              }}
              onRejectSuggestions={() => {
                console.log("不接受建议");
                // 可以在这里添加拒绝建议的逻辑
              }}
              pageMode="baogao"
            />
            
            {/* 优化决策按钮 */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-border/50">
              <Button 
                onClick={() => {
                  setOptimizationSnapshot([...mortgages]); // 保存当前数据快照
                  setHasViewedOptimization(true);
                  scrollToChart();
                }}
                className="flex-1"
                variant="outline"
              >
                查看优化效果
              </Button>
              
              <Button 
                onClick={() => {
                  setConfirmedOptimizations([...confirmedOptimizations, currentStep]);
                  setHasViewedOptimization(false);
                  setCurrentStep(currentStep + 1);
                  scrollToChart();
                }}
                className="flex-1"
                variant="default"
              >
                确认做此优化
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
          
          {/* 债务优化效果对比 */}
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow-sm p-4" style={{ boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <h3 className="text-base font-medium text-foreground mb-4 mt-2">债务优化效果监测</h3>
              {/* 现金流对比图表 */}
              {renderCashFlowChart()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OptimizationCards;