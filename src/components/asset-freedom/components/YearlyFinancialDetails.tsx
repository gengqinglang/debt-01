import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CircleCheck, AlertCircle, HelpCircle } from 'lucide-react';

interface IncomeData {
  total: number;
  salary: number;
  rent: number;
  housingFund: number;
  other?: number;
}

interface ExpensesData {
  total: number;
  basic: number;
  education: number;
  medical: number;
  pension: number;
  housing: number;
  transportation: number;
  majorPurchases: number;
  support?: number;
  familySupport?: number;
  other?: number;
}

interface YearlyFinancialData {
  year: number;
  healthy: boolean;
  diagnosis: string;
  pressureType?: 'need_sell_property' | 'insufficient_even_after_selling' | null;
  healthType?: 'income_covers_expenses' | 'need_use_savings' | null;
  income: IncomeData;
  expenses: ExpensesData;
  beginningBalance: number;
}

interface YearlyFinancialDetailsProps {
  yearData: YearlyFinancialData;
  pageMode?: 'member-severe-shortage' | 'member-liquidity-tight' | 'member-balanced' | 'public-severe-shortage' | 'public-liquidity-tight' | 'public-balanced';
  isFromCardExpansion?: boolean; // 用于区分是否来自卡片展开
}

const YearlyFinancialDetails: React.FC<YearlyFinancialDetailsProps> = ({ 
  yearData, 
  pageMode = 'public-balanced',
  isFromCardExpansion = false
}) => {
  const [showAssetExplanation, setShowAssetExplanation] = useState(false);
  const [showDeficitExplanation, setShowDeficitExplanation] = useState(false);

  // 计算会员-平状态下现金流入总金额
  const calculateMemberBalancedIncome = (year: number) => {
    console.log('=== calculateMemberBalancedIncome 调用 ===');
    console.log('year:', year, 'pageMode:', pageMode);
    console.log('yearData.income:', yearData.income);
    
    let baseIncome = yearData.income.salary + yearData.income.rent + yearData.income.housingFund;
    console.log('baseIncome (工资+房租+公积金):', baseIncome);
    
    if (year === 30) {
      // 30岁特殊项目：卖房收入 + 房贷放款 + 金融资产赎回
      const specialIncome = 1000000 + 500000 + 100000;
      const totalIncome = baseIncome + specialIncome;
      console.log('30岁特殊收入:', specialIncome);
      console.log('30岁总收入:', totalIncome);
      return totalIncome;
    } else if (year === 31 && yearData.healthType === 'need_use_savings') {
      const totalIncome = baseIncome + 100000 + 10000;
      console.log('31岁总收入:', totalIncome);
      return totalIncome;
    } else if (year === 32 && yearData.healthType === 'need_use_savings') {
      const totalIncome = baseIncome + 24000 + 6000;
      console.log('32岁总收入:', totalIncome);
      return totalIncome;
    } else {
      // 其他年份如果有other收入才加上
      if (yearData.income.other) {
        baseIncome += yearData.income.other;
        console.log('其他年份，加上other收入后:', baseIncome);
      }
    }
    console.log('最终收入:', baseIncome);
    return baseIncome;
  };

  // 计算会员-平状态下现金流出总金额
  const calculateMemberBalancedExpenses = (year: number) => {
    console.log('=== calculateMemberBalancedExpenses 调用 ===');
    console.log('year:', year, 'pageMode:', pageMode);
    console.log('yearData.expenses:', yearData.expenses);
    
    let baseExpenses = yearData.expenses.basic + yearData.expenses.education + yearData.expenses.medical + 
                       yearData.expenses.pension + yearData.expenses.housing + yearData.expenses.transportation + 
                       yearData.expenses.majorPurchases;
    
    console.log('baseExpenses (基础+教育+医疗+养老+居住+交通+大额):', baseExpenses);
    
    if (yearData.expenses.support || yearData.expenses.familySupport) {
      const supportAmount = yearData.expenses.support || yearData.expenses.familySupport || 0;
      baseExpenses += supportAmount;
      console.log('加上赡养费用:', supportAmount, '新总额:', baseExpenses);
    }
    if (yearData.expenses.other) {
      baseExpenses += yearData.expenses.other;
      console.log('加上其他费用:', yearData.expenses.other, '新总额:', baseExpenses);
    }
    
    if (year === 30) {
      const totalExpenses = baseExpenses + 1700000;
      console.log('30岁买房支出: 1700000');
      console.log('30岁总支出:', totalExpenses);
      return totalExpenses;
    }
    console.log('最终支出:', baseExpenses);
    return baseExpenses;
  };

  // 通用现金流入计算函数 - 基于明细汇总
  const calculateActualIncome = (year: number) => {
    console.log('=== calculateActualIncome 调用 ===');
    console.log('year:', year, 'pageMode:', pageMode);
    
    let totalIncome = yearData.income.salary + yearData.income.rent + yearData.income.housingFund;
    console.log('基础收入 (工资+房租+公积金):', totalIncome);
    
    // 根据不同pageMode和年份添加特殊收入项目
    if (pageMode === 'member-balanced' || pageMode === 'member-severe-shortage') {
      if (year === 30) {
        totalIncome += 1000000; // 卖房收入
        totalIncome += 500000;  // 房贷放款
        totalIncome += 100000;  // 金融资产赎回
        console.log('30岁添加特殊收入: 卖房+房贷+金融资产赎回');
      }
      
      if (yearData.healthType === 'need_use_savings' || pageMode === 'member-severe-shortage') {
        if (year === 31) {
          totalIncome += 110000;   // 金融资产赎回
          console.log('31岁添加金融资产赎回');
        } else if (year === 32) {
          totalIncome += 30000;   // 金融资产赎回
          console.log('32岁添加金融资产赎回');
        }
      }
      
      if (pageMode === 'member-severe-shortage' && year === 33) {
        totalIncome += 2500000;  // 卖房收入
        console.log('33岁添加特殊收入: 卖房');
      }
    }
    
    // 其他收入项目 (除了30岁的特殊情况)
    if (yearData.income.other && !((pageMode === 'member-balanced' || pageMode === 'member-severe-shortage') && year === 30)) {
      totalIncome += yearData.income.other;
      console.log('添加其他收入:', yearData.income.other);
    }
    
    console.log('总收入:', totalIncome);
    return totalIncome;
  };

  // 通用现金流出计算函数 - 基于明细汇总
  const calculateActualExpenses = (year: number) => {
    console.log('=== calculateActualExpenses 调用 ===');
    console.log('year:', year, 'pageMode:', pageMode);
    
    let totalExpenses = yearData.expenses.basic + yearData.expenses.education + yearData.expenses.medical + 
                        yearData.expenses.pension + yearData.expenses.housing + yearData.expenses.transportation + 
                        yearData.expenses.majorPurchases;
    
    console.log('基础支出 (基础+教育+医疗+养老+居住+交通+大额):', totalExpenses);
    
    // 赡养费用
    if (yearData.expenses.support || yearData.expenses.familySupport) {
      const supportAmount = yearData.expenses.support || yearData.expenses.familySupport || 0;
      totalExpenses += supportAmount;
      console.log('添加赡养费用:', supportAmount);
    }
    
    // 其他费用 (提前还贷等)
    if (yearData.expenses.other && !(pageMode === 'member-severe-shortage' && year === 41)) {
      totalExpenses += yearData.expenses.other;
      console.log('添加其他费用:', yearData.expenses.other);
    }
    
    // 30岁买房支出
    if ((pageMode === 'member-balanced' || pageMode === 'member-severe-shortage') && year === 30) {
      totalExpenses += 1700000;
      console.log('30岁添加买房支出: 1700000');
    }
    
    // 33岁特殊支出
    if (pageMode === 'member-severe-shortage' && year === 33) {
      totalExpenses += 600000;  // 提前还贷
      totalExpenses += 3000000; // 买房
      console.log('33岁添加特殊支出: 提前还贷+买房');
    }
    
    console.log('总支出:', totalExpenses);
    return totalExpenses;
  };

  // 计算会员-没钱状态下现金流入总金额
  const calculateMemberSevereShortageIncome = (year: number) => {
    console.log('=== calculateMemberSevereShortageIncome 调用 ===');
    console.log('year:', year);
    
    let baseIncome = yearData.income.salary + yearData.income.rent + yearData.income.housingFund;
    console.log('baseIncome (工资+房租+公积金):', baseIncome);
    
    if (year === 30) {
      // 30岁特殊项目：卖房收入 + 房贷放款 + 金融资产赎回
      const specialIncome = 1000000 + 500000 + 100000;
      const totalIncome = baseIncome + specialIncome;
      console.log('30岁特殊收入:', specialIncome);
      console.log('30岁总收入:', totalIncome);
      return totalIncome;
    } else if (year === 31) {
      const totalIncome = baseIncome + 40000 + 10000;
      console.log('31岁总收入:', totalIncome);
      return totalIncome;
    } else if (year === 32) {
      const totalIncome = baseIncome + 24000 + 6000;
      console.log('32岁总收入:', totalIncome);
      return totalIncome;
    } else if (year === 33) {
      const totalIncome = baseIncome + 8000 + 2000;
      console.log('33岁总收入:', totalIncome);
      return totalIncome;
    } else {
      // 其他年份如果有other收入才加上
      if (yearData.income.other) {
        baseIncome += yearData.income.other;
        console.log('其他年份，加上other收入后:', baseIncome);
      }
    }
    console.log('最终收入:', baseIncome);
    return baseIncome;
  };

  // 计算会员-没钱状态下现金流出总金额
  const calculateMemberSevereShortageExpenses = (year: number) => {
    console.log('=== calculateMemberSevereShortageExpenses 调用 ===');
    console.log('year:', year);
    
    let baseExpenses = yearData.expenses.basic + yearData.expenses.education + yearData.expenses.medical + 
                       yearData.expenses.pension + yearData.expenses.housing + yearData.expenses.transportation + 
                       yearData.expenses.majorPurchases;
    
    console.log('baseExpenses (基础+教育+医疗+养老+居住+交通+大额):', baseExpenses);
    
    if (yearData.expenses.support || yearData.expenses.familySupport) {
      const supportAmount = yearData.expenses.support || yearData.expenses.familySupport || 0;
      baseExpenses += supportAmount;
      console.log('加上赡养费用:', supportAmount, '新总额:', baseExpenses);
    }
    if (yearData.expenses.other && year !== 41) {
      baseExpenses += yearData.expenses.other;
      console.log('加上其他费用:', yearData.expenses.other, '新总额:', baseExpenses);
    }
    
    if (year === 30) {
      const totalExpenses = baseExpenses + 1700000;
      console.log('30岁买房支出: 1700000');
      console.log('30岁总支出:', totalExpenses);
      return totalExpenses;
    }
    console.log('最终支出:', baseExpenses);
    return baseExpenses;
  };

  // 判断是否应该隐藏顶部状态卡片
  const shouldHideStatusCard = isFromCardExpansion && 
    (pageMode === 'member-balanced' || pageMode === 'member-severe-shortage') &&
    [30, 31, 32, 33].includes(yearData.year);

  // 计算现金流结果
  const calculateCashFlowResult = () => {
    let actualIncome: number;
    let actualExpenses: number;
    
    if (pageMode === 'member-balanced' || pageMode === 'member-severe-shortage') {
      actualIncome = calculateActualIncome(yearData.year);
      actualExpenses = calculateActualExpenses(yearData.year);
    } else {
      actualIncome = yearData.income.total;
      actualExpenses = yearData.expenses.total;
    }
    
    return {
      actualIncome,
      actualExpenses,
      netCashFlow: actualIncome - actualExpenses
    };
  };

  const { netCashFlow } = calculateCashFlowResult();

  return (
    <div className="space-y-2">
      {/* 财务状态总结 - 只在非特定条件下显示 */}
      {!shouldHideStatusCard && (
        <Card className={`p-3 ${
          yearData.healthy 
            ? 'bg-[#CAF4F7]/30 border-[#CAF4F7]/50' 
            : 'bg-red-50/60 border-red-200/40'
        }`}>
          <div className="flex items-center gap-2">
            {yearData.healthy ? (
              <CircleCheck className="h-5 w-5 text-[#01BCD6]" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span className="font-medium text-sm">
              {yearData.healthy ? "无现金流缺口" : (pageMode === 'member-severe-shortage' && (yearData.year === 32 || yearData.year === 33) ? "有现金流缺口" : "财务压力")}
            </span>
          </div>
        </Card>
      )}
      
      {/* 当年现金流盈余/缺口显示 - 仅在特定条件下显示在顶部 */}
      {shouldHideStatusCard && (
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            {netCashFlow >= 0 ? (
              <Card className="p-3 bg-[#CAF4F7]/30 border-[#CAF4F7]/50">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-gray-700">当年现金流盈余</span>
                  <span className="text-lg font-semibold text-[#01BCD6]">
                    +¥{netCashFlow.toLocaleString()}
                  </span>
                </div>
              </Card>
            ) : (
              <Card className="p-3 bg-red-50/60 border-red-200/40">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-gray-700">当年现金流缺口</span>
                  <span className="text-lg font-semibold text-red-600">
                    ¥{netCashFlow.toLocaleString()}
                  </span>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
      
      {/* 等号分隔符 - 仅在卡片展开模式下显示 */}
      {shouldHideStatusCard && (
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-600">=</span>
          </div>
        </div>
      )}
      
      {/* 现金流明细：垂直布局，更清晰的空间感 */}
      <div className="space-y-2">
        {/* 现金流入 */}
        <Card className="p-3 bg-green-50/40 border-green-200/60">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base font-medium text-green-800">现金流入</span>
            <span className="text-lg font-semibold text-green-700">
              ¥{(() => {
                console.log('=== 现金流入总额计算 ===');
                console.log('pageMode:', pageMode);
                console.log('year:', yearData.year);
                
                if (pageMode === 'member-balanced' || pageMode === 'member-severe-shortage') {
                  const result = calculateActualIncome(yearData.year);
                  console.log('使用 calculateActualIncome，结果:', result);
                  return result;
                } else {
                  const result = yearData.income.total;
                  console.log('使用 yearData.income.total，结果:', result);
                  return result;
                }
              })().toLocaleString()}
            </span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">工资收入</span>
               <span className="text-gray-800">¥{yearData.income.salary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">房租收入</span>
               <span className="text-gray-800">¥{yearData.income.rent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">公积金</span>
               <span className="text-gray-800">¥{yearData.income.housingFund.toLocaleString()}</span>
            </div>
            {yearData.income.other && !(pageMode === 'member-severe-shortage' && yearData.year === 41) && 
             !((pageMode === 'member-severe-shortage' || pageMode === 'member-balanced') && yearData.year === 30) && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">卖房收入</span>
                <span className="text-gray-800">¥{yearData.income.other.toLocaleString()}</span>
              </div>
            )}
            
            {/* 30岁会员-没钱状态和会员-平状态特殊显示 - 现金流入项目 */}
            {((pageMode === 'member-severe-shortage' || pageMode === 'member-balanced') && yearData.year === 30) && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">卖房收入</span>
                <span className="text-gray-800">¥1,000,000</span>
              </div>
            )}
            {((pageMode === 'member-severe-shortage' || pageMode === 'member-balanced') && yearData.year === 30) && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">房贷放款</span>
                <span className="text-gray-800">¥500,000</span>
              </div>
            )}
            {((pageMode === 'member-severe-shortage' || pageMode === 'member-balanced') && yearData.year === 30) && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">金融资产赎回</span>
                <span className="text-gray-800">¥100,000</span>
              </div>
            )}
            
            {/* 31岁需要使用积蓄时显示金融资产赎回项目 */}
            {yearData.healthType === 'need_use_savings' && yearData.year === 31 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">金融资产赎回</span>
                <span className="text-gray-800">¥110,000</span>
              </div>
            )}
            
            {/* 32岁需要使用积蓄时显示金融资产赎回项目 */}
            {yearData.healthType === 'need_use_savings' && yearData.year === 32 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">金融资产赎回</span>
                <span className="text-gray-800">¥30,000</span>
              </div>
            )}
            
            {/* 33岁严重状态下显示特殊收入项目 */}
            {pageMode === 'member-severe-shortage' && yearData.year === 33 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">卖房收入</span>
                <span className="text-gray-800">¥2,500,000</span>
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
            <span className="text-base font-medium text-red-800">现金流出</span>
            <span className="text-lg font-semibold text-red-700">
              ¥{(() => {
                console.log('=== 现金流出总额计算 ===');
                console.log('pageMode:', pageMode);
                console.log('year:', yearData.year);
                
                if (pageMode === 'member-balanced' || pageMode === 'member-severe-shortage') {
                  const result = calculateActualExpenses(yearData.year);
                  console.log('使用 calculateActualExpenses，结果:', result);
                  return result;
                } else {
                  const result = yearData.expenses.total;
                  console.log('使用 yearData.expenses.total，结果:', result);
                  return result;
                }
              })().toLocaleString()}
            </span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">基础生活</span>
               <span className="text-gray-800">¥{yearData.expenses.basic.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">教育</span>
               <span className="text-gray-800">¥{yearData.expenses.education.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">医疗</span>
               <span className="text-gray-800">¥{yearData.expenses.medical.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">养老</span>
               <span className="text-gray-800">¥{yearData.expenses.pension.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">居住</span>
               <span className="text-gray-800">¥{yearData.expenses.housing.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">交通</span>
               <span className="text-gray-800">¥{yearData.expenses.transportation.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">大额消费</span>
               <span className="text-gray-800">¥{yearData.expenses.majorPurchases.toLocaleString()}</span>
            </div>
            {(yearData.expenses.support || yearData.expenses.familySupport) && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">赡养</span>
                <span className="text-gray-800">¥{(yearData.expenses.support || yearData.expenses.familySupport || 0).toLocaleString()}</span>
              </div>
            )}
            {yearData.expenses.other && !(pageMode === 'member-severe-shortage' && yearData.year === 41) && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">提前还贷</span>
                <span className="text-gray-800">¥{yearData.expenses.other.toLocaleString()}</span>
              </div>
            )}
            {/* 30岁会员-没钱状态和会员-平状态特殊显示 - 买房现金流出项目 */}
            {((pageMode === 'member-severe-shortage' || pageMode === 'member-balanced') && yearData.year === 30) && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">买房</span>
                <span className="text-gray-800">¥1,700,000</span>
              </div>
            )}
            
            {/* 33岁会员-没钱状态特殊显示 - 特殊支出项目 */}
            {pageMode === 'member-severe-shortage' && yearData.year === 33 && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">提前还贷</span>
                  <span className="text-gray-800">¥600,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">买房</span>
                  <span className="text-gray-800">¥3,000,000</span>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* 等号分隔符 - 仅在非卡片展开模式下显示 */}
        {!shouldHideStatusCard && (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-600">=</span>
            </div>
          </div>
        )}

        {/* 结果卡片 - 只在非卡片展开模式下显示 */}
        {!shouldHideStatusCard && (
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              {(() => {
                // 计算实际的现金流入和现金流出
                let actualIncome: number;
                let actualExpenses: number;
                
                if (pageMode === 'member-balanced' || pageMode === 'member-severe-shortage') {
                  actualIncome = calculateActualIncome(yearData.year);
                  actualExpenses = calculateActualExpenses(yearData.year);
                } else {
                  actualIncome = yearData.income.total;
                  actualExpenses = yearData.expenses.total;
                }
                
                const netCashFlow = actualIncome - actualExpenses;
                console.log('=== 当年现金流盈余/缺口计算 ===');
                console.log('实际收入:', actualIncome);
                console.log('实际支出:', actualExpenses);
                console.log('净现金流:', netCashFlow);
                
                if (netCashFlow >= 0) {
                  return (
                    <Card className="p-3 bg-[#CAF4F7]/30 border-[#CAF4F7]/50">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-medium text-gray-700">当年现金流盈余</span>
                        <span className="text-lg font-semibold text-[#01BCD6]">
                          +¥{netCashFlow.toLocaleString()}
                        </span>
                      </div>
                    </Card>
                  );
                } else {
                  return (
                    <Card className="p-3 bg-red-50/60 border-red-200/40">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-medium text-gray-700">当年现金流缺口</span>
                        <span className="text-lg font-semibold text-red-600">
                          ¥{netCashFlow.toLocaleString()}
                        </span>
                      </div>
                    </Card>
                  );
                }
              })()}
            </div>
          </div>
        )}
      </div>

      {/* 当年家庭资产说明弹窗 */}
      <Dialog open={showAssetExplanation} onOpenChange={setShowAssetExplanation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-medium">当年家庭资产</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              这里需要增加解释文案
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* 当年净缺口说明弹窗 */}
      <Dialog open={showDeficitExplanation} onOpenChange={setShowDeficitExplanation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-medium">当年净缺口</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              这里需要解释文案
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default YearlyFinancialDetails;