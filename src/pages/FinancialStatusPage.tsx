import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, TrendingUp, PiggyBank, CreditCard, Check } from 'lucide-react';
import FinancialConfigurationFlow from '@/components/financial-status-fs/FinancialConfigurationFlow';
import { mockDebts, setMockDebts, clearMockDebts, isMockDebtsActive, getMockFormData } from '@/data/mockDebts';

// 财务配置类型定义（移除信用卡类型）
export interface DebtInfo {
  id: string;
  type: 'mortgage' | 'carLoan' | 'consumerLoan' | 'businessLoan' | 'privateLoan' | 'creditCard';
  name: string;
  amount: number;
  monthlyPayment: number;
  remainingMonths?: number;
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

  // 初始化模拟数据
  useEffect(() => {
    // 如果没有已确认的债务数据，使用模拟数据
    try {
      const existingDebts = localStorage.getItem('confirmed_debts');
      if (!existingDebts || JSON.parse(existingDebts).length === 0) {
        setMockDebts();
        setDebts(mockDebts);
      } else {
        setDebts(JSON.parse(existingDebts));
      }

      // 如果模拟数据处于激活状态，加载表单模拟数据
      if (isMockDebtsActive()) {
        let mockFormData = localStorage.getItem('mock_form_data');
        if (!mockFormData) {
          const formData = getMockFormData();
          localStorage.setItem('mock_form_data', JSON.stringify(formData));
          localStorage.setItem('shared_loan_data', JSON.stringify(formData.mortgage.loans));
          mockFormData = JSON.stringify(formData);
        }
        
        // 确保 shared_loan_data 存在
        const sharedLoanData = localStorage.getItem('shared_loan_data');
        if (!sharedLoanData) {
          const formData = JSON.parse(mockFormData);
          localStorage.setItem('shared_loan_data', JSON.stringify(formData.mortgage.loans));
        }
        
        setLiveData(JSON.parse(mockFormData));
      }
    } catch (error) {
      console.error('加载债务数据失败:', error);
      setMockDebts();
      setDebts(mockDebts);
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

  // 计算债务笔数（优先使用实时数据）
  const calculateDebtCount = () => {
    const confirmedCount = debts.filter(debt => debt.amount > 0).length;
    const mortgageLiveData = liveData['mortgage'];
    if (mortgageLiveData && mortgageLiveData.count > 0 && !configConfirmed['mortgage']) {
      return confirmedCount + mortgageLiveData.count;
    }
    return confirmedCount;
  };

  // 计算剩余本金（优先使用实时数据）
  const calculateRemainingPrincipal = () => {
    // 单位统一为“万”
    const confirmedPrincipalWan = debts.reduce((sum, debt) => {
      const val = Number(debt.amount) || 0;
      return sum + val;
    }, 0);
    const mortgageLiveData = liveData['mortgage'] || {} as any;
    const livePrincipalWan = Number(mortgageLiveData.remainingPrincipal) || 0;
    if ((mortgageLiveData as any).count > 0 && !configConfirmed['mortgage']) {
      return confirmedPrincipalWan + livePrincipalWan;
    }
    return confirmedPrincipalWan;
  };

  // 计算待还利息（优先使用实时数据）
  const calculateRemainingInterest = () => {
    // 单位统一为“万”
    const confirmedInterestWan = debts.reduce((sum, debt) => {
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
    
    const mortgageLiveData = liveData['mortgage'] || {} as any;
    const liveInterestWan = Number(mortgageLiveData.remainingInterest) || 0;
    if (mortgageLiveData.count > 0 && !configConfirmed['mortgage']) {
      return confirmedInterestWan + liveInterestWan;
    }
    return confirmedInterestWan;
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
    if (existingDebtIndex >= 0) {
      const updatedDebts = [...debts];
      updatedDebts[existingDebtIndex] = { ...updatedDebts[existingDebtIndex], ...data };
      setDebts(updatedDebts);
    } else {
      setDebts([...debts, { id: Date.now().toString(), type: categoryId as any, ...data }]);
    }

    setConfigConfirmed({
      ...configConfirmed,
      [categoryId]: true
    });

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

    // 跳转到债务分析页面
    navigate('/debt-analysis');
  };

  const getCurrentData = () => {
    // 优先使用实时数据（包含表单期望结构），再回退到已确认的汇总数据
    const live = liveData[currentCategory.id];
    if (live) return live;
    const existingDebt = debts.find(debt => debt.type === currentCategory.id);
    return existingDebt;
  };

  return (
    <div className="min-h-screen bg-[#F4FDFD] flex flex-col">
      <div className="relative flex flex-col bg-white/90 backdrop-blur-xl flex-1">
        {/* 标题区域 */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#B3EBEF]/20 via-white/60 to-[#B3EBEF]/20 -mx-2">
            <div className="relative py-6 text-center flex flex-col justify-center" style={{ minHeight: '80px' }}>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">家庭债务梳理</h1>
              {/* 债务汇总卡片 - 移动到header内部 */}
            <div className="px-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gradient-to-br from-[#B3EBEF]/20 to-[#8FD8DC]/20 rounded-lg p-3 border border-[#B3EBEF]/30">
                <div className="text-lg font-bold text-gray-900 mb-1">{calculateDebtCount()}</div>
                <p className="text-xs text-gray-700">债务笔数</p>
              </div>
                <div className="bg-gradient-to-br from-[#B3EBEF]/20 to-[#8FD8DC]/20 rounded-lg p-3 border border-[#B3EBEF]/30">
                  <div className="text-lg font-bold text-gray-900 mb-1">{Math.round(calculateRemainingPrincipal()).toLocaleString()}万</div>
                  <p className="text-xs text-gray-700">剩余本金</p>
                </div>
                <div className="bg-gradient-to-br from-[#B3EBEF]/20 to-[#8FD8DC]/20 rounded-lg p-3 border border-[#B3EBEF]/30">
                  <div className="text-lg font-bold text-gray-900 mb-1">{Math.round(calculateRemainingInterest()).toLocaleString()}万</div>
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
              const hasData = debts.some(debt => debt.type === cat.id && debt.amount > 0) || 
                             configConfirmed[cat.id];
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
              key={`${currentCategory.id}-${isMockDebtsActive()}-${Boolean(liveData[currentCategory.id])}`}
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
        <div className="fixed bottom-0 left-0 right-0 z-50 p-2 space-y-3 bg-gradient-to-t from-white via-white/95 to-white/90 backdrop-blur-xl border-t border-gray-100 pb-safe" 
             style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
          <div className="flex gap-2">
            <Button 
              onClick={goToNext}
              className="flex-1 py-2 text-gray-900 font-bold rounded-2xl text-xs shadow-xl transform hover:scale-[1.02] transition-all duration-300 border-0 bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] hover:from-[#A0E2E6] hover:to-[#7BC9CE]"
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