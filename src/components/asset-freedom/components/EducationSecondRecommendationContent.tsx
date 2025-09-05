import React from 'react';
import { EducationExpenditureChart } from './EducationExpenditureChart';

export const EducationSecondRecommendationContent: React.FC = () => {
  return (
    <EducationExpenditureChart 
      childName="老二"
      startAge={3}
      endAge={28}
    />
  );
};