import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, TrendingUp, PiggyBank, CreditCard, Check } from 'lucide-react';
import FinancialConfigurationFlow from '@/components/financial-status-fs/FinancialConfigurationFlow';

// 财务配置类型定义（移除信用卡类型）
export interface DebtInfo {
  id: string;
  type: 'mortgage' | 'carLoan' | 'consumerLoan' | 'businessLoan' | 'privateLoan' | 'creditCard';
  name: string;
  amount: number;
  count?: number; // 新增：债务笔数，主要用于房贷等可能包含多笔的债务类型
  monthlyPayment: number;
  remainingMonths?: number;
  remainingInterest?: number; // 新增：待还利息（万元）
  interestRate?: number;
  // 房贷特有字段
  loanType?: 'commercial' | 'housingFund' | 'combination';
  commercialAmount?: number;
  commercialRate?: number;
  housingFundAmount?: number;
  housingFundRate?: number;
  principal?: number;
  term?: number;
  repaymentMethod?: string;
  // 车贷特有字段
  isInstallment?: boolean; // 是否分期还款
  installmentAmount?: number; // 每期还款额
  remainingInstallments?: number; // 还剩多少期
  vehicleName?: string; // 车辆名称
  carLoanType?: 'installment' | 'bankLoan'; // 贷款类型
  carPrincipal?: number; // 银行贷款本金
  carTerm?: number; // 银行贷款期限
  carInterestRate?: number; // 银行贷款利率
  carStartDate?: Date; // 银行贷款开始时间
}

const FinancialStatusPage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 财务配置状态
  const [debts, setDebts] = useState<DebtInfo[]>([]);
  const [configConfirmed, setConfigConfirmed] = useState<{[key: string]: boolean}>({});
  
  // 实时数据状态（用于显示未确认但已填写的数据）
  const [liveData, setLiveData] = useState<{[key: string]: any}>({});

  // 初始化时从localStorage加载数据
  useEffect(() => {
    try {
      // 检查是否从债务分析页返回
      const isReturning = sessionStorage.getItem('fs_returning_expected');
      
      // 加载已确认的债务数据
      const savedDebts = localStorage.getItem('confirmed_debts');
      if (savedDebts) {
        const parsedDebts = JSON.parse(savedDebts);
        setDebts(parsedDebts);
        
        // Auto-confirm categories that have data
        const derivedConfirmed: {[key: string]: boolean} = {};
        debtCategories.forEach(category => {
          const categoryData = parsedDebts.find((debt: any) => debt.type === category.id);
          if (categoryData) {
            // Check if category has meaningful data
            const hasData = category.id === 'mortgage' || category.id === 'carLoan' 
              ? (categoryData.count && categoryData.count > 0)
              : (categoryData.amount && categoryData.amount > 0);
            
            derivedConfirmed[category.id] = hasData;
          } else {
            derivedConfirmed[category.id] = false;
          }
        });
        
        // Merge with saved confirmation states if returning (prioritize true values)
        let finalConfirmed = derivedConfirmed;
        if (isReturning) {
          const savedConfigConfirmed = sessionStorage.getItem('fs_config_confirmed');
          if (savedConfigConfirmed) {
            try {
              const parsedConfirmed = JSON.parse(savedConfigConfirmed);
              finalConfirmed = {};
              debtCategories.forEach(category => {
                finalConfirmed[category.id] = derivedConfirmed[category.id] || parsedConfirmed[category.id] || false;
              });
            } catch (error) {
              console.error('Error parsing saved config confirmed:', error);
            }
          }
          
          // Clear the returning flag after restoration
          sessionStorage.removeItem('fs_returning_expected');
          sessionStorage.removeItem('fs_config_confirmed');
        }
        
        setConfigConfirmed(finalConfirmed);
      }
    } catch (error) {
      console.error('Error loading saved debt data:', error);
    }
  }, []);

  // 定义债务配置顺序
  const debtCategories = [
    { id: 'mortgage', name: '房贷', type: 'mortgage' as const },
    { id: 'carLoan', name: '车贷', type: 'carLoan' as const },
    { id: 'consumerLoan', name: '消费贷', type: 'consumerLoan' as const },
    { id: 'businessLoan', name: '经营贷', type: 'businessLoan' as const },
    { id: 'privateLoan', name: '民间贷', type: 'privateLoan' as const },
    { id: 'creditCard', name: '信用卡', type: 'creditCard' as const }
  ];

  const currentCategory = debtCategories[currentIndex];

  // 计算债务汇总（优先使用实时数据）
  const calculateTotalDebt = () => {
    const confirmedDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
    const mortgageLiveData = liveData['mortgage'];
    if (mortgageLiveData && !configConfirmed['mortgage']) {
      return confirmedDebt + mortgageLiveData.remainingPrincipal;
    }
    return confirmedDebt;
  };

  // 计算债务笔数（仅使用已确认的债务数据）
  const calculateDebtCount = () => {
    let totalCount = 0;
    
    // 遍历所有债务类型
    debtCategories.forEach(category => {
      if (configConfirmed[category.id]) {
        // 已确认的债务，从debts数组中获取数据
        const debt = debts.find(d => d.type === category.id);
        if (debt) {
          if (category.id === 'mortgage' || category.id === 'carLoan') {
            // 房贷和车贷使用count字段（表示贷款笔数）
            totalCount += debt.count || 0;
          } else {
            // 其他债务类型按金额判断
            totalCount += debt.amount > 0 ? 1 : 0;
          }
        }
      }
      // 移除未确认债务的实时数据计算 - 只显示已确认的债务
    });
    
    return totalCount;
  };

  // 计算剩余本金（仅统计当前会话已确认的债务）
  const calculateRemainingPrincipal = () => {
    // 单位统一为"万"
    let totalPrincipalWan = debts.reduce((sum, debt) => {
      // 只计算当前会话已确认的债务
      if (!configConfirmed[debt.type]) return sum;
      
      const val = Number(debt.amount) || 0;
      return sum + val;
    }, 0);
    
    return totalPrincipalWan;
  };

  // 计算待还利息（仅统计当前会话已确认的债务）
  const calculateRemainingInterest = () => {
    // 单位统一为"万"
    let totalInterestWan = debts.reduce((sum, debt) => {
      // 只计算当前会话已确认的债务
      if (!configConfirmed[debt.type]) return sum;
      
      // 优先使用 debt.remainingInterest 字段（已经是万元单位）
      if (debt.remainingInterest !== undefined && debt.remainingInterest !== null) {
        return sum + debt.remainingInterest;
      }
      
      // 回退到原有算法
      const monthly = Number((debt as any).monthlyPayment) || 0;
      const months = Number((debt as any).remainingMonths) || 0;
      const principalWan = Number(debt.amount) || 0;
      if (monthly > 0 && months > 0 && principalWan >= 0) {
        const totalPaymentsWan = (monthly * months) / 10000;
        const interestWan = Math.max(0, totalPaymentsWan - principalWan);
        return sum + interestWan;
      }
      return sum;
    }, 0);
    
    return totalInterestWan;
  };

  
  // 处理实时数据变化
  const handleDataChange = (categoryId: string, data: any) => {
    setLiveData(prev => ({
      ...prev,
      [categoryId]: data
    }));
  };

  // 处理配置确认
  const handleConfigConfirm = (categoryId: string, data: any) => {
    // 负债配置
    const existingDebtIndex = debts.findIndex(debt => debt.type === categoryId);
    let updatedDebts;
    if (existingDebtIndex >= 0) {
      updatedDebts = [...debts];
      updatedDebts[existingDebtIndex] = { ...updatedDebts[existingDebtIndex], ...data };
      setDebts(updatedDebts);
    } else {
      updatedDebts = [...debts, { id: Date.now().toString(), type: categoryId as any, ...data }];
      setDebts(updatedDebts);
    }

    const updatedConfigConfirmed = {
      ...configConfirmed,
      [categoryId]: true
    };
    setConfigConfirmed(updatedConfigConfirmed);

    // 立即持久化已确认的债务数据
    const confirmedDebts = updatedDebts.filter(debt => updatedConfigConfirmed[debt.type]);
    localStorage.setItem('confirmed_debts', JSON.stringify(confirmedDebts));
    console.log('Saving confirmed_debts to localStorage immediately:', confirmedDebts);

    // 完成当前配置后不自动跳转，由用户通过上方类型选择切换
    // 保留数据与确认状态，不改变 currentIndex
  };

  // 返回上一步
  const goToPreviousStep = () => {
    if (currentIndex > 0) {
      // 返回到前一个配置项
      const previousIndex = currentIndex - 1;
      const previousCategoryId = debtCategories[previousIndex].id;
      setCurrentIndex(previousIndex);
      // 取消前一个配置的确认状态，允许重新编辑
      setConfigConfirmed({
        ...configConfirmed,
        [previousCategoryId]: false
      });
    } else {
      // 返回上一页
      navigate(-1);
    }
  };

  // 跳过当前配置
  const skipCurrentConfig = () => {
    setConfigConfirmed({
      ...configConfirmed,
      [currentCategory.id]: true
    });

    if (currentIndex < debtCategories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      goToNext();
    }
  };

  const [showSuccess, setShowSuccess] = useState(false);

  const goToNext = () => {
    // 保存确认的债务数据到localStorage，包含详细贷款数据（按确认状态，而不是按金额过滤）
    const confirmedDebts = debts.filter(debt => configConfirmed[debt.type]);
    localStorage.setItem('confirmed_debts', JSON.stringify(confirmedDebts));

    console.log('Saving confirmed_debts to localStorage (by confirmed flag):', confirmedDebts);

    // 保存返回标记和确认状态到sessionStorage
    sessionStorage.setItem('fs_returning_expected', 'true');
    sessionStorage.setItem('fs_config_confirmed', JSON.stringify(configConfirmed));

    // 跳转到债务分析页面
    navigate('/debt-analysis');
  };

  // 格式化金额显示 - 大于10万不显示小数，小于等于10万显示2位小数
  const formatAmount = (amount: number) => {
    if (amount > 10) {
      return Math.round(amount).toLocaleString();
    } else {
      return amount.toFixed(2);
    }
  };

  const getCurrentData = () => {
    return debts.find(debt => debt.type === currentCategory.id);
  };

  return (
    <div className="min-h-screen bg-[#F4FDFD] flex flex-col">
      <div className="relative flex flex-col bg-white/90 backdrop-blur-xl flex-1">
        {/* 标题区域 */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#B3EBEF]/20 via-white/60 to-[#B3EBEF]/20 -mx-2">
            <div className="relative py-6 text-center flex flex-col justify-center" style={{ minHeight: '80px' }}>
              {/* 返回按钮 */}
              <Button
                onClick={() => window.location.href = 'https://gengqinglang.github.io/financial-tools-homepage/'}
                variant="ghost"
                size="sm"
                className="absolute left-4 top-6 p-2 hover:bg-gray-100/50 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">家庭债务梳理</h1>
              {/* 债务汇总卡片 - 移动到header内部 */}
            <div className="px-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gradient-to-br from-[#B3EBEF]/20 to-[#8FD8DC]/20 rounded-lg p-3 border border-[#B3EBEF]/30">
                <div className="text-lg font-bold text-gray-900 mb-1">{calculateDebtCount()}</div>
                <p className="text-xs text-gray-700">债务笔数</p>
              </div>
                <div className="bg-gradient-to-br from-[#B3EBEF]/20 to-[#8FD8DC]/20 rounded-lg p-3 border border-[#B3EBEF]/30">
                  <div className="text-lg font-bold text-gray-900 mb-1">{formatAmount(calculateRemainingPrincipal())}万</div>
                  <p className="text-xs text-gray-700">剩余本金</p>
                </div>
                <div className="bg-gradient-to-br from-[#B3EBEF]/20 to-[#8FD8DC]/20 rounded-lg p-3 border border-[#B3EBEF]/30">
                  <div className="text-lg font-bold text-gray-900 mb-1">{formatAmount(calculateRemainingInterest())}万</div>
                  <p className="text-xs text-gray-700">待还利息</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 贷款类型选择（两行网格布局） */}
        <div className="px-3 mt-3">
          <div className="grid grid-cols-3 gap-2">
            {debtCategories.map((cat, idx) => {
              const active = idx === currentIndex;
              
              // 改进hasData逻辑，特别处理房贷和车贷
              let hasData = false;
              if (configConfirmed[cat.id]) {
                // 已确认的情况才显示勾选框
                if (cat.id === 'mortgage' || cat.id === 'carLoan') {
                  const debt = debts.find(d => d.type === cat.id);
                  hasData = debt && (debt.count || 0) > 0;
                } else {
                  hasData = debts.some(debt => debt.type === cat.id && debt.amount > 0);
                }
              }
              // 未确认状态下不显示勾选框，必须点击确认按钮后才显示
              
              return (
                <button
                  key={cat.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={
                    `relative flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all ` +
                    (active
                      ? 'bg-[#B3EBEF]/30 border-[#8FD8DC] text-gray-900 shadow'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50')
                  }
                  aria-pressed={active}
                >
                  {cat.name}
                  {hasData && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#01BCD6' }}>
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 配置流程 */}
        <FinancialConfigurationFlow
          currentStep={1}
          currentIndex={currentIndex}
          currentCategory={currentCategory}
          allCategories={debtCategories}
          configConfirmed={configConfirmed}
          onConfigConfirm={handleConfigConfirm}
          onDataChange={handleDataChange}
          onSkip={skipCurrentConfig}
          existingData={getCurrentData()}
        />

        {/* 底部导航 */}
        <div className="fixed bottom-0 left-0 right-0 z-50 py-1 space-y-3 bg-gradient-to-t from-white via-white/95 to-white/90 backdrop-blur-xl border-t border-gray-100 pb-safe" 
             style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
          <div className="flex gap-2">
            <Button 
              onClick={goToNext}
              className="flex-1 py-3 text-gray-900 font-bold rounded-xl text-sm shadow-xl transform hover:scale-[1.02] transition-all duration-300 border-0 bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] hover:from-[#A0E2E6] hover:to-[#7BC9CE] flex items-center justify-center text-ellipsis overflow-hidden"
            >
              <span className="flex items-center justify-center gap-2">
                {showSuccess ? '保存成功！' : '所有债务录入完毕，查看债务分析'}
                {!showSuccess && <ArrowRight className="w-3 h-3" />}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialStatusPage;