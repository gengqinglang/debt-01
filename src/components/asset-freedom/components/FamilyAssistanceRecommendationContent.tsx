
import React, { useState } from 'react';
import { ExpenditureComparisonChart, ExpenditureData } from './ExpenditureComparisonChart';
import { ExpenditureDetailModal } from './ExpenditureDetailModal';

export const FamilyAssistanceRecommendationContent: React.FC = () => {
  const [selectedData, setSelectedData] = useState<ExpenditureData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 生成资助亲人支出数据（30-85岁）
  const generateFamilyAssistanceData = (): ExpenditureData[] => {
    const data: ExpenditureData[] = [];
    
    for (let age = 30; age <= 85; age++) {
      let originalAmount = 50000; // 基础年支出
      let adjustedAmount = 40000; // 调整后年支出
      let familyMembers = 2; // 基础家庭人口
      
      // 根据年龄段调整数据
      if (age >= 50 && age <= 55) {
        originalAmount = 50000;
        adjustedAmount = 40000;
        familyMembers = 3;
      } else if (age >= 60 && age <= 66) {
        originalAmount = 60000;
        adjustedAmount = 45000;
        familyMembers = 2;
      } else {
        // 其他年龄段没有资助亲人支出
        originalAmount = 0;
        adjustedAmount = 0;
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

  const chartData = generateFamilyAssistanceData();

  const handlePointClick = (data: ExpenditureData) => {
    setSelectedData(data);
    setIsModalOpen(true);
  };

  return (
    <>
      <ExpenditureComparisonChart
        data={chartData}
        title="资助亲人支出对比"
        unit="元"
        onPointClick={handlePointClick}
      />
      
      <ExpenditureDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedData}
        title="资助亲人支出"
        unit="元"
      />
    </>
  );
};
