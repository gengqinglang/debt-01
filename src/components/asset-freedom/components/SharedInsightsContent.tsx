import React from 'react';
import { Info } from 'lucide-react';
import { MainRiskDescription } from './MainRiskDescription';
import { FourModuleAdjustmentSuggestions } from './FourModuleAdjustmentSuggestions';

interface SharedInsightsContentProps {
  onViewAssessmentBasis: () => void;
  onAcceptSuggestions: () => void;
  onRejectSuggestions: () => void;
  pageMode?: string;
}

export const SharedInsightsContent: React.FC<SharedInsightsContentProps> = ({
  onViewAssessmentBasis,
  onAcceptSuggestions,
  onRejectSuggestions,
  pageMode = 'member-severe-shortage'
}) => {
  return (
    <>
      {/* 详细风险内容 */}
      <MainRiskDescription
        onViewAssessmentBasis={onViewAssessmentBasis}
      />
      <FourModuleAdjustmentSuggestions
        onAcceptSuggestions={onAcceptSuggestions}
        onRejectSuggestions={onRejectSuggestions}
        pageMode={pageMode}
      />
    </>
  );
};