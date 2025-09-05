
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Clock, DollarSign, FileText, Info, Edit2 } from 'lucide-react';
import { useCareerData } from './SimplifiedCareerDataProvider';
import CareerStageEditModal from './CareerStageEditModal';

interface CareerStage {
  id: string;
  stageName: string;
  position: string;
  description: string;
  ageRange: string;
  yearlyIncome: number;
  duration: string;
}

interface CareerPredictionDisplayProps {
  personType: 'personal' | 'partner';
}

const CareerPredictionDisplay: React.FC<CareerPredictionDisplayProps> = ({ personType }) => {
  const { 
    currentJob, 
    jobLevel, 
    partnerJob, 
    partnerLevel,
    personalCurrentStatus,
    partnerCurrentStatus,
    personalCareerStages,
    partnerCareerStages,
    generatePlanForJobAndLevel,
    personalCurrentIncome,
    personalCareerOutlook,
    partnerCurrentIncome,
    partnerCareerOutlook,
    careerPlan,
    setCareerPlan,
    partnerCareerPlan,
    setPartnerCareerPlan
  } = useCareerData();

  const [editingStage, setEditingStage] = useState<CareerStage | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const job = personType === 'personal' ? currentJob : partnerJob;
  const level = personType === 'personal' ? jobLevel : partnerLevel;
  const currentStatus = personType === 'personal' ? personalCurrentStatus : partnerCurrentStatus;
  const careerStages = personType === 'personal' ? personalCareerStages : partnerCareerStages;
  const currentIncome = personType === 'personal' ? personalCurrentIncome : partnerCurrentIncome;
  const careerOutlook = personType === 'personal' ? personalCareerOutlook : partnerCareerOutlook;
  const currentCareerPlan = personType === 'personal' ? careerPlan : partnerCareerPlan;
  const setCurrentCareerPlan = personType === 'personal' ? setCareerPlan : setPartnerCareerPlan;

  // 只有在未退休状态且有职业规划时才显示预测
  const shouldShow = (currentStatus === 'not-retired' && careerStages.length > 0);
  
  if (!shouldShow || !job || !level || !currentIncome || !careerOutlook) {
    return null;
  }

  // 使用当前的 careerPlan 或生成新的
  const displayPlan = currentCareerPlan.length > 0 
    ? currentCareerPlan 
    : generatePlanForJobAndLevel(job, level, currentIncome, careerOutlook);

  const handleEditStage = (stage: CareerStage) => {
    setEditingStage(stage);
    setIsEditModalOpen(true);
  };

  const handleSaveStage = (updatedStage: CareerStage) => {
    const updatedPlan = displayPlan.map(stage => 
      stage.id === updatedStage.id ? updatedStage : stage
    );
    setCurrentCareerPlan(updatedPlan);
    setIsEditModalOpen(false);
    setEditingStage(null);
  };

  const formatIncome = (income: number) => {
    return Math.round(income / 10000) + '万/年';
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Briefcase className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">职业生涯预测</h3>
      </div>
      
      <div className="bg-[#CCE9B5]/20 p-3 rounded-lg border border-[#CCE9B5]/70 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-gray-700" />
          <span className="text-sm font-medium text-gray-800">数据来源说明</span>
        </div>
        <p className="text-xs text-gray-700">
          以下预测基于大数据分析，结合行业发展趋势、岗位晋升路径等因素生成，仅供参考
        </p>
      </div>

      <div className="space-y-3">
        {displayPlan.map((stage, index) => (
          <Card key={stage.id} className="border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between min-h-[60px]">
                {/* 左侧：数字和岗位信息 */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 rounded-full bg-[#CCE9B5]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-gray-700">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 truncate">{stage.position}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{stage.ageRange}</span>
                    </div>
                  </div>
                </div>
                
                {/* 右侧：年收入和编辑按钮 */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-gray-700 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      <span>{formatIncome(stage.yearlyIncome)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditStage(stage)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingStage && (
        <CareerStageEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingStage(null);
          }}
          stage={editingStage}
          onSave={handleSaveStage}
        />
      )}
    </div>
  );
};

export default CareerPredictionDisplay;
