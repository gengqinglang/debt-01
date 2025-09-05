import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { SharedLoanModule } from '@/components/loan/SharedLoanModule';
import { LoanInfo } from '@/hooks/useLoanData';

const YanqiHuankuanPage: React.FC = () => {
  const navigate = useNavigate();

  // 利率常量
  const currentLPR_5Year = 4.2;
  const currentLPR_5YearPlus = 4.45;

  // 房贷计算相关函数（简化实现）
  const calculateLoanStats = (loan: LoanInfo) => null;
  const isLoanComplete = (loan: LoanInfo) => {
    return !!(loan.propertyName && loan.loanType && loan.loanAmount);
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
          className="ml-1"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">延期还款测算工具</h1>
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

      {/* 下半部分：延期还款特有内容 */}
      <div className="mt-8 p-4">
        <p className="text-gray-600 text-center">延期还款专属功能区域</p>
      </div>
    </div>
  );
};

export default YanqiHuankuanPage;