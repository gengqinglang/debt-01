
import React from 'react';
import HousePlanSelector from '@/components/optional-life/HousePlanSelector';

interface HousingConfigProps {
  initialData?: {
    motives?: string[];
    amount?: number;
  };
  onHousingDataChange: (totalAmount: number, motives: string[]) => void;
  isFromPlanningTab?: boolean; // 新增：是否来自规划tab页
}

const HousingConfig: React.FC<HousingConfigProps> = ({
  initialData,
  onHousingDataChange,
  isFromPlanningTab = false
}) => {
  const handleHousingDataChange = (totalAmount: number, motives: string[]) => {
    console.log('HousingConfig: Received housing data:', { totalAmount, motives });
    onHousingDataChange(totalAmount, motives);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <HousePlanSelector 
        initialMotives={initialData?.motives}
        initialAmount={initialData?.amount}
        onHousingDataChange={handleHousingDataChange}
        isFromPlanningTab={isFromPlanningTab}
        isFromOptionalLife={!isFromPlanningTab}
      />
    </div>
  );
};

export default HousingConfig;
