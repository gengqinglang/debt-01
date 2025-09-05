import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { SharedLoanModule } from '@/components/loan/SharedLoanModule';
import CommercialToProvidentConverter from '@/components/loan/CommercialToProvidentConverter';
import { LoanInfo } from '@/hooks/useLoanData';

// 暂时删除这个LoanFormCard，直接使用SharedLoanModule中的默认LoanFormCard

const ShangzhuangongPage = () => {
  const navigate = useNavigate();
  
  // LPR 利率常量（与TiqianHuankuanPage保持一致）
  const currentLPR_5Year = 4.2;
  const currentLPR_5YearPlus = 4.45;

  // 基础计算函数（简化版本）
  const calculateLoanStats = (loan: LoanInfo) => null;
  const isLoanComplete = (loan: LoanInfo) => {
    if (loan.loanType === 'combination') return false; // 暂不支持组合贷款
    return !!(loan.propertyName && loan.loanType && loan.loanStartDate && 
             loan.loanEndDate && loan.paymentMethod && loan.loanAmount);
  };
  const calculateMonthlyPayment = (loan: LoanInfo) => 0;
  const isCommercialLoanComplete = (loan: LoanInfo) => false;
  const isProvidentLoanComplete = (loan: LoanInfo) => false;
  const calculateCommercialMonthlyPayment = (loan: LoanInfo) => 0;
  const calculateProvidentMonthlyPayment = (loan: LoanInfo) => 0;
  const calculateCommercialLoanStats = (loan: LoanInfo) => null;
  const calculateProvidentLoanStats = (loan: LoanInfo) => null;

  return (
    <div>
      {/* 顶部导航栏 */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-10 py-2 flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/gongju')}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">商业贷款转公积金贷款测算工具</h1>
      </div>

      {/* 上半部分：房贷录入模块 */}
      <SharedLoanModule
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

      {/* 下半部分：商业贷款转公积金贷款测算 */}
      <div className="p-4">
        <CommercialToProvidentConverter />
      </div>
    </div>
  );
};

export default ShangzhuangongPage;