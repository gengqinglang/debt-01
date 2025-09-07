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
  persist = true // 修改默认值为true，确保数据持久化
}) => {
  const { loans, updateLoan, addLoan, removeLoan, resetLoan } = useLoanData({ persist });
  const { toast } = useToast();
  
  // 确保至少有一笔贷款（初始状态）
  useEffect(() => {
    if (loans.length === 0) {
      addLoan();
    }
  }, [loans.length, addLoan]);
  
  // 使用传入的LoanFormCard或默认的LoanFormCard
  const LoanCardComponent = CustomLoanFormCard || LoanFormCard;

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
            resetLoan={resetLoan}
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
          />
        </div>
      ))}

      {/* FS版本的按钮区域 - 左侧"再录一笔" + 右侧确认按钮 */}
      <div className="grid grid-cols-2 gap-3 mt-6 mb-3">
        {/* 左侧：再录一笔（虚线边框，青色） */}
        <Button
          onClick={addLoan}
          variant="outline"
          className="h-10 border-dashed text-sm"
          style={{ borderColor: '#01BCD6', color: '#01BCD6' }}
        >
          <Plus className="w-3 h-3 mr-2" />
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