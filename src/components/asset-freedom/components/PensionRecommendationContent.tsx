import React, { useState } from 'react';
import { ExpenditureComparisonChart, ExpenditureData } from './ExpenditureComparisonChart';
import { ExpenditureDetailModal } from './ExpenditureDetailModal';

export const PensionRecommendationContent: React.FC = () => {
  const [selectedData, setSelectedData] = useState<ExpenditureData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 生成养老支出数据（60-85岁）
  const generatePensionData = (): ExpenditureData[] => {
    const data: ExpenditureData[] = [];
    
    for (let age = 60; age <= 85; age++) {
      let originalAmount = 5000; // 基础月支出
      let adjustedAmount = 4000; // 调整后月支出
      let familyMembers = 2; // 基础家庭人口
      
      // 根据年龄段调整数据
      if (age >= 60 && age <= 64) {
        originalAmount = 4200; // 5.0万元/年/人 ÷ 12月
        adjustedAmount = 3300; // 4.0万元/年/人 ÷ 12月
        familyMembers = 2;
      } else if (age >= 65 && age <= 69) {
        originalAmount = 5000; // 6.0万元/年/人 ÷ 12月
        adjustedAmount = 3750; // 4.5万元/年/人 ÷ 12月
        familyMembers = 2;
      } else if (age >= 70 && age <= 80) {
        originalAmount = 6700; // 8.0万元/年/人 ÷ 12月
        adjustedAmount = 5000; // 6.0万元/年/人 ÷ 12月
        familyMembers = 2;
      } else if (age >= 81) {
        originalAmount = 6000;
        adjustedAmount = 4500;
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

  const chartData = generatePensionData();

  const handlePointClick = (data: ExpenditureData) => {
    setSelectedData(data);
    setIsModalOpen(true);
  };

  return (
    <>
      <ExpenditureComparisonChart
        data={chartData}
        title="养老支出对比"
        unit="元/月"
        onPointClick={handlePointClick}
      />
      
      <ExpenditureDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedData}
        title="养老支出"
        unit="元/月"
      />
    </>
  );
};