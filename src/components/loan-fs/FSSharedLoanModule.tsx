import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calculator, TrendingUp, Percent, BarChart3, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

import { useLoanData, LoanInfo } from '@/hooks/useLoanData';
import { LoanFormCard } from '../loan/LoanFormCard';

interface FSSharedLoanModuleProps {
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
  // 新增：外部数据初始化
  existingData?: LoanInfo[];
}

export const FSSharedLoanModule: React.FC<FSSharedLoanModuleProps> = ({
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
  persist = false, // FS version defaults to false
  existingData
}) => {
  const { loans, updateLoan, addLoan, removeLoan, setLoans } = useLoanData({ persist });
  const { toast } = useToast();
  
  // 初始化外部数据
  useEffect(() => {
    if (existingData && existingData.length > 0) {
      setLoans(existingData);
    } else if (loans.length === 0) {
      addLoan();
    }
  }, [existingData]);
  
  // 确保至少有一笔贷款（初始状态）
  useEffect(() => {
    if (!existingData && loans.length === 0) {
      addLoan();
    }
  }, [loans.length, addLoan, existingData]);
  
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

  return (
    <>
      {/* 贷款列表 */}
      {loans.map((loan, index) => (
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

      {/* FS版本的按钮区域 - 左侧"再录一笔" + 右侧确认按钮 */}
      <div className="grid grid-cols-2 gap-3 mt-6 mb-3">
        {/* 左侧：再录一笔（虚线边框，青色） */}
        <Button
          onClick={addLoan}
          variant="outline"
          className="h-12 border-dashed"
          style={{ borderColor: '#01BCD6', color: '#01BCD6' }}
        >
          <Plus className="w-4 h-4 mr-2" />
          再录一笔
        </Button>

        {/* 右侧：确认房贷信息（传入的children） */}
        <div className="w-full">
          {children}
        </div>
      </div>
    </>
  );
};