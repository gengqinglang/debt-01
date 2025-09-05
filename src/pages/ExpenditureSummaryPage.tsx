
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, RotateCcw } from 'lucide-react';
import ExpenditureDisplay from '@/components/expenditure-summary/ExpenditureDisplay';

const ExpenditureSummaryPage = () => {
  const navigate = useNavigate();

  const goToConstraints = () => {
    navigate('/constraints');
  };

  const restartPlanning = () => {
    localStorage.removeItem('requiredLifeData');
    localStorage.removeItem('optionalLifeData');
    navigate('/optional-life');
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-[#F8FDF8] relative">
      <div className="relative min-h-screen flex flex-col bg-white/90 backdrop-blur-xl">
        {/* 支出展示组件 */}
        <div className="flex-1">
          <ExpenditureDisplay />
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
              重新设定
            </Button>
            
            <Button 
              onClick={goToConstraints}
              className="flex-1 py-3 text-gray-900 font-bold rounded-2xl text-sm shadow-xl transform hover:scale-[1.02] transition-all duration-300 border-0 bg-gradient-to-r from-[#CCE9B5] to-[#B8E0A1] hover:from-[#BBE3A8] hover:to-[#A5D094]"
            >
              确认，下一步
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenditureSummaryPage;
