
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

interface CareerStage {
  id: string;
  stageName: string;
  position: string;
  description: string;
  ageRange: string;
  yearlyIncome: number;
  duration: string;
}

interface CareerStageCardProps {
  stage: CareerStage;
  colorIndex: number;
}

const CareerStageCard: React.FC<CareerStageCardProps> = ({
  stage,
  colorIndex
}) => {
  // 根据colorIndex确定背景颜色，使用90%透明度
  const getCardBackgroundColor = (index: number) => {
    const colorIndex = index % 3;
    if (colorIndex === 0) return 'bg-[#A0E4E8]/90'; // 90%透明度的薄荷色系
    if (colorIndex === 1) return 'bg-[#CCE9B5]/90'; // 90%透明度的绿色系
    return 'bg-[#FFE8B3]/90'; // 90%透明度的黄色系
  };

  // 格式化收入显示
  const formatIncome = (income: number) => {
    return Math.round(income / 10000) + '万/年';
  };

  return (
    <Card 
      className={`shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl w-[160px] ${getCardBackgroundColor(colorIndex)}`}
    >
      <CardContent className="p-3 flex items-center space-x-2 min-h-[60px]">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
          <Briefcase className="w-7 h-7 text-gray-600" strokeWidth={1.2} />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="text-xs font-semibold text-gray-800 truncate mb-1">{stage.position}</div>
          <div className="text-xs font-medium text-gray-700">{formatIncome(stage.yearlyIncome)}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerStageCard;
