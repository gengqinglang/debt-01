
import React, { useEffect, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { User, Heart, CheckCircle } from 'lucide-react';
import TwoTierCareerForm from './TwoTierCareerForm';
import CareerPredictionDisplay from './CareerPredictionDisplay';
import { useCareerData } from './SimplifiedCareerDataProvider';
import MobileHint from '@/components/ui/mobile-hint';

interface CareerPlanTabsProps {
  showPrediction?: boolean;
}

const CareerPlanTabs: React.FC<CareerPlanTabsProps> = ({ showPrediction = false }) => {
  const {
    currentJob,
    setCurrentJob,
    jobLevel,
    setJobLevel,
    partnerJob,
    setPartnerJob,
    partnerLevel,
    setPartnerLevel,
    personalCurrentStatus,
    setPersonalCurrentStatus,
    partnerCurrentStatus,
    setPartnerCurrentStatus,
    personalCareerStages,
    setPersonalCareerStages,
    partnerCareerStages,
    setPartnerCareerStages,
    personalCurrentIncome,
    setPersonalCurrentIncome,
    personalCareerOutlook,
    setPersonalCareerOutlook,
    partnerCurrentIncome,
    setPartnerCurrentIncome,
    partnerCareerOutlook,
    setPartnerCareerOutlook,
    personalStartWorkAge,
    setPersonalStartWorkAge,
    personalRetirementIncome,
    setPersonalRetirementIncome,
    personalRetirementAge,
    setPersonalRetirementAge,
    partnerStartWorkAge,
    setPartnerStartWorkAge,
    partnerRetirementIncome,
    setPartnerRetirementIncome,
    partnerRetirementAge,
    setPartnerRetirementAge
  } = useCareerData();

  const [openSections, setOpenSections] = useState<string[]>(["personal"]);

  // 检查个人信息是否完整
  const isPersonalComplete = () => {
    if (personalCurrentStatus === 'retired') {
      return personalRetirementIncome;
    }
    // For not-retired, check if they have career stages
    return personalCareerStages.length > 0 && personalCareerStages.every(stage => 
      stage.stageName && stage.annualIncome > 0 && stage.startYear && stage.endYear
    );
  };

  // 当个人信息完整时，自动展开伴侣部分
  useEffect(() => {
    if (isPersonalComplete() && !openSections.includes("partner")) {
      setOpenSections(prev => [...prev, "partner"]);
    }
  }, [personalCurrentStatus, personalCareerStages, personalRetirementIncome]);

  const handleAccordionChange = (value: string[]) => {
    setOpenSections(value);
  };

  return (
    <Accordion 
      type="multiple" 
      value={openSections} 
      onValueChange={handleAccordionChange}
      className="w-full space-y-4"
    >
      {/* 个人职业规划 */}
      <AccordionItem value="personal" className="border border-gray-200 rounded-lg">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" style={{ color: '#01BCD6' }} />
              <span className="font-medium text-lg">本人职业规划</span>
            </div>
            {isPersonalComplete() && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 space-y-3">
          <TwoTierCareerForm
            currentStatus={personalCurrentStatus}
            retirementIncome={personalRetirementIncome}
            onCurrentStatusChange={setPersonalCurrentStatus}
            onRetirementIncomeChange={setPersonalRetirementIncome}
            placeholder="请选择您的职业"
            levelPlaceholder="请选择您的职级"
            emptyStateTitle="职业收入预测"
            emptyStateDescription="请选择您的职业和职级"
            emptyStateHint="系统将自动为您预测未来职业生涯发展轨迹和收入情况"
            personType="personal"
            hasCareerPlan={false}
            careerStages={personalCareerStages}
            onCareerStagesChange={setPersonalCareerStages}
          />
          
          {/* 本人预计退休年龄 */}
          {personalCurrentStatus === 'not-retired' && (
            <div className="mt-4 space-y-2">
              <label htmlFor="personal-retirement-age" className="block text-sm font-medium text-gray-700">
                预计退休年龄
              </label>
              <div className="relative">
                <input
                  id="personal-retirement-age"
                  type="number"
                  placeholder="60"
                  value={personalRetirementAge || '60'}
                  onChange={(e) => {
                    const value = e.target.value;
                    const age = parseInt(value);
                    if (value === '' || (age >= 50 && age <= 80)) {
                      setPersonalRetirementAge(value);
                    }
                  }}
                  className="w-full px-3 py-2 border border-[#CAF4F7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#01BCD6] focus:border-[#01BCD6] text-sm"
                  min="50"
                  max="80"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                  岁
                </span>
              </div>
              <p className="text-xs text-gray-500">
                退休年龄范围：50-80岁，默认为60岁
              </p>
            </div>
          )}
          
          {/* 显示职业收入预测详细信息 */}
          {showPrediction && (
            <CareerPredictionDisplay personType="personal" />
          )}
        </AccordionContent>
      </AccordionItem>

      {/* 伴侣职业规划 */}
      <AccordionItem value="partner" className="border border-gray-200 rounded-lg">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" style={{ color: '#01BCD6' }} />
              <span className="font-medium text-lg">伴侣职业规划</span>
            </div>
            {!isPersonalComplete() && (
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                请先完成本人信息
              </span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 space-y-3">
          <MobileHint 
            message="鉴于您暂时无结婚伴侣，系统先假设您未来伴侣的收入水平和您本人一致，您可以修改。"
            variant="info"
            className="mb-4"
          />
          <TwoTierCareerForm
            currentStatus={partnerCurrentStatus}
            retirementIncome={partnerRetirementIncome}
            onCurrentStatusChange={setPartnerCurrentStatus}
            onRetirementIncomeChange={setPartnerRetirementIncome}
            placeholder="请选择伴侣的职业"
            levelPlaceholder="请选择伴侣的职级"
            emptyStateTitle="职业收入预测"
            emptyStateDescription="请选择伴侣的职业和职级"
            emptyStateHint="系统将自动为伴侣预测未来职业生涯发展轨迹和收入情况"
            personType="partner"
            hasCareerPlan={false}
            careerStages={partnerCareerStages}
            onCareerStagesChange={setPartnerCareerStages}
          />
          
          {/* 伴侣预计退休年龄 */}
          {partnerCurrentStatus === 'not-retired' && (
            <div className="mt-4 space-y-2">
              <label htmlFor="partner-retirement-age" className="block text-sm font-medium text-gray-700">
                预计退休年龄
              </label>
              <div className="relative">
                <input
                  id="partner-retirement-age"
                  type="number"
                  placeholder="60"
                  value={partnerRetirementAge || '60'}
                  onChange={(e) => {
                    const value = e.target.value;
                    const age = parseInt(value);
                    if (value === '' || (age >= 50 && age <= 80)) {
                      setPartnerRetirementAge(value);
                    }
                  }}
                  className="w-full px-3 py-2 border border-[#CAF4F7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#01BCD6] focus:border-[#01BCD6] text-sm"
                  min="50"
                  max="80"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                  岁
                </span>
              </div>
              <p className="text-xs text-gray-500">
                退休年龄范围：50-80岁，默认为60岁
              </p>
            </div>
          )}
          
          {/* 显示职业收入预测详细信息 */}
          {showPrediction && (
            <CareerPredictionDisplay personType="partner" />
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CareerPlanTabs;
