import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Coins } from 'lucide-react';
import CareerSummaryStats from '@/components/career/CareerSummaryStats';
import CareerPlanTabs from '@/components/career/CareerPlanTabs';
import { CareerDataProvider, useCareerData } from '@/components/career/CareerDataProvider';
import { CareerEditingProvider } from '@/components/career/CareerEditingProvider';
import MobileHint from '@/components/ui/mobile-hint';

const CareerPlanCoachContent = () => {
  const navigate = useNavigate();
  const { 
    personalTotalIncome, 
    partnerTotalIncome, 
    combinedTotalIncome, 
    formatToWan,
    personalWorkStatus,
    partnerWorkStatus,
    currentJob,
    jobLevel,
    partnerJob,
    partnerLevel,
    personalCurrentIncome,
    personalCareerOutlook,
    partnerCurrentIncome,
    partnerCareerOutlook
  } = useCareerData();

  const goToNext = () => {
    navigate('/future-income');
  };

  // 返回按钮功能
  const handleBack = () => {
    navigate(-1);
  };

  // Debug输出 ...
  console.log('Debug - personalWorkStatus:', personalWorkStatus);
  console.log('Debug - partnerWorkStatus:', partnerWorkStatus);
  console.log('Debug - currentJob:', currentJob);
  console.log('Debug - jobLevel:', jobLevel);
  console.log('Debug - partnerJob:', partnerJob);
  console.log('Debug - partnerLevel:', partnerLevel);
  console.log('Debug - personalCurrentIncome:', personalCurrentIncome);
  console.log('Debug - personalCareerOutlook:', personalCareerOutlook);
  console.log('Debug - partnerCurrentIncome:', partnerCurrentIncome);
  console.log('Debug - partnerCareerOutlook:', partnerCareerOutlook);

  // Updated button validation logic to include new fields
  const getButtonStatus = () => {
    const personalIncomplete = personalWorkStatus === 'working' && (!currentJob || !jobLevel || !personalCurrentIncome || !personalCareerOutlook);
    const partnerIncomplete = partnerWorkStatus === 'working' && (!partnerJob || !partnerLevel || !partnerCurrentIncome || !partnerCareerOutlook);
    
    let hintMessage = '';
    if (personalIncomplete && partnerIncomplete) {
      hintMessage = '请完善本人和伴侣的职业信息（职业、职级、当前年收入、未来职业发展水平都需要填写）';
    } else if (personalIncomplete) {
      hintMessage = '请完善本人的职业信息（职业、职级、当前年收入、未来职业发展水平都需要填写）';
    } else if (partnerIncomplete) {
      hintMessage = '请完善伴侣的职业信息（职业、职级、当前年收入、未来职业发展水平都需要填写）';
    }
    
    const isDisabled = personalIncomplete || partnerIncomplete;
    
    console.log('Debug - personalIncomplete:', personalIncomplete);
    console.log('Debug - partnerIncomplete:', partnerIncomplete);
    console.log('Debug - isButtonDisabled result:', isDisabled);
    
    return { isDisabled, hintMessage };
  };

  const { isDisabled, hintMessage } = getButtonStatus();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative h-full flex flex-col min-h-screen bg-white">
        {/* Header，左上角增加返回按钮 */}
        <div className="bg-[#CCE9B5] p-3 text-white relative overflow-hidden">
          {/* 返回按钮和标题区域 */}
          <div className="flex items-center mb-2 relative z-10">
            <Button
              variant="ghost"
              size="icon"
              className="mr-1 text-gray-700"
              onClick={handleBack}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center mr-2">
              <Coins className="w-4 h-4 text-gray-700" />
            </div>
            <h1 className="text-lg font-bold text-gray-800">职业收入预测</h1>
          </div>
          <p className="text-sm text-center text-gray-700 relative z-10">
            规划职业发展轨迹，预测未来收入潜力
          </p>
        </div>

        {/* Summary Stats */}
        <CareerSummaryStats
          personalTotalIncome={personalTotalIncome}
          partnerTotalIncome={partnerTotalIncome}
          combinedTotalIncome={combinedTotalIncome}
          personalProgressiveIncome={0}
          partnerProgressiveIncome={0}
          combinedProgressiveIncome={0}
          personalCompleteness={100}
          partnerCompleteness={100}
          formatToWan={formatToWan}
        />

        <div className="flex-1 overflow-visible pb-20">
          <div className="p-3">
            <CareerEditingProvider>
              <CareerPlanTabs />
            </CareerEditingProvider>
          </div>
        </div>

        <div className="p-3 pt-0">
          {isDisabled && hintMessage && (
            <div className="mb-3">
              <MobileHint 
                message={hintMessage}
                variant="warning"
              />
            </div>
          )}
          
          <Button 
            onClick={goToNext} 
            disabled={isDisabled}
            className="w-full py-3 bg-[#CCE9B5] hover:bg-[#B3EBEF] text-gray-800 font-bold rounded-xl text-sm shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#CCE9B5]"
          >
            确认规划并继续
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const CareerPlanCoachPage = () => {
  return (
    <CareerDataProvider>
      <CareerPlanCoachContent />
    </CareerDataProvider>
  );
};

export default CareerPlanCoachPage;
