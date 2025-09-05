import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import RequiredLifeTotalExpenditureDisplay from '@/components/required-life/RequiredLifeTotalExpenditureDisplay';
import RequiredLifeCardFlow from '@/components/required-life/RequiredLifeCardFlow';

const RequiredLifePage = () => {
  const navigate = useNavigate();

  // 状态管理：跟踪每个tab是否已确认
  const [confirmedTabs, setConfirmedTabs] = useState<{[key: string]: boolean}>({});

  // 状态管理：自定义金额
  const [customAmounts, setCustomAmounts] = useState<{[key: string]: string}>({});

  // 状态管理：跟踪选择的选项，设置默认值（移除旅游规划）
  const [selectedSubjectLevels, setSelectedSubjectLevels] = useState<{[key: string]: string}>({
    '基础生活规划': '小康滋润版',
    '医疗保健规划': '全面守护',
    '养老规划': '舒适体验版',
    '子女教育规划': '学科投资型',
    '养房规划': '标准养房开支',
    '养车规划': '标准养车开支'
  });

  // 状态管理：教育阶段选择
  const [educationStage, setEducationStage] = useState('大学');

  // 获取optional-life的完整数据（包括总支出和详细分类）
  const getOptionalLifeData = () => {
    try {
      const savedData = localStorage.getItem('optionalLifeData');
      if (savedData) {
        const data = JSON.parse(savedData);
        console.log('Optional life data loaded:', data);
        return {
          totalAmount: data.totalAmount || 0,
          breakdown: data.breakdown || {},
          selectedModules: data.selectedModules || []
        };
      }
    } catch (error) {
      console.error('Error reading optional life data:', error);
    }
    return {
      totalAmount: 0,
      breakdown: {},
      selectedModules: []
    };
  };

  const optionalLifeData = getOptionalLifeData();

  const goToLifeTimeline = () => {
    navigate('/constraints');
  };

  const goBack = () => {
    navigate('/optional-life');
  };

  return (
    <div className="min-h-screen bg-[#F8FDF8] flex flex-col">
      <div className="relative flex flex-col bg-white/90 backdrop-blur-xl flex-1">
        {/* Premium Header - Mobile optimized */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#CCE9B5]/20 via-white/60 to-[#CCE9B5]/20">
          <div className="relative p-2 text-center flex flex-col justify-center" style={{ minHeight: '64px' }}>
            <h1 className="text-lg font-bold text-gray-900 mb-1 tracking-tight">
              选择刚需支出水平
            </h1>
            
          </div>
        </div>

        {/* Total Expenditure Display - Always show */}
        <div className="px-3 pt-3">
          <RequiredLifeTotalExpenditureDisplay 
            selectedSubjectLevels={selectedSubjectLevels}
            confirmedTabs={confirmedTabs}
            customAmounts={customAmounts}
            educationStage={educationStage}
            optionalLifeData={optionalLifeData}
          />
        </div>

        {/* 卡片流程组件 */}
        <RequiredLifeCardFlow
          selectedSubjectLevels={selectedSubjectLevels}
          setSelectedSubjectLevels={setSelectedSubjectLevels}
          confirmedTabs={confirmedTabs}
          setConfirmedTabs={setConfirmedTabs}
          customAmounts={customAmounts}
          setCustomAmounts={setCustomAmounts}
          educationStage={educationStage}
          setEducationStage={setEducationStage}
          onComplete={goToLifeTimeline}
          onBack={goBack}
        />
      </div>
    </div>
  );
};

export default RequiredLifePage;
