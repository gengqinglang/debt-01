import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, RotateCcw } from 'lucide-react';
import IncomeSummaryDisplay from '@/components/income-summary/IncomeSummaryDisplay';

const IncomeSummaryPage = () => {
  const navigate = useNavigate();

  const goToNextStep = () => {
    navigate('/baogao', { state: { fromIncomeSummary: true } });
  };

  const restartPlanning = () => {
    localStorage.removeItem('futureIncomeData');
    navigate('/future-income');
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-[#F8FDF8] relative">
      <div className="relative min-h-screen flex flex-col bg-white/90 backdrop-blur-xl">
        {/* 收入展示组件 */}
        <div className="flex-1">
          <IncomeSummaryDisplay />
        </div>

        {/* 底部按钮 - 固定在底部但允许滚动访问 */}
        <div className="sticky bottom-0 flex-shrink-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
          <div className="flex gap-3">
            <Button 
              onClick={restartPlanning}
              className="flex-1 py-3 text-gray-700 font-bold rounded-2xl text-sm shadow-lg transform hover:scale-[1.02] transition-all duration-300 border border-gray-300 bg-white hover:bg-gray-50"
              variant="outline"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              重新规划
            </Button>
            
            <Button 
              onClick={goToNextStep}
              className="flex-1 py-3 text-gray-900 font-bold rounded-2xl text-sm shadow-xl transform hover:scale-[1.02] transition-all duration-300 border-0 bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] hover:from-[#A0E2E6] hover:to-[#7BC9CE]"
            >
              确认
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeSummaryPage;