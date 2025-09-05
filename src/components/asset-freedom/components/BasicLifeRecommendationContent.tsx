
import React, { useState } from 'react';
import { ExpenditureComparisonChart, ExpenditureData } from './ExpenditureComparisonChart';
import { ExpenditureDetailModal } from './ExpenditureDetailModal';

export const BasicLifeRecommendationContent: React.FC = () => {
  const [selectedData, setSelectedData] = useState<ExpenditureData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 生成基础生活支出数据（30-85岁）
  const generateBasicLifeData = (): ExpenditureData[] => {
    const data: ExpenditureData[] = [];
    
    for (let age = 30; age <= 85; age++) {
      let originalAmount = 5000; // 基础月支出
      let adjustedAmount = 4000; // 调整后月支出
      let familyMembers = 2; // 基础家庭人口
      
      // 根据年龄段调整数据
      if (age >= 30 && age <= 34) {
        originalAmount = 5000;
        adjustedAmount = 4000;
        familyMembers = 2;
      } else if (age >= 40 && age <= 45) {
        originalAmount = 6000;
        adjustedAmount = 4500;
        familyMembers = 3;
      } else if (age >= 46 && age <= 55) {
        originalAmount = 8000;
        adjustedAmount = 6000;
        familyMembers = 4;
      } else if (age >= 56 && age <= 65) {
        originalAmount = 7000;
        adjustedAmount = 5500;
        familyMembers = 3;
      } else if (age >= 66) {
        originalAmount = 6000;
        adjustedAmount = 5000;
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

  const chartData = generateBasicLifeData();

  const handlePointClick = (data: ExpenditureData) => {
    setSelectedData(data);
    setIsModalOpen(true);
  };

  return (
    <>
      <ExpenditureComparisonChart
        data={chartData}
        title="基础生活支出对比"
        unit="元/月"
        onPointClick={handlePointClick}
      />
      
      <ExpenditureDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedData}
        title="基础生活支出"
        unit="元/月"
      />
    </>
  );
};
