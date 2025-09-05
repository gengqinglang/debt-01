
import React, { useState } from 'react';
import { ExpenditureComparisonChart, ExpenditureData } from './ExpenditureComparisonChart';
import { ExpenditureDetailModal } from './ExpenditureDetailModal';

export const SupportRecommendationContent: React.FC = () => {
  const [selectedData, setSelectedData] = useState<ExpenditureData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 生成赡养支出数据（30-85岁）
  const generateSupportData = (): ExpenditureData[] => {
    const data: ExpenditureData[] = [];
    
    for (let age = 30; age <= 85; age++) {
      let originalAmount = 30000; // 基础年支出
      let adjustedAmount = 24000; // 调整后年支出
      let familyMembers = 2; // 基础家庭人口
      
      // 根据年龄段调整数据，赡养支出在中年期较高
      if (age >= 30 && age <= 39) {
        originalAmount = 30000;
        adjustedAmount = 24000;
        familyMembers = 2;
      } else if (age >= 40 && age <= 45) {
        originalAmount = 50000;
        adjustedAmount = 37500;
        familyMembers = 3;
      } else if (age >= 46 && age <= 55) {
        originalAmount = 60000;
        adjustedAmount = 45000;
        familyMembers = 4;
      } else if (age >= 56 && age <= 65) {
        originalAmount = 40000;
        adjustedAmount = 30000;
        familyMembers = 3;
      } else if (age >= 66) {
        originalAmount = 20000;
        adjustedAmount = 15000;
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

  const chartData = generateSupportData();

  const handlePointClick = (data: ExpenditureData) => {
    setSelectedData(data);
    setIsModalOpen(true);
  };

  return (
    <>
      <ExpenditureComparisonChart
        data={chartData}
        title="赡养支出对比"
        unit="元/年/人"
        onPointClick={handlePointClick}
      />
      
      <ExpenditureDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedData}
        title="赡养支出"
        unit="元/年/人"
      />
    </>
  );
};
