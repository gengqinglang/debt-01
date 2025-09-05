import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calculator, TrendingUp, Percent, BarChart3, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

import { useLoanData, LoanInfo } from '@/hooks/useLoanData';
import { LoanFormCard } from './LoanFormCard';
import { PrepaymentSummaryModal } from './PrepaymentSummaryModal';

interface SharedLoanModuleProps {
  // 将原来的所有计算函数作为props传入，保持接口一致
  calculateLoanStats: (loan: LoanInfo) => any;
  isLoanComplete: (loan: LoanInfo) => boolean;
  calculateMonthlyPayment: (loan: LoanInfo) => number;
  currentLPR_5Year: number;
  currentLPR_5YearPlus: number;
  isCommercialLoanComplete: (loan: LoanInfo) => boolean;
  isProvidentLoanComplete: (loan: LoanInfo) => boolean;
  calculateCommercialMonthlyPayment: (loan: LoanInfo) => number;
  calculateProvidentMonthlyPayment: (loan: LoanInfo) => number;
  calculateCommercialLoanStats: (loan: LoanInfo) => any;
  calculateProvidentLoanStats: (loan: LoanInfo) => any;
  // 传入LoanFormCard组件以保持完全一致的渲染（可选，有默认实现）
  LoanFormCard?: React.ComponentType<any>;
  // 可选的额外内容
  children?: React.ReactNode;
  // 新增：将内部 loans 同步给父组件
  onLoansChange?: (loans: LoanInfo[]) => void;
  // 新增：控制是否持久化到localStorage
  persist?: boolean;
}

export const SharedLoanModule: React.FC<SharedLoanModuleProps> = ({
  calculateLoanStats,
  isLoanComplete,
  calculateMonthlyPayment,
  currentLPR_5Year,
  currentLPR_5YearPlus,
  isCommercialLoanComplete,
  isProvidentLoanComplete,
  calculateCommercialMonthlyPayment,
  calculateProvidentMonthlyPayment,
  calculateCommercialLoanStats,
  calculateProvidentLoanStats,
  LoanFormCard: CustomLoanFormCard,
  children,
  onLoansChange,
  persist = true
}) => {
  const { loans, updateLoan, addLoan, removeLoan } = useLoanData({ persist });
  const [showPrepaymentSummary, setShowPrepaymentSummary] = useState(false);
  const [showLoanSummary, setShowLoanSummary] = useState(false);
  const [prepayments, setPrepayments] = useState<Array<{
    id: string;
    loanId: string;
    prepaymentAmount: string;
    feeRate: string;
  }>>([]);
  const [selectedSubLoanForPrepayment, setSelectedSubLoanForPrepayment] = useState<{[key: string]: 'commercial' | 'provident'}>({});
  const [customMonthlyPaymentByLoan, setCustomMonthlyPaymentByLoan] = useState<{[key: string]: string}>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Helper functions for prepayment calculations
  const calculateRemainingPrincipal = (loan: LoanInfo, selectedSubLoan?: 'commercial' | 'provident') => {
    if (loan.loanType === 'combination' && selectedSubLoan) {
      if (selectedSubLoan === 'commercial') {
        return parseFloat(loan.commercialRemainingPrincipal || '0') * 10000;
      } else {
        return parseFloat(loan.providentRemainingPrincipal || '0') * 10000;
      }
    }
    return parseFloat(loan.remainingPrincipal || loan.loanAmount || '0') * 10000;
  };

  const calculatePrepaymentEffects = (loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    const prepayment = prepayments.find(p => p.loanId === loanId);
    
    if (!loan || !prepayment?.prepaymentAmount) {
      return { isEmpty: true, method1: {}, method2: {}, method3: {} };
    }

    const prepaymentAmount = parseFloat(prepayment.prepaymentAmount) * 10000;
    const feeRate = prepayment.feeRate ? parseFloat(prepayment.feeRate) / 100 : 0;
    const prepaymentFee = prepaymentAmount * feeRate;

    // Simplified calculation - in real implementation you'd need proper loan math
    const currentMonthlyPayment = calculateMonthlyPayment(loan);
    const savedInterest = prepaymentAmount * 0.05 - prepaymentFee; // Simplified
    
    return {
      isEmpty: false,
      method1: {
        savedInterest,
        newMonthlyPayment: currentMonthlyPayment * 0.9,
        paymentChange: currentMonthlyPayment * -0.1
      },
      method2: {
        savedInterest: savedInterest * 1.2,
        newMonthlyPayment: currentMonthlyPayment,
        paymentChange: 0
      },
      method3: customMonthlyPaymentByLoan[loanId] ? {
        savedInterest: savedInterest * 1.1,
        newMonthlyPayment: parseFloat(customMonthlyPaymentByLoan[loanId]),
        paymentChange: parseFloat(customMonthlyPaymentByLoan[loanId]) - currentMonthlyPayment
      } : undefined
    };
  };

  const renderInvestmentComparison = (loanId: string) => {
    return null; // Placeholder for investment comparison module
  };

  // 确保至少有一笔贷款（初始状态）
  useEffect(() => {
    if (loans.length === 0) {
      addLoan();
    }
  }, [loans.length, addLoan]);
  
  // 初始化第一个贷款为展开状态
  const [expandedLoans, setExpandedLoans] = useState<{ [key: string]: boolean }>(() => {
    return loans.length > 0 ? { [loans[0].id]: true } : {};
  });
  
  // 确保第一个房贷卡片默认展开
  useEffect(() => {
    if (loans.length > 0) {
      setExpandedLoans({ [loans[0].id]: true });
    }
  }, [loans.length]);
  const prevLoansLengthRef = useRef(loans.length);
  
  // 使用传入的LoanFormCard或默认的LoanFormCard
  const LoanCardComponent = CustomLoanFormCard || LoanFormCard;

  // 检测新增贷款并自动展开，同时收起其他
  useEffect(() => {
    if (loans.length > prevLoansLengthRef.current) {
      // 新增了贷款，只展开最新的贷款，收起其他所有
      const newLoan = loans[loans.length - 1];
      setExpandedLoans({ [newLoan.id]: true }); // 只保留新贷款展开
    }
    prevLoansLengthRef.current = loans.length;
  }, [loans.length, loans]);

  const toggleLoanExpand = (loanId: string) => {
    setExpandedLoans(prev => ({
      ...prev,
      [loanId]: !prev[loanId]
    }));
  };

  const collapseLoan = (loanId: string) => {
    setExpandedLoans(prev => ({
      ...prev,
      [loanId]: false
    }));
  };

  // 同步内部 loans 给父组件
  useEffect(() => {
    onLoansChange?.(loans);
  }, [loans, onLoansChange]);

  // 检查所有必输栏位是否已填写
  const isAllRequiredFieldsFilled = () => {
    return loans.every(loan => {
      // 检查基本必填项
      const basicRequired = loan.propertyName && loan.loanAmount && loan.loanStartDate && loan.loanEndDate && loan.paymentMethod;
      
      if (!basicRequired) return false;
      
      // 根据贷款类型检查特定必填项
      if (loan.loanType === 'commercial') {
        // 商业贷款必填项
        if (loan.rateType === 'fixed') {
          return loan.fixedRate;
        } else {
          return loan.floatingRateAdjustment !== undefined && loan.floatingRateAdjustment !== '';
        }
      } else if (loan.loanType === 'provident') {
        // 公积金贷款必填项
        return loan.providentRate;
      } else if (loan.loanType === 'combination') {
        // 组合贷款必填项
        const commercialRequired = loan.commercialLoanAmount && loan.commercialStartDate && loan.commercialEndDate && loan.commercialPaymentMethod &&
          (loan.commercialRateType === 'fixed' ? loan.commercialFixedRate : 
           (loan.commercialFloatingRateAdjustment !== undefined && loan.commercialFloatingRateAdjustment !== ''));
        const providentRequired = loan.providentLoanAmount && loan.providentStartDate && loan.providentEndDate && loan.providentPaymentMethod && loan.providentRate;
        return commercialRequired && providentRequired;
      }
      
      return false;
    });
  };

  return (
    <>
      {/* 贷款列表 - 只在不显示贷款概要时显示 */}
      {!showLoanSummary && loans.map((loan, index) => (
        <div key={loan.id} className="mb-4">
          <LoanCardComponent
            loan={loan} 
            index={index}
            updateLoan={updateLoan}
            removeLoan={removeLoan}
            loansLength={loans.length}
            calculateLoanStats={calculateLoanStats}
            isLoanComplete={isLoanComplete}
            calculateMonthlyPayment={calculateMonthlyPayment}
            currentLPR_5Year={currentLPR_5Year}
            currentLPR_5YearPlus={currentLPR_5YearPlus}
            isCommercialLoanComplete={isCommercialLoanComplete}
            isProvidentLoanComplete={isProvidentLoanComplete}
            calculateCommercialMonthlyPayment={calculateCommercialMonthlyPayment}
            calculateProvidentMonthlyPayment={calculateProvidentMonthlyPayment}
            calculateCommercialLoanStats={calculateCommercialLoanStats}
            calculateProvidentLoanStats={calculateProvidentLoanStats}
            isExpanded={expandedLoans[loan.id] || false}
            onToggleExpand={() => toggleLoanExpand(loan.id)}
            onCollapse={() => collapseLoan(loan.id)}
          />
        </div>
      ))}

      {/* 按钮区域 - 只在不显示贷款概要时显示 */}
      {!showLoanSummary && (
        <div className="">
          <div className="mt-6 mb-3">
            <Button
              disabled={!isAllRequiredFieldsFilled()}
              className={`w-full h-12 font-bold rounded-lg text-sm transform hover:scale-[1.02] transition-all duration-300 border-0 ${
                !isAllRequiredFieldsFilled()
                  ? 'bg-[#CAF4F7]/70 text-gray-500'
                  : 'bg-[#CAF4F7] hover:bg-[#CAF4F7]/90 text-gray-900'
              }`}
              onClick={() => {
                if (!isAllRequiredFieldsFilled()) {
                  toast({
                    title: "请完善信息",
                    description: "请先填写完整所有必填项后再进入提前还款试算",
                    variant: "destructive",
                  });
                  return;
                }
                // 收起所有贷款录入模块
                setExpandedLoans({});
                // 显示贷款概要模块
                setShowLoanSummary(true);
              }}
            >
              进入提前还款测算
            </Button>
          </div>
        </div>
      )}

      {/* 贷款概要模块 - 只在显示贷款概要时显示 */}
      {showLoanSummary && loans.length > 0 && (
        <div className="mx-2">
          <div className="flex items-center justify-between mb-3 mt-4">
            <div className="flex items-center">
              <span className="text-base font-semibold text-gray-900">
                {loans[0].propertyName || '房产信息'}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setShowLoanSummary(false);
                // 展开第一个贷款录入栏位
                if (loans.length > 0) {
                  setExpandedLoans({ [loans[0].id]: true });
                }
              }}
              className="h-8 px-3 text-xs flex items-center gap-1"
              style={{ color: '#01BCD6' }}
            >
              返回贷款录入
            </Button>
          </div>

          {/* 还款进度展示 */}
          <div className="space-y-3">
            {(() => {
              const stats = calculateLoanStats(loans[0]);
              return (
                <div className="rounded-lg py-4 px-3 bg-[#CAF4F7]/30">
                  <div className="space-y-4">
                    {/* 贷款基本信息展示 */}
                    <div className="grid grid-cols-3 gap-3 border-b border-white pb-3">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">原始贷款本金</div>
                        <div className="text-sm font-bold text-gray-900">
                          {loans[0].loanAmount || '未设置'}万元
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">利率</div>
                        <div className="text-sm font-bold text-gray-900">
                          {loans[0].rateType === 'fixed' ? `${loans[0].fixedRate || '未设置'}%` : `LPR${loans[0].floatingRateAdjustment || '+0'}BP`}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">月供</div>
                        <div className="text-sm font-bold text-gray-900">
                          {stats?.currentMonthlyPayment ? `${Math.round(stats.currentMonthlyPayment).toLocaleString()}元` : '计算中...'}
                        </div>
                      </div>
                    </div>
                    {/* 时间进度 */}
                    <div>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">已还时间</div>
                          <div className="text-sm font-semibold text-gray-900">
                            {stats?.paidMonths || 0}个月
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">剩余时间</div>
                          <div className="text-sm font-semibold text-gray-900">
                            {(stats?.totalMonths || 0) - (stats?.paidMonths || 0)}个月
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">进度</div>
                          <div className="text-sm font-semibold" style={{ color: '#01BCD6' }}>
                            {stats?.timeProgress?.toFixed(1) || '0.0'}%
                          </div>
                        </div>
                      </div>
                      <Progress value={stats?.timeProgress || 0} className="h-2" />
                    </div>

                    {/* 本金进度 */}
                    <div>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">已还本金</div>
                          <div className="text-sm font-semibold text-gray-900">
                            {((stats?.paidPrincipal || 0) / 10000).toFixed(1)}万元
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">待还本金</div>
                          <div className="text-sm font-semibold text-gray-900">
                            {(((stats?.totalPrincipal || 0) - (stats?.paidPrincipal || 0)) / 10000).toFixed(1)}万元
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">进度</div>
                          <div className="text-sm font-semibold" style={{ color: '#01BCD6' }}>
                            {stats?.principalProgress?.toFixed(1) || '0.0'}%
                          </div>
                        </div>
                      </div>
                      <Progress value={stats?.principalProgress || 0} className="h-2" />
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 提前还款测算模块 */}
          <div className="bg-white rounded-xl py-4 px-0 mt-4">
            <div className="mb-4">
               <h4 className="text-base font-bold text-cyan-700 mb-2 flex items-center gap-2">
                 <Calculator className="h-4 w-4" />
                 请填写以下信息进行提前还款测算
              </h4>
            </div>
            
            <div className="space-y-6">
              {/* 提前还款金额 - 特别突出 */}
               <div className="bg-white rounded-lg p-4 border border-cyan-300">
                 <Label className="text-sm font-bold text-cyan-700 mb-3 block flex items-center gap-2">
                   <TrendingUp className="h-4 w-4" />
                   提前还款金额(万元) <span className="text-red-500 text-base">*</span>
                </Label>
                 <Input
                   type="number"
                   step="0.01"
                   placeholder={(() => {
                     // 计算待还本金作为上限提示
                     const selectedSubLoan = selectedSubLoanForPrepayment[loans[0].id];
                     
                     if (loans[0].loanType === 'combination' && !selectedSubLoan) {
                       return "请先选择还款方式";
                     }
                     
                     const remainingPrincipal = loans[0].loanType === 'combination' && selectedSubLoan
                       ? calculateRemainingPrincipal(loans[0], selectedSubLoan) / 10000
                       : calculateRemainingPrincipal(loans[0]) / 10000; // 转换为万元
                     
                     if (remainingPrincipal > 0) {
                       return `请输入提前还款金额，上限${remainingPrincipal.toFixed(2)}万元`;
                     } else {
                       return "请输入提前还款金额，如：50";
                     }
                   })()}
                   value={prepayments.find(p => p.loanId === loans[0].id)?.prepaymentAmount || ''}
                   onChange={(e) => {
                     const value = e.target.value;
                     // 组合贷款需要使用选中的子贷款来计算剩余本金
                     const selectedSubLoan = selectedSubLoanForPrepayment[loans[0].id];
                     const remainingPrincipal = loans[0].loanType === 'combination' && selectedSubLoan
                       ? calculateRemainingPrincipal(loans[0], selectedSubLoan) / 10000
                       : calculateRemainingPrincipal(loans[0]) / 10000; // 转换为万元
                     const prepaymentAmount = parseFloat(value);
                     
                     // 组合贷款必须先选择子贷款类型
                     if (loans[0].loanType === 'combination' && !selectedSubLoan) {
                       toast({
                         title: "请先选择",
                         description: "请先选择要提前还款的贷款类型（商业贷款或公积金贷款）",
                         variant: "destructive",
                       });
                       return;
                     }
                     
                     // 校验不能超过剩余本金
                     if (value && prepaymentAmount > remainingPrincipal) {
                       const loanTypeName = loans[0].loanType === 'combination' && selectedSubLoan
                         ? (selectedSubLoan === 'commercial' ? '商业贷款' : '公积金贷款')
                         : '该贷款';
                       toast({
                         title: "输入错误",
                         description: `提前还款金额不能超过${loanTypeName}剩余本金${remainingPrincipal.toFixed(2)}万元`,
                         variant: "destructive",
                       });
                       return;
                     }
                   
                     setPrepayments(prev => {
                       const existing = prev.find(p => p.loanId === loans[0].id);
                       if (existing) {
                         return prev.map(p => 
                           p.loanId === loans[0].id 
                             ? { ...p, prepaymentAmount: value }
                             : p
                         );
                       } else {
                         return [...prev, {
                           id: Date.now().toString(),
                           loanId: loans[0].id,
                           prepaymentAmount: value,
                           feeRate: '0'
                         }];
                       }
                     });
                   }}
                   className="h-11 text-base font-medium border border-cyan-300 focus:border-cyan-400 bg-white"
                 />
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* 费率 */}
                 <div className="bg-white rounded-lg p-4 border border-cyan-300">
                   <Label className="text-sm font-bold text-cyan-700 mb-3 block flex items-center gap-2">
                     <Percent className="h-4 w-4" />
                     费率(%) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="如：0.5"
                      value={prepayments.find(p => p.loanId === loans[0].id)?.feeRate ?? '0'}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPrepayments(prev => {
                          const existing = prev.find(p => p.loanId === loans[0].id);
                          if (existing) {
                            return prev.map(p => 
                              p.loanId === loans[0].id 
                                ? { ...p, feeRate: value }
                                : p
                            );
                          } else {
                            return [...prev, {
                              id: Date.now().toString(),
                              loanId: loans[0].id,
                              prepaymentAmount: '',
                              feeRate: value
                            }];
                          }
                        });
                       }}
                       className="h-11 text-base font-medium border border-cyan-300 focus:border-cyan-400 pr-10 bg-white"
                     />
                     <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                   </div>
                </div>

                {/* 提前还款费用显示 */}
                <div className="bg-white rounded-lg p-4 border border-cyan-300">
                   <Label className="text-sm font-bold text-cyan-700 mb-3 block flex items-center gap-2">
                     <Calculator className="h-4 w-4" />
                     提前还款费用
                  </Label>
                  {(() => {
                    const prepayment = prepayments.find(p => p.loanId === loans[0].id);
                    if (prepayment?.prepaymentAmount) {
                      const prepaymentAmount = parseFloat(prepayment.prepaymentAmount) * 10000; // 转为元
                      const feeRate = prepayment.feeRate ? parseFloat(prepayment.feeRate) / 100 : 0;
                      const prepaymentFee = prepaymentAmount * feeRate;
                      return (
                        <div className="h-11 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 flex items-center text-base font-bold text-gray-500">
                          {prepaymentFee.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}元
                        </div>
                      );
                    }
                    return (
                      <div className="h-11 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 flex items-center text-base text-gray-500">
                        --
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
            
            {/* 测算结果展示 */}
            {(() => {
              const effects = calculatePrepaymentEffects(loans[0].id);
              if (!effects) return null;
              return (
                <div className="mt-6 space-y-6">
                  <div className="pt-3">
                     <h4 className="text-base font-bold text-cyan-700 mb-4 flex items-center gap-2">
                       <BarChart3 className="h-4 w-4" />
                       测算结果
                      </h4>
                   
                     {/* 方式一：按照原期限继续还 */}
                     <div className="space-y-4 mb-8">
                      <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#01BCD6' }}>1</span>
                        方式一：按照原期限继续还（减少月供）
                      </h5>
                        <div className="grid grid-cols-3 gap-4">
                          {/* DEBUG: Method 1 container */}
                         <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                           <span className="text-xs font-medium block mb-1 text-gray-600">节省总成本</span>
                           <div className="text-base font-bold" style={{ color: '#01BCD6' }}>
                             {effects.isEmpty || typeof effects.method1.savedInterest === 'string' ? '--' :
                              (() => {
                                // effects.method1.savedInterest already has prepayment fee deducted
                                const totalCostSaved = effects.method1.savedInterest as number;
                                const amountInWan = totalCostSaved / 10000;
                                return amountInWan >= 10 
                                  ? amountInWan.toLocaleString('zh-CN', { maximumFractionDigits: 0 })
                                  : amountInWan.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                              })()}
                             {effects.isEmpty || typeof effects.method1.savedInterest === 'string' ? '' : '万元'}
                           </div>
                         </div>
                         <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                           <span className="text-xs font-medium block mb-1 text-gray-600">下期月供</span>
                           <div className="text-base font-bold" style={{ color: '#01BCD6' }}>
                             {effects.isEmpty || typeof effects.method1.newMonthlyPayment === 'string' 
                               ? '--' 
                               : (effects.method1.newMonthlyPayment as number).toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
                             {effects.isEmpty || typeof effects.method1.newMonthlyPayment === 'string' ? '' : '元'}
                           </div>
                         </div>
                         <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                           <span className="text-xs font-medium block mb-1 text-gray-600">下期月供变化</span>
                           <div className="text-base font-bold" style={{ 
                             color: effects.isEmpty || typeof effects.method1.paymentChange === 'string' ? '#9CA3AF' :
                                    (effects.method1.paymentChange as number) < 0 ? '#01BCD6' : 
                                    (effects.method1.paymentChange as number) === 0 ? '#9CA3AF' : '#FF6B6B' 
                           }}>
                             {effects.isEmpty || typeof effects.method1.paymentChange === 'string' ? '--' :
                              (() => {
                                const change = effects.method1.paymentChange as number;
                                return change === 0 ? '0元' : 
                                       (change < 0 ? '-' : '+') + 
                                       Math.abs(change).toLocaleString('zh-CN', { maximumFractionDigits: 0 }) + '元';
                              })()}
                           </div>
                         </div>
                       </div>
                    </div>

                    {/* 方式二：按照原月供继续还 */}
                    <div className="space-y-4 mb-8 mt-8">
                      <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#01BCD6' }}>2</span>
                        方式二：按照原月供继续还{loans[0].paymentMethod === 'equal-payment' ? '(缩短期限)' : '(缩短期限)'}
                      </h5>
                       <div className="grid grid-cols-3 gap-4">
                         <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                           <span className="text-xs font-medium block mb-1 text-gray-600">节省总成本</span>
                           <div className="text-base font-bold" style={{ color: '#01BCD6' }}>
                             {effects.isEmpty || typeof effects.method2.savedInterest === 'string' ? '--' :
                              (() => {
                                // effects.method2.savedInterest already has prepayment fee deducted
                                const totalCostSaved = effects.method2.savedInterest as number;
                                const amountInWan = totalCostSaved / 10000;
                                return amountInWan >= 10 
                                  ? amountInWan.toLocaleString('zh-CN', { maximumFractionDigits: 0 })
                                  : amountInWan.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                              })()}
                             {effects.isEmpty || typeof effects.method2.savedInterest === 'string' ? '' : '万元'}
                           </div>
                         </div>
                         <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                           <span className="text-xs font-medium block mb-1 text-gray-600">下期月供</span>
                           <div className="text-base font-bold" style={{ color: '#01BCD6' }}>
                             {effects.isEmpty || typeof effects.method2.newMonthlyPayment === 'string' 
                               ? '--' 
                               : (effects.method2.newMonthlyPayment as number).toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
                             {effects.isEmpty || typeof effects.method2.newMonthlyPayment === 'string' ? '' : '元'}
                           </div>
                         </div>
                         <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                           <span className="text-xs font-medium block mb-1 text-gray-600">下期月供变化</span>
                           <div className="text-base font-bold" style={{ 
                             color: effects.isEmpty || typeof effects.method2.paymentChange === 'string' ? '#9CA3AF' :
                                    (effects.method2.paymentChange as number) < 0 ? '#01BCD6' : 
                                    (effects.method2.paymentChange as number) === 0 ? '#9CA3AF' : '#FF6B6B' 
                           }}>
                             {effects.isEmpty || typeof effects.method2.paymentChange === 'string' ? '--' :
                              (() => {
                                const change = effects.method2.paymentChange as number;
                                return change === 0 ? '0元' : 
                                       (change < 0 ? '-' : '+') + 
                                       Math.abs(change).toLocaleString('zh-CN', { maximumFractionDigits: 0 }) + '元';
                              })()}
                           </div>
                         </div>
                       </div>
                    </div>

                     {/* 方式三：自定义月供金额 - 仅公积金贷款或组合贷款选择公积金时显示 */}
                     {(() => {
                       // 判断是否应该显示方式三
                       const shouldShowMethod3 = loans[0].loanType === 'provident' || 
                         (loans[0].loanType === 'combination' && selectedSubLoanForPrepayment[loans[0].id] === 'provident');
                       
                       if (!shouldShowMethod3) return null;
                       
                       return (
                         <div className="space-y-4 mt-8">
                           <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                             <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#01BCD6' }}>3</span>
                             方式三：自定义月供金额
                           </h5>
                           <div className="space-y-3">
                             <Label className="text-sm font-semibold" style={{ color: '#01BCD6' }}>
                               月供金额(元) <span className="text-red-500">*</span>
                             </Label>
                             <Input
                               type="number"
                               placeholder={(!effects.isEmpty && typeof effects.method1.newMonthlyPayment === 'number') ? `最低${(effects.method1.newMonthlyPayment as number).toLocaleString('zh-CN', { maximumFractionDigits: 0 })}元` : '最低--元'}
                               value={customMonthlyPaymentByLoan[loans[0].id] || ''}
                               onChange={(e) => {
                                 const value = e.target.value;
                                 setCustomMonthlyPaymentByLoan(prev => ({
                                   ...prev,
                                   [loans[0].id]: value
                                 }));
                               }}
                               onBlur={(e) => {
                                 const value = e.target.value;
                                 const amount = parseFloat(value);
                                 if (value && !effects.isEmpty && typeof effects.method1.newMonthlyPayment === 'number' && amount < effects.method1.newMonthlyPayment) {
                                   toast({
                                     title: "输入错误",
                                     description: `自定义月供不能低于方式一的下期月供${effects.method1.newMonthlyPayment.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}元`,
                                     variant: 'destructive',
                                   });
                                   setCustomMonthlyPaymentByLoan(prev => ({
                                     ...prev,
                                     [loans[0].id]: ''
                                   }));
                                 }
                               }}
                               className="h-12 text-base font-medium border-2 focus:border-primary"
                               style={{ borderColor: '#CAF4F7', backgroundColor: 'white' }}
                             />
                           </div>
           
                            <div className="grid grid-cols-3 gap-4">
                              <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                                <span className="text-xs font-medium block mb-1 text-gray-600">节省总成本</span>
                                <div className="text-base font-bold" style={{ color: '#01BCD6' }}>
                                  {!customMonthlyPaymentByLoan[loans[0].id] ? '--' : (() => {
                                    if (effects.method3 && typeof effects.method3.savedInterest === 'number') {
                                      // effects.method3.savedInterest already has prepayment fee deducted
                                      const totalCostSaved = effects.method3.savedInterest as number;
                                      const amountInWan = totalCostSaved / 10000;
                                      return amountInWan >= 10 
                                        ? amountInWan.toLocaleString('zh-CN', { maximumFractionDigits: 0 }) + '万元'
                                        : amountInWan.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '万元';
                                    }
                                    return '--';
                                  })()}
                                </div>
                              </div>
                              <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                                <span className="text-xs font-medium block mb-1 text-gray-600">下期月供</span>
                                <div className="text-base font-bold" style={{ color: '#01BCD6' }}>
                                  {!customMonthlyPaymentByLoan[loans[0].id] ? '--' : (effects.method3 && typeof effects.method3.newMonthlyPayment === 'number' 
                                    ? (effects.method3.newMonthlyPayment as number).toLocaleString('zh-CN', { maximumFractionDigits: 0 }) + '元' 
                                    : '--')}
                                </div>
                              </div>
                              <div className="p-3 rounded-lg border border-gray-200 bg-white shadow-md">
                                <span className="text-xs font-medium block mb-1 text-gray-600">下期月供变化</span>
                                <div className="text-base font-bold" style={{ 
                                  color: !customMonthlyPaymentByLoan[loans[0].id] || !(effects.method3 && typeof effects.method3.paymentChange === 'number') ? '#9CA3AF' :
                                         (effects.method3.paymentChange as number) < 0 ? '#01BCD6' : 
                                         (effects.method3.paymentChange as number) === 0 ? '#9CA3AF' : '#FF6B6B' 
                                }}>
                                  {!customMonthlyPaymentByLoan[loans[0].id] || !(effects.method3 && typeof effects.method3.paymentChange === 'number') ? '--' : 
                                    ((effects.method3.paymentChange as number) === 0 ? '0元' :
                                      ((effects.method3.paymentChange as number) < 0 ? '-' : '+') + 
                                      Math.abs(effects.method3.paymentChange as number).toLocaleString('zh-CN', { maximumFractionDigits: 0 }) + '元')}
                                </div>
                              </div>
                            </div>
                         </div>
                       );
                     })()}

                   </div>
                </div>
               );
             })()}
             
             {/* 现金流提醒模块 */}
             <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                   <h5 className="text-sm font-semibold text-orange-800 mb-2">温馨提示</h5>
                    <p className="text-sm text-orange-700 mb-3">
                      提前还款是重大决策，不能看单笔情况，要做全面债务梳理，建议您按照以下步骤操作，步骤1：全面债务梳理；步骤2：偿债能力测评；步骤3：提前还款可行性测评；
                    </p>
                     <div className="flex justify-center mt-4">
                       <Button
                         variant="outline"
                         className="text-orange-700 border-orange-300 hover:bg-orange-100 h-10 px-6 text-base font-medium w-full flex items-center justify-center"
                         onClick={() => {
                           navigate('/');
                         }}
                       >
                         全面梳理债务，测评偿债能力
                         <ChevronRight className="h-4 w-4 ml-2" />
                       </Button>
                     </div>
                 </div>
               </div>
             </div>
             
             {/* 对比投资收益模块 */}
             {renderInvestmentComparison(loans[0].id)}
          </div>
        </div>
      )}


      {/* 贷款概要模态框 */}
      {loans.length > 0 && (
        <PrepaymentSummaryModal
          isOpen={showPrepaymentSummary}
          onClose={() => setShowPrepaymentSummary(false)}
          loan={loans[0]}
          calculateCommercialMonthlyPayment={calculateCommercialMonthlyPayment}
          calculateProvidentMonthlyPayment={calculateProvidentMonthlyPayment}
          calculateCommercialLoanStats={calculateCommercialLoanStats}
          calculateProvidentLoanStats={calculateProvidentLoanStats}
          calculateLoanStats={calculateLoanStats}
        />
      )}
    </>
  );
};