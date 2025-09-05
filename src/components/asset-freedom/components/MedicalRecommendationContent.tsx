
import React, { useState } from 'react';
import { ExpenditureComparisonChart, ExpenditureData } from './ExpenditureComparisonChart';
import { ExpenditureDetailModal } from './ExpenditureDetailModal';

export const MedicalRecommendationContent: React.FC = () => {
  const [selectedData, setSelectedData] = useState<ExpenditureData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 生成医疗支出数据（30-85岁）
  const generateMedicalData = (): ExpenditureData[] => {
    const data: ExpenditureData[] = [];
    
    for (let age = 30; age <= 85; age++) {
      let originalAmount = 3000; // 基础月支出
      let adjustedAmount = 2400; // 调整后月支出
      let familyMembers = 2; // 基础家庭人口
      
      // 根据年龄段调整数据，医疗支出随年龄增加
      if (age >= 30 && age <= 34) {
        originalAmount = 3000;
        adjustedAmount = 2400;
        familyMembers = 2;
      } else if (age >= 40 && age <= 45) {
        originalAmount = 4000;
        adjustedAmount = 3000;
        familyMembers = 3;
      } else if (age >= 46 && age <= 55) {
        originalAmount = 6000;
        adjustedAmount = 4500;
        familyMembers = 4;
      } else if (age >= 56 && age <= 65) {
        originalAmount = 8000;
        adjustedAmount = 6000;
        familyMembers = 3;
      } else if (age >= 66) {
        originalAmount = 12000;
        adjustedAmount = 9000;
        familyMembers = 2;
      }
      
      data.push({
        age,
        originalAmount,
        adjustedAmount,
        familyMembers,
        totalFamilyExpenditure: adjustedAmount * familyMembers
      });
    }
    
    return data;
  };

  const chartData = generateMedicalData();

  const handlePointClick = (data: ExpenditureData) => {
    setSelectedData(data);
    setIsModalOpen(true);
  };

  return (
    <>
      <ExpenditureComparisonChart
        data={chartData}
        title="医疗支出对比"
        unit="元/月"
        onPointClick={handlePointClick}
      />
      
      <ExpenditureDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedData}
        title="医疗支出"
        unit="元/月"
      />
    </>
  );
};
