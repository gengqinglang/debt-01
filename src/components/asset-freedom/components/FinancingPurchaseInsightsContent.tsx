import React from 'react';
import { MainRiskDescription } from './MainRiskDescription';
import { FinancingPurchaseAdjustmentSuggestions } from './FinancingPurchaseAdjustmentSuggestions';

interface FinancingPurchaseInsightsContentProps {
  onViewAssessmentBasis: () => void;
  onRestartSnapshot: () => void;
}

export const FinancingPurchaseInsightsContent: React.FC<FinancingPurchaseInsightsContentProps> = ({
  onViewAssessmentBasis,
  onRestartSnapshot
}) => {
  return (
    <>
      {/* 详细风险内容 */}
      <MainRiskDescription
        onViewAssessmentBasis={onViewAssessmentBasis}
      />
      <FinancingPurchaseAdjustmentSuggestions
        onRestartSnapshot={onRestartSnapshot}
      />
    </>
  );
};