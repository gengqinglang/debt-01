import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Coins, ArrowLeft, Check } from 'lucide-react';
import CareerSummaryStats from '@/components/career/CareerSummaryStats';
import CareerPlanTabs from '@/components/career/CareerPlanTabs';
import { useCareerData } from '@/components/career/SimplifiedCareerDataProvider';
import { SimplifiedCareerDataProvider } from '@/components/career/SimplifiedCareerDataProvider';
import { CareerEditingProvider } from '@/components/career/CareerEditingProvider';
import MobileHint from '@/components/ui/mobile-hint';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const AICareerPlanningPageContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const { 
    personalTotalIncome, 
    partnerTotalIncome, 
    combinedTotalIncome, 
    formatToWan,
    personalCurrentStatus,
    partnerCurrentStatus,
    personalCareerStages,
    partnerCareerStages,
    personalRetirementIncome,
    partnerRetirementIncome
  } = useCareerData();

  const goToNext = () => {
    // 显示成功弹窗而不是直接跳转
    setShowSuccessDialog(true);
  };

  const handleContinueAdjusting = () => {
    setShowSuccessDialog(false);
    // 关闭弹窗，继续在当前页面调整
  };

  const handleViewWealthType = () => {
    setShowSuccessDialog(false);
    // 跳转到发现页面
    navigate('/new', {
      state: {
        activeTab: 'discover'
      }
    });
  };

  const goBack = () => {
    // 检查是否有返回状态信息
    const state = location.state as any;
    if (state?.returnTo && state?.activeTab) {
      navigate(state.returnTo, {
        state: {
          activeTab: state.activeTab,
          activePlanningTab: state.activePlanningTab
        }
      });
    } else {
      // 默认返回到风险详情页面（保持原有逻辑）
      navigate('/risk-detail/layoff-salary-cut');
    }
  };

  // Debug: 添加console.log来检查状态值
  console.log('Debug - personalCurrentStatus:', personalCurrentStatus);
  console.log('Debug - partnerCurrentStatus:', partnerCurrentStatus);
  console.log('Debug - personalCareerStages:', personalCareerStages);
  console.log('Debug - partnerCareerStages:', partnerCareerStages);

  // Updated button validation logic for simplified work status system
  const getButtonStatus = () => {
    // Helper function to check if a value is truly filled
    const isValidValue = (value: any): boolean => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string') return value.trim().length > 0;
      if (typeof value === 'number') return !isNaN(value) && value > 0;
      return Boolean(value);
    };

    // Personal validation
    let personalIncomplete = false;
    let personalMissingFields: string[] = [];
    
    if (personalCurrentStatus === 'not-retired') {
      // For not-retired status, check career stages
      if (personalCareerStages.length === 0) {
        personalIncomplete = true;
        personalMissingFields.push('职业规划阶段');
      } else {
        // Check if all stages are complete
        const incompleteStages = personalCareerStages.filter(stage => 
          !stage.stageName || !stage.annualIncome || stage.annualIncome <= 0 || !stage.startYear || !stage.endYear
        );
        if (incompleteStages.length > 0) {
          personalIncomplete = true;
          personalMissingFields.push('职业规划阶段信息');
        }
      }
    } else if (personalCurrentStatus === 'retired') {
      if (!isValidValue(personalRetirementIncome)) {
        personalIncomplete = true;
        personalMissingFields.push('退休收入');
      }
    }
    
    // Partner validation
    let partnerIncomplete = false;
    let partnerMissingFields: string[] = [];
    
    if (partnerCurrentStatus === 'not-retired') {
      // For not-retired status, check career stages
      if (partnerCareerStages.length === 0) {
        partnerIncomplete = true;
        partnerMissingFields.push('职业规划阶段');
      } else {
        // Check if all stages are complete
        const incompleteStages = partnerCareerStages.filter(stage => 
          !stage.stageName || !stage.annualIncome || stage.annualIncome <= 0 || !stage.startYear || !stage.endYear
        );
        if (incompleteStages.length > 0) {
          partnerIncomplete = true;
          partnerMissingFields.push('职业规划阶段信息');
        }
      }
    } else if (partnerCurrentStatus === 'retired') {
      if (!isValidValue(partnerRetirementIncome)) {
        partnerIncomplete = true;
        partnerMissingFields.push('退休收入');
      }
    }
    
    // Generate detailed hint message
    let hintMessage = '';
    if (personalIncomplete && partnerIncomplete) {
      hintMessage = `请完善本人和伴侣的信息。本人缺少：${personalMissingFields.join('、')}；伴侣缺少：${partnerMissingFields.join('、')}`;
    } else if (personalIncomplete) {
      hintMessage = `请完善本人的信息：${personalMissingFields.join('、')}`;
    } else if (partnerIncomplete) {
      hintMessage = `请完善伴侣的信息：${partnerMissingFields.join('、')}`;
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
        {/* Header */}
        <div className="bg-[#CCE9B5] p-3 text-white relative overflow-hidden">
          {/* Back button */}
          <div className="absolute left-3 top-3 z-20">
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className="p-2 h-auto text-gray-700 hover:text-gray-900 hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-center mb-2 relative z-10">
            <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center mr-2">
              <Coins className="w-4 h-4 text-gray-700" />
            </div>
            <h1 className="text-lg font-bold text-gray-800">AI职业规划</h1>
          </div>
          <p className="text-sm text-center text-gray-700 relative z-10">
            AI智能规划职业发展轨迹，预测未来收入潜力
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
              <CareerPlanTabs showPrediction={true} />
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

      {/* 成功弹窗 - 使用与修改支出科目一致的样式 */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900">
              配置更新成功！
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 leading-relaxed pt-2">
              您的职业规划收入已更新，这可能会影响您的财富分型和风险评估结果。建议查看最新的财富分型，了解调整后的财务状况变化。
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleContinueAdjusting}
              className="flex-1 rounded-full border-2 border-gray-300 hover:bg-gray-50"
            >
              暂不查看，继续调整
            </Button>
            <Button
              onClick={handleViewWealthType}
              className="flex-1 rounded-full bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] hover:bg-gradient-to-r hover:from-[#A5E0E4] hover:to-[#7DD3D7] text-gray-800 font-medium"
            >
              查看最新财富分型
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Wrapper component that provides the SimplifiedCareerDataProvider
const AICareerPlanningPage = () => {
  return (
    <SimplifiedCareerDataProvider>
      <AICareerPlanningPageContent />
    </SimplifiedCareerDataProvider>
  );
};

export default AICareerPlanningPage;
