import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DebtAnalysisModule from '@/components/baogao/DebtAnalysisModule';
import InsightsAdviceModule from '@/components/baogao/InsightsAdviceModule';
import DebtCapacityLoadingScreen from '@/components/baogao/DebtCapacityLoadingScreen';
import MortgageToolsSection from '@/components/baogao/MortgageToolsSection';

const BaogaoPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if navigated from rongzijuece or income-summary page
  const fromRongzijuece = location.state?.fromRongzijuece;
  const fromIncomeSummary = location.state?.fromIncomeSummary;
  
  useEffect(() => {
    if (fromRongzijuece || fromIncomeSummary) {
      setIsLoading(true);
      // Simulate loading for 2.5 seconds
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [fromRongzijuece, fromIncomeSummary]);

  if (isLoading) {
    return <DebtCapacityLoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-0 py-4 max-w-md">
        <div className="space-y-8">
          {/* 偿债能力分析模块 */}
          <DebtAnalysisModule />
          
          {/* 洞察建议模块 */}
          <InsightsAdviceModule />
          
          {/* 房贷工具模块 */}
          <MortgageToolsSection />
        </div>
      </div>
    </div>
  );
};

export default BaogaoPage;