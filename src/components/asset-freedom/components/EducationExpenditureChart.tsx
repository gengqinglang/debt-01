import React, { useState } from 'react';
import { ExpenditureComparisonChart, ExpenditureData } from './ExpenditureComparisonChart';
import { ExpenditureDetailModal } from './ExpenditureDetailModal';

interface EducationExpenditureChartProps {
  childName: string;
  startAge: number;
  endAge: number;
}

// 教育节点定义
const EDUCATION_STAGES = [
  { stage: '幼儿园', ageRange: [3, 6], originalAmount: 3000, adjustedAmount: 2000 },
  { stage: '小学', ageRange: [7, 12], originalAmount: 2500, adjustedAmount: 1800 },
  { stage: '初中', ageRange: [13, 15], originalAmount: 4000, adjustedAmount: 2800 },
  { stage: '高中', ageRange: [16, 18], originalAmount: 5000, adjustedAmount: 3500 },
  { stage: '大学', ageRange: [19, 22], originalAmount: 8000, adjustedAmount: 5500 },
  { stage: '研究生', ageRange: [23, 25], originalAmount: 6000, adjustedAmount: 4200 },
  { stage: '博士', ageRange: [26, 28], originalAmount: 4000, adjustedAmount: 2800 }
];

export const EducationExpenditureChart: React.FC<EducationExpenditureChartProps> = ({ 
  childName, 
  startAge, 
  endAge 
}) => {
  const [selectedData, setSelectedData] = useState<ExpenditureData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 生成教育支出数据
  const generateEducationData = (): ExpenditureData[] => {
    const data: ExpenditureData[] = [];
    
    // 确定起始教育节点
    let startStageIndex = 0;
    
    if (childName.includes('老大')) {
      // 老大从初中开始
      startStageIndex = EDUCATION_STAGES.findIndex(stage => stage.stage === '初中');
    } else if (childName.includes('老二')) {
      // 老二从幼儿园开始
      startStageIndex = 0;
    }
    
    // 根据年龄范围确定需要显示的教育节点
    const validStages = EDUCATION_STAGES.slice(startStageIndex).filter(stage => {
      const [stageStartAge, stageEndAge] = stage.ageRange;
      return stageStartAge <= endAge && stageEndAge >= startAge;
    });
    
    validStages.forEach((stage, index) => {
      data.push({
        age: startStageIndex + index, // 使用索引作为横轴数值
        stage: stage.stage, // 添加教育节点信息
        originalAmount: stage.originalAmount,
        adjustedAmount: stage.adjustedAmount,
        familyMembers: 1,
        totalFamilyExpenditure: stage.adjustedAmount
      });
    });
    
    return data;
  };

  const chartData = generateEducationData();

  const handlePointClick = (data: ExpenditureData) => {
    setSelectedData(data);
    setIsModalOpen(true);
  };

  return (
    <>
      <ExpenditureComparisonChart
        data={chartData}
        title={`${childName}教育支出对比`}
        unit="元/月"
        onPointClick={handlePointClick}
        useEducationStages={true}
      />
      
      <ExpenditureDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedData}
        title={`${childName}教育支出`}
        unit="元/月"
      />
    </>
  );
};