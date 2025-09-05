
import React, { useState } from 'react';
import { ExpenditureComparisonChart, ExpenditureData } from './ExpenditureComparisonChart';
import { ExpenditureDetailModal } from './ExpenditureDetailModal';

export const TravelRecommendationContent: React.FC = () => {
  const [selectedData, setSelectedData] = useState<ExpenditureData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 生成旅行支出数据（30-85岁）
  const generateTravelData = (): ExpenditureData[] => {
    const data: ExpenditureData[] = [];
    
    for (let age = 30; age <= 85; age++) {
      let originalAmount = 50000; // 基础年支出
      let adjustedAmount = 40000; // 调整后年支出
      let familyMembers = 2; // 基础家庭人口
      
      // 根据年龄段调整数据
      if (age >= 30 && age <= 34) {
        originalAmount = 50000;
        adjustedAmount = 40000;
        familyMembers = 2;
      } else if (age >= 40 && age <= 45) {
        originalAmount = 60000;
        adjustedAmount = 45000;
        familyMembers = 3;
      } else if (age >= 46 && age <= 55) {
        originalAmount = 80000;
        adjustedAmount = 60000;
        familyMembers = 4;
      } else if (age >= 56 && age <= 65) {
        originalAmount = 70000;
        adjustedAmount = 52500;
        familyMembers = 3;
      } else if (age >= 66) {
        originalAmount = 40000;
        adjustedAmount = 30000;
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

  const chartData = generateTravelData();

  const handlePointClick = (data: ExpenditureData) => {
    setSelectedData(data);
    setIsModalOpen(true);
  };

  return (
    <>
      <ExpenditureComparisonChart
        data={chartData}
        title="旅行支出对比"
        unit="元/年/人"
        onPointClick={handlePointClick}
      />
      
      <ExpenditureDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedData}
        title="旅行支出"
        unit="元/年/人"
      />
    </>
  );
};
