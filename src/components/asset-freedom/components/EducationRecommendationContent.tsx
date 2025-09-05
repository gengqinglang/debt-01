import React from 'react';
import { EducationExpenditureChart } from './EducationExpenditureChart';

export const EducationRecommendationContent: React.FC = () => {
  return (
    <EducationExpenditureChart 
      childName="老大"
      startAge={3}
      endAge={28}
    />
  );
};